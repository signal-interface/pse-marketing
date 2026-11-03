# PSE Marketing — 51-Jurisdiction Directory Usability & Publication Readiness, 2026-Q4

**Scope:** `signal-interface/pse-marketing` ONLY. PSE Core and Context Hub assessment and development are explicitly deferred to their independent build workstream. No cross-repo dependency or source transfer in this release.

## Decision and evidence

The introductory PSE Payroll Intelligence directory already includes exactly one selected official-source education topic for all 50 states and Washington, D.C. This completes the *geographic directory* but not jurisdiction-by-jurisdiction compliance certification or complete coverage across the 15 domains. All such content retains its `noindex` policy and prominent source limitations.

A marketing repository review found that the directory's presentation was broken into eight chronological batches rather than state names. The index also contained awkward punctuation and repeated generic section headings. This release replaces batch groupings with a unified alphabetical list, labeled client-side search (state name, abbreviation, topic, source pinpoint), topical filter, live result count, helpful empty result state, visible keyboard focus indicators, and links to each existing state briefing and source. Data comes from a single read-only marketing projection of the existing 51-source records; those records and underlying editorial statements are not mutated.

## Boundaries

- No PSE Core, PSE Context Hub, CHAP, worker/customer data, regulatory monitor activation or operational rule approval changes.
- Introductory source descriptions remain dated November 3, 2026 and are neither guaranteed fully current nor legally ratified employer-specific rules.
- `noindex,nofollow` remains on the index and state detail pages. No SEO flip without a separate publication-readiness decision.
- Search/filter interactions run locally in the visitor's browser; no state search query is sent to a payroll backend by this new component.
- The full 51-jurisdiction mapping is validated for unique codes, missing names, official HTTPS source links and mandatory caveats.

## Release gates and known limits

GitHub CI must pass TypeScript typecheck, source/unit/contract tests, boundary lint and Next.js production build for the exact PR head; Vercel preview must report success. Following merge, verify Vercel production READY for exact merge SHA, both apex and www PSE aliases, and check the runtime error window.

The public web reader repeatedly returned an inaccessible URL for the live directory. That inability to read the site is NOT evidence that the site is down. It also means direct browser-level HTTP, keyboard interaction, mobile layout, WCAG accessibility, visual and source-link click-through QA has **not** been independently confirmed in this environment. Source-only checks and CI provide confidence but not a substitute for full live browser QA.

## Subsequent editorial work

A separate marketing content program should pursue legal-source re-verification, effective dates and materially changed rules, state/local specificity for payroll taxes, leave, overtime, deductions and other high-value domains; decide on SEO indexability only when content and full user-visible QA are approved. The existing quarterly source research task remains proposal-only and may not automatically publish or promote payroll rules.
