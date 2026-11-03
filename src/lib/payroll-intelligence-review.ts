import { editorialClaimInventory } from "./payroll-intelligence-claim-inventory";

/**
 * Editorial-only intake records. These never authorize publication.
 * Pinpoint sections, effective dates, and reviewers are required for review.
 */
export type ReviewStatus = "needs-source" | "source-mapped" | "requires-revision" | "reviewed-for-editorial-consideration";
export type AuthorityKind = "statute" | "regulation" | "official-agency-guidance" | "nonbinding-framework";
export type ClaimReview = {
  claimId: string;
  exactClaimText: string;
  status: ReviewStatus;
  source: {
    title: string;
    url: string;
    pinpoint: string;
    kind: AuthorityKind;
    versionOrPublicationDate: string;
    checkedDate: string;
  } | null;
  applicability: {
    jurisdiction: string;
    affectedPopulation: string;
    effectiveFrom: string;
    effectiveUntil: string | null;
    exceptions: string;
  } | null;
  reviewer: { name: string; reviewedAt: string } | null;
  notes: string;
};

export type ReviewProblem = { claimId: string; field: string; message: string };

const dateIsValid = (value: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(Date.parse(value)) &&
  new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value;

const secureAuthorityUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && parsed.hostname.length > 0 && !parsed.username && !parsed.password;
  } catch { return false; }
};

const filled = (value: string | null | undefined): boolean => typeof value === "string" && value.trim().length > 0;

export function inspectClaimReview(record: ClaimReview): ReviewProblem[] {
  const problems: ReviewProblem[] = [];
  const add = (field: string, message: string) => problems.push({ claimId: record.claimId, field, message });
  const current = editorialClaimInventory.find(item => item.id === record.claimId);
  if (!current) add("claimId", "Unknown draft claim; cannot use this record.");
  else if (record.exactClaimText !== current.claimText) add("exactClaimText", "Draft text changed; recheck authority and applicability.");
  if (record.status === "needs-source" || record.status === "requires-revision") {
    // These states intentionally remain incomplete and never become approvals.
    return problems;
  }
  if (!record.source) add("source", "Exact source required before mapping a claim.");
  else {
    if (!filled(record.source.title)) add("source.title", "Authority title required.");
    if (!secureAuthorityUrl(record.source.url)) add("source.url", "An HTTPS source URL with no credentials is required.");
    if (!filled(record.source.pinpoint)) add("source.pinpoint", "Exact page, section, paragraph or clause required.");
    if (!filled(record.source.versionOrPublicationDate)) add("source.versionOrPublicationDate", "Source revision required.");
    if (!dateIsValid(record.source.checkedDate)) add("source.checkedDate", "Valid source-check date required.");
  }
  if (record.status === "reviewed-for-editorial-consideration") {
    if (!record.applicability) add("applicability", "Jurisdiction and effective period required.");
    else {
      if (!filled(record.applicability.jurisdiction)) add("applicability.jurisdiction", "Jurisdiction required.");
      if (!filled(record.applicability.affectedPopulation)) add("applicability.affectedPopulation", "Affected employer or worker scope required.");
      if (!dateIsValid(record.applicability.effectiveFrom)) add("applicability.effectiveFrom", "Valid effective date required.");
      if (record.applicability.effectiveUntil !== null && !dateIsValid(record.applicability.effectiveUntil)) add("applicability.effectiveUntil", "Invalid end date.");
      if (record.applicability.effectiveUntil && record.applicability.effectiveUntil < record.applicability.effectiveFrom) add("applicability.effectiveUntil", "End date must not precede effective date.");
      if (!filled(record.applicability.exceptions)) add("applicability.exceptions", "Explicit exceptions or 'none identified' statement required.");
    }
    if (!record.reviewer || !filled(record.reviewer.name) || !dateIsValid(record.reviewer.reviewedAt)) {
      add("reviewer", "Named, dated human reviewer required.");
    }
  }
  return problems;
}

/** Initial drafts contain no forged evidence and cannot be approved. */
export const initialClaimReviewRecords: readonly ClaimReview[] = editorialClaimInventory.map(c => ({
  claimId: c.id,
  exactClaimText: c.claimText,
  status: "needs-source",
  source: null,
  applicability: null,
  reviewer: null,
  notes: "Candidate article references are leads only; no exact authority or approval has been established.",
}));

/** Deliberately no 'published' state or permissive publish function in this module. */
export const editorialPublicationAuthorized = false as const;
