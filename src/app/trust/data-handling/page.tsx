import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TRUST_LAYER_ENABLED } from "@/lib/flags";
import ClaimList from "../ClaimList";
import TrustContact from "../TrustContact";

export const metadata: Metadata = {
  title: "Data Handling | Payroll Synergy Experts",
  description: "What the PSE public site collects, and why.",
};

export default function TrustDataHandlingPage() {
  if (!TRUST_LAYER_ENABLED) notFound();

  return (
    <div>
      <Navbar />
      <main className="pt-16">
        <section className="px-8 py-20">
          <div className="mx-auto max-w-[760px]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-steel">
              Trust · Data handling
            </p>
            <h1 className="mb-6 text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-[-0.03em] text-text">
              What this site collects, and why
            </h1>
            <p className="mb-10 text-[17px] leading-[1.7] text-text-secondary">
              The statements below describe the data the public marketing site
              collects. Each one is backed by the code that implements it.
            </p>
            <ClaimList surface="/trust/data-handling" />
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
