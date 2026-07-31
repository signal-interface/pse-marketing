// Release gate: every numeric or capability claim rendered on a live
// public surface must reference a claims-registry entry by id.
//
// This test is the enforcement half of Stage F. It matches by claimId
// carried on the data constant — never by string comparison of rendered
// copy — so rewording a claim without re-reviewing its registry entry
// still fails loudly (the id link breaks or the surface is missing).
//
// 2026-07-30 ruling additions: the CredibilityStrip is wired to
// publishableClaims() (asserted below), and rendered sample data must
// carry a visible marker in the component source — a registry status
// nobody sees is not a marker.

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { CLAIMS, publishableClaims } from "../claims";
import { SERVICES, CHAP_STEPS } from "@/lib/constants";
import { CRED_METRICS } from "@/components/sections/CredibilityStrip";
import {
  TRUST_ITEMS,
} from "@/components/sections/TrustBar";
import {
  SCAN_TERMINAL_CLAIM_ID,
  CHAP_GUARD_CLAIM_ID,
} from "@/components/sections/ChapAI";

const REPO_ROOT = process.cwd();
const claimById = new Map(CLAIMS.map((c) => [c.id, c]));

interface Ref {
  source: string;
  claimId: string;
  surfaces: string[];
}

const REFERENCES: Ref[] = [
  ...SERVICES.map((s) => ({
    source: `constants.SERVICES "${s.title}"`,
    claimId: s.claimId,
    surfaces: ["/"],
  })),
  ...CHAP_STEPS.map((s) => ({
    source: `constants.CHAP_STEPS "${s.step}"`,
    claimId: s.claimId,
    surfaces: ["/"],
  })),
  ...CRED_METRICS.map((m) => ({
    source: `CredibilityStrip "${m.label}"`,
    claimId: m.claimId,
    surfaces: ["/"],
  })),
  // TrustBar renders on the homepage; /services repeats two of its
  // labels in its hero trust strip.
  ...TRUST_ITEMS.map((t) => ({
    source: `TrustBar "${t.label}"`,
    claimId: t.claimId,
    surfaces:
      t.label === "Multi-State Coverage" ? ["/"] : ["/", "/services"],
  })),
  {
    source: "DashboardPreview sample metrics",
    claimId: "hero-dashboard-sample-metrics",
    surfaces: ["/"],
  },
  {
    source: "ChapAI scan terminal",
    claimId: SCAN_TERMINAL_CLAIM_ID,
    surfaces: ["/"],
  },
  {
    source: "ChapAI CHAP Guard banner",
    claimId: CHAP_GUARD_CLAIM_ID,
    surfaces: ["/"],
  },
  {
    source: "chap-ai regulatory update log",
    claimId: "chap-regulatory-log-sample",
    surfaces: ["/chap-ai"],
  },
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
    for (const s of SERVICES)
      expect(s.claimId, `SERVICES "${s.title}"`).toBeTruthy();
    for (const s of CHAP_STEPS)
      expect(s.claimId, `CHAP_STEPS "${s.step}"`).toBeTruthy();
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

describe("2026-07-30 ruling — presentation gates", () => {
  it("TrustBar badges are backed by current or pilot claims only", () => {
    // Planned and illustrative claims may not sit in the trust bar: a badge
    // is an unqualified assertion, and there is no room for a marker.
    for (const t of TRUST_ITEMS) {
      const claim = claimById.get(t.claimId);
      expect(claim, `TrustBar "${t.label}"`).toBeTruthy();
      expect(
        ["current", "pilot"].includes(claim!.status),
        `TrustBar "${t.label}" is backed by a ${claim!.status} claim`,
      ).toBe(true);
    }
  });

  it("rendered sample data carries a visible marker in the component source", () => {
    // A claims.ts status is invisible to a reader; the marker must be on
    // the page. String-checking component source is deliberate — removing
    // the marker while keeping the invented figures must fail this gate.
    const markerSites: Array<[string, RegExp]> = [
      [
        "src/components/sections/DashboardPreview.tsx",
        /Sample data/,
      ],
      ["src/components/sections/ChapAI.tsx", /Sample scan — illustrative/],
      ["src/app/chap-ai/page.tsx", /sample data \(illustrative\)/],
    ];
    for (const [file, marker] of markerSites) {
      const source = readFileSync(path.join(REPO_ROOT, file), "utf-8");
      expect(
        marker.test(source),
        `${file} renders invented figures but no longer contains its visible marker ${marker}`,
      ).toBe(true);
    }
  });

  it("CredibilityStrip metrics are current, primary-sourced claims registered for the homepage", () => {
    // 2026-07-30 follow-up ruling: the strip publishes third-party
    // enforcement data, not self-reported capability numbers — and its
    // whole rationale is that a prospect can check the figures. Every
    // metric must therefore be publishable AND carry primary_source
    // evidence with a resolvable https URL; a figure whose source of
    // record cannot be checked does not belong in the most prominent
    // credibility position on the page.
    for (const m of CRED_METRICS) {
      const claim = claimById.get(m.claimId);
      expect(claim, `CRED_METRICS "${m.label}"`).toBeTruthy();
      expect(
        claim!.status,
        `CRED_METRICS "${m.label}" is backed by a ${claim!.status} claim; only current claims may render in the strip`,
      ).toBe("current");
      expect(
        claim!.surfaces.includes("/"),
        `CRED_METRICS "${m.label}" renders on /, but claim "${m.claimId}" registers only [${claim!.surfaces.join(", ")}]`,
      ).toBe(true);
      const primary = claim!.evidence.find((e) => e.kind === "primary_source");
      expect(
        primary,
        `CRED_METRICS "${m.label}" has no primary_source evidence — unverifiable figures may not render in the strip`,
      ).toBeTruthy();
      expect(
        primary!.kind === "primary_source" &&
          primary!.url.startsWith("https://") &&
          new URL(primary!.url).hostname.length > 0,
        `CRED_METRICS "${m.label}" primary_source URL is not a resolvable https URL: ${primary!.kind === "primary_source" ? primary!.url : "(none)"}`,
      ).toBe(true);
    }
  });

  it("CredibilityStrip will not render an empty band", () => {
    const publishable = new Set(publishableClaims("/").map((c) => c.id));
    const rendered = CRED_METRICS.filter((m) => publishable.has(m.claimId));
    expect(
      rendered.length,
      "no CredibilityStrip metric is publishable; the strip would render nothing",
    ).toBeGreaterThan(0);
  });

  it("every CredibilityStrip metric carries a visible source citation", () => {
    // Enforcement figures persuade because a prospect can check them; the
    // citation must be rendered, not just recorded in stats.ts.
    for (const m of CRED_METRICS) {
      expect(
        (m as { source?: string }).source,
        `CRED_METRICS "${m.label}" renders a third-party figure without its citation`,
      ).toBeTruthy();
    }
  });

  it("CredibilityStrip removes itself from the page flow when empty", () => {
    // Guard against an orphaned heading or dead vertical gap: the
    // empty-case `return null` must precede any wrapper markup.
    const source = readFileSync(
      path.join(REPO_ROOT, "src/components/sections/CredibilityStrip.tsx"),
      "utf-8",
    );
    const guard = source.indexOf("return null");
    const wrapper = source.indexOf("<section");
    expect(guard, "empty-case return null is missing").toBeGreaterThan(-1);
    expect(
      wrapper,
      "section wrapper is missing",
    ).toBeGreaterThan(guard);
  });

  it("no live surface renders a cadence the product does not run", () => {
    // "daily" / "same day" assert an operating cadence; no scheduled job
    // exists in this repository. Statement-level gate on the registry.
    const cadence = /\b(?:daily|same[\s-]day|within one business day)\b/i;
    for (const claim of CLAIMS) {
      if (claim.status === "current") continue; // a current claim has the evidence
      expect(
        cadence.test(claim.statement),
        `claim ${claim.id} asserts a cadence without a running job: "${claim.statement}"`,
      ).toBe(false);
    }
  });
});
