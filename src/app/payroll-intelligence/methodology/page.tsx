import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
export const metadata:Metadata={title:"Sources & Editorial Methodology | PSE Payroll Intelligence",description:"How PSE evaluates official sources, authors original educational payroll guidance, and issues corrections."};
export default function MethodologyPage(){return <><Navbar/><main className="pt-24 px-6 pb-20 max-w-4xl mx-auto min-h-screen">
 <Link href="/payroll-intelligence" className="text-blue-accent underline text-sm">← Payroll Intelligence</Link>
 <h1 className="text-4xl font-bold mt-9 mb-6">Editorial methodology</h1>
 <p className="text-lg text-text-secondary mb-8">PSE publishes independently authored payroll education with links to primary sources and explicit jurisdictional limitations. Source citation does not replace an employer-specific legal or tax review.</p>
 <h2 className="text-2xl font-semibold mb-3">Source priority</h2><p className="mb-7">Federal, state and local agencies, statutes, regulations and official administrative guidance take priority. Secondary commentary is supporting context, not a substitute for authority. Conflicting sources require escalation.</p>
 <h2 className="text-2xl font-semibold mb-3">Verification and publication</h2><ol className="list-decimal pl-6 space-y-3 mb-7">
 <li>Identify the rule, affected workers or employers, jurisdiction, effective date and original source.</li>
 <li>Draft an original interpretation and map it to payroll inputs, outputs, preventive controls and review evidence.</li>
 <li>Obtain payroll subject-matter review and, where appropriate, independent legal or tax review.</li>
 <li>Approve and version the article; retain citations, editorial decision and change log.</li>
 <li>Publish quarterly updates plus material interim corrections, without silently rewriting historical editions.</li>
 </ol>
 <h2 className="text-2xl font-semibold mb-3">Editorial states</h2><p className="mb-7">Directory entry, draft, under review, verified, published, superseded, and withdrawn are distinct states. A domain title does not establish complete legal coverage. New proposals are not labeled effective law.</p>
 <h2 className="text-2xl font-semibold mb-3">Corrections and limitations</h2><p className="mb-7">Material corrections should identify the superseded position, reason, publication date and the source of the correction. Content is general education, not individualized legal or tax advice. Verify current law for the relevant jurisdiction.</p>
 <p className="text-sm text-text-secondary">The framework uses the subject coverage of a photographed historical payroll reference only as a planning baseline; it does not reproduce or claim affiliation with that publication.</p>
 </main><Footer/></>;}
