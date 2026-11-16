-- Private enterprise intake tables. Apply through the configured PostgreSQL migration process.
CREATE TABLE IF NOT EXISTS enterprise_project_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), reference_code TEXT NOT NULL UNIQUE,
  organization_name TEXT NOT NULL CHECK (char_length(organization_name) BETWEEN 2 AND 180), website TEXT,
  industry TEXT NOT NULL, country TEXT NOT NULL, organization_size TEXT NOT NULL,
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120), email TEXT NOT NULL,
  role TEXT NOT NULL, phone TEXT, solution_category TEXT NOT NULL, project_title TEXT NOT NULL,
  project_description TEXT NOT NULL CHECK (char_length(project_description) BETWEEN 20 AND 6000),
  objectives TEXT NOT NULL, expected_deliverables TEXT NOT NULL, preferred_technologies TEXT,
  budget_range TEXT NOT NULL, timeline TEXT NOT NULL, priority TEXT NOT NULL, additional_requirements TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'inquiry_received' CHECK (status IN ('inquiry_received','under_review','proposal_prepared','awaiting_client_approval','approved','in_progress','on_hold','completed','cancelled')),
  assigned_staff TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS enterprise_project_status_created_idx ON enterprise_project_requests(status, created_at DESC);
CREATE INDEX IF NOT EXISTS enterprise_project_email_idx ON enterprise_project_requests(lower(email), created_at DESC);
CREATE TABLE IF NOT EXISTS enterprise_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), reference_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120), email TEXT NOT NULL,
  organization TEXT NOT NULL, topic TEXT NOT NULL, preferred_date TEXT NOT NULL, preferred_time TEXT NOT NULL,
  timezone TEXT NOT NULL, description TEXT NOT NULL CHECK (char_length(description) BETWEEN 10 AND 3000),
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested','under_review','scheduled','completed','cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS enterprise_consultations_status_created_idx ON enterprise_consultations(status, created_at DESC);
ALTER TABLE enterprise_project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE enterprise_consultations ENABLE ROW LEVEL SECURITY;
-- No public policies. Public intake writes use server-side endpoints; admin reads/updates require authenticated authorization.
