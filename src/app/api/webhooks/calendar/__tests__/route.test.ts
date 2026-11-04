import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import crypto from "node:crypto";
import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const state: { poolRows: Record<string, unknown>[][]; calls: string[] } = {
  poolRows: [],
  calls: [],
};

vi.mock("@vercel/postgres", () => ({
  sql: async (strings: TemplateStringsArray) => {
    const text = strings.join("$").replace(/\s+/g, " ").trim();
    state.calls.push(text);
    return { rows: state.poolRows.shift() ?? [] };
  },
  db: { connect: vi.fn() },
}));

const mockApply = vi.fn();
vi.mock("@/lib/commercial/lifecycle", () => ({
  applyCalendarEvent: (...args: unknown[]) => mockApply(...args),
}));

import {
  buildSchedulingUrl,
  verifyCalcomSignature,
  parseCalcomEvent,
  externalIdFor,
} from "@/lib/commercial/scheduling";
import { POST } from "../route";

const WEBHOOK_SECRET = "cal-secret";
const LINK_SECRET = "link-secret";

function signedRequest(body: unknown, opts?: { badSignature?: boolean }): NextRequest {
  const raw = JSON.stringify(body);
  const sig = opts?.badSignature
    ? "0".repeat(64)
    : crypto.createHmac("sha256", WEBHOOK_SECRET).update(raw).digest("hex");
  return new NextRequest("http://localhost/api/webhooks/calendar", {
    method: "POST",
    headers: { "x-cal-signature-256": sig },
    body: raw,
  });
}

function bookingPayload(
  trigger: string,
  overrides: Record<string, unknown> = {}
): Record<string, unknown> {
  return {
    triggerEvent: trigger,
    payload: {
      uid: "bk_123",
      startTime: "2026-08-01T15:00:00Z",
      endTime: "2026-08-01T15:45:00Z",
      attendees: [{ email: "Jane@Acme.com", name: "Jane" }],
      metadata: {},
      ...overrides,
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  state.poolRows = [];
  state.calls = [];
  process.env.CALCOM_WEBHOOK_SECRET = WEBHOOK_SECRET;
  process.env.CALCOM_EVENT_URL = "https://cal.com/pse/discovery";
  process.env.LINK_SIGNING_SECRET = LINK_SECRET;
  mockApply.mockResolvedValue({ ok: true, duplicate: false });
});

afterEach(() => {
  delete process.env.CALCOM_WEBHOOK_SECRET;
  delete process.env.CALCOM_EVENT_URL;
  delete process.env.LINK_SIGNING_SECRET;
});

// ---------------------------------------------------------------------------
// URL builder
// ---------------------------------------------------------------------------

describe("buildSchedulingUrl", () => {
  it("builds the prefill + attribution URL", () => {
    const url = buildSchedulingUrl({
      id: 42,
      email: "jane@acme.com",
      firstName: "Jane",
      lastName: "Smith",
    })!;
    const parsed = new URL(url);
    expect(parsed.origin + parsed.pathname).toBe("https://cal.com/pse/discovery");
    expect(parsed.searchParams.get("name")).toBe("Jane Smith");
    expect(parsed.searchParams.get("email")).toBe("jane@acme.com");
    expect(parsed.searchParams.get("metadata[leadRef]")).toMatch(/^42\.[0-9a-f]{32}$/);
  });

  it("returns null when scheduling is not configured", () => {
    delete process.env.CALCOM_EVENT_URL;
    expect(
      buildSchedulingUrl({ id: 1, email: "a@b.co", firstName: "A", lastName: null })
    ).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Signature + parsing
// ---------------------------------------------------------------------------

describe("verifyCalcomSignature", () => {
  it("accepts a valid signature and rejects invalid/missing/unconfigured", () => {
    const raw = '{"a":1}';
    const good = crypto.createHmac("sha256", WEBHOOK_SECRET).update(raw).digest("hex");
    expect(verifyCalcomSignature(raw, good)).toBe(true);
    expect(verifyCalcomSignature(raw, "deadbeef".repeat(8))).toBe(false);
    expect(verifyCalcomSignature(raw, null)).toBe(false);
    delete process.env.CALCOM_WEBHOOK_SECRET;
    expect(verifyCalcomSignature(raw, good)).toBe(false);
  });
});

describe("parseCalcomEvent / externalIdFor", () => {
  it("parses a booking event and normalizes attendee emails", () => {
    const event = parseCalcomEvent(bookingPayload("BOOKING_CREATED"))!;
    expect(event.trigger).toBe("BOOKING_CREATED");
    expect(event.bookingUid).toBe("bk_123");
    expect(event.attendeeEmails).toEqual(["jane@acme.com"]);
  });

  it("rejects unknown triggers and malformed payloads", () => {
    expect(parseCalcomEvent(bookingPayload("MEETING_ENDED"))).toBeNull();
    expect(parseCalcomEvent({ triggerEvent: "BOOKING_CREATED" })).toBeNull();
    expect(parseCalcomEvent(null)).toBeNull();
  });

  it("reschedules get time-scoped external ids; created/cancelled use the uid", () => {
    const created = parseCalcomEvent(bookingPayload("BOOKING_CREATED"))!;
    const rescheduled = parseCalcomEvent(bookingPayload("BOOKING_RESCHEDULED"))!;
    expect(externalIdFor(created)).toBe("bk_123");
    expect(externalIdFor(rescheduled)).toBe("bk_123:2026-08-01T15:00:00Z");
  });
});

// ---------------------------------------------------------------------------
// Webhook route
// ---------------------------------------------------------------------------

describe("POST /api/webhooks/calendar", () => {
  it("rejects invalid signatures without touching the lead", async () => {
    const res = await POST(signedRequest(bookingPayload("BOOKING_CREATED"), { badSignature: true }));
    expect(res.status).toBe(401);
    expect(mockApply).not.toHaveBeenCalled();
  });

  it("processes a signed and email-matched lead reference through the atomic lifecycle", async () => {
    const ref = new URL(buildSchedulingUrl({ id: 42, email: "jane@acme.com" })!)
      .searchParams.get("metadata[leadRef]")!;
    state.poolRows = [[{ id: 42, email: "jane@acme.com" }]];
    const res = await POST(signedRequest(
      bookingPayload("BOOKING_CREATED", { metadata: { leadRef: ref } })
    ));
    expect(await res.json()).toEqual({ received: true, handled: true });
    expect(mockApply).toHaveBeenCalledWith(
      42, "MEETING_BOOKED", "bk_123", "bk_123",
      expect.objectContaining({ actorType: "CALENDAR_PROVIDER" })
    );
  });

  it("falls back only when a unique email identifies a lead", async () => {
    state.poolRows = [[{ id: 7 }]];
    const res = await POST(signedRequest(bookingPayload("BOOKING_CREATED")));
    expect(res.status).toBe(200);
    expect(mockApply).toHaveBeenCalledWith(
      7, "MEETING_BOOKED", "bk_123", "bk_123", expect.anything()
    );
  });

  it("reports a duplicate without applying the event twice", async () => {
    state.poolRows = [[{ id: 7 }]];
    mockApply.mockResolvedValueOnce({ ok: true, duplicate: true });
    const res = await POST(signedRequest(bookingPayload("BOOKING_CREATED")));
    expect(await res.json()).toMatchObject({ duplicate: true });
    expect(mockApply).toHaveBeenCalledTimes(1);
  });

  it("passes rescheduling through the lifecycle with time-scoped idempotency", async () => {
    state.poolRows = [[{ id: 7 }]];
    await POST(signedRequest(bookingPayload("BOOKING_RESCHEDULED")));
    expect(mockApply).toHaveBeenCalledWith(
      7, "MEETING_RESCHEDULED", "bk_123", "bk_123:2026-08-01T15:00:00Z",
      expect.anything()
    );
  });

  it("passes cancellation through the lifecycle", async () => {
    state.poolRows = [[{ id: 7 }]];
    await POST(signedRequest(bookingPayload("BOOKING_CANCELLED")));
    expect(mockApply).toHaveBeenCalledWith(
      7, "MEETING_CANCELLED", "bk_123", "bk_123", expect.anything()
    );
  });

  it("does not apply ambiguous, forged or forwarded booking references", async () => {
    const ref = new URL(buildSchedulingUrl({ id: 42, email: "jane@acme.com" })!)
      .searchParams.get("metadata[leadRef]")!;
    for (const [overrides, rows] of [
      [{ metadata: { leadRef: "42.invalid" } }, []],
      [{ metadata: { leadRef: ref }, attendees: [{ email: "other@acme.com" }] }, [{ id: 42, email: "jane@acme.com" }]],
      [{ metadata: {} }, [{ id: 1 }, { id: 2 }]],
    ] as const) {
      state.poolRows = [[...rows]];
      const response = await POST(signedRequest(bookingPayload("BOOKING_CREATED", overrides)));
      expect(await response.json()).toMatchObject({ handled: false });
    }
    expect(mockApply).not.toHaveBeenCalled();
  });

  it("keeps failed business-rule reconciliations visibly unhandled", async () => {
    state.poolRows = [[{ id: 7 }]];
    mockApply.mockResolvedValueOnce({ ok: false, reason: "invalid_transition" });
    const res = await POST(signedRequest(bookingPayload("BOOKING_CREATED")));
    expect(await res.json()).toEqual({ received: true, handled: false });
  });

  it("returns 500 on transaction failure so the provider can retry", async () => {
    state.poolRows = [[{ id: 7 }]];
    mockApply.mockRejectedValueOnce(new Error("db disconnected"));
    const res = await POST(signedRequest(bookingPayload("BOOKING_CREATED")));
    expect(res.status).toBe(500);
  });

  it("acknowledges an unmatched booking without mutating a lead", async () => {
    state.poolRows = [[]];
    const res = await POST(signedRequest(bookingPayload("BOOKING_CREATED")));
    expect(await res.json()).toMatchObject({ handled: false });
    expect(mockApply).not.toHaveBeenCalled();
  });
});
