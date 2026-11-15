-- These first-party archive cards were visible on the dynamic official archive,
-- but an individual canonical article route or repository record was not verified.
-- Keep them in DRAFT for editorial resolution; do not expose them as published articles.
DO $$
DECLARE aid UUID;
BEGIN
  SELECT id INTO aid FROM research_authors WHERE orcid='0009-0000-0915-7272' LIMIT 1;
  IF aid IS NULL THEN RAISE EXCEPTION 'research author seed from migration 003 is missing'; END IF;

  INSERT INTO research_articles(title,slug,author,excerpt,abstract,content,category,content_type,keywords,external_url,status,published_at,author_id,references_json)
  VALUES
  ('Cross-Chain Technology Explained','archive-cross-chain-technology','Faisal Orakzai',
   'Official archive card: a technical explainer on blockchain interoperability. The individual article path tested during this audit returned “Article not found.”',
   'The official archive lists a guide on cross-chain technology, bridges, IBC, CCIP, and LayerZero. Its stable article route was not confirmed in this audit.',
   'DRAFT — archive card found, but an individual canonical URL was not verified. Confirm the correct article permalink before publishing this catalogue record.',
   'Blockchain & Web3','Technical article draft',ARRAY['Cross-chain','Interoperability','Bridges'],NULL,'draft',NULL,aid,'[]'::jsonb),
  ('Public vs Private vs Consortium Blockchains','archive-blockchain-types','Faisal Orakzai',
   'Official archive card: an enterprise explainer comparing public, private, consortium, and hybrid blockchain architectures. The individual URL needs confirmation.',
   'The official archive lists an enterprise guide to blockchain network types. The specific route surfaced in search did not provide a usable article page during this audit.',
   'DRAFT — archive card found, but an individual canonical URL was not verified. Confirm the correct article permalink before publishing this catalogue record.',
   'Blockchain & Web3','Technical article draft',ARRAY['Public blockchain','Private blockchain','Consortium blockchain'],NULL,'draft',NULL,aid,'[]'::jsonb),
  ('Building Enterprise Blockchain Ecosystems','archive-enterprise-blockchain-ecosystems','Faisal Orakzai',
   'Official archive card: an enterprise and government guide to blockchain architecture, governance, and future adoption. An individual permalink was not confirmed.',
   'The official archive lists an explainer on enterprise blockchain ecosystems extending into identity, IoT, tokenization, AI, cloud, and compliance. Its stable article URL was not confirmed.',
   'DRAFT — archive card found, but an individual canonical URL was not verified. Confirm the correct article permalink before publishing this catalogue record.',
   'Blockchain & Web3','Technical article draft',ARRAY['Enterprise blockchain','Architecture','Governance'],NULL,'draft',NULL,aid,'[]'::jsonb),
  ('Faisal Orakzai Publishes OrakzaiX 8B GGUF Model Repository on Hugging Face','archive-orakzaix-gguf-release','Faisal Orakzai',
   'Official archive card for a community-maintained GGUF model release. The individual article route was not resolved in this audit.',
   'The official archive displays an AI category news/article card about an OrakzaiX GGUF model repository. This is a first-party archive item, not an academic paper; its canonical article URL needs confirmation.',
   'DRAFT — official archive card found, but an individual canonical URL and repository metadata were not fully verified. Confirm the primary Hugging Face model URL and article permalink before publishing.',
   'Artificial Intelligence','Research news draft',ARRAY['AI','GGUF','Hugging Face'],NULL,'draft',NULL,aid,'[]'::jsonb),
  ('Macro-Liquidity Networks & Cross-Border Fintech Dynamics','archive-macro-liquidity-networks','Faisal Orakzai',
   'Official archive card dated 2024 for market analysis of tokenized asset corridors. An individual publication URL and external repository record were not confirmed.',
   'The official archive describes analysis of macro-liquidity networks, cross-border fintech corridors, settlement velocity, and tokenized asset pools. No DOI or independent publication venue was confirmed.',
   'DRAFT — market-analysis card found in the official archive. Keep separate from peer-reviewed papers; confirm a stable public item URL and publication record before publishing.',
   'Fintech & Digital Finance','Market analysis draft',ARRAY['Liquidity','Cross-border fintech','RWA'],NULL,'draft',NULL,aid,'[]'::jsonb),
  ('Real-World Asset Tokenization: Protocol Mechanics & Market Depth','archive-rwa-market-depth','Faisal Orakzai',
   'Official archive card dated 2024 on RWA tokenization. An individual publication URL and external repository record were not confirmed.',
   'The official archive describes analysis of tokenized asset custody, oracle dependency, and secondary-market depth. No DOI or independent publication venue was confirmed.',
   'DRAFT — market-analysis card found in the official archive. Keep separate from peer-reviewed papers; confirm a stable public item URL and publication record before publishing.',
   'Real-World Assets','Market analysis draft',ARRAY['RWA','Tokenization','Market depth'],NULL,'draft',NULL,aid,'[]'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO research_article_sources(article_id,platform,source_url,source_title,source_abstract,verified,is_primary)
  SELECT id,'OFFICIAL RESEARCH ARCHIVE','https://faisalorakzai.com/research',title,abstract,FALSE,TRUE
  FROM research_articles
  WHERE slug IN ('archive-cross-chain-technology','archive-blockchain-types','archive-enterprise-blockchain-ecosystems','archive-orakzaix-gguf-release','archive-macro-liquidity-networks','archive-rwa-market-depth')
  ON CONFLICT (article_id,platform,source_url) DO NOTHING;
END $$;
