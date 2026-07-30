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

const PRODUCT_TOUR_PENDING =
  "Product-tour screenshots and capability claims are pending product approval; the tour is labeled illustrative and ships behind PRODUCT_TOUR_ENABLED.";

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

  // ── Illustrative: /product-tour statements, verbatim (fix #2) ──────────
  // None of these may publish until Tom approves the tour and upgrades the
  // status. publishableClaims("/product-tour") must return [] while these
  // remain illustrative — asserted in the release-gate suite.
  {
    id: "pt-hero-help",
    statement:
      "See how PSE helps payroll teams identify what needs attention, apply professional judgment, and preserve a defensible record.",
    status: "illustrative",
    evidence: [
      { kind: "shipped_surface", path: "src/app/product-tour/page.tsx" },
      { kind: "founder_attested", note: PRODUCT_TOUR_PENDING },
    ],
    surfaces: ["/product-tour"],
    owner: OWNER,
    lastReviewed: REVIEWED,
  },
  {
    id: "pt-governance-boundary",
    statement:
      "PSE supports payroll governance; payroll itself is processed by your system of record, and any change to your payroll system is made by you — never autonomously by PSE.",
    status: "illustrative",
    evidence: [
      { kind: "shipped_surface", path: "src/app/product-tour/page.tsx" },
      { kind: "internal_document", path: "docs/gtm/README.md" },
      { kind: "founder_attested", note: PRODUCT_TOUR_PENDING },
    ],
    surfaces: ["/product-tour"],
    owner: OWNER,
    lastReviewed: REVIEWED,
  },
  {
    id: "pt-step-assess",
    statement:
      "Begin with a structured view of risk, coverage, exceptions, and the evidence requiring attention.",
    status: "illustrative",
    evidence: [
      { kind: "shipped_surface", path: "src/app/product-tour/page.tsx" },
      { kind: "founder_attested", note: PRODUCT_TOUR_PENDING },
    ],
    surfaces: ["/product-tour"],
    owner: OWNER,
    lastReviewed: REVIEWED,
  },
  {
    id: "pt-step-review",
    statement:
      "PSE organizes potential issues for practitioner review instead of silently changing the payroll system.",
    status: "illustrative",
    evidence: [
      { kind: "shipped_surface", path: "src/app/product-tour/page.tsx" },
      { kind: "founder_attested", note: PRODUCT_TOUR_PENDING },
    ],
    surfaces: ["/product-tour"],
    owner: OWNER,
    lastReviewed: REVIEWED,
  },
  {
    id: "pt-step-govern",
    statement:
      "CHAP explains what needs attention, why it matters, and which evidence supports the determination.",
    status: "illustrative",
    evidence: [
      { kind: "shipped_surface", path: "src/app/product-tour/page.tsx" },
      { kind: "founder_attested", note: PRODUCT_TOUR_PENDING },
    ],
    surfaces: ["/product-tour"],
    owner: OWNER,
    lastReviewed: REVIEWED,
  },
  {
    id: "pt-step-prove",
    statement:
      "The outcome is not only a recommendation. PSE preserves what was reviewed, decided, and supported.",
    status: "illustrative",
    evidence: [
      { kind: "shipped_surface", path: "src/app/product-tour/page.tsx" },
      { kind: "founder_attested", note: PRODUCT_TOUR_PENDING },
    ],
    surfaces: ["/product-tour"],
    owner: OWNER,
    lastReviewed: REVIEWED,
  },
  {
    id: "pt-human-review",
    statement: "Human review remains in control",
    status: "illustrative",
    evidence: [
      { kind: "shipped_surface", path: "src/app/product-tour/page.tsx" },
      { kind: "founder_attested", note: PRODUCT_TOUR_PENDING },
    ],
    surfaces: ["/product-tour"],
    owner: OWNER,
    lastReviewed: REVIEWED,
  },

  // ── Live public surfaces (Stage F, 2026-07-30) ─────────────────────────
  // Homepage and /services claims, registered with honest statuses. The
  // pages are NOT yet wired to publishableClaims(); non-current entries
  // here are the flagged inventory awaiting Tom's ruling, and rendering is
  // unchanged until that ruling lands. Statuses follow the registry
  // doctrine: current = evidenced by a shipped artifact; pilot = capability
  // demonstrated below the asserted scale; planned = intended, not running;
  // illustrative = design placeholder.
  {
    id: "cred-employee-records-per-cycle",
    statement: "1,200+ employee records validated per payroll cycle",
    status: "illustrative",
    evidence: [
      {
        kind: "founder_attested",
        note: "Design placeholder asserting operational throughput; PSE has no production customers. Requires production telemetry to evidence, or rewording.",
      },
    ],
    surfaces: ["/"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "cred-chap-rule-count",
    statement: "500+ compliance rules in the CHAP AI engine",
    status: "illustrative",
    evidence: [
      {
        kind: "founder_attested",
        note: "Not countable from this repository: the shipped CHAP corpus is scoped to IRC §6656 and gated pending verification (PR #4). A countable rule-set artifact would be required.",
      },
    ],
    surfaces: ["/"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "cred-jurisdictions-monitored",
    statement: "50 state + federal jurisdictions monitored",
    status: "illustrative",
    evidence: [
      {
        kind: "founder_attested",
        note: "'Monitored' asserts a running operation; no jurisdiction dataset or monitoring pipeline exists in this repository.",
      },
    ],
    surfaces: ["/"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "cred-regulatory-sources-tracked",
    statement: "30+ regulatory and enforcement sources tracked daily",
    status: "illustrative",
    evidence: [
      {
        kind: "founder_attested",
        note: "No source list or daily tracking pipeline exists in this repository; 'tracked daily' asserts a running operation.",
      },
    ],
    surfaces: ["/"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "trust-enterprise-grade-security",
    statement: "Enterprise-Grade Security",
    status: "illustrative",
    evidence: [
      { kind: "shipped_surface", path: "vercel.json" },
      {
        kind: "founder_attested",
        note: "Security headers and HTTPS are shipped, but 'enterprise-grade' implies a certification-class posture (SOC 2 / ISO 27001) PSE does not hold. Passes release-gate test #8 only because it names no specific certification.",
      },
    ],
    surfaces: ["/", "/services"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "trust-audit-ready-documentation",
    statement: "Audit-Ready Documentation",
    status: "pilot",
    evidence: [
      {
        kind: "founder_attested",
        note: "The frozen demo produces audit-ready run documentation at demo scale; product-repo audit trails are documented as planned, not shipped.",
      },
    ],
    surfaces: ["/", "/services"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "trust-multi-state-coverage",
    statement: "Multi-State Coverage",
    status: "pilot",
    evidence: [
      {
        kind: "founder_attested",
        note: "Multi-state rule validation is demonstrated in the frozen demo at demo scale, not at production scale.",
      },
    ],
    surfaces: ["/", "/services"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "trust-daily-regulatory-monitoring",
    statement: "Daily Regulatory Monitoring",
    status: "planned",
    evidence: [
      {
        kind: "founder_attested",
        note: "Intended operating practice; no daily monitoring pipeline is running today.",
      },
    ],
    surfaces: ["/", "/services"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "chap-same-day-regulatory-updates",
    statement: "When regulations change, CHAP AI updates the same day.",
    status: "planned",
    evidence: [
      {
        kind: "founder_attested",
        note: "Asserts same-day operational turnaround; no regulatory-update pipeline exists yet.",
      },
    ],
    surfaces: ["/"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "stats-traceable-decisions",
    statement:
      "100% traceable decisions — every payroll decision documented with the logic and data that produced it.",
    status: "pilot",
    evidence: [
      {
        kind: "founder_attested",
        note: "Traceability is a design property of CHAP validation, demonstrated at demo scale; '100%' asserts production coverage that cannot be measured yet.",
      },
    ],
    surfaces: ["/"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "stats-faster-processing",
    statement: "50% faster processing",
    status: "illustrative",
    evidence: [
      {
        kind: "founder_attested",
        note: "Internal test-harness comparison; the benchmark artifact is not in this repository and no production measurement exists. The homepage footnote discloses the internal-harness basis.",
      },
    ],
    surfaces: ["/"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "stats-untracked-changes-zero",
    statement:
      "0 untracked changes — every transaction validated against compliance rules before execution.",
    status: "pilot",
    evidence: [
      {
        kind: "founder_attested",
        note: "Validation-before-commit is a demonstrated design property at demo scale; '0' asserts production coverage.",
      },
    ],
    surfaces: ["/"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "svc-governed-payroll-validation",
    statement:
      "Every payroll run validated against federal and state statutory requirements before commit.",
    status: "pilot",
    evidence: [
      {
        kind: "founder_attested",
        note: "Demonstrated in the frozen demo; production validation depends on product-repo capabilities not yet shipped.",
      },
    ],
    surfaces: ["/", "/services"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "svc-workforce-analytics",
    statement:
      "Labor cost, overtime exposure, and compliance posture visible in real time.",
    status: "planned",
    evidence: [
      {
        kind: "founder_attested",
        note: "No analytics dashboards are shipped; the described capability is planned.",
      },
    ],
    surfaces: ["/", "/services"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "svc-benefits-reconciliation",
    statement:
      "Benefits deduction reconciliation audited against benefit elections.",
    status: "planned",
    evidence: [
      {
        kind: "founder_attested",
        note: "The live /services copy itself labels this service 'currently in development'.",
      },
    ],
    surfaces: ["/", "/services"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "svc-prebuilt-integrations",
    statement:
      "Pre-built integrations with UKG, ADP, Dayforce, and major HRIS platforms.",
    status: "planned",
    evidence: [
      {
        kind: "founder_attested",
        note: "No shipped connectors exist in any PSE repository; the integration layer is planned.",
      },
    ],
    surfaces: ["/", "/services"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "svc-strategic-advisory",
    statement:
      "Payroll structure optimization, entity setup guidance, and compliance strategy advisory.",
    status: "current",
    evidence: [
      {
        kind: "founder_attested",
        note: "Human advisory service delivered directly by the founder; not dependent on unshipped product capabilities.",
      },
    ],
    surfaces: ["/", "/services"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
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
