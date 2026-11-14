# PSE Marketing-Only Intelligence and Chat Boundary — 2026-11-14

**Decision:** Keep `signal-interface/pse-marketing` independently useful as a public marketing and educational website. This document controls this site's scoped work; it does not authorize or modify PSE Core, Professional, operational CHAP, Context Hub or Replay Ledger.

## Current marketing interfaces
- `src/lib/payroll-intelligence.ts`: public 15-domain editorial index.
- `src/lib/siteGuide.ts`: deterministic first-party Website Guide with public site links and domain navigation. No model calls, network fetch or customer payroll data.
- `src/app/chap-ai/page.tsx` and `src/components/sections/ChapaInterface.tsx`: two modes, Website Guide and IRC §6656 Compliance Education.
- `src/app/api/chap/ask/route.ts`: bounded educational, citation-validated CHAP Marketing response using the existing local corpus and server allowance. No operational connection.
- `src/app/payroll-intelligence/**`: PSE Marketing's public educational pages, not a production payroll rule registry.

## Allowed Marketing scope
1. Publish and improve founder-authorized public pages, sources, educational briefings, accessibility, search/navigation and conversion funnel.
2. Improve Website Guide answers only from explicitly curated, published first-party site content, including domain navigation and approved article references.
3. Keep the existing bounded IRC §6656 Compliance Education channel independent of the Website Guide.
4. Preserve marketing copy focused on PSE's end-state platform vision while preventing misleading statements that unshipped features are already operational.
5. Preserve rate limits, email gate, session persistence, and privacy boundaries.

## Prohibited / deferred
- No runtime linkage from Marketing to PSE Core, Professional, Context Hub, operational CHAP, Replay Ledger, admin tenant APIs, employer payroll records, or new regulatory data service.
- Do not promote source links, editorial drafts, or AI text to canonical SourceDocument or PayrollRule.
- No operational jurisdictional determinations, automated rule changes, payroll execution, or access to customer-specific data.
- No new shared database or subscription/entitlement system under this Marketing-only change.

## Deferred future contract
PSE Context Hub source authority, review lifecycle and public projection contracts remain documented in PSE program records, including DEC-PSE-PAYROLL-SIGNALS-01 and PSE Intelligence Pre-Scaffold Contract v1.0. Their implementation belongs to the existing gated build sequence: Sales Demo and Admin maturity -> founder-authorized Core scaffold -> governed source/control/CHAP integration. Nothing here advances those gates.

## Release and tests
Changes to Website Guide must prove: only relative first-party links, no unapproved briefings or legal determinations, no Core/Professional calls, no new network API, existing gate unaffected, keyboard/mobile behavior preserved, and no regression in PSE Marketing CI. Editorial and deployment approval remain separate.