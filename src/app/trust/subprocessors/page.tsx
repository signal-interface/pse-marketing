import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TRUST_LAYER_ENABLED } from "@/lib/flags";
import { NOT_DETERMINED, SUBPROCESSORS } from "@/content/trust/subprocessors";
import TrustContact from "../TrustContact";

export const metadata: Metadata = {
  title: "Subprocessors | Payroll Synergy Experts",
  description: "Vendors that process data for the PSE public site.",
};

function fieldLabel(value: string): string {
  return value === NOT_DETERMINED ? "Not yet published" : value;
}

export default function TrustSubprocessorsPage() {
  if (!TRUST_LAYER_ENABLED) notFound();

  return (
    <div>
      <Navbar />
      <main className="pt-16">
        <section className="px-8 py-20">
          <div className="mx-auto max-w-[760px]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-steel">
              Trust · Subprocessors
            </p>
            <h1 className="mb-6 text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] tracking-[-0.03em] text-text">
              Subprocessors
            </h1>
            <p className="mb-10 text-[17px] leading-[1.7] text-text-secondary">
              These vendors process data on behalf of the PSE public site.
              Fields we have not yet verified are marked rather than guessed.
            </p>
            <div className="flex flex-col gap-6">
              {SUBPROCESSORS.map((sub) => (
                <div
                  key={sub.name}
                  className="rounded-lg border border-border bg-white p-6"
                >
                  <h2 className="mb-1 text-lg font-bold text-text">{sub.name}</h2>
                  <p className="mb-4 text-[15px] leading-[1.6] text-text-secondary">
                    {sub.purpose}
                  </p>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-steel">
                    Data processed
                  </p>
                  <ul className="mb-4 list-disc pl-5 text-sm text-text-secondary">
                    {sub.dataCategories.map((category) => (
                      <li key={category}>{category}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-steel">
                    Hosting region: {fieldLabel(sub.hostingRegion)} · Retention:{" "}
                    {fieldLabel(sub.retention)}
                  </p>
                </div>
              ))}
            </div>
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
