// lib/commercial/lifecycle.ts
//
// Commercial lead lifecycle for the PSE discovery workflow.
//
// Ratified doctrine (do not violate):
// - transitionLead() is the ONLY permitted writer of demo_requests.lead_status.
//   No route may UPDATE lead_status directly.
// - Every lifecycle change appends a row to lead_events inside the same
//   transaction as the status update. Status is current state; events are
//   the evidence trail.
// - First-touch timestamp columns (video_sent_at, etc.) record the FIRST
//   time a lead reached a state. Repeat occurrences (NURTURE re-entry)
//   are visible only in lead_events.

import { db, sql } from "@vercel/postgres";

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------

export const LEAD_STATUSES = [
  "NEW",
  "VIDEO_SENT",
  "VIDEO_ENGAGED",
  "QUESTIONNAIRE_SENT",
  "QUESTIONNAIRE_STARTED",
  "QUESTIONNAIRE_COMPLETED",
  "MEETING_SCHEDULED",
  "DISCOVERY_COMPLETE",
  "QUALIFIED",
  "NURTURE",
  "DISQUALIFIED",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const ACTOR_TYPES = [
  "SYSTEM",
  "PROSPECT",
  "FOUNDER",
  "TEAM_MEMBER",
  "CALENDAR_PROVIDER",
  "CRON",
] as const;

export type ActorType = (typeof ACTOR_TYPES)[number];

// event_type is enforced here (not by a DB constraint) so adding an event
// type does not require a migration.
export const LEAD_EVENT_TYPES = [
  "LEAD_CREATED",
  "STATUS_TRANSITIONED",
  "EMAIL_SENT",
  "EMAIL_FAILED",
  "VIDEO_LINK_CLICKED",
  "QUESTIONNAIRE_OPENED",
  "QUESTIONNAIRE_SAVED",
  "QUESTIONNAIRE_SUBMITTED",
  "QUESTIONNAIRE_TOKEN_ISSUED",
  "QUESTIONNAIRE_TOKEN_REVOKED",
  "QUESTIONNAIRE_TOKEN_CONSUMED",
  "QUESTIONNAIRE_SESSION_RESUMED",
  "QUESTIONNAIRE_TOKEN_EXPIRED",
  "DISCOVERY_BRIEF_GENERATED",
  "MEETING_BOOKED",
  "MEETING_RESCHEDULED",
  "MEETING_CANCELLED",
  "REMINDER_SENT",
  "QUALIFICATION_RECORDED",
] as const;

export type LeadEventType = (typeof LEAD_EVENT_TYPES)[number];

// ---------------------------------------------------------------------------
// Transition map (ratified, incl. VIDEO_SENT -> QUESTIONNAIRE_SENT and
// widened NURTURE re-entry)
//
// lead_status is NOT monotonic. NURTURE re-entry can land directly in
// QUESTIONNAIRE_COMPLETED without ever passing through
// QUESTIONNAIRE_STARTED, so any funnel report built on current state
// alone will miscount stage progression — lead_events is the
// authoritative stage history.
//
// QUALIFIED is deliberately non-terminal (Stage C ruling): deals stall
// and champions leave, and a qualified lead that can never move to
// NURTURE or DISQUALIFIED freezes and permanently overstates the
// funnel. DISQUALIFIED is the only terminal state.
// ---------------------------------------------------------------------------

export const TRANSITIONS: Record<LeadStatus, readonly LeadStatus[]> = {
  NEW: ["VIDEO_SENT", "DISQUALIFIED"],
  VIDEO_SENT: [
    "VIDEO_ENGAGED",
    "QUESTIONNAIRE_SENT",
    "NURTURE",
    "DISQUALIFIED",
  ],
  VIDEO_ENGAGED: ["QUESTIONNAIRE_SENT", "NURTURE", "DISQUALIFIED"],
  QUESTIONNAIRE_SENT: [
    "QUESTIONNAIRE_STARTED",
    "QUESTIONNAIRE_COMPLETED",
    "NURTURE",
    "DISQUALIFIED",
  ],
  QUESTIONNAIRE_STARTED: [
    "QUESTIONNAIRE_COMPLETED",
    "NURTURE",
    "DISQUALIFIED",
  ],
  QUESTIONNAIRE_COMPLETED: ["MEETING_SCHEDULED", "NURTURE", "DISQUALIFIED"],
  MEETING_SCHEDULED: ["DISCOVERY_COMPLETE", "NURTURE", "DISQUALIFIED"],
  DISCOVERY_COMPLETE: ["QUALIFIED", "NURTURE", "DISQUALIFIED"],
  NURTURE: [
    "VIDEO_ENGAGED",
    "QUESTIONNAIRE_SENT",
    "QUESTIONNAIRE_STARTED",
    "QUESTIONNAIRE_COMPLETED",
    "MEETING_SCHEDULED",
    "DISQUALIFIED",
  ],
  QUALIFIED: ["NURTURE", "DISQUALIFIED"],
  DISQUALIFIED: [],
};

export function canTransition(from: LeadStatus, to: LeadStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

// First-touch timestamp columns set when a state is first reached.
// Keys are target states; values are demo_requests column names.
// Column names are compile-time constants from this map — never
// caller-supplied — so interpolation into SQL below is safe.
const FIRST_TOUCH_COLUMNS: Partial<Record<LeadStatus, string>> = {
  VIDEO_SENT: "video_sent_at",
  VIDEO_ENGAGED: "video_clicked_at",
  QUESTIONNAIRE_SENT: "questionnaire_sent_at",
  QUESTIONNAIRE_COMPLETED: "questionnaire_completed_at",
  MEETING_SCHEDULED: "meeting_scheduled_at",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EventContext {
  actorType: ActorType;
  actorId?: string;
  /** Originating surface, e.g. 'api/demo-request', 'api/webhooks/calendar'. */
  source?: string;
  /** Correlates events from one inbound request. */
  requestId?: string;
  /**
   * Provider-side unique id for idempotency (e.g. Cal.com per-delivery
   * event id — NOT the booking id). Duplicate (event_type, external_id)
   * pairs are rejected by a unique index; see recordLeadEvent.
   */
  externalId?: string;
  metadata?: Record<string, unknown>;
}

export type TransitionResult =
  | { ok: true; leadId: number; from: LeadStatus; to: LeadStatus; noop: false }
  | { ok: true; leadId: number; from: LeadStatus; to: LeadStatus; noop: true }
  | { ok: false; reason: "not_found"; leadId: number }
  | {
      ok: false;
      reason: "invalid_transition";
      leadId: number;
      from: LeadStatus;
      to: LeadStatus;
    };

// ---------------------------------------------------------------------------
// transitionLead — the only permitted lead_status writer
// ---------------------------------------------------------------------------

export async function transitionLead(
  leadId: number,
  to: LeadStatus,
  ctx: EventContext
): Promise<TransitionResult> {
  const client = await db.connect();
  try {
    await client.sql`BEGIN`;

    // Lock the row so concurrent transitions serialize.
    const { rows } = await client.sql`
      SELECT lead_status FROM demo_requests WHERE id = ${leadId} FOR UPDATE
    `;

    if (rows.length === 0) {
      await client.sql`ROLLBACK`;
      return { ok: false, reason: "not_found", leadId };
    }

    const from = rows[0].lead_status as LeadStatus;

    // Idempotent no-op: re-applying the current state succeeds without a
    // write. Lets webhook/cron retries stay safe.
    if (from === to) {
      await client.sql`ROLLBACK`;
      return { ok: true, leadId, from, to, noop: true };
    }

    if (!canTransition(from, to)) {
      await client.sql`ROLLBACK`;
      return { ok: false, reason: "invalid_transition", leadId, from, to };
    }

    const firstTouchColumn = FIRST_TOUCH_COLUMNS[to];
    if (firstTouchColumn) {
      // COALESCE preserves the first-touch semantic on re-entry.
      await client.query(
        `UPDATE demo_requests
         SET lead_status = $1,
             updated_at = NOW(),
             ${firstTouchColumn} = COALESCE(${firstTouchColumn}, NOW())
         WHERE id = $2`,
        [to, leadId]
      );
    } else {
      await client.sql`
        UPDATE demo_requests
        SET lead_status = ${to}, updated_at = NOW()
        WHERE id = ${leadId}
      `;
    }

    await client.sql`
      INSERT INTO lead_events
        (lead_id, event_type, from_status, to_status,
         actor_type, actor_id, source, request_id, external_id, metadata)
      VALUES
        (${leadId}, 'STATUS_TRANSITIONED', ${from}, ${to},
         ${ctx.actorType}, ${ctx.actorId ?? null}, ${ctx.source ?? null},
         ${ctx.requestId ?? null}, ${ctx.externalId ?? null},
         ${JSON.stringify(ctx.metadata ?? {})}::jsonb)
    `;

    await client.sql`COMMIT`;
    return { ok: true, leadId, from, to, noop: false };
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
// recordLeadEvent — non-transition events (emails, opens, saves, reminders)
// ---------------------------------------------------------------------------

export type RecordEventResult =
  | { ok: true; eventId: number }
  | { ok: false; reason: "duplicate_external_id" };

export async function recordLeadEvent(
  leadId: number,
  eventType: LeadEventType,
  ctx: EventContext
): Promise<RecordEventResult> {
  // ON CONFLICT targets the partial unique index on (event_type, external_id)
  // — duplicate provider deliveries no-op instead of throwing.
  const { rows } = await sql`
    INSERT INTO lead_events
      (lead_id, event_type, actor_type, actor_id, source,
       request_id, external_id, metadata)
    VALUES
      (${leadId}, ${eventType}, ${ctx.actorType}, ${ctx.actorId ?? null},
       ${ctx.source ?? null}, ${ctx.requestId ?? null},
       ${ctx.externalId ?? null}, ${JSON.stringify(ctx.metadata ?? {})}::jsonb)
    ON CONFLICT (event_type, external_id) WHERE external_id IS NOT NULL
    DO NOTHING
    RETURNING id
  `;

  if (rows.length === 0) {
    return { ok: false, reason: "duplicate_external_id" };
  }
  return { ok: true, eventId: rows[0].id as number };
}

// ---------------------------------------------------------------------------
// Email domain classification (soft-flag doctrine; disposable detection is a
// separate concern and lives in qualification.ts when built)
// ---------------------------------------------------------------------------

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "ymail.com",
  "aol.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "gmx.net",
  "mail.com",
  "zoho.com",
]);

export type EmailDomainType = "WORK" | "FREE" | "UNKNOWN";

export function classifyEmailDomain(email: string): EmailDomainType {
  const at = email.lastIndexOf("@");
  if (at === -1) return "UNKNOWN";
  const domain = email.slice(at + 1).trim().toLowerCase();
  if (!domain.includes(".")) return "UNKNOWN";
  return FREE_EMAIL_DOMAINS.has(domain) ? "FREE" : "WORK";
}

// ---------------------------------------------------------------------------
// createLeadWithEvent — atomic lead creation + LEAD_CREATED
// ---------------------------------------------------------------------------
//
// Lead insert and its LEAD_CREATED event share one transaction and one
// connection. New writes use separated name fields; legacy `name` is
// populated with the formatted combination only while existing readers
// depend on it (removal is a later migration task).

export interface CreateLeadInput {
  firstName: string;
  lastName?: string;
  /** Already normalized (trimmed, lowercased) by the caller. */
  email: string;
  company: string;
  jobTitle: string;
  employees: string;
  source: string;
  emailDomainType: EmailDomainType;
}

export async function createLeadWithEvent(
  input: CreateLeadInput,
  ctx: EventContext
): Promise<{ id: number }> {
  const legacyName = [input.firstName, input.lastName]
    .filter(Boolean)
    .join(" ");

  const client = await db.connect();
  try {
    await client.sql`BEGIN`;

    const { rows } = await client.sql`
      INSERT INTO demo_requests
        (name, first_name, last_name, email, company, job_title,
         employees, source, email_domain_type, lead_status)
      VALUES
        (${legacyName}, ${input.firstName}, ${input.lastName ?? null},
         ${input.email}, ${input.company}, ${input.jobTitle},
         ${input.employees}, ${input.source}, ${input.emailDomainType},
         'NEW')
      RETURNING id
    `;
    const id = rows[0].id as number;

    await client.sql`
      INSERT INTO lead_events
        (lead_id, event_type, to_status, actor_type, actor_id,
         source, request_id, external_id, metadata)
      VALUES
        (${id}, 'LEAD_CREATED', 'NEW', ${ctx.actorType},
         ${ctx.actorId ?? null}, ${ctx.source ?? null},
         ${ctx.requestId ?? null}, ${ctx.externalId ?? null},
         ${JSON.stringify(ctx.metadata ?? {})}::jsonb)
    `;

    await client.sql`COMMIT`;
    return { id };
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
