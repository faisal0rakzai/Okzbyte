# Research page deployment setup

## What was broken

The deployed site is `https://okzbyte.vercel.app/research` (the custom `okzbyte.com` hostname currently resolves to NXDOMAIN from the public browser). The Vercel page rendered, but `GET /api/research/articles`, `POST /api/research/submissions`, and `POST /api/research/newsletter` each returned HTTP 404 because the repository had no corresponding Vercel serverless functions. The Supabase REST API also returned `PGRST205` for `research_articles`, `research_submissions`, `research_article_sources`, and `research_newsletter_subscribers`, meaning those tables do not exist in the supplied Supabase project yet.

The repository now includes Vercel serverless routes for the public research list, article pages, researcher profile, books, proposal submissions, and newsletter requests. The research list can display a source-verified catalogue of two SSRN preprints and seven first-party official-site articles while the CMS schema is unavailable. The ten editorial drafts remain unpublished and are never part of that fallback. Proposal/newsletter endpoints do not claim success when storage is missing; they return a clear `503` until the database is prepared.

## One-time Supabase database setup

The supplied project currently has no research tables. In the Supabase Dashboard for the correct project, open **SQL Editor** and run repository migrations in numerical order, `001` through `009`, once. These migrations create the base schema, research submissions/newsletter tables, CMS/profile/source tables, ten unpublished article drafts, and the source-verified public catalogue entries. The Zenodo item with the unresolved ORCID mismatch remains a draft. Do not paste service keys into SQL, frontend code, or a `VITE_` variable.

Review the SQL before execution. The scripts are part of the project and some create non-research application tables as well. If this Supabase project already contains production data from another deployment, take a backup and have the database owner confirm the migration plan before running them.

## Vercel environment

Set these server-side Vercel environment variables for the deployments that serve the Research page:

- `SUPABASE_URL` — the project URL.
- `SUPABASE_SECRET_KEY` — the server-only Supabase secret key. The application never returns it to the browser.

The publishable key is not used for privileged database writes. Keep the secret key out of Git, frontend build variables, logs, and public issue reports. After adding environment variables or applying migrations, redeploy the Vercel project so serverless functions use the updated configuration.

## Verification after setup

- `GET /api/research/articles` should return a JSON response with published items, source links, filters, and pagination.
- `GET /api/research/articles/official-blockchain-basic` should open the matching official source-linked article record.
- `POST /api/research/submissions` should return `201` only after the proposal is stored. The form does not auto-publish submissions.
- `POST /api/research/newsletter` stores a pending request only; it does not claim to send an email or subscribe a person until a confirmation-email flow exists.

Do not submit real personal information just to test the API. A `422` response to an empty test request is the expected validation result; a `404` indicates that the deployed function is not present.
