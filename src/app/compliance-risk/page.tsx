import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ComplianceEstimator } from '@/components/sections/ComplianceEstimator';

export const metadata: Metadata = {
  title: 'Compliance Risk Estimator | Payroll Synergy Experts',
  description:
    'Explore illustrative payroll compliance exposure scenarios using public benchmarks and disclosed modeling assumptions.',
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
              Three inputs. Thirty seconds. Explore an illustrative annual
              scenario combining public IRS and DOL references, payroll
              research, and clearly disclosed PSE modeling assumptions.
            </p>
            <div className="est-hero__trust">
              <span className="est-trust-item">No email required to see results</span>
              <span className="est-trust-divider">&middot;</span>
              <span className="est-trust-item">Based on public enforcement data</span>
              <span className="est-trust-divider">&middot;</span>
              <span className="est-trust-item">Public sources and model assumptions identified</span>
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
              Published reference points used in the scenario.
            </h2>
            <div className="est-context__grid">
              {/* The exposure calculation also uses separately disclosed internal assumptions. */}
              <div className="est-context__card">
                <div className="est-context__stat">$291</div>
                <div className="est-context__stat-label">
                  Average cost per payroll error, before penalties and
                  interest
                </div>
                <div className="est-context__source">EY, 2022</div>
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
