export type Work = {id:string;title:string;subtitle:string;image:string;kind:string;description:string;playlist?:string;spotify?:string;channel?:string;production?:boolean};
// Stable IDs keep existing links valid when the display order changes.
export const works:Work[] = [
 {id:'four-winds',title:'The Four Winds',subtitle:'Vol. 1',image:'four-winds.webp',kind:'The Four Winds',description:'The Four Winds · Vol. 1.',playlist:'PLzm5i-6zRjVZmUhz2ddxh9WIDINQaoVj3',channel:'https://www.youtube.com/@thefourwinds5737'},
 {id:'four-winds-2',title:'The Four Winds',subtitle:'Vol. 2',image:'four-winds-2.webp',kind:'The Four Winds',description:'Cheon Minkyeong — Guitar · Nishimori Daisuke — Saxophone.',playlist:'PLY5SIXMCVELE',spotify:'https://open.spotify.com/album/4Z73rfzoJZTNK96i0xyU8f',channel:'https://www.youtube.com/@thefourwinds5737'},
 {id:'reuben-1',title:'Reuben Project',subtitle:'Vol. 1',image:'reuben-1.webp',kind:'Reuben Project',description:'Reuben Project · Vol. 1.',playlist:'PLUMwKrPl2nLE',channel:'https://www.youtube.com/@reuben1107'},
 {id:'reuben-2',title:'Reuben Project',subtitle:'Vol. 2',image:'reuben-2.webp',kind:'Reuben Project',description:'Reuben Project · Vol. 2.',playlist:'PLHBw33w7-6qM',channel:'https://www.youtube.com/@reuben1107'},
 {id:'artwork',title:'Two Sides',subtitle:'Minkyeong Cheon & Ruud Ouwehand',image:'artwork.webp',kind:'EleaMusic',description:'Two Sides — Minkyeong Cheon & Ruud Ouwehand. Explore the music on the EleaMusic channel and artist page.',spotify:'https://open.spotify.com/artist/3HseuAz512ng1JkjhT3bG7',channel:'https://www.youtube.com/@EleaMusicTS'},
 {id:'casting-the-net',title:'Casting the Net',subtitle:'ICF Enschede Praise',image:'casting-the-net.webp',kind:'Production',production:true,description:'ICF Enschede Praise. Produced by Cheon Minkyeong.',playlist:'PLPRZiBDd1QL4',spotify:'https://open.spotify.com/album/63ddq0x3eFggm9fUsXBKUx'},
];
export const mainWorks=works.filter(w=>!w.production);
export const heroWorks=['reuben-1','four-winds','reuben-2','artwork'].map(id=>works.find(w=>w.id===id)!);
