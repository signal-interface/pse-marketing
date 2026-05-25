'use client';

import { useEffect, useRef, useState } from 'react';
import { ENFORCEMENT_STATS } from '@/lib/stats';

interface MetricCardProps {
  source: string;
  target: number;
  prefix?: string;
  suffix: string;
  label: string;
  description: string;
  citation: string;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const formatValue = (value: number, target: number): string =>
  target % 1 !== 0 ? value.toFixed(1) : Math.round(value).toString();

function MetricCard({ source, target, prefix = '', suffix, label, description, citation }: MetricCardProps) {
  // Belt-and-suspenders: render the final value under SSR / no-JS / failed
  // hydration. The animation runs from `target - delta` -> `target` only
  // once the card scrolls into view, inside an IntersectionObserver.
  const [value, setValue] = useState(target);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animated.current) return;
        animated.current = true;

        const duration = 1100;
        const delta = target;
        const from = target - delta;
        const start = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const next = from + delta * eased;
          if (progress < 1) {
            setValue(parseFloat(next.toFixed(target % 1 !== 0 ? 1 : 0)));
            rafRef.current = requestAnimationFrame(tick);
          } else {
            // Pin the exact target on completion so the displayed number
            // matches the source data, not the easing approximation.
            setValue(target);
            rafRef.current = null;
          }
        };

        rafRef.current = requestAnimationFrame(tick);
        obs.disconnect();
      },
      { threshold: 0.4 }
    );

    obs.observe(el);

    return () => {
      obs.disconnect();
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [target]);

  return (
    <div className="pse-metric-card" ref={ref}>
      <span className="pse-metric-source">{source}</span>
      <div className="pse-metric-number">{prefix}{formatValue(value, target)}{suffix}</div>
      <div className="pse-metric-label">{label}</div>
      <div className="pse-metric-desc">{description}</div>
      <div className="pse-metric-citation">{citation}</div>
    </div>
  );
}

const metrics: MetricCardProps[] = [
  {
    source: ENFORCEMENT_STATS.irsMaxDepositPenalty.source.split(';')[0].trim(),
    target: ENFORCEMENT_STATS.irsMaxDepositPenalty.amount,
    suffix: '%',
    label: 'Maximum deposit penalty rate',
    description: 'The IRS four-tier penalty escalates from 2% for deposits 1–5 days late to 15% after the first IRS delinquency notice. One missed semi-weekly deposit on a $500K payroll costs up to $75,000.',
    citation: `Source: ${ENFORCEMENT_STATS.irsMaxDepositPenalty.source}`,
  },
  {
    source: 'IRS / EY',
    target: ENFORCEMENT_STATS.irsEmployerErrors.amount,
    suffix: '%',
    label: 'Of employers make payroll errors',
    description: '1 in 3 businesses has an active payroll error in any given period. EY research finds the average employer makes 15 corrections per payroll run at $291 per correction.',
    citation: `Source: ${ENFORCEMENT_STATS.irsEmployerErrors.source}`,
  },
  {
    source: `DOL WHD ${ENFORCEMENT_STATS.dolBackWages.fiscalYear}`,
    target: ENFORCEMENT_STATS.dolBackWages.amount,
    prefix: '$',
    suffix: 'M',
    label: `Recovered by DOL in ${ENFORCEMENT_STATS.dolBackWages.fiscalYear} alone`,
    description: `The DOL Wage & Hour Division recovered $${ENFORCEMENT_STATS.dolBackWages.amount}M in FLSA back wages for ${ENFORCEMENT_STATS.dolBackWages.workersAffected} workers in ${ENFORCEMENT_STATS.dolBackWages.fiscalYear} — $127M from overtime violations. Civil penalties up 100%+ since FY2014.`,
    citation: `Source: ${ENFORCEMENT_STATS.dolBackWages.source}; HRMorning, Jan 2025`,
  },
  {
    source: 'PayrollOrg 2024',
    target: ENFORCEMENT_STATS.payrollComplianceTopChallenge.amount,
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
