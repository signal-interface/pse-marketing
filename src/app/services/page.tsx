import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Services | Payroll Synergy Experts',
  description: 'Six integrated payroll service areas. Payroll processing, tax compliance, workforce analytics, benefits integration, system integration, and strategic advisory — all powered by CHAP AI.',
};

const services = [
  {
    slug: 'payroll-processing',
    name: 'Payroll Processing',
    headline: 'Automated multi-state payroll with real-time compliance validation.',
    body: 'Every payroll run validated against federal and state statutory requirements before commit. CHAP AI catches violations — wrong overtime calculations, missed meal break premiums, deposit timing errors — before they become penalties.',
    features: [
      'Multi-state payroll in a single run',
      'CHAP AI pre-run compliance scan',
      'Deposit timing validation (IRC §6656)',
      'Same-day correction workflow',
      'Audit-ready run documentation',
    ],
    stat: { value: '15%', label: 'Max IRS deposit penalty — eliminated by pre-run validation' },
  },
  {
    slug: 'tax-compliance',
    name: 'Tax & Compliance',
    headline: 'Payroll tax compliance audited, documented, and actioned — every cycle.',
    body: 'Payroll tax compliance audited and actioned across all active jurisdictions. When a tax notice arrives, PSE researches the issue and delivers a structured response plan. CHAP AI flags deposit timing exposure before it triggers a penalty.',
    features: [
      'Multi-jurisdiction compliance audit',
      'Daily regulatory change monitoring',
      'Tax notice support',
      'Deposit timing validation (IRC §6656)',
      'Withholding reconciliation',
    ],
    stat: { value: '63%', label: 'Of payroll teams cite compliance as their #1 challenge (PayrollOrg 2024)' },
  },
  {
    slug: 'workforce-analytics',
    name: 'Workforce Analytics',
    headline: 'Labor costs, overtime exposure, and headcount trends — live.',
    body: 'Real-time visibility into labor cost drivers, overtime trends, and compliance exposure before they appear in a quarterly review. Built for payroll directors who need to answer questions before the CFO asks them.',
    features: [
      'Live labor cost dashboards',
      'Overtime exposure by department',
      'Multi-state headcount reporting',
      'Exception trend reporting',
      'Custom reporting exports',
    ],
    stat: { value: '35%', label: 'Of HR time spent on payroll administration (OnePoint Research)' },
  },
  {
    slug: 'benefits-integration',
    name: 'Benefits Integration',
    headline: 'Benefits deduction reconciliation — audited against payroll records.',
    body: 'Benefits deduction reconciliation — PSE audits payroll deduction reports against benefit elections to identify discrepancies. Service currently in development.',
    features: [
      'Deduction reconciliation audit',
      'Discrepancy documentation',
      'Payroll-benefits gap analysis',
      'Action plan delivery',
      'In development',
    ],
    stat: { value: '33%', label: 'Of employers have an active payroll error in any given period (IRS + EY 2024)' },
  },
  {
    slug: 'system-integration',
    name: 'System Integration',
    headline: 'Connect payroll to your HRIS and workforce management platforms.',
    body: 'Pre-built integrations with UKG, ADP, Dayforce, and major HRIS platforms. Custom API for proprietary systems. Data flows in both directions — payroll inputs from HRIS, validated outputs back.',
    features: [
      'UKG, ADP, Dayforce connectors',
      'Custom REST API',
      'Bi-directional data sync',
      'Real-time validation on inbound data',
      'Integration audit logging',
    ],
    stat: { value: '85%', label: 'Of companies encounter challenges with payroll technologies (Ceridian/APA/GPMI)' },
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
    stat: { value: '$212M', label: 'In DOL back wages recovered from employers in FY2023 (DOL WHD)' },
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
              Payroll operations built for multi-state employers<br />
              who need it right the first time.
            </h1>
            <p className="svc-hero__sub">
              Six integrated service areas. One compliance-first platform.
              Every decision documented, every regulation monitored, every run validated.
            </p>
            <div className="svc-hero__trust">
              <span className="svc-trust-item">Enterprise-Grade Security</span>
              <span className="svc-trust-divider">·</span>
              <span className="svc-trust-item">Audit-Ready Documentation</span>
              <span className="svc-trust-divider">·</span>
              <span className="svc-trust-item">Daily Regulatory Monitoring</span>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="svc-grid-section">
          <div className="svc-grid-section__inner">
            <div className="svc-grid">
              {services.map((s) => (
                <div key={s.slug} className="svc-card">
                  <div className="svc-card__name">{s.name}</div>
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
              <h2>Every service runs on the same compliance engine.</h2>
              <p>
                CHAP AI isn&apos;t a reporting layer — it&apos;s the validation engine underneath
                every payroll run, filing, and deduction reconciliation PSE processes.
                Pre-run scans, statute-level citations, and audit-ready documentation
                are built into the platform, not bolted on.
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
                  <div className="svc-t-ok">✓  Payroll Processing    CHAP AI pre-run scan</div>
                  <div className="svc-t-ok">✓  Tax &amp; Compliance      Daily rule updates</div>
                  <div className="svc-t-ok">✓  Workforce Analytics   Live exposure data</div>
                  <div className="svc-t-ok">✓  Benefits Integration  Deduction validation</div>
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
