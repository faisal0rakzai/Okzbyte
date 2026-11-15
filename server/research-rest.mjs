import crypto from 'node:crypto';

const fallbackResearch = [
  {
    title: "What Is Blockchain? A Complete Beginner's Guide From Distributed Ledgers to Smart Contracts -The Definitive Primer on Blockchain Technology",
    slug: 'ssrn-blockchain-primer-7236718', author: 'Faisal Orakzai',
    excerpt: 'An introductory technical overview of blockchain concepts, distributed ledgers, and smart contracts, represented here as a publicly posted SSRN preprint.',
    abstract: 'An introductory technical overview of blockchain concepts, distributed ledgers, and smart contracts. The SSRN record is a preprint; no peer-review status is asserted.',
    content: 'This entry is a source-linked catalogue record. The original preprint is hosted by SSRN; OkzByte does not reproduce the full text. Open the DOI record for the complete source.',
    category: 'Blockchain & Web3', content_type: 'Preprint (SSRN)', keywords: ['Blockchain','Distributed ledgers','Smart contracts'],
    doi: '10.2139/ssrn.7236718', external_url: 'https://doi.org/10.2139/ssrn.7236718', published_at: '2026-08-11T00:00:00.000Z', updated_at: null,
    references_json: [{citation:'SSRN record for the blockchain primer',url:'https://doi.org/10.2139/ssrn.7236718'}], is_featured: false,
    catalogue_only: true,
    sources: [
      {platform:'OTHER VERIFIED REPOSITORY',source_url:'https://doi.org/10.2139/ssrn.7236718',record_identifier:'10.2139/ssrn.7236718',source_title:'SSRN preprint',is_primary:true},
      {platform:'ORCID',source_url:'https://orcid.org/0009-0000-0915-7272',record_identifier:null,source_title:'Public ORCID works',is_primary:false},
      {platform:'RESEARCHGATE',source_url:'https://www.researchgate.net/publication/412116986_What_Is_Blockchain_A_Complete_Beginner%27s_Guide_From_Distributed_Ledgers_to_Smart_Contracts_-The_Definitive_Primer_on_Blockchain_Technology',record_identifier:'412116986',source_title:'ResearchGate duplicate listing for the SSRN preprint',is_primary:false},
    ],
  },
  {
    title: 'Credential Integrity Under Explicit Trust Boundaries: An Artifact-centered Verifiable-credential Prototype',
    slug: 'ssrn-credential-integrity-7353660', author: 'Faisal Orakzai',
    excerpt: 'A prototype-oriented verifiable-credential work whose public abstract bounds its benchmark claim to one local environment.',
    abstract: 'The public abstract describes an artifact-centered verifiable-credential prototype and limits its benchmark claim to one local environment. It is not a claim of a complete identity network.',
    content: 'This entry is a source-linked catalogue record. The original preprint is hosted by SSRN; OkzByte does not reproduce the full text. Open the DOI record for the complete source.',
    category: 'Blockchain & Web3', content_type: 'Preprint (SSRN)', keywords: ['Verifiable credentials','Identity','Prototype'],
    doi: '10.2139/ssrn.7353660', external_url: 'https://doi.org/10.2139/ssrn.7353660', published_at: '2026-08-27T00:00:00.000Z', updated_at: null,
    references_json: [{citation:'SSRN record for the verifiable-credential prototype',url:'https://doi.org/10.2139/ssrn.7353660'}], is_featured: false,
    catalogue_only: true,
    sources: [{platform:'OTHER VERIFIED REPOSITORY',source_url:'https://doi.org/10.2139/ssrn.7353660',record_identifier:'10.2139/ssrn.7353660',source_title:'SSRN preprint',is_primary:true},{platform:'ORCID',source_url:'https://orcid.org/0009-0000-0915-7272',record_identifier:null,source_title:'Public ORCID works',is_primary:false}],
  },
  ...[
    ['What is Blockchain? A Complete Beginner’s Guide','official-blockchain-basic','A first-party technical explainer introducing blockchain, distributed ledgers, and smart contracts.','Blockchain & Web3',['Blockchain','DLT','Smart contracts'],'blockchain-basic'],
    ['Blockchain Infrastructure Explained','official-blockchain-infra','A first-party explainer on nodes, validators, consensus, RPC services, and Layer-2 infrastructure.','Blockchain & Web3',['Blockchain','Infrastructure','Nodes','Consensus'],'blockchain-infra'],
    ['How Digital Identity Works on Blockchain','official-blockchain-digital-identity','A first-party explainer covering DIDs, SSI, verifiable credentials, and zero-knowledge proofs.','Blockchain & Web3',['Digital identity','DIDs','Verifiable credentials','Zero-knowledge proofs'],'blockchain-digital-identity'],
    ['The Future of Web3 Infrastructure','official-future-of-web3','A first-party overview of Web3 infrastructure, digital identity, interoperability, decentralized storage, and DePIN.','Blockchain & Web3',['Web3','Digital identity','Interoperability','DePIN'],'future-of-web3'],
    ['Blockchain Security & Consensus Mechanisms Explained','official-blockchain-security','A first-party explainer about cryptographic primitives, consensus mechanisms, and blockchain threat models.','Cybersecurity',['Blockchain security','Consensus','Cryptography'],'blockchain-security'],
    ['Tokenization of Real World Assets (RWA)','official-rwa-tokenization','A first-party explainer on real-world asset tokenization, token standards, infrastructure, and compliance.','Real-World Assets',['RWA','Tokenization','Smart contracts'],'rwa-tokenization'],
    ['How Smart Contracts Work','official-smart-contracts','A first-party guide to smart-contract execution, architecture, security, and enterprise use cases.','Blockchain & Web3',['Smart contracts','Solidity','EVM'],'smart-contracts'],
  ].map(([title,slug,excerpt,category,keywords,path])=>({
    title,slug,author:'Faisal Orakzai',excerpt,abstract:`${excerpt} This is an official-site article, not represented as a peer-reviewed paper.`,
    content:'This listing links to the original official-site article and does not reproduce its full text.',category,content_type:'Technical article',keywords,
    external_url:`https://faisalorakzai.com/research/${path}`,published_at:null,updated_at:null,references_json:[],is_featured:false,
    catalogue_only:true,
    sources:[{platform:'OFFICIAL RESEARCH ARCHIVE',source_url:`https://faisalorakzai.com/research/${path}`,record_identifier:null,source_title:title,is_primary:true}],
  })),
];

export const fallbackProfile = {
  name:'Faisal Orakzai',
  biography:'Technology entrepreneur, computer scientist and researcher focused on blockchain architecture, distributed systems, artificial intelligence, smart contracts, cross-chain interoperability, digital identity and real-world asset tokenization.',
  research_interests:['Blockchain architecture','Distributed systems','Artificial intelligence','Smart contracts','Cross-chain interoperability','Digital identity','Real-world asset tokenization'],
  orcid:'0009-0000-0915-7272',
  external_profile_url:'https://orcid.org/0009-0000-0915-7272',
  researchgate_url:'https://www.researchgate.net/profile/Faisal-Orakzai-4',
  zenodo_url:'https://zenodo.org/search?q=Faisal%20Orakzai',
  google_scholar_url:null, linkedin_url:null, official_research_url:'https://faisalorakzai.com/research',
};
export const fallbackBooks = [
  {title:'The Sovereign Stack',subtitle:'Engineering Next-Generation Blockchain Infrastructure',description:'Listed on the official researcher Books page; edition and identifiers require verification.',official_url:'https://faisalorakzai.com/books',source_url:'https://faisalorakzai.com/books',isbn:null},
  {title:'I’m Orakzai',subtitle:'A Journey Through History, Heritage, and the Future',description:'The official Books page lists this title; the subtitle was supplied by the project owner and needs edition-level confirmation.',official_url:'https://faisalorakzai.com/books',source_url:'https://faisalorakzai.com/books',isbn:null},
];

const publishableErrors = new Set(['PGRST205','PGRST204','42P01','42703']);
export function isResearchSchemaUnavailable(error) { return error?.code === 'SUPABASE_NOT_CONFIGURED' || publishableErrors.has(error?.code); }
export function publicError(error) {
  if (error?.code === 'SUPABASE_NOT_CONFIGURED') return {status:503,error:'research_backend_not_configured',message:'Research submissions are not connected yet. Please try again later.'};
  if (publishableErrors.has(error?.code)) return {status:503,error:'research_schema_not_ready',message:'Research storage is being prepared. Please try again later.'};
  return {status:502,error:'research_storage_unavailable',message:'Research storage is temporarily unavailable. Please try again later.'};
}
export async function supabaseRest(table, { method='GET', query={}, body, prefer } = {}) {
  const base=String(process.env.SUPABASE_URL||'').replace(/\/$/,'');
  const key=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!base||!key) throw Object.assign(new Error('supabase_not_configured'),{code:'SUPABASE_NOT_CONFIGURED'});
  const url=new URL(`${base}/rest/v1/${table}`);
  for(const [name,value] of Object.entries(query)) if(value!==undefined&&value!==null) url.searchParams.set(name,String(value));
  const response=await fetch(url,{method,headers:{apikey:key,authorization:`Bearer ${key}`,'content-type':'application/json',...(prefer?{prefer}:{} )},...(body===undefined?{}:{body:JSON.stringify(body)})});
  let data; try{data=await response.json()}catch{data=null}
  if(!response.ok) throw Object.assign(new Error('supabase_request_failed'),{code:data?.code||`HTTP_${response.status}`,status:response.status});
  return {data,response};
}
export const publishedFallback = fallbackResearch;

function json(res,status,data) {
  if(typeof res.setHeader==='function'){res.setHeader('content-type','application/json; charset=utf-8');res.setHeader('cache-control','no-store');res.setHeader('x-content-type-options','nosniff');res.setHeader('x-frame-options','DENY');}
  if(typeof res.status==='function'&&typeof res.json==='function') return res.status(status).json(data);
  res.statusCode=status;return res.end(JSON.stringify(data));
}
function text(value){return String(value??'').toLocaleLowerCase()}
function hasText(row,q){return [row.title,row.subtitle,row.abstract,row.excerpt,row.author,row.content,...(row.keywords||[])].some(v=>text(v).includes(q))}
function yearOf(value){return value?new Date(value).getUTCFullYear():null}
function derive(items){
  const categoryCounts={};for(const row of items)if(row.category)categoryCounts[row.category]=(categoryCounts[row.category]||0)+1;
  return {categoryCounts,facets:{authors:[...new Set(items.map(x=>x.author).filter(Boolean))].sort(),years:[...new Set(items.map(x=>yearOf(x.published_at)).filter(Boolean))].sort((a,b)=>b-a)}};
}
export async function handleArticleList(req,res){
  if(req.method!=='GET')return json(res,405,{ok:false,error:'method_not_allowed'});
  const q=new URL(req.url,'https://local.invalid').searchParams;
  const params={q:(q.get('q')||'').trim().slice(0,160),category:(q.get('category')||'').trim(),contentType:(q.get('contentType')||'').trim(),platform:(q.get('platform')||'').trim().toUpperCase(),year:(q.get('year')||'').trim(),author:(q.get('author')||'').trim(),sort:q.get('sort')||'latest',page:Math.max(1,Math.min(1000,Number.parseInt(q.get('page')||'1',10)||1)),pageSize:Math.max(1,Math.min(48,Number.parseInt(q.get('limit')||'12',10)||12))};
  if(params.platform&&!['ZENODO','RESEARCHGATE','ORCID','OFFICIAL RESEARCH ARCHIVE','OTHER VERIFIED REPOSITORY'].includes(params.platform))return json(res,400,{ok:false,error:'invalid_platform'});
  let items=null;
  try{
    const {data}=await supabaseRest('research_articles',{query:{select:'id,slug,title,subtitle,author,excerpt,abstract,content,cover_image_url,cover_alt,cover_caption,published_at,updated_at,category,content_type,keywords,doi,external_url,pdf_url,pdf_permission_confirmed,references_json,seo_title,seo_description,is_featured',status:'eq.published',order:'published_at.desc.nullslast,title.asc',limit:'500'}});
    items=Array.isArray(data)?data.map(x=>({...x,pdf_url:x.pdf_permission_confirmed?x.pdf_url:null,sources:[]})):[];
    if(items.length){
      try{
        const ids=items.map(x=>x.id).filter(Boolean);
        if(ids.length){const {data:src}=await supabaseRest('research_article_sources',{query:{select:'article_id,platform,source_url,record_identifier,source_title,is_primary',verified:'eq.true',article_id:`in.(${ids.join(',')})`,order:'is_primary.desc,platform.asc'}});const byId=new Map();for(const s of Array.isArray(src)?src:[]){const list=byId.get(s.article_id)||[];list.push(s);byId.set(s.article_id,list)}items=items.map(x=>({...x,sources:byId.get(x.id)||[]}));}
      }catch(error){if(!isResearchSchemaUnavailable(error))throw error}
    }
  }catch(error){if(!isResearchSchemaUnavailable(error))return json(res,502,{ok:false,error:'research_storage_unavailable',message:'Published research could not be loaded. Please try again.'});}
  const catalogueOnly=!items||items.length===0;
  if(catalogueOnly)items=publishedFallback;
  const all=items;
  let filtered=all.filter(x=>!params.q||hasText(x,params.q.toLocaleLowerCase()));
  if(params.category)filtered=filtered.filter(x=>x.category===params.category);
  if(params.contentType)filtered=filtered.filter(x=>x.content_type===params.contentType);
  if(params.platform)filtered=filtered.filter(x=>(x.sources||[]).some(s=>s.platform===params.platform));
  if(/^\d{4}$/.test(params.year))filtered=filtered.filter(x=>String(yearOf(x.published_at))===params.year);
  if(params.author)filtered=filtered.filter(x=>x.author===params.author);
  filtered.sort((a,b)=>params.sort==='alphabetical'?a.title.localeCompare(b.title):params.sort==='oldest'?(new Date(a.published_at||0)-new Date(b.published_at||0)||a.title.localeCompare(b.title)):(new Date(b.published_at||0)-new Date(a.published_at||0)||a.title.localeCompare(b.title)));
  const pageItems=filtered.slice((params.page-1)*params.pageSize,params.page*params.pageSize),featured=all.find(x=>x.is_featured)||null,facets=derive(all);
  return json(res,200,{ok:true,source:catalogueOnly?'source-catalogue':'cms',items:pageItems,total:filtered.length,page:params.page,pageSize:params.pageSize,categoryCounts:facets.categoryCounts,facets:facets.facets,featured});
}
export async function getPublishedArticle(slug){
  try{const {data}=await supabaseRest('research_articles',{query:{select:'id,slug,title,subtitle,author,excerpt,abstract,content,cover_image_url,cover_alt,cover_caption,published_at,updated_at,category,content_type,keywords,doi,external_url,pdf_url,pdf_permission_confirmed,references_json,seo_title,seo_description,is_featured',slug:`eq.${slug}`,status:'eq.published',limit:'1'}});if(Array.isArray(data)&&data[0]){const article={...data[0],pdf_url:data[0].pdf_permission_confirmed?data[0].pdf_url:null,sources:[]};try{const {data:src}=await supabaseRest('research_article_sources',{query:{select:'platform,source_url,record_identifier,source_title,is_primary',article_id:`eq.${article.id}`,verified:'eq.true',order:'is_primary.desc,platform.asc'}});article.sources=Array.isArray(src)?src:[]}catch(error){if(!isResearchSchemaUnavailable(error))throw error}return {article,related:[],sources:article.sources}}
    const fallback=publishedFallback.find(x=>x.slug===slug);
    return !Array.isArray(data)||data.length===0 ? (fallback?{article:fallback,related:[],sources:fallback.sources}:null) : null;
  }catch(error){if(!isResearchSchemaUnavailable(error))throw error;}
  const article=publishedFallback.find(x=>x.slug===slug);return article?{article,related:[],sources:article.sources}:null;
}
const attempts=globalThis.__okzResearchSubmissionAttempts||(globalThis.__okzResearchSubmissionAttempts=new Map());
function rateLimited(req,bucket,max=5){const ip=String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'unknown').split(',')[0].trim();const key=crypto.createHash('sha256').update(`${bucket}:${ip}`).digest('hex');const now=Date.now(),recent=(attempts.get(key)||[]).filter(t=>now-t<3600000);if(recent.length>=max)return true;recent.push(now);attempts.set(key,recent);if(attempts.size>10000)for(const [k,v]of attempts)if(!v.some(t=>now-t<3600000))attempts.delete(k);return false;}
function sameOrigin(req){const origin=req.headers.origin;if(!origin)return true;const host=String(req.headers['x-forwarded-host']||req.headers.host||'').split(',')[0].trim().toLowerCase();try{return new URL(origin).host.toLowerCase()===host}catch{return false}}
function inputFor(req){const input=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});if(Buffer.byteLength(JSON.stringify(input))>100000)throw Object.assign(new Error('payload_too_large'),{status:413});return input}
const allowedAreas=new Set(['Artificial Intelligence','Blockchain & Web3','Fintech & Digital Finance','Real-World Assets','Cloud & Digital Infrastructure','Cybersecurity','Emerging Technologies','Scientific & Technical Papers']);
const allowedTypes=new Set(['Collaboration inquiry','Technical paper proposal','Research contribution','Expert commentary']);
function validEmail(value){return value.length<=254&&/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)}
export async function handleResearchSubmission(req,res){
  if(req.method!=='POST')return json(res,405,{ok:false,error:'method_not_allowed'});
  if(!sameOrigin(req))return json(res,403,{ok:false,error:'origin_not_allowed'});
  if(rateLimited(req,'submission',3))return json(res,429,{ok:false,error:'rate_limited',message:'Please try again later.'});
  let input;try{input=inputFor(req)}catch(e){return json(res,e.status||400,{ok:false,error:e.message==='payload_too_large'?'payload_too_large':'invalid_json'})}
  const name=String(input.name||'').trim(),email=String(input.email||'').trim().toLowerCase(),organization=String(input.organization||'').trim(),area=String(input.researchArea||'').trim(),type=String(input.submissionType||'').trim(),proposal=String(input.proposal||'').trim(),externalUrl=String(input.externalUrl||'').trim();
  if(name.length<2||name.length>120||!validEmail(email)||organization.length>180||!allowedAreas.has(area)||!allowedTypes.has(type)||proposal.length<30||proposal.length>6000||input.consent!==true&&input.consent!=='true'||externalUrl&&(!/^https:\/\//i.test(externalUrl)||externalUrl.length>2048))return json(res,422,{ok:false,error:'validation_failed',message:'Check the required fields, consent, and optional HTTPS link.'});
  try{const {data}=await supabaseRest('research_submissions',{method:'POST',query:{select:'id'},prefer:'return=representation',body:{name,email,organization:organization||null,research_area:area,submission_type:type,proposal,external_url:externalUrl||null}});const id=Array.isArray(data)?data[0]?.id:null;return json(res,201,{ok:true,status:'new',reference:id?String(id).slice(0,8).toUpperCase():null})}catch(error){const e=publicError(error);return json(res,e.status,{ok:false,error:e.error,message:e.message})}
}
export async function handleResearchNewsletter(req,res){
  if(req.method!=='POST')return json(res,405,{ok:false,error:'method_not_allowed'});
  if(!sameOrigin(req))return json(res,403,{ok:false,error:'origin_not_allowed'});
  if(rateLimited(req,'newsletter',5))return json(res,429,{ok:false,error:'rate_limited',message:'Please try again later.'});
  let input;try{input=inputFor(req)}catch(e){return json(res,e.status||400,{ok:false,error:e.message==='payload_too_large'?'payload_too_large':'invalid_json'})}
  const email=String(input.email||'').trim().toLowerCase(),topics=Array.isArray(input.topics)?input.topics.filter(x=>allowedAreas.has(String(x))).slice(0,8):[];
  if(!validEmail(email)||input.consent!==true&&input.consent!=='true')return json(res,422,{ok:false,error:'validation_failed',message:'Enter a valid email and confirm consent.'});
  try{const {data:matches}=await supabaseRest('research_newsletter_subscribers',{query:{select:'status',email:`eq.${email}`,limit:'1'}});const existing=Array.isArray(matches)?matches[0]:null;let status;if(existing){status=existing.status==='subscribed'?'subscribed':'pending_confirmation';const update={topics,consent_at:new Date().toISOString(),status};if(existing.status==='unsubscribed')update.unsubscribed_at=null;const {data}=await supabaseRest('research_newsletter_subscribers',{method:'PATCH',query:{email:`eq.${email}`,select:'status'},prefer:'return=representation',body:update});status=Array.isArray(data)&&data[0]?.status||status;}else{const {data}=await supabaseRest('research_newsletter_subscribers',{method:'POST',query:{select:'status'},prefer:'return=representation',body:{email,topics,status:'pending_confirmation'}});status=Array.isArray(data)&&data[0]?.status||'pending_confirmation';}return json(res,201,{ok:true,status,message:status==='pending_confirmation'?'Your request is saved as pending. You are not subscribed until email confirmation is configured.':'Your existing subscription remains active.'})}catch(error){const e=publicError(error);return json(res,e.status,{ok:false,error:e.error,message:e.message})}
}
export async function handleResearchProfile(req,res){if(req.method!=='GET')return json(res,405,{ok:false,error:'method_not_allowed'});try{const {data}=await supabaseRest('research_authors',{query:{select:'name,biography,research_interests,orcid,external_profile_url,researchgate_url,zenodo_url,google_scholar_url,linkedin_url,official_research_url',orcid:'eq.0009-0000-0915-7272',profile_verified:'eq.true',limit:'1'}});return json(res,200,{ok:true,profile:Array.isArray(data)&&data[0]?data[0]:fallbackProfile})}catch(error){if(isResearchSchemaUnavailable(error))return json(res,200,{ok:true,profile:fallbackProfile});return json(res,502,{ok:false,error:'research_storage_unavailable'})}}
export async function handleResearchBooks(req,res){if(req.method!=='GET')return json(res,405,{ok:false,error:'method_not_allowed'});try{const {data}=await supabaseRest('research_books',{query:{select:'id,title,subtitle,description,official_url,source_url,isbn',status:'eq.listed',order:'title.asc'}});return json(res,200,{ok:true,items:Array.isArray(data)&&data.length?data:fallbackBooks})}catch(error){if(isResearchSchemaUnavailable(error))return json(res,200,{ok:true,items:fallbackBooks});return json(res,502,{ok:false,error:'research_storage_unavailable'})}}
