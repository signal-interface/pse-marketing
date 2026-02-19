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
      className="py-28 px-8 max-w-[1200px] mx-auto"
    >
      <RevealOnScroll className="text-center mb-14">
        <span className="inline-block text-xs font-semibold text-steel uppercase tracking-[0.08em] mb-3">
          Services
        </span>
        <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-bold tracking-[-0.02em] text-text mb-3.5">
          Payroll operations built for multi-state employers who need it right
          the first time.
        </h2>
      </RevealOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SERVICES.map((s, i) => {
          const Icon = ICON_MAP[s.icon];
          return (
            <RevealOnScroll
              key={s.title}
              delay={`reveal-d${Math.min(i + 1, 4)}`}
            >
              <div className="bg-white rounded-2xl px-[30px] py-9 border border-border relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-transparent transition-all duration-300 group">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-steel-light to-steel scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                <div className="mb-3.5 text-steel" aria-hidden="true">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-[19px] font-bold tracking-tight text-text mb-2.5">
                  {s.title}
                </h3>
                <p className="text-sm leading-[1.7] text-text-secondary">
                  {s.desc}
                </p>
              </div>
            </RevealOnScroll>
          );
        })}
      </div>
    </section>
  );
}
