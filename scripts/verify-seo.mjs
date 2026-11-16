import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { getPageSEO, isKnownAppPath, isPrivateRoute, SITEMAP_PATHS, SITE_ORIGIN } from '../src/seo.js';

const [sitemap, robots, vercelRaw, routeManifestRaw, notFound, serverSource, mainSource, securitySource, enterpriseSource] = await Promise.all([
  readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8'),
  readFile(new URL('../public/robots.txt', import.meta.url), 'utf8'),
  readFile(new URL('../vercel.json', import.meta.url), 'utf8'),
  readFile(new URL('../public/manus-routes.json', import.meta.url), 'utf8'),
  readFile(new URL('../public/404.html', import.meta.url), 'utf8'),
  readFile(new URL('../server/index.mjs', import.meta.url), 'utf8'),
  readFile(new URL('../src/main.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/SecurityCenterPage.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/EnterprisePage.jsx', import.meta.url), 'utf8'),
]);
const vercel = JSON.parse(vercelRaw);
const routeManifest = JSON.parse(routeManifestRaw);
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const sitemapPaths = locs.map(url => {
  const parsed = new URL(url);
  assert.equal(parsed.origin, SITE_ORIGIN, `unexpected sitemap origin: ${url}`);
  assert.equal(parsed.search, '', `sitemap URL must not have query params: ${url}`);
  assert.equal(parsed.hash, '', `sitemap URL must not have a fragment: ${url}`);
  return parsed.pathname;
});

assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>\s*<urlset[^>]+sitemaps\.org\/schemas\/sitemap\/0\.9/s, 'sitemap XML declaration/root is invalid');
assert.match(sitemap, /<\/urlset>\s*$/, 'sitemap is missing a closing urlset');
assert.equal(new Set(sitemapPaths).size, sitemapPaths.length, 'sitemap contains duplicate paths');
assert.deepEqual(sitemapPaths, SITEMAP_PATHS, 'sitemap paths differ from the centralized public route list');
for (const path of sitemapPaths) {
  assert(!isPrivateRoute(path), `private route must not appear in sitemap: ${path}`);
  const page = getPageSEO(path);
  assert.equal(page.exists, true, `sitemap path has no route metadata: ${path}`);
  assert.equal(page.indexable, true, `noindex route must not appear in sitemap: ${path}`);
  assert.equal(page.canonical, `${SITE_ORIGIN}${path === '/' ? '/' : path}`, `wrong canonical URL for ${path}`);
  assert(page.title.trim().length >= 12, `missing/short title for ${path}`);
  assert(page.description.trim().length >= 40, `missing/short description for ${path}`);
}

const enterpriseAndSecurityPaths = SITEMAP_PATHS.filter(path => path.startsWith('/enterprise/') || path.startsWith('/security/'));
for (const path of enterpriseAndSecurityPaths) {
  const page = getPageSEO(path);
  assert(page.h1 && page.h1.trim().length > 3, `missing H1 metadata for ${path}`);
}
const pageTitles = enterpriseAndSecurityPaths.map(path => getPageSEO(path).title);
assert.equal(new Set(pageTitles).size, pageTitles.length, 'enterprise/security titles should be unique by route');
const pageH1s = enterpriseAndSecurityPaths.map(path => getPageSEO(path).h1);
assert.equal(new Set(pageH1s).size, pageH1s.length, 'enterprise/security H1 labels should be unique by route');

for (const path of ['/admin', '/admin/enterprise', '/workspace', '/workspace/agents', '/portal', '/portal/projects', '/billing', '/billing/invoices', '/checkout', '/subscriptions/manage', '/security/admin', '/support/track']) {
  assert.equal(isPrivateRoute(path), true, `${path} should be private/noindex`);
  assert.equal(getPageSEO(path).robots, 'noindex,follow', `${path} missing noindex metadata`);
  assert(isKnownAppPath(path), `${path} should remain a recognized app route`);
}
assert.equal(isPrivateRoute('/subscriptions/plans'), false, 'public subscription plan page should not inherit account noindex');
const noindexHeaders = vercel.headers.filter(rule => rule.headers?.some(header => header.key.toLowerCase() === 'x-robots-tag' && header.value.toLowerCase() === 'noindex, follow'));
const noindexSources = new Set(noindexHeaders.map(rule => rule.source));
for (const [path, source] of [
  ['/admin', '/admin'], ['/admin/enterprise', '/admin/:path*'],
  ['/workspace', '/workspace'], ['/workspace/agents', '/workspace/:path*'],
  ['/portal', '/portal'], ['/portal/projects', '/portal/:path*'],
  ['/billing', '/billing'], ['/billing/invoices', '/billing/:path*'],
  ['/checkout', '/checkout'], ['/subscriptions', '/subscriptions'], ['/subscriptions/manage', '/subscriptions/manage'],
  ['/security/admin', '/security/admin'], ['/support/track', '/support/track'],
  ['/enterprise/case-studies', '/enterprise/case-studies'],
]) assert(noindexSources.has(source), `Vercel X-Robots-Tag rule missing for ${path}`);
assert(!noindexSources.has('/subscriptions/:path*'), 'public subscription plans must not inherit a broad noindex header');
assert(!sitemapPaths.some(path => /^(\/(admin|workspace|portal|billing|checkout|subscriptions)(\/|$))/.test(path)), 'private application routes leaked into sitemap');
assert.match(robots, /Sitemap: https:\/\/okzbyte\.vercel\.app\/sitemap\.xml/, 'robots.txt sitemap host is incorrect');
assert.doesNotMatch(robots, /Disallow:\s*\/(admin|workspace|portal|billing|checkout|subscriptions)(\/|\s|$)/i, 'robots.txt must not block crawlers from seeing noindex directives');

assert.deepEqual(vercel.redirects?.find(rule => rule.source === '/developer'), { source: '/developer', destination: '/developers', permanent: true }, 'singular developer alias must permanently redirect to /developers');
assert(!vercel.rewrites.some(rule => rule.source === '/developer'), 'deprecated developer alias must not render as a duplicate page');
assert(!vercel.rewrites.some(rule => rule.source === '/enterprise/:path*' || rule.source === '/security/:path*'), 'public route wildcards would swallow Vercel 404s');
assert.match(notFound, /name="robots" content="noindex,follow"/, '404 document must be noindex');
assert.match(notFound, /Return to OkzByte/, '404 document needs a branded route back home');
assert.match(serverSource, /res\.writeHead\(404, \{ 'content-type': 'text\/html; charset=utf-8'/, 'Node server must return a real HTTP 404');
assert.match(serverSource, /isKnownAppPath\(pathname\)/, 'Node server must distinguish app routes from unknown routes');
assert.match(serverSource, /x-robots-tag', 'noindex, follow'/, 'Node server should send noindex response headers for private routes');
assert.match(mainSource, /!isKnownAppPath\(path\)\?<NotFoundPage\/>/, 'client router should render a branded 404 for unknown app paths');
assert.match(securitySource, /SecurityHero showHeading=\{path === '\/security'\}/, 'security section root should own the generic H1');
assert.match(securitySource, /isDedicatedPage=\{path === '\/security\/overview'\}/, 'security overview should have its own H1');
assert.match(enterpriseSource, /<h1>\{title\}<\/h1>/, 'enterprise subpages should render route-specific H1 titles');

const deprecatedHostFiles = ['../src/main.jsx', '../src/seo.js', '../src/ResearchPage.jsx', '../src/PrivacyPage.jsx', '../src/TermsPage.jsx', '../public/sitemap.xml', '../public/robots.txt', '../.env.example', '../server/support.mjs'];
const futureDomain = `${new URL(SITE_ORIGIN).protocol}//${new URL(SITE_ORIGIN).hostname.replace('.vercel.app', '.com')}`;
for (const relative of deprecatedHostFiles) {
  const source = await readFile(new URL(relative, import.meta.url), 'utf8');
  assert(!source.includes(futureDomain), `future custom domain found in current SEO config: ${relative}`);
}
assert(!routeManifest.routes.some(route => route.path === '/developer'), 'redirect-only alias must not remain in the app route manifest');

console.log(`SEO checks passed: ${sitemapPaths.length} canonical public URLs; ${enterpriseAndSecurityPaths.length} unique enterprise/security metadata records; private noindex, redirect, and 404 checks passed.`);
