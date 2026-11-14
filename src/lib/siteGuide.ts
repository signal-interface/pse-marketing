// Public PSE Marketing site guide. Static, bounded, client-side information only.
// No model calls, network fetch, visitor tracking, customer data, or subscription.
// Source links point only to already-published PSE Marketing pages.
// Marketing-only knowledge discovery: no Context Hub, Core, Professional or tenant access.
import { domains } from "@/lib/payroll-intelligence";
export type SiteGuideTopic = "about" | "services" | "demo" | "estimator" | "chap" | "privacy" | "payroll-intelligence";
export interface SiteGuideAnswer {
  topic: SiteGuideTopic | null;
  text: string;
  links: ReadonlyArray<{ label: string; href: string }>;
}
export const WEBSITE_SUGGESTIONS = [
  "What is PSE?",
  "What services does PSE offer?",
  "What is Payroll Intelligence?",
  "Where is the risk estimator?",
] as const;

// Curated next questions remain deterministic and use only the public site guide.
const FOLLOW_UPS: Record<SiteGuideTopic, readonly string[]> = {
  about: ["What services does PSE offer?", "How do I request a demonstration?"],
  services: ["Where is the risk estimator?", "How do I request a demonstration?"],
  demo: ["What services does PSE offer?", "What is PSE?"],
  estimator: ["What services does PSE offer?", "How do I request a demonstration?"],
  chap: ["How do I request a demonstration?", "Where is the risk estimator?"],
  privacy: ["What is PSE?", "How do I request a demonstration?"],
  "payroll-intelligence": ["What services does PSE offer?", "How do I request a demonstration?"],
};

export function websiteGuideFollowUps(topic: SiteGuideTopic | null): readonly string[] {
  return topic ? FOLLOW_UPS[topic] : WEBSITE_SUGGESTIONS.slice(0, 2);
}

export function websiteGuideDemoCta(topic: SiteGuideTopic | null): boolean {
  return topic === "services" || topic === "chap" || topic === "demo";
}

const TOPICS: Record<SiteGuideTopic, SiteGuideAnswer> = {
  about: {
    topic: "about",
    text: "Payroll Synergy Experts (PSE) presents payroll governance, risk review, and compliance-focused advisory services. PSE positions its offering as a layer of oversight rather than a replacement payroll processor. Review the public services page for currently published descriptions.",
    links: [{ label: "PSE services", href: "/services" }, { label: "PSE homepage", href: "/" }],
  },
  services: {
    topic: "services",
    text: "PSE's public services page describes Governed Payroll Runs, Tax & Compliance, Workforce Analytics, Benefits Reconciliation, System Integration, and Strategic Advisory. Descriptions are marketing information, not a guarantee of a particular production integration.",
    links: [{ label: "Explore services", href: "/services" }],
  },
  demo: {
    topic: "demo",
    text: "You can request a guided PSE demonstration from the website. The approved demo uses fixed synthetic payroll data; no customer payroll records are required. After requesting it, you can follow the scheduling link provided in the confirmation.",
    links: [{ label: "Request a demo", href: "/#demo" }],
  },
  estimator: {
    topic: "estimator",
    text: "PSE's Compliance Risk Estimator provides an illustrative risk scenario based on disclosed modeling assumptions. It is not an individualized compliance determination or verified prediction of penalties.",
    links: [{ label: "Compliance Risk Estimator", href: "/compliance-risk" }],
  },
  chap: {
    topic: "chap",
    text: "The CHAP AI marketing experience offers bounded educational information about IRC §6656 federal employment tax deposit penalties. It uses a reference corpus and has no access to live payroll records or CHAP Production. Compliance questions belong in the separate Compliance Education tab.",
    links: [{ label: "CHAP educational page", href: "/chap-ai#try-chap-ai" }],
  },
  "payroll-intelligence": {
    topic: "payroll-intelligence",
    text: "PSE's public Payroll Intelligence Framework 2026–2027 organizes educational payroll guidance into 15 knowledge domains, with source-linked briefings, a methodology page, and a quarterly review programme. It is a public research and governance reference, not a live CHAP data feed or a guarantee of complete jurisdictional coverage.",
    links: [
      { label: "Payroll Intelligence Framework", href: "/payroll-intelligence" },
      { label: "Source methodology", href: "/payroll-intelligence/methodology" },
      { label: "Source-linked briefings", href: "/payroll-intelligence/briefings" },
    ],
  },
  privacy: {
    topic: "privacy",
    text: "PSE publishes its privacy and terms information on the website. Please review those pages before sharing contact information. Use general, nonsensitive questions in this marketing chat. Keep personal identifiers, credentials and confidential documents out of the conversation.",
    links: [{ label: "Privacy policy", href: "/privacy" }, { label: "Terms", href: "/terms" }],
  },
};
// Only routes visitors to the public, source-controlled domain index.
// It does not generate jurisdiction-specific conclusions or search draft briefings.
function approvedDomainNavigation(question: string): SiteGuideAnswer | null {
  const q = question.toLowerCase().replace(/[^\\p{L}\\p{N}\\s]/gu, " ");
  const domainAliases: ReadonlyArray<readonly [string, string]> = [
    ["wage-hour", "overtime|minimum wage|wage and hour"],
    ["withholding", "withholding|w 4|federal income tax"],
    ["tax-reporting", "tax deposit|form 941|w 2|year end"],
    ["records-retention", "recordkeeping|retention|audit records"],
    ["payroll-accounting", "payroll accounting|general ledger|accrual"],
    ["international", "international payroll|cross border|expatriate"],
    ["deductions", "garnishment|payroll deductions|child support"],
  ];
  for (const [slug, pattern] of domainAliases) {
    if (!new RegExp(`\\b(?:${pattern})\\b`, "i").test(q)) continue;
    const domain = domains.find((d) => d.slug === slug);
    if (!domain) return null;
    return {
      topic: "payroll-intelligence",
      text: `The published PSE Payroll Intelligence framework includes ${domain.name}. ${domain.summary} Explore the public domain guide and its source references. This Website Guide does not determine employer-specific compliance or use live payroll data.`,
      links: [
        { label: `Explore ${domain.name}`, href: `/payroll-intelligence/topics/${domain.slug}` },
        { label: "Payroll Intelligence methodology", href: "/payroll-intelligence/methodology" },
      ],
    };
  }
  return null;
}

export function answerWebsiteQuestion(question: string, previousTopic: SiteGuideTopic | null = null): SiteGuideAnswer {
  const q = question.trim().toLowerCase().replace(/[^\p{L}\p{N}\s§]/gu, " ");
  if (q.length === 0) return { topic: null, text: "Ask about PSE, services, the risk estimator, CHAP education, or how to schedule a demonstration.", links: [] };
  // Personal or executive identity is not a verified fact in this approved site collection.
  if (/\b(ceo|founder|owner|president|executive|leadership|salary|price|pricing|cost)\b/.test(q)) {
    return { topic: null, text: "That detail is not verified in this Website Guide. Please use PSE's published website or request a demonstration for current information.", links: [{ label: "Request a demo", href: "/#demo" }] };
  }
  if (/^(explain|more|tell me more|details|why|how so|elaborate)$/.test(q)) {
    if (!previousTopic) return { topic: null, text: "What would you like explained? Try PSE services, the Risk Estimator, or how to request a demo.", links: [] };
    const previous = TOPICS[previousTopic];
    return { ...previous, text: previous.text + " The linked website page contains the published details." };
  }
  // Prefer approved first-party Payroll Intelligence domain navigation to generic marketing answers.
  const domainAnswer = approvedDomainNavigation(q);
  if (domainAnswer) return domainAnswer;
  // Narrowly allow deterministic routing to approved public page descriptions.
  if (/privacy|terms|data handling|confidential|personal information/.test(q)) return TOPICS.privacy;
  if (/payroll intelligence|knowledge domain|knowledge framework|payroll framework|source linked briefing|payroll topics|regulatory research|payroll research/.test(q)) return TOPICS["payroll-intelligence"];
  if (/book|schedule|meeting|demo|walkthrough|consultation|call|appointment/.test(q)) return TOPICS.demo;
  if (/estimate|estimator|risk|calculator|exposure/.test(q)) return TOPICS.estimator;
  if (/chap|6656|deposit penalty|statut|question limit|ai widget/.test(q)) return TOPICS.chap;
  if (/services|service|offer|advisory|integration|workforce|benefit|tax|payroll system/.test(q)) return TOPICS.services;
  if (/pse|payroll synergy|who are|what is|about|company|business|help/.test(q)) return TOPICS.about;
  return {
    topic: null,
    text: "I can guide you through PSE's published website pages, not answer arbitrary questions or access customer records. Ask about PSE, services, Payroll Intelligence, CHAP education, the risk estimator, or scheduling a demo.",
    links: [
      { label: "Explore PSE services", href: "/services" },
      { label: "Request a demo", href: "/#demo" },
    ],
  };
}
