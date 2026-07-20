// GET /api/discovery/session — minimal questionnaire context for the
// resume cookie holder. Returns only what the page needs to render.

import { NextRequest, NextResponse } from "next/server";
import { getSessionByResumeToken } from "@/lib/commercial/questionnaire";
import { buildSchedulingUrl } from "@/lib/commercial/scheduling";
import { SESSION_COOKIE } from "./start/route";

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();
  try {
    const resumeToken = request.cookies.get(SESSION_COOKIE)?.value;
    if (!resumeToken) {
      return NextResponse.json({ error: "no_session" }, { status: 401 });
    }
    const session = await getSessionByResumeToken(resumeToken, {
      actorType: "PROSPECT",
      source: "api/discovery/session",
      requestId,
    });
    if (!session) {
      return NextResponse.json({ error: "no_session" }, { status: 401 });
    }
    return NextResponse.json({
      firstName: session.firstName,
      company: session.company,
      answers: session.answers,
      completed: session.completed,
      expiresAt: session.expiresAt.toISOString(),
      schedulingUrl: session.completed
        ? buildSchedulingUrl({
            id: session.leadId,
            email: session.email,
            firstName: session.firstName,
            lastName: session.lastName,
          })
        : null,
    });
  } catch (error) {
    console.error(`[session-get:${requestId}] error:`, error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
