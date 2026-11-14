// Simple keyword/tag retrieval for the CHAP AI compliance corpus.
//
// Deliberately dumb. v1 corpus is ~10 entries — token/tag overlap is
// enough signal. When the corpus grows past ~30 entries we revisit with
// embeddings, but that's not v1's problem.

import {
  COMPLIANCE_CORPUS,
  type CorpusEntry,
} from "@/data/complianceCorpus";

// Common English filler. Removed before scoring so a "how does X work"
// question doesn't boost every entry equally.
const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "of", "to", "in", "on",
  "at", "for", "with", "by", "from", "as", "is", "are", "was", "were",
  "be", "been", "being", "have", "has", "had", "do", "does", "did",
  "will", "would", "should", "could", "can", "may", "might", "must",
  "this", "that", "these", "those", "i", "you", "he", "she", "it",
  "we", "they", "my", "your", "his", "her", "its", "our", "their",
  "me", "him", "us", "them", "what", "which", "who", "whom", "when",
  "where", "why", "how", "not", "no", "so", "than", "too", "very",
  "just", "about",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9§]+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
}

function scoreEntry(entry: CorpusEntry, tokens: string[]): number {
  if (tokens.length === 0) return 0;

  const contentLower = entry.content.toLowerCase();
  const citationLower = entry.citation.toLowerCase();

  let score = 0;

  for (const token of tokens) {
    // +1 for each question token found in content
    if (contentLower.includes(token)) score += 1;

    // +2 per tag match (exact token == tag token, or token appears in a tag)
    for (const tag of entry.tags) {
      const tagLower = tag.toLowerCase();
      if (tagLower === token || tagLower.split(/\s+/).includes(token)) {
        score += 2;
        break; // count at most one tag match per question token
      }
    }

    // +3 per citation-string match (token appears in citation)
    if (citationLower.includes(token)) score += 3;
  }

  return score;
}

export function retrieveRelevantCorpus(
  question: string,
  maxResults: number = 5
): CorpusEntry[] {
  const tokens = tokenize(question);

  const scored = COMPLIANCE_CORPUS
    .filter((entry) => entry.sourceType !== "pse_written")
    .map((entry) => ({
    entry,
    score: scoreEntry(entry, tokens),
  }));

  const hasAnyScore = scored.some((s) => s.score > 0);

  if (!hasAnyScore) {
    // No signal at all — hand the full corpus to the model and let it
    // decide out_of_scope. The corpus is small enough that this is
    // cheap.
    return scored.map((item) => item.entry).slice(0, maxResults);
  }

  scored.sort((a, b) => b.score - a.score);

  return scored
    .filter((s) => s.score > 0)
    .slice(0, maxResults)
    .map((s) => s.entry);
}
