// lib/commercial/tokens.ts
//
// One-time discovery questionnaire invitation tokens.
//
// Doctrine:
// - Only the sha256 hash is ever stored, logged, or placed in event
//   metadata. The raw token exists exactly once: in the return value of
//   issueQuestionnaireToken(), destined for the email link
//   /discovery/start?t=<rawToken>.
// - The token resolves the lead by itself; lead IDs never ride in the URL.
// - inspectQuestionnaireToken() never consumes. Consumption happens only
//   through the atomic UPDATE primitive, invoked by session start
//   (questionnaire.ts).
// - This token authorizes first questionnaire access only. It is distinct
//   from the reusable signed video ref (links.ts) and must not be
//   repurposed for scheduling, uploads, or activation — purpose is
//   enforced at the DB.

import crypto from "node:crypto";
import { db, sql } from "@vercel/postgres";
import type { EventContext, LeadStatus } from "./lifecycle";

export const TOKEN_PURPOSE = "DISCOVERY_QUESTIONNAIRE";
export const INVITATION_TOKEN_TTL_DAYS = 7;

// Lead states eligible for token issuance (ratified). Regeneration while
// already QUESTIONNAIRE_SENT covers expiry/resend.
const ISSUE_ELIGIBLE_STATES: readonly LeadStatus[] = [
  "VIDEO_SENT",
  "VIDEO_ENGAGED",
  "QUESTIONNAIRE_SENT",
  "NURTURE",
];

export function sha256Hex(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

// ---------------------------------------------------------------------------
// Issuance
// ---------------------------------------------------------------------------

export type IssueTokenResult =
  | {
      ok: true;
      /** Returned exactly once. Never stored, logged, or re-derivable. */
      rawToken: string;
      tokenId: number;
      expiresAt: Date;
      revokedCount: number;
    }
  | { ok: false; reason: "not_found" }
  | { ok: false; reason: "ineligible_state"; state: LeadStatus };

export async function issueQuestionnaireToken(
  leadId: number,
  ctx: EventContext
): Promise<IssueTokenResult> {
  const client = await db.connect();
  try {
    await client.sql`BEGIN`;

    const { rows: leadRows } = await client.sql`
      SELECT lead_status FROM demo_requests WHERE id = ${leadId} FOR UPDATE
    `;
    if (leadRows.length === 0) {
      await client.sql`ROLLBACK`;
      return { ok: false, reason: "not_found" };
    }
    const state = leadRows[0].lead_status as LeadStatus;
    if (!ISSUE_ELIGIBLE_STATES.includes(state)) {
      await client.sql`ROLLBACK`;
      return { ok: false, reason: "ineligible_state", state };
    }

    // Revoke outstanding unused tokens for this lead + purpose (same tx).
    const { rows: revokedRows } = await client.sql`
      UPDATE discovery_questionnaire_tokens
      SET revoked_at = NOW()
      WHERE demo_request_id = ${leadId}
        AND purpose = ${TOKEN_PURPOSE}
        AND used_at IS NULL
        AND revoked_at IS NULL
      RETURNING id
    `;

    const rawToken = crypto.randomBytes(32).toString("base64url");
    const tokenHash = sha256Hex(rawToken);

    const { rows: tokenRows } = await client.sql`
      INSERT INTO discovery_questionnaire_tokens
        (demo_request_id, token_hash, purpose, expires_at, created_by, metadata)
      VALUES
        (${leadId}, ${tokenHash}, ${TOKEN_PURPOSE},
         NOW() + make_interval(days => ${INVITATION_TOKEN_TTL_DAYS}),
         ${ctx.actorId ?? ctx.actorType}, ${JSON.stringify(ctx.metadata ?? {})}::jsonb)
      RETURNING id, expires_at
    `;
    const tokenId = tokenRows[0].id as number;
    const expiresAt = new Date(tokenRows[0].expires_at as string);

    for (const revoked of revokedRows) {
      await client.sql`
        INSERT INTO lead_events
          (lead_id, event_type, actor_type, actor_id, source, request_id, metadata)
        VALUES
          (${leadId}, 'QUESTIONNAIRE_TOKEN_REVOKED', ${ctx.actorType},
           ${ctx.actorId ?? null}, ${ctx.source ?? null}, ${ctx.requestId ?? null},
           ${JSON.stringify({ tokenId: revoked.id, supersededBy: tokenId })}::jsonb)
      `;
    }

    await client.sql`
      INSERT INTO lead_events
        (lead_id, event_type, actor_type, actor_id, source, request_id, metadata)
      VALUES
        (${leadId}, 'QUESTIONNAIRE_TOKEN_ISSUED', ${ctx.actorType},
         ${ctx.actorId ?? null}, ${ctx.source ?? null}, ${ctx.requestId ?? null},
         ${JSON.stringify({ tokenId, ttlDays: INVITATION_TOKEN_TTL_DAYS })}::jsonb)
    `;

    await client.sql`COMMIT`;
    return {
      ok: true,
      rawToken,
      tokenId,
      expiresAt,
      revokedCount: revokedRows.length,
    };
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
}

// ---------------------------------------------------------------------------
// Inspection — never consumes
// ---------------------------------------------------------------------------

export type QuestionnaireTokenInspection =
  | {
      valid: true;
      leadId: number;
      firstName: string;
      company: string;
      expiresAt: Date;
      started: boolean;
    }
  | { valid: false; reason: "NOT_FOUND" | "EXPIRED" | "USED" | "REVOKED" };

export async function inspectQuestionnaireToken(
  rawToken: string
): Promise<QuestionnaireTokenInspection> {
  const tokenHash = sha256Hex(rawToken);
  const { rows } = await sql`
    SELECT
      t.id,
      t.demo_request_id,
      t.expires_at,
      t.used_at,
      t.revoked_at,
      d.first_name,
      d.name,
      d.company,
      d.lead_status
    FROM discovery_questionnaire_tokens t
    JOIN demo_requests d ON d.id = t.demo_request_id
    WHERE t.token_hash = ${tokenHash} AND t.purpose = ${TOKEN_PURPOSE}
  `;
  if (rows.length === 0) return { valid: false, reason: "NOT_FOUND" };
  const row = rows[0];
  if (row.revoked_at) return { valid: false, reason: "REVOKED" };
  if (row.used_at) return { valid: false, reason: "USED" };
  if (new Date(row.expires_at as string) <= new Date()) {
    return { valid: false, reason: "EXPIRED" };
  }
  return {
    valid: true,
    leadId: row.demo_request_id as number,
    firstName: (row.first_name as string) || (row.name as string) || "",
    company: (row.company as string) || "",
    expiresAt: new Date(row.expires_at as string),
    started: row.lead_status === "QUESTIONNAIRE_STARTED",
  };
}

// ---------------------------------------------------------------------------
// Atomic consume primitive — called only from session start
// ---------------------------------------------------------------------------
//
// Race-safe: WHERE used_at IS NULL guarantees exactly one winner under
// concurrent access. Takes a transaction client so consumption and session
// creation roll back together.

export interface ConsumedToken {
  tokenId: number;
  leadId: number;
  expiresAt: Date;
}

// Structural subset of VercelPoolClient — variance-safe for both the real
// client and test doubles.
type TxClient = {
  sql: (strings: TemplateStringsArray, ...values: any[]) => Promise<{ rows: any[] }>;
};

export async function consumeQuestionnaireToken(
  client: TxClient,
  rawToken: string
): Promise<ConsumedToken | null> {
  const tokenHash = sha256Hex(rawToken);
  const { rows } = await client.sql`
    UPDATE discovery_questionnaire_tokens
    SET used_at = NOW()
    WHERE token_hash = ${tokenHash}
      AND purpose = ${TOKEN_PURPOSE}
      AND used_at IS NULL
      AND revoked_at IS NULL
      AND expires_at > NOW()
    RETURNING id, demo_request_id, expires_at
  `;
  if (rows.length === 0) return null;
  return {
    tokenId: rows[0].id as number,
    leadId: rows[0].demo_request_id as number,
    expiresAt: new Date(rows[0].expires_at as string),
  };
}
