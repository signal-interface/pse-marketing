import { Fragment } from "react";

// Every metric here is a registered claim (src/content/trust/claims.ts) —
// claimId ties each number to its registry entry, and the
// live-surface-claims release-gate test enforces the linkage. Rendering is
// NOT yet filtered by publishableClaims(); that rewiring is a content
// decision pending the ruling on the non-current claims.
export const CRED_METRICS = [
  {
    claimId: "cred-employee-records-per-cycle",
    number: "1,200+",
    label: "Employee records validated per payroll cycle",
  },
  {
    claimId: "cred-chap-rule-count",
    number: "500+",
    label: "Compliance rules in the CHAP AI engine",
  },
  {
    claimId: "cred-jurisdictions-monitored",
    number: "50",
    label: "State + federal jurisdictions monitored",
  },
  {
    claimId: "cred-regulatory-sources-tracked",
    number: "30+",
    label: "Regulatory and enforcement sources tracked daily",
  },
] as const;

export function CredibilityStrip() {
  return (
    <section className="cred-strip">
      <div className="cred-strip__inner">
        <p className="cred-strip__lead">
          Built by practitioners. Governed by compliance logic.
        </p>
        <div className="cred-strip__metrics">
          {CRED_METRICS.map((metric, index) => (
            <Fragment key={metric.claimId}>
              {index > 0 && <div className="cred-strip__divider" />}
              <div className="cred-strip__metric">
                <span className="cred-strip__number">{metric.number}</span>
                <span className="cred-strip__label">{metric.label}</span>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
