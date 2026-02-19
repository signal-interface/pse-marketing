import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { STATS } from "@/lib/constants";

export default function WhyPSE() {
  return (
    <section id="why" className="py-24 px-6 sm:px-10 bg-navy text-white">
      <div className="max-w-[1200px] mx-auto">
        <RevealOnScroll className="max-w-[600px] mb-14">
          <h2 className="font-serif text-[clamp(2rem,4vw,2.75rem)] font-bold tracking-[-0.02em] mb-4">
            Built different.
          </h2>
          <p className="text-lg leading-[1.65] text-white/[0.55]">
            We combine deep payroll expertise with modern technology to deliver
            operations that scale with your business — not against it.
          </p>
        </RevealOnScroll>

        <div className="flex flex-col sm:flex-row">
          {STATS.map((stat, i) => (
            <RevealOnScroll
              key={stat.metric}
              delay={`reveal-d${Math.min(i + 1, 4)}`}
              className={`flex-1 py-8 px-7 ${i > 0 ? "sm:border-l sm:border-white/[0.08]" : ""}`}
            >
              <div className="text-[40px] font-extrabold tracking-[-0.03em] bg-gradient-to-br from-sky to-mint bg-clip-text text-transparent mb-1.5">
                {stat.metric}
              </div>
              <div className="text-[15px] font-semibold text-white/[0.85] mb-1.5">
                {stat.label}
              </div>
              <div className="text-[13px] text-white/40 leading-[1.5]">
                {stat.desc}
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-5 text-[11px] text-white/25 max-w-[1200px]">
          * Benchmarks reflect internal test harness comparisons against manual
          payroll processing workflows.
        </div>
      </div>
    </section>
  );
}
