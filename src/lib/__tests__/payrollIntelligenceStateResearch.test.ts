import { describe, expect, it } from "vitest";
import { inspectStateSourceIntake, stateSourceIntake } from "../payroll-intelligence-state-research";

describe("state payroll source intake boundary",()=>{
 it("tracks eleven unique jurisdictions with official pinpoint leads",()=>{
  expect(stateSourceIntake).toHaveLength(11);
  expect(stateSourceIntake.map(s=>s.state).sort()).toEqual(["CA","CO","CT","FL","GA","IL","NJ","NY","PA","TX","WA"]);
  expect(inspectStateSourceIntake()).toEqual([]);
  for(const row of stateSourceIntake){
   expect(row.authority.url).toMatch(/^https:\/);
   expect(row.authority.agency.length).toBeGreaterThan(8);
   expect(row.authority.pinpoint.length).toBeGreaterThan(6);
   expect(row.caveat.length).toBeGreaterThan(25);
  }
 });
 it("does not promote source leads into legally verified or publishable rules",()=>{
  expect(stateSourceIntake.every(row=>
    row.reviewStatus==="research-intake" &&
    row.applicabilityStatus==="unassessed" &&
    row.localOverlayStatus==="not-reviewed" &&
    row.effectiveDateStatus==="needs-rule-specific-verification" &&
    row.authorizedForPublicRegulatoryClaims===false)).toBe(true);
 });
});
