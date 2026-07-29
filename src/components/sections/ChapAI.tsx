import { Check, AlertTriangle, X as XIcon } from "lucide-react";
import Link from "next/link";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { CHAP_STEPS } from "@/lib/constants";

const STEP_COLORS: Record<string, string> = {
  "blue-accent": "bg-blue-accent",
  amber: "bg-amber",
  purple: "bg-[#7c3aed]",
  green: "bg-green",
};

const SCAN_ROWS = [
  { status: "pass", label: "Overtime", cite: "FLSA §207" },
  { status: "pass", label: "Min wage", cite: "CA Lab §1182" },
  { status: "warn", label: "Meal break", cite: "CA Lab §512" },
  { status: "fail", label: "Split shift", cite: "IWC Order 4" },
  { status: "pass", label: "Sick leave", cite: "CA Lab §246" },
] as const;

export default function ChapAI() {
  return (
    <section id="chap" className="py-28 px-8 bg-navy">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <RevealOnScroll className="text-center mb-14">
          <span className="inline-block px-4 py-[7px] rounded-full bg-white/[0.08] text-steel-light text-xs font-bold tracking-[0.06em] uppercase">
            CHAP AI&trade;
          </span>
          <h2 className="text-[clamp(2rem,4vw,2.75rem)] mt-4 text-white tracking-[-0.02em] leading-[1.12] font-bold">
            The compliance brain behind every payroll run.
          </h2>
          <div className="chap-definition-block">
            <div className="chap-definition-block__term">
              CHAP = <strong>Compliance and Human Approval Processor</strong>
            </div>
            <div className="chap-definition-block__body">
              It is a Compliance and Human Approval Processor &mdash; an AI intelligence
              layer that analyzes payroll scenarios against federal and state
              regulations, surfaces findings for human review, and produces
              audit-ready determinations. Every determination requires a named
              human approver before any action is taken.
            </div>
          </div>
        </RevealOnScroll>

        {/* Two-column: Steps + Terminal */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: How CHAP AI works */}
          <RevealOnScroll delay="reveal-d1" className="flex-1 min-w-[280px]">
            <div className="bg-navy-light border border-white/[0.06] rounded-2xl p-7 h-full">
              <div className="text-xs font-bold text-steel-light tracking-[0.06em] uppercase mb-4">
                How CHAP AI Works
              </div>
              {CHAP_STEPS.map((x, i) => (
                <div
                  key={x.step}
                  className={`py-[18px] ${i > 0 ? "border-t border-white/[0.06]" : ""}`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-white text-xs font-extrabold mt-0.5 ${STEP_COLORS[x.color] || "bg-steel"}`}
                    >
                      {x.step.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-base">
                        {x.step}
                      </div>
                      <div className="mt-1 text-steel-muted text-sm leading-[1.55]">
                        {x.desc}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          {/* Right: Terminal-style dashboard */}
          <RevealOnScroll delay="reveal-d2" className="flex-1 min-w-[280px]">
            <div className="bg-navy-light border border-white/[0.06] rounded-2xl p-7 h-full font-mono">
              {/* Terminal header */}
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/[0.06]">
                <span className="w-3 h-3 rounded-full bg-red/60" />
                <span className="w-3 h-3 rounded-full bg-amber/60" />
                <span className="w-3 h-3 rounded-full bg-green/60" />
                <span className="ml-2 text-xs text-steel-muted">
                  chap-ai scan --pre-run
                </span>
              </div>

              {/* Scan rows */}
              <div className="flex flex-col gap-2.5">
                {SCAN_ROWS.map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    {row.status === "pass" && (
                      <Check
                        size={14}
                        strokeWidth={2.5}
                        className="text-green shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    {row.status === "warn" && (
                      <AlertTriangle
                        size={14}
                        strokeWidth={2.5}
                        className="text-amber shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    {row.status === "fail" && (
                      <XIcon
                        size={14}
                        strokeWidth={2.5}
                        className="text-red shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <span className="text-sm text-white">{row.label}</span>
                    <span className="text-xs text-steel-muted ml-auto">
                      {row.cite}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-steel-muted">
                  Scan completed 09:14:22 PST
                </span>
                <span className="text-xs font-semibold text-green bg-green/10 px-2.5 py-1 rounded-full">
                  4/5 Passed
                </span>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        {/* Learn more link */}
        <RevealOnScroll delay="reveal-d2" className="mt-6 text-center">
          <Link href="/chap-ai" className="chap-learn-more">
            Full CHAP AI documentation
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </RevealOnScroll>

        {/* CHAP Guard banner */}
        <RevealOnScroll delay="reveal-d3" className="mt-8">
          <div className="bg-navy-light border border-white/[0.06] rounded-2xl p-7 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-xs font-bold text-green bg-green/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Early Access
                </span>
              </div>
              <div className="text-lg font-bold text-white mb-1">
                CHAP Guard — Chrome Extension
              </div>
              <div className="text-sm text-steel-muted leading-[1.6] max-w-[560px]">
                CHAP AI delivered directly into your payroll system. Real-time
                compliance badges, inline violation alerts, and contextual
                explanations — right where you work.
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-full bg-white/[0.06] text-xs font-semibold text-steel-light">
                UKG
              </span>
              <span className="px-3 py-1.5 rounded-full bg-white/[0.06] text-xs font-semibold text-steel-light">
                ADP
              </span>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
