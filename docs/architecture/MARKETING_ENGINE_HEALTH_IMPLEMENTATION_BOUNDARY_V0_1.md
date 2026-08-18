# Marketing Engine Health Implementation Boundary v0.1

Status: proposed
Date: 2026-08-18

## Purpose

Translate the agreed health architecture into a minimal implementation boundary without creating another dashboard or coupling Marketing Engine delivery to Faraday or Shield maturity.

## Visual destination now

The first visual consumer is the existing PSE internal/admin surface:

- `/internal/leads` — existing operational surface
- `/internal/engine-health` — proposed temporary Marketing Engine health viewer

This route is a **temporary reference consumer**, not the owner of Marketing Engine health.

## Public-site exclusion

Internal health/admin routes must not be exposed through:

- public navigation
- public footer
- public sitemap
- public CTAs
- marketing content links
- search-engine indexing

The routes should carry `noindex`/equivalent controls where supported.

Hidden routing is not security. Authentication and authorization must succeed before admin UI or health data is rendered.

## Minimal health contract

The initial runtime exposes enough state to answer six questions:

1. Is the core alive?
2. Is the active Marketing Product Contract valid?
3. Which plugins are healthy, degraded, failed, disabled, or unconfigured?
4. Are required plugin dependencies reachable?
5. Did the last required workflow succeed or fail?
6. Are governance/security exceptions occurring?

## Proposed local endpoints

Implementation may use equivalent internal APIs, but the semantic boundary is:

- `GET /internal/api/engine-health`
- `GET /internal/api/engine-health/plugins`
- `GET /internal/api/engine-health/contracts`
- `GET /internal/api/engine-health/events?limit=N`

All endpoints require the same or stronger authorization as the admin UI.

## Viewer information architecture

The first viewer should remain deliberately simple:

### Summary

- engine status
- active product contract status/version
- last successful workflow
- failures in recent window
- policy/evidence blocks in recent window

### Plugins

For each plugin:

- plugin ID
- version
- capability class
- status
- last health check
- last success
- dependency status
- latest safe error code/message

### Contracts

- product ID
- contract version
- lifecycle state
- validation status
- enabled/disabled capability count
- validation issues

### Recent events

A short table/feed using the normalized Marketing Event Envelope.

No charts are required for MVP.

## Status semantics

Core and plugin states use:

- `healthy`
- `degraded`
- `failed`
- `disabled`
- `unconfigured`

Contract states use:

- `valid`
- `degraded`
- `invalid`

`disabled` and `unconfigured` capabilities must not be shown as outages.

## Isolation rule

Health infrastructure must never become a required dependency for the core workflow path.

If the visual viewer fails:

- Marketing Engine continues operating.
- local events remain available where storage is healthy.
- plugin execution is unaffected unless the plugin itself is unhealthy.

If a future Faraday or Shield telemetry sink fails:

- record/degrade the sink state locally.
- continue Marketing Engine execution.
- do not block unrelated workflows.

## Local-first telemetry

MVP behavior:

1. core emits normalized event
2. event is stored/appended locally
3. local health aggregator derives current state
4. `/internal/engine-health` reads from local state/events
5. optional telemetry sinks receive copies asynchronously/best-effort

## Future destination

When Faraday is mature, it becomes the central cross-product operational health view. PSE may then retain a lightweight product-specific health summary or redirect operators to Faraday according to later product decisions.

Shield later consumes governance/security-relevant telemetry. Shield is not the general Marketing Engine dashboard.

## Authentication boundary

The implementation workstream must verify the existing PSE internal/admin authentication mechanism before adding the new viewer. If the existing `/internal` route is not adequately access-controlled, secure the boundary as a prerequisite to exposing engine health there.

Do not expose health data publicly as an interim workaround.

## MVP non-goals

- no new admin application
- no Grafana-style monitoring project
- no historical SLA dashboard
- no dedicated Faraday integration
- no Shield dependency
- no autonomous remediation
- no deep cost/token analytics

## Implementation order

1. ratify plugin interfaces and Marketing Event Envelope
2. implement local health types/aggregator in shared core scaffold
3. implement local append-only/in-process or approved persistent event storage
4. implement protected internal health API
5. implement minimal `/internal/engine-health` viewer in PSE
6. prove failure isolation with disabled/unconfigured/failed plugins
7. add optional TelemetrySink interface only; no Faraday/Shield connector yet

## Acceptance criteria

- public users cannot discover or render the admin health UI through normal site navigation/indexing
- unauthorized direct requests cannot access health UI or API data
- health viewer failure does not stop Marketing Engine workflows
- optional plugin failures are isolated
- status distinguishes failed from disabled/unconfigured
- Faraday and Shield are not required for MVP operation
- the same health/event contracts can later be consumed outside PSE without redesign
