import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { consumeChapStream } from "@/lib/chapStreamClient";

const widget = readFileSync("src/components/sections/ChapaInterface.tsx", "utf8");
const route = readFileSync("src/app/api/chap/ask/route.ts", "utf8");
const encoder = new TextEncoder();
const event = (body: unknown) => encoder.encode("data: " + JSON.stringify(body) + "\n\n");

describe("CHAP Marketing terminal stream safety", () => {
  it("fails closed on a clean EOF lacking a terminal event", async () => {
    const stream = new ReadableStream<Uint8Array>({ start(controller) { controller.close(); } });
    await expect(consumeChapStream(stream, new AbortController().signal, () => {
      throw new Error("unexpected terminal event");
    })).rejects.toThrow("without a terminal response");
  });

  it("bounds a stalled reader before any terminal event", async () => {
    const controller = new AbortController();
    const stream = new ReadableStream<Uint8Array>({ start() { /* never enqueues or closes */ } });
    const result = consumeChapStream(stream, controller.signal, () => {
      throw new Error("unexpected terminal event");
    });
    controller.abort();
    await expect(result).rejects.toThrow("timed out");
  });

  it("completes after final even if the stream never closes", async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(event({
          type: "final",
          response: { kind: "out_of_scope", detectedCategory: "other", suggestedAction: "request_demo" },
        }));
        // The server is intentionally kept open simulating a stalled logging operation.
      },
    });
    const terminals: string[] = [];
    await consumeChapStream(stream, new AbortController().signal, e => terminals.push(e.type));
    expect(terminals).toEqual(["final"]);
  });

  it("completes after error even if the stream never closes", async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(event({ type: "error", code: "validation_failed" }));
      },
    });
    const terminals: string[] = [];
    await consumeChapStream(stream, new AbortController().signal, e => terminals.push(e.type));
    expect(terminals).toEqual(["error"]);
  });

  it("never replaces final with an error or waits for DONE when both follow each other", async () => {
    const final = event({
      type: "final",
      response: { kind: "out_of_scope", detectedCategory: "other", suggestedAction: "request_demo" },
    });
    const lateError = event({ type: "error" });
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array([...final, ...lateError]));
      },
    });
    const seen: string[] = [];
    await consumeChapStream(stream, new AbortController().signal, e => seen.push(e.type));
    expect(seen).toEqual(["final"]);
  });

  it("preserves truthful educational greeting and a bounded abortable fetch", () => {
    expect(widget).not.toContain("I’ll return a determination");
    expect(widget).toContain("Do not enter payroll or personal data.");
    expect(widget).toContain("signal: requestController.signal");
    expect(widget).toContain("setTimeout(() => requestController.abort(), 55_000)");
    expect(widget).toContain("clearTimeout(deadline)");
    expect(widget).toContain("if (terminalReceived) return;");
  });

  it("keeps invalid model output distinct from out-of-scope determinations", () => {
    expect(route).toContain('code: "validation_failed"');
    expect(route).not.toContain('type: "chunk", text');
  });
});
