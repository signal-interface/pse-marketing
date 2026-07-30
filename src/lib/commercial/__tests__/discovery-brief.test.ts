import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

interface Call {
  text: string;
  values: unknown[];
}

const state: {
  calls: Call[];
  poolRows: Record<string, unknown>[][];
  clientRows: Record<string, unknown>[][];
} = { calls: [], poolRows: [], clientRows: [] };

function tagText(strings: TemplateStringsArray): string {
  return strings.join("$").replace(/\s+/g, " ").trim();
}

const clientSql = vi.fn(
  async (strings: TemplateStringsArray, ...values: unknown[]) => {
    const text = tagText(strings);
    state.calls.push({ text, values });
    if (text === "BEGIN" || text === "COMMIT" || text === "ROLLBACK") {
      return { rows: [] };
    }
    return { rows: state.clientRows.shift() ?? [] };
  }
);
const release = vi.fn();
const poolSql = vi.fn(
  async (strings: TemplateStringsArray, ...values: unknown[]) => {
    const text = tagText(strings);
    state.calls.push({ text, values });
    return { rows: state.poolRows.shift() ?? [] };
  }
);

vi.mock("@vercel/postgres", () => ({
  db: { connect: vi.fn(async () => ({ sql: clientSql, release })) },
  sql: (strings: TemplateStringsArray, ...values: unknown[]) =>
    poolSql(strings, ...values),
}));

const mockTransition = vi.fn();
const mockRecordEvent = vi.fn();
vi.mock("../lifecycle", () => ({
  transitionLead: (...args: unknown[]) => mockTransition(...args),
  recordLeadEvent: (...args: unknown[]) => mockRecordEvent(...args),
}));

import {
  buildBriefContent,
  generateDiscoveryBrief,
} from "../discovery-brief";
import { GENERATOR_VERSION } from "../discovery-brief-schema";

const LEAD_ROW = {
  id: 1,
  first_name: "Jane",
  name: "Jane Smith",
  last_name: "Smith",
  email: "jane@acme.com",
  company: "Acme",
  job_title: "Payroll Director",
  employees: "201-500",
  email_domain_type: "WORK",
  lead_status: "QUESTIONNAIRE_COMPLETED",
  campaign_source: "pse-marketing",
  source: "pse-marketing",
};

const ANSWERS = {
  organizationSize: "201-500",
  operatingRegions: ["California", "New York", "UK"],
  payrollFrequencies: "mixed",
  hcmSystem: "Workday",
  payrollProvider: "ADP",
  operatingModel: "hybrid",
  topConcerns: ["Multi-state tax exposure", "Off-cycle audit trail"],
  reportingMaturity: 3,
  complianceConfidence: 8,
  governanceConfidence: 4,
  desiredFutureState: "Continuous validation with evidence.",
  meetingPurpose: "Evaluate governance fit.",
};

const SESSION_ROW = {
  id: 11,
  answers: ANSWERS,
  completed_at: new Date().toISOString(),
};

const INSERTED_ROW = {
  id: 5,
  demo_request_id: 1,
  session_id: 11,
  version: 1,
  generator_version: GENERATOR_VERSION,
  answers_hash: "hash",
  answers_snapshot: ANSWERS,
  content: { generatorVersion: GENERATOR_VERSION, disclaimer: "d", sections: [] },
  generated_at: new Date().toISOString(),
};

const CTX = { actorType: "TEAM_MEMBER" as const, source: "test", requestId: "req-b" };

beforeEach(() => {
  state.calls = [];
  state.poolRows = [];
  state.clientRows = [];
  vi.clearAllMocks();
  mockRecordEvent.mockResolvedValue({ ok: true, eventId: 1 });
});

// ---------------------------------------------------------------------------
// Content builder (pure)
// ---------------------------------------------------------------------------

describe("buildBriefContent", () => {
  it("ignores unknown answer fields entirely", () => {
    const content = buildBriefContent(LEAD_ROW, {
      ...ANSWERS,
      employeeSsnList: ["123-45-6789"],
      uploadedRegister: "base64...",
    });
    const text = JSON.stringify(content);
    expect(text).not.toContain("employeeSsnList");
    expect(text).not.toContain("123-45-6789");
    expect(text).not.toContain("uploadedRegister");
  });

  it("emits no score, determination, or compliance-conclusion fields", () => {
    const content = buildBriefContent(LEAD_ROW, ANSWERS);
    const json = JSON.stringify(content).toLowerCase();
    for (const forbidden of [
      '"score"',
      '"riskscore"',
      '"governancescore"',
      '"determination"',
      '"finding"',
      "non-compliant",
      "violation",
      "control is effective",
      "control is ineffective",
    ]) {
      expect(json).not.toContain(forbidden);
    }
    // Self-rated figures are attributed to the buyer, never asserted by PSE
    const flat = content.sections.flatMap((s) => s.statements);
    const confidence = flat.find((s) => s.text.includes("governance confidence"));
    expect(confidence?.text).toContain("Self-rated");
    expect(confidence?.provenance).toBe("customer_stated");
  });

  it("every derived statement traces to questionnaire fields", () => {
    const content = buildBriefContent(LEAD_ROW, ANSWERS);
    const derived = content.sections
      .flatMap((s) => s.statements)
      .filter((s) => s.provenance === "derived_summary");
    expect(derived.length).toBeGreaterThan(0);
    for (const statement of derived) {
      expect(statement.sourceFields.length).toBeGreaterThan(0);
    }
  });

  it("verbatim buyer text is preserved and labeled customer_stated", () => {
    const content = buildBriefContent(LEAD_ROW, ANSWERS);
    const flat = content.sections.flatMap((s) => s.statements);
    const future = flat.find((s) => s.text.includes("Continuous validation with evidence."));
    expect(future?.provenance).toBe("customer_stated");
    expect(future?.sourceFields).toContain("desiredFutureState");
  });

  it("missing answers become open questions, including standing Meeting-1 items", () => {
    const content = buildBriefContent(LEAD_ROW, {});
    const open = content.sections.find((s) => s.id === "open_questions")!;
    const texts = open.statements.map((s) => s.text).join(" | ");
    expect(texts).toContain("Not provided in questionnaire");
    expect(texts.toLowerCase()).toContain("ai usage");
    expect(texts.toLowerCase()).toContain("decision timeline");
    expect(open.statements.every((s) => s.provenance === "open_question")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// generateDiscoveryBrief
// ---------------------------------------------------------------------------

describe("generateDiscoveryBrief", () => {
  it("rejects a missing lead", async () => {
    state.poolRows = [[]];
    const result = await generateDiscoveryBrief(999, CTX);
    expect(result).toEqual({ ok: false, reason: "not_found" });
  });

  it("requires a completed questionnaire session", async () => {
    state.poolRows = [[LEAD_ROW], []]; // lead ok, no completed session
    const result = await generateDiscoveryBrief(1, CTX);
    expect(result).toEqual({ ok: false, reason: "questionnaire_not_completed" });
    expect(mockRecordEvent).not.toHaveBeenCalled();
  });

  it("rejects ineligible lead states", async () => {
    state.poolRows = [[{ ...LEAD_ROW, lead_status: "VIDEO_SENT" }]];
    const result = await generateDiscoveryBrief(1, CTX);
    expect(result).toEqual({ ok: false, reason: "ineligible_state" });
  });

  it("generates version 1, preserves source answers, and appends DISCOVERY_BRIEF_GENERATED", async () => {
    state.poolRows = [[LEAD_ROW], [SESSION_ROW], []]; // lead, session, no latest
    state.clientRows = [[INSERTED_ROW]];
    const result = await generateDiscoveryBrief(1, CTX);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.reused).toBe(false);
    expect(result.brief.version).toBe(1);
    expect(result.brief.answersSnapshot).toEqual(ANSWERS);

    const insert = state.calls.find((c) => c.text.includes("INSERT INTO discovery_briefs"))!;
    expect(insert.values.some((v) => typeof v === "string" && v.includes("Multi-state tax exposure"))).toBe(true);

    expect(mockRecordEvent).toHaveBeenCalledWith(
      1,
      "DISCOVERY_BRIEF_GENERATED",
      expect.objectContaining({ requestId: "req-b" })
    );
  });

  it("never writes lead_status — no transition and no UPDATE on demo_requests", async () => {
    state.poolRows = [[LEAD_ROW], [SESSION_ROW], []];
    state.clientRows = [[INSERTED_ROW]];
    await generateDiscoveryBrief(1, CTX);
    expect(mockTransition).not.toHaveBeenCalled();
    expect(
      state.calls.some((c) => c.text.startsWith("UPDATE demo_requests"))
    ).toBe(false);
  });

  it("is idempotent for unchanged answers under the same generator version", async () => {
    // First compute the real hash by running once and capturing the insert value.
    state.poolRows = [[LEAD_ROW], [SESSION_ROW], []];
    state.clientRows = [[INSERTED_ROW]];
    await generateDiscoveryBrief(1, CTX);
    const insert = state.calls.find((c) => c.text.includes("INSERT INTO discovery_briefs"))!;
    const realHash = insert.values.find(
      (v) => typeof v === "string" && /^[0-9a-f]{64}$/.test(v as string)
    ) as string;

    vi.clearAllMocks();
    mockRecordEvent.mockResolvedValue({ ok: true, eventId: 1 });
    state.calls = [];
    const latest = { ...INSERTED_ROW, answers_hash: realHash };
    state.poolRows = [[LEAD_ROW], [SESSION_ROW], [latest]];
    const result = await generateDiscoveryBrief(1, CTX);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.reused).toBe(true);
    expect(result.brief.version).toBe(1);
    expect(state.calls.some((c) => c.text.includes("INSERT INTO discovery_briefs"))).toBe(false);
    expect(mockRecordEvent).not.toHaveBeenCalled();
  });

  it("versions up when answers change", async () => {
    const latest = { ...INSERTED_ROW, answers_hash: "stale-hash", version: 1 };
    state.poolRows = [[LEAD_ROW], [SESSION_ROW], [latest]];
    state.clientRows = [[{ ...INSERTED_ROW, version: 2 }]];
    const result = await generateDiscoveryBrief(1, CTX);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.reused).toBe(false);
    expect(result.brief.version).toBe(2);
    const insert = state.calls.find((c) => c.text.includes("INSERT INTO discovery_briefs"))!;
    expect(insert.values).toContain(2);
  });
});
