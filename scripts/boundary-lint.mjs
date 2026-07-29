import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const SCOPES = ["docs/gtm", "src/app/product-tour"];
const EXTENSIONS = new Set([".md", ".ts", ".tsx"]);

const NEGATED_BOUNDARY =
  /\b(?:does not|do not|doesn't|don't|must not|will not|won't|cannot|can't|never|may not|is not authorized to|are not authorized to|no authority to|prohibited from|instead of|rather than|without)\b/i;

const RULES = [
  {
    id: "payroll-processing-authority",
    pattern:
      /\b(?:PSE|CHAP|marketing site|product tour)\b[\s\S]{0,240}\b(?:(?:process(?:es|ed|ing)?|run(?:s|ning)?|execute(?:s|d|ing)?|submit(?:s|ted|ting)?|file(?:s|d|ing)?)\s+payroll|payroll[\s-]+(?:processing|execution))\b/i,
  },
  {
    id: "autonomous-payroll-action",
    pattern:
      /\bautonom(?:ous|ously)[\s-]+(?:(?:payroll|payroll-system)[\s-]+)?(?:action|execution|change|changes|changing|execute|executes|executing)\b/i,
  },
  {
    id: "payroll-system-write-authority",
    pattern:
      /\b(?:PSE|CHAP|marketing site|product tour)\b[\s\S]{0,240}\b(?:change|changes|changing|correct|corrects|correcting|update|updates|updating|write|writes|writing)\b[\s\S]{0,80}\bpayroll system\b/i,
  },
];

async function collectFiles(root) {
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

function splitSentences(text, startLine) {
  const statements = [];
  const sentencePattern = /[^.!?]+(?:[.!?]+|$)/gs;

  for (const match of text.matchAll(sentencePattern)) {
    const statement = match[0].trim();
    if (!statement) continue;

    const lineOffset = text.slice(0, match.index).split("\n").length - 1;
    statements.push({ statement, line: startLine + lineOffset });
  }

  return statements;
}

function markdownStatements(content) {
  const statements = [];
  const lines = content.split("\n");
  let paragraph = [];
  let paragraphStart = 1;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    statements.push(...splitSentences(paragraph.join("\n"), paragraphStart));
    paragraph = [];
  };

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const isStandalone =
      /^\s*(?:[-*+]\s+|\d+\.\s+|\|)/.test(line) ||
      /^\s*#{1,6}\s+/.test(line);

    if (!line.trim()) {
      flushParagraph();
      return;
    }

    if (isStandalone) {
      flushParagraph();
      statements.push(...splitSentences(line, lineNumber));
      return;
    }

    if (paragraph.length === 0) paragraphStart = lineNumber;
    paragraph.push(line);
  });

  flushParagraph();
  return statements;
}

function codeStatements(content) {
  return splitSentences(content, 1);
}

const files = (
  await Promise.all(SCOPES.map((scope) => collectFiles(scope)))
).flat();
const violations = [];

for (const file of files) {
  const content = await readFile(file, "utf8");
  const statements = file.endsWith(".md")
    ? markdownStatements(content)
    : codeStatements(content);

  for (const { statement, line } of statements) {
    for (const rule of RULES) {
      if (rule.pattern.test(statement) && !NEGATED_BOUNDARY.test(statement)) {
        violations.push({
          file,
          line,
          rule: rule.id,
          statement: statement.replace(/\s+/g, " ").trim(),
        });
      }
    }
  }
}

if (violations.length > 0) {
  console.error("Boundary lint failed:");
  for (const violation of violations) {
    console.error(
      `${violation.file}:${violation.line} [${violation.rule}] ${violation.statement}`,
    );
  }
  process.exit(1);
}

console.log(
  `Boundary lint passed (${files.length} files across ${SCOPES.join(", ")}).`,
);
