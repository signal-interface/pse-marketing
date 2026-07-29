// Single source of truth for every capability or outcome statement rendered
// on the public site. Publication is a derived property (status === "current"
// AND the requesting surface is registered) — never a free choice at the
// call site. Governing principle (docs/gtm/README.md): product truth
// precedes publication.

export type ClaimStatus = "current" | "pilot" | "planned" | "illustrative";

export type ClaimEvidence =
  | { kind: "shipped_surface"; path: string } // a route/component/config in this repo
  | { kind: "primary_source"; url: string; note: string }
  | { kind: "internal_document"; path: string }
  | { kind: "founder_attested"; note: string };

export interface Claim {
  /** Stable kebab-case identifier. */
  id: string;
  /** Exact public-facing wording. */
  statement: string;
  status: ClaimStatus;
  /** Must be non-empty; enforced by release-gate tests. */
  evidence: ClaimEvidence[];
  /** Routes where this statement may appear. */
  surfaces: string[];
  owner: string;
  /** ISO date of last review. */
  lastReviewed: string;
}

const REVIEWED = "2026-07-28";
const OWNER = "Tom Rivera";

export const CLAIMS: readonly Claim[] = [
  // ── Current: verifiable from this repository as shipped ────────────────
  {
    id: "security-response-headers",
    statement:
      "Every response from the public site carries Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and Permissions-Policy headers.",
    status: "current",
    evidence: [{ kind: "shipped_surface", path: "vercel.json" }],
    surfaces: ["/trust", "/trust/security"],
    owner: OWNER,
    lastReviewed: REVIEWED,
  },
  {
    id: "invitation-only-access",
    statement:
      "Platform access is by invitation only; prospective customers reach PSE through a personalized demo request.",
    status: "current",
    evidence: [
      { kind: "shipped_surface", path: "src/app/layout.tsx" },
      { kind: "shipped_surface", path: "src/components/forms/DemoRequestForm.tsx" },
    ],
    surfaces: ["/trust"],
    owner: OWNER,
    lastReviewed: REVIEWED,
  },
  {
    id: "form-data-collection",
    statement:
      "The public site collects contact details — name, email, optional company and employee count — only when a visitor submits the demo request form or the CHAP email gate.",
    status: "current",
    evidence: [
      { kind: "shipped_surface", path: "src/lib/db.ts" },
      { kind: "shipped_surface", path: "src/app/api/demo-request/route.ts" },
      { kind: "shipped_surface", path: "src/app/api/lead-capture/route.ts" },
    ],
    surfaces: ["/trust/data-handling"],
    owner: OWNER,
    lastReviewed: REVIEWED,
  },
  {
    id: "chap-interaction-logging",
    statement:
      "CHAP AI interactions are logged with a hashed IP address, the question asked, the response returned, and an optional email when the visitor provides one.",
    status: "current",
    evidence: [{ kind: "shipped_surface", path: "src/lib/db.ts" }],
    surfaces: ["/trust/data-handling"],
    owner: OWNER,
    lastReviewed: REVIEWED,
  },
  {
    id: "no-third-party-analytics",
    statement:
      "The public site ships no third-party analytics or advertising scripts.",
    status: "current",
    evidence: [
      { kind: "shipped_surface", path: "src/app/layout.tsx" },
      { kind: "internal_document", path: "docs/gtm/SENIOR_DEV_REVIEW_HANDOFF.md" },
    ],
    surfaces: ["/trust/data-handling", "/trust/security"],
    owner: OWNER,
    lastReviewed: REVIEWED,
  },
  {
    id: "fonts-self-hosted",
    statement:
      "Web fonts are bundled at build time via next/font; the browser makes no runtime requests to third-party font services.",
    status: "current",
    evidence: [{ kind: "shipped_surface", path: "src/app/layout.tsx" }],
    surfaces: ["/trust/data-handling"],
    owner: OWNER,
    lastReviewed: REVIEWED,
  },
  {
    id: "enforcement-stats-cited",
    statement:
      "Enforcement and industry statistics displayed on the site carry their full source citation.",
    status: "current",
    evidence: [{ kind: "shipped_surface", path: "src/lib/stats.ts" }],
    surfaces: ["/trust"],
    owner: OWNER,
    lastReviewed: REVIEWED,
  },

  // ── Pilot: shipped behind a flag, not publicly claimable ───────────────
  {
    id: "chap-widget-answers",
    statement:
      "CHAP AI answers general payroll compliance questions from a curated regulatory corpus.",
    status: "pilot",
    evidence: [
      { kind: "shipped_surface", path: "src/app/chap-ai/page.tsx" },
      { kind: "internal_document", path: "DEPLOY_CHECKLIST.md" },
    ],
    surfaces: ["/chap-ai"],
    owner: OWNER,
    lastReviewed: REVIEWED,
  },

  // ── Planned ────────────────────────────────────────────────────────────
  {
    id: "dedicated-trust-contacts",
    statement:
      "Dedicated trust and security contact addresses monitored by PSE.",
    status: "planned",
    evidence: [
      {
        kind: "founder_attested",
        note: "trust@ and security@ are not yet provisioned; contact routes through the demo request path until TRUST_CONTACTS_LIVE is enabled.",
      },
    ],
    surfaces: ["/trust/security"],
    owner: OWNER,
    lastReviewed: REVIEWED,
  },

];

/** The ONLY sanctioned read path for rendering. */
export function publishableClaims(surface: string): Claim[] {
  return CLAIMS.filter(
    (claim) => claim.status === "current" && claim.surfaces.includes(surface),
  );
}

/** Lookup by id; throws on unknown id so typos fail loudly. */
export function getClaim(id: string): Claim {
  const claim = CLAIMS.find((c) => c.id === id);
  if (!claim) {
    throw new Error(`Unknown claim id: ${id}`);
  }
  return claim;
}
