/** Official-state source-linked marketing education, batch 06.
 * Not an operational legal ruleset, complete jurisdiction profile, or tax advice.
 */
import type { StateBriefing } from "./payroll-intelligence-state-briefings";
export type StateBatch06Briefing = StateBriefing & {
 stateName:string;
 agency:string;
 sourceKind:"state-code"|"state-agency-guidance";
 effectiveDateCaveat:string;
};
export const stateBatch06Briefings: readonly StateBatch06Briefing[] = [
  {
    "state": "NC",
    "stateName": "North Carolina",
    "topic": "Final wages and calculable compensation",
    "pinpoint": "N.C. Gen. Stat. §95-25.7; 13 NCAC 12.0308",
    "finding": "North Carolina's Department of Labor explains that wages due when employment ends for any reason generally must be paid on or before the next regular payday. Bonuses, commissions or similar amounts calculated later are due on the first regular payday after the amount can be calculated.",
    "caution": "An employer policy that results in forfeiture of a bonus or commission may be subject to employee-notification requirements under G.S. §95-25.13. The amount owed, compensation terms, deductions and any applicable exception require fact-specific review.",
    "sourceUrl": "https://www.labor.nc.gov/workplace-rights/employee-rights-regarding-time-worked-and-wages-earned/payment-final-wages",
    "sourceTitle": "North Carolina Department of Labor — Payment of Final Wages to Separated Employees",
    "agency": "North Carolina Department of Labor",
    "sourceKind": "state-agency-guidance",
    "effectiveDateCaveat": "Current NCDOL page reviewed November 3, 2026; verify §95-25.7 and administrative rule revisions.",
    "checkedOn": "2026-11-03",
    "publicationType": "sourced-educational-briefing",
    "qualifiedLegalApproval": false
  },
  {
    "state": "SC",
    "stateName": "South Carolina",
    "topic": "Final wages after separation",
    "pinpoint": "S.C. Code §41-10-50; §§41-10-10, 41-10-60",
    "finding": "South Carolina Code §41-10-50 states that an employer separating an employee from payroll for any reason must pay all wages due within forty-eight hours of separation or on the next regular payday, which may not exceed thirty days.",
    "caution": "The statutory 'or' language is not a universal requirement to pay within forty-eight hours. Review the employer's regularly designated payday, wage definition including amounts due under policies or contracts, the handling of disputed wages, and any applicable exceptions.",
    "sourceUrl": "https://www.scstatehouse.gov/code/t41c010.php",
    "sourceTitle": "South Carolina Legislature — Title 41, Chapter 10, Payment of Wages",
    "agency": "South Carolina General Assembly",
    "sourceKind": "state-code",
    "effectiveDateCaveat": "Official South Carolina Code checked November 3, 2026; monitor subsequent enacted amendments.",
    "checkedOn": "2026-11-03",
    "publicationType": "sourced-educational-briefing",
    "qualifiedLegalApproval": false
  },
  {
    "state": "NE",
    "stateName": "Nebraska",
    "topic": "Final wages for private employers and political subdivisions",
    "pinpoint": "Neb. Rev. Stat. §48-1230(4)(a)–(b); §48-1230.01",
    "finding": "Nebraska's Legislature states that for employers other than political subdivisions, separated employees' unpaid wages are due on the next regular payday or within two weeks after termination, whichever comes sooner. The law sets a different meeting-based timetable for political subdivisions.",
    "caution": "Do not apply the private-employer timeline to a political subdivision without checking §48-1230(4)(b). Also review §48-1230.01, contract-defined wages, employee deductions, wage statements and pay-method rules separately.",
    "sourceUrl": "https://nebraskalegislature.gov/laws/statutes.php?statute=48-1230",
    "sourceTitle": "Nebraska Legislature — Revised Statute 48-1230",
    "agency": "Nebraska Legislature",
    "sourceKind": "state-code",
    "effectiveDateCaveat": "Current official statute checked November 3, 2026; compare later legislative changes and special statutory exceptions.",
    "checkedOn": "2026-11-03",
    "publicationType": "sourced-educational-briefing",
    "qualifiedLegalApproval": false
  },
  {
    "state": "NM",
    "stateName": "New Mexico",
    "topic": "Final wages following discharge or resignation",
    "pinpoint": "N.M. Stat. Ann. §§50-4-4(A)–(B), 50-4-5; New Mexico DWS Labor Relations Investigations Manual, July 2025, pp. 18–19",
    "finding": "New Mexico's Department of Workforce Solutions explains that discharged employees owed fixed and definite wages generally must receive those wages within five days of discharge. Wages calculated by task, piece, commission or another method generally have a ten-day discharge deadline. Wages after voluntary resignation generally fall due at the next succeeding payday.",
    "caution": "The source distinguishes discharge, resignation, constructive discharge and methods for calculating wages. Statutory wage-continuation damages have additional demand/refusal conditions; the 2025 manual is explanatory guidance, not a substitute for current statutes, regulations and later authority.",
    "sourceUrl": "https://www.dws.state.nm.us/Portals/0/DM/LaborRelations/LRD_Investigations_Manual_2025.pdf",
    "sourceTitle": "New Mexico DWS — Labor Relations Division Investigations Manual (2025)",
    "agency": "New Mexico Department of Workforce Solutions",
    "sourceKind": "state-agency-guidance",
    "effectiveDateCaveat": "Agency manual published July 30, 2025; current law and any 2026 changes require rechecking before employer-specific reliance.",
    "checkedOn": "2026-11-03",
    "publicationType": "sourced-educational-briefing",
    "qualifiedLegalApproval": false
  }
];
export function validateStateBatch06Briefings():string[]{
 const errors:string[]=[];
 const seen=new Set<string>();
 for(const b of stateBatch06Briefings){
  if(seen.has(b.state))errors.push("Duplicate "+b.state);
  seen.add(b.state);
  if(!b.sourceUrl.startsWith("https://") || !b.pinpoint || b.finding.length<40 || b.caution.length<40 || !b.effectiveDateCaveat)errors.push("Incomplete source "+b.state);
  if(b.qualifiedLegalApproval!==false || b.publicationType!=="sourced-educational-briefing")errors.push("False approval "+b.state);
 }
 return errors;
}
