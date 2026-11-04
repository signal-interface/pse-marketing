# Design B — webhook-only acceptance receiver (build implementation only)

Status: **DRAFT / NOT DEPLOYED** — November 3, 2026.
Parent integration candidate: [PR #61](https://github.com/signal-interface/pse-marketing/pull/61).
Architecture decision: [Issue #55](https://github.com/signal-interface/pse-marketing/issues/55).

## Scope and boundaries

The source remains in `signal-interface/pse-marketing`; this change creates no other repository. The dedicated Vercel project, domain, database role, secrets, and provider webhook are **not provisioned by this PR**. Production and all existing marketing previews retain their deployment protections. The PSE Sales Demo fixed synthetic data and Professional runtime are untouched.

The separately authorized receiver project would use the same Git source and commit as the approved integration branch, but its build command would be:

```sh
node scripts/build-webhook-receiver.mjs
```

It requires `PSE_CALHOOK_RECEIVER_BUILD=receiver-only` and refuses the known original PSE Marketing Vercel project ID. It is restricted to Preview acceptance builds. It fails if Resend, Anthropic, internal-admin, or lead-capture application credentials are present.

During the build **in the receiver project's ephemeral build container only**, the script stages precisely:
- `src/app/api/webhooks/calendar/route.ts` (reused, unchanged)
- `src/lib/commercial/scheduling.ts` (signature validation and attributed lead matching)
- `src/lib/commercial/lifecycle.ts` (atomic booking event/status transaction)
- `src/lib/commercial/links.ts` (signed lead-reference verification)
- Minimal root layout required by Next.js

It excludes the marketing page tree, lead-capture APIs, CHAP/AI routes, internal pages, public assets, and middleware. The normal Marketing project's `npm run build` and package scripts remain unchanged. The script runs a manifest allowlist assertion after Next compilation, restores the working source tree in a `finally` block, and emits only a redacted build-evidence manifest. The CI workflow runs with **synthetic placeholder inputs only**, never production credentials.

## Security acceptance before any provisioning

1. Review the PR diff and confirm parent #61 is still the approved exact source (or rebase deliberately after upstream changes). Run both ordinary Marketing CI and the independent receiver build workflow.
2. Verify the generated Vercel output truly returns 404/403 for every route except `POST /api/webhooks/calendar`, and that HEAD, GET, OPTIONS, PUT, and other methods cannot cause writes. Do not rely exclusively on the source allowlist.
3. Create a **separate Vercel project** only with a distinct founder-approved project name and no shared application credentials. Keep it in Preview acceptance scope and set no marketing site aliases. Its webhook endpoint must use its own host.
4. Provision a least-privilege Neon role in the **existing isolated Preview Neon project**, granting only required `SELECT`/`UPDATE` on relevant `demo_requests` fields and `SELECT`/`INSERT` on `lead_events`; **no CREATE, ALTER, DROP, DELETE, INSERT leads, or cross-project rights**. Confirm the application can carry out `SELECT ... FOR UPDATE` and the append-only audit insert/returning operations. Provisioning is a separately approved database mutation.
5. Configure exactly these application credentials in the receiver project's Preview environment: `POSTGRES_URL` (restricted role), `CALCOM_WEBHOOK_SECRET`, and `LINK_SIGNING_SECRET`. Never share their values in chat, PR comments, logs, or Drive. The signing reference secret must match the protected Marketing preview's key; coordinate a rotation safely rather than copying or disclosing values.
6. No `RESEND_API_KEY`, `ANTHROPIC_API_KEY`, `INTERNAL_API_SECRET`, `NOTIFICATION_EMAIL`, or lead-capture credentials may be attached. Keep the separate project publicly reachable only after output and route-negative acceptance succeeds.
7. Before registering or enabling a Cal.com event-specific webhook, prove unsigned and invalid HMAC POST requests return 401 at the app route, and unknown paths/methods return 403/404. Then perform an authorized, controlled **Marketing-origin** lead→booking round-trip and check actual signed Cal.com `metadata.leadRef` payload and exactly one matching `MEETING_BOOKED` and `MEETING_SCHEDULED` transition in the isolated database (read-only receipt).
8. Verify duplicate, cancel, reschedule, stale-booking and DB-failure rollback behavior. Cal.com might retry 5xx; record redacted evidence and reconcile unhandled bookings. Do not send actual customer invitations during test.
9. After testing, disable the Cal.com webhook, remove the receiver's public endpoint/project and restricted DB role as approved, and remove the superseded marketing preview firewall rule. Verify production stays untouched.

## Outstanding risks

- The receiver is **not yet built in an actual newly created Vercel project**. GitHub CI proves a synthetic build, not live HTTP behavior.
- The proof of Cal.com metadata propagation requires a genuine signed event from the configured account; a crafted signature-only local test does not prove it.
- Public Cal.com booking URL may be forwarded; the existing matcher rejects signed-reference/attendee mismatch, and ambiguous unsigned matches must be manually reconciled.
- The receiver reuses existing webhook code and dependencies by design; any subsequent change to those files requires repeating the isolation/build contract test.
- This design is for controlled acceptance only; do not silently promote the second project to permanent production architecture.
