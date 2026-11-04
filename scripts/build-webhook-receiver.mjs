#!/usr/bin/env node
/**
 * PSE-CALHOOK-RECEIVER-001: build-only, fail-closed webhook receiver.
 *
 * This script is exclusively for a NEW, separately authorized Vercel project.
 * The main pse-marketing project's normal \`next build\` is unchanged.
 * It temporarily stages a minimal Next.js app, builds it, then restores the
 * working tree; the output contains only the calendar webhook app route.
 *
 * NEVER run this against production, a shared workspace, or with real
 * production credentials. The receiver project is not provisioned by this PR.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MAIN_MARKETING_PROJECT = "prj_Pk3fOzVQBe2hV95FCDcd5eNawi8o";
export const REQUIRED_SOURCES = Object.freeze([
  "src/app/api/webhooks/calendar/route.ts",
  "src/lib/commercial/lifecycle.ts",
  "src/lib/commercial/scheduling.ts",
  "src/lib/commercial/links.ts",
]);
export const ALLOWED_APP_FILES = Object.freeze([
  "src/app/layout.tsx",
  "src/app/api/webhooks/calendar/route.ts",
]);
export const RECEIVER_SECRETS = Object.freeze([
  "POSTGRES_URL",
  "CALCOM_WEBHOOK_SECRET",
  "LINK_SIGNING_SECRET",
]);

export function checkReceiverEnvironment(env) {
  assert.equal(env.PSE_CALHOOK_RECEIVER_BUILD, "receiver-only",
    "Receiver-only build flag is required; do not use the marketing project.");
  assert.notEqual(env.VERCEL_PROJECT_ID, MAIN_MARKETING_PROJECT,
    "Refusing to build receiver in the original marketing Vercel project.");
  if (env.VERCEL_ENV) assert.equal(env.VERCEL_ENV, "preview",
    "Receiver acceptance builds must remain Preview only.");
  const forbidden = [
    "RESEND_API_KEY", "ANTHROPIC_API_KEY", "INTERNAL_API_SECRET",
    "NOTIFICATION_EMAIL", "COMMERCIAL_IP_HASH_SALT",
    "OPENAI_API_KEY", "PSE_OVERVIEW_VIDEO_URL", "POSTGRES_PASSWORD",
    "DATABASE_URL", "PGPASSWORD",
  ];
  const found = forbidden.filter(k => Boolean(env[k]));
  assert.equal(found.length, 0,
    "Refusing receiver build: prohibited application credentials are present.");
  for (const key of RECEIVER_SECRETS) {
    assert.ok(typeof env[key] === "string" && env[key].length > 0,
      "Receiver credential missing: " + key);
  }
}

export function verifyReceiverSourceTree(sourceFiles) {
  const sorted = [...sourceFiles].sort();
  assert.deepEqual(sorted, [...ALLOWED_APP_FILES].sort(),
    "Receiver must have exactly the allowed app layout and one webhook route.");
}

export function verifyReceiverManifest(manifest) {
  const routes = Object.values(manifest).map(String);
  // Next.js emits framework-owned not-found routes in addition to our one
  // business app route; no other application page/route may be shipped.
  const businessRoutes = routes.filter(x =>
    !x.includes("/_not-found") && !x.includes("/_error"));
  assert.equal(businessRoutes.length, 1,
    "Receiver output must contain exactly one business route.");
  assert.ok(businessRoutes[0].includes("/api/webhooks/calendar/route"),
    "Receiver build does not contain the approved calendar webhook.");
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(ent => {
    const abs = path.join(dir, ent.name);
    return ent.isDirectory() ? walkFiles(abs) : [abs];
  });
}

function run() {
  checkReceiverEnvironment(process.env);
  for (const rel of REQUIRED_SOURCES) {
    assert.ok(fs.statSync(path.join(root, rel)).isFile(), "Required source missing: " + rel);
  }
  assert.ok(!fs.existsSync(path.join(root, "pages")),
    "Unexpected root-level pages directory.");
  const backup = path.join(root, ".calhook-backup-" + process.pid);
  assert.ok(!fs.existsSync(backup), "Previous staging directory exists.");
  const originalSrc = path.join(root, "src");
  const config = path.join(root, "next.config.ts");
  const tsconfig = path.join(root, "tsconfig.json");
  const publicDir = path.join(root, "public");
  const configBytes = fs.readFileSync(config);
  const tsconfigBytes = fs.readFileSync(tsconfig);
  let movedSrc = false, movedPublic = false;
  fs.mkdirSync(backup);
  try {
    fs.renameSync(originalSrc, path.join(backup, "src"));
    movedSrc = true;
    if (fs.existsSync(publicDir)) {
      fs.renameSync(publicDir, path.join(backup, "public"));
      movedPublic = true;
    }
    // Copy ONLY the reviewed transitive import closure; not the website.
    for (const rel of REQUIRED_SOURCES) {
      const target = path.join(root, rel);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(backup, rel), target);
    }
    const layout = path.join(root, "src/app/layout.tsx");
    fs.writeFileSync(layout,
      'export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }\n');
    fs.writeFileSync(config, 'import type { NextConfig } from "next";\nconst config: NextConfig = {};\nexport default config;\n');
    const stagedApp = walkFiles(path.join(root, "src/app"))
      .map(abs => path.relative(root, abs).replaceAll(path.sep, "/"));
    verifyReceiverSourceTree(stagedApp);
    // The application only has a webhook; there is no middleware and no
    // public folder, static marketing asset, HTML homepage or additional API.
    assert.equal(fs.existsSync(path.join(root, "src/middleware.ts")), false);
    assert.equal(fs.existsSync(publicDir), false);
    fs.rmSync(path.join(root, ".next"), { recursive: true, force: true });
    const nextBin = path.join(root, "node_modules/next/dist/bin/next");
    const result = spawnSync(process.execPath, [nextBin, "build"], {
      cwd: root, env: process.env, stdio: "inherit",
    });
    assert.equal(result.status, 0, "Receiver Next build failed.");
    const manifestPath = path.join(root, ".next/server/app-paths-manifest.json");
    verifyReceiverManifest(JSON.parse(fs.readFileSync(manifestPath, "utf8")));
    // No dependency except the reviewed commercial route modules can be
    // linked into the receiver's deployable app.
    fs.writeFileSync(path.join(root, ".next/calhook-receiver-evidence.json"),
      JSON.stringify({ role: "webhook-only", route: "/api/webhooks/calendar",
        sourceFiles: REQUIRED_SOURCES, credentials: RECEIVER_SECRETS,
        status: "build-verified-not-deployed" }, null, 2) + "\n");
    process.stdout.write("Receiver-only build verified; no project provisioned.\n");
  } finally {
    if (movedSrc) {
      fs.rmSync(originalSrc, { recursive: true, force: true });
      fs.renameSync(path.join(backup, "src"), originalSrc);
    }
    if (movedPublic) fs.renameSync(path.join(backup, "public"), publicDir);
    fs.writeFileSync(config, configBytes);
    fs.writeFileSync(tsconfig, tsconfigBytes);
    fs.rmSync(backup, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run();
}
