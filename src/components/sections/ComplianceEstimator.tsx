'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  calculateExposure,
  formatCurrency,
  type EstimatorInputs,
  type EstimatorOutputs,
} from '@/lib/estimator';
import type { IndustryKey } from '@/data/estimatorConstants';

const INDUSTRIES: { value: IndustryKey; label: string }[] = [
  { value: 'healthcare',     label: 'Healthcare' },
  { value: 'transportation', label: 'Transportation & Logistics' },
  { value: 'retail',         label: 'Retail & Hospitality' },
  { value: 'manufacturing',  label: 'Manufacturing' },
  { value: 'staffing',       label: 'Staffing & Workforce' },
  { value: 'financial',      label: 'Financial Services' },
  { value: 'real_estate',    label: 'Real Estate & Property' },
  { value: 'other',          label: 'Other' },
];

const DEFAULT_INPUTS: EstimatorInputs = {
  employees: 250,
  states: 3,
  industry: 'other',
  payrollRunsPerYear: 26,
};

export function ComplianceEstimator() {
  const [showResults, setShowResults] = useState(false);
  const [inputs, setInputs] = useState<EstimatorInputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<EstimatorOutputs | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleCalculate = () => {
    const output = calculateExposure(inputs);
    setResults(output);
    setShowResults(true);
    setTimeout(() => {
      document.getElementById('estimator-results')?.scrollIntoView({
        behavior: 'smooth', block: 'start'
      });
    }, 100);
  };

  const handleDownload = async () => {
    if (!results) return;
    setDownloading(true);
    try {
      const { generateComplianceReport } = await import('@/lib/generateReport');
      await generateComplianceReport(results);
      setDownloaded(true);
    } catch (err) {
      console.error('[PDF generation error]', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="est-wrapper">

      {/* Input panel */}
      <div className="est-inputs">
        <p className="est-inputs__label">Your organization</p>

        <div className="est-field">
          <label className="est-field__label">
            Employees
            <span className="est-field__value">{inputs.employees.toLocaleString()}</span>
          </label>
          <input
            type="range"
            min={10} max={5000} step={10}
            value={inputs.employees}
            onChange={e => setInputs(p => ({ ...p, employees: +e.target.value }))}
            className="est-slider"
          />
          <div className="est-slider__ticks">
            <span>10</span><span>1,000</span><span>5,000</span>
          </div>
        </div>

        <div className="est-field">
          <label className="est-field__label">
            States
            <span className="est-field__value">{inputs.states}</span>
          </label>
          <input
            type="range"
            min={1} max={20} step={1}
            value={inputs.states}
            onChange={e => setInputs(p => ({ ...p, states: +e.target.value }))}
            className="est-slider"
          />
          <div className="est-slider__ticks">
            <span>1</span><span>10</span><span>20+</span>
          </div>
        </div>

        <div className="est-field">
          <label className="est-field__label">Industry</label>
          <select
            value={inputs.industry}
            onChange={e => setInputs(p => ({
              ...p, industry: e.target.value as IndustryKey
            }))}
            className="est-select"
          >
            {INDUSTRIES.map(i => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
        </div>

        <button className="est-calculate-btn" onClick={handleCalculate}>
          Calculate my exposure
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            width="14" height="14">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>

        <p className="est-inputs__note">
          No email required to see your results.
        </p>
      </div>

      {/* Results panel */}
      {showResults && results && (
        <div className="est-results" id="estimator-results">

          <div className="est-results__header">
            <p className="est-results__eyebrow">Estimated annual exposure</p>
            <div className="est-results__total">
              {formatCurrency(results.totalAnnualExposure)}
            </div>
            <p className="est-results__total-label">
              for a {results.inputs.employees.toLocaleString()}-employee
              {' '}{INDUSTRIES.find(i => i.value === results.inputs.industry)?.label ?? ''}{' '}
              employer across {results.inputs.states} state{results.inputs.states !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="est-breakdown">
            <div className="est-breakdown__row">
              <div className="est-breakdown__label">
                <span className="est-breakdown__name">Deposit penalty exposure</span>
                <span className="est-breakdown__source">IRC §6656</span>
              </div>
              <span className="est-breakdown__value">
                {formatCurrency(results.depositPenaltyExposure)}
              </span>
            </div>
            <div className="est-breakdown__row">
              <div className="est-breakdown__label">
                <span className="est-breakdown__name">Wage &amp; hour back-pay exposure</span>
                <span className="est-breakdown__source">DOL WHD FY2023</span>
              </div>
              <span className="est-breakdown__value">
                {formatCurrency(results.wageHourExposure)}
              </span>
            </div>
            <div className="est-breakdown__row">
              <div className="est-breakdown__label">
                <span className="est-breakdown__name">Compliance staff time cost</span>
                <span className="est-breakdown__source">EY 2024</span>
              </div>
              <span className="est-breakdown__value">
                {formatCurrency(results.complianceTimeCost)}
              </span>
            </div>
            <div className="est-breakdown__row est-breakdown__row--last">
              <div className="est-breakdown__label">
                <span className="est-breakdown__name">Error correction cost</span>
                <span className="est-breakdown__source">EY / IRS</span>
              </div>
              <span className="est-breakdown__value">
                {formatCurrency(results.errorCorrectionCost)}
              </span>
            </div>
          </div>

          {/* PDF Download */}
          <div className="est-download">
            <button
              className="est-download__btn"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <>Generating PDF...</>
              ) : downloaded ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    width="14" height="14">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Report downloaded
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    width="14" height="14">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download full report (PDF)
                </>
              )}
            </button>
            <p className="est-download__note">
              Includes methodology, source citations, and breakdown by exposure category.
              No email required.
            </p>
          </div>

          {/* Soft ask — only shown after download */}
          {downloaded && (
            <div className="est-soft-ask">
              <p className="est-soft-ask__text">
                Want PSE to walk through this with you?
              </p>
              <Link href="/#demo" className="est-soft-ask__link">
                Request a 30-minute demo &rarr;
              </Link>
            </div>
          )}

          <div className="est-disclaimer">
            Estimates use industry benchmark data — not PSE client outcomes.
            Actual exposure varies by payroll structure, error history,
            and jurisdiction. Sources: {results.sources.join(' · ')}
          </div>

          <button
            className="est-recalculate"
            onClick={() => { setShowResults(false); setResults(null); setDownloaded(false); }}
          >
            Recalculate
          </button>

        </div>
      )}
    </div>
  );
}
