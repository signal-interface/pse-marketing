// Bounded, deterministic educational text for CHAP Marketing.
// Editorial candidate: all assertions require independent payroll-tax
// subject-matter acceptance before production. Never claim professional review.
// No model-generated analysis, self-assessed confidence or employer determination.

import { COMPLIANCE_CORPUS } from "@/data/complianceCorpus";
import type { Citation, ValidatedResponse } from "@/lib/chapValidation";

type Case = {
  id: string;
  title: string;
  explanation: string;
  ids: readonly string[];
};

const CASES: Record<string, Case> = {
  trigger: {
    id: "deposit-trigger",
    title: "When a failure-to-deposit penalty may apply",
    explanation: "IRC §6656(a) addresses a failure to deposit a required tax amount by its prescribed deposit date. The statutory underpayment is the excess of the amount required to be deposited over the amount deposited by that date. Section 6656(a) provides an exception when the failure is shown to be due to reasonable cause and not due to willful neglect. Absence of established reasonable cause does not itself prove willful neglect. These general provisions do not establish whether any particular employer owes a penalty.",
    ids: ["irc-6656-a", "irc-6656-b"],
  },
  rates: {
    id: "deposit-rate-tiers",
    title: "Deposit-penalty percentages and notice conditions",
    explanation: "IRC §6656(b)(1) generally specifies 2% when the failure lasts no more than 5 days, 5% when it lasts more than 5 but no more than 15 days, and 10% when it lasts more than 15 days. A separate 15% special rule applies when the amount has not been deposited by the earlier of the day 10 days after the first delinquency notice or certain statutory immediate-payment notice-and-demand dates. The 15% rate does not arise solely from being 15 days late. The facts, notices and applicable exceptions require independent verification.",
    ids: ["irc-6656-b", "irc-6656-a"],
  },
  reconciliation: {
    id: "reconciliation-and-deposits",
    title: "Reconciliation differences versus statutory underpayments",
    explanation: "A reconciliation difference is a warning to investigate, not by itself proof of a tax-deposit underpayment or an automatic penalty. Under IRC §6656(b)(2), an underpayment depends on the actual tax required to be deposited and the amount deposited by the required date. Deposit schedules, any applicable shortfall rule, notice conditions and potential reasonable-cause or other relief must also be considered. This public educational tool cannot inspect payroll records, establish amounts due, or determine an employer's penalty.",
    ids: ["irc-6656-a", "irc-6656-b", "cfr-31-6302-1"],
  },
  threshold: {
    id: "one-day-deposit-rule",
    title: "The $100,000 next-day deposit rule",
    explanation: "Under 26 CFR §31.6302-1(c)(3), accumulating $100,000 or more of employment taxes on any day within a deposit period triggers the One-Day deposit rule, overriding the ordinary monthly or semi-weekly timetable. Subject to the regulation's weekend and holiday provisions, those taxes must be deposited by the close of the following day. The relevant accumulation and deposit periods must be established from actual records; a reconciliation discrepancy alone does not establish a breach.",
    ids: ["cfr-31-6302-1"],
  },
  safeharbor: {
    id: "deposit-shortfall-safe-harbor",
    title: "Deposit shortfalls and the regulatory safe harbor",
    explanation: "26 CFR §31.6302-1(f) provides a deposit shortfall safe harbor when the shortfall is no greater than the greater of $100 or 2% of the required deposit and the shortfall is made up by the specified make-up date. This is not a general exemption for all shortfalls, and it is not the only potential source of relief: IRC §6656 also addresses reasonable cause and specified waiver or abatement situations. Eligibility depends on the actual deposit and payment history.",
    ids: ["cfr-31-6302-1", "irc-6656-a", "irc-6656-c", "irc-6656-d"],
  },
  reasonable: {
    id: "reasonable-cause-relief",
    title: "Reasonable cause and willful neglect",
    explanation: "IRC §6656(a) recognizes an exception where failure to deposit is shown to be due to reasonable cause and not due to willful neglect. These are distinct concepts; neither should be inferred solely from a late deposit. The IRS considers the relevant facts and circumstances when evaluating reasonable cause. This response cannot assess an actual employer's evidence or predict IRS treatment.",
    ids: ["irc-6656-a", "irm-20-1-1-3-reasonable-cause"],
  },
  firsttime: {
    id: "first-time-depositor-relief",
    title: "Certain first-time deposit and schedule-change waivers",
    explanation: [
      "IRC §6656(c) authorizes a discretionary waiver for certain inadvertent failures in an employer's first required quarter, subject to the section's eligibility requirements and timely filing.",
      "It also covers certain first deposits after required frequency changes, with those same statutory eligibility and timely-filing requirements.",
      "Section 6656(d) separately addresses potential abatement when an initial payment is inadvertently sent to the Secretary instead of an appropriate depository.",
      "Neither provision guarantees relief in a particular case.",
    ].join(" "),
    ids: ["irc-6656-c", "irc-6656-d"],
  },
  designation: {
    id: "deposit-period-designation",
    title: "Designation of deposit periods",
    explanation: "IRC §6656(e) provides that deposits generally apply to the most recent period or periods in the specified tax period unless the depositor makes an allowed designation. A designation under that subsection is limited to the 90-day period beginning with a penalty notice for the applicable tax period. This provision does not establish a penalty without examining the underlying deposits, periods and notices.",
    ids: ["irc-6656-e", "irc-6656-a"],
  },
};

function selectCase(question: string): Case | null {
  const q = question.toLowerCase().replace(/\s+/g, " ").trim();

  // Explicitly require an employment-tax deposit context. Single terms such
  // as "tax", "deposit", "rate", or "threshold" must not route bank interest,
  // estate-tax, or unrelated questions into statutory payroll advice.
  const explicitStatute = /(?:§|section|irc|usc|u\\.s\\.c\\.)?\\s*6656\\b/.test(q);
  const employmentDeposit = /(?:employment|federal|payroll)\\s+(?:tax\\s+)?deposits?\\b|(?:employment|federal|payroll)\\s+tax(?:es)?\\s+deposits?\\b|deposits?\\s+of\\s+(?:federal\\s+)?(?:employment|payroll)\\s+tax/.test(q);
  const failureToDeposit = /failure[- ]to[- ]deposit|deposit\\s+penalt|penalt(?:y|ies)\\s+(?:for|on)\\s+(?:late\\s+)?(?:tax\\s+)?deposits?/.test(q);
  const depositSafeHarbor = /deposit\\s+shortfall\\s+safe.harbor/.test(q);
  const qualifiedRelief = /(?:reasonable cause|willful neglect)\\s+(?:for|in|under)?\\s*(?:a\\s+)?(?:tax\\s+)?penalt|penalt(?:y|ies)\\s+abatement/.test(q);
  if (!(explicitStatute || employmentDeposit || failureToDeposit || qualifiedRelief || depositSafeHarbor)) return null;

  // Only choose a topic when the request explicitly signals that topic.
  // Prefer a regulatory shortfall safe harbor over the generic threshold
  // question, and a penalty-rate question over the 2% shortfall rule.
  if (/reconcil|discrepan|cascade|deposit gap/.test(q)) return CASES.reconciliation;
  if (/reasonable cause|willful neglect|abatement/.test(q)) return CASES.reasonable;
  if (/first.time|first quarter|first deposit|frequency change|waiver/.test(q)) return CASES.firsttime;
  if (/safe.harbor|de minimis|shortfall/.test(q)) return CASES.safeharbor;
  if (/designat|most recent period|90.day/.test(q)) return CASES.designation;
  if (/(?:penalt|6656).{0,45}(?:rate|tier|percentage|percent|2%|5%|10%|15%|notice)|(?:rate|tier|percentage|percent|2%|5%|10%|15%|notice).{0,45}(?:penalt|6656)|four.tier/.test(q)) return CASES.rates;
  if (/100,?000|one.day|next.day|accumulat/.test(q)) return CASES.threshold;
  if (/trigger|appl|failure.to.deposit|late deposit|deposit penalty/.test(q)) return CASES.trigger;
  return null; // Unclear intent is a limitation, never an invented answer.
}

export function educationalMarketingResponse(question: string): ValidatedResponse {
  const selected = selectCase(question);
  if (!selected) {
    return {
      kind: "limited_education",
      message: "This educational demonstration currently offers only a few reviewed-topic drafts about IRC §6656. It cannot assess your circumstances or answer this question reliably. Consult the official authorities or a qualified payroll or tax professional.",
    };
  }
  const byId = new Map(COMPLIANCE_CORPUS
    .filter(entry => entry.sourceType !== "pse_written")
    .map(entry => [entry.id, entry]));
  const citations: Citation[] = selected.ids.map(id => {
    const entry = byId.get(id);
    if (!entry) throw new Error("Missing authorized education source: " + id);
    return { id: entry.id, citation: entry.citation, sourceUrl: entry.sourceUrl };
  });
  return {
    kind: "education",
    topicId: selected.id,
    title: selected.title,
    analysis: selected.explanation,
    citations,
  };
}
