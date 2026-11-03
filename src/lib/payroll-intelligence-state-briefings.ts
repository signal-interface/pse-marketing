/**
 * Human-readable, narrowly scoped 2026 educational excerpts of official state sources.
 * Not an employer-specific compliance decision, operational rule store or complete
 * 50-state catalog. Source publication is founder-authorized education only.
 */
import { stateSourceIntake } from "./payroll-intelligence-state-research";

export type StateBriefing = {
 state: string;
 topic: string;
 pinpoint: string;
 finding: string;
 caution: string;
 sourceUrl: string;
 sourceTitle: string;
 checkedOn: "2026-11-03";
 publicationType: "sourced-educational-briefing";
 qualifiedLegalApproval: false;
};
export const stateBriefings: readonly StateBriefing[] = [
  {state:"NY", topic:"Pay frequency", pinpoint:"NY Labor Law §191", finding:"NYSDOL explains that manual workers generally receive weekly pay, while clerical and other covered workers receive pay at least twice per month. Certain employers may seek permission to pay manual workers less frequently.", caution:"Worker classification and permission-to-pay exceptions require separate analysis.", sourceUrl:"https://dol.ny.gov/frequency-pay", sourceTitle:"New York State Department of Labor, Frequency of Pay", checkedOn:"2026-11-03", publicationType:"sourced-educational-briefing", qualifiedLegalApproval:false},
  {state:"NJ", topic:"Pay frequency", pinpoint:"N.J.S.A. 34:11-4.2", finding:"New Jersey generally calls for payment of wages at least twice each calendar month on designated regular paydays. A less frequent schedule applies to certain executive, supervisory, or special classes, provided the statutory conditions are met.", caution:"Payday changes, employee classification and collective bargaining exceptions require review.", sourceUrl:"https://www.nj.gov/labor/wageandhour/tools-resources/laws/selectedstatelaborlaws.shtml", sourceTitle:"New Jersey Department of Labor, Selected State Labor Laws", checkedOn:"2026-11-03", publicationType:"sourced-educational-briefing", qualifiedLegalApproval:false},
  {state:"CT", topic:"Pay frequency", pinpoint:"Conn. Gen. Stat. §§31-71b(a)(1), 31-71i", finding:"Connecticut's current statute permits employers generally to pay wages weekly or once every two weeks on established regular paydays. The Labor Commissioner may authorize certain less frequent pay periods.", caution:"The current statutory text takes precedence over older agency summaries that describe a weekly-only default. Check statutory exceptions and authorization requirements.", sourceUrl:"https://www.cga.ct.gov/current/pub/chap_558.htm", sourceTitle:"Connecticut General Assembly, Chapter 558", checkedOn:"2026-11-03", publicationType:"sourced-educational-briefing", qualifiedLegalApproval:false},
  {state:"CA", topic:"Final wages", pinpoint:"Cal. Labor Code §§201, 202, 203, 227.3", finding:"California's labor agency states that earned wages are generally due immediately upon discharge. For an employee who quits, the payment timing depends on whether at least 72 hours' prior notice was provided, subject to statutory and industry exceptions.", caution:"Separate treatment applies to earned commissions, accrued vacation, mail requests, method of payment, certain industries, and possible waiting-time penalties.", sourceUrl:"https://www.dir.ca.gov/dlse/faq_paydays.htm", sourceTitle:"California Division of Labor Standards Enforcement, Paydays and Final Wages", checkedOn:"2026-11-03", publicationType:"sourced-educational-briefing", qualifiedLegalApproval:false},
  {state:"WA", topic:"Final wages", pinpoint:"Washington L&I: Getting Paid / Final paychecks", finding:"Washington L&I states that when an employee quits or is fired, the final paycheck must be paid on or before the next regularly scheduled payday.", caution:"Review authorized deductions, paid sick leave and other promised benefits separately; withholding pay for unreturned equipment is restricted.", sourceUrl:"https://lni.wa.gov/workers-rights/wages/getting-paid/", sourceTitle:"Washington Department of Labor & Industries, Getting Paid", checkedOn:"2026-11-03", publicationType:"sourced-educational-briefing", qualifiedLegalApproval:false},
  {state:"IL", topic:"Final compensation", pinpoint:"820 ILCS 115/5; Illinois DOL FAQ questions 8 and 11", finding:"Illinois DOL explains that final compensation should be paid at separation if possible, and no later than the next regularly scheduled payday. Earned vacation, commissions and bonuses may form part of final compensation.", caution:"Which compensation is earned can depend on the agreement, applicable law and precise employment facts. Sick leave and severance have different rules.", sourceUrl:"https://labor.illinois.gov/faqs/wage-payment-faq.html", sourceTitle:"Illinois Department of Labor, Wage Payment and Collection Act FAQ", checkedOn:"2026-11-03", publicationType:"sourced-educational-briefing", qualifiedLegalApproval:false},
  {state:"CO", topic:"Regular wage payments", pinpoint:"C.R.S. §8-4-103(1)(a)", finding:"Colorado's agency-published Wage Act establishes regular wage-pay periods no longer than one calendar month or 30 days, whichever is longer, and generally requires regular paydays no later than ten days after the pay period, unless an authorized alternative applies.", caution:"Confirm the current statutory amendments, employer-worker agreement, special classes and separate final-pay requirements. The cited statutory text was published August 2025.", sourceUrl:"https://cdle.colorado.gov/sites/cdle/files/colorado_wage_act_revised_august_6_2025.pdf", sourceTitle:"Colorado Department of Labor and Employment, Colorado Wage Act (Aug 2025)", checkedOn:"2026-11-03", publicationType:"sourced-educational-briefing", qualifiedLegalApproval:false},
  {state:"FL", topic:"Minimum wage", pinpoint:"Florida Constitution, Art. X, §24; FloridaCommerce notice", finding:"FloridaCommerce states the Florida minimum wage is $15.00 per hour effective September 30, 2026, and specifies that rate through December 31, 2027 on its published notice.", caution:"Tipped employees have separate cash-wage rules, and coverage and exemptions require review. Verify subsequently published notices before applying a rate.", sourceUrl:"https://floridajobs.org/florida-minimum-wage", sourceTitle:"Florida Department of Commerce, Florida Minimum Wage", checkedOn:"2026-11-03", publicationType:"sourced-educational-briefing", qualifiedLegalApproval:false},
  {state:"GA", topic:"Minimum wage interaction", pinpoint:"O.C.G.A. §34-4-3; federal FLSA", finding:"Georgia DOL lists a Georgia minimum wage of $5.15 per hour but explains that the federal minimum wage generally applies with limited exceptions, so covered employees may be subject to the federal rate.", caution:"Coverage under federal law, statutory exceptions, tipped workers and the controlling higher applicable law must be evaluated before applying any rate.", sourceUrl:"https://dol.georgia.gov/minimum-wage", sourceTitle:"Georgia Department of Labor, Minimum Wage", checkedOn:"2026-11-03", publicationType:"sourced-educational-briefing", qualifiedLegalApproval:false},
  {state:"PA", topic:"Prevailing wage legislation", pinpoint:"2026 Pennsylvania Act 101, enacted from SB 908", finding:"Pennsylvania Act 101, approved October 22, 2026, amends the Pennsylvania Prevailing Wage Act concerning specifications and duties of the Secretary; its effective date is 60 days after approval.", caution:"This is a public-works prevailing-wage development, not a change to ordinary pay frequency under the Wage Payment and Collection Law. Its substantive provisions and covered projects need separate review.", sourceUrl:"https://www.palegis.us/legislation/bills/2025/SB908", sourceTitle:"Pennsylvania General Assembly, SB 908 / Act 101 of 2026", checkedOn:"2026-11-03", publicationType:"sourced-educational-briefing", qualifiedLegalApproval:false},
  {state:"TX", topic:"Final wages", pinpoint:"Tex. Labor Code §61.014; TWC Final Pay", finding:"Texas Workforce Commission explains that regular wages after involuntary separation generally must be paid within six calendar days, while voluntarily separated employees generally receive final regular wages on the next scheduled payday.", caution:"The separation classification, written compensation agreements, commissions, benefits and special exceptions need case-specific review.", sourceUrl:"https://efte.twc.texas.gov/final_pay.html", sourceTitle:"Texas Workforce Commission, Final Pay", checkedOn:"2026-11-03", publicationType:"sourced-educational-briefing", qualifiedLegalApproval:false},
];

export function validateStateBriefings(): readonly string[] {
 const errors: string[] = [];
 const sourceStates = new Set(stateSourceIntake.map(s=>s.state));
 const briefStates = new Set<string>();
 for(const b of stateBriefings) {
  if(!sourceStates.has(b.state))errors.push(`Unknown state: ${b.state}`);
  if(briefStates.has(b.state))errors.push(`Duplicate briefing: ${b.state}`);
  briefStates.add(b.state);
  if(!b.sourceUrl.startsWith("https://"))errors.push(`Missing HTTPS official source: ${b.state}`);
  if(!b.pinpoint.trim() || b.finding.length<35 || b.caution.length<35)errors.push(`Incomplete content: ${b.state}`);
  if(b.qualifiedLegalApproval!==false)errors.push(`False legal review claim: ${b.state}`);
 }
 if(stateBriefings.length!==stateSourceIntake.length)errors.push("Unmatched intake and briefing coverage");
 return errors;
}
