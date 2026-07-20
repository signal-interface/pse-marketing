// /discovery/questionnaire — the governance discovery questionnaire.
//
// Session-gated: renders only for holders of the pse_dq_session cookie
// (set by /api/discovery/session/start). Organizational context only —
// the field set mirrors the server-side allowlist in
// lib/commercial/questionnaire.ts, which is the enforcement point.

import type { Metadata } from "next";
import QuestionnaireClient from "./QuestionnaireClient";

export const metadata: Metadata = {
  title: "Governance Discovery Questionnaire — Payroll Synergy Experts",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default function DiscoveryQuestionnairePage() {
  return <QuestionnaireClient />;
}
