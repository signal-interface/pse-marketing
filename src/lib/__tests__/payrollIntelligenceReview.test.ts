import { describe, expect, it } from "vitest";
import { editorialClaimInventory } from "../payroll-intelligence-claim-inventory";
import { sourceMappedClaims, sourceMappingProblems } from "../payroll-intelligence-source-mappings";
import { getClaimCoverage } from "../payroll-intelligence-coverage";
import { claimTriage, claimTriageMetrics } from "../payroll-intelligence-claim-triage";
import { nonlegalReviewTickets, getCandidateReleaseGates, candidateReleaseAllowed, validateEditorialQueue } from "../payroll-intelligence-publication-preflight";
import { editorialPublicationAuthorized, initialClaimReviewRecords, inspectClaimReview, type ClaimReview } from "../payroll-intelligence-review";

const base = (): ClaimReview => ({
 claimId: editorialClaimInventory[0].id,
 exactClaimText: editorialClaimInventory[0].claimText,
 status: "reviewed-for-editorial-consideration",
 source: { title:"Official source", url:"https://www.irs.gov/publications/p15t", pinpoint:"Section 1 / Worksheet 1A", kind:"official-agency-guidance",versionOrPublicationDate:"2026 revision",checkedDate:"2026-11-03" },
 applicability:{jurisdiction:"US federal",affectedPopulation:"Applicable employers",effectiveFrom:"2026-01-01",effectiveUntil:null,exceptions:"Exceptions require independent review"},
 reviewer:{name:"Example Reviewer",reviewedAt:"2026-11-03"},
 notes:"Test fixture only; not an actual review",
});

describe("claim review release safeguards",()=>{
 it("creates exactly nineteen unapproved editorial tickets and fails closed",()=>{
  expect(nonlegalReviewTickets).toHaveLength(19);
  expect(new Set(nonlegalReviewTickets.map(t=>t.claimId)).size).toBe(19);
  expect(nonlegalReviewTickets.every(t=>t.disposition==="open" && t.approved===false && t.reviewer===null)).toBe(true);
  expect(nonlegalReviewTickets.every(t=>t.requiredLabel.length>15 && t.reviewQuestion.length>15 && t.requiredEvidence.length>15)).toBe(true);
  expect(()=>validateEditorialQueue()).not.toThrow();
  const gates=getCandidateReleaseGates();
  expect(gates.length).toBeGreaterThanOrEqual(8);
  expect(gates.some(g=>!g.passed)).toBe(true);
  expect(candidateReleaseAllowed).toBe(false);
 });

 it("classifies every draft statement without manufacturing approval or citations",()=>{
  expect(claimTriageMetrics.total).toBe(38);
  expect(claimTriageMetrics.mapped).toBe(19);
  expect(claimTriageMetrics.unmapped).toBe(19);
  expect(claimTriageMetrics.unmappedLegal).toBe(0);
  expect(claimTriageMetrics.unmappedNonlegal).toBe(19);
  expect(claimTriageMetrics.approved).toBe(0);
  expect(new Set(claimTriage.map(c=>c.claimId)).size).toBe(38);
  expect(claimTriage.every(c=>c.approval==="not-approved")).toBe(true);
  expect(claimTriage.filter(c=>c.sourceLocationStatus==="unmapped").length).toBe(19);
 });

 it("tracks unreviewed and mapped assertions without implying legal approval",()=>{
  const coverage=getClaimCoverage();
  expect(coverage.totalDraftClaims).toBe(38);
  expect(coverage.mappedSourceLocations).toBe(19);
  expect(coverage.stillUnmapped).toBe(19);
  expect(coverage.humanReviewed).toBe(0);
  expect(coverage.publicationApproved).toBe(false);
  expect(coverage.unmappedByDomain.reduce((n,x)=>n+x.count,0)).toBe(19);
 });

 it("maps nineteen real draft statements to pinpoint official sources",()=>{
  expect(sourceMappedClaims).toHaveLength(19);
  expect(new Set(sourceMappedClaims.map(s=>s.claimId)).size).toBe(19);
  expect(sourceMappingProblems).toEqual([]);
  for(const r of sourceMappedClaims){
   expect(r.status).toBe("source-mapped");
   expect(r.source?.pinpoint.length).toBeGreaterThan(12);
   expect(r.source?.checkedDate).toBe("2026-11-03");
   expect(r.applicability).toBeNull();
   expect(r.reviewer).toBeNull();
  }
  expect(editorialPublicationAuthorized).toBe(false);
 });

 it("starts with exactly one evidence-free record per draft claim",()=>{
  expect(initialClaimReviewRecords.length).toBe(editorialClaimInventory.length);
  expect(new Set(initialClaimReviewRecords.map(r=>r.claimId)).size).toBe(initialClaimReviewRecords.length);
  expect(initialClaimReviewRecords.every(r=>r.status==="needs-source" && !r.source && !r.reviewer)).toBe(true);
  expect(editorialPublicationAuthorized).toBe(false);
 });
 it("requires source pinpoint, HTTPS, version and date",()=>{
  const b=base();
  expect(inspectClaimReview(b)).toEqual([]);
  expect(inspectClaimReview({...b,source:{...b.source!,pinpoint:"",checkedDate:"2026-02-30",url:"http://example.com"}}).map(p=>p.field)).toEqual(expect.arrayContaining(["source.pinpoint","source.checkedDate","source.url"]));
 });
 it("does not allow unknown or modified draft claims",()=>{
  expect(inspectClaimReview({...base(),claimId:"unknown"}).some(p=>p.field==="claimId")).toBe(true);
  expect(inspectClaimReview({...base(),exactClaimText:"material revision"}).some(p=>p.field==="exactClaimText")).toBe(true);
 });
 it("requires applicability and genuine human review metadata",()=>{
  const b=base();
  expect(inspectClaimReview({...b,applicability:null,reviewer:null}).map(p=>p.field)).toEqual(expect.arrayContaining(["applicability","reviewer"]));
  expect(inspectClaimReview({...b,applicability:{...b.applicability!,effectiveUntil:"2025-12-31",exceptions:""}}).map(p=>p.field)).toEqual(expect.arrayContaining(["applicability.effectiveUntil","applicability.exceptions"]));
 });
 it("allows explicit incomplete states without implying publication",()=>{
  expect(inspectClaimReview({...base(),status:"needs-source",source:null,applicability:null,reviewer:null})).toEqual([]);
  expect(inspectClaimReview({...base(),status:"requires-revision",source:null,applicability:null,reviewer:null})).toEqual([]);
  expect(editorialPublicationAuthorized).toBe(false);
 });
});
