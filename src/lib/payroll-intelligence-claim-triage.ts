import { editorialClaimInventory } from "./payroll-intelligence-claim-inventory";
import { sourceMappedClaims } from "./payroll-intelligence-source-mappings";

/** Editorial triage, not a determination of applicable law or PSE publication approval. */
export type ClaimLane =
  | "legal-assertion"
  | "jurisdictional-limitation"
  | "source-limitation"
  | "pse-control-recommendation";

export type ClaimTriage = {
  claimId: string;
  briefingSlug: string;
  domainId: string;
  claimText: string;
  lane: ClaimLane;
  sourceLocationStatus: "pinpoint-mapped" | "unmapped";
  nextAction: string;
  approval: "not-approved";
};

/**
 * One classification for every draft statement in each briefing.
 * These are editorial dispositions only; no unsupported citation is generated.
 * Changes to a brief's number of statements fail closed.
 */
const laneMap: Record<string, readonly ClaimLane[]> = {
  "2026-federal-withholding-control-review": [
    "legal-assertion", "legal-assertion", "jurisdictional-limitation",
  ],
  "2026-federal-tax-deposit-controls": [
    "legal-assertion", "legal-assertion", "legal-assertion",
  ],
  "flsa-recordkeeping-control-baseline": [
    "legal-assertion", "legal-assertion", "jurisdictional-limitation",
  ],
  "2026-worker-classification-federal-tax": [
    "legal-assertion", "legal-assertion", "jurisdictional-limitation",
  ],
  "flsa-regular-rate-assurance": [
    "legal-assertion", "legal-assertion", "legal-assertion", "jurisdictional-limitation",
  ],
  "2026-taxable-fringe-benefits": [
    "legal-assertion", "legal-assertion", "legal-assertion",
  ],
  "2026-health-fsa-pretax-review": [
    "legal-assertion", "jurisdictional-limitation", "pse-control-recommendation",
  ],
  "payday-frequency-review": [
    "source-limitation", "jurisdictional-limitation",
  ],
  "unemployment-tax-review": [
    "jurisdictional-limitation", "jurisdictional-limitation",
  ],
  "garnishment-review": [
    "legal-assertion", "jurisdictional-limitation",
  ],
  "payroll-accounting-assurance": [
    "legal-assertion", "jurisdictional-limitation",
  ],
  "payroll-technology-controls": [
    "source-limitation", "jurisdictional-limitation",
  ],
  "payroll-leadership-controls": [
    "pse-control-recommendation", "jurisdictional-limitation",
  ],
  "international-payroll-assessment": [
    "jurisdictional-limitation", "jurisdictional-limitation",
  ],
  "payroll-competency-model": [
    "source-limitation", "jurisdictional-limitation",
  ],
};

const nextAction: Record<ClaimLane, string> = {
  "legal-assertion": "Find exact controlling authority, confirm effective date, exceptions and obtain qualified human review.",
  "jurisdictional-limitation": "Identify affected jurisdictions and separately verify local/foreign authority or keep as an explicit limitation.",
  "source-limitation": "Check publication currency and label historical, advisory or nonbinding authority accurately.",
  "pse-control-recommendation": "Mark as original PSE methodology; do not represent as a statutory duty.",
};

export const claimTriage: readonly ClaimTriage[] = (() => {
  const mapped = new Set(sourceMappedClaims.map(c => c.claimId));
  const positions = new Map<string, number>();
  const records = editorialClaimInventory.map(c => {
    const position = positions.get(c.briefingSlug) ?? 0;
    positions.set(c.briefingSlug, position + 1);
    const lane = laneMap[c.briefingSlug]?.[position];
    if (!lane) throw new Error(`Missing editorial lane for ${c.briefingSlug} / ${position}`);
    return {
      claimId: c.id,
      briefingSlug: c.briefingSlug,
      domainId: c.domainId,
      claimText: c.claimText,
      lane,
      sourceLocationStatus: mapped.has(c.id) ? "pinpoint-mapped" as const : "unmapped" as const,
      nextAction: nextAction[lane],
      approval: "not-approved" as const,
    };
  });
  for (const [slug, lanes] of Object.entries(laneMap)) {
    if (positions.get(slug) !== lanes.length) throw new Error(`Editorial lane count does not match draft content for ${slug}`);
  }
  return records;
})();

export const claimTriageMetrics = {
  total: claimTriage.length,
  mapped: claimTriage.filter(c => c.sourceLocationStatus === "pinpoint-mapped").length,
  unmapped: claimTriage.filter(c => c.sourceLocationStatus === "unmapped").length,
  unmappedLegal: claimTriage.filter(c => c.sourceLocationStatus === "unmapped" && c.lane === "legal-assertion").length,
  unmappedNonlegal: claimTriage.filter(c => c.sourceLocationStatus === "unmapped" && c.lane !== "legal-assertion").length,
  approved: 0 as const,
};
