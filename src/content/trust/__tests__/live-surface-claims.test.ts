// Release gate: every numeric or capability claim rendered on a live
// public surface must reference a claims-registry entry by id.
//
// This test is the enforcement half of Stage F. It matches by claimId
// carried on the data constant — never by string comparison of rendered
// copy — so rewording a claim without re-reviewing its registry entry
// still fails loudly (the id link breaks or the surface is missing).
//
// It deliberately does NOT assert status === "current": the live pages
// are not yet wired to publishableClaims(), and non-current entries are
// the flagged inventory awaiting a ruling. Wiring publication to status
// is a content decision, not a test change.

import { describe, it, expect } from "vitest";
import { CLAIMS } from "../claims";
import { STATS, SERVICES } from "@/lib/constants";
import { CRED_METRICS } from "@/components/sections/CredibilityStrip";
import { TRUST_ITEMS } from "@/components/sections/TrustBar";

const claimById = new Map(CLAIMS.map((c) => [c.id, c]));

interface Ref {
  source: string;
  claimId: string;
  surfaces: string[];
}

const REFERENCES: Ref[] = [
  ...STATS.map((s) => ({
    source: `constants.STATS "${s.label}"`,
    claimId: s.claimId,
    surfaces: ["/"],
  })),
  ...SERVICES.map((s) => ({
    source: `constants.SERVICES "${s.title}"`,
    claimId: s.claimId,
    surfaces: ["/"],
  })),
  ...CRED_METRICS.map((m) => ({
    source: `CredibilityStrip "${m.label}"`,
    claimId: m.claimId,
    surfaces: ["/"],
  })),
  // TrustBar renders on the homepage; /services repeats three of its
  // labels in its hero trust strip.
  ...TRUST_ITEMS.map((t) => ({
    source: `TrustBar "${t.label}"`,
    claimId: t.claimId,
    surfaces:
      t.label === "Multi-State Coverage" ? ["/"] : ["/", "/services"],
  })),
];

describe("live-surface claims are registered", () => {
  it("every rendered claim reference resolves to a registry entry", () => {
    for (const ref of REFERENCES) {
      expect(
        claimById.has(ref.claimId),
        `${ref.source} references unknown claim id "${ref.claimId}"`,
      ).toBe(true);
    }
  });

  it("every referenced claim registers the surface that renders it", () => {
    for (const ref of REFERENCES) {
      const claim = claimById.get(ref.claimId);
      if (!claim) continue; // reported by the previous assertion
      for (const surface of ref.surfaces) {
        expect(
          claim.surfaces.includes(surface),
          `${ref.source} renders on ${surface}, but claim "${ref.claimId}" registers only [${claim.surfaces.join(", ")}]`,
        ).toBe(true);
      }
    }
  });

  it("no live-surface data constant is missing a claimId", () => {
    // Guards the linkage against a new entry added without registration.
    for (const s of STATS) expect(s.claimId, `STATS "${s.label}"`).toBeTruthy();
    for (const s of SERVICES)
      expect(s.claimId, `SERVICES "${s.title}"`).toBeTruthy();
    for (const m of CRED_METRICS)
      expect(m.claimId, `CRED_METRICS "${m.label}"`).toBeTruthy();
    for (const t of TRUST_ITEMS)
      expect(t.claimId, `TRUST_ITEMS "${t.label}"`).toBeTruthy();
  });

  it("every homepage/services registry claim has non-empty evidence and a status", () => {
    const liveIds = new Set(REFERENCES.map((r) => r.claimId));
    for (const id of liveIds) {
      const claim = claimById.get(id);
      if (!claim) continue;
      expect(claim.evidence.length, `claim ${id}`).toBeGreaterThan(0);
      expect(
        ["current", "pilot", "planned", "illustrative"].includes(claim.status),
        `claim ${id}`,
      ).toBe(true);
    }
  });
});
