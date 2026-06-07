/* ORIGO · book.js — renders a real BOOK page (faithful to MathO) with HAND-DRAWN, VECTOR (SVG) diagrams.
   Hand-drawn look (wobbly strokes + Caveat font) is deliberate: it invites readers to draw their own.
   SVG (not canvas) so the page prints/exports to PDF crisply at any resolution. */
(function(){
const R='#e8402e', B='#2f74d0', G='#2faa4e', INK='#5a564c', AX='#6f6a5e';
const COL={1:R,2:B,3:G};
const rnd=()=>Math.random();
/* hand-drawn primitives → SVG fragment strings (jitter baked once) */
function sLine(x1,y1,x2,y2,col,w){ const L=Math.hypot(x2-x1,y2-y1), n=Math.max(2,Math.round(L/20)); let p=[];
  for(let i=0;i<=n;i++){ const t=i/n; let x=x1+(x2-x1)*t,y=y1+(y2-y1)*t; if(i&&i<n){x+=(rnd()-.5)*1.9;y+=(rnd()-.5)*1.9;} p.push(x.toFixed(1)+','+y.toFixed(1)); }
  return '<polyline points="'+p.join(' ')+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round" stroke-linejoin="round"/>'; }
function sDot(cx,cy,r,col){ return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+col+'"/>'; }
function sBox(cx,cy,s,col){ const h=s/2, d=((rnd()-.5)*4).toFixed(1);
  return '<g transform="translate('+cx+' '+cy+') rotate('+d+')"><rect x="'+(-h)+'" y="'+(-h)+'" width="'+s+'" height="'+s+'" rx="4" fill="'+col+'"/><circle r="2.3" fill="#ffffff" opacity=".9"/></g>'; }
function sText(t,x,y,col,sz){ return '<text x="'+x+'" y="'+y+'" font-family="Caveat,Patrick Hand,cursive" font-size="'+(sz||22)+'" fill="'+(col||INK)+'" text-anchor="middle" dominant-baseline="middle">'+t+'</text>'; }
function sSeg(xa,xb,y,col){ return sLine(xa,y,xb,y,col,5)+sDot(xa,y,3,col)+sDot(xb,y,3,col); }
function sAxis(x0,u,vmax,y){ let s=sLine(x0-7,y,x0+vmax*u+9,y,AX,1.8); for(let i=0;i<=vmax;i++){ const x=x0+i*u; s+=sLine(x,y-3.5,x,y+3.5,AX,1.5)+sText(i,x,y+12,AX,16);} return s; }
function sBrace(x0,u,a,b,y,col,label){ const xa=x0+a*u,xb=x0+b*u;
  return sLine(xa,y+5,xa,y,col,1.8)+sLine(xa,y,xb,y,col,1.8)+sLine(xb,y,xb,y+5,col,1.8)+sText(label,(xa+xb)/2,y-9,col,17); }

const GOLD='#e0a83a';
function sCell(x,y,c,col){ const d=((rnd()-.5)*3).toFixed(1); return '<g transform="translate('+(x+c/2)+' '+(y+c/2)+') rotate('+d+')"><rect x="'+(-c/2+1.5)+'" y="'+(-c/2+1.5)+'" width="'+(c-3)+'" height="'+(c-3)+'" rx="2.5" fill="'+col+'"/></g>'; }
function sGrid(x,y,c,cols,rows,col){ let s=''; for(let r=0;r<rows;r++)for(let k=0;k<cols;k++) s+=sCell(x+k*c,y+r*c,c,col); return s; }
function cEq(cx,cy,parts,sz){ sz=sz||18; let w=parts.reduce((a,p)=>a+p[0].length*sz*0.52,0), x=cx-w/2, s=''; parts.forEach(p=>{ const pw=p[0].length*sz*0.52; s+='<text x="'+(x+pw/2).toFixed(1)+'" y="'+cy+'" font-family="Caveat,cursive" font-size="'+sz+'" fill="'+p[1]+'" text-anchor="middle" dominant-baseline="middle">'+p[0]+'</text>'; x+=pw; }); return s; }
function pbrace(x1,x2,y,label){ return sLine(x1,y+5,x1,y,INK,1.6)+sLine(x1,y,x2,y,INK,1.6)+sLine(x2,y,x2,y+5,INK,1.6)+sText(label,(x1+x2)/2,y-8,INK,13); }
const FIGH={dots:48,bars:44,numline:52,commute:78,assoc:106, mjumps:88,marr:68,mrect:58,mrot:70,mdist:52,mgroups:104};   // each ≥ its lowest label so labels aren't clipped
const FIGS={
  dots(){ const s=24,y=30; return sBox(74,y,s,B)+sText('+',106,y,INK,30)
    +sBox(134,y,s,B)+sBox(166,y,s,B)+sText('=',198,y,INK,30)
    +sBox(228,y,s,B)+sBox(260,y,s,B)+sBox(292,y,s,B); },
  bars(){ const y=30; return sSeg(56,82,y,R)+sText('+',95,y,INK,30)+sSeg(110,162,y,B)+sText('=',176,y,INK,30)+sSeg(192,270,y,G); },
  numline(){ const x0=74,u=110,y=30; return sAxis(x0,u,3,y)+sSeg(x0,x0+u,y,R)+sSeg(x0+u,x0+3*u,y,B)
    +sText('1',x0+u*0.5,y-12,R,20)+sText('2',x0+2*u,y-12,B,20); },
  commute(){ const x0=74,u=110; return sAxis(x0,u,3,22)+sSeg(x0,x0+u,22,R)+sSeg(x0+u,x0+3*u,22,B)
    +sAxis(x0,u,3,58)+sSeg(x0,x0+2*u,58,B)+sSeg(x0+2*u,x0+3*u,58,R); },
  assoc(){ const x0=58,u=62; return sAxis(x0,u,6,34)+sSeg(x0,x0+u,34,R)+sSeg(x0+u,x0+3*u,34,B)+sSeg(x0+3*u,x0+6*u,34,G)+sBrace(x0,u,0,3,18,INK,'(1+2)')
    +sAxis(x0,u,6,84)+sSeg(x0,x0+u,84,R)+sSeg(x0+u,x0+3*u,84,B)+sSeg(x0+3*u,x0+6*u,84,G)+sBrace(x0,u,1,6,68,INK,'(2+3)'); },
  // ---- multiplication = area (p7 / Quest 2) ----
  marr(){ const c=20,ox=192,oy=4; return sGrid(ox,oy,c,3,2,'#2f74d0')+cEq(240,oy+2*c+16,[['2',R],[' × ',INK],['3',B],[' = ',INK],['6',G]],18); },
  mrect(){ const c=22,ox=200,oy=4; return sGrid(ox,oy,c,3,2,G)+sText('2',ox-12,oy+c,R,16)+sText('3',ox+1.5*c,oy-9,B,16)+cEq(ox+3*c+34,oy+c,[['= 6',G]],18); },
  mrot(){ const c=18; return sGrid(150,8,c,3,2,G)+sText('=',250,8+c,INK,26)+sGrid(296,8,c,2,3,G); },
  // repeated addition on the number line → multiplication (leads in from p1's addition)
  mjumps(){ const x0=74,u=56,y=46; let s=sAxis(x0,u,6,y);
    for(let k=0;k<3;k++){ const xa=x0+k*2*u, xb=x0+(k+1)*2*u, mid=(xa+xb)/2;
      s+='<path d="M'+xa+' '+(y-3)+' Q '+mid+' '+(y-30)+' '+(xb-1)+' '+(y-4)+'" fill="none" stroke="'+B+'" stroke-width="2.4"/>';
      s+='<path d="M'+(xb-7)+' '+(y-9)+' L'+(xb-1)+' '+(y-4)+' L'+(xb-9)+' '+(y-2)+'" fill="none" stroke="'+B+'" stroke-width="2"/>';   // arrowhead
      s+=sText('+2',mid,y-24,B,15); }
    return s+cEq(x0+3*u,y+30,[['2 + 2 + 2',B],[' = ',INK],['3',R],['×',INK],['2',B],[' = ',INK],['6',G]],17); },
  // distributive: shapes in the SAME order as the equation a×(b+c) = a×b + a×c
  mdist(){ const c=18,oy=8, gb=2, gc=3;
    let s=sGrid(56,oy,c,gb,2,G)+sGrid(56+gb*c,oy,c,gc,2,GOLD);                       // one field a×(b+c)
    s+=sText('=',56+(gb+gc)*c+16,oy+c,INK,22);
    const rx=56+(gb+gc)*c+34;
    return s+sGrid(rx,oy,c,gb,2,G)+sText('+',rx+gb*c+9,oy+c,INK,22)+sGrid(rx+gb*c+20,oy,c,gc,2,GOLD); },   // a×b + a×c
  // associative: three factors make a 3D box (volume); group it either way, same 24
  mgroups(){ const ux=24,dy=19,zx=13,zy=-9, W=3,H=2,D=4, ox=150,oy=40;
    const X=(i,k)=>ox+i*ux+k*zx, Y=(j,k)=>oy+j*dy+k*zy, pt=(i,j,k)=>X(i,k).toFixed(1)+' '+Y(j,k).toFixed(1);
    const poly=(p,f)=>'<polygon points="'+p.map(q=>pt(q[0],q[1],q[2])).join(' ')+'" fill="'+f+'" stroke="#46423c" stroke-width="1.4" stroke-linejoin="round"/>';
    const ln=(a,b)=>'<line x1="'+X(a[0],a[2]).toFixed(1)+'" y1="'+Y(a[1],a[2]).toFixed(1)+'" x2="'+X(b[0],b[2]).toFixed(1)+'" y2="'+Y(b[1],b[2]).toFixed(1)+'" stroke="#46423c" stroke-width="1" opacity=".45"/>';
    let s=poly([[0,0,0],[W,0,0],[W,0,D],[0,0,D]],'rgba(120,225,165,.5)')          // top
         +poly([[W,0,0],[W,H,0],[W,H,D],[W,0,D]],'rgba(50,150,80,.6)')            // right
         +poly([[0,0,0],[W,0,0],[W,H,0],[0,H,0]],'rgba(95,205,140,.85)');         // front
    for(let i=1;i<W;i++) s+=ln([i,0,0],[i,H,0]); for(let j=1;j<H;j++) s+=ln([0,j,0],[W,j,0]);   // front grid
    for(let k=1;k<D;k++) s+=ln([W,0,k],[W,H,k]); for(let j=1;j<H;j++) s+=ln([W,j,0],[W,j,D]);   // right grid
    for(let i=1;i<W;i++) s+=ln([i,0,0],[i,0,D]); for(let k=1;k<D;k++) s+=ln([0,0,k],[W,0,k]);   // top grid
    s+=sText('3',(X(0,0)+X(W,0))/2,Y(H,0)+15,B,18)+sText('2',X(0,0)-11,(Y(0,0)+Y(H,0))/2,R,18)+sText('4',(X(W,0)+X(W,D))/2+9,(Y(0,0)+Y(0,D))/2-4,G,18);
    return s+cEq(X(W,D)+54,Y(H,0)-4,[['= 24',G]],20); }
};
function figSVG(name){ const W=480,H=FIGH[name]||70; return '<svg class="bkfig" viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg">'+FIGS[name]()+'</svg>'; }
function colorEq(s){ return s.replace(/\d/g,d=>'<span style="color:'+(COL[+d]||INK)+'">'+d+'</span>'); }

const BOOK={};
/* ---- PNG export: rasterize the page (SVG figures + text) via an <svg><foreignObject> snapshot ---- */
function ab2b64(buf){ let s='',a=new Uint8Array(buf); for(let i=0;i<a.length;i++) s+=String.fromCharCode(a[i]); return btoa(s); }
function pageCSS(){ let out=''; const want=['.page','.bkh','.kick','.ttl','.bkrow','.bkfig','.bklaw','.bkeq','.bknote','.corner','.mathtau','.pno','.q','.len'];
  for(const ss of document.styleSheets){ let rules; try{ rules=ss.cssRules; }catch(_){ continue; } if(!rules) continue;
    for(const r of rules){ if(r.selectorText && want.some(w=>r.selectorText.indexOf(w)>=0)) out+=r.cssText+'\n'; } } return out; }
async function embedFont(url){ try{ const css=await fetch(url).then(r=>r.text());
    if(!/@font-face/.test(css)) return '';                                   // not real CSS (error page) → skip, don't corrupt the SVG
    const urls=[...css.matchAll(/url\((https:[^)]+\.woff2)\)/g)].map(m=>m[1]); const map={};
    await Promise.all(urls.map(async u=>{ try{ map[u]=ab2b64(await fetch(u).then(r=>r.arrayBuffer())); }catch(_){ } }));
    return css.replace(/url\((https:[^)]+\.woff2)\)/g,(m,u)=> map[u]?'url(data:font/woff2;base64,'+map[u]+')':'url()')+'\n';   // never leave an external url
  }catch(_){ return ''; } }
async function fontCSS(text){   // embed Caveat + Patrick Hand + Ma Shan Zheng, ALL subset (&text) to the page's chars so the data-URI stays small
  const uniq=[...new Set(text||'')].join('');
  let out=await embedFont('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Patrick+Hand&display=swap'+(uniq?'&text='+encodeURIComponent(uniq):''));
  const cn=[...new Set((text||'').replace(/[^一-鿿]/g,''))].join('');
  if(cn) out+=await embedFont('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&text='+encodeURIComponent(cn));
  return out; }
BOOK._renderCanvas=async function(pageEl, scale){ scale=scale||2;
  const W=pageEl.offsetWidth, H=pageEl.offsetHeight;          // border-box incl. padding (scrollWidth clipped the padded edge)
  const clone=pageEl.cloneNode(true); clone.style.boxShadow='none'; clone.style.margin='0'; clone.style.width=W+'px';
  const xml=new XMLSerializer().serializeToString(clone);
  const fc=BOOK._noFonts?'':(await fontCSS(pageEl.textContent).catch(()=>''));
  const mk=fonts=>'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'"><foreignObject x="0" y="0" width="'+W+'" height="'+H+'"><div xmlns="http://www.w3.org/1999/xhtml"><style>*{box-sizing:border-box;margin:0;padding:0;}'+fonts+pageCSS()+'</style>'+xml+'</div></foreignObject></svg>');
  const load=src=>new Promise((res,rej)=>{ const im=new Image(); im.onload=()=>res(im); im.onerror=rej; im.src=src; });
  let img; try{ img=await load(mk(fc)); }catch(_){ img=await load(mk('')); }   // if embedded fonts make the data-URI too big/broken, fall back to system fonts
  const c=document.createElement('canvas'); c.width=Math.round(W*scale); c.height=Math.round(H*scale); const x=c.getContext('2d');
  x.fillStyle='#fdfcf6'; x.fillRect(0,0,c.width,c.height); x.setTransform(scale,0,0,scale,0,0); x.drawImage(img,0,0);
  c._W=W; c._H=H; return c; };
BOOK.renderPNG=async function(pageEl, scale){ return (await BOOK._renderCanvas(pageEl,scale)).toDataURL('image/png'); };
BOOK.savePNG=async function(pageEl){ try{ const url=await BOOK.renderPNG(pageEl||document.getElementById('bookpage'));
  const a=document.createElement('a'); a.href=url; a.download='origo-addition-p'+(BOOK._page||1)+'.png'; document.body.appendChild(a); a.click(); a.remove(); }catch(e){ alert('PNG export failed: '+e.message); } };
/* build a one-page PDF (page sized to the content) with the rendered page embedded as a JPEG — no print dialog, no header/footer, no margins */
function buildJpegPDF(jpeg, imgW, imgH, wpt, hpt){
  const segs=[]; let pos=0; const xref=[0,0,0,0,0,0];
  const A=s=>{ const u=new Uint8Array(s.length); for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i)&0xff; segs.push(u); pos+=u.length; };
  const content='q '+wpt+' 0 0 '+hpt+' 0 0 cm /Im0 Do Q';
  A('%PDF-1.4\n%âãÏÓ\n');
  xref[1]=pos; A('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  xref[2]=pos; A('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  xref[3]=pos; A('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+wpt+' '+hpt+'] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n');
  xref[4]=pos; A('4 0 obj\n<< /Type /XObject /Subtype /Image /Width '+imgW+' /Height '+imgH+' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+jpeg.length+' >>\nstream\n'); segs.push(jpeg); pos+=jpeg.length; A('\nendstream\nendobj\n');
  xref[5]=pos; A('5 0 obj\n<< /Length '+content.length+' >>\nstream\n'+content+'\nendstream\nendobj\n');
  const xp=pos; let xr='xref\n0 6\n0000000000 65535 f \n'; for(let i=1;i<=5;i++) xr+=String(xref[i]).padStart(10,'0')+' 00000 n \n';
  A(xr); A('trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n'+xp+'\n%%EOF');
  let total=0; segs.forEach(u=>total+=u.length); const out=new Uint8Array(total); let o=0; segs.forEach(u=>{ out.set(u,o); o+=u.length; }); return out; }
BOOK._pdfBytes=async function(pageEl){ const c=await BOOK._renderCanvas(pageEl, 3);
  const durl=c.toDataURL('image/jpeg',0.95), bin=atob(durl.split(',')[1]); const jpeg=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) jpeg[i]=bin.charCodeAt(i);
  const wpt=595.28, hpt=Math.round(wpt*c.height/c.width*100)/100;   // A4 width; height follows the card's real ratio → never distorts even if content runs long
  return buildJpegPDF(jpeg, c.width, c.height, ''+wpt, ''+hpt); };
BOOK.savePDF=async function(pageEl){ try{ const bytes=await BOOK._pdfBytes(pageEl||document.getElementById('bookpage'));
  const blob=new Blob([bytes],{type:'application/pdf'}), url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='origo-addition-p'+(BOOK._page||1)+'.pdf'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),3000); }catch(e){ alert('PDF export failed: '+e.message); } };
BOOK.render=function(host, spec, lang){ BOOK._page=spec.page;
  const t=s=> (s&&typeof s==='object')?(s[lang]||s.en||''):(s||'');
  const mark='<div class="mathtau"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="19" fill="#15153a"/><circle cx="20" cy="20" r="14.5" fill="none" stroke="#f0c040" stroke-width=".8" opacity=".45"/><circle cx="20" cy="20" r="9.5" fill="none" stroke="#f0c040" stroke-width="1.3"/><text x="20" y="27" font-family="Georgia,serif" font-style="italic" font-size="18" fill="#f0c040" text-anchor="middle">τ</text></svg><span>MathTau</span></div>';
  let h='<div class="corner"></div>'+mark+'<div class="pno">'+(lang==='zh'?spec.page:'p.'+spec.page)+'</div>';
  h+='<div class="bkh"><div class="kick">'+t(spec.kicker)+'</div><div class="ttl">'+t(spec.title)+'</div></div>';
  spec.blocks.forEach(b=>{ h+='<div class="bkrow">';
    if(b.top && b.fig) h+=figSVG(b.fig);
    if(b.law) h+='<div class="bklaw">'+t(b.law)+(b.eq?' &nbsp;<span class="bkeq">'+colorEq(b.eq)+'</span>':'')+'</div>';
    if(b.prose) h+='<p>'+t(b.prose)+'</p>';
    if(!b.top && b.fig) h+=figSVG(b.fig);
    if(b.note) h+='<div class="bknote">'+t(b.note)+'</div>';
    h+='</div>'; });
  host.innerHTML=h;
};
window.BOOK=BOOK;
})();
