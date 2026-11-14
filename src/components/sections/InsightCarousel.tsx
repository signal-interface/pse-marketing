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
    headline: 'Maximum federal deposit penalty rate after qualifying IRS notice conditions',
    body: 'IRC §6656 provides deposit penalty tiers of 2%, 5%, and 10% based on lateness. The 15% rate applies if an amount remains unpaid more than 10 days after the first notice requesting payment, or upon qualifying notice and demand for immediate payment, whichever is earlier. Penalty tiers are not additive.',
    sourceBadge: 'IRS FTD penalty guidance',
    sourceText: 'IRS Failure to Deposit Penalty · IRC §6656 (irs.gov/payments/failure-to-deposit-penalty)',
    points: [
      'The envisioned governance workflow assesses deposit schedules and liability indicators ahead of payroll close',
      'Planned detection of deposit schedule mismatches for practitioner review',
      'Proposed evidence capture for deposit schedule reviews and follow-up decisions',
    ],
  },
  {
    stat: '$259M+', statSuffix: '',
    headline: 'Back wages recovered nationwide by DOL WHD in FY2025',
    body: 'The U.S. Department of Labor reported more than $259 million in back wages recovered for nearly 177,000 workers in fiscal year 2025. This is nationwide historical enforcement activity, not a prediction of any employer\'s potential liability.',
    sourceBadge: 'DOL WHD FY2025',
    sourceText: 'U.S. Department of Labor · WHD announcement, January 8, 2026',
    points: [
      'Envisioned comparison of overtime calculations against authorized time and pay records',
      'Planned review of jurisdiction-specific wage and scheduling exceptions where applicable',
      'Traceable records of reviewed wage decisions, with retention and access governed by an approved evidence policy',
    ],
  },
  {
    stat: '91', statSuffix: ' hrs',
    headline: 'Average time spent settling a regulatory or compliance issue among affected companies',
    body: 'An EY study commissioned by Paycom reported that surveyed companies experiencing regulatory or compliance issues spent an average of 91 hours settling an issue. This is an affected-company issue-resolution measure, not an annual average across all employers.',
    sourceBadge: 'EY study (2022)',
    sourceText: 'EY, Cost and Risks Due to Payroll Errors (2022), commissioned by Paycom',
    points: [
      'The PSE vision connects flagged issues with supporting authorities, explanations, and suggested next steps to reduce repetitive research',
      'Pre-close exception review is designed to surface issues earlier, when payroll teams can still assess and address them',
      'Structured evidence generation is designed to reduce manual documentation and support audit preparation',
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
              &ldquo;Payroll teams already validate outcomes. PSE is building the independent governance layer that connects those checks, decisions, and supporting evidence.&rdquo;
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
                    <div className="pse-insight-right-label">How the PSE platform is designed to address this</div>
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
