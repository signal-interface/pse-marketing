import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { additionalStateBriefings, validateAdditionalStateBriefings } from "../payroll-intelligence-state-expansion";
import { stateBriefings } from "../payroll-intelligence-state-briefings";

describe("state-source educational batch 02",()=>{
 it("has four new unique state authorities and retains eleven prior states",()=>{
  expect(validateAdditionalStateBriefings()).toEqual([]);
  expect(additionalStateBriefings.map(x=>x.state).sort()).toEqual(["MA","MD","OR","VA"]);
  const all=[...stateBriefings,...additionalStateBriefings];
  expect(all).toHaveLength(15);
  expect(new Set(all.map(x=>x.state)).size).toBe(15);
  expect(additionalStateBriefings.every(b=>b.publicationType==="sourced-educational-briefing" && b.qualifiedLegalApproval===false)).toBe(true);
 });
 it("captures termination differences and current source sections",()=>{
  const ma=additionalStateBriefings.find(b=>b.state==="MA")!;
  const or=additionalStateBriefings.find(b=>b.state==="OR")!;
  const md=additionalStateBriefings.find(b=>b.state==="MD")!;
  const va=additionalStateBriefings.find(b=>b.state==="VA")!;
  expect(ma.finding).toContain("day of discharge");
  expect(or.finding).toContain("next business day");
  expect(or.finding).toContain("48 hours");
  expect(md.finding).toContain("if employment had continued");
  expect(va.pinpoint).toContain("40.1-29(B)");
  expect(va.caution).toContain("2026");
 });
 it("renders full 15-state directory and dynamic source-cited routes as noindex",()=>{
  const index=readFileSync("src/app/payroll-intelligence/state-sources/page.tsx","utf8");
  const page=readFileSync("src/app/payroll-intelligence/state-sources/[state]/page.tsx","utf8");
  expect(index).toContain("additionalStateBriefings.map");
  expect(page).toContain("allBriefings.map");
  expect(page).toContain("additionalStateBriefings.find");
  expect(page).toContain("b.finding");
  expect(page).toContain("b.caution");
  expect(page).toContain("index:false");
  expect(page).toContain("notFound()");
 });
});
