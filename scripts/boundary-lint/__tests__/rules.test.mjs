import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { evaluate, parseCode, parseMarkdown } from "../rules.mjs";

const lintMarkdown = (md) =>
  parseMarkdown(md).flatMap((unit) => evaluate(unit));

const lintProse = (text) => lintMarkdown(text);

describe("prohibited execution language (must fail)", () => {
  const mustFail = [
    "PSE processes payroll for enterprise clients.",
    "PSE does not store credentials, and PSE processes payroll for enterprise clients.",
    "PSE processes payroll without error.",
    "PSE performs payroll execution.",
    "PSE funds payroll.",
    "PSE autonomously updates the payroll system.",
  ];

  it.each(mustFail)("flags: %s", (statement) => {
    expect(lintProse(statement).length).toBeGreaterThan(0);
  });
});

describe("governance voice and system-of-record attribution (must pass)", () => {
  const mustPass = [
    "PSE governs payroll operations.",
    "PSE oversees payroll controls.",
    "PSE validates payroll results.",
    "PSE verifies payroll funding.",
    "ADP processes payroll after the approved file is transmitted.",
    "The system of record executes the payroll run.",
    "These systems execute payroll. PSE governs payroll.",
  ];

  it.each(mustPass)("allows: %s", (statement) => {
    expect(lintProse(statement)).toEqual([]);
  });
});

describe("structural negation discrimination", () => {
  const bullet =
    "- Payroll processing, funds movement, PEO, or employer-of-record positioning";

  it("passes a noun-phrase bullet under a negating heading", () => {
    const md = `## Patterns PSE will not adopt\n\n${bullet}\n`;
    expect(lintMarkdown(md)).toEqual([]);
  });

  it("fails the identical bullet under a non-negating heading", () => {
    const md = `## What PSE delivers\n\n${bullet}\n`;
    expect(lintMarkdown(md).length).toBeGreaterThan(0);
  });

  it("inherits negation from a colon list introducer (CHAP may not:)", () => {
    const md = [
      "## Context Hub boundaries",
      "",
      "CHAP may not:",
      "",
      "- execute payroll or system changes;",
      "- conceal uncertainty or source conflict.",
      "",
    ].join("\n");
    expect(lintMarkdown(md)).toEqual([]);
  });

  it("does not inherit negation from a positive colon introducer", () => {
    const md = [
      "## Context Hub scope",
      "",
      "CHAP may:",
      "",
      "- execute payroll or system changes;",
      "",
    ].join("\n");
    expect(lintMarkdown(md).length).toBeGreaterThan(0);
  });

  it("treats a bare 'PSE Is Not' heading as negating", () => {
    const md = "## PSE Is Not\n\n- Payroll funding provider\n";
    expect(lintMarkdown(md)).toEqual([]);
  });

  it("still fails the same bullet under a positive 'PSE Is' heading", () => {
    const md = "## PSE Is\n\n- Payroll funding provider\n";
    expect(lintMarkdown(md).length).toBeGreaterThan(0);
  });

  it("never exempts a non-list statement via context", () => {
    const md = "## Patterns PSE will not adopt\n\nPSE processes payroll.\n";
    expect(lintMarkdown(md).length).toBeGreaterThan(0);
  });
});

describe("pragma handling", () => {
  it("passes with the correct rule id and a justification", () => {
    const hits = lintProse(
      "PSE processes payroll. boundary-lint-allow: prohibited-execution -- verbatim quote from vendor RFP",
    );
    expect(hits).toEqual([]);
  });

  it("fails with the wrong rule id", () => {
    const hits = lintProse(
      "PSE processes payroll. boundary-lint-allow: autonomous-system-write -- verbatim quote from vendor RFP",
    );
    expect(hits.length).toBeGreaterThan(0);
  });

  it("fails with an empty justification", () => {
    const hits = lintProse(
      "PSE processes payroll. boundary-lint-allow: prohibited-execution --",
    );
    expect(hits.length).toBeGreaterThan(0);
  });
});

describe("statement parsing", () => {
  it("keeps TypeScript member access intact, one statement per line", () => {
    const units = parseCode('const x = foo.bar();\nconst y = baz.qux.quux("payroll");\n');
    expect(units.map((u) => u.statement)).toEqual([
      "const x = foo.bar();",
      'const y = baz.qux.quux("payroll");',
    ]);
  });

  it("does not split prose on decimals or legal citations", () => {
    const units = parseMarkdown(
      "The penalty under 26 CFR §31.6302-1(f) is 3.5% of the shortfall. A second sentence follows.\n",
    );
    expect(units).toHaveLength(2);
    expect(units[0].statement).toContain("§31.6302-1(f)");
    expect(units[0].statement).toContain("3.5%");
  });

  it("skips fenced code blocks", () => {
    const md = "```\nPSE processes payroll here.\n```\n";
    expect(lintMarkdown(md)).toEqual([]);
  });

  it("treats table rows and blockquotes as reviewable statements", () => {
    const md = [
      "| Capability | Owner |",
      "| --- | --- |",
      "| PSE processes payroll | PSE |",
      "",
      "> PSE processes payroll.",
      "",
    ].join("\n");
    expect(lintMarkdown(md).length).toBeGreaterThanOrEqual(2);
  });
});

describe("CLI missing-scope behavior", () => {
  const cli = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../boundary-lint.mjs",
  );

  it("exits with code 2 and names the missing scope path", () => {
    const emptyRoot = mkdtempSync(path.join(tmpdir(), "boundary-lint-"));
    const result = spawnSync(process.execPath, [cli], {
      env: { ...process.env, BOUNDARY_LINT_ROOT: emptyRoot },
      encoding: "utf8",
    });
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("docs/gtm");
    expect(result.stderr).toContain("missing");
  });

  it("runs clean against the real repository tree", () => {
    const out = execFileSync(process.execPath, [cli], { encoding: "utf8" });
    expect(out).toContain("Boundary lint passed");
  });
});
