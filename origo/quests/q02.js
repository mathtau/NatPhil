/* ORIGO · Quest 2 = MathO book p7 (THE book) · The Sown Field · Multiplication = AREA. Layer 3 content.
   Playability: each round is a BUILD with a real right/wrong decision, and the HERD physically grazes the field
   as the payoff — fed calves turn happy, unfed calves stay hungry on a miss (mirrors Q1's bridge crossing). */
(function(){
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const t=s=>E.t(s);
const keq=(expr)=>'<span class="keq">'+expr+' <span class="tk">✓</span></span>';
const GREEN='#3fae54', GOLD='#e0a83a';
function backStep(){ if(E.round>0) E.addBtn(t({en:'◀ Prev step',zh:'◀ 上一步'}),'ghost',E.prevStep); }   // replay an earlier step (no EXP — already cleared)

/* ---- grass-tile field drawing (area = the product) ---- */
function tile(ctx,x,y,s,col,grow){ grow=grow==null?1:grow; const m=4.5, g=s*(1-grow)/2;   // m = inset → clear gap between tiles
  const ix=x+m+g, iy=y+m+g, is=s-2*m-2*g; if(is<=0)return; ctx.fillStyle=col;
  FIG.rr(ctx,ix,iy,is,is,4); ctx.fill();
  if(is>7){ ctx.save(); const cx=ix+is/2, base=iy+is*0.84, h=is*0.52;   // a grass tuft per square → the field is both a COUNT (clumps) and an AREA (rectangle)
    ctx.strokeStyle='rgba(16,64,26,.6)'; ctx.lineWidth=Math.max(1,is*0.07); ctx.lineCap='round';
    [[-0.20,-0.30],[0.02,-0.46],[0.22,-0.28]].forEach(d=>{ const bx=cx+d[0]*is; ctx.beginPath(); ctx.moveTo(bx,base); ctx.quadraticCurveTo(bx+d[1]*is*0.4,base-h*0.6,bx+d[1]*is,base-h); ctx.stroke(); }); ctx.restore(); } }
function outl(ctx,x,y,s,col){ ctx.save(); ctx.strokeStyle=col; ctx.globalAlpha=.3; ctx.lineWidth=1.5; ctx.setLineDash([4,3]); FIG.rr(ctx,x+4.5,y+4.5,s-9,s-9,4); ctx.stroke(); ctx.restore(); }
function rock(ctx,x,y,s){ const m=4.5, ix=x+m, iy=y+m, is=s-2*m; if(is<=0)return; ctx.save();   // bare rock beyond the walls — no grass grows, no calf grazes
  const g=ctx.createLinearGradient(ix,iy,ix,iy+is); g.addColorStop(0,'#6d6862'); g.addColorStop(1,'#46423c'); ctx.fillStyle=g; FIG.rr(ctx,ix,iy,is,is,4); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.07)'; ctx.beginPath(); ctx.ellipse(ix+is*0.36,iy+is*0.38,is*0.20,is*0.13,-0.3,0,7); ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.20)'; ctx.beginPath(); ctx.ellipse(ix+is*0.64,iy+is*0.64,is*0.22,is*0.14,0.25,0,7); ctx.fill(); ctx.restore(); }
function bg(){ const ctx=E.ctx,LW=E.LW,LH=E.LH; E.clear(); FIG.fog(ctx,0,LW,0,LH*0.55,performance.now());
  ctx.fillStyle='#15301f'; ctx.fillRect(0,LH-50,LW,50); ctx.fillStyle='#2f7a3f'; ctx.fillRect(0,LH-54,LW,5); FIG.bull(ctx,40,LH-30,42); }   // Tau stands on the ground, bottom-left, leading the herd
function gridAt(ox,oy,cell,cols,rows,colFn,grow,filled){ const ctx=E.ctx;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){ const f=(filled==null||c<filled);
    if(f) tile(ctx,ox+c*cell,oy+r*cell,cell,colFn(c),grow); else outl(ctx,ox+c*cell,oy+r*cell,cell,colFn(c)); } }
function label(x,y,txt,col,sz){ const ctx=E.ctx; ctx.fillStyle=col||FIG.C.text; ctx.font=(sz||17)+'px "IBM Plex Mono",monospace'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(txt,x,y); }
function vlabel(x,y,txt,col){ label(x,y,txt,col); }   // row count, UPRIGHT to the left of the grid

/* ---- the herd: little Taus that come and graze — the SAME gold bull emblem as the companion (FIG.tauBull) ---- */
const TAUIMG={};
function tauImg(mood){ if(TAUIMG[mood])return TAUIMG[mood]; const i=new Image(); i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(FIG.tauBull(mood)); TAUIMG[mood]=i; return i; }
try{ ['happy','sad','open'].forEach(tauImg); }catch(_){}   // warm the cache (happy=fed, open=waiting, sad=hungry)
// fed===true → happy (smiling, just grazed); fed===false → sad/dim (hungry); fed==='open' → neutral (waiting, not yet smiling)
function calf(ctx,x,y,r,fed){ const mood=fed===true?'happy':fed===false?'sad':fed, img=tauImg(mood), s=r*3.2;
  if(img.complete && img.naturalWidth){ ctx.save(); if(mood==='sad')ctx.globalAlpha=.5; try{ ctx.drawImage(img,x-s/2,y-s/2,s,s); }catch(_){ } ctx.restore(); }
  else { ctx.save(); ctx.fillStyle=mood==='sad'?'rgba(126,122,104,.6)':'#f4c830'; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); ctx.restore(); } }   // fallback dot until the emblem decodes
function drawHungry(n){ if(n<=0)return; const ctx=E.ctx,LW=E.LW,LH=E.LH; const sp=Math.min(26,(LW-150)/Math.max(n,1)); for(let i=0;i<n;i++) calf(ctx,112+i*sp,LH-24,11,false); }
// the whole herd, waiting eagerly on the ground before they're sent to the field
function waitingHerd(n){ if(n<=0)return; const ctx=E.ctx,LW=E.LW,LH=E.LH; const x0=78, sp=Math.min(26,(LW-90-x0)/Math.max(n-1,1)), r=Math.min(11,sp*0.42);   // a row along the ground, just right of Tau
  for(let i=0;i<n;i++) calf(ctx,x0+i*sp,LH-26,r,'open'); }   // waiting = neutral (not smiling yet)

// single field: rows × cols → returns geometry {cell, centers[]} so the herd can graze it
function field(rows,cols,opt){ opt=opt||{}; bg(); const LW=E.LW,LH=E.LH;
  const cell=Math.min(46,(LW-130)/Math.max(cols,1),182/Math.max(rows,1));
  const gw=cols*cell, gh=rows*cell, ox=(LW-gw)/2+14, oy=Math.max(44,(LH-66-gh)/2);
  gridAt(ox,oy,cell,cols,rows,()=>GREEN,opt.grow,null);
  if(cols)label(ox+gw/2,oy-13,cols); if(rows)vlabel(ox-15,oy+gh/2,rows);
  const centers=[]; for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)centers.push({x:ox+c*cell+cell/2,y:oy+r*cell+cell/2});
  return {cell,centers}; }

// a rustic fence drawn in the gap between two crop plots (the SHARED side)
function fence(ctx,cx,top,h){ ctx.save(); ctx.lineCap='round';
  ctx.strokeStyle='#8a6f3a'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(cx,top); ctx.lineTo(cx,top+h); ctx.stroke();              // post
  ctx.strokeStyle='rgba(214,196,150,.85)'; ctx.lineWidth=2; ctx.beginPath();
  ctx.moveTo(cx-8,top+h*0.28); ctx.lineTo(cx+8,top+h*0.28); ctx.moveTo(cx-8,top+h*0.62); ctx.lineTo(cx+8,top+h*0.62); ctx.stroke();   // two rails
  ctx.restore(); }
// R3: two crop plots of equal height a, set apart by a shared fence — grass (green, gW wide) + wheat (gold, cW wide). opt.gT/cT = target widths (stable layout + outlined plots)
function twoPens(a,gW,cW,opt){ opt=opt||{}; bg(); const LW=E.LW,LH=E.LH,ctx=E.ctx;
  const gT=opt.gT||gW||1, cT=opt.cT||cW||1, gMax=Math.max(gW,gT), cMax=Math.max(cW,cT), gap=30, total=gMax+cMax;
  const cell=Math.min(40,(LW-150-gap)/Math.max(total,2),150/Math.max(a,1));
  const wG=gMax*cell, wC=cMax*cell, gh=a*cell, totalW=wG+gap+wC, ox=(LW-totalW)/2+10, oy=Math.max(48,(LH-84-gh)/2), oxC=ox+wG+gap;
  ctx.save();   // tinted ground so each crop reads as its own plot
  ctx.fillStyle='rgba(63,174,84,.10)'; FIG.rr(ctx,ox-7,oy-7,wG+14,gh+14,8); ctx.fill();
  ctx.fillStyle='rgba(224,168,58,.13)'; FIG.rr(ctx,oxC-7,oy-7,wC+14,gh+14,8); ctx.fill(); ctx.restore();
  const centers=[];   // grass plot, then wheat plot — solid where planted, outlined up to target
  for(let r=0;r<a;r++)for(let c=0;c<gMax;c++){ const x=ox+c*cell,y=oy+r*cell; if(c<gW){ tile(ctx,x,y,cell,GREEN,opt.grow); centers.push({x:x+cell/2,y:y+cell/2}); } else outl(ctx,x,y,cell,GREEN); }
  for(let r=0;r<a;r++)for(let c=0;c<cMax;c++){ const x=oxC+c*cell,y=oy+r*cell; if(c<cW){ tile(ctx,x,y,cell,GOLD,opt.grow); centers.push({x:x+cell/2,y:y+cell/2}); } else outl(ctx,x,y,cell,GOLD); }
  fence(ctx, ox+wG+gap/2, oy-6, gh+12);
  if(a)vlabel(ox-15,oy+gh/2,a);
  label(ox+wG/2, oy+gh+18, t({en:'grass',zh:'青草'}), GREEN, 14);
  label(oxC+wC/2, oy+gh+18, t({en:'wheat',zh:'麦子'}), GOLD, 14);
  return {cell,centers}; }

// R2: the meadow's wide a×b (faded, left) beside the strip the player builds tall (right) — both orientations on one screen.
// opt.bound = the strip's hard width (terrain): columns past it spill over a cliff (wrong).
function pair(refR,refC,bR,bC,opt){ opt=opt||{}; bg(); const ctx=E.ctx,LW=E.LW,LH=E.LH;
  const bound=opt.bound||bC, drawCols=Math.max(bC,bound);
  const gap=46, cols=refC+drawCols, rows=Math.max(refR,bR);
  const cell=Math.min(38,(LW-150-gap)/Math.max(cols,1),148/Math.max(rows,1));
  const wRef=refC*cell,wB=drawCols*cell,hRef=refR*cell,hB=bR*cell, totalW=wRef+gap+wB, ox=(LW-totalW)/2+12, midY=Math.max(60,(LH-54)/2);
  const oxR=ox, oyR=midY-hRef/2, oxB=ox+wRef+gap, oyB=midY-hB/2;
  ctx.save(); ctx.globalAlpha=.4; gridAt(oxR,oyR,cell,refC,refR,()=>GREEN,opt.grow,null); ctx.restore();   // the meadow, faded (how it grazed wide)
  label(oxR+wRef/2,oyR-12,refC); vlabel(oxR-14,oyR+hRef/2,refR);
  // the strip's terrain: grassy land `bound` cols wide, then a cliff edge
  const bx=oxB+bound*cell;
  ctx.save();
  ctx.fillStyle='rgba(63,174,84,.12)'; FIG.rr(ctx,oxB-6,oyB-6,bound*cell+12,hB+12,8); ctx.fill();
  const grd=ctx.createLinearGradient(bx,0,bx+24,0); grd.addColorStop(0,'rgba(8,6,14,.6)'); grd.addColorStop(1,'rgba(8,6,14,0)');
  ctx.fillStyle=grd; ctx.fillRect(bx,oyB-6,24,hB+12);                                                       // the drop beyond the edge
  ctx.strokeStyle='rgba(255,120,90,.85)'; ctx.lineWidth=2.5; ctx.setLineDash([6,4]); ctx.beginPath(); ctx.moveTo(bx,oyB-10); ctx.lineTo(bx,oyB+hB+10); ctx.stroke();
  ctx.restore();
  for(let r=0;r<bR;r++)for(let c=0;c<drawCols;c++){ const x=oxB+c*cell,y=oyB+r*cell;
    if(c<bC){ if(c>=bound){ rock(ctx,x,y,cell); } else { tile(ctx,x,y,cell,GREEN,opt.grow); } }              // past the wall = bare rock (no grass, no calf)
    else if(c<bound){ outl(ctx,x,y,cell,GREEN); } }                                                          // unfilled strip cell
  label(oxB+bound*cell/2,oyB-12,bound); vlabel(oxB+wB+14,oyB+hB/2,bR);                                       // strip width on top; row label on the outer edge
  if(bR*bC===refR*refC && bC<=bound) label(ox+wRef+gap/2, midY, '=', FIG.C.green, 30);                       // '=' only once they truly match — no clutter beforehand
  const centers=[]; for(let r=0;r<bR;r++)for(let c=0;c<Math.min(bC,bound);c++)centers.push({x:oxB+c*cell+cell/2,y:oyB+r*cell+cell/2});   // calves only on the grass (in-bounds) tiles
  return {cell,centers}; }

// draw the cliff edges of a bounded plot W×H from (ox,oy): a dashed red line + a dark drop beyond each wall in use
function cliffs(ctx,ox,oy,W,H,cell,right,bottom){ ctx.save();
  if(right){ const bx=ox+W*cell, g=ctx.createLinearGradient(bx,0,bx+24,0); g.addColorStop(0,'rgba(8,6,14,.6)'); g.addColorStop(1,'rgba(8,6,14,0)'); ctx.fillStyle=g; ctx.fillRect(bx,oy-6,24,H*cell+12); }
  if(bottom){ const by=oy+H*cell, g=ctx.createLinearGradient(0,by,0,by+24); g.addColorStop(0,'rgba(8,6,14,.6)'); g.addColorStop(1,'rgba(8,6,14,0)'); ctx.fillStyle=g; ctx.fillRect(ox-6,by,W*cell+12,24); }
  ctx.strokeStyle='rgba(255,120,90,.85)'; ctx.lineWidth=2.5; ctx.setLineDash([6,4]); ctx.beginPath();
  if(right){ ctx.moveTo(ox+W*cell,oy-10); ctx.lineTo(ox+W*cell,oy+H*cell+10); }
  if(bottom){ ctx.moveTo(ox-10,oy+H*cell); ctx.lineTo(ox+W*cell+10,oy+H*cell); }
  ctx.stroke(); ctx.restore(); }

// R1: a meadow walled in by cliffs — at most W cols wide and H rows tall. Build a rectangle that fits; tiles past a wall spill over the cliff.
function walled(rows,cols,W,H,opt){ opt=opt||{}; bg(); const ctx=E.ctx,LW=E.LW,LH=E.LH;
  const dc=Math.max(cols,W), dr=Math.max(rows,H);
  const cell=Math.min(42,(LW-150)/Math.max(dc,1),168/Math.max(dr,1));
  const ox=(LW-dc*cell)/2+14, oy=Math.max(46,(LH-70-dr*cell)/2);
  ctx.save(); ctx.fillStyle='rgba(63,174,84,.12)'; FIG.rr(ctx,ox-6,oy-6,W*cell+12,H*cell+12,8); ctx.fill(); ctx.restore();   // the bounded land
  cliffs(ctx,ox,oy,W,H,cell,true,true);
  const centers=[];
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){ const x=ox+c*cell,y=oy+r*cell;
    if(c>=W||r>=H){ rock(ctx,x,y,cell); }                                                  // past the wall = bare rock: no grass, no calf
    else { tile(ctx,x,y,cell,GREEN,opt.grow); centers.push({x:x+cell/2,y:y+cell/2}); } }
  if(cols)label(ox+cols*cell/2,oy-13,cols); if(rows)vlabel(ox-15,oy+rows*cell/2,rows);
  return {cell,centers}; }

// R3 Part 1: two crop plots side by side, split by a vertical fence — grass (gR×gC, target a×b) + wheat (wR×wC, target a×c). Grow each with rows & cols.
function p1(a,gR,gC,wR,wC,b,c,opt){ opt=opt||{}; bg(); const ctx=E.ctx,LW=E.LW,LH=E.LH;
  const gC2=Math.max(gC,b), wC2=Math.max(wC,c), R2=Math.max(gR,wR,a), gap=26, totC=gC2+wC2;
  const cell=Math.min(40,(LW-150-gap)/Math.max(totC,1),148/Math.max(R2,1));
  const gw=gC2*cell, ww=wC2*cell, gh=a*cell, totalW=gw+gap+ww, ox=(LW-totalW)/2+10, oy=Math.max(48,(LH-82-gh)/2), wx=ox+gw+gap;
  const centers=[];
  function plot(px,rows,cols,Tc,col,tint){ ctx.save(); ctx.fillStyle=tint; FIG.rr(ctx,px-5,oy-5,Tc*cell+10,a*cell+10,7); ctx.fill(); ctx.restore();
    for(let r=0;r<Math.max(rows,a);r++)for(let cc=0;cc<Math.max(cols,Tc);cc++){ const x=px+cc*cell,y=oy+r*cell;
      if(r<rows&&cc<cols){ if(r>=a||cc>=Tc){ rock(ctx,x,y,cell); } else { tile(ctx,x,y,cell,col,opt.grow); centers.push({x:x+cell/2,y:y+cell/2}); } }   // grown past the plot wall = rock
      else if(r<a&&cc<Tc){ outl(ctx,x,y,cell,col); } } }
  plot(ox,gR,gC,b,GREEN,'rgba(63,174,84,.10)'); plot(wx,wR,wC,c,GOLD,'rgba(224,168,58,.13)');
  fence(ctx, ox+gw+gap/2, oy-5, gh+10);
  if(gC)label(ox+gC*cell/2,oy-12,gC,GREEN); if(gR)vlabel(ox-14,oy+gR*cell/2,gR);
  if(wC)label(wx+wC*cell/2,oy-12,wC,GOLD); if(wR)vlabel(wx+wC2*cell+14,oy+wR*cell/2,wR);
  label(ox+gw/2,oy+gh+18,t({en:'grass',zh:'青草'}),GREEN,13); label(wx+ww/2,oy+gh+18,t({en:'wheat',zh:'麦子'}),GOLD,13);
  return {cell,centers}; }

// R3 Part 2: Part 1 (a×b + a×c, faded reference, NOT grazed) on the LEFT, beside the field built row-by-row on the RIGHT, linked by '='.
// Dashed dividers run between the stacked rows and along the grass|wheat seam (echoing Part 1's fence).
function p2(a,rowG,rowW,nRows,b,c,opt){ opt=opt||{}; bg(); const ctx=E.ctx,LW=E.LW,LH=E.LH;
  const bc=b+c, fGap=14, eqGap=40, W=Math.max(rowG+rowW,bc), maxR=Math.max(nRows,a);
  const cell=Math.min(33,(LW-100-fGap-eqGap)/Math.max(bc+W,1),132/Math.max(maxR,1));
  const gh=a*cell, leftW=bc*cell+fGap, rightW=W*cell, totalW=leftW+eqGap+rightW;
  const ox=(LW-totalW)/2+6, midY=Math.max(54,(LH-50)/2), oy=midY-gh/2;
  const centers=[];
  // ---- LEFT: Part 1 reference (faded) — grass a×b | fence | wheat a×c ----
  const gx=ox, wfx=ox+b*cell+fGap;
  ctx.save(); ctx.globalAlpha=.5;
  ctx.fillStyle='rgba(63,174,84,.12)'; FIG.rr(ctx,gx-4,oy-4,b*cell+8,gh+8,6); ctx.fill();
  ctx.fillStyle='rgba(224,168,58,.14)'; FIG.rr(ctx,wfx-4,oy-4,c*cell+8,gh+8,6); ctx.fill();
  for(let r=0;r<a;r++){ for(let k=0;k<b;k++) tile(ctx,gx+k*cell,oy+r*cell,cell,GREEN,1); for(let k=0;k<c;k++) tile(ctx,wfx+k*cell,oy+r*cell,cell,GOLD,1); }
  ctx.restore();
  fence(ctx, ox+b*cell+fGap/2, oy-4, gh+8);
  label(gx+b*cell/2,oy-11,a+'×'+b,GREEN,12); label(wfx+c*cell/2,oy-11,a+'×'+c,GOLD,12);
  label(ox+leftW/2,oy+gh+16,a+'×'+b+' + '+a+'×'+c,FIG.C.text,13);
  label(ox+leftW+eqGap/2, midY, '=', FIG.C.green, 28);
  // ---- RIGHT: the field — one row first (a wall blocks stacking until the row is formed), then copy it down ----
  const rx=ox+leftW+eqGap, lock=!!opt.lock, tgt=lock?1:a;
  ctx.save(); ctx.fillStyle='rgba(120,150,90,.08)'; FIG.rr(ctx,rx-5,oy-5,bc*cell+10,gh+10,7); ctx.fill(); ctx.restore();
  for(let r=0;r<nRows;r++)for(let k=0;k<rowG+rowW;k++){ const x=rx+k*cell,y=oy+r*cell; tile(ctx,x,y,cell,k<rowG?GREEN:GOLD,opt.grow); centers.push({x:x+cell/2,y:y+cell/2}); }
  for(let r=0;r<tgt;r++)for(let k=0;k<bc;k++){ if(!(r<nRows&&k<rowG+rowW)) outl(ctx,rx+k*cell,oy+r*cell,cell,k<b?GREEN:GOLD); }   // remaining cells of the revealed rows
  fence(ctx, rx+b*cell, oy-4, tgt*cell+8);                                                                  // SAME grass|wheat fence as Part 1
  ctx.save(); ctx.strokeStyle='rgba(214,196,150,.8)'; ctx.lineWidth=2; ctx.setLineDash([5,4]);               // dashed seam between the copied rows
  for(let r=1;r<nRows;r++){ const y=oy+r*cell; ctx.beginPath(); ctx.moveTo(rx-3,y); ctx.lineTo(rx+bc*cell+3,y); ctx.stroke(); } ctx.restore();
  if(lock){ const wy=oy+cell; ctx.save();                                                                   // wall below the single row — no copying down until it's formed
    const wg=ctx.createLinearGradient(0,wy,0,wy+22); wg.addColorStop(0,'rgba(8,6,14,.55)'); wg.addColorStop(1,'rgba(8,6,14,0)'); ctx.fillStyle=wg; ctx.fillRect(rx-6,wy,bc*cell+12,22);
    ctx.strokeStyle='#8a6f3a'; ctx.lineWidth=4; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(rx-6,wy); ctx.lineTo(rx+bc*cell+6,wy); ctx.stroke(); ctx.restore(); }
  vlabel(rx-13,oy+(nRows*cell)/2,nRows); label(rx+bc*cell/2,oy-11,rowG+'+'+rowW);
  label(rx+rightW/2,oy+gh+16,a+'×('+b+'+'+c+')',FIG.C.text,13);
  return {cell,centers}; }

/* ---- outcomes: the herd grazes (win) or some calves go hungry (fail) ---- */
function grazeWin(drawGeo,done){ E.busy=true; E.clearTray(); let geo=drawGeo(1); const total=geo.centers.length, r=Math.max(9,Math.min(14,geo.cell*0.42));
  E.anim(1200,p=>{ const g=drawGeo(1); const k=Math.floor(p*total); for(let i=0;i<k;i++)calf(E.ctx,g.centers[i].x,g.centers[i].y,r,true); },
   ()=>{ const g=drawGeo(1); for(let i=0;i<total;i++)calf(E.ctx,g.centers[i].x,g.centers[i].y,r,true); E.cheer(); E.pop('nom!'); E.sfx('win'); E.busy=false; done(); }); }
function grazeFail(drawGeo,hungry,msg,retry,fed){ E.busy=true; const geo=drawGeo(1); const r=Math.max(9,Math.min(14,geo.cell*0.42));
  const nf=(fed==null?geo.centers.length:Math.min(fed,geo.centers.length));   // only the calves that actually graze get a face; over-built tiles stay empty (field calves + hungry = herd)
  for(let i=0;i<nf;i++)calf(E.ctx,geo.centers[i].x,geo.centers[i].y,r,true); drawHungry(hungry);
  E.oops(); E.sfx('fail'); E.tell(msg); E.busy=false; E.afterSpeech(retry); }

let baseline={a:2,b:3,N:6};   // R1 establishes a×b; R2 (narrow land) forces the swap b×a

// a short stone wall (a field boundary) — vertical slab with brick courses
function wall(ctx,x,top,h){ const wd=7; ctx.save();
  const g=ctx.createLinearGradient(x-wd/2,0,x+wd/2,0); g.addColorStop(0,'#6a6056'); g.addColorStop(.5,'#9a9082'); g.addColorStop(1,'#6a6056'); ctx.fillStyle=g; ctx.fillRect(x-wd/2,top,wd,h);
  ctx.strokeStyle='rgba(40,34,28,.5)'; ctx.lineWidth=1; ctx.beginPath(); for(let y=top+8;y<top+h;y+=9){ ctx.moveTo(x-wd/2,y); ctx.lineTo(x+wd/2,y); } ctx.stroke();
  ctx.strokeStyle='rgba(20,16,12,.55)'; ctx.lineWidth=1; ctx.strokeRect(x-wd/2,top,wd,h); ctx.restore(); }
// a river between two banks — you can't plant across it by hand; only Product's magic copies a row over
function river(ctx,x,y,w,h){ ctx.save();
  const g=ctx.createLinearGradient(0,y,0,y+h); g.addColorStop(0,'#1c5689'); g.addColorStop(.45,'#3f93d6'); g.addColorStop(.55,'#4aa3e2'); g.addColorStop(1,'#1f5e96'); ctx.fillStyle=g; ctx.fillRect(x,y,w,h);
  ctx.fillStyle='rgba(8,30,54,.4)'; ctx.fillRect(x,y,w,Math.max(1,h*0.13));            // far-bank shadow
  ctx.fillStyle='rgba(8,30,54,.28)'; ctx.fillRect(x,y+h-Math.max(1,h*0.1),w,Math.max(1,h*0.1));   // near-bank shadow
  ctx.lineCap='round';
  [[0.34,h*0.08,0.4,'rgba(232,246,255,.5)'],[0.62,h*0.06,2.1,'rgba(255,255,255,.3)']].forEach(R=>{   // wavy ripples
    const yy=y+h*R[0], amp=R[1], ph=R[2]; ctx.strokeStyle=R[3]; ctx.lineWidth=1.1; ctx.beginPath();
    for(let xx=x;xx<=x+w;xx+=3){ const yo=yy+Math.sin(xx*0.16+ph)*amp; if(xx===x)ctx.moveTo(xx,yo); else ctx.lineTo(xx,yo); } ctx.stroke(); });
  ctx.fillStyle='rgba(255,255,255,.6)'; for(let gx=x+14; gx<x+w-6; gx+=34){ ctx.beginPath(); ctx.ellipse(gx,y+h*0.42,2.2,0.9,-0.3,0,7); ctx.fill(); }   // glints
  ctx.restore(); }
/* ===== THE Quest-2 mechanic: build ONE row (the group), then "Product" the magician copies it down ===== */
// `copies` rows, each = g grass + w wheat. Field is b+c wide × a tall. Cells past the b+c width spill onto ROCK (no calf).
// opt.grow = grow-in; opt.ref = {r,c} draws a faded r×c reference field + "=" to the left (used for commutativity).
function gfield(b,c,a,g,w,copies,opt){ opt=opt||{}; bg(); const ctx=E.ctx,LW=E.LW,LH=E.LH;
  const bc=b+c, rowW=Math.max(g+w,bc), rowsShown=Math.max(copies,a);
  const ref=opt.ref, refC=ref?ref.c:0, refC2=ref?(ref.c2||0):0, refR=ref?ref.r:0, eqGap=ref?50:0;   // ref = faded watermark: r×c green (+ optional r×c2 gold), then ref.op ('+'/'=') to the main field
  const cols=refC+refC2+(refC2?1:0)+(ref?1:0)+rowW, rows=Math.max(rowsShown,refR);
  const cell=Math.min(52,(LW-110)/Math.max(cols,1),182/Math.max(rows*1.24,1));   // bigger tiles; still leave room for the (now slimmer) river gaps
  const riverH=Math.max(6,Math.round(cell*0.22)), pitch=cell+riverH;
  const gap2=refC2?10:0, refW=ref?(refC*cell+gap2+refC2*cell):0, fieldW=rowW*cell, totalW=refW+eqGap+fieldW, ox0=(LW-totalW)/2+8;
  const gh=rowsShown*cell+(rowsShown-1)*riverH, oy=Math.max(34,(LH-58-gh)/2), rowY=r=>oy+r*pitch;
  if(ref){ const roy=oy+(gh-refR*cell)/2; ctx.save(); ctx.globalAlpha=.42;
    for(let r=0;r<refR;r++)for(let k=0;k<refC;k++) tile(ctx,ox0+k*cell,roy+r*cell,cell,GREEN,1);
    if(refC2) for(let r=0;r<refR;r++)for(let k=0;k<refC2;k++) tile(ctx,ox0+refC*cell+gap2+k*cell,roy+r*cell,cell,GOLD,1);
    ctx.restore();
    label(ox0+refC*cell/2,roy-12,refC,GREEN); if(refC2) label(ox0+refC*cell+gap2+refC2*cell/2,roy-12,refC2,GOLD); vlabel(ox0-13,roy+refR*cell/2,refR);
    if(refC2) label(ox0+refC*cell+gap2/2, roy+refR*cell/2, '+', FIG.C.text, 20);
    label(ox0+refW+eqGap/2, oy+gh/2, ref.op||'=', (ref.op==='+'?FIG.C.text:FIG.C.green), 28); }
  const ox=ox0+refW+eqGap;
  ctx.save(); ctx.fillStyle='rgba(120,150,90,.08)'; FIG.rr(ctx,ox-6,oy-6,bc*cell+12,gh+12,8); ctx.fill(); ctx.restore();
  for(let r=0;r<rowsShown-1;r++) river(ctx, ox, rowY(r)+cell, bc*cell, riverH);   // a river divides each pair of banks
  const centers=[];
  for(let r=0;r<copies;r++)for(let k=0;k<g+w;k++){ const x=ox+k*cell,y=rowY(r);
    if(k<bc){ tile(ctx,x,y,cell,k<g?GREEN:GOLD,opt.grow); centers.push({x:x+cell/2,y:y+cell/2}); } else rock(ctx,x,y,cell); }   // past the width = bare rock (no calf)
  for(let r=0;r<a;r++)for(let k=0;k<bc;k++){ if(!(r<copies&&k<g+w)) outl(ctx,ox+k*cell,rowY(r),cell,k<b?GREEN:GOLD); }
  wall(ctx, ox+bc*cell, oy-3, gh+6);                  // outer wall — the field's width; tiles past it fall on rock
  if(b>0&&c>0) wall(ctx, ox+b*cell, oy-3, gh+6);      // grass ends here — move on to wheat
  label(ox+bc*cell/2,oy-12, (b>0&&c>0)? g+'+'+w : (c>0? ''+w : ''+g), FIG.C.text);
  vlabel(ref? ox+bc*cell+16 : ox-14, oy+gh/2, copies);
  return {cell,centers}; }
// a 5-point sparkle star
function star(ctx,cx,cy,r,col){ if(r<=0)return; ctx.save(); ctx.fillStyle=col; ctx.beginPath();
  for(let i=0;i<5;i++){ const a=-Math.PI/2+i*2*Math.PI/5; ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r); const a2=a+Math.PI/5; ctx.lineTo(cx+Math.cos(a2)*r*0.45,cy+Math.sin(a2)*r*0.45); }
  ctx.closePath(); ctx.fill(); ctx.restore(); }
// "Product" the magician — a detailed wizard in the Tau idiom: layered gold robe with folds, soft-shaded face, glossy eyes, blush, starry hat, glowing wand.
function magician(ctx,x,y,s,t){ t=t==null?1:t; const U=s/100, P=Math.PI; ctx.save(); ctx.lineJoin='round'; ctx.lineCap='round';
  ctx.fillStyle='rgba(0,0,0,.16)'; ctx.beginPath(); ctx.ellipse(x,y+63*U,27*U,6*U,0,0,7); ctx.fill();   // ground shadow
  const robePath=()=>{ ctx.beginPath(); ctx.moveTo(x-10*U,y+4*U); ctx.quadraticCurveTo(x-30*U,y+24*U,x-36*U,y+56*U);
    ctx.quadraticCurveTo(x-22*U,y+66*U,x-12*U,y+59*U); ctx.quadraticCurveTo(x,y+68*U,x+12*U,y+59*U);
    ctx.quadraticCurveTo(x+22*U,y+66*U,x+36*U,y+56*U); ctx.quadraticCurveTo(x+30*U,y+24*U,x+10*U,y+4*U); ctx.closePath(); };
  const robe=ctx.createLinearGradient(x-34*U,0,x+34*U,0); robe.addColorStop(0,'#ffe9a0'); robe.addColorStop(.5,'#f4c830'); robe.addColorStop(1,'#bd8c12');
  ctx.fillStyle=robe; ctx.strokeStyle='#8a6410'; ctx.lineWidth=2*U; robePath(); ctx.fill(); ctx.stroke();
  ctx.save(); robePath(); ctx.clip();
  ctx.fillStyle='rgba(110,74,10,.22)'; ctx.fillRect(x+4*U,y,40*U,70*U);
  ctx.fillStyle='rgba(255,250,225,.28)'; ctx.fillRect(x-36*U,y,17*U,70*U);
  ctx.strokeStyle='rgba(110,74,10,.25)'; ctx.lineWidth=1.4*U; ctx.beginPath(); ctx.moveTo(x,y+8*U); ctx.lineTo(x,y+58*U); ctx.stroke();
  star(ctx,x-14*U,y+34*U,3*U,'rgba(255,247,207,.85)'); star(ctx,x+13*U,y+44*U,2.4*U,'rgba(255,247,207,.7)'); ctx.restore();
  ctx.fillStyle='#e3ad28'; ctx.strokeStyle='#8a6410'; ctx.lineWidth=1.4*U; ctx.beginPath(); ctx.ellipse(x,y+5*U,11*U,3.6*U,0,0,7); ctx.fill(); ctx.stroke();   // collar
  ctx.fillStyle='#f4c830'; ctx.beginPath(); ctx.arc(x-25*U,y+40*U,5.5*U,0,7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(x+24*U,y+30*U,5.5*U,0,7); ctx.fill(); ctx.stroke();   // hands
  const cy=y-18*U, hr=17*U;
  const skin=ctx.createRadialGradient(x-5*U,cy-6*U,2*U,x,cy,hr*1.15); skin.addColorStop(0,'#fff3d6'); skin.addColorStop(1,'#eccb8e');
  ctx.fillStyle=skin; ctx.strokeStyle='#b98c2a'; ctx.lineWidth=1.6*U; ctx.beginPath(); ctx.arc(x,cy,hr,0,7); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#eccb8e'; ctx.beginPath(); ctx.arc(x-hr,cy+2*U,3*U,0,7); ctx.arc(x+hr,cy+2*U,3*U,0,7); ctx.fill();   // ears
  ctx.fillStyle='rgba(255,150,120,.5)'; ctx.beginPath(); ctx.ellipse(x-8.5*U,cy+5*U,4.2*U,2.8*U,0,0,7); ctx.ellipse(x+8.5*U,cy+5*U,4.2*U,2.8*U,0,0,7); ctx.fill();   // blush
  ctx.strokeStyle='#9a6f2a'; ctx.lineWidth=1.3*U; ctx.beginPath(); ctx.moveTo(x-9*U,cy-7*U); ctx.quadraticCurveTo(x-6*U,cy-9*U,x-3*U,cy-7*U); ctx.moveTo(x+3*U,cy-7*U); ctx.quadraticCurveTo(x+6*U,cy-9*U,x+9*U,cy-7*U); ctx.stroke();   // brows
  [-6,6].forEach(dx=>{ const ex=x+dx*U, ey=cy-1*U; ctx.fillStyle='#241a05'; ctx.beginPath(); ctx.ellipse(ex,ey,2.6*U,3.3*U,0,0,7); ctx.fill(); ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ex+0.9*U,ey-1.3*U,0.9*U,0,7); ctx.fill(); });   // glossy eyes
  ctx.fillStyle='rgba(180,120,60,.4)'; ctx.beginPath(); ctx.arc(x,cy+4*U,1.3*U,0,7); ctx.fill();   // nose
  ctx.strokeStyle='#9a5a2a'; ctx.lineWidth=1.3*U; ctx.beginPath(); ctx.arc(x,cy+5*U,3.2*U,0.15*P,0.85*P); ctx.stroke();   // smile
  const bd=ctx.createLinearGradient(0,cy+4*U,0,cy+30*U); bd.addColorStop(0,'#fffdf6'); bd.addColorStop(1,'#dad0bc');
  ctx.fillStyle=bd; ctx.strokeStyle='rgba(150,130,95,.5)'; ctx.lineWidth=1*U; ctx.beginPath(); ctx.moveTo(x-11*U,cy+7*U); ctx.quadraticCurveTo(x-12*U,cy+26*U,x-3*U,cy+30*U); ctx.quadraticCurveTo(x,cy+33*U,x+3*U,cy+30*U); ctx.quadraticCurveTo(x+12*U,cy+26*U,x+11*U,cy+7*U); ctx.quadraticCurveTo(x,cy+16*U,x-11*U,cy+7*U); ctx.closePath(); ctx.fill(); ctx.stroke();   // beard
  ctx.strokeStyle='rgba(150,130,95,.4)'; ctx.lineWidth=0.9*U; ctx.beginPath(); ctx.moveTo(x-4*U,cy+14*U); ctx.lineTo(x-4*U,cy+26*U); ctx.moveTo(x,cy+15*U); ctx.lineTo(x,cy+29*U); ctx.moveTo(x+4*U,cy+14*U); ctx.lineTo(x+4*U,cy+26*U); ctx.stroke();
  ctx.fillStyle='#fffdf6'; ctx.beginPath(); ctx.ellipse(x-3.5*U,cy+8*U,3.2*U,1.8*U,0.4,0,7); ctx.ellipse(x+3.5*U,cy+8*U,3.2*U,1.8*U,-0.4,0,7); ctx.fill();   // mustache
  const hb=cy-hr+4*U;
  ctx.fillStyle='#e3ad28'; ctx.strokeStyle='#8a6410'; ctx.lineWidth=1.5*U; ctx.beginPath(); ctx.ellipse(x,hb,20*U,5*U,0,0,7); ctx.fill(); ctx.stroke();   // brim
  const hat=ctx.createLinearGradient(x-18*U,0,x+18*U,0); hat.addColorStop(0,'#3f53a6'); hat.addColorStop(.5,'#5066c0'); hat.addColorStop(1,'#2a3470');
  ctx.fillStyle=hat; ctx.strokeStyle='#1e2452'; ctx.lineWidth=1.6*U; ctx.beginPath(); ctx.moveTo(x-16*U,hb); ctx.quadraticCurveTo(x-8*U,hb-28*U,x-1*U,hb-40*U); ctx.quadraticCurveTo(x+13*U,hb-46*U,x+12*U,hb-32*U); ctx.quadraticCurveTo(x+9*U,hb-20*U,x+16*U,hb); ctx.closePath(); ctx.fill(); ctx.stroke();   // cone
  ctx.fillStyle='#f4c830'; ctx.strokeStyle='#8a6410'; ctx.lineWidth=1*U; ctx.beginPath(); ctx.ellipse(x,hb-2*U,16*U,4*U,0,0,7); ctx.fill(); ctx.stroke();   // band
  ctx.fillStyle='#ff6a4d'; ctx.beginPath(); ctx.arc(x,hb-2*U,2*U,0,7); ctx.fill();   // gem
  star(ctx,x-5*U,hb-16*U,2.4*U,'#ffe9a0'); star(ctx,x+4*U,hb-26*U,1.8*U,'#fff7cf'); star(ctx,x+12*U,hb-32*U,3*U*(0.8+0.3*Math.sin(t*6.283)),'#fff7cf');   // hat stars
  const wand=ctx.createLinearGradient(x+22*U,y+30*U,x+54*U,y-30*U); wand.addColorStop(0,'#7a4f22'); wand.addColorStop(1,'#caa84a');
  ctx.strokeStyle=wand; ctx.lineWidth=3*U; ctx.beginPath(); ctx.moveTo(x+24*U,y+30*U); ctx.lineTo(x+52*U,y-26*U); ctx.stroke();   // wand
  const tx=x+54*U, ty=y-30*U, gl=ctx.createRadialGradient(tx,ty,0,tx,ty,13*U); gl.addColorStop(0,'rgba(255,243,180,.7)'); gl.addColorStop(1,'rgba(255,243,180,0)'); ctx.fillStyle=gl; ctx.beginPath(); ctx.arc(tx,ty,13*U,0,7); ctx.fill();
  star(ctx,tx,ty,7*U*(0.85+0.25*Math.sin(t*6.283)),'#fff7d8');
  star(ctx,x-30*U,y-26*U,3*U*(0.4+0.6*Math.abs(Math.sin(t*3.14+1))),'rgba(255,243,207,.8)');
  star(ctx,x+38*U,y+12*U,2.2*U*(0.4+0.6*Math.abs(Math.sin(t*3.14+2))),'rgba(255,243,207,.7)');
  ctx.restore(); }
/* ONE shared round: build a ROW (the group), then Product copies it — one row at a time — and you send the herd.
   Copying is always available, so the count can be wrong: too few → calves go hungry, too many → tiles wasted. */
function runRound(E, cfg){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(cfg.dot); E.cv.onclick=null;
  const B=cfg.B, C=cfg.C, A=cfg.A, N=cfg.N, bc=B+C; let g=0, w=0, k=1;
  E.setPlace(cfg.place); E.tell(cfg.intro);
  function refresh(){ gfield(B,C,A,g,w,k,{ref:cfg.ref}); waitingHerd(N); magician(E.ctx,78,E.LH*0.42,46,0); label(78,E.LH*0.42+50,t({en:'Product',zh:'积'}),'#caa84a',12);   // gap below the robe/shadow; no quotes on the in-game label (prose keeps “积”)
    const inRow=Math.min(g+w,bc), graze=k*inRow, over=(g+w)>bc, win=(g===B&&w===C&&k===A), row=(B>0&&C>0)? g+'+'+w : (C>0? ''+w : ''+g);
    E.status(t({en:'row ',zh:'行 '})+'<b>'+row+'</b>'+t({en:'  ×  ',zh:'  ×  '})+'<b>'+k+t({en:' copies',zh:' 份'})+'</b>  =  <b'+(win?' class="g"':(graze>N||over)?' class="r"':'')+'>'+graze+'</b> / '+N+(over?t({en:'   (over the wall!)',zh:'   （越墙了！）'}):'')); E.clearTray(); backStep();
    // FIXED button layout — positions never move; buttons not usable in the current state are locked (dimmed). shaping (k===1) = editing the group; else = multiplying.
    const shaping=(k===1), hintEdit=()=>E.pop(t({en:'↺ reshape first',zh:'先重排此行'})), hintCopy=()=>E.pop(t({en:'copy the row first',zh:'先复制此行'}));
    if(B>0){ E.addBtn(t({en:'grass +',zh:'青草 +'}),'grass', shaping?(()=>{ if(g<(C>0?B:B+3)){g++;E.sfx('place');refresh();} else E.pop(C>0?t({en:'grass wall: use wheat',zh:'青草到墙了：用麦子'}):t({en:'over the wall!',zh:'越墙了！'})); }):hintEdit, !shaping);
      E.addBtn(t({en:'grass −',zh:'青草 −'}),'grass', shaping?(()=>{ if(g>0){g--;E.sfx('tick');refresh();} }):hintEdit, !shaping); }
    if(C>0){ E.addBtn(t({en:'wheat +',zh:'麦子 +'}),'wheat', shaping?(()=>{ if(w<C+3){w++;E.sfx('place');refresh();} else E.pop(t({en:'plenty!',zh:'够了！'})); }):hintEdit, !shaping);
      E.addBtn(t({en:'wheat −',zh:'麦子 −'}),'wheat', shaping?(()=>{ if(w>0){w--;E.sfx('tick');refresh();} }):hintEdit, !shaping); }
    E.addBtn(t({en:'✦ Product: copy ✦',zh:'✦ “积”：复制 ✦'}),'magic',()=>{ if(k<A+3){k++; cast();} else E.pop(t({en:'plenty!',zh:'够了！'})); });   // copy: fixed label & spot, never re-wraps
    E.addBtn(t({en:'− a copy',zh:'− 一份'}),'ghost', shaping?hintCopy:(()=>{ k--; E.sfx('tick'); refresh(); }), shaping);
    E.addBtn(t({en:'↺ reshape the row',zh:'↺ 重排此行'}),'ghost', shaping?hintCopy:(()=>{ k=1; E.sfx('tick'); refresh(); }), shaping);
    E.addBtn(t({en:'Send the herd ▶',zh:'放牛 ▶'}),'primary',send); }
  function cast(){ E.busy=true; E.sfx('bracket'); E.pop('✦ copy! ✦'); if(k===2)E.speakAs('product',t({en:'Multiply!',zh:'乘！'}));   // Product speaks on the first summon
    E.anim(480, p=>{ const geo=gfield(B,C,A,g,w,k,{ref:cfg.ref}); waitingHerd(N); magician(E.ctx,78,E.LH*0.42,48,p);
      const rw=Math.min(g+w,bc); for(let i=Math.max(0,geo.centers.length-rw);i<geo.centers.length;i++){ const cc=geo.centers[i]; star(E.ctx,cc.x,cc.y,geo.cell*0.2*(0.6+0.5*Math.sin(p*9+i)),'rgba(255,243,207,'+(0.75*(1-p)+0.15).toFixed(2)+')'); } },
      ()=>{ E.busy=false; refresh(); }); }
  function send(){ if(E.busy)return; const inRow=Math.min(g+w,bc), graze=k*inRow, rockN=k*Math.max(0,(g+w)-bc), draw=grow=>gfield(B,C,A,g,w,k,{grow:grow,ref:cfg.ref});
    if(g===B && w===C && k===A){ grazeWin(draw, ()=>cfg.win()); return; }
    E.busy=true; const geo=draw(1), r=Math.max(9,Math.min(14,geo.cell*0.42)), fed=Math.min(graze,N);
    for(let i=0;i<fed;i++) calf(E.ctx,geo.centers[i].x,geo.centers[i].y,r,true); if(graze<N) drawHungry(N-graze);
    const msg = rockN>0 ? t({en:'<b class="r">'+rockN+'</b> tiles spilled onto bare <b class="r">rock</b> past the wall. Keep the row <b>'+(C>0?B+'+'+C:''+B)+'</b> wide.',zh:'<b class="r">'+rockN+'</b> 格落到墙外的<b class="r">石头</b>上。把行保持在 <b>'+(C>0?B+'+'+C:''+B)+'</b> 宽。'})
      : graze<N ? t({en:'<b class="r">'+(N-graze)+'</b> calves go hungry: copy the row more (or fill it).',zh:'<b class="r">'+(N-graze)+'</b> 头小牛没吃上：多复制几份（或先把行铺满）。'})
      : graze>N ? t({en:'<b class="r">'+(graze-N)+'</b> tiles wasted: too many copies.',zh:'浪费了 <b class="r">'+(graze-N)+'</b> 格：复制太多了。'})
      : t({en:'Right count, but fill the row to its full width, then copy.',zh:'数量对了，把整行铺满，再复制。'});
    E.oops(); E.sfx('fail'); g=0; w=0; k=1; E.tell(msg); E.busy=false; E.afterSpeech(refresh); }
  refresh();
}

/* ===== Round 1 — The Walled Meadow: a row of b grass, copied a times ===== */
function round1(E){ const pr=[[2,3],[2,4],[3,4],[2,5]][rnd(0,3)]; const a=pr[0], b=pr[1], N=a*b; baseline={a,b,N};
  runRound(E,{ dot:0, B:b, C:0, A:a, N:N,
    place:t({en:'The Walled Meadow',zh:'围栏草甸'}),
    intro:t({en:'<b>The Walled Meadow.</b> <b>'+N+'</b> calves wait. <b>Rivers</b> split the meadow into rows, so you can only plant the near bank. Lay <b class="g">'+b+'</b> grass there, then <b>Product</b> the magician copies your row <b>across the rivers</b> to fill the rest.',zh:'<b>围栏草甸。</b><b>'+N+'</b> 头小牛在等。一条条<b>河</b>把草甸分成一行行，你只能在最近的这行种。在这行铺 <b class="g">'+b+'</b> 格青草，然后魔法师<b>“积”</b>把你这行<b>隔河复制</b>，填满其余各行。'}),
    win:()=>{ E.setDots(1); E.tickQ(1); E.award(45); E.status(keq(a+' × '+b+' = '+N));
      E.tell(t({en:'A row of <b>'+b+'</b>, copied <b>'+a+'</b> times: <b>'+a+' × '+b+' = '+N+'</b>. That is <b>×</b>: a row, repeated.',zh:'一行 <b>'+b+'</b>，复制 <b>'+a+'</b> 次：<b>'+a+' × '+b+' = '+N+'</b>。这就是 <b>×</b>：一行，重复。'}));
      E.clearTray(); E.addBtn(t({en:'On to the Narrow Strip ▶',zh:'前往窄田 ▶'}),'primary',E.advance); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); } });
}

/* ===== Round 2 — The Narrow Strip: the strip pens the row to a wide, copied b times (commutative) ===== */
function round2(E){ const a=baseline.a, b=baseline.b, N=baseline.N;
  runRound(E,{ dot:1, B:a, C:0, A:b, N:N,
    place:t({en:'The Narrow Strip',zh:'窄田'}),
    intro:t({en:'<b>The Narrow Strip.</b> The same <b>'+N+'</b> calves, but this strip pens each row to just <b class="g">'+a+'</b> wide (the meadow\'s row was '+b+'). Build the <b>'+a+'</b>-row, then let Product copy it.',zh:'<b>窄田。</b>还是这 <b>'+N+'</b> 头牛，但这片窄田把每行限到只有 <b class="g">'+a+'</b> 宽（草甸的行是 '+b+'）。铺好这 <b>'+a+'</b> 行，再让“积”复制。'}),
    win:()=>{ E.setDots(2); E.tickQ(2); E.award(50);
      const geo=gfield(a,0,b,a,0,b,{ref:{r:a,c:b}}), rr=Math.max(9,Math.min(14,geo.cell*0.42)); for(let i=0;i<geo.centers.length;i++) calf(E.ctx,geo.centers[i].x,geo.centers[i].y,rr,true);   // meadow a×b  =  strip b×a, side by side
      E.status(keq(a+' × '+b+' = '+b+' × '+a+' = '+N));
      E.tell(t({en:'See it: the earlier meadow <b>'+a+'×'+b+'</b> holds the same <b>'+N+'</b> as your strip <b>'+b+'×'+a+'</b>. Flip the group, the product holds: <b>'+a+'×'+b+' = '+b+'×'+a+'</b>. That\'s <b>commuting</b>.',zh:'看：之前的草甸 <b>'+a+'×'+b+'</b> 和你的窄田 <b>'+b+'×'+a+'</b> 装着同样的 <b>'+N+'</b>。把组调换，乘积不变：<b>'+a+'×'+b+' = '+b+'×'+a+'</b>。这就是<b>交换律</b>。'}));
      E.clearTray(); E.addBtn(t({en:'On to the Shared Fence ▶',zh:'前往分配 ▶'}),'primary',E.advance); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); } });
}

/* ===== Round 3 — The Shared Fence: PART 1 builds a×b (grass) and a×c (wheat) separately and adds them; PART 2 builds a×(b+c) (distributive) ===== */
function round3(E){ const a=rnd(2,3), b=rnd(2,3), c=rnd(2,3); const T=a*(b+c), gP=a*b, wP=a*c;
  const place=t({en:'The Shared Fence',zh:'分配'});
  function grassPhase(){ runRound(E,{ dot:2, B:b, C:0, A:a, N:gP, place:place,
    intro:t({en:'<b>The Shared Fence, Part 1.</b> Count each crop on its own. First the <b class="g">grass</b>: build a row of <b class="g">'+b+'</b>, then Product copies it <b>'+a+'</b> times → <b class="g">'+a+'×'+b+'</b>.',zh:'<b>分配（第一部分）。</b>把每种植物分开算。先种<b class="g">青草</b>：铺一行 <b class="g">'+b+'</b>，再让“积”复制 <b>'+a+'</b> 次 → <b class="g">'+a+'×'+b+'</b>。'}),
    win:()=>{ E.status(keq(a+' × '+b+' = '+gP)); E.tell(t({en:'<b class="g">Grass</b> done: <b class="g">'+a+'×'+b+' = '+gP+'</b>. Now grow the <b class="o">wheat</b> on its own.',zh:'<b class="g">青草</b>种好：<b class="g">'+a+'×'+b+' = '+gP+'</b>。现在种<b class="o">麦子</b>。'})); E.clearTray(); E.addBtn(t({en:'Now the wheat ▶',zh:'再种麦子 ▶'}),'primary',wheatPhase); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); } }); }
  function wheatPhase(){ runRound(E,{ dot:2, B:0, C:c, A:a, N:wP, place:place, ref:{r:a,c:b,op:'+'},
    intro:t({en:'Now the <b class="o">wheat</b>, separately (your <b class="g">'+a+'×'+b+'</b> grass stays on the left): build a row of <b class="o">'+c+'</b>, then Product copies it <b>'+a+'</b> times → <b class="o">'+a+'×'+c+'</b>.',zh:'现在单独种<b class="o">麦子</b>：铺一行 <b class="o">'+c+'</b>，再让“积”复制 <b>'+a+'</b> 次 → <b class="o">'+a+'×'+c+'</b>。'}),
    win:()=>{ const geo=gfield(0,c,a,0,c,a,{ref:{r:a,c:b,op:'+'}}), rr=Math.max(9,Math.min(14,geo.cell*0.42)); for(let i=0;i<geo.centers.length;i++) calf(E.ctx,geo.centers[i].x,geo.centers[i].y,rr,true);   // faded grass a×b  +  wheat a×c
      E.status(keq(a+'×'+b+' + '+a+'×'+c+' = '+gP+' + '+wP+' = '+T)); E.tell(t({en:'<b>Part 1 done.</b> Counted apart and added: <b class="g">'+a+'×'+b+'</b> + <b class="o">'+a+'×'+c+'</b> = <b>'+gP+' + '+wP+' = '+T+'</b>. Now build the same crops as <b>one field</b>.',zh:'<b>第一部分完成。</b>分开数再相加：<b class="g">'+a+'×'+b+'</b> + <b class="o">'+a+'×'+c+'</b> = <b>'+gP+' + '+wP+' = '+T+'</b>。现在把同样的作物拼成<b>一整片田</b>。'})); E.clearTray(); E.addBtn(t({en:'Part 2: one field ▶',zh:'第二部分：合成一片 ▶'}),'primary',combinedPhase); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); } }); }
  function combinedPhase(){ runRound(E,{ dot:2, B:b, C:c, A:a, N:T, place:place,
    intro:t({en:'<b>Part 2: one field.</b> One row, both crops: <b class="g">'+b+'</b> grass up to the wall, then <b class="o">'+c+'</b> wheat. Product copies it <b>'+a+'</b> times → <b>'+a+'×('+b+'+'+c+')</b>.',zh:'<b>第二部分：一整片。</b>一行，两种植物：先种 <b class="g">'+b+'</b> 格青草到墙为止，接着种<b class="o">'+c+'</b> 格麦子。“积”复制 <b>'+a+'</b> 次 → <b>'+a+'×('+b+'+'+c+')</b>。'}),
    win:()=>{ E.setDots(3); E.tickQ(3); E.award(60); const geo=gfield(b,c,a,b,c,a,{ref:{r:a,c:b,c2:c,op:'='}}), rr=Math.max(9,Math.min(14,geo.cell*0.42)); for(let i=0;i<geo.centers.length;i++) calf(E.ctx,geo.centers[i].x,geo.centers[i].y,rr,true);   // faded (a×b + a×c)  =  the combined field
      E.status(keq(a+'×'+b+' + '+a+'×'+c+' = '+a+'×('+b+'+'+c+') = '+T)); E.tell(t({en:'Two ways, same <b>'+T+'</b>. <b>Apart</b>: <b class="g">'+a+'×'+b+'</b> + <b class="o">'+a+'×'+c+'</b>. <b>Together</b>: <b>'+a+'×('+b+'+'+c+')</b>. That\'s <b>distributing</b>.',zh:'两种数法，同样的 <b>'+T+'</b>。<b>分开</b>：<b class="g">'+a+'×'+b+'</b> + <b class="o">'+a+'×'+c+'</b>。<b>合并</b>：<b>'+a+'×('+b+'+'+c+')</b>。这就是<b>分配律</b>。'})); E.clearTray(); E.addBtn(t({en:'Claim the Codex page 📖',zh:'领取典籍书页 📖'}),'primary',()=>E.openBook(QUEST.book)); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); } }); }
  grassPhase();
}

const QUEST = {
  id:'q02', page:7, region:'cradle', bgm:'audio/bgm-cradle.mp3?v=20260606k2',
  kicker:{en:'The Cradle',zh:'摇篮'},
  title:{en:'Sowing Steps',zh:'步步播种'},
  meta:{ title:{en:'Sow the Pasture',zh:'播种牧场'}, giver:{en:'Tau the Calf · The Cradle',zh:'小牛 Tau · 摇篮'},
    flavor:{en:'"We crossed the bridges, thank you! But we need more calves to make a herd. Help me grow a <b>pasture</b>. <b>Rivers</b> cut this land into rows, so you can only plant the near bank, but <b>Product</b> the magician copies your row across the water. A field of grass is <b>rows × columns</b>, an <b>area</b>; plant it well and the whole herd grows strong. Let\'s sow!"',
      zh:'"我们过桥啦，谢谢你！可我们需要更多小牛才能成为牛群。帮我种一片 <b>牧场</b>吧。<b>河流</b>把这片地分开成为不同的行，你只能在最近的这一行种，好在魔法师<b>“积”</b>能把你这行隔着河复制过去。一片草地就是 <b>行 × 列</b>，也就是<b>面积</b>；种好了，整群牛都会强壮起来。开种吧！"'} },
  objs:[ {en:'The Walled Meadow: area = rows × columns',zh:'围栏草甸：面积 = 行 × 列'},
         {en:'The Narrow Strip: turning is free',zh:'窄田：转动自由'},
         {en:'The Shared Fence: split a field freely',zh:'分配：自由拆分'} ],
  rounds:[round1,round2,round3],
  book:{ page:2, kicker:{en:'Introduction',zh:'入门之'}, title:{en:'Multiplication',zh:'乘法'},
    blocks:[
      {top:true, fig:'mintro', prose:{en:'Take the <b>same</b> jump again, <b class="r">3 + 3</b>, then fold it into two rows and add a line up the side: it reads <b class="b">2</b> × <b class="r">3</b>. Fill it in, and the product is an <b class="gr">area</b>.',zh:'把<b>同样</b>再跳一次，得 <b class="r">3 + 3</b>，叠成两行，旁边加一条竖线，就读作 <b class="b">2</b> × <b class="r">3</b>。填满它，乘积就是<b class="gr">面积</b>。'}},
      {note:{en:'<b>Reading a product as a picture.</b> The <b class="b">first</b> number is the rows, the <b class="r">second</b> the columns: <b class="b">2</b> × <b class="r">3</b> is <b class="b">2</b> rows of <b class="r">3</b>.',zh:'<b>把乘积读成图。</b> <b class="b">第一个</b>数是行数，<b class="r">第二个</b>是列数：<b class="b">2</b> × <b class="r">3</b> 就是 <b class="b">2</b> 行，每行 <b class="r">3</b> 个。'}},
      {law:{en:'Commutative',zh:'交换律'}, eq:'<span class="b">2</span> × <span class="r">3</span> = <span class="b">3</span> × <span class="r">2</span>', fig:'mrot', prose:{en:'Turn the rectangle a quarter: same area.',zh:'把长方形转一比四圈，面积不变。'}},
      {law:{en:'Associative',zh:'组合律'}, eq:'(<span class="b">2</span> × <span class="r">3</span>) × <span class="p">4</span> = <span class="p">2</span> × (<span class="b">3</span> × <span class="r">4</span>)', fig:'mgroups', prose:{en:'Group three factors either way: same result, same <b>24</b>.',zh:'三个数随便先乘哪两个，同一个结果，同样是 <b>24</b>。'}},
      {law:{en:'Distributive',zh:'分配律'}, eq:'<span class="b">2</span>×<span class="r">2</span> + <span class="b">2</span>×<span class="r">3</span> = <span class="b">2</span>×(<span class="r">2</span>+<span class="r">3</span>)', fig:'mdist', prose:{en:'Two rectangles of the same height slide into one: <b>2×2</b> and <b>2×3</b> make <b>2×(2+3)</b>.',zh:'两个等高的长方形拼成一个：<b>2×2</b> 加 <b>2×3</b> 就是 <b>2×(2+3)</b>。'}}
    ],
    read:{en:'Multiplication is area: rows times columns. Turning is free, and a field splits freely.',zh:'乘法就是面积：行乘以列。转动自由，田也能自由拆分。'} },
  intro:(E)=>{ field(2,3,{}); }
};
window.QUEST_q02 = QUEST;
})();
