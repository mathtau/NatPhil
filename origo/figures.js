/* ORIGO · figures.js — Layer 2: reusable math-diagram + art components.
   Used by BOTH the live game scene and the (coming) book page. Pure draw fns on a 2D ctx. */
(function(){
const FIG = {};

/* ---- palette ---- */
FIG.C = { gold:'#f4c830', goldDk:'#c89a1e', green:'#50d890', blue:'#5a9bff', orange:'#f0a040', red:'#ff6a4d',
  purple:'#b070f0', text:'#9a9ab8', ledge:'#1f5a36', ledgeTop:'#50d890', chasm:'#070712', post:'#5a4a72',
  plank:{1:'#5a9bff',2:'#50d890',3:'#f4c830',4:'#f0a040',5:'#f0a040',6:'#c79bff'} };

/* ---- the BULL (Taurus/Tau): one detailed gold head emblem, used by BOTH the avatar (inline SVG) and the mount (rasterized to canvas). ---- */
FIG.tauBull = function(mood, age){ mood=mood||'open'; age=age||'calf';   // age hook: 'calf' now; 'young'/'adult' grow later
  const eyes = mood==='happy'
    ? '<path d="M31 49 Q37 42 43 49" class="ey"/><path d="M57 49 Q63 42 69 49" class="ey"/>'
    : mood==='sad'
    ? '<path d="M31 51 Q37 57 43 51" class="ey"/><path d="M57 51 Q63 57 69 51" class="ey"/>'
    : '<ellipse cx="37" cy="49" rx="5.2" ry="6.2" fill="#241a05"/><ellipse cx="63" cy="49" rx="5.2" ry="6.2" fill="#241a05"/>'
     +'<circle cx="37" cy="49.6" r="2.6" fill="#b98c18"/><circle cx="63" cy="49.6" r="2.6" fill="#b98c18"/>'
     +'<circle cx="38.8" cy="47" r="1.7" fill="#fff7e0"/><circle cx="64.8" cy="47" r="1.7" fill="#fff7e0"/>';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs>'
   +'<linearGradient id="hd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a0"/><stop offset=".5" stop-color="#f4c830"/><stop offset="1" stop-color="#c2900f"/></linearGradient>'
   +'<radialGradient id="mz" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#fff1c8"/><stop offset="1" stop-color="#e3ad28"/></radialGradient>'
   +'<linearGradient id="nb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0c4"/><stop offset="1" stop-color="#c8920f"/></linearGradient>'
   +'<linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff7e0"/><stop offset=".5" stop-color="#e8b53a"/><stop offset="1" stop-color="#946f10"/></linearGradient>'
   +'<radialGradient id="gl" cx="50%" cy="46%" r="56%"><stop offset="0" stop-color="rgba(244,200,48,.22)"/><stop offset="1" stop-color="rgba(244,200,48,0)"/></radialGradient>'
   +'<radialGradient id="ck" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="rgba(255,150,120,.5)"/><stop offset="1" stop-color="rgba(255,150,120,0)"/></radialGradient>'
   +'<style>.ey{fill:none;stroke:#241a05;stroke-width:3.6;stroke-linecap:round}</style></defs>'
   +'<circle cx="50" cy="50" r="50" fill="url(#gl)"/>'
   +'<path d="M28 42 C 13 36 4 44 9 55 C 21 57 29 49 33 43 Z" fill="#e0a81e" stroke="#8a6410" stroke-width="1"/>'
   +'<path d="M72 42 C 87 36 96 44 91 55 C 79 57 71 49 67 43 Z" fill="#e0a81e" stroke="#8a6410" stroke-width="1"/>'
   +'<path d="M21 45 C 15 47 13 52 17 54 C 22 53 25 48 26 45 Z" fill="#a9781a"/>'
   +'<path d="M79 45 C 85 47 87 52 83 54 C 78 53 75 48 74 45 Z" fill="#a9781a"/>'
   +'<path d="M40 27 C 38 19 47 18 47 26 C 47 30 41 31 40 27 Z" fill="url(#nb)" stroke="#9c7412" stroke-width="0.8"/>'
   +'<path d="M60 27 C 62 19 53 18 53 26 C 53 30 59 31 60 27 Z" fill="url(#nb)" stroke="#9c7412" stroke-width="0.8"/>'
   +'<path d="M24 41 C 24 30 35 25 50 25 C 65 25 76 30 76 41 C 78 51 74 61 66 67 C 60 71 55 73 50 73 C 45 73 40 71 34 67 C 26 61 22 51 24 41 Z" fill="url(#hd)" stroke="#8a6410" stroke-width="1.6"/>'
   +'<path d="M47 28 C 45 23 51 21 52 26 C 53 29 49 31 47 28 Z" fill="#d9a51c" stroke="#a9821f" stroke-width="0.6"/>'
   +'<ellipse cx="30" cy="58" rx="5" ry="3.5" fill="url(#ck)"/><ellipse cx="70" cy="58" rx="5" ry="3.5" fill="url(#ck)"/>'
   + eyes
   +'<path d="M39 57 C 39 52 61 52 61 57 C 62 64 56 68 50 68.5 C 44 68 38 64 39 57 Z" fill="url(#mz)" stroke="#8a6410" stroke-width="1.3"/>'
   +'<path d="M45 65 C 47.5 66.5 52.5 66.5 55 65" fill="none" stroke="#8a6410" stroke-width="1.2" stroke-linecap="round"/>'
   +'<ellipse cx="45.5" cy="60" rx="1.5" ry="1.9" fill="#5a3f08"/><ellipse cx="54.5" cy="60" rx="1.5" ry="1.9" fill="#5a3f08"/>'
   +'<circle cx="50" cy="69.5" r="4" fill="none" stroke="url(#rg)" stroke-width="2.4"/>'
   +'<path d="M46.4 68 A4 4 0 0 1 53.6 67.5" fill="none" stroke="#fff7e0" stroke-width="0.8" opacity=".55"/>'
   +'</svg>';
};
FIG._bimg={};
function bullImg(mood){ if(FIG._bimg[mood]) return FIG._bimg[mood]; const i=new Image();
  i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(FIG.tauBull(mood)); FIG._bimg[mood]=i; return i; }
try{ ['open','happy','sad'].forEach(bullImg); }catch(_){}
FIG.bull = function(ctx, cx, cy, size, opt){ opt=opt||{}; const mood=opt.mood||'open';
  ctx.save();
  ctx.fillStyle='rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(cx,cy+size*0.46,size*0.30,size*0.055,0,0,7); ctx.fill();   // shadow
  // simple gold body + legs so the head reads as a standing mount
  const byc=cy+size*0.24, bg=ctx.createLinearGradient(0,byc-size*0.16,0,byc+size*0.16);
  bg.addColorStop(0,'#f4c830'); bg.addColorStop(1,'#bd8c12');
  ctx.strokeStyle='#9c7412'; ctx.lineCap='round'; ctx.lineWidth=size*0.075;
  [-0.13,-0.045,0.045,0.13].forEach(o=>{ ctx.beginPath(); ctx.moveTo(cx+size*o,byc+size*0.05); ctx.lineTo(cx+size*o,cy+size*0.46); ctx.stroke(); });
  ctx.fillStyle=bg; ctx.strokeStyle='#8a6410'; ctx.lineWidth=Math.max(1,size*0.022);
  ctx.beginPath(); ctx.ellipse(cx,byc,size*0.27,size*0.155,0,0,7); ctx.fill(); ctx.stroke();
  // detailed head emblem on top (mirrored if facing left)
  if(opt.face==='left'){ ctx.translate(cx,0); ctx.scale(-1,1); ctx.translate(-cx,0); }
  const hs=size*1.16, img=bullImg(mood);
  if(img.complete && img.naturalWidth){ try{ ctx.drawImage(img, cx-hs/2, cy-hs*0.60, hs, hs); }catch(_){ } }
  ctx.restore();
};

/* ---- grass clump (replaces 🌿): mound + gradient blades + a small flower ---- */
FIG.grass = function(ctx, x, y, size){ size=size||22; const u=size/22; ctx.save(); ctx.translate(x,y);
  const mg=ctx.createLinearGradient(0,-2*u,0,7*u); mg.addColorStop(0,'#3c7d50'); mg.addColorStop(1,'#1d4a2e');   // mound
  ctx.fillStyle=mg; ctx.beginPath(); ctx.ellipse(0,4.5*u,12*u,5*u,0,0,7); ctx.fill();
  const blades=[[-9,-10,-11],[-5,-15,-6],[-1,-19,-1],[3,-16,5],[8,-11,10],[-3,-13,-3],[5,-13,6]];
  blades.forEach((b,i)=>{ const gx=b[0]*u, ty=b[1]*u, tx=b[2]*u;
    const bg=ctx.createLinearGradient(0,4*u,0,ty); bg.addColorStop(0,'#2e6a3f'); bg.addColorStop(1,'#80e6a0');
    ctx.strokeStyle=bg; ctx.lineWidth=(2.5-(i%2)*0.7)*u; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(gx,4.5*u); ctx.quadraticCurveTo((gx+tx)/2-2*u, ty*0.5, tx, ty); ctx.stroke(); });
  ctx.fillStyle=FIG.C.gold; ctx.beginPath(); ctx.arc(6.5*u,-12*u,2.3*u,0,7); ctx.fill();                     // flower
  ctx.fillStyle='#fff3cf'; ctx.beginPath(); ctx.arc(6.5*u,-12*u,0.9*u,0,7); ctx.fill();
  ctx.restore();
};

/* ---- drifting fog band (atmosphere for the chasm) ---- */
FIG.fog = function(ctx, x0, x1, yTop, yBot, t){ t=t||0; ctx.save();
  const g=ctx.createLinearGradient(0,yTop,0,yBot); g.addColorStop(0,'rgba(150,120,185,0)'); g.addColorStop(1,'rgba(120,95,170,.34)');
  ctx.fillStyle=g; ctx.fillRect(x0,yTop,x1-x0,yBot-yTop);
  ctx.globalCompositeOperation='lighter';
  for(let i=0;i<4;i++){ const px=x0+((x1-x0)*((i/4)+0.08*Math.sin(t/1400+i)) ); const py=yTop+(yBot-yTop)*(0.45+0.18*Math.cos(t/1700+i*1.7));
    const r=(x1-x0)*0.16; const rg=ctx.createRadialGradient(px,py,2,px,py,r); rg.addColorStop(0,'rgba(160,135,200,.16)'); rg.addColorStop(1,'rgba(160,135,200,0)');
    ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(px,py,r,0,7); ctx.fill(); }
  ctx.restore();
};

/* ---- ledges + chasm + grassy tops, given pixel x of gap start/end ---- */
FIG.terrain = function(ctx, x0, gapStart, gapEnd, x1, baseY, botY){
  ctx.fillStyle=FIG.C.chasm; ctx.fillRect(gapStart,baseY+6,gapEnd-gapStart,botY-baseY);
  ctx.fillStyle=FIG.C.ledge; ctx.fillRect(x0,baseY+6,gapStart-x0,botY-baseY); ctx.fillRect(gapEnd,baseY+6,x1-gapEnd,botY-baseY);
  ctx.fillStyle=FIG.C.ledgeTop; ctx.fillRect(x0,baseY+2,gapStart-x0,5); ctx.fillRect(gapEnd,baseY+2,x1-gapEnd,5);
};
FIG.post = function(ctx, x, baseY, botY){ ctx.fillStyle=FIG.C.post; ctx.fillRect(x-5,baseY+4,10,botY-baseY-4); };
FIG.flag = function(ctx, x, baseY, h){ ctx.strokeStyle=FIG.C.gold; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(x,baseY); ctx.lineTo(x,baseY-h); ctx.stroke();
  ctx.fillStyle=FIG.C.gold; ctx.beginPath(); ctx.moveTo(x,baseY-h); ctx.lineTo(x+22,baseY-h+8); ctx.lineTo(x,baseY-h+15); ctx.closePath(); ctx.fill(); };

/* ---- a row of value-planks laid from a start value ---- */
FIG.plankRow = function(ctx, PX, fromV, arr, baseY, h){ h=h||16; let acc=fromV;
  arr.forEach(v=>{ const x0=PX(acc), x1=PX(acc+v); ctx.fillStyle=FIG.C.plank[v]||'#888';
    rr(ctx,x0+2,baseY-h+4,(x1-x0)-4,h,5); ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.62)'; ctx.font='bold 13px "IBM Plex Mono",monospace'; ctx.textAlign='center'; ctx.textBaseline='alphabetic';
    ctx.fillText(v,(x0+x1)/2,baseY+1); acc+=v; }); return acc; };

/* ---- number line: dots + integer labels 0..vmax ---- */
FIG.numberLine = function(ctx, PX, vmax, baseY){ for(let i=0;i<=vmax;i++){ ctx.fillStyle='rgba(255,122,92,.7)'; ctx.beginPath(); ctx.arc(PX(i),baseY,3,0,7); ctx.fill();
  ctx.fillStyle=FIG.C.text; ctx.font='12px "IBM Plex Mono",monospace'; ctx.textAlign='center'; ctx.textBaseline='alphabetic'; ctx.fillText(i,PX(i),baseY+24); } };

/* ---- area grid (for multiplication, q2) : cols×rows of unit cells ---- */
FIG.areaGrid = function(ctx, x, y, cell, cols, rows, col){ col=col||FIG.C.green; ctx.save();
  ctx.fillStyle=col.replace(')',',.18)').replace('rgb','rgba'); for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){ const cx=x+c*cell, cy=y+r*cell;
    ctx.fillStyle=col+'2e'; ctx.fillRect(cx+1,cy+1,cell-2,cell-2); ctx.strokeStyle=col; ctx.lineWidth=1.5; ctx.strokeRect(cx+1,cy+1,cell-2,cell-2); }
  ctx.restore(); };

function rr(ctx,x,y,w,h,r){ ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath(); }
FIG.rr = rr;
window.FIG = FIG;
})();
