import { ArrowRight, Play } from "lucide-react";
import DashboardPreview from "./DashboardPreview";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center px-6 sm:px-10 pt-[130px] pb-24 bg-gradient-to-br from-[#fdfdfd] via-sand to-[#eef3f9] relative overflow-hidden">
      {/* Decorative orbs */}
      <div
        className="absolute -top-20 -right-[60px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(26,95,180,0.05) 0%, transparent 70%)",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-10 left-[20%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(46,196,182,0.04) 0%, transparent 70%)",
          animation: "float 10s ease-in-out infinite 3s",
        }}
      />

      <div className="max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row items-center gap-16 relative">
        <div className="flex-1">
          {/* Badge */}
          <div className="reveal visible mb-5">
            <span className="inline-block px-4 py-[7px] bg-blue/[0.08] text-blue rounded-full text-xs font-semibold tracking-[0.05em] uppercase">
              Payroll Compliance &amp; Controls
            </span>
          </div>

          {/* Title */}
          <h1 className="reveal visible reveal-d1 font-serif text-[clamp(2.375rem,5vw,3.625rem)] font-bold leading-[1.08] tracking-[-0.03em] text-navy mb-6">
            Catch payroll risk{" "}
            <em className="italic text-blue">before</em> it hits your people.
          </h1>

          {/* Subtitle */}
          <p className="reveal visible reveal-d2 text-[19px] leading-[1.65] text-muted max-w-[520px] mb-9">
            Deterministic payroll controls with AI-powered validation. Detect
            compliance issues early, generate audit-ready evidence, and keep
            every run clean.
          </p>

          {/* Buttons */}
          <div className="reveal visible reveal-d3 flex flex-wrap gap-3.5 mb-10">
            <a
              href="#demo"
              className="inline-flex items-center gap-2 px-[30px] py-[15px] rounded-[10px] text-[15px] font-semibold bg-navy text-white hover:bg-navy-light hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(11,29,58,0.25)] transition-all"
            >
              Request a Demo
              <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
            </a>
            <a
              href="#preview"
              className="inline-flex items-center gap-2 px-[30px] py-[15px] rounded-[10px] text-[15px] font-semibold bg-transparent text-navy border-2 border-[#d4d8e0] hover:border-navy hover:bg-navy/[0.03] transition-all"
              aria-label="Watch platform preview"
            >
              <Play size={15} strokeWidth={2} aria-hidden="true" />
              Watch Preview
            </a>
          </div>

          {/* Trust indicators */}
          <div className="reveal visible reveal-d4 flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-mint/[0.06] rounded-full border border-mint/[0.12]">
              <span className="text-[13px] font-bold text-mint">
                Powered by CHAP AI&trade;
              </span>
            </div>
            {[
              { value: "Audit-Ready", label: "Documentation" },
              { value: "Multi-State", label: "Coverage" },
              { value: "Daily", label: "Regulatory Monitoring" },
            ].map((item) => (
              <div key={item.label} className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold text-navy">
                  {item.value}
                </span>
                <span className="text-[13px] text-muted">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard card */}
        <div className="reveal visible reveal-d4 hidden lg:block">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
