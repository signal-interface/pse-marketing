import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { STATS } from "@/lib/constants";

export default function WhyPSE() {
  return (
    <section id="proof" className="py-28 px-8 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <RevealOnScroll className="max-w-[600px] mb-14">
          <span className="inline-block text-xs font-semibold text-steel uppercase tracking-[0.08em] mb-3">
            Why PSE
          </span>
          <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-bold tracking-[-0.02em] text-text mb-4">
            Compliance by design, not by chance.
          </h2>
          <p className="text-lg leading-[1.65] text-text-secondary">
            We combine deep payroll expertise with modern technology to deliver
            operations that scale with your business — not against it.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <RevealOnScroll
              key={stat.metric}
              delay={`reveal-d${Math.min(i + 1, 4)}`}
            >
              <div className="bg-ice rounded-2xl p-7">
                <div className="text-[40px] font-extrabold tracking-[-0.03em] text-text mb-1.5">
                  {stat.metric}
                </div>
                <div className="text-[15px] font-semibold text-text mb-1.5">
                  {stat.label}
                </div>
                <div className="text-[13px] text-text-secondary leading-[1.5]">
                  {stat.desc}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <div className="mt-5 text-[11px] text-text-tertiary max-w-[1200px]">
          * Benchmarks reflect internal test harness comparisons against manual
          payroll processing workflows.
        </div>
      </div>
    </section>
  );
}
