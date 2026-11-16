import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { PassThrough } from 'node:stream';
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { createServer } from 'vite';
import {
  DEFAULT_SOCIAL_IMAGE,
  getPageSEO,
  getStructuredData,
  isPrivateRoute,
  SITEMAP_PATHS,
  SITE_ORIGIN,
} from '../src/seo.js';
import { fallbackBooks, fallbackProfile, publishedFallback } from '../server/research-rest.mjs';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const RESEARCH_SOURCE_ORIGIN = String(process.env.OKZBYTE_PRERENDER_SOURCE_ORIGIN || SITE_ORIGIN).replace(/\/+$/, '');
const ARTICLE_SLUG_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,159}$/;

function shortText(value, limit = 160) {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= limit) return text;
  const prefix = text.slice(0, limit - 1).replace(/\s+\S*$/, '').trim();
  return `${prefix || text.slice(0, limit - 1)}…`;
}

function summarizeArticle(article) {
  const { content, references_json, related, pdf_url, ...summary } = article;
  return summary;
}

function fallbackArchive() {
  const items = publishedFallback.filter(item => ARTICLE_SLUG_PATTERN.test(String(item.slug || '')));
  const categoryCounts = {};
  for (const item of items) if (item.category) categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  const years = [...new Set(items.map(item => item.published_at ? new Date(item.published_at).getUTCFullYear() : null).filter(Boolean))].sort((a, b) => b - a);
  return {
    index: {
      ok: true, source: 'source-catalogue', items: items.slice(0, 12).map(summarizeArticle),
      total: items.length, page: 1, pageSize: 12, categoryCounts,
      facets: { authors: [...new Set(items.map(item => item.author).filter(Boolean))].sort(), years }, featured: null,
    },
    articles: items,
    source: 'repository-public-fallback',
  };
}

async function fetchPublicJson(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 18000);
  try {
    const response = await fetch(new URL(path, `${RESEARCH_SOURCE_ORIGIN}/`), {
      headers: { accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${path}`);
    const data = await response.json();
    if (!data || data.ok !== true) throw new Error(`Public endpoint did not return ok for ${path}`);
    return data;
  } finally {
    clearTimeout(timer);
  }
}

async function getPublicResearch() {
  try {
    const [indexResponse, firstPage] = await Promise.all([
      fetchPublicJson('/api/research/articles?limit=12&page=1'),
      fetchPublicJson('/api/research/articles?limit=48&page=1'),
    ]);
    if (!Array.isArray(indexResponse.items) || !Array.isArray(firstPage.items)) throw new Error('Research API response did not include article lists');
    const pageSize = Math.max(1, Math.min(48, Number(firstPage.pageSize) || 48));
    const pageCount = Math.max(1, Math.ceil(Math.min(500, Number(firstPage.total) || firstPage.items.length) / pageSize));
    const pages = [firstPage];
    for (let page = 2; page <= pageCount; page += 1) {
      pages.push(await fetchPublicJson(`/api/research/articles?limit=${pageSize}&page=${page}`));
    }
    const bySlug = new Map();
    for (const page of pages) {
      if (!Array.isArray(page.items)) throw new Error('Research API page has no items array');
      for (const item of page.items) {
        if (ARTICLE_SLUG_PATTERN.test(String(item.slug || '')) && String(item.title || '').trim()) {
          if (!bySlug.has(item.slug)) bySlug.set(item.slug, item);
        }
      }
    }
    return {
      index: { ...indexResponse, items: indexResponse.items.slice(0, 12).map(summarizeArticle), pageSize: 12 },
      articles: [...bySlug.values()],
      source: firstPage.source || indexResponse.source || 'public-api',
    };
  } catch (error) {
    console.warn(`[prerender] Public research API unavailable; using the repository's existing public fallback catalogue: ${error.message}`);
    return fallbackArchive();
  }
}

async function getPublicProfile() {
  let profile = fallbackProfile;
  let books = fallbackBooks;
  let source = 'repository-public-fallback';
  const [profileResult, booksResult] = await Promise.allSettled([
    fetchPublicJson('/api/research/profile'),
    fetchPublicJson('/api/research/books'),
  ]);
  if (profileResult.status === 'fulfilled' && profileResult.value.profile?.name) {
    profile = profileResult.value.profile;
    source = 'public-api';
  } else if (profileResult.status === 'rejected') {
    console.warn(`[prerender] Public verified profile endpoint unavailable; using the existing verified fallback: ${profileResult.reason.message}`);
  }
  if (booksResult.status === 'fulfilled' && Array.isArray(booksResult.value.items)) books = booksResult.value.items;
  else if (booksResult.status === 'rejected') console.warn(`[prerender] Public listed-books endpoint unavailable; using the existing public fallback: ${booksResult.reason.message}`);
  return { profile, books, source };
}

function escapeHtml(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function replaceTag(html, pattern, markup) {
  let replacements = 0;
  const updated = html.replace(pattern, () => {
    replacements += 1;
    return replacements === 1 ? markup : '';
  });
  return replacements ? updated : updated.replace('</head>', `  ${markup}\n</head>`);
}

function metaMarkup(attribute, name, content) {
  return `<meta ${attribute}="${escapeHtml(name)}" content="${escapeHtml(content)}" />`;
}

function cleanHead(html, pageSEO) {
  let output = html;
  output = replaceTag(output, /<title\b[^>]*>[\s\S]*?<\/title>/gi, `<title>${escapeHtml(pageSEO.title)}</title>`);
  const entries = [
    ['name', 'description', pageSEO.description],
    ['name', 'robots', pageSEO.robots],
    ['property', 'og:title', pageSEO.title],
    ['property', 'og:description', pageSEO.description],
    ['property', 'og:type', pageSEO.ogType || 'website'],
    ['property', 'og:site_name', 'OkzByte'],
    ['property', 'og:image', pageSEO.image || DEFAULT_SOCIAL_IMAGE],
    ['property', 'og:image:alt', pageSEO.h1 || 'OkzByte — Engineering Intelligence'],
    ['property', 'og:url', pageSEO.canonical],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', pageSEO.title],
    ['name', 'twitter:description', pageSEO.description],
    ['name', 'twitter:image', pageSEO.image || DEFAULT_SOCIAL_IMAGE],
  ];
  for (const [attribute, name, content] of entries) {
    const pattern = new RegExp(`<meta\\s+${attribute}=["']${name.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}["'][^>]*\\/?\\s*>`, 'gi');
    if (content == null) {
      output = output.replace(pattern, '');
    } else {
      output = replaceTag(output, pattern, metaMarkup(attribute, name, content));
    }
  }
  const canonicalPattern = /<link\s+rel=["']canonical["'][^>]*\/?\s*>/gi;
  if (pageSEO.canonical) output = replaceTag(output, canonicalPattern, `<link rel="canonical" href="${escapeHtml(pageSEO.canonical)}" />`);
  else output = output.replace(canonicalPattern, '');
  return output;
}

function safeJsonForScript(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function addJsonLd(html, pathname, pageSEO, data) {
  const schemas = getStructuredData(pathname, pageSEO, {
    researchArticle: data?.researchArticle,
    researchProfile: data?.researchProfile,
  });
  const markup = schemas.map(({ id, data: schema }) =>
    `<script id="${escapeHtml(id)}" type="application/ld+json">${safeJsonForScript(schema)}</script>`
  ).join('\n');
  return html.replace('</head>', `${markup}\n</head>`);
}

function renderDataForPath(pathname, research, profile, articlesBySlug) {
  if (pathname === '/research') return { researchIndex: research.index };
  if (pathname === '/research/profile') return { researchProfile: profile.profile, researchBooks: profile.books };
  if (pathname.startsWith('/research/')) {
    const slug = pathname.slice('/research/'.length);
    const article = articlesBySlug.get(slug);
    if (article) return { researchArticle: { ...article, related: [], sources: Array.isArray(article.sources) ? article.sources : [] } };
  }
  return null;
}

async function renderReact(App, initialPath, initialData) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let settled = false;
    let renderErrors = [];
    let abortRender;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        abortRender?.();
        reject(new Error(`React SSR timed out for ${initialPath}`));
      }
    }, 30000);
    const finish = (error, html) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) reject(error);
      else if (renderErrors.length) reject(new AggregateError(renderErrors, `React SSR reported errors for ${initialPath}`));
      else resolve(html);
    };
    const stream = renderToPipeableStream(React.createElement(App, { initialPath, initialData }), {
      onAllReady() {
        const output = new PassThrough();
        output.on('data', chunk => chunks.push(chunk));
        output.on('error', error => finish(error));
        output.on('end', () => finish(null, Buffer.concat(chunks).toString('utf8')));
        stream.pipe(output);
      },
      onShellError(error) { finish(error); },
      onError(error) { renderErrors.push(error); },
    });
    abortRender = () => stream.abort();
  });
}

function escapeXml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function makeSitemap(paths) {
  const urls = paths.map(path => `  <url><loc>${escapeXml(`${SITE_ORIGIN}${path === '/' ? '/' : path}`)}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function routeHtml(template, markup, pathname, data) {
  const pageSEO = getPageSEO(pathname, { researchArticle: data?.researchArticle });
  if (!pageSEO.exists || !pageSEO.indexable || !pageSEO.canonical) throw new Error(`Refusing to prerender non-public or unknown route: ${pathname}`);
  let html = cleanHead(template, pageSEO);
  html = addJsonLd(html, pathname, pageSEO, data);
  const payload = escapeHtml(safeJsonForScript({ path: pathname, data }));
  const rootMarkup = `<div id="root" data-prerender='${payload}'>${markup}</div>`;
  if (!html.includes('<div id="root"></div>')) throw new Error('Vite HTML template is missing the expected empty #root mount');
  return html.replace('<div id="root"></div>', rootMarkup);
}

function makePrivateAppShell(template) {
  let html = template;
  html = html.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '<title>OkzByte Private Application</title>');
  html = html.replace(/<meta\s+(?:property|name)=["'](?:og:[^"']+|twitter:[^"']+|description)["'][^>]*\/?\s*>/gi, '');
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*\/?\s*>/gi, '');
  html = html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][\s\S]*?<\/script>/gi, '');
  html = html.replace('</head>', '  <meta name="robots" content="noindex,follow" />\n</head>');
  if (!html.includes('<div id="root"></div>')) throw new Error('Private shell template does not have an empty #root mount');
  return html;
}

const baseHtml = await readFile(join(DIST, 'index.html'), 'utf8');
const [research, profile] = await Promise.all([getPublicResearch(), getPublicProfile()]);
const articlesBySlug = new Map(research.articles.map(article => [article.slug, article]));
const staticPaths = [...new Set([...SITEMAP_PATHS, '/terms'])];
const articlePaths = [...articlesBySlug.keys()].map(slug => `/research/${slug}`);
const allPaths = [...new Set([...staticPaths, ...articlePaths])];

if (allPaths.some(path => isPrivateRoute(path))) throw new Error('Private paths must never enter the prerender route set');
if (articlesBySlug.size !== articlePaths.length) throw new Error('Research article route list contains duplicate slugs');

const vite = await createServer({
  root: ROOT,
  configFile: false,
  appType: 'custom',
  server: { middlewareMode: true, hmr: false },
});

try {
  const { default: App } = await vite.ssrLoadModule('/src/main.jsx');
  if (typeof App !== 'function') throw new Error('src/main.jsx did not export the React App component');

  await writeFile(join(DIST, 'app-shell.html'), makePrivateAppShell(baseHtml));
  for (const pathname of allPaths) {
    const data = renderDataForPath(pathname, research, profile, articlesBySlug);
    const markup = await renderReact(App, pathname, data);
    const html = routeHtml(baseHtml, markup, pathname, data);
    const target = pathname === '/' ? join(DIST, 'index.html') : join(DIST, pathname.replace(/^\/+/, ''), 'index.html');
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, html);
  }

  const sitemapPaths = [...new Set([...SITEMAP_PATHS, ...articlePaths])];
  await writeFile(join(DIST, 'sitemap.xml'), makeSitemap(sitemapPaths));
  console.log(`[prerender] rendered ${allPaths.length} public routes (${SITEMAP_PATHS.length} sitemap routes, ${articlePaths.length} published research routes)`);
  console.log(`[prerender] research data source: ${research.source}; profile/books: ${profile.source}; canonical origin: ${SITE_ORIGIN}`);
} finally {
  await vite.close();
}
