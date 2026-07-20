-- 002_lead_events
-- Append-only evidence trail for the commercial lifecycle. Status on
-- demo_requests is the lead's current state; lead_events is the complete
-- history. Rows are never updated or deleted by application code.

CREATE TABLE IF NOT EXISTS lead_events (
  id BIGSERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES demo_requests(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT,
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  source TEXT,
  request_id TEXT,
  external_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- actor_type is a small, stable set — enforce at the DB.
-- event_type will grow — enforced in application types only, so adding an
-- event type does not require a migration.
ALTER TABLE lead_events
  ADD CONSTRAINT lead_events_actor_type_check CHECK (actor_type IN (
    'SYSTEM',
    'PROSPECT',
    'FOUNDER',
    'TEAM_MEMBER',
    'CALENDAR_PROVIDER',
    'CRON'
  ));

CREATE INDEX IF NOT EXISTS lead_events_lead_idx
  ON lead_events (lead_id, created_at);
CREATE INDEX IF NOT EXISTS lead_events_type_idx
  ON lead_events (event_type, created_at DESC);

-- Webhook idempotency at the DB layer: external_id must be the provider's
-- per-delivery unique event id (NOT the booking id — reschedules of one
-- booking arrive as separate deliveries). A duplicate delivery violates this
-- index and the webhook route treats the conflict as "already processed".
CREATE UNIQUE INDEX IF NOT EXISTS lead_events_external_idempotency_idx
  ON lead_events (event_type, external_id)
  WHERE external_id IS NOT NULL;
