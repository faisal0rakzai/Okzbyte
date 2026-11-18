import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { COMPANY_DESCRIPTION, FAISAL_PERSON_ID, getPageSEO, getStructuredData, isKnownAppPath, isPrivateRoute, SITEMAP_PATHS, SITE_ORIGIN } from '../src/seo.js';

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
assert(!sitemapPaths.some(path => path !== '/subscriptions/plans' && /^(\/(admin|workspace|portal|billing|checkout|subscriptions)(\/|$))/.test(path)), 'private application routes leaked into sitemap');
assert.match(robots, /Sitemap: https:\/\/okzbyte\.vercel\.app\/sitemap\.xml/, 'robots.txt sitemap host is incorrect');
assert.doesNotMatch(robots, /Disallow:\s*\/(admin|workspace|portal|billing|checkout|subscriptions)(\/|\s|$)/i, 'robots.txt must not block crawlers from seeing noindex directives');

assert.deepEqual(vercel.redirects?.find(rule => rule.source === '/developer'), { source: '/developer', destination: '/developers', permanent: true }, 'singular developer alias must permanently redirect to /developers');
assert.deepEqual(vercel.redirects?.find(rule => rule.source === '/developers/api'), { source: '/developers/api', destination: '/security/api-security', permanent: true }, 'duplicate developer API page must permanently redirect to its canonical security route');
assert(!vercel.rewrites.some(rule => rule.source === '/developers/api'), 'redirected developer API alias must not render duplicate content');
assert(!routeManifest.routes.some(route => route.path === '/developers/api'), 'redirect-only developer API alias must not remain in the route manifest');
assert(!vercel.rewrites.some(rule => rule.source === '/developer'), 'deprecated developer alias must not render as a duplicate page');
assert(!vercel.rewrites.some(rule => rule.source === '/enterprise/:path*' || rule.source === '/security/:path*'), 'public route wildcards would swallow Vercel 404s');
for (const path of SITEMAP_PATHS.filter(path => path !== '/')) {
  const rule = vercel.rewrites.find(rule => rule.source === path);
  assert(rule, `public route needs an explicit Vercel static-HTML rewrite: ${path}`);
  assert.equal(rule.destination, `${path}/index.html`, `public route must serve its prerendered HTML: ${path}`);
}
assert.equal(vercel.rewrites.find(rule => rule.source === '/research/:slug')?.destination, '/research/:slug/index.html', 'published research slugs should map to generated static documents; missing files then return 404');
for (const source of ['/admin', '/admin/:path*', '/workspace', '/workspace/:path*', '/portal', '/portal/:path*', '/billing', '/billing/:path*', '/checkout', '/subscriptions', '/subscriptions/manage', '/subscriptions/manage/:path*', '/security/admin', '/support/track', '/enterprise/case-studies']) {
  assert.equal(vercel.rewrites.find(rule => rule.source === source)?.destination, '/app-shell.html', `private route must use empty noindex shell: ${source}`);
}
assert.match(notFound, /name="robots" content="noindex,follow"/, '404 document must be noindex');
assert.match(notFound, /Return to OkzByte/, '404 document needs a branded route back home');
assert.match(serverSource, /res\.writeHead\(404, \{ 'content-type': 'text\/html; charset=utf-8'/, 'Node server must return a real HTTP 404');
assert.match(serverSource, /readFile\(join\(dist, 'app-shell\.html'\)\)/, 'Node server must serve an empty app shell only for private routes');
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

const organizationId = `${SITE_ORIGIN}/#organization`;
const organization = getStructuredData('/', getPageSEO('/')).find(schema => schema.data['@type'] === 'Organization')?.data;
assert(organization, 'homepage needs an Organization entity');
assert.equal(organization['@id'], organizationId, 'Organization ID must remain stable');
assert.equal(organization.description, COMPANY_DESCRIPTION, 'Organization description must use the approved company description');
assert.equal(organization.founder?.['@id'], FAISAL_PERSON_ID, 'Organization must reference its sole founder by the stable Person ID');
for (const unsupported of ['legalName', 'address', 'parentOrganization', 'telephone', 'foundingDate', 'sameAs']) {
  assert(!(unsupported in organization), `Organization must not include unsupported ${unsupported}`);
}

const profileSchemas = getStructuredData('/research/profile', getPageSEO('/research/profile'), { researchProfile: {
  name: 'Faisal Orakzai', orcid: '0000-0000-0000-0000',
  external_profile_url: 'https://orcid.org/0000-0000-0000-0000',
  researchgate_url: 'https://www.researchgate.net/profile/Faisal-Orakzai-4',
  zenodo_url: 'https://zenodo.org/search?q=Faisal%20Orakzai',
  google_scholar_url: `${SITE_ORIGIN}/`, linkedin_url: null,
  official_research_url: 'https://faisalorakzai.com/research',
} });
const profilePerson = profileSchemas.find(schema => schema.data['@type'] === 'Person')?.data;
assert(profilePerson, 'research profile needs a Person entity');
assert.equal(profilePerson['@id'], FAISAL_PERSON_ID, 'Person ID must be stable across routes');
assert.equal(profilePerson.name, 'Faisal Orakzai');
assert.equal(profilePerson.jobTitle, 'Founder & CEO');
assert.equal(profilePerson.worksFor?.['@id'], organizationId, 'Person must reference the existing Organization');
assert(profilePerson.sameAs.includes('https://orcid.org/0000-0000-0000-0000'), 'valid ORCID must remain in Person sameAs');
assert(profilePerson.sameAs.includes('https://www.researchgate.net/profile/Faisal-Orakzai-4'), 'verified ResearchGate identity must remain in Person sameAs');
assert(profilePerson.sameAs.includes('https://faisalorakzai.com/research'), 'verified personal research site must remain in Person sameAs');
assert(!profilePerson.sameAs.some(url => new URL(url).origin === new URL(SITE_ORIGIN).origin), 'company-origin URLs must not appear in Person sameAs');
assert(!profilePerson.sameAs.some(url => new URL(url).hostname === 'zenodo.org' && new URL(url).search), 'generic Zenodo search pages must not be treated as a Person identity');
assert(!profilePerson.sameAs.some(url => /okzbyte/i.test(url)), 'company profiles must not be attributed to the Person');
const mismatchedProfileSchemas = getStructuredData('/research/profile', getPageSEO('/research/profile'), { researchProfile: { name: 'Another Person' } });
assert.equal(mismatchedProfileSchemas.filter(schema => schema.data['@type'] === 'Person').length, 0, 'a mismatched profile name must not be emitted as Faisal’s Person entity');

assert.doesNotMatch(mainSource, /Co-Founder|CO-FOUNDER/i, 'Faisal must be presented as the sole Founder & CEO');
assert.match(mainSource, /founder-role">Founder &amp; CEO/);

console.log(`SEO checks passed: ${sitemapPaths.length} canonical public URLs; ${enterpriseAndSecurityPaths.length} unique enterprise/security metadata records; private noindex, redirect, and 404 checks passed.`);
