import { handleSupport } from '../../server/support.mjs';
export default async function handler(req,res){if(req.method!=='POST'){res.statusCode=405;return res.end(JSON.stringify({ok:false,error:'method_not_allowed'}));}req.url='/api/support/track';return handleSupport(req,res);}
