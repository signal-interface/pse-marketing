import { Fragment } from "react";
import { publishableClaims } from "@/content/trust/claims";
import { ENFORCEMENT_STATS } from "@/lib/stats";

// Every metric here is a registered claim (src/content/trust/claims.ts) —
// claimId ties each figure to its registry entry, and the
// live-surface-claims release-gate test enforces the linkage.
// 2026-07-30 follow-up ruling: the strip publishes third-party enforcement
// statistics (values and citations from src/lib/stats.ts), not
// self-reported capability numbers — the exposure is the pitch, and a
// prospect can check the sources. Only figures whose primary source
// resolves to a checkable URL qualify (release-gate enforced); rendering
// goes through publishableClaims("/"), the only sanctioned read path; the
// component removes itself from the page flow entirely when nothing is
// publishable.
export const CRED_METRICS = [
  {
    claimId: "stat-irc-6656-max-penalty",
    number: ENFORCEMENT_STATS.irsMaxDepositPenalty.value,
    label: "Maximum IRC §6656 penalty on late federal payroll deposits",
    source: ENFORCEMENT_STATS.irsMaxDepositPenalty.source,
  },
  {
    claimId: "stat-dol-fy2024-back-wages",
    number: ENFORCEMENT_STATS.dolBackWages.value,
    label: "Recovered by DOL Wage & Hour in FY2024 back wages",
    source: ENFORCEMENT_STATS.dolBackWages.source,
  },
  {
    claimId: "stat-compliance-top-challenge",
    number: ENFORCEMENT_STATS.payrollComplianceTopChallenge.value,
    label: "Of payroll professionals name compliance their biggest challenge",
    source: ENFORCEMENT_STATS.payrollComplianceTopChallenge.source,
  },
] as const;

export function CredibilityStrip() {
  const publishableIds = new Set(publishableClaims("/").map((c) => c.id));
  const publishable = CRED_METRICS.filter((m) => publishableIds.has(m.claimId));
  if (publishable.length === 0) return null;

  return (
    <section className="cred-strip">
      <div className="cred-strip__inner">
        <p className="cred-strip__lead">What the enforcement data shows</p>
        <div className="cred-strip__metrics">
          {publishable.map((metric, index) => (
            <Fragment key={metric.claimId}>
              {index > 0 && <div className="cred-strip__divider" />}
              <div className="cred-strip__metric">
                <span className="cred-strip__number">{metric.number}</span>
                <span className="cred-strip__label">{metric.label}</span>
                <span className="cred-strip__source">{metric.source}</span>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
