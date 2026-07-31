// CHAP AI Compliance Corpus — v1 Scope: IRC §6656 (Failure to Deposit Penalty)
//
// This file is the grounding knowledge base the CHAP AI widget uses to
// answer compliance questions. Every citation the model returns must point
// to an entry here — the widget layer enforces this via chapValidation.ts.
//
// Provenance: `usc`, `cfr`, and `irs_guidance` entries carry VERBATIM
// contiguous excerpts of the entry's `sourceUrl` — never paraphrased, no
// silent elisions. Mechanically re-verified 2026-07-30 with
// scripts/verify-corpus.mjs (fetch → strip → word-sequence compare; no
// model in the loop), which restored cross-reference clauses and
// sentences the 2026-07-17 transcription had dropped without ellipsis.
// `content` is verbatim source text with ZERO exceptions (2026-07-30
// doctrine ruling) — the verifier asserts content === fetched source
// unconditionally. PSE commentary goes in `editorialNote`, which never
// reaches the model, retrieval scoring, or any cited output. The single
// `pse_written` entry is PSE-authored analysis; its statutory assertions
// trace to the other entries, never to itself.
//
// Adding a new entry: pick a stable `id` slug, match the CorpusEntry shape
// exactly, and populate `tags` with lowercase keywords that describe
// likely-matching user questions (the retrieval layer uses these).

export type CorpusSourceType = "usc" | "cfr" | "irs_guidance" | "pse_written";

export interface CorpusEntry {
  id: string;
  title: string;
  citation: string;
  sourceType: CorpusSourceType;
  jurisdiction: string;
  sourceUrl: string;
  content: string;
  // PSE-authored commentary, never cited as source text. Excluded from
  // the model corpus block (buildCorpusBlock), from retrieval scoring,
  // and from verbatim verification — `content` alone must equal the
  // fetched source, unconditionally.
  editorialNote?: string;
  tags: string[];
}

export const COMPLIANCE_CORPUS: CorpusEntry[] = [
  {
    id: "irc-6656-a",
    title: "IRC §6656(a) — Underpayment of deposits (imposition of the failure-to-deposit penalty)",
    citation: "26 U.S.C. §6656(a)",
    sourceType: "usc",
    jurisdiction: "federal",
    sourceUrl: "https://www.law.cornell.edu/uscode/text/26/6656#a",
    content: `(a) Underpayment of deposits

In the case of any failure by any person to deposit (as required by this title or by regulations of the Secretary under this title) on the date prescribed therefor any amount of tax imposed by this title in such government depository as is authorized under section 6302(c) to receive such deposit, unless it is shown that such failure is due to reasonable cause and not due to willful neglect, there shall be imposed upon such person a penalty equal to the applicable percentage of the amount of the underpayment.`,
    tags: [
      "failure to deposit",
      "deposit penalty",
      "penalty imposition",
      "employment taxes",
      "941",
      "940",
      "deposit",
      "reasonable cause",
      "willful neglect",
    ],
  },
  {
    id: "irc-6656-b",
    title: "IRC §6656(b) — Amount of the penalty (four-tier structure)",
    citation: "26 U.S.C. §6656(b)",
    sourceType: "usc",
    jurisdiction: "federal",
    sourceUrl: "https://www.law.cornell.edu/uscode/text/26/6656#b",
    content: `(b) Definitions

For purposes of subsection (a)—

(1) Applicable percentage

(A) In general — Except as provided in subparagraph (B), the term "applicable percentage" means—

(i) 2 percent if the failure is for not more than 5 days,

(ii) 5 percent if the failure is for more than 5 days but not more than 15 days, and

(iii) 10 percent if the failure is for more than 15 days.

(B) Special rule — In any case where the tax is not deposited on or before the earlier of—

(i) the day 10 days after the date of the first delinquency notice to the taxpayer under section 6303, or

(ii) the day on which notice and demand for immediate payment is given under section 6861 or 6862 or the last sentence of section 6331(a),

the applicable percentage shall be 15 percent.

(2) Underpayment

The term "underpayment" means the excess of the amount of the tax required to be deposited over the amount, if any, thereof deposited on or before the date prescribed therefor.`,
    tags: [
      "penalty amount",
      "penalty rate",
      "2 percent",
      "5 percent",
      "10 percent",
      "15 percent",
      "tier",
      "four tier",
      "days late",
      "late deposit",
      "underpayment",
    ],
  },
  {
    id: "irc-6656-c",
    title: "IRC §6656(c) — Exception for first-time depositors of employment taxes",
    citation: "26 U.S.C. §6656(c)",
    sourceType: "usc",
    jurisdiction: "federal",
    sourceUrl: "https://www.law.cornell.edu/uscode/text/26/6656#c",
    content: `(c) Exception for first-time depositors of employment taxes

The Secretary may waive the penalty imposed by subsection (a) on a person's inadvertent failure to deposit any employment tax if—

(1) such person meets the requirements referred to in section 7430(c)(4)(A)(ii),

(2) such failure—

(A) occurs during the first quarter that such person was required to deposit any employment tax; or

(B) if such person is required to change the frequency of deposits of any employment tax, relates to the first deposit to which such change applies, and

(3) the return of such tax was filed on or before the due date.

For purposes of this subsection, the term "employment taxes" means the taxes imposed by subtitle C.`,
    tags: [
      "first time depositor",
      "new employer",
      "exception",
      "waiver",
      "abatement",
      "first time",
      "frequency change",
      "deposit schedule change",
    ],
  },
  {
    id: "irc-6656-d",
    title: "IRC §6656(d) — Authority to abate penalty where deposit sent to Secretary",
    citation: "26 U.S.C. §6656(d)",
    sourceType: "usc",
    jurisdiction: "federal",
    sourceUrl: "https://www.law.cornell.edu/uscode/text/26/6656#d",
    content: `(d) Authority to abate penalty where deposit sent to Secretary

The Secretary may abate the penalty imposed by subsection (a) with respect to the first time a depositor is required to make a deposit if the amount required to be deposited is inadvertently sent to the Secretary instead of to the appropriate government depository.`,
    tags: [
      "abatement",
      "inadvertent",
      "sent to secretary",
      "misdirected deposit",
      "first deposit",
      "waiver",
      "relief",
    ],
  },
  {
    id: "irc-6656-e",
    title: "IRC §6656(e) — Designation of periods to which deposits apply",
    citation: "26 U.S.C. §6656(e)",
    sourceType: "usc",
    jurisdiction: "federal",
    sourceUrl: "https://www.law.cornell.edu/uscode/text/26/6656#e",
    content: `(e) Designation of periods to which deposits apply

(1) In general — A deposit made under this section shall be applied to the most recent period or periods within the specified tax period to which the deposit relates, unless the person making such deposit designates a different period or periods to which such deposit is to be applied.

(2) Time for making designation — A person may make a designation under paragraph (1) only during the 90-day period beginning on the date of a notice that a penalty under subsection (a) has been imposed for the specified tax period to which the deposit relates.`,
    editorialNote:
      "§6656 contains no de minimis provision. The de minimis / safe-harbor shortfall rule for deposits is found at 26 C.F.R. §31.6302-1(f) — see the corpus entry for that regulation.",
    tags: [
      "designation",
      "deposit application",
      "most recent period",
      "90 day period",
      "penalty notice",
      "apply deposit",
      "cascading penalty",
    ],
  },
  {
    id: "irc-6302-c",
    title: "IRC §6302(c) — Use of Government depositaries",
    citation: "26 U.S.C. §6302(c)",
    sourceType: "usc",
    jurisdiction: "federal",
    sourceUrl: "https://www.law.cornell.edu/uscode/text/26/6302#c",
    content: `(c) Use of Government depositaries

The Secretary may authorize Federal Reserve banks, and incorporated banks, trust companies, domestic building and loan associations, or credit unions which are depositaries or financial agents of the United States, to receive any tax imposed under the internal revenue laws, in such manner, at such times, and under such conditions as he may prescribe; and he shall prescribe the manner, times, and conditions under which the receipt of such tax by such banks, trust companies, domestic building and loan associations, and credit unions is to be treated as payment of such tax to the Secretary.`,
    tags: [
      "government depositary",
      "deposit authority",
      "deposit timing",
      "federal reserve",
      "deposit rules",
      "6302",
    ],
  },
  {
    id: "cfr-31-6302-1",
    title: "26 CFR §31.6302-1 — Federal tax deposit rules for employment taxes (excerpts)",
    citation: "26 C.F.R. §31.6302-1(b), (c)(3), (f)",
    sourceType: "cfr",
    jurisdiction: "federal",
    sourceUrl: "https://www.law.cornell.edu/cfr/text/26/31.6302-1",
    content: `(2) Monthly depositor —(i) In general. An employer is a monthly depositor for the entire calendar year if the aggregate amount of employment taxes reported for the lookback period is $50,000 or less. (ii) Special rule. An employer ceases to be a monthly depositor on the first day after the employer is subject to the One-Day ($100,000) rule in paragraph (c)(3) of this section. At that time, the employer immediately becomes a semi-weekly depositor for the remainder of the calendar year and for the following calendar year.

(3) Semi-weekly depositor. An employer is a semi-weekly depositor for the entire calendar year if the aggregate amount of employment taxes reported for the lookback period exceeds $50,000.

(4) Lookback period —(i) In general. For employers who file Form 941, “Employer's QUARTERLY Federal Tax Return,” (or any related Spanish-language returns or returns for U.S. possessions) the lookback period for each calendar year is the twelve month period ended the preceding June 30. For example, the lookback period for calendar year 2006 is the period July 1, 2004, to June 30, 2005. The lookback period for employers who file Form 944, “Employer's ANNUAL Federal Tax Return,” or filed Form 944 (or any related Spanish-language returns or returns for U.S. possessions) for either of the two previous calendar years, is the second calendar year preceding the current calendar year. For example, the lookback period for calendar year 2006 is calendar year 2004. In determining status as either a monthly or semi-weekly depositor, an employer should determine the aggregate amount of employment tax liabilities reported on its return(s) (Forms 941 or Form 944) for the lookback period. The amount of employment tax liabilities reported for the lookback period is the amount the employer reported on either Forms 941 or Form 944 even if the employer is required to file the other form for the current calendar year. New employers shall be treated as having employment tax liabilities of zero for any part of the lookback period before the date the employer started or acquired its business.

(3) Exception —One-Day rule. Notwithstanding paragraphs (c)(1) and (c)(2) of this section, if on any day within a deposit period (monthly or semi-weekly) an employer has accumulated $100,000 or more of employment taxes, those taxes must be deposited by electronic funds transfer in time to satisfy the tax obligation by the close of the next day. If the next day is a Saturday, Sunday, or legal holiday in the District of Columbia under section 7503, the taxes will be treated as timely deposited if deposited on the next succeeding day which is not a Saturday, Sunday, or legal holiday. For purposes of determining whether the $100,000 threshold is met— (i) A monthly depositor takes into account only those employment taxes accumulated in the calendar month in which the day occurs; and (ii) A semi-weekly depositor takes into account only those employment taxes accumulated in the Wednesday-Friday or Saturday-Tuesday semi-weekly period in which the day occurs.

(f) Safe harbor/De minimis rules — (1) Single deposit safe harbor. An employer will be considered to have satisfied its deposit obligation imposed by this section if— (i) The amount of any shortfall does not exceed the greater of $100 or 2 percent of the amount of employment taxes required to be deposited; and (ii) The employer deposits the shortfall on or before the shortfall make-up date. (2) Shortfall defined. For purposes of this paragraph (f), the term "shortfall" means the excess of the amount of employment taxes required to be deposited for the period over the amount deposited for the period. For this purpose, a period is either a monthly, semi-weekly or daily period. (3) Shortfall make-up date — (i) Monthly rule. A shortfall with respect to a deposit required under the Monthly rule must be deposited or remitted no later than the due date for the quarterly return, in accordance with the applicable form and instructions. (ii) Semi-Weekly rule and One-Day rule. A shortfall with respect to a deposit required under the Semi-Weekly rule or the One-Day rule must be deposited on or before the first Wednesday or Friday (whichever is earlier), falling on or after the 15th day of the month following the month in which the deposit was required to be made or, if earlier, the return due date for the return period.`,
    tags: [
      "deposit rules",
      "regulation",
      "eftps",
      "deposit schedule",
      "monthly depositor",
      "semi-weekly depositor",
      "lookback",
      "lookback period",
      "one-day rule",
      "100000",
      "safe harbor deposit",
      "safe harbor",
      "de minimis",
      "small shortfall",
      "shortfall",
      "2 percent shortfall",
      "threshold",
    ],
  },
  {
    id: "irs-pub-15",
    title: "IRS Publication 15 — Employer's Tax Guide (deposit schedules & penalties, excerpts)",
    citation: "IRS Pub. 15 (Circular E), Section 11",
    sourceType: "irs_guidance",
    jurisdiction: "federal",
    sourceUrl: "https://www.irs.gov/publications/p15",
    content: `Lookback period. If you’re a Form 941 filer, your deposit schedule for a calendar year is determined from the total taxes reported on Forms 941, line 12, in a 4-quarter lookback period. The lookback period begins July 1 and ends June 30 as shown next in Table 1. If you reported $50,000 or less of taxes for the lookback period, you’re a monthly schedule depositor; if you reported more than $50,000, you’re a semiweekly schedule depositor.

Under the monthly deposit schedule, deposit employment taxes on payments made during a month by the 15th day of the following month.

Under the semiweekly deposit schedule, deposit employment taxes for payments made on Wednesday, Thursday, and/or Friday by the following Wednesday. Deposit taxes for payments made on Saturday, Sunday, Monday, and/or Tuesday by the following Friday.

If you accumulate $100,000 or more in taxes on any day during a monthly or semiweekly deposit period (see Deposit period, earlier in this section), you must deposit the tax by the next business day, whether you’re a monthly or semiweekly schedule depositor. The $100,000 tax liability threshold requiring a next-day deposit is determined before you consider any reduction of your liability for nonrefundable credits. For purposes of the $100,000 rule, don’t continue accumulating a tax liability after the end of a deposit period.

Accuracy of Deposits Rule. You're required to deposit 100% of your tax liability on or before the deposit due date. However, penalties won't be applied for depositing less than 100% if both of the following conditions are met. Any deposit shortfall doesn't exceed the greater of $100 or 2% of the amount of taxes otherwise required to be deposited. The deposit shortfall is paid or deposited by the shortfall makeup date as described next.

Penalties may apply if you don’t make required deposits on time or if you make deposits for less than the required amount. The penalties don’t apply if any failure to make a proper and timely deposit was due to reasonable cause and not to willful neglect. If you receive a penalty notice, you can provide an explanation of why you believe reasonable cause exists. If you timely filed your employment tax return, the IRS may also waive deposit penalties if you inadvertently failed to deposit and it was the first quarter that you were required to deposit any employment tax, or if you inadvertently failed to deposit the first time after your deposit frequency changed. You must also meet the net worth and size limitations applicable to awards of administrative and litigation costs under section 7430; for individuals, this means that your net worth can’t exceed $2 million, and for businesses, your net worth can’t exceed $7 million and you also can’t have more than 500 employees. The IRS may also waive the deposit penalty the first time you’re required to make a deposit if you inadvertently send the payment to the IRS rather than deposit it by EFT. For amounts not properly or timely deposited, the penalty rates are as follows. Penalty Charged for... 2% Deposits made 1 to 5 days late. 5% Deposits made 6 to 15 days late. 10% Deposits made 16 or more days late, but before 10 days from the date of the first notice the IRS sent asking for the tax due. 10% Amounts that should have been deposited, but instead were paid directly to the IRS, or paid with your tax return. But see Payment with return, earlier in this section, for exceptions. 15% Amounts still unpaid more than 10 days after the date of the first notice the IRS sent asking for the tax due or the day on which you received notice and demand for immediate payment, whichever is earlier. Late deposit penalty amounts are determined using calendar days, starting from the due date of the liability.`,
    tags: [
      "publication 15",
      "circular e",
      "employer tax guide",
      "deposit schedule",
      "monthly",
      "semi-weekly",
      "semiweekly",
      "lookback period",
      "form 941",
      "next-day deposit",
      "accuracy of deposits",
      "penalty rates",
    ],
  },
  {
    id: "irm-20-1-1-3-reasonable-cause",
    title: "IRM 20.1.1.3.2 — Reasonable Cause (penalty abatement standards)",
    citation: "IRM 20.1.1.3.2",
    sourceType: "irs_guidance",
    jurisdiction: "federal",
    sourceUrl: "https://www.irs.gov/irm/part20/irm_20-001-001r",
    content: `IRM 20.1.1.3.2, Reasonable Cause:

"Reasonable cause is based on all the facts and circumstances in each situation and allows the IRS to provide relief from a penalty that would otherwise apply."

"Reasonable cause relief is generally granted when the taxpayer exercised ordinary business care and prudence in determining their tax obligations but was nevertheless unable to comply with those obligations."`,
    editorialNote:
      'This is the standard the IRS applies when evaluating a request to abate a §6656(a) failure-to-deposit penalty on reasonable-cause grounds. §6656(a) itself conditions the penalty on the failure NOT being "due to reasonable cause and not due to willful neglect" — see the corpus entry for 26 U.S.C. §6656(a).',
    tags: [
      "reasonable cause",
      "abatement",
      "ordinary business care and prudence",
      "penalty relief",
      "irm",
      "internal revenue manual",
      "facts and circumstances",
    ],
  },
  {
    id: "pse-analysis-6656-patterns",
    title: "PSE Analysis — Common §6656 trigger patterns in multi-state payroll",
    citation: "PSE Compliance Intelligence Note 001",
    sourceType: "pse_written",
    jurisdiction: "federal",
    sourceUrl: "https://payrollsynergyexperts.com/chap-ai",
    content: `PSE Compliance Intelligence Note 001 — Common §6656 trigger patterns in multi-state payroll (PSE-authored analysis; statutory assertions trace to the primary-source corpus entries cited below).

Pattern 1 — Lookback-period misdetermination. An employer's monthly-versus-semiweekly status is fixed for the whole calendar year by the taxes reported in the lookback period (26 C.F.R. §31.6302-1(b)(2)-(4)). Organizations that grow past $50,000 in lookback-period liability but keep depositing monthly accrue late deposits every cycle; the exposure compounds under the tiers of 26 U.S.C. §6656(b).

Pattern 2 — Missed One-Day rule crossings. Accumulating $100,000 or more of employment taxes on any day in a deposit period triggers a next-business-day deposit obligation regardless of depositor status (26 C.F.R. §31.6302-1(c)(3)). In multi-entity or multi-state operations this is commonly missed when consolidated liabilities cross the threshold on a bonus, commission, or off-cycle run — and crossing it also converts a monthly depositor into a semi-weekly depositor going forward (§31.6302-1(b)(2)(ii)).

Pattern 3 — Frequency-change transitions. The first deposit after a required schedule change is a known failure point. Note that 26 U.S.C. §6656(c)(2)(B) gives the Secretary authority to waive the penalty for an inadvertent failure relating to the first deposit after a required frequency change, if the return was timely filed.

Pattern 4 — Shortfalls beyond the safe harbor. Deposits that come in slightly short are protected only within the safe harbor of 26 C.F.R. §31.6302-1(f): the shortfall must not exceed the greater of $100 or 2 percent of the required deposit, and it must be made up by the shortfall make-up date. Rounding and reconciliation gaps that exceed that band are penalized as underpayments under 26 U.S.C. §6656(a)-(b).

Pattern 5 — Undesignated late deposits cascading. A late deposit is applied to the most recent period unless the depositor designates otherwise within the 90-day window after a penalty notice (26 U.S.C. §6656(e)). Left undesignated, one late deposit can cascade shortfalls backward across periods and multiply the penalty tiers applied.

Governance note: PSE validates deposit timing, depositor status, and shortfall exposure against these authorities on every run — the employer's payroll processor or financial institution executes the deposits. CHAP AI advises; humans decide.`,
    tags: [
      "pse analysis",
      "deposit timing error",
      "semi-weekly vs monthly",
      "depositor status change",
      "lookback period mistake",
      "pattern",
      "common triggers",
      "multi-state",
      "bonus run",
      "off-cycle",
    ],
  },
];

export function getCorpusEntry(id: string): CorpusEntry | undefined {
  return COMPLIANCE_CORPUS.find((e) => e.id === id);
}

export function getAllCorpusEntries(): CorpusEntry[] {
  return COMPLIANCE_CORPUS;
}

export function getCorpusIds(): string[] {
  return COMPLIANCE_CORPUS.map((e) => e.id);
}
