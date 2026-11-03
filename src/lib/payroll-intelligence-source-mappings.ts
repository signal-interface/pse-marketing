import { editorialClaimInventory } from "./payroll-intelligence-claim-inventory";
import { type ClaimReview, inspectClaimReview } from "./payroll-intelligence-review";

/**
 * Primary-source location records prepared for human subject-matter review.
 * Source-mapped is not source-supported adjudication, tax advice, editorial
 * approval, or authorization to publish.
 */
type Mapping = {
  slug: string;
  statementIndex: number;
  title: string;
  url: string;
  pinpoint: string;
  publication: string;
  caution: string;
};

const CHECKED = "2026-11-03";
const mappings: readonly Mapping[] = [
 {slug:"2026-federal-withholding-control-review",statementIndex:0,title:"IRS Publication 15-T (2026)",url:"https://www.irs.gov/publications/p15t",pinpoint:"Section 1, Percentage Method Tables for Automated Payroll Systems; Worksheet 1A",publication:"2026 edition",caution:"Methods and Forms W-4 may need case-specific review"},
 {slug:"2026-federal-tax-deposit-controls",statementIndex:0,title:"IRS Publication 15 (2026)",url:"https://www.irs.gov/publications/p15",pinpoint:"Section 11, Deposit Rules; Lookback Period for Form 941 Filers",publication:"2026 edition",caution:"Threshold calculation and Form 941 filer applicability require expert review"},
 {slug:"2026-federal-tax-deposit-controls",statementIndex:1,title:"IRS Publication 15 (2026)",url:"https://www.irs.gov/publications/p15",pinpoint:"Section 11, $100,000 Next-Day Deposit Rule",publication:"2026 edition",caution:"Next-day rule interacts with deposit period and subsequent classification"},
 {slug:"flsa-recordkeeping-control-baseline",statementIndex:1,title:"DOL Fact Sheet #21",url:"https://www.dol.gov/agencies/whd/fact-sheets/21-flsa-recordkeeping",pinpoint:"How Long Should Records Be Retained",publication:"Fact Sheet #21; revision confirmation outstanding",caution:"State, tax and litigation retention requirements can be longer"},
 {slug:"2026-worker-classification-federal-tax",statementIndex:1,title:"IRS Publication 15-A (2026)",url:"https://www.irs.gov/publications/p15a",pinpoint:"Section 2, Common-Law Rules; Behavioral Control; Financial Control; Type of Relationship",publication:"2026 edition",caution:"Federal tax classification not interchangeable with state or FLSA tests"},
 {slug:"flsa-regular-rate-assurance",statementIndex:0,title:"DOL Fact Sheet #56A",url:"https://www.dol.gov/agencies/whd/fact-sheets/56a-regular-rate",pinpoint:"Overview of Regular Rate of Pay; first introductory section",publication:"December 2019 fact sheet",caution:"Coverage and exemptions plus state/local rules require review"},
 {slug:"flsa-regular-rate-assurance",statementIndex:1,title:"DOL Fact Sheet #56A",url:"https://www.dol.gov/agencies/whd/fact-sheets/56a-regular-rate",pinpoint:"Regular Rate formula and Exclusions from the Regular Rate",publication:"December 2019 fact sheet",caution:"Claim wording is a condensed generalization of specific statutory exclusion rules"},
 {slug:"2026-taxable-fringe-benefits",statementIndex:0,title:"IRS Publication 15-B (2026)",url:"https://www.irs.gov/publications/p15b",pinpoint:"Section 1, Fringe Benefit Overview; Are Fringe Benefits Taxable?",publication:"2026 edition",caution:"Recipient and benefit-category exclusions must be evaluated"},
 {slug:"2026-health-fsa-pretax-review",statementIndex:0,title:"IRS Publication 15-B (2026)",url:"https://www.irs.gov/publications/p15b",pinpoint:"Section 1, Cafeteria Plans; Contribution Limit on a Health FSA",publication:"2026 edition",caution:"Applies to plan years beginning in 2026, not all deduction types"},
];

export const sourceMappedClaims: readonly ClaimReview[] = mappings.map(m => {
  const candidates = editorialClaimInventory.filter(c => c.briefingSlug === m.slug);
  const current = candidates[m.statementIndex];
  if (!current) throw new Error(`Missing current draft statement: ${m.slug} / ${m.statementIndex}`);
  return {
    claimId: current.id,
    exactClaimText: current.claimText,
    status: "source-mapped",
    source: {
      title: m.title,
      url: m.url,
      pinpoint: m.pinpoint,
      kind: "official-agency-guidance",
      versionOrPublicationDate: m.publication,
      checkedDate: CHECKED,
    },
    applicability: null,
    reviewer: null,
    notes: `Source location researched; applicability and human review pending. ${m.caution}`,
  };
});

export const sourceMappingProblems = sourceMappedClaims.flatMap(inspectClaimReview);
