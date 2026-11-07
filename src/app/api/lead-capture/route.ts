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
import { extractIp, hashIp, ipHashingConfigured } from "@/lib/ipHash";
import { checkAndIncrementScopedLimit } from "@/lib/rateLimiter";

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

  const { email, sessionId, firstQuestion, website } = body as {
    email?: unknown;
    sessionId?: unknown;
    firstQuestion?: unknown;
    website?: unknown;
  };

  // Honeypot bots get an inert generic result; never create an entitlement.
  if (website) return NextResponse.json({ success: true });
  if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim()) || email.length > 254) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (!sessionId || typeof sessionId !== "string" || sessionId.length > 128) {
    return NextResponse.json(
      { error: "invalid_session_id" },
      { status: 400 }
    );
  }
  const firstQuestionStr =
    typeof firstQuestion === "string" && firstQuestion.length > 0
      ? firstQuestion.slice(0, 500)
      : null;

  if (!ipHashingConfigured()) {
    return NextResponse.json({ error: "service_unavailable" }, { status: 503 });
  }
  const normalizedEmail = email.trim().toLowerCase();

  try {
    await ensureChapTables();
    const limited = await checkAndIncrementScopedLimit(
      "chap-lead-capture-ip",
      hashIp(extractIp(request), "chap-capture"),
      10
    );
    if (!limited.allowed) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const inserted = await sql<{ id: number }>`
      INSERT INTO chap_leads (email, session_id, first_question, source)
      VALUES (${normalizedEmail}, ${sessionId}, ${firstQuestionStr}, 'chap-widget')
      ON CONFLICT (email, session_id) DO NOTHING
      RETURNING id
    `;
    // A prior successful capture is already an entitlement. Never send
    // duplicate notifications for replays.
    if (inserted.rows.length === 0) {
      return NextResponse.json({ success: true, captured: true });
    }

    // Notification delivery is independent of persistence. A provider
    // failure must be visible in server logs, not erase the saved lead.
    let notificationSent = false;
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const result = await resend.emails.send({
        from: "PSE Marketing <info@payrollsynergyexperts.com>",
        replyTo: "info@payrollsynergyexperts.com",
        to: NOTIFICATION_EMAIL,
        subject: "New CHAP Widget Lead",
        html: chapLeadNotificationHtml({
          email: normalizedEmail,
          sessionId,
          firstQuestion: firstQuestionStr || undefined,
        }),
      });
      if (result.error) {
        console.error("[lead-capture] internal notification provider error");
      } else {
        notificationSent = true;
      }
    } catch {
      console.error("[lead-capture] internal notification transport error");
    }
    // The client needs only persisted capture status, never provider details.
    // A separate operational review should reconcile notification failures.
    return NextResponse.json({ success: true, captured: true, notificationSent });
  } catch {
    console.error("[lead-capture] persistence error");
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
