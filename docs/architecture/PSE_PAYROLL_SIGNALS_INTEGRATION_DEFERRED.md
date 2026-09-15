# PSE Payroll Signals — Deferred Marketing Integration

**Decision ID:** DEC-PSE-PAYROLL-SIGNALS-01  
**Status:** BLOCKED / REFERENCE ONLY  
**Blocked by:** PSE repository transfer and upstream Payroll Regulatory Intelligence contract  
**Upstream:** `tomrivera-PSE/PSE--Projects` (current pre-transfer reference)  
**Future authority:** canonical PSE repository after transfer

## Purpose

Record the intended future integration between the PSE marketing experience and the PSE Payroll Regulatory Intelligence Pipeline without implementing an independent news feed or premature cross-repository dependency.

## Future Public Experience

The marketing site may expose:

- Payroll Ticker
- Payroll Signals page
- jurisdiction and category filters
- signal detail cards
- approved CHAP explanations such as "Why this matters"
- authoritative source references
- verification/status indicators

## Expected Integration

```text
PSE Payroll Regulatory Intelligence
              |
              v
      Approved Public Projection
              |
              v
       Marketing Consumer
              |
              v
   Payroll Ticker / Signals UI
```

The public surface is one output of the upstream governed signal pipeline. Marketing must not create a separate ingestion or regulatory-intelligence system.

## Marketing Ownership

Marketing may own:

- presentation and motion
- filtering and navigation
- SEO/public rendering
- accessibility
- signal-card interaction design
- display of approved public CHAP explanations

Marketing must not own:

- source ingestion
- regulatory determination
- evidence validation
- jurisdiction rules
- regulatory lifecycle
- CHAP internal reasoning
- PSE applicability logic
- canonical PSE regulatory knowledge

## CHAP Public Boundary

Marketing may display only CHAP output included in the approved public projection. Internal reasoning, customer-specific context, unpublished PSE rules, evidence work queues, and applicability analysis remain private.

## Build Blocker

Do **not** implement an independent RSS/news ticker as a substitute for the future PSE signal contract.

Implementation begins only after the PSE repository transfer is complete and the upstream public-projection contract is approved.

## Upstream Decision Reference

Current pre-transfer reference:

`tomrivera-PSE/PSE--Projects/docs/decisions/PAYROLL-REGULATORY-INTELLIGENCE-DEFERRED-SCOPE.md`

After repository transfer, this pointer must be updated to the canonical PSE location rather than duplicated or silently forked.

## Post-Transfer Integration Sequence

1. Participate in the cross-repo census.
2. Confirm the canonical PSE public projection contract.
3. Build the marketing adapter against that contract.
4. Build Payroll Ticker / Payroll Signals UI.
5. Add failure-safe behavior so absence of upstream signals never fabricates content.
6. Validate public CHAP copy against PSE claims/evidence governance before release.

## Reference Material

Initial design inspiration: PayrollOrg *Global Pay-Check* issue dated August 19, 2026. It is reference material for the range of payroll, regulatory, workforce, mobility, and labor-market signals only; it is not a required feed or source of truth.

## Decision

**Reference now. Build later.**

This repository is a downstream consumer of the future PSE Payroll Regulatory Intelligence Pipeline. No implementation code should land until the transfer and cross-repository contracts are complete.
