export const SITE = {
  name: "Payroll Synergy Experts",
  title:
    "AI-Powered Payroll Compliance & Controls | Payroll Synergy Experts",
  description:
    "AI-powered payroll controls that catch compliance issues before they cost you. Every run validated, every decision documented. Request a demo today.",
  url: "https://payrollsynergyexperts.com",
  ogImage: "https://payrollsynergyexperts.com/og-banner.png",
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "#services" },
  { label: "CHAP AI", href: "#chap" },
  { label: "Why PSE", href: "#proof" },
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
    desc: "Federal, state, and local filings handled automatically. When regulations change, your rules update the same day.",
  },
  {
    icon: "BarChart3" as const,
    title: "Workforce Analytics",
    desc: "Labor costs, overtime exposure, and headcount trends \u2014 updated live, not buried in a quarterly deck.",
  },
  {
    icon: "RefreshCw" as const,
    title: "Benefits Integration",
    desc: "Connect benefits data directly to your payroll workflow for seamless deduction reconciliation and enrollment sync.",
  },
  {
    icon: "Plug" as const,
    title: "System Integration",
    desc: "Connect payroll to your HRIS and workforce management platforms with pre-built integrations and custom APIs.",
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
} as const;
