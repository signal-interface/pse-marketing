import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { domains, FRAMEWORK_EDITION } from "@/lib/payroll-intelligence";

export const metadata: Metadata = {
 title: "Payroll Intelligence Framework 2026–2027 | PSE",
 description: "Explore 15 payroll knowledge domains, operational controls, official sources and quarterly publication methodology.",
 robots: { index: false, follow: false },
};
export default function PayrollIntelligencePage() {
 return <><Navbar/><main className="pt-16 min-h-screen bg-ice-light">
   <section className="bg-navy text-white px-6 py-16 md:py-24">
     <div className="max-w-6xl mx-auto">
       <p className="text-sm uppercase tracking-widest text-steel-muted mb-4">PSE / Payroll Intelligence / Editorial preview</p>
       <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mb-5">Understand payroll requirements. See the controls behind them.</h1>
       <p className="text-lg text-steel-200 max-w-3xl">An independently authored, source-linked payroll intelligence framework covering the full payroll lifecycle. This edition is in editorial preparation and is not yet a completed compliance library.</p>
       <p className="text-sm text-steel-muted mt-7">Framework edition: {FRAMEWORK_EDITION} · 15 domains · Quarterly release model</p>
     </div>
   </section>
   <section className="max-w-6xl mx-auto px-6 py-14" aria-labelledby="domains">
      <div className="flex flex-wrap justify-between gap-4 items-center mb-7">
       <h2 id="domains" className="text-3xl font-bold text-navy">Explore 15 knowledge domains</h2>
       <Link className="text-blue-accent underline" href="/payroll-intelligence/methodology">How content is verified</Link>
      </div>
      <p className="text-text-secondary mb-8">Domain indexes indicate planned coverage, not confirmation that every jurisdictional rule has been independently reviewed.</p>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
       {domains.map(d=><Link key={d.id} href={`/payroll-intelligence/topics/${d.slug}`} className="block bg-white border border-border rounded-xl p-6 hover:shadow-md transition-shadow no-underline">
        <p className="font-mono text-sm text-steel mb-3">DOMAIN {d.id}</p><h3 className="text-xl font-semibold text-navy mb-3">{d.name}</h3><p className="text-sm text-text-secondary leading-relaxed">{d.summary}</p>
        <p className="text-sm text-blue-accent mt-5">View scope →</p>
       </Link>)}
      </div>
   </section>
   <section className="border-t border-border px-6 py-12"><div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
     <div><h2 className="text-2xl font-bold mb-3">Quarterly releases</h2><p className="text-text-secondary mb-4">Inaugural edition proposed for Q4 2026. Future releases preserve historical context and separately identify material changes between quarters.</p><Link className="text-blue-accent underline" href="/payroll-intelligence/updates">View release plan</Link></div>
     <div><h2 className="text-2xl font-bold mb-3">Federal reference spotlight</h2><p className="text-text-secondary mb-4">Review the 2026 federal employment-tax baseline and the operational controls to validate before payroll processing.</p><Link className="text-blue-accent underline" href="/payroll-intelligence/2026-federal-payroll-baseline">Read the source-linked briefing</Link></div>
   </div></section>
   <aside className="max-w-6xl mx-auto px-6 pb-12 text-sm text-text-secondary">Educational reference only. Payroll law, local requirements and administrative guidance can change. Verify the governing source and effective date before making employment or tax decisions.</aside>
 </main><Footer/></>;
}
