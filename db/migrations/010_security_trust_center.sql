-- Private queue for responsible-disclosure reports.
-- Apply through the configured PostgreSQL migration process before accepting reports.
CREATE TABLE IF NOT EXISTS security_vulnerability_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  email TEXT NOT NULL CHECK (char_length(email) <= 254),
  category TEXT NOT NULL CHECK (category IN ('Authentication','Authorization','API Security','Web Application','Infrastructure','Smart Contracts','Data Exposure','Other')),
  affected_component TEXT NOT NULL CHECK (char_length(affected_component) BETWEEN 2 AND 500),
  severity TEXT NOT NULL CHECK (severity IN ('Critical','High','Medium','Low','Informational')),
  description TEXT NOT NULL CHECK (char_length(description) BETWEEN 20 AND 6000),
  reproduction_steps TEXT NOT NULL CHECK (char_length(reproduction_steps) BETWEEN 10 AND 6000),
  potential_impact TEXT NOT NULL CHECK (char_length(potential_impact) BETWEEN 10 AND 4000),
  supporting_references TEXT NOT NULL DEFAULT '' CHECK (char_length(supporting_references) <= 2000),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','triage','investigating','resolved','closed','declined')),
  assigned_to TEXT,
  internal_notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS security_reports_status_created_idx ON security_vulnerability_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS security_reports_severity_idx ON security_vulnerability_reports(severity, created_at DESC);
ALTER TABLE security_vulnerability_reports ENABLE ROW LEVEL SECURITY;
-- No public policies. The server endpoint writes through the database connection;
-- admin listing and updates must be added behind authenticated admin authorization.
