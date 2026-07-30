// POST /api/demo-request — commercial funnel entry point.
//
// Contract (ratified Step 4):
//   parse → honeypot → normalize → validate → rate-limit → classify
//   → create lead (atomic with LEAD_CREATED) → transition NEW→VIDEO_SENT
//   → send internal + journey emails → record delivery outcomes → success
//
// Doctrine:
// - lead_status is written only through transitionLead().
// - VIDEO_SENT means journey initiation, not delivery. Delivery outcomes
//   are EMAIL_SENT / EMAIL_FAILED events; Resend failures never lose the
//   lead and never surface as a server error to the prospect.
// - Response is minimal: { success: true }. No lead IDs, statuses,
//   classifications, or internal identifiers.
// - Schema is migration-managed (scripts/migrate.mjs) — no DDL here.

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  createLeadWithEvent,
  transitionLead,
  recordLeadEvent,
  classifyEmailDomain,
} from "@/lib/commercial/lifecycle";
import { signLeadRef } from "@/lib/commercial/links";
import { checkAndIncrementScopedLimit } from "@/lib/rateLimiter";
import { hashIp, extractIp, ipHashingConfigured } from "@/lib/ipHash";
import { internalNotificationHtml, journeyEmailHtml } from "@/lib/emails";

const NOTIFICATION_EMAIL =
  process.env.NOTIFICATION_EMAIL || "info@payrollsynergyexperts.com";
const SITE_URL = process.env.SITE_URL || "https://payrollsynergyexperts.com";

const ALLOWED_SOURCES = [
  "pse-marketing",
  "benefits-interest",
  "workforce-analytics-interest",
  "system-integration-interest",
] as const;
const ALLOWED_EMPLOYEE_RANGES = ["1-50", "51-200", "201-500", "500+"] as const;

// Pragmatic email shape check — reject obvious garbage without attempting
// the full RFC. Combined with length caps and lowercase normalization.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const IP_SUBMISSION_CAP = 10; // per 24h — automation backstop
const EMAIL_SUBMISSION_CAP = 1; // per 24h — one journey email per address

const GENERIC_SUCCESS = { success: true };

interface ValidatedInput {
  firstName: string;
  lastName?: string;
  email: string;
  company?: string;
  jobTitle?: string;
  employees?: string;
  source: string;
}

function str(value: unknown): string | undefined {
  return typeof value === "string" ? value.trim() : undefined;
}

function validate(body: Record<string, unknown>):
  | { ok: true; input: ValidatedInput }
  | { ok: false; error: string } {
  const firstName = str(body.firstName);
  const lastName = str(body.lastName);
  const emailRaw = str(body.email);
  const company = str(body.company);
  const jobTitle = str(body.jobTitle);
  const employees = str(body.employees);
  const source = str(body.source);

  if (!firstName || firstName.length > 100) {
    return { ok: false, error: "invalid_first_name" };
  }
  if (lastName && lastName.length > 100) {
    return { ok: false, error: "invalid_last_name" };
  }
  const email = emailRaw?.toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return { ok: false, error: "invalid_email" };
  }
  // Company, job title, and employee count are optional (Stage C ruling):
  // the demo form is the protected top-of-funnel surface and the discovery
  // questionnaire collects organizational context anyway. Present values
  // are still validated; garbage is rejected, absence is not.
  if (company && company.length > 200) {
    return { ok: false, error: "invalid_company" };
  }
  if (jobTitle && jobTitle.length > 150) {
    return { ok: false, error: "invalid_job_title" };
  }
  if (
    employees &&
    !(ALLOWED_EMPLOYEE_RANGES as readonly string[]).includes(employees)
  ) {
    return { ok: false, error: "invalid_employees" };
  }
  const safeSource = (ALLOWED_SOURCES as readonly string[]).includes(
    source ?? ""
  )
    ? (source as string)
    : "pse-marketing";

  return {
    ok: true,
    input: {
      firstName,
      lastName: lastName || undefined,
      email,
      company: company || undefined,
      jobTitle: jobTitle || undefined,
      employees: employees || undefined,
      source: safeSource,
    },
  };
}

function journeyVideoUrl(leadId: number): string | undefined {
  const directUrl = process.env.PSE_OVERVIEW_VIDEO_URL;
  if (!directUrl) return undefined;
  const ref = signLeadRef(leadId);
  // Tracked redirect when signing is configured; direct (untracked) link
  // otherwise — never a broken link.
  return ref
    ? `${SITE_URL}/api/engagement/video-click?l=${encodeURIComponent(ref)}`
    : directUrl;
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();

  // Fail closed: the IP rate limit depends on salted hashing. Without the
  // salt the route would either skip the limit or store reversible hashes —
  // both worse than a visible 503 (same posture as the CHAP widget gate).
  if (!ipHashingConfigured()) {
    console.error(`[demo-request:${requestId}] COMMERCIAL_IP_HASH_SALT unset`);
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "invalid_body" }, { status: 400 });
    }
    const record = body as Record<string, unknown>;

    // Honeypot (either field name) — generic success, no side effects,
    // no disclosure.
    if (record.website || record.ref_120) {
      return NextResponse.json(GENERIC_SUCCESS);
    }

    const validated = validate(record);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }
    const input = validated.input;

    // Rate limits. IP scope backstops automated volume; email scope makes
    // rapid duplicate submissions idempotent (one journey email per
    // address per 24h — excess returns generic success with no side
    // effects, so double-clicks and reposts don't respam the prospect).
    const ipLimit = await checkAndIncrementScopedLimit(
      "demo-request-ip",
      hashIp(extractIp(request)),
      IP_SUBMISSION_CAP
    );
    if (!ipLimit.allowed) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const emailLimit = await checkAndIncrementScopedLimit(
      "demo-request-email",
      input.email,
      EMAIL_SUBMISSION_CAP
    );
    if (!emailLimit.allowed) {
      console.log(`[demo-request:${requestId}] duplicate email suppressed`);
      return NextResponse.json(GENERIC_SUCCESS);
    }

    const emailDomainType = classifyEmailDomain(input.email);

    // Lead + LEAD_CREATED are atomic.
    const lead = await createLeadWithEvent(
      { ...input, emailDomainType },
      {
        actorType: "PROSPECT",
        source: "api/demo-request",
        requestId,
        metadata: { emailDomainType, campaignSource: input.source },
      }
    );

    const videoUrl = journeyVideoUrl(lead.id);

    // Journey initiation — not delivery — and only when there is a video
    // to send. With PSE_OVERVIEW_VIDEO_URL unset, a VIDEO_SENT status
    // would assert an event that never happened and park the lead in a
    // state whose only exit (VIDEO_ENGAGED) requires clicking a link the
    // email doesn't contain. The lead stays NEW — which is true — and
    // NEW's widened transition set means it isn't stuck there. Same
    // fail-closed posture as the salt and the flags: don't claim the
    // capability when it isn't provisioned.
    if (videoUrl) {
      // Sole permitted status writer.
      await transitionLead(lead.id, "VIDEO_SENT", {
        actorType: "SYSTEM",
        source: "api/demo-request",
        requestId,
        metadata: { campaignSource: input.source },
      });
    }
    const legacyName = [input.firstName, input.lastName]
      .filter(Boolean)
      .join(" ");

    const resend = new Resend(process.env.RESEND_API_KEY);
    const sends: { kind: "internal" | "journey"; promise: Promise<unknown> }[] =
      [
        {
          kind: "internal",
          promise: resend.emails.send({
            from: "PSE Marketing <noreply@payrollsynergyexperts.com>",
            to: NOTIFICATION_EMAIL,
            subject: `New Demo Request: ${input.company ?? legacyName}`,
            html: internalNotificationHtml({
              name: legacyName,
              email: input.email,
              company: input.company,
              jobTitle: input.jobTitle,
              employees: input.employees,
            }),
          }),
        },
        {
          kind: "journey",
          promise: resend.emails.send({
            from: "Payroll Synergy Experts <noreply@payrollsynergyexperts.com>",
            to: input.email,
            subject: "Your PSE overview and next steps",
            html: journeyEmailHtml({ firstName: input.firstName, videoUrl }),
          }),
        },
      ];

    const results = await Promise.allSettled(sends.map((s) => s.promise));

    // Delivery outcomes are events, never failures of the request.
    for (let i = 0; i < results.length; i++) {
      const kind = sends[i].kind;
      const result = results[i];
      // Resend resolves with { data, error } — a resolved promise with an
      // error field is still a failure.
      const resolvedError =
        result.status === "fulfilled"
          ? (result.value as { error?: { message?: string } | null })?.error
          : null;
      const failed = result.status === "rejected" || Boolean(resolvedError);

      const metadata: Record<string, unknown> = {
        kind,
        videoIncluded: kind === "journey" ? Boolean(videoUrl) : undefined,
      };
      if (failed) {
        const reason =
          result.status === "rejected"
            ? String(
                (result.reason as { message?: string })?.message ??
                  result.reason
              )
            : String(resolvedError?.message ?? "provider_error");
        // Normalized error only — no secrets, no full provider payloads.
        metadata.error = reason.slice(0, 300);
        console.error(`[demo-request:${requestId}] ${kind} email failed:`, reason);
      } else {
        const resendId = (
          result as PromiseFulfilledResult<{ data?: { id?: string } | null }>
        ).value?.data?.id;
        if (resendId) metadata.resendId = resendId;
      }

      try {
        await recordLeadEvent(lead.id, failed ? "EMAIL_FAILED" : "EMAIL_SENT", {
          actorType: "SYSTEM",
          source: "api/demo-request",
          requestId,
          metadata,
        });
      } catch (eventErr) {
        // Observability only — the lead is already durable.
        console.error(
          `[demo-request:${requestId}] failed to record email event:`,
          eventErr
        );
      }
    }

    return NextResponse.json(GENERIC_SUCCESS);
  } catch (error) {
    console.error(`[demo-request:${requestId}] error:`, error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
