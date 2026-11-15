# PSE Booking-First — Webhook Exception Operator Runbook

Status: DRAFT / operational qualification required. Related: Marketing #55, #52, PR #85. This document does not activate a webhook, monitoring system, or production release.

## Scope and existing behavior
The signed calendar receiver `POST /api/webhooks/calendar` accepts known Cal.com booking events. It responds `{received:true,handled:false}` (HTTP 200) for an unresolvable lead, stale booking association, or invalid lifecycle transition. Acknowledgment avoids repeated unresolvable provider delivery; **it does not mean reconciliation succeeded**. Database errors instead return HTTP 500 for provider retry. The route uses HMAC and `applyCalendarEvent` to serialize event and status writes; `MEETING_SCHEDULED` must never be claimed solely because a meeting link exists.

## Required existing-owner handling before activation
1. Name a PSE commercial primary operator and backup; establish a one-business-day lead follow-up review from the *existing* marketing lead/event records, Cal.com bookings and provider receipts.
2. Confirm what existing application runtime logs, provider delivery attempts and lead-events can be inspected within available retention. Unmatched webhooks do not necessarily have a durable event record because lead attribution is unknown; a log line by itself is not a durable queue.
3. For a **signed and unmatched** callback, use protected provider delivery history and time-window correlation. Confirm trigger, booking UID, event type, event timestamp, attendee count and whether signed leadRef is present. Do not put attendee email, URL parameters, raw HMAC signature, lead IDs, meeting links or actual UID in GitHub/Drive.
4. Verify candidate lead uniqueness through authorized, parameterized, **read-only** access to the existing PSE Marketing database. If zero/multiple candidates or attendee mismatch, **do not** force link, downgrade a bad signed leadRef to email, reassign a booking, or change a production lead status as a workaround. Escalate to the accountable commercial operator with a redacted case reference.
5. If provider retries reflect a 500 transaction failure, inspect existing provider retry and runtime evidence, confirm exactly one effective booking event and status transition after successful retry; do not manually replay a webhook without separate authorization.
6. For cancellation/reschedule, confirm the provider booking UID and, where applicable, authenticated prior booking UID correspond to the currently associated booking; verify event recency. Stale events remain unresolved until manually assessed, not silently reassigned.
7. A second `BOOKING_CREATED` for an already `MEETING_SCHEDULED` lead with a different booking UID is a reconciliation exception. Do not automatically replace its currently linked meeting, select by most recent timestamp, or silently create a second active-booking interpretation. Confirm the actual Cal.com booking history and assign a named operator.
8. Document the disposition and follow-up ownership. **Do not close the exception based only on HTTP 200**. If a recurring unmatched-event case cannot be monitored within retention, webhook activation is NO-GO until a separately approved durable reconciliation mechanism or safe operator process exists.

## Acceptance evidence required
- One authorized synthetic example of a valid signed `metadata[leadRef]` round trip from booking URL to verified Cal.com payload, correct attendee association, one effective `MEETING_SCHEDULED` transition, event idempotency and repeat.
- At least one tested unmatched, invalid-reference, stale cancellation and database-failure recovery path; record the owner, review interval, source evidence and redacted resolution.
- Preview configured with correct event URL and matching signature/signing secrets under existing project isolation; no unreviewed production secret reuse.
- Exact commit + CI, protected preview, physical mobile acceptance, explicit founder GO and rollback evidence.

## No-go boundaries
No new Vercel project, CRM, mailing queue, webhook receiver, database schema or privilege change without separately demonstrated need. No real prospect data in synthetic test. Do not reopen closed copy work, CHAP Marketing, CHAP Production, Professional, or public video gating.

## November 15 provider-configuration evidence gate (read-only first)

**Owner and event:** Existing Cal.com account, PSE Sales Demo, event type `7766938`, 30 minutes. Use the event's Webhooks controls in the authenticated Cal.com interface; no new subscription should be created just to complete this inventory.

**Record only redacted, nonsecret evidence:**
- Whether any **event-specific** webhook is configured and enabled or disabled; whether a general account-level webhook could also apply
- Trigger selection: `BOOKING_CREATED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED`
- Delivery destination **host and route only**, without query parameters, tokens or credentials
- Selected webhook payload version/template and evidence whether the normal booking metadata is included
- Whether an HMAC secret is configured (yes/no only), header name if visible, last attempted delivery status/time if available
- Named existing commercial owner and backup, monitoring/reconciliation responsibility and log retention source

**Decision matrix:**
1. **Existing authorized event-specific receiver found:** inspect its protection and least-privilege scope before testing. Do not assume it points to PR #85 merely because a calendar event exists.
2. **No receiver configured:** preserve NO-GO for live provider reconciliation; do not create a webhook, public alias, broad Vercel bypass or separate infrastructure without a scoped founder/security decision.
3. **Receiver found but points at protected PSE Marketing Preview:** Vercel's project-wide automation bypass is not route-scoped. Do not silently enable it; keep deployment authentication and require explicit security acceptance of ingress.
4. **Provider signing absent, or payload version/template incompatible with `parseCalcomEvent`:** no real booking trial. Resolve the provider-level configuration under the same approval gate before touching PSE lead data.

**Only after authorization:** run exactly one controlled synthetic booking from the PSE-generated signed `metadata[leadRef]` link, inspect a redacted provider-signed callback and existing lead/event records, and demonstrate one correct association, one effective state transition, retry/idempotency, stale cancellation and UID-changing reschedule. Confirm optional questionnaire is not a booking prerequisite and test its recipient access separately. A `200` response containing `handled:false` is an unresolved exception, not success.

**Current read-only checkpoint:** PR #85 at `a7e791a6222151a8b03f3650a3b7ac2d347fc5de`, GitHub run `43685116723` SUCCESS, Vercel exact-head Preview READY. Current connected Cal.com integration exposes event types and bookings but **not** the webhook configuration or delivery audit. Vercel metadata verifies Preview `CALCOM_EVENT_URL` and `LINK_SIGNING_SECRET` scoped to this branch, but no branch-scoped `CALCOM_WEBHOOK_SECRET`. Its effective presence cannot be assumed from that alone. Until the Cal.com event's webhook settings are inspected, this is a **PROVIDER E2E NO-GO**; PR #62 remains paused and production unchanged.
