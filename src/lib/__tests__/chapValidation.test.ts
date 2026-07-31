import { describe, it, expect } from "vitest";
import { validateChapResponse } from "../chapValidation";

const CORPUS_IDS = ["irc-6656-a", "irc-6656-b"];

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
    const v = validateChapResponse(JSON.stringify(determination), CORPUS_IDS);
    expect(v?.kind).toBe("determination");
  });

  it("accepts ```json-fenced output (the model's observed framing)", () => {
    const raw = "```json\n" + JSON.stringify(determination, null, 2) + "\n```";
    const v = validateChapResponse(raw, CORPUS_IDS);
    expect(v?.kind).toBe("determination");
  });

  it("accepts bare ```-fenced output", () => {
    const raw = "```\n" + JSON.stringify(outOfScope) + "\n```";
    const v = validateChapResponse(raw, CORPUS_IDS);
    expect(v?.kind).toBe("out_of_scope");
  });

  it("still rejects non-JSON garbage", () => {
    expect(validateChapResponse("```json\nnot json at all\n```", CORPUS_IDS)).toBeNull();
    expect(validateChapResponse("plain prose answer", CORPUS_IDS)).toBeNull();
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
    expect(validateChapResponse(raw, CORPUS_IDS)).toBeNull();
  });
});
