# Confirmation Gates

Status: open decisions for product owner

These gates prevent the commercial expansion from interfering with the active sales demo or binding the wrong runtime.

## May proceed locally without external confirmation

- Documentation and acceptance criteria
- Route and navigation prototypes that do not replace live paths
- Copy audit and current/pilot/planned labeling
- Unit tests for CTA and route contracts
- Local build and responsive review
- Product-tour prototype using approved screenshots
- Sitemap updates for approved public routes

## Product-owner confirmation required

| Decision | Why it blocks |
| --- | --- |
| Contract placement within `tomrivera-PSE/PSE--Projects` | Repository is confirmed; senior developer must approve exact zones and owners |
| Canonical professional-app URL | Required for Login and Context Hub handoff |
| Public pricing and tier names | Commercial and fulfillment promise |
| Assessment names, scope, price, and owner | Prevents unfulfillable offers |
| Product-tour content and demo-freeze tag | Prevents screenshots from drifting from live demo |
| Current / pilot / planned capability labels | Controls product truth |
| Claims and statistics approval | Controls legal and credibility risk |
| Customer logos, quotes, and metrics | Requires evidence and permission |

## Technical/service confirmation required

| Integration | Required confirmation |
| --- | --- |
| Newsletter | Provider, sender domain, consent text, double opt-in, segmentation, retention |
| Analytics | Provider, consent behavior, event adapter, privacy disclosure |
| Checkout | Billing provider, product/price IDs, webhook owner, proration, failure recovery |
| Assessment routing | Inbox or CRM, owner, response SLA, lifecycle stages |
| Scheduling | Tool, calendar owner, availability, cancellation behavior |
| Professional handoff | Signing secret/key management, allowed return URLs, replay protection |
| Security page | Verified controls and named evidence owner |

## Live demo change-control gate

Any pull request touching these paths requires explicit demo regression evidence:

```text
src/components/forms/DemoRequestForm.tsx
src/app/api/demo-request/route.ts
src/app/api/demo-request/__tests__/route.test.ts
src/lib/db.ts
src/lib/emails.ts
.env.example
```

Required evidence:

- existing unit tests pass;
- production build passes;
- form renders on desktop and mobile;
- request source is preserved;
- database insert is verified in preview or staging;
- internal notification and auto-response are verified;
- failure behavior is documented;
- rollback commit is identified.

Production database, Resend, Vercel environment, DNS, or live notification tests must not run without explicit authorization.

## PSE--Projects production-readiness gate

The current PSE core repository documents several controls as planned rather
than production-ready. Context Hub checkout, Login, or Assessment Workspace
handoffs remain blocked until the receiving runtime confirms:

- production authentication and session management;
- tenant and user identity model;
- entitlement enforcement;
- production TLS and secret management;
- append-only audit or Replay Ledger emission;
- privacy and retention behavior;
- idempotent handoff acceptance and replay protection;
- staging environment and rollback path.
