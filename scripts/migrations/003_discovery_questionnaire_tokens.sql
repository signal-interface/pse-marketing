-- 003_discovery_questionnaire_tokens
-- One-time access tokens for the discovery questionnaire. Only the sha256
-- hash of the token is stored; the raw token exists solely in the email link.
-- Consumption is atomic: UPDATE ... WHERE used_at IS NULL RETURNING.

CREATE TABLE IF NOT EXISTS discovery_questionnaire_tokens (
  id SERIAL PRIMARY KEY,
  demo_request_id INTEGER NOT NULL REFERENCES demo_requests(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS dqt_lead_idx
  ON discovery_questionnaire_tokens (demo_request_id, created_at DESC);
