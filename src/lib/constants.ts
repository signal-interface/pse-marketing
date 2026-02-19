export const SITE = {
  name: "Payroll Synergy Experts",
  title: "Payroll Synergy Experts | Payroll Compliance & Controls",
  description:
    "Deterministic payroll controls and AI-powered compliance validation. Catch issues before they hit employees, auditors, or lawsuits. Request a demo today.",
  url: "https://payrollsynergyexperts.com",
  ogImage: "https://payrollsynergyexperts.com/og-banner.png",
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "CHAP AI", href: "#chap-ai" },
  { label: "Preview", href: "#preview" },
] as const;

export const SERVICES = [
  {
    icon: "Zap" as const,
    title: "Payroll Processing",
    desc: "Automated multi-state payroll with real-time compliance validation. No more spreadsheet gymnastics.",
  },
  {
    icon: "ShieldCheck" as const,
    title: "Tax & Compliance",
    desc: "Federal, state, and local tax filing with automated regulatory updates. Stay compliant without the overhead.",
  },
  {
    icon: "BarChart3" as const,
    title: "Workforce Analytics",
    desc: "Labor cost modeling, overtime forecasting, and headcount planning with live data — not quarterly reports.",
  },
  {
    icon: "RefreshCw" as const,
    title: "Benefits Administration",
    desc: "Seamless benefits enrollment, tracking, and reconciliation integrated directly into your payroll workflow.",
  },
  {
    icon: "Plug" as const,
    title: "System Integration",
    desc: "Connect payroll to your HRIS, accounting, and ERP systems with pre-built integrations and custom APIs.",
  },
  {
    icon: "Target" as const,
    title: "Strategic Advisory",
    desc: "Payroll structure optimization, entity setup guidance, and compensation strategy for growing teams.",
  },
] as const;

export const CHAP_STEPS = [
  {
    step: "Detect",
    desc: "Scans timecard and payroll data for statutory violations, policy exceptions, and anomalies.",
    color: "#1a5fb4",
  },
  {
    step: "Flag",
    desc: "Surfaces issues with severity levels and the specific regulation or policy that triggered the flag.",
    color: "#f59e0b",
  },
  {
    step: "Explain",
    desc: "Plain-language rationale for every flag — what's wrong, why it matters, and what clears it.",
    color: "#2ec4b6",
  },
  {
    step: "Document",
    desc: "Generates a timestamped evidence record of what was checked, what passed, and what was flagged.",
    color: "#0b1d3a",
  },
] as const;

export const STATS = [
  {
    metric: "Audit-Ready",
    label: "Accuracy by design",
    desc: "Every transaction validated against compliance rules before execution.",
  },
  {
    metric: "50%",
    label: "Faster processing*",
    desc: "Automation eliminates manual data entry, reconciliation, and approval bottlenecks.",
  },
  {
    metric: "Daily",
    label: "Regulatory monitoring",
    desc: "Federal, state, and local changes reflected in your compliance rules within one business day.",
  },
  {
    metric: "100%",
    label: "Traceable decisions",
    desc: "Every payroll decision documented with the logic and data that produced it.",
  },
] as const;

export const SOCIAL = {
  x: { url: "https://x.com/psecompliance", handle: "@psecompliance" },
  instagram: {
    url: "https://www.instagram.com/pse_intelligence/",
    handle: "@pse_intelligence",
  },
} as const;
