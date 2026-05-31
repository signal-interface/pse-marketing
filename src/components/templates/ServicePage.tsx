import Link from 'next/link';
import type { ServiceData } from '@/data/services';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductScreenshot from '@/components/ui/ProductScreenshot';

interface Props {
  service: ServiceData;
}

export function ServicePage({ service }: Props) {
  return (
    <div className="svc-sub-page">
      <Navbar />
      <main>

        {/* Breadcrumb */}
        <div className="svc-sub-breadcrumb">
          <div className="svc-sub-breadcrumb__inner">
            <Link href="/services" className="svc-sub-bc-link">Services</Link>
            <span className="svc-sub-bc-sep">/</span>
            <span className="svc-sub-bc-current">{service.name}</span>
          </div>
        </div>

        {/* Hero */}
        <section className="svc-sub-hero">
          <div className="svc-sub-hero__inner">
            <p className="svc-eyebrow">PSE — {service.name}</p>
            <h1 className="svc-sub-hero__headline">{service.headline}</h1>
            <p className="svc-sub-hero__sub">{service.subheadline}</p>
            <Link href="/#demo" className="svc-btn-primary">Request a Demo</Link>
          </div>
        </section>

        {/* Body + Features */}
        <section className="svc-sub-body-section">
          <div className="svc-sub-body__inner">
            <div className="svc-sub-body__prose">
              <p className="svc-sub-body__text">{service.body}</p>
            </div>
            <div className="svc-sub-features">
              {service.features.map((f) => (
                <div key={f.title} className="svc-sub-feature">
                  <div className="svc-sub-feature__title">{f.title}</div>
                  <div className="svc-sub-feature__body">{f.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Screenshot */}
        {service.screenshot && (
          <section className="svc-sub-screenshot">
            <div className="svc-sub-screenshot__inner">
              <ProductScreenshot
                src={service.screenshot.src}
                alt={service.screenshot.alt}
                caption={service.screenshot.caption}
              />
            </div>
          </section>
        )}

        {/* Stats */}
        <section className="svc-sub-stats-section">
          <div className="svc-sub-stats__inner">
            <p className="svc-eyebrow" style={{ color: '#6b8caa' }}>Industry data</p>
            <div className="svc-sub-stats-grid">
              {service.stats.map((s) => (
                <div key={s.value} className="svc-sub-stat-card">
                  <div className="svc-sub-stat-value">{s.value}</div>
                  <div className="svc-sub-stat-label">{s.label}</div>
                  <div className="svc-sub-stat-source">Source: {s.source}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CHAP AI connection */}
        <section className="svc-sub-chap-section">
          <div className="svc-sub-chap__inner">
            <p className="svc-eyebrow">Powered by CHAP AI™</p>
            <h2 className="svc-sub-chap__headline">How CHAP AI supports {service.name}</h2>
            <p className="svc-sub-chap__body">{service.chapAiConnection}</p>
            <Link href="/chap-ai" className="svc-chap-link">
              Full CHAP AI documentation
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </section>

        {/* Related services */}
        <section className="svc-sub-related">
          <div className="svc-sub-related__inner">
            <p className="svc-eyebrow">Related services</p>
            <div className="svc-sub-related__grid">
              {service.related.map((r) => (
                <Link key={r.slug} href={`/services/${r.slug}`} className="svc-sub-related-card">
                  <span className="svc-sub-related-name">{r.name}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              ))}
              <Link href="/services" className="svc-sub-related-card svc-sub-related-card--all">
                <span className="svc-sub-related-name">All services</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="svc-cta">
          <div className="svc-cta__inner">
            <h2>See {service.name} in action.</h2>
            <p>30-minute personalized walkthrough tailored to your payroll structure.</p>
            <Link href="/#demo" className="svc-btn-primary">Request a Demo</Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
