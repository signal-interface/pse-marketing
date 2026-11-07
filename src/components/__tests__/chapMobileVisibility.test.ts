import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const css = readFileSync("src/app/globals.css", "utf8");
const page = readFileSync("src/app/chap-ai/page.tsx", "utf8");

describe("CHAP marketing widget mobile reachability", () => {
  it("keeps the Try CHAP AI anchor tied to the existing interactive widget", () => {
    expect(page).toContain('href="#try-chap-ai"');
    expect(page).toContain('id="try-chap-ai"');
    expect(page).toContain("<ChapaInterface />");
  });

  it("never hides the existing widget at mobile or tablet breakpoints", () => {
    const rules = [...css.matchAll(/\.chap-hero__terminal\s*\{([^}]*)\}/g)].map((m) => m[1]);
    expect(rules.length).toBeGreaterThanOrEqual(2);
    for (const body of rules) expect(body).not.toMatch(/display\s*:\s*none\b/);
    expect(rules.some((body) => /display\s*:\s*block/.test(body))).toBe(true);
  });

  it("maintains a usable panel and input width without a site-wide widget", () => {
    expect(css).toContain("min-height: 420px");
    expect(css).toContain("min-width: 0");
    expect(page).toContain("fixed synthetic payroll data");
    expect(page).toContain("IRC §6656");
  });
});
