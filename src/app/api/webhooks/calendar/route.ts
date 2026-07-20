// POST /api/webhooks/calendar — Cal.com booking webhook.
//
// Verified (HMAC of raw body), idempotent (per-delivery external_id
// against the lead_events unique index), and lifecycle-integrated:
//
//   BOOKING_CREATED     → MEETING_BOOKED event, calendar_event_id set,
//                         transition → MEETING_SCHEDULED
//   BOOKING_RESCHEDULED → MEETING_RESCHEDULED event (status unchanged)
//   BOOKING_CANCELLED   → MEETING_CANCELLED event,
//                         transition MEETING_SCHEDULED → NURTURE
//
// Failure posture: unresolvable leads and duplicate deliveries return
// 200 so Cal.com stops retrying; only signature failures return 401 and
// malformed payloads 400. Stored data: booking uid, meeting times,
// status — nothing else.

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import {
  verifyCalcomSignature,
  parseCalcomEvent,
  externalIdFor,
  resolveBookingLead,
} from "@/lib/commercial/scheduling";
import { transitionLead, recordLeadEvent } from "@/lib/commercial/lifecycle";

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-cal-signature-256");
    if (!verifyCalcomSignature(rawBody, signature)) {
      return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
    }

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    const event = parseCalcomEvent(body);
    if (!event) {
      // Signed but unrecognized trigger/shape — acknowledge, don't retry.
      return NextResponse.json({ received: true, handled: false });
    }

    const leadId = await resolveBookingLead(event);
    if (leadId === null) {
      console.warn(
        `[calendar-webhook:${requestId}] unresolvable booking ${event.bookingUid} (${event.trigger})`
      );
      return NextResponse.json({ received: true, handled: false });
    }

    const ctx = {
      actorType: "CALENDAR_PROVIDER" as const,
      source: "api/webhooks/calendar",
      requestId,
      externalId: externalIdFor(event),
      metadata: {
        bookingUid: event.bookingUid,
        startTime: event.startTime,
        endTime: event.endTime,
      },
    };

    const eventType =
      event.trigger === "BOOKING_CREATED"
        ? ("MEETING_BOOKED" as const)
        : event.trigger === "BOOKING_RESCHEDULED"
          ? ("MEETING_RESCHEDULED" as const)
          : ("MEETING_CANCELLED" as const);

    const recorded = await recordLeadEvent(leadId, eventType, ctx);
    if (!recorded.ok) {
      // Duplicate delivery — already processed. Idempotent success.
      return NextResponse.json({ received: true, duplicate: true });
    }

    if (event.trigger === "BOOKING_CREATED") {
      // calendar_event_id is reference data, not lifecycle state.
      await sql`
        UPDATE demo_requests
        SET calendar_event_id = ${event.bookingUid}, updated_at = NOW()
        WHERE id = ${leadId}
      `;
      await transitionLead(leadId, "MEETING_SCHEDULED", {
        actorType: "CALENDAR_PROVIDER",
        source: "api/webhooks/calendar",
        requestId,
        metadata: { bookingUid: event.bookingUid },
      });
    } else if (event.trigger === "BOOKING_CANCELLED") {
      await transitionLead(leadId, "NURTURE", {
        actorType: "CALENDAR_PROVIDER",
        source: "api/webhooks/calendar",
        requestId,
        metadata: { bookingUid: event.bookingUid, reason: "booking_cancelled" },
      });
    }
    // RESCHEDULED: event recorded; status stays MEETING_SCHEDULED.

    return NextResponse.json({ received: true, handled: true });
  } catch (error) {
    console.error(`[calendar-webhook:${requestId}] error:`, error);
    // 500 → Cal.com retries; safe because processing is idempotent.
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
