# PSE Product Demo — Script v1.0 (Stage A draft)

Target runtime: 5:30–6:20. Narration ≈ 880 words at ~150 wpm.
Voice: founder or founder-cloned AI voice. Executive tone, measured pace.
All statistics trace to `src/lib/stats.ts`. `[[DEMO_CONTRACT:...]]` tokens
resolve from `demo-contract.yaml`; automation replaces them and the contract
is validated by Playwright before any recording occurs.

---

## Chapter 1 — Why PSE exists (0:00–0:40)

**Screen:** Branded opening card → slow fade to a static composite of a
payroll dashboard (blurred, non-identifiable). Lower-third: "Payroll
Synergy Experts — Payroll Governance & Compliance Intelligence."

**Narration:**

> Every pay period, your payroll system produces thousands of decisions —
> calculations, deposits, classifications, filings. Almost all of them are
> right. The ones that aren't are expensive: in fiscal year 2024 alone, the
> Department of Labor recovered nearly one hundred fifty million dollars in
> back wages for more than a hundred and twenty-five thousand workers. And
> studies suggest roughly a third of employers make payroll errors in some
> form.
>
> The problem isn't your payroll system. The problem is that almost no one
> independently checks its output. Payroll Synergy Experts exists to close
> that gap.

---

## Chapter 2 — What PSE governs, and what it does not do (0:40–1:20)

**Screen:** Simple two-column diagram card: "Your System of Record —
executes" | "PSE — governs." Logos row of supported systems of record
(ADP, UKG, Dayforce, Workday, Paylocity) beneath the left column.

**Narration:**

> First, what PSE is not. PSE is not a payroll processor. It doesn't run
> your payroll, move your money, or replace your HCM. Your system of
> record executes.
>
> PSE governs. It sits above your payroll platform — whichever one you
> use — and independently validates what came out of it: verifying
> calculations, surfacing compliance risk, scoring severity, and
> maintaining audit-ready evidence of what was checked, what was found,
> and why. Governance, controls, and oversight. That's the entire job.

---

## Chapter 3 — Upload and intake (1:20–2:00)

**Screen:** Live demo. Upload of the approved fixture
`[[DEMO_CONTRACT:fixture.payroll_fixture]]`, analysis progress, completion
state. Callout on the intake confirmation.

**Narration:**

> Here's how a review starts. You export a payroll register from your
> system of record — the same file you already produce — and bring it into
> PSE. No integration project, no agent installed in your payroll system,
> no standing connection required to begin.
>
> PSE validates the register against rules grounded in statute and
> regulation — applied deterministically, the same way every time. Within
> moments, the analysis is complete and every check is on the record.

---

## Chapter 4 — Findings, severity, and the compliance score (2:00–3:30)

**Screen:** Command Center overview → Exceptions list → open one finding
`[[DEMO_CONTRACT:expected.designated_finding]]` (count: `[[DEMO_CONTRACT:expected.findings.minimum]]`). Zoom markers on severity badge and score panel.

**Narration:**

> This is the Command Center — the governed view of the pay period. At the
> top, the compliance score: a single, defensible number summarizing how
> this payroll run performed against the checks PSE applied. It isn't a
> feeling or a rating. Every point traces to specific findings.
>
> Below it, the exceptions. Each finding tells you four things: what was
> detected, which employees and pay elements are affected, how severe it
> is, and which rule or statute the check is grounded in.
>
> Let's open one. `[[DEMO_CONTRACT:expected.designated_finding]]` — walk detection,
> affected scope, severity rationale, statutory grounding on screen.
> Notice what you're not seeing: a black box. The detection logic is
> deterministic, the threshold is stated, and the source of authority is
> cited. Severity reflects real exposure — federal deposit penalties, for
> example, scale to as much as fifteen percent under Internal Revenue Code
> section sixty-six fifty-six.
>
> Your team doesn't have to hunt through the register hoping to notice a
> problem. The problems present themselves, ranked, with their evidence
> attached.

---

## Chapter 5 — CHAP: explanation and evidence (3:30–4:30)

**Screen:** CHAP AI panel. Ask the approved demo question
`[[DEMO_CONTRACT:expected.chap.approved_question]]`; show the
determination, citation, and reasoning trail.

**Narration:**

> When a finding needs interpretation, this is CHAP — PSE's compliance
> reasoning engine. Ask it about a finding, a rule, or a scenario, and it
> answers the way a compliance analyst should: with a determination, the
> reasoning behind it, and the authority it rests on.
>
> Two things matter here. CHAP's answers are grounded in a curated
> regulatory corpus — not the open internet. And CHAP advises; it doesn't
> act. Every determination is presented to a human, with its evidence,
> for a human decision. Governed AI means the reasoning is inspectable
> and the authority stays with your team.

---

## Chapter 6 — Executive visibility and the audit trail (4:30–5:20)

**Screen:** Executive summary / reporting view → evidence or replay view
`[[DEMO_CONTRACT:required_screens]]` (per contract; replay per `[[DEMO_CONTRACT:expected.replay.available]]`).

**Narration:**

> Everything you've seen becomes part of the record. For leadership, that
> means a defensible answer to a simple question: how do we know payroll
> is right? Not "the system ran," but "the output was independently
> validated, here's the score, here are the exceptions, here's what we did
> about them."
>
> For audit, it means evidence. Every check that ran, every finding, every
> determination — preserved, versioned, and reproducible. When an auditor,
> a regulator, or your own board asks how payroll is governed, you show
> them, rather than tell them.

---

## Chapter 7 — What happens in the discovery process (5:20–6:00)

**Screen:** Calm card sequence: "Governance Discovery" → three steps —
questionnaire, discovery session, tailored governance review.

**Narration:**

> If this resonates, the next step is deliberately simple. You complete a
> short governance discovery questionnaire — about five minutes on your
> payroll environment, systems, and priorities. No payroll data, no
> employee information. It exists so that when we meet, the session is
> about your operation, not a generic pitch. From there, we walk through
> what a governed payroll review would look like for your organization.

---

## Chapter 8 — Call to action (6:00–6:20)

**Screen:** CTA card: "Continue to Governance Discovery" + version
watermark `demo-v1.0-frozen` in the corner.

**Narration:**

> Your payroll system executes. The question is who governs. Continue to
> the governance discovery questionnaire — the link is right below this
> video — and let's find out what your payroll isn't telling you.

---

## Approval checklist (complete in approval.md before publishing)

- [ ] Demo Contract validated against `demo-v1.0-frozen` (all TBDs resolved)
- [ ] All `[[DEMO_CONTRACT]]` tokens replaced with contract values
- [ ] Boundary lint passed (no execution-verb claims about PSE)
- [ ] Every statistic matches `src/lib/stats.ts` values and sources
- [ ] No unverified savings, benchmark, or findings claims
- [ ] CHAP shown as advisory, human-approved — never autonomous
- [ ] CTA link is the tracked signed redirect
- [ ] Version watermark present
