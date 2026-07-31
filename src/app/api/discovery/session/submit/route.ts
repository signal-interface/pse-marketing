// POST /api/discovery/session/submit — finalizes answers, marks the
// session complete (immediately non-editable), transitions the lead to
// QUESTIONNAIRE_COMPLETED, and unlocks scheduling: sends the scheduling
// email and returns the prospect's link for immediate redirect.
//
// Email delivery is nonfatal (EMAIL_SENT / EMAIL_FAILED events); the
// response still carries schedulingUrl so the prospect can book from the
// confirmation screen even during an email outage. When Cal.com is not
// configured, schedulingUrl is null and the confirmation copy degrades.

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sql } from "@vercel/postgres";
import { submitSession, SESSION_COOKIE } from "@/lib/commercial/questionnaire";
import { recordLeadEvent } from "@/lib/commercial/lifecycle";
import { buildSchedulingUrl } from "@/lib/commercial/scheduling";
import { schedulingUnlockHtml } from "@/lib/emails";

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

    const result = await submitSession(resumeToken, answers, {
      actorType: "PROSPECT",
      source: "api/discovery/session/submit",
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

    // Scheduling unlock. Lead contact fields for prefill + email.
    const { rows } = await sql`
      SELECT id, first_name, last_name, name, email
      FROM demo_requests WHERE id = ${result.leadId}
    `;
    const lead = rows[0];
    const firstName =
      (lead?.first_name as string) || (lead?.name as string) || "there";
    const schedulingUrl = lead
      ? buildSchedulingUrl({
          id: result.leadId,
          email: lead.email as string,
          firstName: lead.first_name as string | null,
          lastName: lead.last_name as string | null,
        })
      : null;

    if (schedulingUrl && lead) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      let failed = false;
      let errorDetail: string | undefined;
      try {
        const sent = await resend.emails.send({
          from: "Payroll Synergy Experts <info@payrollsynergyexperts.com>",
          replyTo: "info@payrollsynergyexperts.com",
          to: lead.email as string,
          subject: "Schedule your PSE discovery session",
          html: schedulingUnlockHtml({ firstName, schedulingUrl }),
        });
        if (sent.error) {
          failed = true;
          errorDetail = String(sent.error.message ?? "provider_error").slice(0, 300);
        }
      } catch (err) {
        failed = true;
        errorDetail = String((err as Error)?.message ?? err).slice(0, 300);
      }
      if (failed) {
        console.error(
          `[session-submit:${requestId}] scheduling email failed:`,
          errorDetail
        );
      }
      try {
        await recordLeadEvent(
          result.leadId,
          failed ? "EMAIL_FAILED" : "EMAIL_SENT",
          {
            actorType: "SYSTEM",
            source: "api/discovery/session/submit",
            requestId,
            metadata: { kind: "scheduling-unlock", error: errorDetail },
          }
        );
      } catch (eventErr) {
        console.error(
          `[session-submit:${requestId}] email event failed:`,
          eventErr
        );
      }
    }

    return NextResponse.json({ success: true, schedulingUrl });
  } catch (error) {
    console.error(`[session-submit:${requestId}] error:`, error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
