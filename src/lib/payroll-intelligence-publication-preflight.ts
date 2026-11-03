import { claimTriage, type ClaimLane } from "./payroll-intelligence-claim-triage";
import { editorialClaimInventory } from "./payroll-intelligence-claim-inventory";
import { sourceMappedClaims } from "./payroll-intelligence-source-mappings";

/**
 * Editorial disposition of statements without pinpoint citations.
 * This is an internal review queue, not a claim that any limitation is true
 * in a particular jurisdiction, and never a legal or publication approval.
 */
export type NonlegalReviewTicket = {
  claimId: string;
  domainId: string;
  claimText: string;
  lane: Exclude<ClaimLane, "legal-assertion">;
  requiredLabel: string;
  reviewQuestion: string;
  requiredEvidence: string;
  disposition: "open";
  reviewer: null;
  approved: false;
};

const rules = {
  "jurisdictional-limitation": {
    requiredLabel: "Scope limitation — applicability must be independently assessed",
    reviewQuestion: "Is the statement accurately bounded to the applicable jurisdiction, worker type and effective period?",
    requiredEvidence: "Current controlling agency source for jurisdictional scope, or an explicit statement that no broader legal claim is made",
  },
  "source-limitation": {
    requiredLabel: "Source limitation — historical, contextual or nonbinding reference",
    reviewQuestion: "Does the page accurately identify publication currency and whether the cited material carries legal force?",
    requiredEvidence: "Official source's date, authority status, and original PSE explanation of its limitations",
  },
  "pse-control-recommendation": {
    requiredLabel: "PSE recommended control — not a statutory mandate",
    reviewQuestion: "Is this clearly PSE-authored assurance guidance, rather than a claimed agency-imposed requirement?",
    requiredEvidence: "Editorial rationale, scope, control purpose and independent human review",
  },
} as const;

export const nonlegalReviewTickets: readonly NonlegalReviewTicket[] = claimTriage
  .filter(c => c.sourceLocationStatus === "unmapped" && c.lane !== "legal-assertion")
  .map(c => {
    const lane = c.lane as Exclude<ClaimLane, "legal-assertion">;
    return {
      claimId: c.claimId,
      domainId: c.domainId,
      claimText: c.claimText,
      lane,
      requiredLabel: rules[lane].requiredLabel,
      reviewQuestion: rules[lane].reviewQuestion,
      requiredEvidence: rules[lane].requiredEvidence,
      disposition: "open",
      reviewer: null,
      approved: false,
    };
  });

export type CandidateReleaseGate = {
  name: string;
  passed: boolean;
  detail: string;
};

/**
 * This preflight is designed to fail closed while review evidence has not been
 * supplied. CI passing is NOT evidence of authorisation.
 */
export function getCandidateReleaseGates(): readonly CandidateReleaseGate[] {
  return [
    { name: "domain-coverage", passed: editorialClaimInventory.length === 38, detail: "Draft inventory has expected 38 statement entries; not a completeness determination" },
    { name: "regulatory-source-validation", passed: false, detail: "19 source-located draft statements still require verification of claim support, source currency and exceptions" },
    { name: "remaining-editorial-dispositions", passed: nonlegalReviewTickets.length === 0, detail: `${nonlegalReviewTickets.length} statement dispositions are open` },
    { name: "state-local-and-international-coverage", passed: false, detail: "State, local and country-specific authoritative coverage remains incomplete" },
    { name: "human-payroll-review", passed: false, detail: "No qualified reviewer decisions recorded" },
    { name: "legal-tax-escalation", passed: false, detail: "Required legal or tax review has not been documented" },
    { name: "accessibility-and-security-review", passed: false, detail: "Independent QA and dependency disposition outstanding" },
    { name: "approved-release-manifest", passed: false, detail: "No cryptographically bound, signed publication manifest exists" },
    { name: "owner-publication-authorisation", passed: false, detail: "No owner authorization to merge, index or publish" },
  ];
}

export const candidateReleaseAllowed = false as const;

export function validateEditorialQueue(): void {
  const mapped = new Set(sourceMappedClaims.map(c => c.claimId));
  const nonlegal = new Set(nonlegalReviewTickets.map(c => c.claimId));
  if (nonlegal.size !== nonlegalReviewTickets.length) throw new Error("Duplicate editorial disposition ticket");
  if ([...nonlegal].some(id => mapped.has(id))) throw new Error("Editorial disposition overlaps a mapped claim");
  const uncovered = claimTriage.filter(c => !mapped.has(c.claimId) && !nonlegal.has(c.claimId));
  if (uncovered.length) throw new Error("Some draft statements have neither pinpoint source nor editorial disposition");
}
