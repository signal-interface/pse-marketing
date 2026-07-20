# Recording Plan — demo-v1 (contract for PSE--Projects)

This document specifies **what** the deterministic walkthrough records.
The Playwright implementation lives in PSE--Projects and runs only against
the `demo-v1.0-frozen` tag. Do not implement against a moving demo.

## Preconditions (all required)

1. Stage-3 manual E2E pass complete
2. Signal deck reconciled
3. Full-scope functional pass complete
4. `demo-v1.0-frozen` tag cut
5. Production demo deployment verified
6. Approved fixture committed and named in the release manifest
7. Expected findings count recorded in the release manifest

## Environment

- `PSE_DEMO_URL` → the frozen deployment, not a preview
- Demo environment reset to a clean state before recording
- Viewport 1920x1080, device scale 1, animations at natural speed
- Playwright video capture on; per-scene screenshots as fallback assets

## Walkthrough sequence (maps to storyboard scenes s3–s6)

1. **Reset** demo environment (approved reset mechanism).
2. **s3-intake:** open demo → upload approved fixture → wait for
   analysis-complete state (assert the exact completion text). Dwell 3s.
3. **s4-findings:** navigate to Command Center → dwell on compliance
   score 4s → open Exceptions → assert findings count equals the release
   manifest's `expectedFindings` → open the designated finding → dwell 6s.
4. **s5-chap:** open CHAP → submit the approved demo question → wait for
   determination + citation render → dwell 8s.
5. **s6-audit:** navigate to executive/reporting view → dwell 5s →
   evidence/replay view → dwell 5s.

## Assertions are release gates, not decorations

Every `assert` in the walkthrough doubles as a regression check: if the
frozen build doesn't show the expected text, score panel, findings count,
or citation block, the recording job **fails** instead of producing a
video that misrepresents the product. A failed assertion means either the
script is stale (fix the package) or the build changed (should not happen
on a frozen tag — investigate).

## Output artifacts

```
recordings/demo-v1.0-frozen/
├── walkthrough.webm          # raw Playwright capture
├── scenes/s3..s6/*.png       # per-scene stills
├── run-report.json           # assertions, timings, demo commit SHA
└── video-manifest.json       # completed from the template in this package
```

## Composition (after capture)

FFmpeg or Clueso per the storyboard: narration audio, intro/outro cards,
captions, zoom markers per scene callouts, CTA card, version watermark.
Output `pse-demo-v1.0.mp4` to the staging location — never directly to
the published URL.

## Approval gate (human, always)

Candidate video + completed manifest + run-report reviewed together.
Approval recorded in `approval.md` (claims, terminology, product behavior
shown, narration tone, visual quality, CTA). Only then: upload to
production host, set `PSE_OVERVIEW_VIDEO_URL`, update manifest
`reviewStatus: APPROVED`, `approvedBy`, `publishedUrl`.
