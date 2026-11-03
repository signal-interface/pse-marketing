import type {Metadata} from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
export const metadata:Metadata={title:"Quarterly Releases | PSE Payroll Intelligence",robots:{index:false,follow:false}};
const releases=[
 {period:"2026-Q4",name:"Inaugural edition",state:"Planned / awaiting review",details:"Original domain taxonomy, source register and first approved operational briefings."},
 {period:"2027-Q1",name:"January 2027 edition",state:"Scheduled / not verified",details:"New-year employment tax and wage-hour changes; target January 15, 2027."},
 {period:"2027-Q2",name:"April 2027 edition",state:"Scheduled / not verified",details:"Quarterly update and correction log; target April 15, 2027."},
 {period:"2027-Q3",name:"July 2027 edition",state:"Scheduled / not verified",details:"Midyear jurisdictional changes; target July 15, 2027."},
 {period:"2027-Q4",name:"October 2027 edition",state:"Scheduled / not verified",details:"Year-end compliance readiness; target October 15, 2027."},
];
export default function UpdatesPage(){return <><Navbar/><main className="pt-24 px-6 pb-20 max-w-4xl mx-auto min-h-screen">
 <Link href="/payroll-intelligence" className="text-blue-accent underline text-sm">← Payroll Intelligence</Link>
 <h1 className="text-4xl font-bold mt-9 mb-4">Quarterly publication plan</h1><p className="text-text-secondary mb-10">These are planned releases, not a claim of completed reviews, published editions or confirmed 2027 tax values. Material regulatory changes will be tracked separately between quarters.</p>
 <div className="space-y-4">{releases.map(r=><section key={r.period} className="rounded-xl border border-border p-6">
 <p className="font-mono text-sm text-steel mb-2">{r.period} · {r.state}</p><h2 className="text-xl font-semibold mb-2">{r.name}</h2><p className="text-text-secondary">{r.details}</p></section>)}</div>
 <p className="mt-8 text-sm text-text-secondary">A published release will include changed content IDs, authorities, jurisdiction, effective dates, reviewer decisions and an archived snapshot.</p>
 </main><Footer/></>;}
