import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {stateBriefings} from "../payroll-intelligence-state-briefings";
import {additionalStateBriefings} from "../payroll-intelligence-state-expansion";
import {furtherStateBriefings} from "../payroll-intelligence-state-batch03";
import {stateBatch04Briefings} from "../payroll-intelligence-state-batch04";
import {stateBatch05Briefings} from "../payroll-intelligence-state-batch05";
import {stateBatch06Briefings,validateStateBatch06Briefings} from "../payroll-intelligence-state-batch06";

describe("state-source educational batch06",()=>{
 it("extends the catalog to 31 distinct jurisdictions without operational legal approval",()=>{
  expect(validateStateBatch06Briefings()).toEqual([]);
  expect(stateBatch06Briefings.map(x=>x.state).sort()).toEqual(["NC","NE","NM","SC"]);
  const all=[...stateBriefings,...additionalStateBriefings,...furtherStateBriefings,...stateBatch04Briefings,...stateBatch05Briefings,...stateBatch06Briefings];
  expect(all).toHaveLength(31);
  expect(new Set(all.map(x=>x.state)).size).toBe(31);
  expect(stateBatch06Briefings.every(x=>x.qualifiedLegalApproval===false && x.publicationType==="sourced-educational-briefing")).toBe(true);
 });
 it("preserves major applicability distinctions in the primary sources",()=>{
  const nc=stateBatch06Briefings.find(x=>x.state==="NC")!;
  const sc=stateBatch06Briefings.find(x=>x.state==="SC")!;
  const ne=stateBatch06Briefings.find(x=>x.state==="NE")!;
  const nm=stateBatch06Briefings.find(x=>x.state==="NM")!;
  expect(nc.finding).toContain("first regular payday after the amount can be calculated");
  expect(sc.caution).toContain("not a universal requirement");
  expect(ne.caution).toContain("political subdivision");
  expect(nm.finding).toContain("ten-day discharge deadline");
  expect(nm.effectiveDateCaveat).toContain("2025");
  expect(stateBatch06Briefings.every(x=>x.sourceUrl.startsWith("https://"))).toBe(true);
 });
 it("links batch06 state details and retains noindex research boundaries",()=>{
  const page=readFileSync("src/app/payroll-intelligence/state-sources/[state]/page.tsx","utf8");
  const index=readFileSync("src/app/payroll-intelligence/state-sources/page.tsx","utf8");
  expect(page).toContain("...stateBatch06Briefings");
  expect(page).toContain("index:false");
  expect(page).toContain("b.caution");
  expect(index).toContain("stateBatch06Briefings.map");
  expect(index).toContain("selected payroll topics in all 50 states and Washington, D.C.");
 });
});