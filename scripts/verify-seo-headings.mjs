import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { getPageSEO, SITEMAP_PATHS } from '../src/seo.js';

const server = await createServer({ root: process.cwd(), configFile: false, server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const normalize = text => text
  .replace(/<br\s*\/?\s*>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/[.!?]+/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

try {
  const EnterprisePage = (await server.ssrLoadModule('/src/EnterprisePage.jsx')).default;
  const SecurityCenterPage = (await server.ssrLoadModule('/src/SecurityCenterPage.jsx')).default;
  const paths = [
    '/enterprise', ...SITEMAP_PATHS.filter(path => path.startsWith('/enterprise/')),
    '/enterprise/case-studies', '/security', ...SITEMAP_PATHS.filter(path => path.startsWith('/security/')),
    '/security/admin',
  ];
  for (const path of paths) {
    const component = path.startsWith('/enterprise')
      ? React.createElement(EnterprisePage, { path })
      : React.createElement(SecurityCenterPage, { path });
    const html = renderToStaticMarkup(component);
    const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
    assert.equal(headings.length, 1, `${path}: expected exactly one H1, got ${headings.length}`);
    const actual = normalize(headings[0][1]);
    const expected = normalize(getPageSEO(path).h1);
    assert.equal(actual, expected, `${path}: route metadata H1 does not match the rendered heading`);
  }
  console.log(`Rendered H1 checks passed for ${paths.length} enterprise/security routes.`);
} finally {
  await server.close();
}
