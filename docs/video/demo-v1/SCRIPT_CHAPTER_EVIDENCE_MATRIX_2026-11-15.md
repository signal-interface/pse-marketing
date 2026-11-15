# PSE Product Demo — Script v1.0 Chapter Evidence Matrix

**Status:** READ-ONLY SOURCE AUDIT / FOUNDER ACCEPTANCE PENDING / NO VIDEO CAPTURE
**Date:** 2026-11-15
**Accountable owner and final approval:** Tom, Founder
**Narrative source:** `docs/video/demo-v1/script.md` (eight original chapters, target 5:30–6:20)
**Recording controls:** `docs/video/demo-v1/demo-contract.yaml`, `recording-plan.md`
**Runtime source inspected:** `payroll-synergy-experts/PSE--Projects`, `frontend/apps/demo/src/{App.tsx,config.tsx,pages/Dashboard.tsx}`
**Purpose:** map the approved *script order* to actual source evidence, without rewriting the story from navigation labels.

## Chapter-level findings

| Chapter (source timing) | Source assertion | Directly inspected evidence | Status / next evidence |
| --- | --- | --- | --- |
| 1. Why PSE exists (0:00–0:40) | Branded intro, historical DOL back-wages figures and approximate one-third employer error statistic | Script contains the claims; no corresponding source validation inspected here | **CLAIMS HOLD:** substantiate numbers from primary sources. The ~one-third employer-error claim is not an approved verified statistic under closed Marketing Copy & Trust acceptance |
| 2. What PSE governs (0:40–1:20) | System of record executes, PSE independently governs, logo-supported examples | Marketing script and Demo environment labels (`Deterministic Rule Engine`, `Synthetic Scenario`) seen | **CONTENT/CLAIMS HOLD:** verify vendor logo/actual support versus conceptual compatibility; do not imply PSE processes payroll |
| 3. Upload and intake (1:20–2:00) | Upload approved `fixture.payroll_fixture`, analysis progress and completed analysis | Contract requires upload but fixture name/hash remain TBD. Current viewer menu does not expose Upload as an independent route; Dashboard source mentions upload but does not prove the interaction | **FUNCTIONAL HOLD:** founder-approved viewer-reachable intake sequence, synthetic fixture/hash, full observed upload-to-completion test |
| 4. Findings, severity and score (2:00–3:30) | Command Center → Exceptions → designated finding, counts, severity evidence and score | `/command-center` and `/exceptions` are on current viewer path; Dashboard consumes `currentRun?.findings`. Designated finding and count still TBD | **PARTIAL SOURCE SUPPORT, NO E2E:** frozen fixture counts, exact scoring labels, finding navigation and citation screenshot required |
| 5. CHAP explanation/evidence (3:30–4:30) | Ask approved question and display grounded response, citation and reasoning | `App.tsx` integrates CHAP drawer and backend client; it explicitly fails closed when unavailable; `/chap-ai` is staff-only Component Review while `/chap-home` is viewer-accessible | **FUNCTIONAL/ACCESS HOLD:** verify approved CHAP dialogue via viewer-accessible pathway, actual reachable service, source citations and human advisory boundary; question remains TBD |
| 6. Executive visibility/audit (4:30–5:20) | Executive/reporting screen then evidence/replay | `/audit-ledger` is staff-only Component Review; Demo app config has `auditExport: false`, and contract `replay.available` TBD | **FUNCTIONAL/ACCESS HOLD:** founder ratifies exact viewer-reachable evidence/replay/summary UI without presenting staff-only component as public |
| 7. Discovery process (5:20–6:00) | Narration presents questionnaire first, then meeting | Source script explicitly says questionnaire as next step; approved Marketing funnel is immediate Cal.com booking followed by optional questionnaire | **SCRIPT/COMMERCIAL CONTRADICTION:** founder approves revised conversion wording before recording. No video prerequisite for booking |
| 8. Call to action (6:00–6:20) | 'Continue to Governance Discovery' plus frozen video watermark | Source script and contract require frozen tag `demo-v1.0-frozen`; exact tag could not be resolved in prior GitHub check | **SCRIPT/RELEASE HOLD:** match booking-first CTA and signed link behavior; verify frozen tag and all manifest fields before watermark/publication |

## Evidence doctrine

- **Script first:** preserve the eight chapters and substantive intent. Navigation routes merely establish whether each live demo action can be captured. Do not substitute a five-screen menu tour for the script.
- **Source not runtime:** an imported component or route declaration does not prove the final page works, that the prospect role can use it or that citations/evidence render. Synthetic tests and founder-reviewed browser capture are required.
- **No unverified claims:** all specific figures, performance claims, vendor compatibility and payroll-risk statements need factual and product evidence. The historical 33% error assumption is not a verified figure; do not restore it through the video.
- **No false product authority:** CHAP Marketing educational widget is not CHAP Production, and staff-only Component Review is not the public Demo. No real customer or employee payroll data.
- **Release gating:** fixture/hash, exact finding, approved question, replay status, frozen tag, deterministic E2E and signed founder approval precede capture. Capture and publication are separate gates.
- **Commercial separation:** PR #85 booking-first release waits on an actual Cal.com signed webhook acceptance, not on video. Video approval is tracked separately in Issue #72.

## Founder decision register (unresolved, not presumed)

1. Confirm which viewer-accessible route/actions will execute scripted Chapters 3, 5 and 6 in the frozen Demo.
2. Accept exact fixed synthetic fixture, designation of finding, CHAP question and visible metrics for Chapter 4/5.
3. Authorize video-only factual correction of Chapter 1's unsupported error rate and Chapter 2 vendor examples if needed.
4. Approve script Chapter 7/8 booking-first CTA reconciliation (scheduling first; questionnaire optional).
5. Ratify frozen Demo release and recording/capture sequence; review final narrated MP4 and manifest separately.

**Disposition:** NOT RECORD-READY; evidence matrix prepared only. No changes to `script.md`, `demo-contract.yaml`, app source, Demo navigation, environment variables, video host or production. Tom is the final approval authority.
