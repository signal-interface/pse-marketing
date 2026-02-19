import {
  Zap,
  ShieldCheck,
  BarChart3,
  RefreshCw,
  Plug,
  Target,
} from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { SERVICES } from "@/lib/constants";

const ICON_MAP = {
  Zap,
  ShieldCheck,
  BarChart3,
  RefreshCw,
  Plug,
  Target,
} as const;

export default function Services() {
  return (
    <section
      id="services"
      className="py-28 px-6 sm:px-10 max-w-[1200px] mx-auto"
    >
      <RevealOnScroll className="text-center mb-14">
        <h2 className="font-serif text-[clamp(2rem,4vw,2.75rem)] font-bold tracking-[-0.02em] text-navy mb-3.5">
          What we do
        </h2>
        <p className="text-lg text-muted max-w-[540px] mx-auto">
          End-to-end payroll operations designed for businesses that refuse to
          settle for outdated processes.
        </p>
      </RevealOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SERVICES.map((s, i) => {
          const Icon = ICON_MAP[s.icon];
          return (
            <RevealOnScroll
              key={s.title}
              delay={`reveal-d${Math.min(i + 1, 4)}`}
            >
              <div className="bg-white rounded-2xl px-[30px] py-9 border border-border relative overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:border-transparent transition-all duration-300 group">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue to-mint scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                <div className="mb-3.5 text-blue" aria-hidden="true">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-[19px] font-bold tracking-tight text-navy mb-2.5">
                  {s.title}
                </h3>
                <p className="text-sm leading-[1.7] text-muted">{s.desc}</p>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}
