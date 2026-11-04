/**
 * Marketing-owned presentation choices, not a Sales Demo capability authority.
 * The Demo repository owns working screens and fixed synthetic data; only
 * independently accepted scenarios may be promoted into the selectable list.
 *
 * Product source: payroll-synergy-experts/PSE--Projects
 * frontend/apps/demo/src/{App.tsx,config.tsx,beta-destinations.tsx}
 *
 * The Readiness/Findings/Verification/Evidence beta destinations are build-gated
 * and MUST NOT be presented as public demonstrations until accepted.
 */
export const APPROVED_DEMO_SELECTIONS = [
  { id: "general-overview", label: "General PSE overview" },
] as const;

export type ApprovedDemoSelection = (typeof APPROVED_DEMO_SELECTIONS)[number]["id"];

export function isApprovedDemoSelection(input: unknown): input is ApprovedDemoSelection {
  return typeof input === "string" &&
    APPROVED_DEMO_SELECTIONS.some((s) => s.id === input);
}

// Discovery inventory, not live options. These require Demo owner acceptance
// of the fixed-data screen/process, route and presenter evidence before promotion.
export const CANDIDATE_DEMO_AREAS = [
  { id: "dashboard-overview", sourceRoute: "/dashboard", status: "needs-demo-acceptance" },
  { id: "exception-review", sourceRoute: "/exceptions", status: "needs-demo-acceptance" },
  { id: "chap-ai", sourceRoute: "/chap-ai", status: "needs-demo-acceptance" },
] as const;
