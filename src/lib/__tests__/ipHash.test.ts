import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { extractIp, hashIp, ipHashingConfigured } from "../ipHash";

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

describe("hashIp / ipHashingConfigured", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reports unconfigured and throws (no hashing attempted) when the salt is unset", () => {
    vi.stubEnv("COMMERCIAL_IP_HASH_SALT", "");
    expect(ipHashingConfigured()).toBe(false);
    expect(() => hashIp("203.0.113.9", "commercial")).toThrow(
      /COMMERCIAL_IP_HASH_SALT/
    );
  });

  it("hashes deterministically within a scope", () => {
    vi.stubEnv("COMMERCIAL_IP_HASH_SALT", "test-salt");
    expect(ipHashingConfigured()).toBe(true);
    const a = hashIp("203.0.113.9", "commercial");
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(hashIp("203.0.113.9", "commercial")).toBe(a);
  });

  it("commercial and chap scopes are not joinable for the same IP", () => {
    vi.stubEnv("COMMERCIAL_IP_HASH_SALT", "test-salt");
    expect(hashIp("203.0.113.9", "commercial")).not.toBe(
      hashIp("203.0.113.9", "chap")
    );
  });

  it("different master salts produce unjoinable hashes", () => {
    vi.stubEnv("COMMERCIAL_IP_HASH_SALT", "salt-a");
    const a = hashIp("203.0.113.9", "commercial");
    vi.stubEnv("COMMERCIAL_IP_HASH_SALT", "salt-b");
    expect(hashIp("203.0.113.9", "commercial")).not.toBe(a);
  });
});
