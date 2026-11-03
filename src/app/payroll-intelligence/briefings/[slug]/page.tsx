import type {Metadata} from "next";
import {notFound} from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {briefings} from "@/lib/payroll-intelligence-briefings";
type Props={params:Promise<{slug:string}>};
export function generateStaticParams(){return briefings.map(b=>({slug:b.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;const b=briefings.find(v=>v.slug===slug);
 return {title:b?`${b.title} | PSE Payroll Intelligence`:"Briefing not found",robots:{index:false,follow:false}};
}
export default async function BriefingPage({params}:Props){
 const {slug}=await params;const b=briefings.find(v=>v.slug===slug);if(!b)notFound();
 return <><Navbar/><main className="pt-24 px-6 pb-20 max-w-4xl mx-auto min-h-screen"><article>
 <Link href="/payroll-intelligence/briefings" className="text-blue-accent underline text-sm">← All draft briefings</Link>
 <p className="font-mono text-sm text-steel mt-8 mb-3">{b.domain} · EDITORIAL DRAFT · SOURCE CHECK {b.checked}</p>
 <h1 className="text-4xl font-bold mb-5">{b.title}</h1><p className="text-lg text-text-secondary mb-8">{b.summary}</p>
 <h2 className="text-2xl font-semibold mb-4">Federal reference context</h2><ul className="list-disc pl-6 space-y-4 mb-9">{b.keyPoints.map(t=><li key={t}>{t}</li>)}</ul>
 <h2 className="text-2xl font-semibold mb-4">Suggested employer assurance checklist</h2>
 <ol className="list-decimal pl-6 space-y-4 mb-9">{b.controlChecklist.map(c=><li key={c}>{c}</li>)}</ol>
 <h2 className="text-2xl font-semibold mb-4">Official source register</h2>
 <ul className="space-y-4 mb-9">{b.sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-accent underline">{s.title}</a><p className="text-sm text-text-secondary">{s.relevance}</p></li>)}</ul>
 <aside className="bg-ice rounded-lg p-5 text-sm text-text-secondary">Review status: editorial draft; not legal/tax approved. This is general educational analysis, not an employer-specific legal or tax determination. Publication, reviewer identity, rule effective dates and any jurisdiction-specific exceptions must be approved before the site labels this as verified PSE guidance.</aside>
 </article></main><Footer/></>;
}
