-- 006_discovery_briefs
-- Internal sales-preparation artifacts generated deterministically from
-- submitted questionnaire answers. Versioned: regeneration with changed
-- answers inserts a new version; identical answers are idempotent.
-- Briefs are preparation artifacts only — never compliance determinations,
-- scores, or findings — and never write lead_status.

CREATE TABLE IF NOT EXISTS discovery_briefs (
  id SERIAL PRIMARY KEY,
  demo_request_id INTEGER NOT NULL REFERENCES demo_requests(id) ON DELETE CASCADE,
  session_id INTEGER NOT NULL REFERENCES discovery_questionnaire_sessions(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  generator_version TEXT NOT NULL,
  answers_hash TEXT NOT NULL,
  answers_snapshot JSONB NOT NULL,
  content JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  CONSTRAINT discovery_briefs_version_unique UNIQUE (demo_request_id, version),
  CONSTRAINT discovery_briefs_reviewed_check
    CHECK (reviewed_at IS NULL OR reviewed_at >= generated_at)
);

CREATE INDEX IF NOT EXISTS discovery_briefs_lead_idx
  ON discovery_briefs (demo_request_id, version DESC);
