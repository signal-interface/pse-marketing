import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { editorialNotices, noticesByDomain } from "../payroll-intelligence-editorial-notices";
import { claimTriage } from "../payroll-intelligence-claim-triage";
import { sourceMappedClaims } from "../payroll-intelligence-source-mappings";

describe("PSE educational context publication boundaries", () => {
 it("accounts for all nineteen nonlegal draft qualifications exactly once",()=>{
  const mapped=new Set(sourceMappedClaims.map(c=>c.claimId));
  const expected=claimTriage.filter(c=>!mapped.has(c.claimId));
  expect(expected.length).toBe(19);
  expect(editorialNotices.length).toBe(19);
  expect(new Set(editorialNotices.map(n=>n.claimId)).size).toBe(19);
  expect(new Set(editorialNotices.map(n=>n.claimId))).toEqual(new Set(expected.map(c=>c.claimId)));
  expect(editorialNotices.filter(n=>n.lane==="jurisdictional-limitation")).toHaveLength(15);
  expect(editorialNotices.filter(n=>n.lane==="source-limitation")).toHaveLength(3);
  expect(editorialNotices.filter(n=>n.lane==="pse-control-recommendation")).toHaveLength(1);
  for(const n of editorialNotices){
   expect(n.qualifiedLegalReview).toBe(false);
   expect(n.publicationScope).toBe("educational-context-only");
   expect(n.wording.length).toBeGreaterThan(30);
   expect(n.lane).not.toBe("legal-assertion");
  }
 });
 it("source limitations use official references and never claim binding regulation",()=>{
  const sourceLimited=editorialNotices.filter(n=>n.lane==="source-limitation");
  expect(sourceLimited.every(n=>n.source?.url.startsWith("https://"))).toBe(true);
  expect(sourceLimited.some(n=>n.wording.includes("2023"))).toBe(true);
  expect(sourceLimited.some(n=>n.wording.includes("voluntary"))).toBe(true);
  const domainCount=new Set(editorialNotices.map(n=>n.domainId));
  expect(domainCount.size).toBe(13);
  for(const domainId of domainCount)expect(noticesByDomain(domainId).length).toBeGreaterThan(0);
 });
 it("surfaces qualified notices only in the educational domain page",()=>{
  const page=readFileSync("src/app/payroll-intelligence/topics/[slug]/page.tsx","utf8");
  expect(page).toContain("noticesByDomain(d.id)");
  expect(page).toContain("not independently certified legal conclusions");
  expect(page).toContain("n.source.url");
 });
});
