// POST /api/chap/ask — CHAP AI widget streaming endpoint.
//
// Flow:
//   1. Validate body (question 10–500 chars, sessionId present)
//   2. Hash IP for rate limiting + logging (privacy)
//   3. Pre-filter obvious prompt injections → synthetic out_of_scope
//   4. Rate-limit check (email gate or hard cap)
//   5. Keyword-retrieve corpus entries
//   6. Open Anthropic stream, forward deltas as SSE `chunk` events
//   7. On stream end, validate accumulated JSON, emit final SSE event
//   8. Log to chap_interactions (fire-and-forget after close)
//
// The client receives:
//   - Zero or more `{"type":"chunk","text":"..."}` events (raw stream)
//   - Exactly one `{"type":"final","response":<validated>|null}` event
//   - `[DONE]`
// or on failure, a single `{"type":"error"}` event before close.

import { NextRequest } from "next/server";
import crypto from "node:crypto";
import { sql } from "@vercel/postgres";
import { ensureChapTables } from "@/lib/db";
import {
  streamDetermination,
  MODEL,
  IP_HASH_SALT,
  containsInjectionPattern,
} from "@/lib/chapAi";
import { retrieveRelevantCorpus } from "@/lib/corpusRetrieval";
import {
  validateChapResponse,
  syntheticInjectionOutOfScope,
  type ValidatedResponse,
} from "@/lib/chapValidation";
import { checkAndIncrementRateLimit } from "@/lib/rateLimiter";

const encoder = new TextEncoder();

function sseEvent(data: object | string): Uint8Array {
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  return encoder.encode(`data: ${payload}\n\n`);
}

function hashIp(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + IP_HASH_SALT)
    .digest("hex");
}

function extractIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}

function jsonResponse(body: object, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function sseResponse(stream: ReadableStream): Response {
  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}

async function logInteraction(params: {
  sessionId: string;
  ipHash: string;
  email: string | null;
  question: string;
  response: ValidatedResponse | null;
  latencyMs: number;
}): Promise<void> {
  const { sessionId, ipHash, email, question, response, latencyMs } = params;
  const determination =
    response && response.kind === "determination"
      ? response.determination
      : null;
  try {
    await sql`
      INSERT INTO chap_interactions
        (session_id, ip_hash, email, question, response, determination, latency_ms, model_used)
      VALUES
        (${sessionId}, ${ipHash}, ${email}, ${question},
         ${JSON.stringify(response)}::jsonb, ${determination},
         ${latencyMs}, ${MODEL})
    `;
  } catch (err) {
    // Logging failure must not break the user-facing response.
    console.error("[chap/ask] interaction log error:", err);
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  // 1. Parse + validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400);
  }
  if (!body || typeof body !== "object") {
    return jsonResponse({ error: "invalid_body" }, 400);
  }
  const { question, sessionId, email } = body as {
    question?: unknown;
    sessionId?: unknown;
    email?: unknown;
  };
  if (!question || typeof question !== "string") {
    return jsonResponse({ error: "invalid_question" }, 400);
  }
  if (question.length < 10 || question.length > 500) {
    return jsonResponse({ error: "invalid_question_length" }, 400);
  }
  if (!sessionId || typeof sessionId !== "string") {
    return jsonResponse({ error: "invalid_session_id" }, 400);
  }
  const emailStr =
    typeof email === "string" && email.length > 0 ? email : null;

  // 2. IP hash
  const ipHash = hashIp(extractIp(request));

  // 3. Ensure tables exist (idempotent, safe to call per-request)
  await ensureChapTables();

  // 4. Injection pre-filter — synthesize out_of_scope, log, short-circuit.
  if (containsInjectionPattern(question)) {
    const synthetic = syntheticInjectionOutOfScope();
    await logInteraction({
      sessionId,
      ipHash,
      email: emailStr,
      question,
      response: synthetic,
      latencyMs: 0,
    });
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(
          sseEvent({ type: "final", response: synthetic })
        );
        controller.enqueue(sseEvent("[DONE]"));
        controller.close();
      },
    });
    return sseResponse(stream);
  }

  // 5. Rate limit (only counts toward the cap on allowed requests)
  const rl = await checkAndIncrementRateLimit({
    sessionId,
    ipHash,
    hasEmail: emailStr !== null,
  });
  if (!rl.allowed) {
    return jsonResponse(
      { error: rl.requiresEmail ? "email_required" : "rate_limit" },
      429
    );
  }

  // 6. Retrieve corpus (top 5 by keyword score, or all entries if zero signal)
  const retrieved = retrieveRelevantCorpus(question, 5);
  const allowedCitationIds = retrieved.map((e) => e.id);

  // 7. Open Anthropic stream + wrap into SSE ReadableStream
  const startedAt = Date.now();
  const anthropicStream = streamDetermination({
    question,
    retrievedCorpus: retrieved,
  });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let accumulated = "";
      try {
        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            const text = event.delta.text;
            accumulated += text;
            controller.enqueue(sseEvent({ type: "chunk", text }));
          }
        }

        const validated = validateChapResponse(
          accumulated,
          allowedCitationIds
        );
        controller.enqueue(
          sseEvent({ type: "final", response: validated })
        );
        controller.enqueue(sseEvent("[DONE]"));
        controller.close();

        // Fire-and-forget log after successful close.
        void logInteraction({
          sessionId,
          ipHash,
          email: emailStr,
          question,
          response: validated,
          latencyMs: Date.now() - startedAt,
        });
      } catch (err) {
        console.error("[chap/ask] stream error:", err);
        try {
          controller.enqueue(sseEvent({ type: "error" }));
          controller.close();
        } catch {
          // controller may already be closed
        }
        void logInteraction({
          sessionId,
          ipHash,
          email: emailStr,
          question,
          response: null,
          latencyMs: Date.now() - startedAt,
        });
      }
    },
  });

  return sseResponse(stream);
}
