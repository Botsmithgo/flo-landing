import { ImageResponse } from 'next/og.js';
import { createElement as h } from 'react';
import { readFileSync, writeFileSync } from 'node:fs';

// Layout artwork from the approved, unmodified FLO product photograph.
// Usage: node scripts/generate-social-card.mjs '/path/to/Flo background.png'
const photo = `data:image/png;base64,${readFileSync(process.argv[2]).toString('base64')}`;
const logo = `data:image/png;base64,${readFileSync('public/logo.png').toString('base64')}`;
const serif = readFileSync('/System/Library/Fonts/Supplemental/Georgia.ttf');
const sans = readFileSync('/System/Library/Fonts/Supplemental/Arial.ttf');
const img = new ImageResponse(h('div', {style:{display:'flex',width:'100%',height:'100%',background:'#f5efe5',color:'#243c4c',position:'relative'}},
  h('img',{src:photo,width:1200,height:500,style:{position:'absolute',top:130,left:0}}),
  h('img',{src:logo,width:245,height:60,style:{position:'absolute',left:64,top:57}}),
  h('div',{style:{position:'absolute',right:64,top:77,fontFamily:'Arial',fontSize:16,letterSpacing:3}},'THE FILTERED SHOWER HEAD'),
  h('div',{style:{position:'absolute',left:64,top:223,display:'flex',flexDirection:'column',fontFamily:'Georgia',fontSize:82,letterSpacing:-4,lineHeight:1.06}},
    h('span',{},'Your daily'),h('span',{},'reset.')),
  h('div',{style:{position:'absolute',left:68,top:424,fontFamily:'Arial',fontSize:22,color:'#425968'}},'A little more Om in every shower.'),
  h('div',{style:{position:'absolute',left:68,bottom:51,fontFamily:'Arial',fontSize:17,letterSpacing:1}},'feelslikeom.shop')
),{width:1200,height:630,fonts:[{name:'Georgia',data:serif,weight:400},{name:'Arial',data:sans,weight:400}]});
writeFileSync('public/social/flo-daily-reset-v2.png',Buffer.from(await img.arrayBuffer()));
console.log('Created public/social/flo-daily-reset-v2.png (1200 × 630)');
