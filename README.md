# OkzByte

Premium responsive technology venture website for OkzByte.

## Run locally

```bash
npm install
npm run dev
```

The Vite development server serves the public React app. The database-backed API runs separately with `npm run server` and expects a built `dist/` directory. Build before starting the production-style combined server:

```bash
npm run build
npm run server
```

## Build

```bash
npm run build
```

## Research library and CMS

The public research library displays only records whose status is `published`. New original articles start as `draft`; an editor must move them through `in_review` and `approved`, then explicitly confirm the `published` action. Editing is locked for published, approved, and archived records until they are moved to an editable workflow state. Source links can be verified or left under review, revisions and status events are recorded, and duplicate-source links can be merged onto a canonical item while the duplicate is archived. A PDF URL requires explicit author-permission/open-licence confirmation before publication; binary uploads need a separately configured private storage provider and are not enabled.

The private Research Desk is at `/admin`. It requires server-only `DATABASE_URL`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD_HASH` values (see `.env.example`). The password is an scrypt hash accepted by `server/index.mjs`; never store plaintext credentials in the repository or expose a production connection string in browser code. The app does not execute migrations automatically.

Apply SQL migrations in order to the intended PostgreSQL deployment: `db/migrations/001_initial.sql` through `009_archive_items_requiring_review.sql`. Migrations 006–009 create profile/book/source and editorial tables, seed ten original article drafts, add source-confirmed first-party/SSRN catalogue records, hold the Zenodo attribution discrepancy as a draft, and hold archive cards without confirmed individual URLs as review drafts. They are idempotent for their seeded slugs but are still database-changing operations; review and apply them only in the target deployment through its normal migration process. The source sandbox used to prepare these changes has no `DATABASE_URL`, so these migrations have not been run and live CMS behavior has not been verified.

On Vercel, the public research routes are implemented as serverless functions under `api/research/`. They use the server-only `SUPABASE_URL` and `SUPABASE_SECRET_KEY` environment variables. If the research tables are missing, the public page shows a clearly labeled fallback catalogue of two SSRN preprints and seven official-site technical articles; editorial drafts and the identity-pending Zenodo item are excluded. Proposal and newsletter forms only report success after storage succeeds, so submissions return a clear service error until the migrations and server environment are ready. See [`docs/research/SUPABASE_SETUP.md`](docs/research/SUPABASE_SETUP.md) for the deployment steps and checks.

No academic appointments, degrees, journal peer-review claims, Google Scholar URLs, LinkedIn URLs, or ResearchGate metrics are asserted. Google Scholar/LinkedIn public links are left blank unless later verified. The Zenodo record has a displayed creator ORCID that differs from the supplied ORCID and stays unpublished pending author confirmation. The ResearchGate blockchain primer listing is attached as a duplicate source to the SSRN preprint, not a second publication record.

## Included

- Responsive React/Vite single-page experience with 10 client-side routes
- Cinematic CSS hero with reduced-motion support and mobile fallback
- Supplied OkzByte logo asset
- Technologies, solutions, ecosystem, research, contact, privacy and terms pages
- Contact form validation with honest prototype success state
- Route manifest, robots.txt and sitemap.xml
- No invented clients, awards, partnerships or performance claims


## Contact and support center

The contact, support, FAQ, ticket-submission and ticket-tracking pages are available at `/contact`, `/support`, `/support/faq`, `/support/ticket` and `/support/track`. To persist submissions, configure the server-side `DATABASE_URL`, then apply `db/migrations/005_support_center.sql` to the same PostgreSQL database. Configure `RESEND_API_KEY`, `RESEND_FROM_EMAIL` and `SUPPORT_NOTIFICATION_EMAIL` to enable customer confirmations and support-team notifications. Email is never reported as sent unless the provider accepts the request.

The support API applies input validation, consent checks, per-process rate limits, duplicate inquiry keys and 5 MB allowlisted attachment checks; attachment bytes are stored in the database and are not exposed by public API responses. Authenticated server admin endpoints are `/api/admin/support/inquiries` and `/api/admin/support/tickets`; ticket updates use `PATCH /api/admin/support/tickets/:ticketCode` and require the existing `okz_session` administrator session. On Vercel, public support APIs are exposed as serverless functions; admin support management currently depends on the existing Node server session/auth flow. Apply the migration before accepting real customer data. Configure database backups and retention according to the approved Privacy Policy before launch.

Ticket tracking currently requires both the high-entropy ticket reference and registered email. Expiring email verification links, customer reply threads, administrator assignment/reply UI, FAQ CMS management, audit-log identity linkage and end-to-end live database/email/attachment tests remain production work and are not claimed as complete.
- Responsive React/Vite site with the existing OkzByte visual system and content routes.
- Technologies, solutions, ecosystem, research, contact, privacy, and terms pages.
- Researcher profile with ORCID, matching ResearchGate profile, Zenodo and official archive links, two SSRN DOI records, and a separate books section.
- Research archive tabs/filters for papers/preprints, ResearchGate, Zenodo, and technical articles; a private drafts entry point; and a profile route.
- Protected article authoring, editorial status transitions, profile/book editing, source links, audit/revision history, and duplicate merging.
- Route manifest, robots.txt, sitemap, supplied OkzByte assets, and no invented clients, awards, partnerships, or performance claims.
