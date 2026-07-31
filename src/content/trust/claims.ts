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
  // ── Current: added at the 2026-07-31 trust preflight ───────────────────
  {
    id: "ip-hash-scope-isolation",
    statement:
      "Visitor IP addresses are stored only as salted SHA-256 hashes, with a separate derived salt per surface, so commercial-funnel and CHAP activity cannot be correlated by IP.",
    status: "current",
    evidence: [
      { kind: "shipped_surface", path: "src/lib/ipHash.ts" },
      { kind: "shipped_surface", path: "src/lib/__tests__/ipHash.test.ts" },
    ],
    surfaces: ["/trust/security", "/trust/data-handling"],
    owner: OWNER,
    lastReviewed: "2026-07-31",
  },
  {
    id: "fail-closed-data-endpoints",
    statement:
      "Endpoints that store visitor data fail closed: the demo request and CHAP APIs return 503 rather than operate without the IP-hashing salt configured.",
    status: "current",
    evidence: [
      { kind: "shipped_surface", path: "src/app/api/demo-request/route.ts" },
      { kind: "shipped_surface", path: "src/app/api/chap/ask/route.ts" },
    ],
    surfaces: ["/trust/security"],
    owner: OWNER,
    lastReviewed: "2026-07-31",
  },
  {
    id: "internal-routes-fail-closed-auth",
    statement:
      "Internal routes are gated by credentials compared in constant time, and return 503 rather than serve when the secret is not configured.",
    status: "current",
    evidence: [
      { kind: "shipped_surface", path: "src/middleware.ts" },
      { kind: "shipped_surface", path: "src/lib/safeEqual.ts" },
    ],
    surfaces: ["/trust/security"],
    owner: OWNER,
    lastReviewed: "2026-07-31",
  },
  {
    id: "environment-isolation",
    statement:
      "Production, preview, and development run against separate databases; preview and development environments hold no production data.",
    status: "current",
    evidence: [
      {
        kind: "founder_attested",
        note: "Verified empirically 2026-07-31: three distinct Neon projects (one per environment), migrations applied to each, and a preview demo submission landed only in the preview database while production and development were unchanged.",
      },
    ],
    surfaces: ["/trust/security", "/trust/data-handling"],
    owner: OWNER,
    lastReviewed: "2026-07-31",
  },
  {
    id: "first-party-analytics-only",
    statement:
      "Funnel analytics are first-party, server-side event records only. The site sets no analytics or tracking cookies; the only cookie is an HTTP-only resume token for the discovery questionnaire, which contains no identifiers.",
    status: "current",
    evidence: [
      { kind: "shipped_surface", path: "src/lib/commercial/lifecycle.ts" },
      { kind: "shipped_surface", path: "src/lib/commercial/questionnaire.ts" },
    ],
    surfaces: ["/trust/security", "/trust/data-handling"],
    owner: OWNER,
    lastReviewed: "2026-07-31",
  },
  {
    id: "chap-no-autonomous-action",
    statement:
      "CHAP AI on this site answers questions for information only: it takes no action on any payroll system and writes nothing beyond its own interaction log.",
    status: "current",
    evidence: [
      { kind: "shipped_surface", path: "src/app/api/chap/ask/route.ts" },
      { kind: "shipped_surface", path: "src/lib/chapAi.ts" },
    ],
    surfaces: ["/trust/security"],
    owner: OWNER,
    lastReviewed: "2026-07-31",
  },
  {
    id: "chap-citation-integrity",
    statement:
      "Every citation CHAP returns must resolve to a corpus of verbatim primary-source excerpts. The server rejects responses citing outside that corpus, and a mechanical verifier checks the corpus text against its sources.",
    status: "current",
    evidence: [
      { kind: "shipped_surface", path: "src/lib/chapValidation.ts" },
      { kind: "shipped_surface", path: "scripts/verify-corpus.mjs" },
      { kind: "shipped_surface", path: "src/data/complianceCorpus.ts" },
    ],
    surfaces: ["/trust/security"],
    owner: OWNER,
    lastReviewed: "2026-07-31",
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
    // "/" and "/services" carry this as the TrustBar badge that replaced
    // "Enterprise-Grade Security" (2026-07-30 ruling: grade adjectives with
    // no named standard may not publish).
    surfaces: ["/", "/services", "/trust/data-handling", "/trust/security"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
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

  // ── Live public surfaces (Stage F, 2026-07-30; rulings applied ─────────
  // 2026-07-30) ───────────────────────────────────────────────────────────
  // Statuses follow the registry doctrine: current = evidenced by a shipped
  // artifact; pilot = capability demonstrated below the asserted scale;
  // planned = intended, not running; illustrative = design placeholder.
  // Ruling (Tom, 2026-07-30): any claim asserting throughput, cadence, or
  // an SLA requires a running job or customer data as evidence — pre-launch
  // none qualify as current. Presentation rules: planned services carry a
  // visible "Coming Soon" marker; illustrative product figures carry a
  // visible sample-data marker.
  //
  // Follow-up ruling (Tom, 2026-07-30): the CredibilityStrip publishes
  // third-party enforcement statistics instead of self-reported capability
  // numbers — the exposure is the pitch, and a prospect can check the
  // sources. The four illustrative cred-* capability placeholders
  // (1,200+ records/cycle, 500+ rules, 50 jurisdictions, 30+ sources)
  // were retired with that ruling; see git history for their entries.
  // Only figures with a checkable primary-source URL qualify for the
  // strip (release-gate enforced). Struck same day: the 33% employer
  // error rate, site-wide — its "IRS employer compliance study" citation
  // has no locatable primary publication, and on a compliance company's
  // site an unverifiable citation reads as invented. The 120 hrs/yr
  // figure stays on inline-cited surfaces only, re-attributed to its
  // actual source of record (Lano, citing EY) in src/lib/stats.ts.
  // Display values and citations live in src/lib/stats.ts (single source
  // of truth); each entry below is the publication license for one figure.
  {
    id: "stat-irc-6656-max-penalty",
    statement: "15% maximum IRC §6656 penalty on late federal payroll tax deposits",
    status: "current",
    evidence: [
      {
        kind: "primary_source",
        url: "https://www.law.cornell.edu/uscode/text/26/6656",
        note: "IRC §6656(b)(1): penalty tiers of 2%/5%/10%, rising to 15% where the failure continues past demand.",
      },
      { kind: "shipped_surface", path: "src/lib/stats.ts" },
    ],
    surfaces: ["/"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "stat-dol-fy2024-back-wages",
    statement:
      "$149.9M recovered by the DOL Wage & Hour Division in FY2024 back wages",
    status: "current",
    evidence: [
      {
        kind: "primary_source",
        url: "https://www.dol.gov/agencies/whd/data",
        note: "DOL WHD enforcement statistics, FY2024 back-wage recoveries.",
      },
      { kind: "shipped_surface", path: "src/lib/stats.ts" },
    ],
    surfaces: ["/"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "stat-compliance-top-challenge",
    statement:
      "63% of payroll professionals name compliance their biggest challenge",
    status: "current",
    evidence: [
      {
        kind: "primary_source",
        url: "https://blogs.payroll.org/pay-news-now/gpw-survey-finds-compliance-remains-biggest-global-payroll-challenge",
        note: "PayrollOrg 'Getting the World Paid' survey, 2024: 63% of respondents named compliance their biggest global payroll challenge.",
      },
      { kind: "shipped_surface", path: "src/lib/stats.ts" },
    ],
    surfaces: ["/"],
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
    id: "svc-governed-payroll-validation",
    statement:
      "Every payroll run validated against federal statutory requirements before commit.",
    status: "pilot",
    evidence: [
      {
        kind: "founder_attested",
        note: "Demonstrated in the frozen demo; production validation depends on product-repo capabilities not yet shipped. 'State' dropped from the statement 2026-07-30: the compliance corpus contains zero state-level entries, so state statutory coverage may not be claimed until state entries exist.",
      },
    ],
    surfaces: ["/", "/services"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "svc-tax-compliance-audit",
    statement:
      "PSE audits payroll tax positions across active jurisdictions and delivers structured response plans for IRS and state agency notices.",
    status: "current",
    evidence: [
      {
        kind: "founder_attested",
        note: "Human advisory service delivered directly by the founder, same class as svc-strategic-advisory; not dependent on unshipped product capabilities. Replaces the retired same-day-update SLA claim on the Tax & Compliance card (2026-07-30 ruling: an SLA requires a mechanism and a track record).",
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
        note: "No analytics dashboards are shipped; the described capability is planned. Card and detail page carry a visible 'Coming Soon' marker (2026-07-30 ruling: planned services rendered as shipped need the on-page marker, not just a registry status).",
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
        note: "No shipped connectors exist in any PSE repository; the integration layer is planned. Card and detail page carry a visible 'Coming Soon' marker (2026-07-30 ruling).",
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

  // ── CHAP surfaces + rendered sample data (2026-07-30 ruling) ───────────
  {
    id: "chap-pipeline-validation",
    statement:
      "CHAP AI scans timecard and payroll data for statutory violations, policy exceptions, and anomalies, then flags, explains, and documents each finding.",
    status: "pilot",
    evidence: [
      { kind: "shipped_surface", path: "src/app/chap-ai/page.tsx" },
      {
        kind: "founder_attested",
        note: "Pipeline demonstrated at demo scale behind the CHAP gate; present-tense capability for a system behind a 503 gate is pilot, not current, until PR #4 merges and the widget answers.",
      },
    ],
    surfaces: ["/", "/chap-ai"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "chap-guard-extension",
    statement:
      "CHAP Guard is a Chrome extension that brings CHAP AI compliance intelligence directly into UKG, ADP, and other payroll platforms.",
    status: "planned",
    evidence: [
      {
        kind: "founder_attested",
        note: "No shipped extension exists; 'Early Access' framing denotes a waitlist, which is honest but does not make the capability current.",
      },
    ],
    surfaces: ["/", "/chap-ai"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "hero-dashboard-sample-metrics",
    statement:
      "Hero dashboard figures (2,847 employees, 96% pre-validated, 0 violations) illustrating the pre-run compliance view.",
    status: "illustrative",
    evidence: [
      { kind: "shipped_surface", path: "src/components/sections/DashboardPreview.tsx" },
      {
        kind: "founder_attested",
        note: "Invented figures; the panel carries a visible 'Sample data' marker so a reader cannot take them as product output.",
      },
    ],
    surfaces: ["/"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "chap-scan-terminal-sample",
    statement:
      "Homepage scan-terminal rows and the '4/5 Passed' result illustrating a CHAP AI pre-run scan.",
    status: "illustrative",
    evidence: [
      { kind: "shipped_surface", path: "src/components/sections/ChapAI.tsx" },
      {
        kind: "founder_attested",
        note: "Invented scan output; the fabricated completion timestamp was removed and the terminal carries a visible 'Sample scan' marker.",
      },
    ],
    surfaces: ["/"],
    owner: OWNER,
    lastReviewed: "2026-07-30",
  },
  {
    id: "chap-regulatory-log-sample",
    statement:
      "Regulatory update log entries on the CHAP AI page illustrating how rule changes would be tracked and documented.",
    status: "illustrative",
    evidence: [
      { kind: "shipped_surface", path: "src/app/chap-ai/page.tsx" },
      {
        kind: "founder_attested",
        note: "Invented log entries (dates, statutes, APPLIED states); the log carries a visible 'Sample data' marker. A fabricated audit trail without a marker is the highest-cost illustration on the site.",
      },
    ],
    surfaces: ["/chap-ai"],
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
