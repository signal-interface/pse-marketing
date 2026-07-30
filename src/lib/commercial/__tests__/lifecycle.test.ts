import { describe, it, expect, vi, beforeEach } from "vitest";

// ---------------------------------------------------------------------------
// @vercel/postgres mock: a scriptable client whose tagged-template `sql`
// records every statement and serves configured SELECT results.
// ---------------------------------------------------------------------------

interface Call {
  text: string;
  values: unknown[];
}

const state: {
  calls: Call[];
  queryCalls: { text: string; values: unknown[] }[];
  selectRows: Record<string, unknown>[];
  failOn: string | null;
  poolRows: Record<string, unknown>[][];
} = {
  calls: [],
  queryCalls: [],
  selectRows: [],
  failOn: null,
  poolRows: [],
};

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
    if (text.startsWith("SELECT")) return { rows: state.selectRows };
    if (text.startsWith("INSERT") && text.includes("RETURNING id")) {
      return { rows: [{ id: 42 }] };
    }
    return { rows: [] };
  }
);

const clientQuery = vi.fn(async (text: string, values: unknown[]) => {
  state.queryCalls.push({ text: text.replace(/\s+/g, " ").trim(), values });
  if (state.failOn && text.includes(state.failOn)) {
    throw new Error(`forced failure on: ${state.failOn}`);
  }
  return { rows: [] };
});

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
    connect: vi.fn(async () => ({
      sql: clientSql,
      query: clientQuery,
      release,
    })),
  },
  sql: (strings: TemplateStringsArray, ...values: unknown[]) =>
    poolSql(strings, ...values),
}));

import {
  transitionLead,
  recordLeadEvent,
  createLeadWithEvent,
  classifyEmailDomain,
  canTransition,
  TRANSITIONS,
  LEAD_STATUSES,
  type LeadStatus,
} from "../lifecycle";

const CTX = { actorType: "SYSTEM" as const, source: "test" };

function statements(): string[] {
  return state.calls.map((c) => c.text);
}

beforeEach(() => {
  state.calls = [];
  state.queryCalls = [];
  state.selectRows = [];
  state.failOn = null;
  state.poolRows = [];
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Transition map
// ---------------------------------------------------------------------------

describe("transition map", () => {
  it("permits every ratified transition", async () => {
    for (const from of LEAD_STATUSES) {
      for (const to of TRANSITIONS[from]) {
        state.calls = [];
        state.selectRows = [{ lead_status: from }];
        const result = await transitionLead(1, to, CTX);
        expect(result).toMatchObject({ ok: true, from, to, noop: false });
      }
    }
  });

  it("rejects every prohibited transition without updating the lead", async () => {
    for (const from of LEAD_STATUSES) {
      for (const to of LEAD_STATUSES) {
        if (to === from || TRANSITIONS[from].includes(to)) continue;
        state.calls = [];
        state.queryCalls = [];
        state.selectRows = [{ lead_status: from }];
        const result = await transitionLead(1, to, CTX);
        expect(result).toMatchObject({
          ok: false,
          reason: "invalid_transition",
          from,
          to,
        });
        const writes = [
          ...statements().filter((t) => t.startsWith("UPDATE")),
          ...state.queryCalls.filter((q) => q.text.startsWith("UPDATE")),
        ];
        expect(writes).toHaveLength(0);
      }
    }
  });

  it("QUALIFIED can reopen to NURTURE or DISQUALIFIED and nothing else", () => {
    expect(canTransition("QUALIFIED", "NURTURE")).toBe(true);
    expect(canTransition("QUALIFIED", "DISQUALIFIED")).toBe(true);
    for (const to of LEAD_STATUSES) {
      if (to === "NURTURE" || to === "DISQUALIFIED") continue;
      expect(canTransition("QUALIFIED", to)).toBe(false);
    }
  });

  it("DISQUALIFIED is the only terminal state", () => {
    expect(TRANSITIONS.DISQUALIFIED).toHaveLength(0);
    for (const to of LEAD_STATUSES) {
      expect(canTransition("DISQUALIFIED", to)).toBe(false);
    }
    for (const from of LEAD_STATUSES) {
      if (from === "DISQUALIFIED") continue;
      expect(TRANSITIONS[from].length).toBeGreaterThan(0);
    }
  });

  it("NURTURE re-entry may land directly in QUESTIONNAIRE_COMPLETED (status is not monotonic — pinned deliberately)", () => {
    expect(canTransition("NURTURE", "QUESTIONNAIRE_COMPLETED")).toBe(true);
  });

  it("full-map regression guard", () => {
    expect(TRANSITIONS).toEqual({
      NEW: ["VIDEO_SENT", "DISQUALIFIED"],
      VIDEO_SENT: [
        "VIDEO_ENGAGED",
        "QUESTIONNAIRE_SENT",
        "NURTURE",
        "DISQUALIFIED",
      ],
      VIDEO_ENGAGED: ["QUESTIONNAIRE_SENT", "NURTURE", "DISQUALIFIED"],
      QUESTIONNAIRE_SENT: [
        "QUESTIONNAIRE_STARTED",
        "QUESTIONNAIRE_COMPLETED",
        "NURTURE",
        "DISQUALIFIED",
      ],
      QUESTIONNAIRE_STARTED: [
        "QUESTIONNAIRE_COMPLETED",
        "NURTURE",
        "DISQUALIFIED",
      ],
      QUESTIONNAIRE_COMPLETED: ["MEETING_SCHEDULED", "NURTURE", "DISQUALIFIED"],
      MEETING_SCHEDULED: ["DISCOVERY_COMPLETE", "NURTURE", "DISQUALIFIED"],
      DISCOVERY_COMPLETE: ["QUALIFIED", "NURTURE", "DISQUALIFIED"],
      NURTURE: [
        "VIDEO_ENGAGED",
        "QUESTIONNAIRE_SENT",
        "QUESTIONNAIRE_STARTED",
        "QUESTIONNAIRE_COMPLETED",
        "MEETING_SCHEDULED",
        "DISQUALIFIED",
      ],
      QUALIFIED: ["NURTURE", "DISQUALIFIED"],
      DISQUALIFIED: [],
    });
  });
});

// ---------------------------------------------------------------------------
// transitionLead behavior
// ---------------------------------------------------------------------------

describe("transitionLead", () => {
  it("same-state call returns noop:true and writes nothing", async () => {
    state.selectRows = [{ lead_status: "VIDEO_SENT" }];
    const result = await transitionLead(1, "VIDEO_SENT", CTX);
    expect(result).toMatchObject({ ok: true, noop: true });
    expect(statements().some((t) => t.startsWith("UPDATE"))).toBe(false);
    expect(statements().some((t) => t.startsWith("INSERT"))).toBe(false);
    expect(statements()).toContain("ROLLBACK");
  });

  it("unknown lead returns not_found", async () => {
    state.selectRows = [];
    const result = await transitionLead(999, "VIDEO_SENT", CTX);
    expect(result).toMatchObject({ ok: false, reason: "not_found" });
  });

  it("a successful transition writes exactly one event", async () => {
    state.selectRows = [{ lead_status: "NEW" }];
    await transitionLead(1, "VIDEO_SENT", CTX);
    const eventInserts = statements().filter((t) =>
      t.includes("INSERT INTO lead_events")
    );
    expect(eventInserts).toHaveLength(1);
    expect(eventInserts[0]).toContain("STATUS_TRANSITIONED");
    expect(statements()).toContain("COMMIT");
  });

  it("locks the row FOR UPDATE before deciding", async () => {
    state.selectRows = [{ lead_status: "NEW" }];
    await transitionLead(1, "VIDEO_SENT", CTX);
    const select = statements().find((t) => t.startsWith("SELECT"));
    expect(select).toContain("FOR UPDATE");
  });

  it("first-touch timestamp columns use COALESCE (never overwritten)", async () => {
    state.selectRows = [{ lead_status: "NURTURE" }];
    await transitionLead(1, "QUESTIONNAIRE_SENT", CTX);
    const update = state.queryCalls.find((q) => q.text.startsWith("UPDATE"));
    expect(update).toBeDefined();
    expect(update!.text).toContain(
      "questionnaire_sent_at = COALESCE(questionnaire_sent_at, NOW())"
    );
  });

  it("rolls back the transaction if the event insert fails", async () => {
    state.selectRows = [{ lead_status: "NEW" }];
    state.failOn = "INSERT INTO lead_events";
    await expect(transitionLead(1, "VIDEO_SENT", CTX)).rejects.toThrow();
    expect(statements()).toContain("ROLLBACK");
    expect(statements()).not.toContain("COMMIT");
    expect(release).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// recordLeadEvent idempotency
// ---------------------------------------------------------------------------

describe("recordLeadEvent", () => {
  it("returns the event id on insert", async () => {
    state.poolRows = [[{ id: 7 }]];
    const result = await recordLeadEvent(1, "EMAIL_SENT", CTX);
    expect(result).toEqual({ ok: true, eventId: 7 });
  });

  it("duplicate (event_type, external_id) delivery is ignored", async () => {
    state.poolRows = [[]]; // ON CONFLICT DO NOTHING returns no rows
    const result = await recordLeadEvent(1, "MEETING_BOOKED", {
      actorType: "CALENDAR_PROVIDER",
      externalId: "evt_123",
    });
    expect(result).toEqual({ ok: false, reason: "duplicate_external_id" });
    const insert = statements().find((t) =>
      t.includes("INSERT INTO lead_events")
    );
    expect(insert).toContain("ON CONFLICT (event_type, external_id)");
    expect(insert).toContain("DO NOTHING");
  });
});

// ---------------------------------------------------------------------------
// createLeadWithEvent atomicity
// ---------------------------------------------------------------------------

describe("createLeadWithEvent", () => {
  const INPUT = {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@acme.com",
    company: "Acme",
    jobTitle: "Payroll Director",
    employees: "51-200",
    source: "pse-marketing",
    emailDomainType: "WORK" as const,
  };

  it("inserts lead and LEAD_CREATED in one transaction", async () => {
    const result = await createLeadWithEvent(INPUT, CTX);
    expect(result).toEqual({ id: 42 });
    const texts = statements();
    expect(texts[0]).toBe("BEGIN");
    expect(texts.some((t) => t.includes("INSERT INTO demo_requests"))).toBe(
      true
    );
    expect(
      texts.some(
        (t) => t.includes("INSERT INTO lead_events") && t.includes("LEAD_CREATED")
      )
    ).toBe(true);
    expect(texts[texts.length - 1]).toBe("COMMIT");
  });

  it("rolls back the lead if the LEAD_CREATED insert fails", async () => {
    state.failOn = "INSERT INTO lead_events";
    await expect(createLeadWithEvent(INPUT, CTX)).rejects.toThrow();
    expect(statements()).toContain("ROLLBACK");
    expect(statements()).not.toContain("COMMIT");
  });
});

// ---------------------------------------------------------------------------
// Email domain classification
// ---------------------------------------------------------------------------

describe("classifyEmailDomain", () => {
  it("classifies free providers as FREE", () => {
    expect(classifyEmailDomain("a@gmail.com")).toBe("FREE");
    expect(classifyEmailDomain("a@OUTLOOK.com")).toBe("FREE");
    expect(classifyEmailDomain("a@proton.me")).toBe("FREE");
  });

  it("classifies non-free domains as WORK", () => {
    expect(classifyEmailDomain("jane@acme.com")).toBe("WORK");
    expect(classifyEmailDomain("cfo@payrollsynergyexperts.com")).toBe("WORK");
  });

  it("classifies malformed input as UNKNOWN", () => {
    expect(classifyEmailDomain("not-an-email")).toBe("UNKNOWN");
    expect(classifyEmailDomain("a@nodot")).toBe("UNKNOWN");
  });
});
