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
  related: RelatedService[];
}

export const serviceData: Record<string, ServiceData> = {

  'payroll-processing': {
    slug: 'payroll-processing',
    name: 'Payroll Processing',
    headline: 'Automated multi-state payroll with real-time compliance validation.',
    subheadline: 'Every run validated before commit. Every decision documented. Every violation caught before it costs you.',
    metaDescription: 'Multi-state payroll processing with CHAP AI pre-run compliance validation. Catch deposit timing errors, overtime violations, and statutory issues before they become IRS penalties.',
    body: 'PSE\'s payroll processing runs on top of CHAP AI — the pre-run compliance engine that validates every employee record against the applicable federal and state statutory ruleset before the payroll commits. This is not a post-processing audit layer. It is a blocking gate: violations are surfaced, explained in plain language, and resolved before a single dollar moves. The result is payroll that passes its own compliance audit on every run.',
    features: [
      { title: 'Multi-state payroll in a single run', body: 'A single payroll run covers all active states, with per-state rule application handled automatically. No separate state runs, no manual rule lookups.' },
      { title: 'CHAP AI pre-run compliance scan', body: 'Every payroll run passes through a full statutory scan before commit — checking overtime, deposit timing, meal break premiums, minimum wage, and benefit deductions across all jurisdictions.' },
      { title: 'Automated deposit scheduling', body: 'IRC §6656 deposit requirements are calculated and scheduled automatically based on your payroll liability tier. Deposit timing errors — the most common source of IRS penalties — are flagged before they occur.' },
      { title: 'Same-day correction workflow', body: 'When CHAP AI flags a violation, the correction interface surfaces the specific employee records, the applicable statute, and the exact change required. Resolution takes minutes, not hours.' },
      { title: 'Audit-ready run documentation', body: 'Every payroll run produces a timestamped compliance record: what was checked, what passed, what was flagged, what was corrected, and by whom. Available on demand for three years.' },
    ],
    stats: [
      { value: '15%', label: 'Maximum IRC §6656 deposit penalty — triggered by deposit timing errors CHAP AI catches pre-run', source: 'IRS Notice 746 (Rev. 12-2024)' },
      { value: '33%', label: 'Of employers make payroll errors in any given period', source: 'IRS employer compliance study; EY Payroll Operations Survey 2024' },
    ],
    chapAiConnection: 'Payroll Processing is the primary integration point for CHAP AI. Every run triggers a full pre-run scan. Violations block the run until resolved. Documentation is generated automatically.',
    related: [
      { slug: 'tax-compliance', name: 'Tax & Compliance' },
      { slug: 'workforce-analytics', name: 'Workforce Analytics' },
    ],
  },

  'tax-compliance': {
    slug: 'tax-compliance',
    name: 'Tax & Compliance',
    headline: 'Federal, state, and local filings handled automatically.',
    subheadline: 'When regulations change, your compliance rules update the same day.',
    metaDescription: 'Automated multi-state payroll tax filing and compliance monitoring. Daily regulatory updates, W-2 preparation, and amendment handling across all active jurisdictions.',
    body: 'PSE handles federal, state, and local tax filing across all active jurisdictions — automatically. Regulatory changes are monitored daily and reflected in your compliance rules within one business day. W-2 and 1099 preparation, withholding reconciliation, and amendment handling are included. The same CHAP AI engine that validates payroll runs also validates tax deposits against IRC §6656 requirements before they are submitted.',
    features: [
      { title: 'Automated multi-jurisdiction filing', body: 'Federal, state, and local tax filings across all active states, handled in a single workflow. No manual per-state submissions.' },
      { title: 'Daily regulatory monitoring', body: 'Federal and state regulatory changes are monitored daily. Rate changes, new requirements, and statutory updates are reflected in your compliance rules within one business day.' },
      { title: 'W-2 and 1099 preparation', body: 'Annual W-2 and 1099-NEC preparation, distribution, and filing — including corrections and amendments.' },
      { title: 'Deposit validation (IRC §6656)', body: 'Tax deposits are validated against your liability tier and deposit schedule before submission. The four-tier penalty system under IRC §6656 is monitored automatically.' },
      { title: 'Amendment handling', body: 'When corrections are required, PSE handles amended filings across all affected jurisdictions, with documentation of what changed and why.' },
    ],
    stats: [
      { value: '63%', label: 'Of payroll professionals name compliance as their #1 challenge', source: 'PayrollOrg "Getting the World Paid" Survey, 2024' },
      { value: '$150M', label: 'Recovered by DOL WHD in FLSA back wages in FY2024 — indicating the scale of ongoing enforcement', source: 'DOL WHD FY2024 Statistical Release' },
    ],
    chapAiConnection: 'CHAP AI monitors statutory changes and updates the tax compliance ruleset daily. Every deposit is validated against current IRC §6656 requirements before submission.',
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
    metaDescription: 'Live workforce analytics for multi-state employers. Overtime exposure, labor cost dashboards, compliance risk heatmaps, and headcount reporting updated in real time.',
    body: 'PSE\'s workforce analytics give payroll directors real-time visibility into the metrics that drive compliance exposure: overtime trends by department, multi-state headcount, labor cost variance, and benefit utilization. These are not lagging indicators pulled from a data warehouse — they are live views of the same data CHAP AI uses to run pre-payroll compliance scans. When overtime exposure increases in a specific department, you see it before the payroll runs.',
    features: [
      { title: 'Live labor cost dashboards', body: 'Real-time labor cost tracking by department, location, and entity. Variance alerts when actual costs diverge from budget.' },
      { title: 'Overtime exposure monitoring', body: 'Per-employee and per-department overtime tracking updated in real time as hours are recorded. Exposure flagged before it becomes a violation.' },
      { title: 'Multi-state headcount reporting', body: 'Headcount, FTE, and contractor counts by state — updated automatically as employees onboard, offboard, or change work locations.' },
      { title: 'Compliance risk heatmaps', body: 'Visual mapping of compliance exposure by jurisdiction, department, and violation type — based on CHAP AI scan history.' },
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
    headline: 'Connect benefits data directly to your payroll workflow.',
    subheadline: 'Deduction reconciliation, enrollment sync, and benefits validation — without the manual export.',
    metaDescription: 'Benefits integration for payroll. Direct deduction sync, enrollment change automation, ACA compliance tracking, and FSA/HSA validation connected to payroll processing.',
    body: 'PSE connects benefits data directly to the payroll workflow — eliminating the manual export-import cycle between your benefits platform and payroll system. Enrollment changes sync automatically. Deductions are validated against current benefit elections before payroll commits. ACA tracking, FSA/HSA deduction validation, and COBRA administration are handled within the same compliance framework as payroll.',
    features: [
      { title: 'Direct deduction sync', body: 'Benefit deductions pull directly from your benefits platform. No manual exports, no reconciliation spreadsheets, no missed updates.' },
      { title: 'Enrollment change automation', body: 'Life event changes, open enrollment updates, and new hire elections sync to payroll automatically within one business day.' },
      { title: 'ACA compliance tracking', body: 'ACA employer mandate tracking under §4980H, including full-time equivalent calculations, affordability testing, and 1094/1095 preparation.' },
      { title: 'FSA/HSA deduction validation', body: 'Pre-tax deduction limits monitored against IRS annual limits. Excess contribution flags generated automatically.' },
      { title: 'Benefits audit trail', body: 'Every deduction change is logged with source, timestamp, and approval record — accessible for benefits audits and employee disputes.' },
    ],
    stats: [
      { value: '0', label: 'Manual reconciliation steps between benefits and payroll in a PSE-integrated workflow', source: 'PSE platform design specification' },
      { value: '19%', label: 'Of employees may consider leaving due to payroll errors annually — benefits errors are a leading cause', source: 'Remote Global Payroll Report 2024; Kronos Workforce Institute' },
    ],
    chapAiConnection: 'CHAP AI validates benefit deductions against current elections and IRS limits before each payroll run. Deduction errors are flagged as compliance violations, not accounting corrections.',
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
