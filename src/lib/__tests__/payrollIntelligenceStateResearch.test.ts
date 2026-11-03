import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { inspectStateSourceIntake, stateSourceIntake } from "../payroll-intelligence-state-research";

describe("state payroll source intake boundary",()=>{
 it("tracks eleven unique jurisdictions with official pinpoint leads",()=>{
  expect(stateSourceIntake).toHaveLength(11);
  expect(stateSourceIntake.map(s=>s.state).sort()).toEqual(["CA","CO","CT","FL","GA","IL","NJ","NY","PA","TX","WA"]);
  expect(inspectStateSourceIntake()).toEqual([]);
  for(const row of stateSourceIntake){
   expect(row.authority.url.startsWith("https://")).toBe(true);
   expect(row.authority.agency.length).toBeGreaterThan(8);
   expect(row.authority.pinpoint.length).toBeGreaterThan(6);
   expect(row.caveat.length).toBeGreaterThan(25);
  }
 });
 it("uses current controlling statute for Connecticut and avoids misclassifying PA prevailing wages",()=>{
  const ct=stateSourceIntake.find(s=>s.state==="CT")!;
  const pa=stateSourceIntake.find(s=>s.state==="PA")!;
  const fl=stateSourceIntake.find(s=>s.state==="FL")!;
  expect(ct.authority.url).toContain("cga.ct.gov/current/pub/chap_558.htm");
  expect(ct.preliminaryStatement).toContain("weekly or once-every-two-weeks");
  expect(ct.authority.pinpoint).toContain("31-71b(a)(1)");
  expect(pa.caveat).toContain("Prevailing Wage Act");
  expect(pa.caveat).toContain("not");
  expect(fl.caveat).toContain("December 31, 2027");
 });
 it("only displays official source leads rather than unresolved preliminary rules on state directory",()=>{
  const page=readFileSync("src/app/payroll-intelligence/state-sources/page.tsx","utf8");
  expect(page).toContain("StateSourceExplorer");
  expect(page).toContain("index:false");
  expect(page).not.toContain("s.preliminaryStatement");
  expect(page).toContain("stateDirectoryEntries");
  expect(page).toContain("stateDirectoryTopics");
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
