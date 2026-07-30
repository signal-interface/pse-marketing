// scripts/migrate.mjs
//
// Minimal forward-only migration runner. No new dependencies — uses the
// @vercel/postgres client already in the project.
//
// Usage:
//   POSTGRES_URL_NON_POOLING=... node scripts/migrate.mjs          # apply
//   POSTGRES_URL_NON_POOLING=... node scripts/migrate.mjs --status # dry status
//
// Rules:
// - Migrations are plain SQL files in scripts/migrations/, applied in
//   filename order. Prefix with a zero-padded sequence: 001_..., 002_...
// - Each file runs inside a single transaction. If any statement fails,
//   the file is rolled back and the runner stops.
// - Applied migrations are recorded in schema_migrations with a sha256
//   checksum. Editing an already-applied file is an error — write a new
//   migration instead.
// - Use the NON-POOLING connection string. DDL through PgBouncer in
//   transaction mode is unreliable.

import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@vercel/postgres";

const MIGRATIONS_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "migrations"
);

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error(
    "Missing POSTGRES_URL_NON_POOLING (preferred) or POSTGRES_URL."
  );
  process.exit(1);
}

const statusOnly = process.argv.includes("--status");

const sha256 = (text) => createHash("sha256").update(text).digest("hex");

async function main() {
  const client = createClient({ connectionString });
  await client.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename TEXT PRIMARY KEY,
        checksum TEXT NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const { rows: appliedRows } = await client.query(
      "SELECT filename, checksum FROM schema_migrations ORDER BY filename"
    );
    const applied = new Map(appliedRows.map((r) => [r.filename, r.checksum]));

    const files = readdirSync(MIGRATIONS_DIR)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    // Integrity check: applied files must exist and be unmodified.
    for (const [filename, checksum] of applied) {
      if (!files.includes(filename)) {
        throw new Error(
          `Applied migration ${filename} is missing from ${MIGRATIONS_DIR}.`
        );
      }
      const current = sha256(readFileSync(join(MIGRATIONS_DIR, filename), "utf8"));
      if (current !== checksum) {
        throw new Error(
          `Applied migration ${filename} has been modified after apply. ` +
            "Write a new migration instead of editing history."
        );
      }
    }

    const pending = files.filter((f) => !applied.has(f));

    if (statusOnly) {
      for (const f of files) {
        console.log(`${applied.has(f) ? "applied" : "PENDING"}  ${f}`);
      }
      return;
    }

    if (pending.length === 0) {
      console.log("No pending migrations.");
      return;
    }

    for (const filename of pending) {
      const text = readFileSync(join(MIGRATIONS_DIR, filename), "utf8");
      process.stdout.write(`Applying ${filename} ... `);
      try {
        await client.query("BEGIN");
        await client.query(text);
        await client.query(
          "INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2)",
          [filename, sha256(text)]
        );
        await client.query("COMMIT");
        console.log("ok");
      } catch (err) {
        await client.query("ROLLBACK");
        console.log("FAILED");
        throw err;
      }
    }

    console.log(`Applied ${pending.length} migration(s).`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
