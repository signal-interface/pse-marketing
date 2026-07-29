# PSE Commercial Architecture Audit

Status: proposed  
Reference date: 2026-07-28

## Executive finding

The current site is a credible single-page product introduction with a functioning demo-request workflow. It is not yet a complete commercial acquisition system.

PSE should expand the site around five distinct visitor intents:

1. request a personalized sales demo;
2. watch a self-guided PSE Product Tour;
3. join the free newsletter;
4. subscribe to Context Hub;
5. request an organizational assessment.

The expansion must preserve the sales demo and must not move authenticated Context Hub or CHAP fulfillment into the marketing runtime.

## Current-state evidence

| Capability | Current state | Decision |
| --- | --- | --- |
| Sales demo | Live form, `/api/demo-request`, Postgres insert, Resend notifications, tests | Protect |
| CHAP | Public product page and feature-gated ask endpoint | Keep gated until approved corpus and operating controls are ready |
| Risk estimator | Public client-side tool | Retain as a lead-value surface |
| Product tour | Screenshot scripts exist; no public tour route | Add after demo freeze |
| Newsletter | No subscriber UI or production subscriber contract | Specify first |
| Assessment | No dedicated journey or intake contract | Specify first |
| Context Hub | No public sales page or authenticated handoff | Add public explanation only until fulfillment contract is confirmed |
| Pricing | No approved public pricing page | Gate on commercial approval |
| Security/trust | Claims exist, but no dedicated evidence page | Add only verified controls |
| Analytics | No shared event adapter | Contract required before provider selection |
| Sitemap | Apex only | Expand when routes are approved |

## Claims requiring correction or evidence

- “Nobody validates compliance” is too absolute.
- “Governed Payroll Runs” and some service copy can imply an execution role that belongs to the system of record.
- “By invitation only” conflicts with a public subscription ladder.
- Same-day or one-business-day regulatory update claims require an operating SLA and evidence.
- Connector, API, security, and automation claims must be labeled current, pilot, planned, or illustrative.
- Employer-data upload language must not appear without an approved authenticated data-handling workflow.

## Commercial architecture to adopt

- Outcome-led category positioning
- Real product evidence above the fold
- Repeated CTAs matched to visitor intent
- Self-guided tour plus personalized demo
- Product and workflow pages
- Segment-specific solution pages
- Verified trust and security evidence
- Compatibility pages for payroll platforms
- Free tools and jurisdiction resources
- Newsletter and intelligence archive
- Transparent tier comparison when commercialization is approved
- Customer evidence only with permission

## Patterns PSE will not adopt

- Payroll processing, funds movement, PEO, or employer-of-record positioning
- Autonomous changes inside customer payroll systems
- Unsupported savings, coverage, customer, or security claims
- Adversarial “replace ADP/UKG/Dayforce/Workday” positioning
- High-impact AI publication without professional approval

## Recommended release boundary

Release 1A may safely add approved navigation, footer, route shells, and a self-guided-tour entry point while preserving the current demo implementation.

Release 1B must wait for confirmation of newsletter provider, assessment routing, analytics provider, Context Hub destination, pricing, and product-truth labels.
