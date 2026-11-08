import { describe, expect, it } from "vitest";
import { answerWebsiteQuestion, WEBSITE_SUGGESTIONS } from "@/lib/siteGuide";
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
  it("supports short follow-ups without a new AI request", () => {
    expect(answerWebsiteQuestion("Explain", "services").topic).toBe("services");
    expect(answerWebsiteQuestion("Explain").topic).toBe(null);
  });
  it("does not fabricate answers for unsupported questions", () => {
    const answer = answerWebsiteQuestion("Who is the PSE CEO?");
    expect(answer.topic).toBe(null);
    expect(answer.text).toContain("published website pages");
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
