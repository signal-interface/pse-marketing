import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ComplianceEstimator } from '@/components/sections/ComplianceEstimator';

export const metadata: Metadata = {
  title: 'Compliance Risk Estimator | Payroll Synergy Experts',
  description:
    'Estimate your annual payroll compliance risk exposure based on IRS, DOL, and EY enforcement data.',
};

export default function ComplianceRiskPage() {
  return (
    <div>
      <Navbar />
      <main className="est-page">

        <section className="est-hero">
          <div className="est-hero__inner">
            <p className="est-eyebrow">Compliance Risk Estimator</p>
            <h1 className="est-hero__headline">
              How much compliance risk is your payroll carrying right now?
            </h1>
            <p className="est-hero__sub">
              Three inputs. Thirty seconds. An estimate of your annual
              exposure based on IRS deposit penalty schedules, DOL wage
              enforcement data, and EY payroll research.
            </p>
            <div className="est-hero__trust">
              <span className="est-trust-item">No email required to see results</span>
              <span className="est-trust-divider">&middot;</span>
              <span className="est-trust-item">Based on public enforcement data</span>
              <span className="est-trust-divider">&middot;</span>
              <span className="est-trust-item">Sources cited on every figure</span>
            </div>
          </div>
        </section>

        <section className="est-main">
          <div className="est-main__inner">
            <ComplianceEstimator />
          </div>
        </section>

        <section className="est-context">
          <div className="est-context__inner">
            <p className="est-eyebrow">Why this matters</p>
            <h2 className="est-context__headline">
              These are industry benchmarks, not worst-case scenarios.
            </h2>
            <div className="est-context__grid">
              <div className="est-context__card">
                <div className="est-context__stat">33%</div>
                <div className="est-context__stat-label">
                  Of employers have an active payroll error in any given period
                </div>
                <div className="est-context__source">IRS + EY, 2024</div>
              </div>
              <div className="est-context__card">
                <div className="est-context__stat">15%</div>
                <div className="est-context__stat-label">
                  Maximum IRS deposit penalty rate under IRC §6656
                </div>
                <div className="est-context__source">IRS Notice 746, 2024</div>
              </div>
              <div className="est-context__card">
                <div className="est-context__stat">$1,296</div>
                <div className="est-context__stat-label">
                  Average DOL back-wage recovery per affected employee
                </div>
                <div className="est-context__source">DOL WHD FY2023</div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
