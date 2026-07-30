import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { extractIp } from "../ipHash";

function makeRequest(headers: Record<string, string>): NextRequest {
  return new NextRequest("http://localhost/api/demo-request", {
    method: "POST",
    headers,
  });
}

describe("extractIp", () => {
  it("uses x-real-ip when present", () => {
    expect(
      extractIp(
        makeRequest({
          "x-real-ip": "198.51.100.7",
          "x-vercel-forwarded-for": "203.0.113.9",
          "x-forwarded-for": "192.0.2.1",
        })
      )
    ).toBe("198.51.100.7");
  });

  it("falls back to the first x-vercel-forwarded-for entry", () => {
    expect(
      extractIp(
        makeRequest({
          "x-vercel-forwarded-for": "203.0.113.9, 10.0.0.1",
          "x-forwarded-for": "192.0.2.1",
        })
      )
    ).toBe("203.0.113.9");
  });

  it("never consults client-supplied x-forwarded-for", () => {
    expect(extractIp(makeRequest({ "x-forwarded-for": "192.0.2.1" }))).toBe(
      "unknown"
    );
  });

  it("treats absent trusted headers as unknown (shared strict bucket)", () => {
    expect(extractIp(makeRequest({}))).toBe("unknown");
  });

  it("ignores whitespace-only trusted headers", () => {
    expect(
      extractIp(
        makeRequest({ "x-real-ip": "  ", "x-forwarded-for": "192.0.2.1" })
      )
    ).toBe("unknown");
  });
});
