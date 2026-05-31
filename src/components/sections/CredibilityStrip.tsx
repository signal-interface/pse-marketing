export function CredibilityStrip() {
  return (
    <section className="cred-strip">
      <div className="cred-strip__inner">
        <p className="cred-strip__lead">
          Built by practitioners. Governed by compliance logic.
        </p>
        <div className="cred-strip__metrics">
          <div className="cred-strip__metric">
            <span className="cred-strip__number">1,200+</span>
            <span className="cred-strip__label">Employee records validated per payroll cycle</span>
          </div>
          <div className="cred-strip__divider" />
          <div className="cred-strip__metric">
            <span className="cred-strip__number">500+</span>
            <span className="cred-strip__label">Compliance rules in the CHAP AI engine</span>
          </div>
          <div className="cred-strip__divider" />
          <div className="cred-strip__metric">
            <span className="cred-strip__number">50</span>
            <span className="cred-strip__label">State + federal jurisdictions monitored</span>
          </div>
          <div className="cred-strip__divider" />
          <div className="cred-strip__metric">
            <span className="cred-strip__number">30+</span>
            <span className="cred-strip__label">Regulatory and enforcement sources tracked daily</span>
          </div>
        </div>
      </div>
    </section>
  );
}
