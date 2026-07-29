import { describe, expect, it } from "vitest";
import { DEMO_ANCHOR, NAV_LINKS, PUBLIC_ROUTES } from "../constants";

describe("commercial route contracts", () => {
  it("keeps the sales demo on the protected homepage anchor", () => {
    expect(DEMO_ANCHOR).toBe("/#demo");
  });

  it("exposes only public routes that have implementations", () => {
    expect(PUBLIC_ROUTES).toContain("/chap-ai");
    expect(PUBLIC_ROUTES).toContain("/services");
    expect(PUBLIC_ROUTES).toContain("/compliance-risk");
  });

  it("does not publish the gated product tour", () => {
    expect(PUBLIC_ROUTES).not.toContain("/product-tour");
    expect(NAV_LINKS.map((link) => link.href)).not.toContain("/product-tour");
  });

  it("does not advertise unconfirmed paid-product routes", () => {
    const hrefs = NAV_LINKS.map((link) => link.href);

    expect(hrefs).not.toContain("/pricing");
    expect(hrefs).not.toContain("/context-hub");
    expect(hrefs).not.toContain("/assessment");
    expect(hrefs).not.toContain("/login");
  });
});
