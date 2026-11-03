import { describe, expect, it } from "vitest";
import { domains } from "../payroll-intelligence";
import { domainControlPlans, controlPlanBySlug } from "../payroll-intelligence-controls";
import { briefings } from "../payroll-intelligence-briefings";
import { editorialClaimInventory, claimsAreApproved } from "../payroll-intelligence-claim-inventory";

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
 it("accounts for every individual source-sensitive claim without issuing approval", () => {
  const expected = briefings.reduce((count,b)=>count+b.keyPoints.length,0);
  expect(editorialClaimInventory.length).toBe(expected);
  expect(new Set(editorialClaimInventory.map(c=>c.id)).size).toBe(expected);
  expect(claimsAreApproved(editorialClaimInventory)).toBe(false);
  for(const b of briefings){
   const claims=editorialClaimInventory.filter(c=>c.briefingSlug===b.slug);
   expect(claims.map(c=>c.claimText)).toEqual(b.keyPoints);
   for(const c of claims){
    expect(c.evidenceStatus).toBe("unreviewed");
    expect(c.applicabilityStatus).toBe("unassessed");
    expect(c.effectiveFrom).toBeNull();
    expect(c.exactAuthoritySection).toBeNull();
    expect(c.reviewer).toBeNull();
    expect(c.approver).toBeNull();
    expect(c.approvalAt).toBeNull();
    expect(c.candidateAuthorities.length).toBeGreaterThan(0);
   }
  }
 });
 it("keeps draft briefings distinguished from approved articles",()=>{
  expect(briefings.length).toBe(15);
  expect(new Set(briefings.map(b=>b.slug)).size).toBe(briefings.length);
  const covered = new Set(briefings.map(b=>b.domain.slice(0,2)));
  for(const id of domains.map(d=>d.id)){expect(covered.has(id)).toBe(true);}
  for(const b of briefings){
   expect(b.status).toBe("editorial-draft");
   expect(b.sources.length).toBeGreaterThan(0);
   expect(b.controlChecklist.length).toBeGreaterThanOrEqual(3);
   for(const s of b.sources) expect(s.url).toMatch(/^https:\/\//);
  }
 });
});
