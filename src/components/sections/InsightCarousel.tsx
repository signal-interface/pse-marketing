'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Slide {
  stat: string;
  statSuffix: string;
  headline: string;
  body: string;
  sourceBadge: string;
  sourceText: string;
  points: string[];
}

const slides: Slide[] = [
  {
    stat: '15', statSuffix: '%',
    headline: 'The penalty rate on an unpaid deposit once the IRS sends its first notice',
    body: 'Under IRC §6656, a four-tier escalation means a single late deposit moves from a 2% nuisance to a 15% penalty without a single late payroll to employees. The error is invisible until the IRS notice arrives, typically 60–90 days after the pay period.',
    sourceBadge: 'IRS IRC §6656',
    sourceText: 'IRS Notice 746 (Rev. 12-2024) · IRS Internal Revenue Manual 20.1.4',
    points: [
      'Pre-run deposit schedule validation against your pay frequency and liability thresholds before payroll commits',
      'Automatic detection of semi-weekly vs. monthly depositor status mismatches — the most common §6656 trigger',
      'Audit-ready deposit schedule documentation generated automatically for each pay period',
    ],
  },
  {
    stat: '$1,296', statSuffix: ' avg',
    headline: 'Back wages per affected employee recovered by DOL WHD in FY2023',
    body: 'In FY2023, the DOL Wage & Hour Division recovered $212M in back wages across 163,000 workers. For a 500-person employer that\'s a potential $648,000 exposure per investigation cycle. Overtime miscalculation and split-shift violations remain the leading triggers.',
    sourceBadge: 'DOL WHD FY2023',
    sourceText: 'DOL FY2023 Statistical Release · Bitner Henry Insurance Group, 2024',
    points: [
      'Real-time FLSA §207 overtime calculation validation against actual hours worked — not just entered hours',
      'Split-shift and meal-break violation detection aligned to applicable state IWC orders before payroll runs',
      'Three-year audit trail of all wage decisions accessible for any WHD investigation',
    ],
  },
  {
    stat: '120', statSuffix: ' hrs/yr',
    headline: 'Lost to payroll compliance issue resolution per employer, per year',
    body: 'EY research found companies spend an average of 29 hours resolving litigation and 91 hours managing compliance issues annually. Separately, 14% of businesses faced compliance litigation related to payroll errors in the prior 12 months.',
    sourceBadge: 'EY Payroll Survey',
    sourceText: 'Ernst & Young Global Payroll Operations Survey · via Lano, 2024',
    points: [
      'Every flag includes the specific statute, plain-language explanation, and recommended correction — eliminating research time',
      'Pre-run detection means issues resolve before payroll commits, not after a notice or audit request',
      'Automated documentation produces audit-ready records on demand with zero additional effort',
    ],
  },
];

export function InsightCarousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchX = useRef(0);
  const total = slides.length;

  const go = useCallback((n: number) => setCurrent(((n % total) + total) % total), [total]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % total), 7000);
  }, [total]);

  useEffect(() => { resetTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [resetTimer]);

  return (
    <section className="pse-insights-section" aria-label="Compliance intelligence">
      <div className="pse-insights-inner">
        <div className="pse-insights-header">
          <div>
            <p className="pse-insights-eyebrow">Compliance intelligence</p>
            <h2 className="pse-insights-headline">What the enforcement data tells payroll teams</h2>
            <blockquote className="pse-pull-quote">
              &ldquo;Your payroll vendor processes transactions. It does not tell you whether those transactions are legally correct. That is the gap PSE closes.&rdquo;
            </blockquote>
          </div>
          <div className="pse-carousel-controls" role="group" aria-label="Carousel navigation">
            <div className="pse-carousel-dots">
              {slides.map((_, i) => (
                <button key={i} className={`pse-carousel-dot${i === current ? ' active' : ''}`} aria-label={`Slide ${i + 1}`} onClick={() => { go(i); resetTimer(); }} />
              ))}
            </div>
            <button className="pse-carousel-btn" aria-label="Previous" onClick={() => { go(current - 1); resetTimer(); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button className="pse-carousel-btn" aria-label="Next" onClick={() => { go(current + 1); resetTimer(); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
        <div className="pse-carousel-viewport" onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }} onTouchEnd={(e) => { const dx = e.changedTouches[0].clientX - touchX.current; if (Math.abs(dx) > 40) { go(current + (dx < 0 ? 1 : -1)); resetTimer(); } }}>
          <div className="pse-carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
            {slides.map((slide, i) => (
              <div key={i} className="pse-insight-slide" role="group" aria-label={`Slide ${i + 1} of ${total}`}>
                <div className="pse-insight-card">
                  <div className="pse-insight-left">
                    <div className="pse-insight-stat">{slide.stat}<span>{slide.statSuffix}</span></div>
                    <h3 className="pse-insight-headline">{slide.headline}</h3>
                    <p className="pse-insight-body">{slide.body}</p>
                    <div className="pse-insight-source-line">
                      <span className="pse-insight-source-badge">{slide.sourceBadge}</span>
                      <span className="pse-insight-source-text">{slide.sourceText}</span>
                    </div>
                  </div>
                  <div className="pse-insight-right">
                    <div className="pse-insight-right-label">How CHAP AI addresses this</div>
                    <ul className="pse-insight-points">
                      {slide.points.map((point, j) => <li key={j}>{point}</li>)}
                    </ul>
                    <a href="/compliance-risk" className="pse-insight-cta">
                      Estimate your exposure
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
