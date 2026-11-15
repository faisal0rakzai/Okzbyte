-- Phase 11: source-aware research library and editorial CMS.
-- Apply only after upstream migrations 001_initial.sql through 005_support_center.sql.
-- This file is declarative; it is not executed automatically by the app.

ALTER TABLE research_authors
  ADD COLUMN IF NOT EXISTS researchgate_url TEXT,
  ADD COLUMN IF NOT EXISTS zenodo_url TEXT,
  ADD COLUMN IF NOT EXISTS google_scholar_url TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS official_research_url TEXT;

ALTER TABLE research_articles
  ADD COLUMN IF NOT EXISTS pdf_permission_confirmed BOOLEAN NOT NULL DEFAULT FALSE;

CREATE UNIQUE INDEX IF NOT EXISTS research_authors_orcid_uidx
  ON research_authors(orcid) WHERE orcid IS NOT NULL AND orcid <> '';

CREATE TABLE IF NOT EXISTS research_article_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES research_articles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('ZENODO','RESEARCHGATE','ORCID','OFFICIAL RESEARCH ARCHIVE','OTHER VERIFIED REPOSITORY')),
  source_url TEXT NOT NULL CHECK (source_url ~ '^https://'),
  record_identifier TEXT,
  source_title TEXT,
  source_abstract TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(article_id, platform, source_url)
);
CREATE INDEX IF NOT EXISTS research_article_sources_platform_idx
  ON research_article_sources(platform, article_id);
CREATE UNIQUE INDEX IF NOT EXISTS research_article_sources_unique_primary_idx
  ON research_article_sources(article_id) WHERE is_primary = TRUE;

ALTER TABLE research_article_revisions
  ADD COLUMN IF NOT EXISTS metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS research_article_events (
  id BIGSERIAL PRIMARY KEY,
  article_id UUID REFERENCES research_articles(id) ON DELETE SET NULL,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('created','updated','submitted_for_review','returned_to_draft','approved','published','archived','restored','source_added','source_removed','merged')),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS research_article_events_article_idx
  ON research_article_events(article_id, created_at DESC);

CREATE TABLE IF NOT EXISTS research_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES research_authors(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  official_url TEXT NOT NULL CHECK (official_url ~ '^https://'),
  source_url TEXT NOT NULL CHECK (source_url ~ '^https://'),
  isbn TEXT,
  status TEXT NOT NULL DEFAULT 'listed' CHECK (status IN ('draft','listed','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS research_books_status_idx ON research_books(status, title);

-- These profile facts and links are based on the supplied brief and the public official site.
-- No academic degree, appointment, peer-review credential, or ResearchGate metric is asserted.
INSERT INTO research_authors
  (name, biography, verified_position, verified_affiliation, research_interests, orcid,
   external_profile_url, researchgate_url, zenodo_url, google_scholar_url, linkedin_url,
   official_research_url, profile_verified)
SELECT
  'Faisal Orakzai',
  'Technology entrepreneur, computer scientist and researcher focused on blockchain architecture, distributed systems, artificial intelligence, smart contracts, cross-chain interoperability, digital identity and real-world asset tokenization.',
  NULL, NULL,
  ARRAY['Blockchain architecture','Distributed systems','Artificial intelligence','Smart contracts','Cross-chain interoperability','Digital identity','Real-world asset tokenization'],
  '0009-0000-0915-7272',
  'https://faisalorakzai.com/research',
  'https://www.researchgate.net/profile/Faisal-Orakzai-4',
  'https://zenodo.org/search?q=metadata.creators.person_or_org.name%3A%22Faisal%20Orakzai%22',
  NULL,
  NULL,
  'https://faisalorakzai.com/research',
  TRUE
WHERE NOT EXISTS (SELECT 1 FROM research_authors WHERE orcid='0009-0000-0915-7272');

INSERT INTO research_books (author_id, title, subtitle, description, official_url, source_url, isbn, status)
SELECT a.id,
       'The Sovereign Stack',
       'Engineering Next-Generation Blockchain Infrastructure',
       'Book listed by the official researcher website. ISBN is pending assignment according to the public listing inspected for this audit.',
       'https://faisalorakzai.com/books',
       'https://faisalorakzai.com/books',
       NULL,
       'listed'
FROM research_authors a
WHERE a.orcid='0009-0000-0915-7272'
  AND NOT EXISTS (SELECT 1 FROM research_books b WHERE b.title='The Sovereign Stack' AND b.author_id=a.id);

INSERT INTO research_books (author_id, title, subtitle, description, official_url, source_url, isbn, status)
SELECT a.id,
       'I''m Orakzai',
       'A Journey Through History, Heritage, and the Future',
       'The official Books page lists this title separately from research articles. The subtitle is supplied by the project brief and requires confirmation against the edition before publication.',
       'https://faisalorakzai.com/books',
       'https://faisalorakzai.com/books',
       NULL,
       'listed'
FROM research_authors a
WHERE a.orcid='0009-0000-0915-7272'
  AND NOT EXISTS (SELECT 1 FROM research_books b WHERE b.title='I''m Orakzai' AND b.author_id=a.id);
