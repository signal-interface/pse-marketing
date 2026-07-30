// GET /api/engagement/video-click — journey email video redirect.
//
// Verifies the HMAC-signed lead ref, records VIDEO_LINK_CLICKED, attempts
// the VIDEO_SENT → VIDEO_ENGAGED transition (a no-op or invalid transition
// is fine — the prospect may already be further along or in NURTURE), and
// redirects to the overview video.
//
// Failure posture: the prospect always reaches the video if it's
// configured. Tracking failures must never turn a marketing email link
// into an error page.

import { NextRequest, NextResponse } from "next/server";
import { verifyLeadRef } from "@/lib/commercial/links";
import { transitionLead, recordLeadEvent } from "@/lib/commercial/lifecycle";

const FALLBACK_URL =
  process.env.SITE_URL || "https://payrollsynergyexperts.com";

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const videoUrl = process.env.PSE_OVERVIEW_VIDEO_URL;
  const destination = videoUrl || FALLBACK_URL;

  const ref = request.nextUrl.searchParams.get("l");
  const leadId = ref ? verifyLeadRef(ref) : null;

  if (leadId !== null) {
    try {
      await recordLeadEvent(leadId, "VIDEO_LINK_CLICKED", {
        actorType: "PROSPECT",
        source: "api/engagement/video-click",
        requestId,
      });
      // Best-effort: invalid-from-state results are expected and ignored
      // (repeat clicks, NURTURE re-entry, later stages).
      await transitionLead(leadId, "VIDEO_ENGAGED", {
        actorType: "PROSPECT",
        source: "api/engagement/video-click",
        requestId,
      });
    } catch (err) {
      console.error(`[video-click:${requestId}] tracking error:`, err);
    }
  }

  return NextResponse.redirect(destination, 302);
}
