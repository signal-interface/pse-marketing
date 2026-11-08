import { describe, expect, it } from "vitest";
import { answerWebsiteQuestion, WEBSITE_SUGGESTIONS, websiteGuideFollowUps, websiteGuideDemoCta } from "@/lib/siteGuide";
import { readFileSync } from "node:fs";

describe("CHAP Marketing Website Guide", () => {
  it("answers only approved public-site topics with first-party links", () => {
    const examples = [
      ["What is PSE?", "about"],
      ["What services does PSE offer?", "services"],
      ["How do I book a demo?", "demo"],
      ["Where is the risk estimator?", "estimator"],
      ["What can CHAP AI help with?", "chap"],
      ["Where is your privacy policy?", "privacy"],
      ["What is Payroll Intelligence?", "payroll-intelligence"],
    ] as const;
    for (const [question, expectedTopic] of examples) {
      const answer = answerWebsiteQuestion(question);
      expect(answer.topic).toBe(expectedTopic);
      expect(answer.text.length).toBeGreaterThan(30);
      expect(answer.links.length).toBeGreaterThan(0);
      for (const link of answer.links) {
        expect(link.href).toMatch(/^\/(?!\/)/);
        expect(link.href).not.toContain("http");
      }
    }
  });
  it("offers only relevant approved follow-up questions", () => {
    for (const topic of ["about", "services", "demo", "estimator", "chap", "privacy", "payroll-intelligence"] as const) {
      const followups = websiteGuideFollowUps(topic);
      expect(followups.length).toBeGreaterThan(0);
      expect(followups.length).toBeLessThanOrEqual(3);
      for (const question of followups) {
        const answer = answerWebsiteQuestion(question);
        expect(answer.topic).not.toBe(null);
        expect(answer.links.every(link => link.href.startsWith("/"))).toBe(true);
      }
    }
    expect(websiteGuideFollowUps(null)).toHaveLength(2);
    expect(websiteGuideDemoCta("services")).toBe(true);
    expect(websiteGuideDemoCta("demo")).toBe(true);
    expect(websiteGuideDemoCta("privacy")).toBe(false);
    expect(websiteGuideDemoCta(null)).toBe(false);
  });

  it("places contextual suggestions and the existing demo link only in the guide", () => {
    const widget = readFileSync("src/components/sections/ChapaInterface.tsx", "utf8");
    const css = readFileSync("src/app/globals.css", "utf8");
    expect(widget).toContain("mode === 'guide' && guideMessages.length > 1");
    expect(widget).toContain('href="/#demo"');
    expect(widget).toContain('className="chap-interface__demo-cta"');
    expect(widget).toContain('aria-label="Suggested next questions"');
    expect(css).toContain(".chap-interface__suggestion:focus-visible");
    expect(css).toContain("font-size: 16px");
  });

  it("offers Payroll Intelligence as public navigation, never live data access", () => {
    const result = answerWebsiteQuestion("What is Payroll Intelligence?");
    expect(result.topic).toBe("payroll-intelligence");
    expect(result.text).toContain("15 knowledge domains");
    expect(result.text).toContain("not a live CHAP data feed");
    expect(result.links.map(l => l.href)).toContain("/payroll-intelligence");
    expect(result.links.map(l => l.href)).toContain("/payroll-intelligence/methodology");
    expect(answerWebsiteQuestion("Explain", "payroll-intelligence").topic).toBe("payroll-intelligence");
  });

  it("reset clears visible state only, retaining marketing session and quota", () => {
    const widget = readFileSync("src/components/sections/ChapaInterface.tsx", "utf8");
    expect(widget).toContain("New Conversation");
    expect(widget).toContain("setGuideMessages(initialGuideMessages())");
    expect(widget).toContain("setMessages(initialComplianceMessages())");
    expect(widget).toContain("setGuideTopic(null)");
    expect(widget).toContain("setMode('guide')");
    expect(widget).toContain("if (isStreaming) return");
    const fn = widget.slice(widget.indexOf("const newConversation ="), widget.indexOf("const guideQuestion ="));
    expect(fn).not.toContain("sessionStorage.removeItem");
    expect(fn).not.toContain("setSessionId(");
    expect(fn).not.toContain("setEmail(");
    expect(fn).not.toContain("fetch(");
  });

  it("supports short follow-ups without a new AI request", () => {
    expect(answerWebsiteQuestion("Explain", "services").topic).toBe("services");
    expect(answerWebsiteQuestion("Explain").topic).toBe(null);
  });
  it("does not fabricate answers for unsupported questions", () => {
    const answer = answerWebsiteQuestion("Who is the PSE CEO?");
    expect(answer.topic).toBe(null);
    expect(answer.text).toContain("not verified");
  });
  it("keeps the guide separate from compliance gate and lead capture", () => {
    const widget = readFileSync("src/components/sections/ChapaInterface.tsx", "utf8");
    const siteGuide = readFileSync("src/lib/siteGuide.ts", "utf8");
    const page = readFileSync("src/app/chap-ai/page.tsx", "utf8");
    expect(widget).toContain("Website Guide");
    expect(widget).toContain("Compliance Education");
    expect(widget).toContain("if (mode === 'guide') guideQuestion(input)");
    expect(widget).toContain("void askQuestion(input)");
    expect(widget).toContain("aria-pressed={mode === 'guide'}");
    expect(widget).toContain("lastComplianceQuestionRef");
    expect(page).toContain("IRC §6656");
    expect(siteGuide).not.toContain("fetch(");
    expect(siteGuide).not.toContain("ANTHROPIC_API_KEY");
    expect(siteGuide).not.toContain("lead-capture");
    expect(siteGuide).not.toContain("newsletter");
    expect(WEBSITE_SUGGESTIONS).toHaveLength(4);
  });
});
