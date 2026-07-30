import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Mocks — the route is tested in isolation; lifecycle behavior has its own
// suite in src/lib/commercial/__tests__/lifecycle.test.ts.
// ---------------------------------------------------------------------------

const mockCreateLead = vi.fn();
const mockTransition = vi.fn();
const mockRecordEvent = vi.fn();
vi.mock("@/lib/commercial/lifecycle", () => ({
  createLeadWithEvent: (...args: unknown[]) => mockCreateLead(...args),
  transitionLead: (...args: unknown[]) => mockTransition(...args),
  recordLeadEvent: (...args: unknown[]) => mockRecordEvent(...args),
  classifyEmailDomain: (email: string) =>
    email.endsWith("@gmail.com") ? "FREE" : "WORK",
}));

const mockLimit = vi.fn();
vi.mock("@/lib/rateLimiter", () => ({
  checkAndIncrementScopedLimit: (...args: unknown[]) => mockLimit(...args),
}));

vi.mock("@/lib/commercial/links", () => ({
  signLeadRef: vi.fn(() => "42.abc"),
}));

const mockSend = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mockSend };
  },
}));

import { POST } from "../route";

const VALID_BODY = {
  firstName: "Jane",
  lastName: "Smith",
  email: "Jane@Acme.com",
  company: "Acme",
  jobTitle: "Payroll Director",
  employees: "51-200",
  source: "pse-marketing",
};

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest("http://localhost/api/demo-request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.9",
    },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("COMMERCIAL_IP_HASH_SALT", "test-salt");
  mockLimit.mockResolvedValue({ allowed: true, count: 1 });
  mockCreateLead.mockResolvedValue({ id: 42 });
  mockTransition.mockResolvedValue({
    ok: true,
    leadId: 42,
    from: "NEW",
    to: "VIDEO_SENT",
    noop: false,
  });
  mockRecordEvent.mockResolvedValue({ ok: true, eventId: 1 });
  mockSend.mockResolvedValue({ data: { id: "resend-id" }, error: null });
});

describe("POST /api/demo-request", () => {
  it("fails closed (503, no side effects) when COMMERCIAL_IP_HASH_SALT is unset", async () => {
    vi.stubEnv("COMMERCIAL_IP_HASH_SALT", "");
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(503);
    expect(mockLimit).not.toHaveBeenCalled();
    expect(mockCreateLead).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("happy path: creates lead, transitions, sends two emails, records outcomes", async () => {
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });

    // Lead created with normalized email and classification
    expect(mockCreateLead).toHaveBeenCalledTimes(1);
    expect(mockCreateLead.mock.calls[0][0]).toMatchObject({
      firstName: "Jane",
      email: "jane@acme.com",
      emailDomainType: "WORK",
    });

    // VIDEO_SENT only via transitionLead
    expect(mockTransition).toHaveBeenCalledWith(
      42,
      "VIDEO_SENT",
      expect.objectContaining({ actorType: "SYSTEM" })
    );

    expect(mockSend).toHaveBeenCalledTimes(2);
    expect(mockRecordEvent).toHaveBeenCalledTimes(2);
    expect(mockRecordEvent).toHaveBeenNthCalledWith(
      1,
      42,
      "EMAIL_SENT",
      expect.objectContaining({ metadata: expect.objectContaining({ kind: "internal" }) })
    );
    expect(mockRecordEvent).toHaveBeenNthCalledWith(
      2,
      42,
      "EMAIL_SENT",
      expect.objectContaining({ metadata: expect.objectContaining({ kind: "journey" }) })
    );
  });

  it("response contains only success — no internal identifiers", async () => {
    const res = await POST(makeRequest(VALID_BODY));
    const json = await res.json();
    expect(Object.keys(json)).toEqual(["success"]);
  });

  it.each([
    ["firstName", { ...VALID_BODY, firstName: "" }, "invalid_first_name"],
    ["email", { ...VALID_BODY, email: "not-an-email" }, "invalid_email"],
    ["company", { ...VALID_BODY, company: "x".repeat(201) }, "invalid_company"],
    ["jobTitle", { ...VALID_BODY, jobTitle: "x".repeat(151) }, "invalid_job_title"],
    ["employees", { ...VALID_BODY, employees: "9999" }, "invalid_employees"],
  ])("rejects invalid %s with 400 and no side effects", async (_f, body, error) => {
    const res = await POST(makeRequest(body));
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe(error);
    expect(mockCreateLead).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("accepts a thin payload — company, jobTitle, employees are optional (Stage C ruling)", async () => {
    const res = await POST(
      makeRequest({ firstName: "Jane", email: "jane@acme.com" })
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(mockCreateLead.mock.calls[0][0]).toMatchObject({
      firstName: "Jane",
      email: "jane@acme.com",
      company: undefined,
      jobTitle: undefined,
      employees: undefined,
    });
    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it("accepts empty-string optional fields as absent", async () => {
    const res = await POST(
      makeRequest({ ...VALID_BODY, company: "", jobTitle: "", employees: "" })
    );
    expect(res.status).toBe(200);
    expect(mockCreateLead.mock.calls[0][0]).toMatchObject({
      company: undefined,
      jobTitle: undefined,
      employees: undefined,
    });
  });

  it("oversized firstName is rejected", async () => {
    const res = await POST(
      makeRequest({ ...VALID_BODY, firstName: "x".repeat(101) })
    );
    expect(res.status).toBe(400);
  });

  it("unknown source falls back to allowlist default", async () => {
    await POST(makeRequest({ ...VALID_BODY, source: "evil-source" }));
    expect(mockCreateLead.mock.calls[0][0]).toMatchObject({
      source: "pse-marketing",
    });
  });

  it.each(["website", "ref_120"])(
    "honeypot field %s returns generic success with zero side effects",
    async (key) => {
      const res = await POST(makeRequest({ ...VALID_BODY, [key]: "bot" }));
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ success: true });
      expect(mockCreateLead).not.toHaveBeenCalled();
      expect(mockTransition).not.toHaveBeenCalled();
      expect(mockSend).not.toHaveBeenCalled();
      expect(mockLimit).not.toHaveBeenCalled();
    }
  );

  it("IP rate limit returns 429 without creating a lead", async () => {
    mockLimit.mockResolvedValueOnce({ allowed: false, count: 10 });
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(429);
    expect(mockCreateLead).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("duplicate email returns generic success without duplicate journey email", async () => {
    mockLimit
      .mockResolvedValueOnce({ allowed: true, count: 1 }) // ip
      .mockResolvedValueOnce({ allowed: false, count: 1 }); // email
    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    expect(mockCreateLead).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("uses dedicated rate limit scopes and normalized email identifier", async () => {
    await POST(makeRequest(VALID_BODY));
    expect(mockLimit).toHaveBeenNthCalledWith(
      1,
      "demo-request-ip",
      expect.any(String),
      expect.any(Number)
    );
    expect(mockLimit).toHaveBeenNthCalledWith(
      2,
      "demo-request-email",
      "jane@acme.com",
      expect.any(Number)
    );
    // IP identifier must be hashed, never the raw IP
    expect(mockLimit.mock.calls[0][1]).not.toBe("203.0.113.9");
    expect(mockLimit.mock.calls[0][1]).toMatch(/^[0-9a-f]{64}$/);
  });

  it("Resend failure records EMAIL_FAILED but the request still succeeds", async () => {
    mockSend
      .mockRejectedValueOnce(new Error("resend down"))
      .mockResolvedValueOnce({ data: null, error: { message: "bounced" } });

    const res = await POST(makeRequest(VALID_BODY));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });

    expect(mockCreateLead).toHaveBeenCalledTimes(1);
    expect(mockTransition).toHaveBeenCalledTimes(1);
    expect(mockRecordEvent).toHaveBeenNthCalledWith(
      1,
      42,
      "EMAIL_FAILED",
      expect.objectContaining({
        metadata: expect.objectContaining({ error: expect.stringContaining("resend down") }),
      })
    );
    // Resolved-with-error also counts as failure
    expect(mockRecordEvent).toHaveBeenNthCalledWith(
      2,
      42,
      "EMAIL_FAILED",
      expect.objectContaining({
        metadata: expect.objectContaining({ error: expect.stringContaining("bounced") }),
      })
    );
  });

  it("returns 400 on invalid JSON", async () => {
    const req = new NextRequest("http://localhost/api/demo-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
