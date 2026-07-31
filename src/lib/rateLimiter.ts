// CHAP AI rate limiter — Postgres-backed.
//
// Semantics (from the build spec):
//   Session free limit: 3 questions → then email gate
//   Session hard cap : 15 questions per rolling 24h
//   IP hard cap      : 60 questions per rolling 24h
//
// The 24h window is sliding: when a row's window_start is older than 24h
// at the time of the next increment, we reset the counter. This isn't a
// strict per-minute rolling window, but it's accurate to within a day —
// sufficient for this use case.
//
// Race-condition posture: we do a READ then an UPSERT increment without
// an explicit transaction. @vercel/postgres's `sql` tagged template
// doesn't expose an interactive transaction API. The spec explicitly
// accepts occasional over/under-count by ~1 in exchange for simplicity.

import { sql } from "@vercel/postgres";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  requiresEmail: boolean;
}

const SESSION_FREE_LIMIT = 3;
const SESSION_HARD_CAP = 15;
const IP_HARD_CAP = 60;
// Window length is 24h. It is intentionally inlined as a SQL literal
// below (`INTERVAL '24 hours'`) — the @vercel/postgres `sql` tag
// parameterizes every `${}` interpolation, which is invalid inside a
// Postgres INTERVAL literal. If you change the window length, update
// both occurrences in this file.

// CHAP uses "session" | "ip". The commercial funnel adds its own scopes
// (e.g. "demo-request-ip", "demo-request-email") against the same table.
type Scope = string;

interface CurrentCount {
  count: number;
  windowExpired: boolean;
}

async function readCurrentCount(
  scope: Scope,
  identifier: string
): Promise<CurrentCount> {
  const { rows } = await sql<{ count: number; window_expired: boolean }>`
    SELECT
      count,
      (window_start < NOW() - INTERVAL '24 hours') AS window_expired
    FROM chap_rate_limits
    WHERE scope = ${scope} AND identifier = ${identifier}
  `;
  if (rows.length === 0) return { count: 0, windowExpired: false };
  const row = rows[0];
  if (row.window_expired) return { count: 0, windowExpired: true };
  return { count: row.count, windowExpired: false };
}

async function incrementCount(scope: Scope, identifier: string): Promise<void> {
  // UPSERT: on first insert count=1; on conflict, reset to 1 if the
  // existing window expired, otherwise increment.
  await sql`
    INSERT INTO chap_rate_limits (scope, identifier, count, window_start)
    VALUES (${scope}, ${identifier}, 1, NOW())
    ON CONFLICT (scope, identifier) DO UPDATE SET
      count = CASE
        WHEN chap_rate_limits.window_start < NOW() - INTERVAL '24 hours' THEN 1
        ELSE chap_rate_limits.count + 1
      END,
      window_start = CASE
        WHEN chap_rate_limits.window_start < NOW() - INTERVAL '24 hours' THEN NOW()
        ELSE chap_rate_limits.window_start
      END
  `;
}

export async function checkAndIncrementRateLimit(params: {
  sessionId: string;
  ipHash: string;
  hasEmail: boolean;
}): Promise<RateLimitResult> {
  const { sessionId, ipHash, hasEmail } = params;

  const session = await readCurrentCount("session", sessionId);
  const ip = await readCurrentCount("ip", ipHash);

  if (ip.count >= IP_HARD_CAP) {
    return { allowed: false, remaining: 0, requiresEmail: false };
  }
  if (session.count >= SESSION_HARD_CAP) {
    return { allowed: false, remaining: 0, requiresEmail: false };
  }
  if (session.count >= SESSION_FREE_LIMIT && !hasEmail) {
    return { allowed: false, remaining: 0, requiresEmail: true };
  }

  await incrementCount("session", sessionId);
  await incrementCount("ip", ipHash);

  const nextSessionCount = session.count + 1;
  return {
    allowed: true,
    remaining: Math.max(0, SESSION_FREE_LIMIT - nextSessionCount),
    requiresEmail: false,
  };
}

// ---------------------------------------------------------------------------
// Generic scoped limiter — commercial funnel routes
// ---------------------------------------------------------------------------
//
// Simple cap-per-24h-window semantics on the same chap_rate_limits table,
// reusing its sliding-window reset. Same accepted race posture as above
// (read then upsert; over/under-count by ~1 is acceptable).

export async function checkAndIncrementScopedLimit(
  scope: string,
  identifier: string,
  cap: number
): Promise<{ allowed: boolean; count: number }> {
  const current = await readCurrentCount(scope, identifier);
  if (current.count >= cap) {
    return { allowed: false, count: current.count };
  }
  await incrementCount(scope, identifier);
  return { allowed: true, count: current.count + 1 };
}
