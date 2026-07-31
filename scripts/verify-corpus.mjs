// Mechanical corpus verification: no model in the loop.
// For each non-pse_written entry, fetch sourceUrl, strip HTML to text,
// normalize both sides, and require every paragraph of `content` to be
// a substring of the page text.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const CORPUS_PATH = process.argv[2];
const CACHE = process.argv[3] || "/tmp/corpus-cache";

const mod = await import(CORPUS_PATH);
const corpus = mod.COMPLIANCE_CORPUS;

function fetchPage(url) {
  const key = CACHE + "/" + url.replace(/[^a-z0-9]/gi, "_") + ".html";
  if (!existsSync(key)) {
    execSync(
      `curl -sL --fail -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36" -o "${key}" "${url.split("#")[0]}"`,
      { timeout: 60000 }
    );
  }
  return readFileSync(key, "utf8");
}

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#8216;|&#8217;|&lsquo;|&rsquo;/g, "'")
    .replace(/&sect;/g, "§")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

// Word-sequence normalization: strips ALL punctuation so heading
// separators and quote styles don't mask or fake a match. What remains
// must match as an exact ordered word sequence — still mechanical.
function normalize(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}


let failures = 0;
for (const entry of corpus) {
  if (entry.sourceType === "pse_written") {
    console.log(`SKIP  ${entry.id} (pse_written — no external source of record)`);
    continue;
  }
  let pageText;
  try {
    pageText = normalize(htmlToText(fetchPage(entry.sourceUrl)));
  } catch (e) {
    console.log(`FETCH-FAIL ${entry.id}: ${e.message.split("\n")[0]}`);
    failures++;
    continue;
  }
  // `content` is verbatim source text with zero exceptions — PSE
  // commentary lives in `editorialNote` and is not verified against
  // (or permitted in) the source. No carve-outs here by design: a
  // binary property is auditable.
  const paragraphs = entry.content
    .split(/\n\s*\n/)
    .map(normalize)
    .filter(Boolean);
  const missing = paragraphs.filter((p) => !pageText.includes(p));
  if (missing.length === 0) {
    console.log(`OK    ${entry.id} (${paragraphs.length}/${paragraphs.length} paragraphs verbatim)`);
  } else {
    failures++;
    console.log(`FAIL  ${entry.id} (${missing.length}/${paragraphs.length} paragraphs NOT found):`);
    for (const m of missing) console.log(`      · ${m.slice(0, 110)}...`);
  }
}
process.exit(failures ? 1 : 0);
