import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ChapaInterface } from '@/components/sections/ChapaInterface';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'CHAP AI — Compliance Intelligence Layer | Payroll Synergy Experts',
  description: 'CHAP AI analyzes payroll scenarios against federal and state regulations, surfaces exceptions with statute citations, and produces audit-ready determinations.',
};

const steps = [
  {
    letter: 'D',
    name: 'Detect',
    headline: 'Monitors payroll data against statutory requirements',
    body: 'CHAP AI continuously monitors payroll data against the applicable federal and state statutory ruleset for your employee population — surfacing exceptions as they emerge, not after payroll commits.',
  },
  {
    letter: 'F',
    name: 'Flag',
    headline: 'Surfaces exceptions with severity and statute',
    body: 'Every exception is classified by severity (blocks payroll vs advisory), assigned the specific regulation that triggered it (FLSA §207, CA Lab §512, IWC Order 4), and queued for human review before the payroll run closes.',
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
    body: 'Every review cycle produces a timestamped compliance record: what was checked, what passed, what was flagged, what was corrected, and by whom. Three years of records, searchable on demand.',
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
                Your compliance intelligence layer.<br />
                <em>Every exception explained. Every determination documented.</em>
              </h1>
              <p className="chap-hero__sub">
                CHAP AI analyzes payroll scenarios against federal and state regulations,
                surfaces exceptions with statute citations, and produces audit-ready
                determinations — with a human approver on every decision before payroll closes.
              </p>
              <div className="chap-hero__actions">
                <Link href="/#demo" className="chap-btn-primary">Request a Demo</Link>
                <a href="#how-it-works" className="chap-btn-ghost">See how it works</a>
              </div>
            </div>
            <div className="chap-hero__terminal">
              <ChapaInterface />
            </div>
          </div>
        </section>

        {/* Section 2 — How It Works */}
        <section id="how-it-works" className="chap-section" style={{ background: 'var(--chap-bg, #060e18)' }}>
          <div className="chap-section__inner">
            <p className="chap-eyebrow">How it works</p>
            <h2 className="chap-section-headline">Four steps. Every payroll cycle.</h2>
            <p className="chap-section-sub">CHAP AI runs the full Detect → Flag → Explain → Document cycle continuously — surfacing exceptions before payroll closes.</p>
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

        {/* Section 3 — Coverage Matrix */}
        <section className="chap-section" style={{ background: 'var(--chap-bg-mid, #0a1628)' }}>
          <div className="chap-section__inner">
            <p className="chap-eyebrow">Coverage</p>
            <h2 className="chap-section-headline">What CHAP AI checks.</h2>
            <p className="chap-section-sub">Federal statutory checks applied continuously. State-specific rules applied per employee jurisdiction.</p>
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

        {/* Section 4 — CHAP Guard */}
        <section className="chap-guard-section">
          <div className="chap-guard__inner">
            <div className="chap-guard__badge">
              <span className="chap-badge-label">Early Access</span>
            </div>
            <h2>CHAP Guard — Compliance in your payroll system</h2>
            <p>
              CHAP Guard is a Chrome extension that brings CHAP AI compliance intelligence
              directly into UKG, ADP, and other payroll platforms — surfacing inline violation
              indicators and statute context without leaving your existing workflow.
              Early access available for qualifying PSE clients.
            </p>
            <div className="chap-guard__platforms">
              <span className="chap-platform-badge">UKG</span>
              <span className="chap-platform-badge">ADP</span>
              <span className="chap-platform-badge">Dayforce</span>
              <span className="chap-platform-badge">More coming</span>
            </div>
            <Link href="/#demo" className="chap-btn-primary">Request Access</Link>
          </div>
        </section>

        {/* Section 5 — Proof */}
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

        {/* Section 6 — CTA */}
        <section className="chap-cta-section">
          <h2>See CHAP AI analyze your payroll compliance posture.</h2>
          <p>30-minute personalized walkthrough. Bring your last payroll file.</p>
          <Link href="/#demo" className="chap-btn-primary chap-btn-lg">Request a Demo</Link>
        </section>

      </main>
      <Footer />
    </div>
  );
}
