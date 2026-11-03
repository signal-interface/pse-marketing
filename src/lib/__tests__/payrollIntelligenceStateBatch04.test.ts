import {describe, expect, it} from "vitest";
import {readFileSync} from "node:fs";
import {stateBriefings} from "../payroll-intelligence-state-briefings";
import {additionalStateBriefings} from "../payroll-intelligence-state-expansion";
import {furtherStateBriefings} from "../payroll-intelligence-state-batch03";
import {stateBatch04Briefings,validateStateBatch04Briefings} from "../payroll-intelligence-state-batch04";

describe("PSE state-source educational batch 04",()=>{
 it("contains 23 uniquely referenced jurisdictions and four new sources",()=>{
  expect(validateStateBatch04Briefings()).toEqual([]);
  expect(stateBatch04Briefings.map(x=>x.state).sort()).toEqual(["AK","AZ","ID","NV"]);
  const all=[...stateBriefings,...additionalStateBriefings,...furtherStateBriefings,...stateBatch04Briefings];
  expect(all).toHaveLength(23);
  expect(new Set(all.map(x=>x.state)).size).toBe(23);
  expect(stateBatch04Briefings.every(x=>x.qualifiedLegalApproval===false)).toBe(true);
 });
 it("distinguishes Nevada's immediate due date from the separate penalty provision",()=>{
  const nv=stateBatch04Briefings.find(x=>x.state==="NV")!;
  expect(nv.finding).toContain("immediately");
  expect(nv.caution).toContain("does not turn");
  expect(nv.pinpoint).toContain("608.040");
  expect(nv.sourceUrl).toContain("leg.state.nv.us");
 });
 it("preserves separation-specific Arizona Alaska and Idaho rules",()=>{
  const ak=stateBatch04Briefings.find(x=>x.state==="AK")!;
  const az=stateBatch04Briefings.find(x=>x.state==="AZ")!;
  const id=stateBatch04Briefings.find(x=>x.state==="ID")!;
  expect(ak.finding).toContain("three working days");
  expect(az.finding).toContain("seven working days");
  expect(id.finding).toContain("48 hours");
  expect(stateBatch04Briefings.every(x=>x.sourceUrl.startsWith("https://"))).toBe(true);
 });
 it("links each new state while retaining noindex source-only educational boundaries",()=>{
  const detail=readFileSync("src/app/payroll-intelligence/state-sources/[state]/page.tsx","utf8");
  const index=readFileSync("src/app/payroll-intelligence/state-sources/page.tsx","utf8");
  expect(detail).toContain("...stateBatch04Briefings");
  expect(detail).toContain("index:false");
  expect(index).toContain("StateSourceExplorer");
  expect(index).toContain("50 states and Washington, D.C.");
 });
});