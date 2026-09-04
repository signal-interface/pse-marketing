import { ArrowRight } from "lucide-react";

const INVESTOR_INTEREST_URL =
  "https://www.srholdingsllc.com/investors?venture=pse&source=pse-marketing#investor-form";

export default function InvestorInterest() {
  return (
    <section className="px-8 py-20 bg-ice border-y border-border">
      <div className="max-w-[1200px] mx-auto">
        <div className="max-w-[760px]">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-steel mb-3">
            Investor Interest
          </p>
          <h2 className="text-[clamp(1.9rem,3.5vw,2.7rem)] font-bold tracking-[-0.03em] text-text mb-4">
            Interested in the company behind the payroll governance layer?
          </h2>
          <p className="text-[16px] leading-[1.7] text-text-secondary mb-7 max-w-[680px]">
            PSE is the first Capital Access investment wedge. Public interest is routed through
            SR Holdings for review; confidential diligence and any participation process remain
            private and invitation-bound.
          </p>
          <a
            href={INVESTOR_INTEREST_URL}
            className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-navy-dark hover:-translate-y-px hover:shadow-md transition-all"
          >
            Request Investor Access
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </a>
          <p className="text-xs text-text-secondary mt-4 max-w-[660px] leading-relaxed">
            This link is for expressions of interest only. It is not an offer, allocation,
            reservation, or commitment to invest.
          </p>
        </div>
      </div>
    </section>
  );
}

export { INVESTOR_INTEREST_URL };
