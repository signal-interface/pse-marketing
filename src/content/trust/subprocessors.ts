// Subprocessor register, derived exclusively from repository evidence:
// package.json dependencies, .env.example keys, vercel.json, and the code
// paths that use them. Fields that cannot be determined from the repository
// are marked NOT_DETERMINED — they are open items, not facts.
//
// Not subprocessors: next/font bundles Google fonts at build time (no
// runtime requests); jspdf generates PDFs client-side; no analytics or
// advertising dependency exists in package.json.

export const NOT_DETERMINED = "not_determined" as const;

export interface Subprocessor {
  name: string;
  purpose: string;
  /** Categories of data the vendor processes for this site. */
  dataCategories: string[];
  hostingRegion: string | typeof NOT_DETERMINED;
  retention: string | typeof NOT_DETERMINED;
  /** Repository evidence this entry was derived from. */
  evidence: string[];
}

export const SUBPROCESSORS: readonly Subprocessor[] = [
  {
    name: "Vercel",
    purpose:
      "Hosting, CDN, serverless functions, and managed Postgres storage for the public site.",
    dataCategories: [
      "Request and traffic metadata",
      "Demo request submissions (name, email, optional company and employee count)",
      "CHAP interaction records (hashed IP, question, response, optional email)",
    ],
    hostingRegion: NOT_DETERMINED,
    retention: NOT_DETERMINED,
    evidence: [
      "vercel.json",
      "package.json (@vercel/postgres)",
      ".env.example (POSTGRES_URL)",
      "src/lib/db.ts",
    ],
  },
  {
    name: "Resend",
    purpose:
      "Transactional email delivery for demo request and CHAP lead notifications.",
    dataCategories: [
      "Demo request contact details (name, email, optional company and employee count)",
      "CHAP lead email and first question",
    ],
    hostingRegion: NOT_DETERMINED,
    retention: NOT_DETERMINED,
    evidence: [
      "package.json (resend)",
      ".env.example (RESEND_API_KEY)",
      "src/lib/emails.ts",
    ],
  },
  {
    name: "Anthropic",
    purpose:
      "Large-language-model API behind the CHAP AI widget (disabled by default via CHAP_WIDGET_ENABLED).",
    dataCategories: ["Visitor-submitted compliance questions"],
    hostingRegion: NOT_DETERMINED,
    retention: NOT_DETERMINED,
    evidence: [
      "package.json (@anthropic-ai/sdk)",
      ".env.example (ANTHROPIC_API_KEY)",
      "src/app/api/chap/ask/route.ts",
    ],
  },
];
