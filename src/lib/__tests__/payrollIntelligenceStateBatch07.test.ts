import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {stateBriefings} from "../payroll-intelligence-state-briefings";
import {additionalStateBriefings} from "../payroll-intelligence-state-expansion";
import {furtherStateBriefings} from "../payroll-intelligence-state-batch03";
import {stateBatch04Briefings} from "../payroll-intelligence-state-batch04";
import {stateBatch05Briefings} from "../payroll-intelligence-state-batch05";
import {stateBatch06Briefings} from "../payroll-intelligence-state-batch06";
import {stateBatch07Briefings,validateStateBatch07Briefings} from "../payroll-intelligence-state-batch07";
describe("state-source education batch07",()=>{
 it("provides 35 distinct narrowly qualified jurisdictions",()=>{
  expect(validateStateBatch07Briefings()).toEqual([]);
  expect(stateBatch07Briefings.map(x=>x.state).sort()).toEqual(["KY","LA","ME","MT"]);
  const all=[...stateBriefings,...additionalStateBriefings,...furtherStateBriefings,...stateBatch04Briefings,...stateBatch05Briefings,...stateBatch06Briefings,...stateBatch07Briefings];
  expect(all).toHaveLength(35);
  expect(new Set(all.map(x=>x.state)).size).toBe(35);
  expect(stateBatch07Briefings.every(b=>b.qualifiedLegalApproval===false && b.publicationType==="sourced-educational-briefing")).toBe(true);
 });
 it("preserves later-of, earlier-of and written-policy exceptions",()=>{
  const ky=stateBatch07Briefings.find(x=>x.state==="KY")!;
  const la=stateBatch07Briefings.find(x=>x.state==="LA")!;
  const me=stateBatch07Briefings.find(x=>x.state==="ME")!;
  const mt=stateBatch07Briefings.find(x=>x.state==="MT")!;
  expect(ky.finding).toContain("whichever occurs later");
  expect(la.finding).toContain("whichever occurs first");
  expect(me.caution).toContain("collective bargaining");
  expect(mt.caution).toContain("written-policy exception");
  expect(stateBatch07Briefings.every(x=>x.sourceUrl.startsWith("https://"))).toBe(true);
 });
 it("links new pages with the existing noindex educational boundary",()=>{
  const page=readFileSync("src/app/payroll-intelligence/state-sources/[state]/page.tsx","utf8");
  const index=readFileSync("src/app/payroll-intelligence/state-sources/page.tsx","utf8");
  expect(page).toContain("...stateBatch07Briefings");
  expect(page).toContain("index:false");
  expect(page).toContain("b.caution");
  expect(index).toContain("StateSourceExplorer");
  expect(index).toContain("50 states and Washington, D.C.");
 });
});