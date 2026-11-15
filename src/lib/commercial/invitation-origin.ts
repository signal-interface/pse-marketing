// Preview invitations must never silently send a production-host URL for
// a one-time token stored in the Preview lead/session database.
// Production retains the existing canonical URL fallback.
const PRODUCTION_ORIGIN = "https://payrollsynergyexperts.com";

export function invitationOrigin(config: {
  siteUrl?: string;
  vercelEnv?: string;
}): string | null {
  const candidate = config.siteUrl?.trim();
  if (!candidate) {
    return config.vercelEnv === "preview" ? null : PRODUCTION_ORIGIN;
  }

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }
  if (
    url.protocol !== "https:" ||
    url.username || url.password || url.search || url.hash ||
    url.pathname !== "/"
  ) return null;

  // A Preview token must not be mailed as a production-domain invitation.
  // Accept only a deliberate Vercel preview-domain configuration. Authentication
  // and recipient access to that Preview still require independent acceptance.
  if (config.vercelEnv === "preview" && !url.hostname.endsWith(".vercel.app")) {
    return null;
  }
  return url.origin;
}
