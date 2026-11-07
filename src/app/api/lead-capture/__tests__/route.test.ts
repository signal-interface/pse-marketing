import { beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

const { sqlMock, scopedLimitMock, sendMock } = vi.hoisted(() => ({
  sqlMock: vi.fn(),
  scopedLimitMock: vi.fn(),
  sendMock: vi.fn(),
}));

vi.mock("@vercel/postgres", () => ({ sql: sqlMock }));
vi.mock("@/lib/db", () => ({ ensureChapTables: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/lib/rateLimiter", () => ({ checkAndIncrementScopedLimit: scopedLimitMock }));
vi.mock("resend", () => ({
  Resend: class { emails = { send: sendMock }; },
}));

import { POST } from "../route";

function req(payload: Record<string, unknown>): NextRequest {
  return new Request("https://localhost/api/lead-capture", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "192.0.2.25" },
    body: JSON.stringify(payload),
  }) as unknown as NextRequest;
}
const valid = { email: "QA@example.com", sessionId: "qa-1", firstQuestion: "What is IRC 6656?" };

describe("CHAP marketing lead capture reliability", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("COMMERCIAL_IP_HASH_SALT", "synthetic-test-salt");
    vi.stubEnv("RESEND_API_KEY", "re_synthetic_test_only");
    scopedLimitMock.mockResolvedValue({ allowed: true, count: 1 });
    sqlMock.mockResolvedValue({ rows: [{ id: 12 }] });
    sendMock.mockResolvedValue({ data: { id: "synthetic" }, error: null });
  });

  it("fails closed without hashing config", async () => {
    vi.stubEnv("COMMERCIAL_IP_HASH_SALT", "");
    expect((await POST(req(valid))).status).toBe(503);
    expect(sqlMock).not.toHaveBeenCalled();
  });

  it("honeypot submission is inert", async () => {
    const res = await POST(req({ ...valid, website: "https://spam.example" }));
    expect(res.status).toBe(200);
    expect(sqlMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("blocks before persistence when the capture IP cap is reached", async () => {
    scopedLimitMock.mockResolvedValue({ allowed: false, count: 10 });
    const res = await POST(req(valid));
    expect(res.status).toBe(429);
    expect(sqlMock).not.toHaveBeenCalled();
  });

  it("reports persistence success and sends a single notification", async () => {
    const res = await POST(req(valid));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, captured: true, notificationSent: true });
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("does not resend a notification for an already-captured session", async () => {
    sqlMock.mockResolvedValue({ rows: [] });
    const res = await POST(req(valid));
    expect(await res.json()).toEqual({ success: true, captured: true });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("reports persisted success even when notification provider errors", async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: "provider rejected" } });
    const res = await POST(req(valid));
    expect(await res.json()).toEqual({ success: true, captured: true, notificationSent: false });
  });

  it("does not unlock on a database persistence failure", async () => {
    sqlMock.mockRejectedValue(new Error("db unavailable"));
    const res = await POST(req(valid));
    expect(res.status).toBe(500);
    expect(sendMock).not.toHaveBeenCalled();
  });
});
