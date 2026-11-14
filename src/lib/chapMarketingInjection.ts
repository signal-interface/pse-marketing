// Model-free prompt-injection guard for the public marketing route.
// The legacy CHAP model helper is intentionally not imported by this route.
export const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(previous|prior|above)\s+(instructions?|prompts?)/i,
  /disregard\s+(the\s+)?system/i,
  /you\s+are\s+now\s+/i,
  /reveal\s+your\s+(prompt|instructions)/i,
];

export function containsInjectionPattern(text: string): boolean {
  return INJECTION_PATTERNS.some(pattern => pattern.test(text));
}
