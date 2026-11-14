import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ChapaInterface } from '@/components/sections/ChapaInterface';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'CHAP AI — Compliance, Helpdesk & Automation Platform | Payroll Synergy Experts',
  description: 'Explore IRC §6656 federal payroll tax deposit penalties through a limited educational CHAP AI marketing experience using statutory references. No customer payroll data is required.',
};

export default function ChapAIPage() {
  return (
    <div className="chap-page">
      <Navbar />
      <main>

        {/* Section 1 — Hero */}
        <section className="chap-hero">
          <div className="chap-hero__inner">
            <div className="chap-hero__content">
              <p className="chap-eyebrow">CHAP AI™ — Compliance, Helpdesk &amp; Automation Platform</p>
              <h1 className="chap-hero__headline">
                Understand federal deposit penalty questions.<br />
                <em>Explore IRC §6656 with statutory references.</em>
              </h1>
              <p className="chap-hero__sub">
                This limited marketing experience presents a small collection of
                predefined, source-linked IRC §6656 educational explanations.
                Coverage is limited; unsupported questions receive a scope notice.
                It is not connected to customer payroll data and does not make compliance decisions.
              </p>
              <div className="chap-hero__actions">
                <a href="#try-chap-ai" className="chap-btn-primary">Try CHAP AI</a>
                <Link href="/#demo" className="chap-btn-ghost">Request a Demo</Link>
                <a href="#how-it-works" className="chap-btn-ghost">See how it works</a>
              </div>
            </div>
            <div id="try-chap-ai" className="chap-hero__terminal" style={{ scrollMarginTop: "96px" }}>
              <ChapaInterface />
            </div>
          </div>
        </section>

        {/* Educational marketing scope — not an operational CHAP product UI */}
        <section id="how-it-works" className="chap-section" style={{ background: 'var(--chap-bg, #060e18)' }}>
          <div className="chap-section__inner">
            <p className="chap-eyebrow">Educational experience</p>
            <h2 className="chap-section-headline">A focused introduction to IRC §6656.</h2>
            <p className="chap-section-sub">
              Ask general questions about federal employment tax deposit penalties.
              The experience selects from a limited set of predefined educational topics
              with published source links, rather than generating new legal opinions.
              These editorial drafts require independent professional verification.
              Answers are educational, not individualized legal,
              tax, payroll, or compliance advice.
            </p>
            <div className="chap-steps-grid">
              <div className="chap-step-card">
                <div className="chap-step-name">Ask</div>
                <p className="chap-step-body">Enter a general question about IRC §6656. Do not provide employee records, payroll files, or confidential information.</p>
              </div>
              <div className="chap-step-card">
                <div className="chap-step-name">Review</div>
                <p className="chap-step-body">Read the predefined educational overview and independently verify the cited statutory and regulatory sources.</p>
              </div>
              <div className="chap-step-card">
                <div className="chap-step-name">Understand boundaries</div>
                <p className="chap-step-body">This marketing widget does not monitor your payroll, access CHAP Production, or validate live payroll runs.</p>
              </div>
              <div className="chap-step-card">
                <div className="chap-step-name">Explore PSE</div>
                <p className="chap-step-body">Request a separate guided PSE demonstration using fixed synthetic payroll data when you are ready.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 — CTA */}
        <section className="chap-cta-section">
          <h2>Explore PSE payroll governance through a guided demonstration.</h2>
          <p>30-minute PSE demonstration using fixed synthetic payroll data. No customer payroll files are required.</p>
          <Link href="/#demo" className="chap-btn-primary chap-btn-lg">Request a Demo</Link>
        </section>

      </main>
      <Footer />
    </div>
  );
}
