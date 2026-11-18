import assert from 'node:assert/strict';
import { createServer as createNetServer } from 'node:net';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { COMPANY_DESCRIPTION, FAISAL_PERSON_ID, getPageSEO, isPrivateRoute, SITEMAP_PATHS, SITE_ORIGIN } from '../src/seo.js';

const ROOT = process.cwd();
const USER_AGENT = 'Googlebot/2.1 (+http://www.google.com/bot.html)';

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchingTags(html, selector, value) {
  const pattern = new RegExp(`<meta\\b(?=[^>]*\\b${selector}=["']${escapeRegex(value)}["'])[^>]*>`, 'gi');
  return [...html.matchAll(pattern)].map(match => match[0]);
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, 'i'));
  return match ? decodeEntities(match[1]) : null;
}

function decodeEntities(value) {
  return String(value || '')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/gi, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function textContent(html) {
  return decodeEntities(html.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function parseSitemap(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(decodeEntities(match[1])).pathname);
}

async function freePort() {
  const server = createNetServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}

const port = await freePort();
const child = spawn(process.execPath, ['server/index.mjs'], {
  cwd: ROOT,
  env: { ...process.env, PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverOutput = '';
child.stdout.on('data', chunk => { serverOutput += chunk.toString(); });
child.stderr.on('data', chunk => { serverOutput += chunk.toString(); });
const base = `http://127.0.0.1:${port}`;

async function get(path, options = {}) {
  return fetch(`${base}${path}`, { headers: { 'user-agent': options.userAgent || USER_AGENT }, redirect: options.redirect || 'follow' });
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Local server exited early: ${serverOutput}`);
    try {
      const response = await get('/api/health');
      if (response.status === 200) { ready = true; break; }
    } catch {}
    await delay(100);
  }
  assert(ready, `Local Node server did not become ready. Output: ${serverOutput}`);

  const sitemapResponse = await get('/sitemap.xml');
  assert.equal(sitemapResponse.status, 200, 'sitemap must be served by the local HTTP server');
  const sitemap = await sitemapResponse.text();
  const sitemapPaths = parseSitemap(sitemap);
  assert.equal(new Set(sitemapPaths).size, sitemapPaths.length, 'generated sitemap must not contain duplicates');
  for (const path of SITEMAP_PATHS) assert(sitemapPaths.includes(path), `generated sitemap is missing ${path}`);
  for (const path of sitemapPaths) assert(!isPrivateRoute(path), `private route leaked into generated sitemap: ${path}`);
  const articlePaths = sitemapPaths.filter(path => path.startsWith('/research/') && path !== '/research/profile');
  assert(articlePaths.length > 0, 'at least one currently public research item should be prerendered and listed');

  const titles = new Map();
  const descriptions = new Map();
  const headings = new Map();
  for (const path of sitemapPaths) {
    const response = await get(path);
    assert.equal(response.status, 200, `${path} must return HTTP 200 in the raw HTML response`);
    assert.match(response.headers.get('content-type') || '', /text\/html/i, `${path} must return HTML`);
    const html = await response.text();
    const titleTags = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
    assert.equal(titleTags.length, 1, `${path} must have exactly one title tag`);
    const title = textContent(titleTags[0][1]);
    assert(title.length >= 18, `${path} title is too short or missing`);
    assert(!titles.has(title), `${path} duplicates the title for ${titles.get(title)}: ${title}`);
    titles.set(title, path);

    for (const [attributeName, value] of [
      ['name', 'description'], ['name', 'robots'], ['property', 'og:title'], ['property', 'og:description'],
      ['property', 'og:type'], ['property', 'og:site_name'], ['property', 'og:image'], ['property', 'og:url'],
      ['name', 'twitter:card'], ['name', 'twitter:title'], ['name', 'twitter:description'], ['name', 'twitter:image'],
    ]) {
      assert.equal(matchingTags(html, attributeName, value).length, 1, `${path} must have exactly one ${attributeName}=${value}`);
    }
    const description = attribute(matchingTags(html, 'name', 'description')[0], 'content');
    assert(description && description.length >= 40, `${path} needs a meaningful meta description`);
    assert(!descriptions.has(description), `${path} duplicates the description for ${descriptions.get(description)}`);
    descriptions.set(description, path);
    assert.equal(attribute(matchingTags(html, 'name', 'robots')[0], 'content'), 'index,follow', `${path} must be indexable`);
    assert.equal(attribute(matchingTags(html, 'property', 'og:title')[0], 'content'), title, `${path} Open Graph title must match page title`);
    assert.equal(attribute(matchingTags(html, 'property', 'og:description')[0], 'content'), description, `${path} Open Graph description must match`);
    const canonical = `${SITE_ORIGIN}${path === '/' ? '/' : path}`;
    const canonicalTags = [...html.matchAll(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi)].map(match => match[0]);
    assert.equal(canonicalTags.length, 1, `${path} must have exactly one canonical link`);
    assert.equal(attribute(canonicalTags[0], 'href'), canonical, `${path} canonical must use the current Vercel host`);
    assert.equal(attribute(matchingTags(html, 'property', 'og:url')[0], 'content'), canonical, `${path} og:url must match canonical`);
    assert.equal(attribute(matchingTags(html, 'property', 'og:site_name')[0], 'content'), 'OkzByte', `${path} must use the brand site name`);
    assert.equal(attribute(matchingTags(html, 'name', 'twitter:title')[0], 'content'), title, `${path} Twitter title must match`);
    assert.equal(attribute(matchingTags(html, 'name', 'twitter:description')[0], 'content'), description, `${path} Twitter description must match`);
    assert.equal(attribute(matchingTags(html, 'name', 'twitter:card')[0], 'content'), 'summary_large_image');
    const socialImage = attribute(matchingTags(html, 'property', 'og:image')[0], 'content');
    assert.equal(attribute(matchingTags(html, 'name', 'twitter:image')[0], 'content'), socialImage, `${path} Twitter image must match Open Graph`);
    assert.equal(new URL(socialImage).protocol, 'https:', `${path} social image must be an absolute HTTPS URL`);

    const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(match => textContent(match[1]));
    assert.equal(h1s.length, 1, `${path} must render exactly one H1 before JavaScript`);
    assert(h1s[0].length > 3, `${path} H1 must be meaningful`);
    assert(!headings.has(h1s[0]), `${path} duplicates the H1 for ${headings.get(h1s[0])}: ${h1s[0]}`);
    headings.set(h1s[0], path);
    const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || '';
    assert(textContent(body).length > 180, `${path} initial body must contain useful visible HTML, not only a shell`);

    const schemaTags = [...html.matchAll(/<script\b([^>]*\btype=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi)];
    assert(schemaTags.length >= 3, `${path} should include Organization, WebSite and WebPage JSON-LD`);
    const ids = schemaTags.map(match => attribute(match[1], 'id'));
    assert.equal(new Set(ids).size, ids.length, `${path} contains duplicate JSON-LD element IDs`);
    const schemas = schemaTags.map(match => JSON.parse(match[2]));
    const types = schemas.map(schema => schema['@type']);
    assert.equal(types.filter(type => type === 'Organization').length, 1, `${path} needs one Organization entity`);
    assert.equal(types.filter(type => type === 'WebSite').length, 1, `${path} needs one WebSite entity`);
    assert.equal(types.filter(type => type === 'WebPage').length, 1, `${path} needs one WebPage entity`);
    assert(schemas.every(schema => schema['@context'] === 'https://schema.org'), `${path} JSON-LD must use Schema.org`);
    assert(!html.includes('SUPABASE_SECRET_KEY') && !html.includes('SUPABASE_SERVICE_ROLE_KEY'), `${path} must not expose server credentials`);

    const organization = schemas.find(schema => schema['@type'] === 'Organization');
    const website = schemas.find(schema => schema['@type'] === 'WebSite');
    const webPage = schemas.find(schema => schema['@type'] === 'WebPage');
    const organizationId = `${SITE_ORIGIN}/#organization`;
    assert.equal(organization?.['@id'], organizationId, `${path} must use the stable Organization ID`);
    assert.equal(website?.['@id'], `${SITE_ORIGIN}/#website`, `${path} must use the stable WebSite ID`);
    assert.equal(website?.publisher?.['@id'], organizationId, `${path} WebSite publisher must reference the Organization`);
    assert.equal(webPage?.publisher?.['@id'], organizationId, `${path} WebPage publisher must reference the Organization`);
    if (path === '/') {
      assert.equal(organization?.description, COMPANY_DESCRIPTION, 'homepage Organization must use the approved company description');
      assert.equal(organization?.founder?.['@id'], FAISAL_PERSON_ID, 'homepage Organization must reference the stable founder Person');
      for (const unsupported of ['legalName', 'address', 'parentOrganization', 'telephone', 'foundingDate', 'sameAs']) {
        assert(!(unsupported in organization), `Organization must not emit unsupported ${unsupported}`);
      }
    }
    if (path === '/about') assert.equal(webPage?.publisher?.['@id'], organizationId, 'About WebPage must retain the Organization publisher relationship');

    if (path === '/research/profile') {
      assert.equal(types.filter(type => type === 'Person').length, 1, 'verified researcher profile should include one Person schema');
      const person = schemas.find(schema => schema['@type'] === 'Person');
      assert.equal(person?.['@id'], FAISAL_PERSON_ID, 'raw profile HTML must use the stable Person ID');
      assert.equal(person?.name, 'Faisal Orakzai', 'raw profile HTML must identify the approved founder');
      assert.equal(person?.jobTitle, 'Founder & CEO');
      assert.equal(person?.worksFor?.['@id'], organizationId, 'raw Person must reference the existing Organization');
      assert(!person?.sameAs?.some(url => new URL(url).origin === new URL(SITE_ORIGIN).origin), 'raw Person sameAs must exclude company-origin URLs');
      assert(!person?.sameAs?.some(url => new URL(url).hostname === 'zenodo.org' && new URL(url).search), 'raw Person sameAs must exclude generic Zenodo searches');
    }
    if (articlePaths.includes(path)) {
      const stateMatch = html.match(/<div id="root" data-prerender='([^']*)'>/);
      assert(stateMatch, `${path} must include matching public hydration state on the root element`);
      const boot = JSON.parse(decodeEntities(stateMatch[1]));
      assert.equal(boot.path, path);
      assert(!html.includes('window.__OKZBYTE_PRERENDER__'), `${path} must not rely on a CSP-blocked inline bootstrap script`);
      assert.equal(boot.data?.researchArticle?.slug, path.slice('/research/'.length), `${path} must prerender the matching article`);
      assert(boot.data.researchArticle.title && (boot.data.researchArticle.abstract || boot.data.researchArticle.excerpt), `${path} must include actual public article content`);
      const expectedSchema = boot.data.researchArticle.catalogue_only ? 0 : 1;
      assert.equal(types.filter(type => type === 'Article').length, expectedSchema, `${path} Article JSON-LD must match the CMS/source-catalogue record type`);
    }
  }

  assert.equal(titles.size, sitemapPaths.length, 'all public sitemap titles should be unique');
  assert.equal(descriptions.size, sitemapPaths.length, 'all public sitemap descriptions should be unique');
  assert.equal(headings.size, sitemapPaths.length, 'all public sitemap H1s should be route-specific');

  const alias = await get('/developer', { redirect: 'manual' });
  assert.equal(alias.status, 308, 'legacy /developer must retain permanent redirect');
  assert.equal(alias.headers.get('location'), '/developers');
  const developerApiAlias = await get('/developers/api', { redirect: 'manual' });
  assert.equal(developerApiAlias.status, 308, 'duplicate developer API alias must permanently redirect');
  assert.equal(developerApiAlias.headers.get('location'), '/security/api-security');
  const termsAlias = await get('/terms');
  assert.equal(termsAlias.status, 200, 'terms alias route should remain functional');
  const termsHtml = await termsAlias.text();
  const termsCanonical = [...termsHtml.matchAll(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi)].map(match => match[0]);
  assert.equal(termsCanonical.length, 1);
  assert.equal(attribute(termsCanonical[0], 'href'), `${SITE_ORIGIN}/terms-and-conditions`);

  for (const path of ['/admin', '/workspace', '/workspace/agents', '/portal', '/billing', '/checkout', '/subscriptions', '/subscriptions/manage', '/security/admin', '/support/track', '/enterprise/case-studies']) {
    const response = await get(path);
    assert.equal(response.status, 200, `${path} should continue to serve the private app shell`);
    assert.match(response.headers.get('x-robots-tag') || '', /noindex/i, `${path} needs an X-Robots-Tag noindex header`);
    const html = await response.text();
    assert.match(html, /<meta\s+name="robots"\s+content="noindex,follow"/i, `${path} shell needs a noindex meta directive`);
    assert.match(html, /<div id="root"><\/div>/, `${path} must not contain prerendered account content`);
    assert.doesNotMatch(html, /<link\b[^>]*rel="canonical"/i, `${path} private shell should not emit a canonical URL`);
    assert.doesNotMatch(html, /__OKZBYTE_PRERENDER__|Faisal Orakzai|research-article-jsonld/, `${path} must not include public or private record hydration payloads`);
  }

  for (const path of ['/not-a-real-route', '/research/step3-nonexistent-slug-404-check']) {
    const response = await get(path);
    assert.equal(response.status, 404, `${path} must return a real HTTP 404, not a soft 200`);
    assert.match(response.headers.get('x-robots-tag') || '', /noindex/i, '404 response should be noindex');
    assert.match(await response.text(), /OKZBYTE \/ 404|This page/i, '404 must remain branded');
  }

  const listResponse = await get('/api/research/articles?limit=1');
  assert([200, 503].includes(listResponse.status), 'public research API should remain callable or clearly report an unconfigured local CMS');
  const listData = await listResponse.json();
  if (listResponse.status === 200) assert.equal(listData.ok, true);
  else assert.match(listData.error || '', /research_database_not_configured|research_schema_not_ready/, 'local API failure should identify the expected database configuration blocker');
  const profileResponse = await get('/api/research/profile');
  assert([200, 503].includes(profileResponse.status), 'public profile API should remain callable (or report an unconfigured CMS)');

  const mainSource = await readFile(new URL('../src/main.jsx', import.meta.url), 'utf8');
  const researchSource = await readFile(new URL('../src/ResearchPage.jsx', import.meta.url), 'utf8');
  assert.match(mainSource, /dataset\.prerender/, 'hydration should read bootstrap state from the root element without an inline script');
  assert.match(mainSource, /document\.getElementById\(id\)/, 'hydration should reuse SSR JSON-LD nodes by stable ID');
  assert.match(mainSource, /if\(!node\)\{node=document\.createElement\('script'\)/, 'hydration should only create missing JSON-LD nodes');
  assert.match(researchSource, /document\.getElementById\(ldId\)/, 'research article metadata should reuse its prerendered JSON-LD node');
  assert.match(researchSource, /document\.getElementById\(crumbId\)/, 'research breadcrumbs should reuse their prerendered JSON-LD node');

  console.log(`Prerender checks passed: ${sitemapPaths.length} raw-HTTP public routes, ${articlePaths.length} public research detail routes, unique metadata/H1/schema, private shells and real 404s.`);
} finally {
  if (child.exitCode === null) {
    child.kill('SIGTERM');
    await Promise.race([new Promise(resolve => child.once('exit', resolve)), delay(2000)]);
    if (child.exitCode === null) child.kill('SIGKILL');
  }
}
