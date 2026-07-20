// /api/internal/discovery-brief/[leadId] — internal-only.
//
// GET  → latest brief for the lead (404 if none generated yet)
// POST → generate (idempotent for unchanged answers; versioned otherwise)
//
// Auth: Bearer INTERNAL_API_SECRET. Never public; the prospect-facing
// surface has no path to this route.

import { NextRequest, NextResponse } from "next/server";
import {
  generateDiscoveryBrief,
  getLatestBrief,
} from "@/lib/commercial/discovery-brief";

function authorized(request: NextRequest): boolean {
  const secret = process.env.INTERNAL_API_SECRET;
  return Boolean(secret) && request.headers.get("authorization") === `Bearer ${secret}`;
}

function parseLeadId(raw: string): number | null {
  return /^\d{1,10}$/.test(raw) ? Number(raw) : null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const leadId = parseLeadId((await params).leadId);
  if (leadId === null) {
    return NextResponse.json({ error: "invalid_lead_id" }, { status: 400 });
  }
  try {
    const brief = await getLatestBrief(leadId);
    if (!brief) {
      return NextResponse.json({ error: "no_brief" }, { status: 404 });
    }
    return NextResponse.json({ brief });
  } catch (error) {
    console.error("[discovery-brief:get] error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  const requestId = crypto.randomUUID();
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const leadId = parseLeadId((await params).leadId);
  if (leadId === null) {
    return NextResponse.json({ error: "invalid_lead_id" }, { status: 400 });
  }
  try {
    const result = await generateDiscoveryBrief(leadId, {
      actorType: "TEAM_MEMBER",
      source: "api/internal/discovery-brief",
      requestId,
    });
    if (!result.ok) {
      const status = result.reason === "not_found" ? 404 : 409;
      return NextResponse.json({ error: result.reason }, { status });
    }
    return NextResponse.json({ brief: result.brief, reused: result.reused });
  } catch (error) {
    console.error(`[discovery-brief:${requestId}] error:`, error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
