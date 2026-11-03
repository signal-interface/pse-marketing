import type {Metadata} from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {briefings} from "@/lib/payroll-intelligence-briefings";
export const metadata:Metadata={title:"Editorial Briefings | PSE Payroll Intelligence",robots:{index:false,follow:false}};
export default function BriefingIndex(){return <><Navbar/><main className="pt-24 px-6 pb-20 max-w-5xl mx-auto min-h-screen">
<Link href="/payroll-intelligence" className="text-blue-accent underline text-sm">← Payroll Intelligence</Link>
<p className="font-mono text-sm text-steel mt-8">EDITORIAL PREVIEW · NOT PUBLISHED GUIDANCE</p><h1 className="text-4xl font-bold mt-3 mb-5">Source-backed operational briefings</h1>
<p className="text-text-secondary mb-9">Original PSE draft content for subject-matter review. Check applicable federal, state and local law before using these controls.</p>
<div className="grid md:grid-cols-2 gap-5">{briefings.map(b=><Link key={b.slug} href={`/payroll-intelligence/briefings/${b.slug}`} className="border border-border rounded-xl p-6 no-underline hover:shadow-md">
<p className="text-sm text-steel mb-2">{b.domain} · Draft</p><h2 className="text-xl font-semibold text-navy mb-3">{b.title}</h2><p className="text-text-secondary">{b.summary}</p><p className="mt-5 text-blue-accent">Open draft briefing →</p></Link>)}</div>
</main><Footer/></>}
