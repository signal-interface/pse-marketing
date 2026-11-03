# PSE Payroll Intelligence — State Source Intake and Governance Plan (2026-Q4)

**Date:** 2026-11-03  
**Purpose:** Begin state-source research after archiving the complete federal framework conversation in the PSE Marketing Google Drive folder.  
**Status:** RESEARCH INTAKE ONLY; no state regulatory content is independently approved for public publication, and no PSE runtime or payroll calculations change.

## Baseline established

A typed state source intake now covers eleven jurisdictions: NY, NJ, CT, CA, WA, IL, CO, FL, GA, PA, TX. Each includes a single selected wage-payroll topic as an initial agency source anchor. These are **not full state compliance profiles**. Source locations were checked on 2026-11-03, but dates, authority currency, exceptions, employer applicability, local laws and cross-topic coverage remain to be adjudicated. The source registry lives at `src/lib/payroll-intelligence-state-research.ts` with fail-closed tests.

## Research matrix — starter evidence, not publication authorization

| State | Initial topic | Official agency source | Specific section or point | Open review |
|---|---|---|---|---|
| NY | Payday frequency | https://dol.ny.gov/frequency-pay | Manual worker weekly and clerical/other twice monthly, worker-specific exemptions and permits | NY Labor Law §191, categories and manual-worker permit |
| NJ | Payday frequency | https://www.nj.gov/labor/wageandhour/tools-resources/laws/selectedstatelaborlaws.shtml | N.J.S.A. 34:11-4.2 | Covered classes, collective bargaining exceptions |
| CT | Payday frequency | https://www.cga.ct.gov/current/pub/chap_558.htm | Conn. Gen. Stat. §§31-71b, 31-71i | Weekly or biweekly pay under §31-71b(a)(1); commissioner-authorized less-frequent schedules under §31-71i |
| CA | Final wages | https://www.dir.ca.gov/dlse/faq_paydays.htm | Labor Code §§201–203 | Discharge versus quitting, 72-hour notice, commissions, penalties |
| WA | Final wages | https://lni.wa.gov/workers-rights/wages/getting-paid/ | Paychecks / Final paychecks | Separate benefit, leave, deductions and local rules |
| IL | Final wages | https://labor.illinois.gov/faqs/wage-payment-faq.html | FAQ Q8/Q11; 820 ILCS 115/5 | Earned vacation, contract-defined bonus/commissions |
| CO | Pay periods | https://cdle.colorado.gov/sites/cdle/files/colorado_wage_act_revised_august_6_2025.pdf | C.R.S. §8-4-103(1)(a) | Confirm amendments, local overlays and permitted alternatives |
| FL | Minimum wage | https://floridajobs.org/florida-minimum-wage | $15 from 2026-09-30 through 2027-12-31 per Florida Department of Commerce; confirm later updates | Tipped work, coverage, 2027 rule currency |
| GA | Minimum wage | https://dol.georgia.gov/minimum-wage | State/federal interaction and O.C.G.A. §34-4-3 | Covered worker, higher controlling federal rate |
| PA | Wage payment | https://www.pa.gov/services/dli/file-a-wage-payment-and-collection-complaint | Wage Payment and Collection Law | WPCL wage-payment requirements are distinct from Act 101 of 2026, a Prevailing Wage Act amendment effective 2026-12-21 |
| TX | Final wages | https://efte.twc.texas.gov/final_pay.html | Tex. Labor Code §61.014 | Involuntary versus voluntary termination; commission/benefit agreements |

### Authority hierarchy
1. Currently effective state statute and regulations issued by that jurisdiction.
2. Official state labor or taxing agency explanatory materials with explicit publication dates and rule citations.
3. Municipal/county ordinances and rules where applicable.
4. Employer-specific agency notices, wage insurance rate letters, registrations and granted waivers (private to employer and never included in public educational content).
5. PSE authored controls are separately labeled recommendations; nonbinding summaries do not override primary law.

The federal DOL payday comparison table was last revised in January 2023; it remains only a discovery lead and cannot determine current state compliance.

## Full state profile needed before a state-specific regulatory publication
For EACH selected state, independently map and verify:
- Statutory worker/employer and industry coverage plus applicable exemptions.
- Minimum wage, tipped rates and local minimum-wage overlays with exact dates.
- Pay frequency, regular paydays, pay method, pay statements and wage notices.
- Final pay deadlines, commissions, PTO payout and waiting-time penalties.
- Overtime, regular rate, daily overtime, premium pay and meal/rest rules.
- Mandatory sick/medical/family leave and disability programs.
- Permissible deductions, garnishment procedures and related notices.
- New hire reporting and employment tax withholding/deposits.
- SUTA and other state tax registrations, wage bases, employer rate notices and reporting.
- Required records and retention with privacy/security distinctions.
- Local rules, CBAs and industry-specific exemptions; cross-border interaction.

Each claim requires exact statement ID, pinpoint, rule-version/effective dates, source last-checked date, jurisdiction, affected workers and employer, exceptions, reviewer finding and any contrary or superseding authority.

## Review and release process
- Research lead: collect agency sources and document uncertainty without marking verified.
- Payroll subject specialist: check actual wording and reconcile exceptions.
- Legal/tax escalation: when appropriate to statutory interpretation or material state penalty risk.
- Editorial owner: approve final wording, explicit state scope and corrected links.
- Founder: authorize specifically scoped publication after technical QA and source review.
- CI and Vercel: check route, citation and no false universal coverage claim.
- Quarterly reviews: generate change proposals, never automatic legal approval or auto-publication.

## External dependencies and safety boundaries
Maintain independence from employer payroll processing, PSE CHAP runtime and sensitive employee/customer data. Do not turn official-source hyperlinks into employer-specific legal advice or operational compliance enforcement. No changes to PSE infrastructure build priority.

## State-phase completion definition
Phase A (this PR): 11-source research register, explanatory handoff, tests, Drive archive update and bounded PSE Context Hub reuse assessment. This is **not** complete 11-state statutory coverage.
Phase B: prioritized jurisdiction profiles across the control topics above, exceptions and local overlays.
Phase C: independent review and source-cited state educational releases, with release manifest and corrections.
State regulatory public articles remain withheld until Phase C.

## PSE Context Hub — review after Phase A
Conduct a read-only inventory of the PSE Context Hub and identify reuse opportunities for source metadata, document classification, searchable citations, change detection, quarterly jobs, evidence provenance and editorial approvals. Do NOT assume the Context Hub is an approved source of payroll law or grant it publication authority. No builds, integrations, repo modifications or product-priority changes without separate authorization.

## Marketing-only public reference surface

A public-facing `/payroll-intelligence/state-sources` educational directory is proposed in this branch. It shows each state, the selected topic, official-source link, precise starting authority and caveat; it deliberately **does not render preliminaryStatement values** or claim rule-specific verification. Its `noindex` metadata avoids treating a research starting point as a finished searchable 50-state compliance product. The directory is linked from the framework landing page. No new operational authority is created; PSE Context Hub remains the intended owner of governed regulatory data after a separately approved future integration.

### Mandatory corrections before publishing
- Connecticut: §31-71b(a)(1) expressly permits pay weekly **or once every two weeks** for generally covered workers; §31-71i governs commissioner authorization for a less frequent schedule. Prefer current statute over the outdated agency weekly-only overview. https://www.cga.ct.gov/current/pub/chap_558.htm
- Pennsylvania: Act 101 of 2026 amends the **Prevailing Wage Act**, not the general Wage Payment and Collection Law; signed 2026-10-22 and effective 2026-12-21. Separate prevailing wage for public works from general wage payment. https://www.palegis.us/legislation/bills/2025/SB908
- Florida: Florida Department of Commerce identifies the statewide $15 hourly minimum from 2026-09-30 through 2027-12-31. Tipped pay, coverage and later source changes remain separate applicability questions. https://floridajobs.org/florida-minimum-wage
