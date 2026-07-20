// lib/commercial/questionnaire.ts
//
// Save/resume questionnaire sessions.
//
// Doctrine:
// - Session start is the authorization boundary: it atomically consumes
//   the invitation token and creates the session in one transaction, so
//   the emailed token never remains a live bearer credential during a
//   multi-day questionnaire.
// - The browser holds only an opaque resume token (HTTP-only cookie);
//   its hash is stored here. No answers or lead identifiers in the cookie.
// - Answers are organizational context only. The server-side allowlist
//   below is the enforcement point for doctrine item 7: no payroll files,
//   registers, employee cases, or identifiers can pass validation.
// - Completed sessions are immediately non-editable; reopening requires
//   an explicit internal reset workflow (not built).

import crypto from "node:crypto";
import { db, sql } from "@vercel/postgres";
import { transitionLead, recordLeadEvent, type EventContext } from "./lifecycle";
import { consumeQuestionnaireToken, sha256Hex } from "./tokens";

export const SESSION_TTL_DAYS = 14;
const RESUME_EVENT_GAP_MS = 60 * 60 * 1000; // record RESUMED at most hourly

// ---------------------------------------------------------------------------
// Answers schema — server-side allowlist with hard caps
// ---------------------------------------------------------------------------

type FieldSpec =
  | { kind: "string"; maxLen: number }
  | { kind: "stringArray"; maxItems: number; maxLen: number }
  | { kind: "int"; min: number; max: number }
  | { kind: "enum"; values: readonly string[] };

const ANSWER_FIELDS: Record<string, FieldSpec> = {
  organizationSize: {
    kind: "enum",
    values: ["1-50", "51-200", "201-500", "500+"],
  },
  operatingRegions: { kind: "stringArray", maxItems: 30, maxLen: 60 },
  payrollFrequencies: {
    kind: "enum" as const,
    values: ["weekly", "biweekly", "semimonthly", "monthly", "mixed"],
  },
  hcmSystem: { kind: "string", maxLen: 100 },
  payrollProvider: { kind: "string", maxLen: 100 },
  operatingModel: {
    kind: "enum",
    values: ["internal", "outsourced", "hybrid"],
  },
  payrollTeamSize: { kind: "string", maxLen: 30 },
  topConcerns: { kind: "stringArray", maxItems: 3, maxLen: 300 },
  reportingMaturity: { kind: "int", min: 1, max: 5 },
  complianceConfidence: { kind: "int", min: 1, max: 10 },
  governanceConfidence: { kind: "int", min: 1, max: 10 },
  desiredFutureState: { kind: "string", maxLen: 2000 },
  meetingPurpose: { kind: "string", maxLen: 1000 },
};

const MAX_ANSWERS_BYTES = 16 * 1024;

export type AnswersValidation =
  | { ok: true; answers: Record<string, unknown> }
  | { ok: false; error: string };

export function validateAnswers(input: unknown): AnswersValidation {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "invalid_answers" };
  }
  const record = input as Record<string, unknown>;
  const clean: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(record)) {
    const spec = ANSWER_FIELDS[key];
    if (!spec) return { ok: false, error: `unknown_field:${key}` };
    if (value === null || value === undefined) continue;

    switch (spec.kind) {
      case "string": {
        if (typeof value !== "string" || value.length > spec.maxLen) {
          return { ok: false, error: `invalid_field:${key}` };
        }
        clean[key] = value.trim();
        break;
      }
      case "stringArray": {
        if (
          !Array.isArray(value) ||
          value.length > spec.maxItems ||
          value.some((v) => typeof v !== "string" || v.length > spec.maxLen)
        ) {
          return { ok: false, error: `invalid_field:${key}` };
        }
        clean[key] = value.map((v: string) => v.trim());
        break;
      }
      case "int": {
        if (
          typeof value !== "number" ||
          !Number.isInteger(value) ||
          value < spec.min ||
          value > spec.max
        ) {
          return { ok: false, error: `invalid_field:${key}` };
        }
        clean[key] = value;
        break;
      }
      case "enum": {
        if (typeof value !== "string" || !spec.values.includes(value)) {
          return { ok: false, error: `invalid_field:${key}` };
        }
        clean[key] = value;
        break;
      }
    }
  }

  if (JSON.stringify(clean).length > MAX_ANSWERS_BYTES) {
    return { ok: false, error: "answers_too_large" };
  }
  return { ok: true, answers: clean };
}

// ---------------------------------------------------------------------------
// Session start — consumes the invitation token
// ---------------------------------------------------------------------------

export type StartSessionResult =
  | {
      ok: true;
      /** Raw resume token — cookie value. Returned exactly once. */
      resumeToken: string;
      sessionId: number;
      leadId: number;
      expiresAt: Date;
    }
  | { ok: false; reason: "invalid_token" };

export async function startQuestionnaireSession(
  rawInvitationToken: string,
  ctx: EventContext
): Promise<StartSessionResult> {
  const resumeToken = crypto.randomBytes(32).toString("base64url");
  const resumeTokenHash = sha256Hex(resumeToken);

  const client = await db.connect();
  let started: { sessionId: number; leadId: number; expiresAt: Date } | null =
    null;
  try {
    await client.sql`BEGIN`;

    // Atomic consume — exactly one winner under concurrency. All invalid
    // reasons (unknown/expired/used/revoked) collapse to null here; the
    // route renders one safe message and may inspect for internal logging.
    const consumed = await consumeQuestionnaireToken(client, rawInvitationToken);
    if (!consumed) {
      await client.sql`ROLLBACK`;
      return { ok: false, reason: "invalid_token" };
    }

    const { rows } = await client.sql`
      INSERT INTO discovery_questionnaire_sessions
        (demo_request_id, questionnaire_token_id, resume_token_hash, expires_at)
      VALUES
        (${consumed.leadId}, ${consumed.tokenId}, ${resumeTokenHash},
         NOW() + make_interval(days => ${SESSION_TTL_DAYS}))
      RETURNING id, expires_at
    `;
    const sessionId = rows[0].id as number;
    const expiresAt = new Date(rows[0].expires_at as string);

    // Consumption event shares the transaction — token consumption and
    // session creation roll back together.
    await client.sql`
      INSERT INTO lead_events
        (lead_id, event_type, actor_type, source, request_id, metadata)
      VALUES
        (${consumed.leadId}, 'QUESTIONNAIRE_TOKEN_CONSUMED', ${ctx.actorType},
         ${ctx.source ?? null}, ${ctx.requestId ?? null},
         ${JSON.stringify({ tokenId: consumed.tokenId, sessionId })}::jsonb)
    `;

    await client.sql`COMMIT`;
    started = { sessionId, leadId: consumed.leadId, expiresAt };
  } catch (err) {
    try {
      await client.sql`ROLLBACK`;
    } catch {
      // connection-level failure; original error is what matters
    }
    throw err;
  } finally {
    client.release();
  }

  // Post-commit trail: OPENED, then the status transition. If either
  // fails the session remains valid — observability over user breakage.
  try {
    await recordLeadEvent(started.leadId, "QUESTIONNAIRE_OPENED", {
      ...ctx,
      metadata: { sessionId: started.sessionId },
    });
    await transitionLead(started.leadId, "QUESTIONNAIRE_STARTED", ctx);
  } catch (err) {
    console.error(
      `[questionnaire:${ctx.requestId ?? "?"}] post-start trail error:`,
      err
    );
  }

  return {
    ok: true,
    resumeToken,
    sessionId: started.sessionId,
    leadId: started.leadId,
    expiresAt: started.expiresAt,
  };
}

// ---------------------------------------------------------------------------
// Resume / read
// ---------------------------------------------------------------------------

export interface SessionContext {
  sessionId: number;
  leadId: number;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  answers: Record<string, unknown>;
  completed: boolean;
  expiresAt: Date;
}

export async function getSessionByResumeToken(
  rawResumeToken: string,
  ctx: EventContext
): Promise<SessionContext | null> {
  const hash = sha256Hex(rawResumeToken);
  const { rows } = await sql`
    SELECT
      s.id, s.demo_request_id, s.answers, s.completed_at, s.expires_at,
      s.last_accessed_at, d.first_name, d.last_name, d.email, d.name, d.company
    FROM discovery_questionnaire_sessions s
    JOIN demo_requests d ON d.id = s.demo_request_id
    WHERE s.resume_token_hash = ${hash} AND s.expires_at > NOW()
  `;
  if (rows.length === 0) return null;
  const row = rows[0];
  const sessionId = row.id as number;
  const leadId = row.demo_request_id as number;

  const lastAccessed = new Date(row.last_accessed_at as string);
  const staleResume =
    Date.now() - lastAccessed.getTime() > RESUME_EVENT_GAP_MS;

  await sql`
    UPDATE discovery_questionnaire_sessions
    SET last_accessed_at = NOW()
    WHERE id = ${sessionId}
  `;
  // Rate-limited resume trail — at most one RESUMED event per hour, so
  // polling or refreshes can't flood lead_events.
  if (staleResume && !row.completed_at) {
    try {
      await recordLeadEvent(leadId, "QUESTIONNAIRE_SESSION_RESUMED", {
        ...ctx,
        metadata: { sessionId },
      });
    } catch (err) {
      console.error(`[questionnaire:${ctx.requestId ?? "?"}] resume event:`, err);
    }
  }

  return {
    sessionId,
    leadId,
    firstName: (row.first_name as string) || (row.name as string) || "",
    lastName: (row.last_name as string) || "",
    email: (row.email as string) || "",
    company: (row.company as string) || "",
    answers: (row.answers as Record<string, unknown>) ?? {},
    completed: Boolean(row.completed_at),
    expiresAt: new Date(row.expires_at as string),
  };
}

// ---------------------------------------------------------------------------
// Save / submit
// ---------------------------------------------------------------------------

export type SaveResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "completed" | "invalid_answers"; detail?: string };

export async function saveSessionAnswers(
  rawResumeToken: string,
  input: unknown,
  ctx: EventContext
): Promise<SaveResult> {
  const validation = validateAnswers(input);
  if (!validation.ok) {
    return { ok: false, reason: "invalid_answers", detail: validation.error };
  }
  const hash = sha256Hex(rawResumeToken);
  // Completed sessions reject saves at the SQL level — no TOCTOU window.
  const { rows } = await sql`
    UPDATE discovery_questionnaire_sessions
    SET answers = ${JSON.stringify(validation.answers)}::jsonb,
        last_accessed_at = NOW()
    WHERE resume_token_hash = ${hash}
      AND completed_at IS NULL
      AND expires_at > NOW()
    RETURNING id, demo_request_id
  `;
  if (rows.length === 0) {
    // Distinguish for the caller without leaking to the prospect.
    const { rows: existing } = await sql`
      SELECT completed_at FROM discovery_questionnaire_sessions
      WHERE resume_token_hash = ${hash} AND expires_at > NOW()
    `;
    return {
      ok: false,
      reason: existing.length > 0 ? "completed" : "not_found",
    };
  }

  try {
    await recordLeadEvent(rows[0].demo_request_id as number, "QUESTIONNAIRE_SAVED", {
      ...ctx,
      metadata: { sessionId: rows[0].id },
    });
  } catch (err) {
    console.error(`[questionnaire:${ctx.requestId ?? "?"}] save event:`, err);
  }
  return { ok: true };
}

export type SubmitResult =
  | { ok: true; leadId: number }
  | { ok: false; reason: "not_found" | "completed" | "invalid_answers"; detail?: string };

export async function submitSession(
  rawResumeToken: string,
  input: unknown,
  ctx: EventContext
): Promise<SubmitResult> {
  const validation = validateAnswers(input);
  if (!validation.ok) {
    return { ok: false, reason: "invalid_answers", detail: validation.error };
  }
  const hash = sha256Hex(rawResumeToken);
  const { rows } = await sql`
    UPDATE discovery_questionnaire_sessions
    SET answers = ${JSON.stringify(validation.answers)}::jsonb,
        completed_at = NOW(),
        last_accessed_at = NOW()
    WHERE resume_token_hash = ${hash}
      AND completed_at IS NULL
      AND expires_at > NOW()
    RETURNING id, demo_request_id
  `;
  if (rows.length === 0) {
    const { rows: existing } = await sql`
      SELECT completed_at FROM discovery_questionnaire_sessions
      WHERE resume_token_hash = ${hash} AND expires_at > NOW()
    `;
    return {
      ok: false,
      reason: existing.length > 0 ? "completed" : "not_found",
    };
  }
  const leadId = rows[0].demo_request_id as number;
  const sessionId = rows[0].id as number;

  try {
    await recordLeadEvent(leadId, "QUESTIONNAIRE_SUBMITTED", {
      ...ctx,
      metadata: { sessionId },
    });
    await transitionLead(leadId, "QUESTIONNAIRE_COMPLETED", ctx);
  } catch (err) {
    console.error(`[questionnaire:${ctx.requestId ?? "?"}] submit trail:`, err);
  }
  return { ok: true, leadId };
}
