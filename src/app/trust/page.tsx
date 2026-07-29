import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TRUST_LAYER_ENABLED } from "@/lib/flags";
import ClaimList from "./ClaimList";
import TrustContact from "./TrustContact";

export const metadata: Metadata = {
  title: "Trust | Payroll Synergy Experts",
  description:
    "How the PSE public site handles security, data, and vendor relationships.",
};

const SECTIONS = [
  {
    href: "/trust/security",
    title: "Security",
    description: "Practices in place on the public site today.",
  },
  {
    href: "/trust/subprocessors",
    title: "Subprocessors",
    description: "Vendors that process data for this site, and what they handle.",
  },
  {
    href: "/trust/data-handling",
    title: "Data handling",
    description: "What this site collects, and why.",
  },
] as const;

export default function TrustPage() {
  if (!TRUST_LAYER_ENABLED) notFound();

  return (
    <div>
      <Navbar />
      <main className="pt-16">
        <section className="px-8 py-20">
          <div className="mx-auto max-w-[760px]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-steel">
              Trust
            </p>
            <h1 className="mb-6 text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.1] tracking-[-0.03em] text-text">
              What we publish here is what we can show.
            </h1>
            <p className="mb-10 text-[17px] leading-[1.7] text-text-secondary">
              Every statement on these pages comes from a reviewed claims
              registry. If a statement is not evidenced, it is not published.
            </p>
            <div className="mb-10 grid gap-4 sm:grid-cols-3">
              {SECTIONS.map((section) => (
                <Link
                  key={section.href}
                  href={section.href}
                  className="rounded-lg border border-border bg-white p-5 transition-colors hover:border-steel-light hover:bg-ice"
                >
                  <p className="mb-1 font-semibold text-text">{section.title}</p>
                  <p className="text-sm text-text-secondary">
                    {section.description}
                  </p>
                </Link>
              ))}
            </div>
            <ClaimList surface="/trust" />
            <div className="mt-10">
              <TrustContact />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
