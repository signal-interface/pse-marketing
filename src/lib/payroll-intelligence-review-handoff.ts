import { domains } from "./payroll-intelligence";
import { editorialClaimInventory } from "./payroll-intelligence-claim-inventory";
import { sourceMappedClaims } from "./payroll-intelligence-source-mappings";
import { nonlegalReviewTickets, getCandidateReleaseGates } from "./payroll-intelligence-publication-preflight";

/**
 * Read-only handoff to real reviewers. This is a request for review, not evidence
 * that review occurred. No sensitive personnel details or approval tokens.
 */
export type ReviewAssignment = {
  claimId: string;
  domainId: string;
  draftText: string;
  reviewTrack: "regulatory-support" | "editorial-disposition";
  candidateSource: { title: string; url: string; pinpoint: string } | null;
  requestedDecision: string;
  assignedReviewer: null;
  reviewDecision: "not-started";
  reviewDate: null;
  releaseApproval: false;
};

export function makeEditorialReviewAssignments(): readonly ReviewAssignment[] {
  const sourceRecords = new Map(sourceMappedClaims.map(c => [c.claimId, c]));
  const dispositionRecords = new Map(nonlegalReviewTickets.map(c => [c.claimId, c]));
  return editorialClaimInventory.map(c => {
    const sourceRecord = sourceRecords.get(c.id);
    const ticket = dispositionRecords.get(c.id);
    if (Boolean(sourceRecord) === Boolean(ticket)) {
      throw new Error(`Claim ${c.id} must have exactly one review assignment type`);
    }
    return {
      claimId: c.id,
      domainId: c.domainId,
      draftText: c.claimText,
      reviewTrack: sourceRecord ? "regulatory-support" : "editorial-disposition",
      candidateSource: sourceRecord?.source
        ? { title: sourceRecord.source.title, url: sourceRecord.source.url, pinpoint: sourceRecord.source.pinpoint }
        : null,
      requestedDecision: sourceRecord
        ? "Check exact claim against authoritative text, jurisdiction, source currency, effective date, exceptions and required revisions."
        : ticket!.reviewQuestion,
      assignedReviewer: null,
      reviewDecision: "not-started",
      reviewDate: null,
      releaseApproval: false,
    };
  });
}

export type ReviewHandoff = {
  framework: "PSE-PI-2026-Q4";
  stage: "human-review-request";
  publicationDecision: "HOLD";
  domains: number;
  claims: number;
  sourceReviewRequests: number;
  editorialDispositionRequests: number;
  completedHumanReviews: 0;
  blockingGates: readonly string[];
  items: readonly ReviewAssignment[];
};

export function makeEditorialReviewHandoff(): ReviewHandoff {
  const items = makeEditorialReviewAssignments();
  const blockingGates = getCandidateReleaseGates().filter(g => !g.passed).map(g => g.name);
  return {
    framework: "PSE-PI-2026-Q4",
    stage: "human-review-request",
    publicationDecision: "HOLD",
    domains: domains.length,
    claims: items.length,
    sourceReviewRequests: items.filter(i => i.reviewTrack === "regulatory-support").length,
    editorialDispositionRequests: items.filter(i => i.reviewTrack === "editorial-disposition").length,
    completedHumanReviews: 0,
    blockingGates,
    items,
  };
}
