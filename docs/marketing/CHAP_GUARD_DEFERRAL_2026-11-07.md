# PSE Marketing — CHAP Guard deferral and synthetic-only demo copy

Decision date: 2026-11-07
Owner: PSE Marketing (Signal Interface code repository)
Status: Founder-approved public marketing removal; CHAP Guard **deferred, not discontinued**.

## Founder decision

CHAP Guard is not a functional, shipped Chrome extension and its product scope requires clarification. Until separately approved, no PSE Marketing page may promote it as accessible, integrated with UKG/ADP/Dayforce, available for a walkthrough, or open for access requests. Do not start extension development or promise integrations as part of this cleanup.

The CHAP AI page formerly ended with a request to **bring the visitor's last payroll file**. This is removed. The demo invitation now explicitly offers a 30-minute guided demonstration using **fixed synthetic payroll data**, requiring **no customer payroll files**. The existing Request a Demo link remains.

## Public surfaces changed

- `/chap-ai`: Remove CHAP Guard section including its Chrome extension, vendor-integration claims, badges and Request Access CTA; replace closing demo copy.
- Homepage CHAP section: Remove the separate Chrome-extension promotional banner. Preserve illustrative sample labeling, current CHAP naming and existing /chap-ai link.
- Trust claims registry: Preserve `chap-guard-extension` as a planned/deferred *historical* governance entry with **no active public surfaces**. Do not delete the claim or represent it as shipped.
- Release tests: Lock public-surface exclusion, nonproduction payroll-data restriction and current canonical naming.

## Boundaries

**Not authorized:** change to CHAP /api/chap/ask, widget entitlements, /api/lead-capture, email provider, subscriber consent, tracking, database, synthetic Sales Demo dataset, PSE Professional, Context Hub, infrastructure or webhook. Those are separate reviewed programs. No unrelated public claims are deemed approved by this cleanup.

## Acceptance

1. Existing production CI passes and diff is limited to public presentation, claim status/surfaces, tests and documentation.
2. `/chap-ai` final demo section uses approved fixed synthetic-data wording; no live Guard section or Request Access CTA.
3. Homepage CHAP promotional Guard banner is absent; CHAP documentation and sample labels remain.
4. The Guard claim is still discoverable for internal scope review with public `surfaces: []`.
5. Mobile viewport review confirms there is no blank vertical section or broken CTA; existing booking link continues to use `/#demo`.
6. Record PR/commit, CI and eventual production receipt in existing PSE Marketing canonical index; Signal Interface owns shared marketing infrastructure, not the underlying Guard scope.

## Deferred Guard definition gates

Future reactivation requires an explicit founder scope decision defining extension vs platform connector, product owner, supported systems and contractual authority, data access/safety posture, release/evidence criteria and truthful public copy. CHAP Guard must not be automatically promoted by a planned claim.
