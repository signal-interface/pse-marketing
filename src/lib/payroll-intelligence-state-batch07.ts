/** Public payroll educational references only, state batch 07.
 * No operational statutory approval, compliance advice, or PSE Core linkage.
 */
import type { StateBriefing } from "./payroll-intelligence-state-briefings";
export type StateBatch07Briefing = StateBriefing & {
  stateName:string;
  agency:string;
  sourceKind:"state-code"|"state-agency-guidance";
  effectiveDateCaveat:string;
};
export const stateBatch07Briefings: readonly StateBatch07Briefing[] = [
  {
    "state": "KY",
    "stateName": "Kentucky",
    "topic": "Final wages after separation",
    "pinpoint": "KRS §337.055; Kentucky Education and Labor Cabinet wage-and-hour guidance",
    "finding": "Kentucky guidance explains that earned wages for an employee who quits or is discharged generally must be paid no later than the next normal pay period following separation or fourteen days after separation, whichever occurs later.",
    "caution": "The statute uses the later of the two dates, not the earlier. Review the normal pay period, wages earned, the employer's pay practices, and any applicable rules addressing payment after an employee is absent on payday.",
    "sourceUrl": "https://elc.ky.gov/workplace-standards/Pages/Wages-and-Hours.aspx",
    "sourceTitle": "Kentucky Education and Labor Cabinet — Wages and Hours",
    "agency": "Kentucky Education and Labor Cabinet",
    "sourceKind": "state-agency-guidance",
    "effectiveDateCaveat": "Agency guidance checked November 3, 2026; verify the current statutory version of KRS §337.055.",
    "checkedOn": "2026-11-03",
    "publicationType": "sourced-educational-briefing",
    "qualifiedLegalApproval": false
  },
  {
    "state": "LA",
    "stateName": "Louisiana",
    "topic": "Final wages and earned variable compensation",
    "pinpoint": "La. R.S. §23:631(A)–(F)",
    "finding": "Louisiana's official statute generally requires wages due after discharge or resignation to be paid by the applicable next regular payday or within fifteen days after separation, whichever occurs first. It separately addresses accrued vacation and when commissions, incentive pay, and bonuses are considered earned.",
    "caution": "The statute contains collective-bargaining exceptions, mailing provisions, disputed-wage requirements, policy-specific vacation rules, and special compensation provisions. A 2025 amendment appears in the legislative history; use the currently effective text and review the employment terms.",
    "sourceUrl": "https://www.legis.la.gov/legis/LawPrint.aspx?d=83945",
    "sourceTitle": "Louisiana Legislature — R.S. 23:631",
    "agency": "Louisiana Legislature",
    "sourceKind": "state-code",
    "effectiveDateCaveat": "Official text reviewed November 3, 2026; legislative history includes 2025 Act 113.",
    "checkedOn": "2026-11-03",
    "publicationType": "sourced-educational-briefing",
    "qualifiedLegalApproval": false
  },
  {
    "state": "ME",
    "stateName": "Maine",
    "topic": "Final wages and accrued vacation",
    "pinpoint": "26 M.R.S. §§626 and 621-A",
    "finding": "Maine law generally requires payment of wages owed to an employee leaving employment by the employee's next established payday. It also sets particular rules for unused accrued paid vacation under employer policies, with exceptions for certain small employers, public employers, and applicable collective bargaining agreements.",
    "caution": "Maine's separate regular pay-frequency rule generally caps pay intervals at sixteen days for covered workers, with defined exclusions. Do not apply vacation payout or compensation terms without verifying the employer category, written policy, collective bargaining agreement, and current law.",
    "sourceUrl": "https://legislature.maine.gov/statutes/26/title26sec626.html",
    "sourceTitle": "Maine Legislature — Title 26 §626",
    "agency": "Maine Legislature",
    "sourceKind": "state-code",
    "effectiveDateCaveat": "Current Maine Legislature statutory text reviewed November 3, 2026; verify later law changes.",
    "checkedOn": "2026-11-03",
    "publicationType": "sourced-educational-briefing",
    "qualifiedLegalApproval": false
  },
  {
    "state": "MT",
    "stateName": "Montana",
    "topic": "Final wages and written-policy exceptions",
    "pinpoint": "Mont. Code Ann. §39-3-205(1)–(3)",
    "finding": "Montana's statute generally calls for final wages after voluntary separation by the next regular payday for the separation pay period or within fifteen days, whichever occurs first. Following employer discharge or layoff, wages are generally due immediately unless a preexisting written personnel policy lawfully extends the deadline within statutory limits.",
    "caution": "An allegation of theft has a distinct narrowly conditioned withholding provision. The written-policy exception does not automatically apply to every employer or separation; check the separation category, actual policy, payroll period, and current statutory text.",
    "sourceUrl": "https://mca.legmt.gov/bills/mca/title_0390/chapter_0030/part_0020/section_0050/0390-0030-0020-0050.html",
    "sourceTitle": "Montana Legislature — MCA §39-3-205",
    "agency": "Montana Legislature",
    "sourceKind": "state-code",
    "effectiveDateCaveat": "Official 2025 Montana Code Annotated text reviewed November 3, 2026; confirm 2026 amendments and current rules.",
    "checkedOn": "2026-11-03",
    "publicationType": "sourced-educational-briefing",
    "qualifiedLegalApproval": false
  }
];
export function validateStateBatch07Briefings():string[]{
 const errors:string[]=[];const seen=new Set<string>();
 for(const b of stateBatch07Briefings){
  if(seen.has(b.state))errors.push("Duplicate "+b.state);
  seen.add(b.state);
  if(!b.sourceUrl.startsWith("https://")||!b.pinpoint||b.finding.length<40||b.caution.length<40||!b.effectiveDateCaveat)errors.push("Incomplete source "+b.state);
  if(b.qualifiedLegalApproval!==false||b.publicationType!=="sourced-educational-briefing")errors.push("False approval "+b.state);
 }
 return errors;
}
