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
  { label: "Services", href: "/services" },
  { label: "CHAP AI", href: "/chap-ai" },
  { label: "Why PSE", href: "/#proof" },
  { label: "Risk Estimator", href: "/compliance-risk" },
] as const;

export const SERVICES = [
  {
    icon: "Zap" as const,
    title: "Payroll Processing",
    desc: "Multi-state payroll execution with pre-run compliance validation. Every cycle governed, every decision documented.",
  },
  {
    icon: "ShieldCheck" as const,
    title: "Tax & Compliance",
    desc: "Federal, state, and local statutory checks applied continuously. When regulations change, CHAP AI updates the same day.",
  },
  {
    icon: "BarChart3" as const,
    title: "Workforce Analytics",
    desc: "Labor cost exposure, overtime liability, and compliance posture \u2014 visible in real time, not buried in a quarterly deck.",
  },
  {
    icon: "RefreshCw" as const,
    title: "Benefits Integration",
    desc: "Benefits deduction reconciliation \u2014 PSE audits payroll deduction reports against benefit elections to identify discrepancies.",
  },
  {
    icon: "Plug" as const,
    title: "System Integration",
    desc: "Connect payroll to your HRIS and workforce management platforms with pre-built integrations and custom APIs.",
  },
  {
    icon: "Target" as const,
    title: "Strategic Advisory",
    desc: "Payroll structure optimization, entity setup guidance, and compliance posture strategy for growing organizations.",
  },
] as const;

export const CHAP_STEPS = [
  {
    step: "Detect",
    desc: "Scans timecard and payroll data for statutory violations, policy exceptions, and anomalies.",
    color: "blue-accent",
  },
  {
    step: "Flag",
    desc: "Surfaces issues with severity levels and the specific regulation or policy that triggered the flag.",
    color: "amber",
  },
  {
    step: "Explain",
    desc: "Plain-language rationale for every flag \u2014 what\u2019s wrong, why it matters, and what clears it.",
    color: "purple",
  },
  {
    step: "Document",
    desc: "Timestamped evidence of what was checked, what passed, and what was flagged. Audit-ready by default.",
    color: "green",
  },
] as const;

export const STATS = [
  {
    metric: "100%",
    label: "Traceable decisions",
    desc: "Every payroll decision documented with the logic and data that produced it.",
  },
  {
    metric: "50%",
    label: "Faster processing",
    desc: "Automation eliminates manual data entry, reconciliation, and approval bottlenecks.",
  },
  {
    metric: "Daily",
    label: "Regulatory monitoring",
    desc: "Federal, state, and local changes reflected in your compliance rules within one business day.",
  },
  {
    metric: "0",
    label: "Untracked changes",
    desc: "Every transaction validated against compliance rules before execution.",
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
