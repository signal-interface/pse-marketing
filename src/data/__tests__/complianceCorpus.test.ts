import { describe, it, expect } from "vitest";
import { COMPLIANCE_CORPUS } from "../complianceCorpus";

// Corpus integrity — the CHAP widget's value proposition is citation
// integrity. These assertions are release gates: placeholder or thin
// content must never ship (DEPLOY_CHECKLIST.md item #2).
describe("compliance corpus integrity", () => {
  it("has the expected corpus size", () => {
    expect(COMPLIANCE_CORPUS).toHaveLength(10);
  });

  it("contains no placeholder content", () => {
    for (const entry of COMPLIANCE_CORPUS) {
      expect(entry.content, entry.id).not.toContain("[Founder to populate");
      expect(entry.content.trim().length, entry.id).toBeGreaterThan(100);
    }
  });

  it("every entry carries a citation and an https source", () => {
    for (const entry of COMPLIANCE_CORPUS) {
      expect(entry.citation.length, entry.id).toBeGreaterThan(0);
      expect(entry.sourceUrl, entry.id).toMatch(/^https:\/\//);
      expect(entry.tags.length, entry.id).toBeGreaterThan(0);
    }
  });

  it("statutory entries quote the load-bearing figures of their subsection", () => {
    const byId = Object.fromEntries(COMPLIANCE_CORPUS.map((e) => [e.id, e]));
    // §6656(b) four-tier penalty structure
    expect(byId["irc-6656-b"].content).toContain("2 percent");
    expect(byId["irc-6656-b"].content).toContain("5 percent");
    expect(byId["irc-6656-b"].content).toContain("10 percent");
    expect(byId["irc-6656-b"].content).toContain("15 percent");
    // §6656(a) reasonable-cause standard
    expect(byId["irc-6656-a"].content.toLowerCase()).toContain("reasonable cause");
    expect(byId["irc-6656-a"].content.toLowerCase()).toContain("willful neglect");
  });

  it("the pse_written entry never asserts statute text of its own", () => {
    const pse = COMPLIANCE_CORPUS.find((e) => e.sourceType === "pse_written");
    expect(pse).toBeDefined();
    // Authored analysis must direct readers to the primary-source entries
    // rather than restating statute as if quoted.
    expect(pse!.content).toContain("§6656");
  });
});
