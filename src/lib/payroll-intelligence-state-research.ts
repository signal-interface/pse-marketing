/**
 * PSE Payroll Intelligence 2026-Q4 state research intake.
 * Research-only, NOT an operational compliance decision engine, calculator,
 * legal opinion, or content authorized for public regulatory publication.
 *
 * All statements are scope-qualified starting points from state authorities.
 * Every jurisdiction still requires employer/worker applicability, exact rule
 * version and local overlay checks before any separately approved publication.
 */
export type StateSourceIntake = {
  state: string;
  stateName: string;
  topic: "wage-payment" | "final-wages" | "minimum-wage";
  preliminaryStatement: string;
  authority: { agency: string; title: string; url: string; pinpoint: string; kind: "statute" | "agency-guidance" | "agency-published-statute" };
  sourceCheckedOn: "2026-11-03";
  effectiveDateStatus: "needs-rule-specific-verification";
  applicabilityStatus: "unassessed";
  localOverlayStatus: "not-reviewed";
  reviewStatus: "research-intake";
  authorizedForPublicRegulatoryClaims: false;
  caveat: string;
};

export const stateSourceIntake: readonly StateSourceIntake[] = [
  {
    state: "NY", stateName: "New York", topic:"wage-payment",
    preliminaryStatement:"New York describes weekly pay for manual workers and at least twice-monthly pay for clerical and other covered workers; statutory categories and approved exceptions matter.",
    authority:{agency:"New York State Department of Labor",title:"Frequency of Pay",url:"https://dol.ny.gov/frequency-pay",pinpoint:"Frequency of Pay; employer permission for less-frequent manual-worker payments",kind:"agency-guidance"},
    sourceCheckedOn:"2026-11-03",effectiveDateStatus:"needs-rule-specific-verification",applicabilityStatus:"unassessed",localOverlayStatus:"not-reviewed",reviewStatus:"research-intake",authorizedForPublicRegulatoryClaims:false,
    caveat:"Section 191 has worker classifications and permissible exceptions; examine NY Labor Law §191 and current NYSDOL guidance.",
  },
  {
    state:"NJ", stateName:"New Jersey",topic:"wage-payment",
    preliminaryStatement:"New Jersey generally requires wages paid at least twice per calendar month, with a less-frequent schedule for specified executive, supervisory or other special workers.",
    authority:{agency:"New Jersey Department of Labor and Workforce Development",title:"Selected NJ State Labor Laws and Regulations",url:"https://www.nj.gov/labor/wageandhour/tools-resources/laws/selectedstatelaborlaws.shtml",pinpoint:"N.J.S.A. 34:11-4.2, Time and mode of payment; paydays",kind:"agency-published-statute"},
    sourceCheckedOn:"2026-11-03",effectiveDateStatus:"needs-rule-specific-verification",applicabilityStatus:"unassessed",localOverlayStatus:"not-reviewed",reviewStatus:"research-intake",authorizedForPublicRegulatoryClaims:false,
    caveat:"Check statutory exceptions, employment type, collective bargaining agreements, and state guidance for actual pay-date requirements.",
  },
  {
    state:"CT",stateName:"Connecticut",topic:"wage-payment",
    preliminaryStatement:"Connecticut General Statutes §31-71b(a)(1) provides weekly or once-every-two-weeks payment for generally covered employees; §31-71i addresses commissioner-authorized less-frequent schedules.",
    authority:{agency:"Connecticut General Assembly",title:"Chapter 558 — Wages (current statutes)",url:"https://www.cga.ct.gov/current/pub/chap_558.htm",pinpoint:"Conn. Gen. Stat. §31-71b(a)(1), weekly or every two weeks; §31-71i, commissioner waiver",kind:"statute"},
    sourceCheckedOn:"2026-11-03",effectiveDateStatus:"needs-rule-specific-verification",applicabilityStatus:"unassessed",localOverlayStatus:"not-reviewed",reviewStatus:"research-intake",authorizedForPublicRegulatoryClaims:false,
    caveat:"The agency overview may still describe a weekly default; the controlling statutory wording permits weekly or biweekly payment. Check special categories and commissioner-authorized alternatives.",
  },
  {
    state:"CA",stateName:"California",topic:"final-wages",
    preliminaryStatement:"California's final-pay timing distinguishes employer discharge from voluntary departure and the amount of advance resignation notice.",
    authority:{agency:"California Department of Industrial Relations",title:"Paydays, pay periods and final wages",url:"https://www.dir.ca.gov/dlse/faq_paydays.htm",pinpoint:"Final wages, California Labor Code §§201–203; termination and resignation timing",kind:"agency-guidance"},
    sourceCheckedOn:"2026-11-03",effectiveDateStatus:"needs-rule-specific-verification",applicabilityStatus:"unassessed",localOverlayStatus:"not-reviewed",reviewStatus:"research-intake",authorizedForPublicRegulatoryClaims:false,
    caveat:"Industry-specific exceptions, commissions, accrued vacation, waiting-time penalties and California locality rules require separate review.",
  },
  {
    state:"WA",stateName:"Washington",topic:"final-wages",
    preliminaryStatement:"Washington's L&I explains that an employee's final paycheck is generally payable no later than the next regularly scheduled payday.",
    authority:{agency:"Washington State Department of Labor & Industries",title:"Getting Paid",url:"https://lni.wa.gov/workers-rights/wages/getting-paid/",pinpoint:"Paychecks → Final paychecks",kind:"agency-guidance"},
    sourceCheckedOn:"2026-11-03",effectiveDateStatus:"needs-rule-specific-verification",applicabilityStatus:"unassessed",localOverlayStatus:"not-reviewed",reviewStatus:"research-intake",authorizedForPublicRegulatoryClaims:false,
    caveat:"Review separate paid sick leave, promised benefits, deductions, contract and local provisions.",
  },
  {
    state:"IL",stateName:"Illinois",topic:"final-wages",
    preliminaryStatement:"Illinois' Wage Payment and Collection Act FAQ states final compensation is payable by the next regularly scheduled payday, and lists items including earned commissions, bonuses and vacation.",
    authority:{agency:"Illinois Department of Labor",title:"Wage Payment and Collection Act FAQ",url:"https://labor.illinois.gov/faqs/wage-payment-faq.html",pinpoint:"FAQ Q8 and Q11, final compensation; 820 ILCS 115/5",kind:"agency-guidance"},
    sourceCheckedOn:"2026-11-03",effectiveDateStatus:"needs-rule-specific-verification",applicabilityStatus:"unassessed",localOverlayStatus:"not-reviewed",reviewStatus:"research-intake",authorizedForPublicRegulatoryClaims:false,
    caveat:"Determine whether compensation is earned under the applicable agreement and whether different requirements apply to the employer.",
  },
  {
    state:"CO",stateName:"Colorado",topic:"wage-payment",
    preliminaryStatement:"Colorado Wage Act §8-4-103 establishes regular pay-period and payday rules, subject to the statutory text and specified alternatives.",
    authority:{agency:"Colorado Department of Labor and Employment",title:"Colorado Wage Act (agency-published text)",url:"https://cdle.colorado.gov/sites/cdle/files/colorado_wage_act_revised_august_6_2025.pdf",pinpoint:"C.R.S. §8-4-103(1)(a), regular wage payments",kind:"agency-published-statute"},
    sourceCheckedOn:"2026-11-03",effectiveDateStatus:"needs-rule-specific-verification",applicabilityStatus:"unassessed",localOverlayStatus:"not-reviewed",reviewStatus:"research-intake",authorizedForPublicRegulatoryClaims:false,
    caveat:"This is agency-published August 2025 statutory text; confirm all legislative amendments, exceptions and 2026 state/local overlays before legal reliance.",
  },
  {
    state:"FL",stateName:"Florida",topic:"minimum-wage",
    preliminaryStatement:"Florida's Department of Commerce states the statewide minimum wage became $15.00 per hour effective September 30, 2026.",
    authority:{agency:"Florida Department of Commerce",title:"Florida Minimum Wage",url:"https://floridajobs.org/florida-minimum-wage",pinpoint:"Florida's Minimum Wage — effective September 30, 2026",kind:"agency-guidance"},
    sourceCheckedOn:"2026-11-03",effectiveDateStatus:"needs-rule-specific-verification",applicabilityStatus:"unassessed",localOverlayStatus:"not-reviewed",reviewStatus:"research-intake",authorizedForPublicRegulatoryClaims:false,
    caveat:"Official state guidance identifies the $15 hourly rate as applicable September 30, 2026 through December 31, 2027; separately review tipped-employee treatment, covered workers, exemptions, and later notices.",
  },
  {
    state:"GA",stateName:"Georgia",topic:"minimum-wage",
    preliminaryStatement:"Georgia DOL describes a state minimum-wage law and explains that the federal minimum wage applies to many covered employees; the interaction depends on coverage and exceptions.",
    authority:{agency:"Georgia Department of Labor",title:"Minimum Wage",url:"https://dol.georgia.gov/minimum-wage",pinpoint:"Georgia's Minimum Wage and federal applicability; O.C.G.A. §34-4-3",kind:"agency-guidance"},
    sourceCheckedOn:"2026-11-03",effectiveDateStatus:"needs-rule-specific-verification",applicabilityStatus:"unassessed",localOverlayStatus:"not-reviewed",reviewStatus:"research-intake",authorizedForPublicRegulatoryClaims:false,
    caveat:"Do not apply the state numeric minimum without checking FLSA coverage, exemptions and the controlling higher applicable wage requirement.",
  },
  {
    state:"PA",stateName:"Pennsylvania",topic:"wage-payment",
    preliminaryStatement:"Pennsylvania's Wage Payment and Collection Law governs agreed wage-payment timing, methods, deductions and payroll records.",
    authority:{agency:"Pennsylvania Department of Labor & Industry",title:"Wage Payment and Collection Complaint",url:"https://www.pa.gov/services/dli/file-a-wage-payment-and-collection-complaint",pinpoint:"Wage Payment and Collection Law overview",kind:"agency-guidance"},
    sourceCheckedOn:"2026-11-03",effectiveDateStatus:"needs-rule-specific-verification",applicabilityStatus:"unassessed",localOverlayStatus:"not-reviewed",reviewStatus:"research-intake",authorizedForPublicRegulatoryClaims:false,
    caveat:"The Wage Payment and Collection Law is distinct from Act 101 of 2026, which amends the Prevailing Wage Act (public-works scope), effective December 21, 2026. Do not describe Act 101 as changing general pay frequency.",
  },
  {
    state:"TX",stateName:"Texas",topic:"final-wages",
    preliminaryStatement:"Texas Workforce Commission guidance distinguishes involuntary separation, with final regular wages generally due within six calendar days, from voluntary separation, generally due on the next scheduled payday.",
    authority:{agency:"Texas Workforce Commission",title:"Final Pay",url:"https://efte.twc.texas.gov/final_pay.html",pinpoint:"Texas Payday Law, Tex. Labor Code §61.014; Final Pay",kind:"agency-guidance"},
    sourceCheckedOn:"2026-11-03",effectiveDateStatus:"needs-rule-specific-verification",applicabilityStatus:"unassessed",localOverlayStatus:"not-reviewed",reviewStatus:"research-intake",authorizedForPublicRegulatoryClaims:false,
    caveat:"Determine voluntary versus involuntary separation, earned commission/bonus terms and other special rules.",
  },
];

export function inspectStateSourceIntake(): readonly string[] {
  const issues: string[] = [];
  const states = new Set<string>();
  for(const row of stateSourceIntake) {
    if(states.has(row.state))issues.push(`Duplicate state ${row.state}`);
    states.add(row.state);
    if(!/^https:\/\//.test(row.authority.url))issues.push(`Non-HTTPS source ${row.state}`);
    if(!row.authority.pinpoint.trim())issues.push(`Missing pinpoint ${row.state}`);
    if(row.authorizedForPublicRegulatoryClaims!==false || row.reviewStatus!=="research-intake") issues.push(`Unsupported approval ${row.state}`);
    if(!row.caveat.trim())issues.push(`Missing caveat ${row.state}`);
  }
  return issues;
}
