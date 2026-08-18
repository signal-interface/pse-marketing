# Marketing Engine Plugin Interfaces v0.1

Status: proposed
Date: 2026-08-18

## Purpose

Define stable, product-agnostic interfaces for capabilities that plug into the Marketing Engine without bloating the core.

The core owns orchestration, routing, contract loading, policy/evidence gate invocation, normalized events, and health aggregation. Plugins own implementation details.

## Mandatory plugin metadata

Every plugin declares:

- `pluginId`
- `pluginVersion`
- `interfaceVersion`
- `capabilityClass`
- supported Marketing Product Contract versions
- required configuration keys
- optional dependencies
- health check
- declared actions/events

Plugins must be loadable, disableable, and replaceable without modifying product contracts beyond plugin references.

## Capability classes

### SignalSource

Purpose: ingest external or internal market observations.

Examples: Google Search Console, web analytics, CRM lead events, Google Trends, social listening.

Required operations:

- `pull(context)` or `receive(event)`
- normalize observations
- return source watermark/cursor when applicable
- health check

SignalSource plugins emit observations only. They do not decide campaign actions.

### Analyzer

Purpose: classify or score normalized observations and workflow state.

Examples: intent classifier, opportunity scorer, audience matcher, trend detector.

Required operations:

- `analyze(input, productContract)`
- return structured findings with confidence and provenance
- health check

Analyzers may recommend; they may not publish or mutate external systems.

### Generator

Purpose: create draft marketing artifacts.

Examples: content draft, ad creative draft, video brief, landing-page copy draft.

Required operations:

- `generate(brief, productContract, evidenceContext)`
- return draft artifact plus evidence/claim references used
- health check

Generators must not convert planned or illustrative claims into current claims.

### Publisher

Purpose: execute a previously authorized publication or external platform action.

Examples: website draft publisher, LinkedIn publisher, Meta Ads publisher, newsletter sender.

Required operations:

- `validate(action, productContract)`
- `execute(approvedAction)`
- return external action ID/result
- health check

Publisher plugins must fail closed when required approval or channel authorization is absent.

### MeasurementProvider

Purpose: collect post-execution outcomes.

Examples: search performance, ad performance, campaign attribution, site conversion metrics.

Required operations:

- `measure(subject, window)`
- return normalized measurements and source provenance
- health check

### EvidenceProvider

Purpose: resolve product-owned evidence needed to support claims or actions.

Examples: claims registry adapter, demoRef/evidenceRef resolver, approved corpus adapter.

Required operations:

- `resolve(evidenceRequest, productContract)`
- return evidence status and references
- health check

EvidenceProvider does not create new authoritative product truth.

### ApprovalProvider

Purpose: resolve human or governed approval state.

Required operations:

- `requestApproval(action)` when supported
- `getApprovalStatus(approvalId)`
- `verifyApproval(action, approvalRef)`
- health check

Missing required approval fails the affected action only.

### LeadDestination

Purpose: deliver qualified leads or conversion handoffs to a product-owned destination.

Examples: email notification, CRM handoff, waitlist destination, demo-request receiver.

Required operations:

- `deliver(leadEnvelope, productContract)`
- return receipt/destination ID
- health check

### TelemetrySink

Purpose: consume normalized operational/governance telemetry.

Examples: local append-only log, future Faraday observability sink, future Shield governance/security sink.

Required operations:

- `emit(event)`
- health check

Telemetry sinks are optional by default. Their failure must not stop Marketing Engine operation unless a product contract explicitly marks a sink as mandatory for a specific action.

## Dependency rule

**Plugins must not directly call other plugins.**

All cross-capability coordination routes through the Marketing Core and normalized event/workflow context. This prevents hidden dependency graphs and preserves replaceability.

## Failure semantics

Plugin runtime state is one of:

- `healthy`
- `degraded`
- `failed`
- `disabled`
- `unconfigured`

`disabled` and `unconfigured` are normal states, not incidents.

A plugin failure should degrade or block only workflows requiring that capability. The core must remain operational and health-visible.

## Configuration boundary

Plugin implementation details remain outside Marketing Product Contracts. Product contracts reference capabilities/plugin IDs and policy; credentials and provider-specific configuration remain deployment/runtime concerns.

## Versioning

Breaking interface changes require a new interface version. The core may support multiple interface versions during migration. A plugin must advertise compatibility explicitly.

## Initial MVP plugin set

The first shared runtime should prove a small path:

1. local `TelemetrySink`
2. PSE `EvidenceProvider`
3. one `SignalSource`
4. one `Analyzer`
5. one draft-only `Generator` or existing `LeadDestination`

Google Search Console is the preferred first external demand-signal `SignalSource` after the local runtime is stable.

## Acceptance criteria

- a plugin can be enabled/disabled without core edits
- a plugin can fail without taking down unrelated workflows
- a product can prohibit an installed plugin through its contract
- plugins cannot bypass policy/evidence/approval routing
- provider-specific credentials do not enter the product contract
- Faraday and Shield are optional telemetry consumers, not runtime prerequisites
