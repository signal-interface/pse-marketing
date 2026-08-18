# Marketing Product Repository Boundary v0.1

Status: proposed
Date: 2026-08-18
Related: `MARKETING_PRODUCT_CONTRACT_V0_1.md`, `MARKETING_ENGINE_PLUGIN_INTERFACES_V0_1.md`

## Purpose

Define the repository, organization, and deployment boundary between a product-owned marketing surface and the shared Marketing Engine.

The Marketing Engine is intentionally repository- and organization-agnostic. A product's GitHub organization, repository layout, application topology, hosting provider, or marketing-site location must not determine whether the product can use the engine.

The **Marketing Product Contract is the integration authority**. Repository location is metadata and provenance only.

## Governing rule

> A product may use the Marketing Engine when it exposes a valid Marketing Product Contract and the required permitted integration interfaces. The product does not need to move its marketing site, product application, or source repository into the Marketing Engine's organization.

The engine must not require product-specific source-code relocation as an onboarding condition.

## Supported topology classes

The initial contract must support at least these deployment/source layouts.

### 1. Standalone marketing repository

Example shape:

```text
signal-interface/pse-marketing
  ├── marketing surface
  ├── product contract
  └── product-owned governance references
```

The product application may live in another repository or organization.

### 2. Marketing application inside a product monorepo

Reference case:

```text
RVCG-Consulting/coach-insight
  ├── apps/marketing
  ├── apps/platform
  └── marketing product contract
```

The Marketing Engine treats `apps/marketing` as a product-owned surface and does not require extraction into a separate `*-marketing` repository.

### 3. Product repository with externally hosted marketing surface

A product may keep its authoritative contract in its product repository while the marketing surface is deployed from another approved runtime or CMS. The contract declares the surface and permitted endpoints; the engine does not infer ownership from hosting location.

### 4. Multiple approved marketing surfaces

A product may expose more than one marketing surface, for example a primary website plus campaign microsite. Each surface must have a stable surface ID and explicit allowed actions. A plugin cannot publish to a surface merely because it belongs to the same repository or organization.

## Required integration metadata

The Product Contract should represent repository/surface provenance explicitly rather than infer it.

Recommended structure:

```ts
interface ProductIntegrationBoundary {
  source: {
    organization?: string
    repository?: string
    contractPath?: string
    revision?: string
  }
  marketingSurfaces: Array<{
    surfaceId: string
    topology: "standalone-repo" | "monorepo-subapp" | "external-surface"
    sourcePath?: string
    canonicalUrl?: string
    publisherCapabilities?: string[]
  }>
  productSurfaces?: Array<{
    surfaceId: string
    sourcePath?: string
    canonicalUrl?: string
  }>
  handoffs?: Array<{
    handoffId: string
    destination: string
    contractRef: string
  }>
}
```

This metadata describes where approved surfaces live. It does not grant permission by itself. Channel policy, capability policy, approvals, evidence policy, and autonomy policy remain authoritative for execution.

## Source and runtime separation

The shared engine must distinguish:

- **source location** — where the product contract and source code live;
- **surface location** — where marketing experiences are implemented;
- **runtime destination** — where an authorized plugin action executes;
- **product destination** — where qualified users/leads are handed off.

These may all be different systems.

No engine behavior may assume they share a repository, domain, hosting provider, organization, or deployment pipeline.

## Cross-organization rule

Products from organizations other than `signal-interface` are first-class consumers when their contracts are trusted and registered.

Cross-organization onboarding must not require:

- moving source code into `signal-interface`;
- forking the marketing site into an engine-owned repository;
- sharing product credentials with unrelated products;
- adopting PSE-specific claims, funnels, governance, or brand conventions;
- granting the Marketing Engine blanket write access to the product repository.

Access must use least-privilege integration credentials or approved runtime endpoints for the specific capability being exercised.

## Contract discovery

The engine must not crawl arbitrary repositories looking for products.

A product is registered through an explicit contract-registration mechanism that supplies an authoritative contract reference and revision. Future implementations may support Git repository references, signed URLs, APIs, or a registry, but the engine must always know which contract revision governed an action.

## Publisher boundary

A Publisher plugin acts on a declared `surfaceId` or channel destination, not on a repository as a whole.

For example, a website-draft publisher may be authorized to create a draft for Coach Insight's `apps/marketing` surface while having no authority over `apps/platform`.

Repository write access is therefore not equivalent to marketing authorization.

## Health and observability

Health is recorded per product contract and capability, independent of repository topology.

Examples:

```text
coach-insight.contract       healthy
coach-insight.web-analytics healthy
coach-insight.gsc           unconfigured
coach-insight.publisher     disabled
```

A source repository outage or unavailable optional plugin may degrade the affected capability but must not make the Marketing Core itself unhealthy.

## Reference validation: Coach Insight

`RVCG-Consulting/coach-insight` is a reference topology because its marketing application lives at `apps/marketing` while the product application lives at `apps/platform` in the same repository.

This topology must be supportable through the same Marketing Product Contract model used by a standalone marketing repository such as PSE. The engine must not contain special-case Coach Insight logic.

This is a topology validation example only. It does not enroll Coach Insight into the Marketing Engine or authorize any mutation of the Coach Insight repository.

## Acceptance criteria

The boundary is acceptable when all are true:

1. A standalone marketing repository can register without core modification.
2. A monorepo marketing sub-application can register without extraction.
3. A product in another GitHub organization can register without moving source code.
4. The same engine interfaces work for PSE and Coach Insight despite different repository layouts.
5. Publisher authorization is scoped to an approved surface/action, not inferred from repository access.
6. Product contracts retain their own brand, claim, evidence, privacy, autonomy, and approval rules.
7. The engine can identify the exact contract revision that governed every action.
8. Repository topology can change without requiring a Marketing Core code change, provided the product updates its contract metadata.

## Non-goals

This contract does not define:

- GitHub installation architecture;
- repository write automation;
- CI/CD deployment details;
- product-specific hosting;
- source-code migration;
- automatic enrollment of existing repositories.

Those are adapter/deployment concerns and must not be embedded into the Marketing Core.