import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StateSourceExplorer from "@/components/payroll-intelligence/StateSourceExplorer";
import { stateDirectoryEntries, stateDirectoryTopics } from "@/lib/payroll-intelligence-state-directory";

export const metadata:Metadata={
 title:"State Payroll Source Directory | PSE Payroll Intelligence",
 description:"Browse an introductory official-source payroll topic for each of the 50 states and Washington, D.C. Not a comprehensive legal ruleset.",
 robots:{index:false,follow:false},
};

export default function StatePayrollSources(){
 return <><Navbar/><main className="pt-24 px-6 pb-20 min-h-screen bg-ice-light">
  <div className="max-w-6xl mx-auto">
   <Link href="/payroll-intelligence" className="text-blue-accent underline text-sm">← Payroll Intelligence</Link>
   <p className="font-mono text-sm text-steel mt-9 mb-3">STATE SOURCE DIRECTORY · EDUCATIONAL REFERENCES</p>
   <h1 className="text-4xl font-bold text-navy mb-5">Explore official state payroll sources</h1>
   <p className="text-lg text-text-secondary max-w-4xl mb-6">Find one introductory, source-linked payroll topic in each of the 50 states and Washington, D.C. These references are not complete state compliance profiles, legal conclusions, current rate tables, or instructions to configure payroll.</p>
   <aside className="bg-white border border-border rounded-xl p-6 mb-10" aria-labelledby="state-directory-guidance">
    <h2 id="state-directory-guidance" className="text-xl font-semibold mb-3">How to use these references</h2>
    <p className="text-text-secondary">Read the official source, verify the current statute or agency guidance, effective date, and the facts of the employer, worker, industry and locality. Exceptions and special authorizations can change the answer. A cited source is not a legal approval or guarantee of applicability.</p>
    <p className="text-sm text-text-secondary mt-4">Source research recorded November 3, 2026. Rule-specific legal verification and local overlays remain outstanding. Geographic coverage does not mean complete state payroll compliance coverage.</p>
    <p className="text-sm mt-4"><Link href="/payroll-intelligence/methodology" className="text-blue-accent underline">Read the editorial methodology</Link></p>
   </aside>
   <StateSourceExplorer entries={stateDirectoryEntries} topics={stateDirectoryTopics}/>
   <aside className="text-sm text-text-secondary mt-10">These materials do not publish PSE&apos;s unratified operational Final Pay seed or PSE Context Hub rules and do not make employer-specific payroll determinations.</aside>
  </div>
 </main><Footer/></>;
}
