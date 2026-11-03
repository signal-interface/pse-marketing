# PSE Payroll Intelligence — Publication-Readiness Assessment

**Assessment date:** 2026-11-03  
**Release candidate:** 2026-Q4 editorial preview  
**Repository:** signal-interface/pse-marketing  
**Pull request:** #34 (DRAFT, not approved for merge)  
**Release verdict:** **HOLD — not publication ready**

## Evidence baseline
- Previously validated head `91bb18c0e930eb8a3816ae0cf05005d0dc071935`: GitHub Actions CI #88 SUCCESS and Vercel preview SUCCESS (verified 2026-11-03). Those findings do not prove later commits pass.
- Next changes address content-register and landing-page copy. Recheck exact head SHA before considering a new verdict.
- Fifteen domains have directory pages, draft control plans and one structured draft briefing each; plus a separate 2026 FICA overview.
- There are **zero** approved regulatory articles. Domain counts are coverage counts, not regulatory completeness.
- All drafted routes are tagged `noindex` and omitted from primary navigation. This discourages search indexing; it is **not** authentication or confidential access control. Preview URL may be reachable if known.

## Primary source spot-check (2026-11-03)
| Subject | Primary authority URL | Finding | Status |
|---|---|---|---|
| 2026 FICA | https://www.irs.gov/taxtopics/tc751 | Social Security 6.2% each; Medicare 1.45% each; Social Security wage base $184,500; no Medicare wage cap; employer Additional Medicare withholding 0.9% above employee wages of $200,000 | Spot-checked only |
| 2026 health FSA | https://www.irs.gov/publications/p15b | Health FSA employee salary-reduction limit $3,400 for plan years starting in 2026; benefit and eligibility caveats remain | Spot-checked only |
| Payday frequency | https://www.dol.gov/agencies/whd/state/payday | Federal DOL table states last revised 2023-01-01 and directs readers to relevant state labor office. Do not publish as a current jurisdictional matrix | **State authority needed** |
| International tax | https://www.irs.gov/publications/p54 | Current accessible page explicitly identifies Publication 54 as 12/2025; individual U.S. tax guide only, not an employer or foreign-country payroll manual | **Foreign authority needed** |

These checks are **not** full independent legal or tax review. Other cited sources across the catalog remain unverified at claim level.

## Gate matrix
| Gate | Verdict | Required evidence before changing |
|---|---|---|
| Taxonomy and 15-domain draft coverage | PASS (scope only) | Preserve contract tests |
| Source-to-claim mapping | FAIL / incomplete | Precise official citations per claim; access/check time; authority and section |
| State/local law overlays | HOLD | State agency links, effective dates, employer/worker applicability and exceptions |
| Cross-border content | HOLD | Jurisdiction and treaties, qualified country-specific validation |
| Temporal applicability | HOLD | Individual rule effective-from/to, tax year and supersession notices |
| Editorial sign-off | HOLD | Named payroll SME, independent legal/tax escalation as appropriate, decision timestamp |
| Accessibility | NOT TESTED | Keyboard navigation, focus indication, headings, contrast, link labels, 320px/375px mobile checks |
| Security/privacy | PARTIAL | No client data connections added; dependency findings separately triaged; preview accessibility reviewed |
| Exact-head CI and Vercel | RECHECK | Passing workflow and preview for final approved SHA |
| Commercial positioning | PARTIAL | Boundary lint pass and manual legal copy check; no employer execution claims |
| Copyright and attribution | PARTIAL | Original PSE text; verify no reproduction beyond photographed subject coverage |
| Production publication approval | NOT GRANTED | Explicit owner approval, then separate merge/release decision |

## Priority remedial work
**P0**: Do not merge or enable indexing. No `Verified`, `Compliant`, `2027 law` claims without complete review.  
**P1**: Claim-level source register for each of 16 candidates; effective dates, sections, jurisdiction, caveats, reviewer and approver.  
**P1**: Verify current 2026 federal figures and qualify 2027 values as pending where not promulgated.  
**P1**: Obtain current state labor/tax agency references; DOL historical payday table is a lead, not controlling current authority.  
**P1**: Obtain a country-by-country primary-source map before characterizing international payroll obligations.  
**P2**: Complete independent mobile/accessibility and link checks, capture evidence and defect disposition.  
**P2**: Triage dependency audit findings separately, with severity, reachability and patch plan; do not run blind package upgrades.  
**P2**: Add publishable release snapshots, approved change log and correction procedure when approved content exists.

## Publication decision record
| Field | Value |
|---|---|
| Candidate | PSE-PI-2026-Q4 |
| Decision | HOLD |
| Decision basis | Regulatory, jurisdiction, and editorial verification incomplete |
| Assessment author | Automated preparatory review; not a named qualified approver |
| Payroll subject-matter reviewer | Not assigned |
| Legal/tax reviewer | Not assigned |
| Final approver | Not assigned |
| Owner authorization to merge | Not granted |
| Owner authorization to publish | Not granted |

## Quarterly cycle
The scheduled quarterly review is research and change assessment only. It is not a publishing agent, a legal approver or a substitute for interim review of material changes. The original framework quarterly update plan and release dates remain proposals, not representations that editions exist.

## Strict separation
Do not touch PSE's governing infrastructure build, payroll runtime, CHAP product architecture, client data, deployment production environment, or auth controls in this editorial PR.
