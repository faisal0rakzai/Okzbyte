import http from 'node:http';
import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { handleSupport } from './support.mjs';
import { fileURLToPath } from 'node:url';
import { handleResearchAdmin } from './research-admin.mjs';
import { handleVulnerabilityReport } from './security.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = Number(process.env.PORT || 3000);
const limits = new Map();
const sessions = new Map();
const SESSION_TTL = 8 * 60 * 60 * 1000;
const categories = new Set(['AI & Automation', 'Blockchain & Web3', 'Fintech & Digital Finance', 'RWA & PropTech', 'Software Development', 'Strategic Collaboration', 'General Inquiry']);
const researchAreas = new Set(['Artificial Intelligence', 'Blockchain & Web3', 'Fintech & Digital Finance', 'Real-World Assets', 'Cloud & Digital Infrastructure', 'Cybersecurity', 'Emerging Technologies', 'Scientific & Technical Papers']);
const submissionTypes = new Set(['Collaboration inquiry', 'Technical paper proposal', 'Research contribution', 'Expert commentary']);
const privacyRequestTypes = new Set(['Access', 'Correction', 'Deletion', 'Data Portability', 'Withdraw Consent', 'Other Privacy Concern']);
const careerInterestAreas = new Set(['AI & Machine Learning', 'Blockchain Development', 'Web Development', 'Software Engineering', 'Research & Technical Writing', 'UI/UX Design', 'Business & Operations', 'Artificial Intelligence & Machine Learning', 'Blockchain & Web3', 'Frontend & Backend Development', 'Cybersecurity', 'Cloud & DevOps', 'Data Science & Research', 'Product & UI/UX Design', 'Business Development', 'Marketing & Communications', 'Operations & Administration', 'Internships & Graduate Programs']);
const json = (res, status, data) => { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }); res.end(JSON.stringify(data)); };
const security = res => {
  res.setHeader('x-content-type-options', 'nosniff');
  res.setHeader('x-frame-options', 'DENY');
  res.setHeader('referrer-policy', 'strict-origin-when-cross-origin');
  res.setHeader('content-security-policy', "default-src 'self'; img-src 'self' data: https://images.unsplash.com https://zenodo.org; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'");
};
const body = req => new Promise((resolve, reject) => {
  let data = '';
  req.on('data', chunk => { data += chunk; if (data.length > 100_000) reject(new Error('payload_too_large')); });
  req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch { reject(new Error('invalid_json')); } });
  req.on('error', reject);
});
const clean = value => String(value ?? '').replace(/[<>]/g, '').trim();
const validEmail = value => value.length <= 254 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
const clientKey = req => (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0];
const cookies = req => Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map(item => { const [key, ...value] = item.trim().split('='); return [key, decodeURIComponent(value.join('='))]; }));
const sessionFor = req => { const token = cookies(req).okz_session; const session = token && sessions.get(token); if (!session || session.expires < Date.now()) { if (token) sessions.delete(token); return null; } return session; };
const verifyPassword = (password, encoded) => {
  const [scheme, n, r, p, saltHex, hashHex] = String(encoded || '').split('$');
  if (scheme !== 'scrypt' || !n || !r || !p || !saltHex || !hashHex) return false;
  try { const derived = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), Buffer.from(hashHex, 'hex').length, { N: Number(n), r: Number(r), p: Number(p), maxmem: 64 * 1024 * 1024 }); return crypto.timingSafeEqual(derived, Buffer.from(hashHex, 'hex')); } catch { return false; }
};
async function withDatabase(fn) {
  if (!process.env.DATABASE_URL) throw Object.assign(new Error('database_not_configured'), { code: 'DATABASE_NOT_CONFIGURED' });
  const { Client } = await import('pg');
  const db = new Client({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined });
  await db.connect();
  try { return await fn(db); } finally { await db.end(); }
}
async function supabaseRequest(path, options = {}) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw Object.assign(new Error('supabase_not_configured'), { code: 'SUPABASE_NOT_CONFIGURED' });
  const response = await fetch(`${process.env.SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${path}`, { ...options, headers: { apikey: process.env.SUPABASE_SECRET_KEY, authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`, 'content-type': 'application/json', prefer: 'return=representation', ...(options.headers || {}) } });
  const text = await response.text();
  let data; try { data = JSON.parse(text || '{}'); } catch { data = { message: text }; }
  if (!response.ok) throw Object.assign(new Error(data.message || data.hint || 'supabase_request_failed'), { code: `SUPABASE_${response.status}`, status: response.status });
  return data;
}
async function sendCareerNotification(subject, text) {
  if (!process.env.RESEND_API_KEY || !process.env.CAREERS_NOTIFICATION_EMAIL || !process.env.RESEND_FROM_EMAIL) return false;
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json' }, body: JSON.stringify({ from: process.env.RESEND_FROM_EMAIL, to: [process.env.CAREERS_NOTIFICATION_EMAIL], subject, text }) });
  if (!response.ok) { console.error('career_notification_failed', response.status); return false; }
  return true;
}
async function careerTalent(req, res) {
  if (!rateLimit(req, res, 'career-talent', 3)) return;
  let input; try { input = await body(req); } catch (error) { return json(res, 400, { ok: false, error: error.message }); }
  const fullName = clean(input.fullName), email = clean(input.email).toLowerCase(), area = clean(input.areaOfInterest), portfolio = clean(input.portfolioUrl), note = clean(input.note);
  if (fullName.length < 2 || fullName.length > 120 || !validEmail(email) || !careerInterestAreas.has(area) || note.length < 20 || note.length > 3000 || portfolio && (!/^https:\/\//i.test(portfolio) || portfolio.length > 2048) || input.consent !== true) return json(res, 422, { ok: false, error: 'validation_failed' });
  try {
    const rows = await supabaseRequest('career_talent_network', { method: 'POST', body: JSON.stringify({ full_name: fullName, email, area_of_interest: area, portfolio_url: portfolio || null, note, consent_at: new Date().toISOString() }) });
    const id = Array.isArray(rows) && rows[0]?.id;
    await sendCareerNotification(`New OkzByte talent-network interest: ${fullName}`, `Name: ${fullName}\nEmail: ${email}\nArea: ${area}\nPortfolio: ${portfolio || 'Not provided'}\n\n${note}\n\nRecord: ${id || 'created'}`);
    return json(res, 201, { ok: true, reference: id ? String(id).slice(0, 8).toUpperCase() : null, emailConfigured: Boolean(process.env.RESEND_API_KEY && process.env.CAREERS_NOTIFICATION_EMAIL && process.env.RESEND_FROM_EMAIL) });
  } catch (error) {
    if (error.code === 'SUPABASE_NOT_CONFIGURED') return json(res, 503, { ok: false, error: 'careers_backend_not_configured' });
    if (error.code === 'SUPABASE_404') return json(res, 503, { ok: false, error: 'careers_schema_not_ready', message: 'Apply db/migrations/003_careers_platform.sql in Supabase before accepting talent registrations.' });
    console.error('career_talent_failed', error.code); return json(res, 500, { ok: false, error: 'storage_failed' });
  }
}
async function adminLogin(req, res) {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) return json(res, 503, { ok: false, error: 'admin_not_configured' });
  let input; try { input = await body(req); } catch (error) { return json(res, 400, { ok: false, error: error.message }); }
  const email = clean(input.email).toLowerCase(), password = String(input.password || '');
  if (email !== process.env.ADMIN_EMAIL.toLowerCase() || !verifyPassword(password, process.env.ADMIN_PASSWORD_HASH)) return json(res, 401, { ok: false, error: 'invalid_credentials' });
  const token = crypto.randomBytes(32).toString('base64url'); sessions.set(token, { email, expires: Date.now() + SESSION_TTL });
  res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'set-cookie': `okz_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL / 1000}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}` });
  return res.end(JSON.stringify({ ok: true, email }));
}
function adminLogout(req, res) {
  const token = cookies(req).okz_session; if (token) sessions.delete(token);
  res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'set-cookie': 'okz_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0' }); res.end(JSON.stringify({ ok: true }));
}
async function contact(req, res) {
  const key = clientKey(req), now = Date.now(), recent = limits.get(key) || [], active = recent.filter(time => now - time < 3_600_000);
  if (active.length >= 5) return json(res, 429, { ok: false, error: 'rate_limited' });
  let input; try { input = await body(req); } catch (error) { return json(res, 400, { ok: false, error: error.message }); }
  const name = clean(input.name), email = clean(input.email).toLowerCase(), organization = clean(input.organization), category = clean(input.category), message = clean(input.message);
  if (name.length < 2 || name.length > 120 || !validEmail(email) || !categories.has(category) || message.length < 10 || message.length > 5000 || input.consent !== true) return json(res, 422, { ok: false, error: 'validation_failed' });
  active.push(now); limits.set(key, active);
  try {
    await withDatabase(db => db.query('INSERT INTO contact_inquiries (name,email,organization,category,message,client_fingerprint) VALUES ($1,$2,$3,$4,$5,$6)', [name, email, organization || null, category, message, crypto.createHash('sha256').update(key).digest('hex')]));
    return json(res, 201, { ok: true });
  } catch (error) { if (error.code === 'DATABASE_NOT_CONFIGURED') return json(res, 503, { ok: false, error: 'contact_backend_not_configured', message: 'DATABASE_URL is required before inquiries can be stored.' }); console.error('contact_insert_failed', error); return json(res, 500, { ok: false, error: 'storage_failed' }); }
}
async function privacyRequest(req, res) {
  const origin = req.headers.origin;
  const requestHost = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim().toLowerCase();
  if (origin) {
    try { if (new URL(origin).host.toLowerCase() !== requestHost) return json(res, 403, { ok: false, error: 'origin_not_allowed' }); }
    catch { return json(res, 403, { ok: false, error: 'origin_not_allowed' }); }
  }
  if (!rateLimit(req, res, 'privacy-request', 3)) return;
  let input; try { input = await body(req); } catch (error) { return json(res, 400, { ok: false, error: error.message }); }
  const fullName = clean(input.fullName), email = clean(input.email).toLowerCase(), requestType = clean(input.requestType), description = clean(input.description), supportingInfo = clean(input.supportingInfo);
  if (fullName.length < 2 || fullName.length > 120 || !validEmail(email) || !privacyRequestTypes.has(requestType) || description.length < 10 || description.length > 4000 || supportingInfo.length > 2000 || input.consent !== true) return json(res, 422, { ok: false, error: 'validation_failed' });
  const reference = `PRV-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
  try {
    await withDatabase(db => db.query('INSERT INTO privacy_requests (reference_code,full_name,email,request_type,description,supporting_info) VALUES ($1,$2,$3,$4,$5,$6)', [reference, fullName, email, requestType, description, supportingInfo]));
    return json(res, 201, { ok: true, reference });
  } catch (error) {
    if (error.code === 'DATABASE_NOT_CONFIGURED') return json(res, 503, { ok: false, error: 'privacy_database_not_configured', message: 'Privacy request storage is not configured. Please email hello@okzbyte.com.' });
    if (error.code === '42P01') return json(res, 503, { ok: false, error: 'privacy_schema_not_ready', message: 'Privacy request storage is not configured yet. Please email hello@okzbyte.com.' });
    console.error('privacy_request_failed', error.code || 'unknown');
    return json(res, 500, { ok: false, error: 'privacy_request_storage_failed', message: 'The request could not be stored. Please email hello@okzbyte.com.' });
  }
}
function researchWindow(req) {
  const url = new URL(req.url, 'http://localhost');
  const values = [];
  let where = "status = 'published'";
  const bind = value => { values.push(value); return `$${values.length}`; };
  const search = clean(url.searchParams.get('q')).slice(0, 160);
  if (search) { const term = bind(`%${search}%`); where += ` AND (title ILIKE ${term} OR COALESCE(subtitle,'') ILIKE ${term} OR COALESCE(abstract,'') ILIKE ${term} OR excerpt ILIKE ${term} OR content ILIKE ${term} OR COALESCE(author,'') ILIKE ${term} OR array_to_string(keywords, ' ') ILIKE ${term})`; }
  const category = clean(url.searchParams.get('category')).slice(0, 100);
  if (category) where += ` AND category = ${bind(category)}`;
  const type = clean(url.searchParams.get('contentType')).slice(0, 80);
  if (type) where += ` AND content_type = ${bind(type)}`;
  const platform = clean(url.searchParams.get('platform')).toUpperCase();
  if (platform && !['ZENODO','RESEARCHGATE','ORCID','OFFICIAL RESEARCH ARCHIVE','OTHER VERIFIED REPOSITORY'].includes(platform)) throw Object.assign(new Error('invalid_platform'), { code:'INVALID_PLATFORM' });
  if (platform) where += ` AND EXISTS (SELECT 1 FROM research_article_sources src WHERE src.article_id=research_articles.id AND src.platform=${bind(platform)} AND src.verified=TRUE)`;
  const year = clean(url.searchParams.get('year'));
  if (/^\d{4}$/.test(year)) where += ` AND EXTRACT(YEAR FROM published_at)::int = ${bind(Number(year))}`;
  const author = clean(url.searchParams.get('author')).slice(0, 120);
  if (author) where += ` AND author = ${bind(author)}`;
  const page = Math.max(1, Math.min(1000, Number.parseInt(url.searchParams.get('page') || '1', 10) || 1));
  const pageSize = Math.max(1, Math.min(48, Number.parseInt(url.searchParams.get('limit') || '12', 10) || 12));
  const sort = url.searchParams.get('sort');
  const order = sort === 'oldest' ? 'published_at ASC NULLS LAST, title ASC' : sort === 'alphabetical' ? 'LOWER(title) ASC, published_at DESC NULLS LAST' : 'published_at DESC NULLS LAST, title ASC';
  return { where, values, page, pageSize, order };
}
async function researchList(req, res) {
  let filter;
  try { filter = researchWindow(req); }
  catch(error) { return json(res,400,{ok:false,error:error.code==='INVALID_PLATFORM'?'invalid_platform':'invalid_filter'}); }
  try {
    const result = await withDatabase(async db => {
      const count = await db.query(`SELECT COUNT(*)::int AS total FROM research_articles WHERE ${filter.where}`, filter.values);
      const offset = (filter.page - 1) * filter.pageSize, limitPosition = filter.values.length + 1, offsetPosition = filter.values.length + 2;
      const rows = await db.query(`SELECT slug,title,subtitle,author,excerpt,abstract,cover_image_url,published_at,updated_at,category,content_type,keywords,doi,external_url,CASE WHEN pdf_permission_confirmed=TRUE THEN pdf_url ELSE NULL END AS pdf_url,seo_title,seo_description,COALESCE((SELECT json_agg(json_build_object('platform',src.platform,'source_url',src.source_url,'record_identifier',src.record_identifier,'source_title',src.source_title,'is_primary',src.is_primary) ORDER BY src.is_primary DESC,src.platform) FROM research_article_sources src WHERE src.article_id=research_articles.id AND src.verified=TRUE),'[]'::json) AS sources FROM research_articles WHERE ${filter.where} ORDER BY ${filter.order} LIMIT $${limitPosition} OFFSET $${offsetPosition}`, [...filter.values, filter.pageSize, offset]);
      const [categoryCounts, authors, years, featured] = await Promise.all([
        db.query("SELECT category, COUNT(*)::int AS count FROM research_articles WHERE status='published' AND category IS NOT NULL GROUP BY category"),
        db.query("SELECT DISTINCT author FROM research_articles WHERE status='published' AND author IS NOT NULL AND author <> '' ORDER BY author LIMIT 300"),
        db.query("SELECT DISTINCT EXTRACT(YEAR FROM published_at)::int AS year FROM research_articles WHERE status='published' AND published_at IS NOT NULL ORDER BY year DESC LIMIT 30"),
        db.query("SELECT slug,title,subtitle,author,excerpt,abstract,cover_image_url,published_at,updated_at,category,content_type,keywords,doi,external_url,CASE WHEN pdf_permission_confirmed=TRUE THEN pdf_url ELSE NULL END AS pdf_url,seo_title,seo_description FROM research_articles WHERE status='published' AND is_featured=TRUE LIMIT 1"),
      ]);
      return { rows: rows.rows, total: count.rows[0].total, featured: featured.rows[0] || null, categoryCounts: Object.fromEntries(categoryCounts.rows.map(row => [row.category, row.count])), facets: { authors: authors.rows.map(row => row.author), years: years.rows.map(row => row.year) } };
    });
    return json(res, 200, { ok: true, items: result.rows, total: result.total, page: filter.page, pageSize: filter.pageSize, categoryCounts: result.categoryCounts, facets: result.facets, featured: result.featured });
  } catch (error) {
    if (error.code === 'INVALID_PLATFORM') return json(res, 400, { ok:false, error:'invalid_platform' });
    if (error.code === 'DATABASE_NOT_CONFIGURED') return json(res, 503, { ok: false, error: 'research_database_not_configured', message: 'The research CMS database is not connected.' });
    if (error.code === '42P01' || error.code === '42703') return json(res, 503, { ok: false, error: 'research_schema_not_ready', message: 'The research platform database migration must be applied before the published library is available.' });
    console.error('research_list_failed', error); return json(res, 500, { ok: false, error: 'research_query_failed' });
  }
}
async function researchArticle(slug, res) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,159}$/.test(slug)) return json(res, 404, { ok: false, error: 'not_found' });
  try {
    const article = await withDatabase(async db => {
      const result = await db.query("SELECT id,slug,title,subtitle,author,excerpt,abstract,content,cover_image_url,cover_alt,cover_caption,published_at,updated_at,category,content_type,keywords,doi,external_url,CASE WHEN pdf_permission_confirmed=TRUE THEN pdf_url ELSE NULL END AS pdf_url,references_json,seo_title,seo_description FROM research_articles WHERE slug=$1 AND status='published' LIMIT 1", [slug]);
      if (!result.rows[0]) return null;
      const article = result.rows[0];
      const [related,sources] = await Promise.all([
        db.query("SELECT slug,title,subtitle,author,excerpt,abstract,cover_image_url,published_at,updated_at,category,content_type,keywords,doi,external_url,CASE WHEN pdf_permission_confirmed=TRUE THEN pdf_url ELSE NULL END AS pdf_url FROM research_articles WHERE status='published' AND slug<>$1 AND category IS NOT DISTINCT FROM $2 ORDER BY published_at DESC NULLS LAST LIMIT 3", [slug, article.category]),
        db.query('SELECT platform,source_url,record_identifier,source_title,is_primary FROM research_article_sources WHERE article_id=$1 AND verified=TRUE ORDER BY is_primary DESC,platform', [article.id]),
      ]);
      return { article, related: related.rows, sources:sources.rows };
    });
    if (!article) return json(res, 404, { ok: false, error: 'not_found' });
    return json(res, 200, { ok: true, article: article.article, related: article.related, sources:article.sources });
  } catch (error) {
    if (error.code === 'DATABASE_NOT_CONFIGURED') return json(res, 503, { ok: false, error: 'research_database_not_configured', message: 'The research CMS database is not connected.' });
    if (error.code === '42P01' || error.code === '42703') return json(res, 503, { ok: false, error: 'research_schema_not_ready', message: 'The research platform database migration must be applied first.' });
    console.error('research_article_failed', error); return json(res, 500, { ok: false, error: 'research_query_failed' });
  }
}
async function researchPublicProfile(res) {
  try {
    const result = await withDatabase(db => db.query("SELECT name,biography,research_interests,orcid,external_profile_url,researchgate_url,zenodo_url,google_scholar_url,linkedin_url,official_research_url FROM research_authors WHERE profile_verified=TRUE AND orcid='0009-0000-0915-7272' LIMIT 1"));
    if (!result.rows[0]) return json(res,404,{ok:false,error:'profile_not_found'});
    return json(res,200,{ok:true,profile:result.rows[0]});
  } catch(error) {
    if(error.code==='DATABASE_NOT_CONFIGURED') return json(res,503,{ok:false,error:'research_database_not_configured'});
    if(error.code==='42P01'||error.code==='42703') return json(res,503,{ok:false,error:'research_schema_not_ready'});
    console.error('research_profile_failed',error);return json(res,500,{ok:false,error:'research_query_failed'});
  }
}
async function researchPublicBooks(res) {
  try {
    const result=await withDatabase(db=>db.query("SELECT id,title,subtitle,description,official_url,source_url,isbn FROM research_books WHERE status='listed' ORDER BY title"));
    return json(res,200,{ok:true,items:result.rows});
  } catch(error) {
    if(error.code==='DATABASE_NOT_CONFIGURED') return json(res,503,{ok:false,error:'research_database_not_configured'});
    if(error.code==='42P01'||error.code==='42703') return json(res,503,{ok:false,error:'research_schema_not_ready'});
    console.error('research_books_failed',error);return json(res,500,{ok:false,error:'research_query_failed'});
  }
}
function rateLimit(req, res, bucket, maximum = 3) {
  const key = `${bucket}:${clientKey(req)}`, now = Date.now(), active = (limits.get(key) || []).filter(time => now - time < 3_600_000);
  if (active.length >= maximum) { json(res, 429, { ok: false, error: 'rate_limited', message: 'Please try again later.' }); return false; }
  active.push(now); limits.set(key, active); return true;
}
async function researchSubmission(req, res) {
  if (!rateLimit(req, res, 'research-submission')) return;
  let input; try { input = await body(req); } catch (error) { return json(res, 400, { ok: false, error: error.message }); }
  const name = clean(input.name), email = clean(input.email).toLowerCase(), organization = clean(input.organization), area = clean(input.researchArea), type = clean(input.submissionType), proposal = clean(input.proposal), url = clean(input.externalUrl);
  if (name.length < 2 || name.length > 120 || !validEmail(email) || organization.length > 180 || !researchAreas.has(area) || !submissionTypes.has(type) || proposal.length < 30 || proposal.length > 6000 || input.consent !== 'true' && input.consent !== true || url && (!/^https:\/\//i.test(url) || url.length > 2048)) return json(res, 422, { ok: false, error: 'validation_failed' });
  try {
    const result = await withDatabase(db => db.query('INSERT INTO research_submissions (name,email,organization,research_area,submission_type,proposal,external_url) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id', [name, email, organization || null, area, type, proposal, url || null]));
    return json(res, 201, { ok: true, id: result.rows[0].id, status: 'new' });
  } catch (error) {
    if (error.code === 'DATABASE_NOT_CONFIGURED') return json(res, 503, { ok: false, error: 'research_database_not_configured', message: 'Research proposal storage is not configured.' });
    if (error.code === '42P01') return json(res, 503, { ok: false, error: 'research_schema_not_ready', message: 'The research platform database migration must be applied before proposals can be stored.' });
    console.error('research_submission_failed', error); return json(res, 500, { ok: false, error: 'storage_failed' });
  }
}
async function newsletterSubscription(req, res) {
  if (!rateLimit(req, res, 'research-newsletter', 5)) return;
  let input; try { input = await body(req); } catch (error) { return json(res, 400, { ok: false, error: error.message }); }
  const email = clean(input.email).toLowerCase(), topics = Array.isArray(input.topics) ? input.topics.filter(topic => researchAreas.has(clean(topic))).slice(0, 8) : [];
  if (!validEmail(email) || input.consent !== true) return json(res, 422, { ok: false, error: 'validation_failed' });
  try {
    const result = await withDatabase(db => db.query("INSERT INTO research_newsletter_subscribers (email,topics,status) VALUES ($1,$2,'pending_confirmation') ON CONFLICT (email) DO UPDATE SET topics=EXCLUDED.topics, consent_at=NOW(), status=CASE WHEN research_newsletter_subscribers.status='subscribed' THEN 'subscribed' ELSE 'pending_confirmation' END RETURNING status", [email, topics]));
    const status = result.rows[0].status;
    return json(res, 201, { ok: true, status, message: status === 'pending_confirmation' ? 'Your request is recorded as pending; email confirmation is not configured, so you are not yet subscribed.' : 'Your existing subscription remains active.' });
  } catch (error) {
    if (error.code === 'DATABASE_NOT_CONFIGURED') return json(res, 503, { ok: false, error: 'research_database_not_configured', message: 'Newsletter storage is not configured.' });
    if (error.code === '42P01') return json(res, 503, { ok: false, error: 'research_schema_not_ready', message: 'The research platform database migration must be applied before newsletter requests can be stored.' });
    console.error('newsletter_subscription_failed', error); return json(res, 500, { ok: false, error: 'storage_failed' });
  }
}
async function staticFile(pathname, res) {
  const safe = normalize(pathname).replace(/^([.][.][/\\])+/, ''), file = join(root, 'dist', safe === '/' ? 'index.html' : safe);
  const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.avif':'image/avif', '.mp4':'video/mp4', '.svg':'image/svg+xml', '.json':'application/json; charset=utf-8' };
  try { const data = await readFile(file); res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }); res.end(data); }
  catch { try { const data = await readFile(join(root, 'dist', 'index.html')); res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(data); } catch { json(res, 404, { ok: false, error: 'not_found' }); } }
}
const server = http.createServer(async (req, res) => {
  security(res);
  if (req.method === 'GET' && req.url === '/api/health') return json(res, 200, { ok: true, databaseConfigured: Boolean(process.env.DATABASE_URL), supabaseConfigured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY), emailConfigured: Boolean(process.env.RESEND_API_KEY && process.env.CAREERS_NOTIFICATION_EMAIL && process.env.RESEND_FROM_EMAIL), adminConfigured: Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH) });
  if (req.method === 'GET' && req.url === '/api/admin/session') { const session = sessionFor(req); return json(res, 200, { ok: Boolean(session), email: session?.email || null }); }
  if (req.method === 'POST' && req.url === '/api/admin/login') return adminLogin(req, res);
  if (req.method === 'POST' && req.url === '/api/admin/logout') return adminLogout(req, res);
  if (req.method === 'POST' && req.url === '/api/contact') return contact(req, res);
  if (req.method === 'POST' && req.url === '/api/privacy/requests') return privacyRequest(req, res);
  if (req.method === 'POST' && req.url === '/api/security/vulnerability-reports') return handleVulnerabilityReport(req, res);
  if (req.method === 'POST' && req.url === '/api/careers/talent') return careerTalent(req, res);
  const url = new URL(req.url || '/', 'http://localhost');
  if (url.pathname.startsWith('/api/support/') || url.pathname.startsWith('/api/admin/support/')) { const handled = await handleSupport(req, res, { session: sessionFor(req) }); if (handled !== false) return handled; }
  if (url.pathname.startsWith('/api/admin/research/')) return handleResearchAdmin(req, res, url, { json, body, sessionFor, withDatabase });
  if (req.method === 'GET' && url.pathname === '/api/research/articles') return researchList(req, res);
  if (req.method === 'GET' && url.pathname === '/api/research/profile') return researchPublicProfile(res);
  if (req.method === 'GET' && url.pathname === '/api/research/books') return researchPublicBooks(res);
  if (req.method === 'GET' && url.pathname.startsWith('/api/research/articles/')) return researchArticle(decodeURIComponent(url.pathname.slice('/api/research/articles/'.length)), res);
  if (req.method === 'POST' && url.pathname === '/api/research/submissions') return researchSubmission(req, res);
  if (req.method === 'POST' && url.pathname === '/api/research/newsletter') return newsletterSubscription(req, res);
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  return staticFile(url.pathname, res);
});
server.listen(port, '0.0.0.0', () => console.log(`OkzByte server listening on ${port}`));
