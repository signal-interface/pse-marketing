import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { domains, FRAMEWORK_EDITION } from "@/lib/payroll-intelligence";
export const metadata:Metadata={
 title:"Payroll Intelligence Framework 2026–2027 | PSE",
 description:"Explore 15 payroll knowledge areas, original assurance guidance and official-source educational references.",
};
export default function PayrollIntelligencePage(){return <><Navbar/><main className="pt-16 min-h-screen bg-ice-light">
 <section className="bg-navy text-white px-6 py-16 md:py-24"><div className="max-w-6xl mx-auto">
 <p className="text-sm uppercase tracking-widest text-steel-muted mb-4">PSE / Payroll Intelligence</p>
 <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mb-5">Understand payroll requirements. See the controls behind them.</h1>
 <p className="text-lg text-steel-200 max-w-3xl">Explore the full payroll lifecycle through original governance guidance and links to official regulatory sources. Requirements differ by employer, period and jurisdiction.</p>
 <p className="text-sm text-steel-muted mt-7">Framework edition: {FRAMEWORK_EDITION} · 15 domains · Quarterly review programme</p>
 </div></section>
 <section className="max-w-6xl mx-auto px-6 py-14" aria-labelledby="domains">
 <div className="flex flex-wrap justify-between gap-4 items-center mb-7"><h2 id="domains" className="text-3xl font-bold text-navy">Explore 15 knowledge domains</h2>
 <Link className="text-blue-accent underline" href="/payroll-intelligence/methodology">How sources are evaluated</Link></div>
 <p className="text-text-secondary mb-8">The domains are a coverage index, not a certification that every country, state, locality or rule is covered.</p>
 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">{domains.map(d=><Link key={d.id} href={`/payroll-intelligence/topics/${d.slug}`} className="block bg-white border border-border rounded-xl p-6 hover:shadow-md transition-shadow no-underline">
 <p className="font-mono text-sm text-steel mb-3">DOMAIN {d.id}</p><h3 className="text-xl font-semibold text-navy mb-3">{d.name}</h3><p className="text-sm text-text-secondary leading-relaxed">{d.summary}</p><p className="text-sm text-blue-accent mt-5">Explore domain →</p></Link>)}</div>
 </section>
 <section className="border-t border-border px-6 py-12"><div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
 <div><h2 className="text-2xl font-bold mb-3">Quarterly regulatory reviews</h2><p className="text-text-secondary mb-4">PSE reviews sources quarterly and separately identifies substantive updates. A scheduled review does not mean every published rule was amended.</p><Link className="text-blue-accent underline" href="/payroll-intelligence/updates">View review schedule</Link></div>
 <div><h2 className="text-2xl font-bold mb-3">Federal source reference</h2><p className="text-text-secondary mb-4">Start with 2026 federal employment-tax figures and specific IRS and DOL source sections.</p>
 <Link className="text-blue-accent underline" href="/payroll-intelligence/2026-federal-payroll-baseline">2026 federal baseline</Link>
 <p className="mt-3"><Link className="text-blue-accent underline" href="/payroll-intelligence/briefings">Browse source-linked briefings</Link></p></div>
 </div></section>
 <aside className="max-w-6xl mx-auto px-6 pb-12 text-sm text-text-secondary">Educational reference only. PSE does not warrant that the information is complete or suitable for any specific employer. Verify current law, effective dates and jurisdictional rules before acting.</aside>
 </main><Footer/></>;}
