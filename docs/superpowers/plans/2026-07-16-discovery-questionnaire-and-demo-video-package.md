# Governance Discovery Questionnaire + Demo Video Package (Stage A) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the post-demo-request commercial journey in `pse-marketing`: journey email → one-time discovery link → save/resume governance questionnaire → submission notification; commit the Stage A demo-video package docs; and publish the seven-domain PSE Framework as a new `/framework` content section.

**Architecture:** Discovery sessions live in a new Vercel Postgres table keyed by SHA-256 token hashes (invite token in the email, session token in an HTTP-only cookie set by a claim redirect). Three cookie-authenticated App Router API routes (get/save/submit) back a single client questionnaire page; all answer validation authority is a server-side allowlist module. The demo-request route grows two additional emails (journey #1 + questionnaire invite). The video package is a docs-only commit under `docs/video/demo-v1/`.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, `@vercel/postgres`, Resend, Tailwind v4, lucide-react, Vitest (node env), npm.

## Global Constraints

- **Voice discipline (all copy):** validate not perform, govern not process, verify not fund, oversee not execute. "Your system of record executes. PSE governs."
- **Quantified claims** must trace to `src/lib/stats.ts` or release metadata. (Verified present: `dolBackWages` $149.9M FY2024 / 125,000+ workers; `irsMaxDepositPenalty` 15% IRC §6656; `irsEmployerErrors` 33%.)
- **No payroll data or employee information** is requested or accepted anywhere in the discovery flow.
- **Server-side validation is the only authority.** The client form only shapes input. Unknown answer keys are rejected.
- **User-supplied values are never interpolated raw into email HTML.** Everything goes through `escapeHtml`.
- **Raw tokens appear only in the invite email and the cookie.** The DB stores SHA-256 hashes only. Never log a raw token.
- Route handlers follow existing repo idioms: inline `sql` tagged templates, `ensure*Table()` lazy DDL from `src/lib/db.ts`, `Promise.allSettled` for best-effort email, 200-even-if-email-fails.
- Tests follow the existing pattern in `src/app/api/demo-request/__tests__/route.test.ts`: `vi.mock` with **inline factories**, import the route **after** mocks, `Request` objects built by hand.
- Path alias `@/*` → `./src/*`. Run tests with `npx vitest run <path>`.

## Scope Decisions & Deviations (read before executing)

These are deliberate decisions made while turning the spec into this plan. If the user overrides any of them, adjust the affected task only.

1. **Syntax fix:** the spec's `QuestionnaireClient.tsx` was missing `onChange={(e) =>` on the `payrollFrequencies` select. Appendix A contains the corrected file — use it verbatim.
2. **`chapLeadNotificationHtml` now escapes** `email`, `sessionId`, `firstQuestion`. The spec's own top comment ("User-supplied values must never be interpolated into email HTML raw") requires this; the spec body omitted it. Appendix B applies it.
3. **`autoResponseHtml` is retained but unused** by the demo-request route (journey email #1 replaces it, per the spec comment). It also gains escaping.
4. **New `discoverySubmissionHtml` internal notification** on questionnaire submit — not in the spec, added so submissions don't sit invisible in the DB. Sales must learn a questionnaire arrived.
5. **Invite link TTL: 14 days** (`expiresDays: 14` in the invite email). Single-use: claiming sets `claimed_at`; a second claim of the same link dead-ends at the questionnaire's "no longer active" state. Resume happens via the cookie, not the link.
6. **URL shape:** invite email links to `GET /api/discovery/claim?t=<token>` (origin taken from the incoming demo-request URL), which sets the cookie and redirects to `/discovery`.
7. **Journey email #1 and the questionnaire invite are both sent immediately** from the demo-request route (three sends total, `Promise.allSettled`). No drip scheduling in v1.
8. **`jobTitle`** becomes an optional field on `DemoRequestForm`, the demo-request API, the `demo_requests` table (`ALTER TABLE ... ADD COLUMN IF NOT EXISTS`), and the internal notification.
9. **Video URL:** `journeyEmailHtml` receives `process.env.PSE_OVERVIEW_VIDEO_URL` if set, else omits the video block (matches the spec's "else absent"). No tracked/signed redirect route in v1.
10. **`/discovery` is noindex** via page metadata; it is not added to the sitemap.
11. **`demo-contract.yaml`** was referenced by the spec but not provided; Appendix I is a skeleton with every key the narration/recording plan reference, values `null` until the `demo-v1.0-frozen` freeze.
12. **Framework SLA fix (Domain 3):** the spec's L5 maturity said "same-day rule currency" while its Key Activities and the live site (`STATS`, tax-compliance service page) say "within one business day". Appendix M standardizes L5 to "one-business-day rule currency". One claim, one number, everywhere.
13. **Framework AI-line fix (Domain 5):** "it does not let AI execute pay without human oversight" implied AI could execute pay under oversight. Appendix O rewrites it to the site's established formula ("CHAP advises. Humans decide."): AI advises and documents; it never executes pay. Domain 7's automation line was reviewed and kept verbatim — there the automation belongs to the platforms PSE governs, and the sentence passes the boundary acceptance test.
14. **`docs/POSITIONING_STRATEGY.md` exists on `main` — extend it, do not create or overwrite it.** (An earlier draft of this plan proposed a stub; that was based on a stale local checkout. `origin/main` carries five strategy docs committed 2026-06-11, including the positioning doc with the canonical "PSE Is Not" list.) Appendix R is now an **append block**: two new sections ("The One Rule", "Boundary Substitution Table") added to the end of the existing file, leaving everything already there untouched.
    - Repo-state note for the executor: run `git pull --ff-only origin main` before starting — the strategy docs and `docs/MARKETING_SITE_PLAN.md` must be present locally for Task 12.
16. **CHAP P0 (Task 16, execute first):** the live `/chap-ai` widget runs on a placeholder corpus — all 10 `complianceCorpus.ts` entries have `content = "[Founder to populate with verbatim primary source text]"`, violating `DEPLOY_CHECKLIST.md`'s own pre-launch blocker. Task 16 resolves it (populate verbatim from primary sources with founder review, or gate the widget). The `MODEL = "claude-sonnet-4-6"` pin was **verified against the current model catalog: it is a valid, active model ID** (previous-generation Sonnet; current is `claude-sonnet-5`) — no runtime risk, upgrade optional and explicitly out of P0 scope.
17. **CI (Task 17):** the repo has no `.github/workflows/` — tests and the boundary lint never run on push. A "grep-based gate" only gates if something executes it, so Task 17 wires `tsc` + `vitest` + the boundary lint + `next build` into a GitHub Actions workflow on PR and push-to-main.
18. **Execution order is not fully parallel:** Task 16 (P0) first; Tasks 1–11 in listed order; Tasks 12 → 13 → 14 → 15 strictly sequential (13 transcribes 12's docs, 14 renders 13's data, 15 imports both); Task 18 after 15; Task 17 last (its lint targets must exist).
19. **P1 #4 decided — option (a), reframe `/services` toward governance (Task 18).** Scope is the **label/overview layer only**: the two service headlines/features that carry execution voice ("Automated multi-state payroll", "Connect payroll to your HRIS"), the System Integration homepage card, and the homepage `STATS` tile "50% Faster processing" — whose figure traces to nothing in `stats.ts` and is replaced with a sourced tile. Bodies already carry the boundary hedges and stay as-is. The URL slug `payroll-processing` is **kept** (renaming needs redirects and re-indexing — flagged as an optional follow-up, not bundled here). The CI boundary lint extends to `src/lib/constants.ts` and `src/data/services.ts`.
15. **Framework URL space:** `/framework` (index) + `/framework/<slug>` per domain, slugs from the spec filenames minus the number prefix (`payroll-operations`, `workforce-data`, `compliance`, `risk-and-controls`, `governance`, `workforce-intelligence`, `technology-and-automation`). Nav gains a "Framework" link; `sitemap.ts` (today: apex only) is extended to enumerate all indexable routes. Framework pages are **indexable by design** — the spec calls out AI citation/indexing as a goal.

## Harmonization Note

The user has said more files will be added to harmonize into this plan. When new artifacts arrive: add them as **new numbered tasks at the end** (docs → follow Task 11's pattern; code → follow Tasks 1–10's TDD pattern), put full file contents in **new appendices**, and check them against the Global Constraints above (voice discipline, stats traceability, escaping, token hygiene). Do not renumber existing tasks.

## File Structure

```
src/lib/emails.ts                                    (replace — Appendix B)
src/lib/__tests__/emails.test.ts                     (create)
src/lib/discovery/tokens.ts                          (create)
src/lib/discovery/session.ts                         (create)
src/lib/discovery/validation.ts                      (create)
src/lib/discovery/__tests__/tokens.test.ts           (create)
src/lib/discovery/__tests__/session.test.ts          (create)
src/lib/discovery/__tests__/validation.test.ts       (create)
src/lib/db.ts                                        (modify — add discovery table, demo_requests job_title)
src/app/api/discovery/claim/route.ts                 (create)
src/app/api/discovery/claim/__tests__/route.test.ts  (create)
src/app/api/discovery/session/route.ts               (create)
src/app/api/discovery/session/__tests__/route.test.ts        (create)
src/app/api/discovery/session/save/route.ts          (create)
src/app/api/discovery/session/save/__tests__/route.test.ts   (create)
src/app/api/discovery/session/submit/route.ts        (create)
src/app/api/discovery/session/submit/__tests__/route.test.ts (create)
src/app/discovery/page.tsx                           (create)
src/app/discovery/QuestionnaireClient.tsx            (create — Appendix A)
src/app/api/demo-request/route.ts                    (modify)
src/app/api/demo-request/__tests__/route.test.ts     (modify)
src/components/forms/DemoRequestForm.tsx             (modify — jobTitle field)
.env.example                                         (modify)
docs/video/demo-v1/*                                 (create — Appendices C–I)
docs/framework/README.md + 01..07-*.md               (create — Appendices J–Q)
docs/POSITIONING_STRATEGY.md                         (modify — append Appendix R sections; file exists on main)
docs/MARKETING_SITE_PLAN.md                          (modify — site map to shipped reality)
src/data/complianceCorpus.ts                         (modify — Task 16, P0)
src/data/__tests__/complianceCorpus.test.ts          (create — Task 16)
src/lib/constants.ts                                 (modify — Task 15 nav + Task 18 copy/stat)
src/data/services.ts                                 (modify — Task 18 label-layer copy)
.github/workflows/ci.yml                             (create — Task 17)
src/data/framework.ts                                (create)
src/data/__tests__/framework.test.ts                 (create)
src/components/templates/FrameworkDomainPage.tsx     (create)
src/app/framework/page.tsx                           (create)
src/app/framework/[slug]/page.tsx                    (create)
src/lib/constants.ts                                 (modify — NAV_LINKS)
src/app/sitemap.ts                                   (modify — enumerate routes)
```

---

### Task 1: Email templates — escaping + journey/invite/submission templates

**Files:**
- Modify: `src/lib/emails.ts` (full replacement — Appendix B)
- Test: `src/lib/__tests__/emails.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces (used by Tasks 8 and 10):
  - `escapeHtml(value: string): string` — module-private helper, not exported; every template routes user input through it
  - `internalNotificationHtml(data: { name: string; email: string; company?: string; employees?: string; jobTitle?: string }): string`
  - `journeyEmailHtml(data: { firstName: string; videoUrl?: string }): string`
  - `questionnaireInviteHtml(data: { firstName: string; discoveryUrl: string; expiresDays: number }): string`
  - `discoverySubmissionHtml(data: { firstName: string; email: string; company: string; answers: Record<string, unknown> }): string`
  - `chapLeadNotificationHtml`, `autoResponseHtml` (existing signatures, now escaped)

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/emails.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  chapLeadNotificationHtml,
  internalNotificationHtml,
  journeyEmailHtml,
  questionnaireInviteHtml,
  discoverySubmissionHtml,
} from "../emails";

describe("email HTML escaping", () => {
  it("escapes user input in the internal demo notification", () => {
    const html = internalNotificationHtml({
      name: '<img src=x onerror=alert(1)>',
      email: 'a@b.com"><script>',
      company: "<b>Acme</b>",
      jobTitle: "CFO & <VP>",
    });
    expect(html).not.toContain("<img src=x");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;b&gt;Acme&lt;/b&gt;");
    expect(html).toContain("CFO &amp; &lt;VP&gt;");
  });

  it("escapes the CHAP lead first question", () => {
    const html = chapLeadNotificationHtml({
      email: "a@b.com",
      sessionId: "s1",
      firstQuestion: '<script>alert("x")</script>',
    });
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("&lt;script&gt;");
  });
});

describe("journeyEmailHtml", () => {
  it("includes the video CTA when videoUrl is provided", () => {
    const html = journeyEmailHtml({ firstName: "Jane", videoUrl: "https://x.test/v?a=1&b=2" });
    expect(html).toContain("Watch the PSE Overview");
    expect(html).toContain("https://x.test/v?a=1&amp;b=2");
  });

  it("omits the video block when videoUrl is absent", () => {
    const html = journeyEmailHtml({ firstName: "Jane" });
    expect(html).not.toContain("Watch the PSE Overview");
    expect(html).toContain("Hi Jane,");
  });
});

describe("questionnaireInviteHtml", () => {
  it("carries the discovery URL and expiry", () => {
    const html = questionnaireInviteHtml({
      firstName: "Jane",
      discoveryUrl: "https://x.test/api/discovery/claim?t=abc",
      expiresDays: 14,
    });
    expect(html).toContain("https://x.test/api/discovery/claim?t=abc");
    expect(html).toContain("valid for 14 days");
    expect(html).toContain("Continue to Governance Discovery");
  });
});

describe("discoverySubmissionHtml", () => {
  it("renders and escapes answers, joining arrays", () => {
    const html = discoverySubmissionHtml({
      firstName: "Jane",
      email: "jane@acme.com",
      company: "Acme",
      answers: {
        organizationSize: "51-200",
        topConcerns: ["Multi-state tax", "<b>bold</b>"],
      },
    });
    expect(html).toContain("51-200");
    expect(html).toContain("Multi-state tax, &lt;b&gt;bold&lt;/b&gt;");
    expect(html).not.toContain("<b>bold</b>");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/emails.test.ts`
Expected: FAIL — `journeyEmailHtml` etc. are not exported (current `emails.ts` predates them).

- [ ] **Step 3: Replace `src/lib/emails.ts` with Appendix B (complete file)**

Copy Appendix B verbatim. It is the spec's version with the documented deviations applied: `chapLeadNotificationHtml` escapes its inputs, `autoResponseHtml` escapes `name`/`company`/`employees`, `journeyEmailHtml`/`questionnaireInviteHtml` escape their URLs, and `discoverySubmissionHtml` is added.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/emails.test.ts`
Expected: PASS (all 5 tests). Also run `npx vitest run` — the existing demo-request suite must still pass (it doesn't assert on email bodies).

- [ ] **Step 5: Commit**

```bash
git add src/lib/emails.ts src/lib/__tests__/emails.test.ts
git commit -m "feat(discovery): journey, invite, and submission email templates with HTML escaping"
```

---

### Task 2: Token + cookie helpers

**Files:**
- Create: `src/lib/discovery/tokens.ts`, `src/lib/discovery/session.ts`
- Test: `src/lib/discovery/__tests__/tokens.test.ts`, `src/lib/discovery/__tests__/session.test.ts`

**Interfaces:**
- Produces (used by Tasks 5–8 and 10):
  - `generateToken(): string` — 32 random bytes, base64url
  - `hashToken(raw: string): string` — SHA-256 hex (64 chars)
  - `DISCOVERY_COOKIE = "pse_discovery"`
  - `readDiscoveryCookie(request: Request): string | null`

- [ ] **Step 1: Write the failing tests**

`src/lib/discovery/__tests__/tokens.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { generateToken, hashToken } from "../tokens";

describe("discovery tokens", () => {
  it("generates unique, URL-safe tokens", () => {
    const a = generateToken();
    const b = generateToken();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^[A-Za-z0-9_-]{43}$/); // 32 bytes base64url
  });

  it("hashes deterministically to sha256 hex", () => {
    expect(hashToken("abc")).toBe(hashToken("abc"));
    expect(hashToken("abc")).toMatch(/^[a-f0-9]{64}$/);
    expect(hashToken("abc")).not.toBe(hashToken("abd"));
  });
});
```

`src/lib/discovery/__tests__/session.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { DISCOVERY_COOKIE, readDiscoveryCookie } from "../session";

function req(cookieHeader?: string): Request {
  return new Request("http://localhost/api/discovery/session", {
    headers: cookieHeader ? { cookie: cookieHeader } : {},
  });
}

describe("readDiscoveryCookie", () => {
  it("returns null without a cookie header", () => {
    expect(readDiscoveryCookie(req())).toBeNull();
  });

  it("extracts the discovery cookie among others", () => {
    expect(readDiscoveryCookie(req(`other=1; ${DISCOVERY_COOKIE}=tok_abc; x=2`))).toBe("tok_abc");
  });

  it("returns null for an empty value", () => {
    expect(readDiscoveryCookie(req(`${DISCOVERY_COOKIE}=`))).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/discovery`
Expected: FAIL — modules don't exist.

- [ ] **Step 3: Implement**

`src/lib/discovery/tokens.ts`:

```ts
import { createHash, randomBytes } from "node:crypto";

// Raw tokens travel only in the invite email and the session cookie.
// The database stores SHA-256 hashes; never log a raw token.
export function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}
```

`src/lib/discovery/session.ts`:

```ts
export const DISCOVERY_COOKIE = "pse_discovery";

export function readDiscoveryCookie(request: Request): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === DISCOVERY_COOKIE) {
      const value = rest.join("=");
      return value || null;
    }
  }
  return null;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/discovery`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/discovery
git commit -m "feat(discovery): token generation/hashing and session cookie helpers"
```

---

### Task 3: Server-side answers allowlist

**Files:**
- Create: `src/lib/discovery/validation.ts`
- Test: `src/lib/discovery/__tests__/validation.test.ts`

**Interfaces:**
- Produces (used by Tasks 7–8):
  - `validateAnswers(input: unknown): { ok: true; answers: Record<string, unknown> } | { ok: false }`
  - Partial objects are valid (autosave); `{}` is valid; unknown keys, wrong types, out-of-range values → `{ ok: false }`.

The allowlist mirrors the client exactly: `organizationSize` ∈ {1-50, 51-200, 201-500, 500+}; `operatingRegions` string[1..30], items ≤80 chars; `payrollFrequencies` ∈ {weekly, biweekly, semimonthly, monthly, mixed}; `hcmSystem`/`payrollProvider` ≤120; `operatingModel` ∈ {internal, outsourced, hybrid}; `payrollTeamSize` ≤40; `topConcerns` string[1..3], items ≤200; `reportingMaturity` int 1–5; `complianceConfidence`/`governanceConfidence` int 1–10; `desiredFutureState` ≤2000; `meetingPurpose` ≤1000.

- [ ] **Step 1: Write the failing test**

`src/lib/discovery/__tests__/validation.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { validateAnswers } from "../validation";

const FULL_VALID = {
  organizationSize: "51-200",
  operatingRegions: ["California", "New York", "UK"],
  payrollFrequencies: "biweekly",
  hcmSystem: "Workday",
  payrollProvider: "ADP",
  operatingModel: "hybrid",
  payrollTeamSize: "3",
  topConcerns: ["Multi-state tax exposure", "Off-cycle audit trail"],
  reportingMaturity: 3,
  complianceConfidence: 7,
  governanceConfidence: 5,
  desiredFutureState: "Independent validation every pay period.",
  meetingPurpose: "Walk through a governed review.",
};

describe("validateAnswers", () => {
  it("accepts a complete valid payload", () => {
    const r = validateAnswers(FULL_VALID);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.answers.organizationSize).toBe("51-200");
  });

  it("accepts an empty object (autosave with nothing filled)", () => {
    expect(validateAnswers({}).ok).toBe(true);
  });

  it("accepts a partial payload", () => {
    expect(validateAnswers({ hcmSystem: "UKG" }).ok).toBe(true);
  });

  it("rejects non-objects and arrays", () => {
    expect(validateAnswers(null).ok).toBe(false);
    expect(validateAnswers("x").ok).toBe(false);
    expect(validateAnswers([1]).ok).toBe(false);
  });

  it("rejects unknown keys", () => {
    expect(validateAnswers({ employeeSsn: "000-00-0000" }).ok).toBe(false);
  });

  it("rejects invalid enum values", () => {
    expect(validateAnswers({ organizationSize: "9999+" }).ok).toBe(false);
    expect(validateAnswers({ payrollFrequencies: "daily" }).ok).toBe(false);
    expect(validateAnswers({ operatingModel: "offshore" }).ok).toBe(false);
  });

  it("rejects out-of-range scales and non-integers", () => {
    expect(validateAnswers({ reportingMaturity: 6 }).ok).toBe(false);
    expect(validateAnswers({ reportingMaturity: 2.5 }).ok).toBe(false);
    expect(validateAnswers({ complianceConfidence: 0 }).ok).toBe(false);
    expect(validateAnswers({ governanceConfidence: 11 }).ok).toBe(false);
  });

  it("rejects oversized collections and strings", () => {
    expect(validateAnswers({ operatingRegions: Array(31).fill("CA") }).ok).toBe(false);
    expect(validateAnswers({ topConcerns: ["a", "b", "c", "d"] }).ok).toBe(false);
    expect(validateAnswers({ desiredFutureState: "x".repeat(2001) }).ok).toBe(false);
    expect(validateAnswers({ meetingPurpose: "x".repeat(1001) }).ok).toBe(false);
  });

  it("trims free-text values", () => {
    const r = validateAnswers({ hcmSystem: "  Workday  " });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.answers.hcmSystem).toBe("Workday");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/discovery/__tests__/validation.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement `src/lib/discovery/validation.ts`**

```ts
// Server-side allowlist for discovery questionnaire answers. This module is
// the validation authority — the client form only shapes input. Partial
// payloads are valid (autosave); unknown keys are rejected outright.

const ORGANIZATION_SIZES = ["1-50", "51-200", "201-500", "500+"];
const PAYROLL_FREQUENCIES = ["weekly", "biweekly", "semimonthly", "monthly", "mixed"];
const OPERATING_MODELS = ["internal", "outsourced", "hybrid"];

export type ValidationResult =
  | { ok: true; answers: Record<string, unknown> }
  | { ok: false };

const INVALID: ValidationResult = { ok: false };

function isShortText(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

function isIntInRange(v: unknown, min: number, max: number): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= min && v <= max;
}

function isStringArray(v: unknown, maxItems: number, maxLen: number): v is string[] {
  return (
    Array.isArray(v) &&
    v.length >= 1 &&
    v.length <= maxItems &&
    v.every((item) => isShortText(item, maxLen))
  );
}

export function validateAnswers(input: unknown): ValidationResult {
  if (typeof input !== "object" || input === null || Array.isArray(input)) return INVALID;
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    switch (key) {
      case "organizationSize":
        if (!ORGANIZATION_SIZES.includes(value as string)) return INVALID;
        out[key] = value;
        break;
      case "operatingRegions":
        if (!isStringArray(value, 30, 80)) return INVALID;
        out[key] = value.map((r) => r.trim());
        break;
      case "payrollFrequencies":
        if (!PAYROLL_FREQUENCIES.includes(value as string)) return INVALID;
        out[key] = value;
        break;
      case "hcmSystem":
      case "payrollProvider":
        if (!isShortText(value, 120)) return INVALID;
        out[key] = value.trim();
        break;
      case "operatingModel":
        if (!OPERATING_MODELS.includes(value as string)) return INVALID;
        out[key] = value;
        break;
      case "payrollTeamSize":
        if (!isShortText(value, 40)) return INVALID;
        out[key] = value.trim();
        break;
      case "topConcerns":
        if (!isStringArray(value, 3, 200)) return INVALID;
        out[key] = value.map((c) => c.trim());
        break;
      case "reportingMaturity":
        if (!isIntInRange(value, 1, 5)) return INVALID;
        out[key] = value;
        break;
      case "complianceConfidence":
      case "governanceConfidence":
        if (!isIntInRange(value, 1, 10)) return INVALID;
        out[key] = value;
        break;
      case "desiredFutureState":
        if (!isShortText(value, 2000)) return INVALID;
        out[key] = value.trim();
        break;
      case "meetingPurpose":
        if (!isShortText(value, 1000)) return INVALID;
        out[key] = value.trim();
        break;
      default:
        return INVALID;
    }
  }

  return { ok: true, answers: out };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/discovery/__tests__/validation.test.ts`
Expected: PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/discovery/validation.ts src/lib/discovery/__tests__/validation.test.ts
git commit -m "feat(discovery): server-side answers allowlist validation"
```

---

### Task 4: Database DDL — discovery_sessions table + demo_requests.job_title

**Files:**
- Modify: `src/lib/db.ts`

**Interfaces:**
- Produces (used by Tasks 5–8, 10): `ensureDiscoverySessionsTable(): Promise<void>`
- Modifies: `ensureDemoRequestsTable()` now also guarantees a `job_title TEXT` column.

No new unit test (DDL helpers are mocked in route tests, matching the repo's existing treatment of `ensure*Table`). Verification is the typecheck + downstream route tests.

- [ ] **Step 1: Add to `src/lib/db.ts`**

Append after `ensureChapTables`:

```ts
export async function ensureDiscoverySessionsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS discovery_sessions (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      first_name TEXT NOT NULL,
      company TEXT NOT NULL DEFAULT '',
      invite_token_hash TEXT NOT NULL UNIQUE,
      session_token_hash TEXT UNIQUE,
      answers JSONB NOT NULL DEFAULT '{}'::jsonb,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      expires_at TIMESTAMPTZ NOT NULL,
      claimed_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS discovery_sessions_expires_idx ON discovery_sessions(expires_at)`;
}
```

And inside `ensureDemoRequestsTable`, after the `CREATE TABLE` statement, add:

```ts
  await sql`ALTER TABLE demo_requests ADD COLUMN IF NOT EXISTS job_title TEXT`;
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/db.ts
git commit -m "feat(discovery): discovery_sessions table; job_title column on demo_requests"
```

---

### Task 5: Claim route — one-time link → session cookie

**Files:**
- Create: `src/app/api/discovery/claim/route.ts`
- Test: `src/app/api/discovery/claim/__tests__/route.test.ts`

**Interfaces:**
- Consumes: `generateToken`/`hashToken` (Task 2), `DISCOVERY_COOKIE` (Task 2), `ensureDiscoverySessionsTable` (Task 4).
- Produces: `GET /api/discovery/claim?t=<inviteToken>` — on success sets `pse_discovery` HTTP-only cookie and 307-redirects to `/discovery`; on any failure redirects to `/discovery` with no cookie (the page renders its "no-session" state).

- [ ] **Step 1: Write the failing test**

`src/app/api/discovery/claim/__tests__/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@vercel/postgres", () => ({
  sql: vi.fn().mockResolvedValue({ rows: [] }),
}));

vi.mock("@/lib/db", () => ({
  ensureDiscoverySessionsTable: vi.fn().mockResolvedValue(undefined),
}));

import { GET } from "../route";
import { sql } from "@vercel/postgres";

function makeRequest(token?: string): Request {
  const url = token
    ? `http://localhost/api/discovery/claim?t=${token}`
    : "http://localhost/api/discovery/claim";
  return new Request(url);
}

describe("GET /api/discovery/claim", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets the session cookie and redirects on a valid unclaimed token", async () => {
    vi.mocked(sql).mockResolvedValueOnce({
      rows: [{ id: 1, expires_at: new Date(Date.now() + 14 * 86400_000) }],
    } as never);

    const res = await GET(makeRequest("valid-token"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost/discovery");
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toContain("pse_discovery=");
    expect(cookie.toLowerCase()).toContain("httponly");
  });

  it("redirects without a cookie when the token is unknown, used, or expired", async () => {
    const res = await GET(makeRequest("bad-token"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost/discovery");
    expect(res.headers.get("set-cookie")).toBeNull();
  });

  it("redirects without touching the database when t is missing", async () => {
    const res = await GET(makeRequest());
    expect(res.status).toBe(307);
    expect(sql).not.toHaveBeenCalled();
  });

  it("redirects without a cookie when the database throws", async () => {
    vi.mocked(sql).mockRejectedValueOnce(new Error("db down"));
    const res = await GET(makeRequest("valid-token"));
    expect(res.status).toBe(307);
    expect(res.headers.get("set-cookie")).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/api/discovery/claim`
Expected: FAIL — route module doesn't exist.

- [ ] **Step 3: Implement `src/app/api/discovery/claim/route.ts`**

```ts
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { ensureDiscoverySessionsTable } from "@/lib/db";
import { generateToken, hashToken } from "@/lib/discovery/tokens";
import { DISCOVERY_COOKIE } from "@/lib/discovery/session";

// One-time invite link. Claiming atomically marks the invite used and mints
// a session token; resume across visits rides the cookie, not the link.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const destination = new URL("/discovery", url.origin);
  const raw = url.searchParams.get("t");
  if (!raw) return NextResponse.redirect(destination);

  try {
    await ensureDiscoverySessionsTable();
    const sessionToken = generateToken();
    const { rows } = await sql`
      UPDATE discovery_sessions
      SET session_token_hash = ${hashToken(sessionToken)},
          claimed_at = NOW(),
          updated_at = NOW()
      WHERE invite_token_hash = ${hashToken(raw)}
        AND claimed_at IS NULL
        AND expires_at > NOW()
      RETURNING id, expires_at
    `;
    if (rows.length === 0) return NextResponse.redirect(destination);

    const res = NextResponse.redirect(destination);
    const maxAge = Math.max(
      60,
      Math.floor((new Date(rows[0].expires_at).getTime() - Date.now()) / 1000)
    );
    res.cookies.set(DISCOVERY_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
    return res;
  } catch (error) {
    console.error("Discovery claim error:", error);
    return NextResponse.redirect(destination);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/api/discovery/claim`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/app/api/discovery/claim
git commit -m "feat(discovery): one-time invite claim route issuing session cookie"
```

---

### Task 6: Session GET route

**Files:**
- Create: `src/app/api/discovery/session/route.ts`
- Test: `src/app/api/discovery/session/__tests__/route.test.ts`

**Interfaces:**
- Consumes: `readDiscoveryCookie`, `hashToken`, `ensureDiscoverySessionsTable`.
- Produces: `GET /api/discovery/session` → 401 `{ error: "no_session" }` without a valid cookie; 200 `{ firstName, company, answers, completed }` otherwise. (This is exactly the shape `QuestionnaireClient` consumes.)

- [ ] **Step 1: Write the failing test**

`src/app/api/discovery/session/__tests__/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@vercel/postgres", () => ({
  sql: vi.fn().mockResolvedValue({ rows: [] }),
}));

vi.mock("@/lib/db", () => ({
  ensureDiscoverySessionsTable: vi.fn().mockResolvedValue(undefined),
}));

import { GET } from "../route";
import { sql } from "@vercel/postgres";

function makeRequest(cookie?: string): Request {
  return new Request("http://localhost/api/discovery/session", {
    headers: cookie ? { cookie } : {},
  });
}

describe("GET /api/discovery/session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 without a cookie", async () => {
    const res = await GET(makeRequest());
    expect(res.status).toBe(401);
    expect(sql).not.toHaveBeenCalled();
  });

  it("returns 401 when the cookie matches no active session", async () => {
    const res = await GET(makeRequest("pse_discovery=stale"));
    expect(res.status).toBe(401);
  });

  it("returns the session payload for a valid cookie", async () => {
    vi.mocked(sql).mockResolvedValueOnce({
      rows: [{ first_name: "Jane", company: "Acme", answers: { hcmSystem: "Workday" }, completed: false }],
    } as never);

    const res = await GET(makeRequest("pse_discovery=tok"));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json).toEqual({
      firstName: "Jane",
      company: "Acme",
      answers: { hcmSystem: "Workday" },
      completed: false,
    });
  });

  it("returns 500 when the database throws", async () => {
    vi.mocked(sql).mockRejectedValueOnce(new Error("db down"));
    const res = await GET(makeRequest("pse_discovery=tok"));
    expect(res.status).toBe(500);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/api/discovery/session/__tests__/route.test.ts`
Expected: FAIL — route module doesn't exist.

- [ ] **Step 3: Implement `src/app/api/discovery/session/route.ts`**

```ts
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { ensureDiscoverySessionsTable } from "@/lib/db";
import { hashToken } from "@/lib/discovery/tokens";
import { readDiscoveryCookie } from "@/lib/discovery/session";

export async function GET(request: Request) {
  const token = readDiscoveryCookie(request);
  if (!token) {
    return NextResponse.json({ error: "no_session" }, { status: 401 });
  }
  try {
    await ensureDiscoverySessionsTable();
    const { rows } = await sql`
      SELECT first_name, company, answers, completed
      FROM discovery_sessions
      WHERE session_token_hash = ${hashToken(token)}
        AND expires_at > NOW()
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "no_session" }, { status: 401 });
    }
    return NextResponse.json({
      firstName: rows[0].first_name,
      company: rows[0].company,
      answers: rows[0].answers,
      completed: rows[0].completed,
    });
  } catch (error) {
    console.error("Discovery session error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/api/discovery/session/__tests__/route.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/app/api/discovery/session/route.ts src/app/api/discovery/session/__tests__
git commit -m "feat(discovery): session read endpoint for questionnaire resume"
```

---

### Task 7: Save route (autosave)

**Files:**
- Create: `src/app/api/discovery/session/save/route.ts`
- Test: `src/app/api/discovery/session/save/__tests__/route.test.ts`

**Interfaces:**
- Consumes: `readDiscoveryCookie`, `hashToken`, `validateAnswers`, `ensureDiscoverySessionsTable`.
- Produces: `POST /api/discovery/session/save` with body `{ answers: {...} }` → 200 `{ success: true }`; 400 `{ error: "invalid_answers" }`; 401 `{ error: "no_session" }` (missing cookie, expired, or already-completed session). Answers are replaced wholesale (the client always sends the full current payload).

- [ ] **Step 1: Write the failing test**

`src/app/api/discovery/session/save/__tests__/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@vercel/postgres", () => ({
  sql: vi.fn().mockResolvedValue({ rows: [] }),
}));

vi.mock("@/lib/db", () => ({
  ensureDiscoverySessionsTable: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from "../route";
import { sql } from "@vercel/postgres";

function makeRequest(body: unknown, cookie = "pse_discovery=tok"): Request {
  return new Request("http://localhost/api/discovery/session/save", {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify(body),
  });
}

describe("POST /api/discovery/session/save", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saves valid partial answers", async () => {
    vi.mocked(sql).mockResolvedValueOnce({ rows: [{ id: 1 }] } as never);
    const res = await POST(makeRequest({ answers: { hcmSystem: "Workday" } }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("rejects disallowed answer keys with 400", async () => {
    const res = await POST(makeRequest({ answers: { ssn: "000" } }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("invalid_answers");
    expect(sql).not.toHaveBeenCalled();
  });

  it("returns 401 without a cookie", async () => {
    const res = await POST(
      new Request("http://localhost/api/discovery/session/save", {
        method: "POST",
        body: JSON.stringify({ answers: {} }),
      })
    );
    expect(res.status).toBe(401);
  });

  it("returns 401 when no active editable session matches (expired or completed)", async () => {
    const res = await POST(makeRequest({ answers: {} }));
    expect(res.status).toBe(401);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/api/discovery/session/save`
Expected: FAIL — route module doesn't exist.

- [ ] **Step 3: Implement `src/app/api/discovery/session/save/route.ts`**

```ts
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { ensureDiscoverySessionsTable } from "@/lib/db";
import { hashToken } from "@/lib/discovery/tokens";
import { readDiscoveryCookie } from "@/lib/discovery/session";
import { validateAnswers } from "@/lib/discovery/validation";

export async function POST(request: Request) {
  const token = readDiscoveryCookie(request);
  if (!token) {
    return NextResponse.json({ error: "no_session" }, { status: 401 });
  }
  try {
    const body = await request.json().catch(() => null);
    const result = validateAnswers((body as { answers?: unknown } | null)?.answers ?? null);
    if (!result.ok) {
      return NextResponse.json({ error: "invalid_answers" }, { status: 400 });
    }

    await ensureDiscoverySessionsTable();
    const { rows } = await sql`
      UPDATE discovery_sessions
      SET answers = ${JSON.stringify(result.answers)}::jsonb,
          updated_at = NOW()
      WHERE session_token_hash = ${hashToken(token)}
        AND completed = FALSE
        AND expires_at > NOW()
      RETURNING id
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "no_session" }, { status: 401 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Discovery save error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/api/discovery/session/save`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/app/api/discovery/session/save
git commit -m "feat(discovery): autosave endpoint with allowlist validation"
```

---

### Task 8: Submit route (finalize + internal notification)

**Files:**
- Create: `src/app/api/discovery/session/submit/route.ts`
- Test: `src/app/api/discovery/session/submit/__tests__/route.test.ts`

**Interfaces:**
- Consumes: `readDiscoveryCookie`, `hashToken`, `validateAnswers`, `ensureDiscoverySessionsTable`, `discoverySubmissionHtml` (Task 1).
- Produces: `POST /api/discovery/session/submit` with `{ answers }` → 200 `{ success: true }` and the session becomes read-only (`completed = TRUE`); 400 `{ error: "invalid_answers" }`; 401 `{ error: "no_session" }`. Sends a best-effort internal notification (failure never blocks the 200).

- [ ] **Step 1: Write the failing test**

`src/app/api/discovery/session/submit/__tests__/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@vercel/postgres", () => ({
  sql: vi.fn().mockResolvedValue({ rows: [] }),
}));

vi.mock("@/lib/db", () => ({
  ensureDiscoverySessionsTable: vi.fn().mockResolvedValue(undefined),
}));

const mockSend = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mockSend };
  },
}));

import { POST } from "../route";
import { sql } from "@vercel/postgres";

const ROW = { email: "jane@acme.com", first_name: "Jane", company: "Acme" };

function makeRequest(body: unknown, cookie = "pse_discovery=tok"): Request {
  return new Request("http://localhost/api/discovery/session/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", cookie },
    body: JSON.stringify(body),
  });
}

describe("POST /api/discovery/session/submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSend.mockResolvedValue({ data: { id: "test-id" }, error: null });
  });

  it("finalizes the session and notifies internally", async () => {
    vi.mocked(sql).mockResolvedValueOnce({ rows: [ROW] } as never);
    const res = await POST(makeRequest({ answers: { organizationSize: "51-200" } }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "info@payrollsynergyexperts.com",
        subject: "Discovery questionnaire submitted: Acme",
      })
    );
  });

  it("rejects invalid answers with 400 and no DB write", async () => {
    const res = await POST(makeRequest({ answers: { reportingMaturity: 99 } }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("invalid_answers");
    expect(sql).not.toHaveBeenCalled();
  });

  it("returns 401 when no editable session matches", async () => {
    const res = await POST(makeRequest({ answers: {} }));
    expect(res.status).toBe(401);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("still succeeds when the notification email fails", async () => {
    vi.mocked(sql).mockResolvedValueOnce({ rows: [ROW] } as never);
    mockSend.mockRejectedValueOnce(new Error("Resend down"));
    const res = await POST(makeRequest({ answers: {} }));
    expect(res.status).toBe(200);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/api/discovery/session/submit`
Expected: FAIL — route module doesn't exist.

- [ ] **Step 3: Implement `src/app/api/discovery/session/submit/route.ts`**

```ts
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { Resend } from "resend";
import { ensureDiscoverySessionsTable } from "@/lib/db";
import { hashToken } from "@/lib/discovery/tokens";
import { readDiscoveryCookie } from "@/lib/discovery/session";
import { validateAnswers } from "@/lib/discovery/validation";
import { discoverySubmissionHtml } from "@/lib/emails";

const NOTIFICATION_EMAIL =
  process.env.NOTIFICATION_EMAIL || "info@payrollsynergyexperts.com";

export async function POST(request: Request) {
  const token = readDiscoveryCookie(request);
  if (!token) {
    return NextResponse.json({ error: "no_session" }, { status: 401 });
  }
  try {
    const body = await request.json().catch(() => null);
    const result = validateAnswers((body as { answers?: unknown } | null)?.answers ?? null);
    if (!result.ok) {
      return NextResponse.json({ error: "invalid_answers" }, { status: 400 });
    }

    await ensureDiscoverySessionsTable();
    const { rows } = await sql`
      UPDATE discovery_sessions
      SET answers = ${JSON.stringify(result.answers)}::jsonb,
          completed = TRUE,
          completed_at = NOW(),
          updated_at = NOW()
      WHERE session_token_hash = ${hashToken(token)}
        AND completed = FALSE
        AND expires_at > NOW()
      RETURNING email, first_name, company
    `;
    if (rows.length === 0) {
      return NextResponse.json({ error: "no_session" }, { status: 401 });
    }

    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "PSE Marketing <noreply@payrollsynergyexperts.com>",
        to: NOTIFICATION_EMAIL,
        subject: `Discovery questionnaire submitted: ${rows[0].company || rows[0].email}`,
        html: discoverySubmissionHtml({
          firstName: rows[0].first_name,
          email: rows[0].email,
          company: rows[0].company,
          answers: result.answers,
        }),
      });
    } catch (emailError) {
      console.error("Discovery submission notification error:", emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Discovery submit error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/api/discovery/session/submit`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/app/api/discovery/session/submit
git commit -m "feat(discovery): submit endpoint finalizing session with internal notification"
```

---

### Task 9: `/discovery` page + questionnaire client

**Files:**
- Create: `src/app/discovery/page.tsx`
- Create: `src/app/discovery/QuestionnaireClient.tsx` (Appendix A, complete)

**Interfaces:**
- Consumes: the three session endpoints (Tasks 6–8) — the client fetches `/api/discovery/session`, `/api/discovery/session/save`, `/api/discovery/session/submit` with the exact request/response shapes those tasks produce.
- Produces: the public questionnaire page. Noindex.

- [ ] **Step 1: Create `src/app/discovery/page.tsx`**

```tsx
import type { Metadata } from "next";
import QuestionnaireClient from "./QuestionnaireClient";

export const metadata: Metadata = {
  title: "Governance Discovery | Payroll Synergy Experts",
  description:
    "A five-minute discovery questionnaire on your payroll environment and priorities. No payroll data or employee information is requested.",
  robots: { index: false, follow: false },
};

export default function DiscoveryPage() {
  return <QuestionnaireClient />;
}
```

- [ ] **Step 2: Create `src/app/discovery/QuestionnaireClient.tsx` from Appendix A**

Copy Appendix A verbatim. It already contains the corrected `payrollFrequencies` select (`onChange={(e) => update({ payrollFrequencies: e.target.value })}` — the spec draft was missing the `onChange={(e) =>` fragment).

- [ ] **Step 3: Typecheck, lint, and full test run**

Run: `npx tsc --noEmit && npx next lint && npx vitest run`
Expected: all pass.

- [ ] **Step 4: Manual verification (dev server, no DB required for the empty states)**

Run: `npm run dev`, open `http://localhost:3000/discovery`.
Expected: the "This discovery link is no longer active" card (no cookie → 401 → `no-session` state). With `POSTGRES_URL` configured, insert a test row and claim it:

```sql
-- token 'testtoken1' hashes to the value below via: node -e "console.log(require('crypto').createHash('sha256').update('testtoken1').digest('hex'))"
INSERT INTO discovery_sessions (email, first_name, company, invite_token_hash, expires_at)
VALUES ('you@test.com', 'Test', 'TestCo', '<hash from the node one-liner>', NOW() + INTERVAL '14 days');
```

Visit `http://localhost:3000/api/discovery/claim?t=testtoken1` → redirected to `/discovery` with the form rendered, header "Test, tell us about payroll at TestCo". Fill a field, wait 2s → "Progress saved". Reload → the value persists. Submit → confirmation card; reload → still the confirmation card (read-only).

- [ ] **Step 5: Commit**

```bash
git add src/app/discovery
git commit -m "feat(discovery): governance discovery questionnaire page with autosave and resume"
```

---

### Task 10: Demo-request integration — jobTitle, journey email, invite issuance

**Files:**
- Modify: `src/app/api/demo-request/route.ts`
- Modify: `src/app/api/demo-request/__tests__/route.test.ts`
- Modify: `src/components/forms/DemoRequestForm.tsx`
- Modify: `.env.example`

**Interfaces:**
- Consumes: `journeyEmailHtml`, `questionnaireInviteHtml`, `internalNotificationHtml` (Task 1); `generateToken`/`hashToken` (Task 2); `ensureDiscoverySessionsTable` (Task 4).
- Produces: `POST /api/demo-request` now (1) inserts the request incl. `job_title`, (2) creates a discovery session with a 14-day invite, (3) sends three emails via `Promise.allSettled`: internal notification, journey email #1 (video block iff `PSE_OVERVIEW_VIDEO_URL` is set), questionnaire invite carrying `/api/discovery/claim?t=<raw>`.

- [ ] **Step 1: Update the existing test file**

Replace the "sends two emails" test and add coverage. In `src/app/api/demo-request/__tests__/route.test.ts`, also mock `ensureDiscoverySessionsTable` in the `@/lib/db` factory:

```ts
vi.mock("@/lib/db", () => ({
  ensureDemoRequestsTable: vi.fn().mockResolvedValue(undefined),
  ensureDiscoverySessionsTable: vi.fn().mockResolvedValue(undefined),
}));
```

Replace the `sends two emails` test with:

```ts
  it("sends internal notification, journey email, and questionnaire invite", async () => {
    await POST(makeRequest({ name: "Jane Smith", email: "jane@test.com", company: "Acme" }));

    expect(mockSend).toHaveBeenCalledTimes(3);

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "info@payrollsynergyexperts.com",
        subject: "New Demo Request: Acme",
      })
    );
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "jane@test.com",
        subject: "Before we meet — how PSE works",
      })
    );
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "jane@test.com",
        subject: "Your governance discovery questionnaire — Payroll Synergy Experts",
      })
    );
  });

  it("puts a one-time claim link in the invite email without logging it", async () => {
    await POST(makeRequest({ name: "Jane Smith", email: "jane@test.com" }));

    const invite = mockSend.mock.calls
      .map((c) => c[0])
      .find((m) => String(m.subject).includes("questionnaire"));
    expect(invite.html).toMatch(/\/api\/discovery\/claim\?t=[A-Za-z0-9_-]{43}/);
  });

  it("greets the requester by first name in the journey email", async () => {
    await POST(makeRequest({ name: "Jane Smith", email: "jane@test.com" }));

    const journey = mockSend.mock.calls
      .map((c) => c[0])
      .find((m) => m.subject === "Before we meet — how PSE works");
    expect(journey.html).toContain("Hi Jane,");
  });
```

Update the old auto-response assertion (`subject: "We received your demo request — Payroll Synergy Experts"`) — delete it; the journey email replaces the auto-response. Keep every other existing test unchanged (honeypot, 400s, 500, from-domain, subject fallback).

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/app/api/demo-request`
Expected: FAIL — route still sends two emails with old subjects.

- [ ] **Step 3: Replace `src/app/api/demo-request/route.ts`**

```ts
import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { Resend } from "resend";
import { ensureDemoRequestsTable, ensureDiscoverySessionsTable } from "@/lib/db";
import {
  internalNotificationHtml,
  journeyEmailHtml,
  questionnaireInviteHtml,
} from "@/lib/emails";
import { generateToken, hashToken } from "@/lib/discovery/tokens";

const NOTIFICATION_EMAIL =
  process.env.NOTIFICATION_EMAIL || "info@payrollsynergyexperts.com";
const DISCOVERY_TTL_DAYS = 14;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, employees, jobTitle, website, source } = body;

    // Honeypot check
    if (website) {
      return NextResponse.json({ success: true });
    }

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const ALLOWED_SOURCES = ["pse-marketing", "benefits-interest"] as const;
    const safeSource = ALLOWED_SOURCES.includes(source) ? source : "pse-marketing";

    await ensureDemoRequestsTable();
    await sql`
      INSERT INTO demo_requests (name, email, company, employees, job_title, source)
      VALUES (${name}, ${email}, ${company || null}, ${employees || null}, ${jobTitle || null}, ${safeSource})
    `;

    // Discovery session: raw invite token lives only in the email below.
    await ensureDiscoverySessionsTable();
    const inviteToken = generateToken();
    const firstName = String(name).trim().split(/\s+/)[0];
    await sql`
      INSERT INTO discovery_sessions (email, first_name, company, invite_token_hash, expires_at)
      VALUES (${email}, ${firstName}, ${company || ""}, ${hashToken(inviteToken)}, NOW() + INTERVAL '14 days')
    `;
    const discoveryUrl = `${new URL(request.url).origin}/api/discovery/claim?t=${inviteToken}`;

    const resend = new Resend(process.env.RESEND_API_KEY);
    const emailResults = await Promise.allSettled([
      resend.emails.send({
        from: "PSE Marketing <noreply@payrollsynergyexperts.com>",
        to: NOTIFICATION_EMAIL,
        subject: `New Demo Request: ${company || name}`,
        html: internalNotificationHtml({ name, email, company, employees, jobTitle }),
      }),
      resend.emails.send({
        from: "Payroll Synergy Experts <noreply@payrollsynergyexperts.com>",
        to: email,
        subject: "Before we meet — how PSE works",
        html: journeyEmailHtml({
          firstName,
          videoUrl: process.env.PSE_OVERVIEW_VIDEO_URL || undefined,
        }),
      }),
      resend.emails.send({
        from: "Payroll Synergy Experts <noreply@payrollsynergyexperts.com>",
        to: email,
        subject: "Your governance discovery questionnaire — Payroll Synergy Experts",
        html: questionnaireInviteHtml({
          firstName,
          discoveryUrl,
          expiresDays: DISCOVERY_TTL_DAYS,
        }),
      }),
    ]);

    const emailErrors = emailResults.filter((r) => r.status === "rejected");
    if (emailErrors.length > 0) {
      console.error(
        "Email errors:",
        emailErrors.map((r) => (r as PromiseRejectedResult).reason)
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Demo request error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
```

(Note: the `'14 days'` interval is a static SQL literal; `DISCOVERY_TTL_DAYS` feeds only the email copy — keep the two in sync.)

- [ ] **Step 4: Add the optional Job title field to `DemoRequestForm.tsx`**

In the `useState` initializer add `jobTitle: ""` after `company: ""`. Then insert this block between the **Company** div and the **Employees** div (inside the existing grid):

```tsx
                  <div>
                    <label
                      htmlFor="jobTitle"
                      className="block text-[13px] font-semibold text-text mb-1.5"
                    >
                      Job Title
                    </label>
                    <input
                      id="jobTitle"
                      name="jobTitle"
                      type="text"
                      placeholder="VP of Payroll"
                      value={formData.jobTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, jobTitle: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-border rounded-lg text-[15px] font-sans outline-none focus:border-steel-light focus:ring-1 focus:ring-steel-light transition-colors bg-white placeholder:text-text-tertiary"
                    />
                  </div>
```

(The form already spreads `...formData` into the POST body, so no submit change is needed.)

- [ ] **Step 5: Update `.env.example`**

Append:

```bash

# Overview video for journey email #1 — omit to send the email without the
# video block. Set only after the video is approved (see docs/video/demo-v1/).
# PSE_OVERVIEW_VIDEO_URL=
```

- [ ] **Step 6: Run all tests + typecheck**

Run: `npx vitest run && npx tsc --noEmit`
Expected: full suite PASS.

- [ ] **Step 7: Commit**

```bash
git add src/app/api/demo-request src/components/forms/DemoRequestForm.tsx .env.example
git commit -m "feat(discovery): wire demo request into journey email and questionnaire invite"
```

---

### Task 11: Demo video package (Stage A docs)

**Files:**
- Create: `docs/video/demo-v1/README.md` (Appendix C)
- Create: `docs/video/demo-v1/founder-intro-script.md` (Appendix D)
- Create: `docs/video/demo-v1/storyboard.json` (Appendix E)
- Create: `docs/video/demo-v1/narration.txt` (Appendix F)
- Create: `docs/video/demo-v1/recording-plan.md` (Appendix G)
- Create: `docs/video/demo-v1/video-manifest.template.json` (Appendix H)
- Create: `docs/video/demo-v1/demo-contract.yaml` (Appendix I)

Docs-only task; no product code is touched. **No recording is produced by this task** — Stage B is gated on the `demo-v1.0-frozen` tag in PSE--Projects.

- [ ] **Step 1: Create all seven files from Appendices C–I, verbatim**

- [ ] **Step 2: Verify JSON validity and stats traceability**

Run: `node -e "JSON.parse(require('fs').readFileSync('docs/video/demo-v1/storyboard.json','utf8')); JSON.parse(require('fs').readFileSync('docs/video/demo-v1/video-manifest.template.json','utf8')); console.log('json ok')"`
Expected: `json ok`.

Cross-check every quantified claim in `narration.txt` and `founder-intro-script.md` against `src/lib/stats.ts`: $149.9M / FY2024 / 125,000+ workers → `dolBackWages`; "roughly a third of employers" → `irsEmployerErrors` (33%); "as much as fifteen percent" → `irsMaxDepositPenalty` (IRC §6656). All three must match; if any figure in a future revision has no `stats.ts` entry, stop and flag it.

- [ ] **Step 3: Boundary test (content rule from the package README)**

Read the script and narration once more and confirm: could a competitor salesperson conclude PSE competes for payroll *processing*? The text must keep "your system of record executes; PSE governs" intact in chapters 2 and 8. If it doesn't, the copy is wrong — fix before committing.

- [ ] **Step 4: Commit**

```bash
git add docs/video/demo-v1
git commit -m "docs(video): demo-v1 Stage A package — scripts, storyboard, narration, recording plan, manifest template, demo contract skeleton"
```

---

### Task 12: PSE Framework source docs

**Files:**
- Create: `docs/framework/README.md` (Appendix J)
- Create: `docs/framework/01-payroll-operations.md` (Appendix K)
- Create: `docs/framework/02-workforce-data.md` (Appendix L)
- Create: `docs/framework/03-compliance.md` (Appendix M)
- Create: `docs/framework/04-risk-and-controls.md` (Appendix N)
- Create: `docs/framework/05-governance.md` (Appendix O)
- Create: `docs/framework/06-workforce-intelligence.md` (Appendix P)
- Create: `docs/framework/07-technology-and-automation.md` (Appendix Q)
- Modify: `docs/POSITIONING_STRATEGY.md` (append Appendix R sections — **do not create or overwrite**; the file exists on `main` with the canonical "PSE Is Not" list)
- Modify: `docs/MARKETING_SITE_PLAN.md` (site map → shipped reality)

**Interfaces:**
- Produces: the canonical framework content that Task 13 transcribes into `src/data/framework.ts`. The docs are the source of truth; the site data module must match them verbatim.

Docs-only task. Appendices carry the reviewed content with two line-level fixes already applied (Scope Decisions #12 and #13) — copy verbatim, do not re-edit.

- [ ] **Step 0: Sync with remote**

Run: `git pull --ff-only origin main`
Expected: `docs/POSITIONING_STRATEGY.md` and `docs/MARKETING_SITE_PLAN.md` exist locally. If they don't, stop — do not create them from scratch.

- [ ] **Step 1: Create the eight framework files from Appendices J–Q, verbatim**

- [ ] **Step 2: Append Appendix R's two sections to the END of `docs/POSITIONING_STRATEGY.md`**

Leave every existing section (Core Position, PSE Is, PSE Is Not, Competitive Position, Future Position) byte-for-byte untouched. Append only.

- [ ] **Step 3: Update the site map in `docs/MARKETING_SITE_PLAN.md`**

Replace the `## Site Map` section (currently six routes, five of which are not built) with:

```markdown
## Site Map (shipped)

/
/services
/services/[slug]   — payroll-processing, tax-compliance, workforce-analytics,
                     benefits-integration, system-integration, strategic-advisory
/framework
/framework/[slug]  — seven governance domains (source: docs/framework/)
/chap-ai
/compliance-risk
/privacy
/terms

## Planned — not built

/platform
/use-cases
/resources         — content engine has zero published pieces
/contact           — demo capture currently lives at /#demo on the homepage
```

(`/framework` is listed as shipped because Tasks 13–15 of this plan build it; if this task is executed standalone before them, add "(in progress)" next to the two framework lines.)

- [ ] **Step 4: Boundary lint (manual)**

Run: `grep -nE "PSE (performs|processes|executes|funds|deposits|releases|transmits)" docs/framework/*.md`
Expected: **no matches.** (Negated forms like "PSE does not perform" are fine and won't match this pattern.)

- [ ] **Step 5: Commit**

```bash
git add docs/framework docs/POSITIONING_STRATEGY.md docs/MARKETING_SITE_PLAN.md
git commit -m "docs(framework): seven governance domains; extend positioning doc; true up site plan"
```

---

### Task 13: Framework data module

**Files:**
- Create: `src/data/framework.ts`
- Test: `src/data/__tests__/framework.test.ts`

**Interfaces:**
- Consumes: `docs/framework/*.md` (Task 12) as transcription source.
- Produces (used by Tasks 14–15):
  - `FRAMEWORK_ONE_RULE: string`
  - `FRAMEWORK_SLUGS: readonly string[]` — in domain order
  - `frameworkDomains: Record<string, FrameworkDomain>`
  - Types `FrameworkDomain`, `FrameworkSubdomain` exactly as below.

- [ ] **Step 1: Write the failing test**

`src/data/__tests__/framework.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { frameworkDomains, FRAMEWORK_SLUGS, FRAMEWORK_ONE_RULE } from "../framework";

describe("PSE Framework data", () => {
  it("has the seven domains in order", () => {
    expect(FRAMEWORK_SLUGS).toEqual([
      "payroll-operations",
      "workforce-data",
      "compliance",
      "risk-and-controls",
      "governance",
      "workforce-intelligence",
      "technology-and-automation",
    ]);
    expect(Object.keys(frameworkDomains)).toHaveLength(7);
  });

  it("states the one rule", () => {
    expect(FRAMEWORK_ONE_RULE).toBe(
      "The system of record executes the transaction. PSE governs the environment."
    );
  });

  it("keeps every page structurally complete", () => {
    for (const slug of FRAMEWORK_SLUGS) {
      const d = frameworkDomains[slug];
      expect(d.slug).toBe(slug);
      expect(d.h1.endsWith("Governance")).toBe(true);
      expect(d.navLabel.length).toBeGreaterThan(0);
      expect(d.metaDescription.length).toBeGreaterThan(40);
      expect(d.purpose.length).toBeGreaterThanOrEqual(2);
      expect(d.definition.length).toBeGreaterThanOrEqual(1);
      expect(d.corePrinciples.length).toBeGreaterThanOrEqual(6);
      expect(d.subdomains.length).toBeGreaterThanOrEqual(6);
      for (const sub of d.subdomains) {
        expect(sub.title).toBeTruthy();
        expect(sub.objective).toBeTruthy();
        expect(sub.scope.length).toBeGreaterThan(0);
        expect(sub.keyActivities).toBeTruthy();
        expect(sub.indicators.length).toBeGreaterThan(0);
      }
      expect(d.maturity.map((m) => m.level)).toEqual(["L1", "L2", "L3", "L4", "L5"]);
      expect(d.maturity.map((m) => m.name)).toEqual([
        "Reactive", "Managed", "Controlled", "Optimized", "Governed",
      ]);
      expect(d.outcomes.length).toBeGreaterThanOrEqual(4);
      expect(d.perspective).toBeTruthy();
    }
  });

  it("never gives PSE an execution verb (boundary lint)", () => {
    const banned = /PSE (performs|processes|executes|funds|deposits|releases|transmits)/;
    for (const slug of FRAMEWORK_SLUGS) {
      expect(JSON.stringify(frameworkDomains[slug])).not.toMatch(banned);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/framework.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Implement `src/data/framework.ts`**

Types, constants, and the fully worked Domain 2 entry are below. **Transcribe the other six domains from `docs/framework/*.md` (committed in Task 12) the same way**, applying these deterministic rules:

- `h1` / `navLabel`: from the README table.
- `metaDescription`: the first sentence of the page's Purpose section, trimmed.
- `purpose` / `definition`: one array item per markdown paragraph, text verbatim.
- `corePrinciples`: split the principles line on `·`, trim each. A trailing prose sentence (Domains 1 and 2 have one) becomes `principlesNote`.
- Each `### N. <title>` block → one `FrameworkSubdomain`; `scope` and `indicators` split on `·`; `objective` and `keyActivities` verbatim prose.
- `maturity`: the five bolded ladder entries; `desc` is the text after the em-dash, verbatim.
- `outcomes`: split the Expected Outcomes line on `·`.
- `perspective`: the PSE Perspective paragraph verbatim.

```ts
// PSE Framework — seven governance domains. Source of truth is
// docs/framework/*.md; this module is a verbatim transcription for the
// /framework pages. Edit the docs first, then mirror here.

export interface FrameworkSubdomain {
  title: string;
  objective: string;
  scope: string[];
  keyActivities: string;
  indicators: string[];
}

export interface FrameworkMaturityLevel {
  level: string;
  name: string;
  desc: string;
}

export interface FrameworkDomain {
  slug: string;
  number: number;
  h1: string;
  navLabel: string;
  metaDescription: string;
  purpose: string[];
  definition: string[];
  corePrinciples: string[];
  principlesNote?: string;
  subdomains: FrameworkSubdomain[];
  maturity: FrameworkMaturityLevel[];
  outcomes: string[];
  perspective: string;
}

export const FRAMEWORK_ONE_RULE =
  "The system of record executes the transaction. PSE governs the environment.";

export const FRAMEWORK_SLUGS = [
  "payroll-operations",
  "workforce-data",
  "compliance",
  "risk-and-controls",
  "governance",
  "workforce-intelligence",
  "technology-and-automation",
] as const;

const STANDARD_LEVELS = ["Reactive", "Managed", "Controlled", "Optimized", "Governed"];

function maturity(descs: [string, string, string, string, string]): FrameworkMaturityLevel[] {
  return descs.map((desc, i) => ({ level: `L${i + 1}`, name: STANDARD_LEVELS[i], desc }));
}

export const frameworkDomains: Record<string, FrameworkDomain> = {
  // ── Domain 1 — transcribe from docs/framework/01-payroll-operations.md ──

  // ── Domain 2 (fully worked reference entry) ──
  "workforce-data": {
    slug: "workforce-data",
    number: 2,
    h1: "Workforce Data Governance",
    navLabel: "Workforce Data",
    metaDescription:
      "How PSE ensures the workforce data flowing into payroll is accurate, complete, timely, and governed — before it reaches the run.",
    purpose: [
      "The Workforce Data Governance domain defines how PSE ensures the workforce data flowing into payroll is accurate, complete, timely, and governed — before it reaches the run.",
      "Payroll is only as correct as the data feeding it. PSE does not own the HRIS, the timekeeping system, or the system of record. PSE governs the integrity of the data those systems hand to payroll, so errors are caught at the source rather than discovered in a paycheck.",
    ],
    definition: [
      "Workforce Data is the master, time, and compensation data — originated and maintained in your HRIS, WFM, and benefits systems — that drives payroll calculation. PSE does not author or maintain these records. PSE validates them, monitors the integrations that move them, and documents the exceptions before they affect a run.",
      "The systems of record own the data. PSE governs its fitness for payroll.",
    ],
    corePrinciples: [
      "Accuracy", "Completeness", "Consistency", "Timeliness", "Validity", "Governed Ownership",
    ],
    principlesNote:
      "Each is enforced through validation and monitoring, not by replacing the source system.",
    subdomains: [
      {
        title: "Employee Master Data Governance",
        objective: "Validate that employee records feeding payroll are accurate and current.",
        scope: ["demographics", "employment status", "organizational hierarchy", "position data", "location data"],
        keyActivities:
          "Validate master records against payroll requirements; flag missing or stale fields; document corrections back to the source owner. PSE does not maintain the HRIS — it validates what the HRIS provides.",
        indicators: ["master-data accuracy rate", "stale-record count", "time-to-correction"],
      },
      {
        title: "Workforce Management Data Governance",
        objective: "Verify time and attendance data is valid before it enters the run.",
        scope: ["time punches", "schedules", "attendance", "leave", "overtime"],
        keyActivities:
          "Validate WFM data integrity; flag missing punches, impossible hours, and unapproved overtime; document exceptions. PSE does not run the clock or approve time on behalf of managers.",
        indicators: ["time-data exception rate", "unapproved-overtime flags", "correction lead time"],
      },
      {
        title: "Compensation Data Governance",
        objective: "Verify compensation data matches policy and elections before pay is calculated.",
        scope: ["base pay", "variable pay", "incentive compensation", "shift differentials", "premium pay"],
        keyActivities:
          "Validate pay data against policy and approved elections; flag rate mismatches; document. PSE does not set or change pay rates — it verifies them.",
        indicators: ["rate-mismatch flags", "validation coverage", "open compensation exceptions"],
      },
      {
        title: "Integration Governance",
        objective: "Monitor the integrity of data crossing system boundaries.",
        scope: ["HRIS", "payroll", "WFM", "benefits", "finance integrations"],
        keyActivities:
          "Monitor integration success/failure; flag dropped, duplicated, or malformed records; document integration breaks. PSE governs the data crossing the pipes; it does not own the source systems.",
        indicators: ["integration success rate", "failed-sync count", "records reconciled across systems"],
      },
      {
        title: "Data Quality Management",
        objective: "Measure and enforce data quality dimensions on payroll-bound data.",
        scope: ["accuracy", "completeness", "consistency", "timeliness", "validity"],
        keyActivities:
          "Profile incoming data; flag quality breaks against thresholds; document trend and root cause.",
        indicators: ["data accuracy %", "completeness %", "open data exceptions"],
      },
      {
        title: "Data Stewardship & Governance",
        objective: "Define accountability for the data payroll depends on.",
        scope: ["ownership", "stewardship", "standards", "security", "retention"],
        keyActivities:
          "Define data owners and stewards; set validation standards; govern access and retention of payroll-relevant data.",
        indicators: ["assigned-ownership coverage", "standards adherence", "governance reviews completed"],
      },
    ],
    maturity: maturity([
      "errors found in paychecks",
      "basic source checks",
      "formal validation rules and stewardship",
      "automated quality monitoring across integrations",
      "continuous, governed data integrity with full lineage and oversight",
    ]),
    outcomes: [
      "Trusted workforce data",
      "reduced payroll errors at source",
      "better compliance readiness",
      "improved reporting accuracy",
      "faster correction cycles",
    ],
    perspective:
      "Workforce data is the foundation of every payroll run, and most payroll errors are data errors. PSE does not replace the systems that hold the data — it governs whether that data is fit to drive pay, catching breaks before they reach an employee.",
  },

  // ── Domains 1, 3, 4, 5, 6, 7 — transcribe from docs/framework/ files
  //    with the exact same shape and rules stated above. ──
};
```

(Order the object entries 1→7; the reference entry above shows Domain 2's final position within that order.)

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/__tests__/framework.test.ts`
Expected: PASS (4 tests). If the boundary-lint test fails, the transcription drifted from the docs — fix the data, not the test.

- [ ] **Step 5: Spot-check transcription fidelity**

For each of the six transcribed domains, diff the `perspective` string and one randomly chosen `keyActivities` string against the markdown by eye (or `grep -F` the exact sentence in the doc). Verbatim means verbatim.

- [ ] **Step 6: Commit**

```bash
git add src/data/framework.ts src/data/__tests__/framework.test.ts
git commit -m "feat(framework): typed data module for the seven governance domains"
```

---

### Task 14: Framework pages — index + domain template

**Files:**
- Create: `src/components/templates/FrameworkDomainPage.tsx`
- Create: `src/app/framework/page.tsx`
- Create: `src/app/framework/[slug]/page.tsx`

**Interfaces:**
- Consumes: `frameworkDomains`, `FRAMEWORK_SLUGS`, `FRAMEWORK_ONE_RULE`, `FrameworkDomain` (Task 13).
- Produces: indexable `/framework` and `/framework/<slug>` routes, statically generated.

- [ ] **Step 1: Create `src/components/templates/FrameworkDomainPage.tsx`**

```tsx
import Link from "next/link";
import {
  frameworkDomains,
  FRAMEWORK_SLUGS,
  FRAMEWORK_ONE_RULE,
  type FrameworkDomain,
} from "@/data/framework";

export function FrameworkDomainPage({ domain }: { domain: FrameworkDomain }) {
  const idx = FRAMEWORK_SLUGS.indexOf(domain.slug as (typeof FRAMEWORK_SLUGS)[number]);
  const prev = idx > 0 ? frameworkDomains[FRAMEWORK_SLUGS[idx - 1]] : null;
  const next = idx < FRAMEWORK_SLUGS.length - 1 ? frameworkDomains[FRAMEWORK_SLUGS[idx + 1]] : null;

  return (
    <main className="bg-ice min-h-screen">
      <div className="max-w-[880px] mx-auto px-6 py-20">
        <nav className="text-[13px] text-text-tertiary mb-6">
          <Link href="/framework" className="hover:text-steel transition-colors">
            PSE Framework
          </Link>{" "}
          / Domain {domain.number}
        </nav>

        <header className="mb-10">
          <span className="inline-block text-xs font-semibold text-steel uppercase tracking-[0.08em] mb-3">
            PSE Framework — Domain {domain.number} of {FRAMEWORK_SLUGS.length}
          </span>
          <h1 className="text-[clamp(2rem,4.5vw,2.75rem)] font-bold tracking-[-0.02em] text-text mb-5">
            {domain.h1}
          </h1>
          <blockquote className="border-l-4 border-navy bg-white rounded-r-xl px-5 py-4 text-[15px] font-semibold text-text">
            {FRAMEWORK_ONE_RULE}
          </blockquote>
        </header>

        <Section heading="Purpose">
          {domain.purpose.map((p, i) => (
            <p key={i} className="text-[16px] text-text-secondary leading-[1.75] mb-4 last:mb-0">
              {p}
            </p>
          ))}
        </Section>

        <Section heading="Definition">
          {domain.definition.map((p, i) => (
            <p key={i} className="text-[16px] text-text-secondary leading-[1.75] mb-4 last:mb-0">
              {p}
            </p>
          ))}
        </Section>

        <Section heading="Core Principles">
          <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
            {domain.corePrinciples.map((principle) => (
              <li
                key={principle}
                className="px-3.5 py-1.5 bg-white border border-border rounded-full text-[13px] font-semibold text-text"
              >
                {principle}
              </li>
            ))}
          </ul>
          {domain.principlesNote && (
            <p className="text-[14px] text-text-tertiary mt-4">{domain.principlesNote}</p>
          )}
        </Section>

        <Section heading="Governance Domains">
          <div className="flex flex-col gap-5">
            {domain.subdomains.map((sub, i) => (
              <article
                key={sub.title}
                className="bg-white rounded-2xl border border-border shadow-sm p-7"
              >
                <h3 className="text-[17px] font-bold text-text mb-3">
                  {i + 1}. {sub.title}
                </h3>
                <SubField label="Objective">{sub.objective}</SubField>
                <SubField label="Scope">{sub.scope.join(" · ")}</SubField>
                <SubField label="Key Activities">{sub.keyActivities}</SubField>
                <SubField label="Indicators">{sub.indicators.join(" · ")}</SubField>
              </article>
            ))}
          </div>
        </Section>

        <Section heading="Maturity Model">
          <ol className="grid grid-cols-1 sm:grid-cols-5 gap-3 list-none p-0 m-0">
            {domain.maturity.map((m) => (
              <li key={m.level} className="bg-white border border-border rounded-xl p-4">
                <div className="text-xs font-bold text-steel mb-1">
                  {m.level} · {m.name}
                </div>
                <div className="text-[13px] text-text-secondary leading-[1.5]">{m.desc}</div>
              </li>
            ))}
          </ol>
        </Section>

        <Section heading="Expected Outcomes">
          <ul className="list-disc pl-5 text-[15px] text-text-secondary leading-[1.9]">
            {domain.outcomes.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </Section>

        <Section heading="PSE Perspective">
          <div className="bg-navy text-white rounded-2xl p-7 text-[15px] leading-[1.75]">
            {domain.perspective}
          </div>
        </Section>

        <nav className="flex justify-between gap-4 mt-12 pt-8 border-t border-border text-[14px] font-semibold">
          {prev ? (
            <Link href={`/framework/${prev.slug}`} className="text-steel hover:text-navy transition-colors">
              ← {prev.navLabel}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/framework/${next.slug}`} className="text-steel hover:text-navy transition-colors">
              {next.navLabel} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </main>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-[13px] font-bold text-steel uppercase tracking-[0.08em] mb-4">
        {heading}
      </h2>
      {children}
    </section>
  );
}

function SubField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p className="text-[14px] text-text-secondary leading-[1.7] mb-2 last:mb-0">
      <span className="font-semibold text-text">{label}: </span>
      {children}
    </p>
  );
}
```

- [ ] **Step 2: Create `src/app/framework/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { frameworkDomains, FRAMEWORK_SLUGS, FRAMEWORK_ONE_RULE } from "@/data/framework";

export const metadata: Metadata = {
  title: "The PSE Framework — Payroll Governance Model | Payroll Synergy Experts",
  description:
    "A single governance model for the payroll control environment: seven domains defining how PSE governs, validates, and documents payroll — across whichever system of record executes it.",
};

export default function FrameworkIndexPage() {
  return (
    <main className="bg-ice min-h-screen">
      <div className="max-w-[880px] mx-auto px-6 py-20">
        <header className="mb-12">
          <span className="inline-block text-xs font-semibold text-steel uppercase tracking-[0.08em] mb-3">
            PSE Framework
          </span>
          <h1 className="text-[clamp(2rem,4.5vw,2.75rem)] font-bold tracking-[-0.02em] text-text mb-4">
            One governance model for the payroll control environment
          </h1>
          <p className="text-[17px] text-text-secondary leading-[1.7] mb-6">
            The PSE Framework defines the disciplines PSE applies to govern,
            validate, and document payroll — across whichever system of record
            executes it.
          </p>
          <blockquote className="border-l-4 border-navy bg-white rounded-r-xl px-5 py-4 text-[16px] font-semibold text-text">
            {FRAMEWORK_ONE_RULE}
          </blockquote>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FRAMEWORK_SLUGS.map((slug) => {
            const d = frameworkDomains[slug];
            return (
              <Link
                key={slug}
                href={`/framework/${slug}`}
                className="bg-white rounded-2xl border border-border shadow-sm p-7 hover:shadow-md hover:-translate-y-px transition-all"
              >
                <div className="text-xs font-bold text-steel mb-2">Domain {d.number}</div>
                <h2 className="text-[17px] font-bold text-text mb-2">{d.h1}</h2>
                <p className="text-[14px] text-text-secondary leading-[1.6]">
                  {d.metaDescription}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Create `src/app/framework/[slug]/page.tsx`** (mirrors `services/[slug]`)

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { frameworkDomains, FRAMEWORK_SLUGS } from "@/data/framework";
import { FrameworkDomainPage } from "@/components/templates/FrameworkDomainPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return FRAMEWORK_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const domain = frameworkDomains[slug];
  if (!domain) return {};
  return {
    title: `${domain.h1} | PSE Framework | Payroll Synergy Experts`,
    description: domain.metaDescription,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const domain = frameworkDomains[slug];
  if (!domain) notFound();
  return <FrameworkDomainPage domain={domain} />;
}
```

- [ ] **Step 4: Build and eyeball**

Run: `npx tsc --noEmit && npm run build`
Expected: build succeeds; the route list shows `/framework` and 7 static `/framework/[slug]` pages. Then `npm run dev` → open `/framework` and one domain page; check heading hierarchy, prev/next links, and that the one-rule banner renders on both.

- [ ] **Step 5: Commit**

```bash
git add src/components/templates/FrameworkDomainPage.tsx src/app/framework
git commit -m "feat(framework): /framework index and domain pages"
```

---

### Task 15: Navigation + sitemap

**Files:**
- Modify: `src/lib/constants.ts` (NAV_LINKS)
- Modify: `src/app/sitemap.ts`

**Interfaces:**
- Consumes: `FRAMEWORK_SLUGS` (Task 13), `SERVICE_SLUGS` (existing, exported by `src/data/services.ts`).
- Produces: "Framework" in the site nav; a sitemap that enumerates every indexable route (today it lists only the apex — a known gap).

- [ ] **Step 1: Add the nav link**

In `src/lib/constants.ts`, change `NAV_LINKS` to:

```ts
export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Framework", href: "/framework" },
  { label: "CHAP AI", href: "/chap-ai" },
  { label: "Why PSE", href: "/#proof" },
  { label: "Risk Estimator", href: "/compliance-risk" },
] as const;
```

- [ ] **Step 2: Replace `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { FRAMEWORK_SLUGS } from "@/data/framework";
import { SERVICE_SLUGS } from "@/data/services";

const BASE = "https://payrollsynergyexperts.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["", "/services", "/framework", "/chap-ai", "/compliance-risk", "/privacy", "/terms"];
  return [
    ...staticPaths.map((path) => ({
      url: `${BASE}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...SERVICE_SLUGS.map((slug) => ({
      url: `${BASE}/services/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...FRAMEWORK_SLUGS.map((slug) => ({
      url: `${BASE}/framework/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
```

(`/discovery` is deliberately absent — it is noindex, invite-only.)

- [ ] **Step 3: Verify**

Run: `npm run build`, then `npm run dev` and open `http://localhost:3000/sitemap.xml`.
Expected: apex + 6 static paths + all service slugs + 7 framework slugs. Check the navbar renders "Framework" and it navigates.

- [ ] **Step 4: Full suite**

Run: `npx vitest run && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/constants.ts src/app/sitemap.ts
git commit -m "feat(framework): add Framework to nav and enumerate routes in sitemap"
```

---

### Task 18: Reframe `/services` label/overview layer toward governance (P1 #4, option a)

**Files:**
- Modify: `src/lib/constants.ts` (one `SERVICES` card, one `STATS` tile, new import)
- Modify: `src/data/services.ts` (`payroll-processing` and `system-integration` label-layer copy)

**Interfaces:**
- Consumes: `ENFORCEMENT_STATS.hoursLostToCompliance` (existing, `src/lib/stats.ts`).
- Produces: a `/services` surface whose top-level story is governance, matching `docs/POSITIONING_STRATEGY.md`. No route, slug, prop, or component changes — copy only.

Scope discipline: the bodies of all six services already carry the boundary hedges ("your existing payroll processor executes", "PSE does not move or push funds") — **do not rewrite them.** Only the four items below change. Run each changed line through the acceptance test (could an ADP salesperson read it as PSE competing for processing?).

- [ ] **Step 1: Fix the System Integration homepage card** in `src/lib/constants.ts`

```ts
// Before
{
  icon: "Plug" as const,
  title: "System Integration",
  desc: "Connect payroll to your HRIS and workforce management platforms with pre-built integrations and custom APIs.",
},

// After
{
  icon: "Plug" as const,
  title: "System Integration",
  desc: "Governed data exchange with your HRIS and workforce platforms — every inbound record validated at the boundary before it reaches a payroll run.",
},
```

- [ ] **Step 2: Replace the unsourced "Faster processing" stat tile** in `src/lib/constants.ts`

The "50%" figure traces to nothing in `stats.ts` (a Global Constraints violation), and "Faster processing" is execution voice. Add `import { ENFORCEMENT_STATS } from "@/lib/stats";` at the top of the file, then:

```ts
// Before
{
  metric: "50%",
  label: "Faster processing",
  desc: "Automation eliminates manual data entry, reconciliation, and approval bottlenecks.",
},

// After
{
  metric: ENFORCEMENT_STATS.hoursLostToCompliance.value, // "120 hrs"
  label: "Compliance overhead exposed",
  desc: "Hours employers lose annually to resolving compliance issues — the overhead governed validation removes.",
},
```

- [ ] **Step 3: Reframe the `payroll-processing` label layer** in `src/data/services.ts`

Three edits inside the `'payroll-processing'` entry (body, remaining features, stats, and the slug stay unchanged):

```ts
// headline — before
headline: 'Automated multi-state payroll with real-time compliance validation.',
// headline — after
headline: 'Every multi-state payroll run independently validated — before it commits.',

// metaDescription — before
metaDescription: 'Multi-state payroll processing with CHAP AI pre-run compliance validation. Catch deposit timing errors, overtime violations, and statutory issues before they become IRS penalties.',
// metaDescription — after
metaDescription: 'Multi-state payroll run governance with CHAP AI pre-run compliance validation. Catch deposit timing errors, overtime violations, and statutory issues before they become IRS penalties.',

// first feature — before
{ title: 'Multi-state payroll in a single run', body: 'A single payroll run covers all active states, with per-state rule application handled automatically. No separate state runs, no manual rule lookups.' },
// first feature — after
{ title: 'Multi-state validation in a single pass', body: 'One validation pass covers every active state, with per-state rule application handled automatically. No separate state reviews, no manual rule lookups.' },
```

- [ ] **Step 4: Reframe the `system-integration` headline** in `src/data/services.ts`

```ts
// Before
headline: 'Connect payroll to your HRIS and workforce management platforms.',
// After
headline: 'Governed data exchange between payroll, HRIS, and workforce platforms.',
```

(The rest of the entry stays — connectors and APIs are a genuine platform capability that sits above the systems of record; the boundary problem was the imperative "Connect payroll" framing, not the capability.)

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npx vitest run`, then `npm run dev` → check the homepage Services grid + stats row, `/services/payroll-processing`, and `/services/system-integration` render the new copy.
Also run the extended boundary lint: `! grep -rEn "PSE (performs|processes|executes|funds|deposits|releases|transmits)" docs/framework src/data/framework.ts src/lib/constants.ts src/data/services.ts`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/constants.ts src/data/services.ts
git commit -m "fix(services): reframe label layer to governance voice; source the stats tile (P1 #4a)"
```

*Flagged, not actioned:* the URL slug `/services/payroll-processing` still carries the legacy name. Renaming it (e.g. to `governed-payroll-runs`) requires a permanent redirect in `next.config.ts` and re-indexing — a separate decision, not bundled into a copy pass.

---

### Task 16: P0 — CHAP corpus integrity (EXECUTE FIRST)

**Files:**
- Modify: `src/data/complianceCorpus.ts`
- Test: `src/data/__tests__/complianceCorpus.test.ts` (create)

**Why first:** the widget is live on `/chap-ai` with prod `ANTHROPIC_API_KEY`, answering IRC §6656 questions, while every corpus entry's `content` is the literal placeholder `"[Founder to populate with verbatim primary source text]"`. The widget's value proposition is citation integrity; `DEPLOY_CHECKLIST.md` marks corpus population as a hard pre-launch blocker. This outranks everything else in the plan.

**Gate first, then populate (decided 2026-07-17).** Population happens on a branch, so `main` stays exposed until the corpus PR merges. Therefore Step 0 ships the coming-soon gate to `main` **immediately and independently** — it kills the live exposure today and turns founder review into a no-pressure step. The corpus PR (Step 5) removes the gate on merge, so `/chap-ai` only returns with real, reviewed content.

- [ ] **Step 0: Ship the coming-soon gate to `main` (own PR, merge immediately)**

On branch `fix/chap-ai-gate`: render a "CHAP AI — coming soon" state on `/chap-ai` and return 503 from `POST /api/chap/ask` unless `process.env.CHAP_WIDGET_ENABLED === "true"`; add the flag (commented out) to `.env.example`; set the flag in the existing route tests so they keep passing. PR to `main`, merge immediately — Vercel auto-deploys the gate.

**Model pin — checked, no action:** `MODEL = "claude-sonnet-4-6"` in `src/lib/chapAi.ts:11` is a **valid, active model ID** (previous-generation Sonnet). Do not change it in this task. Migrating to `claude-sonnet-5` is a separate, optional follow-up with real migration considerations (new tokenizer ~30% more tokens, sampling-parameter rejection, behavioral shifts) — out of P0 scope.

- [ ] **Step 1: Write the failing test**

`src/data/__tests__/complianceCorpus.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { COMPLIANCE_CORPUS } from "../complianceCorpus";

describe("compliance corpus integrity", () => {
  it("contains no placeholder content", () => {
    for (const entry of COMPLIANCE_CORPUS) {
      expect(entry.content).not.toContain("[Founder to populate");
      expect(entry.content.trim().length).toBeGreaterThan(100);
    }
  });

  it("every entry carries a citation and an https source", () => {
    for (const entry of COMPLIANCE_CORPUS) {
      expect(entry.citation.length).toBeGreaterThan(0);
      expect(entry.sourceUrl).toMatch(/^https:\/\//);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/__tests__/complianceCorpus.test.ts`
Expected: FAIL — all entries are placeholders.

- [ ] **Step 3: Populate each entry with verbatim primary-source text**

For each of the 10 entries, fetch the entry's own `sourceUrl` (Cornell LII for `usc`/`cfr`, IRS.gov for `irs_guidance`) and copy the cited subsection **verbatim** into `content`. Rules, from the file's own header comment:

- **Never paraphrase, summarize, or reconstruct statute language from memory.** Copy the fetched text exactly (whitespace normalization is fine; wording changes are not).
- Populate only the subsection the `citation` names (e.g. entry `irc-6656-a` gets 26 U.S.C. §6656(a) only).
- Exactly one entry is `sourceType: "pse_written"` — `pse-analysis-6656-patterns` ("PSE Compliance Intelligence Note 001"). Its `sourceUrl` is self-referential (`/chap-ai`), so there is nothing to transcribe: **author it** in governance voice (common §6656 trigger patterns in multi-state payroll), keep every statutory assertion in it traceable to the other nine entries, and mark it clearly for founder accuracy review.
- **If any source cannot be fetched and verified, stop and use the gate instead** (Step 5 alternative). A half-verified corpus is worse than a gated widget.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/data/__tests__/complianceCorpus.test.ts && npx vitest run src/app/api/chap`
Expected: PASS, including the existing CHAP route suite.

- [ ] **Step 5: Founder-review PR — removes the gate, does not merge without sign-off**

Open this as its own PR titled `P0: populate CHAP compliance corpus (founder review required)` and request review from the founder. The file's contract is explicit: the founder verifies the verbatim text before production. **This PR also reverts the Step-0 gate** (page + API + `.env.example` flag), so merging it is what brings `/chap-ai` back — on real content only. Because Step 0 already de-risked `main`, review can take as long as it needs.

- [ ] **Step 6: Commit**

```bash
git add src/data/complianceCorpus.ts src/data/__tests__/complianceCorpus.test.ts
git commit -m "fix(chap): populate compliance corpus with verbatim primary-source text (P0)"
```

---

### Task 17: CI — make the gates actually gate (EXECUTE LAST)

**Files:**
- Create: `.github/workflows/ci.yml`

**Why:** the repo has no CI — 16+ tests and the boundary lint only run when someone remembers to run them. Every gate this plan adds (allowlist tests, boundary lint, corpus-integrity test) is advisory until a workflow executes it on PR. Runs last so its lint targets (`docs/framework/`, `src/data/framework.ts`) exist.

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Typecheck
        run: npx tsc --noEmit
      - name: Tests
        run: npx vitest run
      - name: Boundary lint (voice discipline)
        run: |
          ! grep -rEn "PSE (performs|processes|executes|funds|deposits|releases|transmits)" \
            docs/framework src/data/framework.ts src/lib/constants.ts src/data/services.ts
      - name: Build
        run: npm run build
```

(The boundary-lint step fails the job if any affirmative execution verb is attributed to PSE; negated forms like "PSE does not perform" don't match. `next build` needs network for Google Fonts — available on GitHub-hosted runners.)

- [ ] **Step 2: Verify locally**

Run the same commands locally: `npx tsc --noEmit && npx vitest run && ! grep -rEn "PSE (performs|processes|executes|funds|deposits|releases|transmits)" docs/framework src/data/framework.ts src/lib/constants.ts src/data/services.ts && npm run build`
Expected: all pass (build may fail in sandboxes without network to Google Fonts — that's environmental; note it and rely on the Actions run).

- [ ] **Step 3: Commit, push a branch, and confirm the workflow runs**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: typecheck, tests, boundary lint, and build on PR"
```

Open a PR and confirm the `checks` job runs and passes on GitHub before merging.

---

## Execution Order

**16 (P0)** → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → **12 → 13 → 14 → 15 (strictly sequential)** → **18** → **17 (last)**.

Tasks 12–15 are not parallelizable: 13 transcribes 12's committed docs, 14 renders 13's data module, 15 imports `FRAMEWORK_SLUGS` from 13 and links pages from 14. Task 18 follows 15 so the reframed copy is what the extended lint and CI first see. Task 16 is independent of everything and must not wait.

---

## Self-Review Checklist (run after all tasks)

- [ ] Spec coverage: questionnaire client (Task 9), session APIs (5–8), allowlist (3), emails incl. journey + invite (1, 10), video package docs (11), framework docs + data + pages + nav/sitemap (12–15), CHAP corpus P0 (16), CI (17), services governance reframe (18). Save/resume, one-time link, read-only after submit all covered.
- [ ] Task 18 touched only the label/overview layer — service bodies and their boundary hedges are byte-identical; the homepage stats row has no figure that fails to trace to `src/lib/stats.ts`.
- [ ] Task 16 shipped first, and either the corpus PR has founder sign-off or the widget is gated — the live site is never left answering from placeholder corpus.
- [ ] `docs/POSITIONING_STRATEGY.md` still contains its original five sections unchanged, with the two appended sections after them; `docs/MARKETING_SITE_PLAN.md` site map matches `src/app` reality.
- [ ] Framework fidelity: `src/data/framework.ts` matches `docs/framework/*.md` verbatim (Task 13 Step 5); the boundary-lint vitest and the grep in Task 12 both pass.
- [ ] `npx vitest run && npx tsc --noEmit && npx next lint` — green.
- [ ] `git log --oneline` shows one commit per task.
- [ ] No raw token appears in any `console.*` call or test snapshot.
- [ ] Grep the diff for voice-discipline violations: `git diff main --stat` then check new copy for "process payroll", "we run payroll", "funds" — none should describe PSE's actions.

---

## Appendix A — `src/app/discovery/QuestionnaireClient.tsx` (complete)

```tsx
"use client";

// Governance discovery questionnaire.
//
// Four short sections mirroring the server allowlist exactly. Autosaves
// (debounced) through the session cookie; save/resume across visits;
// submit finalizes and the session becomes read-only. All validation
// authority lives server-side — this form only shapes input.

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ShieldCheck } from "lucide-react";

type LoadState =
  | "loading"
  | "no-session"
  | "active"
  | "submitting"
  | "done"
  | "error";

interface Answers {
  organizationSize: string;
  operatingRegions: string; // comma-separated in the UI; array on the wire
  payrollFrequencies: string;
  hcmSystem: string;
  payrollProvider: string;
  operatingModel: string;
  payrollTeamSize: string;
  topConcerns: string[]; // exactly 3 slots in the UI
  reportingMaturity: string; // select value; int on the wire
  complianceConfidence: string;
  governanceConfidence: string;
  desiredFutureState: string;
  meetingPurpose: string;
}

const EMPTY: Answers = {
  organizationSize: "",
  operatingRegions: "",
  payrollFrequencies: "",
  hcmSystem: "",
  payrollProvider: "",
  operatingModel: "",
  payrollTeamSize: "",
  topConcerns: ["", "", ""],
  reportingMaturity: "",
  complianceConfidence: "",
  governanceConfidence: "",
  desiredFutureState: "",
  meetingPurpose: "",
};

const INPUT_CLS =
  "w-full px-4 py-3 border border-border rounded-lg text-[15px] font-sans outline-none focus:border-steel-light focus:ring-1 focus:ring-steel-light transition-colors bg-white placeholder:text-text-tertiary";
const LABEL_CLS = "block text-[13px] font-semibold text-text mb-1.5";
const SELECT_CLS = (filled: boolean) =>
  `${INPUT_CLS} ${filled ? "text-text" : "text-text-tertiary"}`;

// UI state → wire payload matching the server allowlist. Empty values are
// omitted so partial saves stay valid.
function toPayload(a: Answers): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (a.organizationSize) out.organizationSize = a.organizationSize;
  const regions = a.operatingRegions
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean)
    .slice(0, 30);
  if (regions.length) out.operatingRegions = regions;
  if (a.payrollFrequencies) out.payrollFrequencies = a.payrollFrequencies;
  if (a.hcmSystem.trim()) out.hcmSystem = a.hcmSystem.trim();
  if (a.payrollProvider.trim()) out.payrollProvider = a.payrollProvider.trim();
  if (a.operatingModel) out.operatingModel = a.operatingModel;
  if (a.payrollTeamSize.trim()) out.payrollTeamSize = a.payrollTeamSize.trim();
  const concerns = a.topConcerns.map((c) => c.trim()).filter(Boolean);
  if (concerns.length) out.topConcerns = concerns;
  if (a.reportingMaturity) out.reportingMaturity = Number(a.reportingMaturity);
  if (a.complianceConfidence)
    out.complianceConfidence = Number(a.complianceConfidence);
  if (a.governanceConfidence)
    out.governanceConfidence = Number(a.governanceConfidence);
  if (a.desiredFutureState.trim())
    out.desiredFutureState = a.desiredFutureState.trim();
  if (a.meetingPurpose.trim()) out.meetingPurpose = a.meetingPurpose.trim();
  return out;
}

// Wire answers → UI state on resume.
function fromPayload(p: Record<string, unknown>): Answers {
  const s = (v: unknown) => (typeof v === "string" ? v : "");
  const n = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v) ? String(v) : "";
  const concerns = Array.isArray(p.topConcerns)
    ? (p.topConcerns as string[])
    : [];
  return {
    organizationSize: s(p.organizationSize),
    operatingRegions: Array.isArray(p.operatingRegions)
      ? (p.operatingRegions as string[]).join(", ")
      : "",
    payrollFrequencies: s(p.payrollFrequencies),
    hcmSystem: s(p.hcmSystem),
    payrollProvider: s(p.payrollProvider),
    operatingModel: s(p.operatingModel),
    payrollTeamSize: s(p.payrollTeamSize),
    topConcerns: [concerns[0] ?? "", concerns[1] ?? "", concerns[2] ?? ""],
    reportingMaturity: n(p.reportingMaturity),
    complianceConfidence: n(p.complianceConfidence),
    governanceConfidence: n(p.governanceConfidence),
    desiredFutureState: s(p.desiredFutureState),
    meetingPurpose: s(p.meetingPurpose),
  };
}

export default function QuestionnaireClient() {
  const [state, setState] = useState<LoadState>("loading");
  const [firstName, setFirstName] = useState("");
  const [company, setCompany] = useState("");
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const [submitError, setSubmitError] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answersRef = useRef(answers);
  answersRef.current = answers;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/discovery/session");
        if (res.status === 401) {
          setState("no-session");
          return;
        }
        if (!res.ok) {
          setState("error");
          return;
        }
        const json = (await res.json()) as {
          firstName: string;
          company: string;
          answers: Record<string, unknown>;
          completed: boolean;
        };
        setFirstName(json.firstName);
        setCompany(json.company);
        setAnswers(fromPayload(json.answers ?? {}));
        setState(json.completed ? "done" : "active");
      } catch {
        setState("error");
      }
    })();
  }, []);

  const save = useCallback(async () => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/discovery/session/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: toPayload(answersRef.current) }),
      });
      setSaveStatus(res.ok ? "saved" : "idle");
    } catch {
      setSaveStatus("idle");
    }
  }, []);

  const update = useCallback(
    (patch: Partial<Answers>) => {
      setAnswers((prev) => ({ ...prev, ...patch }));
      setSaveStatus("idle");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(save, 2000);
    },
    [save]
  );

  const submit = async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSubmitError("");
    setState("submitting");
    try {
      const res = await fetch("/api/discovery/session/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: toPayload(answers) }),
      });
      if (res.ok) {
        setState("done");
        return;
      }
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      setSubmitError(
        json.error === "invalid_answers"
          ? "One of the answers couldn't be accepted. Please review and try again."
          : "Something went wrong submitting. Your progress is saved — please try again."
      );
      setState("active");
    } catch {
      setSubmitError(
        "Network error. Your progress is saved — please try again."
      );
      setState("active");
    }
  };

  return (
    <main className="min-h-screen bg-ice py-16 px-6">
      <div className="max-w-[640px] mx-auto">
        {state === "loading" && (
          <Card>
            <p className="text-[15px] text-text-secondary text-center">
              Loading your questionnaire&hellip;
            </p>
          </Card>
        )}

        {state === "no-session" && (
          <Card>
            <h1 className="text-xl font-bold text-text mb-3 text-center">
              Governance Discovery
            </h1>
            <p className="text-[15px] text-text-secondary text-center">
              This discovery link is no longer active. Request a new link to
              continue.
            </p>
          </Card>
        )}

        {state === "error" && (
          <Card>
            <p className="text-[15px] text-text-secondary text-center">
              Something went wrong on our side. Please refresh, or email{" "}
              <a
                href="mailto:info@payrollsynergyexperts.com"
                className="text-steel underline"
              >
                info@payrollsynergyexperts.com
              </a>
              .
            </p>
          </Card>
        )}

        {state === "done" && (
          <Card>
            <div className="w-[52px] h-[52px] rounded-full bg-green-bg flex items-center justify-center mx-auto mb-4">
              <Check size={24} strokeWidth={3} className="text-green" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold text-text mb-2 text-center">
              Discovery questionnaire received
            </h1>
            <p className="text-[15px] text-text-secondary text-center">
              Thank you{firstName ? `, ${firstName}` : ""}. Your responses are
              in, and your discovery session is the next step — you&rsquo;ll
              receive direct access to schedule it.
            </p>
          </Card>
        )}

        {(state === "active" || state === "submitting") && (
          <>
            <header className="mb-8">
              <span className="inline-block text-xs font-semibold text-steel uppercase tracking-[0.08em] mb-3">
                Governance Discovery
              </span>
              <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-bold tracking-[-0.02em] text-text mb-3">
                {firstName ? `${firstName}, tell` : "Tell"} us about payroll at{" "}
                {company || "your organization"}
              </h1>
              <p className="text-[15px] text-text-secondary leading-[1.7]">
                About five minutes, on your environment and priorities — so the
                discovery session is about your operation, not a generic pitch.
              </p>
              <div className="flex items-center gap-2 mt-4 text-[13px] text-text-secondary">
                <ShieldCheck size={16} strokeWidth={2} className="text-steel shrink-0" aria-hidden="true" />
                No payroll data or employee information is requested — and none
                can be submitted here.
              </div>
            </header>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submit();
              }}
              className="flex flex-col gap-6"
            >
              <Section title="Your environment">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="organizationSize" className={LABEL_CLS}>
                      Organization size
                    </label>
                    <select
                      id="organizationSize"
                      value={answers.organizationSize}
                      onChange={(e) => update({ organizationSize: e.target.value })}
                      className={SELECT_CLS(!!answers.organizationSize)}
                    >
                      <option value="">Select range</option>
                      <option value="1-50">1 – 50</option>
                      <option value="51-200">51 – 200</option>
                      <option value="201-500">201 – 500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="payrollFrequencies" className={LABEL_CLS}>
                      Payroll frequency
                    </label>
                    <select
                      id="payrollFrequencies"
                      value={answers.payrollFrequencies}
                      onChange={(e) => update({ payrollFrequencies: e.target.value })}
                      className={SELECT_CLS(!!answers.payrollFrequencies)}
                    >
                      <option value="">Select frequency</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Biweekly</option>
                      <option value="semimonthly">Semimonthly</option>
                      <option value="monthly">Monthly</option>
                      <option value="mixed">Mixed / multiple</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="operatingRegions" className={LABEL_CLS}>
                    Where you run payroll
                  </label>
                  <input
                    id="operatingRegions"
                    type="text"
                    placeholder="e.g. California, New York, UK (comma-separated)"
                    value={answers.operatingRegions}
                    onChange={(e) => update({ operatingRegions: e.target.value })}
                    className={INPUT_CLS}
                  />
                </div>
              </Section>

              <Section title="Your systems">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hcmSystem" className={LABEL_CLS}>
                      HCM system
                    </label>
                    <input
                      id="hcmSystem"
                      type="text"
                      placeholder="e.g. Workday, UKG"
                      value={answers.hcmSystem}
                      onChange={(e) => update({ hcmSystem: e.target.value })}
                      className={INPUT_CLS}
                    />
                  </div>
                  <div>
                    <label htmlFor="payrollProvider" className={LABEL_CLS}>
                      Payroll provider
                    </label>
                    <input
                      id="payrollProvider"
                      type="text"
                      placeholder="e.g. ADP, Dayforce"
                      value={answers.payrollProvider}
                      onChange={(e) => update({ payrollProvider: e.target.value })}
                      className={INPUT_CLS}
                    />
                  </div>
                  <div>
                    <label htmlFor="operatingModel" className={LABEL_CLS}>
                      Payroll operating model
                    </label>
                    <select
                      id="operatingModel"
                      value={answers.operatingModel}
                      onChange={(e) => update({ operatingModel: e.target.value })}
                      className={SELECT_CLS(!!answers.operatingModel)}
                    >
                      <option value="">Select model</option>
                      <option value="internal">Run internally</option>
                      <option value="outsourced">Outsourced</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="payrollTeamSize" className={LABEL_CLS}>
                      Payroll team size
                    </label>
                    <input
                      id="payrollTeamSize"
                      type="text"
                      placeholder="e.g. 3"
                      value={answers.payrollTeamSize}
                      onChange={(e) => update({ payrollTeamSize: e.target.value })}
                      className={INPUT_CLS}
                    />
                  </div>
                </div>
              </Section>

              <Section title="Your priorities">
                <div>
                  <span className={LABEL_CLS}>
                    Top operational concerns (up to three)
                  </span>
                  <div className="flex flex-col gap-3">
                    {answers.topConcerns.map((concern, i) => (
                      <input
                        key={i}
                        type="text"
                        aria-label={`Concern ${i + 1}`}
                        placeholder={
                          ["e.g. Multi-state tax exposure", "e.g. Off-cycle audit trail", "e.g. Vendor accountability"][i]
                        }
                        value={concern}
                        onChange={(e) => {
                          const next = [...answers.topConcerns] as Answers["topConcerns"];
                          next[i] = e.target.value;
                          update({ topConcerns: next });
                        }}
                        className={INPUT_CLS}
                      />
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <ScaleSelect
                    id="reportingMaturity"
                    label="Reporting maturity"
                    hint="1 = minimal, 5 = advanced"
                    max={5}
                    value={answers.reportingMaturity}
                    onChange={(v) => update({ reportingMaturity: v })}
                  />
                  <ScaleSelect
                    id="complianceConfidence"
                    label="Compliance confidence"
                    hint="1 = low, 10 = high"
                    max={10}
                    value={answers.complianceConfidence}
                    onChange={(v) => update({ complianceConfidence: v })}
                  />
                  <ScaleSelect
                    id="governanceConfidence"
                    label="Governance confidence"
                    hint="1 = low, 10 = high"
                    max={10}
                    value={answers.governanceConfidence}
                    onChange={(v) => update({ governanceConfidence: v })}
                  />
                </div>
              </Section>

              <Section title="Looking ahead">
                <div>
                  <label htmlFor="desiredFutureState" className={LABEL_CLS}>
                    What would &ldquo;payroll is governed&rdquo; look like for
                    you?
                  </label>
                  <textarea
                    id="desiredFutureState"
                    rows={4}
                    maxLength={2000}
                    placeholder="In your own words — the future state you want."
                    value={answers.desiredFutureState}
                    onChange={(e) => update({ desiredFutureState: e.target.value })}
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label htmlFor="meetingPurpose" className={LABEL_CLS}>
                    What should the discovery session focus on?
                  </label>
                  <textarea
                    id="meetingPurpose"
                    rows={3}
                    maxLength={1000}
                    placeholder="The one thing you most want to get out of the conversation."
                    value={answers.meetingPurpose}
                    onChange={(e) => update({ meetingPurpose: e.target.value })}
                    className={INPUT_CLS}
                  />
                </div>
              </Section>

              {submitError && (
                <p className="text-[14px] text-red-600" role="alert">
                  {submitError}
                </p>
              )}

              <div className="flex items-center justify-between gap-4">
                <span
                  className="text-[13px] text-text-tertiary"
                  aria-live="polite"
                >
                  {saveStatus === "saving" && "Saving…"}
                  {saveStatus === "saved" && "Progress saved"}
                  {saveStatus === "idle" && "Autosaves as you go"}
                </span>
                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-[15px] font-semibold bg-navy text-white hover:bg-navy-dark hover:-translate-y-px hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {state === "submitting" ? "Submitting…" : "Submit questionnaire"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-md p-10 mt-20">
      {children}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="bg-white rounded-2xl border border-border shadow-sm p-7 flex flex-col gap-4">
      <legend className="sr-only">{title}</legend>
      <h2 className="text-[15px] font-bold text-text -mb-1">{title}</h2>
      {children}
    </fieldset>
  );
}

function ScaleSelect({
  id,
  label,
  hint,
  max,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  max: number;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className={LABEL_CLS}>
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={SELECT_CLS(!!value)}
      >
        <option value="">{hint}</option>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <option key={n} value={String(n)}>
            {n}
          </option>
        ))}
      </select>
    </div>
  );
}
```

## Appendix B — `src/lib/emails.ts` (complete)

```ts
interface DemoRequestData {
  name: string;
  email: string;
  company?: string;
  employees?: string;
  jobTitle?: string;
}

// User-supplied values must never be interpolated into email HTML raw.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface ChapLeadData {
  email: string;
  sessionId: string;
  firstQuestion?: string;
}

export function chapLeadNotificationHtml(data: ChapLeadData): string {
  const rows: [string, string][] = [
    ["Email", escapeHtml(data.email)],
    ["Session", escapeHtml(data.sessionId)],
    ["First question", data.firstQuestion ? escapeHtml(data.firstQuestion) : "—"],
    [
      "Captured",
      new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
    ],
  ];

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto;">
      <h2 style="color: #0b1d3a; margin-bottom: 16px;">New CHAP Widget Lead</h2>
      <p style="color: #4a5e78; font-size: 13px; margin: 0 0 20px;">
        A visitor to <strong>/chap-ai</strong> hit the email gate after using
        up their free questions. This is a softer intent signal than a demo
        request — they're still in research mode.
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eceef2; color: #6b7280; font-size: 14px; width: 140px;">${label}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eceef2; color: #1c1c2e; font-size: 14px;">${value}</td>
          </tr>`
          )
          .join("")}
      </table>
    </div>
  `;
}

export function internalNotificationHtml(data: DemoRequestData): string {
  const rows = [
    ["Name", escapeHtml(data.name)],
    ["Email", escapeHtml(data.email)],
    ["Company", data.company ? escapeHtml(data.company) : "—"],
    ["Job title", data.jobTitle ? escapeHtml(data.jobTitle) : "—"],
    ["Employees", data.employees ? escapeHtml(data.employees) : "—"],
    ["Submitted", new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" })],
  ];

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto;">
      <h2 style="color: #0b1d3a; margin-bottom: 16px;">New Demo Request</h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eceef2; color: #6b7280; font-size: 14px; width: 120px;">${label}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eceef2; color: #1c1c2e; font-size: 14px;">${value}</td>
          </tr>`
          )
          .join("")}
      </table>
    </div>
  `;
}

export function autoResponseHtml(data: DemoRequestData): string {
  const details = [
    data.company && `Company: ${escapeHtml(data.company)}`,
    data.employees && `Team size: ${escapeHtml(data.employees)}`,
  ]
    .filter(Boolean)
    .join("<br/>");

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
      <div style="background: #0b1d3a; padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">Payroll Synergy Experts</h1>
      </div>

      <div style="padding: 32px 24px; border: 1px solid #eceef2; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Hi ${escapeHtml(data.name)},
        </p>

        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Thank you for requesting a demo. We&rsquo;ve received your submission and our team will reach out within <strong>24 hours</strong> to schedule your personalized walkthrough.
        </p>

        ${
          details
            ? `
        <div style="background: #f5f0eb; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px;">What you submitted</p>
          <p style="color: #1c1c2e; font-size: 15px; margin: 0; line-height: 1.6;">${details}</p>
        </div>`
            : ""
        }

        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 20px 0 0;">
          In the meantime, you can learn more about our platform at
          <a href="https://payrollsynergyexperts.com" style="color: #1a5fb4; text-decoration: none;">payrollsynergyexperts.com</a>.
        </p>

        <hr style="border: none; border-top: 1px solid #eceef2; margin: 28px 0 20px;" />

        <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0;">
          Payroll Synergy Experts<br/>
          <a href="https://payrollsynergyexperts.com" style="color: #6b7280; text-decoration: none;">payrollsynergyexperts.com</a>
        </p>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Journey email #1 — sent on demo request (replaces autoResponseHtml for the
// commercial lifecycle; autoResponseHtml is retained only until legacy
// callers are removed).
//
// Voice discipline: PSE governs / the system of record executes. No
// calendar access at this stage — scheduling unlocks after the discovery
// questionnaire.
// ---------------------------------------------------------------------------

interface JourneyEmailData {
  firstName: string;
  /** Tracked redirect URL when link signing is configured, else direct URL, else absent. */
  videoUrl?: string;
}

export function journeyEmailHtml(data: JourneyEmailData): string {
  const firstName = escapeHtml(data.firstName);
  const videoBlock = data.videoUrl
    ? `
        <div style="text-align: center; margin: 24px 0;">
          <a href="${escapeHtml(data.videoUrl)}"
             style="display: inline-block; background: #0b1d3a; color: #ffffff; font-size: 15px; font-weight: 600; padding: 14px 28px; border-radius: 8px; text-decoration: none;">
            Watch the PSE Overview
          </a>
        </div>`
    : "";

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
      <div style="background: #0b1d3a; padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">Payroll Synergy Experts</h1>
      </div>

      <div style="padding: 32px 24px; border: 1px solid #eceef2; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Hi ${firstName},
        </p>

        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Thanks for your request. Before we meet, here&rsquo;s a short overview
          of how PSE works.
        </p>
        ${videoBlock}
        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          PSE is a governance and validation layer that sits above your payroll
          system of record. Your payroll system executes &mdash; PSE governs:
          validating outcomes, surfacing compliance risk, and maintaining
          audit-ready evidence of what was checked and why.
        </p>

        <div style="background: #f5f0eb; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px;">What happens next</p>
          <p style="color: #1c1c2e; font-size: 15px; margin: 0; line-height: 1.7;">
            You&rsquo;ll receive a short governance discovery questionnaire
            (about five minutes) so we can tailor the session to your payroll
            environment. Once it&rsquo;s complete, you&rsquo;ll get direct
            access to schedule your discovery call.
          </p>
        </div>

        <hr style="border: none; border-top: 1px solid #eceef2; margin: 28px 0 20px;" />

        <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0;">
          Payroll Synergy Experts<br/>
          <a href="https://payrollsynergyexperts.com" style="color: #6b7280; text-decoration: none;">payrollsynergyexperts.com</a>
        </p>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Questionnaire invitation — carries the one-time discovery link. The raw
// token appears only inside this email; it is never logged or stored.
// ---------------------------------------------------------------------------

interface QuestionnaireInviteData {
  firstName: string;
  discoveryUrl: string;
  expiresDays: number;
}

export function questionnaireInviteHtml(data: QuestionnaireInviteData): string {
  const firstName = escapeHtml(data.firstName);
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
      <div style="background: #0b1d3a; padding: 32px 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 600;">Payroll Synergy Experts</h1>
      </div>

      <div style="padding: 32px 24px; border: 1px solid #eceef2; border-top: none; border-radius: 0 0 8px 8px;">
        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          Hi ${firstName},
        </p>

        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
          The next step is a short governance discovery questionnaire &mdash;
          about five minutes on your organization&rsquo;s payroll environment,
          systems, and priorities. No payroll data or employee information is
          requested at any point.
        </p>

        <div style="text-align: center; margin: 24px 0;">
          <a href="${escapeHtml(data.discoveryUrl)}"
             style="display: inline-block; background: #0b1d3a; color: #ffffff; font-size: 15px; font-weight: 600; padding: 14px 28px; border-radius: 8px; text-decoration: none;">
            Continue to Governance Discovery
          </a>
        </div>

        <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0 0 16px; text-align: center;">
          This personal link is valid for ${data.expiresDays} days and can be
          used once. You can save and resume before submitting.
        </p>

        <p style="color: #1c1c2e; font-size: 16px; line-height: 1.6; margin: 0;">
          Once submitted, you&rsquo;ll get direct access to schedule your
          discovery call.
        </p>

        <hr style="border: none; border-top: 1px solid #eceef2; margin: 28px 0 20px;" />

        <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0;">
          Payroll Synergy Experts<br/>
          <a href="https://payrollsynergyexperts.com" style="color: #6b7280; text-decoration: none;">payrollsynergyexperts.com</a>
        </p>
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Internal notification when a discovery questionnaire is submitted.
// Answers come from the server-side allowlist (validated), but are still
// user-supplied text — everything is escaped.
// ---------------------------------------------------------------------------

interface DiscoverySubmissionData {
  firstName: string;
  email: string;
  company: string;
  answers: Record<string, unknown>;
}

export function discoverySubmissionHtml(data: DiscoverySubmissionData): string {
  const formatValue = (v: unknown): string =>
    Array.isArray(v)
      ? v.map((item) => escapeHtml(String(item))).join(", ")
      : escapeHtml(String(v));

  const rows: [string, string][] = [
    ["Name", escapeHtml(data.firstName)],
    ["Email", escapeHtml(data.email)],
    ["Company", data.company ? escapeHtml(data.company) : "—"],
    ...Object.entries(data.answers).map(
      ([key, value]) => [escapeHtml(key), formatValue(value)] as [string, string]
    ),
    [
      "Submitted",
      new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
    ],
  ];

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto;">
      <h2 style="color: #0b1d3a; margin-bottom: 16px;">Discovery Questionnaire Submitted</h2>
      <p style="color: #4a5e78; font-size: 13px; margin: 0 0 20px;">
        A prospect completed the governance discovery questionnaire. Next
        step: send scheduling access for the discovery session.
      </p>
      <table style="width: 100%; border-collapse: collapse;">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eceef2; color: #6b7280; font-size: 14px; width: 160px;">${label}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eceef2; color: #1c1c2e; font-size: 14px;">${value}</td>
          </tr>`
          )
          .join("")}
      </table>
    </div>
  `;
}
```

## Appendix C — `docs/video/demo-v1/README.md`

````markdown
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
````

## Appendix D — `docs/video/demo-v1/founder-intro-script.md`

```markdown
# PSE Founder Introduction — Script v1.0 (recordable now)

Runtime: 60–90 seconds. ≈ 190 words at a measured pace.
Format: founder on camera (or founder-voiced over brand cards). **No
product screens** — this video is positioning-led and does not depend on
demo freeze. It temporarily occupies `PSE_OVERVIEW_VIDEO_URL` until the
production demo video ships, using the same tracked redirect.

---

**[0:00 — On camera, or PSE brand card]**

> Hi, I'm Tom — founder of Payroll Synergy Experts.
>
> Here's the problem we work on. Every pay period, your payroll system
> makes thousands of decisions, and almost nobody independently checks
> them. In fiscal 2024, the Department of Labor recovered nearly one
> hundred fifty million dollars in back wages. Those weren't companies
> without payroll systems. They were companies without payroll governance.

**[~0:30]**

> PSE is a governance and validation layer. We don't process payroll, and
> we never will — your system of record executes. PSE governs: it
> independently validates payroll output, surfaces compliance risk with
> the statute behind it, and maintains audit-ready evidence your
> leadership and your auditors can actually stand on.

**[~1:00]**

> The next step is a five-minute governance discovery questionnaire — your
> systems, your environment, your priorities. No payroll data, no employee
> information. It makes our first conversation about your operation, not a
> pitch. The link is right below this video. I look forward to it.

---

## Recording notes

- **Record naturally — do not voice-clone this.** Real founder delivery is
  the asset at this stage; this video will likely double as the homepage
  hero. Voice cloning is deferred to Stage B use cases (release updates,
  multi-language, walkthrough refreshes).
- Single take preferred; authenticity over polish at this stage.
- Plain background or subtle PSE-branded backdrop. No screens.
- End card: "Continue to Governance Discovery" (matches journey email CTA).
- Statistics: DOL FY2024 figure only — traces to `stats.ts
  dolBackWages` ($149.9M, FY2024, DOL WHD FY2024 Statistical Release).
- Once published: set `PSE_OVERVIEW_VIDEO_URL`, note the swap in the
  video manifest (`videoId: pse-founder-intro-v1`), and journey emails
  automatically include the tracked video block again.
```

## Appendix E — `docs/video/demo-v1/storyboard.json`

```json
{
  "storyboardVersion": "1.0",
  "videoId": "pse-demo-v1.0",
  "targetRuntimeSeconds": 380,
  "resolution": "1920x1080",
  "captureFps": 30,
  "scenes": [
    {
      "id": "s1-why",
      "chapter": 1,
      "start": "0:00",
      "end": "0:40",
      "source": "motion-card",
      "visual": "Brand opening card, fade to blurred non-identifiable dashboard composite",
      "lowerThird": "Payroll Synergy Experts — Payroll Governance & Compliance Intelligence",
      "callouts": [],
      "freezeDependent": false
    },
    {
      "id": "s2-boundary",
      "chapter": 2,
      "start": "0:40",
      "end": "1:20",
      "source": "motion-card",
      "visual": "Two-column boundary diagram: 'Your System of Record — executes' | 'PSE — governs'; SOR logo row",
      "callouts": ["Boundary statement stays on screen ≥8s"],
      "freezeDependent": false
    },
    {
      "id": "s3-intake",
      "chapter": 3,
      "start": "1:20",
      "end": "2:00",
      "source": "playwright",
      "visual": "Upload approved fixture, analysis progress, completion state",
      "callouts": ["Zoom on intake confirmation", "Caption: 'No integration required to begin'"],
      "freezeDependent": true,
      "freezeItems": ["fixture filename", "upload control labels", "completion copy"]
    },
    {
      "id": "s4-findings",
      "chapter": 4,
      "start": "2:00",
      "end": "3:30",
      "source": "playwright",
      "visual": "Command Center → compliance score → Exceptions list → open one finding",
      "callouts": [
        "Zoom on compliance score panel",
        "Zoom on severity badge",
        "Highlight statutory grounding line (IRC §6656 reference)"
      ],
      "freezeDependent": true,
      "freezeItems": ["screen names", "selected finding", "expected findings count"]
    },
    {
      "id": "s5-chap",
      "chapter": 5,
      "start": "3:30",
      "end": "4:30",
      "source": "playwright",
      "visual": "CHAP panel: approved question → determination → citation → reasoning trail",
      "callouts": ["Highlight citation block", "Caption: 'CHAP advises. Humans decide.'"],
      "freezeDependent": true,
      "freezeItems": ["approved CHAP question", "determination copy"]
    },
    {
      "id": "s6-audit",
      "chapter": 6,
      "start": "4:30",
      "end": "5:20",
      "source": "playwright",
      "visual": "Executive summary / reporting view → evidence or replay view",
      "callouts": ["Zoom on evidence/version identifiers"],
      "freezeDependent": true,
      "freezeItems": ["exact screens available in frozen build"]
    },
    {
      "id": "s7-discovery",
      "chapter": 7,
      "start": "5:20",
      "end": "6:00",
      "source": "motion-card",
      "visual": "Three-step card: Questionnaire → Discovery session → Tailored governance review",
      "callouts": ["Caption: 'No payroll data. No employee information.'"],
      "freezeDependent": false
    },
    {
      "id": "s8-cta",
      "chapter": 8,
      "start": "6:00",
      "end": "6:20",
      "source": "motion-card",
      "visual": "CTA card 'Continue to Governance Discovery' + version watermark demo-v1.0-frozen",
      "callouts": [],
      "freezeDependent": false
    }
  ],
  "composition": {
    "captions": "auto-generated, human-reviewed",
    "watermark": "demo-v1.0-frozen, bottom-right, 40% opacity, product scenes only",
    "audio": "founder-cloned narration from narration.txt; -16 LUFS integrated",
    "ctaDestination": "tracked signed redirect (PSE_OVERVIEW_VIDEO_URL swap only after approval)"
  }
}
```

## Appendix F — `docs/video/demo-v1/narration.txt`

```text
[Chapter 1 — Why PSE exists | 0:00–0:40]
Every pay period, your payroll system produces thousands of decisions — calculations, deposits, classifications, filings. Almost all of them are right. The ones that aren't are expensive: in fiscal year 2024 alone, the Department of Labor recovered nearly one hundred fifty million dollars in back wages for more than a hundred and twenty-five thousand workers. And studies suggest roughly a third of employers make payroll errors in some form. The problem isn't your payroll system. The problem is that almost no one independently checks its output. Payroll Synergy Experts exists to close that gap.

[Chapter 2 — What PSE governs, and what it does not do | 0:40–1:20]
First, what PSE is not. PSE is not a payroll processor. It doesn't run your payroll, move your money, or replace your HCM. Your system of record executes. PSE governs. It sits above your payroll platform — whichever one you use — and independently validates what came out of it: verifying calculations, surfacing compliance risk, scoring severity, and maintaining audit-ready evidence of what was checked, what was found, and why. Governance, controls, and oversight. That's the entire job.

[Chapter 3 — Upload and intake | 1:20–2:00]
Here's how a review starts. You export a payroll register from your system of record — the same file you already produce — and bring it into PSE. No integration project, no agent installed in your payroll system, no standing connection required to begin. PSE validates the register against rules grounded in statute and regulation — applied deterministically, the same way every time. Within moments, the analysis is complete and every check is on the record.

[Chapter 4 — Findings, severity, and the compliance score | 2:00–3:30]
This is the Command Center — the governed view of the pay period. At the top, the compliance score: a single, defensible number summarizing how this payroll run performed against the checks PSE applied. It isn't a feeling or a rating. Every point traces to specific findings. Below it, the exceptions. Each finding tells you four things: what was detected, which employees and pay elements are affected, how severe it is, and which rule or statute the check is grounded in. Let's open one. [[DEMO_CONTRACT:expected.designated_finding]] — walk detection, affected scope, severity rationale, statutory grounding on screen. Notice what you're not seeing: a black box. The detection logic is deterministic, the threshold is stated, and the source of authority is cited. Severity reflects real exposure — federal deposit penalties, for example, scale to as much as fifteen percent under Internal Revenue Code section sixty-six fifty-six. Your team doesn't have to hunt through the register hoping to notice a problem. The problems present themselves, ranked, with their evidence attached.

[Chapter 5 — CHAP: explanation and evidence | 3:30–4:30]
When a finding needs interpretation, this is CHAP — PSE's compliance reasoning engine. Ask it about a finding, a rule, or a scenario, and it answers the way a compliance analyst should: with a determination, the reasoning behind it, and the authority it rests on. Two things matter here. CHAP's answers are grounded in a curated regulatory corpus — not the open internet. And CHAP advises; it doesn't act. Every determination is presented to a human, with its evidence, for a human decision. Governed AI means the reasoning is inspectable and the authority stays with your team.

[Chapter 6 — Executive visibility and the audit trail | 4:30–5:20]
Everything you've seen becomes part of the record. For leadership, that means a defensible answer to a simple question: how do we know payroll is right? Not "the system ran," but "the output was independently validated, here's the score, here are the exceptions, here's what we did about them." For audit, it means evidence. Every check that ran, every finding, every determination — preserved, versioned, and reproducible. When an auditor, a regulator, or your own board asks how payroll is governed, you show them, rather than tell them.

[Chapter 7 — What happens in the discovery process | 5:20–6:00]
If this resonates, the next step is deliberately simple. You complete a short governance discovery questionnaire — about five minutes on your payroll environment, systems, and priorities. No payroll data, no employee information. It exists so that when we meet, the session is about your operation, not a generic pitch. From there, we walk through what a governed payroll review would look like for your organization.

[Chapter 8 — Call to action | 6:00–6:20]
Your payroll system executes. The question is who governs. Continue to the governance discovery questionnaire — the link is right below this video — and let's find out what your payroll isn't telling you.
```

## Appendix G — `docs/video/demo-v1/recording-plan.md`

````markdown
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
````

## Appendix H — `docs/video/demo-v1/video-manifest.template.json`

```json
{
  "$comment": "Template — completed by the recording pipeline. Published as a companion sidecar next to the MP4 (demo-v1.0-frozen.mp4 + demo-v1.0-frozen.json): the video itself is a governed artifact, no database required. Founder intro uses videoId pse-founder-intro-v1 with null release/contract fields.",
  "videoId": "pse-demo-v1.0",
  "videoVersion": "demo-v1.0-frozen",
  "releaseTag": "demo-v1.0-frozen",
  "demoCommitSha": null,
  "demoUrl": null,
  "scriptVersion": "1.0",
  "storyboardVersion": "1.0",
  "fixture": null,
  "expectedFindings": null,
  "recordedAt": null,
  "generatedAt": null,
  "narrationSource": "founder-cloned-voice",
  "reviewStatus": "PENDING",
  "approvedBy": null,
  "approvedAt": null,
  "publishedUrl": null,
  "replacedBy": null,
  "replacedAt": null,
  "scriptHash": null,
  "narrationHash": null,
  "storyboardHash": null,
  "demoContractHash": null,
  "fixtureHash": null,
  "playwrightRunId": null
}
```

## Appendix I — `docs/video/demo-v1/demo-contract.yaml` (skeleton — completed at freeze)

```yaml
# Machine-validated interface between pse-marketing (content) and
# PSE--Projects (recording). Marketing writes against this contract, not
# the application; the Playwright walkthrough validates this contract,
# not the narration. Every null below is completed at demo-v1.0-frozen —
# never assumed. [[DEMO_CONTRACT:...]] placeholders in narration.txt
# resolve against the keys in this file.
contractVersion: "1.0"
release:
  tag: demo-v1.0-frozen
  demoCommitSha: null
fixture:
  filename: null          # approved fixture named in the release manifest
  sha256: null
expected:
  findingsCount: null     # release manifest expectedFindings; asserted in s4
  designated_finding: null # finding opened in s4; narration placeholder [[DEMO_CONTRACT:expected.designated_finding]]
  completionText: null    # exact intake completion copy asserted in s3
  chapQuestion: null      # approved CHAP demo question submitted in s5
  chapCitation: null      # citation block expected to render in s5
screens:
  commandCenter: null     # exact screen name in the frozen build (s4)
  executiveReport: null   # executive/reporting view (s6)
  evidenceView: null      # evidence or replay view (s6)
```

## Appendix J — `docs/framework/README.md`

```markdown
# Payroll Synergy Experts Framework

The PSE Framework is a single governance model for the payroll control environment.
It defines the disciplines PSE applies to govern, validate, and document payroll —
across whichever system of record executes it.

## The one rule (applies to every page)

> **The system of record executes the transaction. PSE governs the environment.**

Substitution discipline, enforced line-by-line in all seven domains:

| Never say PSE… | Always say PSE… |
|---|---|
| performs | validates |
| processes | governs |
| funds / deposits | verifies |
| executes / releases / transmits | provides oversight |

**Acceptance test for any line of body copy:** could a salesperson at ADP, UKG,
Dayforce, Workday, Paylocity, or Ceridian read this and conclude PSE competes for
payroll processing? If yes, the line is wrong — rewrite it in governance voice.

## The seven domains

| # | Page H1 (body voice) | Nav label (short) | File |
|---|---|---|---|
| 1 | Payroll Operations Governance | Payroll Operations | `01-payroll-operations.md` |
| 2 | Workforce Data Governance | Workforce Data | `02-workforce-data.md` |
| 3 | Compliance Governance | Compliance | `03-compliance.md` |
| 4 | Risk & Controls Governance | Risk & Controls | `04-risk-and-controls.md` |
| 5 | Payroll Governance | Governance | `05-governance.md` |
| 6 | Workforce Intelligence Governance | Workforce Intelligence | `06-workforce-intelligence.md` |
| 7 | Technology & Automation Governance | Technology & Automation | `07-technology-and-automation.md` |

## Standardized page structure (every domain)

Purpose · Definition · Core Principles · Governance Domains (Objective / Scope /
Key Activities / Indicators) · Maturity Model · Expected Outcomes · PSE Perspective.

Consistent structure is deliberate — it serves AI citation/indexing, site navigation,
future assessment modules, and social-content extraction.

## Standardized maturity ladder (every domain)

L1 Reactive → L2 Managed → L3 Controlled → L4 Optimized → L5 Governed.
L5 is always *governance-driven oversight* — never "PSE runs payroll."

## Boundary cross-check

These pages stay inside `docs/POSITIONING_STRATEGY.md` ("PSE Is Not: Payroll
processor / PEO / HCM replacement / Tax filing company / Payroll funding provider").
Any future edit that adds an execution verb to Key Activities breaks the boundary.
```

## Appendix K — `docs/framework/01-payroll-operations.md`

```markdown
# Payroll Operations Governance
### Payroll Synergy Experts Framework — Domain 1

## Purpose
The Payroll Operations Governance domain defines how PSE evaluates, validates, and
documents payroll service delivery — regardless of which system of record executes it.

Payroll is a critical control environment. Employees expect accurate, timely pay;
executives expect financial accuracy; regulators expect compliance. PSE establishes
the governance disciplines that make payroll operations auditable, repeatable, and
defensible — without performing the run itself.

## Definition
Payroll Operations is the control environment in which employee compensation is
calculated, processed, and distributed by your payroll system of record (ADP, UKG,
Dayforce, or equivalent). PSE does not perform these activities. PSE governs them:
validating inputs, enforcing controls, and documenting every decision before and
after your processor executes.

This framework defines the operational disciplines PSE applies to that control
environment. The processor executes; PSE governs.

## Core Principles
Accuracy · Timeliness · Compliance · Consistency · Accountability · Transparency ·
Continuous Improvement.
Each principle is enforced through validation and documentation, not execution.

## Governance Domains

### 1. Run Validation & Pre-Commit Governance
**Objective:** Validate every payroll run against the applicable statutory ruleset
before the system of record commits it.
**Scope:** pre-run compliance scan · gross-to-net validation · retro/off-cycle review ·
bonus/commission validation · final-pay verification · balancing verification ·
pre-commit confirmation.
**Key Activities:** validate calculations produced by the system of record; surface
and explain exceptions; gate the run until violations are resolved; document
pass/flag/correct. PSE does not transmit, release, or fund payroll — the processor
executes the run after validation clears.
**Indicators:** validation coverage rate · exceptions caught pre-commit · blocked-run
resolution time · post-commit defect rate.

### 2. Payroll Data Governance
**Objective:** Ensure payroll-affecting records are validated before they reach the run.
**Scope:** earnings/deduction validation · garnishment validation · tax-setup
verification · direct-deposit change review · configuration-change control.
**Key Activities:** validate setup changes against policy; flag integrity breaks;
document who changed what and why.
**Indicators:** record accuracy rate · change-validation lead time · open data exceptions.

### 3. Governance Service Delivery
**Objective:** Deliver governance outputs to the payroll, compliance, and audit
stakeholders who own the run.
**Scope:** compliance records · exception reports · audit packs · escalation routing.
Stakeholders are payroll/compliance/audit/executive owners — not employee-facing support.
**Key Activities:** deliver run-level compliance evidence; route exceptions to the
responsible owner; track governance SLAs.
**Indicators:** governance-SLA achievement · exception routing time · audit-pack
completeness.

### 4. Validation & Quality Assurance
**Objective:** Identify payroll errors before payments are released by the processor.
**Scope:** pre-run audits · variance analysis · exception reporting · validation
procedures · post-run audits.
**Key Activities:** review variances; investigate anomalies; validate earnings and
deductions; verify totals against expected values.
**Indicators:** validation completion rate · defect rate · error-detection rate · audit findings.

### 5. Reconciliation Oversight
**Objective:** Verify payroll financial data reconciles across systems. PSE verifies
the numbers; the processor or financial institution moves the money.
**Scope:** payroll-to-GL validation · funding-amount validation against liability ·
tax reconciliation · benefit reconciliation · labor-cost reconciliation.
**Key Activities:** validate liabilities and funding amounts; flag reconciliation
variances. PSE does not move or push funds.
**Indicators:** reconciliation coverage · unresolved variance count · variance aging.

### 6. Change Governance
**Objective:** Ensure payroll changes are validated and documented before deployment.
**Scope:** policy changes · tax updates · configuration changes · new programs ·
regulatory updates.
**Key Activities:** assess change impact; validate changes in test; document and
approve; verify deployment integrity.
**Indicators:** change success rate · change-related errors · deployment accuracy.

### 7. Performance Governance
**Objective:** Measure operational effectiveness and drive continuous improvement.
**Scope:** operational KPIs · service reporting · dashboards · trend analysis ·
improvement initiatives.
**Key Activities:** monitor KPIs; identify trends; analyze root causes; recommend
improvements.
**Indicators:** cost per payslip · payroll accuracy · cycle duration · SLA performance.

## Maturity Model
**L1 Reactive** — manual, undocumented, individual-dependent · **L2 Managed** — SOPs,
defined calendars, consistent execution by the processor · **L3 Controlled** — formal
controls, validation, accountability · **L4 Optimized** — automated validation,
analytics, predictive monitoring · **L5 Governed** — AI-assisted, continuous
monitoring, exception-based, governance-driven oversight.

## Expected Outcomes
Higher payroll accuracy · reduced run risk · faster exception resolution · greater
operational visibility · stronger audit readiness · documented, defensible decisions.

## PSE Perspective
Payroll Operations is not work PSE performs — it is the control environment PSE
governs. Organizations that mature operations governance turn payroll from an opaque
transaction into an auditable, defensible business function — while their existing
processor keeps executing the run.
```

## Appendix L — `docs/framework/02-workforce-data.md`

```markdown
# Workforce Data Governance
### Payroll Synergy Experts Framework — Domain 2

## Purpose
The Workforce Data Governance domain defines how PSE ensures the workforce data
flowing into payroll is accurate, complete, timely, and governed — before it reaches
the run.

Payroll is only as correct as the data feeding it. PSE does not own the HRIS, the
timekeeping system, or the system of record. PSE governs the integrity of the data
those systems hand to payroll, so errors are caught at the source rather than
discovered in a paycheck.

## Definition
Workforce Data is the master, time, and compensation data — originated and maintained
in your HRIS, WFM, and benefits systems — that drives payroll calculation. PSE does
not author or maintain these records. PSE validates them, monitors the integrations
that move them, and documents the exceptions before they affect a run.

The systems of record own the data. PSE governs its fitness for payroll.

## Core Principles
Accuracy · Completeness · Consistency · Timeliness · Validity · Governed Ownership.
Each is enforced through validation and monitoring, not by replacing the source system.

## Governance Domains

### 1. Employee Master Data Governance
**Objective:** Validate that employee records feeding payroll are accurate and current.
**Scope:** demographics · employment status · organizational hierarchy · position data ·
location data.
**Key Activities:** validate master records against payroll requirements; flag missing
or stale fields; document corrections back to the source owner. PSE does not maintain
the HRIS — it validates what the HRIS provides.
**Indicators:** master-data accuracy rate · stale-record count · time-to-correction.

### 2. Workforce Management Data Governance
**Objective:** Verify time and attendance data is valid before it enters the run.
**Scope:** time punches · schedules · attendance · leave · overtime.
**Key Activities:** validate WFM data integrity; flag missing punches, impossible
hours, and unapproved overtime; document exceptions. PSE does not run the clock or
approve time on behalf of managers.
**Indicators:** time-data exception rate · unapproved-overtime flags · correction lead time.

### 3. Compensation Data Governance
**Objective:** Verify compensation data matches policy and elections before pay is calculated.
**Scope:** base pay · variable pay · incentive compensation · shift differentials ·
premium pay.
**Key Activities:** validate pay data against policy and approved elections; flag
rate mismatches; document. PSE does not set or change pay rates — it verifies them.
**Indicators:** rate-mismatch flags · validation coverage · open compensation exceptions.

### 4. Integration Governance
**Objective:** Monitor the integrity of data crossing system boundaries.
**Scope:** HRIS · payroll · WFM · benefits · finance integrations.
**Key Activities:** monitor integration success/failure; flag dropped, duplicated, or
malformed records; document integration breaks. PSE governs the data crossing the
pipes; it does not own the source systems.
**Indicators:** integration success rate · failed-sync count · records reconciled across systems.

### 5. Data Quality Management
**Objective:** Measure and enforce data quality dimensions on payroll-bound data.
**Scope:** accuracy · completeness · consistency · timeliness · validity.
**Key Activities:** profile incoming data; flag quality breaks against thresholds;
document trend and root cause.
**Indicators:** data accuracy % · completeness % · open data exceptions.

### 6. Data Stewardship & Governance
**Objective:** Define accountability for the data payroll depends on.
**Scope:** ownership · stewardship · standards · security · retention.
**Key Activities:** define data owners and stewards; set validation standards; govern
access and retention of payroll-relevant data.
**Indicators:** assigned-ownership coverage · standards adherence · governance reviews completed.

## Maturity Model
**L1 Reactive** — errors found in paychecks · **L2 Managed** — basic source checks ·
**L3 Controlled** — formal validation rules and stewardship · **L4 Optimized** —
automated quality monitoring across integrations · **L5 Governed** — continuous,
governed data integrity with full lineage and oversight.

## Expected Outcomes
Trusted workforce data · reduced payroll errors at source · better compliance
readiness · improved reporting accuracy · faster correction cycles.

## PSE Perspective
Workforce data is the foundation of every payroll run, and most payroll errors are
data errors. PSE does not replace the systems that hold the data — it governs whether
that data is fit to drive pay, catching breaks before they reach an employee.
```

## Appendix M — `docs/framework/03-compliance.md`

(One deviation applied per Scope Decision #12: L5 maturity says "one-business-day rule currency" — the spec draft said "same-day", contradicting its own Key Activities and the live site's "within one business day" claim.)

```markdown
# Compliance Governance
### Payroll Synergy Experts Framework — Domain 3

## Purpose
The Compliance Governance domain defines how PSE monitors, validates, and documents
payroll compliance obligations across every jurisdiction an organization operates in.

Compliance is the domain where PSE's governance position is most natural and most
valuable. Processors execute payroll; PSE answers the question regulators and auditors
ask — *can you prove every payroll decision was compliant when it was made?*

## Definition
Payroll compliance is the body of federal, state, local, and international obligations
governing how employees are paid, taxed, and reported. PSE does not file returns,
make deposits, or remit taxes. PSE validates payroll against the applicable ruleset,
monitors regulatory change, and documents the compliance position on every run.

The processor and tax authorities execute filings and deposits. PSE governs whether
those activities are correct before they happen.

## Core Principles
Jurisdictional accuracy · Timeliness · Traceability · Currency of rules · Defensibility ·
Continuous monitoring.

## Governance Domains

### 1. Federal Compliance Governance
**Objective:** Validate payroll against federal obligations on every run.
**Scope:** FLSA · IRC · FMLA · federal tax requirements.
**Key Activities:** validate overtime, classification, and federal withholding against
statute; flag violations with citation; document the basis. PSE validates — it does
not file or remit.
**Indicators:** federal violations detected pre-commit · open federal actions · citation coverage.

### 2. State Compliance Governance
**Objective:** Validate payroll against the rules of every active state.
**Scope:** state wage laws · sick leave · overtime · final-pay requirements.
**Key Activities:** apply per-state rules in validation; flag state-specific
violations; document by jurisdiction.
**Indicators:** state violations detected · multi-state coverage · final-pay exception flags.

### 3. Local Compliance Governance
**Objective:** Validate payroll against municipal and local ordinances.
**Scope:** local taxes · predictive scheduling · local sick leave · industry rules.
**Key Activities:** validate local obligations; flag local-ordinance gaps; document
applicability by work location.
**Indicators:** local-rule coverage · local violations flagged · open local actions.

### 4. International Compliance Governance
**Objective:** Provide a governance structure for statutory obligations outside the U.S.
**Scope:** country payroll regulations · statutory reporting · in-country tax requirements.
**Key Activities:** define the compliance ruleset per country; validate against it;
document the position. Scope is governed at the framework level and applied where the
organization operates.
**Indicators:** country-ruleset coverage · cross-border exceptions · documentation completeness.

### 5. Tax Compliance Governance
**Objective:** Validate the payroll tax position before the processor acts on it.
**Scope:** withholding validation · reporting validation · deposit-timing validation
(IRC §6656) · reconciliation verification.
**Key Activities:** validate withholding against elections and statute; validate
deposit timing against liability tier; verify reconciliation. PSE validates deposit
timing; the processor or financial institution executes the deposit.
**Indicators:** deposit-timing exposure flagged · withholding mismatches · penalty exposure quantified.

### 6. Regulatory Monitoring
**Objective:** Keep the compliance ruleset current as law changes.
**Scope:** legislative tracking · policy updates · compliance assessments.
**Key Activities:** monitor federal, state, and local change daily; reflect changes in
the ruleset within one business day; document version history.
**Indicators:** rule-update latency · regulatory changes tracked · assessment cadence.

## Maturity Model
**L1 Reactive** — compliance checked after notices arrive · **L2 Managed** — periodic
manual checks · **L3 Controlled** — validated rulesets with citation · **L4 Optimized** —
automated multi-jurisdiction validation · **L5 Governed** — continuous monitoring,
one-business-day rule currency, fully documented and audit-ready.

## Expected Outcomes
Reduced regulatory risk · faster regulatory response · audit readiness · quantified and
shrinking penalty exposure · defensible compliance evidence on every run.

## PSE Perspective
Compliance is unowned territory in the payroll stack — processors execute, but few can
prove the run was compliant at the moment of decision. PSE governs that proof,
validating against current statute and documenting the position before payroll commits.
```

## Appendix N — `docs/framework/04-risk-and-controls.md`

```markdown
# Risk & Controls Governance
### Payroll Synergy Experts Framework — Domain 4

## Purpose
The Risk & Controls Governance domain defines how PSE protects the payroll control
environment through structured controls, monitoring, and risk management.

Payroll is a high-value target and a high-consequence process. PSE does not own the
payroll function; it governs the controls around it — defining what good control looks
like, monitoring whether it holds, and surfacing the indicators that precede loss.

## Definition
Payroll risk is the exposure to financial loss, fraud, regulatory penalty, and
operational failure inside the payroll process. PSE does not administer payroll, hold
funds, or terminate employees. PSE governs the control framework: defining controls,
validating their effectiveness, and surfacing fraud and exception indicators for the
owners who act on them.

The organization owns and acts on the risk. PSE governs how it is controlled and seen.

## Core Principles
Preventive control · Detective monitoring · Separation of duties · Documentation ·
Escalation · Defensibility.

## Governance Domains

### 1. Control Governance
**Objective:** Define and validate the controls that protect each stage of payroll.
**Scope:** input controls · validation controls · approval controls · output controls.
**Key Activities:** define required controls; validate they operate as designed;
document control effectiveness. PSE governs the controls; it does not perform the
controlled activity.
**Indicators:** control effectiveness · controls validated · control gaps flagged.

### 2. Fraud Risk Governance
**Objective:** Surface payroll fraud indicators before loss occurs.
**Scope:** time fraud · ghost employees · pay-rate manipulation · commission fraud.
**Key Activities:** detect and flag fraud indicators against patterns and thresholds;
explain why each was flagged; document for investigation. PSE surfaces indicators; the
organization investigates and acts.
**Indicators:** fraud indicators surfaced · ghost-employee flags · anomaly rate.

### 3. Segregation of Duties Governance
**Objective:** Validate that incompatible payroll duties are separated.
**Scope:** payroll administration · approval workflows · funding roles.
**Key Activities:** define required separation; validate role assignments against it;
flag SoD conflicts. PSE validates separation; it does not hold any of the duties.
**Indicators:** SoD conflicts flagged · separation coverage · open conflicts.

### 4. Audit Readiness Governance
**Objective:** Ensure payroll can withstand internal and external audit on demand.
**Scope:** documentation · evidence retention · audit support.
**Key Activities:** govern evidence completeness and retention; assemble audit packs;
support audit response with traceable records.
**Indicators:** audit-pack completeness · evidence retention coverage · open audit findings.

### 5. Exception Governance
**Objective:** Ensure payroll exceptions are reviewed consistently and resolved.
**Scope:** variance review · threshold monitoring · escalation procedures.
**Key Activities:** monitor against thresholds; route exceptions to owners; document
review and resolution.
**Indicators:** exception detection rate · unresolved exceptions · escalation cycle time.

### 6. Operational Risk Governance
**Objective:** Identify and govern structural risks to payroll continuity.
**Scope:** process-failure risk · key-person dependency · system-failure risk.
**Key Activities:** assess operational risk; flag single points of failure; document
mitigation ownership.
**Indicators:** key-person dependencies flagged · open operational risks · mitigation coverage.

## Maturity Model
**L1 Reactive** — losses discovered after the fact · **L2 Managed** — basic, documented
controls · **L3 Controlled** — validated controls and SoD · **L4 Optimized** —
automated detection and threshold monitoring · **L5 Governed** — continuous control
assurance with surfaced fraud indicators and full audit traceability.

## Expected Outcomes
Reduced payroll risk · stronger, validated controls · earlier fraud detection · better
audit outcomes · documented, defensible control posture.

## PSE Perspective
Controls without assurance are paperwork. PSE governs whether payroll controls actually
operate — validating effectiveness and surfacing the fraud and exception indicators that
precede loss, while the organization retains ownership of the response.
```

## Appendix O — `docs/framework/05-governance.md`

(One deviation applied per Scope Decision #13: the AI Governance Key Activities line no longer implies AI can "execute pay" under oversight.)

```markdown
# Payroll Governance
### Payroll Synergy Experts Framework — Domain 5

## Purpose
The Payroll Governance domain defines how decisions, policies, AI, and vendors across
the payroll environment are owned, approved, and held accountable.

Every other domain produces validations and findings. This domain governs who decides,
who approves, and who is accountable — including how AI participates in payroll decisions
and how the systems of record beneath PSE are overseen.

## Definition
Payroll governance is the oversight structure that assigns accountability for payroll
decisions, policies, AI use, and vendor performance. PSE does not own payroll policy on
the organization's behalf, and it does not operate the vendors it oversees. PSE provides
the governance structure: decision rights, approval paths, AI oversight, and vendor
review — all documented and auditable.

The organization owns the decisions. PSE governs how they are made, approved, and
recorded.

## Core Principles
Accountability · Decision traceability · Human approval · Vendor oversight · Policy
adherence · Executive visibility.

## Governance Domains

### 1. Policy Governance
**Objective:** Ensure payroll policy is defined, current, and enforced through validation.
**Scope:** payroll policies · standards · procedures.
**Key Activities:** govern policy definition and version; validate runs against current
policy; document policy adherence.
**Indicators:** policy adherence rate · policy currency · open policy gaps.

### 2. Decision Governance
**Objective:** Define who can decide and approve across the payroll environment.
**Scope:** approval authority · escalation paths · change governance.
**Key Activities:** define decision rights and escalation; validate approvals occurred;
document the decision trail.
**Indicators:** approval completeness · escalation adherence · unapproved-change flags.

### 3. AI Governance
**Objective:** Ensure AI used in payroll operates under human approval and full auditability.
**Scope:** AI usage · human oversight · decision review · auditability.
**Key Activities:** govern where AI is applied; require human approval on consequential
decisions; review AI outputs; document AI reasoning for audit. PSE governs AI in payroll;
AI advises and documents — it never executes pay, and consequential decisions carry
human approval.
**Indicators:** AI decisions reviewed · human-approval coverage · AI audit-trail completeness.

### 4. Vendor Governance
**Objective:** Oversee the performance and risk of the payroll vendors PSE sits above.
**Scope:** vendor oversight · risk assessment · performance review.
**Key Activities:** assess vendor risk; review processor and system-of-record
performance against expectations; document findings. PSE oversees vendors; it does not
replace them.
**Indicators:** vendor reviews completed · vendor risk flags · performance-gap findings.

### 5. Operational Governance
**Objective:** Assign roles, responsibilities, and accountability across payroll operations.
**Scope:** roles · responsibilities · accountability.
**Key Activities:** define the operating model and ownership; validate accountability is
assigned and exercised; document.
**Indicators:** ownership coverage · accountability gaps · governance reviews completed.

### 6. Strategic Governance
**Objective:** Give executives visibility into payroll risk and performance.
**Scope:** executive reporting · risk review · performance oversight.
**Key Activities:** deliver governed executive reporting; surface risk for leadership
review; document oversight decisions.
**Indicators:** reporting cadence met · executive risk reviews held · open strategic actions.

## Maturity Model
**L1 Reactive** — undefined ownership · **L2 Managed** — documented roles and policies ·
**L3 Controlled** — enforced decision rights and approvals · **L4 Optimized** —
governed AI with human oversight and vendor review · **L5 Governed** — continuous,
accountable governance with full decision traceability and executive visibility.

## Expected Outcomes
Clear accountability · traceable decisions · governed and human-approved AI · stronger
vendor oversight · transparent, sustainable payroll operations.

## PSE Perspective
Governance is where PSE's category lives. As payroll teams adopt AI faster than oversight
matures, PSE provides the structure that keeps decisions accountable, AI human-approved,
and vendors overseen — the control system above the systems of record.
```

## Appendix P — `docs/framework/06-workforce-intelligence.md`

```markdown
# Workforce Intelligence Governance
### Payroll Synergy Experts Framework — Domain 6

## Purpose
The Workforce Intelligence Governance domain defines how PSE turns governed payroll and
workforce data into traceable, defensible operational intelligence.

The differentiator here is governance, not dashboards. Any BI tool can chart headcount.
PSE governs the lineage behind the number — so every metric a leader acts on traces back
to validated source data, and the risk and exposure signals are surfaced, not buried.

## Definition
Workforce intelligence is the analysis derived from payroll, time, and workforce data.
PSE does not position itself as a general analytics or BI platform competing with HCM
reporting suites. PSE governs the *trustworthiness* of payroll-derived intelligence —
ensuring metrics are traceable to validated data — and surfaces the compliance, cost,
and risk signals that governance makes visible.

Reporting tools render the chart. PSE governs whether the underlying number can be trusted.

## Core Principles
Lineage · Traceability · Risk relevance · Accuracy · Timeliness · Decision support.

## Governance Domains

### 1. Compliance & Risk Intelligence
**Objective:** Surface emerging compliance and risk signals from governed payroll data.
**Scope:** emerging compliance risks · regulatory trend signals · exposure visibility.
**Key Activities:** analyze validation history for risk patterns; surface exposure;
document the basis. Signals trace to the validations that produced them.
**Indicators:** exposure flags surfaced · risk-trend coverage · lead time to risk visibility.

### 2. Labor Cost Intelligence
**Objective:** Make labor cost and overtime exposure visible and traceable.
**Scope:** labor spend · overtime liability · cost allocation.
**Key Activities:** analyze governed payroll data for cost exposure; flag overtime
liability; trace figures to source. PSE surfaces the exposure; it does not set budgets.
**Indicators:** labor-cost variance visibility · overtime-liability flags · allocation accuracy.

### 3. Payroll Operations Intelligence
**Objective:** Expose operational trends from the governance record.
**Scope:** error trends · processing-quality metrics · exception trends.
**Key Activities:** analyze run-validation history; surface recurring error patterns;
document root-cause trends.
**Indicators:** error-trend visibility · recurring-exception rate · metric lineage coverage.

### 4. Workforce Analytics Governance
**Objective:** Govern the integrity of workforce metrics so leaders can trust them.
**Scope:** headcount · turnover · retention metrics.
**Key Activities:** govern data lineage behind workforce metrics; validate source
integrity; document traceability. PSE governs the metric's trustworthiness; the reporting
layer renders it.
**Indicators:** metric lineage coverage · source-validation rate · disputed-metric count.

### 5. Productivity Intelligence
**Objective:** Surface workforce utilization signals from governed data.
**Scope:** hours worked · labor utilization · workforce efficiency.
**Key Activities:** analyze governed time data for utilization signals; flag anomalies;
document.
**Indicators:** utilization-signal coverage · anomaly flags · data-completeness behind signal.

### 6. Executive Decision Support
**Objective:** Deliver governed, traceable intelligence to leadership.
**Scope:** KPI dashboards · strategic reporting · forecasting inputs.
**Key Activities:** deliver governed KPI and risk reporting; ensure every figure traces
to validated data; document forecast assumptions.
**Indicators:** reporting traceability · forecast-input coverage · executive-report cadence.

## Maturity Model
**L1 Reactive** — numbers questioned and untrusted · **L2 Managed** — basic reporting ·
**L3 Controlled** — metrics validated against source · **L4 Optimized** — governed
lineage with surfaced risk and cost signals · **L5 Governed** — continuous, fully
traceable intelligence driving accountable decisions.

## Expected Outcomes
Trusted metrics · better decisions · improved forecasting · earlier risk and cost
visibility · intelligence defensible to audit and leadership.

## PSE Perspective
The value PSE adds to intelligence is governance: a labor-cost figure or compliance trend
is only useful if it can be trusted and traced. PSE governs that lineage, surfacing the
risk and cost signals leaders act on — without becoming a dashboard vendor.
```

## Appendix Q — `docs/framework/07-technology-and-automation.md`

```markdown
# Technology & Automation Governance
### Payroll Synergy Experts Framework — Domain 7

## Purpose
The Technology & Automation Governance domain defines how PSE governs the systems,
integrations, automation, and AI that make up the payroll technology environment.

This is the domain most prone to drift. "Payroll technology" can sound like PSE
administers payroll systems. It does not. PSE governs the technology environment that
executes payroll — configuration integrity, integration health, automation oversight,
and security posture — above the platforms, not inside them.

## Definition
The payroll technology environment is the platforms, integrations, automation, and AI
that run and connect payroll. PSE does not own, host, configure, or administer these
platforms. PSE governs them: validating configuration changes, monitoring integration
integrity, overseeing automated decisions, and governing security posture across the
stack.

The platforms execute. PSE governs how they are changed, connected, and secured.

## Core Principles
Configuration integrity · Integration health · Human-overseen automation · Auditability ·
Security · Resilience.

## Governance Domains

### 1. System-of-Record Governance
**Objective:** Govern the integrity of payroll-platform configuration and change.
**Scope:** payroll-platform configuration · change control · setup validation.
**Key Activities:** validate configuration changes before deployment; flag risky
changes; document config history. PSE governs configuration integrity; it does not
administer the platform.
**Indicators:** config-change validation coverage · risky-change flags · config drift detected.

### 2. Workforce Technology Governance
**Objective:** Govern the integrity of the WFM and timekeeping technology feeding payroll.
**Scope:** WFM · scheduling · timekeeping systems.
**Key Activities:** validate that workforce-tech outputs are fit for payroll; flag
configuration or feed issues; document. PSE oversees the data integrity; it does not run
the systems.
**Indicators:** feed-integrity coverage · workforce-tech exceptions · open issues.

### 3. Integration Governance
**Objective:** Monitor the technical integrity of data exchange across the stack.
**Scope:** APIs · data exchange · middleware.
**Key Activities:** monitor integration health; flag failures, schema breaks, and
latency; document integration incidents. PSE governs the integrity of what crosses the
integrations.
**Indicators:** integration success rate · failure-detection time · schema-break flags.

### 4. Automation Governance
**Objective:** Ensure payroll automation operates under oversight and remains auditable.
**Scope:** workflow automation · process automation · exception automation.
**Key Activities:** govern where automation is applied; require human oversight on
consequential steps; document automated actions for audit. PSE governs automation; it
does not let automation execute pay unsupervised.
**Indicators:** automation auditability · human-oversight coverage · automated-action traceability.

### 5. AI Governance (Technical Layer)
**Objective:** Govern the behavior and auditability of AI in the payroll stack.
**Scope:** predictive analytics · compliance monitoring · payroll intelligence models.
**Key Activities:** govern model application; validate AI outputs against expected
behavior; document AI reasoning. Pairs with Domain 5 AI Governance — here at the
technology layer.
**Indicators:** AI-output validation coverage · model-behavior flags · AI audit completeness.

### 6. Security & Architecture Governance
**Objective:** Govern access, security standards, and platform integrity.
**Scope:** access controls · security standards · platform governance.
**Key Activities:** govern access and segregation; validate security-standard adherence;
document security posture and incidents.
**Indicators:** access-control coverage · security findings tracked · standards adherence.

## Maturity Model
**L1 Reactive** — undocumented config, ad-hoc integrations · **L2 Managed** — basic
change and access control · **L3 Controlled** — validated config changes and monitored
integrations · **L4 Optimized** — governed automation with human oversight · **L5
Governed** — continuous, auditable governance across configuration, integration,
automation, AI, and security.

## Expected Outcomes
Reduced manual effort under oversight · greater scalability · improved operational
resilience · auditable automation and AI · stronger security posture across the stack.

## PSE Perspective
PSE does not run payroll technology — it governs it. As automation and AI take on more of
the payroll run, the differentiator is not who automates fastest, but who governs that
automation: validating configuration, overseeing automated decisions, and keeping the
whole stack auditable above the platforms that execute.
```

## Appendix R — sections to APPEND to the existing `docs/POSITIONING_STRATEGY.md`

The file already exists on `main` (Core Position / PSE Is / PSE Is Not / Competitive Position / Future Position). Do not touch any existing section. Append exactly this to the end of the file:

```markdown

## The One Rule

The system of record executes the transaction. PSE governs the environment.

## Boundary Substitution Table

Enforced line-by-line across the site and the PSE Framework (`docs/framework/`);
checked in CI by the boundary lint.

| Never say PSE… | Always say PSE… |
|---|---|
| performs | validates |
| processes | governs |
| funds / deposits | verifies |
| executes / releases / transmits | provides oversight |

**Acceptance test for any line of body copy:** could a salesperson at ADP, UKG,
Dayforce, Workday, Paylocity, or Ceridian read this and conclude PSE competes
for payroll processing? If yes, the line is wrong — rewrite it in governance voice.
```
