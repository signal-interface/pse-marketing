import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { stateBriefings, validateStateBriefings } from "../payroll-intelligence-state-briefings";
import { stateSourceIntake } from "../payroll-intelligence-state-research";

describe("state-source educational briefing publication gate",()=>{
 it("maps exactly one bounded official-source briefing to each of eleven intake states",()=>{
  expect(validateStateBriefings()).toEqual([]);
  expect(stateBriefings).toHaveLength(11);
  expect(new Set(stateBriefings.map(b=>b.state)).size).toBe(11);
  expect(new Set(stateBriefings.map(b=>b.state))).toEqual(new Set(stateSourceIntake.map(s=>s.state)));
  expect(stateBriefings.every(b=>b.publicationType==="sourced-educational-briefing" && b.qualifiedLegalApproval===false)).toBe(true);
 });
 it("preserves the Connecticut statutory wording and the PA Act 101 public-works boundary",()=>{
  const ct=stateBriefings.find(b=>b.state==="CT")!;
  const pa=stateBriefings.find(b=>b.state==="PA")!;
  const fl=stateBriefings.find(b=>b.state==="FL")!;
  expect(ct.finding).toContain("weekly or once every two weeks");
  expect(ct.sourceUrl).toContain("cga.ct.gov");
  expect(pa.finding).toContain("Prevailing Wage Act");
  expect(pa.caution).toContain("not a change to ordinary pay frequency");
  expect(fl.finding).toContain("September 30, 2026");
  expect(fl.caution).toContain("Tipped employees");
 });
 it("avoids general state-compliance claims and links every summary to official material",()=>{
  const page=readFileSync("src/app/payroll-intelligence/state-sources/[state]/page.tsx","utf8");
  const index=readFileSync("src/app/payroll-intelligence/state-sources/page.tsx","utf8");
  expect(page).toContain("b.finding");
  expect(page).toContain("b.caution");
  expect(page).toContain("b.sourceUrl");
  expect(page).toContain("index:false");
  expect(page).toContain("notFound()");
  expect(index).toContain("StateSourceExplorer");
  expect(stateBriefings.every(b=>b.sourceUrl.startsWith("https://"))).toBe(true);
 });
});