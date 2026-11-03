# 2026-Q4 Source Mapping Batch 01 — Editorial Research

Date: 2026-11-03
Status: SOURCE-MAPPED / NOT APPROVED
PR: #34 (draft, not merged)

## What was accomplished
Nine individual statements from seven federal-focused editorial briefings are linked to specific sections of IRS Publications 15, 15-A, 15-B and 15-T (2026) and DOL Fact Sheets #21 and #56A. Source checked 2026-11-03. The repository's machine-readable mapping is in `src/lib/payroll-intelligence-source-mappings.ts`.

This is a **source-location** record, not a claim-specific legal opinion. The full draft inventory remains unreviewed by a qualified payroll subject-matter expert. No publication authorizations exist.

## Mapped source sections
| Topic | Publication | Pinpoint | Caveat |
|---|---|---|---|
| Automated withholding method | IRS Publication 15-T (2026) | §1, Worksheet 1A | Withholding configuration and Form W-4 variations |
| Federal deposit schedule | IRS Publication 15 (2026) | §11, Lookback Period | Special filer and timing rules |
| Next-day tax deposit | IRS Publication 15 (2026) | §11, $100,000 Next-Day Deposit Rule | Deposit period and classification effects |
| FLSA retention | DOL Fact Sheet #21 | How Long Should Records Be Retained | Tax, state and legal-hold requirements |
| IRS worker control factors | IRS Publication 15-A (2026) | §2, Common-Law Rules | FLSA and state analyses differ |
| FLSA overtime standard | DOL Fact Sheet #56A (Dec 2019) | Opening overview | Exemptions and more protective rules |
| Regular-rate formula | DOL Fact Sheet #56A (Dec 2019) | Regular Rate; Exclusions | Fact-specific exclusion analysis |
| Fringe taxability | IRS Publication 15-B (2026) | §1, Are Fringe Benefits Taxable? | Specific exclusions |
| Health FSA salary reduction | IRS Publication 15-B (2026) | §1, Cafeteria Plans; Health FSA contribution limit | Plan years beginning in 2026 |

## Evidence integrity
- Nine mappings are tied to the **exact current draft statement** and its content-fingerprint ID. A changed statement receives a new ID and requires a new mapping.
- Every record is `source-mapped`; none is `reviewed-for-editorial-consideration`.
- No fake reviewer, tax adviser or approver is recorded.
- No effective date is inferred into the review record. Applicable periods must be determined case-by-case and then manually reviewed.
- DOL fact sheets are agency guidance, not binding regulations. The December 2019 source currency should be checked against later case law and official changes during professional review.
- Public drafts remain `noindex`; this does not constitute authentication or confidentiality.
- Full 16-candidate claim-level review, state and local overlays, international sources, human signoff, and accessibility review remain outstanding.

## Publication verdict
**HOLD.** Neither a passing CI build nor exact source mapping can authorize release.
