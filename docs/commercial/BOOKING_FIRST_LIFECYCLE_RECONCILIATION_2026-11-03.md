# Booking-first integration: lifecycle reconciliation and release gate
Status: design and read-only findings, 2026-11-03. Not a deployment approval.

## Authority and evidence
- Marketing code is `signal-interface/pse-marketing`. Synthetic Sales Demo is governed by `payroll-synergy-experts/PSE--Projects`. Professional is out of scope.
- PSE Cal.com event publicly available at `https://cal.com/tom-rivera-okxdaw/30min`. User screenshots show successful direct booking on Nov 5, 2026, 09:30–10:00 EST, PSE Google Calendar event, and Meet link. **This did not originate from Marketing** and cannot prove lead attribution or webhook delivery.
- Preview-only `CALCOM_EVENT_URL` has been created for branch `feat/marketing-booking-first-20261103` (PR #56). This does not alter production. Redeploy of that preview, environment propagation and form/booking testing remain separate checks.

## Critical state-machine conflict
The approved booking-first journey is:
lead capture (NEW or VIDEO_SENT) -> MEETING_SCHEDULED -> optional questionnaire / scenario preference -> live fixed synthetic-data demo.

Current `src/lib/commercial/lifecycle.ts`:
- `NEW -> MEETING_SCHEDULED` allowed.
- `VIDEO_SENT -> MEETING_SCHEDULED` **not allowed**.
- `VIDEO_ENGAGED -> MEETING_SCHEDULED` **not allowed**.
- `MEETING_SCHEDULED -> QUESTIONNAIRE_SENT/STARTED/COMPLETED` **not allowed**.
- `QUESTIONNAIRE_SENT -> MEETING_SCHEDULED` **not allowed**.
- `QUESTIONNAIRE_STARTED -> MEETING_SCHEDULED` **not allowed**.
- `QUESTIONNAIRE_COMPLETED -> MEETING_SCHEDULED` allowed.

Thus a real booking's webhook may append MEETING_BOOKED and set calendar_event_id, but a rejected transition can leave lead_status inconsistent. Current webhook only warns of this rejection. A pre-call questionnaire cannot reliably follow a booked event through the current state machine. Do not fix by directly mutating `lead_status`; its sole writer is `transitionLead()`. Do not claim all post-booking paths work.

## Webhook / attribution risks
- Existing webhook path: `POST /api/webhooks/calendar` with HMAC signature in `x-cal-signature-256` and configured `CALCOM_WEBHOOK_SECRET`.
- `buildSchedulingUrl` adds `metadata[leadRef]` only when `LINK_SIGNING_SECRET` is configured. The Cal.com documentation has not been established to guarantee query-string metadata carries through to webhook `payload.metadata.leadRef`. Verify with an actual signed, non-sensitive test payload.
- `resolveBookingLead` falls back to most recent lead matching attendee email. This must be tested for repeat contact/collision; do not falsely claim deterministic attribution from a booking URL alone.
- Missing webhook secret fails signature validation closed; ensure both provider webhook and Marketing environment are correctly provisioned before test.
- Token issuance endpoint currently excludes `NEW`, and completed sessions lock answers. Pre-call questionnaire state handling must preserve signed, one-use token, safe save/resume and non-editability.

## Decision / acceptance
1. Design an explicit booking-first lifecycle that accepts meeting creation from every approved pre-booking state and maintains a persistent meeting record without losing questionnaire progress. Decide whether to keep lead_status=MEETING_SCHEDULED during optional post-booking questionnaire, using `lead_events` and session data for progress, rather than illegally regressing status. Review as ratified architecture change.
2. Ensure webhook signature validation, event uniqueness, state transitions and retry behavior are tested across NEW, VIDEO_SENT, VIDEO_ENGAGED, QUESTIONNAIRE_SENT/STARTED/COMPLETED and NURTURE.
3. Confirm `CALCOM_EVENT_URL`, `LINK_SIGNING_SECRET`, `CALCOM_WEBHOOK_SECRET` **presence only** in production. No credential disclosure.
4. From a controlled brand-new Marketing test lead, book using the returned link and verify the booking/Google Meet and exact DB/event correlation. Do not infer success from Cal.com-only booking.
5. Verify the optional questionnaire and approved default General PSE overview selection after booking; no new synthetic payroll data or Professional dependency.
6. Exact-head tests, CI, preview mobile/accessibility and founder-approved release. Keep PR #56 and #54 independently reviewable and no merges until the integrated contract is reconciled.
