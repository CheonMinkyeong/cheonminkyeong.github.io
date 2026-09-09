import {readFile,writeFile,mkdir,readdir,copyFile} from 'node:fs/promises';
const root='dist/client';
const entries=await readdir(`${root}/works`);
const paths=[];
for(const file of entries.filter(f=>f.endsWith('.html'))){const id=file.slice(0,-5);await mkdir(`${root}/works/${id}`,{recursive:true});await copyFile(`${root}/works/${file}`,`${root}/works/${id}/index.html`);paths.push(`/works/${id}/`);}
await writeFile(`${root}/.nojekyll`,'');
await writeFile(`${root}/robots.txt`,'User-agent: *\nAllow: /\nSitemap: https://cheonminkyeong.github.io/sitemap.xml\n');
await writeFile(`${root}/sitemap.xml`,'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+['/',...paths].map(p=>`<url><loc>https://cheonminkyeong.github.io${p}</loc></url>`).join('')+'</urlset>');
const html=await readFile(`${root}/index.html`,'utf8');
if(!html.includes('Cheon')||paths.length!==6)throw new Error('Incomplete Pages export');
console.log('GitHub Pages: home, 6 work pages, 404, robots and sitemap ready.');
