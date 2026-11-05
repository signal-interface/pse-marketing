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

/**
 * Vega live recheck of production a224c71 (Issue #55, 2026-11-05 13:12 UTC):
 * menu → Request a Demo still animated via `html { scroll-behavior: smooth }`,
 * and two 600ms `fadeInUp` hero entrance animations ran under reduced motion.
 */
describe("reduced motion: anchor navigation", () => {
  const reduced = reducedMotionBlocks(css);
  const outside = css.replace(/@media\s*\(prefers-reduced-motion[\s\S]*?\n\}/g, "");

  it("jumps to in-page anchors immediately (scroll-behavior: auto)", () => {
    expect(ruleBody(reduced, "html")).toMatch(/scroll-behavior:\s*auto/);
  });

  it("keeps smooth anchor scrolling when no reduced-motion preference is set", () => {
    expect(ruleBody(outside, "html")).toMatch(/scroll-behavior:\s*smooth/);
  });

  it("keeps the PR #63 success-panel reveal on an explicit instant jump", () => {
    const source = read("src/lib/ui/revealSuccessPanel.ts");
    expect(source).toMatch(/prefersReducedMotion\(matchMedia\)\s*\?\s*"instant"\s*:\s*"smooth"/);
  });
});

describe("reduced motion: entrance animations", () => {
  const reduced = reducedMotionBlocks(css);
  const outside = css.replace(/@media\s*\(prefers-reduced-motion[\s\S]*?\n\}/g, "");
  const hero = read("src/components/sections/Hero.tsx");

  it("does not set hero entrance animations inline, which a media query cannot override", () => {
    expect(hero).not.toMatch(/animation:\s*["']fadeInUp/);
    expect(hero.match(/pse-hero-enter(?![-\w])/g)?.length).toBe(2);
    expect(hero).toContain("pse-hero-enter-late");
  });

  it("keeps the 600ms and delayed hero entrances for normal motion", () => {
    expect(ruleBody(outside, ".pse-hero-enter")).toMatch(/animation:\s*fadeInUp 0\.6s ease-out/);
    expect(ruleBody(outside, ".pse-hero-enter-late")).toMatch(/animation:\s*fadeInUp 0\.8s ease-out 0\.1s both/);
  });

  it("disables hero entrance animations under reduced motion", () => {
    expect(reduced).toMatch(/\.pse-hero-enter,\s*\.pse-hero-enter-late\s*\{[^}]*animation:\s*none/);
  });

  it("shows scroll-reveal content immediately, without a transition, under reduced motion", () => {
    const reveal = ruleBody(reduced, ".reveal");
    expect(reveal).toMatch(/opacity:\s*1/);
    expect(reveal).toMatch(/transform:\s*none/);
    expect(reveal).toMatch(/transition:\s*none/);
  });
});
