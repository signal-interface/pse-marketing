import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { domains } from "@/lib/payroll-intelligence";
type Props = { params: Promise<{slug:string}> };
export function generateStaticParams() { return domains.map(d=>({slug:d.slug})); }
export async function generateMetadata({params}:Props): Promise<Metadata> {
 const {slug}=await params; const d=domains.find(v=>v.slug===slug);
 return {title: d ? `${d.name} | PSE Payroll Intelligence` : "Topic not found", robots:{index:false,follow:false}};
}
export default async function DomainPage({params}:Props) {
 const {slug}=await params; const d=domains.find(v=>v.slug===slug); if(!d) notFound();
 return <><Navbar/><main className="pt-24 min-h-screen bg-ice-light px-6 pb-20"><article className="max-w-4xl mx-auto">
  <Link href="/payroll-intelligence" className="text-blue-accent underline text-sm">← All domains</Link>
  <p className="font-mono text-sm text-steel mt-10 mb-3">DOMAIN {d.id} · COVERAGE INDEX / NOT YET AN APPROVED ARTICLE</p>
  <h1 className="text-4xl font-bold text-navy mb-5">{d.name}</h1>
  <p className="text-xl text-text-secondary mb-10">{d.summary}</p>
  <div className="bg-white rounded-xl border border-border p-7 mb-8"><h2 className="text-2xl font-semibold mb-5">Subjects within this domain</h2>
    <ul className="list-disc pl-6 space-y-3 text-text-secondary">{d.topics.map(t=><li key={t}>{t}</li>)}</ul>
  </div>
  <h2 className="text-2xl font-semibold mb-4">Publication status</h2>
  <p className="text-text-secondary mb-5">This page is a framework directory entry. Detailed legal obligations, state and local variations, operational checklists and source citations require separate subject-matter review before publication as guidance.</p>
  <p className="text-text-secondary mb-6">The full framework will distinguish a rule’s jurisdiction, effective date, controlling authority, processing implications, controls and review evidence.</p>
  <Link href="/payroll-intelligence/methodology" className="text-blue-accent underline">Read the editorial methodology</Link>
 </article></main><Footer/></>;
}
