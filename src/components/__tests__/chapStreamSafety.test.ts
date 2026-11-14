import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

const widget = readFileSync("src/components/sections/ChapaInterface.tsx", "utf8");
const route = readFileSync("src/app/api/chap/ask/route.ts", "utf8");

describe("CHAP Marketing terminal stream safety contract", () => {
  it("fails closed on a clean end of stream lacking a terminal event", () => {
    expect(widget).toContain("if (!terminalReceived) throw new Error('CHAP stream ended without a terminal response')");
    expect(widget).toContain("setMessages((prev) => {");
    expect(widget).toContain("status: 'error'");
    expect(widget).toContain("setIsStreaming(false)");
  });

  it("preserves a validated response when transport errors occur later", () => {
    expect(widget).toContain("finalReceived = true");
    expect(widget).toContain("if (finalReceived) continue");
    expect(widget).toContain("if (terminalReceived) return;");
  });

  it("does not claim an automatic determination in the greeting", () => {
    expect(widget).not.toContain("I’ll return a determination");
    expect(widget).toContain("Do not enter payroll or personal data.");
  });

  it("keeps invalid model output distinct from out-of-scope determinations", () => {
    expect(route).toContain('code: "validation_failed"');
    expect(route).toContain('entry.sourceType !== "pse_written"');
    expect(route).not.toContain('type: "chunk", text');
  });
});
