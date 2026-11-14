import { describe, expect, it } from "vitest";
import {
  APPROVED_DEMO_SELECTIONS,
  CANDIDATE_DEMO_AREAS,
  isApprovedDemoSelection,
} from "../demo-selections";
import { validateAnswers } from "../questionnaire";

describe("Sales Demo scenario selection: default deny", () => {
  it("offers only the explicitly approved general overview until the Demo owner verifies more", () => {
    expect(APPROVED_DEMO_SELECTIONS.map(s => s.id)).toEqual(["general-overview"]);
    expect(CANDIDATE_DEMO_AREAS.every(s => s.status === "needs-demo-acceptance")).toBe(true);
    for (const candidate of CANDIDATE_DEMO_AREAS) {
      expect(isApprovedDemoSelection(candidate.id)).toBe(false);
    }
  });

  it("saves the approved selection through the existing questionnaire allowlist", () => {
    expect(validateAnswers({ demoSelection: "general-overview" })).toEqual({
      ok: true,
      answers: { demoSelection: "general-overview" },
    });
  });

  it("rejects an unavailable, forged or malformed scenario rather than storing it", () => {
    for (const value of ["exception-review", "readiness", "professional-live", 42, "", null]) {
      const result = validateAnswers({ demoSelection: value });
      if (value === null) {
        expect(result.ok).toBe(true); // nullable fields are omitted for partial autosave
      } else {
        expect(result).toEqual({ ok: false, error: "invalid_field:demoSelection" });
      }
    }
  });

  it("continues to accept historical submissions with no selection", () => {
    expect(validateAnswers({ organizationSize: "51-200" })).toEqual({
      ok: true, answers: { organizationSize: "51-200" }
    });
  });
});
