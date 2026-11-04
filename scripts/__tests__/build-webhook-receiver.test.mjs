import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  checkReceiverEnvironment, verifyReceiverSourceTree,
  verifyReceiverManifest, ALLOWED_APP_FILES, REQUIRED_SOURCES,
  RECEIVER_SECRETS,
} from "../build-webhook-receiver.mjs";

const environment = () => ({
  PSE_CALHOOK_RECEIVER_BUILD: "receiver-only",
  VERCEL_ENV: "preview",
  VERCEL_PROJECT_ID: "prj_separate_receiver_test",
  POSTGRES_URL: "postgres://synthetic-only",
  CALCOM_WEBHOOK_SECRET: "synthetic-only",
  LINK_SIGNING_SECRET: "synthetic-only",
});

describe("standalone webhook-only receiver build contract", () => {
  it("includes only approved application files and four original source modules", () => {
    assert.deepEqual(ALLOWED_APP_FILES, [
      "src/app/layout.tsx", "src/app/api/webhooks/calendar/route.ts",
    ]);
    assert.deepEqual(REQUIRED_SOURCES, [
      "src/app/api/webhooks/calendar/route.ts",
      "src/lib/commercial/lifecycle.ts",
      "src/lib/commercial/scheduling.ts",
      "src/lib/commercial/links.ts",
    ]);
    verifyReceiverSourceTree(ALLOWED_APP_FILES);
    for (const extra of [
      "src/app/page.tsx",
      "src/app/api/demo-request/route.ts",
      "src/app/api/internal/route.ts",
      "src/app/api/chap/ask/route.ts",
      "src/app/api/lead-capture/route.ts",
    ]) assert.throws(() => verifyReceiverSourceTree([...ALLOWED_APP_FILES, extra]));
  });

  it("refuses original marketing project and Production builds", () => {
    assert.throws(() => checkReceiverEnvironment({
      ...environment(), VERCEL_PROJECT_ID: "prj_Pk3fOzVQBe2hV95FCDcd5eNawi8o",
    }));
    assert.throws(() => checkReceiverEnvironment({
      ...environment(), VERCEL_ENV: "production",
    }));
    assert.throws(() => checkReceiverEnvironment({
      ...environment(), PSE_CALHOOK_RECEIVER_BUILD: "0",
    }));
  });

  it("fails closed for absent receiver credentials and shared marketing keys", () => {
    for (const key of RECEIVER_SECRETS) {
      const env = environment();
      delete env[key];
      assert.throws(() => checkReceiverEnvironment(env));
    }
    for (const key of [
      "RESEND_API_KEY", "ANTHROPIC_API_KEY", "INTERNAL_API_SECRET",
      "COMMERCIAL_IP_HASH_SALT", "NOTIFICATION_EMAIL",
    ]) assert.throws(() => checkReceiverEnvironment({
      ...environment(), [key]: "synthetic-only",
    }));
  });

  it("permits only the webhook route in built app manifest", () => {
    verifyReceiverManifest({
      "/_not-found/page": "app/_not-found/page.js",
      "/api/webhooks/calendar/route": "app/api/webhooks/calendar/route.js",
    });
    assert.throws(() => verifyReceiverManifest({
      "/page": "app/page.js",
      "/api/webhooks/calendar/route": "app/api/webhooks/calendar/route.js",
    }));
    assert.throws(() => verifyReceiverManifest({ "/page": "app/page.js" }));
  });
});
