# PSE Internal Engine Health Viewer Plan

Status: proposed / implementation reference
Date: 2026-08-18
Temporary consumer: `signal-interface/pse-marketing`

## Decision

The first visual consumer of Marketing Engine health will be the existing PSE marketing internal/admin surface.

Proposed route:

`/internal/engine-health`

This is a temporary reference consumer. Its location does not imply that PSE owns the shared Marketing Engine or the health contract.

## Why this route

- `pse-marketing` already contains an `/internal` application area.
- It avoids creating a separate monitoring application.
- It lets the Marketing Engine mature independently of Faraday and Shield.
- The UI can later be retired or reduced after Faraday becomes the cross-product operations surface.

## Public-site boundary

The internal admin surface must not be visibly exposed on the public PSE marketing site.

Required controls:

- no public navigation link
- no footer link
- no public CTA
- exclude internal routes from sitemap generation
- `noindex, nofollow` metadata or equivalent for internal pages
- robots exclusion as defense in depth where appropriate
- direct URL access alone is not authorization
- authentication/authorization must protect admin content before rendering
- no admin data should be embedded in public page source or public client bundles when avoidable

Hidden is not considered secure. The route must be both non-discoverable by normal public navigation and access-controlled.

## Initial information architecture

```text
/internal
  /leads                  existing operational area
  /engine-health          new temporary health viewer
```

The Engine Health screen should remain compact:

```text
Marketing Engine          HEALTHY
Active Product Contract   PSE / VALID

Plugins
- Google Search Console   UNCONFIGURED
- Analytics               UNCONFIGURED
- Content Generator       DISABLED
- Publisher(s)            DISABLED

Workflow
- Last run                timestamp / none
- Last success            timestamp / none
- Failures 24h            count

Governance
- Policy blocks 24h       count
- Missing evidence 24h    count

External telemetry
- Faraday                 NOT CONNECTED
- Shield                  NOT CONNECTED
```

Do not add custom charts in the first implementation unless a concrete operational need appears.

## Access model

Implementation must reuse or establish one simple admin access pattern rather than introducing a second identity system solely for health.

Minimum behavior:

1. unauthenticated request does not render health data;
2. unauthorized authenticated request is denied;
3. internal endpoints enforce the same authorization boundary as the UI;
4. admin route is not linked from public UI;
5. access failures are auditable locally where practical.

Exact identity provider selection is an implementation decision and should not block the shared Marketing Engine contracts.

## Data ownership

The visual page does not own health state.

```text
Marketing Engine HealthContract
           |
           +--> PSE /internal/engine-health   NOW
           +--> Faraday operations            LATER
           +--> Shield governance telemetry   LATER
```

The PSE page consumes the health contract and may add PSE-specific display labels, but it must not change health semantics.

## Implementation phases

### Phase A — architecture and contracts

- ratify Marketing Product Contract v0.1
- ratify plugin interfaces
- ratify Health Contract v0.1
- ratify normalized event envelope

No admin UI implementation is required to complete this phase.

### Phase B — local Marketing Engine operability

- scaffold core runtime
- add product contract validation
- add plugin registry
- add local event summary
- expose internal health API
- implement `/internal/engine-health`
- protect route and API
- confirm public navigation, footer and sitemap do not expose internal paths

### Phase C — PSE first product contract

- load PSE contract
- display contract validation state
- display enabled/disabled/unconfigured plugin states
- connect first low-risk plugin workflow
- verify failure isolation

### Phase D — demand intelligence

- add Google Search Console SignalSource plugin
- surface plugin/dependency health
- preserve local operation if GSC is unavailable

### Phase E — future platform integration

Only after Faraday/Shield interfaces are mature:

- add Faraday TelemetrySink adapter
- add Shield governance/security TelemetrySink adapter
- keep both optional
- validate that disconnecting either does not disrupt Marketing Engine operation

## Explicit non-goals

- no new admin application
- no public Admin link
- no separate monitoring dashboard
- no requirement to wait for Faraday
- no requirement to wait for Shield
- no duplicate authentication product if an existing suitable admin pattern can be reused
- no broad observability platform build in the Marketing Engine MVP

## Migration/retirement condition

The PSE health viewer may be retired as the primary view when Faraday provides a mature cross-product operational surface that consumes the same Health Contract.

At that point PSE may retain a minimal product-local status view if useful, but Faraday becomes the central operational view. Shield remains focused on governance/security oversight.

## Implementation gate

Before publishing `/internal/engine-health` to production, verify:

- admin authentication and authorization
- no public route exposure
- sitemap exclusion
- search-engine exclusion
- no sensitive secrets/credentials in health payloads
- safe error redaction
- plugin failure isolation
- optional Faraday/Shield sink behavior
- production route tested directly with unauthorized and authorized access states
