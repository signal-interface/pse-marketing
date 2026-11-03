import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { briefings } from "@/lib/payroll-intelligence-briefings";
import { sourceMappedClaims } from "@/lib/payroll-intelligence-source-mappings";

type Props={params:Promise<{slug:string}>};
const located=(slug:string)=>{const b=briefings.find(x=>x.slug===slug);return b?sourceMappedClaims.filter(c=>b.keyPoints.includes(c.exactClaimText)):[]};
export function generateStaticParams(){return briefings.filter(b=>located(b.slug).length>0).map(b=>({slug:b.slug}));}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;const b=briefings.find(x=>x.slug===slug);
 return b&&located(slug).length?{title:`${b.title} | PSE Payroll Intelligence`,description:"Federal source-linked payroll education and PSE suggested assurance controls."}:{title:"Reference unavailable",robots:{index:false,follow:false}};
}
export default async function BriefingPage({params}:Props){
 const {slug}=await params;const b=briefings.find(v=>v.slug===slug),claims=located(slug);
 if(!b||claims.length===0)notFound();
 return <><Navbar/><main className="pt-24 px-6 pb-20 max-w-4xl mx-auto min-h-screen"><article>
 <Link href="/payroll-intelligence/briefings" className="text-blue-accent underline text-sm">← All reference briefings</Link>
 <p className="font-mono text-sm text-steel mt-8 mb-3">{b.domain} · 2026 SOURCE-LINKED REFERENCE</p>
 <h1 className="text-4xl font-bold mb-5">{b.title}</h1>
 <p className="text-lg text-text-secondary mb-8">{b.summary}</p>
 <h2 className="text-2xl font-semibold mb-4">Federal source context</h2>
 <ol className="list-decimal pl-6 space-y-6 mb-9">{claims.map(c=><li key={c.claimId}>
 <p>{c.exactClaimText}</p>
 <p className="text-sm text-text-secondary mt-2">Authority: <a className="underline text-blue-accent" href={c.source!.url} target="_blank" rel="noopener noreferrer">{c.source!.title}</a> — {c.source!.pinpoint}.</p>
 </li>)}</ol>
 <h2 className="text-2xl font-semibold mb-4">PSE suggested employer assurance checks</h2>
 <p className="text-text-secondary mb-4">These are independently authored practices, not additional requirements mandated by the cited agencies.</p>
 <ol className="list-decimal pl-6 space-y-4 mb-9">{b.controlChecklist.map(c=><li key={c}>{c}</li>)}</ol>
 <aside className="bg-ice rounded-lg p-5 text-sm text-text-secondary">
 Educational reference; not individualized legal or tax advice, a guarantee of compliance or confirmation of applicability. Official references were initially researched November 3, 2026. Verify current controlling authority, effective dates, exceptions and state/local requirements before acting. The 2027 edition will be reviewed separately as rules become available.
 </aside><section aria-labelledby="discuss-payroll-controls" className="mt-10 rounded-xl border border-border bg-ice p-6"><h2 id="discuss-payroll-controls" className="text-xl font-semibold mb-3">Discuss your payroll controls</h2><p className="text-text-secondary mb-4">Explore how PSE can help review your organization’s payroll governance and assurance needs. This educational briefing does not determine your specific compliance obligations.</p><Link href="/#demo" className="text-blue-accent font-semibold underline">Request a payroll governance demo</Link></section></article></main><Footer/></>;
}
