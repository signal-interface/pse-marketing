// /discovery/start — token landing page.
//
// Exchanges the one-time invitation token for a session cookie, then
// navigates to /discovery/questionnaire with history.replaceState so the
// tokened URL does not remain in browser history as the active page.
// No third-party scripts; strict referrer policy set via metadata.

import type { Metadata } from "next";
import DiscoveryStartClient from "./DiscoveryStartClient";

export const metadata: Metadata = {
  title: "Governance Discovery — Payroll Synergy Experts",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function DiscoveryStartPage() {
  return <DiscoveryStartClient />;
}
