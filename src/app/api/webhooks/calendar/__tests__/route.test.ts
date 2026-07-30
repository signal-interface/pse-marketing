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

const mockTransition = vi.fn();
const mockRecordEvent = vi.fn();
vi.mock("@/lib/commercial/lifecycle", () => ({
  transitionLead: (...args: unknown[]) => mockTransition(...args),
  recordLeadEvent: (...args: unknown[]) => mockRecordEvent(...args),
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
  mockRecordEvent.mockResolvedValue({ ok: true, eventId: 1 });
  mockTransition.mockResolvedValue({ ok: true, noop: false });
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
  it("rejects invalid signatures with 401 and no processing", async () => {
    const res = await POST(
      signedRequest(bookingPayload("BOOKING_CREATED"), { badSignature: true })
    );
    expect(res.status).toBe(401);
    expect(mockRecordEvent).not.toHaveBeenCalled();
  });

  it("BOOKING_CREATED: records MEETING_BOOKED, sets calendar_event_id, transitions to MEETING_SCHEDULED", async () => {
    // resolveBookingLead via signed leadRef
    const ref = new URL(
      buildSchedulingUrl({ id: 42, email: "jane@acme.com", firstName: "Jane", lastName: null })!
    ).searchParams.get("metadata[leadRef]")!;
    state.poolRows = [[{ id: 42 }], []]; // lead exists; UPDATE calendar_event_id

    const res = await POST(
      signedRequest(bookingPayload("BOOKING_CREATED", { metadata: { leadRef: ref } }))
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ handled: true });

    expect(mockRecordEvent).toHaveBeenCalledWith(
      42,
      "MEETING_BOOKED",
      expect.objectContaining({
        actorType: "CALENDAR_PROVIDER",
        externalId: "bk_123",
        metadata: expect.objectContaining({ bookingUid: "bk_123" }),
      })
    );
    expect(state.calls.some((t) => t.includes("SET calendar_event_id"))).toBe(true);
    expect(mockTransition).toHaveBeenCalledWith(
      42,
      "MEETING_SCHEDULED",
      expect.objectContaining({ actorType: "CALENDAR_PROVIDER" })
    );
  });

  it("falls back to attendee email when no leadRef is present", async () => {
    state.poolRows = [[{ id: 7 }], []]; // email lookup, then UPDATE
    const res = await POST(signedRequest(bookingPayload("BOOKING_CREATED")));
    expect(res.status).toBe(200);
    expect(mockRecordEvent).toHaveBeenCalledWith(7, "MEETING_BOOKED", expect.anything());
  });

  it("duplicate delivery is acknowledged without reprocessing", async () => {
    state.poolRows = [[{ id: 7 }]];
    mockRecordEvent.mockResolvedValueOnce({ ok: false, reason: "duplicate_external_id" });
    const res = await POST(signedRequest(bookingPayload("BOOKING_CREATED")));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ duplicate: true });
    expect(mockTransition).not.toHaveBeenCalled();
    expect(state.calls.some((t) => t.includes("SET calendar_event_id"))).toBe(false);
  });

  it("BOOKING_RESCHEDULED records the event without a status change", async () => {
    state.poolRows = [[{ id: 7 }]];
    const res = await POST(signedRequest(bookingPayload("BOOKING_RESCHEDULED")));
    expect(res.status).toBe(200);
    expect(mockRecordEvent).toHaveBeenCalledWith(7, "MEETING_RESCHEDULED", expect.anything());
    expect(mockTransition).not.toHaveBeenCalled();
  });

  it("BOOKING_CANCELLED records the event and transitions to NURTURE", async () => {
    state.poolRows = [[{ id: 7 }]];
    const res = await POST(signedRequest(bookingPayload("BOOKING_CANCELLED")));
    expect(res.status).toBe(200);
    expect(mockRecordEvent).toHaveBeenCalledWith(7, "MEETING_CANCELLED", expect.anything());
    expect(mockTransition).toHaveBeenCalledWith(
      7,
      "NURTURE",
      expect.objectContaining({
        metadata: expect.objectContaining({ reason: "booking_cancelled" }),
      })
    );
  });

  it("unresolvable bookings acknowledge with 200 and record nothing", async () => {
    state.poolRows = [[]]; // email lookup misses
    const res = await POST(signedRequest(bookingPayload("BOOKING_CREATED")));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ handled: false });
    expect(mockRecordEvent).not.toHaveBeenCalled();
    expect(mockTransition).not.toHaveBeenCalled();
  });
});
