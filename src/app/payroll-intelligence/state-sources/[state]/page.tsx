import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { stateSourceIntake } from "@/lib/payroll-intelligence-state-research";
import { stateBriefings } from "@/lib/payroll-intelligence-state-briefings";
import { additionalStateBriefings } from "@/lib/payroll-intelligence-state-expansion";
import { furtherStateBriefings } from "@/lib/payroll-intelligence-state-batch03";
import { stateBatch04Briefings } from "@/lib/payroll-intelligence-state-batch04";
const allBriefings = [...stateBriefings, ...additionalStateBriefings, ...furtherStateBriefings, ...stateBatch04Briefings];

type Props = { params: Promise<{state: string}> };
export function generateStaticParams(){return allBriefings.map(b=>({state:b.state.toLowerCase()}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {state}=await params;
 const b=allBriefings.find(x=>x.state.toLowerCase()===state.toLowerCase());
 const s=stateSourceIntake.find(x=>x.state===b?.state) ?? additionalStateBriefings.find(x=>x.state===b?.state) ?? furtherStateBriefings.find(x=>x.state===b?.state) ?? stateBatch04Briefings.find(x=>x.state===b?.state);
 return {title:b&&s?`${s.stateName}: ${b.topic} | PSE Payroll Intelligence`:"Briefing not found",
 description:"Source-linked state payroll educational briefing; employer applicability and local exceptions require separate verification.",
 robots:{index:false,follow:false}};
}
export default async function StateBriefingPage({params}:Props){
 const {state}=await params;
 const b=allBriefings.find(x=>x.state.toLowerCase()===state.toLowerCase());
 const s=stateSourceIntake.find(x=>x.state===b?.state) ?? additionalStateBriefings.find(x=>x.state===b?.state) ?? furtherStateBriefings.find(x=>x.state===b?.state) ?? stateBatch04Briefings.find(x=>x.state===b?.state);
 if(!b||!s)notFound();
 return <><Navbar/><main className="pt-24 pb-20 px-6 bg-ice-light min-h-screen"><article className="max-w-4xl mx-auto">
 <Link href="/payroll-intelligence/state-sources" className="text-sm text-blue-accent underline">← State source directory</Link>
 <p className="mt-9 mb-3 text-sm font-mono text-steel">2026 REGULATORY REFERENCE · STATE {b.state}</p>
 <h1 className="text-4xl font-bold mb-5 text-navy">{s.stateName}: {b.topic}</h1>
 <p className="text-lg text-text-secondary mb-8">An original PSE educational summary of one selected rule or official state agency explanation. This is not a complete state payroll compliance profile.</p>
 <section className="bg-white border border-border rounded-xl p-7 mb-7" aria-labelledby="source-summary">
 <h2 id="source-summary" className="text-2xl font-semibold mb-4">What the official source describes</h2>
 <p className="text-text-secondary leading-relaxed mb-5">{b.finding}</p>
 <p className="text-sm text-text-secondary">Legal or agency pinpoint: {b.pinpoint}</p>
 <p className="text-sm mt-3"><a className="text-blue-accent underline" target="_blank" rel="noopener noreferrer" href={b.sourceUrl}>{b.sourceTitle}</a></p>
 </section>
 <section className="bg-white border border-border rounded-xl p-7 mb-7" aria-labelledby="scope-caveats">
 <h2 id="scope-caveats" className="text-2xl font-semibold mb-4">Applicability and exceptions to check</h2>
 <p className="text-text-secondary leading-relaxed">{b.caution}</p>
 <p className="text-sm text-text-secondary mt-5">Source reviewed: {b.checkedOn} · Topic: {b.topic}</p>
 </section>
 <aside className="text-sm text-text-secondary border-l-2 border-steel-200 pl-4">
 This material is general payroll education, not individualized legal or tax advice, certification or a guarantee of compliance. Verify the current controlling authority and relevant facts before applying any requirement. These summaries are separate from operational PSE Context Hub approvals.
 </aside>
 <p className="mt-10"><Link href="/payroll-intelligence/methodology" className="text-blue-accent underline">Review our editorial methodology</Link></p>
 </article></main><Footer/></>;
}
