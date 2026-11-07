import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(path, "utf8");

describe("CHAP Marketing discovery and static identity", () => {
  const page = read("src/app/chap-ai/page.tsx");
  const home = read("src/components/sections/ChapAI.tsx");
  const widget = read("src/components/sections/ChapaInterface.tsx");

  it("links the homepage to the existing /chap-ai widget, not an embed", () => {
    expect(home).toContain('href="/chap-ai#try-chap-ai"');
    expect(home).toContain("Try CHAP AI");
    expect(home).not.toContain("ChapaInterface");
  });

  it("provides a visible anchor on the existing educational widget", () => {
    expect(page).toContain('href="#try-chap-ai"');
    expect(page).toContain('id="try-chap-ai"');
    expect(page).toContain("<ChapaInterface />");
    expect(page).toContain('href="/#demo"');
    expect(page).toContain("IRC §6656");
  });

  it("adds only static, labelled CHAP branding while retaining the existing input", () => {
    expect(widget).toContain('aria-label="CHAP AI assistant"');
    expect(widget).toContain("Compliance, Helpdesk &amp; Automation Platform");
    expect(widget).toContain("Educational AI");
    expect(widget).toContain("Ask CHAP about an IRC §6656 scenario");
    expect(widget).not.toContain("getUserMedia");
    expect(widget).not.toContain("speechSynthesis");
  });

  it("preserves explicit separation from CHAP production", () => {
    expect(page).toContain("not connected to a payroll system or customer data");
    expect(page).toContain("fixed synthetic payroll data");
    expect(page).not.toContain("Bring your last payroll file");
  });
});
