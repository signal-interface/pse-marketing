# Claim inventory and release evidence — 2026 Q4

Date: 2026-11-03  
Repository: `signal-interface/pse-marketing`  
Scope: PR #34, editorial only  
Verdict: **HOLD** (no publication approval)

## Two intentionally different evidence layers

1. `src/lib/payroll-intelligence-claim-inventory.ts` automatically enumerates **every individual `keyPoints` statement** from all 15 structured briefing drafts and identifies its briefing/domain. New draft statements cannot be silently omitted from the count because tests reconcile the generated inventory against the content source.
2. `docs/payroll-intelligence/FEDERAL_CLAIM_REGISTER_2026Q4.md` records **13 manually selected federal source-checks**. These checks are not a comprehensive, statement-by-statement legal review. Do not confuse the 13 source-checked assertions with all claims in the code inventory.

The generated inventory defaults **all draft statements** to `unreviewed`, even where a similar statement appears among the 13 source-checked federal assertions. This is deliberate: a candidate reference linked at the article level is not enough to establish exact claim-to-authority provenance, and an unverified join between those two datasets would create false confidence.

## Editorial verification record template

For each claim ID:
- Exact original assertion and domain/briefing slug
- Controlling jurisdiction and applicability (who, where, period, worker/employer category)
- Exact agency/statutory source URL, publication version and pinpoint section
- Date source checked and rule effective-from/effective-until dates
- Caveats, exceptions, related state/local authority, source conflicts
- Evidence status: unreviewed → source-mapped → independently verified
- Human payroll SME reviewer name, dated decision and any changes
- Separate legal/tax approver if appropriate and explicit publication sign-off
- Release snapshot SHA, correction history and withdrawal instructions

**There is currently no authoritative approver record and no published approved release manifest.** Never infer approval from a successful build, a nonempty source URL, a review timestamp, or a domain-completeness test.

## Release order and priority

1. Reconcile every individual draft statement to precise primary-source text and effective period.
2. Separate operational control recommendations from legal/regulatory claims.
3. Identify older or noncontrolling sources (for example, the DOL 2023 payday table and individual tax Publication 54 for international employer obligations).
4. Acquire state/local and foreign-jurisdiction source matrices where needed. Do not imply that a U.S. federal overview is globally complete.
5. Obtain named human review and publication authority before adding `verified` labels or enabling site discoverability.
6. Independently test mobile/accessibility, updated links, copyright/originality, security and exact approved commit.
7. Freeze and archive approved quarterly release manifest. Retain a correction path and process for material interim changes.

## Completion test contract

The repository tests check:
- Exactly 15 domain entries and 15 draft briefings.
- Each domain has evidence/control coverage.
- Each briefing has candidate authorities and at least three control checklist entries.
- Every individual `keyPoints` statement appears exactly once in the generated unreviewed inventory, with a stable ID.
- The draft inventory can never imply approval.

These tests establish **coverage and safe metadata defaults**, not the truth or legal applicability of content.

## Scope boundary

No changes to PSE production runtime, tax calculations, employee records, client systems, CI gates, deployment policy or platform build sequence. This is a draft marketing-education editorial workflow only.
