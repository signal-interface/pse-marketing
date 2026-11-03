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
  expectedPrefix: string;
  title: string;
  url: string;
  pinpoint: string;
  publication: string;
  caution: string;
};

const CHECKED = "2026-11-03";
const mappings: readonly Mapping[] = [
 {slug:"2026-federal-withholding-control-review",statementIndex:0,expectedPrefix:"Publication 15-T (2026) describes federal income-tax withholding methods",title:"IRS Publication 15-T (2026)",url:"https://www.irs.gov/publications/p15t",pinpoint:"Section 1, Percentage Method Tables for Automated Payroll Systems; Worksheet 1A",publication:"2026 edition",caution:"Methods and Forms W-4 may need case-specific review"},
 {slug:"2026-federal-tax-deposit-controls",statementIndex:0,expectedPrefix:"For Form 941 filers, Publication 15 generally distinguishes monthly",title:"IRS Publication 15 (2026)",url:"https://www.irs.gov/publications/p15",pinpoint:"Section 11, Deposit Rules; Lookback Period for Form 941 Filers",publication:"2026 edition",caution:"Threshold calculation and Form 941 filer applicability require expert review"},
 {slug:"2026-federal-tax-deposit-controls",statementIndex:1,expectedPrefix:"The IRS remittance timetable differs from the employer's payroll frequency.",title:"IRS Publication 15 (2026)",url:"https://www.irs.gov/publications/p15",pinpoint:"Section 11, $100,000 Next-Day Deposit Rule",publication:"2026 edition",caution:"Next-day rule interacts with deposit period and subsequent classification"},
 {slug:"flsa-recordkeeping-control-baseline",statementIndex:1,expectedPrefix:"Federal FLSA payroll records are generally retained for at least three years",title:"DOL Fact Sheet #21",url:"https://www.dol.gov/agencies/whd/fact-sheets/21-flsa-recordkeeping",pinpoint:"How Long Should Records Be Retained",publication:"Fact Sheet #21; revision confirmation outstanding",caution:"State, tax and litigation retention requirements can be longer"},
 {slug:"2026-worker-classification-federal-tax",statementIndex:1,expectedPrefix:"For the federal common-law analysis, the IRS examines behavioral control",title:"IRS Publication 15-A (2026)",url:"https://www.irs.gov/publications/p15a",pinpoint:"Section 2, Common-Law Rules; Behavioral Control; Financial Control; Type of Relationship",publication:"2026 edition",caution:"Federal tax classification not interchangeable with state or FLSA tests"},
 {slug:"flsa-regular-rate-assurance",statementIndex:0,expectedPrefix:"For most covered nonexempt employees, FLSA overtime is due",title:"DOL Fact Sheet #56A",url:"https://www.dol.gov/agencies/whd/fact-sheets/56a-regular-rate",pinpoint:"Overview of Regular Rate of Pay; first introductory section",publication:"December 2019 fact sheet",caution:"Coverage and exemptions plus state/local rules require review"},
 {slug:"flsa-regular-rate-assurance",statementIndex:1,expectedPrefix:"The DOL describes the regular rate as total compensation in a workweek",title:"DOL Fact Sheet #56A",url:"https://www.dol.gov/agencies/whd/fact-sheets/56a-regular-rate",pinpoint:"Regular Rate formula and Exclusions from the Regular Rate",publication:"December 2019 fact sheet",caution:"Claim wording is a condensed generalization of specific statutory exclusion rules"},
 {slug:"2026-taxable-fringe-benefits",statementIndex:0,expectedPrefix:"IRS Publication 15-B (2026) generally treats fringe benefits as taxable",title:"IRS Publication 15-B (2026)",url:"https://www.irs.gov/publications/p15b",pinpoint:"Section 1, Fringe Benefit Overview; Are Fringe Benefits Taxable?",publication:"2026 edition",caution:"Recipient and benefit-category exclusions must be evaluated"},
 {slug:"2026-health-fsa-pretax-review",statementIndex:0,expectedPrefix:"Publication 15-B (2026) states a $3,400 employee health FSA",title:"IRS Publication 15-B (2026)",url:"https://www.irs.gov/publications/p15b",pinpoint:"Section 1, Cafeteria Plans; Contribution Limit on a Health FSA",publication:"2026 edition",caution:"Applies to plan years beginning in 2026, not all deduction types"},
 {slug:"garnishment-review",statementIndex:0,expectedPrefix:"Federal protections against certain garnishment practices coexist",title:"U.S. DOL, Federal Wage Garnishments",url:"https://www.dol.gov/agencies/whd/wage-garnishment",pinpoint:"Introductory CCPA overview and General Guidance; Fact Sheet #30",publication:"Current DOL WHD page, accessed 2026-11-03",caution:"State restrictions, child support and tax levies require separate treatment"},
 {slug:"payroll-accounting-assurance",statementIndex:0,expectedPrefix:"The IRS identifies categories of employment-tax records employers should retain",title:"IRS Employment Tax Recordkeeping",url:"https://www.irs.gov/businesses/small-businesses-self-employed/employment-tax-recordkeeping",pinpoint:"Records should include: wage payments, tax deposits, returns, fringe benefits, reimbursements",publication:"IRS web guidance, accessed 2026-11-03",caution:"IRS supports record evidence; any ledger-control design is independent PSE guidance"},
 {slug:"2026-federal-withholding-control-review",statementIndex:1,expectedPrefix:"The method requires the correct tax-year materials",title:"IRS Publication 15-T (2026)",url:"https://www.irs.gov/publications/p15t",pinpoint:"Introduction; How To Treat 2019 and Earlier Forms W-4 as if They Were 2020 or Later Forms W-4",publication:"2026 edition",caution:"Prior-year Form W-4 and applicable computational bridge conditions require review"},
 {slug:"2026-federal-tax-deposit-controls",statementIndex:2,expectedPrefix:"Applicable federal employment-tax deposits are generally made electronically",title:"IRS Publication 15 (2026)",url:"https://www.irs.gov/publications/p15",pinpoint:"Section 11, How To Deposit; Payment with return",publication:"2026 edition",caution:"Distinguish federal tax deposits from permissible payments with a return"},
 {slug:"flsa-recordkeeping-control-baseline",statementIndex:0,expectedPrefix:"DOL Fact Sheet #21 describes record information",title:"DOL Fact Sheet #21",url:"https://www.dol.gov/agencies/whd/fact-sheets/21-flsa-recordkeeping",pinpoint:"What Records Are Required",publication:"Current DOL fact sheet, revision confirmation pending",caution:"Scope relates to covered employers and covered workers"},
 {slug:"2026-worker-classification-federal-tax",statementIndex:0,expectedPrefix:"IRS Publication 15-A describes common-law employees",title:"IRS Publication 15-A (2026)",url:"https://www.irs.gov/publications/p15a",pinpoint:"Section 1, Who Are Employees?; Independent Contractors; Common-Law Employees; Statutory Employees; Statutory Nonemployees",publication:"2026 edition",caution:"Federal employment-tax classifications differ from other worker-status tests"},
 {slug:"flsa-regular-rate-assurance",statementIndex:2,expectedPrefix:"Exclusions are limited by statute and the factual circumstances",title:"DOL Fact Sheet #56A",url:"https://www.dol.gov/agencies/whd/fact-sheets/56a-regular-rate",pinpoint:"Exclusions from the regular rate; General Principles; 29 USC 207(e)",publication:"December 2019 fact sheet",caution:"Specific bonus and commission exclusions require case-by-case analysis"},
 {slug:"2026-taxable-fringe-benefits",statementIndex:1,expectedPrefix:"The taxability, employment-tax treatment, eligibility",title:"IRS Publication 15-B (2026)",url:"https://www.irs.gov/publications/p15b",pinpoint:"Section 1, Are Fringe Benefits Taxable?; Section 2, Table 2-1",publication:"2026 edition",caution:"Income tax withholding, FICA, FUTA and nonemployee reporting vary by benefit"},
 {slug:"2026-taxable-fringe-benefits",statementIndex:2,expectedPrefix:"Publication 15-B includes valuation methods and special accounting rules",title:"IRS Publication 15-B (2026)",url:"https://www.irs.gov/publications/p15b",pinpoint:"Section 3, Fringe Benefit Valuation Rules; Section 4, Special Accounting Rule and Reporting",publication:"2026 edition",caution:"Special accounting option is not available for all property types or benefits"},
 {slug:"2026-health-fsa-pretax-review",statementIndex:2,expectedPrefix:"Employer benefit controls should distinguish health FSA",title:"IRS Publication 15-B (2026)",url:"https://www.irs.gov/publications/p15b",pinpoint:"Section 1, Cafeteria Plans; Section 2, Dependent Care Assistance and Health Savings Accounts",publication:"2026 edition",caution:"This assertion is principally a PSE control recommendation supported by differing IRS program rules"},
];

export const sourceMappedClaims: readonly ClaimReview[] = mappings.map(m => {
  const candidates = editorialClaimInventory.filter(c => c.briefingSlug === m.slug);
  const current = candidates[m.statementIndex];
  if (!current || !current.claimText.startsWith(m.expectedPrefix)) throw new Error(`Draft statement changed or missing: ${m.slug} / ${m.statementIndex}`);
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
