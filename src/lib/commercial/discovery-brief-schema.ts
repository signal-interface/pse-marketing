// lib/commercial/discovery-brief-schema.ts
//
// Structure of the internal Discovery Brief. Every statement carries a
// provenance label and traces to questionnaire fields; the original
// answers remain authoritative and ship inside the artifact.
//
// The brief is a sales-preparation artifact. It must never contain
// compliance determinations, risk or governance scores, legal
// conclusions, control-effectiveness assertions, or facts absent from
// the questionnaire and approved internal data. assertNoProhibitedContent
// is the generation-time guard for that doctrine.

export const GENERATOR_VERSION = "brief-v1";

export type Provenance =
  | "customer_stated" // verbatim or lightly formatted buyer input
  | "derived_summary" // deterministic reformulation traceable to fields
  | "open_question" // missing information to clarify in Meeting 1
  | "prep_note"; // internal preparation guidance

export interface BriefStatement {
  text: string;
  provenance: Provenance;
  /** Questionnaire/lead field names this statement derives from. */
  sourceFields: string[];
}

export interface BriefSection {
  id:
    | "contact"
    | "environment"
    | "systems"
    | "priorities"
    | "stated_outlook"
    | "open_questions"
    | "agenda";
  title: string;
  statements: BriefStatement[];
}

export interface DiscoveryBriefContent {
  generatorVersion: string;
  disclaimer: string;
  sections: BriefSection[];
}

export const BRIEF_DISCLAIMER =
  "Internal sales-preparation artifact generated from buyer-submitted " +
  "questionnaire answers. Not a compliance determination, governance " +
  "assessment, or finding. Self-rated figures are the buyer's own " +
  "statements. The original answers remain authoritative.";

// Vocabulary that must never appear in generated brief text. Guards the
// prohibited-content doctrine at generation time; tests enforce it too.
const PROHIBITED_PATTERNS: RegExp[] = [
  /\bnon-?compliant\b/i,
  /\bcompliant\b/i,
  /\bviolat(es|ion|ing)\b/i,
  /\brisk score\b/i,
  /\bgovernance score\b/i,
  /\bcompliance score\b/i,
  /\bcontrol (is|was) (in)?effective\b/i,
  /\bwe (found|detected|identified) (a|an) (violation|deficiency|incident)\b/i,
  /\blegal (conclusion|opinion|advice)\b/i,
];

export function assertNoProhibitedContent(content: DiscoveryBriefContent): void {
  for (const section of content.sections) {
    for (const statement of section.statements) {
      for (const pattern of PROHIBITED_PATTERNS) {
        if (pattern.test(statement.text)) {
          throw new Error(
            `Prohibited brief content matched ${pattern} in section ` +
              `"${section.id}": ${statement.text.slice(0, 80)}`
          );
        }
      }
    }
  }
}
