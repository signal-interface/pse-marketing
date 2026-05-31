import {
  BENCHMARKS,
  INDUSTRY_RISK_MULTIPLIERS,
  STATE_COMPLEXITY_MULTIPLIERS,
  PAYROLL_RUNS_PER_YEAR,
  type IndustryKey,
} from '@/data/estimatorConstants';

export interface EstimatorInputs {
  employees: number;       // 1–10000
  states: number;          // 1–50
  industry: IndustryKey;
  payrollRunsPerYear?: number; // defaults to 26
}

export interface EstimatorOutputs {
  // Annual deposit penalty exposure
  depositPenaltyExposure: number;

  // Annual wage & hour back-pay exposure
  wageHourExposure: number;

  // Annual compliance staff time cost
  complianceTimeCost: number;

  // Annual payroll error correction cost
  errorCorrectionCost: number;

  // Total estimated annual exposure
  totalAnnualExposure: number;

  // Inputs echoed for display
  inputs: EstimatorInputs;

  // Source citations for display
  sources: string[];
}

function getStateMultiplier(states: number): number {
  if (states <= 10) {
    return STATE_COMPLEXITY_MULTIPLIERS[states] ?? 1.0;
  }
  return Math.min(1.90 + (states - 10) * 0.04, 2.5);
}

export function calculateExposure(inputs: EstimatorInputs): EstimatorOutputs {
  const {
    employees,
    states,
    industry,
    payrollRunsPerYear = PAYROLL_RUNS_PER_YEAR,
  } = inputs;

  const industryMult = INDUSTRY_RISK_MULTIPLIERS[industry] ?? 1.0;
  const stateMult = getStateMultiplier(states);

  // 1. Deposit penalty exposure
  // Base: 33% of employers make errors. Of those, penalty exposure
  // averages 5% of one deposit (mid-tier IRC §6656 rate).
  // Estimated quarterly deposit = employees × $1,500 avg payroll ÷ 4
  const estimatedQuarterlyDeposit = employees * 1500 / 4;
  const depositPenaltyExposure = Math.round(
    estimatedQuarterlyDeposit *
    0.05 * // mid-tier §6656 rate
    BENCHMARKS.EMPLOYER_ERROR_RATE *
    stateMult *
    industryMult
  );

  // 2. Wage & hour exposure
  // DOL FY2023: $1,296 avg back wages per affected employee
  // Applied to error rate × industry risk
  const wageHourExposure = Math.round(
    employees *
    BENCHMARKS.DOL_BACK_WAGE_PER_EMPLOYEE *
    BENCHMARKS.EMPLOYER_ERROR_RATE *
    industryMult *
    stateMult *
    0.25 // probability of investigation given error rate
  );

  // 3. Compliance staff time cost
  // EY: 120 hrs/yr per employer. Scales with employee count and states.
  // Cost = hours × payroll staff hourly rate
  const scaledHours = BENCHMARKS.ANNUAL_COMPLIANCE_HOURS *
    Math.log10(Math.max(employees, 10)) *
    (1 + (states - 1) * 0.08);
  const complianceTimeCost = Math.round(
    scaledHours * BENCHMARKS.PAYROLL_STAFF_HOURLY_RATE
  );

  // 4. Error correction cost
  // EY: 15 errors/run × $291/error × runs/year × error rate
  const errorCorrectionCost = Math.round(
    BENCHMARKS.ERRORS_PER_PAYROLL_RUN *
    BENCHMARKS.COST_PER_ERROR *
    payrollRunsPerYear *
    BENCHMARKS.EMPLOYER_ERROR_RATE *
    (employees / 100) // scales with headcount
  );

  const totalAnnualExposure =
    depositPenaltyExposure +
    wageHourExposure +
    complianceTimeCost +
    errorCorrectionCost;

  return {
    depositPenaltyExposure,
    wageHourExposure,
    complianceTimeCost,
    errorCorrectionCost,
    totalAnnualExposure,
    inputs,
    sources: [
      'IRC §6656(b)(1); IRS Notice 746 (Rev. 12-2024)',
      'DOL WHD FY2023 Statistical Release',
      'Ernst & Young Global Payroll Operations Survey, 2024',
      'IRS employer compliance study; EY Payroll Operations Survey, 2024',
      'BLS Occupational Employment Statistics, 2024',
    ],
  };
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${Math.round(value / 1_000).toLocaleString()}K`;
  }
  return `$${value.toLocaleString()}`;
}
