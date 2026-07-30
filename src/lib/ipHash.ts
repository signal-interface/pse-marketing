// lib/ipHash.ts
//
// IP extraction + privacy hashing for rate limiting and event metadata.
// Same approach as the CHAP path (sha256 with a static salt), but a
// distinct salt so commercial-funnel hashes are not joinable with CHAP
// interaction hashes.

import crypto from "node:crypto";
import type { NextRequest } from "next/server";

const COMMERCIAL_IP_HASH_SALT = "pse-commercial-v1-ip-salt-2d7f91c4";

export function hashIp(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + COMMERCIAL_IP_HASH_SALT)
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
