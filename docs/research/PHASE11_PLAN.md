# OkzByte Research — Phase 11 Implementation Plan

## Existing project structure

- `src/ResearchPage.jsx` and `src/research.css`: existing public research library, article reader, categories, and visual language. Extend these rather than replace them.
- `src/main.jsx`: current route shell and admin placeholder; route the research profile and a focused research-admin component here.
- `src/ResearchAdmin.jsx`: planned administrator-facing research authoring and review interface.
- `server/index.mjs`: existing PostgreSQL API, session login, published-only public endpoints. Add authenticated research-management endpoints without changing public visibility rules.
- `db/migrations/`: PostgreSQL schema. Add a forward-only source/profile/books migration and a separate idempotent seed migration for ten DRAFT articles.
- `docs/research/`: source-linked publication audit and Markdown first drafts for editorial review.

## Implementation approach

Preserve the existing visual style and public article templates. Add a researcher profile with first-party biography, ORCID, the correctly matched ResearchGate link, official archive link, topic taxonomy, and a separate books section. Add source filters to the existing archive while keeping `published` as the sole public article status. Represent first-party articles and external repository records with explicit source-platform metadata; preserve duplicate links on one canonical record rather than making copies. Don't create unsupported DOI, peer-review, academic-title, metric, or publication-date claims.

Add admin-protected, same-origin-only CRUD and explicit status transitions: draft → in-review → approved → published (manual publish action only), plus archive/restore routes. Write snapshots/audit events, support verified source links and cautious duplicate merging, and restrict researcher profile/book edits to the same session. Seed the ten Markdown drafts with `status='draft'`, null publication dates, and no author byline until editor approval. No automatic publishing.

Do not rebuild unrelated pages, execute migrations against production, or add article text copied from the external site. External source records link to their original pages; imported summaries remain attributed.

## Data and integration boundaries

The migration files are the integration contract. They are not run in this sandbox: there is no `DATABASE_URL` or configured production database. Admin CRUD and profile/book management can be implemented and statically checked locally, but database-backed behavior remains unverified until the migrations are applied in the deployment environment.
