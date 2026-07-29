interface DemoRequestData {
  name: string;
  email: string;
  company?: string;
  employees?: string;
}

export function internalNotificationHtml(data: DemoRequestData): string {
  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    ["Company", data.company || "—"],
    ["Employees", data.employees || "—"],
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
