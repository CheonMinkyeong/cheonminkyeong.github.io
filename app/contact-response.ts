export function submissionAccepted(ok:boolean,result:unknown):boolean {
 if(!ok||!result||typeof result!=='object')return false;
 const data=result as {success?:unknown;message?:unknown};
 return (data.success===true||data.success==='true')&&!/activat|confirm.*email/i.test(String(data.message||''));
}
