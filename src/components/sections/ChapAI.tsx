import { CheckCircle2, AlertTriangle, Ban, Check } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { CHAP_STEPS } from "@/lib/constants";

export default function ChapAI() {
  return (
    <section id="chap-ai" className="py-28 px-6 sm:px-10 bg-warm">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <RevealOnScroll className="text-center mb-14">
          <span className="inline-block px-4 py-[7px] rounded-full bg-mint/10 text-mint text-xs font-bold tracking-[0.06em] uppercase">
            CHAP AI&trade;
          </span>
          <h2 className="font-serif text-[clamp(2rem,4vw,2.75rem)] mt-4 text-navy tracking-[-0.02em] leading-[1.12]">
            The compliance brain behind PSE.
          </h2>
          <p className="mt-3.5 text-lg leading-[1.65] text-muted max-w-[640px] mx-auto">
            CHAP AI is the intelligence engine that powers every compliance
            decision at PSE. It analyzes payroll data against labor law, detects
            statutory risk, explains violations in plain language, and produces
            audit-ready evidence — all before money moves.
          </p>
          <p className="mt-2.5 text-[15px] leading-relaxed text-blue max-w-[640px] mx-auto font-medium">
            CHAP Guard is how CHAP AI reaches your payroll system today — a
            Chrome extension that brings real-time compliance directly into UKG
            and ADP.
          </p>
        </RevealOnScroll>

        {/* Flow diagram */}
        <RevealOnScroll delay="reveal-d1" className="flex flex-wrap items-center justify-center gap-0 mb-12">
          <div className="bg-white border border-input-border rounded-[14px] px-7 py-[18px] text-center min-w-[140px]">
            <div className="text-[13px] font-bold text-navy">Inputs</div>
            <div className="text-xs text-muted mt-1">Time &middot; HR &middot; Benefits</div>
          </div>
          <div className="px-2 text-[#c4c8d0] text-[22px]">&rarr;</div>
          <div className="bg-gradient-to-br from-navy to-navy-light rounded-[14px] px-8 py-[18px] text-center min-w-[180px] shadow-[0_8px_24px_rgba(11,29,58,0.2)]">
            <div className="text-sm font-extrabold text-white tracking-tight">
              CHAP AI
            </div>
            <div className="text-xs text-white/[0.55] mt-1">
              Detect &middot; Flag &middot; Explain &middot; Document
            </div>
          </div>
          <div className="px-2 text-[#c4c8d0] text-[22px]">&rarr;</div>
          <div className="bg-white border-2 border-mint rounded-[14px] px-7 py-[18px] text-center min-w-[160px]">
            <div className="flex items-center justify-center gap-1.5 text-[13px] font-bold text-mint">
              <Check size={14} strokeWidth={2.5} aria-hidden="true" /> Payroll
              Run
            </div>
            <div className="text-xs text-muted mt-1">
              Review-ready &middot; Evidence attached
            </div>
          </div>
        </RevealOnScroll>

        {/* Two-column */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: How CHAP AI works */}
          <RevealOnScroll delay="reveal-d2" className="flex-1 min-w-[280px]">
            <div className="bg-white border border-border rounded-2xl p-7 shadow-[0_8px_32px_rgba(0,0,0,0.03)] h-full">
              <div className="text-xs font-bold text-blue tracking-[0.06em] uppercase mb-4">
                How CHAP AI Works
              </div>
              {CHAP_STEPS.map((x, i) => (
                <div
                  key={x.step}
                  className={`py-[18px] ${i > 0 ? "border-t border-[#f1f3f6]" : ""}`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white text-xs font-extrabold mt-0.5 opacity-90"
                      style={{ background: x.color }}
                    >
                      {x.step.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-navy text-base">
                        {x.step}
                      </div>
                      <div className="mt-1 text-muted text-sm leading-[1.55]">
                        {x.desc}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* Right: CHAP Guard + Live Today */}
          <RevealOnScroll delay="reveal-d3" className="flex-1 min-w-[280px] flex flex-col gap-4">
            {/* CHAP Guard */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
              <div className="text-xs font-bold text-mint tracking-[0.06em] uppercase mb-1.5">
                CHAP Guard — Chrome Extension
              </div>
              <div className="text-[13px] text-muted leading-[1.55] mb-3.5">
                CHAP AI delivered directly into your payroll system. Real-time
                compliance badges, inline violation alerts, and contextual
                explanations — right where you work.
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  {
                    Icon: CheckCircle2,
                    label: "Clear",
                    desc: "All checks passed",
                    bg: "bg-mint/[0.06]",
                    border: "border-mint/20",
                    color: "text-mint",
                  },
                  {
                    Icon: AlertTriangle,
                    label: "At Risk",
                    desc: "Review recommended",
                    bg: "bg-[#f59e0b]/[0.06]",
                    border: "border-[#f59e0b]/20",
                    color: "text-[#d97706]",
                  },
                  {
                    Icon: Ban,
                    label: "Critical",
                    desc: "Action required before proceeding",
                    bg: "bg-[#ef4444]/[0.06]",
                    border: "border-[#ef4444]/20",
                    color: "text-[#dc2626]",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[10px] ${s.bg} border ${s.border}`}
                  >
                    <s.Icon
                      size={18}
                      strokeWidth={1.5}
                      className={`${s.color} shrink-0`}
                      aria-hidden="true"
                    />
                    <div>
                      <div className={`text-sm font-bold ${s.color}`}>
                        {s.label}
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        {s.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Today + Roadmap */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex-1">
              <div className="text-xs font-bold text-mint tracking-[0.06em] uppercase mb-3">
                Live Today
              </div>
              <div className="flex flex-col gap-2.5">
                {[
                  "CHAP AI compliance intelligence engine",
                  "CHAP Guard extension for UKG & ADP",
                  "California labor law compliance rules",
                  "Inline violation badges with code citations",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-sm">
                    <span className="w-5 h-5 rounded-md shrink-0 bg-mint flex items-center justify-center text-white">
                      <Check size={11} strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span className="text-navy font-semibold">{item}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#f1f3f6] mt-4 pt-3.5">
                <div className="text-xs font-bold text-muted tracking-[0.06em] uppercase mb-2.5">
                  Roadmap
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    "Multi-state jurisdiction coverage",
                    "Platform-native compliance dashboard",
                    "Pre-run gating (block execution on critical flags)",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      <span className="w-5 h-5 rounded-md shrink-0 border-2 border-[#d4d8e0]" />
                      <span className="text-muted">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* CTA */}
        <RevealOnScroll delay="reveal-d4" className="text-center mt-10">
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="#preview"
              className="inline-flex items-center gap-2 px-[30px] py-[15px] rounded-[10px] text-[15px] font-semibold bg-transparent text-navy border-2 border-[#d4d8e0] hover:border-navy hover:bg-navy/[0.03] transition-all"
              aria-label="Watch platform preview"
            >
              Watch the preview
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 px-[30px] py-[15px] rounded-[10px] text-[15px] font-semibold bg-navy text-white hover:bg-navy-light hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(11,29,58,0.25)] transition-all"
            >
              Request early access
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
