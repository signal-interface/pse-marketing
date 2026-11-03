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
  summary:"A payroll assurance checklist to help employers validate the applicability of current IRS withholding methods without suggesting that PSE computes or remits payroll.",
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
   "The deposit schedule is not simply the employer's payroll frequency. The $100,000 next-day deposit rule and other exceptions can affect the obligation.",
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
];
