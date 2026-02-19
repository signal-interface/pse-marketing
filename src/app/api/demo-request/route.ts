import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { Resend } from "resend";
import { ensureDemoRequestsTable } from "@/lib/db";
import { internalNotificationHtml, autoResponseHtml } from "@/lib/emails";

const NOTIFICATION_EMAIL =
  process.env.NOTIFICATION_EMAIL || "info@payrollsynergyexperts.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, employees, website } = body;

    // Honeypot check
    if (website) {
      return NextResponse.json({ success: true });
    }

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Ensure table exists, then insert
    await ensureDemoRequestsTable();
    await sql`
      INSERT INTO demo_requests (name, email, company, employees, source)
      VALUES (${name}, ${email}, ${company || null}, ${employees || null}, 'pse-marketing')
    `;

    // Send emails (non-blocking — don't let email failure block the response)
    const resend = new Resend(process.env.RESEND_API_KEY);
    const emailPromises = [
      // Internal notification
      resend.emails.send({
        from: "PSE Marketing <onboarding@resend.dev>",
        to: NOTIFICATION_EMAIL,
        subject: `New Demo Request: ${company || name}`,
        html: internalNotificationHtml({ name, email, company, employees }),
      }),
      // Auto-response to submitter
      resend.emails.send({
        from: "Payroll Synergy Experts <onboarding@resend.dev>",
        to: email,
        subject: "We received your demo request — Payroll Synergy Experts",
        html: autoResponseHtml({ name, email, company, employees }),
      }),
    ];

    // Fire emails but don't block on them
    Promise.allSettled(emailPromises).catch(() => {
      // Email failures are logged but don't affect the response
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Demo request error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
