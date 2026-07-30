// lib/commercial/scheduling.ts
//
// Cal.com integration (Phase 1: hosted). Scheduling is a component in
// the commercial lifecycle, not the center of it: PSE owns the lead, the
// events, and the states; Cal.com owns calendars and availability.
//
// Doctrine:
// - Webhooks require signature verification (HMAC-SHA256 of the raw
//   body, x-cal-signature-256) and idempotency via the lead_events
//   unique index on (event_type, external_id).
// - Only the external booking uid, meeting times, and meeting status are
//   stored. No attendee data beyond what the lead already provided.
// - lead_status changes only through transitionLead().
// - The leadRef in booking metadata is an attribution reference (links.ts
//   signed ref), not an authorization credential.

import crypto from "node:crypto";
import { signLeadRef, verifyLeadRef } from "./links";
import { sql } from "@vercel/postgres";

// ---------------------------------------------------------------------------
// Scheduling URL
// ---------------------------------------------------------------------------

export function schedulingConfigured(): boolean {
  return Boolean(process.env.CALCOM_EVENT_URL);
}

/**
 * Builds the prospect's scheduling link: Cal.com event URL with prefill
 * and a signed lead reference in metadata for webhook correlation.
 * Returns null when scheduling is not configured.
 */
export function buildSchedulingUrl(lead: {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}): string | null {
  const base = process.env.CALCOM_EVENT_URL;
  if (!base) return null;

  const url = new URL(base);
  const name = [lead.firstName, lead.lastName].filter(Boolean).join(" ");
  if (name) url.searchParams.set("name", name);
  url.searchParams.set("email", lead.email);
  const ref = signLeadRef(lead.id);
  if (ref) url.searchParams.set("metadata[leadRef]", ref);
  return url.toString();
}

// ---------------------------------------------------------------------------
// Webhook signature verification
// ---------------------------------------------------------------------------

export function verifyCalcomSignature(
  rawBody: string,
  signatureHeader: string | null
): boolean {
  const secret = process.env.CALCOM_WEBHOOK_SECRET;
  // Fail closed: unset secret means no webhook is trusted.
  if (!secret || !signatureHeader) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const a = Buffer.from(signatureHeader.trim().toLowerCase(), "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ---------------------------------------------------------------------------
// Payload parsing
// ---------------------------------------------------------------------------

export type CalcomTrigger =
  | "BOOKING_CREATED"
  | "BOOKING_RESCHEDULED"
  | "BOOKING_CANCELLED";

export interface CalcomBookingEvent {
  trigger: CalcomTrigger;
  bookingUid: string;
  startTime?: string;
  endTime?: string;
  attendeeEmails: string[];
  leadRef?: string;
}

const TRIGGERS: readonly string[] = [
  "BOOKING_CREATED",
  "BOOKING_RESCHEDULED",
  "BOOKING_CANCELLED",
];

export function parseCalcomEvent(body: unknown): CalcomBookingEvent | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  const trigger = record.triggerEvent;
  if (typeof trigger !== "string" || !TRIGGERS.includes(trigger)) return null;

  const payload = record.payload;
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;

  const bookingUid = typeof p.uid === "string" ? p.uid : null;
  if (!bookingUid) return null;

  const attendees = Array.isArray(p.attendees) ? p.attendees : [];
  const attendeeEmails = attendees
    .map((a) =>
      a && typeof a === "object" && typeof (a as { email?: unknown }).email === "string"
        ? ((a as { email: string }).email as string).trim().toLowerCase()
        : null
    )
    .filter((e): e is string => Boolean(e));

  const metadata =
    p.metadata && typeof p.metadata === "object"
      ? (p.metadata as Record<string, unknown>)
      : {};
  const leadRef =
    typeof metadata.leadRef === "string" ? metadata.leadRef : undefined;

  return {
    trigger: trigger as CalcomTrigger,
    bookingUid,
    startTime: typeof p.startTime === "string" ? p.startTime : undefined,
    endTime: typeof p.endTime === "string" ? p.endTime : undefined,
    attendeeEmails,
    leadRef,
  };
}

/**
 * Per-delivery idempotency key. Booking uid is unique per booking for
 * CREATED/CANCELLED (each occurs once); reschedules of one booking are
 * distinguished by the new start time.
 */
export function externalIdFor(event: CalcomBookingEvent): string {
  return event.trigger === "BOOKING_RESCHEDULED"
    ? `${event.bookingUid}:${event.startTime ?? "unknown"}`
    : event.bookingUid;
}

// ---------------------------------------------------------------------------
// Lead resolution: signed leadRef first, attendee email fallback
// ---------------------------------------------------------------------------

export async function resolveBookingLead(
  event: CalcomBookingEvent
): Promise<number | null> {
  if (event.leadRef) {
    const leadId = verifyLeadRef(event.leadRef);
    if (leadId !== null) {
      const { rows } = await sql`
        SELECT id FROM demo_requests WHERE id = ${leadId}
      `;
      if (rows.length) return leadId;
    }
  }
  for (const email of event.attendeeEmails) {
    const { rows } = await sql`
      SELECT id FROM demo_requests
      WHERE email = ${email}
      ORDER BY created_at DESC LIMIT 1
    `;
    if (rows.length) return rows[0].id as number;
  }
  return null;
}
