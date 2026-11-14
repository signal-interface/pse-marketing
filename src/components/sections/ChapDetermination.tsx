'use client';

// Structured determination renderer for the CHAP AI widget.
// Mirrors the .chap-interface__exception visual pattern but with
// full regulation/analysis/rationale/citations structure.
//
// Severity colors reuse --color-red / --color-green / --color-amber
// from the app's @theme tokens so the widget stays aligned with the
// rest of the design system.

import Link from 'next/link';
import type {
  ValidatedResponse,
  OutOfScopeCategory,
} from '@/lib/chapValidation';

export function ChapDetermination(props: {
  response: ValidatedResponse | null;
}) {
  const { response } = props;

  if (response === null) {
    return <OutOfScopeBlock category="other" />;
  }
  if (response.kind === 'out_of_scope') {
    return <OutOfScopeBlock category={response.detectedCategory} />;
  }

  const severity =
    response.determination === 'FLAGGED'
      ? 'flagged'
      : response.determination === 'CLEAR'
        ? 'clear'
        : 'review';

  return (
    <div className="chap-determination">
      {/* Applicable Regulation */}
      <div className="chap-determination__regulation">
        <div className="chap-determination__label">Applicable Regulation</div>
        <div className="chap-determination__reg-ref">
          {response.applicableRegulation.reference}
        </div>
        <div className="chap-determination__reg-name">
          {response.applicableRegulation.name}
        </div>
        <div className="chap-determination__reg-meta">
          <span className="chap-determination__reg-jurisdiction">
            {response.applicableRegulation.jurisdiction}
          </span>
          {' · '}
          <a
            href={response.applicableRegulation.primarySourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="chap-determination__reg-link"
          >
            Primary source ↗
          </a>
        </div>
      </div>

      {/* Analysis */}
      <div className="chap-determination__section">
        <div className="chap-determination__label">Analysis</div>
        <p className="chap-determination__analysis">{response.analysis}</p>
      </div>

      {/* Determination badge + rationale */}
      <div className="chap-determination__section chap-determination__section--badge">
        <div
          className={`chap-determination__badge chap-determination__badge--${severity}`}
        >
          {response.determination.replace(/_/g, ' ')}
        </div>
        <div className="chap-determination__rationale">{response.rationale}</div>
      </div>

      {/* Citations */}
      <div className="chap-determination__section">
        <div className="chap-determination__label">Citations</div>
        <ol className="chap-determination__citations">
          {response.citations.map((c) => (
            <li key={c.id} className="chap-determination__citation">
              <a
                href={c.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="chap-determination__citation-link"
              >
                {c.citation}
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div className="chap-determination__confidence">
        Confidence: {response.confidence}
      </div>

      <div className="chap-determination__disclaimer">
        Educational information only — not legal, tax, or employer-specific payroll advice.
        A NEEDS HUMAN REVIEW result is not automatically referred to anyone.
        Consult a qualified payroll, tax, or legal professional before acting.
      </div>
    </div>
  );
}

function OutOfScopeBlock(props: { category: OutOfScopeCategory | 'other' }) {
  const text =
    props.category === 'injection'
      ? 'That input looks like a prompt-injection attempt. I don’t answer those.'
      : props.category === 'multi_state_overtime'
        ? 'Multi-state overtime is outside the current CHAP corpus (v1 scope is IRC §6656).'
        : 'That question is outside the current CHAP corpus (v1 scope is IRC §6656).';

  return (
    <div className="chap-determination chap-determination--oos">
      <div className="chap-determination__oos-text">{text}</div>
      <Link href="/#demo" className="chap-determination__oos-cta">
        Request a demo →
      </Link>
    </div>
  );
}
