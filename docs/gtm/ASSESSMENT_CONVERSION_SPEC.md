# Assessment Conversion Specification

Status: proposed

## Purpose

Convert organizational risk or readiness intent into a scoped human-led discovery process without presenting the assessment as a free demo.

## Intake

Proposed fields:

- contact and company;
- role;
- employee population;
- countries and jurisdictions;
- payroll systems;
- payroll frequencies;
- primary risks;
- assessment type;
- desired timeline;
- consent and communication preferences.

## Assessment types

- Payroll Governance Readiness
- Compliance Readiness
- AI Readiness
- Multi-State Risk
- Transformation / Implementation Readiness

Names, pricing, scope, duration, and deliverables require commercial approval.

## Lifecycle

```text
assessment.started
→ assessment.requested
→ assessment.reviewed
→ discovery.requested
→ discovery.completed
→ scope.proposed
→ assessment.accepted | assessment.nurtured | assessment.declined
```

## Boundaries

- Do not reuse the demo form without distinct source, copy, notification, and storage semantics.
- Do not create an authenticated assessment workspace from an unreviewed form submission.
- Do not promise findings, legal conclusions, or turnaround time before delivery scope is approved.
- Assessment data must not be available to public CHAP.

## Handoff

The marketing site records and routes the request. Human qualification determines whether a scoped workspace or engagement is created in the professional PSE product.
