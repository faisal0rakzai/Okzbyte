-- Private queue for data-subject/privacy requests submitted through the public form.
-- Apply through the configured PostgreSQL migration process before enabling submissions.
CREATE TABLE IF NOT EXISTS privacy_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  email TEXT NOT NULL CHECK (char_length(email) <= 254),
  request_type TEXT NOT NULL CHECK (request_type IN ('Access','Correction','Deletion','Data Portability','Withdraw Consent','Other Privacy Concern')),
  description TEXT NOT NULL CHECK (char_length(description) BETWEEN 10 AND 4000),
  supporting_info TEXT NOT NULL DEFAULT '' CHECK (char_length(supporting_info) <= 2000),
  consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','under_review','awaiting_verification','completed','declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS privacy_requests_status_created_idx
  ON privacy_requests(status, created_at DESC);
CREATE INDEX IF NOT EXISTS privacy_requests_email_created_idx
  ON privacy_requests(lower(email), created_at DESC);

ALTER TABLE privacy_requests ENABLE ROW LEVEL SECURITY;
-- Deliberately no anon/authenticated policies. Public submissions go through the server API;
-- administrative access and retention/deletion controls require a separately configured,
-- authenticated admin workflow before production launch.
