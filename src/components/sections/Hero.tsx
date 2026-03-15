import { ArrowRight } from "lucide-react";
import DashboardPreview from "./DashboardPreview";

export default function Hero() {
  return (
    <section className="pt-[140px] pb-20 px-8 bg-gradient-to-b from-ice to-white relative overflow-hidden">
      {/* Subtle background gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 800px 600px at 20% 20%, rgba(90,122,148,0.06) 0%, transparent 60%), radial-gradient(ellipse 600px 500px at 80% 60%, rgba(37,53,84,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-[1200px] mx-auto relative">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 bg-white border border-border px-3.5 py-1.5 rounded-full text-[13px] font-medium text-text-secondary mb-7 shadow-sm"
          style={{ animation: "fadeInUp 0.6s ease-out" }}
        >
          <span
            className="w-2 h-2 rounded-full bg-green"
            style={{ animation: "pulse-green 2s infinite" }}
          />
          Powered by CHAP AI&trade;
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div style={{ animation: "fadeInUp 0.6s ease-out" }}>
            <h1 className="text-[clamp(2.2rem,4vw,3.2rem)] font-bold leading-[1.15] tracking-[-0.03em] text-text mb-5">
              Payroll has no governance layer.{" "}
              <em className="not-italic relative inline-block">
                That
                <span className="absolute left-0 right-0 bottom-1 h-[3px] bg-steel-light rounded-sm opacity-50" />
              </em>{" "}
              is the problem PSE solves.
            </h1>

            <p className="text-[17px] leading-[1.7] text-text-secondary max-w-[480px] mb-8">
              PSE is the governance, audit, and compliance intelligence layer
              between your payroll vendor and the regulations it has to follow.
              We don&apos;t replace your system &mdash; we make sure it&apos;s right.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#demo"
                className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-navy-dark hover:-translate-y-px hover:shadow-md transition-all"
              >
                Request a Demo
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </a>
              <a
                href="#chap"
                className="inline-flex items-center gap-2 bg-white text-text px-6 py-3 rounded-md text-sm font-semibold border border-border hover:border-steel-light hover:bg-ice transition-all"
              >
                How CHAP AI works
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Dashboard */}
          <div
            className="hidden lg:block"
            style={{ animation: "fadeInUp 0.8s ease-out 0.1s both" }}
          >
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
