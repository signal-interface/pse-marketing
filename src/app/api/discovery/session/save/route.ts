// POST /api/discovery/session/save — saves validated partial answers.
// Completed sessions reject saves (enforced at the SQL level).

import { NextRequest, NextResponse } from "next/server";
import {
  saveSessionAnswers,
  SESSION_COOKIE,
} from "@/lib/commercial/questionnaire";

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  try {
    const resumeToken = request.cookies.get(SESSION_COOKIE)?.value;
    if (!resumeToken) {
      return NextResponse.json({ error: "no_session" }, { status: 401 });
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }
    const answers = (body as { answers?: unknown })?.answers;

    const result = await saveSessionAnswers(resumeToken, answers, {
      actorType: "PROSPECT",
      source: "api/discovery/session/save",
      requestId,
    });
    if (!result.ok) {
      const status =
        result.reason === "invalid_answers"
          ? 400
          : result.reason === "completed"
            ? 409
            : 401;
      return NextResponse.json({ error: result.reason }, { status });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[session-save:${requestId}] error:`, error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
