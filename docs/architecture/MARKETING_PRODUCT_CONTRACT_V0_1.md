# Marketing Product Contract v0.1

Status: proposed / discovery
Date: 2026-08-18

## Purpose

A Marketing Product Contract defines what the shared Marketing Engine may know and do for one product without embedding product-specific logic in the core.

The engine determines how marketing workflows are orchestrated. The contract determines what may be marketed, to whom, with which evidence, through which capabilities, and under which approval boundaries.

## Required top-level fields

```ts
interface MarketingProductContractV01 {
  contractVersion: "0.1"
  product: ProductIdentity
  lifecycle: LifecycleState
  audiences: AudienceDefinition[]
  positioning: PositioningPolicy
  offers: OfferDefinition[]
  claims: ClaimPolicy
  evidence: EvidencePolicy
  channels: ChannelPolicy[]
  conversions: ConversionDefinition[]
  capabilities: CapabilityPolicy
  autonomy: AutonomyPolicy
  approvals: ApprovalPolicy
  privacy: PrivacyPolicy
  brand: BrandReference
}
```

## Product identity

Must provide a stable product ID, display name and owning product repository/surface. Product identity is not inferred by the engine.

## Lifecycle

Allowed initial states:

- concept
- prelaunch
- pilot
- available
- paused
- retired

Lifecycle state constrains permitted calls to action and claim language. A prelaunch product cannot be silently marketed as generally available.

## Audiences

Each audience entry declares a stable audience ID, description, allowed problems/use cases and optional exclusions. The engine may classify signals against these definitions but must not create new authoritative audiences without contract revision or an approved proposal workflow.

## Positioning

Declares approved positioning hierarchy, terminology and prohibited framing. Product-specific positioning remains outside the core.

## Offers

Declares offers such as demo, assessment, waitlist, newsletter, consultation or purchase initiation. Each offer specifies availability, target audience, destination and approval requirements.

## Claims

Claims are references to a product-owned claims registry or explicit contract entries. Each claim must have a stable ID and status. Recommended statuses:

- current
- pilot
- planned
- illustrative

The engine must not promote planned or illustrative claims as current capability.

## Evidence

Defines evidence providers and required evidence strength. Where the product uses evidenceRef/demoRef, those references remain authoritative. Missing required evidence causes a governed block, not content invention.

## Channels

Each channel declares:

- channel ID
- enabled/disabled state
- allowed content/actions
- publisher plugin ID if configured
- approval requirement
- budget/autonomy limits where relevant

A disabled or unconfigured channel is not an error.

## Conversions

Defines stable conversion events such as:

- demo_requested
- assessment_requested
- waitlist_joined
- newsletter_subscribed
- qualified_lead_created
- checkout_initiated

Product surfaces own the user experience; the engine owns normalized orchestration/event semantics.

## Capabilities

Declares enabled plugin capabilities, not implementation details.

Example:

```yaml
capabilities:
  signals:
    - web-analytics
    - google-search-console
  analyzers:
    - intent-classifier
    - opportunity-scorer
  generators:
    - content-draft
  publishers:
    - website-draft
  measurements:
    - search-performance
```

A product contract may disable a capability even when the plugin is installed globally.

## Autonomy

Initial modes:

- observe — ingest/analyze only
- recommend — produce proposals; no execution
- draft — create unpublished artifacts
- execute-approved — execute only an explicitly approved action
- bounded-auto — future; execute within explicit contract limits

The MVP defaults to recommend or draft. Paid-media publishing should not default to bounded-auto.

## Approvals

Defines which action classes require human approval and which approval provider is authoritative. Absence of a required approval provider fails closed for that action; it does not stop unrelated engine workflows.

## Privacy

Declares allowed data classes, retention references, consent requirements and prohibited fields. Product contracts should prefer opaque identifiers for cross-runtime handoffs.

## Brand

References the product-owned brand system. The shared engine does not own logos, page design, typography or final product copy authority.

## Validation behavior

A contract is either valid, degraded, or invalid.

- valid: all required fields and referenced mandatory policies resolve.
- degraded: optional capability/plugin is unavailable; safe workflows may continue.
- invalid: required governance, identity or evidence boundary cannot be resolved; execution fails closed while health remains available.

## Versioning

Breaking semantic changes require a new contract version. Plugins declare supported contract versions/capabilities. Product repos may adopt newer versions independently within compatibility policy.

## PSE first implementation

PSE should be the first contract because it has the richest existing marketing governance and commercial flows. This does not make PSE the owner of the engine.

PSE v0.1 should reference, not duplicate:

- existing claims/truth registry
- demo/evidence references
- GTM confirmation gates
- demo-freeze constraints
- marketing-to-product handoff contracts
- existing conversion event vocabulary

## FACP / Studio / Beacon

Initial contracts should remain intentionally small and reflect their current prelaunch/waitlist status. The shared engine must not cause these products to inherit PSE claims, funnels or governance rules.

## Acceptance gate

This contract is ready for implementation when reviewers can answer yes to all of the following:

1. Can a new product join without modifying core code?
2. Can a product disable a globally installed plugin?
3. Can missing evidence block one action without taking down the engine?
4. Can product lifecycle prevent misleading availability claims?
5. Can the engine operate when Faraday and Shield are absent?
6. Can health report disabled/unconfigured capabilities without treating them as incidents?
7. Can product-specific brand and claim truth remain owned by the product?

Until this gate passes, do not extract shared runtime code.