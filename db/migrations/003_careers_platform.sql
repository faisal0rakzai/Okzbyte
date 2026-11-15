-- Careers platform schema. Apply in Supabase SQL Editor or the normal migration process.
-- Candidate data is server-only; no public RLS policies are created.
CREATE TABLE IF NOT EXISTS career_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department_id UUID REFERENCES career_departments(id) ON DELETE SET NULL,
  employment_type TEXT NOT NULL CHECK (employment_type IN ('Full-time','Part-time','Contract','Internship','Freelance')),
  work_arrangement TEXT NOT NULL CHECK (work_arrangement IN ('Remote','Hybrid','On-site')),
  location TEXT,
  experience_level TEXT,
  description TEXT NOT NULL,
  responsibilities JSONB NOT NULL DEFAULT '[]'::jsonb,
  required_qualifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  preferred_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  application_deadline DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','closed','archived')),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code TEXT NOT NULL UNIQUE,
  job_id UUID REFERENCES career_jobs(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  position_applied_for TEXT NOT NULL,
  department TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  linkedin_url TEXT,
  portfolio_url TEXT,
  cover_letter TEXT NOT NULL,
  cv_storage_path TEXT NOT NULL,
  cv_filename TEXT NOT NULL,
  cv_mime_type TEXT NOT NULL,
  cv_size_bytes INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Received' CHECK (status IN ('Received','Under Review','Shortlisted','Interview','Selected','Rejected','Withdrawn')),
  consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_talent_network (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  area_of_interest TEXT NOT NULL,
  portfolio_url TEXT,
  note TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','unsubscribed')),
  consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_application_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES career_applications(id) ON DELETE CASCADE,
  author_email TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS career_jobs_public_idx ON career_jobs(status, application_deadline);
CREATE INDEX IF NOT EXISTS career_applications_status_idx ON career_applications(status, created_at DESC);
CREATE INDEX IF NOT EXISTS career_talent_email_idx ON career_talent_network(lower(email));

ALTER TABLE career_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_talent_network ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_application_notes ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies: all candidate and admin access must pass through the server.
