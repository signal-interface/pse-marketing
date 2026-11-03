# PSE Payroll Intelligence — Educational Editorial Disposition 2026-Q4

Date: 2026-11-03  
Scope: Post-launch editorial clarification (source-linked educational marketing content)  
Repository: `signal-interface/pse-marketing`  
Status: Founder-authorized editorial publication; no formal legal/tax sign-off represented.

## Decision
The 19 previously excluded nonlegal `keyPoints` statements are **resolved for educational display** as clearer, qualified notices on their parent domain pages. Resolution refers to *editorial presentation*, not independent legal verification or completion of state/country regulatory research.

| Category | Count | Public treatment |
|---|---:|---|
| Jurisdictional/applicability limitations | 15 | Scoped explanation; directs reader to controlling jurisdiction, employer/worker-specific requirements |
| Source limitations | 3 | Explicit limitations plus links to agency source (DOL historical payday page, NIST cybersecurity FAQ, IRS employment tax resource) |
| Original PSE recommendation | 1 | Explicitly labeled PSE suggested practice; not a statutory requirement |
| **Total** | **19** | **Qualified educational notices** |

## Implementation and traceability
- `src/lib/payroll-intelligence-editorial-notices.ts` attaches one human-readable editorial notice to each of the 19 excluded claim IDs. No regulatory claim is silently converted to a notice.
- `src/app/payroll-intelligence/topics/[slug]/page.tsx` displays them under **Important scope and source qualifications** on the relevant 13 domain pages.
- Three source-scope notices have direct links to authoritative reference material; those citations do not imply that the material itself creates a law.
- Regression tests assert 19 unique IDs, 15 jurisdictional / 3 source / 1 PSE recommendation, source links, and exact educational-only scope.
- The source-mapped federal briefing pages remain unchanged; no additional draft claims or 2027 tax thresholds are presented as approved.

## Verified source cautions
- The U.S. Department of Labor's state payday comparison states that it was last revised **January 1, 2023**, and recommends consulting the relevant state labor office. It is historical context, not a current state law matrix.
  https://www.dol.gov/agencies/whd/state/payday
- NIST states the Cybersecurity Framework is generally voluntary, although particular federal and contractual contexts may impose other requirements. It does not certify payroll statutory compliance.
  https://www.nist.gov/cyberframework/faqs
- IRS Publication 54 (December 2025) focuses on U.S. citizens/resident aliens abroad and cannot alone determine foreign employer payroll duties.
  https://www.irs.gov/publications/p54
- IRS employment-tax retention requirements can differ from FLSA record retention. The publicly worded notice identifies additional possible obligations without replacing statute-specific records review.
  https://www.irs.gov/businesses/small-businesses-self-employed/employment-tax-recordkeeping

## What this does not close
- Formal independent payroll SME, tax, or legal reviewer decisions remain unrecorded. The historic internal review tickets may still show OPEN for those stronger verification standards.
- Complete state/local wage law, unemployment, garnishment, disability and pay delivery coverage.
- Full country-specific payroll law, treaty and employer social insurance obligations.
- Previously noted dependency security work unrelated to this content change.
- The 2027 quarterly research/update approval process.

## Deployment controls
This PR must pass exact-head CI and preview before merge. Post-merge production must reach READY and the target page should be checked for availability. No CHAP or payroll runtime changes are authorized.
