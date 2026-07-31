// POST /api/lead-capture — CHAP widget email gate.
//
// Called by the CHAP AI widget on /chap-ai when a visitor hits the
// email gate (after their 3 free questions). Captures the email into
// chap_leads and notifies the NOTIFICATION_EMAIL inbox.
//
// Intentionally DOES NOT send an auto-response to the visitor — the
// email gate is a soft intent signal (still in research mode). Demo
// request flow handles the warmer "book a call" intent.

import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { Resend } from "resend";
import { ensureChapTables } from "@/lib/db";
import { chapLeadNotificationHtml } from "@/lib/emails";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NOTIFICATION_EMAIL =
  process.env.NOTIFICATION_EMAIL || "info@payrollsynergyexperts.com";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const { email, sessionId, firstQuestion } = body as {
    email?: unknown;
    sessionId?: unknown;
    firstQuestion?: unknown;
  };

  if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json(
      { error: "invalid_session_id" },
      { status: 400 }
    );
  }
  const firstQuestionStr =
    typeof firstQuestion === "string" && firstQuestion.length > 0
      ? firstQuestion.slice(0, 500)
      : null;

  try {
    await ensureChapTables();
    await sql`
      INSERT INTO chap_leads (email, session_id, first_question, source)
      VALUES (${email}, ${sessionId}, ${firstQuestionStr}, 'chap-widget')
      ON CONFLICT (email, session_id) DO NOTHING
    `;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const emailResults = await Promise.allSettled([
      resend.emails.send({
        from: "PSE Marketing <info@payrollsynergyexperts.com>",
        replyTo: "info@payrollsynergyexperts.com",
        to: NOTIFICATION_EMAIL,
        subject: `New CHAP Widget Lead: ${email}`,
        html: chapLeadNotificationHtml({
          email,
          sessionId,
          firstQuestion: firstQuestionStr || undefined,
        }),
      }),
    ]);

    const emailErrors = emailResults.filter((r) => r.status === "rejected");
    if (emailErrors.length > 0) {
      console.error(
        "[lead-capture] email errors:",
        emailErrors.map((r) => (r as PromiseRejectedResult).reason)
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[lead-capture] error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
