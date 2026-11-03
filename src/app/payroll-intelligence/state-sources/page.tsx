import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { stateSourceIntake } from "@/lib/payroll-intelligence-state-research";
import { stateBriefings } from "@/lib/payroll-intelligence-state-briefings";
import { additionalStateBriefings } from "@/lib/payroll-intelligence-state-expansion";
import { furtherStateBriefings } from "@/lib/payroll-intelligence-state-batch03";
import { stateBatch04Briefings } from "@/lib/payroll-intelligence-state-batch04";
import { stateBatch05Briefings } from "@/lib/payroll-intelligence-state-batch05";
import { stateBatch06Briefings } from "@/lib/payroll-intelligence-state-batch06";
import { stateBatch07Briefings } from "@/lib/payroll-intelligence-state-batch07";

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
   <p className="text-lg text-text-secondary max-w-4xl mb-6">These agency and legislative references are research starting points for selected payroll topics in 35 states. They are not complete state compliance profiles, legal conclusions, current rate tables, or instructions to configure payroll.</p>
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
    <Link href={`/payroll-intelligence/state-sources/${s.state.toLowerCase()}`} className="text-blue-accent underline text-sm font-semibold">Read source-linked educational briefing</Link>
    <p className="text-xs text-text-secondary mt-3">Reviewed scope: {stateBriefings.find(b=>b.state===s.state)?.topic ?? "Source reference"}</p>
    <p className="mt-3"><a href={s.authority.url} className="underline text-blue-accent text-sm" rel="noopener noreferrer" target="_blank">Open original authority</a></p>
   </article>)}</div>
   <section className="mt-12" aria-labelledby="additional-states">
    <h2 id="additional-states" className="text-2xl font-bold text-navy mb-4">Additional state references</h2>
    <p className="text-text-secondary mb-6">Four further official-source payroll briefings. These are narrow educational summaries, not complete state legal profiles.</p>
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">{additionalStateBriefings.map(s=><article key={s.state} className="bg-white border border-border rounded-xl p-6">
      <p className="font-mono text-sm text-steel mb-2">{s.state}</p>
      <h3 className="text-xl font-semibold text-navy mb-3">{s.stateName}</h3>
      <p className="text-sm font-semibold mb-3">{s.topic}</p>
      <p className="text-sm text-text-secondary mb-4">What to review: {s.caution}</p>
      <p className="text-sm text-text-secondary mb-3">Source: {s.agency} — {s.pinpoint}</p>
      <Link href={`/payroll-intelligence/state-sources/${s.state.toLowerCase()}`} className="text-blue-accent underline text-sm font-semibold">Read source-linked educational briefing</Link>
      <p className="mt-3"><a href={s.sourceUrl} className="underline text-blue-accent text-sm" target="_blank" rel="noopener noreferrer">Open official source</a></p>
    </article>)}</div>
   </section>
   <section className="mt-12" aria-labelledby="new-state-sources">
    <h2 id="new-state-sources" className="text-2xl font-bold text-navy mb-4">More state references</h2>
    <p className="text-text-secondary mb-6">Four additional official-state educational summaries with important exceptions and source links.</p>
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">{furtherStateBriefings.map(s=><article key={s.state} className="bg-white border border-border rounded-xl p-6">
      <p className="font-mono text-sm text-steel mb-2">{s.state}</p>
      <h3 className="text-xl font-semibold text-navy mb-3">{s.stateName}</h3>
      <p className="text-sm font-semibold mb-3">{s.topic}</p>
      <p className="text-sm text-text-secondary mb-4">What to review: {s.caution}</p>
      <p className="text-sm text-text-secondary mb-3">Source: {s.agency} — {s.pinpoint}</p>
      <Link href={`/payroll-intelligence/state-sources/${s.state.toLowerCase()}`} className="text-blue-accent underline text-sm font-semibold">Read source-linked educational briefing</Link>
      <p className="mt-3"><a href={s.sourceUrl} className="underline text-blue-accent text-sm" target="_blank" rel="noopener noreferrer">Open official source</a></p>
    </article>)}</div>
   </section>
   <section className="mt-12" aria-labelledby="final-pay-sources">
    <h2 id="final-pay-sources" className="text-2xl font-bold text-navy mb-4">Further final-pay references</h2>
    <p className="text-text-secondary mb-6">Four additional official-source educational briefings. Timing, exceptions, demands and penalties vary by state and separation circumstances.</p>
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">{stateBatch04Briefings.map(s=><article key={s.state} className="bg-white border border-border rounded-xl p-6">
      <p className="font-mono text-sm text-steel mb-2">{s.state}</p>
      <h3 className="text-xl font-semibold text-navy mb-3">{s.stateName}</h3>
      <p className="text-sm font-semibold mb-3">{s.topic}</p>
      <p className="text-sm text-text-secondary mb-4">What to review: {s.caution}</p>
      <p className="text-sm text-text-secondary mb-3">Source: {s.agency} — {s.pinpoint}</p>
      <Link href={`/payroll-intelligence/state-sources/${s.state.toLowerCase()}`} className="text-blue-accent underline text-sm font-semibold">Read source-linked educational briefing</Link>
      <p className="mt-3"><a href={s.sourceUrl} className="underline text-blue-accent text-sm" target="_blank" rel="noopener noreferrer">Open original authority</a></p>
    </article>)}</div>
   </section>
   <section className="mt-12" aria-labelledby="batch05-state-sources">
    <h2 id="batch05-state-sources" className="text-2xl font-bold text-navy mb-4">Additional state final-pay references</h2>
    <p className="text-text-secondary mb-6">Four more official-source educational briefings. Review separation type, permitted deductions, timing exceptions and effective dates before applying any legal requirement.</p>
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">{stateBatch05Briefings.map(s=><article key={s.state} className="bg-white border border-border rounded-xl p-6">
      <p className="font-mono text-sm text-steel mb-2">{s.state}</p>
      <h3 className="text-xl font-semibold text-navy mb-3">{s.stateName}</h3>
      <p className="text-sm font-semibold mb-3">{s.topic}</p>
      <p className="text-sm text-text-secondary mb-4">What to review: {s.caution}</p>
      <p className="text-sm text-text-secondary mb-3">Source: {s.agency} — {s.pinpoint}</p>
      <Link href={`/payroll-intelligence/state-sources/${s.state.toLowerCase()}`} className="text-blue-accent underline text-sm font-semibold">Read source-linked educational briefing</Link>
      <p className="mt-3"><a href={s.sourceUrl} className="underline text-blue-accent text-sm" target="_blank" rel="noopener noreferrer">Open official source</a></p>
    </article>)}</div>
   </section>
   <section className="mt-12" aria-labelledby="batch06-state-sources">
    <h2 id="batch06-state-sources" className="text-2xl font-bold text-navy mb-4">Further wage-payment references</h2>
    <p className="text-text-secondary mb-6">Official-source educational summaries for four more states, including compensation and employer-class exceptions.</p>
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">{stateBatch06Briefings.map(s=><article key={s.state} className="bg-white border border-border rounded-xl p-6">
      <p className="font-mono text-sm text-steel mb-2">{s.state}</p>
      <h3 className="text-xl font-semibold text-navy mb-3">{s.stateName}</h3>
      <p className="text-sm font-semibold mb-3">{s.topic}</p>
      <p className="text-sm text-text-secondary mb-4">What to review: {s.caution}</p>
      <p className="text-sm text-text-secondary mb-3">Official authority: {s.agency} — {s.pinpoint}</p>
      <Link href={`/payroll-intelligence/state-sources/${s.state.toLowerCase()}`} className="text-blue-accent underline text-sm font-semibold">Read source-linked educational briefing</Link>
      <p className="mt-3"><a href={s.sourceUrl} className="underline text-blue-accent text-sm" target="_blank" rel="noopener noreferrer">Open official source</a></p>
    </article>)}</div>
   </section>
   <section className="mt-12" aria-labelledby="batch07-state-sources">
    <h2 id="batch07-state-sources" className="text-2xl font-bold text-navy mb-4">More state wage-payment references</h2>
    <p className="text-text-secondary mb-6">Four additional official-source educational summaries, with final-pay deadlines, variable pay and policy exceptions kept distinct.</p>
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">{stateBatch07Briefings.map(s=><article key={s.state} className="bg-white border border-border rounded-xl p-6">
      <p className="font-mono text-sm text-steel mb-2">{s.state}</p>
      <h3 className="text-xl font-semibold text-navy mb-3">{s.stateName}</h3>
      <p className="text-sm font-semibold mb-3">{s.topic}</p>
      <p className="text-sm text-text-secondary mb-4">What to review: {s.caution}</p>
      <p className="text-sm text-text-secondary mb-3">Official authority: {s.agency} — {s.pinpoint}</p>
      <Link href={`/payroll-intelligence/state-sources/${s.state.toLowerCase()}`} className="text-blue-accent underline text-sm font-semibold">Read source-linked educational briefing</Link>
      <p className="mt-3"><a href={s.sourceUrl} className="underline text-blue-accent text-sm" target="_blank" rel="noopener noreferrer">Open official source</a></p>
    </article>)}</div>
   </section>
   <p className="text-sm text-text-secondary mt-10">This directory does not publish the unratified 51-jurisdiction final-pay seed or operational PSE Context Hub rules. It does not make employer-specific determinations.</p>
  </div>
 </main><Footer/></>;
}
