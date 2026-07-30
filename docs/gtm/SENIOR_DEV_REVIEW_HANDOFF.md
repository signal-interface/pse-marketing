# Senior Developer Review Handoff

Status: local review package; not pushed

## Review objective

Confirm that the PSE Commercial Foundation can expand the public acquisition system without destabilizing the active sales demo or coupling the marketing runtime to unconfirmed product infrastructure.

## Review order

1. `docs/DEMO_FREEZE_GTM_STRATEGY.md`
2. `docs/gtm/PSE_GTM_FUNNEL_SPEC.md`
3. `docs/gtm/MARKETING_PLATFORM_HANDOFFS.md`
4. `docs/gtm/CONFIRMATION_GATES.md`
5. Remaining documents in `docs/gtm`

Note: `PSE_INFORMATION_ARCHITECTURE.md`, `CHAP_COMMERCIAL_PROGRESSION.md`,
`NEWSLETTER_CONTENT_SYSTEM.md`, and `ASSESSMENT_CONVERSION_SPEC.md` are held
on branch `docs/gtm-held` pending authorization of their workstreams and are
not part of this review package.

## Repository baseline

- Base: `main` at `1487055`
- Existing demo-freeze strategy commits preserved: `3626c59`, `c651a20`
- Baseline unit tests: 17 passed
- Baseline lint: passed
- Baseline production build: passed
- No upstream write performed

## Local Release 1A validation

- Unit tests: 20 passed across 3 files
- Lint: passed with no warnings or errors
- Production build: passed; `/product-tour` generated as a static route
- Diff whitespace validation: passed
- External-reference check: no research-source brand language in `docs` or `src`
- Demo implementation: no changes to form, API route, database helper, email
  templates, or environment contract
- Browser preview: not completed in this managed runtime because Next.js dev
  startup failed while enumerating network interfaces

The preview limitation is environmental. A senior developer should still run
the responsive browser checks in Cursor or a Vercel preview before approval.

## Recommended implementation slices

### 1A — Safe public foundation

- Approved navigation and footer information architecture
- Preserve `Request a Demo` as primary organizational CTA
- Add `Watch the PSE Product Tour` entry point
- Add only approved public route content
- Fix dead anchors and sitemap coverage
- Add route/CTA contract tests

### 1B — Acquisition services

Blocked by provider and operating decisions:

- Newsletter signup
- Assessment form
- Analytics adapter
- Scheduling
- Context Hub checkout initiation

### 1C — Professional-product handoff

Blocked by receiving-repository confirmation:

- Login URL
- Signed handoff
- Entitlement vocabulary
- Assessment workspace creation
- Billing and webhook lifecycle

## Review questions

1. Confirm exact contract locations in `tomrivera-PSE/PSE--Projects`.
2. Should the unmerged demo-freeze strategy be merged before this commercial package?
3. Which current claims can be demonstrated in the frozen sales demo?
4. Should Release 1A contain route shells, or only routes with complete approved content?
5. What is the minimum analytics implementation that meets privacy requirements?
6. Who owns demo and assessment response SLAs?
7. Is Vercel Postgres migration to a native Neon integration a separate infrastructure task?
8. Which PSE core runtime is the future authenticated fulfillment surface:
   FastAPI/Jinja, the documented pnpm frontend, or another current application?
9. Which existing Replay Ledger schema is authoritative for marketing handoffs?

## Key technical risks

- `@vercel/postgres` is deprecated.
- The current lint script depends on deprecated `next lint`.
- No deployed end-to-end test suite is configured.
- No shared analytics adapter exists.
- Several service descriptions can imply an execution role reserved for the system of record.
- CHAP publication and corpus gates are not the same as commercial tier gates.
- Marketing and authenticated-product ownership can drift without versioned contracts.
- `PSE--Projects` currently documents JWT authentication and audit trails as
  planned; paid handoffs must not be enabled against POC controls.
