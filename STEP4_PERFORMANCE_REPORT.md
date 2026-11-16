# OkzByte — Step 4 Performance Engineering Report

Date: 2026-11-17
Repository: `faisalorakzai-lab/Okzbyte`
Production URL: https://okzbyte.vercel.app
Commit: `e5edf03` — `Optimize initial page loading`

## Scope

This phase focused on initial-load performance and bundle delivery. The existing visual identity, routes, prerendering, SEO metadata, animations, and application behavior were preserved.

## Baseline and final measurements

Measurements below are from the local production build generated with `npm run build` before and after the change. Bundle sizes are minified output sizes; gzip values are reported by Vite.

| Metric | Before | After | Result |
|---|---:|---:|---|
| Initial JavaScript entry | 976.56 kB / 261.52 kB gzip | 308.23 kB / 95.54 kB gzip | PASS |
| Initial CSS entry | 109.09 kB / 19.94 kB gzip | 101.02 kB / 18.12 kB gzip | PASS |
| Three.js delivery | Included in initial entry | Deferred `three.module` chunk: 539.78 kB / 133.92 kB gzip | PASS |
| Public prerender routes | 63 | 63 | PASS |

The initial JavaScript entry was reduced by approximately 68.4% uncompressed and 63.4% gzip. Three.js remains available for the neural visual but is no longer part of the initial JavaScript entry.

## Implemented changes

- Converted AI Workspace, Billing, Enterprise, Security, and Support page modules to route-level lazy imports.
- Kept existing lazy loading for Technologies, Solutions, Research, Ecosystem, Careers, Privacy, Terms, and Research Admin pages.
- Added a shared Suspense boundary around route content so deferred pages retain a stable loading state.
- Deferred the Three.js neural canvas import until the visual component mounts, preserving the existing animation without loading Three.js in the initial entry.
- Preserved prerender data, route mapping, SEO metadata, canonical URLs, private-route handling, and existing page layouts.

## Verification

- `npm ci --no-audit --no-fund`: PASS
- `npm run build`: PASS
- `npm run typecheck:seo`: PASS
- `npm run test:seo`: PASS
- `npm run test:prerender`: PASS as part of `npm run test:seo`
- `git diff --check`: PASS
- Local production preview homepage smoke check: PASS
- Production URL HTTP check: PASS, `200 OK`
- Production title check: PASS, `OkzByte — Engineering Intelligence`

The SEO verification reported 53 canonical public URLs, 33 unique enterprise/security metadata records, 37 enterprise/security H1 checks, 62 raw-HTTP public routes, and 9 public research detail routes passing.

## Metrics not available

A Lighthouse CLI binary was not available in the execution environment, so no Lighthouse Performance, LCP, INP, CLS, FCP, or TBT values are claimed. Chromium was available, but a full Lighthouse run was not performed. Real-user Core Web Vitals were not available.

## Deployment status

The verified commit was pushed to `main` successfully. At the time of verification, `https://okzbyte.vercel.app` returned `200 OK`, but the HTML still referenced the previous asset hash. This indicates that the GitHub push completed while Vercel deployment propagation or repository integration was still pending. The live optimization should be rechecked after the Vercel deployment completes; no live performance score is claimed in this report.

## Files changed

- `src/main.jsx`
- `STEP4_PERFORMANCE_REPORT.md`

## Remaining opportunities

- Run Lighthouse against the deployed commit once Vercel serves the new asset hash.
- Measure LCP, INP, CLS, FCP, and TBT on representative mobile and desktop profiles.
- Consider further reducing the main entry by auditing icon imports and non-critical global CSS after browser-level regression review.
- Review hero video preload behavior with real network traces before changing it, because the existing cinematic hero is part of the approved visual experience.
