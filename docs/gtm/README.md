# PSE Commercial Foundation

Status: proposed for senior developer and product-owner review  
Scope: `signal-interface/pse-marketing`  
Precedence: `docs/DEMO_FREEZE_GTM_STRATEGY.md` governs activation and demo-freeze gates.

This directory defines how the PSE marketing site acquires, educates, qualifies, and hands off prospective customers without taking ownership of authenticated product fulfillment.

## Binding principles

1. **The sales demo is protected.** `Request a Demo` remains a first-class, personalized sales path.
2. **The system of record — not PSE — processes payroll.** Copy must describe governance, intelligence, validation, evidence, assessment, and advisory.
3. **Product truth precedes publication.** Current, pilot, planned, and illustrative capabilities must be distinguishable.
4. **One identity, progressive entitlements.** Context Hub and CHAP fulfillment belong to the authenticated PSE product.
5. **No high-impact intelligence is published from an unapproved draft.**
6. **No marketing change may make the live demo less stable or less discoverable.**

## Document map

| Document | Authority |
| --- | --- |
| `PSE_COMMERCIAL_ARCHITECTURE_AUDIT.md` | Current-state gaps and adoption decisions |
| `PSE_GTM_FUNNEL_SPEC.md` | Journeys, CTAs, events, and acceptance criteria |
| `PSE_INFORMATION_ARCHITECTURE.md` | Held on branch `docs/gtm-held` pending authorization of its workstream (public site map and page ownership) |
| `CHAP_COMMERCIAL_PROGRESSION.md` | Held on branch `docs/gtm-held` pending authorization of its workstream (tier-aware CHAP promise and boundaries) |
| `NEWSLETTER_CONTENT_SYSTEM.md` | Held on branch `docs/gtm-held` pending authorization of its workstream (approved-intelligence-to-newsletter workflow) |
| `ASSESSMENT_CONVERSION_SPEC.md` | Held on branch `docs/gtm-held` pending authorization of its workstream (organizational assessment acquisition path) |
| `MARKETING_PLATFORM_HANDOFFS.md` | Cross-runtime contracts and ownership |
| `CONFIRMATION_GATES.md` | Decisions and external dependencies requiring approval |
| `SENIOR_DEV_REVIEW_HANDOFF.md` | Review order, risk register, and implementation slices |

## Implementation rule

No implementation slice may combine:

- a protected demo-flow mutation;
- a new external service or credential;
- and a new cross-repository contract.

Those changes must be reviewed independently so the active sales demo always has a known rollback boundary.
