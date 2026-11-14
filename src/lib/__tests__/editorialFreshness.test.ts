import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import sitemap from "@/app/sitemap";
import { PUBLIC_ROUTES, SITE, TRUST_ROUTES } from "@/lib/constants";
import { TRUST_LAYER_ENABLED } from "@/lib/flags";

const sitemapSource = readFileSync("src/app/sitemap.ts", "utf8");
const layoutSource = readFileSync("src/app/layout.tsx", "utf8");

describe("editorial freshness and canonical metadata", () => {
  it("omits fabricated modification timestamps and update-frequency promises", () => {
    const entries = sitemap();
    expect(sitemapSource).not.toContain("lastModified: new Date()");
    expect(sitemapSource).not.toContain('changeFrequency: "weekly"');
    for (const entry of entries) {
      expect(entry.lastModified).toBeUndefined();
      expect(entry.changeFrequency).toBeUndefined();
    }
  });

  it("lists only published static routes allowed by the existing flags", () => {
    const routes = [...PUBLIC_ROUTES, ...(TRUST_LAYER_ENABLED ? TRUST_ROUTES : [])];
    const entries = sitemap();
    expect(entries.map(x => x.url)).toEqual(
      routes.map(route => `${SITE.url}${route === "/" ? "" : route}`)
    );
    expect(entries.every(entry => entry.url.startsWith(SITE.url))).toBe(true);
  });

  it("uses the same apex domain for Organization structured-data URL and logo", () => {
    expect(layoutSource).toContain("url: SITE.url");
    expect(layoutSource).toContain("logo: `${SITE.url}/favicon.svg`");
    expect(layoutSource).not.toContain('url: "https://www.payrollsynergyexperts.com"');
  });

  it("does not advertise generated compliance explanations in CHAP marketing constants", () => {
    const constants = readFileSync("src/lib/constants.ts", "utf8");
    expect(constants).toContain("predefined source-linked IRC §6656 educational explanations");
    expect(constants).not.toContain("AI-generated educational explanation");
  });
});
