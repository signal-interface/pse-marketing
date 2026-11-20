# PSE marketing — controlled commercial lead reconciliation

Status: OPERATOR RUNBOOK / NOT AN ACCEPTANCE CLAIM. Updated 2026-11-03.
Owner: PSE marketing commercial operations. Scope: `signal-interface/pse-marketing` only.

## Verified acceptance so far
- Production mobile submission of the internal PSE test yielded the generic success confirmation.
- Resend reported two emails delivered at approximately 2026-11-03 23:25:36 UTC: internal demo notification and visitor acknowledgment.
- Founder-provided screenshots independently showed both in the `info@payrollsynergyexperts.com` inbox.
- These observations do **not** independently attest to the database row, event chain, questionnaire invitation, or completed follow-up. Do not confuse Resend API-accepted `EMAIL_SENT` event semantics with provider-delivered status.

## Access / safety
Use the already authorized Neon database SQL console attached to the Vercel PSE marketing production environment. Confirm account, project, environment and read-only database role before querying. Never print connection URLs, database passwords, invitation tokens, API secrets or unrelated leads. Query only the synthetic test and share redacted counts/status/event types, not names, email, provider IDs or raw event JSON.

## Read-only SQL for existing synthetic test
Run in a transaction with read-only semantics, with the exact controlled test email and company provided by the operator as **bound values**, not copied into a public report:

```sql
BEGIN READ ONLY;

SELECT id, lead_status, created_at, updated_at, source,
       video_sent_at, questionnaire_sent_at, questionnaire_completed_at,
       meeting_scheduled_at
FROM demo_requests
WHERE lower(email) = lower($1)
  AND lower(company) = lower($2)
  AND created_at >= TIMESTAMPTZ '2026-11-03 23:20:00+00'
  AND created_at <  TIMESTAMPTZ '2026-11-03 23:35:00+00'
ORDER BY created_at DESC LIMIT 3;

-- Substitute the ID returned above through a bound parameter.
SELECT event_type, actor_type, source, created_at,
       metadata->>'kind' AS email_kind,
       from_status, to_status
FROM lead_events
WHERE lead_id = $3
ORDER BY created_at, id LIMIT 60;

ROLLBACK;
```

The `$1`, `$2` and `$3` markers are bind placeholders for the executing client; in a SQL editor that does not support binding, use its secure parameter mechanism rather than pasting prospect details into shareable evidence. No updates or migrations are permitted for this acceptance step. If exactly one matching synthetic row cannot be identified, stop and reconcile using confidential local operator evidence.

Expected minimum evidence: one matching synthetic lead, `LEAD_CREATED`, two `EMAIL_SENT` or `EMAIL_FAILED` events with `kind` values `internal` and `journey`. If two `EMAIL_SENT` are present, the separate Resend delivered statuses and actual inbox screenshots complete delivery evidence. Do not infer event presence from external emails.

## Discovery handoff conflict to resolve
`/api/demo-request` sends initial acknowledgment and will only transition `NEW → VIDEO_SENT` when an overview video is configured. `src/lib/commercial/tokens.ts` excludes `NEW` from `ISSUE_ELIGIBLE_STATES`, despite lifecycle transitions permitting `NEW → QUESTIONNAIRE_SENT`. The tests explicitly assert `NEW` cannot receive a token. Consequently a no-video, newly captured lead has no proven invitation path through the existing internal issue route.

The privileged `POST /api/discovery/token/issue` is not a public browser action and must not be invoked without a verified lead ID and the existing internal authorization. It rotates outstanding invitation tokens, meaning retries must be deliberately controlled. There is no verified scheduler/dispatcher in the reviewed marketing tree. No invitation was observed in the controlled test's Resend history.

Next decision: should `NEW` be eligible for direct discovery invitation, or should another approved stage/state precede it? Confirm against the current governance and commercial path before changing token eligibility. Preserve the one-time hashed token / no raw-token storage and state-machine invariants.

## Operational acceptance criteria
1. Verify synthetic DB record and append-only events with read-only SQL.
2. Confirm video/scheduling configuration as presence/boolean only, not secret values.
3. Assign an accountable PSE commercial operator and response SLA with observable queue or daily review. Failure must not strand a durable lead.
4. Verify correct invitation issuance, recipient delivery and token/session start once authorized.
5. Verify questionnaire submission and Cal.com booking path, including webhook and follow-up outcome.
6. Keep no unrelated prospect PII in GitHub or Drive receipts; document exact PR and production SHA.
7. If any stage cannot be verified, leave it explicitly OPEN; do not treat a successful email delivery as an end-to-end conversion pass.

References: GitHub #48, #52. Production baseline `d0a1c5b4ccc2b142aeff2a3240e18e1841255bbf`. Do not overwrite Release 1 or merge draft PRs #47, #50, #51 as a side effect of this runbook.
