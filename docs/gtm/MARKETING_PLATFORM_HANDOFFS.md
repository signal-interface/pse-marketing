# Marketing Platform Handoffs

Status: proposed contract  
Receiving repository: `tomrivera-PSE/PSE--Projects`

## Ownership boundary

| Marketing site owns | Professional PSE owns |
| --- | --- |
| Public education and SEO | Authentication |
| Newsletter acquisition | Entitlements |
| CHAP teasers | Tier-aware CHAP |
| Demo request | Member conversations |
| Assessment request | Assessment workspace |
| Checkout initiation | Billing reconciliation and access |
| Campaign attribution | Organization context and governed workflows |

## Required contracts

### Context Hub checkout handoff

Minimum fields:

```json
{
  "handoff_version": "1.0",
  "intent": "context_hub_subscription",
  "source": "pse-marketing",
  "return_url": "approved marketing URL",
  "campaign": "optional approved attribution",
  "nonce": "server-generated single-use value"
}
```

The professional product must validate the intent and return URL. The marketing site must not assign `context_hub_member`.

### Assessment handoff

The marketing site sends an opaque assessment-request identifier after human qualification. Sensitive intake data should not travel in query parameters.

### Login

The marketing navigation may link to the professional application only after the canonical URL and environment behavior are confirmed.

### Audit compatibility

Marketing events should use stable names and versions. PSE can emit local append-only events now and synchronize later, but the marketing runtime must not depend on Shield, Replay Ledger, or Orbit for basic acquisition.

## Does `PSE--Projects` need contracts?

Yes. `tomrivera-PSE/PSE--Projects` is the core PSE development repository and
owns CHAP, Context Hub, backend APIs, compliance rules, and product
integrations. It is therefore the authoritative receiving repository for
Context Hub, CHAP, assessment, login, and subscription handoff contracts.

It does **not** need the marketing page specifications. It needs only:

- entitlement vocabulary and capability matrix;
- signed handoff/request validation;
- canonical login and return URLs;
- audit-event envelope;
- error and retry behavior;
- privacy, consent, and retention ownership;
- versioning and backward-compatibility rules.

Recommended receiving locations, subject to senior-developer review:

```text
PSE--Projects/
├── docs/contracts/marketing-handoff/
│   ├── README.md
│   ├── context-hub-checkout.v1.md
│   ├── assessment-intake.v1.md
│   └── login-return.v1.md
├── governance/entitlements/
│   └── chap-capability-matrix.v1.md
├── replay-ledger/schemas/
│   └── marketing-handoff-event.v1.schema.json
└── connectors/pse-marketing/
    └── README.md
```

These are receiving contracts, not copies of the marketing page
specifications.

## Current repository constraints

The `PSE--Projects` README describes a POC architecture and marks JWT
authentication, audit trails, and several production controls as planned. Its
`AGENTS.md` requires governance-first changes, human approval for
compliance-impacting actions, source citation, and Replay Ledger support.

Therefore:

- the marketing site may describe the subscription ladder;
- it must not claim production entitlement enforcement until implemented;
- it must not send paid traffic into a POC login;
- it must not expose POC API keys or demo credentials;
- contract implementation must include Replay Ledger events and human-review
  boundaries;
- production auth, secret management, TLS, and audit controls are prerequisites
  for authenticated fulfillment.
