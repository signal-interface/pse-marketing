import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { stateBriefings } from "../payroll-intelligence-state-briefings";
import { additionalStateBriefings } from "../payroll-intelligence-state-expansion";
import { furtherStateBriefings } from "../payroll-intelligence-state-batch03";
import { stateBatch04Briefings } from "../payroll-intelligence-state-batch04";
import { stateBatch05Briefings } from "../payroll-intelligence-state-batch05";
import { stateBatch06Briefings } from "../payroll-intelligence-state-batch06";
import { stateBatch07Briefings } from "../payroll-intelligence-state-batch07";
import { stateBatch08Briefings, validateStateBatch08Briefings } from "../payroll-intelligence-state-batch08";

const allBriefings = [
 ...stateBriefings, ...additionalStateBriefings, ...furtherStateBriefings,
 ...stateBatch04Briefings, ...stateBatch05Briefings, ...stateBatch06Briefings,
 ...stateBatch07Briefings, ...stateBatch08Briefings,
];
const stateCodes = "AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC".split(" ").sort();

describe("complete geographic introductory PSE payroll source directory", () => {
 it("contains exactly 50 states plus DC, with one bounded official-source briefing per jurisdiction", () => {
  expect(validateStateBatch08Briefings()).toEqual([]);
  expect(stateBatch08Briefings.map(x=>x.state).sort()).toEqual(["AL","AR","DC","IN","MO","MS","ND","NH","OK","RI","SD","TN","UT","VT","WV","WY"]);
  expect(allBriefings).toHaveLength(51);
  expect(new Set(allBriefings.map(x=>x.state)).size).toBe(51);
  expect(allBriefings.map(x=>x.state).sort()).toEqual(stateCodes);
  expect(allBriefings.every(x=>x.sourceUrl.startsWith("https://") && x.pinpoint && x.caution.length>=35 && x.qualifiedLegalApproval===false)).toBe(true);
 });
 it("distinguishes legal deadlines from penalty and narrow reporting rules", () => {
  const get = (state:string) => stateBatch08Briefings.find(x=>x.state===state)!;
  expect(get("AL").topic).toContain("new-hire");
  expect(get("AR").topic).toContain("Minimum wage");
  expect(get("MS").topic).toContain("unemployment wage");
  expect(get("RI").topic).toContain("frequency");
  expect(get("DC").finding).toContain("next working day");
  expect(get("MO").finding).toContain("discharged");
  expect(get("ND").finding).toContain("regular payday");
  expect(get("NH").finding).toContain("72 hours");
  expect(get("SD").caution).toContain("return-of-property");
  expect(get("TN").finding).toContain("whichever occurs later");
  expect(get("UT").finding).toContain("24 hours");
  expect(get("VT").finding).toContain("72 hours");
  expect(get("WV").finding).toContain("next regular payday");
  expect(get("WY").caution).toContain("commission-based");
 });
 it("renders all new pages, remains noindex, and does not turn introductory text into legal certification", () => {
  const detail = readFileSync("src/app/payroll-intelligence/state-sources/[state]/page.tsx","utf8");
  const index = readFileSync("src/app/payroll-intelligence/state-sources/page.tsx","utf8");
  expect(detail).toContain("...stateBatch08Briefings");
  expect(detail).toContain("index:false");
  expect(detail).toContain("b.caution");
  expect(detail).toContain("b.sourceUrl");
  expect(index).toContain("StateSourceExplorer");
  expect(index).toContain("50 states and Washington, D.C.");
  expect(index).toContain("index:false");
  expect(index).toContain("not complete state compliance profiles");
 });
});
