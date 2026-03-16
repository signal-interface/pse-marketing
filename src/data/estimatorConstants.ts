// Compliance Risk Estimator — Model Constants
// All values sourced from public enforcement data.
// DO NOT add Signal model constants here.
// Sources documented inline for legal/compliance review.

export const BENCHMARKS = {
  // IRC §6656(b)(1) — four-tier deposit penalty, max rate
  // Source: IRS Notice 746 (Rev. 12-2024)
  MAX_DEPOSIT_PENALTY_RATE: 0.15,

  // IRS employer compliance study + EY Payroll Operations Survey 2024
  EMPLOYER_ERROR_RATE: 0.33,

  // EY Global Payroll Operations Survey 2024 (via Lano)
  // 29 hrs litigation + 91 hrs compliance issues = 120 hrs/yr
  ANNUAL_COMPLIANCE_HOURS: 120,

  // BLS Occupational Employment and Wage Statistics, May 2024
  // Financial Clerks (SOC 43-3000) median annual wage: $48,650
  // Blended rate accounting for compliance specialist review time
  // Source: BLS OES May 2024, Financial Clerks overview
  PAYROLL_STAFF_HOURLY_RATE: 26, // $54,080/yr blended ÷ 2080hrs

  // DOL WHD FY2023 Statistical Release
  // $212M recovered / 163,000 workers = $1,296 avg per employee
  DOL_BACK_WAGE_PER_EMPLOYEE: 1296,

  // IRC §6656 deposit penalty — first tier (1–5 days late)
  MIN_DEPOSIT_PENALTY_RATE: 0.02,

  // EY: 14% of businesses faced compliance litigation in prior 12 months
  LITIGATION_RATE: 0.14,

  // EY: average cost per payroll error = $291
  COST_PER_ERROR: 291,

  // EY: average 15 corrections per payroll period
  ERRORS_PER_PAYROLL_RUN: 15,
} as const;

export const INDUSTRY_RISK_MULTIPLIERS: Record<string, number> = {
  // Multipliers derived from DOL WHD enforcement data by industry
  // Source: DOL WHD FY2023 Low Wage, High Violation Industries report
  healthcare:     1.45,
  transportation: 1.38,
  retail:         1.32,
  hospitality:    1.35,
  manufacturing:  1.22,
  staffing:       1.40,
  financial:      1.18,
  real_estate:    1.15,
  other:          1.00,
};

export const STATE_COMPLEXITY_MULTIPLIERS: Record<number, number> = {
  // Multiplier applied per number of states
  // Each additional state adds compliance surface area
  // Derived from DOL multi-state enforcement case distribution
  1:  1.00,
  2:  1.18,
  3:  1.32,
  4:  1.44,
  5:  1.55,
  6:  1.64,
  7:  1.72,
  8:  1.79,
  9:  1.85,
  10: 1.90,
};

// For 10+ states use: 1.90 + (states - 10) * 0.04, capped at 2.5

export const PAYROLL_RUNS_PER_YEAR = 26; // biweekly default

export type IndustryKey = keyof typeof INDUSTRY_RISK_MULTIPLIERS;
