# OkzByte Research — Phase 11 Delivery Status

**Prepared:** 2026-11-15. The implementation and migration files are in the local repository workspace. No production database migrations have been run, and nothing has been pushed to GitHub.

## Source inventory and exact status

| Source | Public records found | OkzByte action prepared | Required status |
|---|---:|---|---|
| Zenodo | 1 record for *Cross-Chain Interoperability: Formal Verification and Recursive Zero-Knowledge Architectures for Heterogeneous Distributed Systems*; actual DOI is `10.5281/zenodo.22047129`, not the supplied `10.5280` identifier. Zenodo classifies it as a dataset and provides a PDF. Its creator ORCID differs from the supplied ORCID. | Source-backed catalogue record is seeded as `draft`; the source link is not verified for identity attribution, and the public library excludes it. | **FOUND BUT REQUIRES REVIEW** |
| ResearchGate | 6 entries shown on the matching Faisal Orakzai profile. The profile count includes duplicates/overlaps and a book; a unique-work total is not confirmed. | Correct profile is linked. A verified ResearchGate blockchain-guide duplicate is attached to the canonical SSRN record in migration 005 rather than created as a second publication. The other items remain unreconciled. | **FOUND BUT REQUIRES REVIEW** |
| ORCID | 3 public work groups: the Zenodo dataset and two SSRN items. | ORCID links are attached to the two SSRN canonical records in the seed migration; the Zenodo ORCID discrepancy remains flagged. | **FOUND BUT REQUIRES REVIEW** |
| SSRN / other verified repository | 2 accessible DOI records: `10.2139/ssrn.7236718` (posted 2026-08-11) and `10.2139/ssrn.7353660` (posted 2026-08-27). Both are described as preprints, not peer-reviewed papers. | Two canonical source-linked preprint rows are prepared in migration 005. The overlapping ResearchGate/ORCID links do not create duplicate rows. | **FOUND BUT REQUIRES REVIEW** — database import pending |
| Official researcher archive | Displayed counter says 25; it is not a reconciled count of distinct publications. Ten blockchain explainer cards were identified. Seven individual article pages were confirmed; three cards need corrected/stable individual links. | Seven source-linked official-site technical article rows are prepared as `published` records in migration 005; six other archive cards with unresolved individual paths/metadata are prepared as internal drafts in migration 006. Other archive entries include books, market analysis, whitepapers, blueprints, and production code and are not presumed to be papers. | **FOUND BUT REQUIRES REVIEW** — seed prepared, not live |
| Google Scholar / LinkedIn | No actual profile URL was verified in this audit. | No speculative links are shown; CMS fields remain blank until verified. | **NOT FOUND** — verified public URL not established |

**Verified and imported:** 0 records in a live database. Migration seeds are prepared but are not live CMS rows. The known duplicate relationship is represented without creating a second record; no live database merge event can be claimed.

## Ten original articles

All ten requested original technical articles are complete as Markdown first drafts in [`docs/research/drafts/README.md`](drafts/README.md). Body word counts below exclude front matter and references; each is within the requested approximate 1,000–1,500-word range. Migration 004 seeds all ten as `draft`, with `published_at=NULL` and no author byline. They are not presented as peer-reviewed work.

| Draft | Body words |
|---|---:|
| Autonomous AI agent architectures | 1,311 |
| Zero-knowledge proofs and privacy-preserving infrastructure | 1,162 |
| Cross-chain interoperability | 1,390 |
| Real-world asset tokenization | 1,187 |
| Decentralized financial systems | 1,312 |
| Enterprise blockchain | 1,398 |
| AI and blockchain convergence | 1,414 |
| Digital identity and verifiable credentials | 1,253 |
| Cloud-native infrastructure | 1,341 |
| Decentralized-system cybersecurity | 1,133 |

**Status:** **DRAFT CREATED** for all ten.

## Repository changes completed

The existing site design and article template were retained. The repository now contains a source-aware research library with All Research, Published Papers, ResearchGate, Zenodo, Technical Articles, admin-only Research Drafts, Books & Publications, and Researcher Profile navigation; source/category/type/year/author filters; explicit source labels; a public researcher profile; and books shown separately from papers.

The private `/admin` Research Desk now has session-protected article CRUD, metadata/references/source links, revisions and status events, profile/books editing, manual draft → in-review → approved → published transitions, published-content locking, and an explicit duplicate-merge action. Public article APIs remain published-only. PDF URLs require an affirmative author-permission/open-licence checkbox and are hidden in public APIs otherwise; binary uploads are not implemented because no private object-storage provider is configured.

## Validation and blockers

`npm run build`, `node --check` for the server modules, and `git diff --check` passed. The server smoke test returned `401 admin_auth_required` for unauthenticated CMS access, `503 research_database_not_configured` for the profile API, and served `/research/profile` through the SPA fallback. This verifies the local build and access gate, not database-backed create/review/publish flows. Vite also reports a non-fatal main-bundle optimization warning (about 810 kB minified).

**CMS live verification:** **BLOCKED BY ACCESS** — this sandbox has no `DATABASE_URL`; migrations 006–009 must be reviewed and applied, in order, to the intended deployment before records become live. No migrations were applied to an unknown/shared database.

**GitHub push:** **BLOCKED BY ACCESS** — no enabled GitHub connector is available in this session. The pasted token was not used. Since a credential was shared in chat, revoke/rotate it if it is still active; reconnect an authorized GitHub connector to push the repository changes.

**Remaining review:** resolve the Zenodo ORCID mismatch; reconcile all official archive entries against stable URLs and statuses; complete the ResearchGate unique-publication audit; verify book identifiers and the user-provided *I'm Orakzai* subtitle/edition; and test the full CMS against the configured database and authorized file-storage provider.
