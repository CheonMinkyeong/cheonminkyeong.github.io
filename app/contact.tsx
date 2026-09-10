'use client';
import {useRef,useState,type FormEvent} from 'react';
import {submissionAccepted} from './contact-response';
import {Input} from '@/components/ui/input';
import {NativeSelect,NativeSelectOption} from '@/components/ui/native-select';
import {Textarea} from '@/components/ui/textarea';
const recipient='yamasaki_jun@hotmail.com';
export default function Contact(){
 const [state,setState]=useState<'idle'|'sending'|'success'|'error'>('idle');
 const [notice,setNotice]=useState('');
 const busy=useRef(false);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy.current)return;
  const form=event.currentTarget,data=new FormData(form);
  if(String(data.get('_honey')||''))return;
  if(!String(data.get('name')||'').trim()||!String(data.get('message')||'').trim()){setState('error');setNotice('Please enter your name and message.');return;}
  busy.current=true;setState('sending');setNotice('Sending your message…');
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
  try{
   const response=await fetch(`https://formsubmit.co/ajax/${recipient}`,{method:'POST',headers:{Accept:'application/json'},body:data,signal:controller.signal});
   const result=await response.json();
   if(!submissionAccepted(response.ok,result))throw new Error('Submission not confirmed');
   setState('success');setNotice('Thank you. Your message has been submitted.');form.reset();
  }catch{setState('error');setNotice('We could not confirm your submission. Your message is still here. Please try again, or email us directly.');}
  finally{clearTimeout(timeout);busy.current=false;}
 }
 return <section className="section contact" id="contact"><div><p className="eyebrow">06 / CONTACT</p><h2>Get in <em>touch.</em></h2><p className="about-text">For performances, collaborations<br/>and production inquiries.</p><a className="text-link" href={`mailto:${recipient}`}>Email directly ↗</a></div><form onSubmit={submit} action={`https://formsubmit.co/${recipient}`} method="POST" aria-busy={state==='sending'}>
 <input type="hidden" name="_captcha" value="false"/><input type="hidden" name="_subject" value="Cheon Minkyeong — Website inquiry"/><input type="hidden" name="_template" value="table"/>
 <input type="text" name="_honey" className="contact-honey" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
 <fieldset disabled={state==='sending'}><div className="contact-row"><label htmlFor="contact-name">Name <span>*</span><Input id="contact-name" name="name" autoComplete="name" required maxLength={120}/></label><label htmlFor="contact-email">Email <span>*</span><Input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254}/></label></div>
 <label htmlFor="contact-type">Inquiry type</label><NativeSelect id="contact-type" name="inquiry_type" defaultValue="Other"><NativeSelectOption>Performance</NativeSelectOption><NativeSelectOption>Collaboration</NativeSelectOption><NativeSelectOption>Production</NativeSelectOption><NativeSelectOption>Other</NativeSelectOption></NativeSelect>
 <label htmlFor="contact-message">Message <span>*</span></label><Textarea id="contact-message" name="message" required rows={6} maxLength={5000}/>
 <p className="contact-privacy">Your details will be used to respond to your inquiry. Submissions are processed through <a href="https://formsubmit.co/" target="_blank" rel="noreferrer">FormSubmit</a>.</p>
 <button type="submit" className="contact-send">{state==='sending'?'Sending…':'Send message'} <span>↗</span></button></fieldset>
 <p className={'contact-status '+state} role={state==='error'?'alert':'status'} aria-live="polite">{notice}</p>
 </form></section>;
}
