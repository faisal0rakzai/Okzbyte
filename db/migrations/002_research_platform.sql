-- Research platform schema. Apply using the project's normal migration process.
-- Existing article publication state is preserved; no seed content is created.
CREATE TABLE IF NOT EXISTS research_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  biography TEXT,
  verified_position TEXT,
  verified_affiliation TEXT,
  research_interests TEXT[] NOT NULL DEFAULT '{}',
  orcid TEXT,
  external_profile_url TEXT,
  profile_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE research_articles
  ADD COLUMN IF NOT EXISTS subtitle TEXT,
  ADD COLUMN IF NOT EXISTS abstract TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS content_type TEXT NOT NULL DEFAULT 'Research article',
  ADD COLUMN IF NOT EXISTS keywords TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS doi TEXT,
  ADD COLUMN IF NOT EXISTS external_url TEXT,
  ADD COLUMN IF NOT EXISTS pdf_url TEXT,
  ADD COLUMN IF NOT EXISTS cover_alt TEXT,
  ADD COLUMN IF NOT EXISTS cover_caption TEXT,
  ADD COLUMN IF NOT EXISTS references_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES research_authors(id) ON DELETE SET NULL;

ALTER TABLE research_articles DROP CONSTRAINT IF EXISTS research_articles_status_check;
ALTER TABLE research_articles
  ADD CONSTRAINT research_articles_status_check
  CHECK (status IN ('draft','in_review','approved','published','archived'));

CREATE INDEX IF NOT EXISTS research_articles_published_date_idx
  ON research_articles (published_at DESC)
  WHERE status = 'published';
CREATE INDEX IF NOT EXISTS research_articles_published_category_idx
  ON research_articles (category, published_at DESC)
  WHERE status = 'published';
CREATE UNIQUE INDEX IF NOT EXISTS research_articles_single_featured_idx
  ON research_articles (is_featured)
  WHERE is_featured = TRUE;

CREATE TABLE IF NOT EXISTS research_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  research_area TEXT NOT NULL,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('Collaboration inquiry','Technical paper proposal','Research contribution','Expert commentary')),
  proposal TEXT NOT NULL,
  external_url TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_review','accepted','declined','closed')),
  consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS research_submissions_status_idx ON research_submissions(status, submitted_at DESC);

CREATE TABLE IF NOT EXISTS research_newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  topics TEXT[] NOT NULL DEFAULT '{}',
  consent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending_confirmation' CHECK (status IN ('pending_confirmation','subscribed','unsubscribed')),
  confirmation_token_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS research_article_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES research_articles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  editor_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS research_article_revisions_article_idx
  ON research_article_revisions(article_id, created_at DESC);
