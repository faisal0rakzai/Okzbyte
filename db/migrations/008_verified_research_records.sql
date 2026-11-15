-- Phase 11 source-backed publication records.
-- This migration does not overwrite an existing slug. Apply only after migrations 006/007.
-- 2026 archive metadata is first-party content, not a peer-review claim.

DO $$
DECLARE aid UUID;
BEGIN
  SELECT id INTO aid FROM research_authors WHERE orcid='0009-0000-0915-7272' LIMIT 1;
  IF aid IS NULL THEN RAISE EXCEPTION 'research author seed from migration 003 is missing'; END IF;

  -- Public SSRN preprints: posted works also listed on ORCID; no peer-review claim.
  INSERT INTO research_articles(title,slug,author,excerpt,abstract,content,category,content_type,keywords,doi,external_url,status,published_at,author_id,references_json)
  VALUES
  ('What Is Blockchain? A Complete Beginner''s Guide From Distributed Ledgers to Smart Contracts -The Definitive Primer on Blockchain Technology',
   'ssrn-blockchain-primer-7236718','Faisal Orakzai',
   'An introductory technical overview of blockchain concepts, distributed ledgers, and smart contracts, represented here as a publicly posted SSRN preprint.',
   'An introductory technical overview of blockchain concepts, distributed ledgers, and smart contracts. The SSRN record is a preprint; no peer-review status is asserted.',
   'This entry is a source-linked catalogue record. The original preprint is hosted by SSRN; OkzByte does not reproduce the full text. Open the DOI record for the complete source.',
   'Blockchain & Web3','Preprint (SSRN)',ARRAY['Blockchain','Distributed ledgers','Smart contracts'],'10.2139/ssrn.7236718','https://doi.org/10.2139/ssrn.7236718','published','2026-08-11',aid,
   '[{"citation":"SSRN record for the blockchain primer","url":"https://doi.org/10.2139/ssrn.7236718"}]'::jsonb),
  ('Credential Integrity Under Explicit Trust Boundaries: An Artifact-centered Verifiable-credential Prototype',
   'ssrn-credential-integrity-7353660','Faisal Orakzai',
   'A prototype-oriented verifiable-credential work whose public abstract bounds its benchmark claim to one local environment.',
   'The public abstract describes an artifact-centered verifiable-credential prototype and limits its benchmark claim to one local environment. It is not a claim of a complete identity network.',
   'This entry is a source-linked catalogue record. The original preprint is hosted by SSRN; OkzByte does not reproduce the full text. Open the DOI record for the complete source.',
   'Blockchain & Web3','Preprint (SSRN)',ARRAY['Verifiable credentials','Identity','Prototype'],'10.2139/ssrn.7353660','https://doi.org/10.2139/ssrn.7353660','published','2026-08-27',aid,
   '[{"citation":"SSRN record for the verifiable-credential prototype","url":"https://doi.org/10.2139/ssrn.7353660"}]'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO research_article_sources(article_id,platform,source_url,record_identifier,source_title,verified,verified_at,is_primary)
  SELECT id,'OTHER VERIFIED REPOSITORY',external_url,doi,title,TRUE,NOW(),TRUE FROM research_articles
  WHERE slug IN ('ssrn-blockchain-primer-7236718','ssrn-credential-integrity-7353660')
  ON CONFLICT (article_id,platform,source_url) DO NOTHING;

  INSERT INTO research_article_sources(article_id,platform,source_url,source_title,verified,verified_at,is_primary)
  SELECT id,'ORCID','https://orcid.org/0009-0000-0915-7272','Public ORCID profile work list',TRUE,NOW(),FALSE FROM research_articles
  WHERE slug IN ('ssrn-blockchain-primer-7236718','ssrn-credential-integrity-7353660')
  ON CONFLICT (article_id,platform,source_url) DO NOTHING;

  INSERT INTO research_article_sources(article_id,platform,source_url,record_identifier,source_title,verified,verified_at,is_primary)
  SELECT id,'RESEARCHGATE','https://www.researchgate.net/publication/412116986_What_Is_Blockchain_A_Complete_Beginner%27s_Guide_From_Distributed_Ledgers_to_Smart_Contracts_-The_Definitive_Primer_on_Blockchain_Technology','412116986','ResearchGate duplicate listing for the SSRN preprint',TRUE,NOW(),FALSE
  FROM research_articles WHERE slug='ssrn-blockchain-primer-7236718'
  ON CONFLICT (article_id,platform,source_url) DO NOTHING;

  -- Seven first-party technical articles with individual official URLs verified.
  INSERT INTO research_articles(title,slug,author,excerpt,abstract,content,category,content_type,keywords,external_url,status,published_at,author_id,references_json)
  VALUES
  ('What is Blockchain? A Complete Beginner''s Guide','official-blockchain-basic','Faisal Orakzai',
   'A first-party technical explainer introducing blockchain, distributed ledgers, and smart contracts.','A first-party technical explainer introducing blockchain, distributed ledgers, and smart contracts. This is an official-site article, not represented as a peer-reviewed paper.','This listing links to the original official-site article and does not reproduce its full text.','Blockchain & Web3','Technical article',ARRAY['Blockchain','DLT','Smart contracts'],'https://faisalorakzai.com/research/blockchain-basic','published',NULL,aid,'[]'::jsonb),
  ('Blockchain Infrastructure Explained','official-blockchain-infra','Faisal Orakzai',
   'A first-party explainer on nodes, validators, consensus, RPC services, and Layer-2 infrastructure.','A first-party technical explainer about the components that operate blockchain networks. This is an official-site article, not represented as a peer-reviewed paper.','This listing links to the original official-site article and does not reproduce its full text.','Blockchain & Web3','Technical article',ARRAY['Blockchain','Infrastructure','Nodes','Consensus'],'https://faisalorakzai.com/research/blockchain-infra','published',NULL,aid,'[]'::jsonb),
  ('How Digital Identity Works on Blockchain','official-blockchain-digital-identity','Faisal Orakzai',
   'A first-party explainer covering DIDs, SSI, verifiable credentials, and zero-knowledge proofs.','A first-party technical explainer about decentralized identity, credential verification, and selective disclosure. This is not represented as peer-reviewed research.','This listing links to the original official-site article and does not reproduce its full text.','Blockchain & Web3','Technical article',ARRAY['Digital identity','DIDs','Verifiable credentials','Zero-knowledge proofs'],'https://faisalorakzai.com/research/blockchain-digital-identity','published',NULL,aid,'[]'::jsonb),
  ('The Future of Web3 Infrastructure','official-future-of-web3','Faisal Orakzai',
   'A first-party overview of Web3 infrastructure, digital identity, interoperability, decentralized storage, and DePIN.','A first-party technical explainer about Web3 infrastructure components and their possible integration. This is not represented as peer-reviewed research.','This listing links to the original official-site article and does not reproduce its full text.','Blockchain & Web3','Technical article',ARRAY['Web3','Digital identity','Interoperability','DePIN'],'https://faisalorakzai.com/research/future-of-web3','published',NULL,aid,'[]'::jsonb),
  ('Blockchain Security & Consensus Mechanisms Explained','official-blockchain-security','Faisal Orakzai',
   'A first-party explainer about cryptographic primitives, consensus mechanisms, and blockchain threat models.','A first-party technical explainer on blockchain security and consensus. This is not represented as peer-reviewed research.','This listing links to the original official-site article and does not reproduce its full text.','Cybersecurity','Technical article',ARRAY['Blockchain security','Consensus','Cryptography'],'https://faisalorakzai.com/research/blockchain-security','published',NULL,aid,'[]'::jsonb),
  ('Tokenization of Real World Assets (RWA)','official-rwa-tokenization','Faisal Orakzai',
   'A first-party explainer on real-world asset tokenization, token standards, infrastructure, and compliance.','A first-party technical explainer on tokenized asset representations and supporting systems. This is not represented as peer-reviewed research or investment advice.','This listing links to the original official-site article and does not reproduce its full text.','Real-World Assets','Technical article',ARRAY['RWA','Tokenization','Smart contracts'],'https://faisalorakzai.com/research/rwa-tokenization','published',NULL,aid,'[]'::jsonb),
  ('How Smart Contracts Work','official-smart-contracts','Faisal Orakzai',
   'A first-party guide to smart-contract execution, architecture, security, and enterprise use cases.','A first-party technical explainer about smart contracts and their use in blockchain applications. This is not represented as peer-reviewed research.','This listing links to the original official-site article and does not reproduce its full text.','Blockchain & Web3','Technical article',ARRAY['Smart contracts','Solidity','EVM'],'https://faisalorakzai.com/research/smart-contracts','published',NULL,aid,'[]'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO research_article_sources(article_id,platform,source_url,source_title,verified,verified_at,is_primary)
  SELECT id,'OFFICIAL RESEARCH ARCHIVE',external_url,title,TRUE,NOW(),TRUE FROM research_articles
  WHERE slug IN ('official-blockchain-basic','official-blockchain-infra','official-blockchain-digital-identity','official-future-of-web3','official-blockchain-security','official-rwa-tokenization','official-smart-contracts')
  ON CONFLICT (article_id,platform,source_url) DO NOTHING;

  -- Zenodo metadata matches a public record, but its displayed ORCID does not match the supplied ORCID.
  -- Keep it in DRAFT for author confirmation; do not present it as a reconciled publication.
  INSERT INTO research_articles(title,slug,author,excerpt,abstract,content,category,content_type,keywords,doi,external_url,pdf_url,status,published_at,author_id,references_json)
  VALUES('Cross-Chain Interoperability: Formal Verification and Recursive Zero-Knowledge Architectures for Heterogeneous Distributed Systems',
   'zenodo-cross-chain-22047129','Faisal Orakzai',
   'A Zenodo record for a cross-chain interoperability resource. Creator ORCID on Zenodo differs from the supplied ORCID; attribution requires author confirmation.',
   'Zenodo labels this resource as a dataset and provides an open PDF. The creator ORCID displayed on the record differs from the supplied ORCID. Keep this item in editorial review until the researcher confirms the discrepancy.',
   'DRAFT — attribution requires researcher confirmation. Zenodo metadata lists Faisal Orakzai and resource type Dataset, but the displayed creator ORCID is inconsistent with the supplied ORCID. Do not publish until the identity discrepancy is resolved.',
   'Blockchain & Web3','Dataset (Zenodo)',ARRAY['Cross-chain interoperability','Formal verification','Recursive zero-knowledge proofs'],
   '10.5281/zenodo.22047129','https://zenodo.org/records/22047129','https://zenodo.org/records/22047129/files/grounded_cross_chain_final.pdf','draft',NULL,aid,
   '[{"citation":"Zenodo record 22047129","url":"https://zenodo.org/records/22047129"}]'::jsonb)
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO research_article_sources(article_id,platform,source_url,record_identifier,source_title,verified,is_primary)
  SELECT id,'ZENODO','https://zenodo.org/records/22047129','10.5281/zenodo.22047129',title,FALSE,TRUE FROM research_articles
  WHERE slug='zenodo-cross-chain-22047129'
  ON CONFLICT (article_id,platform,source_url) DO NOTHING;
END $$;
