// lib/commercial/discovery-brief.ts
//
// Deterministic Discovery Brief generation. No model call: every
// statement is produced by template rules over validated questionnaire
// answers and lead intake fields, so "no invented facts" holds by
// construction.
//
// Doctrine:
// - Requires a completed questionnaire session on a
//   QUESTIONNAIRE_COMPLETED (or later) lead.
// - Never writes lead_status. Generation appends
//   DISCOVERY_BRIEF_GENERATED to lead_events and nothing else.
// - Versioned + idempotent: identical answers under the same generator
//   version return the existing brief; changed answers create version+1.

import crypto from "node:crypto";
import { db, sql } from "@vercel/postgres";
import { recordLeadEvent, type EventContext, type LeadStatus } from "./lifecycle";
import {
  GENERATOR_VERSION,
  BRIEF_DISCLAIMER,
  assertNoProhibitedContent,
  type BriefSection,
  type BriefStatement,
  type DiscoveryBriefContent,
} from "./discovery-brief-schema";

// Lead states with a submitted questionnaire behind them.
const BRIEF_ELIGIBLE_STATES: readonly LeadStatus[] = [
  "QUESTIONNAIRE_COMPLETED",
  "MEETING_SCHEDULED",
  "DISCOVERY_COMPLETE",
  "QUALIFIED",
  "NURTURE",
];

interface LeadRow {
  id: number;
  first_name: string | null;
  name: string | null;
  last_name: string | null;
  email: string;
  company: string | null;
  job_title: string | null;
  employees: string | null;
  email_domain_type: string;
  lead_status: string;
  campaign_source: string | null;
  source: string | null;
}

type Answers = Record<string, unknown>;

const str = (a: Answers, k: string): string | undefined =>
  typeof a[k] === "string" && (a[k] as string).trim()
    ? (a[k] as string).trim()
    : undefined;
const num = (a: Answers, k: string): number | undefined =>
  typeof a[k] === "number" && Number.isFinite(a[k] as number)
    ? (a[k] as number)
    : undefined;
const arr = (a: Answers, k: string): string[] =>
  Array.isArray(a[k]) ? (a[k] as unknown[]).filter((v): v is string => typeof v === "string") : [];

const stmt = (
  text: string,
  provenance: BriefStatement["provenance"],
  sourceFields: string[]
): BriefStatement => ({ text, provenance, sourceFields });

// ---------------------------------------------------------------------------
// Deterministic content builder (pure — exported for tests)
// ---------------------------------------------------------------------------

export function buildBriefContent(
  lead: Pick<
    LeadRow,
    "first_name" | "name" | "last_name" | "company" | "job_title" | "employees" | "email_domain_type"
  >,
  answers: Answers
): DiscoveryBriefContent {
  const sections: BriefSection[] = [];

  // --- Contact ---
  const contactName =
    [lead.first_name, lead.last_name].filter(Boolean).join(" ") ||
    lead.name ||
    "Unknown contact";
  const contact: BriefStatement[] = [
    stmt(
      `${contactName}${lead.job_title ? `, ${lead.job_title}` : ""} at ${lead.company ?? "unknown company"}.`,
      "customer_stated",
      ["first_name", "last_name", "job_title", "company"]
    ),
  ];
  if (lead.employees) {
    contact.push(
      stmt(`Stated organization size at intake: ${lead.employees} employees.`, "customer_stated", ["employees"])
    );
  }
  if (lead.email_domain_type === "FREE") {
    contact.push(
      stmt(
        "Submitted with a personal email domain — confirm organizational affiliation in the session.",
        "prep_note",
        ["email_domain_type"]
      )
    );
  }
  sections.push({ id: "contact", title: "Company & contact", statements: contact });

  // --- Environment ---
  const env: BriefStatement[] = [];
  const orgSize = str(answers, "organizationSize");
  if (orgSize) env.push(stmt(`Organization size (questionnaire): ${orgSize}.`, "customer_stated", ["organizationSize"]));
  const regions = arr(answers, "operatingRegions");
  if (regions.length) {
    env.push(stmt(`Runs payroll in: ${regions.join(", ")}.`, "customer_stated", ["operatingRegions"])); // boundary-lint-allow: prohibited-execution -- customer_stated provenance: the subject is the prospect's own payroll operation, not a PSE capability
    if (regions.length > 1) {
      env.push(
        stmt(
          `Multi-jurisdiction environment — ${regions.length} stated jurisdictions.`,
          "derived_summary",
          ["operatingRegions"]
        )
      );
    }
  }
  const freq = str(answers, "payrollFrequencies");
  if (freq) {
    env.push(stmt(`Payroll frequency: ${freq}.`, "customer_stated", ["payrollFrequencies"]));
    if (freq === "mixed") {
      env.push(
        stmt("Multiple pay frequencies in operation.", "derived_summary", ["payrollFrequencies"])
      );
    }
  }
  sections.push({ id: "environment", title: "Payroll environment", statements: env });

  // --- Systems & operating model ---
  const sys: BriefStatement[] = [];
  const hcm = str(answers, "hcmSystem");
  const provider = str(answers, "payrollProvider");
  if (hcm) sys.push(stmt(`HCM system: ${hcm}.`, "customer_stated", ["hcmSystem"]));
  if (provider) sys.push(stmt(`Payroll provider: ${provider}.`, "customer_stated", ["payrollProvider"]));
  const model = str(answers, "operatingModel");
  if (model) {
    const label = { internal: "run internally", outsourced: "outsourced", hybrid: "hybrid" }[model] ?? model;
    sys.push(stmt(`Operating model: ${label}.`, "customer_stated", ["operatingModel"]));
  }
  const team = str(answers, "payrollTeamSize");
  if (team) sys.push(stmt(`Payroll team size: ${team}.`, "customer_stated", ["payrollTeamSize"]));
  if (hcm && provider && hcm.toLowerCase() !== provider.toLowerCase()) {
    sys.push(
      stmt(
        "HCM and payroll execution are split across two systems — reconciliation surface between them is worth exploring.", // boundary-lint-allow: prohibited-execution-nominal -- derived_summary of the prospect's SoR stack: the execution described belongs to the customer's two systems, not PSE
        "derived_summary",
        ["hcmSystem", "payrollProvider"]
      )
    );
  }
  sections.push({ id: "systems", title: "Systems & operating model", statements: sys });

  // --- Stated priorities ---
  const pri: BriefStatement[] = [];
  const concerns = arr(answers, "topConcerns");
  concerns.forEach((c, i) =>
    pri.push(stmt(`Stated concern ${i + 1}: "${c}"`, "customer_stated", ["topConcerns"]))
  );
  const reporting = num(answers, "reportingMaturity");
  if (reporting !== undefined) {
    pri.push(
      stmt(`Self-rated reporting maturity: ${reporting}/5.`, "customer_stated", ["reportingMaturity"])
    );
  }
  const compliance = num(answers, "complianceConfidence");
  if (compliance !== undefined) {
    pri.push(
      stmt(`Self-rated compliance confidence: ${compliance}/10.`, "customer_stated", ["complianceConfidence"])
    );
  }
  const governance = num(answers, "governanceConfidence");
  if (governance !== undefined) {
    pri.push(
      stmt(`Self-rated governance confidence: ${governance}/10.`, "customer_stated", ["governanceConfidence"])
    );
  }
  if (compliance !== undefined && governance !== undefined && compliance - governance >= 3) {
    pri.push(
      stmt(
        `Buyer rates compliance confidence ${compliance - governance} points higher than governance confidence — explore where oversight, evidence, or control ownership feels weakest.`,
        "derived_summary",
        ["complianceConfidence", "governanceConfidence"]
      )
    );
  }
  sections.push({ id: "priorities", title: "Stated priorities & self-assessment", statements: pri });

  // --- Stated outlook ---
  const outlook: BriefStatement[] = [];
  const future = str(answers, "desiredFutureState");
  if (future) outlook.push(stmt(`Desired future state (verbatim): "${future}"`, "customer_stated", ["desiredFutureState"]));
  const purpose = str(answers, "meetingPurpose");
  if (purpose) outlook.push(stmt(`Requested session focus (verbatim): "${purpose}"`, "customer_stated", ["meetingPurpose"]));
  sections.push({ id: "stated_outlook", title: "Stated outlook", statements: outlook });

  // --- Open questions: missing fields + standing Meeting-1 items ---
  const open: BriefStatement[] = [];
  const missing: [string, string][] = [
    ["organizationSize", "organization size"],
    ["operatingRegions", "jurisdictions where payroll runs"],
    ["payrollFrequencies", "payroll frequency"],
    ["hcmSystem", "HCM system"],
    ["payrollProvider", "payroll provider"],
    ["operatingModel", "operating model"],
    ["payrollTeamSize", "payroll team size"],
    ["topConcerns", "top operational concerns"],
    ["desiredFutureState", "desired future state"],
    ["meetingPurpose", "session focus"],
  ];
  for (const [field, label] of missing) {
    const present =
      field === "topConcerns" || field === "operatingRegions"
        ? arr(answers, field).length > 0
        : str(answers, field) !== undefined || num(answers, field) !== undefined;
    if (!present) {
      open.push(stmt(`Not provided in questionnaire: ${label} — clarify in the session.`, "open_question", [field]));
    }
  }
  // Standing items the questionnaire does not collect (by design):
  open.push(
    stmt(
      "Ask: current or planned AI usage in payroll operations, and any internal AI-governance expectations.",
      "open_question",
      []
    ),
    stmt(
      "Ask: decision timeline, evaluation stakeholders, and what prompted looking now.",
      "open_question",
      []
    ),
    stmt(
      "Ask: how payroll output is verified today, and who is accountable when an exception is found.",
      "open_question",
      []
    )
  );
  sections.push({ id: "open_questions", title: "Missing information to clarify", statements: open });

  // --- Suggested agenda ---
  const agenda: BriefStatement[] = [
    stmt("1. Their world first: environment, systems, and team as stated above — confirm and fill gaps.", "prep_note", []),
    concerns.length
      ? stmt(
          `2. Walk their stated concerns in their words (${concerns.length} listed) and how each shows up operationally.`,
          "prep_note",
          ["topConcerns"]
        )
      : stmt("2. Surface their top operational concerns (none provided in the questionnaire).", "prep_note", ["topConcerns"]),
    stmt(
      "3. Governance boundary: their system of record executes; PSE governs — position the review scope.",
      "prep_note",
      []
    ),
    stmt("4. Agree the next step and who else should be in the room.", "prep_note", []),
  ];
  sections.push({ id: "agenda", title: "Suggested meeting agenda", statements: agenda });

  const content: DiscoveryBriefContent = {
    generatorVersion: GENERATOR_VERSION,
    disclaimer: BRIEF_DISCLAIMER,
    sections,
  };
  assertNoProhibitedContent(content);
  return content;
}

// ---------------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------------

export interface BriefRecord {
  id: number;
  leadId: number;
  sessionId: number;
  version: number;
  generatorVersion: string;
  answersHash: string;
  answersSnapshot: Answers;
  content: DiscoveryBriefContent;
  generatedAt: Date;
}

export type GenerateBriefResult =
  | { ok: true; brief: BriefRecord; reused: boolean }
  | {
      ok: false;
      reason: "not_found" | "questionnaire_not_completed" | "ineligible_state";
    };

function hashAnswers(answers: Answers): string {
  // Stable stringify: sorted keys, so hash is order-independent.
  const stable = JSON.stringify(answers, Object.keys(answers).sort());
  return crypto.createHash("sha256").update(GENERATOR_VERSION + ":" + stable).digest("hex");
}

function rowToRecord(row: Record<string, unknown>): BriefRecord {
  return {
    id: row.id as number,
    leadId: row.demo_request_id as number,
    sessionId: row.session_id as number,
    version: row.version as number,
    generatorVersion: row.generator_version as string,
    answersHash: row.answers_hash as string,
    answersSnapshot: row.answers_snapshot as Answers,
    content: row.content as DiscoveryBriefContent,
    generatedAt: new Date(row.generated_at as string),
  };
}

export async function getLatestBrief(leadId: number): Promise<BriefRecord | null> {
  const { rows } = await sql`
    SELECT * FROM discovery_briefs
    WHERE demo_request_id = ${leadId}
    ORDER BY version DESC LIMIT 1
  `;
  return rows.length ? rowToRecord(rows[0]) : null;
}

export async function generateDiscoveryBrief(
  leadId: number,
  ctx: EventContext
): Promise<GenerateBriefResult> {
  // Lead + completed session. The completed questionnaire is required.
  const { rows: leadRows } = await sql`
    SELECT id, first_name, name, last_name, email, company, job_title,
           employees, email_domain_type, lead_status, campaign_source, source
    FROM demo_requests WHERE id = ${leadId}
  `;
  if (leadRows.length === 0) return { ok: false, reason: "not_found" };
  const lead = leadRows[0] as unknown as LeadRow;

  if (!BRIEF_ELIGIBLE_STATES.includes(lead.lead_status as LeadStatus)) {
    return { ok: false, reason: "ineligible_state" };
  }

  const { rows: sessionRows } = await sql`
    SELECT id, answers, completed_at
    FROM discovery_questionnaire_sessions
    WHERE demo_request_id = ${leadId} AND completed_at IS NOT NULL
    ORDER BY completed_at DESC LIMIT 1
  `;
  if (sessionRows.length === 0) {
    return { ok: false, reason: "questionnaire_not_completed" };
  }
  const sessionId = sessionRows[0].id as number;
  const answers = (sessionRows[0].answers as Answers) ?? {};
  const answersHash = hashAnswers(answers);

  // Idempotency: identical answers under the same generator version reuse
  // the latest brief.
  const latest = await getLatestBrief(leadId);
  if (
    latest &&
    latest.answersHash === answersHash &&
    latest.generatorVersion === GENERATOR_VERSION
  ) {
    return { ok: true, brief: latest, reused: true };
  }

  const content = buildBriefContent(lead, answers);
  const nextVersion = (latest?.version ?? 0) + 1;

  const client = await db.connect();
  let inserted: BriefRecord;
  try {
    await client.sql`BEGIN`;
    const { rows } = await client.sql`
      INSERT INTO discovery_briefs
        (demo_request_id, session_id, version, generator_version,
         answers_hash, answers_snapshot, content)
      VALUES
        (${leadId}, ${sessionId}, ${nextVersion}, ${GENERATOR_VERSION},
         ${answersHash}, ${JSON.stringify(answers)}::jsonb,
         ${JSON.stringify(content)}::jsonb)
      RETURNING *
    `;
    inserted = rowToRecord(rows[0]);
    await client.sql`COMMIT`;
  } catch (err) {
    try {
      await client.sql`ROLLBACK`;
    } catch {
      // connection-level failure; original error is what matters
    }
    throw err;
  } finally {
    client.release();
  }

  // Evidence trail only — the brief NEVER changes lead_status.
  try {
    await recordLeadEvent(leadId, "DISCOVERY_BRIEF_GENERATED", {
      ...ctx,
      metadata: {
        briefId: inserted.id,
        version: inserted.version,
        generatorVersion: GENERATOR_VERSION,
        sessionId,
      },
    });
  } catch (err) {
    console.error(`[discovery-brief:${ctx.requestId ?? "?"}] event append:`, err);
  }

  return { ok: true, brief: inserted, reused: false };
}
