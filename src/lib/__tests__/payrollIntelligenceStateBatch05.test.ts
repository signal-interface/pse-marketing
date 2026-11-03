import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {stateBriefings} from "../payroll-intelligence-state-briefings";
import {additionalStateBriefings} from "../payroll-intelligence-state-expansion";
import {furtherStateBriefings} from "../payroll-intelligence-state-batch03";
import {stateBatch04Briefings} from "../payroll-intelligence-state-batch04";
import {stateBatch05Briefings,validateStateBatch05Briefings} from "../payroll-intelligence-state-batch05";
describe("state educational source batch05",()=>{
 it("extends directory to 27 unique entries with bounded legal status",()=>{
  expect(validateStateBatch05Briefings()).toEqual([]);
  expect(stateBatch05Briefings.map(x=>x.state).sort()).toEqual(["DE","HI","IA","KS"]);
  const all=[...stateBriefings,...additionalStateBriefings,...furtherStateBriefings,...stateBatch04Briefings,...stateBatch05Briefings];
  expect(all).toHaveLength(27);
  expect(new Set(all.map(x=>x.state)).size).toBe(27);
  expect(stateBatch05Briefings.every(x=>x.qualifiedLegalApproval===false && x.publicationType==="sourced-educational-briefing")).toBe(true);
 });
 it("retains nuanced final-pay dates and separate penalty/commission issues",()=>{
  const de=stateBatch05Briefings.find(x=>x.state==="DE")!;
  const hi=stateBatch05Briefings.find(x=>x.state==="HI")!;
  const ia=stateBatch05Briefings.find(x=>x.state==="IA")!;
  const ks=stateBatch05Briefings.find(x=>x.state==="KS")!;
  expect(de.finding).toContain("later of");
  expect(de.caution).toContain("not the earlier date");
  expect(hi.finding).toContain("next working day");
  expect(ia.finding).toContain("30 days");
  expect(ia.caution).toContain("not a blanket extension");
  expect(ks.caution).toContain("not an extension");
  expect(stateBatch05Briefings.every(x=>x.sourceUrl.startsWith("https://"))).toBe(true);
 });
 it("links new state pages without changing noindex or publishing preliminary rule records",()=>{
  const detail=readFileSync("src/app/payroll-intelligence/state-sources/[state]/page.tsx","utf8");
  const index=readFileSync("src/app/payroll-intelligence/state-sources/page.tsx","utf8");
  expect(detail).toContain("...stateBatch05Briefings");
  expect(detail).toContain("index:false");
  expect(detail).toContain("b.caution");
  expect(index).toContain("stateBatch05Briefings.map");
  expect(index).toContain("selected payroll topics in 27 states");
 });
});