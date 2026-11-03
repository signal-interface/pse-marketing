import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { briefings } from "../payroll-intelligence-briefings";
import { sourceMappedClaims } from "../payroll-intelligence-source-mappings";
import { domains } from "../payroll-intelligence";
import { NAV_LINKS, PUBLIC_ROUTES } from "../constants";

describe("public payroll intelligence source-citation release boundaries", () => {
  it("publishes only source-located briefing pages, not the full draft corpus", () => {
    const publicBriefings = briefings.filter(b => sourceMappedClaims.some(c => b.keyPoints.includes(c.exactClaimText)));
    expect(publicBriefings.length).toBe(9);
    expect(publicBriefings.length).toBeLessThan(briefings.length);
    for (const b of publicBriefings) {
      const mapped = sourceMappedClaims.filter(c => b.keyPoints.includes(c.exactClaimText));
      expect(mapped.length).toBeGreaterThan(0);
      for (const c of mapped) {
        expect(c.source?.url).toMatch(/^https:\/\//);
        expect(c.source?.pinpoint).toBeTruthy();
        expect(c.reviewer).toBeNull();
      }
    }
  });
  it("links public index and excludes unqualified statements from rendered briefing text", () => {
    expect(NAV_LINKS.some(link => link.href === "/payroll-intelligence")).toBe(true);
    expect(PUBLIC_ROUTES).toContain("/payroll-intelligence");
    const briefPage = readFileSync("src/app/payroll-intelligence/briefings/[slug]/page.tsx","utf8");
    expect(briefPage).toContain("claims.map");
    expect(briefPage).not.toContain("b.keyPoints.map");
    expect(briefPage).toContain("claims.length===0");
    expect(briefPage).toContain("notFound()");
  });
  it("avoids claims of automatic 2027 legal verification", () => {
    expect(domains.length).toBe(15);
    const landing = readFileSync("src/app/payroll-intelligence/page.tsx", "utf8");
    expect(landing).toContain("Requirements differ by employer");
    expect(landing).not.toContain("regulatory approval guaranteed");
  });
});
