import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "PSE Product Tour | Payroll Synergy Experts",
  description:
    "Explore how PSE surfaces payroll risk, supports human review, and preserves audit-ready evidence before requesting a personalized demo.",
};

const TOUR_STEPS = [
  {
    eyebrow: "1 · Assess",
    title: "See the payroll governance posture",
    description:
      "Begin with a structured view of risk, coverage, exceptions, and the evidence requiring attention.",
    image: "/screenshots/dashboard-overview.png",
    alt: "Illustrative PSE dashboard overview",
  },
  {
    eyebrow: "2 · Review",
    title: "Move from signal to governed review",
    description:
      "PSE organizes potential issues for practitioner review instead of silently changing the payroll system.",
    image: "/screenshots/compliance-scan.png",
    alt: "Illustrative PSE compliance scan",
  },
  {
    eyebrow: "3 · Govern",
    title: "Keep the decision with the payroll professional",
    description:
      "CHAP explains what needs attention, why it matters, and which evidence supports the determination.",
    image: "/screenshots/payroll-run.png",
    alt: "Illustrative PSE payroll-run governance view",
  },
  {
    eyebrow: "4 · Prove",
    title: "Retain an audit-ready evidence trail",
    description:
      "The outcome is not only a recommendation. PSE preserves what was reviewed, decided, and supported.",
    image: "/screenshots/audit-trail.png",
    alt: "Illustrative PSE audit trail",
  },
] as const;

export default function ProductTourPage() {
  return (
    <div>
      <Navbar />
      <main className="pt-16">
        <section className="bg-gradient-to-b from-ice to-white px-8 py-24">
          <div className="mx-auto max-w-[900px] text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.12em] text-steel">
              PSE Product Tour · Illustrative
            </p>
            <h1 className="mb-6 text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-text">
              From payroll signal to governed evidence.
            </h1>
            <p className="mx-auto mb-8 max-w-[680px] text-[18px] leading-[1.7] text-text-secondary">
              See how PSE helps payroll teams identify what needs attention,
              apply professional judgment, and preserve a defensible record.
              PSE supports payroll governance; it does not process payroll or
              autonomously change your payroll system.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/#demo"
                className="inline-flex items-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:bg-navy-dark hover:shadow-md"
              >
                Request a Demo
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/chap-ai"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-6 py-3 text-sm font-semibold text-text transition-colors hover:border-steel-light hover:bg-ice"
              >
                Explore CHAP AI
              </Link>
            </div>
          </div>
        </section>

        <section className="px-8 py-24">
          <div className="mx-auto flex max-w-[1100px] flex-col gap-24">
            {TOUR_STEPS.map((step, index) => (
              <article
                key={step.title}
                className="grid items-center gap-12 lg:grid-cols-2"
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-steel">
                    {step.eyebrow}
                  </p>
                  <h2 className="mb-4 text-[clamp(1.8rem,4vw,2.7rem)] font-bold tracking-[-0.03em] text-text">
                    {step.title}
                  </h2>
                  <p className="text-[17px] leading-[1.7] text-text-secondary">
                    {step.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-green">
                    <CheckCircle2 size={18} aria-hidden="true" />
                    Human review remains in control
                  </div>
                </div>
                <div
                  className={`overflow-hidden rounded-2xl border border-border bg-white p-3 shadow-lg ${
                    index % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <Image
                    src={step.image}
                    alt={step.alt}
                    width={1280}
                    height={800}
                    className="h-auto w-full rounded-xl"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={index === 0}
                  />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-navy px-8 py-20 text-center">
          <div className="mx-auto max-w-[700px]">
            <h2 className="mb-4 text-[clamp(2rem,4vw,3rem)] font-bold tracking-[-0.03em] text-white">
              See PSE against your payroll environment.
            </h2>
            <p className="mb-8 text-[17px] leading-[1.7] text-steel-muted">
              The product tour explains the workflow. The personalized demo
              maps it to your systems, jurisdictions, and governance needs.
            </p>
            <Link
              href="/#demo"
              className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-navy transition-all hover:-translate-y-px hover:shadow-md"
            >
              Request a Demo
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
