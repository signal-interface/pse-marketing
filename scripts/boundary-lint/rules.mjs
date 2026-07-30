export const PROHIBITED_VERB =
  String.raw`(?:process|processes|processed|processing|execute|executes|executed|executing|` +
  String.raw`run|runs|ran|running|fund|funds|funded|funding|perform|performs|performed|performing|` +
  String.raw`submit|submits|submitted|submitting|remit|remits|remitted|remitting|` +
  String.raw`deposit|deposits|deposited|depositing|disburse|disburses|disbursed|disbursing)`;

export const PROHIBITED_OBJECT =
  String.raw`(?:payroll|payrolls|payroll[\s-]?runs?|wages|funds|deposits|tax deposits|filings)`;

// Ratified substitutions. When one of these is the acting verb in the same
// clause, a nominal prohibited construction is a legitimate object, not a claim.
// "PSE verifies payroll funding" is correct voice.
export const GOVERNANCE_VERB =
  /\b(?:govern|governs|governed|governing|oversee|oversees|oversaw|overseeing|verify|verifies|verified|verifying|validate|validates|validated|validating|audit|audits|audited|auditing|review|reviews|reviewed|reviewing|monitor|monitors|monitored|monitoring)\b[^.;:!?]{0,40}$/i;

// Clause-scoped. Subject must be a system of record with no intervening
// clause terminator. Bare "systems"/"these systems" included: the positioning
// corpus uses it as the canonical SoR referent
// ("These systems execute payroll. PSE governs payroll.").
export const SOR_SUBJECT =
  /\b(?:ADP|UKG|Dayforce|Workday|Paylocity|Ceridian|system of record|systems of record|these systems|those systems|such systems|systems|processor|processors|financial institution|bank|payroll provider|provider|depositary)\b[^.;:!?]{0,60}$/i;

// STRUCTURAL negation only. Matched against the parent heading or list
// introducer, NEVER against the statement itself. This is what keeps
// "PSE does not store X, and PSE processes payroll" failing.
// Third alternative: a list introducer whose negation directly precedes the
// trailing colon ("CHAP may not:") establishes a negating context even
// without an explicit scope verb.
export const NEGATING_CONTEXT =
  /\b(?:will not|may not|does not|do not|cannot|must not|never|no|not)\b.*\b(?:adopt|claim|perform|do|offer|provide|support|include)\b|^\s*#{1,6}\s*(?:out of scope|exclusions?|prohibited|non-goals?|(?:what\s+)?PSE is not|patterns PSE will not)|\b(?:will not|may not|does not|do not|cannot|must not|never|not)\b[^:.;!?]*:\s*$/i;

export const PRAGMA = /boundary-lint-allow:\s*([a-z-]+)\s*--\s*(\S.*)$/i;

export const RULES = [
  {
    id: "prohibited-execution",
    pattern: new RegExp(
      String.raw`\b${PROHIBITED_VERB}\b[\s\S]{0,40}?\b${PROHIBITED_OBJECT}\b`, "i"),
  },
  {
    id: "prohibited-execution-nominal",
    pattern: new RegExp(
      String.raw`\b${PROHIBITED_OBJECT}[\s-]+(?:processing|execution|funding|performance|disbursement|remittance)\b`, "i"),
  },
  {
    id: "autonomous-system-write",
    pattern:
      /\bautonom(?:ous|ously)\b[\s\S]{0,60}\b(?:change|changes|changing|correct|corrects|correcting|update|updates|updating|write|writes|writing|execut\w+)\b/i,
  },
];

/**
 * @param {{statement:string, line:number, isListItem:boolean, context:string}} unit
 * @returns {Array<{rule:string, line:number, statement:string}>}
 */
export function evaluate(unit) {
  const hits = [];
  for (const rule of RULES) {
    const match = rule.pattern.exec(unit.statement);
    if (!match) continue;

    const pragma = PRAGMA.exec(unit.statement);
    if (pragma && pragma[1].toLowerCase() === rule.id && pragma[2].trim()) continue;

    const before = unit.statement.slice(0, match.index);
    if (SOR_SUBJECT.test(before)) continue;
    if (rule.id === "prohibited-execution-nominal" && GOVERNANCE_VERB.test(before)) continue;

    // Structural negation: list items inherit their parent's negating context.
    if (unit.isListItem && NEGATING_CONTEXT.test(unit.context)) continue;

    hits.push({
      rule: rule.id,
      line: unit.line,
      statement: unit.statement.replace(/\s+/g, " ").slice(0, 200),
    });
  }
  return hits;
}

// Abbreviations that end with a period but do not terminate a sentence.
const ABBREVIATION =
  /\b(?:e\.g|i\.e|etc|vs|cf|approx|U\.S|No|Sec|Inc|Ltd|Corp|Dept|Fig|Rev)\.$/i;

/**
 * Split prose into sentences without breaking on decimals ("3.5%"),
 * legal citations ("26 CFR §31.6302-1(f)"), or common abbreviations.
 * A split point is sentence punctuation followed by whitespace and an
 * opening-of-sentence character; decimals and citations never have
 * whitespace after the internal period, so they survive intact.
 * @returns {Array<{statement:string, line:number}>}
 */
export function splitProse(text, startLine) {
  const statements = [];
  const boundary = /[.!?]+(?=\s+[A-Z0-9"'(\[])|[.!?]+$/g;
  let cursor = 0;
  let match;
  while ((match = boundary.exec(text)) !== null) {
    const end = match.index + match[0].length;
    const candidate = text.slice(cursor, end);
    if (ABBREVIATION.test(candidate.trimEnd())) continue;
    const statement = candidate.trim();
    if (statement) {
      const lead = candidate.length - candidate.trimStart().length;
      const line =
        startLine + text.slice(0, cursor + lead).split("\n").length - 1;
      statements.push({ statement, line });
    }
    cursor = end;
  }
  const rest = text.slice(cursor);
  const tail = rest.trim();
  if (tail) {
    const lead = rest.length - rest.trimStart().length;
    const line =
      startLine + text.slice(0, cursor + lead).split("\n").length - 1;
    statements.push({ statement: tail, line });
  }
  return statements;
}

const LIST_MARKER = /^\s*(?:[-*+]|\d+\.)\s+/;
const HEADING = /^\s*#{1,6}\s+/;
const FENCE = /^\s*(?:```|~~~)/;

/**
 * Parse Markdown into independently reviewable statements.
 * Headings, list items, blockquotes, and table rows are each one statement.
 * Fenced code blocks are skipped entirely. List items carry `context`:
 * the nearest preceding heading, concatenated with the nearest preceding
 * non-list line ending in ":" when that line directly introduces the list.
 * Non-list statements always have an empty context.
 * @returns {Array<{statement:string, line:number, isListItem:boolean, context:string}>}
 */
export function parseMarkdown(content) {
  const units = [];
  const lines = content.split("\n");
  let inFence = false;
  let heading = "";
  let introducer = "";
  let paragraph = [];
  let paragraphStart = 1;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    for (const s of splitProse(paragraph.join("\n"), paragraphStart)) {
      units.push({ ...s, isListItem: false, context: "" });
    }
    paragraph = [];
  };

  lines.forEach((raw, index) => {
    const lineNumber = index + 1;

    if (FENCE.test(raw)) {
      flushParagraph();
      inFence = !inFence;
      return;
    }
    if (inFence) return;

    if (!raw.trim()) {
      flushParagraph();
      return;
    }

    if (HEADING.test(raw)) {
      flushParagraph();
      heading = raw.trim();
      introducer = "";
      units.push({
        statement: raw.trim(),
        line: lineNumber,
        isListItem: false,
        context: "",
      });
      return;
    }

    if (LIST_MARKER.test(raw)) {
      flushParagraph();
      units.push({
        statement: raw.replace(LIST_MARKER, "").trim(),
        line: lineNumber,
        isListItem: true,
        context: [heading, introducer].filter(Boolean).join(" "),
      });
      return;
    }

    if (/^\s*>/.test(raw)) {
      flushParagraph();
      units.push({
        statement: raw.replace(/^\s*>\s?/, "").trim(),
        line: lineNumber,
        isListItem: false,
        context: "",
      });
      return;
    }

    if (/^\s*\|/.test(raw)) {
      flushParagraph();
      const rowText = raw.replace(/^\s*\||\|\s*$/g, "").trim();
      if (!/^[\s|:-]*$/.test(rowText)) {
        units.push({
          statement: rowText,
          line: lineNumber,
          isListItem: false,
          context: "",
        });
      }
      return;
    }

    // Plain prose line: may introduce a following list when it ends with ":".
    introducer = /:\s*$/.test(raw) ? raw.trim() : "";
    if (paragraph.length === 0) paragraphStart = lineNumber;
    paragraph.push(raw);
  });

  flushParagraph();
  return units;
}

/**
 * Parse TypeScript/TSX line by line. Never splits on "." — member access
 * chains stay intact. Each nonempty line is one reviewable statement.
 * @returns {Array<{statement:string, line:number, isListItem:boolean, context:string}>}
 */
export function parseCode(content) {
  const units = [];
  content.split("\n").forEach((raw, index) => {
    const statement = raw.trim();
    if (!statement) return;
    units.push({ statement, line: index + 1, isListItem: false, context: "" });
  });
  return units;
}
