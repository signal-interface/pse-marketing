# PSE Demo Video — Viewer Walkthrough Contract Reconciliation (Proposal Only)

**Status:** PROPOSED / NOT FROZEN / NO RECORDING / NO PUBLICATION  
**Date:** 2026-11-15  
**Marketing authority:** `signal-interface/pse-marketing` `docs/video/demo-v1`  
**Application authority:** `payroll-synergy-experts/PSE--Projects` `frontend/apps/demo/src/{config.tsx,App.tsx}`  
**Related issues:** Marketing #72 (video gate), #55 (commercial booking-first), Marketing PR #85 (draft)

## Source findings

The current application navigation in `frontend/apps/demo/src/config.tsx` defines the public viewer walkthrough as:

1. Dashboard — `/dashboard`
2. CHAP Home — `/chap-home`
3. Command Center — `/command-center`
4. Exceptions — `/exceptions`
5. Final Pay — `/final-pay`

Other areas, including `/chap-ai`, Operations Hub, Audit Ledger and Payroll Detail, reside under **Component Review**, subject to the `manage:users` staff permission. `App.tsx` retains a development-gated trailer and default-deny Readiness beta routes. This is a *source navigation declaration*, not visual or E2E acceptance of every listed screen.

The current marketing `docs/video/demo-v1/demo-contract.yaml` instead requires **Upload, Command Center, Findings, CHAP, Executive Summary**. `recording-plan.md` requires an upload of an approved fixture and independent findings-count, CHAP citation, replay and executive/reporting assertions. Its freeze-dependent fixture hash, expected findings and selected question remain TBD. The required `demo-v1.0-frozen` Git ref did not resolve during the 2026-11-15 review. These claims and screens cannot be assumed ready.

## Proposed viewer-aligned sequence — for Demo owner acceptance, NOT a replacement contract

| Proposed scene | Viewer route | Claim allowed before evidence | Required owner evidence before recording |
| --- | --- | --- | --- |
| 1. Synthetic environment and executive orientation | `/dashboard` | Clearly labeled synthetic scenario and governance overview | Authenticated viewer render, dataset provenance, visible labels |
| 2. CHAP Home — explain the current review | `/chap-home` | Explain run-derived outcomes without claiming CHAP Marketing or CHAP Production integration | Owner-approved CHAP content and permission boundary, no hallucinated or ungrounded answer |
| 3. Control / payroll readiness story | `/command-center` | Show available readiness controls as they actually render | Frozen result/state, source fixture and exact visible UI assertion |
| 4. Review an exception | `/exceptions` | Demonstrate governed inspection with no claim PSE executes payroll | Deterministic synthetic finding, approved click path and status labels |
| 5. Final Pay and executive takeaway | `/final-pay` | Explain only the accepted scenario shown on screen, then display a separate marketing CTA card | Viewer-accessible UI and accepted fixed-data behavior; no invented processing or compliance outcome |

**Important:** The five routes above are candidates for a revised *recording sequence*, not proof that any current route is visually accepted or ready to publish. The Demo owner must verify each route and may reject/reorder scenes. Do not represent staff-only `Component Review`, product beta or Dev trailer routes as prospect-accessible features.

## Reconciliation to the existing contract

- **Upload / ingest:** do not include in prospect footage unless independently demonstrated and accepted on a viewer-accessible route; the old `upload.required: true` is a proposal for reconsideration, not silently removed from the canonical contract.
- **Findings:** the currently proposed Exceptions scene requires owner acceptance that the exact synthetic finding opens and has traceable evidence; don't imply a separate Findings destination is public.
- **CHAP:** current `/chap-home` is not the same as staff-only `/chap-ai`; require owner acceptance of its run-derived story and explanation safety before mentioning citations or statutory interpretation.
- **Executive Summary / replay / audit:** do not show hidden or inaccessible screens; a standalone narrative CTA card is *marketing composition*, not evidence of a public Executive Summary product route.
- **Fixture / counts / scores / evidence:** continue to mark them unverified until the Demo freeze provides fixture hash, exact scenario output, visible counts, approved question (if any), and deterministic assertions. Do not fabricate values.

## Required gated execution (owner approval before contract edit)

1. Demo owner independently tests current viewer role navigation, functionality, synthetic dataset and CHAP Home presentation, recording redacted screenshots/evidence for each scene. Follow the accepted Demo admin-to-professional component promotion gates separately; this video does not authorize a component promotion.
2. Owner approves a specific recording route map and wording. Only then propose changes to `demo-contract.yaml`, `recording-plan.md`, storyboard, narration and manifest in one reviewed Marketing PR.
3. Pass Stage-3 manual E2E, deck reconciliation, frozen fixture/manifest and actual deployed Demo acceptance; create/verify `demo-v1.0-frozen` release tag **in PSE--Projects** only after authorized release freeze.
4. Marketing records the immutable Demo commit/tag, approved routes, assertion results, fixture hashes, screen captures and content claims; Playwright capture must run against the frozen release and fail on wrong UI or data.
5. Human-review MP4 + manifest + approval record. Only after explicit founder approval host the asset, populate `PSE_OVERVIEW_VIDEO_URL`, and run non-submitting mobile/accessibility truth checks. No customer payroll data or production CHAP embedding.

## Independence and prohibitions

- Booking-first Marketing PR #85 still gates on a real signed Cal.com webhook round-trip; this **video is optional** and must not block scheduling or direct questionnaire invitation.
- Do not mutate the PSE Demo app, introduce a recording tool or video host, create a freeze tag, publish screenshots/video, enable `PSE_OVERVIEW_VIDEO_URL`, alter CHAP Marketing, modify Professional or change production as part of this proposal.
- Keep existing `demo-v1` package and freeze-dependent values intact until accepted. This proposal is review context, not a replacement source of product truth.
