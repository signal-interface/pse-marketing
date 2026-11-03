/**
 * State educational expansion batch 02 — research/education, not PSE runtime
 * rules. Exact legal interpretation still depends on employer-specific facts.
 */
import type { StateBriefing } from "./payroll-intelligence-state-briefings";

export type StateExpansionSource = StateBriefing & {
 stateName:string;
 agency:string;
 sourceKind:"official-state-guidance"|"official-state-code";
 effectiveDateCaveat:string;
};

export const additionalStateBriefings:readonly StateExpansionSource[] = [
 {
  state:"MA",stateName:"Massachusetts",topic:"Final wages",
  pinpoint:"M.G.L. c.149, §148, discharge and voluntary separation",
  finding:"Massachusetts government guidance explains that employees who are discharged generally must receive all wages due on the day of discharge, while employees who leave voluntarily are paid on the following regular payday, or the following Saturday if no regular payday exists.",
  caution:"Determine whether separation is a discharge, layoff or voluntary quit and review the treatment of earned vacation and compensation, any special employment category, and the precise wages due.",
  sourceUrl:"https://www.mass.gov/info-details/massachusetts-law-about-employment-termination",
  sourceTitle:"Massachusetts Trial Court Law Libraries, Massachusetts law about employment termination",
  agency:"Commonwealth of Massachusetts",sourceKind:"official-state-guidance",effectiveDateCaveat:"Check the current text of M.G.L. c.149, §148 and subsequent decisions.",
  checkedOn:"2026-11-03",publicationType:"sourced-educational-briefing",qualifiedLegalApproval:false,
 },
 {
  state:"OR",stateName:"Oregon",topic:"Final wages",
  pinpoint:"ORS 652.140(1)–(3), employee discharge and voluntary departure",
  finding:"Oregon BOLI explains that final wages after discharge are generally payable by the end of the next business day. An employee resigning with at least 48 hours of notice, excluding weekends and holidays, generally receives final wages on the last day, or the next business day when that day falls on a weekend or holiday. Without that notice, payment is generally due within five business days or on the next regular payday, whichever occurs first.",
  caution:"Collective bargaining, seasonal farmworkers, time-record exceptions, mutual terminations, payment disputes and special fair employment can change the analysis. Pay-method requirements and penalty wage exposure require separate review.",
  sourceUrl:"https://www.oregon.gov/boli/workers/pages/paychecks.aspx",
  sourceTitle:"Oregon Bureau of Labor and Industries, Paychecks",
  agency:"Oregon Bureau of Labor and Industries",sourceKind:"official-state-guidance",effectiveDateCaveat:"Confirm current ORS 652.140 and OAR 839-001-0420.",
  checkedOn:"2026-11-03",publicationType:"sourced-educational-briefing",qualifiedLegalApproval:false,
 },
 {
  state:"MD",stateName:"Maryland",topic:"Final wages",
  pinpoint:"Maryland Wage Payment and Collection Law; Maryland Labor, Termination Pay",
  finding:"Maryland's Department of Labor states that employers must pay all wages earned before termination on or before the date on which the employee would have been paid if employment had continued.",
  caution:"Vacation payout depends on communicated written policy and the relevant facts. Accrued sick leave and wage components have distinct requirements; confirm applicable agreements, local requirements and the current law.",
  sourceUrl:"https://www.labor.maryland.gov/labor/wagepay/wppayonterm.shtml",
  sourceTitle:"Maryland Department of Labor, Termination Pay",
  agency:"Maryland Department of Labor",sourceKind:"official-state-guidance",effectiveDateCaveat:"Confirm current Maryland Wage Payment and Collection Law.",
  checkedOn:"2026-11-03",publicationType:"sourced-educational-briefing",qualifiedLegalApproval:false,
 },
 {
  state:"VA",stateName:"Virginia",topic:"Final wages and pay frequency",
  pinpoint:"Virginia Code §40.1-29(B) (2026 statute)",
  finding:"Virginia Code §40.1-29(B) requires wages earned before termination to be paid on or before the payday that would have applied if employment had continued. It also generally requires hourly workers to be paid at least every two weeks or twice monthly, and salaried workers at least monthly, with statutory exceptions.",
  caution:"The statute includes special executive and other exceptions, pay-method requirements, and a 2026 amendment addressing a good-faith defense for certain wage actions. Review current code, employee classification, separation facts and applicable local or federal requirements before relying on these rules.",
  sourceUrl:"https://law.lis.virginia.gov/vacode/title40.1/section40.1-29/",
  sourceTitle:"Virginia Legislative Information System, Code §40.1-29",
  agency:"Virginia General Assembly",sourceKind:"official-state-code",effectiveDateCaveat:"2026 statute: note changes effective July 1, 2026 where applicable.",
  checkedOn:"2026-11-03",publicationType:"sourced-educational-briefing",qualifiedLegalApproval:false,
 },
];

export function validateAdditionalStateBriefings():string[]{
 const issues:string[]=[];
 const seen=new Set<string>();
 for(const b of additionalStateBriefings){
  if(seen.has(b.state))issues.push("Duplicate additional state: "+b.state);
  seen.add(b.state);
  if(!b.sourceUrl.startsWith("https://"))issues.push("Non-HTTPS official source: "+b.state);
  if(!b.pinpoint||!b.caution||!b.effectiveDateCaveat)issues.push("Missing review caveat: "+b.state);
  if(b.qualifiedLegalApproval!==false)issues.push("Invalid legal certification: "+b.state);
 }
 return issues;
}
