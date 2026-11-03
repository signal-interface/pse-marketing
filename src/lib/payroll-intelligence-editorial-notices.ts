import { claimTriage, type ClaimLane } from "./payroll-intelligence-claim-triage";
import { sourceMappedClaims } from "./payroll-intelligence-source-mappings";

/** Founder-authorized publication of educational context only.
 * This is not legal-source certification or human legal/tax signoff.
 */
type QualifiedLane = Exclude<ClaimLane, "legal-assertion">;
type NoticeDraft = { wording: string; source?: { label: string; url: string } };
export type EditorialNotice = {
  claimId: string;
  domainId: string;
  lane: QualifiedLane;
  heading: string;
  wording: string;
  source?: { label: string; url: string };
  publicationScope: "educational-context-only";
  qualifiedLegalReview: false;
};

const edits: Record<string, NoticeDraft[]> = {
  "2026-federal-withholding-control-review": [
    {wording:"Employers and their designated payroll providers are responsible for applying the withholding rules relevant to the payroll. PSE's resource explains assurance checks rather than acting as the payroll system of record."},
  ],
  "flsa-recordkeeping-control-baseline": [
    {wording:"Federal FLSA retention periods are not universal destruction dates. IRS employment-tax, state, contractual and legal-hold requirements may require longer retention.",source:{label:"IRS employment tax recordkeeping",url:"https://www.irs.gov/businesses/small-businesses-self-employed/employment-tax-recordkeeping"}},
  ],
  "2026-worker-classification-federal-tax": [
    {wording:"A federal tax classification does not automatically resolve classification under wage-and-hour or individual state laws. Review the applicable legal test separately."},
  ],
  "flsa-regular-rate-assurance": [
    {wording:"Federal overtime guidance is a starting point. State and local requirements or collective bargaining terms may require a separate, more protective analysis."},
  ],
  "2026-health-fsa-pretax-review": [
    {wording:"The applicable plan document, plan year, eligibility and cafeteria-plan rules must be reviewed independently of whether payroll deductions reconcile to elections."},
  ],
  "payday-frequency-review": [
    {wording:"The U.S. DOL state payday comparison is a historical table last revised January 1, 2023, not a current determination for an employer.",source:{label:"U.S. DOL historical payday table",url:"https://www.dol.gov/agencies/whd/state/payday"}},
    {wording:"Pay frequency and termination wage deadlines need current state labor-agency verification for the employer's location, workforce and circumstances."},
  ],
  "unemployment-tax-review": [
    {wording:"Federal unemployment tax guidance does not determine state unemployment account registrations, rates, wage bases or employer notice obligations."},
    {wording:"Verify employer-specific SUTA notices and current state agency instructions before applying unemployment settings."},
  ],
  "garnishment-review": [
    {wording:"Garnishment requirements depend on the order type and jurisdiction. Federal summaries do not resolve every state restriction, child support order or tax levy."},
  ],
  "payroll-accounting-assurance": [
    {wording:"The IRS recordkeeping framework does not prescribe one universal payroll general-ledger reconciliation design. PSE accounting controls are operational recommendations."},
  ],
  "payroll-technology-controls": [
    {wording:"The NIST Cybersecurity Framework is generally voluntary and is not, by itself, a payroll statute or proof of regulatory compliance. Specific entities may face separate requirements.",source:{label:"NIST Cybersecurity Framework FAQ",url:"https://www.nist.gov/cyberframework/faqs"}},
    {wording:"Security and technology assurance checks must be considered alongside the employer's actual legal, contractual and sector obligations."},
  ],
  "payroll-leadership-controls": [
    {wording:"PSE's suggested staffing, exception monitoring and review accountability controls are original management recommendations, not mandatory controls imposed by the cited agency."},
    {wording:"Payroll operating practices should be adapted to the employer's jurisdictions, scale, systems and service model; they do not establish independent legal compliance."},
  ],
  "international-payroll-assessment": [
    {wording:"U.S. individual income-tax guidance does not determine an employer's foreign withholding, employment law or social insurance obligations.",source:{label:"IRS Publication 54 (12/2025), individual tax abroad",url:"https://www.irs.gov/publications/p54"}},
    {wording:"Cross-border payroll requires country-specific authority, treaty and social-security review based on the worker, employing entity, assignment and location."},
  ],
  "payroll-competency-model": [
    {wording:"IRS employment-tax resources describe tax requirements, not independent professional credential standards. Consult the relevant credentialing organization for certification rules.",source:{label:"IRS Employment Taxes resources",url:"https://www.irs.gov/businesses/small-businesses-self-employed/employment-taxes"}},
    {wording:"PSE competency exercises and continuing-learning suggestions are educational practices; do not treat them as mandatory legal qualifications."},
  ],
};

const heading: Record<QualifiedLane, string> = {
  "jurisdictional-limitation":"Jurisdiction and applicability",
  "source-limitation":"About this source",
  "pse-control-recommendation":"PSE recommended practice",
};

export const editorialNotices: readonly EditorialNotice[] = (() => {
  const mapped = new Set(sourceMappedClaims.map(s=>s.claimId));
  const counter = new Map<string,number>();
  const results = claimTriage.filter(c=>!mapped.has(c.claimId)).map(c=>{
    if(c.lane==="legal-assertion")throw Error("Unmapped legal assertion cannot be released as context");
    const position=counter.get(c.briefingSlug)??0;
    counter.set(c.briefingSlug,position+1);
    const entry=edits[c.briefingSlug]?.[position];
    if(!entry || !entry.wording.trim())throw Error(`Missing educational qualification for ${c.briefingSlug} / ${position}`);
    return {
      claimId:c.claimId,
      domainId:c.domainId,
      lane:c.lane,
      heading:heading[c.lane],
      wording:entry.wording,
      ...(entry.source?{source:entry.source}:{}),
      publicationScope:"educational-context-only" as const,
      qualifiedLegalReview:false as const,
    };
  });
  for(const [slug,items] of Object.entries(edits)){
    if(counter.get(slug)!==items.length)throw Error(`Unmatched notice entries for ${slug}`);
  }
  return results;
})();

export const noticesByDomain = (domainId:string):readonly EditorialNotice[] =>
  editorialNotices.filter(n=>n.domainId===domainId);
