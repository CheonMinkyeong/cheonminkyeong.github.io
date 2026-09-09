'use client';
import {useState} from 'react';
import type {Work} from './works-data';
export default function WorkListen({work}:{work:Work}){
 const [active,setActive]=useState<'youtube'|'spotify'|null>(null);
 return <div className="work-listen">
 <div className="release-actions">
 {work.playlist&&<><button className="text-link" onClick={()=>setActive(active==='youtube'?null:'youtube')}>{active==='youtube'?'Close player':'Play playlist'} ▷</button><a className="text-link" href={'https://www.youtube.com/playlist?list='+work.playlist} target="_blank" rel="noreferrer">View playlist ↗</a></>}
 {work.spotify&&<><button className="text-link" onClick={()=>setActive(active==='spotify'?null:'spotify')}>{active==='spotify'?'Close player':'Listen on Spotify'} ▷</button><a className="text-link" href={work.spotify} target="_blank" rel="noreferrer">{work.spotify.includes('/artist/')?'EleaMusic on Spotify':'Open Spotify'} ↗</a></>}
 {work.channel&&<a className="text-link" href={work.channel} target="_blank" rel="noreferrer">YouTube channel ↗</a>}
 </div>
 {active&&<><iframe key={active} className={'release-player '+active} title={`${work.title} ${work.subtitle} — ${active}`} src={active==='youtube'?'https://www.youtube-nocookie.com/embed/videoseries?list='+work.playlist:work.spotify!.replace('open.spotify.com/','open.spotify.com/embed/')+'?theme=0'} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowFullScreen/><p className="embed-help">If playback is unavailable here, use the platform links above.</p></>}
 </div>;
}
