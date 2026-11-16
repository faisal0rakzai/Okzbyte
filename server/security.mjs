import crypto from 'node:crypto';

const categories = new Set(['Authentication', 'Authorization', 'API Security', 'Web Application', 'Infrastructure', 'Smart Contracts', 'Data Exposure', 'Other']);
const severities = new Set(['Critical', 'High', 'Medium', 'Low', 'Informational']);
const attempts = globalThis.__okzbyteSecurityReportAttempts || (globalThis.__okzbyteSecurityReportAttempts = new Map());
let pool;

function respond(res, status, payload) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.setHeader('x-content-type-options', 'nosniff');
  res.setHeader('x-frame-options', 'DENY');
  res.setHeader('referrer-policy', 'strict-origin-when-cross-origin');
  res.end(JSON.stringify(payload));
}
function clean(value, max = 6000) { return String(value ?? '').replace(/[<>]/g, '').trim().slice(0, max); }
function validEmail(value) { return value.length <= 254 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value); }
function rateLimited(key) {
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter(time => now - time < 60 * 60 * 1000);
  if (recent.length >= 3) return true;
  recent.push(now); attempts.set(key, recent);
  if (attempts.size > 10000) for (const [candidate, times] of attempts) if (!times.some(time => now - time < 60 * 60 * 1000)) attempts.delete(candidate);
  return false;
}
async function getPool() {
  if (!process.env.DATABASE_URL) throw Object.assign(new Error('database_not_configured'), { code: 'DATABASE_NOT_CONFIGURED' });
  if (!pool) { const { Pool } = await import('pg'); pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2, idleTimeoutMillis: 10000, connectionTimeoutMillis: 5000 }); }
  return pool;
}
export async function handleVulnerabilityReport(req, res) {
  if (req.method !== 'POST') return respond(res, 405, { ok: false, error: 'method_not_allowed' });
  const origin = req.headers.origin;
  const requestHost = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim().toLowerCase();
  if (origin) { try { if (new URL(origin).host.toLowerCase() !== requestHost) return respond(res, 403, { ok: false, error: 'origin_not_allowed' }); } catch { return respond(res, 403, { ok: false, error: 'origin_not_allowed' }); } }
  const forwarded = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const key = crypto.createHash('sha256').update(forwarded).digest('hex');
  if (rateLimited(key)) return respond(res, 429, { ok: false, error: 'rate_limited', message: 'Please try again later.' });
  let input;
  try { input = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {}); if (Buffer.byteLength(JSON.stringify(input)) > 100000) return respond(res, 413, { ok: false, error: 'payload_too_large' }); } catch { return respond(res, 400, { ok: false, error: 'invalid_json' }); }
  const fullName = clean(input.fullName, 120), email = clean(input.email, 254).toLowerCase(), category = clean(input.category, 80), affectedComponent = clean(input.affectedComponent, 500), severity = clean(input.severity, 40), description = clean(input.description, 6000), reproduction = clean(input.reproduction, 6000), impact = clean(input.impact, 4000), references = clean(input.references, 2000);
  if (fullName.length < 2 || !validEmail(email) || !categories.has(category) || !severities.has(severity) || affectedComponent.length < 2 || description.length < 20 || reproduction.length < 10 || impact.length < 10) return respond(res, 422, { ok: false, error: 'validation_failed' });
  const reference = `VUL-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  try {
    const database = await getPool();
    await database.query('INSERT INTO security_vulnerability_reports (reference_code,full_name,email,category,affected_component,severity,description,reproduction_steps,potential_impact,supporting_references) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [reference, fullName, email, category, affectedComponent, severity, description, reproduction, impact, references]);
    return respond(res, 201, { ok: true, reference });
  } catch (error) {
    if (error.code === 'DATABASE_NOT_CONFIGURED') return respond(res, 503, { ok: false, error: 'security_database_not_configured', message: 'Private report storage is not configured. Please email security@okzbyte.com.' });
    if (error.code === '42P01') return respond(res, 503, { ok: false, error: 'security_schema_not_ready', message: 'Private report storage is not configured yet. Please email security@okzbyte.com.' });
    console.error('security_report_failed', error.code || 'unknown'); return respond(res, 500, { ok: false, error: 'storage_failed' });
  }
}
