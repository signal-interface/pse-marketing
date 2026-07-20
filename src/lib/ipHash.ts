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

export function extractIp(request: NextRequest): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}
