'use client';
import { useState, useEffect } from 'react';
import Stage from './stage';
import Player from './player';
import { mainWorks as initialWorks, heroWorks, works as allWorks } from './works-data';
import WorkListen from './work-listen';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
export default function Portfolio(){
 const [filter,setFilter]=useState('All');
 const [works,setWorks]=useState(initialWorks);
 const [editing,setEditing]=useState(false);
 const [active,setActive]=useState<'video'|'artist'|'production'|null>(null);
 const [dragged,setDragged]=useState<string|null>(null);
 const [saveMessage,setSaveMessage]=useState('');
 useEffect(()=>{try{const ids=JSON.parse(localStorage.getItem('cm-work-order-v2')||'null');if(Array.isArray(ids)){const unique=[...new Set(ids)].filter(id=>initialWorks.some(w=>w.id===id));setWorks([...unique.map(id=>initialWorks.find(w=>w.id===id)!),...initialWorks.filter(w=>!unique.includes(w.id))]);}}catch{}},[]);
 const save=(next:typeof works)=>{setWorks(next);try{localStorage.setItem('cm-work-order-v2',JSON.stringify(next.map(w=>w.id)));setSaveMessage('Order saved in this browser.');}catch{setSaveMessage('Order changed for this visit; browser storage is unavailable.');}};
 const move=(id:string,offset:number)=>{const next=[...works],index=next.findIndex(w=>w.id===id),target=index+offset;if(target<0||target>=next.length)return;[next[index],next[target]]=[next[target],next[index]];save(next);};
 const drop=(id:string)=>{if(!dragged||dragged===id)return;const next=[...works],from=next.findIndex(w=>w.id===dragged),to=next.findIndex(w=>w.id===id);next.splice(to,0,next.splice(from,1)[0]);save(next);setDragged(null);};
 const filters=['All','The Four Winds','Reuben Project','EleaMusic'];
 return <>
 <a className="skip" href="#works">Skip to works</a>
 <header className="navigation"><a className="wordmark" href="#home">CM<span>千民京</span></a><nav aria-label="Main navigation"><a href="#works">Works</a><a href="#projects">Projects</a><a href="#about">About</a><a href="#production">Production <span>↗</span></a></nav></header>
 <main><section className="hero" id="home">
 <div className="hero-art" aria-hidden="true"><img className="portrait" src="/images/main-portrait.webp" alt=""/>{heroWorks.map((w,i)=><img key={w.id} className={`floating-cover cover-${i}`} src={'/images/'+w.image} alt=""/>)}</div>
 <Stage/><div className="hero-vignette"/><div className="hero-copy"><p className="eyebrow">MUSIC · COLLABORATION · EXPLORATION</p><h1>Cheon<br/><em>Minkyeong</em><span>千 民 京</span></h1><a className="primary-link" href="#works"><span className="play">▶</span> Watch & Listen <span>↗</span></a></div>
 <div className="hero-foot"><span>SELECTED WORKS & ONGOING EXPLORATIONS</span><a href="#works">Scroll to explore ↓</a></div>
 </section>
 <section className="works section" id="works"><div className="section-heading"><div><p className="eyebrow">01 / CHEON MINKYEONG</p><h2>Main <em>works.</em></h2></div><p className="section-note">A meeting of sound,<br/>image and people.</p></div>
 <Tabs value={filter} onValueChange={value=>setFilter(String(value))}><div className="collection-tools"><TabsList variant="line" className="filters" aria-label="Filter works">{filters.map(f=><TabsTrigger key={f} value={f}>{f}</TabsTrigger>)}</TabsList><button className="arrange-toggle" onClick={()=>{setEditing(!editing);setFilter('All');}} aria-pressed={editing}>{editing?'Done arranging':'Arrange works'}</button></div>
 {editing&&<div className="arrange-note"><span>Drag to reorder, or use the arrow buttons. Saved in this browser.</span><button onClick={()=>save(initialWorks)}>Reset order</button></div>}
 {filters.map(f=><TabsContent value={f} key={f}><div className="work-grid">{works.filter(w=>f==='All'||w.kind===f).map((w)=><article className="work-card" key={w.id} draggable={editing} onDragStart={()=>setDragged(w.id)} onDragEnd={()=>setDragged(null)} onDragOver={e=>{if(editing)e.preventDefault();}} onDrop={()=>drop(w.id)}><a href={'/works/'+w.id} draggable={false}><div className={'work-image '+w.id}><img src={'/images/'+w.image} alt={`${w.title} — ${w.subtitle}`} loading="lazy" draggable={false}/><span className="work-open">↗</span></div><div className="work-caption"><span className="work-number">0{works.indexOf(w)+1}</span><div><h3>{w.title}</h3><p>{w.subtitle}</p></div></div></a>{editing&&<div className="reorder-buttons"><button disabled={works.indexOf(w)===0} onClick={()=>move(w.id,-1)} aria-label={'Move '+w.title+' '+w.subtitle+' earlier'}>← Earlier</button><button disabled={works.indexOf(w)===works.length-1} onClick={()=>move(w.id,1)} aria-label={'Move '+w.title+' '+w.subtitle+' later'}>Later →</button></div>}</article>)}</div></TabsContent>)}
 </Tabs><p className="save-message" role="status">{saveMessage}</p>
 </section>
 <section id="projects" className="section projects"><p className="eyebrow">02 / THE CHANNELS</p><h2>Explore the <em>projects.</em></h2><div className="project-links">{[['The Four Winds','https://www.youtube.com/@thefourwinds5737'],['Reuben Project','https://www.youtube.com/@reuben1107'],['EleaMusic · Two Sides','https://www.youtube.com/@EleaMusicTS']].map(([name,url],i)=><a key={url} href={url} target="_blank" rel="noreferrer"><span className="project-index">0{i+1}</span><span>{name}</span><span className="project-service">YouTube</span><span>↗</span></a>)}</div></section>
 <section id="production" className="section production"><p className="eyebrow">03 / PRODUCED BY CHEON MINKYEONG</p><h2>Behind <em>the music.</em></h2><div className="production-layout"><a href="/works/casting-the-net"><img src="/images/casting-the-net.webp" alt="Casting the Net — ICF Enschede Praise album cover" loading="lazy"/></a><div><h3>Casting the Net</h3><p className="about-text">ICF Enschede Praise</p><WorkListen work={allWorks.find(w=>w.id==='casting-the-net')!}/></div></div></section>
 <section id="about" className="section about"><div className="about-image"><img src="/images/portrait.webp" alt="Cheon Minkyeong playing guitar" loading="lazy"/></div><div><p className="eyebrow">04 / THE ARTIST</p><h2>Cheon<br/><em>Minkyeong.</em></h2><p className="artist-kanji">千民京</p><p className="about-text">Music, moving images, and the space between.<br/>Explore the recordings and collaborations collected here.</p><a className="text-link" href="#projects">Explore the projects ↗</a></div></section>
 <section id="listen" className="section live-reference"><p className="eyebrow">05 / ALSO AVAILABLE</p><details><summary>Cheon Minkyeong — Live <span>＋</span></summary><div className="live-player"><Player type="video" active={active==='video'} onActivate={()=>setActive('video')}/></div></details></section>
 </main><footer><a href="#home">Cheon Minkyeong <span>千民京</span></a><p>Music & moving image</p><a href="#home">Back to top ↑</a></footer>
 </>;
}
