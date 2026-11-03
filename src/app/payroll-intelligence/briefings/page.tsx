import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { briefings } from "@/lib/payroll-intelligence-briefings";
import { sourceMappedClaims } from "@/lib/payroll-intelligence-source-mappings";

const publicBriefings = briefings.filter(b=>sourceMappedClaims.some(c=>c.claimId && c.exactClaimText && c.claimId.startsWith("PSE-PI-") && c.exactClaimText && c.source && c.claimId && c.claimId === (sourceMappedClaims.find(x=>x.claimId===c.claimId)?.claimId) && c.claimId && sourceMappedClaims.some(x=>x.claimId===c.claimId && x.exactClaimText && x.source && b.keyPoints.includes(x.exactClaimText))));
export const metadata: Metadata = {
 title:"Source-linked Payroll Reference Briefings | PSE",
 description:"Original payroll educational briefings with direct references to IRS and DOL guidance, and PSE recommended assurance controls.",
};
export default function BriefingIndex(){
 return <><Navbar/><main className="pt-24 px-6 pb-20 max-w-5xl mx-auto min-h-screen">
 <Link href="/payroll-intelligence" className="text-blue-accent underline text-sm">← Payroll Intelligence</Link>
 <p className="font-mono text-sm text-steel mt-8">2026–2027 FRAMEWORK · FEDERAL SOURCE REFERENCE</p>
 <h1 className="text-4xl font-bold mt-3 mb-5">Official-source reference briefings</h1>
 <p className="text-text-secondary mb-9">These educational references link directly to official agency material. Only statements with a specific source location are displayed. Employer-specific legal duties, state rules and exceptions must be checked separately.</p>
 <div className="grid md:grid-cols-2 gap-5">{publicBriefings.map(b=><Link key={b.slug} href={`/payroll-intelligence/briefings/${b.slug}`} className="border border-border rounded-xl p-6 no-underline hover:shadow-md">
 <p className="text-sm text-steel mb-2">{b.domain} · Source-linked reference</p><h2 className="text-xl font-semibold text-navy mb-3">{b.title}</h2><p className="text-text-secondary">{b.summary}</p><p className="mt-5 text-blue-accent">Read reference →</p></Link>)}</div>
 </main><Footer/></>;
}
