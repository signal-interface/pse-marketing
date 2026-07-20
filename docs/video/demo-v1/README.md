# PSE Demo Video Package — demo-v1

Stage A artifacts for the production demo video. **No final recording exists
or should exist until `demo-v1.0-frozen` is tagged in PSE--Projects.**

## Ownership boundary

| Artifact | Repo | Why |
| --- | --- | --- |
| Script, storyboard, narration, CTA, manifest template | `pse-marketing` (this package) | Marketing content, governed by the PSE voice discipline and boundary lint |
| Playwright walkthrough implementation, screen recording, release trigger | `PSE--Projects` | Drives the demo application; must run against the frozen tag |
| Final MP4 hosting + `PSE_OVERVIEW_VIDEO_URL` | Video host + Vercel env | Swapped only after human approval |

`demo-contract.yaml` is the machine-validated interface between the two
repos: Marketing writes against the contract, not the application;
Playwright validates the contract, not the narration. `recording-plan.md`
describes the walkthrough that exercises it. Pipeline at freeze:

```
Freeze tag → Validate Demo Contract → pass → Record → Compose MP4
          → Human review → Publish (+ companion JSON sidecar)
```

If contract validation fails, there is no recording.

Every published video ships with a companion JSON sidecar
(`demo-v1.0-frozen.mp4` + `demo-v1.0-frozen.json`, from
`video-manifest.template.json`) carrying script/narration/fixture/contract
hashes, the Playwright run ID, and approval fields — the video is a
governed, auditable artifact with no database required.

## Stage gates

**Now (Stage A):** script, storyboard, narration copy, recording plan,
manifest template, founder-intro script. The founder intro (60–90s,
positioning-led, no product screens) may be recorded and published
immediately — it is not product-state dependent.

**At `demo-v1.0-frozen` (Stage B):** implement the Playwright walkthrough
in PSE--Projects, record, narrate, compose, human-approve, publish, set
`PSE_OVERVIEW_VIDEO_URL`. Preconditions: Stage-3 manual E2E pass, signal
deck reconciled, full-scope functional pass, frozen tag cut, production
demo deployment verified.

## Trigger policy (post-freeze)

- Draft build → no video
- Preview release → optional internal recording
- Frozen demo tag → production candidate generated
- PR labeled `demo-video-impact` → next release regenerates
- Text-only fix, no visible impact → no regeneration

The pipeline produces a **candidate**; it never replaces the published
video without the approval fields in the manifest being completed.

## Content rules

- Voice discipline applies: validate not perform, govern not process,
  verify not fund, oversee not execute.
- Every quantified claim must trace to `src/lib/stats.ts` or release
  metadata. No invented findings counts, savings figures, or benchmarks.
- Items marked `[FREEZE-DEPENDENT]` in the script are product-repo facts
  (screen names, findings counts, fixture behavior) that must be verified
  against the frozen build before recording — never assumed.
- Boundary test before approval: could a competitor salesperson read this
  script and conclude PSE competes for payroll processing? If yes, the
  script is wrong.
