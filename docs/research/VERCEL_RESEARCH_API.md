# Vercel Research API

The Research page calls same-origin Vercel functions under `/api/research/*`. Keep the Supabase secret key server-only as `SUPABASE_SECRET_KEY`; never prefix it with `VITE_` or include it in browser code. The `SUPABASE_URL` is also set as a Vercel server-side environment variable.

Routes now implemented:

- `GET /api/research/articles` — published items, search, filters, facets, and pagination.
- `GET /api/research/articles/:slug` — published article detail.
- `GET /api/research/profile` and `GET /api/research/books` — source-checked profile and separate book data.
- `POST /api/research/submissions` — validated, same-origin, rate-limited proposal storage.
- `POST /api/research/newsletter` — pending-consent request storage (no email confirmation is claimed).

On missing/unapplied research schema, public article reads use a source-verified fallback catalogue. Write requests never pretend to have succeeded: they return a clear service error until the Supabase research schema and server-side key are available. See [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) for database setup and verification.
