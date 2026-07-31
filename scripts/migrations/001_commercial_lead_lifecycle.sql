-- 001_commercial_lead_lifecycle
-- Evolves demo_requests into the canonical commercial lead entity.
-- Ratified doctrine: demo_requests is the lead record; rename to
-- commercial_leads is deferred to a later migration.

-- Ensure the table exists even on a fresh database (mirrors ensureDemoRequestsTable
-- so the migration is self-sufficient in preview/branch environments).
CREATE TABLE IF NOT EXISTS demo_requests (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  employees TEXT,
  source TEXT DEFAULT 'pse-marketing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Identity fields (new writes use separated names; legacy `name` is preserved).
ALTER TABLE demo_requests
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS job_title TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT;

-- Organizational context.
ALTER TABLE demo_requests
  ADD COLUMN IF NOT EXISTS payroll_regions TEXT[],
  ADD COLUMN IF NOT EXISTS current_hcm TEXT,
  ADD COLUMN IF NOT EXISTS current_payroll_provider TEXT;

-- Lifecycle state. `lead_status` is written ONLY by transitionLead().
ALTER TABLE demo_requests
  ADD COLUMN IF NOT EXISTS lead_status TEXT NOT NULL DEFAULT 'NEW',
  ADD COLUMN IF NOT EXISTS email_domain_type TEXT NOT NULL DEFAULT 'UNKNOWN',
  ADD COLUMN IF NOT EXISTS campaign_source TEXT,
  ADD COLUMN IF NOT EXISTS calendar_event_id TEXT;

-- First-touch lifecycle timestamps. Semantics: first time the lead reached the
-- state. Repeat occurrences (e.g. NURTURE re-entry) live in lead_events only.
ALTER TABLE demo_requests
  ADD COLUMN IF NOT EXISTS video_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS video_clicked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS questionnaire_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS questionnaire_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS meeting_scheduled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Backfill separated names from legacy single-field `name` (best effort;
-- new writes must supply first_name/last_name directly).
UPDATE demo_requests
SET
  first_name = split_part(btrim(name), ' ', 1),
  last_name = NULLIF(
    btrim(substr(btrim(name), length(split_part(btrim(name), ' ', 1)) + 2)),
    ''
  )
WHERE first_name IS NULL AND name IS NOT NULL AND btrim(name) <> '';

-- Controlled vocabularies. Widening either set requires a migration that
-- drops and re-adds the constraint — intentional friction.
ALTER TABLE demo_requests
  ADD CONSTRAINT demo_requests_lead_status_check CHECK (lead_status IN (
    'NEW',
    'VIDEO_SENT',
    'VIDEO_ENGAGED',
    'QUESTIONNAIRE_SENT',
    'QUESTIONNAIRE_STARTED',
    'QUESTIONNAIRE_COMPLETED',
    'MEETING_SCHEDULED',
    'DISCOVERY_COMPLETE',
    'QUALIFIED',
    'NURTURE',
    'DISQUALIFIED'
  ));

ALTER TABLE demo_requests
  ADD CONSTRAINT demo_requests_email_domain_type_check CHECK (
    email_domain_type IN ('WORK', 'FREE', 'UNKNOWN')
  );

-- Query paths: cron reminder scans and status dashboards.
CREATE INDEX IF NOT EXISTS demo_requests_lead_status_idx
  ON demo_requests (lead_status, updated_at DESC);
CREATE INDEX IF NOT EXISTS demo_requests_email_idx
  ON demo_requests (email);
