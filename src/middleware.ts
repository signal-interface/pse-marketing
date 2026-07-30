// middleware.ts — protects /internal/* pages with HTTP Basic auth.
//
// The marketing site has no user accounts; internal surfaces (discovery
// briefs, future lead views) are founder/team-only. Basic auth against
// INTERNAL_API_SECRET (username: pse) keeps the pages browser-accessible
// without building a session system. API routes under /api/internal/*
// separately enforce Bearer auth with the same secret.
//
// Fails closed: if INTERNAL_API_SECRET is unset, /internal/* is 503.

import { NextRequest, NextResponse } from "next/server";
import { safeEqual } from "@/lib/safeEqual";

const UNAUTHORIZED = () =>
  new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="PSE Internal"' },
  });

export function middleware(request: NextRequest) {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) {
    return new NextResponse("Internal access not configured", { status: 503 });
  }

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return UNAUTHORIZED();

  let decoded: string;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return UNAUTHORIZED();
  }
  const colon = decoded.indexOf(":");
  if (colon === -1) return UNAUTHORIZED();
  const user = decoded.slice(0, colon);
  const pass = decoded.slice(colon + 1);

  if (!safeEqual(user, "pse") || !safeEqual(pass, secret)) {
    return UNAUTHORIZED();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/internal/:path*"],
};
