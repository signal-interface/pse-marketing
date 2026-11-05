import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Vega reduced-motion finding after PR #63: pulse-green (2s) and
 * pse-logo-scroll (40s) kept running under prefers-reduced-motion: reduce.
 */
const root = path.resolve(__dirname, "../../..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");
const css = read("src/app/globals.css");

function reducedMotionBlocks(source: string): string {
  const out: string[] = [];
  const re = /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) {
    let depth = 1;
    let i = re.lastIndex;
    while (depth > 0 && i < source.length) {
      if (source[i] === "{") depth++;
      if (source[i] === "}") depth--;
      i++;
    }
    out.push(source.slice(re.lastIndex, i - 1));
  }
  return out.join("\n");
}

function ruleBody(block: string, selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = block.match(new RegExp(`(?:^|[\\s,}])${escaped}\\s*\\{([^}]*)\\}`));
  return m?.[1] ?? "";
}

describe("reduced motion: nonessential repeating animations", () => {
  const reduced = reducedMotionBlocks(css);

  it("stops the pulse-green status dot", () => {
    expect(ruleBody(reduced, ".pse-pulse-green")).toMatch(/animation:\s*none/);
  });

  it("stops the pse-logo-scroll industry strip and keeps every industry visible", () => {
    const track = ruleBody(reduced, ".pse-logo-bar__track");
    expect(track).toMatch(/animation:\s*none/);
    expect(track).toMatch(/flex-wrap:\s*wrap/);
    // The duplicated loop copy is aria-hidden and only needed while scrolling.
    expect(ruleBody(reduced, '.pse-logo-bar__track > [aria-hidden="true"]')).toMatch(/display:\s*none/);
  });

  it("keeps both animations for users who have not requested reduced motion", () => {
    const outside = css.replace(/@media\s*\(prefers-reduced-motion[\s\S]*?\n\}/g, "");
    expect(ruleBody(outside, ".pse-pulse-green")).toMatch(/animation:\s*pulse-green 2s infinite/);
    expect(ruleBody(outside, ".pse-logo-bar__track")).toMatch(/animation:\s*pse-logo-scroll 40s linear infinite/);
  });

  it("does not set pulse-green as an inline style, which a media query cannot override", () => {
    for (const file of ["src/components/sections/Hero.tsx", "src/components/sections/DashboardPreview.tsx"]) {
      const source = read(file);
      expect(source, file).not.toMatch(/animation:\s*["']pulse-green/);
      expect(source, file).toContain("pse-pulse-green");
    }
  });
});
