import { describe, it, expect } from "vitest";
import { validateChapResponse } from "../chapValidation";

const TEST_CORPUS = ["irc-6656-a", "irc-6656-b"].map(id => ({
  id,
  title: "Trusted IRC §6656",
  citation: id === "irc-6656-b" ? "26 U.S.C. §6656(b)" : "26 U.S.C. §6656(a)",
  sourceType: "usc" as const,
  jurisdiction: "federal",
  sourceUrl: `https://www.law.cornell.edu/uscode/text/26/6656#${id.endsWith("-b") ? "b" : "a"}`,
  content: "Fixture statutory excerpt",
  tags: ["deposit"],
}));

const determination = {
  kind: "determination",
  applicableRegulation: {
    reference: "IRC §6656",
    name: "Failure to make deposit of taxes",
    jurisdiction: "federal",
    primarySourceUrl: "https://www.law.cornell.edu/uscode/text/26/6656",
  },
  analysis: "A three-day-late deposit falls in the 2% tier.",
  determination: "FLAGGED",
  rationale: "IRC §6656(b)(1)(A)(i) sets 2% for failures of not more than 5 days.",
  citations: [
    {
      id: "irc-6656-b",
      citation: "26 U.S.C. §6656(b)",
      sourceUrl: "https://www.law.cornell.edu/uscode/text/26/6656#b",
    },
  ],
  confidence: "high",
};

const outOfScope = {
  kind: "out_of_scope",
  detectedCategory: "multi_state_overtime",
  suggestedAction: "request_demo",
};

describe("validateChapResponse markdown-fence stripping", () => {
  it("accepts plain JSON", () => {
    const v = validateChapResponse(JSON.stringify(determination), TEST_CORPUS);
    expect(v?.kind).toBe("determination");
  });

  it("accepts ```json-fenced output (the model's observed framing)", () => {
    const raw = "```json\n" + JSON.stringify(determination, null, 2) + "\n```";
    const v = validateChapResponse(raw, TEST_CORPUS);
    expect(v?.kind).toBe("determination");
  });

  it("accepts bare ```-fenced output", () => {
    const raw = "```\n" + JSON.stringify(outOfScope) + "\n```";
    const v = validateChapResponse(raw, TEST_CORPUS);
    expect(v?.kind).toBe("out_of_scope");
  });

  it("still rejects non-JSON garbage", () => {
    expect(validateChapResponse("```json\nnot json at all\n```", TEST_CORPUS)).toBeNull();
    expect(validateChapResponse("plain prose answer", TEST_CORPUS)).toBeNull();
  });

  it("uses trusted corpus metadata instead of model-generated citation links", () => {
    const fakeCorpus = [{
      id: "irc-6656-b",
      title: "Trusted IRC §6656(b)",
      citation: "26 U.S.C. §6656(b)",
      sourceType: "usc" as const,
      jurisdiction: "federal",
      sourceUrl: "https://www.law.cornell.edu/uscode/text/26/6656#b",
      content: "Fixture excerpt",
      tags: ["deposit"],
    }];
    const tainted = {
      ...determination,
      applicableRegulation: {
        reference: "Fake statute",
        name: "Fake authority",
        jurisdiction: "other",
        primarySourceUrl: "https://attacker.example/fake",
      },
      citations: [{
        id: "irc-6656-b",
        citation: "Fake citation",
        sourceUrl: "https://attacker.example/fake",
      }],
    };
    const result = validateChapResponse(JSON.stringify(tainted), fakeCorpus);
    expect(result?.kind).toBe("determination");
    if (result?.kind !== "determination") return;
    expect(result.applicableRegulation.primarySourceUrl).toBe(fakeCorpus[0].sourceUrl);
    expect(result.applicableRegulation.reference).toBe(fakeCorpus[0].citation);
    expect(result.citations[0].sourceUrl).toBe(fakeCorpus[0].sourceUrl);
    expect(result.citations[0].citation).toBe(fakeCorpus[0].citation);
  });

  it("still rejects citations outside the corpus", () => {
    const bad = {
      ...determination,
      citations: [
        {
          id: "invented-entry",
          citation: "26 U.S.C. §9999",
          sourceUrl: "https://example.com",
        },
      ],
    };
    const raw = "```json\n" + JSON.stringify(bad) + "\n```";
    expect(validateChapResponse(raw, TEST_CORPUS)).toBeNull();
  });
});
