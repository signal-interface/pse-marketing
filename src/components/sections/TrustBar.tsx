import { ShieldCheck, FileCheck, Globe } from "lucide-react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

// Each badge is a registered claim (src/content/trust/claims.ts); the
// live-surface-claims release-gate test enforces the linkage.
// 2026-07-30 ruling: "Enterprise-Grade Security" (grade adjective, no named
// standard) replaced with a specific, shipped-evidence statement; the
// "Daily Regulatory Monitoring" badge removed — no daily job runs, so the
// cadence may not be claimed.
export const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    label: "No Third-Party Scripts or Trackers",
    claimId: "no-third-party-analytics",
  },
  {
    icon: FileCheck,
    label: "Audit-Ready Documentation",
    claimId: "trust-audit-ready-documentation",
  },
  {
    icon: Globe,
    label: "Multi-State Coverage",
    claimId: "trust-multi-state-coverage",
  },
] as const;

export default function TrustBar() {
  return (
    <section className="py-10 px-8 bg-ice border-y border-border-light">
      <div className="max-w-[1200px] mx-auto">
        <RevealOnScroll className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <span className="text-xs font-semibold text-text-tertiary uppercase tracking-[0.08em]">
            We don&apos;t compete with your payroll vendor. We govern it.
          </span>
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-sm font-medium text-text-secondary"
            >
              <item.icon
                size={16}
                strokeWidth={1.5}
                className="text-steel"
                aria-hidden="true"
              />
              {item.label}
            </div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
