import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { CLAIMS, getClaim, publishableClaims } from "../claims";
import { SUBPROCESSORS } from "../subprocessors";

const REPO_ROOT = process.cwd();

describe("claims registry release gates", () => {
  it("every claim has non-empty evidence", () => {
    for (const claim of CLAIMS) {
      expect(claim.evidence.length, `claim ${claim.id} has no evidence`)
        .toBeGreaterThan(0);
    }
  });

  it("every claim id is unique and kebab-case", () => {
    const ids = CLAIMS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id, `claim id "${id}" is not kebab-case`).toMatch(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      );
    }
  });

  it("publishableClaims never returns a non-current claim", () => {
    const surfaces = new Set(CLAIMS.flatMap((c) => c.surfaces));
    for (const surface of surfaces) {
      for (const claim of publishableClaims(surface)) {
        expect(claim.status, `${claim.id} published with status ${claim.status}`)
          .toBe("current");
      }
    }
  });

  it("publishableClaims never returns a claim for a surface it is not registered on", () => {
    const surfaces = new Set(CLAIMS.flatMap((c) => c.surfaces));
    for (const surface of surfaces) {
      for (const claim of publishableClaims(surface)) {
        expect(claim.surfaces, `${claim.id} leaked onto ${surface}`).toContain(
          surface,
        );
      }
    }
    expect(publishableClaims("/route-that-registers-nothing")).toEqual([]);
  });

  it("getClaim throws on an unknown id", () => {
    expect(() => getClaim("no-such-claim")).toThrowError(/Unknown claim id/);
    expect(getClaim("security-response-headers").id).toBe(
      "security-response-headers",
    );
  });

  it("every shipped_surface evidence path exists in the repository", () => {
    for (const claim of CLAIMS) {
      for (const evidence of claim.evidence) {
        if (evidence.kind !== "shipped_surface") continue;
        expect(
          existsSync(path.join(REPO_ROOT, evidence.path)),
          `claim ${claim.id}: shipped_surface path missing: ${evidence.path}`,
        ).toBe(true);
      }
    }
  });

  it("every internal_document evidence path exists in the repository", () => {
    for (const claim of CLAIMS) {
      for (const evidence of claim.evidence) {
        if (evidence.kind !== "internal_document") continue;
        expect(
          existsSync(path.join(REPO_ROOT, evidence.path)),
          `claim ${claim.id}: internal_document path missing: ${evidence.path}`,
        ).toBe(true);
      }
    }
  });

  it("every primary_source evidence entry has a note and an absolute URL", () => {
    for (const claim of CLAIMS) {
      for (const evidence of claim.evidence) {
        if (evidence.kind !== "primary_source") continue;
        expect(evidence.note.trim().length).toBeGreaterThan(0);
        expect(evidence.url).toMatch(/^https:\/\//);
      }
    }
  });

  it("no claim statement contains a certification term", () => {
    const certification =
      /\b(?:SOC\s*2|ISO\s*27001|HIPAA|PCI(?:\s*DSS)?|certified|attested|audited by)\b/i;
    for (const claim of CLAIMS) {
      expect(
        certification.test(claim.statement),
        `claim ${claim.id} asserts a certification PSE does not hold: "${claim.statement}"`,
      ).toBe(false);
    }
  });

  it("every claim lastReviewed parses as a valid ISO date", () => {
    for (const claim of CLAIMS) {
      expect(claim.lastReviewed, `claim ${claim.id}`).toMatch(
        /^\d{4}-\d{2}-\d{2}$/,
      );
      expect(Number.isNaN(Date.parse(claim.lastReviewed))).toBe(false);
    }
  });
});

describe("subprocessor register release gates", () => {
  it("every subprocessor has a purpose and a non-empty data-category list", () => {
    for (const sub of SUBPROCESSORS) {
      expect(sub.purpose.trim().length, sub.name).toBeGreaterThan(0);
      expect(sub.dataCategories.length, sub.name).toBeGreaterThan(0);
      for (const category of sub.dataCategories) {
        expect(category.trim().length, sub.name).toBeGreaterThan(0);
      }
    }
  });

  it("every subprocessor records its repository evidence", () => {
    for (const sub of SUBPROCESSORS) {
      expect(sub.evidence.length, sub.name).toBeGreaterThan(0);
    }
  });
});

describe("fix #2 — product-tour claims cannot publish", () => {
  it("registers every product-tour claim as illustrative", () => {
    const tourClaims = CLAIMS.filter((c) => c.surfaces.includes("/product-tour"));
    expect(tourClaims.length).toBeGreaterThan(0);
    for (const claim of tourClaims) {
      expect(claim.status, claim.id).toBe("illustrative");
    }
  });

  it("publishableClaims('/product-tour') returns an empty array", () => {
    // Mechanical proof of fix #2: even if PRODUCT_TOUR_ENABLED were flipped
    // on by mistake, the registry publishes nothing for the tour until Tom
    // upgrades a claim's status deliberately.
    expect(publishableClaims("/product-tour")).toEqual([]);
  });
});
