import { describe, expect, it } from "vitest";
import { invitationOrigin } from "../invitation-origin";

describe("questionnaire invitation origin isolation", () => {
  const preview = "pse-marketing-git-integration-bo-afeef1-faraday-capital-systems.vercel.app";

  it("preserves the accepted production fallback", () => {
    expect(invitationOrigin({ vercelEnv: "production" }))
      .toBe("https://payrollsynergyexperts.com");
  });

  it("refuses to issue a Preview token without a configured destination", () => {
    expect(invitationOrigin({ vercelEnv: "preview" })).toBeNull();
    expect(invitationOrigin({ vercelEnv: "preview", siteUrl: "" })).toBeNull();
  });

  it("accepts only explicit HTTPS Vercel Preview roots in Preview", () => {
    expect(invitationOrigin({ vercelEnv: "preview", siteUrl: `https://${preview}/` }))
      .toBe(`https://${preview}`);
    for (const value of [
      "https://payrollsynergyexperts.com",
      "https://demo.payrollsynergyexperts.com",
      "http://example.vercel.app",
      "https://example.vercel.app/discovery/start",
      "https://example.vercel.app/?x=1",
      "https://example.vercel.app/#token",
      "https://attacker@example.vercel.app",
      "not-a-url",
    ]) {
      expect(invitationOrigin({ vercelEnv: "preview", siteUrl: value })).toBeNull();
    }
  });

  it("rejects unsafe configured origins outside Preview as well", () => {
    expect(invitationOrigin({ vercelEnv: "production", siteUrl: "http://example.com" })).toBeNull();
    expect(invitationOrigin({ vercelEnv: "production", siteUrl: "https://example.com/path" })).toBeNull();
  });
});
