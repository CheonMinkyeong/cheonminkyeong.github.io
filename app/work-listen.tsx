'use client';
import {useState} from 'react';
import type {Work} from './works-data';
export default function WorkListen({work}:{work:Work}){
 const [active,setActive]=useState<'youtube'|'spotify'|null>(null);
 return <div className="work-listen">
 <div className="release-actions">
 {work.spotify&&<button className="platform-btn" onClick={()=>setActive(active==='spotify'?null:'spotify')}><svg viewBox="0 0 24 24"><path d="M12,2C6.477,2,2,6.477,2,12s4.477,10,10,10s10-4.477,10-10S17.523,2,12,2z M16.586,16.424c-0.18,0.295-0.563,0.387-0.857,0.207c-2.348-1.435-5.302-1.76-8.783-0.963c-0.335,0.077-0.67-0.133-0.746-0.469c-0.077-0.335,0.132-0.67,0.469-0.746c3.809-0.871,7.077-0.496,9.713,1.115C16.676,15.746,16.766,16.13,16.586,16.424z M17.81,13.7c-0.226,0.367-0.706,0.482-1.072,0.257c-2.687-1.652-6.785-2.131-9.965-1.166c-0.413,0.127-0.842-0.106-0.968-0.518c-0.127-0.413,0.106-0.842,0.518-0.969c3.633-1.104,8.146-0.568,11.23,1.328C18.154,12.857,18.27,13.335,17.81,13.7z M17.914,10.773c-3.228-1.912-8.55-2.089-11.618-1.156c-0.495,0.15-1.016-0.129-1.166-0.624c-0.15-0.495,0.129-1.016,0.624-1.166c3.511-1.067,9.395-0.857,13.111,1.346c0.443,0.263,0.59,0.835,0.327,1.277C18.928,10.892,18.357,11.036,17.914,10.773z"/></svg> {active==='spotify'?'Close player':'Listen on Spotify'}</button>}
 {work.playlist&&<button className="platform-btn" onClick={()=>setActive(active==='youtube'?null:'youtube')}><svg viewBox="0 0 24 24"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M9.996,15.005l0-6.01l5.518,3.005L9.996,15.005z"/></svg> {active==='youtube'?'Close player':'Play on YouTube'}</button>}
 </div>
 {active&&<><iframe key={active} className={'release-player '+active} title={`${work.title} ${work.subtitle} — ${active}`} src={active==='youtube'?'https://www.youtube-nocookie.com/embed/videoseries?list='+work.playlist:work.spotify!.replace('open.spotify.com/','open.spotify.com/embed/')+'?theme=0'} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowFullScreen/><p className="embed-help">If playback is unavailable, <a href={active==='youtube'?'https://www.youtube.com/playlist?list='+work.playlist:work.spotify} target="_blank" rel="noreferrer">open {active==='youtube'?'YouTube':'Spotify'} ↗</a></p></>}
 </div>;
}
