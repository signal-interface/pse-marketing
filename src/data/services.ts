export interface ServiceFeature {
  title: string;
  body: string;
}

export interface ServiceStat {
  value: string;
  label: string;
  source: string;
}

export interface RelatedService {
  slug: string;
  name: string;
}

export interface ServiceData {
  slug: string;
  name: string;
  headline: string;
  subheadline: string;
  metaDescription: string;
  body: string;
  features: ServiceFeature[];
  stats: ServiceStat[];
  chapAiConnection: string;
  screenshot?: { src: string; alt: string; caption: string };
  related: RelatedService[];
}

export const serviceData: Record<string, ServiceData> = {

  'payroll-processing': {
    slug: 'payroll-processing',
    name: 'Payroll Processing',
    headline: 'Automated multi-state payroll with real-time compliance validation.',
    subheadline: 'Every run validated before commit. Every decision documented. Every violation caught before it costs you.',
    metaDescription: 'Multi-state payroll processing with CHAP AI pre-run compliance validation. Catch deposit timing errors, overtime violations, and statutory issues before they become IRS penalties.',
    body: 'PSE\'s payroll processing runs on top of CHAP AI — the pre-run compliance engine that validates every employee record against the applicable federal and state statutory ruleset before the payroll commits. This is not a post-processing audit layer. It is a blocking gate: violations are surfaced, explained in plain language, and resolved before payroll closes. PSE validates and governs — your existing payroll processor executes. The result is payroll that passes its own compliance audit on every run.',
    features: [
      { title: 'Multi-state payroll in a single run', body: 'A single payroll run covers all active states, with per-state rule application handled automatically. No separate state runs, no manual rule lookups.' },
      { title: 'CHAP AI pre-run compliance scan', body: 'Every payroll run passes through a full statutory scan before commit — checking overtime, deposit timing, meal break premiums, minimum wage, and benefit deductions across all jurisdictions.' },
      { title: 'Deposit timing validation (IRC §6656)', body: 'CHAP AI validates your deposit timing and amounts against your payroll liability tier on every run — flagging errors before they occur. PSE does not move or push funds; all deposits are executed by your existing payroll processor or financial institution.' },
      { title: 'Same-day correction workflow', body: 'When CHAP AI flags a violation, the correction interface surfaces the specific employee records, the applicable statute, and the exact change required. Resolution takes minutes, not hours.' },
      { title: 'Audit-ready run documentation', body: 'Every payroll run produces a timestamped compliance record: what was checked, what passed, what was flagged, what was corrected, and by whom. Available on demand for three years.' },
    ],
    stats: [
      { value: '15%', label: 'Maximum IRC §6656 deposit penalty — triggered by deposit timing errors CHAP AI catches pre-run', source: 'IRS Notice 746 (Rev. 12-2024)' },
      { value: '33%', label: 'Of employers make payroll errors in any given period', source: 'IRS employer compliance study; EY Payroll Operations Survey 2024' },
    ],
    chapAiConnection: 'Payroll Processing is the primary integration point for CHAP AI. Every run triggers a full pre-run scan. Violations block the run until resolved. Documentation is generated automatically.',
    screenshot: { src: '/screenshots/payroll-run.png', alt: 'Payroll run validation showing per-employee compliance checks', caption: 'CHAP AI pre-run validation — every employee checked before payroll commits' },
    related: [
      { slug: 'tax-compliance', name: 'Tax & Compliance' },
      { slug: 'workforce-analytics', name: 'Workforce Analytics' },
    ],
  },

  'tax-compliance': {
    slug: 'tax-compliance',
    name: 'Tax & Compliance',
    headline: 'Payroll tax compliance audited, documented, and actioned — every cycle.',
    subheadline: 'PSE audits your payroll tax position, identifies exposure, and delivers a clear action plan — including full support on tax notices from the IRS and state agencies.',
    metaDescription: 'Payroll tax compliance audit and tax notice support for multi-state employers. Daily regulatory monitoring, deposit timing validation, and structured response plans for IRS and state agency notices.',
    body: 'PSE audits your payroll tax position across federal, state, and local jurisdictions — identifying exposure before it triggers a penalty. Regulatory changes are monitored daily and reflected in your compliance rules within one business day. When a tax notice arrives from the IRS or a state agency, PSE researches the issue, scopes the liability, and delivers a structured response plan. CHAP AI validates deposit timing and amounts against IRC §6656 requirements on every payroll run — flagging issues before they become notices.',
    features: [
      { title: 'Multi-jurisdiction compliance audit', body: 'PSE audits your payroll tax position across all active federal, state, and local jurisdictions — identifying withholding errors, deposit timing issues, and classification gaps before they become penalties.' },
      { title: 'Daily regulatory monitoring', body: 'Federal and state regulatory changes are monitored daily. Rate changes, new requirements, and statutory updates are reflected in your compliance rules within one business day.' },
      { title: 'Tax notice support', body: 'When you receive a notice from the IRS or a state tax agency, PSE researches the underlying issue, scopes the liability, and delivers a structured response plan — including documentation and recommended next steps.' },
      { title: 'Deposit timing validation (IRC §6656)', body: 'CHAP AI validates deposit timing and amounts against your liability tier and deposit schedule on every payroll run. Flagged before submission — not after the notice arrives.' },
      { title: 'Withholding reconciliation', body: 'Withholding positions are reconciled against employee elections, state requirements, and payroll data each cycle. Discrepancies are flagged with the applicable statute and recommended correction.' },
    ],
    stats: [
      { value: '63%', label: 'Of payroll professionals name compliance as their #1 challenge', source: 'PayrollOrg "Getting the World Paid" Survey, 2024' },
      { value: '$150M', label: 'Recovered by DOL WHD in FLSA back wages in FY2024 — indicating the scale of ongoing enforcement', source: 'DOL WHD FY2024 Statistical Release' },
    ],
    chapAiConnection: 'CHAP AI validates deposit timing and withholding positions on every payroll run — flagging exposure before submission. When a tax notice arrives, CHAP AI\'s audit trail provides the documentation foundation for the PSE response plan.',
    screenshot: { src: '/screenshots/compliance-scan.png', alt: 'CHAP AI compliance scan with statute citations for tax compliance checks', caption: 'Compliance scan — deposit timing and withholding validation with statute citations' },
    related: [
      { slug: 'payroll-processing', name: 'Payroll Processing' },
      { slug: 'strategic-advisory', name: 'Strategic Advisory' },
    ],
  },

  'workforce-analytics': {
    slug: 'workforce-analytics',
    name: 'Workforce Analytics',
    headline: 'Labor costs, overtime exposure, and headcount trends — updated live.',
    subheadline: 'Real-time visibility into the compliance and cost drivers that matter before they appear in a quarterly review.',
    metaDescription: 'Live workforce analytics for multi-state employers. Overtime exposure, labor cost dashboards, exception trend reporting, and headcount reporting updated in real time.',
    body: 'PSE\'s workforce analytics give payroll directors real-time visibility into the metrics that drive compliance exposure: overtime trends by department, multi-state headcount, labor cost variance, and benefit utilization. These are not lagging indicators pulled from a data warehouse — they are live views of the same data CHAP AI uses to run compliance audits. Recurring exception patterns surface automatically, so systemic issues are addressed before they compound.',
    features: [
      { title: 'Live labor cost dashboards', body: 'Real-time labor cost tracking by department, location, and entity. Variance alerts when actual costs diverge from budget.' },
      { title: 'Overtime exposure monitoring', body: 'Per-employee and per-department overtime tracking updated in real time as hours are recorded. Exposure flagged before it becomes a violation.' },
      { title: 'Multi-state headcount reporting', body: 'Headcount, FTE, and contractor counts by state — updated automatically as employees onboard, offboard, or change work locations.' },
      { title: 'Exception trend reporting', body: 'Recurring violation patterns surfaced by department, jurisdiction, and violation type — based on CHAP AI scan history. Identifies systemic issues before they compound across payroll cycles.' },
      { title: 'Custom reporting exports', body: 'Scheduled and on-demand exports in CSV, Excel, and PDF formats. Custom field selection for CFO, HR, and board reporting.' },
    ],
    stats: [
      { value: '35%', label: 'Of HR department time dedicated to payroll responsibilities', source: 'OnePoint Research' },
      { value: '120 hrs', label: 'Lost per employer annually to compliance issue resolution', source: 'Ernst & Young Global Payroll Operations Survey, 2024' },
    ],
    chapAiConnection: 'Workforce Analytics draws directly from CHAP AI\'s scan history. Overtime exposure data, violation frequency, and compliance trends are surfaced in the analytics layer in real time.',
    related: [
      { slug: 'payroll-processing', name: 'Payroll Processing' },
      { slug: 'benefits-integration', name: 'Benefits Integration' },
    ],
  },

  'benefits-integration': {
    slug: 'benefits-integration',
    name: 'Benefits Integration',
    headline: 'Benefits deduction reconciliation — audited against payroll records.',
    subheadline: 'PSE audits payroll deduction reports against benefit elections to identify discrepancies before they become compliance or employee relations issues.',
    metaDescription: 'Benefits deduction reconciliation for payroll. PSE audits payroll deduction reports against benefit elections to identify over-deductions, missed elections, and plan code mismatches.',
    body: 'Benefits data lives in your HRIS or HCM system — PSE does not replace or drive that workflow. What PSE does is audit your payroll deduction reports against benefit elections to identify discrepancies: over-deductions, missed elections, and plan code mismatches that create compliance exposure and employee trust issues. This service is currently in development. Contact us to discuss your reconciliation requirements.',
    features: [
      { title: 'Deduction reconciliation audit', body: 'PSE audits payroll deduction reports against benefit elections — identifying over-deductions, under-deductions, missed enrollment updates, and plan code mismatches that create compliance or payroll exposure.' },
      { title: 'Discrepancy documentation', body: 'Every identified discrepancy is documented with the affected employee, deduction category, variance amount, and recommended correction — in an audit-ready format.' },
      { title: 'Payroll-benefits gap analysis', body: 'Structured review of the gap between what your benefits platform shows and what payroll is deducting — surfacing systemic issues that recur across pay cycles.' },
      { title: 'Action plan delivery', body: 'Reconciliation findings are delivered as a structured action plan with prioritized corrections, documentation for employee communication, and guidance on preventing recurrence.' },
      { title: 'In development', body: 'This service is currently in development. Speak with PSE to discuss your deduction reconciliation requirements and timeline.' },
    ],
    stats: [
      { value: '33%', label: 'Of employers have an active payroll error in any given period — benefit deduction errors are among the most common', source: 'IRS employer compliance study; EY Payroll Operations Survey, 2024' },
      { value: '$291', label: 'Average cost per payroll error — deduction discrepancies compound across every pay cycle they go undetected', source: 'Ernst & Young Global Payroll Operations Survey, 2022' },
    ],
    chapAiConnection: 'CHAP AI\'s audit trail provides the baseline for benefits deduction reconciliation — surfacing the payroll-side data that is compared against benefit elections to identify discrepancies.',
    related: [
      { slug: 'payroll-processing', name: 'Payroll Processing' },
      { slug: 'system-integration', name: 'System Integration' },
    ],
  },

  'system-integration': {
    slug: 'system-integration',
    name: 'System Integration',
    headline: 'Connect payroll to your HRIS and workforce management platforms.',
    subheadline: 'Pre-built connectors for UKG, ADP, and Dayforce. Custom API for everything else.',
    metaDescription: 'Payroll system integration with UKG, ADP, Dayforce, and major HRIS platforms. Bi-directional data sync, real-time validation on inbound data, and custom REST API.',
    body: 'PSE integrates with the HRIS and workforce management platforms your team already uses. Pre-built connectors for UKG, ADP, and Dayforce handle bi-directional data sync out of the box. Inbound data from connected systems passes through CHAP AI validation before it reaches payroll — catching classification errors, rate mismatches, and missing required fields at the source system boundary, not after a payroll run fails.',
    features: [
      { title: 'UKG, ADP, Dayforce connectors', body: 'Pre-built, maintained integrations with the three largest enterprise payroll and workforce platforms. Configuration-based setup, no custom development required.' },
      { title: 'Custom REST API', body: 'Full REST API for proprietary HRIS systems, internal tools, and custom workflows. Webhook support for real-time event-driven sync.' },
      { title: 'Bi-directional data sync', body: 'Payroll inputs flow in from HRIS. Validated outputs — pay stubs, tax documents, compliance records — flow back. Both directions are logged.' },
      { title: 'Inbound data validation', body: 'All data received from connected systems passes through CHAP AI validation at the integration boundary. Classification errors, missing fields, and rate inconsistencies are flagged before they enter payroll.' },
      { title: 'Integration audit logging', body: 'Every data exchange is logged with timestamp, source system, record count, and validation result. Accessible for compliance audits and integration troubleshooting.' },
    ],
    stats: [
      { value: '85%', label: 'Of companies encounter challenges with their payroll technologies', source: 'Ceridian/APA/GPMI Payroll Technology Survey' },
      { value: '22%', label: 'Of payroll teams spend 30+ hours weekly reconciling payroll and HR data', source: 'ADP, 2023' },
    ],
    chapAiConnection: 'CHAP AI validation runs at the integration boundary — data arriving from connected systems is checked before entering the payroll workflow. This catches source-system errors at the earliest possible point.',
    related: [
      { slug: 'payroll-processing', name: 'Payroll Processing' },
      { slug: 'benefits-integration', name: 'Benefits Integration' },
    ],
  },

  'strategic-advisory': {
    slug: 'strategic-advisory',
    name: 'Strategic Advisory',
    headline: 'Payroll structure optimization and compliance strategy.',
    subheadline: 'Advisory backed by the same statutory framework that powers CHAP AI — not generic HR consulting.',
    metaDescription: 'Strategic payroll advisory for multi-state employers. Entity structure optimization, multi-state expansion planning, compliance gap assessments, and audit preparation.',
    body: 'PSE\'s advisory practice is staffed by payroll compliance experts who operate within the same statutory framework as CHAP AI. Engagements are scoped to specific, high-stakes decisions: multi-state expansion planning, entity structure optimization, compensation strategy review, and audit preparation. Advisory outputs are documented in the same format as CHAP AI compliance records — statute-cited, traceable, and audit-ready.',
    features: [
      { title: 'Multi-state expansion planning', body: 'Before establishing operations in a new state, PSE maps the full payroll compliance implications: applicable wage laws, deposit requirements, local tax obligations, and benefit mandates.' },
      { title: 'Entity structure optimization', body: 'For multi-entity organizations, PSE reviews payroll structure across entities for efficiency, compliance exposure, and consolidation opportunities.' },
      { title: 'Compensation strategy review', body: 'Review of compensation structures for FLSA classification accuracy, overtime exposure, and multi-state minimum wage compliance.' },
      { title: 'Compliance gap assessments', body: 'Structured review of current payroll operations against applicable statutory requirements. Findings documented with statute citations and remediation priority.' },
      { title: 'Audit preparation support', body: 'Pre-audit documentation review, record organization, and response preparation for IRS, DOL, and state agency inquiries.' },
    ],
    stats: [
      { value: '$212M', label: 'In DOL WHD back wages recovered from employers in FY2023 — the exposure PSE advisory helps prevent', source: 'DOL WHD FY2023 Statistical Release' },
      { value: '14%', label: 'Of businesses faced compliance litigation related to payroll errors in a 12-month period', source: 'Ernst & Young Global Payroll Operations Survey, 2024' },
    ],
    chapAiConnection: 'Advisory engagements use CHAP AI scan history as the baseline for compliance gap assessments. Findings reference the same statutory framework — FLSA, IRC, state labor codes — that powers the CHAP AI ruleset.',
    related: [
      { slug: 'tax-compliance', name: 'Tax & Compliance' },
      { slug: 'payroll-processing', name: 'Payroll Processing' },
    ],
  },

};

export const SERVICE_SLUGS = Object.keys(serviceData);
