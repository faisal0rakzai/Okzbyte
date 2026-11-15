const platforms = new Set(['ZENODO','RESEARCHGATE','ORCID','OFFICIAL RESEARCH ARCHIVE','OTHER VERIFIED REPOSITORY']);
const statuses = new Set(['draft','in_review','approved','published','archived']);
const categories = new Set(['Artificial Intelligence','Blockchain & Web3','Fintech & Digital Finance','Real-World Assets','Cloud & Digital Infrastructure','Cybersecurity','Emerging Technologies','Scientific & Technical Papers']);
const clean = value => String(value ?? '').trim();
const optional = value => clean(value) || null;
const isHttps = value => !value || /^https:\/\//i.test(value);

function sameOrigin(req) {
  if (req.headers['sec-fetch-site'] === 'cross-site') return false;
  const origin = req.headers.origin;
  if (!origin) return true;
  try { return new URL(origin).host === req.headers.host; } catch { return false; }
}

function articleFields(input) {
  const title = clean(input.title), slug = clean(input.slug);
  const content = String(input.content ?? ''), excerpt = clean(input.excerpt);
  const category = clean(input.category), contentType = clean(input.content_type || 'Research article');
  const keywords = Array.isArray(input.keywords) ? input.keywords.map(clean).filter(Boolean).slice(0,30) : [];
  let references = input.references_json ?? [];
  if (typeof references === 'string') { try { references = JSON.parse(references || '[]'); } catch { throw new Error('references_json_invalid'); } }
  if (!Array.isArray(references) || references.length > 100) throw new Error('references_invalid');
  references = references.map(item => {
    if (typeof item === 'string') return { citation: item.slice(0,3000) };
    const citation = clean(item?.citation || item?.title);
    const url = clean(item?.url);
    if (!citation || citation.length > 3000 || !isHttps(url)) throw new Error('reference_invalid');
    return { citation, ...(url ? { url } : {}) };
  });
  const urls = ['cover_image_url','external_url','pdf_url'].map(key => clean(input[key]));
  const pdfPermission = input.pdf_permission_confirmed === true;
  if (urls[2] && !pdfPermission) throw new Error('pdf_permission_required');
  if (!title || title.length > 240 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !excerpt || excerpt.length > 1600 || content.length > 100000 || content.length < 30 || !categories.has(category) || contentType.length > 100 || keywords.some(x => x.length > 100) || urls.some(x => !isHttps(x))) throw new Error('article_validation_failed');
  return {
    title, slug, subtitle: optional(input.subtitle), author: optional(input.author), excerpt,
    abstract: optional(input.abstract), content, category, contentType, keywords, references,
    doi: optional(input.doi), externalUrl: optional(input.external_url), pdfUrl: optional(input.pdf_url), pdfPermission,
    coverImageUrl: optional(input.cover_image_url), coverAlt: optional(input.cover_alt),
    coverCaption: optional(input.cover_caption), seoTitle: optional(input.seo_title),
    seoDescription: optional(input.seo_description), featured: input.is_featured === true,
  };
}

async function event(db, articleId, actor, action, details = {}) {
  await db.query('INSERT INTO research_article_events(article_id,actor_email,action,details) VALUES($1,$2,$3,$4::jsonb)', [articleId, actor, action, JSON.stringify(details)]);
}

export async function handleResearchAdmin(req, res, url, { json, body, sessionFor, withDatabase }) {
  const session = sessionFor(req);
  if (!session) { json(res, 401, { ok:false, error:'admin_auth_required' }); return true; }
  const isWrite = !['GET','HEAD'].includes(req.method);
  if (isWrite && !sameOrigin(req)) { json(res, 403, { ok:false, error:'same_origin_required' }); return true; }
  const path = url.pathname;
  try {
    if (req.method === 'GET' && path === '/api/admin/research/articles') {
      const status = clean(url.searchParams.get('status'));
      if (status && !statuses.has(status)) { json(res,400,{ok:false,error:'invalid_status'}); return true; }
      const result = await withDatabase(db => db.query(`SELECT id,slug,title,author,category,content_type,status,published_at,updated_at,created_at FROM research_articles ${status ? 'WHERE status=$1' : ''} ORDER BY updated_at DESC LIMIT 300`, status ? [status] : []));
      json(res,200,{ok:true,items:result.rows}); return true;
    }
    if (req.method === 'POST' && path === '/api/admin/research/articles') {
      const input = await body(req); const a = articleFields(input);
      const item = await withDatabase(async db => {
        const r = await db.query(`INSERT INTO research_articles (title,slug,subtitle,author,excerpt,abstract,content,category,content_type,keywords,references_json,doi,external_url,pdf_url,pdf_permission_confirmed,cover_image_url,cover_alt,cover_caption,seo_title,seo_description,status,is_featured)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,$12,$13,$14,$15,$16,$17,$18,$19,$20,'draft',FALSE) RETURNING id,slug,status`, [a.title,a.slug,a.subtitle,a.author,a.excerpt,a.abstract,a.content,a.category,a.contentType,a.keywords,JSON.stringify(a.references),a.doi,a.externalUrl,a.pdfUrl,a.pdfPermission,a.coverImageUrl,a.coverAlt,a.coverCaption,a.seoTitle,a.seoDescription]);
        await event(db,r.rows[0].id,session.email,'created',{status:'draft'}); return r.rows[0];
      });
      json(res,201,{ok:true,item}); return true;
    }
    const articleMatch = path.match(/^\/api\/admin\/research\/articles\/([0-9a-f-]{36})(?:\/(status|sources|revisions|events))?$/i);
    if (articleMatch) {
      const [,id,tail] = articleMatch;
      if (req.method === 'GET' && !tail) {
        const data = await withDatabase(async db => {
          const r = await db.query('SELECT * FROM research_articles WHERE id=$1',[id]);
          if (!r.rows[0]) return null;
          const [sources,revisions,events] = await Promise.all([
            db.query('SELECT * FROM research_article_sources WHERE article_id=$1 ORDER BY is_primary DESC,created_at',[id]),
            db.query('SELECT id,title,editor_email,created_at,metadata_json FROM research_article_revisions WHERE article_id=$1 ORDER BY created_at DESC LIMIT 50',[id]),
            db.query('SELECT id,actor_email,action,details,created_at FROM research_article_events WHERE article_id=$1 ORDER BY created_at DESC LIMIT 100',[id]),
          ]);
          return {article:r.rows[0],sources:sources.rows,revisions:revisions.rows,events:events.rows};
        });
        if (!data) json(res,404,{ok:false,error:'not_found'}); else json(res,200,{ok:true,...data}); return true;
      }
      if (req.method === 'PUT' && !tail) {
        const input = await body(req); const a = articleFields(input);
        const result = await withDatabase(async db => {
          await db.query('BEGIN');
          try {
            const current = await db.query('SELECT * FROM research_articles WHERE id=$1 FOR UPDATE',[id]);
            if (!current.rows[0]) { await db.query('ROLLBACK'); return null; }
            const old=current.rows[0];
            if (!['draft','in_review'].includes(old.status)) { await db.query('ROLLBACK'); return {locked:old.status}; }
            await db.query('INSERT INTO research_article_revisions(article_id,title,content,editor_email,metadata_json) VALUES($1,$2,$3,$4,$5::jsonb)',[id,old.title,old.content,session.email,JSON.stringify(old)]);
            const r=await db.query(`UPDATE research_articles SET title=$2,slug=$3,subtitle=$4,author=$5,excerpt=$6,abstract=$7,content=$8,category=$9,content_type=$10,keywords=$11,references_json=$12::jsonb,doi=$13,external_url=$14,pdf_url=$15,pdf_permission_confirmed=$16,cover_image_url=$17,cover_alt=$18,cover_caption=$19,seo_title=$20,seo_description=$21,is_featured=$22,updated_at=NOW() WHERE id=$1 RETURNING id,slug,status`,[id,a.title,a.slug,a.subtitle,a.author,a.excerpt,a.abstract,a.content,a.category,a.contentType,a.keywords,JSON.stringify(a.references),a.doi,a.externalUrl,a.pdfUrl,a.pdfPermission,a.coverImageUrl,a.coverAlt,a.coverCaption,a.seoTitle,a.seoDescription,a.featured]);
            await event(db,id,session.email,'updated',{status:old.status}); await db.query('COMMIT'); return r.rows[0];
          } catch(e) { await db.query('ROLLBACK'); throw e; }
        });
        if (!result) json(res,404,{ok:false,error:'not_found'}); else if(result.locked) json(res,409,{ok:false,error:'content_edit_locked',status:result.locked,message:'Return this item to an editable draft/review state before changing its metadata or text.'}); else json(res,200,{ok:true,item:result}); return true;
      }
      if (req.method === 'POST' && tail === 'status') {
        const input=await body(req), next=clean(input.status);
        if (!statuses.has(next)) { json(res,422,{ok:false,error:'invalid_status'}); return true; }
        const result=await withDatabase(async db=>{
          await db.query('BEGIN');
          try {
            const r=await db.query('SELECT status,published_at,pdf_url,pdf_permission_confirmed FROM research_articles WHERE id=$1 FOR UPDATE',[id]);
            if(!r.rows[0]) { await db.query('ROLLBACK'); return null; }
            const prev=r.rows[0].status;
            const allowed={draft:['in_review','archived'],in_review:['draft','approved'],approved:['in_review','published'],published:['archived'],archived:['draft']};
            if(!(allowed[prev]||[]).includes(next)) { await db.query('ROLLBACK'); return {invalid:true,prev}; }
            if(next==='published'&&r.rows[0].pdf_url&&!r.rows[0].pdf_permission_confirmed){await db.query('ROLLBACK');return {pdfPermissionRequired:true};}
            const publishedAt=next==='published'?(r.rows[0].published_at||new Date()):next==='draft'?null:r.rows[0].published_at;
            await db.query('UPDATE research_articles SET status=$2,published_at=$3,updated_at=NOW() WHERE id=$1',[id,next,publishedAt]);
            const action=next==='in_review'?'submitted_for_review':next==='approved'?'approved':next==='published'?'published':next==='archived'?'archived':prev==='archived'?'restored':'returned_to_draft';
            await event(db,id,session.email,action,{from:prev,to:next}); await db.query('COMMIT'); return {id,status:next,published_at:publishedAt};
          } catch(e) { await db.query('ROLLBACK'); throw e; }
        });
        if(!result) json(res,404,{ok:false,error:'not_found'}); else if(result.invalid) json(res,409,{ok:false,error:'invalid_transition',from:result.prev,to:next}); else if(result.pdfPermissionRequired) json(res,409,{ok:false,error:'pdf_permission_required',message:'Confirm distribution rights for the linked PDF or remove the PDF URL before publishing.'}); else json(res,200,{ok:true,item:result}); return true;
      }
      if (req.method === 'POST' && tail === 'sources') {
        const input=await body(req), platform=clean(input.platform), sourceUrl=clean(input.source_url), identifier=optional(input.record_identifier), title=optional(input.source_title), abstract=optional(input.source_abstract), verified=input.verified===true, primary=input.is_primary===true;
        if(!platforms.has(platform)||!/^https:\/\//i.test(sourceUrl)||sourceUrl.length>2048||identifier?.length>240||title?.length>500||abstract?.length>8000) { json(res,422,{ok:false,error:'source_validation_failed'}); return true; }
        const item=await withDatabase(async db=>{
          const a=await db.query('SELECT id FROM research_articles WHERE id=$1',[id]); if(!a.rows[0])return null;
          await db.query('BEGIN'); try {
            if(primary) await db.query('UPDATE research_article_sources SET is_primary=FALSE WHERE article_id=$1',[id]);
            const r=await db.query(`INSERT INTO research_article_sources(article_id,platform,source_url,record_identifier,source_title,source_abstract,verified,verified_at,is_primary) VALUES($1,$2,$3,$4,$5,$6,$7,CASE WHEN $7 THEN NOW() ELSE NULL END,$8) ON CONFLICT(article_id,platform,source_url) DO UPDATE SET record_identifier=EXCLUDED.record_identifier,source_title=EXCLUDED.source_title,source_abstract=EXCLUDED.source_abstract,verified=EXCLUDED.verified,verified_at=EXCLUDED.verified_at,is_primary=EXCLUDED.is_primary RETURNING *`,[id,platform,sourceUrl,identifier,title,abstract,verified,primary]);
            await event(db,id,session.email,'source_added',{platform,source_url:sourceUrl,verified}); await db.query('COMMIT'); return r.rows[0];
          } catch(e) {await db.query('ROLLBACK');throw e;}
        });
        if(!item)json(res,404,{ok:false,error:'not_found'});else json(res,201,{ok:true,item});return true;
      }
      if (req.method === 'DELETE' && tail === 'sources') {
        const sourceId=url.searchParams.get('sourceId');
        if(!sourceId||!/^[0-9a-f-]{36}$/i.test(sourceId)){json(res,422,{ok:false,error:'source_id_required'});return true;}
        const result=await withDatabase(async db=>{const r=await db.query('DELETE FROM research_article_sources WHERE id=$1 AND article_id=$2 RETURNING platform,source_url',[sourceId,id]);if(r.rows[0])await event(db,id,session.email,'source_removed',r.rows[0]);return r.rows[0]||null;});
        if(!result)json(res,404,{ok:false,error:'not_found'});else json(res,200,{ok:true,removed:result});return true;
      }
      json(res,405,{ok:false,error:'method_not_allowed'}); return true;
    }
    if (req.method === 'POST' && path === '/api/admin/research/merge') {
      const input=await body(req), primary=clean(input.primary_id), duplicate=clean(input.duplicate_id);
      if(!/^[0-9a-f-]{36}$/i.test(primary)||!/^[0-9a-f-]{36}$/i.test(duplicate)||primary===duplicate){json(res,422,{ok:false,error:'merge_ids_invalid'});return true;}
      const done=await withDatabase(async db=>{await db.query('BEGIN');try{const p=await db.query('SELECT id FROM research_articles WHERE id=$1 FOR UPDATE',[primary]);const d=await db.query('SELECT id,status FROM research_articles WHERE id=$1 FOR UPDATE',[duplicate]);if(!p.rows[0]||!d.rows[0]){await db.query('ROLLBACK');return false;}await db.query('UPDATE research_article_sources SET is_primary=FALSE WHERE article_id=$1 AND EXISTS (SELECT 1 FROM research_article_sources WHERE article_id=$2 AND is_primary=TRUE)',[duplicate,primary]);await db.query(`UPDATE research_article_sources SET article_id=$1 WHERE article_id=$2 AND NOT EXISTS(SELECT 1 FROM research_article_sources x WHERE x.article_id=$1 AND x.platform=research_article_sources.platform AND x.source_url=research_article_sources.source_url)`,[primary,duplicate]);await db.query('DELETE FROM research_article_sources WHERE article_id=$1',[duplicate]);await db.query("UPDATE research_articles SET status='archived',published_at=NULL,updated_at=NOW() WHERE id=$1",[duplicate]);await event(db,primary,session.email,'merged',{duplicate_id:duplicate});await event(db,duplicate,session.email,'merged',{primary_id:primary});await db.query('COMMIT');return true;}catch(e){await db.query('ROLLBACK');throw e;}});
      if(!done)json(res,404,{ok:false,error:'not_found'});else json(res,200,{ok:true,primary_id:primary,duplicate_id:duplicate,status:'duplicate_archived'});return true;
    }
    if (path === '/api/admin/research/profile' && req.method === 'GET') {
      const r=await withDatabase(db=>db.query("SELECT * FROM research_authors WHERE orcid='0009-0000-0915-7272' LIMIT 1"));json(res,200,{ok:true,profile:r.rows[0]||null});return true;
    }
    if (path === '/api/admin/research/profile' && req.method === 'PUT') {
      const input=await body(req), name=clean(input.name), biography=clean(input.biography), interests=Array.isArray(input.research_interests)?input.research_interests.map(clean).filter(Boolean).slice(0,20):[];
      const urls=['external_profile_url','researchgate_url','zenodo_url','google_scholar_url','linkedin_url','official_research_url'].map(k=>clean(input[k]));
      if(name.length<2||name.length>160||biography.length<40||biography.length>4000||interests.some(x=>x.length>120)||urls.some(x=>!isHttps(x))){json(res,422,{ok:false,error:'profile_validation_failed'});return true;}
      const r=await withDatabase(db=>db.query("UPDATE research_authors SET name=$2,biography=$3,research_interests=$4,external_profile_url=$5,researchgate_url=$6,zenodo_url=$7,google_scholar_url=$8,linkedin_url=$9,official_research_url=$10,updated_at=NOW() WHERE orcid='0009-0000-0915-7272' RETURNING *",[name,biography,interests,...urls]));json(res,r.rowCount?200:404,{ok:Boolean(r.rowCount),profile:r.rows[0]||null});return true;
    }
    if (path === '/api/admin/research/books' && req.method === 'GET') {
      const r=await withDatabase(db=>db.query('SELECT * FROM research_books ORDER BY title'));json(res,200,{ok:true,items:r.rows});return true;
    }
    if ((path === '/api/admin/research/books' && req.method === 'POST') || (/^\/api\/admin\/research\/books\/[0-9a-f-]{36}$/i.test(path)&&req.method==='PUT')) {
      const input=await body(req), title=clean(input.title), subtitle=optional(input.subtitle), description=optional(input.description), official=clean(input.official_url), source=clean(input.source_url), isbn=optional(input.isbn), status=clean(input.status||'draft');
      if(title.length<2||title.length>300||!/^https:\/\//i.test(official)||!/^https:\/\//i.test(source)||!['draft','listed','archived'].includes(status)){json(res,422,{ok:false,error:'book_validation_failed'});return true;}
      const match=path.match(/books\/([0-9a-f-]{36})$/i);
      const r=await withDatabase(db=>match?db.query('UPDATE research_books SET title=$2,subtitle=$3,description=$4,official_url=$5,source_url=$6,isbn=$7,status=$8,updated_at=NOW() WHERE id=$1 RETURNING *',[match[1],title,subtitle,description,official,source,isbn,status]):db.query("INSERT INTO research_books(title,subtitle,description,official_url,source_url,isbn,status,author_id) SELECT $1,$2,$3,$4,$5,$6,$7,id FROM research_authors WHERE orcid='0009-0000-0915-7272' RETURNING *",[title,subtitle,description,official,source,isbn,status]));
      json(res,r.rowCount?200:404,{ok:Boolean(r.rowCount),item:r.rows[0]||null});return true;
    }
    json(res,404,{ok:false,error:'admin_research_route_not_found'}); return true;
  } catch (error) {
    if(error.message==='invalid_json'||error.message==='payload_too_large'){json(res,400,{ok:false,error:error.message});return true;}
    if(error.message.endsWith('_invalid')||error.message.endsWith('_failed')||error.message.endsWith('_required')){json(res,422,{ok:false,error:error.message});return true;}
    if(error.code==='23505'){json(res,409,{ok:false,error:'duplicate_or_conflict'});return true;}
    if(error.code==='DATABASE_NOT_CONFIGURED'){json(res,503,{ok:false,error:'research_database_not_configured'});return true;}
    if(error.code==='42P01'||error.code==='42703'){json(res,503,{ok:false,error:'research_schema_not_ready'});return true;}
    console.error('research_admin_failed',error);json(res,500,{ok:false,error:'research_admin_operation_failed'});return true;
  }
}
