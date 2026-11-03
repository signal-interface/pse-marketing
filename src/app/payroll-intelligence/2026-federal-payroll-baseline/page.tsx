import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
export const metadata:Metadata={title:"2026 Federal Payroll Baseline | PSE",robots:{index:false,follow:false}};
export default function FederalBaseline(){return <><Navbar/><main className="pt-24 px-6 pb-20 max-w-4xl mx-auto min-h-screen"><article>
 <Link href="/payroll-intelligence" className="text-sm underline text-blue-accent">← Payroll Intelligence</Link>
 <p className="font-mono text-sm text-steel mt-9 mb-3">2026 FEDERAL REFERENCE · EDITORIAL PREVIEW · NOT APPROVED FOR PUBLICATION</p>
 <h1 className="text-4xl font-bold mb-6">2026 federal employment-tax baseline</h1>
 <p className="text-lg text-text-secondary mb-8">The IRS 2026 Employer's Tax Guide is a starting point for wage withholding, employer taxes, payroll deposits and recordkeeping. This briefing separates a current federal reference from the controls needed to apply it correctly.</p>
 <h2 className="text-2xl font-semibold mb-4">IRS-published 2026 figures</h2>
 <div className="overflow-x-auto mb-8"><table className="w-full text-left border-collapse"><thead><tr className="border-b"><th className="p-3">Measure</th><th className="p-3">2026 value</th></tr></thead><tbody>
 <tr className="border-b"><td className="p-3">Social Security wage base</td><td className="p-3">$184,500</td></tr>
 <tr className="border-b"><td className="p-3">Social Security tax rate</td><td className="p-3">6.2% employee + 6.2% employer</td></tr>
 <tr className="border-b"><td className="p-3">Medicare tax rate</td><td className="p-3">1.45% employee + 1.45% employer; no wage base limit</td></tr>
 <tr className="border-b"><td className="p-3">Additional Medicare Tax withholding</td><td className="p-3">0.9% on employee wages over $200,000 in the year</td></tr>
 </tbody></table></div>
 <p className="text-sm mb-8">Source: <a className="text-blue-accent underline" href="https://www.irs.gov/publications/p15" target="_blank" rel="noopener noreferrer">IRS Publication 15 (2026), sections 5 and 16</a>. Figures are federal only and must not be carried over to 2027 without fresh verification.</p>
 <h2 className="text-2xl font-semibold mb-3">Payroll validation and oversight checklist</h2>
 <ol className="list-decimal pl-6 space-y-3 mb-8"><li>Confirm pay date and applicable tax year before applying a wage-base threshold.</li><li>Verify taxable wage classifications and year-to-date balances by employee and employer.</li><li>Use the current <a className="underline text-blue-accent" href="https://www.irs.gov/publications/p15t">IRS Publication 15-T</a> and employee withholding certificates for federal income tax withholding.</li><li>Reconcile calculated liabilities, deposit schedule and quarterly employment tax returns before approval.</li><li>Retain rate-table version, calculation evidence, reviewer approval and correction trail according to applicable retention rules.</li></ol>
 <h2 className="text-2xl font-semibold mb-3">2026 overtime-tax distinction</h2><p className="mb-7">The IRS identifies a qualified overtime deduction for eligible individuals for tax years 2025–2028, subject to conditions. That is not a blanket exemption from payroll withholding or employment taxes; covered overtime wages remain subject to applicable tax treatment. Review the relevant IRS guidance and Form W-4 procedures before implementing any employee-specific changes.</p>
 <h2 className="text-2xl font-semibold mb-3">Sources and review status</h2><ul className="list-disc pl-6 space-y-2 mb-8"><li><a className="underline text-blue-accent" href="https://www.irs.gov/publications/p15">IRS Publication 15, 2026</a></li><li><a className="underline text-blue-accent" href="https://www.irs.gov/publications/p15t">IRS Publication 15-T</a></li></ul>
 <p className="text-sm text-text-secondary border-t pt-5">Initial official-source check: November 3, 2026. PSE editorial and legal/tax approval: pending. This draft is not approved public guidance.</p>
 </article></main><Footer/></>;}
