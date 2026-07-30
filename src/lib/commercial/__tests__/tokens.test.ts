import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// Scriptable @vercel/postgres mock (same pattern as lifecycle.test.ts)
// ---------------------------------------------------------------------------

interface Call {
  text: string;
  values: unknown[];
}

const state: {
  calls: Call[];
  leadStatus: string | null;
  revokedIds: number[];
  poolRows: Record<string, unknown>[][];
  failOn: string | null;
} = { calls: [], leadStatus: "VIDEO_SENT", revokedIds: [], poolRows: [], failOn: null };

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
    if (text.includes("SELECT lead_status")) {
      return {
        rows: state.leadStatus ? [{ lead_status: state.leadStatus }] : [],
      };
    }
    if (text.includes("UPDATE discovery_questionnaire_tokens") && text.includes("revoked_at = NOW()")) {
      return { rows: state.revokedIds.map((id) => ({ id })) };
    }
    if (text.includes("INSERT INTO discovery_questionnaire_tokens")) {
      return {
        rows: [{ id: 7, expires_at: new Date(Date.now() + 7 * 86400_000).toISOString() }],
      };
    }
    return { rows: [] };
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
  db: {
    connect: vi.fn(async () => ({ sql: clientSql, release })),
  },
  sql: (strings: TemplateStringsArray, ...values: unknown[]) =>
    poolSql(strings, ...values),
}));

import {
  issueQuestionnaireToken,
  inspectQuestionnaireToken,
  consumeQuestionnaireToken,
  sha256Hex,
} from "../tokens";

const CTX = { actorType: "SYSTEM" as const, source: "test", requestId: "req-1" };

function statements(): string[] {
  return state.calls.map((c) => c.text);
}

function allValues(): string {
  return JSON.stringify(state.calls.map((c) => c.values));
}

beforeEach(() => {
  state.calls = [];
  state.leadStatus = "VIDEO_SENT";
  state.revokedIds = [];
  state.poolRows = [];
  state.failOn = null;
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Issuance
// ---------------------------------------------------------------------------

describe("issueQuestionnaireToken", () => {
  it("issues a 32-byte opaque base64url token", async () => {
    const result = await issueQuestionnaireToken(1, CTX);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // 32 random bytes → 43 base64url chars, no padding
    expect(result.rawToken).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it("stores only the SHA-256 hash — raw token never reaches the database", async () => {
    const result = await issueQuestionnaireToken(1, CTX);
    if (!result.ok) throw new Error("expected ok");
    const insert = state.calls.find((c) =>
      c.text.includes("INSERT INTO discovery_questionnaire_tokens")
    )!;
    expect(insert.values).toContain(sha256Hex(result.rawToken));
    expect(allValues()).not.toContain(result.rawToken);
  });

  it("revokes previous unused tokens for the same lead and purpose, in the same transaction", async () => {
    state.revokedIds = [3, 5];
    const result = await issueQuestionnaireToken(1, CTX);
    if (!result.ok) throw new Error("expected ok");
    expect(result.revokedCount).toBe(2);

    const texts = statements();
    expect(texts[0]).toBe("BEGIN");
    const revoke = texts.find((t) => t.includes("SET revoked_at = NOW()"))!;
    // Scoped to lead + purpose + unused + unrevoked — never other purposes
    expect(revoke).toContain("demo_request_id = $");
    expect(revoke).toContain("purpose = $");
    expect(revoke).toContain("used_at IS NULL");
    expect(revoke).toContain("revoked_at IS NULL");
    const revokedEvents = texts.filter((t) =>
      t.includes("QUESTIONNAIRE_TOKEN_REVOKED")
    );
    expect(revokedEvents).toHaveLength(2);
    expect(texts.filter((t) => t.includes("QUESTIONNAIRE_TOKEN_ISSUED"))).toHaveLength(1);
    expect(texts[texts.length - 1]).toBe("COMMIT");
  });

  it.each(["QUALIFIED", "DISQUALIFIED", "MEETING_SCHEDULED", "DISCOVERY_COMPLETE", "NEW"])(
    "rejects ineligible state %s without writing",
    async (status) => {
      state.leadStatus = status;
      const result = await issueQuestionnaireToken(1, CTX);
      expect(result).toMatchObject({ ok: false, reason: "ineligible_state", state: status });
      expect(statements().some((t) => t.startsWith("INSERT"))).toBe(false);
      expect(statements()).toContain("ROLLBACK");
    }
  );

  it.each(["VIDEO_SENT", "VIDEO_ENGAGED", "QUESTIONNAIRE_SENT", "NURTURE"])(
    "issues for eligible state %s",
    async (status) => {
      state.leadStatus = status;
      const result = await issueQuestionnaireToken(1, CTX);
      expect(result.ok).toBe(true);
    }
  );

  it("returns not_found for unknown lead", async () => {
    state.leadStatus = null;
    const result = await issueQuestionnaireToken(999, CTX);
    expect(result).toMatchObject({ ok: false, reason: "not_found" });
  });

  it("carries the correlation ID into issuance events", async () => {
    await issueQuestionnaireToken(1, CTX);
    const issuedEvent = state.calls.find((c) =>
      c.text.includes("QUESTIONNAIRE_TOKEN_ISSUED")
    )!;
    expect(issuedEvent.values).toContain("req-1");
  });
});

// ---------------------------------------------------------------------------
// Inspection — never consumes
// ---------------------------------------------------------------------------

describe("inspectQuestionnaireToken", () => {
  const baseRow = {
    id: 7,
    demo_request_id: 1,
    expires_at: new Date(Date.now() + 86400_000).toISOString(),
    used_at: null,
    revoked_at: null,
    first_name: "Jane",
    name: "Jane Smith",
    company: "Acme",
    lead_status: "QUESTIONNAIRE_SENT",
  };

  it("valid token inspection succeeds with minimal fields only", async () => {
    state.poolRows = [[baseRow]];
    const result = await inspectQuestionnaireToken("raw-token-x");
    expect(result).toEqual({
      valid: true,
      leadId: 1,
      firstName: "Jane",
      company: "Acme",
      expiresAt: new Date(baseRow.expires_at),
      started: false,
    });
    // No SELECT here may consume
    expect(statements().some((t) => t.startsWith("UPDATE"))).toBe(false);
  });

  it("unknown token fails NOT_FOUND", async () => {
    state.poolRows = [[]];
    expect(await inspectQuestionnaireToken("x")).toEqual({
      valid: false,
      reason: "NOT_FOUND",
    });
  });

  it("expired token fails EXPIRED", async () => {
    state.poolRows = [
      [{ ...baseRow, expires_at: new Date(Date.now() - 1000).toISOString() }],
    ];
    expect(await inspectQuestionnaireToken("x")).toEqual({
      valid: false,
      reason: "EXPIRED",
    });
  });

  it("used token fails USED", async () => {
    state.poolRows = [[{ ...baseRow, used_at: new Date().toISOString() }]];
    expect(await inspectQuestionnaireToken("x")).toEqual({
      valid: false,
      reason: "USED",
    });
  });

  it("revoked token fails REVOKED (checked before used)", async () => {
    state.poolRows = [
      [
        {
          ...baseRow,
          revoked_at: new Date().toISOString(),
          used_at: new Date().toISOString(),
        },
      ],
    ];
    expect(await inspectQuestionnaireToken("x")).toEqual({
      valid: false,
      reason: "REVOKED",
    });
  });
});

// ---------------------------------------------------------------------------
// Atomic consumption
// ---------------------------------------------------------------------------

describe("consumeQuestionnaireToken", () => {
  function fakeClient(results: Record<string, unknown>[][]) {
    const queue = [...results];
    return {
      sql: vi.fn(
        async (strings: TemplateStringsArray, ...values: unknown[]) => {
          const text = tagText(strings);
          state.calls.push({ text, values });
          return { rows: queue.shift() ?? [] };
        }
      ),
    };
  }

  it("uses the race-safe atomic UPDATE pattern", async () => {
    const client = fakeClient([
      [{ id: 7, demo_request_id: 1, expires_at: new Date().toISOString() }],
    ]);
    const result = await consumeQuestionnaireToken(client, "raw");
    expect(result).toMatchObject({ tokenId: 7, leadId: 1 });
    const update = statements().find((t) => t.includes("SET used_at = NOW()"))!;
    expect(update).toContain("used_at IS NULL");
    expect(update).toContain("revoked_at IS NULL");
    expect(update).toContain("expires_at > NOW()");
    expect(update).toContain("RETURNING");
  });

  it("two simultaneous consumes produce exactly one success", async () => {
    const client = fakeClient([
      [{ id: 7, demo_request_id: 1, expires_at: new Date().toISOString() }],
      [], // second UPDATE matches no rows
    ]);
    const [first, second] = await Promise.all([
      consumeQuestionnaireToken(client, "raw"),
      consumeQuestionnaireToken(client, "raw"),
    ]);
    const successes = [first, second].filter(Boolean);
    expect(successes).toHaveLength(1);
  });

  it("queries by hash — the raw token never appears in values", async () => {
    const client = fakeClient([[]]);
    await consumeQuestionnaireToken(client, "raw-secret-token");
    expect(allValues()).not.toContain("raw-secret-token");
    expect(allValues()).toContain(sha256Hex("raw-secret-token"));
  });
});
