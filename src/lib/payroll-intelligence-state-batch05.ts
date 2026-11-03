/** PSE Marketing official-source educational references, batch 05.
 * This is NOT operational payroll law, full state coverage, or legal certification.
 */
import type { StateBriefing } from "./payroll-intelligence-state-briefings";
export type StateBatch05Briefing = StateBriefing & {
  stateName: string;
  agency: string;
  sourceKind: "state-code" | "state-agency-guidance";
  effectiveDateCaveat: string;
};
export const stateBatch05Briefings: readonly StateBatch05Briefing[] = [
  {
    "state": "DE",
    "stateName": "Delaware",
    "topic": "Final wage payment",
    "pinpoint": "Delaware Code tit. 19, §1103(a)(1)–(2)",
    "finding": "Under Delaware's wage-payment law, wages earned when an employee quits, is discharged, is suspended or is laid off become payable on the later of the next date on which those wages would have been paid through the regular pay cycle or three business days after the last day worked. The statute permits ordinary pay channels or mailing when requested.",
    "caution": "The statutory comparison uses the later date, not the earlier date. Employers must separately review the regular-payday requirements of §1102, lawful deductions, disputes and remedies under §§1104 and 1107, and special facts affecting the wage amount.",
    "sourceUrl": "https://delcode.delaware.gov/title19/c011/",
    "sourceTitle": "Delaware Code Online, Title 19, Chapter 11",
    "agency": "Delaware General Assembly",
    "sourceKind": "state-code",
    "effectiveDateCaveat": "Current official online code checked November 3, 2026; confirm later amendments and relevant event dates.",
    "checkedOn": "2026-11-03",
    "publicationType": "sourced-educational-briefing",
    "qualifiedLegalApproval": false
  },
  {
    "state": "HI",
    "stateName": "Hawaii",
    "topic": "Final wages after discharge or resignation",
    "pinpoint": "Hawaii Revised Statutes §388-3(a)–(b); Hawaii Wage Standards Division, Unpaid Wages",
    "finding": "Hawaii's labor agency explains that wages owed to an employee discharged by the employer generally must be paid at discharge or no later than the next working day. When an employee resigns, payment is generally due on the next regular payday; with at least one pay period's advance notice of resignation, earned wages are generally payable at the time of quitting.",
    "caution": "Employer discharge and employee resignation have different deadlines. Agency guidance also addresses situations such as disputes over amounts due and other wage-payment requirements under chapter 388. Confirm the required notice, covered wage components and the applicable working day.",
    "sourceUrl": "https://labor.hawaii.gov/wsd/unpaid-wages/",
    "sourceTitle": "Hawaii Wage Standards Division, Unpaid Wages",
    "agency": "Hawaii Department of Labor and Industrial Relations",
    "sourceKind": "state-agency-guidance",
    "effectiveDateCaveat": "Confirm current HRS §388-3 and agency guidance for the applicable separation date.",
    "checkedOn": "2026-11-03",
    "publicationType": "sourced-educational-briefing",
    "qualifiedLegalApproval": false
  },
  {
    "state": "IA",
    "stateName": "Iowa",
    "topic": "Final wages and commission reconciliation",
    "pinpoint": "Iowa Code 2026, §§91A.3–91A.4; Iowa DIAL Wage Claims FAQ",
    "finding": "Iowa's wage-payment statute generally requires earned wages following suspension or termination to be paid no later than the next regular payday for the period in which they were earned. For certain commissions involving a credit paid against earned commissions, the statutory reconciliation amount may be payable no more than 30 days after separation.",
    "caution": "The commission-credit exception is not a blanket extension of final pay. Authorized deductions under §91A.5, accrued vacation due under an agreement or policy, and valid written pay arrangements require separate consideration. The 2026 code and the current agency FAQs should be read together.",
    "sourceUrl": "https://www.legis.iowa.gov/docs/code/91A.pdf",
    "sourceTitle": "Iowa Legislature, Iowa Code 2026, Chapter 91A",
    "agency": "Iowa General Assembly",
    "sourceKind": "state-code",
    "effectiveDateCaveat": "2026 Iowa Code checked November 3, 2026; check 2026 enacted amendments not incorporated in that volume.",
    "checkedOn": "2026-11-03",
    "publicationType": "sourced-educational-briefing",
    "qualifiedLegalApproval": false
  },
  {
    "state": "KS",
    "stateName": "Kansas",
    "topic": "Final wages and nonpayment penalties",
    "pinpoint": "Kansas Statutes 2026, K.S.A. §§44-314–44-315",
    "finding": "Kansas §44-315 provides that wages earned by a discharged or resigning employee generally must be paid by the next regular payday that would have applied had the employee remained employed. The statute separately addresses damages for willful nonpayment after the specified post-deadline period.",
    "caution": "The eighth-day penalty provision in §44-315(b) is not an extension of the basic wage-payment due date. Lawful payment channels, requested mailing, employee classification, disputed wage amounts and the precise penalty conditions must be considered separately.",
    "sourceUrl": "https://kslegislature.gov/b2025_26/laws/044_000_0000_chapter/044_003_0000_article/044_003_0015_section/044_003_0015_k/",
    "sourceTitle": "Kansas Legislature, 2026 Statutes §44-315",
    "agency": "Kansas Legislature",
    "sourceKind": "state-code",
    "effectiveDateCaveat": "2026 Kansas statutory text reviewed November 3, 2026; verify changes and the related §44-314 text before applying.",
    "checkedOn": "2026-11-03",
    "publicationType": "sourced-educational-briefing",
    "qualifiedLegalApproval": false
  }
];
export function validateStateBatch05Briefings(): string[] {
  const problems:string[]=[];
  const seen=new Set<string>();
  for (const b of stateBatch05Briefings) {
    if (seen.has(b.state)) problems.push("Duplicate state "+b.state);
    seen.add(b.state);
    if (!b.sourceUrl.startsWith("https://") || !b.pinpoint || b.finding.length<40 || b.caution.length<40 || !b.effectiveDateCaveat) problems.push("Incomplete source "+b.state);
    if (b.qualifiedLegalApproval!==false || b.publicationType!=="sourced-educational-briefing") problems.push("False approval "+b.state);
  }
  return problems;
}
