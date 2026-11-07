import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { CLAIMS } from "@/content/trust/claims";

const read = (file: string) => readFileSync(file, "utf8");

describe("CHAP Guard deferred / PSE synthetic-only demonstration", () => {
  const chapPage = read("src/app/chap-ai/page.tsx");
  const homepageChap = read("src/components/sections/ChapAI.tsx");
  const publicSurfaces = [chapPage, homepageChap];

  it("does not promote unavailable CHAP Guard, a browser extension, or access offers", () => {
    for (const source of publicSurfaces) {
      expect(source).not.toMatch(/CHAP Guard/i);
      expect(source).not.toMatch(/Request Access/);
      expect(source).not.toMatch(/Chrome Extension/i);
    }
  });

  it("does not advertise deferred Guard in site-wide structured metadata", () => {
    const layout = read("src/app/layout.tsx");
    expect(layout).not.toContain('alternateName: "CHAP Guard"');
    expect(layout).toContain('name: "CHAP AI"');
  });

  it("uses synthetic data and does not request actual payroll files", () => {
    expect(chapPage).toContain("fixed synthetic payroll data");
    expect(chapPage).toContain("No customer payroll files are required");
    expect(chapPage).not.toMatch(/Bring your last payroll file/i);
    expect(chapPage).not.toMatch(/personalized walkthrough/i);
    expect(chapPage).toContain('href="/#demo"');
  });

  it("retains the nonfunctional Guard claim for history but never marks it public", () => {
    const guard = CLAIMS.find((claim) => claim.id === "chap-guard-extension");
    expect(guard).toBeDefined();
    expect(guard?.status).toBe("planned");
    expect(guard?.surfaces).toEqual([]);
    expect(guard?.evidence.some((e) => e.kind === "founder_attested")).toBe(true);
  });

  it("preserves the canonical CHAP naming", () => {
    expect(chapPage).toContain("Compliance, Helpdesk &amp; Automation Platform");
  });
});
