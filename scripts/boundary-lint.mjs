import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { evaluate, parseCode, parseMarkdown, RULES } from "./boundary-lint/rules.mjs";

// BOUNDARY_LINT_ROOT is a test hook: it lets the suite point the control at a
// fixture tree to prove the missing-scope failure path. Production runs never set it.
const ROOT = process.env.BOUNDARY_LINT_ROOT
  ? path.resolve(process.env.BOUNDARY_LINT_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// src/app, src/components, and src/content cover every component that
// renders to a prospect — the former narrow entries (src/app/product-tour,
// src/app/trust, src/content/trust) are subsumed, not dropped.
const SCOPES = [
  "docs/gtm",
  "docs/POSITIONING_STRATEGY.md",
  "docs/DEMO_FREEZE_GTM_STRATEGY.md",
  "src/app",
  "src/components",
  "src/content",
  "src/lib/constants.ts",
  "src/data/services.ts",
];

const EXTENSIONS = new Set([".md", ".ts", ".tsx"]);

async function collectFiles(root) {
  const info = await stat(root);
  if (info.isFile()) return [root];

  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(target)));
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      files.push(target);
    }
  }
  return files;
}

const files = [];
for (const scope of SCOPES) {
  try {
    files.push(...(await collectFiles(path.join(ROOT, scope))));
  } catch {
    console.error(
      `Boundary lint control error: required scope path "${scope}" is missing. ` +
        `Every path in SCOPES is part of the ratified commercial-boundary control surface; ` +
        `if it was renamed, update SCOPES to the new location — do not drop it.`,
    );
    process.exit(2);
  }
}

const violations = [];
for (const file of files) {
  const content = await readFile(file, "utf8");
  const units = file.endsWith(".md") ? parseMarkdown(content) : parseCode(content);
  for (const unit of units) {
    for (const hit of evaluate(unit)) {
      violations.push({ file, ...hit });
    }
  }
}

if (violations.length > 0) {
  console.error("Boundary lint failed:");
  for (const v of violations) {
    console.error(
      `${path.relative(ROOT, v.file)}:${v.line} [${v.rule}] ${v.statement}`,
    );
  }
  process.exit(1);
}

console.log(
  `Boundary lint passed: ${files.length} files, ${RULES.length} rules, ` +
    `${SCOPES.length} scopes, 0 violations.`,
);
