import { describe, expect, it } from "vitest";
import { chapLeadNotificationHtml } from "@/lib/emails";

describe("CHAP lead email HTML safety", () => {
  it("escapes visitor-controlled fields before rendering", () => {
    const html = chapLeadNotificationHtml({
      email: "qa@example.com<script>alert(1)</script>",
      sessionId: "<b>malicious</b>",
      firstQuestion: "<img src=x onerror=alert(1)>",
    });
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<b>malicious</b>");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&lt;b&gt;malicious&lt;/b&gt;");
  });
});
