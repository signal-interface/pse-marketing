interface DemoRequestData {
  name: string;
  email: string;
  company?: string;
  employees?: string;
  jobTitle?: string;
}

// User-supplied values must never be interpolated into email HTML raw.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface ChapLeadData {
  email: string;
  sessionId: string;
  firstQuestion?: string;
}

export function chapLeadNotificationHtml(data: ChapLeadData): string {
  const rows: [string, string][] = [
    ["Email", data.email],
    ["Session", data.sessionId],
    ["First question", data.firstQuestion || "—"],
    [
      "Captured",
      new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
    ],
  ];

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto;">
      <h2 style="color: #0b1d3a; margin-bottom: 16px;">New CHAP Widget Lead</h2>
      <p style="color: #4a5e78; font-size: 13px; margin: 0 0 20px;">
        A visitor to <strong>/chap-ai</strong> hit the email gate after using
        up their free questions. This is a softer intent signal than a demo
        request — they're still in research mode.
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eceef2; color: #6b7280; font-size: 14px; width: 140px;">${label}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eceef2; color: #1c1c2e; font-size: 14px;">${value}</td>
          </tr>`
          )
          .join("")}
      </table>
    </div>
  `;
}

export function internalNotificationHtml(data: DemoRequestData): string {
  const rows = [
    ["Name", escapeHtml(data.name)],
    ["Email", escapeHtml(data.email)],
    ["Company", data.company ? escapeHtml(data.company) : "—"],
    ["Job title", data.jobTitle ? escapeHtml(data.jobTitle) : "—"],
    ["Employees", data.employees ? escapeHtml(data.employees) : "—"],
    ["Submitted", new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })],
  ];

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto;">
      <h2 style="color: #0b1d3a; margin-bottom: 16px;">New Demo Request</h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eceef2; color: #6b7280; font-size: 14px; width: 120px;">${label}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eceef2; color: #1c1c2e; font-size: 14px;">${value}</td>
          </tr>`
          )
          .join("")}
      </table>
    </div>
  `;
}

export function autoResponseHtml(data: DemoRequestData): string {
  const details = [
    data.company && `Company: ${data.company}`,
    data.employees && `Team size: ${data.employees}`,
  ]
    .filter(Boolean)
    .join("<br/>");

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
      <div style="background: #0b1d3a; padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">Payroll Synergy Experts</h1>
      </div>

      <div style="padding: 32px 24px; border: 1px solid #eceef2; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Hi ${data.name},
        </p>

        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Thank you for requesting a demo. We&rsquo;ve received your submission and our team will reach out within <strong>24 hours</strong> to schedule your personalized walkthrough.
        </p>

        ${
          details
            ? `
        <div style="background: #f5f0eb; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px;">What you submitted</p>
          <p style="color: #1c1c2e; font-size: 15px; margin: 0; line-height: 1.6;">${details}</p>
        </div>`
            : ""
        }

        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 20px 0 0;">
          In the meantime, you can learn more about our platform at
          <a href="https://payrollsynergyexperts.com" style="color: #1a5fb4; text-decoration: none;">payrollsynergyexperts.com</a>.
        </p>

        <hr style="border: none; border-top: 1px solid #eceef2; margin: 28px 0 20px;" />

        <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0;">
          Payroll Synergy Experts<br/>
          <a href="https://payrollsynergyexperts.com" style="color: #6b7280; text-decoration: none;">payrollsynergyexperts.com</a>
        </p>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Journey email #1 — sent on demo request (replaces autoResponseHtml for the
// commercial lifecycle; autoResponseHtml is retained only until legacy
// callers are removed).
//
// Voice discipline: PSE governs / the system of record executes. No
// calendar access at this stage — scheduling unlocks after the discovery
// questionnaire.
// ---------------------------------------------------------------------------

interface JourneyEmailData {
  firstName: string;
  /** Tracked redirect URL when link signing is configured, else direct URL, else absent. */
  videoUrl?: string;
}

export function journeyEmailHtml(data: JourneyEmailData): string {
  const firstName = escapeHtml(data.firstName);
  const videoBlock = data.videoUrl
    ? `
        <div style="text-align: center; margin: 24px 0;">
          <a href="${data.videoUrl}"
             style="display: inline-block; background: #0b1d3a; color: #ffffff; font-size: 15px; font-weight: 600; padding: 14px 28px; border-radius: 8px; text-decoration: none;">
            Watch the PSE Overview
          </a>
        </div>`
    : "";

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
      <div style="background: #0b1d3a; padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">Payroll Synergy Experts</h1>
      </div>

      <div style="padding: 32px 24px; border: 1px solid #eceef2; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Hi ${firstName},
        </p>

        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Thanks for your request. Before we meet, here&rsquo;s a short overview
          of how PSE works.
        </p>
        ${videoBlock}
        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          PSE is a governance and validation layer that sits above your payroll
          system of record. Your payroll system executes &mdash; PSE governs:
          validating outcomes, surfacing compliance risk, and maintaining
          audit-ready evidence of what was checked and why.
        </p>

        <div style="background: #f5f0eb; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px;">What happens next</p>
          <p style="color: #1c1c2e; font-size: 15px; margin: 0; line-height: 1.7;">
            You&rsquo;ll receive a short governance discovery questionnaire
            (about five minutes) so we can tailor the session to your payroll
            environment. Once it&rsquo;s complete, you&rsquo;ll get direct
            access to schedule your discovery call.
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #eceef2; margin: 28px 0 20px;" />

        <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0;">
          Payroll Synergy Experts<br/>
          <a href="https://payrollsynergyexperts.com" style="color: #6b7280; text-decoration: none;">payrollsynergyexperts.com</a>
        </p>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Questionnaire invitation — carries the one-time discovery link. The raw
// token appears only inside this email; it is never logged or stored.
// ---------------------------------------------------------------------------

interface QuestionnaireInviteData {
  firstName: string;
  discoveryUrl: string;
  expiresDays: number;
}

export function questionnaireInviteHtml(data: QuestionnaireInviteData): string {
  const firstName = escapeHtml(data.firstName);
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
      <div style="background: #0b1d3a; padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">Payroll Synergy Experts</h1>
      </div>

      <div style="padding: 32px 24px; border: 1px solid #eceef2; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Hi ${firstName},
        </p>

        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          The next step is a short governance discovery questionnaire &mdash;
          about five minutes on your organization&rsquo;s payroll environment,
          systems, and priorities. No payroll data or employee information is
          requested at any point.
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${data.discoveryUrl}"
             style="display: inline-block; background: #0b1d3a; color: #ffffff; font-size: 15px; font-weight: 600; padding: 14px 28px; border-radius: 8px; text-decoration: none;">
            Continue to Governance Discovery
          </a>
        </div>

        <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0 0 16px; text-align: center;">
          This personal link is valid for ${data.expiresDays} days and can be
          used once. You can save and resume before submitting.
        </p>

        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0;">
          Once submitted, you&rsquo;ll get direct access to schedule your
          discovery call.
        </p>

        <hr style="border: none; border-top: 1px solid #eceef2; margin: 28px 0 20px;" />

        <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0;">
          Payroll Synergy Experts<br/>
          <a href="https://payrollsynergyexperts.com" style="color: #6b7280; text-decoration: none;">payrollsynergyexperts.com</a>
        </p>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Scheduling unlock — sent after questionnaire submission. Carries the
// prospect's personal Cal.com link (prefill + attribution ref).
// ---------------------------------------------------------------------------

interface SchedulingUnlockData {
  firstName: string;
  schedulingUrl: string;
}

export function schedulingUnlockHtml(data: SchedulingUnlockData): string {
  const firstName = escapeHtml(data.firstName);
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
      <div style="background: #0b1d3a; padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">Payroll Synergy Experts</h1>
      </div>

      <div style="padding: 32px 24px; border: 1px solid #eceef2; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Hi ${firstName},
        </p>

        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Thanks — your governance discovery questionnaire is in. The final
          step is to pick a time for your discovery session. We&rsquo;ll come
          prepared: the conversation will be about your payroll environment
          and priorities as you described them.
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${data.schedulingUrl}"
             style="display: inline-block; background: #0b1d3a; color: #ffffff; font-size: 15px; font-weight: 600; padding: 14px 28px; border-radius: 8px; text-decoration: none;">
            Schedule your discovery session
          </a>
        </div>

        <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0; text-align: center;">
          You&rsquo;ll receive a calendar confirmation as soon as you book.
        </p>

        <hr style="border: none; border-top: 1px solid #eceef2; margin: 28px 0 20px;" />

        <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0;">
          Payroll Synergy Experts<br/>
          <a href="https://payrollsynergyexperts.com" style="color: #6b7280; text-decoration: none;">payrollsynergyexperts.com</a>
        </p>
      </div>
    </div>
  `;
}
