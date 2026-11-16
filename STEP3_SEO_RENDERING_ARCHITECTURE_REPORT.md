# OkzByte — Step 3 SEO Rendering Architecture Implementation Report

**Date:** 2026-11-17
**Repository:** `faisalorakzai-lab/Okzbyte`
**Canonical host:** `https://okzbyte.vercel.app`
**Scope:** Build-time rendering and crawlability improvements; no custom-domain migration and no manual Vercel deployment.

## Executive summary

**TEST PASSED.** OkzByte’s existing React + Vite application now prerenders route-specific HTML during `npm run build`. The build produced 63 public route documents: 53 routes in the canonical source sitemap, 9 currently published research-detail routes, and the `/terms` compatibility path. The generated sitemap contains 62 URLs (the 53 sitemap routes plus the 9 research details).

The architecture retains the existing framework and client-side router. A new Vite/React server-rendering build step renders public pages into static HTML, while private application URLs use a separate empty app shell with `noindex` controls. Research pages are populated only from existing public/published sources or the repository’s curated public fallback catalogue. No authenticated CMS records, drafts, or private account data are prerendered.

## Architecture decision

**VERIFIED IN CODE — Recommendation implemented:** use Vite’s SSR module loader and React server rendering at build time; emit static clean-route HTML into `dist/`; serve those files through Vercel rewrites and the existing Node server. Continue using the existing React app and hydrate the already-rendered markup in the browser.

This is the lowest-risk fit for this project: it makes the first HTTP response useful to crawlers and social-preview fetchers without migrating to Next.js or duplicating the application as a separate server runtime. The same `src/seo.js` route metadata and JSON-LD helpers are used by the prerenderer and client application.

A security-policy issue was caught during real-browser testing: the server’s Content Security Policy disallows inline JavaScript, so an inline bootstrap script would be blocked and could remove dynamic schema during hydration. The public route and data bootstrap is now safely HTML-escaped on the root element as `data-prerender`; the application reads it and calls `hydrateRoot`. This preserves the existing CSP and avoids a second application bundle or inline-script exception.

## Rendering and route coverage

**TEST PASSED.** The production build rendered 63 public HTML route documents. It covered all 53 canonical source-sitemap paths and 9 published research-detail routes, plus `/terms` as a compatibility route. The generated sitemap contains the 53 source-sitemap URLs and 9 research-detail URLs.

Every source-sitemap route is checked from the actual local HTTP server response, before executing browser JavaScript. For each URL, the verifier checks one unique title, description, canonical, robots directive, Open Graph and Twitter metadata, one meaningful H1, visible body content, and unique Schema.org JSON-LD IDs and entities. It also checks that the canonical and social URLs use the current Vercel host.

**TEST PASSED — Browser hydration sample:** the researcher profile was loaded in a real browser after prerendering. After hydration it retained one H1 and five JSON-LD nodes (`Organization`, `WebSite`, `Person`, `WebPage`, `BreadcrumbList`), with no duplicate IDs. The profile’s `Person` entity remained present after hydration.

## Dynamic research pages and data boundaries

**VERIFIED IN CODE.** The build requests research data only through the existing public research endpoints. The endpoint queries CMS articles with `status=published`, sources with `verified=true`, and only exposes an allowed PDF URL when PDF permission is confirmed. The public profile endpoint requires a verified profile, and the books endpoint returns listed books. When the public research API is unavailable, the build uses the existing curated `publishedFallback` catalogue rather than querying private CMS tables directly.

**TEST PASSED.** This build reported `source-catalogue` for articles and `public-api` for profile/books, and prerendered 9 research-detail routes. Article records are passed into their matching route, descriptions use the record’s existing SEO description or abstract/excerpt, and Article JSON-LD is emitted only for records not marked `catalogue_only`. Author and dates are emitted only when present and valid. Unknown research slugs returned a branded HTTP 404 from the local Node server.

**NOT VERIFIED.** The local Supabase/database environment is not configured, so this run did not exercise authenticated CMS editing or a newly published CMS item. New CMS content is reflected in prerendered output after the next build/redeploy; it is not regenerated automatically on publication.

## Metadata, structured data and social previews

**TEST PASSED.** Prerendered public HTML includes one route-appropriate title and description, canonical, `index,follow` robots directive, document language inherited from the HTML template, Open Graph title/description/type/site name/image/URL, and Twitter/X card/title/description/image. All tested canonicals and `og:url` values use `https://okzbyte.vercel.app`. The existing social image configuration is used; no replacement image URL was introduced.

**TEST PASSED.** Each page includes the shared Organization and WebSite entities and a WebPage entity where the route is indexable. Breadcrumbs are included where applicable, the verified researcher profile gets a Person entity, and Article schema is conditional on the published record type. Stable IDs let the React effects update/reuse the server-emitted nodes instead of creating duplicates.

## Private routes, redirects and 404s

**VERIFIED IN CODE.** Private dashboard, billing, portal, admin and other protected routes are not in the source sitemap or prerender set. Vercel routes those paths to `dist/app-shell.html`; the shell has an empty root, no canonical or JSON-LD, and a `noindex,follow` meta directive. Vercel response headers and the Node server also apply `X-Robots-Tag: noindex` to the applicable private surfaces. Existing authentication/API code was not weakened or replaced.

**TEST PASSED.** Raw HTTP checks verified private shells and noindex headers, with no researcher payload or account content in the shell. Unmatched paths and an unknown research slug returned HTTP 404 (not soft-200) with branded output in the local Node server. The singular `/developer` alias remains a permanent redirect to `/developers`; the duplicate `/developers/api` route now permanently redirects to `/security/api-security` and is removed from the sitemap and route manifest.

**NOT VERIFIED.** No live Vercel deployment was performed, so Vercel’s deployed response statuses and automatic Git-connected deployment behavior were not observed.

## Validation results

| Check | Result |
|---|---|
| `npm ci --no-audit --no-fund` | **TEST PASSED** — clean install completed |
| `npm run build` | **TEST PASSED** — Vite build and prerender completed; 63 route documents emitted |
| `npm run typecheck:seo` | **TEST PASSED** |
| `npm run test:seo` | **TEST PASSED** — 53 canonical public URLs, 33 unique enterprise/security metadata records, 37 rendered enterprise/security H1 routes, raw HTTP checks for all 53 sitemap paths plus 9 research details, private shells and 404 checks |
| Source `public/sitemap.xml` | **TEST PASSED** — parsed as XML; 53 unique Vercel-host URLs |
| Built `dist/sitemap.xml` | **TEST PASSED** — parsed as XML; 62 unique Vercel-host URLs |
| Browser hydration check | **TEST PASSED** — profile H1/schema counts and unique JSON-LD IDs after JavaScript |
| `git diff --check` | **TEST PASSED** |
| Search for absolute future-domain URLs in implementation | **TEST PASSED** — none found |

The local research API may report its expected 503 when the development database is not configured; the build uses the public catalogue fallback. No form submissions or private account operations were performed as part of this SEO test.

## Performance and compatibility notes

**VERIFIED IN CODE.** The change adds server rendering during build and produces static HTML files; it does not load a second copy of the application in the browser. The existing UI, client router, API endpoints, CMS submission code, and authentication flow remain in place. Contact and ticket query-string prefill is applied after hydration so server HTML and the initial client render match without losing the prefill behavior.

**BLOCKED / remaining optimization:** the Vite build reports an existing large application chunk at approximately **976.56 kB minified (261.52 kB gzip)** and recommends code splitting. It also reports `use client` directive notices from `lucide-react`. The build succeeds; bundle-splitting was not included because it is a separate performance refactor and could affect existing loading behavior.

## Files changed

- `package.json` — adds prerender to the production build and exposes the SEO test/typecheck commands.
- `scripts/prerender.mjs` — new Vite/React build-time prerenderer, public research data collection, route HTML, structured data and generated sitemap.
- `scripts/verify-prerender.mjs` — new raw-HTTP integration checks for public routes, metadata, research details, private shells, redirects and 404s.
- `scripts/verify-seo.mjs` — extends source/config checks for aliases and route handling.
- `src/seo.js` — shared route metadata, current-host canonicals, public route allow-list and structured data behavior.
- `src/main.jsx` — SSR/hydration entry, route metadata/schema node reuse and client-side alias normalization.
- `src/ResearchPage.jsx` — accepts prerendered research/profile props and reuses structured-data nodes during hydration.
- `src/SupportPages.jsx` — makes URL-query prefill SSR-safe while applying the prefill after hydration.
- `server/index.mjs` — serves clean static prerendered routes, preserves private/404 behavior and redirects the duplicate developer API alias.
- `vercel.json` — maps public routes to generated HTML, private routes to the noindex shell, and preserves/adds permanent redirects and existing headers.
- `public/sitemap.xml` — synchronized source sitemap, excluding private routes and the redirected duplicate alias.
- `public/manus-routes.json` — removes the route-manifest entry for the redirected duplicate API alias.
- `STEP3_SEO_RENDERING_ARCHITECTURE_REPORT.md` — this report.

No new dependencies were added; `package-lock.json` was unchanged.

## Deployment requirements and remaining blockers

**VERIFIED IN CODE.** The current canonical origin remains `https://okzbyte.vercel.app`. No `okzbyte.com` canonical, social URL, sitemap URL, custom-domain setting, DNS change, or domain migration was introduced. The Vercel build must run `npm run build` and publish the generated `dist` output so the clean-route HTML and `app-shell.html` exist for the configured rewrites.

**NOT VERIFIED.** This work was not deployed to Vercel and no Google Search Console or search-indexing state was checked. A Git-connected Vercel project could independently auto-build after a push; no manual Vercel deployment command was run. Google indexing must not be inferred from these local tests.
