/** Official-source educational state expansion: batch 03. No compliance certification. */
import type { StateBriefing } from "./payroll-intelligence-state-briefings";
export type FurtherStateBriefing = StateBriefing & {stateName:string; agency:string; sourceKind:"state-code"|"state-agency-guidance"; effectiveDateCaveat:string};
export const furtherStateBriefings:readonly FurtherStateBriefing[] = [
 {state:"OH",stateName:"Ohio",topic:"Regular wage payment",
 pinpoint:"Ohio Revised Code §4113.15(A), semimonthly payment of wages",
 finding:"Ohio's statutory wage-payment provision establishes pay dates for wages earned in the first and second halves of the preceding month. It expressly permits daily and weekly payment and recognizes different intervals established through specified customary practices, written contracts, or law.",
 caution:"Pay timing depends on the particular wage period, agreements, lawful customary practices and industry exceptions. This source does not by itself prescribe a universally applicable final-pay deadline.",
 sourceUrl:"https://codes.ohio.gov/ohio-revised-code/section-4113.15",sourceTitle:"Ohio Revised Code §4113.15",agency:"Ohio General Assembly",sourceKind:"state-code",effectiveDateCaveat:"State code indicates March 20, 2019 as section effective date; check amendments and current application.",
 checkedOn:"2026-11-03",publicationType:"sourced-educational-briefing",qualifiedLegalApproval:false},
 {state:"MI",stateName:"Michigan",topic:"Final wages",
 pinpoint:"Michigan Payment of Wages and Fringe Benefits Act, Public Act 390 of 1978; Michigan Administrative Rule R408.9007",
 finding:"Michigan's labor agency states that an employee's final earned wages are generally payable on the next regularly scheduled payday after quitting or discharge.",
 caution:"The agency identifies a separate rule for employees who hand harvest crops: payment within one working day of termination. Written fringe-benefit policies, compensation agreements and authorized deductions require separate review.",
 sourceUrl:"https://www.michigan.gov/leo/bureaus-agencies/ber/wage-and-hour/payment-of-wages-and-fringe-benefits-act-public-act-390-of-1978",sourceTitle:"Michigan LEO, Payment of Wages and Fringe Benefits Act",agency:"Michigan Department of Labor and Economic Opportunity",sourceKind:"state-agency-guidance",effectiveDateCaveat:"Check current Act 390, administrative rule R408.9007 and special agricultural rules.",
 checkedOn:"2026-11-03",publicationType:"sourced-educational-briefing",qualifiedLegalApproval:false},
 {state:"MN",stateName:"Minnesota",topic:"Final wages",
 pinpoint:"Minn. Stat. §§181.13 and 181.14; Department of Labor and Industry Wage Claim guidance",
 finding:"Minnesota's labor agency explains that a discharged employee's earned final wages are generally payable within 24 hours after a demand. For voluntary resignations, pay is generally due on the next regular payday; where that payday occurs within five days after separation, payment may be delayed until the following payday but not beyond 20 days.",
 caution:"The statutes and agency guidance recognize exceptions, including extra audit time in specified employee-property situations and different provisions in applicable collective bargaining agreements. Demand timing, earned commissions and the exact employment circumstances matter.",
 sourceUrl:"https://dli.mn.gov/wage-claim",sourceTitle:"Minnesota DLI, Wage Claim and Final Wages",agency:"Minnesota Department of Labor and Industry",sourceKind:"state-agency-guidance",effectiveDateCaveat:"Check Minn. Stat. §§181.13–181.14 and current agency guidance.",
 checkedOn:"2026-11-03",publicationType:"sourced-educational-briefing",qualifiedLegalApproval:false},
 {state:"WI",stateName:"Wisconsin",topic:"Wage frequency and final pay",
 pinpoint:"Wis. Stat. ch.109; Wisconsin DWD Wage Payment and Collection Law",
 finding:"Wisconsin's labor agency states that most employers must pay employees at least monthly with no more than 31 days between pay periods. Employees leaving employment generally receive final earned wages according to their employer's regular pay schedule.",
 caution:"Statutory frequency exceptions apply to specific groups including farm and logging workers and certain public or part-time emergency-service positions. Agreed benefits, final compensation and deductions need separate analysis.",
 sourceUrl:"https://dwd.wi.gov/er/laborstandards/wages.htm",sourceTitle:"Wisconsin DWD, Wage Payment and Collection",agency:"Wisconsin Department of Workforce Development",sourceKind:"state-agency-guidance",effectiveDateCaveat:"Verify current Wis. Stat. ch.109 and industry exceptions.",
 checkedOn:"2026-11-03",publicationType:"sourced-educational-briefing",qualifiedLegalApproval:false}
];
export function validateFurtherStateBriefings():string[]{
 const errors:string[]=[]; const seen=new Set<string>();
 for(const x of furtherStateBriefings){
  if(seen.has(x.state))errors.push("Duplicate state "+x.state); seen.add(x.state);
  if(!x.sourceUrl.startsWith("https://")||!x.pinpoint||!x.caution||!x.effectiveDateCaveat)errors.push("Incomplete authority "+x.state);
  if(x.qualifiedLegalApproval!==false)errors.push("Improper legal review flag "+x.state);
 }
 return errors;
}
