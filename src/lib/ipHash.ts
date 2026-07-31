// lib/ipHash.ts
//
// IP extraction + privacy hashing for rate limiting and event metadata.
// Hashes are NOT joinable across surfaces: each scope's salt is derived
// from the one provisioned secret (sha256(master:scope)), so an
// anonymous CHAP question and a later demo-form submission from the
// same IP cannot be correlated. One secret to provision, non-joinable
// hash domains — restored 2026-07-30 after the CHAP port briefly
// collapsed the domains into one.
//
// The master secret is COMMERCIAL_IP_HASH_SALT (name kept for env
// continuity; it salts every scope) and is required — no fallback: a
// silent fallback would restore the hardcoded-salt weakness on any
// deploy missing the env var. Routes that depend on hashing must check
// ipHashingConfigured() and fail closed (503).

import crypto from "node:crypto";
import type { NextRequest } from "next/server";

export type IpHashScope = "commercial" | "chap";

export function ipHashingConfigured(): boolean {
  return Boolean(process.env.COMMERCIAL_IP_HASH_SALT);
}

function scopeSalt(scope: IpHashScope): string {
  const master = process.env.COMMERCIAL_IP_HASH_SALT;
  if (!master) {
    // Callers gate on ipHashingConfigured(); reaching here unset is a bug.
    throw new Error("COMMERCIAL_IP_HASH_SALT is not configured");
  }
  return crypto
    .createHash("sha256")
    .update(`${master}:${scope}`)
    .digest("hex");
}

export function hashIp(ip: string, scope: IpHashScope): string {
  return crypto
    .createHash("sha256")
    .update(ip + scopeSalt(scope))
    .digest("hex");
}

// Vercel-controlled headers only. x-forwarded-for is client-influenced
// (the first hop is whatever the client sent) and is never consulted —
// a spoofed value per request would evade IP-scoped rate limits
// entirely. When neither trusted header is present, all traffic shares
// the single "unknown" identifier, so the per-identifier cap acts as
// the strictest possible limit rather than an open door.
export function extractIp(request: NextRequest): string {
  const realIp = request.headers.get("x-real-ip");
  if (realIp?.trim()) return realIp.trim();
  const vercelForwarded = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwarded?.trim()) return vercelForwarded.split(",")[0].trim();
  return "unknown";
}
