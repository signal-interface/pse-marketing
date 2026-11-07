export const SITE = {
  name: "Payroll Synergy Experts",
  title:
    "AI-Powered Payroll Compliance & Controls | Payroll Synergy Experts",
  description:
    "AI-powered payroll controls that catch compliance issues before they cost you. Every run validated, every decision documented. Request a demo today.",
  url: "https://payrollsynergyexperts.com",
  ogImage: "https://payrollsynergyexperts.com/opengraph-image",
} as const;

export const INVESTOR_INTEREST_URL =
  "https://www.srholdingsllc.com/investors?venture=pse&source=pse-marketing#investor-form" as const;

export const NAV_LINKS = [
  { label: "CHAP AI", href: "/chap-ai" },
  { label: "Services", href: "/services" },
  { label: "Risk Estimator", href: "/compliance-risk" },
  { label: "Payroll Intelligence", href: "/payroll-intelligence" },
  { label: "Investors", href: INVESTOR_INTEREST_URL },
] as const;

export const PUBLIC_ROUTES = [
  "/",
  "/chap-ai",
  "/services",
  "/compliance-risk",
  "/payroll-intelligence",
  "/payroll-intelligence/briefings",
  "/payroll-intelligence/methodology",
  "/payroll-intelligence/updates",
  "/payroll-intelligence/2026-federal-payroll-baseline",
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
    desc: "Introduces IRC §6656 federal deposit penalty questions using statutory references.",
    color: "blue-accent",
  },
  {
    step: "Flag",
    claimId: CHAP_PIPELINE_CLAIM_ID,
    desc: "Identifies relevant statutory references and topics for independent human review.",
    color: "amber",
  },
  {
    step: "Explain",
    claimId: CHAP_PIPELINE_CLAIM_ID,
    desc: "Provides an AI-generated educational explanation with source citations where supported.",
    color: "purple",
  },
  {
    step: "Document",
    claimId: CHAP_PIPELINE_CLAIM_ID,
    desc: "Points to the underlying authorities. It does not generate payroll audit records or operational determinations.",
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
