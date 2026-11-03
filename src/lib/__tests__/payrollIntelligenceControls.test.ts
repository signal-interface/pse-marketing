import { describe, expect, it } from "vitest";
import { domains } from "../payroll-intelligence";
import { domainControlPlans, controlPlanBySlug } from "../payroll-intelligence-controls";
import { briefings } from "../payroll-intelligence-briefings";

describe("payroll intelligence editorial coverage contract", () => {
 it("defines exactly 15 unique domains and matching review plans", () => {
  expect(domains).toHaveLength(15);
  expect(domainControlPlans).toHaveLength(15);
  expect(new Set(domains.map(d=>d.id)).size).toBe(15);
  expect(new Set(domains.map(d=>d.slug)).size).toBe(15);
  expect(new Set(domainControlPlans.map(p=>p.id)).size).toBe(15);
  for(const d of domains){
   const plan=controlPlanBySlug[d.slug];
   expect(plan?.id).toBe(d.id);
   expect(plan?.editorialStatus).toBe("unverified-control-plan");
   expect(plan?.auditQuestion.length).toBeGreaterThan(15);
   expect(plan?.controls.length).toBeGreaterThanOrEqual(3);
   expect(plan?.evidence.length).toBeGreaterThanOrEqual(3);
   expect(plan?.caveat.length).toBeGreaterThan(15);
   expect(plan?.source.url).toMatch(/^https:\/\//);
  }
 });
 it("keeps draft briefings distinguished from approved articles",()=>{
  expect(briefings.length).toBeGreaterThanOrEqual(3);
  for(const b of briefings){
   expect(b.status).toBe("editorial-draft");
   expect(b.sources.length).toBeGreaterThan(0);
   expect(b.controlChecklist.length).toBeGreaterThanOrEqual(3);
   for(const s of b.sources) expect(s.url).toMatch(/^https:\/\//);
  }
 });
});
