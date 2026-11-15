import { useEffect, useState } from 'react';
import { GitMerge, RefreshCw } from 'lucide-react';

async function api(url,options={}){const r=await fetch(url,{credentials:'same-origin',...options,headers:{'Content-Type':'application/json',...(options.headers||{})}});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||`Request failed (${r.status})`);return d}
export default function ResearchMergePanel({active,onMessage,onMerged}){
 const [items,setItems]=useState([]),[duplicate,setDuplicate]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{let live=true;api('/api/admin/research/articles').then(d=>{if(live)setItems(d.items||[])}).catch(e=>onMessage(e.message));return()=>{live=false}},[active?.id,onMessage]);
 const candidates=items.filter(item=>item.id!==active?.id);
 const merge=async()=>{if(!active||!duplicate)return;if(!window.confirm('Merge the selected record into the current canonical item? Its source links will move and the duplicate article will be archived. The duplicate will no longer appear publicly.'))return;setBusy(true);try{await api('/api/admin/research/merge',{method:'POST',body:JSON.stringify({primary_id:active.id,duplicate_id:duplicate})});setDuplicate('');onMessage('Duplicate archived; matching source links were moved to the canonical record. Verify the resulting source list.');await onMerged(active.id)}catch(e){onMessage(e.message)}finally{setBusy(false)}};
 return <section className="cms-merge-box"><div><GitMerge size={16}/><div><b>MERGE DUPLICATE RECORD</b><p>Choose one item that represents the same work. Sources move to this current record; the duplicate is archived. This does not copy article text.</p></div></div><div className="cms-merge-controls"><select aria-label="Duplicate record to merge" value={duplicate} onChange={e=>setDuplicate(e.target.value)}><option value="">Select a duplicate record…</option>{candidates.map(x=><option key={x.id} value={x.id}>{x.title} [{x.status}]</option>)}</select><button type="button" disabled={!duplicate||busy} onClick={merge}><RefreshCw size={13}/>{busy?'Merging…':'Merge & archive duplicate'}</button></div></section>;
}
