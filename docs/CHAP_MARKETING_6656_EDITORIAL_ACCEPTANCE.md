# CHAP Marketing — IRC §6656 Educational Claim Register (v0.1)

**Status:** SOURCE-VALIDATION CANDIDATE — RELEASE HOLD UNTIL TECHNICAL AND LIVE ACCEPTANCE. External professional review is OPTIONAL, NOT a release gate (owner decision 2026-11-14).
**Created:** 2026-11-14. **Owner:** PSE Marketing. **Source-to-claim validation:** PENDING.
**Last source-to-claim verification and evidence record:** PENDING. **Public deployment authorization:** NOT GIVEN.

## Purpose and scope
Protect the public Marketing Compliance Education widget from fabricating employer-specific tax legal conclusions. No operational CHAP connection, tax filing, employer data integration, human-referral workflow or claim of a credentialed reviewer.

The new server-side `chapMarketingEducation.ts` supplies only a finite educational case catalog. Responses have no generated legal analysis, model-scored confidence or automated FLAGGED/CLEAR decision. Unsupported questions receive an explicit limitation. The client and persisted question/email gate remain unchanged.

**Owner's release model (2026-11-14):** An outside attorney/CPA review is not required. Public statutes, regulations and official IRS materials are the authoritative content basis. However, an official link does not itself verify the text attached to it. The release lane uses a documented internal source-to-claim check of each case, exact-authority citations, tests and independent Codex/Vega functional acceptance. Do not describe these texts as professionally certified or imply an outside review occurred.

## Claim/case matrix
| Topic ID | Material claim requiring source validation | Source | Validation status |
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

The new editorial text is expressly designed not to make these claims. Regression cases appear in `src/lib/__tests__/chapMarketingEducation.test.ts`. Automated tests check deterministic output shape and selected claims; source-to-claim validation must be documented against the authorities before release.

## Release acceptance checklist
- [ ] PSE source-validation owner documents verification of **all eight case texts** sentence-by-sentence against the cited current statutory, regulatory and IRS primary sources, with pinpoint subsections, versions/dates, corrections and a PASS/FAIL disposition. External specialist consultation is optional, NOT mandatory.
- [ ] Evaluate unsupported and ambiguous paraphrases; do not misroute them to a materially wrong case.
- [ ] Validate the exact-head protected preview in authorized browser: built-in §6656 trigger, reconciliation/cascade, tier/notice, reasonable cause, $100k accumulation, regulatory shortfall, first-time exception, unsupported questions.
- [ ] Confirm no HIGH confidence, auto-determination or implicit professional endorsement. Check clickable source labels and legal-text equivalence.
- [ ] Confirm quota/email gate/reset, loading completion, no raw model output and safe stream termination.
- [ ] Independent Codex technical review for exact branch head, Vega live source-faithfulness and functional acceptance, and explicit owner merge authorization.
- [ ] Production SHA, no-lead smoke and rollback checks after authorized merge.

**Soft-close remains prohibited** until the above release gates pass. Mobile, accessibility, retention and unrestricted campaigns remain separately gated.
