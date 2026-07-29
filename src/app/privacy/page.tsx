import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | Payroll Synergy Experts",
  description:
    "Privacy Policy for Payroll Synergy Experts. Learn how we collect, use, and protect your information.",
};

const TOC = [
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use", label: "How We Use Your Information" },
  { id: "sharing-disclosure", label: "Information Sharing & Disclosure" },
  { id: "data-retention", label: "Data Retention" },
  { id: "security", label: "Security" },
  { id: "your-rights", label: "Your Rights & Choices" },
  { id: "cookies", label: "Cookies & Tracking" },
  { id: "third-party-links", label: "Third-Party Links" },
  { id: "childrens-privacy", label: "Children's Privacy" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact Us" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy",
  url: "https://www.payrollsynergyexperts.com/privacy",
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

export default function PrivacyPage() {
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
              Privacy Policy
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

            {/* Summary Callout */}
            <div className="bg-[#dbeafe] border-l-[3px] border-blue-accent rounded-r-[6px] p-4 mb-12">
              <p className="text-sm leading-relaxed text-text">
                Payroll Synergy Experts collects limited information through this
                website &mdash; primarily through our demo request form and
                analytics. We do not sell your personal information. We use your
                data only to operate our services and communicate with you.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-10">
              {/* Section 1 */}
              <section>
                <SectionHeading num={1} id="information-we-collect">
                  Information We Collect
                </SectionHeading>
                <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
                  <div>
                    <h3 className="font-semibold text-text mb-2">
                      Information You Provide
                    </h3>
                    <p className="mb-3">
                      When you submit our demo request form or otherwise contact
                      us, we may collect:
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 ml-1">
                      <li>
                        <strong className="text-text">
                          Contact information:
                        </strong>{" "}
                        Full name, work email address, and phone number
                      </li>
                      <li>
                        <strong className="text-text">
                          Company information:
                        </strong>{" "}
                        Company name, job title, and company size (employee count
                        range)
                      </li>
                      <li>
                        <strong className="text-text">
                          Message content:
                        </strong>{" "}
                        Any additional information you choose to include in your
                        inquiry
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text mb-2">
                      Information Collected Automatically
                    </h3>
                    <p className="mb-3">
                      When you visit the Site, certain information is collected
                      automatically, including:
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 ml-1">
                      <li>
                        <strong className="text-text">Log data:</strong> IP
                        address, browser type and version, operating system,
                        referring URLs, pages visited, and timestamps
                      </li>
                      <li>
                        <strong className="text-text">Device data:</strong>{" "}
                        Device type, screen resolution, and hardware identifiers
                        where applicable
                      </li>
                      <li>
                        <strong className="text-text">Usage data:</strong>{" "}
                        Clickstream data, session duration, and navigation
                        patterns
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-text mb-2">
                      Information from Third Parties
                    </h3>
                    <p>
                      We may receive limited information about you from
                      third-party services we use to operate the Site, such as
                      form processing and analytics providers. We do not purchase
                      contact lists or acquire personal data from data brokers.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <SectionHeading num={2} id="how-we-use">
                  How We Use Your Information
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    We use the information we collect for the following purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 ml-1">
                    <li>
                      <strong className="text-text">
                        Responding to inquiries:
                      </strong>{" "}
                      To respond to demo requests, answer questions, and provide
                      information about our services
                    </li>
                    <li>
                      <strong className="text-text">
                        Service communications:
                      </strong>{" "}
                      To send you relevant updates about PSE&apos;s services,
                      platform availability, or your account (where applicable)
                    </li>
                    <li>
                      <strong className="text-text">Site operations:</strong> To
                      monitor, maintain, and improve the performance and
                      security of the Site
                    </li>
                    <li>
                      <strong className="text-text">Analytics:</strong> To
                      understand how visitors use the Site so we can improve
                      content and user experience
                    </li>
                    <li>
                      <strong className="text-text">
                        Legal compliance:
                      </strong>{" "}
                      To comply with applicable laws, regulations, and legal
                      processes
                    </li>
                    <li>
                      <strong className="text-text">
                        Fraud prevention:
                      </strong>{" "}
                      To detect, investigate, and prevent fraudulent
                      transactions and abuse
                    </li>
                  </ul>
                  <p>
                    We do not use your information for automated decision-making
                    or profiling that produces legal or similarly significant
                    effects on you.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <SectionHeading num={3} id="sharing-disclosure">
                  Information Sharing &amp; Disclosure
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    We do not sell, rent, or trade your personal information to
                    third parties for their marketing purposes. We may share your
                    information in limited circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 ml-1">
                    <li>
                      <strong className="text-text">
                        Service providers:
                      </strong>{" "}
                      We share information with vendors who help us operate the
                      Site and deliver our services (e.g., form processing,
                      email delivery, and analytics). These providers are bound
                      by contractual obligations to protect your data and are
                      prohibited from using it for their own purposes.
                    </li>
                    <li>
                      <strong className="text-text">
                        Business transfers:
                      </strong>{" "}
                      If PSE is involved in a merger, acquisition, or sale of
                      assets, your information may be transferred as part of
                      that transaction. We will notify you via the email address
                      on file or a prominent notice on the Site.
                    </li>
                    <li>
                      <strong className="text-text">
                        Legal requirements:
                      </strong>{" "}
                      We may disclose information if required by law, court
                      order, or governmental authority, or where we believe
                      disclosure is necessary to protect our rights, your
                      safety, or the safety of others.
                    </li>
                    <li>
                      <strong className="text-text">
                        With your consent:
                      </strong>{" "}
                      We may share information for any other purpose with your
                      explicit consent.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section>
                <SectionHeading num={4} id="data-retention">
                  Data Retention
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    We retain personal information for as long as necessary to
                    fulfill the purposes for which it was collected, including to
                    respond to your inquiry, maintain our business records, and
                    comply with legal obligations.
                  </p>
                  <p>Specifically:</p>
                  <ul className="list-disc list-inside space-y-1.5 ml-1">
                    <li>
                      <strong className="text-text">
                        Demo request data
                      </strong>{" "}
                      is retained for up to 24 months from last contact, or
                      until you request deletion
                    </li>
                    <li>
                      <strong className="text-text">Analytics data</strong> is
                      retained in aggregate, anonymized form and is not linked
                      to identifiable individuals after 13 months
                    </li>
                    <li>
                      <strong className="text-text">Server log data</strong> is
                      retained for up to 90 days for security and operational
                      purposes
                    </li>
                  </ul>
                  <p>
                    When information is no longer needed, we securely delete or
                    anonymize it in accordance with our data retention schedule.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section>
                <SectionHeading num={5} id="security">
                  Security
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    We implement and maintain reasonable administrative,
                    technical, and physical safeguards designed to protect your
                    information against unauthorized access, disclosure,
                    alteration, and destruction. These measures include:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 ml-1">
                    <li>
                      TLS/HTTPS encryption for all data transmitted to and from
                      the Site
                    </li>
                    <li>
                      Access controls limiting personal data access to
                      authorized personnel on a need-to-know basis
                    </li>
                    <li>
                      Regular review of our security practices and vendor
                      security posture
                    </li>
                  </ul>
                  <p>
                    No method of transmission over the Internet or electronic
                    storage is 100% secure. While we strive to protect your
                    information, we cannot guarantee absolute security. In the
                    event of a data breach that affects your rights and freedoms,
                    we will notify affected individuals as required by applicable
                    law.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section>
                <SectionHeading num={6} id="your-rights">
                  Your Rights &amp; Choices
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    Depending on your location, you may have certain rights
                    regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 ml-1">
                    <li>
                      <strong className="text-text">Access:</strong> The right
                      to request a copy of the personal information we hold
                      about you
                    </li>
                    <li>
                      <strong className="text-text">Correction:</strong> The
                      right to request correction of inaccurate or incomplete
                      information
                    </li>
                    <li>
                      <strong className="text-text">Deletion:</strong> The right
                      to request deletion of your personal information, subject
                      to certain exceptions
                    </li>
                    <li>
                      <strong className="text-text">Portability:</strong> The
                      right to receive your data in a structured,
                      machine-readable format
                    </li>
                    <li>
                      <strong className="text-text">
                        Objection / Restriction:
                      </strong>{" "}
                      The right to object to or restrict certain processing of
                      your information
                    </li>
                    <li>
                      <strong className="text-text">
                        Withdraw consent:
                      </strong>{" "}
                      Where processing is based on consent, the right to
                      withdraw it at any time
                    </li>
                  </ul>
                  <p>
                    Residents of California have additional rights under the
                    California Consumer Privacy Act (CCPA/CPRA), including the
                    right to know what personal information is collected, the
                    right to opt out of sale (we do not sell personal
                    information), and the right to non-discrimination for
                    exercising these rights.
                  </p>
                  <p>
                    To exercise any of these rights, contact us at{" "}
                    <a
                      href="mailto:info@payrollsynergyexperts.com"
                      className="text-blue-accent hover:underline"
                    >
                      info@payrollsynergyexperts.com
                    </a>
                    . We will respond within 30 days (or within applicable
                    statutory timeframes). We may need to verify your identity
                    before fulfilling a request.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section>
                <SectionHeading num={7} id="cookies">
                  Cookies &amp; Tracking
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-3">
                  <p>
                    Our Site may use cookies and similar tracking technologies:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 ml-1">
                    <li>
                      <strong className="text-text">
                        Essential cookies:
                      </strong>{" "}
                      Required for basic site functionality. These cannot be
                      disabled.
                    </li>
                    <li>
                      <strong className="text-text">
                        Analytics cookies:
                      </strong>{" "}
                      Help us understand how visitors interact with the Site
                      (e.g., pages visited, session duration). Data collected is
                      aggregated and used only for site improvement.
                    </li>
                  </ul>
                  <p>
                    You can control or disable cookies through your browser
                    settings. We do not use advertising, tracking, or retargeting
                    cookies. We do not respond to &ldquo;Do Not Track&rdquo;
                    browser signals at this time, as no universal standard for
                    interpreting such signals currently exists.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section>
                <SectionHeading num={8} id="third-party-links">
                  Third-Party Links
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary">
                  <p>
                    The Site may contain links to third-party websites, including
                    our social media profiles on X (Twitter) and Instagram. This
                    Privacy Policy applies only to the Site. We are not
                    responsible for the privacy practices of third-party sites
                    and encourage you to review their privacy policies before
                    providing any information.
                  </p>
                </div>
              </section>

              {/* Section 9 */}
              <section>
                <SectionHeading num={9} id="childrens-privacy">
                  Children&apos;s Privacy
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary">
                  <p>
                    The Site is intended for business professionals and is not
                    directed to individuals under the age of 16. We do not
                    knowingly collect personal information from children. If you
                    believe we have inadvertently collected information from a
                    minor, please contact us immediately at{" "}
                    <a
                      href="mailto:info@payrollsynergyexperts.com"
                      className="text-blue-accent hover:underline"
                    >
                      info@payrollsynergyexperts.com
                    </a>{" "}
                    and we will promptly delete it.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section>
                <SectionHeading num={10} id="changes">
                  Changes to This Policy
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary">
                  <p>
                    We may update this Privacy Policy periodically to reflect
                    changes in our practices, technology, legal requirements, or
                    other factors. When we make material changes, we will update
                    the &ldquo;Last Updated&rdquo; date at the top of this page.
                    Your continued use of the Site after changes are posted
                    constitutes your acceptance of the updated policy.
                  </p>
                </div>
              </section>

              {/* Section 11 */}
              <section>
                <SectionHeading num={11} id="contact">
                  Contact Us
                </SectionHeading>
                <div className="text-sm leading-relaxed text-text-secondary space-y-1">
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
                </div>
              </section>
            </div>

            {/* Contact Card */}
            <div className="bg-navy text-white rounded-[10px] p-8 text-center mt-12">
              <h3 className="text-xl font-bold mb-2">
                Questions about your data?
              </h3>
              <p className="text-steel-muted text-sm mb-5">
                Our team will respond to all privacy inquiries within one
                business day.
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
