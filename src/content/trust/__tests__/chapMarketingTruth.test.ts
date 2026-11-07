import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { CLAIMS } from "@/content/trust/claims";
import { COMPLIANCE_CORPUS } from "@/data/complianceCorpus";

const page = readFileSync("src/app/chap-ai/page.tsx", "utf8");
const homepage = readFileSync("src/components/sections/ChapAI.tsx", "utf8");

describe("bounded CHAP Marketing claims", () => {
  it("limits the public widget to educational IRC 6656 content", () => {
    expect(page).toContain("IRC §6656");
    expect(page).toContain("not connected to a payroll system or customer data");
    expect(page).toContain("fixed synthetic payroll data");
    expect(page).toContain("No customer payroll files are required");
    expect(page).toContain("Compliance, Helpdesk &amp; Automation Platform");
  });

  it("does not advertise unsupported operations, retention, or coverage", () => {
    expect(page).not.toMatch(/continuously monitors|three years of records|additional states monitored|every payroll cycle|every review cycle|automated regulatory change/i);
    expect(page).not.toContain("Regulatory changes reflected in CHAP AI rules");
    expect(page).not.toContain("CHAP Guard");
    expect(page).not.toContain("Bring your last payroll file");
    expect(homepage).not.toContain("The compliance brain behind every payroll run.");
  });

  it("removes invented regulatory-update log from live surfaces", () => {
    expect(page).not.toContain("regulatory update log — sample data");
    const claim = CLAIMS.find((c) => c.id === "chap-regulatory-log-sample");
    expect(claim?.surfaces).toEqual([]);
  });

  it("does not supply a false per-run operational claim to the AI corpus", () => {
    const prose = COMPLIANCE_CORPUS
      .filter((item) => item.sourceType === "pse_written")
      .map((item) => item.content).join(" ");
    expect(prose).not.toMatch(/PSE validates deposit timing.*on every run/i);
    expect(prose).toContain("The public CHAP widget does not inspect actual payroll runs");
  });
});
