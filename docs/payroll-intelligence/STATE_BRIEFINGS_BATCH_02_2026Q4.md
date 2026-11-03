# PSE Payroll Intelligence — State Briefings Batch 02 (2026-Q4)

**Editorial scope:** Original, official-source-cited educational marketing material only. No new operational PSE Context Hub rules, no 50-state certification, no legal/tax sign-off representation.
**Reviewed:** November 3, 2026. **Target:** `/payroll-intelligence/state-sources/{ma,or,md,va}`.
**Historical count:** 11 original limited state briefings + 4 new summaries = **15 of 51 US state/DC jurisdictions represented by one introductory topic**. This does not constitute full coverage for any of them.

| State | Topic | Official source | Key scope caution |
|---|---|---|---|
| Massachusetts | Final wages | [Mass.gov employment termination](https://www.mass.gov/info-details/massachusetts-law-about-employment-termination), M.G.L. c.149 §148 | Discharged on last day vs quit next regular payday; accrued vacation and employment-category facts |
| Oregon | Final wages | [Oregon BOLI Paychecks](https://www.oregon.gov/boli/workers/pages/paychecks.aspx), ORS 652.140(1)–(3) | Discharge next business day; quit with/without 48 hours' notice; CBA/farmworker/time-record exceptions |
| Maryland | Final wages | [Maryland DOL Termination Pay](https://www.labor.maryland.gov/labor/wagepay/wppayonterm.shtml), Wage Payment and Collection Law | Paid when wages would otherwise be due; vacation depends on policy/agreements |
| Virginia | Final wages & wage frequency | [Virginia Legislative Information System](https://law.lis.virginia.gov/vacode/title40.1/section40.1-29/), §40.1-29(B) | Final pay ordinarily on prior schedule; hourly workers at least twice monthly/biweekly, salaried monthly; statutory exceptions and 2026 amendment |

## Release checks
- `src/lib/payroll-intelligence-state-expansion.ts` owns four static educational records with agency, pinpoint, source URL, original narrative, date and caveat; explicitly `qualifiedLegalApproval:false`.
- The existing state-source index links the new records and retains the first 11; all state briefing pages are `noindex` and never claim complete jurisdictional verification.
- Typecheck, existing tests, targeted new regression suite, boundary lint, Vercel preview and full production build must pass on exact branch HEAD before merge.
- No unrelated runtime, payment system, customer payroll processing, CHAP or PSE Context Hub change is authorized.

## Following this release
Additional official-source educational batches can extend the directory, but each topic should be verified independently for changes, effective dates, employer and employee scope, local overlays and exceptions. PSE's pre-existing 51-jurisdiction final-pay seed remains unratified and separate from the public marketing education. Quarterly monitoring proposes updates only, not automatic publication.
