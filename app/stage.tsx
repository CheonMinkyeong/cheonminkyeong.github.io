'use client';
import { useEffect, useRef, useState } from 'react';

export default function Stage(){
 const host=useRef<HTMLDivElement>(null);
 const [ready,setReady]=useState(false);
 const [paused,setPaused]=useState(false);
 const pausedRef=useRef(false);
 useEffect(()=>{pausedRef.current=paused},[paused]);
 useEffect(()=>{
  let disposed=false, cleanup=()=>{};
  import('three').then(async THREE=>{
   if(disposed||!host.current)return;
   const el=host.current;
   let renderer:InstanceType<typeof THREE.WebGLRenderer>;
   try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});}catch{return;}
   renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
   renderer.setClearColor(0x08090a,0);
   renderer.outputColorSpace=THREE.SRGBColorSpace;
   el.appendChild(renderer.domElement);
   const scene=new THREE.Scene();
   const camera=new THREE.PerspectiveCamera(40,1,.1,50);
   camera.position.set(0,0,10);
   const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
   const world=new THREE.Group();scene.add(world);
   const textureLoader=new THREE.TextureLoader();
   const textures:InstanceType<typeof THREE.Texture>[]=[];
   const geometries:InstanceType<typeof THREE.BufferGeometry>[]=[];
   const materials:InstanceType<typeof THREE.Material>[]=[];
   let frame=0,visible=true,assetsReady=false,last=0,time=0,mobile=false;
   const pointer={x:0,y:0};
   const getTexture=async(name:string)=>{const t=await textureLoader.loadAsync('/images/'+name+'.webp');t.colorSpace=THREE.SRGBColorSpace;textures.push(t);return t;};
   const portraitGeo=new THREE.PlaneGeometry(1,1);geometries.push(portraitGeo);
   const portraitMat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{photo:{value:null},time:{value:0}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`uniform sampler2D photo; uniform float time; varying vec2 vUv;
    void main(){vec4 c=texture2D(photo,vUv);float mono=dot(c.rgb,vec3(.299,.587,.114));c.rgb=mix(c.rgb,vec3(mono),.35);
    float edge=smoothstep(0.,.14,vUv.x)*smoothstep(0.,.14,1.-vUv.x)*smoothstep(0.,.14,vUv.y)*smoothstep(0.,.10,1.-vUv.y);
    float passage=-.3+time*.34;float light=exp(-pow((vUv.x+vUv.y*.23-passage)*10.,2.))*.75*(1.-smoothstep(4.8,5.4,time));
    c.rgb*=.78+light;c.rgb+=vec3(.10,.085,.065)*light;gl_FragColor=vec4(c.rgb,edge*.95);}`});materials.push(portraitMat);
   const portrait=new THREE.Mesh(portraitGeo,portraitMat);world.add(portrait);
   const cards:InstanceType<typeof THREE.Mesh>[]=[];
   const segments=220,positions=new Float32Array((segments+1)*2*3),uvs=new Float32Array((segments+1)*2*2),indices:number[]=[];
   for(let i=0;i<=segments;i++){for(let j=0;j<2;j++){uvs[(i*2+j)*2]=i/segments;uvs[(i*2+j)*2+1]=j;}if(i<segments){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}}
   const ribbonGeo=new THREE.BufferGeometry();ribbonGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));ribbonGeo.setAttribute('uv',new THREE.BufferAttribute(uvs,2));ribbonGeo.setIndex(indices);geometries.push(ribbonGeo);
   const ribbonMat=new THREE.ShaderMaterial({side:THREE.DoubleSide,transparent:true,uniforms:{time:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 vUv;uniform float time;void main(){float edge=pow(abs(vUv.y-.5)*2.,12.);float shine=pow(max(0.,sin(vUv.x*18.+time*.2)),9.);float shade=.16+.18*sin(vUv.x*14.+vUv.y*2.)+shine*.65+edge*.65;vec3 silver=mix(vec3(.35,.40,.44),vec3(.92,.91,.85),clamp(shade,0.,1.));float alpha=.50+edge*.4;gl_FragColor=vec4(silver*max(.15,shade),alpha);}`});materials.push(ribbonMat);
   const ribbon=new THREE.Mesh(ribbonGeo,ribbonMat);ribbon.frustumCulled=false;world.add(ribbon);
   function layout(){
    const width=el.clientWidth,height=el.clientHeight;mobile=width<600;renderer.setPixelRatio(Math.min(window.devicePixelRatio,mobile?1:1.5));renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();
    const center=mobile?0:1.65;
    portrait.position.set(center,mobile?1.08:.32,-.8);portrait.scale.set(mobile?3.35:4.65,mobile?3.16:4.38,1);
    const slots=mobile?[[-1.24,2.2,.7,.81,.3,-.12],[1.2,1.67,.35,.86,-.32,.10],[1.20,.13,.4,.77,-.24,-.12],[-1.23,.61,.35,.9,.23,.08]]:[[-.30,2.05,.4,1.30,.30,-.10],[4.0,1.15,.5,1.42,-.34,.12],[3.85,-1.55,.85,1.22,-.25,-.09],[-.05,-1.78,.55,1.48,.25,.07]];
    cards.forEach((c,i)=>{const [x,y,z,w,ry,rz]=slots[i];const texture=(c.material as InstanceType<typeof THREE.MeshBasicMaterial>).map!;const img=texture.image as HTMLImageElement;const ratio=img.width/img.height;c.position.set(x,y,z);c.scale.set(w,w/ratio,1);c.rotation.set(.04,ry,rz);c.userData.baseY=y;});
    renderStill();
   }
   function update(){
    portraitMat.uniforms.time.value=time;
    ribbonMat.uniforms.time.value=time;
    // Span the viewport instead of only circling the portrait.
    const halfHeight=Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.position.z;
    const center=mobile?0:.25,cy=mobile?.45:.05,rx=halfHeight*camera.aspect*1.04,ry=halfHeight*(mobile?.82:.86);
    for(let i=0;i<=segments;i++){const t=i/segments*Math.PI*2;const width=.12+.25*(.5+.5*Math.sin(t*2+time*.22));for(let j=0;j<2;j++){const side=(j-.5)*width;const k=(i*2+j)*3;positions[k]=center+Math.cos(t)*(rx+side)+Math.sin(t*2+time*.24)*.055;positions[k+1]=cy+Math.sin(t)*ry+Math.cos(t)*.36+side*Math.sin(t+time*.2);positions[k+2]=Math.sin(t)*1.45+side*Math.cos(t*2+time*.3)+Math.sin(t*3+time*.25)*.09;}}
    ribbonGeo.attributes.position.needsUpdate=true;
    cards.forEach((c,i)=>{c.position.y=c.userData.baseY+Math.sin(time*.38+i*1.5)*.035;});
    world.rotation.y+=(pointer.x*.035-world.rotation.y)*.045;world.rotation.x+=(-pointer.y*.02-world.rotation.x)*.045;
   }
   function renderStill(){update();renderer.render(scene,camera);}
   function animate(now:number){frame=0;if(disposed||!visible||document.hidden)return;const step=now-last;if(step>=32){if(!pausedRef.current&&!reduced.matches){time+=Math.min(step,66)/1000;renderStill();}last=now;}frame=requestAnimationFrame(animate);}
   function start(){if(!frame&&assetsReady&&visible&&!document.hidden) {last=performance.now();frame=requestAnimationFrame(animate);}}
   const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else{cancelAnimationFrame(frame);frame=0;}},{threshold:.01});observer.observe(el);
   const onVisibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();};document.addEventListener('visibilitychange',onVisibility);
   const resize=new ResizeObserver(layout);resize.observe(el);
   const onPointer=(event:PointerEvent)=>{if(event.pointerType==='touch'||reduced.matches)return;const box=el.getBoundingClientRect();pointer.x=(event.clientX-box.left)/box.width*2-1;pointer.y=(event.clientY-box.top)/box.height*2-1;};
   const onLeave=()=>{pointer.x=pointer.y=0;};
   el.parentElement?.addEventListener('pointermove',onPointer);el.parentElement?.addEventListener('pointerleave',onLeave);
   const onLost=(e:Event)=>{e.preventDefault();setReady(false);cancelAnimationFrame(frame);frame=0;};renderer.domElement.addEventListener('webglcontextlost',onLost);
   cleanup=()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',onVisibility);el.parentElement?.removeEventListener('pointermove',onPointer);el.parentElement?.removeEventListener('pointerleave',onLeave);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();};
   try{
    const all=await Promise.all(['main-portrait','reuben-1','four-winds','reuben-2','artwork'].map(getTexture));
    if(disposed){all.forEach(t=>t.dispose());return;}
    portraitMat.uniforms.photo.value=all[0];
    all.slice(1).forEach(texture=>{const g=new THREE.PlaneGeometry(1,1);const m=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide,color:0xd3d0c8});geometries.push(g);materials.push(m);const card=new THREE.Mesh(g,m);cards.push(card);world.add(card);});
    assetsReady=true;if(reduced.matches)time=6;layout();setReady(true);start();
   }catch{setReady(false);cleanup();}
  }).catch(()=>{});
  return()=>{disposed=true;cleanup();};
 },[]);
 return <><div ref={host} className={'stage-canvas '+(ready?'is-ready':'')} aria-hidden="true"/>{ready&&<button className="motion-control" onClick={()=>setPaused(p=>!p)} aria-pressed={paused}>{paused?'▶ Motion paused':'Ⅱ Pause motion'}</button>}</>;
}
