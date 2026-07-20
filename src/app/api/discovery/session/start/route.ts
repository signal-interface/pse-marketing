// POST /api/discovery/session/start — the authorization boundary.
//
// Accepts the raw invitation token, atomically consumes it, creates the
// save/resume session, sets the HTTP-only resume cookie, and tells the
// client to redirect to a clean URL (no ?t=...).
//
// Cookie: Path=/ (NOT /discovery — cookie path matching is prefix-based,
// so a /discovery-scoped cookie would never reach these /api/discovery
// routes). Scoping comes from the name. Opaque value only.
//
// All invalid-token reasons render one safe message; the specific reason
// is logged internally via a non-consuming inspect.

import { NextRequest, NextResponse } from "next/server";
import { startQuestionnaireSession } from "@/lib/commercial/questionnaire";
import { inspectQuestionnaireToken } from "@/lib/commercial/tokens";

export const SESSION_COOKIE = "pse_dq_session";

const SAFE_INVALID_MESSAGE =
  "This discovery link is no longer active. Request a new link to continue.";

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }
    const token = (body as { token?: unknown })?.token;
    // Raw token is validated for shape only and never logged.
    if (
      typeof token !== "string" ||
      token.length < 32 ||
      token.length > 64 ||
      !/^[A-Za-z0-9_-]+$/.test(token)
    ) {
      return NextResponse.json(
        { valid: false, message: SAFE_INVALID_MESSAGE },
        { status: 400 }
      );
    }

    const result = await startQuestionnaireSession(token, {
      actorType: "PROSPECT",
      source: "api/discovery/session/start",
      requestId,
    });

    if (!result.ok) {
      // Internal-only reason; the prospect sees one safe message.
      const inspection = await inspectQuestionnaireToken(token);
      console.log(
        `[session-start:${requestId}] invalid token:`,
        inspection.valid ? "RACE_CONSUMED" : inspection.reason
      );
      return NextResponse.json(
        { valid: false, message: SAFE_INVALID_MESSAGE },
        { status: 410 }
      );
    }

    const response = NextResponse.json({
      valid: true,
      redirectTo: "/discovery/questionnaire",
    });
    const maxAgeSeconds = Math.max(
      0,
      Math.floor((result.expiresAt.getTime() - Date.now()) / 1000)
    );
    response.cookies.set({
      name: SESSION_COOKIE,
      value: result.resumeToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: maxAgeSeconds,
    });
    return response;
  } catch (error) {
    console.error(`[session-start:${requestId}] error:`, error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
