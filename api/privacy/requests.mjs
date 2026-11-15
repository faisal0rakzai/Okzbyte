import crypto from 'node:crypto';

const allowedTypes = new Set(['Access', 'Correction', 'Deletion', 'Data Portability', 'Withdraw Consent', 'Other Privacy Concern']);
const rateWindowMs = 60 * 60 * 1000;
const maxRequests = 3;
const attempts = globalThis.__okzbytePrivacyRequestAttempts || (globalThis.__okzbytePrivacyRequestAttempts = new Map());
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

function clean(value) { return String(value ?? '').replace(/[<>]/g, '').trim(); }
function validEmail(value) { return value.length <= 254 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value); }

function rateLimited(key) {
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter(time => now - time < rateWindowMs);
  if (recent.length >= maxRequests) return true;
  recent.push(now);
  attempts.set(key, recent);
  if (attempts.size > 10000) {
    for (const [candidate, times] of attempts) {
      if (!times.some(time => now - time < rateWindowMs)) attempts.delete(candidate);
      if (attempts.size <= 8000) break;
    }
  }
  return false;
}

async function getPool() {
  if (!process.env.DATABASE_URL) throw Object.assign(new Error('database_not_configured'), { code: 'DATABASE_NOT_CONFIGURED' });
  if (!pool) {
    const { Pool } = await import('pg');
    pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2, idleTimeoutMillis: 10000, connectionTimeoutMillis: 5000 });
  }
  return pool;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return respond(res, 405, { ok: false, error: 'method_not_allowed' });
  const origin = req.headers.origin;
  const requestHost = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim().toLowerCase();
  if (origin) {
    try { if (new URL(origin).host.toLowerCase() !== requestHost) return respond(res, 403, { ok: false, error: 'origin_not_allowed' }); }
    catch { return respond(res, 403, { ok: false, error: 'origin_not_allowed' }); }
  }
  const forwarded = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const networkKey = crypto.createHash('sha256').update(forwarded).digest('hex');
  if (rateLimited(networkKey)) return respond(res, 429, { ok: false, error: 'rate_limited', message: 'Please try again later.' });
  let input;
  try {
    input = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    if (Buffer.byteLength(JSON.stringify(input)) > 100000) return respond(res, 413, { ok: false, error: 'payload_too_large' });
  } catch { return respond(res, 400, { ok: false, error: 'invalid_json' }); }
  const fullName = clean(input.fullName), email = clean(input.email).toLowerCase(), requestType = clean(input.requestType), description = clean(input.description), supportingInfo = clean(input.supportingInfo);
  if (fullName.length < 2 || fullName.length > 120 || !validEmail(email) || !allowedTypes.has(requestType) || description.length < 10 || description.length > 4000 || supportingInfo.length > 2000 || input.consent !== true) return respond(res, 422, { ok: false, error: 'validation_failed' });
  const reference = `PRV-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  try {
    const database = await getPool();
    await database.query('INSERT INTO privacy_requests (reference_code,full_name,email,request_type,description,supporting_info) VALUES ($1,$2,$3,$4,$5,$6)', [reference, fullName, email, requestType, description, supportingInfo]);
    return respond(res, 201, { ok: true, reference });
  } catch (error) {
    if (error.code === 'DATABASE_NOT_CONFIGURED') return respond(res, 503, { ok: false, error: 'privacy_database_not_configured', message: 'Privacy request storage is not configured. Please email hello@okzbyte.com.' });
    if (error.code === '42P01') return respond(res, 503, { ok: false, error: 'privacy_schema_not_ready', message: 'Privacy request storage is not configured yet. Please email hello@okzbyte.com.' });
    console.error('privacy_request_failed', error.code || 'unknown');
    return respond(res, 500, { ok: false, error: 'privacy_request_storage_failed', message: 'The request could not be stored. Please email hello@okzbyte.com.' });
  }
}
