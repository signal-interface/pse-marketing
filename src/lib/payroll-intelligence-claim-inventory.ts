import { briefings } from "./payroll-intelligence-briefings";

/**
 * An inventory, NOT a source-verification engine.
 * Each statement in an editorial briefing receives a stable, reviewable reference.
 * The candidate source is not evidence that a particular assertion is supported.
 */
export type EditorialClaim = {
  id: string;
  briefingSlug: string;
  domainId: string;
  claimText: string;
  candidateAuthorities: readonly { title: string; url: string }[];
  evidenceStatus: "unreviewed";
  applicabilityStatus: "unassessed";
  effectiveFrom: null;
  effectiveUntil: null;
  exactAuthoritySection: null;
  checkedAt: null;
  reviewer: null;
  approver: null;
  approvalAt: null;
};

export const editorialClaimInventory: readonly EditorialClaim[] = briefings.flatMap(b => {
  const domainId = b.domain.slice(0, 2);
  return b.keyPoints.map((claimText, index) => ({
    id: `PSE-PI-D${domainId}-C${String(index + 1).padStart(2, "0")}`,
    briefingSlug: b.slug,
    domainId,
    claimText,
    candidateAuthorities: b.sources.map(s => ({ title: s.title, url: s.url })),
    evidenceStatus: "unreviewed" as const,
    applicabilityStatus: "unassessed" as const,
    effectiveFrom: null,
    effectiveUntil: null,
    exactAuthoritySection: null,
    checkedAt: null,
    reviewer: null,
    approver: null,
    approvalAt: null,
  }));
});

export function claimsAreApproved(claims: readonly EditorialClaim[]): boolean {
  // This typed draft inventory cannot assert publication approval.
  // Real approval must come from a separate reviewed and signed release manifest.
  void claims;
  return false;
}
