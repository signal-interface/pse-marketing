import { describe, expect, it } from "vitest";
import { retrieveRelevantCorpus } from "../corpusRetrieval";
import { COMPLIANCE_CORPUS } from "@/data/complianceCorpus";

describe("CHAP marketing retrieval authority eligibility", () => {
  it("filters PSE commentary before ranking, so it never consumes a top-k slot", () => {
    const question = "How can reconciliation gaps cascade into failure-to-deposit penalties?";
    const results = retrieveRelevantCorpus(question, 5);
    expect(results).toHaveLength(5);
    expect(results.every(entry => entry.sourceType !== "pse_written")).toBe(true);
    expect(results.some(entry => entry.id === "cfr-31-6302-1")).toBe(true);
  });

  it("returns a bounded official-source corpus for a note-oriented query", () => {
    const entries = retrieveRelevantCorpus("pse analysis common triggers multi state bonus run", 5);
    expect(entries.length).toBeGreaterThan(0);
    expect(entries.length).toBeLessThanOrEqual(5);
    expect(entries.every(entry => entry.sourceType !== "pse_written")).toBe(true);
  });

  it("does not return the author's note when no authority matches", () => {
    const entries = retrieveRelevantCorpus("zxyqneverhitword", 5);
    const eligibleCount = COMPLIANCE_CORPUS.filter(e => e.sourceType !== "pse_written").length;
    expect(entries.length).toBe(Math.min(eligibleCount, 5));
    expect(entries.every(e => e.sourceType !== "pse_written")).toBe(true);
  });
});
