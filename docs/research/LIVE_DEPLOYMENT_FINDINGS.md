# Live research page diagnostic

Checked the deployed Vercel Research page at `https://okzbyte.vercel.app/research` on 16 November 2026.

- The UI loaded, but both the article index and research submissions were unavailable.
- `GET /api/research/articles`, `POST /api/research/submissions`, and `POST /api/research/newsletter` returned `404` from the deployed Vercel origin. The project had no matching Vercel function files.
- Read-only checks against the user-supplied Supabase project's Data API found no `research_articles`, `research_submissions`, `research_article_sources`, or `research_newsletter_subscribers` relations (`PGRST205`). No records were read or modified.
- The custom hostname `okzbyte.com` returned DNS `NXDOMAIN` from the browser, while `okzbyte.vercel.app` loaded. Confirm the custom domain DNS separately in Vercel/registrar settings.

Fixes added in this repository:

- Vercel endpoints for list/detail, profile, books, research proposals, and newsletter requests.
- Server-only Supabase REST access; secret keys are not embedded in client assets.
- A source-verified public catalogue fallback containing two SSRN preprints and seven official-site articles. The ten editorial drafts and the identity-pending Zenodo item are excluded.
- Honest submission behavior: a proposal is reported as sent only after Supabase confirms its insertion. Missing tables or credentials return a clear `503`.

Remaining live deployment prerequisites are documented in [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md): apply the reviewed migrations in order, set the two server-only Vercel environment variables, redeploy, and verify the deployed endpoints. This diagnostic did not perform database writes or deployment changes.
