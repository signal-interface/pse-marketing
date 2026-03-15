import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ChapaTerminal } from '@/components/sections/ChapaTerminal';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'CHAP AI — Pre-Run Compliance Engine | Payroll Synergy Experts',
  description: 'CHAP AI scans every payroll run against federal and state statutory requirements before commit. Catch violations, cite regulations, generate audit-ready records automatically.',
};

const steps = [
  {
    letter: 'D',
    name: 'Detect',
    headline: 'Scans every payroll input before commit',
    body: 'CHAP AI ingests timecard data, wage rates, deduction schedules, and benefit elections — then runs each record against the applicable federal and state statutory ruleset for your employee population.',
  },
  {
    letter: 'F',
    name: 'Flag',
    headline: 'Surfaces violations with severity and statute',
    body: 'Every violation is classified by severity (block, warn, info), assigned the specific regulation that triggered it (FLSA §207, CA Lab §512, IWC Order 4), and queued for resolution before the payroll run proceeds.',
  },
  {
    letter: 'E',
    name: 'Explain',
    headline: 'Plain-language rationale, not just error codes',
    body: "CHAP AI generates a human-readable explanation for every flag: what rule was violated, why the specific employee's record triggered it, what correction clears it, and what the exposure would have been if it ran.",
  },
  {
    letter: 'D',
    name: 'Document',
    headline: 'Audit-ready evidence generated automatically',
    body: 'Every scan produces a timestamped compliance record: what was checked, what passed, what was flagged, what was corrected, and by whom. Three years of records, searchable on demand.',
  },
];

const federalChecks = [
  { statute: 'FLSA §206', name: 'Federal minimum wage' },
  { statute: 'FLSA §207', name: 'Overtime (1.5x after 40hrs)' },
  { statute: 'IRC §6656', name: 'Deposit timing & amount' },
  { statute: 'IRC §6721', name: 'Information return accuracy' },
  { statute: 'IRC §6722', name: 'Payee statement compliance' },
  { statute: 'FMLA §825', name: 'Leave designation accuracy' },
  { statute: 'ACA §4980H', name: 'Employer mandate compliance' },
];

const stateChecks = [
  { state: 'CA', checks: ['Min wage (tiered)', 'Meal & rest breaks', 'Split-shift premium', 'Sick leave accrual', 'Pay stub requirements'] },
  { state: 'NY', checks: ['Wage notice', 'Spread of hours', 'Min wage (locality)', 'Paid family leave'] },
  { state: 'WA', checks: ['Min wage (2026 rate)', 'Paid sick leave', 'Long-term care'] },
  { state: '+45', checks: ['Additional states monitored — ask about coverage'] },
];

const proofStats = [
  {
    number: '1 in 3',
    label: 'employers has an active payroll error in any given period',
    source: 'IRS employer compliance study + EY Payroll Operations Survey, 2024',
  },
  {
    number: '$150M',
    label: 'recovered by DOL WHD in FY2024 — $127M from overtime violations alone',
    source: 'DOL WHD FY2024 Statistical Release',
  },
  {
    number: '120 hrs',
    label: 'lost per employer annually to compliance issue resolution',
    source: 'Ernst & Young Global Payroll Operations Survey, 2024',
  },
];

export default function ChapAIPage() {
  return (
    <div className="chap-page">
      <Navbar />
      <main>

        {/* Section 1 — Hero */}
        <section className="chap-hero">
          <div className="chap-hero__inner">
            <div className="chap-hero__content">
              <p className="chap-eyebrow">CHAP AI™</p>
              <h1 className="chap-hero__headline">
                Catch payroll violations<br />
                <em>before they become penalties.</em>
              </h1>
              <p className="chap-hero__sub">
                CHAP AI runs a full statutory compliance scan before every payroll commit —
                flagging violations, citing the exact regulation, and generating an audit-ready
                record. Automatically.
              </p>
              <div className="chap-hero__actions">
                <Link href="/#demo" className="chap-btn-primary">Request a Demo</Link>
                <a href="#how-it-works" className="chap-btn-ghost">See how it works</a>
              </div>
            </div>
            <div className="chap-hero__terminal">
              <ChapaTerminal />
            </div>
          </div>
        </section>

        {/* Section 2 — How It Works */}
        <section id="how-it-works" className="chap-section" style={{ background: 'var(--chap-bg, #060e18)' }}>
          <div className="chap-section__inner">
            <p className="chap-eyebrow">How it works</p>
            <h2 className="chap-section-headline">Four steps. Every payroll run.</h2>
            <p className="chap-section-sub">CHAP AI runs the full Detect → Flag → Explain → Document cycle before each payroll commits — not after.</p>
            <div className="chap-steps-grid">
              {steps.map((step, i) => (
                <div key={i} className="chap-step-card">
                  <div className="chap-step-letter">{step.letter}</div>
                  <div className="chap-step-name">{step.name}</div>
                  <div className="chap-step-headline">{step.headline}</div>
                  <p className="chap-step-body">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3 — Scan Output (standalone terminal) */}
        <section className="chap-section" style={{ background: 'var(--chap-bg-mid, #0a1628)' }}>
          <div className="chap-section__inner">
            <p className="chap-eyebrow">Live scan output</p>
            <h2 className="chap-section-headline">What a pre-run compliance scan looks like.</h2>
            <p className="chap-section-sub">Real statute codes. Real employee records. Real violation detection — before payroll commits.</p>
            <ChapaTerminal />
          </div>
        </section>

        {/* Section 4 — Coverage Matrix */}
        <section className="chap-section" style={{ background: 'var(--chap-bg, #060e18)' }}>
          <div className="chap-section__inner">
            <p className="chap-eyebrow">Coverage</p>
            <h2 className="chap-section-headline">What CHAP AI checks.</h2>
            <p className="chap-section-sub">Federal statutory checks on every run. State-specific rules applied per employee jurisdiction.</p>
            <div className="chap-coverage-grid">
              <div>
                <div className="chap-coverage-col-label">Federal</div>
                {federalChecks.map((c) => (
                  <div key={c.statute} className="chap-check-row">
                    <span className="chap-check-statute">{c.statute}</span>
                    <span className="chap-check-name">{c.name}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="chap-coverage-col-label">State</div>
                {stateChecks.map((s) => (
                  <div key={s.state} className="chap-state-row">
                    <div className="chap-state-name">{s.state}</div>
                    <div className="chap-state-checks">
                      {s.checks.map((c) => (
                        <span key={c} className="chap-state-tag">{c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 — CHAP Guard */}
        <section className="chap-guard-section">
          <div className="chap-guard__inner">
            <div className="chap-guard__badge">
              <span className="chap-badge-label">Live Today</span>
            </div>
            <h2>CHAP Guard — Compliance in your payroll system</h2>
            <p>
              CHAP Guard is a Chrome extension that brings CHAP AI directly into UKG, ADP,
              and other payroll platforms. Real-time compliance badges, inline violation alerts,
              and contextual statute explanations — without leaving your existing workflow.
            </p>
            <div className="chap-guard__platforms">
              <span className="chap-platform-badge">UKG</span>
              <span className="chap-platform-badge">ADP</span>
              <span className="chap-platform-badge">Dayforce</span>
              <span className="chap-platform-badge">More coming</span>
            </div>
            <Link href="/#demo" className="chap-btn-primary">Request Early Access</Link>
          </div>
        </section>

        {/* Section 6 — Proof */}
        <section className="chap-proof-section">
          <div className="chap-section__inner">
            <p className="chap-eyebrow">Industry data</p>
            <h2 className="chap-section-headline">The compliance exposure CHAP AI addresses.</h2>
            <div className="chap-proof-list">
              {proofStats.map((s) => (
                <div key={s.number} className="chap-proof-stat">
                  <div className="chap-proof-number">{s.number}</div>
                  <div>
                    <div className="chap-proof-label">{s.label}</div>
                    <div className="chap-proof-source">Source: {s.source}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 7 — CTA */}
        <section className="chap-cta-section">
          <h2>See CHAP AI run a compliance scan on your payroll data.</h2>
          <p>30-minute personalized walkthrough. Bring your last payroll file.</p>
          <Link href="/#demo" className="chap-btn-primary chap-btn-lg">Request a Demo</Link>
        </section>

      </main>
      <Footer />
    </div>
  );
}
