import { describe, expect, it } from "vitest";
import { educationalMarketingResponse } from "../chapMarketingEducation";
import { COMPLIANCE_CORPUS } from "@/data/complianceCorpus";

// These are factual regression checks, not independent professional
// payroll-tax approval. Live editorial acceptance remains mandatory.
const prompts = [
  ["What triggers an IRC §6656 deposit penalty?", "deposit-trigger"],
  ["How can reconciliation gaps cascade into failure-to-deposit penalties?", "reconciliation-and-deposits"],
  ["How is the four-tier §6656(b) penalty calculated?", "deposit-rate-tiers"],
  ["What happens when employment tax deposits cross $100,000?", "one-day-deposit-rule"],
  ["Do I qualify for first-time depositor relief under IRC §6656(c)?", "first-time-depositor-relief"],
  ["What counts as reasonable cause for penalty abatement?", "reasonable-cause-relief"],
  ["Does the 2% deposit shortfall safe harbor always apply?", "deposit-shortfall-safe-harbor"],
] as const;

describe("CHAP §6656 bounded educational answer policy", () => {
  it.each(prompts)("returns stable statutory education for %s", (question, expected) => {
    const first = educationalMarketingResponse(question);
    expect(first.kind).toBe("education");
    expect(educationalMarketingResponse(question)).toEqual(first);
    if (first.kind !== "education") return;
    expect(first.topicId).toBe(expected);
    expect(first.citations.length).toBeGreaterThan(0);
    expect(JSON.stringify(first)).not.toMatch(/"confidence"|"determination"/);
    for (const citation of first.citations) {
      const entry = COMPLIANCE_CORPUS.find(source => source.id === citation.id);
      expect(entry).toBeDefined();
      expect(entry?.sourceType).not.toBe("pse_written");
      expect(citation.sourceUrl).toBe(entry?.sourceUrl);
      expect(citation.citation).toBe(entry?.citation);
    }
  });

  it("distinguishes reasonable cause from willful neglect", () => {
    const response = educationalMarketingResponse("What triggers an IRC §6656 deposit penalty?");
    expect(response.kind).toBe("education");
    if (response.kind !== "education") return;
    expect(response.analysis).toContain("does not itself prove willful neglect");
    expect(response.analysis).not.toMatch(/not attributable to reasonable cause \(i\.e\./);
  });

  it("does not make a reconciliation difference an automatic underpayment", () => {
    const response = educationalMarketingResponse("How can reconciliation gaps cascade into failure-to-deposit penalties?");
    expect(response.kind).toBe("education");
    if (response.kind !== "education") return;
    expect(response.analysis).toContain("not by itself proof");
    expect(response.analysis).toContain("actual tax required");
    expect(response.analysis).not.toContain("automatically imposed");
  });

  it("requires statutory notice conditions for the 15% rate", () => {
    const response = educationalMarketingResponse("What are §6656 deposit penalty tiers and notice rules?");
    expect(response.kind).toBe("education");
    if (response.kind !== "education") return;
    expect(response.analysis).toContain("separate 15% special rule");
    expect(response.analysis).toContain("not arise solely");
  });

  it("does not treat the regulatory safe harbor as the only relief", () => {
    const response = educationalMarketingResponse("What is the deposit shortfall safe harbor?");
    expect(response.kind).toBe("education");
    if (response.kind !== "education") return;
    expect(response.analysis).toContain("not the only potential source of relief");
  });

  it("limits unknown questions without invented determinations", () => {
    const reply = educationalMarketingResponse("How do I knit mittens?");
    expect(reply.kind).toBe("limited_education");
    expect(JSON.stringify(reply)).not.toMatch(/"confidence"|"determination"/);
  });
});
