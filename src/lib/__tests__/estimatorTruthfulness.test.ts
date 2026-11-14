import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { calculateExposure } from "@/lib/estimator";
import { BENCHMARKS } from "@/data/estimatorConstants";

const page = readFileSync("src/app/compliance-risk/page.tsx", "utf8");
const component = readFileSync("src/components/sections/ComplianceEstimator.tsx", "utf8");
const pdf = readFileSync("src/lib/generateReport.ts", "utf8");

describe("Compliance Risk Estimator truthfulness contracts", () => {
  it("retains historical financial model calibration pending owner decision", () => {
    expect(BENCHMARKS.EMPLOYER_ERROR_RATE).toBe(0.33);
    const inputs = { employees: 250, states: 3, industry: "other" as const };
    const first = calculateExposure(inputs);
    expect(first.totalAnnualExposure).toBe(
      first.depositPenaltyExposure +
      first.wageHourExposure +
      first.complianceTimeCost +
      first.errorCorrectionCost
    );
    expect(calculateExposure(inputs)).toEqual(first);
  });

  it("explicitly distinguishes scenarios from employer-specific assessed risk", () => {
    expect(page).toContain("illustrative annual scenario");
    expect(page).not.toContain("risk is your payroll carrying right now");
    expect(component).toContain("33% employer-error calibration");
    expect(component).toContain("categories may overlap");
    expect(component).toContain("not an actual employer loss estimate");
    expect(component).toContain("statutory notice conditions");
  });

  it("does not claim the public CHAP widget validates every payroll run", () => {
    expect(pdf).not.toContain("validates every payroll run");
    expect(pdf).not.toContain("automatically.");
    expect(pdf).toContain("public CHAP educational widget does not inspect payroll data");
  });

  it("discloses internal assumptions in the downloadable PDF", () => {
    expect(pdf).toContain("PSE internal assumptions");
    expect(pdf).toContain("Categories may overlap");
    expect(pdf).toContain("not a forecast, assessed penalty, actual loss");
    expect(pdf).toContain("not DOL coefficients");
  });
});
