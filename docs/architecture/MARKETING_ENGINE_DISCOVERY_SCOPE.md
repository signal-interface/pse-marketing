# Shared Marketing Engine Discovery Scope

Status: discovery baseline; architecture proposal, not extraction approval  
Reference date: 2026-08-18  
Incubation repository: `signal-interface/pse-marketing`  
Permanent shared-engine repository placement: **unresolved pending org-level census**

## Purpose

Establish the initial scope for a product-agnostic Signal Interface Marketing Engine before extracting code or creating another repository.

The engine is intended to mature as a **thin core** that orchestrates replaceable capabilities through stable contracts. Product-specific marketing repositories remain responsible for their own brand, claims, offers, audiences, channels, conversion rules, and activation boundaries through versioned Marketing Product Contracts.

## Governing architecture

**Core owns orchestration. Plugins own capabilities. Product contracts own scope.**

The shared core should remain intentionally small and own only:

- product-contract loading and validation;
- plugin registration and capability discovery;
- signal/event routing;
- workflow orchestration;
- policy/evidence gate invocation;
- lifecycle state transitions;
- local audit/event recording;
- health aggregation;
- measurement feedback routing.

The core must not hard-code provider behavior, brand logic, payroll-specific assumptions, ad-platform schemas, model-specific generation logic, or channel-specific publication rules.

## Plugin categories

Initial plugin interfaces should be limited to stable capability classes:

- `SignalSource`
- `Analyzer`
- `EvidenceProvider`
- `Generator`
- `Publisher`
- `MeasurementProvider`
- `ApprovalProvider`

Plugins must not directly depend on or invoke one another. Cross-capability interaction routes through the core/event layer.

## Marketing Product Contract

Each product contract should define, at minimum:

- product identity and version;
- audiences and segments;
- positioning and approved offers;
- objectives and conversion events;
- approved claims and evidence sources;
- prohibited or restricted claims;
- enabled/disabled plugins;
- channel permissions;
- approval requirements;
- autonomy boundaries;
- brand profile;
- privacy/retention requirements;
- handoff destinations;
- health-critical dependencies.

A product contract answers **what this product may market**. The shared engine determines **how approved capabilities are orchestrated**.

## Health and observability boundary

Marketing Engine delivery must not wait on Faraday or Shield maturity.

Build now:

- core health contract;
- plugin health contract;
- product-contract validation status;
- local append-only event/error log;
- small internal health view inside the current marketing runtime;
- optional external observability adapter that may initially be a no-op/local sink.

Minimum MVP health signals:

1. core alive;
2. product contract valid;
3. plugin loaded/configured;
4. plugin dependency reachable where applicable;
5. last workflow success/failure;
6. governance/security exception.

Deferred integration:

- Faraday operational telemetry sink;
- Shield governance/security event sink.

Faraday or Shield unavailability must never stop normal Marketing Engine operation. External telemetry forwarding degrades independently.

Do not create a separate monitoring dashboard for this workstream.

## Initial Signal Interface org census

### `pse-marketing`

Current role: mature marketing/commercial implementation and current incubation point for shared-engine discovery.

Observed capabilities include public acquisition, demo workflow, CHAP marketing surface, risk estimator, discovery/qualification lifecycle, scheduling, reporting, corpus retrieval, internal lead operations, GTM contracts, confirmation gates, and platform handoffs.

Preliminary classification:

- product surface: KEEP in PSE;
- PSE claims/evidence/positioning: PRODUCT CONTRACT / PSE GOVERNANCE;
- discovery/commercial lifecycle patterns: REVIEW FOR SHARED CONTRACTS;
- generic signal, attribution, health, plugin, orchestration patterns: CANDIDATE SHARED ENGINE;
- CHAP/product fulfillment: NOT SHARED MARKETING ENGINE.

### `facp-marketing`

Current role: FACP pre-launch waitlist and lead-capture surface.

Preliminary classification:

- brand/content: PRODUCT-SPECIFIC;
- waitlist acquisition: reusable capability candidate;
- email notification pattern: plugin/shared adapter candidate;
- soft in-memory rate limiting: local implementation, not shared-engine doctrine.

### `studio-marketing`

Current role: Studio early-access marketing/waitlist surface; product application remains outside this repo.

Preliminary classification:

- brand/content: PRODUCT-SPECIFIC;
- waitlist acquisition and notification: reusable capability candidate;
- marketing/product runtime separation: PRESERVE.

### `beacon-marketing`

Current role: Beacon pre-launch waitlist and lead-capture surface.

Preliminary classification:

- brand/content: PRODUCT-SPECIFIC;
- waitlist acquisition and notification: reusable capability candidate;
- current non-main bootstrap branch state: repository maturity item, not engine responsibility.

### `signal-executive-interface`

Current role: executive-facing Signal Interface application. Current README does not establish it as the shared marketing-engine authority.

Preliminary classification:

- PRODUCT/EXECUTIVE SURFACE;
- do not place shared Marketing Engine here by default without a separate repository-placement ruling.

### `capital-access`

Current role: governed PSE founding-backer/investor portal sandbox with founder administration, invitation, NDA, investor Q&A, and investment-workflow demonstration.

Preliminary classification:

- COMMERCIAL/INVESTOR PRODUCT SURFACE;
- not a Marketing Engine host;
- may later consume marketing attribution/handoff contracts, but its legal/investment workflow stays isolated.

### `signal-payroll-validation-pilot`

Current role: internal mock payroll validation pilot and video-production pipeline.

Preliminary classification:

- INTERNAL PRODUCT/DEMO SURFACE;
- video-production patterns may inform a future content-generation plugin;
- payroll validation logic is not Marketing Engine scope.

### `signal-pse-demo-deploy`

Current role: deployment-only wrapper for tagged PSE Demo releases; explicitly contains no application code.

Preliminary classification:

- DEPLOYMENT SURFACE;
- no Marketing Engine code or product contracts should be added here.

## Search Console / SEO placement

Google Search Console is an adapter, not a separate engine.

Target flow:

`GSC -> SignalSource plugin -> core routing -> intent/opportunity analysis -> product-contract/evidence gate -> content/campaign recommendation -> approved execution -> measurement feedback`

The same pattern should later support analytics, social, paid media, CRM, search trends, competitive signals, newsletters, and other providers without changing core architecture.

## Extraction decision gate

Do **not** create a new shared repository or move code until discovery answers:

1. Which existing PSE capabilities are genuinely product-agnostic?
2. Which repeated FACP/Studio/Beacon patterns deserve shared interfaces versus simple copy-level reuse?
3. What is the minimum viable Product Contract schema?
4. What lifecycle states/events are stable enough to standardize?
5. What must remain inside each product marketing repository?
6. Where should shared engine authority permanently live?
7. What is the smallest executable MVP that can run first with PSE without forcing migrations across every product repo?

## Recommended implementation sequence

### Phase 0 — discovery and contract freeze

- complete capability census;
- classify each capability as `CORE`, `PLUGIN`, `PRODUCT_CONTRACT`, `GOVERNANCE`, or `PRODUCT_SURFACE`;
- identify duplicate implementations and intentional isolation;
- draft Product Contract v0.1;
- draft plugin interface v0.1;
- draft health/event envelope v0.1;
- issue repository-placement ruling.

### Phase 1 — PSE-backed MVP

Use PSE as the first consuming product without making PSE the shared engine owner.

Implement only:

- contract loader/validator;
- plugin registry;
- local event router/log;
- health aggregator and internal status view;
- one signal adapter;
- one analyzer;
- one governed output path;
- measurement feedback event.

Google Search Console is a strong first signal-adapter candidate after the contract boundary is frozen.

### Phase 2 — second-product validation

Connect one lightweight product such as FACP, Studio, or Beacon using its own contract. Prove that no PSE-specific logic leaks into the shared core.

### Phase 3 — expansion

Add adapters/modules incrementally. Each new capability must enter through an existing stable interface or justify a reviewed interface addition. Do not grow the core simply because a new provider is added.

### Phase 4 — Faraday / Shield integration

When those platforms are mature, connect the existing optional observability adapter to Faraday and selected governance/security events to Shield. No Marketing Engine rewrite should be required.

## Non-goals

This workstream does not authorize:

- a new monitoring dashboard;
- autonomous paid-media publication;
- migration of authenticated product fulfillment into marketing;
- Faraday or Shield as hard runtime dependencies;
- cross-brand claim sharing;
- direct plugin-to-plugin coupling;
- creation of a shared-engine repository before repository-placement review;
- broad refactors of existing product marketing sites during discovery.

## Immediate next action

Continue read-only discovery inside each marketing repository, inventory concrete code-level capabilities and duplicated patterns, then produce the capability classification matrix and Product Contract v0.1 proposal before any extraction or shared-runtime build begins.
