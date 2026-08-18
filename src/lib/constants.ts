export const SITE = {
  name: "Payroll Synergy Experts",
  title:
    "AI-Powered Payroll Compliance & Controls | Payroll Synergy Experts",
  description:
    "AI-powered payroll controls that catch compliance issues before they cost you. Every run validated, every decision documented. Request a demo today.",
  url: "https://payrollsynergyexperts.com",
  ogImage: "https://payrollsynergyexperts.com/opengraph-image",
} as const;

export const NAV_LINKS = [
  { label: "CHAP AI", href: "/chap-ai" },
  { label: "Services", href: "/services" },
  { label: "Risk Estimator", href: "/compliance-risk" },
  { label: "Investors", href: "https://signal-executive-interface.vercel.app/investor" },
] as const;

export const PUBLIC_ROUTES = [
  "/",
  "/chap-ai",
  "/services",
  "/compliance-risk",
  "/privacy",
  "/terms",
] as const;

export const DEMO_ANCHOR = "/#demo" as const;

// Enumerated in the sitemap and footer only while TRUST_LAYER_ENABLED is on.
export const TRUST_ROUTES = [
  "/trust",
  "/trust/security",
  "/trust/subprocessors",
  "/trust/data-handling",
] as const;

export const SERVICES = [
  {
    icon: "Zap" as const,
    title: "Governed Payroll Runs",
    claimId: "svc-governed-payroll-validation",
    desc: "Pre-run compliance validation before every cycle commits. Every run governed, every decision documented.",
  },
  {
    icon: "ShieldCheck" as const,
    title: "Tax & Compliance",
    claimId: "svc-tax-compliance-audit",
    desc: "Payroll tax positions audited across active jurisdictions, with structured response plans for IRS and state agency notices.",
  },
  {
    icon: "BarChart3" as const,
    title: "Workforce Analytics",
    claimId: "svc-workforce-analytics",
    desc: "Labor cost exposure, overtime liability, and compliance posture — visible in real time, not buried in a quarterly deck.",
  },
  {
    icon: "RefreshCw" as const,
    title: "Benefits Reconciliation",
    claimId: "svc-benefits-reconciliation",
    desc: "Benefits deduction reconciliation — PSE audits payroll deduction reports against benefit elections to identify discrepancies.",
  },
  {
    icon: "Plug" as const,
    title: "System Integration",
    claimId: "svc-prebuilt-integrations",
    desc: "Connect payroll to your HRIS and workforce management platforms with pre-built integrations and custom APIs.",
  },
  {
    icon: "Target" as const,
    title: "Strategic Advisory",
    claimId: "svc-strategic-advisory",
    desc: "Payroll structure optimization, entity setup guidance, and compliance posture strategy for growing organizations.",
  },
] as const;

export const CHAP_PIPELINE_CLAIM_ID = "chap-pipeline-validation" as const;

export const CHAP_STEPS = [
  {
    step: "Detect",
    claimId: CHAP_PIPELINE_CLAIM_ID,
    desc: "Scans timecard and payroll data for statutory violations, policy exceptions, and anomalies.",
    color: "blue-accent",
  },
  {
    step: "Flag",
    claimId: CHAP_PIPELINE_CLAIM_ID,
    desc: "Surfaces issues with severity levels and the specific regulation or policy that triggered the flag.",
    color: "amber",
  },
  {
    step: "Explain",
    claimId: CHAP_PIPELINE_CLAIM_ID,
    desc: "Plain-language rationale for every flag — what’s wrong, why it matters, and what clears it.",
    color: "purple",
  },
  {
    step: "Document",
    claimId: CHAP_PIPELINE_CLAIM_ID,
    desc: "Timestamped evidence of what was checked, what passed, and what was flagged. Audit-ready by default.",
    color: "green",
  },
] as const;

export const SOCIAL = {
  x: { url: "https://x.com/psecompliance", handle: "@psecompliance" },
  instagram: {
    url: "https://www.instagram.com/pse_intelligence/",
    handle: "@pse_intelligence",
  },
  linkedin: {
    url: "https://www.linkedin.com/company/payroll-synergy-experts/",
    handle: "Payroll Synergy Experts",
  },
} as const;
