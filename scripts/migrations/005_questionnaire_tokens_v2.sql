-- 005_questionnaire_tokens_v2
-- Extends discovery_questionnaire_tokens (created in 003) to the ratified
-- Step 6 contract and adds the save/resume session table.
--
-- FK naming stays demo_request_id (not lead_id) per the ratified
-- "no risky rename until commercial_leads" decision; the application
-- layer exposes leadId.

ALTER TABLE discovery_questionnaire_tokens
  ADD COLUMN IF NOT EXISTS purpose TEXT NOT NULL DEFAULT 'DISCOVERY_QUESTIONNAIRE',
  ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_by TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE discovery_questionnaire_tokens
  ADD CONSTRAINT dqt_purpose_check CHECK (purpose IN ('DISCOVERY_QUESTIONNAIRE')),
  ADD CONSTRAINT dqt_expiry_check CHECK (expires_at > created_at),
  ADD CONSTRAINT dqt_used_check CHECK (used_at IS NULL OR used_at >= created_at),
  ADD CONSTRAINT dqt_revoked_check CHECK (revoked_at IS NULL OR revoked_at >= created_at);

-- Issuance revokes outstanding unused tokens for the same lead+purpose;
-- this index serves that scan and the consume lookup path.
CREATE INDEX IF NOT EXISTS dqt_active_idx
  ON discovery_questionnaire_tokens (demo_request_id, purpose)
  WHERE used_at IS NULL AND revoked_at IS NULL;

-- Save/resume sessions. One session per consumed invitation token. The
-- session row is the questionnaire response record for the MVP: validated
-- answers live in `answers` (JSONB, allowlisted server-side — never raw
-- uploads, never payroll data).
CREATE TABLE IF NOT EXISTS discovery_questionnaire_sessions (
  id SERIAL PRIMARY KEY,
  demo_request_id INTEGER NOT NULL REFERENCES demo_requests(id) ON DELETE CASCADE,
  questionnaire_token_id INTEGER NOT NULL UNIQUE
    REFERENCES discovery_questionnaire_tokens(id) ON DELETE CASCADE,
  resume_token_hash TEXT NOT NULL UNIQUE,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT dqs_expiry_check CHECK (expires_at > created_at),
  CONSTRAINT dqs_completed_check CHECK (completed_at IS NULL OR completed_at >= created_at)
);

CREATE INDEX IF NOT EXISTS dqs_lead_idx
  ON discovery_questionnaire_sessions (demo_request_id, created_at DESC);
