import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Mocks: scriptable @vercel/postgres + spied lifecycle
// ---------------------------------------------------------------------------

interface Call {
  text: string;
  values: unknown[];
}

const state: {
  calls: Call[];
  clientRows: Record<string, unknown>[][];
  poolRows: Record<string, unknown>[][];
  failOn: string | null;
} = { calls: [], clientRows: [], poolRows: [], failOn: null };

function tagText(strings: TemplateStringsArray): string {
  return strings.join("$").replace(/\s+/g, " ").trim();
}

const clientSql = vi.fn(
  async (strings: TemplateStringsArray, ...values: unknown[]) => {
    const text = tagText(strings);
    state.calls.push({ text, values });
    if (state.failOn && text.includes(state.failOn)) {
      throw new Error(`forced failure on: ${state.failOn}`);
    }
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
  startQuestionnaireSession,
  getSessionByResumeToken,
  saveSessionAnswers,
  submitSession,
  validateAnswers,
} from "../questionnaire";
import { sha256Hex } from "../tokens";

const CTX = {
  actorType: "PROSPECT" as const,
  source: "test",
  requestId: "req-9",
};

const VALID_TOKEN_ROW = {
  id: 7,
  demo_request_id: 1,
  expires_at: new Date(Date.now() + 86400_000).toISOString(),
};
const SESSION_ROW = {
  id: 11,
  expires_at: new Date(Date.now() + 14 * 86400_000).toISOString(),
};

function statements(): string[] {
  return state.calls.map((c) => c.text);
}
function allValues(): string {
  return JSON.stringify(state.calls.map((c) => c.values));
}

beforeEach(() => {
  state.calls = [];
  state.clientRows = [];
  state.poolRows = [];
  state.failOn = null;
  vi.clearAllMocks();
  mockTransition.mockResolvedValue({ ok: true, noop: false });
  mockRecordEvent.mockResolvedValue({ ok: true, eventId: 1 });
});

// ---------------------------------------------------------------------------
// Session start
// ---------------------------------------------------------------------------

describe("startQuestionnaireSession", () => {
  it("consumes token, creates session, and records consumption in one transaction", async () => {
    state.clientRows = [[VALID_TOKEN_ROW], [SESSION_ROW], []];
    const result = await startQuestionnaireSession("raw-invite", CTX);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.resumeToken).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(result.leadId).toBe(1);

    const texts = statements();
    expect(texts[0]).toBe("BEGIN");
    expect(texts.some((t) => t.includes("SET used_at = NOW()"))).toBe(true);
    expect(
      texts.some((t) => t.includes("INSERT INTO discovery_questionnaire_sessions"))
    ).toBe(true);
    expect(texts.some((t) => t.includes("QUESTIONNAIRE_TOKEN_CONSUMED"))).toBe(true);
    expect(texts).toContain("COMMIT");
  });

  it("stores only resume token hash; neither raw token appears in any DB call", async () => {
    state.clientRows = [[VALID_TOKEN_ROW], [SESSION_ROW], []];
    const result = await startQuestionnaireSession("raw-invite-secret", CTX);
    if (!result.ok) throw new Error("expected ok");
    expect(allValues()).not.toContain("raw-invite-secret");
    expect(allValues()).not.toContain(result.resumeToken);
    expect(allValues()).toContain(sha256Hex(result.resumeToken));
  });

  it("invalid/used/expired/revoked token collapses to one failure with rollback", async () => {
    state.clientRows = [[]]; // consume matches nothing
    const result = await startQuestionnaireSession("raw-invite", CTX);
    expect(result).toEqual({ ok: false, reason: "invalid_token" });
    expect(statements()).toContain("ROLLBACK");
    expect(mockTransition).not.toHaveBeenCalled();
  });

  it("token consumption and session creation roll back together", async () => {
    state.clientRows = [[VALID_TOKEN_ROW]];
    state.failOn = "INSERT INTO discovery_questionnaire_sessions";
    await expect(startQuestionnaireSession("raw-invite", CTX)).rejects.toThrow();
    expect(statements()).toContain("ROLLBACK");
    expect(statements()).not.toContain("COMMIT");
    expect(release).toHaveBeenCalled();
  });

  it("first access records OPENED and transitions to QUESTIONNAIRE_STARTED with the same correlation ID", async () => {
    state.clientRows = [[VALID_TOKEN_ROW], [SESSION_ROW], []];
    await startQuestionnaireSession("raw-invite", CTX);
    expect(mockRecordEvent).toHaveBeenCalledWith(
      1,
      "QUESTIONNAIRE_OPENED",
      expect.objectContaining({ requestId: "req-9" })
    );
    expect(mockTransition).toHaveBeenCalledWith(
      1,
      "QUESTIONNAIRE_STARTED",
      expect.objectContaining({ requestId: "req-9" })
    );
  });
});

// ---------------------------------------------------------------------------
// Resume
// ---------------------------------------------------------------------------

describe("getSessionByResumeToken", () => {
  const SESSION_JOIN_ROW = {
    id: 11,
    demo_request_id: 1,
    answers: { hcmSystem: "Workday" },
    completed_at: null,
    expires_at: new Date(Date.now() + 86400_000).toISOString(),
    last_accessed_at: new Date(Date.now() - 2 * 3600_000).toISOString(),
    first_name: "Jane",
    name: "Jane Smith",
    company: "Acme",
  };

  it("resumes with the session cookie without touching the invitation token", async () => {
    state.poolRows = [[SESSION_JOIN_ROW], []];
    const session = await getSessionByResumeToken("resume-raw", CTX);
    expect(session).toMatchObject({
      sessionId: 11,
      leadId: 1,
      firstName: "Jane",
      answers: { hcmSystem: "Workday" },
      completed: false,
    });
    expect(
      statements().some((t) => t.includes("discovery_questionnaire_tokens"))
    ).toBe(false);
  });

  it("records SESSION_RESUMED at most once per hour", async () => {
    state.poolRows = [[SESSION_JOIN_ROW], []];
    await getSessionByResumeToken("resume-raw", CTX);
    expect(mockRecordEvent).toHaveBeenCalledWith(
      1,
      "QUESTIONNAIRE_SESSION_RESUMED",
      expect.anything()
    );

    vi.clearAllMocks();
    state.calls = [];
    state.poolRows = [
      [{ ...SESSION_JOIN_ROW, last_accessed_at: new Date().toISOString() }],
      [],
    ];
    await getSessionByResumeToken("resume-raw", CTX);
    expect(mockRecordEvent).not.toHaveBeenCalled();
  });

  it("returns null for unknown or expired sessions", async () => {
    state.poolRows = [[]];
    expect(await getSessionByResumeToken("nope", CTX)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Save / submit
// ---------------------------------------------------------------------------

describe("saveSessionAnswers / submitSession", () => {
  it("saves validated answers", async () => {
    state.poolRows = [[{ id: 11, demo_request_id: 1 }]];
    const result = await saveSessionAnswers(
      "resume-raw",
      { hcmSystem: "Workday", governanceConfidence: 4 },
      CTX
    );
    expect(result).toEqual({ ok: true });
    const update = statements().find((t) =>
      t.includes("SET answers = $")
    )!;
    expect(update).toContain("completed_at IS NULL");
  });

  it("completed sessions reject further saves", async () => {
    state.poolRows = [[], [{ completed_at: new Date().toISOString() }]];
    const result = await saveSessionAnswers("resume-raw", { hcmSystem: "X" }, CTX);
    expect(result).toMatchObject({ ok: false, reason: "completed" });
  });

  it("submit finalizes, records SUBMITTED, and transitions to QUESTIONNAIRE_COMPLETED", async () => {
    state.poolRows = [[{ id: 11, demo_request_id: 1 }]];
    const result = await submitSession(
      "resume-raw",
      { governanceConfidence: 6, meetingPurpose: "Assess controls" },
      CTX
    );
    expect(result).toEqual({ ok: true, leadId: 1 });
    expect(mockRecordEvent).toHaveBeenCalledWith(
      1,
      "QUESTIONNAIRE_SUBMITTED",
      expect.objectContaining({ requestId: "req-9" })
    );
    expect(mockTransition).toHaveBeenCalledWith(
      1,
      "QUESTIONNAIRE_COMPLETED",
      expect.objectContaining({ requestId: "req-9" })
    );
  });

  it("completed sessions reject re-submission", async () => {
    state.poolRows = [[], [{ completed_at: new Date().toISOString() }]];
    const result = await submitSession("resume-raw", {}, CTX);
    expect(result).toMatchObject({ ok: false, reason: "completed" });
    expect(mockTransition).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Answers allowlist — doctrine item 7 enforcement
// ---------------------------------------------------------------------------

describe("validateAnswers", () => {
  it("accepts the full valid shape", () => {
    const result = validateAnswers({
      organizationSize: "201-500",
      operatingRegions: ["US-CA", "US-NY", "UK"],
      payrollFrequencies: "biweekly",
      hcmSystem: "Workday",
      payrollProvider: "ADP",
      operatingModel: "hybrid",
      payrollTeamSize: "6-10",
      topConcerns: ["Off-cycle audit trail", "Multi-state tax", "Vendor SLAs"],
      reportingMaturity: 3,
      complianceConfidence: 6,
      governanceConfidence: 4,
      desiredFutureState: "Continuous validation with evidence.",
      meetingPurpose: "Evaluate governance fit.",
    });
    expect(result.ok).toBe(true);
  });

  it("rejects unknown fields — no arbitrary payloads", () => {
    expect(validateAnswers({ employeeSsnList: ["..."] })).toMatchObject({
      ok: false,
      error: "unknown_field:employeeSsnList",
    });
  });

  it("rejects oversized values and file-like blobs via length caps", () => {
    expect(
      validateAnswers({ desiredFutureState: "x".repeat(2001) })
    ).toMatchObject({ ok: false });
    expect(
      validateAnswers({ topConcerns: ["a", "b", "c", "d"] })
    ).toMatchObject({ ok: false });
  });

  it("rejects out-of-range confidence scores", () => {
    expect(validateAnswers({ governanceConfidence: 11 })).toMatchObject({
      ok: false,
    });
    expect(validateAnswers({ complianceConfidence: 0 })).toMatchObject({
      ok: false,
    });
  });

  it("rejects non-object payloads", () => {
    expect(validateAnswers("csv,data")).toMatchObject({ ok: false });
    expect(validateAnswers([1, 2, 3])).toMatchObject({ ok: false });
  });
});
