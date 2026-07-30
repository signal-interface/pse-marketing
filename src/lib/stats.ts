// Single source of truth for enforcement / industry statistics displayed
// across the marketing site. Update here; consumers import from here.
//
// Display stats are standardized on FY2024. The Risk Estimator
// (`src/data/estimatorConstants.ts`, `src/lib/estimator.ts`,
// `src/lib/generateReport.ts`) is deliberately calibrated to FY2023
// inputs ($212M / 163,000 workers = $1,296 per affected employee) and is
// NOT migrated here — recalibrating that math changes every estimator
// output and PDF.

export interface SiteStat {
  /** Display string, fiscal-year stamped where applicable. */
  value: string;
  /** Numeric form for animations or recalculation. */
  amount: number;
  /** Optional FY label, surfaced separately so consumers can format. */
  fiscalYear?: string;
  /** Workers affected, where the figure is a back-wage total. */
  workersAffected?: string;
  /** Full citation including publisher and release. */
  source: string;
}

export const ENFORCEMENT_STATS = {
  dolBackWages: {
    value: '$149.9M',
    amount: 149.9,
    fiscalYear: 'FY2024',
    workersAffected: '125,000+',
    source: 'DOL WHD FY2024 Statistical Release',
  },
  irsMaxDepositPenalty: {
    value: '15%',
    amount: 15,
    source: 'IRC §6656(b)(1); IRS Notice 746 (Rev. 12-2024)',
  },
  // irsEmployerErrors (33% employer error rate) STRUCK 2026-07-30: the
  // "IRS employer compliance study" citation has no locatable primary
  // publication. Do not reintroduce without a checkable source of record.
  payrollComplianceTopChallenge: {
    value: '63%',
    amount: 63,
    source: 'PayrollOrg "Getting the World Paid" Survey, 2024',
  },
  hrTimeOnPayroll: {
    value: '35%',
    amount: 35,
    source: 'OnePoint Research',
  },
  payrollTechChallenges: {
    value: '85%',
    amount: 85,
    source: 'Ceridian/APA/GPMI Payroll Technology Survey',
  },
  // Lano's aggregation: 29 hrs litigation + 91 hrs compliance = 120 hrs/yr.
  // Attributed to the source of record actually read, not laundered
  // through to EY (2026-07-30 ruling).
  hoursLostToCompliance: {
    value: '120 hrs',
    amount: 120,
    source: 'Reported by Lano, citing EY Global Payroll Operations Survey, 2024',
  },
  payrollLitigationRate: {
    value: '14%',
    amount: 14,
    source: 'Ernst & Young Global Payroll Operations Survey, 2024',
  },
  reconciliationOverhead: {
    value: '22%',
    amount: 22,
    source: 'ADP, 2023',
  },
  perErrorCost: {
    value: '$291',
    amount: 291,
    source: 'Ernst & Young Global Payroll Operations Survey, 2022',
  },
} as const satisfies Record<string, SiteStat>;
