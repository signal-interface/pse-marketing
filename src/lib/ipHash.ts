// lib/ipHash.ts
//
// IP extraction + privacy hashing for rate limiting and event metadata.
// Distinct salt from the CHAP path so commercial-funnel hashes are not
// joinable with CHAP interaction hashes.
//
// The salt comes from COMMERCIAL_IP_HASH_SALT and is required — no
// fallback. This repo is public: a salt in source makes IPv4 hashes
// reversible by enumeration, and a silent fallback would restore that
// weakness on any deploy missing the env var. Routes that depend on
// hashing must check ipHashingConfigured() and fail closed (503),
// matching the CHAP_WIDGET_ENABLED posture.

import crypto from "node:crypto";
import type { NextRequest } from "next/server";

export function ipHashingConfigured(): boolean {
  return Boolean(process.env.COMMERCIAL_IP_HASH_SALT);
}

export function hashIp(ip: string): string {
  const salt = process.env.COMMERCIAL_IP_HASH_SALT;
  if (!salt) {
    // Callers gate on ipHashingConfigured(); reaching here unset is a bug.
    throw new Error("COMMERCIAL_IP_HASH_SALT is not configured");
  }
  return crypto
    .createHash("sha256")
    .update(ip + salt)
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
