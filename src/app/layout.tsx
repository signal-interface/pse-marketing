import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    apple: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    type: "website",
    images: [{ url: SITE.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  other: {
    "theme-color": "#2a3444",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Payroll Synergy Experts",
  alternateName: "PSE",
  url: "https://www.payrollsynergyexperts.com",
  logo: "https://www.payrollsynergyexperts.com/favicon.svg",
  description:
    "AI-powered payroll compliance and controls platform. Detect compliance issues early, generate audit-ready evidence, and keep every payroll run clean.",
  sameAs: [
    "https://x.com/psecompliance",
    "https://www.instagram.com/pse_intelligence/",
    "https://www.linkedin.com/company/payroll-synergy-experts/",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@payrollsynergyexperts.com",
    contactType: "sales",
    availableLanguage: "English",
  },
};

const jsonLdSoftware = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CHAP AI",
  alternateName: "CHAP Guard",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, Chrome Extension",
  description:
    "AI-powered compliance intelligence engine for payroll. Detects statutory violations, flags risks, explains issues in plain language, and generates audit-ready documentation.",
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/PreOrder",
    description: "Platform access is by invitation only",
  },
  creator: {
    "@type": "Organization",
    name: "Payroll Synergy Experts",
  },
  featureList: [
    "Real-time compliance validation",
    "Multi-state jurisdiction coverage",
    "Audit-ready documentation generation",
    "Chrome extension for UKG and ADP",
    "Inline violation badges with code citations",
    "Daily regulatory monitoring",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-white text-text font-sans antialiased overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdOrganization),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSoftware),
          }}
        />
        {children}
      </body>
    </html>
  );
}
