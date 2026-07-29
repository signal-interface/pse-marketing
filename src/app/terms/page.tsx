import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | Payroll Synergy Experts",
  description:
    "Terms of Service for Payroll Synergy Experts. Review the terms governing your use of our website and services.",
};

const TOC = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "description", label: "Description of Services" },
  { id: "eligibility", label: "Eligibility" },
  { id: "acceptable-use", label: "Acceptable Use" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "confidentiality", label: "Confidentiality" },
  { id: "disclaimers", label: "Disclaimers" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "indemnification", label: "Indemnification" },
  { id: "third-party", label: "Third-Party Services" },
  { id: "governing-law", label: "Governing Law & Disputes" },
  { id: "changes", label: "Changes to These Terms" },
  { id: "termination", label: "Termination" },
  { id: "contact", label: "Contact Us" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Service",
  url: "https://www.payrollsynergyexperts.com/terms",
  publisher: {
    "@type": "Organization",
    name: "Payroll Synergy Experts",
    url: "https://www.payrollsynergyexperts.com",
  },
};

function SectionHeading({
  num,
  id,
  children,
}: {
  num: number;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-[88px] mb-5">
      <div className="flex items-center gap-3 pb-3 border-b-2 border-border">
        <span className="w-[26px] h-[26px] bg-navy text-white rounded-full flex items-center justify-center text-xs font-semibold font-mono shrink-0">
          {num}
        </span>
        <h2 className="text-[20px] font-bold text-text">{children}</h2>
      </div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        {/* Page Header */}
        <div className="bg-gradient-to-b from-ice to-white pt-[120px] pb-12 px-8">
          <div className="max-w-[820px] mx-auto">
            <span className="inline-block bg-[#dbeafe] text-blue-accent text-xs font-semibold font-mono uppercase tracking-[0.08em] px-3 py-1 rounded-full mb-4">
              Legal
            </span>
            <h1 className="text-[42px] font-bold tracking-tight text-text mb-3">
              Terms of Service
            </h1>
            <p className="font-mono text-sm text-text-tertiary">
              Effective Date: January 1, 2026 &middot; Last Updated: February
              2026
            </p>
          </div>
        </div>

        <div className="px-8 pb-24">
          <div className="max-w-[820px] mx-auto">
            {/* Table of Contents */}
            <div className="bg-ice border border-border rounded-[10px] p-7 mb-12">
              <h3 className="font-mono text-xs uppercase text-text-tertiary tracking-[0.08em] mb-4">
                Table of Contents
              </h3>
              <ol className="list-decimal list-inside space-y-2">
                {TOC.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-blue-accent no-underline hover:underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>

            {/* Acceptance Callout */}
            <div className="bg-[#dbeafe] border-l-[3px] border-blue-accent rounded-r-[6px] p-4 mb-12">
              <p className="text-sm leading-relaxed text-text">
                <strong>Please read these Terms carefully.</strong> By accessing
                or using the Payroll Synergy Experts website, you agree to be
                bound by these Terms of Service. If you do not agree, please do
                not use the Site.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              {/* Section 1 */}
              <section>
                <SectionHeading num={1} id="acceptance">
                  Acceptance of Terms
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    These Terms of Service (&ldquo;Terms&rdquo;) govern your
                    access to and use of the website located at{" "}
                    <a
                      href="https://www.payrollsynergyexperts.com"
                      className="text-blue-accent hover:underline"
                    >
                      payrollsynergyexperts.com
                    </a>{" "}
                    (the &ldquo;Site&rdquo;) and any related services, content,
                    or communications provided by Payroll Synergy Experts
                    (&ldquo;PSE,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or
                    &ldquo;us&rdquo;).
                  </p>
                  <p>
                    By accessing or using the Site &mdash; including by
                    submitting a demo request, contacting us, or simply browsing
                    &mdash; you agree to be bound by these Terms and our{" "}
                    <Link
                      href="/privacy"
                      className="text-blue-accent hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    , which is incorporated by reference. If you are accessing
                    the Site on behalf of a company or organization, you
                    represent that you have the authority to bind that entity to
                    these Terms.
                  </p>
                  <p>
                    These Terms apply to the marketing website only. Separate
                    agreements govern the use of PSE&apos;s platform, software,
                    and professional services for contracted clients.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <SectionHeading num={2} id="description">
                  Description of Services
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    PSE provides payroll compliance and benefits integration
                    services to businesses, including the CHAP AI compliance
                    intelligence platform and CHAP Guard browser extension. Our
                    services include:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 ml-1">
                    <li>
                      <strong className="text-text">
                        Payroll Processing:
                      </strong>{" "}
                      End-to-end payroll execution with real-time compliance
                      validation across federal, state, and local jurisdictions
                    </li>
                    <li>
                      <strong className="text-text">
                        Benefits Integration:
                      </strong>{" "}
                      Seamless connections between benefit providers and
                      HRIS/payroll platforms
                    </li>
                    <li>
                      <strong className="text-text">
                        Tax &amp; Compliance:
                      </strong>{" "}
                      Automated tax filing, multi-jurisdiction payroll
                      compliance, and audit documentation
                    </li>
                    <li>
                      <strong className="text-text">
                        Workforce Analytics:
                      </strong>{" "}
                      Reporting and dashboards for payroll, headcount, and labor
                      cost visibility
                    </li>
                    <li>
                      <strong className="text-text">
                        CHAP AI Platform:
                      </strong>{" "}
                      AI-powered compliance intelligence that detects statutory
                      violations, flags risks, and generates audit-ready
                      documentation
                    </li>
                  </ul>
                  <p>
                    Access to PSE&apos;s platform and services is by invitation
                    or executed service agreement only. This Site is provided for
                    informational and lead generation purposes. Submitting a demo
                    request does not constitute a binding service agreement.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <SectionHeading num={3} id="eligibility">
                  Eligibility
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    The Site is intended for use by business professionals who
                    are at least 18 years of age and have the legal capacity to
                    enter into binding agreements. By using the Site, you
                    represent and warrant that you meet these requirements.
                  </p>
                  <p>
                    The Site is not directed to consumers or individuals acting
                    in a personal, non-commercial capacity. Our services are
                    designed exclusively for businesses.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section>
                <SectionHeading num={4} id="acceptable-use">
                  Acceptable Use
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    You agree to use the Site only for lawful purposes and in
                    compliance with these Terms. You agree not to:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 ml-1">
                    <li>
                      Use the Site in any way that violates applicable local,
                      state, national, or international law or regulation
                    </li>
                    <li>
                      Transmit any unsolicited or unauthorized advertising or
                      promotional material (spam)
                    </li>
                    <li>
                      Impersonate any person or entity, or falsely state or
                      misrepresent your affiliation with any person or entity
                    </li>
                    <li>
                      Engage in any conduct that restricts or inhibits
                      anyone&apos;s use or enjoyment of the Site, or which may
                      harm PSE or users of the Site
                    </li>
                    <li>
                      Use any robot, spider, crawler, scraper, or other
                      automated means to access the Site for any purpose without
                      our express written permission
                    </li>
                    <li>
                      Attempt to gain unauthorized access to any portion of the
                      Site, other accounts, computer systems, or networks
                      connected to the Site
                    </li>
                    <li>
                      Interfere with or disrupt the integrity or performance of
                      the Site or the data contained therein
                    </li>
                    <li>
                      Submit false or misleading information through any form on
                      the Site
                    </li>
                  </ul>
                  <p>
                    We reserve the right to investigate and take appropriate
                    action against anyone who violates these provisions,
                    including removing content, blocking access, and/or reporting
                    to law enforcement.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section>
                <SectionHeading num={5} id="intellectual-property">
                  Intellectual Property
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    All content on the Site &mdash; including but not limited to
                    text, graphics, logos, icons, images, audio clips, data
                    compilations, software, and the overall design and
                    arrangement thereof &mdash; is the property of Payroll
                    Synergy Experts or its content suppliers and is protected by
                    United States and international copyright, trademark, and
                    other intellectual property laws.
                  </p>
                  <p>
                    The PSE name and logo, &ldquo;CHAP AI,&rdquo; &ldquo;CHAP
                    Guard,&rdquo; and all related product names, service marks,
                    and logos are trademarks or registered trademarks of Payroll
                    Synergy Experts. You may not use these marks without our
                    prior written consent.
                  </p>
                  <h3 className="font-semibold text-text mt-4 mb-2">
                    Limited License
                  </h3>
                  <p>
                    We grant you a limited, non-exclusive, non-transferable,
                    revocable license to access and use the Site solely for your
                    own informational and business evaluation purposes. This
                    license does not include:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 ml-1">
                    <li>
                      Reproducing, distributing, publicly displaying, or
                      creating derivative works from Site content
                    </li>
                    <li>
                      Using data mining, robots, or similar data gathering tools
                      on the Site
                    </li>
                    <li>
                      Downloading or copying account information for the benefit
                      of another party
                    </li>
                    <li>
                      Any use of the Site that generates commercial value for a
                      third party without our written consent
                    </li>
                  </ul>
                  <p>
                    Any rights not expressly granted herein are reserved by PSE.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section>
                <SectionHeading num={6} id="confidentiality">
                  Confidentiality
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    In the course of evaluating or engaging PSE services, you may
                    receive access to non-public information about PSE&apos;s
                    products, platform, roadmap, pricing, or clients
                    (&ldquo;Confidential Information&rdquo;). You agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 ml-1">
                    <li>
                      Hold Confidential Information in strict confidence using at
                      least the same degree of care you use to protect your own
                      confidential information (but no less than reasonable care)
                    </li>
                    <li>
                      Not disclose Confidential Information to any third party
                      without PSE&apos;s prior written consent
                    </li>
                    <li>
                      Use Confidential Information solely for evaluating or
                      engaging our services
                    </li>
                  </ul>
                  <p>
                    These obligations do not apply to information that is or
                    becomes publicly known through no breach of these Terms, that
                    you already knew prior to disclosure, or that you receive
                    from a third party without restriction.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section>
                <SectionHeading num={7} id="disclaimers">
                  Disclaimers
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-4">
                  {/* Amber Warning Callout */}
                  <div className="bg-amber-bg border-l-[3px] border-amber rounded-r-[6px] p-4">
                    <p className="text-sm leading-relaxed text-text">
                      <strong>Important:</strong> PSE&apos;s website and
                      platform provide compliance intelligence tools. They do
                      not constitute legal, tax, or financial advice. Always
                      consult qualified legal and tax professionals for guidance
                      specific to your situation.
                    </p>
                  </div>
                  <p className="uppercase text-xs tracking-wide">
                    THE SITE AND ALL CONTENT, INFORMATION, MATERIALS, AND
                    SERVICES PROVIDED THROUGH THE SITE ARE PROVIDED ON AN
                    &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS
                    WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED,
                    INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
                    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
                    NON-INFRINGEMENT.
                  </p>
                  <p>PSE does not warrant that:</p>
                  <ul className="list-disc list-inside space-y-1.5 ml-1">
                    <li>
                      The Site will be uninterrupted, timely, secure, or
                      error-free
                    </li>
                    <li>
                      Information on the Site is complete, accurate, or current
                    </li>
                    <li>Defects in the Site will be corrected</li>
                    <li>
                      The Site or its servers are free of viruses or other
                      harmful components
                    </li>
                  </ul>
                  <p>
                    Compliance requirements vary by jurisdiction and change
                    frequently. While our platform is designed to reflect current
                    regulations, PSE does not warrant that all content is
                    complete, accurate, or up to date for every jurisdiction.
                    Users are responsible for confirming compliance requirements
                    applicable to their specific circumstances.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section>
                <SectionHeading num={8} id="liability">
                  Limitation of Liability
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p className="uppercase text-xs tracking-wide">
                    TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO
                    EVENT SHALL PSE, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS,
                    PARTNERS, OR SUPPLIERS BE LIABLE FOR ANY INDIRECT,
                    INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                    INCLUDING BUT NOT LIMITED TO:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 ml-1">
                    <li>Loss of profits, revenue, or business</li>
                    <li>Loss of data or information</li>
                    <li>Business interruption</li>
                    <li>
                      Damages resulting from unauthorized access to or use of
                      our servers or any personal information stored therein
                    </li>
                    <li>
                      Any bugs, viruses, or the like transmitted to or through
                      the Site
                    </li>
                  </ul>
                  <p className="uppercase text-xs tracking-wide">
                    EVEN IF PSE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
                    DAMAGES.
                  </p>
                  <p className="uppercase text-xs tracking-wide">
                    IN NO EVENT SHALL PSE&apos;S TOTAL AGGREGATE LIABILITY
                    ARISING OUT OF OR RELATED TO YOUR USE OF THE SITE EXCEED ONE
                    HUNDRED DOLLARS ($100.00).
                  </p>
                  <p>
                    Note: Liability limits for contracted platform services are
                    governed by your executed service agreement with PSE, which
                    may differ from the limitations above.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section>
                <SectionHeading num={9} id="indemnification">
                  Indemnification
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    You agree to defend, indemnify, and hold harmless PSE and its
                    officers, directors, employees, agents, and partners from and
                    against any claims, liabilities, damages, judgments, awards,
                    losses, costs, expenses, or fees (including reasonable
                    attorneys&apos; fees) arising out of or relating to:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 ml-1">
                    <li>Your violation of these Terms</li>
                    <li>
                      Your use of the Site or any content obtained from the Site
                    </li>
                    <li>
                      Your violation of any third-party rights, including
                      intellectual property rights or privacy rights
                    </li>
                    <li>
                      Any content you submit through forms or other interactive
                      features on the Site
                    </li>
                  </ul>
                  <p>
                    PSE reserves the right to assume exclusive defense and
                    control of any matter otherwise subject to indemnification by
                    you, and you agree to cooperate with PSE&apos;s defense of
                    such claims.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section>
                <SectionHeading num={10} id="third-party">
                  Third-Party Services
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    The Site may contain links to third-party websites or
                    reference third-party services. These links are provided for
                    your convenience and informational purposes only. PSE has no
                    control over the content, privacy policies, or practices of
                    any third-party sites or services and accepts no
                    responsibility for them.
                  </p>
                  <p>
                    PSE&apos;s platform integrates with third-party payroll and
                    HRIS platforms (such as UKG and ADP). Integration with these
                    services is governed by the applicable third-party terms of
                    service. PSE is not affiliated with, endorsed by, or an agent
                    of these platforms unless expressly stated in a written
                    agreement.
                  </p>
                  <p>
                    References to third-party products, services, or companies on
                    this Site do not constitute endorsement by PSE.
                  </p>
                </div>
              </section>

              {/* Section 11 */}
              <section>
                <SectionHeading num={11} id="governing-law">
                  Governing Law &amp; Disputes
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    These Terms shall be governed by and construed in accordance
                    with the laws of the{" "}
                    <strong className="text-text">State of New York</strong>,
                    without regard to its conflict of law provisions.
                  </p>
                  <h3 className="font-semibold text-text mt-4 mb-2">
                    Dispute Resolution
                  </h3>
                  <p>
                    In the event of any dispute arising out of or relating to
                    these Terms or your use of the Site, the parties agree to
                    first attempt to resolve the dispute through good faith
                    negotiation. If the dispute cannot be resolved through
                    negotiation within 30 days, either party may pursue the
                    matter through binding arbitration administered by the
                    American Arbitration Association (AAA) under its Commercial
                    Arbitration Rules.
                  </p>
                  <p>
                    Any arbitration shall be conducted on an individual basis and
                    not as a class action or representative proceeding. You waive
                    any right to participate in a class action lawsuit or
                    class-wide arbitration related to your use of the Site.
                  </p>
                  <p>
                    Notwithstanding the foregoing, either party may seek
                    injunctive or other equitable relief in a court of competent
                    jurisdiction to prevent the actual or threatened
                    infringement, misappropriation, or violation of a
                    party&apos;s copyrights, trademarks, trade secrets, patents,
                    or other intellectual property rights.
                  </p>
                </div>
              </section>

              {/* Section 12 */}
              <section>
                <SectionHeading num={12} id="changes">
                  Changes to These Terms
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary">
                  <p>
                    We reserve the right to modify these Terms at any time. When
                    we make material changes, we will update the &ldquo;Last
                    Updated&rdquo; date at the top of this page. Your continued
                    use of the Site after any changes constitutes your acceptance
                    of the revised Terms. If you do not agree to the revised
                    Terms, you must stop using the Site.
                  </p>
                </div>
              </section>

              {/* Section 13 */}
              <section>
                <SectionHeading num={13} id="termination">
                  Termination
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    PSE reserves the right, in its sole discretion, to terminate
                    or suspend your access to the Site at any time, for any
                    reason, without notice or liability, including if we
                    reasonably believe that you have violated these Terms.
                  </p>
                  <p>
                    Upon termination, all provisions of these Terms that by their
                    nature should survive termination shall survive, including
                    intellectual property provisions, warranty disclaimers,
                    indemnification, and limitations of liability.
                  </p>
                </div>
              </section>

              {/* Section 14 */}
              <section>
                <SectionHeading num={14} id="contact">
                  Contact Us
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    <strong className="text-text">Email:</strong>{" "}
                    <a
                      href="mailto:info@payrollsynergyexperts.com"
                      className="text-blue-accent hover:underline"
                    >
                      info@payrollsynergyexperts.com
                    </a>
                  </p>
                  <p>
                    <strong className="text-text">Website:</strong>{" "}
                    <Link href="/" className="text-blue-accent hover:underline">
                      payrollsynergyexperts.com
                    </Link>
                  </p>
                  <p>
                    These Terms of Service constitute the entire agreement
                    between you and PSE regarding the use of the Site and
                    supersede all prior agreements and understandings.
                  </p>
                </div>
              </section>
            </div>

            {/* Contact Card */}
            <div className="bg-navy text-white rounded-[10px] p-8 text-center mt-12">
              <h3 className="text-xl font-bold mb-2">Legal questions?</h3>
              <p className="text-steel-muted text-sm mb-5">
                Our team is happy to clarify any aspect of these Terms before you
                engage with our services.
              </p>
              <a
                href="mailto:info@payrollsynergyexperts.com"
                className="inline-block px-6 py-2.5 rounded-md text-sm font-semibold bg-white text-navy hover:bg-ice transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
