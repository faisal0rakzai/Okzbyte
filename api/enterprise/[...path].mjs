import { handleConsultation, handleProjectRequest } from '../../../server/enterprise.mjs';

export default async function handler(req, res) {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (path.endsWith('/project-requests')) return handleProjectRequest(req, res);
  if (path.endsWith('/consultations')) return handleConsultation(req, res);
  res.statusCode = 404;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  return res.end(JSON.stringify({ ok: false, error: 'not_found' }));
}
