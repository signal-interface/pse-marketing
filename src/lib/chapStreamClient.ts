import type { ValidatedResponse } from "@/lib/chapValidation";

export type ChapTerminalEvent =
  | { type: "final"; response: ValidatedResponse }
  | { type: "error"; code?: string };

function parseEvent(value: string): ChapTerminalEvent | "done" | null {
  const lines = value.split("\n").filter(line => line.startsWith("data:"));
  if (lines.length === 0) return null;
  const payload = lines.map(line => line.slice(5).trimStart()).join("\n").trim();
  if (payload === "[DONE]") return "done";
  try {
    const parsed: unknown = JSON.parse(payload);
    if (!parsed || typeof parsed !== "object" || !("type" in parsed)) return null;
    if (parsed.type === "error") return {
      type: "error",
      code: "code" in parsed && typeof parsed.code === "string" ? parsed.code : undefined,
    };
    if (parsed.type === "final" && "response" in parsed && parsed.response != null) {
      return { type: "final", response: parsed.response as ValidatedResponse };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Consume only validated terminal events. Return as soon as a final/error
 * arrives; never wait for database logging or a trailing [DONE]/EOF.
 * An AbortSignal also bounds a stalled reader that does not honor cancellation.
 */
export async function consumeChapStream(
  body: ReadableStream<Uint8Array>,
  signal: AbortSignal,
  onTerminal: (event: ChapTerminalEvent) => void,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let abortHandler: (() => void) | null = null;
  const aborted = new Promise<never>((_, reject) => {
    abortHandler = () => reject(new Error("CHAP response timed out"));
    signal.addEventListener("abort", abortHandler, { once: true });
    if (signal.aborted) abortHandler();
  });
  try {
    for (;;) {
      const { value, done } = await Promise.race([reader.read(), aborted]);
      if (done) throw new Error("CHAP stream ended without a terminal response");
      buffer += decoder.decode(value, { stream: true });
      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const raw = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const event = parseEvent(raw.replace(/\r/g, ""));
        if (event === "done") throw new Error("CHAP stream ended without a terminal response");
        if (event) {
          onTerminal(event);
          return;
        }
        boundary = buffer.indexOf("\n\n");
      }
    }
  } finally {
    if (abortHandler) signal.removeEventListener("abort", abortHandler);
    // Do not await cancellation: the remote stream may be stalled.
    void reader.cancel().catch(() => undefined);
  }
}
