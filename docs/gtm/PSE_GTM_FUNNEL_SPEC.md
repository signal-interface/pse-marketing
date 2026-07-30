# PSE GTM Funnel Specification

Status: proposed binding parent specification

## Purpose

Convert relevant traffic into an accountable next step while keeping each visitor intent distinct and measurable.

## Product ladder

| Level | Promise | Fulfillment owner |
| --- | --- | --- |
| Free newsletter | Hear from CHAP through selected, approved intelligence | Marketing |
| Context Hub | Ask CHAP against approved PSE intelligence | Authenticated PSE product |
| PSE Individual | Work with CHAP in a practitioner workspace | Authenticated PSE product |
| Assessment | Diagnose organizational readiness and risk | PSE delivery plus scoped workspace |
| Team / Enterprise | Apply governed intelligence in shared organizational context | Authenticated PSE product |

## Protected journeys

### Sales evaluation

`Visitor → Request a Demo → demo request recorded → sales notified → personalized walkthrough`

Acceptance criteria:

- Hero, navigation, and closing conversion surfaces preserve `Request a Demo`.
- The form continues to post to `/api/demo-request`.
- Name and email remain required.
- Source attribution remains allowlisted.
- Database persistence occurs before success is returned.
- Notification failure remains observable.
- Confirmation copy remains specific to a sales walkthrough.

#### Shipped journey (Release 1A commercial foundation)

The shipped implementation routes this journey through a lifecycle state
machine (`src/lib/commercial/lifecycle.ts`). The video-first ladder is
the **default path, not the only one** (C9 ruling, 2026-07-30):

`NEW → VIDEO_SENT → VIDEO_ENGAGED → QUESTIONNAIRE_SENT → QUESTIONNAIRE_STARTED → QUESTIONNAIRE_COMPLETED → MEETING_SCHEDULED → DISCOVERY_COMPLETE → QUALIFIED`

- `/api/demo-request` hard-wires `NEW → VIDEO_SENT` on every inbound
  demo request; that default is unchanged.
- `NEW` additionally permits `QUESTIONNAIRE_SENT`, `MEETING_SCHEDULED`,
  `NURTURE`, and `DISQUALIFIED`, so warm referrals — the expected common
  case while access is invitation-only — may skip the video step and
  book or receive the questionnaire directly. This matches the journey
  definition above, which has never required a video step.
- The guard that matters is structural: `QUALIFIED` is reachable only
  through `DISCOVERY_COMPLETE`. `DISQUALIFIED` is the only terminal
  state; `QUALIFIED` may reopen to `NURTURE` or `DISQUALIFIED`.
- `lead_status` is not monotonic (`NURTURE` re-entry may skip
  intermediate states). Funnel reporting must build on the `lead_events`
  evidence trail, which is the authoritative stage history — never on
  current state alone.

### Independent exploration

`Visitor → Watch the PSE Product Tour → product truth labels → Request a Demo`

The tour must be reproducible from the frozen demo and must not simulate unavailable capabilities without labeling them.

### Practitioner intelligence

`Visitor → newsletter → approved CHAP teaser → Context Hub sales page → checkout handoff → authenticated PSE`

Marketing owns acquisition and checkout initiation. It does not grant entitlements.

### Organizational diagnosis

`Visitor → assessment page → qualification → human review → discovery → scoped assessment`

An assessment request is not a demo request and must use a distinct source, consent statement, notification subject, and lifecycle event.

## CTA hierarchy

| Placement | Primary | Secondary |
| --- | --- | --- |
| Homepage hero | Request a Demo | Watch the PSE Product Tour |
| Intelligence content | Join the Free Newsletter | Explore Context Hub |
| Organizational-risk content | Request an Assessment | Request a Demo |
| Product tour close | Request a Demo | Explore CHAP |
| Site footer | Request a Demo | Newsletter / Assessment / Context Hub |

## Canonical events

Events describe business facts, not vendor-specific analytics calls.

```text
demo.request_started
demo.request_submitted
tour.started
tour.completed
newsletter.subscribed
context_hub.viewed
context_hub.checkout_started
assessment.started
assessment.requested
professional_platform.handoff
pse_individual.upgrade_started
```

Anonymous web events and identified lead events remain separate. Once a lead is created, the lead evidence trail is authoritative.

## Success measures

- Visitor-to-demo request rate
- Demo-request response time and show rate
- Product-tour completion and tour-to-demo conversion
- Visitor-to-newsletter conversion
- Newsletter-to-Context-Hub conversion
- Assessment completion and qualification rate
- Context-Hub-to-Individual upgrade
- Percentage of leads with an owner and next action

## Non-goals

- Authenticated Context Hub
- Subscription entitlement assignment
- Employer payroll-data upload
- Organization-specific CHAP findings
- Autonomous payroll-system execution
