'use client';

import { useEffect, useRef, useState } from 'react';

interface MetricCardProps {
  source: string;
  target: number;
  prefix?: string;
  suffix: string;
  label: string;
  description: string;
  citation: string;
}

function MetricCard({ source, target, prefix = '', suffix, label, description, citation }: MetricCardProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || animated.current) return;
      animated.current = true;
      const duration = 1100;
      const start = performance.now();
      const isDecimal = target % 1 !== 0;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(parseFloat((target * eased).toFixed(isDecimal ? 1 : 0)));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.disconnect();
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  const display = target % 1 !== 0 ? value.toFixed(1) : Math.round(value).toString();

  return (
    <div className="pse-metric-card" ref={ref}>
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
    source: 'IRC §6656',
    target: 15,
    suffix: '%',
    label: 'Maximum deposit penalty rate',
    description: 'The IRS four-tier penalty escalates from 2% for deposits 1–5 days late to 15% after the first IRS delinquency notice. One missed semi-weekly deposit on a $500K payroll costs up to $75,000.',
    citation: 'Source: IRC §6656(b)(1); IRS Notice 746 (Rev. 12-2024)',
  },
  {
    source: 'IRS / EY',
    target: 33,
    suffix: '%',
    label: 'Of employers make payroll errors',
    description: '1 in 3 businesses has an active payroll error in any given period. EY research finds the average employer makes 15 corrections per payroll run at $291 per correction.',
    citation: 'Source: IRS employer compliance study; EY Payroll Operations Survey, 2024',
  },
  {
    source: 'DOL WHD FY2024',
    target: 150,
    prefix: '$',
    suffix: 'M',
    label: 'Recovered by DOL in FY2024 alone',
    description: 'The DOL Wage & Hour Division recovered $149.9M in FLSA back wages for 125,000+ workers in FY2024 — $127M from overtime violations. Civil penalties up 100%+ since FY2014.',
    citation: 'Source: DOL WHD FY2024 Statistical Release; HRMorning, Jan 2025',
  },
  {
    source: 'PayrollOrg 2024',
    target: 63,
    suffix: '%',
    label: 'Of payroll teams cite compliance as #1 challenge',
    description: 'In the 2024 "Getting the World Paid" survey, 63% of payroll professionals named compliance as their single greatest challenge — above vendor management, integrations, and staffing.',
    citation: 'Source: PayrollOrg (PAYO) "Getting the World Paid" Survey, 2024',
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
