import { ENFORCEMENT_STATS } from '@/lib/stats';

interface MetricCardProps {
  source: string;
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  description: string;
  citation: string;
}

function MetricCard({ source, value, prefix = '', suffix, label, description, citation }: MetricCardProps) {
  const display = value % 1 !== 0 ? value.toFixed(1) : value.toString();
  return (
    <div className="pse-metric-card">
      <span className="pse-metric-source">{source}</span>
      <div className="pse-metric-number">{prefix}{display}{suffix}</div>
      <div className="pse-metric-label">{label}</div>
      <div className="pse-metric-desc">{description}</div>
      <div className="pse-metric-citation">{citation}</div>
    </div>
  );
}

const metrics: MetricCardProps[] = [
  {
    source: ENFORCEMENT_STATS.irsMaxDepositPenalty.source.split(';')[0].trim(),
    value: ENFORCEMENT_STATS.irsMaxDepositPenalty.amount,
    suffix: '%',
    label: 'Maximum deposit penalty rate',
    description: 'The IRS four-tier penalty escalates from 2% for deposits 1–5 days late to 15% after the first IRS delinquency notice. One missed semi-weekly deposit on a $500K payroll costs up to $75,000.',
    citation: `Source: ${ENFORCEMENT_STATS.irsMaxDepositPenalty.source}`,
  },
  {
    source: 'IRS / EY',
    value: ENFORCEMENT_STATS.irsEmployerErrors.amount,
    suffix: '%',
    label: 'Of employers make payroll errors',
    description: '1 in 3 businesses has an active payroll error in any given period. EY research finds the average employer makes 15 corrections per payroll run at $291 per correction.',
    citation: `Source: ${ENFORCEMENT_STATS.irsEmployerErrors.source}`,
  },
  {
    source: `DOL WHD ${ENFORCEMENT_STATS.dolBackWages.fiscalYear}`,
    value: ENFORCEMENT_STATS.dolBackWages.amount,
    prefix: '$',
    suffix: 'M',
    label: `Recovered by DOL in ${ENFORCEMENT_STATS.dolBackWages.fiscalYear} alone`,
    description: `The DOL Wage & Hour Division recovered $${ENFORCEMENT_STATS.dolBackWages.amount}M in FLSA back wages for ${ENFORCEMENT_STATS.dolBackWages.workersAffected} workers in ${ENFORCEMENT_STATS.dolBackWages.fiscalYear} — $127M from overtime violations. Civil penalties up 100%+ since FY2014.`,
    citation: `Source: ${ENFORCEMENT_STATS.dolBackWages.source}; HRMorning, Jan 2025`,
  },
  {
    source: 'PayrollOrg 2024',
    value: ENFORCEMENT_STATS.payrollComplianceTopChallenge.amount,
    suffix: '%',
    label: 'Of payroll teams cite compliance as #1 challenge',
    description: 'In the 2024 "Getting the World Paid" survey, 63% of payroll professionals named compliance as their single greatest challenge — above vendor management, integrations, and staffing.',
    citation: `Source: ${ENFORCEMENT_STATS.payrollComplianceTopChallenge.source}`,
  },
];

export function BenchmarkMetrics() {
  return (
    <section id="proof" className="pse-metrics-section" aria-label="Industry compliance exposure data">
      <div className="pse-metrics-inner">
        <div className="pse-metrics-header">
          <p className="pse-metrics-eyebrow">Industry exposure data</p>
          <h2 className="pse-metrics-headline">The compliance risk your payroll process is already carrying</h2>
          <p className="pse-metrics-subline">Numbers from IRS enforcement data, DOL WHD, and EY payroll research — not estimates.</p>
        </div>
        <div className="pse-metrics-grid">
          {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
        </div>
        <p className="pse-metrics-disclaimer">
          All statistics reflect publicly available enforcement data and third-party payroll research.
          Sources available on request. PSE uses these benchmarks to calibrate CHAP AI detection thresholds — not as guaranteed customer outcomes.
        </p>
      </div>
    </section>
  );
}
