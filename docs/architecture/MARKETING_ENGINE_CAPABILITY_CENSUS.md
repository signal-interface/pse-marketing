# Signal Interface Marketing Engine — Capability Census

Status: discovery / proposed
Date: 2026-08-18
Scope: signal-interface organization

## Ruling

The organization should converge on one product-agnostic Marketing Engine with a thin orchestration core. Product marketing repositories remain product surfaces and provide Marketing Product Contracts. Reusable capabilities attach through versioned plugin interfaces. This document is a discovery artifact and does not authorize code extraction.

## Classification model

Every marketing capability is classified as one of:

- CORE — lifecycle orchestration, registry, routing, contract loading, event envelope, health aggregation.
- PLUGIN — replaceable signal, analyzer, generator, publisher, measurement, evidence, or approval capability.
- PRODUCT CONTRACT — product-specific audience, positioning, offers, claims/evidence, channels, conversion events, autonomy and approval policy.
- GOVERNANCE — truth/evidence gates, approval constraints, prohibited claims, privacy/retention and execution boundaries.
- PRODUCT SURFACE — brand-specific website, forms, landing pages, demos, investor or product experience.

## Organization census

### pse-marketing

Current role: mature PSE marketing/commercial surface and incubation source for shared patterns.

Observed capabilities include public SEO/content, demo and discovery flows, CHAP marketing experience, lead handling, commercial lifecycle/discovery utilities, rate limiting, database support, GTM contracts, confirmation gates, product handoffs, and an existing internal leads route.

Classification:

- PRODUCT SURFACE: PSE pages, CHAP teaser/marketing experience, product tour, services, trust and discovery UI.
- PRODUCT CONTRACT candidates: PSE audience, offers, conversion paths, approved claim vocabulary, evidence references, channel policy, demo protection rules.
- GOVERNANCE candidates: claim truth status, evidence/demo references, confirmation gates, demo freeze constraints, product handoff boundaries.
- PLUGIN candidates: lead capture, email delivery, corpus/evidence retrieval where reusable, SEO/search signal ingestion, future GSC, analytics, content generation and publishers.
- CORE candidates: commercial event naming/versioning, lifecycle routing concepts, health/event aggregation patterns only. PSE-specific business logic must not move into core.

Important: pse-marketing is an incubation location, not the presumed permanent owner of the shared engine.

### facp-marketing

Current role: FACP pre-launch waitlist/lead-capture surface.

Observed repeated pattern: Next.js product surface, content module, waitlist form/API, honeypot, in-memory IP rate limiting, Resend notifications, SEO/content/funnel docs.

Classification:

- PRODUCT SURFACE: all FACP brand UI and copy.
- PRODUCT CONTRACT: FACP positioning, audience, pre-launch status, approved channels and waitlist conversion.
- PLUGIN candidate: common waitlist/lead capture and email delivery behavior.
- No evidence that this repo should own shared core orchestration.

### studio-marketing

Current role: Studio early-access marketing/waitlist surface.

Observed repeated pattern is materially similar to FACP: content-isolated landing site, waitlist form/API, honeypot, in-memory rate limit, Resend delivery and SEO/content planning.

Classification:

- PRODUCT SURFACE: Studio brand UI/copy.
- PRODUCT CONTRACT: Studio audience, positioning, early-access offer and conversion.
- PLUGIN candidate: common waitlist/lead capture and email delivery behavior.
- No evidence that this repo should own shared core orchestration.

### beacon-marketing

Current role: Beacon pre-launch marketing/waitlist surface.

Observed repeated pattern is materially similar to FACP and Studio: waitlist API/form, anti-bot check, rate limiting, Resend, content isolation, SEO/content/funnel docs.

Classification:

- PRODUCT SURFACE: Beacon brand UI/copy.
- PRODUCT CONTRACT: Beacon audience, positioning, pre-launch offer and conversion.
- PLUGIN candidate: common waitlist/lead capture and email delivery behavior.
- No evidence that this repo should own shared core orchestration.

### signal-executive-interface

Current role: executive interface, not a marketing engine host.

Classification: PRODUCT SURFACE / adjacent consumer only. Do not place the shared Marketing Engine here merely because the organization name matches.

### capital-access

Current role: PSE founding-backer/investor workflow with governed investor Q&A and founder administration.

Classification: PRODUCT SURFACE with its own governance domain. It may consume marketing-originated attribution or lead handoffs later, but it is not part of the marketing core.

### signal-payroll-validation-pilot

Current role: internal payroll AI validation pilot and video-production pipeline.

Classification: PRODUCT SURFACE / internal pilot. Video-production patterns may inform a future generator plugin, but this repo is not a shared marketing runtime.

### signal-pse-demo-deploy

Current role: deployment-only wrapper for tagged PSE releases.

Classification: deployment infrastructure only. Explicitly excluded from Marketing Engine ownership.

## Confirmed duplication / extraction candidates

The clearest immediate duplication is the pre-launch waitlist stack across FACP, Studio and Beacon:

1. waitlist form
2. waitlist API
3. honeypot behavior
4. in-memory rate limiting
5. Resend internal notification
6. Resend submitter acknowledgement
7. similar environment configuration

Do not extract this yet. First define the plugin interface and product contract so shared behavior does not force identical product policy.

Shared documentation concepts also repeat across product repos: SEO strategy, content strategy, funnel/site planning. These should increasingly become contract inputs and engine outputs rather than copied architecture documents.

## Proposed thin core boundary

The core should own only:

1. Product Contract loader and validator
2. plugin registry and capability discovery
3. lifecycle/event router
4. workflow orchestration
5. policy/evidence gate invocation
6. normalized event envelope
7. local health aggregation
8. optional external telemetry sink interface

The core must not own:

- brand copy or design
- product claims
- product-specific funnels
- Google/Meta/LinkedIn API details
- model-specific generation logic
- email-provider implementation
- SEO provider implementation
- CRM implementation
- Faraday or Shield runtime dependency

## Plugin classes

Initial interfaces:

- SignalSource
- Analyzer
- Generator
- Publisher
- MeasurementProvider
- EvidenceProvider
- ApprovalProvider
- LeadDestination
- TelemetrySink

Plugins do not directly call other plugins. Cross-capability interaction routes through the core/event layer.

## Health scope

MVP health is intentionally small:

- core alive
- Product Contract valid
- plugin loaded/configured
- plugin dependency reachable
- last workflow success/failure
- governance/security exception count

The initial consumer is a small local internal/admin view. Faraday and Shield are future optional TelemetrySink consumers and must not block Marketing Engine execution.

## GSC ruling

Google Search Console is a SignalSource plugin, not a separate engine. It emits normalized search-demand observations. Question-regex filtering is one transform; it must not become the intelligence boundary because valuable commercial queries are not always grammatical questions.

## Repository placement discovery

Current evidence supports a dedicated shared runtime boundary, but repository creation is not yet authorized.

Rejected permanent hosts:

- pse-marketing: too product-specific; useful incubation source only.
- facp-marketing / studio-marketing / beacon-marketing: product surfaces.
- signal-executive-interface: executive surface.
- capital-access: investor workflow.
- signal-payroll-validation-pilot: internal pilot.
- signal-pse-demo-deploy: deployment wrapper.

Candidate ruling for the next gate: create a dedicated shared repository under signal-interface only after Marketing Product Contract v0.1 and plugin interfaces are accepted. Working name for discussion: `marketing-engine`; final naming remains a founder/review decision.

## Extraction order

1. Ratify Product Contract v0.1.
2. Ratify plugin interfaces and normalized event envelope.
3. Ratify health contract.
4. Decide shared repository name/location.
5. Scaffold core with no external integrations.
6. Implement one product contract: PSE.
7. Implement one low-risk plugin path end-to-end.
8. Add GSC as first demand-signal plugin.
9. Port FACP/Studio/Beacon contracts without redesigning their sites.
10. Extract duplicated waitlist/email behavior only when the shared interface is proven.

## Non-goals

- no redesign of existing marketing sites
- no migration of all existing code
- no new dashboard
- no dependency on Faraday/Shield maturity
- no autonomous paid-ad publishing in initial MVP
- no plugin-to-plugin coupling
- no product-specific logic in core

## Discovery conclusion

The architecture is justified. The organization has enough repeated marketing behavior to warrant shared contracts and plugins, while PSE has enough advanced behavior to supply patterns for the first core. The safest next artifact is Marketing Product Contract v0.1, followed by plugin and health contracts. Code extraction should wait until those contracts are reviewable.