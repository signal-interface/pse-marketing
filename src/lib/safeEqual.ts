// Constant-time string comparison without node:crypto, so it works in
// both the edge runtime (middleware) and node routes. Length inequality
// returns early — the length of the expected value is not a secret.
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
