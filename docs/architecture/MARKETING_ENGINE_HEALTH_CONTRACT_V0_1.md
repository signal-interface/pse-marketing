# Marketing Engine Health Contract v0.1

Status: proposed / discovery
Date: 2026-08-18

## Purpose

Define a small, product-agnostic health contract for the shared Marketing Engine and its plugins without creating a new monitoring application or coupling engine availability to Faraday or Shield.

## Operating principle

Marketing owns immediate operability. Faraday and Shield become optional downstream observers later.

The Marketing Engine must continue operating when Faraday, Shield, or any optional telemetry sink is unavailable.

## Health states

Allowed states:

- healthy
- degraded
- failed
- disabled
- unconfigured

`disabled` and `unconfigured` are valid operating states and are not incidents by themselves.

## Core health envelope

```ts
interface MarketingEngineHealthV01 {
  schemaVersion: "0.1"
  engineId: string
  engineVersion: string
  status: "healthy" | "degraded" | "failed"
  checkedAt: string
  contractStatus: ContractHealth
  plugins: PluginHealth[]
  workflow: WorkflowHealth
  governance: GovernanceHealth
}

interface PluginHealth {
  pluginId: string
  pluginVersion?: string
  capability: string
  status: "healthy" | "degraded" | "failed" | "disabled" | "unconfigured"
  lastCheckAt: string
  lastSuccessAt?: string
  latencyMs?: number
  errorCode?: string
  dependencySummary?: string
}
```

## MVP checks

The initial implementation is intentionally limited to:

1. core process/runtime alive
2. active Marketing Product Contract valid
3. plugin loaded/configured
4. required plugin dependency reachable
5. last workflow success/failure
6. governance/security exception count

Do not add deep cost analytics, campaign BI, model-token analytics, SLA history, or custom observability charts to the MVP.

## Failure isolation

Health failures must be scoped.

Examples:

- GSC unavailable -> search-demand ingestion degraded; unrelated workflows continue.
- LinkedIn plugin disabled -> valid state; no incident.
- required evidence provider unavailable -> affected governed publication fails closed; engine health may be degraded.
- optional telemetry sink unavailable -> telemetry forwarding degraded; Marketing Engine execution continues.
- invalid Product Contract -> execution for that product fails closed while the health endpoint remains reachable.

## Local endpoints

Proposed internal runtime endpoints:

- `/api/internal/engine-health`
- `/api/internal/engine-health/plugins`
- `/api/internal/engine-health/events`

Names are proposed and may be adjusted during implementation. They are internal operational endpoints and must not be added to public navigation or sitemap generation.

## Local event summary

Health may consume a small append-only event stream using normalized names such as:

- `engine.started`
- `engine.workflow.succeeded`
- `engine.workflow.failed`
- `contract.validated`
- `contract.invalid`
- `plugin.registered`
- `plugin.health.degraded`
- `plugin.health.failed`
- `policy.denied`
- `approval.required`
- `evidence.missing`
- `telemetry.forward.failed`

This is not a replacement for a future platform-wide event or replay ledger.

## Telemetry sink interface

The core should expose an optional sink interface rather than hard-code Faraday or Shield:

```ts
interface TelemetrySink {
  sinkId: string
  publish(event: MarketingTelemetryEvent): Promise<void>
  health(): Promise<PluginHealth>
}
```

Initial implementation may use a local/no-op sink. Future adapters may target Faraday and Shield without changing Marketing Engine workflow logic.

## Future consumer split

### Faraday — later

Operational consumer for engine/component health, uptime, dependency availability, workflow failures, latency and version state.

### Shield — later

Governance/security consumer for policy denies, approval bypass attempts, missing evidence, credential/security failures and prohibited execution.

Shield is not the general Marketing Engine operations dashboard.

## Acceptance criteria

- Health remains reachable when an optional plugin fails.
- Disabled/unconfigured plugins display distinctly from failed plugins.
- Invalid product scope blocks affected execution without hiding the cause.
- Faraday and Shield are optional sinks, not runtime prerequisites.
- Product-specific business metrics do not enter the core health contract.
- The contract can be consumed by a temporary PSE admin viewer and later by a Faraday operations surface without semantic changes.
