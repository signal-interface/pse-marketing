# PSE Payroll Intelligence 2026-Q4 — Human Review Packet

Prepared: November 3, 2026  
PR: #34 — `signal-interface/pse-marketing`  
Decision: **HOLD / REVIEW REQUEST ONLY**  
Scope: Public marketing-education framework; separate from CHAP and the PSE infrastructure build.

## Review inventory
| Review workstream | Items | Decision needed |
|---|---:|---|
| Source-located draft claims | 19 | Validate entire wording, correct agency pinpoints, applicability, effective period, exceptions and revisions |
| Unmapped guidance / limitation statements | 19 | Confirm accurate labels, contextual limitations and original PSE recommendations; identify any hidden legal claim requiring escalation |
| Separate federal FICA baseline | 1 page | Independently check every number, tax year, exceptions and IRS source before approval |
| Total claims in structured briefing inventory | 38 | All 38 are currently **not reviewed by a named human** |

This is an editorial request package. Source mappings are research leads, not evidence of qualified legal review.

## Reviewer packet generation
The code `src/lib/payroll-intelligence-review-handoff.ts` deterministically produces a packet with:
- Content-linked claim ID, exact draft text and domain
- Regulatory-support vs editorial-disposition review track
- Candidate title, URL and pinpoint for mapped statements only
- Required reviewer decision question
- Null assigned reviewer, not-started decision, null review date and false release approval

Tests enforce one assignment per draft claim, complete count reconciliation, and absence of fabricated reviews. **Do not use a source-mapping count as a legal verification percentage.**

## Human reviewer worksheets

### Regulatory-support worksheet — one per each of 19 mapped claims
| Field | Required response |
|---|---|
| Claim ID / exact draft wording | Copy from deterministic review handoff |
| Source agency and exact primary authority | Verify official URL, version and section |
| Statement entirely supported? | Yes / No / Partially / Superseded |
| Legal force | Statute / Regulation / Agency interpretation / Advisory material |
| Applicable jurisdiction and worker/employer category | Specify, including exceptions |
| Effective from / until | Exact dates or explain why no fixed date applies |
| Competing or subsequent authority | Record citation and resolution |
| Final recommended wording | Original independently drafted PSE text |
| Reviewer decision | Approved for editorial consideration / Revise / Reject |
| Reviewer, date, evidence location | Real person and auditable decision reference |
| Legal/tax escalation required? | Yes / No, with rationale |

### Editorial-disposition worksheet — one per each of 19 tickets
| Field | Required response |
|---|---|
| Draft claim ID and text | Review handoff reference |
| Category | Jurisdiction limitation / Source limitation / PSE recommended control |
| Proposed public label accurate? | Yes / No |
| Does wording imply a statutory requirement? | Yes / No; escalate if yes |
| Source currency or jurisdiction gap | Describe specifically |
| Editorial rewrite required | Record final text and reason |
| Reviewer identity and decision | Actual human review only |

## Separate release controls

**Reviewer completion does not automatically release the website.** A final owner release review must still confirm exact approved SHA, content manifest, legal/tax approval where required, copyright/originality, accessible layout, mobile QA, relevant security decisions, link integrity, noindex/indexing intent, navigation and explicit merge/deployment permission.

## Known authority traps
- DOL state payday table: historical, last revised January 1, 2023; cannot stand in for current state labor department rules.
- IRS Publication 54: individual U.S. income tax abroad, not a complete country-level employer payroll guide.
- NIST CSF 2.0: voluntary security framework; not a wage/tax statute.
- IRS tax records vs FLSA records: different retention frameworks; do not substitute one for the other.
- Source-location research is not proof of legal applicability to all employers or employees.

## Current result and next action
Review packet created; approvals pending. Begin with the 19 sourced federal claims, then disposition the 19 remaining guidance/limitations. Bring a state/country scope list to establish jurisdictional depth before claiming broad coverage.

**No release, no merge, no production deployment.**
