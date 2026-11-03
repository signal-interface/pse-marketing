import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { stateBriefings } from "../payroll-intelligence-state-briefings";
import { additionalStateBriefings } from "../payroll-intelligence-state-expansion";
import { furtherStateBriefings, validateFurtherStateBriefings } from "../payroll-intelligence-state-batch03";
describe("PSE state payroll batch 03 source and marketing boundaries",()=>{
 it("extends educational coverage to 19 distinct states without falsely certifying law",()=>{
  expect(validateFurtherStateBriefings()).toEqual([]);
  expect(furtherStateBriefings.map(b=>b.state).sort()).toEqual(["MI","MN","OH","WI"]);
  const all=[...stateBriefings,...additionalStateBriefings,...furtherStateBriefings];
  expect(all).toHaveLength(19);
  expect(new Set(all.map(b=>b.state)).size).toBe(19);
  expect(furtherStateBriefings.every(b=>b.qualifiedLegalApproval===false && b.publicationType==="sourced-educational-briefing")).toBe(true);
 });
 it("has targeted statutory sources and meaningful exceptions",()=>{
  const ohio=furtherStateBriefings.find(b=>b.state==="OH")!;
  const mn=furtherStateBriefings.find(b=>b.state==="MN")!;
  const mi=furtherStateBriefings.find(b=>b.state==="MI")!;
  const wi=furtherStateBriefings.find(b=>b.state==="WI")!;
  expect(ohio.pinpoint).toContain("4113.15");
  expect(mn.pinpoint).toContain("181.13");
  expect(mn.caution).toContain("extra audit time");
  expect(mi.caution).toContain("hand harvest crops");
  expect(wi.caution).toContain("farm and logging");
  expect(furtherStateBriefings.every(b=>b.sourceUrl.startsWith("https://"))).toBe(true);
 });
 it("renders correct 19-state routes and does not expose unapproved legal attestations",()=>{
  const detail=readFileSync("src/app/payroll-intelligence/state-sources/[state]/page.tsx","utf8");
  const index=readFileSync("src/app/payroll-intelligence/state-sources/page.tsx","utf8");
  expect(detail).toContain("...furtherStateBriefings");
  expect(detail).toContain("index:false");
  expect(detail).toContain("b.caution");
  expect(index).toContain("StateSourceExplorer");
  expect(index).toContain("50 states and Washington, D.C.");
 });
});