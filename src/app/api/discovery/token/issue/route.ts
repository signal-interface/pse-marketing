// POST /api/discovery/token/issue — internal-only.
//
// Issues (or rotates) the one-time questionnaire invitation for a lead,
// transitions to QUESTIONNAIRE_SENT, sends the invitation email, and
// records the delivery outcome. Auth: Bearer INTERNAL_API_SECRET. The
// public browser never calls this; journey automation and cron use it
// (or call issueQuestionnaireToken directly server-side).
//
// If email delivery fails: token stays valid, status stays
// QUESTIONNAIRE_SENT, EMAIL_FAILED is recorded. Retry semantics live with
// the caller; retries should reuse the still-valid token via a fresh
// issue call only if rotation is intended (issuance revokes the prior
// token by design).

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  issueQuestionnaireToken,
  INVITATION_TOKEN_TTL_DAYS,
} from "@/lib/commercial/tokens";
import { transitionLead, recordLeadEvent } from "@/lib/commercial/lifecycle";
import { questionnaireInviteHtml } from "@/lib/emails";
import { safeEqual } from "@/lib/safeEqual";
import { sql } from "@vercel/postgres";

const SITE_URL = process.env.SITE_URL || "https://payrollsynergyexperts.com";

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  const secret = process.env.INTERNAL_API_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || !auth || !safeEqual(auth, `Bearer ${secret}`)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }
    const leadId = (body as { leadId?: unknown })?.leadId;
    if (typeof leadId !== "number" || !Number.isInteger(leadId)) {
      return NextResponse.json({ error: "invalid_lead_id" }, { status: 400 });
    }

    const ctx = {
      actorType: "SYSTEM" as const,
      source: "api/discovery/token/issue",
      requestId,
    };

    const issued = await issueQuestionnaireToken(leadId, ctx);
    if (!issued.ok) {
      return NextResponse.json(
        { error: issued.reason },
        { status: issued.reason === "not_found" ? 404 : 409 }
      );
    }

    // Journey initiation, not delivery.
    await transitionLead(leadId, "QUESTIONNAIRE_SENT", ctx);

    const { rows } = await sql`
      SELECT first_name, name, email FROM demo_requests WHERE id = ${leadId}
    `;
    const firstName =
      (rows[0]?.first_name as string) || (rows[0]?.name as string) || "there";
    const email = rows[0]?.email as string;

    // Raw token goes into the email link and nowhere else.
    const discoveryUrl = `${SITE_URL}/discovery/start?t=${issued.rawToken}`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    let failed = false;
    let errorDetail: string | undefined;
    try {
      const result = await resend.emails.send({
        from: "Payroll Synergy Experts <info@payrollsynergyexperts.com>",
        replyTo: "info@payrollsynergyexperts.com",
        to: email,
        subject: "Your governance discovery questionnaire",
        html: questionnaireInviteHtml({
          firstName,
          discoveryUrl,
          expiresDays: INVITATION_TOKEN_TTL_DAYS,
        }),
      });
      if (result.error) {
        failed = true;
        errorDetail = String(result.error.message ?? "provider_error").slice(0, 300);
      }
    } catch (err) {
      failed = true;
      errorDetail = String((err as Error)?.message ?? err).slice(0, 300);
    }

    if (failed) {
      console.error(`[token-issue:${requestId}] invite email failed:`, errorDetail);
    }
    await recordLeadEvent(leadId, failed ? "EMAIL_FAILED" : "EMAIL_SENT", {
      ...ctx,
      metadata: { kind: "questionnaire-invite", tokenId: issued.tokenId, error: errorDetail },
    });

    return NextResponse.json({
      success: true,
      tokenId: issued.tokenId,
      expiresAt: issued.expiresAt.toISOString(),
      rotated: issued.revokedCount > 0,
      emailDelivered: !failed,
    });
  } catch (error) {
    console.error(`[token-issue:${requestId}] error:`, error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
