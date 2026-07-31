import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockGenerate = vi.fn();
const mockGetLatest = vi.fn();
vi.mock("@/lib/commercial/discovery-brief", () => ({
  generateDiscoveryBrief: (...args: unknown[]) => mockGenerate(...args),
  getLatestBrief: (...args: unknown[]) => mockGetLatest(...args),
}));

import { GET, POST } from "../route";

const SECRET = "test-internal-secret";
const params = (leadId: string) => ({ params: Promise.resolve({ leadId }) });

function req(method: "GET" | "POST", auth?: string): NextRequest {
  return new NextRequest("http://localhost/api/internal/discovery-brief/1", {
    method,
    headers: auth ? { authorization: auth } : {},
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.INTERNAL_API_SECRET = SECRET;
  mockGetLatest.mockResolvedValue({ id: 5, version: 1 });
  mockGenerate.mockResolvedValue({
    ok: true,
    brief: { id: 5, version: 1 },
    reused: false,
  });
});

describe("internal discovery-brief route", () => {
  it.each([
    ["missing header", undefined],
    ["wrong scheme", `Basic ${SECRET}`],
    ["wrong secret", "Bearer nope"],
  ])("rejects unauthorized access: %s", async (_label, auth) => {
    const getRes = await GET(req("GET", auth), params("1"));
    const postRes = await POST(req("POST", auth), params("1"));
    expect(getRes.status).toBe(401);
    expect(postRes.status).toBe(401);
    expect(mockGetLatest).not.toHaveBeenCalled();
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  it("rejects when the secret is unconfigured, even with a matching header", async () => {
    delete process.env.INTERNAL_API_SECRET;
    const res = await GET(req("GET", "Bearer undefined"), params("1"));
    expect(res.status).toBe(401);
  });

  it("rejects invalid lead ids", async () => {
    const res = await GET(req("GET", `Bearer ${SECRET}`), params("abc"));
    expect(res.status).toBe(400);
  });

  it("GET returns the latest brief; 404 when none exists", async () => {
    const ok = await GET(req("GET", `Bearer ${SECRET}`), params("1"));
    expect(ok.status).toBe(200);
    expect((await ok.json()).brief).toMatchObject({ id: 5 });

    mockGetLatest.mockResolvedValueOnce(null);
    const missing = await GET(req("GET", `Bearer ${SECRET}`), params("1"));
    expect(missing.status).toBe(404);
  });

  it("POST generates and maps failure reasons to statuses", async () => {
    const ok = await POST(req("POST", `Bearer ${SECRET}`), params("1"));
    expect(ok.status).toBe(200);
    expect(await ok.json()).toMatchObject({ reused: false });

    mockGenerate.mockResolvedValueOnce({ ok: false, reason: "not_found" });
    expect((await POST(req("POST", `Bearer ${SECRET}`), params("1"))).status).toBe(404);

    mockGenerate.mockResolvedValueOnce({
      ok: false,
      reason: "questionnaire_not_completed",
    });
    expect((await POST(req("POST", `Bearer ${SECRET}`), params("1"))).status).toBe(409);
  });
});
