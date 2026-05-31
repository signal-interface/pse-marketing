import { describe, it, expect, vi, beforeEach } from "vitest";

// Mocks must use inline factories (no top-level variable references)
vi.mock("@vercel/postgres", () => ({
  sql: vi.fn().mockResolvedValue({}),
}));

vi.mock("@/lib/db", () => ({
  ensureDemoRequestsTable: vi.fn().mockResolvedValue(undefined),
}));

const mockSend = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mockSend };
  },
}));

// Import after mocks are set up
import { POST } from "../route";
import { sql } from "@vercel/postgres";

function makeRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost/api/demo-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/demo-request", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({ data: { id: "test-id" }, error: null });
  });

  it("returns success for valid submission", async () => {
    const res = await POST(makeRequest({ name: "Jane", email: "jane@test.com", company: "Acme", employees: "1-50" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("inserts into database", async () => {
    await POST(makeRequest({ name: "Jane", email: "jane@test.com", company: "Acme", employees: "1-50" }));

    expect(sql).toHaveBeenCalled();
  });

  it("sends two emails", async () => {
    await POST(makeRequest({ name: "Jane", email: "jane@test.com", company: "Acme" }));

    expect(mockSend).toHaveBeenCalledTimes(2);

    // Internal notification
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "info@payrollsynergyexperts.com",
        subject: "New Demo Request: Acme",
      })
    );

    // Auto-response
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "jane@test.com",
        subject: "We received your demo request — Payroll Synergy Experts",
      })
    );
  });

  it("uses name in subject when company is empty", async () => {
    await POST(makeRequest({ name: "Jane", email: "jane@test.com" }));

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ subject: "New Demo Request: Jane" })
    );
  });

  it("returns 400 when name is missing", async () => {
    const res = await POST(makeRequest({ email: "jane@test.com" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Name and email are required");
    expect(sql).not.toHaveBeenCalled();
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(makeRequest({ name: "Jane" }));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Name and email are required");
  });

  it("silently accepts honeypot submissions without DB insert or email", async () => {
    const res = await POST(
      makeRequest({ name: "Bot", email: "bot@spam.com", website: "http://spam.com" })
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(sql).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 500 when database throws", async () => {
    vi.mocked(sql).mockRejectedValueOnce(new Error("DB connection failed"));

    const res = await POST(makeRequest({ name: "Jane", email: "jane@test.com" }));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Something went wrong");
  });

  it("still returns success when emails fail", async () => {
    mockSend.mockRejectedValue(new Error("Resend API error"));

    const res = await POST(makeRequest({ name: "Jane", email: "jane@test.com" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("sends from verified domain", async () => {
    await POST(makeRequest({ name: "Jane", email: "jane@test.com" }));

    for (const call of mockSend.mock.calls) {
      expect(call[0].from).toContain("@payrollsynergyexperts.com");
    }
  });
});
