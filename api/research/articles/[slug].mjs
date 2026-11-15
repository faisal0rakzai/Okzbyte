import { getPublishedArticle } from '../../../server/research-rest.mjs';

function json(res, status, data) {
  if (typeof res.status === 'function' && typeof res.json === 'function') return res.status(status).json(data);
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  return res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { ok: false, error: 'method_not_allowed' });
  const slug = String(req.query?.slug || '').trim();
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,159}$/.test(slug)) return json(res, 404, { ok: false, error: 'not_found' });
  try {
    const result = await getPublishedArticle(slug);
    return result ? json(res, 200, { ok: true, ...result }) : json(res, 404, { ok: false, error: 'not_found' });
  } catch {
    return json(res, 503, { ok: false, error: 'research_storage_unavailable', message: 'Research content could not be loaded. Please try again.' });
  }
}
