/**
 * Editorially reviewed external sources are essential before any page can be labeled approved.
 * These briefing drafts deliberately avoid client-specific rules and state-specific thresholds.
 */
export type Briefing = {
 slug:string; title:string; domain:string; summary:string; checked:string; status:"editorial-draft";
 keyPoints:string[]; controlChecklist:string[];
 sources:{title:string;url:string;relevance:string}[];
};
export const briefings:Briefing[]=[
 {
  slug:"2026-federal-withholding-control-review",
  title:"Federal withholding: 2026 control review", domain:"06 · Withholding & Employment Taxes",
  summary:"A payroll assurance checklist to help employers validate the applicability of current IRS withholding methods while distinguishing PSE oversight from employer calculation and remittance obligations.",
  checked:"2026-11-03", status:"editorial-draft",
  keyPoints:[
   "Publication 15-T (2026) describes federal income-tax withholding methods, including an automated percentage method and wage-bracket tables.",
   "The method requires the correct tax-year materials, pay frequency and employee Form W-4 details; older Forms W-4 may require different input handling.",
   "The employer's payroll system remains responsible for its calculations, withholding and submission obligations. PSE's educational control list addresses verification and evidence.",
  ],
  controlChecklist:[
   "Document the federal tax year, pay date, payroll frequency and IRS table version used by the employer's payroll system.",
   "Confirm the employee Form W-4 version and relevant elections are supported by the selected withholding method.",
   "Select anonymized representative payroll scenarios spanning pay frequencies, supplemental wages and prior-year W-4 forms, where applicable.",
   "Reconcile exception cases to documented calculation results and investigate configuration drift.",
   "Retain approvals, review evidence and any corrections under the employer's retention policy.",
  ],
  sources:[
   {title:"IRS Publication 15-T (2026)",url:"https://www.irs.gov/publications/p15t",relevance:"Federal income-tax withholding methods and tables"},
   {title:"IRS Publication 15 (2026)",url:"https://www.irs.gov/publications/p15",relevance:"Employment tax and wage withholding obligations"},
  ]
 },
 {
  slug:"2026-federal-tax-deposit-controls",
  title:"Federal employment-tax deposits: schedule and reconciliation controls",
  domain:"08 · Tax Deposits & Reporting",
  summary:"A control framework for evaluating deposit classification, liability tracking and audit evidence against IRS Publication 15 (2026).",
  checked:"2026-11-03", status:"editorial-draft",
  keyPoints:[
   "For Form 941 filers, Publication 15 generally distinguishes monthly from semiweekly deposit schedules using a defined lookback period: $50,000 or less generally corresponds to monthly, and more than $50,000 to semiweekly.",
   "The IRS remittance timetable differs from the employer's payroll frequency. The $100,000 next-day deposit rule and other exceptions can affect the obligation.",
   "Applicable federal employment-tax deposits are generally made electronically; narrow exceptions for payment with a return must be evaluated against current IRS rules.",
  ],
  controlChecklist:[
   "Confirm return type, taxpayer account, lookback window and documented monthly or semiweekly classification.",
   "Review special deposit triggers, including the $100,000 next-day rule, and applicable business-day adjustments.",
   "Compare payroll-date tax liability records with deposit timing and amounts; investigate outstanding differences.",
   "Reconcile quarterly Forms 941 and Schedule B where applicable against liability detail and deposits.",
   "Maintain evidence of schedule determination, changes, exceptions, remittance confirmations and approvals.",
  ],
  sources:[{title:"IRS Publication 15 (2026), section 11",url:"https://www.irs.gov/publications/p15",relevance:"Federal employment-tax deposit requirements and lookback rules"}]
 },
 {
  slug:"flsa-recordkeeping-control-baseline",
  title:"FLSA recordkeeping: retention and evidence controls",
  domain:"10 · Records, Retention & Privacy",
  summary:"A federal minimum recordkeeping baseline, with a separate review requirement for state, local and other retention obligations.",
  checked:"2026-11-03", status:"editorial-draft",
  keyPoints:[
   "DOL Fact Sheet #21 describes record information covered employers must retain under the Fair Labor Standards Act.",
   "Federal FLSA payroll records are generally retained for at least three years; records used in wage computations, including timecards and wage-rate tables, generally for two years.",
   "These federal periods are not a universal deletion schedule: longer state, local, IRS, contractual, litigation-hold and other obligations may apply.",
  ],
  controlChecklist:[
   "Inventory payroll, wage, time and rate records and document system-of-record ownership.",
   "Map document categories to federal and applicable state/local requirements and preserve the longest applicable period.",
   "Verify timestamps, audit trails and retrieval capability on representative sample records.",
   "Enforce role-based access and secure disposal only after retention and legal-hold review.",
   "Document any evidence gaps, corrective actions and owner sign-off.",
  ],
  sources:[{title:"U.S. DOL Fact Sheet #21: Recordkeeping Requirements under FLSA",url:"https://www.dol.gov/agencies/whd/fact-sheets/21-flsa-recordkeeping",relevance:"Federal FLSA recordkeeping content and minimum retention periods"}]
 }
 {
  slug:"2026-worker-classification-federal-tax",
  title:"Worker status: federal employment-tax classification",
  domain:"01 · Workforce Classification & Employer Obligations",
  summary:"An original federal-tax reference explaining why a contractor label or contract alone is not a complete worker-status analysis.",
  checked:"2026-11-03",status:"editorial-draft",
  keyPoints:[
   "IRS Publication 15-A describes common-law employees, independent contractors, statutory employees and statutory nonemployees as distinct classifications for federal employment taxes.",
   "For the federal common-law analysis, the IRS examines behavioral control, financial control and the type of relationship; no single document or factor is necessarily decisive.",
   "Classification under federal wage-and-hour rules and individual state laws can differ from the federal employment-tax analysis; independent jurisdictional review remains necessary.",
  ],
  controlChecklist:[
   "Document the role, business relationship, operational supervision, financial independence and supporting agreements.",
   "Confirm that federal tax, wage-hour, state/local and benefit classifications are not automatically assumed to match.",
   "Record decisions, reviewers, changes in circumstances and any escalated legal or tax questions.",
   "Inspect onboarding and information-return mapping for consistency with the documented determination.",
  ],
  sources:[{title:"IRS Publication 15-A (2026), sections 1–2",url:"https://www.irs.gov/publications/p15a",relevance:"Federal employment-tax worker categories and common-law classification factors"}],
 },
 {
  slug:"flsa-regular-rate-assurance",
  title:"Overtime assurance: regular-rate inputs and exclusions",
  domain:"02 · Wage & Hour Compliance",
  summary:"A federal FLSA regular-rate control briefing focused on earnings mapping and reviewing overtime exceptions.",
  checked:"2026-11-03",status:"editorial-draft",
  keyPoints:[
   "For most covered nonexempt employees, FLSA overtime is due for hours exceeding 40 in a workweek at not less than one and one-half times the regular rate.",
   "The DOL describes the regular rate as total compensation in a workweek, subject to statutory exclusions, divided by hours actually worked in that workweek.",
   "Exclusions are limited by statute and the factual circumstances; a bonus or commission code cannot be excluded merely because a payroll system labels it separately.",
   "State or local law and collective bargaining arrangements can require additional analysis and more protective treatment.",
  ],
  controlChecklist:[
   "Identify which earning codes contribute to the regular-rate numerator and document each exclusion's legal basis.",
   "Select representative overtime workweeks containing bonuses, commissions, different rates and premiums.",
   "Reconcile timesheet hours, included earnings and exception reports without relying solely on stored payroll configuration.",
   "Review state-specific daily overtime and other rules independently and retain the decision record.",
  ],
  sources:[{title:"U.S. DOL Fact Sheet #56A, Regular Rate under FLSA",url:"https://www.dol.gov/agencies/whd/fact-sheets/56a-regular-rate",relevance:"Regular-rate principles and statutory exclusions"},
   {title:"U.S. DOL Fact Sheet #23, Overtime Pay Requirements",url:"https://www.dol.gov/agencies/whd/fact-sheets/23-flsa-overtime-pay",relevance:"General FLSA overtime obligation"}],
 },
 {
  slug:"2026-taxable-fringe-benefits",
  title:"2026 fringe benefits: federal taxability and valuation controls",
  domain:"03 · Compensation & Taxability",
  summary:"A federal employment-tax overview separating potentially taxable fringe benefits from benefit-specific exclusions.",
  checked:"2026-11-03",status:"editorial-draft",
  keyPoints:[
   "IRS Publication 15-B (2026) generally treats fringe benefits as taxable unless a specific exclusion applies.",
   "The taxability, employment-tax treatment, eligibility and reporting rules differ by benefit type and recipient; an exclusion should not be assumed merely because the benefit is noncash.",
   "Publication 15-B includes valuation methods and special accounting rules for certain taxable noncash fringe benefits; these do not remove applicable reporting obligations.",
  ],
  controlChecklist:[
   "Maintain an independently reviewed inventory of employer-provided benefits and excluded or taxable treatment.",
   "Document valuation, recipient category, amounts paid by employees and eligibility for each applicable exclusion.",
   "Reconcile taxable fringe additions and employer reporting against applicable payroll and year-end wage records.",
   "Record the tax-year version and revise mappings when agency guidance changes.",
  ],
  sources:[{title:"IRS Publication 15-B (2026), Employer's Tax Guide to Fringe Benefits",url:"https://www.irs.gov/publications/p15b",relevance:"Federal fringe-benefit exclusions, valuation and employment-tax treatment"}],
 },
 {
  slug:"2026-health-fsa-pretax-review",
  title:"2026 health FSA elections and payroll deduction assurance",
  domain:"04 · Benefits, Leave & Retirement",
  summary:"A focused 2026 federal cafeteria-plan control review for benefit elections, limits and payroll deduction evidence.",
  checked:"2026-11-03",status:"editorial-draft",
  keyPoints:[
   "Publication 15-B (2026) states a $3,400 employee health FSA salary-reduction contribution limit for plan years beginning in 2026.",
   "The plan-year limit, plan document, eligibility rules and applicable nondiscrimination requirements are distinct questions from whether payroll deductions reconcile to elections.",
   "Employer benefit controls should distinguish health FSA from dependent-care, HSA, HRA and other benefit types, each with different requirements.",
  ],
  controlChecklist:[
   "Document plan-year boundaries, benefit type, election effective dates and authorized deduction amount.",
   "Review elections and year-to-date deductions against the governing plan and the verified applicable federal limit.",
   "Assess midyear election changes and special categories with benefits administrators and appropriate subject experts.",
   "Reconcile benefit enrollment outputs to payroll records and preserve exception approvals.",
  ],
  sources:[{title:"IRS Publication 15-B (2026), cafeteria plans and health FSAs",url:"https://www.irs.gov/publications/p15b",relevance:"2026 health FSA salary-reduction limit and cafeteria plan requirements"}],
 },
{
  "slug": "payday-frequency-review",
  "title": "Pay frequency and final wages",
  "domain": "05 · Employee Pay Delivery",
  "summary": "State payday requirements differ, including timing and worker-category exceptions.",
  "checked": "2026-11-03",
  "status": "editorial-draft",
  "keyPoints": [
    "The DOL state payday table is historical and cannot replace current state labor-agency review.",
    "The content is a federal or general control starting point; review the employer's applicable state, local and cross-border obligations before relying on it."
  ],
  "controlChecklist": [
    "Validate pay frequency, final-pay rules, worksite and payment methods by jurisdiction.",
    "Review termination samples, pay statements, payment evidence and approved exceptions.",
    "Record source versions, reviewer decisions, applicability exceptions and corrective action approvals."
  ],
  "sources": [
    {
      "title": "U.S. DOL state payday requirements",
      "url": "https://www.dol.gov/agencies/whd/state/payday",
      "relevance": "Primary federal or general guidance; editorial control mapping is independently authored"
    }
  ]
},
{
  "slug": "unemployment-tax-review",
  "title": "Unemployment tax account assurance",
  "domain": "07 · Unemployment & Disability Programs",
  "summary": "FUTA and state unemployment insurance require distinct account and wage-base controls.",
  "checked": "2026-11-03",
  "status": "editorial-draft",
  "keyPoints": [
    "Federal IRS guidance does not replace state agency rate notices, reporting rules or employer account decisions.",
    "The content is a federal or general control starting point; review the employer's applicable state, local and cross-border obligations before relying on it."
  ],
  "controlChecklist": [
    "Verify employer registrations, rate notices, wage-base setup and state reporting periods.",
    "Reconcile unemployment liabilities, rate changes, tax returns and exception approvals.",
    "Record source versions, reviewer decisions, applicability exceptions and corrective action approvals."
  ],
  "sources": [
    {
      "title": "IRS Publication 15",
      "url": "https://www.irs.gov/publications/p15",
      "relevance": "Primary federal or general guidance; editorial control mapping is independently authored"
    }
  ]
},
{
  "slug": "garnishment-review",
  "title": "Wage garnishment controls",
  "domain": "09 · Payroll Deductions",
  "summary": "Federal CCPA restrictions and order-specific rules warrant documented payroll review.",
  "checked": "2026-11-03",
  "status": "editorial-draft",
  "keyPoints": [
    "Federal protections against certain garnishment practices coexist with different rules for child support, taxes and applicable state requirements.",
    "The content is a federal or general control starting point; review the employer's applicable state, local and cross-border obligations before relying on it."
  ],
  "controlChecklist": [
    "Review order type, disposable earnings methodology and limits supported by current authority.",
    "Reconcile deductions and maintain order, notice, escalation and remittance evidence.",
    "Record source versions, reviewer decisions, applicability exceptions and corrective action approvals."
  ],
  "sources": [
    {
      "title": "DOL Federal Wage Garnishments",
      "url": "https://www.dol.gov/agencies/whd/wage-garnishment",
      "relevance": "Primary federal or general guidance; editorial control mapping is independently authored"
    }
  ]
},
{
  "slug": "payroll-accounting-assurance",
  "title": "Payroll financial reconciliation",
  "domain": "11 · Payroll Accounting & Assurance",
  "summary": "General-ledger reconciliation is an employer assurance control, not a single federally prescribed journal-entry model.",
  "checked": "2026-11-03",
  "status": "editorial-draft",
  "keyPoints": [
    "The IRS identifies categories of employment-tax records employers should retain for review; financial controls must also reflect accounting policies.",
    "The content is a federal or general control starting point; review the employer's applicable state, local and cross-border obligations before relying on it."
  ],
  "controlChecklist": [
    "Map wage, deduction, benefit and tax categories to approved accounts and evidence owners.",
    "Review unmatched ledger differences, outstanding liability balances and corrections.",
    "Record source versions, reviewer decisions, applicability exceptions and corrective action approvals."
  ],
  "sources": [
    {
      "title": "IRS Employment Tax Recordkeeping",
      "url": "https://www.irs.gov/businesses/small-businesses-self-employed/employment-tax-recordkeeping",
      "relevance": "Primary federal or general guidance; editorial control mapping is independently authored"
    }
  ]
},
{
  "slug": "payroll-technology-controls",
  "title": "Payroll technology and resilience",
  "domain": "12 · Payroll Technology & Resilience",
  "summary": "NIST CSF 2.0 provides voluntary security-risk guidance that can inform PSE assurance checklists.",
  "checked": "2026-11-03",
  "status": "editorial-draft",
  "keyPoints": [
    "Cybersecurity framework guidance does not by itself establish payroll statutory compliance.",
    "The content is a federal or general control starting point; review the employer's applicable state, local and cross-border obligations before relying on it."
  ],
  "controlChecklist": [
    "Review access, segregation of duties, change approvals and data-interface ownership.",
    "Document recovery tests, interface exceptions, privacy review and approvals.",
    "Record source versions, reviewer decisions, applicability exceptions and corrective action approvals."
  ],
  "sources": [
    {
      "title": "NIST Cybersecurity Framework",
      "url": "https://www.nist.gov/cyberframework",
      "relevance": "Primary federal or general guidance; editorial control mapping is independently authored"
    }
  ]
},
{
  "slug": "payroll-leadership-controls",
  "title": "Payroll operating-model assurance",
  "domain": "13 · Payroll Management & Leadership",
  "summary": "PSE recommendations for quality oversight, responsibility mapping and payroll continuity.",
  "checked": "2026-11-03",
  "status": "editorial-draft",
  "keyPoints": [
    "Leadership controls and performance indicators here are recommended practices rather than requirements issued by the cited agency.",
    "The content is a federal or general control starting point; review the employer's applicable state, local and cross-border obligations before relying on it."
  ],
  "controlChecklist": [
    "Define control owners, escalation paths, backup coverage and periodic quality reviews.",
    "Record review completion, aged exceptions, root-cause findings and continuity exercises.",
    "Record source versions, reviewer decisions, applicability exceptions and corrective action approvals."
  ],
  "sources": [
    {
      "title": "DOL Employer Resources",
      "url": "https://www.dol.gov/agencies/whd/employers",
      "relevance": "Primary federal or general guidance; editorial control mapping is independently authored"
    }
  ]
},
{
  "slug": "international-payroll-assessment",
  "title": "Cross-border payroll review",
  "domain": "14 · Cross-Border & International Payroll",
  "summary": "IRS Publication 54 provides U.S. individual-tax context for certain Americans working abroad.",
  "checked": "2026-11-03",
  "status": "editorial-draft",
  "keyPoints": [
    "U.S. individual income-tax treatment does not alone determine foreign employer withholding, labor-law or social-security duties.",
    "The content is a federal or general control starting point; review the employer's applicable state, local and cross-border obligations before relying on it."
  ],
  "controlChecklist": [
    "Review residence, country of work, employer entity, treaty and totalization considerations.",
    "Retain country-specific professional review, assignment records and reconciliation evidence.",
    "Record source versions, reviewer decisions, applicability exceptions and corrective action approvals."
  ],
  "sources": [
    {
      "title": "IRS Publication 54 (2025 edition)",
      "url": "https://www.irs.gov/publications/p54",
      "relevance": "Primary federal or general guidance; editorial control mapping is independently authored"
    }
  ]
},
{
  "slug": "payroll-competency-model",
  "title": "Professional payroll practice",
  "domain": "15 · Payroll Capability & Professional Practice",
  "summary": "An original PSE educational practice model for source literacy, ethics and continuing learning.",
  "checked": "2026-11-03",
  "status": "editorial-draft",
  "keyPoints": [
    "IRS guidance is a source for federal taxes, not an authority for independent credentialing standards.",
    "The content is a federal or general control starting point; review the employer's applicable state, local and cross-border obligations before relying on it."
  ],
  "controlChecklist": [
    "Maintain role-specific competency inventories, ethics escalation rules and up-to-date source reviews.",
    "Use anonymized original exercises and preserve learning, review and approval evidence.",
    "Record source versions, reviewer decisions, applicability exceptions and corrective action approvals."
  ],
  "sources": [
    {
      "title": "IRS Employment Taxes",
      "url": "https://www.irs.gov/businesses/small-businesses-self-employed/employment-taxes",
      "relevance": "Primary federal or general guidance; editorial control mapping is independently authored"
    }
  ]
}
];
