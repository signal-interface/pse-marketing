import { editorialClaimInventory } from "./payroll-intelligence-claim-inventory";
import { sourceMappedClaims } from "./payroll-intelligence-source-mappings";

export type ClaimCoverage = {
  totalDraftClaims: number;
  mappedSourceLocations: number;
  stillUnmapped: number;
  humanReviewed: 0;
  publicationApproved: false;
  unmappedByDomain: readonly { domainId: string; count: number }[];
};

export function getClaimCoverage(): ClaimCoverage {
  const mappedIds = new Set(sourceMappedClaims.map(c => c.claimId));
  const draftIds = new Set(editorialClaimInventory.map(c => c.id));
  if (mappedIds.size !== sourceMappedClaims.length) throw new Error("Duplicate source mapping claim IDs");
  if ([...mappedIds].some(id => !draftIds.has(id))) throw new Error("Mapping references a missing or changed claim");
  const missing = editorialClaimInventory.filter(c => !mappedIds.has(c.id));
  const byDomain = new Map<string, number>();
  for (const c of missing) byDomain.set(c.domainId, (byDomain.get(c.domainId) || 0) + 1);
  return {
    totalDraftClaims: editorialClaimInventory.length,
    mappedSourceLocations: mappedIds.size,
    stillUnmapped: missing.length,
    humanReviewed: 0,
    publicationApproved: false,
    unmappedByDomain: [...byDomain].sort((a,b)=>a[0].localeCompare(b[0])).map(([domainId,count])=>({domainId,count})),
  };
}
