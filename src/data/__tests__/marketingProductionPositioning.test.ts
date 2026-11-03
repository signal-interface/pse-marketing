import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { BENCHMARKS } from "../estimatorConstants";

const read=(path:string)=>readFileSync(path,"utf8");
describe("production-only PSE marketing positioning and estimator calibration disclosure",()=>{
 it("contains no nonproduction homepage badges or preorder app metadata",()=>{
  const services=read("src/components/sections/Services.tsx");
  const chap=read("src/components/sections/ChapAI.tsx");
  const chapPage=read("src/app/chap-ai/page.tsx");
  const serviceCatalog=read("src/app/services/page.tsx");
  const serviceDetails=read("src/components/templates/ServicePage.tsx");
  const serviceData=read("src/data/services.ts");
  const layout=read("src/app/layout.tsx");
  expect(services).not.toContain("Coming Soon");
  expect(services).not.toContain("COMING_SOON_SLUGS");
  expect(chap).not.toContain("Early Access");
  expect(chapPage).not.toContain("Early Access");
  expect(chapPage).not.toContain("Early access available");
  expect(layout).not.toContain("schema.org/PreOrder");
  expect(serviceCatalog).not.toContain("Coming Soon");
  expect(serviceDetails).not.toContain("Coming Soon");
  expect(serviceDetails).not.toContain("Notify Me");
  expect(serviceData).not.toContain("in development");
  expect(serviceData).not.toContain("Notify Me When Available");
  expect(layout).not.toContain('operatingSystem: "Web, Chrome Extension"');
 });
 it("preserves model behavior but makes calibration distinction explicit",()=>{
  const constants=read("src/data/estimatorConstants.ts");
  const results=read("src/components/sections/ComplianceEstimator.tsx");
  const page=read("src/app/compliance-risk/page.tsx");
  expect(BENCHMARKS.EMPLOYER_ERROR_RATE).toBe(0.33);
  expect(constants).toContain("NOT A VERIFIED EXTERNAL STATISTIC");
  expect(constants).toContain("Internal relative-risk scenario multipliers");
  expect(results).toContain("33% employer-error calibration");
  expect(results).toContain("not a verified IRS or DOL statistic");
  expect(page).toContain("clearly disclosed PSE modeling assumptions");
 });
 it("keeps illustrative scan labeling and marketing boundaries",()=>{
  const chap=read("src/components/sections/ChapAI.tsx");
  expect(chap).toContain("Sample scan — illustrative");
  const state=read("src/app/payroll-intelligence/state-sources/page.tsx");
  expect(state).toContain("index:false");
 });
});