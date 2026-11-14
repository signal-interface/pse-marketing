import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ENFORCEMENT_STATS } from '@/lib/stats';

export const metadata: Metadata = {
  title: 'Services | Payroll Synergy Experts',
  description: 'Explore PSE's six-part vision for payroll governance, compliance intelligence, workforce analytics, reconciliation, integration, and advisory.',
};

const services = [
  {
    slug: 'payroll-processing', // boundary-lint-allow: prohibited-execution-nominal -- legacy public slug; rename tracked separately, requires 308 + re-index
    name: 'Governed Payroll Runs',
    headline: 'Real-time compliance validation for automated multi-state payroll.',
    body: 'The PSE platform vision places structured statutory checks and exception review before payroll closes — helping teams assess overtime, deposit timing, and other compliance risks.',
    features: [
      'Multi-state validation in a single pass',
      'CHAP AI pre-run compliance scan',
      'Deposit timing validation (IRC §6656)',
      'Guided correction workflow',
      'Audit-ready run documentation',
    ],
    stat: { value: ENFORCEMENT_STATS.irsMaxDepositPenalty.value, label: 'Maximum IRC §6656 penalty rate in qualifying circumstances' },
  },
  {
    slug: 'tax-compliance',
    name: 'Tax & Compliance',
    headline: 'Payroll tax compliance audited, documented, and actioned — every cycle.',
    body: 'PSE advisory helps employers assess payroll tax compliance and respond to notices. The CHAP AI roadmap adds earlier visibility into deposit timing and related exposure.',
    features: [
      'Multi-jurisdiction compliance audit',
      'Regulatory change monitoring',
      'Tax notice support',
      'Deposit timing validation (IRC §6656)',
      'Withholding reconciliation',
    ],
    stat: { value: ENFORCEMENT_STATS.payrollComplianceTopChallenge.value, label: 'Of payroll teams cite compliance as their #1 challenge (PayrollOrg 2024)' },
  },
  {
    slug: 'workforce-analytics',
    name: 'Workforce Analytics',
    headline: 'Labor costs, overtime exposure, and headcount trends — connected.',
    body: 'PSE's end-state analytics vision connects labor costs, overtime trends, and compliance exposure in a unified view for payroll leaders.',
    features: [
      'Live labor cost dashboards',
      'Overtime exposure by department',
      'Multi-state headcount reporting',
      'Exception trend reporting',
      'Custom reporting exports',
    ],
    stat: { value: ENFORCEMENT_STATS.hrTimeOnPayroll.value, label: 'Of HR time spent on payroll administration (OnePoint Research)' },
  },
  {
    slug: 'benefits-integration',
    name: 'Benefits Reconciliation',
    headline: 'Benefits deduction reconciliation — audited against payroll records.',
    body: 'Benefits deduction reconciliation — PSE audits payroll deduction reports against benefit elections to identify discrepancies. ',
    features: [
      'Deduction reconciliation audit',
      'Discrepancy documentation',
      'Payroll-benefits gap analysis',
      'Action plan delivery',
      'Reconciliation exception review',
    ],
    stat: { value: ENFORCEMENT_STATS.perErrorCost.value, label: 'Average cost per payroll error (EY, 2022)' },
  },
  {
    slug: 'system-integration',
    name: 'System Integration',
    headline: 'Connect payroll to your HRIS and workforce management platforms.',
    body: 'The PSE architecture envisions interoperability with UKG, ADP, Dayforce, and major HRIS platforms, including governed data exchange and custom API connectivity.',
    features: [
      'UKG, ADP, Dayforce connectors',
      'Custom REST API',
      'Bi-directional data sync',
      'Real-time validation on inbound data',
      'Integration audit logging',
    ],
    stat: { value: ENFORCEMENT_STATS.payrollTechChallenges.value, label: 'Of companies encounter challenges with payroll technologies (Ceridian/APA/GPMI)' },
  },
  {
    slug: 'strategic-advisory',
    name: 'Strategic Advisory',
    headline: 'Payroll structure optimization and compliance strategy.',
    body: 'Entity setup guidance, compensation structure analysis, and multi-state expansion planning from payroll experts who have run compliance operations at scale. Advisory backed by the same statutory framework that powers CHAP AI.',
    features: [
      'Multi-state expansion planning',
      'Entity structure optimization',
      'Compensation strategy review',
      'Compliance gap assessments',
      'Audit preparation support',
    ],
    stat: { value: `${ENFORCEMENT_STATS.dolBackWages.fiscalYear}: ${ENFORCEMENT_STATS.dolBackWages.value}`, label: 'In DOL back wages recovered from employers (DOL WHD)' },
  },
];

export default function ServicesPage() {
  return (
    <div className="svc-page">
      <Navbar />
      <main>

        {/* Hero */}
        <section className="svc-hero">
          <div className="svc-hero__inner">
            <p className="svc-eyebrow">PSE Services</p>
            <h1 className="svc-hero__headline">
              Payroll governance built for multi-state employers<br />
              who need it right the first time.
            </h1>
            <p className="svc-hero__sub">
              Six connected service areas. One governance-first vision.
              Built to connect validation, professional judgment, and audit evidence.
            </p>
            <p className="svc-hero__sub">
              Powered by CHAP AI™ — Compliance, Helpdesk &amp; Automation Platform.
            </p>
            {/* Mirrors the homepage TrustBar badges (registered claims —
                see TRUST_ITEMS); update both together. */}
            <div className="svc-hero__trust">
              <span className="svc-trust-item">No Third-Party Scripts or Trackers</span>
              <span className="svc-trust-divider">·</span>
              <span className="svc-trust-item">Audit-Ready Documentation</span>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="svc-grid-section">
          <div className="svc-grid-section__inner">
            <div className="svc-grid">
              {services.map((s) => (
                <div key={s.slug} className="svc-card">
                  <div className="svc-card__name">
                    {s.name}
                  </div>
                  <div className="svc-card__headline">{s.headline}</div>
                  <p className="svc-card__body">{s.body}</p>
                  <ul className="svc-card__features">
                    {s.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <div className="svc-card__stat">
                    <div className="svc-card__stat-value">{s.stat.value}</div>
                    <div className="svc-card__stat-label">{s.stat.label}</div>
                  </div>
                  <Link href={`/services/${s.slug}`} className="svc-card__link">
                    Learn more
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CHAP AI Cross-Sell */}
        <section className="svc-chap-callout">
          <div className="svc-chap-callout__inner">
            <div className="svc-chap-callout__content">
              <p className="svc-eyebrow" style={{ color: '#6b8caa' }}>Powered by CHAP AI™</p>
              <h2>One connected intelligence vision across payroll operations.</h2>
              <p>
                The CHAP AI platform vision connects pre-close checks, statutory references,
                exception review, and evidence management across payroll operations.
                The public CHAP marketing experience remains an educational demonstration,
                separate from operational payroll systems.
              </p>
              <Link href="/chap-ai" className="svc-chap-link">
                See how CHAP AI works
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
            <div className="svc-chap-callout__terminal">
              <div className="svc-terminal-snippet">
                <div className="svc-terminal-bar">
                  <span className="svc-terminal-dot" style={{background:'#ff5f57'}}/>
                  <span className="svc-terminal-dot" style={{background:'#ffbd2e'}}/>
                  <span className="svc-terminal-dot" style={{background:'#28c840'}}/>
                  <span className="svc-terminal-label">chap-ai — every service</span>
                </div>
                <div className="svc-terminal-body">
                  <div className="svc-t-ok">✓  Governed Payroll Runs  CHAP AI pre-run scan</div>
                  <div className="svc-t-ok">✓  Tax &amp; Compliance      Statute-cited checks</div>
                  <div className="svc-t-ok">✓  Workforce Analytics   Live exposure data</div>
                  <div className="svc-t-ok">✓  Benefits Reconciliation  Deduction validation</div>
                  <div className="svc-t-ok">✓  System Integration    Inbound data check</div>
                  <div className="svc-t-ok">✓  Strategic Advisory    Statute-backed guidance</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="svc-cta">
          <div className="svc-cta__inner">
            <h2>See all six service areas in a single walkthrough.</h2>
            <p>30-minute personalized demo. We&apos;ll map PSE&apos;s services to your specific payroll structure.</p>
            <Link href="/#demo" className="svc-btn-primary">Request a Demo</Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}