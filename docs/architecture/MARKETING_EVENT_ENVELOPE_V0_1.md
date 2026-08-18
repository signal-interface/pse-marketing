# Marketing Event Envelope v0.1

Status: proposed
Date: 2026-08-18

## Purpose

Define one normalized event shape for Marketing Engine workflows so products, plugins, health views, and future telemetry consumers do not invent incompatible event formats.

## Envelope

```ts
interface MarketingEventEnvelopeV01<TPayload = unknown> {
  eventVersion: "0.1"
  eventId: string
  eventType: string
  occurredAt: string
  productId: string
  workflowId?: string
  correlationId?: string
  actor: EventActor
  source: EventSource
  capability?: string
  pluginId?: string
  status?: "info" | "success" | "warning" | "error" | "blocked"
  governance?: GovernanceContext
  payload: TPayload
  provenance?: ProvenanceRef[]
}
```

## Required semantics

- `eventId` is unique and stable.
- `eventType` uses a version-stable dotted namespace.
- `occurredAt` is UTC ISO-8601.
- `productId` is always explicit; never inferred from the host application.
- `actor` identifies whether the action came from a human, core, plugin, system, or future governed agent.
- `source` identifies the producing runtime/component.
- `payload` contains event-specific data and must not duplicate secrets or credentials.

## Initial event namespaces

### Core lifecycle

- `core.started`
- `core.stopped`
- `workflow.started`
- `workflow.completed`
- `workflow.failed`
- `workflow.blocked`

### Contract

- `contract.loaded`
- `contract.valid`
- `contract.degraded`
- `contract.invalid`

### Plugin

- `plugin.registered`
- `plugin.enabled`
- `plugin.disabled`
- `plugin.unconfigured`
- `plugin.health.degraded`
- `plugin.health.failed`
- `plugin.execution.started`
- `plugin.execution.completed`
- `plugin.execution.failed`

### Signal/intelligence

- `signal.observed`
- `analysis.completed`
- `opportunity.identified`
- `opportunity.dismissed`

### Evidence/governance

- `evidence.resolved`
- `evidence.missing`
- `policy.allowed`
- `policy.denied`
- `approval.required`
- `approval.granted`
- `approval.denied`
- `approval.expired`

### Artifact/execution

- `artifact.drafted`
- `artifact.approved`
- `publication.started`
- `publication.completed`
- `publication.failed`

### Lead/conversion

- `conversion.observed`
- `lead.created`
- `lead.delivered`
- `lead.delivery.failed`

### Measurement

- `measurement.observed`
- `attribution.updated`

## Actor model

```ts
type EventActor =
  | { type: "human"; id: string }
  | { type: "core"; id: "marketing-core" }
  | { type: "plugin"; id: string }
  | { type: "system"; id: string }
  | { type: "agent"; id: string }
```

Actor identity is descriptive, not authorization. Authorization is evaluated separately by policy/approval controls.

## Governance context

May include:

- approval reference
- policy decision reference
- claim IDs
- evidence refs
- autonomy mode
- blocked reason code

Governance context should reference authoritative records rather than duplicate them.

## Privacy and payload rules

The event envelope is not a dumping ground for raw customer data. Product contracts and privacy policy define permitted payload classes. Cross-runtime events should prefer opaque identifiers and references.

Never include:

- API keys
- session tokens
- passwords
- provider secrets
- unrestricted raw customer datasets

## Local-first behavior

The Marketing Engine should be able to append/store normalized events locally without Faraday, Shield, Orbit, or Replay Ledger availability.

Future integrations consume the same envelope through `TelemetrySink` adapters.

## Faraday and Shield mapping

Later:

- Faraday consumes operational lifecycle, health, latency, workflow, and dependency events.
- Shield consumes policy, evidence, approval, credential/security, and governed-execution events.

Neither is required for the Marketing Engine to run now.

## Compatibility

Breaking field or semantic changes require a new event version. New event types may be added under v0.1 when they preserve the envelope contract.

## Acceptance criteria

- every workflow and plugin action can be correlated
- product identity is explicit
- events are usable locally before external observability exists
- optional telemetry sink failure cannot destroy the source event
- governance decisions can be traced without copying authoritative evidence into telemetry
