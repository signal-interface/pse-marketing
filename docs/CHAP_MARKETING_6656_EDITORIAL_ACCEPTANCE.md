# CHAP Marketing — IRC §6656 Educational Claim Register (v0.1)

**Status:** EDITORIAL CANDIDATE — NOT PROFESSIONALLY APPROVED. **Release gate: NO-GO.**
**Created:** 2026-11-14. **Owner:** PSE Marketing. **Professional source reviewer:** PENDING.
**Last professional source verification:** PENDING. **Public deployment authorization:** NOT GIVEN.

## Purpose and scope
Protect the public Marketing Compliance Education widget from fabricating employer-specific tax legal conclusions. No operational CHAP connection, tax filing, employer data integration, human-referral workflow or claim of a credentialed reviewer.

The new server-side `chapMarketingEducation.ts` supplies only a finite educational case catalog. Responses have no generated legal analysis, model-scored confidence or automated FLAGGED/CLEAR decision. Unsupported questions receive an explicit limitation. The client and persisted question/email gate remain unchanged.

**Important:** These cases are editorial drafts grounded in public authorities. A model's output is no longer used for the public text, but deterministic wording is not automatically professionally accurate. An independent qualified payroll-tax reviewer must approve each clause before release.

## Claim/case matrix
| Topic ID | Material claim requiring review | Source | Reviewer status |
| --- | --- | --- | --- |
| deposit-trigger | Statutory deposit shortfall and prescribed date; reasonable cause and willful neglect are distinct requirements | 26 USC §§6656(a), (b) | PENDING |
| deposit-rate-tiers | 2% / 5% / 10% time thresholds; 15% conditioned on specified notices, not simply elapsed days | 26 USC §6656(b)(1) | PENDING |
| reconciliation-and-deposits | A bookkeeping variance alone does not establish a statutory underpayment; actual required and timely deposited amounts matter | 26 USC §6656(a)–(b); 26 CFR §31.6302-1 | PENDING |
| one-day-deposit-rule | $100,000 of accumulated employment taxes on a day within a deposit period triggers next-day rule, subject to calendar exceptions | 26 CFR §31.6302-1(c)(3) | PENDING |
| deposit-shortfall-safe-harbor | Shortfall cap is greater of $100 or 2%; make-up deadline is essential; other statutory relief may apply | 26 CFR §31.6302-1(f); 26 USC §6656(a), (c), (d) | PENDING |
| reasonable-cause-relief | Reasonable cause and willful neglect must not be equated; review turns on facts | 26 USC §6656(a); IRS IRM 20.1.1.3.2 | PENDING |
| first-time-depositor-relief | Certain inadvertent failures may qualify for discretionary statutory waiver or abatement, not automatic approval | 26 USC §6656(c)–(d) | PENDING |
| deposit-period-designation | Deposit allocation and 90-day designation window based on penalty notice | 26 USC §6656(e) | PENDING |

Official source checks used for draft development:
- https://uscode.house.gov/us/usc/119-136/t26/s6656/
- https://www.irs.gov/publications/p15
- https://www.law.cornell.edu/cfr/text/26/31.6302-1

## Rejected previous live claims
The independent Vega preview of PR #80 at `a4927575` documented two material failures:
1. Built-in trigger question incorrectly equated absence of reasonable cause with willful neglect and misstated notice-sensitive rates.
2. Reconciliation question incorrectly claimed direct and automatic underpayment/penalties, exclusive safe harbor and elapsed-time-only 15% escalation.

The new editorial text is expressly designed not to make these claims. Regression cases appear in `src/lib/__tests__/chapMarketingEducation.test.ts`. Automated tests check deterministic output shape and selected claims; they **do not replace** independent statutory editorial approval.

## Release acceptance checklist
- [ ] Qualified payroll-tax specialist verifies **all eight case texts** sentence-by-sentence against current primary authorities. Record reviewer name, capacity, verification date, exact source version and corrections, with consent and permission to reference their role.
- [ ] Evaluate unsupported and ambiguous paraphrases; do not misroute them to a materially wrong case.
- [ ] Validate the exact-head protected preview in authorized browser: built-in §6656 trigger, reconciliation/cascade, tier/notice, reasonable cause, $100k accumulation, regulatory shortfall, first-time exception, unsupported questions.
- [ ] Confirm no HIGH confidence, auto-determination or implicit professional endorsement. Check clickable source labels and legal-text equivalence.
- [ ] Confirm quota/email gate/reset, loading completion, no raw model output and safe stream termination.
- [ ] Independent Codex review for new branch head, Vega functional acceptance and explicit owner merge authorization.
- [ ] Production SHA, no-lead smoke and rollback checks after authorized merge.

**Soft-close remains prohibited** until the above release gates pass. Mobile, accessibility, retention and unrestricted campaigns remain separately gated.
