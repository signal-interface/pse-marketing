import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TRUST_LAYER_ENABLED } from "@/lib/flags";
import ClaimList from "../ClaimList";
import TrustContact from "../TrustContact";

export const metadata: Metadata = {
  title: "Security | Payroll Synergy Experts",
  description: "Security practices in place on the PSE public site.",
};

export default function TrustSecurityPage() {
  if (!TRUST_LAYER_ENABLED) notFound();

  return (
    <div>
      <Navbar />
      <main className="pt-16">
        <section className="px-8 py-20">
          <div className="mx-auto max-w-[760px]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-steel">
              Trust · Security
            </p>
            <h1 className="mb-6 text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-[-0.03em] text-text">
              Security posture
            </h1>
            <p className="mb-10 text-[17px] leading-[1.7] text-text-secondary">
              The practices listed below are in place today and verifiable in
              the site&apos;s codebase. We list practices, not certifications.
            </p>
            <ClaimList surface="/trust/security" />
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
