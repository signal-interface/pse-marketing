// Hand-rolled validation of CHAP AI model output.
//
// Style matches the rest of the codebase (no Zod). The validator is
// strict: any shape violation, missing field, wrong type, or invented
// citation ID results in `null` — the API route treats null as an
// out-of-scope fallback. The validator never throws.
//
// The `citations[].id` check is load-bearing: it prevents the model
// from fabricating citation slugs. Every id must be in the retrieved
// corpus passed in.

export type DeterminationValue = "FLAGGED" | "CLEAR" | "NEEDS_HUMAN_REVIEW";
export type ConfidenceValue = "high" | "medium" | "low";
export type OutOfScopeCategory =
  | "multi_state_overtime"
  | "injection"
  | "other";

export interface ApplicableRegulation {
  reference: string;
  name: string;
  jurisdiction: string;
  primarySourceUrl: string;
}

export interface Citation {
  id: string;
  citation: string;
  sourceUrl: string;
}

export interface DeterminationResponse {
  kind: "determination";
  applicableRegulation: ApplicableRegulation;
  analysis: string;
  determination: DeterminationValue;
  rationale: string;
  citations: Citation[];
  confidence: ConfidenceValue;
}

export interface OutOfScopeResponse {
  kind: "out_of_scope";
  detectedCategory: OutOfScopeCategory;
  suggestedAction: "request_demo";
}

export type ValidatedResponse = DeterminationResponse | OutOfScopeResponse;

const DETERMINATION_VALUES: ReadonlyArray<DeterminationValue> = [
  "FLAGGED",
  "CLEAR",
  "NEEDS_HUMAN_REVIEW",
];

const CONFIDENCE_VALUES: ReadonlyArray<ConfidenceValue> = [
  "high",
  "medium",
  "low",
];

const OUT_OF_SCOPE_CATEGORIES: ReadonlyArray<OutOfScopeCategory> = [
  "multi_state_overtime",
  "injection",
  "other",
];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function validateApplicableRegulation(
  v: unknown
): ApplicableRegulation | null {
  if (!isRecord(v)) return null;
  if (!isNonEmptyString(v.reference)) return null;
  if (!isNonEmptyString(v.name)) return null;
  if (!isNonEmptyString(v.jurisdiction)) return null;
  if (!isNonEmptyString(v.primarySourceUrl)) return null;
  return {
    reference: v.reference,
    name: v.name,
    jurisdiction: v.jurisdiction,
    primarySourceUrl: v.primarySourceUrl,
  };
}

function validateCitation(v: unknown, corpusIds: string[]): Citation | null {
  if (!isRecord(v)) return null;
  if (!isNonEmptyString(v.id)) return null;
  if (!corpusIds.includes(v.id)) return null;
  if (!isNonEmptyString(v.citation)) return null;
  if (!isNonEmptyString(v.sourceUrl)) return null;
  return { id: v.id, citation: v.citation, sourceUrl: v.sourceUrl };
}

function validateDetermination(
  v: Record<string, unknown>,
  corpusIds: string[]
): DeterminationResponse | null {
  const reg = validateApplicableRegulation(v.applicableRegulation);
  if (!reg) return null;

  if (!isNonEmptyString(v.analysis)) return null;
  if (!isNonEmptyString(v.rationale)) return null;

  if (
    typeof v.determination !== "string" ||
    !DETERMINATION_VALUES.includes(v.determination as DeterminationValue)
  ) {
    return null;
  }

  if (
    typeof v.confidence !== "string" ||
    !CONFIDENCE_VALUES.includes(v.confidence as ConfidenceValue)
  ) {
    return null;
  }

  if (!Array.isArray(v.citations) || v.citations.length === 0) return null;
  const citations: Citation[] = [];
  for (const c of v.citations) {
    const validated = validateCitation(c, corpusIds);
    if (!validated) return null;
    citations.push(validated);
  }

  return {
    kind: "determination",
    applicableRegulation: reg,
    analysis: v.analysis,
    determination: v.determination as DeterminationValue,
    rationale: v.rationale,
    citations,
    confidence: v.confidence as ConfidenceValue,
  };
}

function validateOutOfScope(
  v: Record<string, unknown>
): OutOfScopeResponse | null {
  if (
    typeof v.detectedCategory !== "string" ||
    !OUT_OF_SCOPE_CATEGORIES.includes(
      v.detectedCategory as OutOfScopeCategory
    )
  ) {
    return null;
  }
  if (v.suggestedAction !== "request_demo") return null;
  return {
    kind: "out_of_scope",
    detectedCategory: v.detectedCategory as OutOfScopeCategory,
    suggestedAction: "request_demo",
  };
}

export function validateChapResponse(
  raw: unknown,
  corpusIds: string[]
): ValidatedResponse | null {
  let parsed: unknown = raw;

  if (typeof raw === "string") {
    // The model routinely wraps its JSON in a markdown fence despite the
    // schema instruction; strip one before parsing or every fenced
    // response validates to null.
    const unfenced = raw
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "");
    try {
      parsed = JSON.parse(unfenced);
    } catch {
      return null;
    }
  }

  if (!isRecord(parsed)) return null;

  if (parsed.kind === "determination") {
    return validateDetermination(parsed, corpusIds);
  }
  if (parsed.kind === "out_of_scope") {
    return validateOutOfScope(parsed);
  }

  return null;
}

// Synthetic out-of-scope response used when injection patterns are
// matched pre-model, so we never bill for an obviously-adversarial
// question. Mirrors the shape the validator would produce.
export function syntheticInjectionOutOfScope(): OutOfScopeResponse {
  return {
    kind: "out_of_scope",
    detectedCategory: "injection",
    suggestedAction: "request_demo",
  };
}
