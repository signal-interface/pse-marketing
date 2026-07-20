// lib/commercial/links.ts
//
// HMAC-signed lead references for links embedded in journey emails.
// Prevents raw lead IDs from appearing in URLs and stops enumeration of
// the engagement endpoints. NOT for questionnaire access — that uses
// one-time hashed tokens (discovery_questionnaire_tokens); these signed
// refs are reusable click identifiers for engagement tracking only.
//
// Requires LINK_SIGNING_SECRET. If unset, signing is unavailable and
// callers must degrade (e.g. journey email falls back to a direct,
// untracked video URL).

import crypto from "node:crypto";

function secret(): string | null {
  return process.env.LINK_SIGNING_SECRET || null;
}

function hmac(payload: string, key: string): string {
  // 16 bytes of hex keeps URLs short; adequate for click-tracking refs.
  return crypto
    .createHmac("sha256", key)
    .update(payload)
    .digest("hex")
    .slice(0, 32);
}

export function linkSigningConfigured(): boolean {
  return secret() !== null;
}

/** Returns "<leadId>.<sig>" or null when LINK_SIGNING_SECRET is unset. */
export function signLeadRef(leadId: number): string | null {
  const key = secret();
  if (!key) return null;
  return `${leadId}.${hmac(String(leadId), key)}`;
}

/** Verifies "<leadId>.<sig>". Returns the lead id or null. */
export function verifyLeadRef(ref: string): number | null {
  const key = secret();
  if (!key) return null;
  const dot = ref.indexOf(".");
  if (dot <= 0) return null;
  const idPart = ref.slice(0, dot);
  const sigPart = ref.slice(dot + 1);
  if (!/^\d{1,10}$/.test(idPart) || !/^[0-9a-f]{32}$/.test(sigPart)) {
    return null;
  }
  const expected = hmac(idPart, key);
  const a = Buffer.from(sigPart, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return Number(idPart);
}
