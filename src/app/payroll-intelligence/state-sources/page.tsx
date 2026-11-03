import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { stateSourceIntake } from "@/lib/payroll-intelligence-state-research";

export const metadata: Metadata = {
 title: "State Payroll Source Directory | PSE Payroll Intelligence",
 description: "Official state agency source starting points for selected payroll topics. Not a 50-state regulatory compliance matrix.",
 robots: { index: false, follow: false },
};

const topicLabels: Record<string, string> = {
 "wage-payment": "Pay frequency and wage payment",
 "final-wages": "Final wages",
 "minimum-wage": "Minimum wage",
};

export default function StatePayrollSources() {
 return <><Navbar/><main className="pt-24 px-6 pb-20 min-h-screen bg-ice-light">
  <div className="max-w-6xl mx-auto">
   <Link href="/payroll-intelligence" className="text-blue-accent underline text-sm">← Payroll Intelligence</Link>
   <p className="font-mono text-sm text-steel mt-9 mb-3">STATE SOURCE DIRECTORY · RESEARCH REFERENCE</p>
   <h1 className="text-4xl font-bold text-navy mb-5">Explore official state payroll sources</h1>
   <p className="text-lg text-text-secondary max-w-4xl mb-6">These agency and legislative references are research starting points for selected payroll topics in 11 states. They are not complete state compliance profiles, legal conclusions, current rate tables, or instructions to configure payroll.</p>
   <aside className="bg-white border border-border rounded-xl p-6 mb-10">
    <h2 className="text-xl font-semibold mb-3">How to use this directory</h2>
    <p className="text-text-secondary">Open the official source, confirm the current statutory text and effective date, then evaluate the employer, employee, industry, locality, exemptions, and any special authorization. Source location alone does not establish legal applicability. A full jurisdiction-by-jurisdiction library remains under development.</p>
    <p className="text-sm text-text-secondary mt-4">Source leads recorded November 3, 2026. All entries remain research-only, with rule-specific verification outstanding.</p>
   </aside>
   <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">{stateSourceIntake.map(s=><article key={s.state} className="bg-white border border-border rounded-xl p-6">
    <p className="font-mono text-sm text-steel mb-2">{s.state}</p>
    <h2 className="text-xl font-semibold text-navy mb-3">{s.stateName}</h2>
    <p className="text-sm font-semibold mb-3">{topicLabels[s.topic]}</p>
    <p className="text-sm text-text-secondary mb-4">What to review: {s.caveat}</p>
    <p className="text-sm text-text-secondary mb-3">Starting authority: {s.authority.agency} — {s.authority.pinpoint}</p>
    <a href={s.authority.url} className="underline text-blue-accent text-sm" rel="noopener noreferrer" target="_blank">Open official source</a>
   </article>)}</div>
   <p className="text-sm text-text-secondary mt-10">This directory does not publish the unratified 51-jurisdiction final-pay seed or operational PSE Context Hub rules. It does not make employer-specific determinations.</p>
  </div>
 </main><Footer/></>;
}
