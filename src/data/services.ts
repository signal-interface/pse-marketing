import { ENFORCEMENT_STATS } from '@/lib/stats';

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
  ctaLabel?: string;
  ctaSource?: string;
}

export const serviceData: Record<string, ServiceData> = {

  'payroll-processing': { // boundary-lint-allow: prohibited-execution-nominal -- legacy public slug; rename tracked separately, requires 308 + re-index
    slug: 'payroll-processing', // boundary-lint-allow: prohibited-execution-nominal -- legacy public slug; rename tracked separately, requires 308 + re-index
    name: 'Governed Payroll Runs',
    headline: 'Real-time compliance validation for automated multi-state payroll.',
    subheadline: 'Governance around each run. Traceable review. Earlier visibility into potential exceptions.',
    metaDescription: 'Explore PSE governed payroll validation: an end-state vision connecting pre-close checks, statutory context, exception review, and audit evidence.',
    body: 'PSE\'s governed payroll vision adds an independent control layer around the payroll engine. Designed pre-close checks bring statutory context, flagged exceptions, and practitioner decisions into a traceable review workflow. Your existing payroll processor remains the system of record and executes payroll; PSE is designed to govern the review around those outcomes.',
    features: [
      { title: 'Multi-state validation in a single pass', body: 'The platform is designed to bring applicable federal and state checks together across payroll populations, highlighting where local requirements need practitioner review.' },
      { title: 'CHAP AI pre-run compliance scan', body: 'The envisioned CHAP AI scan organizes checks for overtime, deposit timing, wage requirements, and other configured controls before payroll closes.' },
      { title: 'Deposit timing validation (IRC §6656)', body: 'The planned workflow assesses deposit timing indicators against relevant requirements for payroll team review. Payroll processors and financial institutions retain responsibility for executing deposits; PSE does not move funds.' },
      { title: 'Guided correction workflow', body: 'When CHAP AI flags a violation, the correction interface surfaces the specific employee records, the applicable statute, and the exact change required.' },
      { title: 'Audit-ready documentation', body: 'The evidence layer is designed to record controls reviewed, exceptions identified, professional decisions, and supporting documentation. Production retention periods are governed by the approved data policy.' },
    ],
    stats: [
      { value: ENFORCEMENT_STATS.irsMaxDepositPenalty.value, label: 'Maximum IRC §6656 deposit penalty rate in qualifying circumstances', source: ENFORCEMENT_STATS.irsMaxDepositPenalty.source },
      { value: ENFORCEMENT_STATS.perErrorCost.value, label: 'Average cost per payroll error — before penalties and interest', source: ENFORCEMENT_STATS.perErrorCost.source },
    ],
    chapAiConnection: 'The envisioned CHAP AI control workflow links pre-close checks to practitioner review and evidence capture, with payroll execution retained by the employer\'s system of record.',
    screenshot: {
      src: '/screenshots/payroll-run.png',
      alt: 'Illustrative governance dashboard using synthetic payroll data',
      caption: 'Illustrative CHAP AI validation concept using synthetic data',
    },
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
    metaDescription: 'Payroll tax compliance audit and tax notice support for multi-state employers. Regulatory change monitoring, deposit timing validation, and structured response plans for IRS and state agency notices.',
    body: 'PSE advisory helps employers assess payroll tax positions and develop structured responses to IRS and state notices. The broader CHAP AI platform vision adds statutory context and early deposit timing exception visibility across payroll workflows. The public CHAP marketing experience is educational and does not make operational compliance determinations.',
    features: [
      { title: 'Multi-jurisdiction compliance audit', body: 'PSE audits your payroll tax position across all active federal, state, and local jurisdictions — identifying withholding errors, deposit timing issues, and classification gaps before they become penalties.' },
      { title: 'Regulatory change monitoring', body: 'Rate changes, new requirements, and statutory updates at the federal and state level are tracked and reflected in your compliance rules.' },
      { title: 'Tax notice support', body: 'When you receive a notice from the IRS or a state tax agency, PSE researches the underlying issue, scopes the liability, and delivers a structured response plan — including documentation and recommended next steps.' },
      { title: 'Deposit timing validation (IRC §6656)', body: 'The CHAP AI platform vision includes identifying potential deposit timing exceptions for professional review before submission.' },
      { title: 'Withholding reconciliation', body: 'Withholding positions are reconciled against employee elections, state requirements, and payroll data each cycle. Discrepancies are flagged with the applicable statute and recommended correction.' },
    ],
    stats: [
      { value: ENFORCEMENT_STATS.payrollComplianceTopChallenge.value, label: 'Of payroll professionals name compliance as their #1 challenge', source: ENFORCEMENT_STATS.payrollComplianceTopChallenge.source },
      { value: `${ENFORCEMENT_STATS.dolBackWages.fiscalYear}: ${ENFORCEMENT_STATS.dolBackWages.value}`, label: 'Recovered by DOL WHD in FLSA back wages — indicating the scale of ongoing enforcement', source: ENFORCEMENT_STATS.dolBackWages.source },
    ],
    chapAiConnection: 'The envisioned CHAP AI workflow links deposit timing questions, relevant statutory references, review decisions, and supporting evidence to payroll governance.' ,
    screenshot: { src: '/screenshots/compliance-scan.png', alt: 'CHAP AI compliance scan with statute citations for tax compliance checks', caption: 'Compliance scan — deposit timing and withholding validation with statute citations' },
    related: [
      {
        slug: 'payroll-processing', // boundary-lint-allow: prohibited-execution-nominal -- legacy public slug; rename tracked separately, requires 308 + re-index
        name: 'Governed Payroll Runs',
      },
      { slug: 'strategic-advisory', name: 'Strategic Advisory' },
    ],
  },

  'workforce-analytics': {
    slug: 'workforce-analytics',
    name: 'Workforce Analytics',
    headline: 'Labor costs, overtime exposure, and headcount trends — connected.',
    subheadline: 'Real-time visibility into the compliance and cost drivers that matter before they appear in a quarterly review.',
    metaDescription: 'PSE workforce analytics vision for multi-state employers: connected labor cost views, overtime exposure, and recurring exception patterns.',
    body: 'PSE\'s workforce analytics vision gives payroll directors a connected view of overtime trends, headcount, labor cost variance, and recurring compliance exceptions. Designed to bring information together across authorized systems, the analytics layer supports proactive review without replacing payroll expertise.',
    features: [
      { title: 'Live labor cost dashboards', body: 'Real-time labor cost tracking by department, location, and entity. Variance alerts when actual costs diverge from budget.' },
      { title: 'Overtime exposure monitoring', body: 'Per-employee and per-department overtime tracking updated in real time as hours are recorded. Exposure flagged before it becomes a violation.' },
      { title: 'Multi-state headcount reporting', body: 'Headcount, FTE, and contractor counts by state — updated automatically as employees onboard, offboard, or change work locations.' },
      { title: 'Exception trend reporting', body: 'Recurring violation patterns surfaced by department, jurisdiction, and violation type — based on CHAP AI scan history. Identifies systemic issues before they compound across payroll cycles.' },
      { title: 'Custom reporting exports', body: 'Scheduled and on-demand exports in CSV, Excel, and PDF formats. Custom field selection for CFO, HR, and board reporting.' },
    ],
    stats: [
      { value: ENFORCEMENT_STATS.hrTimeOnPayroll.value, label: 'Of HR department time dedicated to payroll responsibilities', source: ENFORCEMENT_STATS.hrTimeOnPayroll.source },
      { value: ENFORCEMENT_STATS.hoursLostToCompliance.value, label: 'Lost per employer annually resolving payroll-related litigation and compliance issues', source: ENFORCEMENT_STATS.hoursLostToCompliance.source },
    ],
    chapAiConnection: 'The planned analytics layer connects CHAP AI exception history, overtime exposure, and compliance trends to governance dashboards when the underlying integrations and records are available.',
    related: [
      {
        slug: 'payroll-processing', // boundary-lint-allow: prohibited-execution-nominal -- legacy public slug; rename tracked separately, requires 308 + re-index
        name: 'Governed Payroll Runs',
      },
      { slug: 'benefits-integration', name: 'Benefits Reconciliation' },
    ],
  },

  'benefits-integration': {
    slug: 'benefits-integration',
    name: 'Benefits Reconciliation',
    headline: 'Benefits deduction reconciliation — audited against payroll records.',
    subheadline: 'PSE audits payroll deduction reports against benefit elections to identify discrepancies before they become compliance or employee relations issues.',
    metaDescription: 'Benefits deduction reconciliation for payroll. PSE audits payroll deduction reports against benefit elections to identify over-deductions, missed elections, and plan code mismatches.',
    body: 'Benefits data lives in your HRIS or HCM system — PSE does not replace or drive that workflow. What PSE does is audit your payroll deduction reports against benefit elections to identify discrepancies: over-deductions, missed elections, and plan code mismatches that create compliance exposure and employee trust issues.',
    features: [
      { title: 'Deduction reconciliation audit', body: 'PSE audits payroll deduction reports against benefit elections — identifying over-deductions, under-deductions, missed enrollment updates, and plan code mismatches that create compliance or payroll exposure.' },
      { title: 'Discrepancy documentation', body: 'Every identified discrepancy is documented with the affected employee, deduction category, variance amount, and recommended correction — in an audit-ready format.' },
      { title: 'Payroll-benefits gap analysis', body: 'Structured review of the gap between what your benefits platform shows and what payroll is deducting — surfacing systemic issues that recur across pay cycles.' },
      { title: 'Action plan delivery', body: 'Reconciliation findings are delivered as a structured action plan with prioritized corrections, documentation for employee communication, and guidance on preventing recurrence.' },
    ],
    stats: [
      { value: ENFORCEMENT_STATS.perErrorCost.value, label: 'Average cost per payroll error — deduction discrepancies compound across every pay cycle they go undetected', source: ENFORCEMENT_STATS.perErrorCost.source },
    ],
    chapAiConnection: 'The envisioned CHAP AI evidence layer provides traceable payroll-side review context for benefits deduction reconciliation alongside authorized HRIS records.',
    related: [
      {
        slug: 'payroll-processing', // boundary-lint-allow: prohibited-execution-nominal -- legacy public slug; rename tracked separately, requires 308 + re-index
        name: 'Governed Payroll Runs',
      },
      { slug: 'system-integration', name: 'System Integration' },
    ],
  },

  'system-integration': {
    slug: 'system-integration',
    name: 'System Integration',
    headline: 'Connect payroll to your HRIS and workforce management platforms.',
    subheadline: 'Designed for interoperability with UKG, ADP, Dayforce, and other payroll and HR systems.',
    metaDescription: 'Explore the PSE system integration vision: governed interoperability with UKG, ADP, Dayforce, HRIS platforms, and custom APIs.',
    body: 'PSE is designed to connect independent payroll governance with authorized HRIS and workforce management environments. Its integration roadmap includes provider connectors, APIs, and governed data exchange that surface source-system exceptions for human review. Availability depends on connector development, testing, and customer authorization.',
    features: [
      { title: 'UKG, ADP, Dayforce connectors', body: 'The integration roadmap targets commonly used enterprise payroll and workforce platforms, subject to provider access and implementation validation.' },
      { title: 'Custom REST API', body: 'Full REST API for proprietary HRIS systems, internal tools, and custom workflows. Webhook support for real-time event-driven sync.' },
      { title: 'Bi-directional data sync', body: 'Payroll inputs flow in from HRIS. Validated outputs — pay stubs, tax documents, compliance records — flow back. Both directions are logged.' },
      { title: 'Inbound data validation', body: 'All data received from connected systems passes through CHAP AI validation at the integration boundary. Classification errors, missing fields, and rate inconsistencies are flagged before they enter payroll.' },
      { title: 'Integration audit logging', body: 'Every data exchange is logged with timestamp, source system, record count, and validation result. Accessible for compliance audits and integration troubleshooting.' },
    ],
    stats: [
      { value: ENFORCEMENT_STATS.payrollTechChallenges.value, label: 'Of companies encounter challenges with their payroll technologies', source: ENFORCEMENT_STATS.payrollTechChallenges.source },
      { value: ENFORCEMENT_STATS.reconciliationOverhead.value, label: 'Of payroll teams spend 30+ hours weekly reconciling payroll and HR data', source: ENFORCEMENT_STATS.reconciliationOverhead.source },
    ],
    chapAiConnection: 'The planned integration-boundary workflow checks configured source data, flags potential exceptions, and routes findings for human review before downstream payroll processing.',
    related: [
      {
        slug: 'payroll-processing', // boundary-lint-allow: prohibited-execution-nominal -- legacy public slug; rename tracked separately, requires 308 + re-index
        name: 'Governed Payroll Runs',
      },
      { slug: 'benefits-integration', name: 'Benefits Reconciliation' },
    ],
  },

  'strategic-advisory': {
    slug: 'strategic-advisory',
    name: 'Strategic Advisory',
    headline: 'Payroll structure optimization and compliance strategy.',
    subheadline: 'Advisory backed by the same statutory framework that powers CHAP AI — not generic HR consulting.',
    metaDescription: 'Strategic payroll advisory for multi-state employers. Entity structure optimization, multi-state expansion planning, compliance gap assessments, and audit preparation.',
    body: 'PSE advisory focuses on high-stakes payroll decisions, including multi-state expansion, entity structure, compensation review, and audit preparation. Recommendations can be supported by statutory references and documented professional review. The future CHAP AI evidence layer is designed to connect those decisions to broader governance workflows.',
    features: [
      { title: 'Multi-state expansion planning', body: 'Before establishing operations in a new state, PSE maps the full payroll compliance implications: applicable wage laws, deposit requirements, local tax obligations, and benefit mandates.' },
      { title: 'Entity structure optimization', body: 'For multi-entity organizations, PSE reviews payroll structure across entities for efficiency, compliance exposure, and consolidation opportunities.' },
      { title: 'Compensation strategy review', body: 'Review of compensation structures for FLSA classification accuracy, overtime exposure, and multi-state minimum wage compliance.' },
      { title: 'Compliance gap assessments', body: 'Structured review of current payroll operations against applicable statutory requirements. Findings documented with statute citations and remediation priority.' },
      { title: 'Audit preparation support', body: 'Pre-audit documentation review, record organization, and response preparation for IRS, DOL, and state agency inquiries.' },
    ],
    stats: [
      { value: `${ENFORCEMENT_STATS.dolBackWages.fiscalYear}: ${ENFORCEMENT_STATS.dolBackWages.value}`, label: 'In DOL WHD back wages recovered from employers — the exposure PSE advisory helps prevent', source: ENFORCEMENT_STATS.dolBackWages.source },
      { value: ENFORCEMENT_STATS.payrollLitigationRate.value, label: 'Of businesses faced compliance litigation related to payroll errors in a 12-month period', source: ENFORCEMENT_STATS.payrollLitigationRate.source },
    ],
    chapAiConnection: 'Advisory engagements use CHAP AI scan history as the baseline for compliance gap assessments. Findings reference the same statutory framework — FLSA, IRC, state labor codes — that powers the CHAP AI ruleset.',
    related: [
      { slug: 'tax-compliance', name: 'Tax & Compliance' },
      {
        slug: 'payroll-processing', // boundary-lint-allow: prohibited-execution-nominal -- legacy public slug; rename tracked separately, requires 308 + re-index
        name: 'Governed Payroll Runs',
      },
    ],
  },

};

export const SERVICE_SLUGS = Object.keys(serviceData);
