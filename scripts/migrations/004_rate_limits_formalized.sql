-- 004_rate_limits_formalized
-- chap_rate_limits was previously created lazily by CHAP routes
-- (ensureChapRateLimitsTable). The demo-request route now also depends on
-- it, so the schema is formalized under migrations. IF NOT EXISTS keeps
-- this a no-op in production where the table already exists.

CREATE TABLE IF NOT EXISTS chap_rate_limits (
  scope TEXT NOT NULL,
  identifier TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (scope, identifier)
);

CREATE INDEX IF NOT EXISTS chap_rate_limits_window_idx
  ON chap_rate_limits (window_start);
