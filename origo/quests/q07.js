/* ORIGO · Quest 7 = MathO p11 · "Area of the Unit Disk — the Donut Rings" (Act I: The Coil).
   A SECOND, independent way to the same area ½τ — and we meet dx, the tiny step that powers all of calculus ahead.
   Slice the radius into n thin rings of width dx (drag the slider); unroll one ring into a strip (width dx, length =
   its rim = radius × τ); stack every strip inner→outer and they form a TRIANGLE: base = the radius 1, height = the
   rim τ, so area = ½ · 1 · τ = ½τ ≈ 3.14. Same answer as the pizza cut — the double proof banishes Pi the Halver.
   Colours: rim/τ GOLD, radius & the step dx RED, area GREEN, Pi VIOLET. Every action is a right/wrong decision. */
(function(){
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=arr=>arr[rnd(0,arr.length-1)];
const t=s=>E.t(s);
const keq=(expr)=>'<span class="keq">'+expr+' <span class="tk">✓</span></span>';
const GOLD='#f4c830', RD='#ff6a4d', GR='#50d890', VIO='#c4a6ee', P=Math.PI, TAU=2*P;
const QUIP=[ {en:'Yes!',zh:'对了！'}, {en:'Tiny steps!',zh:'小小一步！'}, {en:'Stack them!',zh:'摞起来！'} ];

function label(x,y,txt,col,sz,halo){ const c=E.ctx; c.save(); c.font=(sz||14)+'px "IBM Plex Mono",monospace'; c.textAlign='center'; c.textBaseline='middle';
  if(halo){ c.lineWidth=3; c.strokeStyle='rgba(12,16,24,.62)'; c.strokeText(txt,x,y); } c.fillStyle=col||'#caa84a'; c.fillText(txt,x,y); c.restore(); }
function star(ctx,cx,cy,r,col){ if(r<=0)return; ctx.save(); ctx.fillStyle=col; ctx.beginPath();
  for(let i=0;i<5;i++){ const a=-P/2+i*2*P/5; ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r); const a2=a+P/5; ctx.lineTo(cx+Math.cos(a2)*r*0.45,cy+Math.sin(a2)*r*0.45); } ctx.closePath(); ctx.fill(); ctx.restore(); }

const TAUIMG={};
function tauImg(mood){ if(TAUIMG[mood])return TAUIMG[mood]; const i=new Image(); i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(FIG.tauBull(mood)); TAUIMG[mood]=i; return i; }
try{ ['happy','open'].forEach(tauImg); }catch(_){}

/* ---- PI THE HALVER (the Coil's rival). Q7 finishes his Coil arc: a SECOND proof of ½τ leaves him no escape. */
let PIST='loom', pmood='idle', pSad=0;
const PITAUNT=[ {en:'One proof proves nothing. Try again!',zh:'一种证法算不得数，再来！'},
  {en:'Tiny steps go nowhere, little calf.',zh:'小碎步走不远的，小牛。'},
  {en:'The inside is still half — still mine.',zh:'里头还是一半——还是我的。'} ];
function pi(cx,cy,s){ if(PIST==='gone')return; const ctx=E.ctx, tt=performance.now()/1000, recoil=(PIST==='recoil');
  if(recoil)s*=0.7; else if(pmood==='gloat')s*=1.14; else if(pmood==='hurt')s*=0.84;
  const a=recoil?0.6:(pmood==='hurt'?0.7:1); cy+=Math.sin(tt*1.7)*s*0.06; ctx.save(); ctx.globalAlpha=a;
  const au=ctx.createRadialGradient(cx,cy,2,cx,cy,s*1.7); au.addColorStop(0,'rgba(152,92,228,'+(pmood==='gloat'?0.5:0.3)+')'); au.addColorStop(1,'rgba(152,92,228,0)'); ctx.fillStyle=au; ctx.beginPath(); ctx.arc(cx,cy,s*1.7,0,7); ctx.fill();
  const g=ctx.createLinearGradient(cx-s,cy-s,cx+s,cy); g.addColorStop(0,VIO); g.addColorStop(1,'#7a5ec8');
  ctx.fillStyle=g; ctx.strokeStyle='#4a3478'; ctx.lineWidth=Math.max(1.5,s*0.05);
  ctx.beginPath(); ctx.moveTo(cx-s,cy); ctx.arc(cx,cy,s,P,P*2); ctx.closePath(); ctx.fill(); ctx.stroke();
  const ey=cy-s*0.42, ex=s*0.32, er=s*0.12;
  [-1,1].forEach(d=>{ ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(cx+d*ex,ey,er,er*1.15,0,0,7); ctx.fill(); ctx.fillStyle='#3a2c0a'; ctx.beginPath(); ctx.arc(cx+d*ex+(pmood==='gloat'?er*0.3:0), ey+(pmood==='hurt'?-er*0.4:er*0.2), er*0.5,0,7); ctx.fill(); });
  const sad=Math.max(0,Math.min(1,pSad+(pmood==='gloat'?-0.3:pmood==='hurt'?0.3:0))), bd=sad>0.5?-1:1;
  ctx.strokeStyle='#3a2c0a'; ctx.lineWidth=s*0.05; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(cx-ex-er,ey-er*1.1*bd); ctx.lineTo(cx-ex+er*0.6,ey-er*0.2*bd); ctx.moveTo(cx+ex+er,ey-er*1.1*bd); ctx.lineTo(cx+ex-er*0.6,ey-er*0.2*bd); ctx.stroke();
  const my=cy-s*0.12, mw=s*0.28, bend=s*0.14*(1-2*sad); ctx.lineWidth=s*0.055; ctx.beginPath(); ctx.moveTo(cx-mw,my-bend*0.3); ctx.quadraticCurveTo(cx,my+bend,cx+mw,my-bend*0.3); ctx.stroke();
  ctx.fillStyle='#f0e8ff'; ctx.font='italic '+(s*0.5)+'px Georgia'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('π',cx,cy-s*0.72);
  ctx.restore(); }

/* ---- the disk stage ---- */
const CX=()=>E.LW*0.42, CY=()=>E.LH*0.42, R=()=>E.LH*0.3;
function bg(){ const ctx=E.ctx,LW=E.LW,LH=E.LH; E.clear(); FIG.fog(ctx,0,LW,0,LH*0.5,performance.now());
  ctx.save(); ctx.strokeStyle='rgba(120,160,255,.05)'; ctx.lineWidth=1; for(let r=34;r<LW*1.15;r+=44){ ctx.beginPath(); ctx.arc(CX(),CY(),r,0,7); ctx.stroke(); } ctx.restore();
  const v=ctx.createRadialGradient(CX(),CY(),LH*0.18,CX(),CY(),LH); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(8,10,24,.36)'); ctx.fillStyle=v; ctx.fillRect(0,0,LW,LH);
  FIG.bull(ctx,40,LH-30,42); pi(LW*0.86,LH*0.22,28); }
function odot(){ const ctx=E.ctx; ctx.save(); ctx.fillStyle='#0a0a18'; ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(CX(),CY(),4.5,0,7); ctx.fill(); ctx.stroke(); ctx.restore(); label(CX()-14,CY()+14,'O','#cfe0ff',13,true); }

function piTaunt(fb){ return '<span style="color:#caa84a;font-style:italic">“'+t(pick(PITAUNT))+'”</span><br>'+fb; }
function prr(c,x,y,w,h,r){ r=Math.min(r,w/2,h/2); c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
const PCOL={ '½τ':GOLD, 'τ':GOLD, 'r·τ':GOLD, '1':RD, 'dx':RD, 'π':VIO };
function cpill(cx,cy,txt){ const c=E.ctx, b=E.pillBB(cx,cy,txt);
  c.save(); c.shadowColor='rgba(0,0,0,.4)'; c.shadowBlur=8; c.shadowOffsetY=3; prr(c,b.x,b.y,b.w,b.h,16); c.fillStyle='rgba(36,32,58,.92)'; c.fill();
  c.shadowColor='transparent'; c.lineWidth=1.6; c.strokeStyle='rgba(244,200,48,.8)'; prr(c,b.x,b.y,b.w,b.h,16); c.stroke(); c.restore();
  c.save(); c.textBaseline='middle'; c.textAlign='left';
  const fs=tk=>(tk==='τ'||tk==='π'||tk==='½τ')?20:14, F=tk=>{ c.font='600 '+fs(tk)+'px "IBM Plex Mono",monospace'; };
  F(' '); const sp=c.measureText(' ').width; const toks=txt.split(' ');
  let tot=0; toks.forEach((tk,i)=>{ F(tk); tot+=c.measureText(tk).width+(i?sp:0); });
  let x=cx-tot/2; toks.forEach((tk,i)=>{ if(i)x+=sp; F(tk); c.fillStyle=PCOL[tk]||'#f6e6b0'; c.fillText(tk,x,cy); x+=c.measureText(tk).width; }); c.restore(); }
function pickPills(prompt, baseDraw, y, opts, onRight){ const n=opts.length, cx=E.LW*0.5, gap=E.LW*0.28;
  const xs = n>=3?[cx-gap,cx,cx+gap]:[cx-gap*0.55,cx+gap*0.55];
  const draw=()=>{ baseDraw(); opts.forEach((o,i)=>cpill(xs[i],y,t(o.txt))); };
  const items=opts.map((o,i)=>({ bbox:()=>E.pillBB(xs[i],y,t(o.txt)), ok:o.ok, fb:o.fb, hiCol:'rgba(244,200,48,.95)', _o:o }));
  E.choose(prompt, draw, items, onRight, { react:(ok,it)=>{ pmood=ok?'hurt':'gloat'; if(ok) E.speakAs('tau', t(pick(QUIP))); if(it&&it._o&&it._o.react) it._o.react(ok); }, fbWrap:piTaunt }); }

/* ===== Round 1 — Slice the Radius: drag the slider; the radius splits into n rings of width dx ===== */
function round1(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(0); E.sceneStop(); PIST='loom'; pmood='idle'; pSad=0;
  E.setPlace(t({en:'Cut the Radius',zh:'切开半径'}));
  const SLX0=E.LW*0.17, SLX1=E.LW*0.7, SLY=E.LH*0.92, NMIN=3, NMAX=8, GATE=4;   // FEW big steps so N·dx = 1 is easy to see (the tiny-dx limit comes later)
  const NfromX=x=>Math.max(NMIN,Math.min(NMAX,Math.round(NMIN+(x-SLX0)/(SLX1-SLX0)*(NMAX-NMIN))));
  let N=NMIN;
  function radiusCut(n){ const ctx=E.ctx, ox=CX(), oy=CY(), R0=R(), dx=R0/n;
    ctx.save(); ctx.strokeStyle='rgba(244,200,48,.2)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(ox,oy,R0,0,7); ctx.stroke(); ctx.restore();   // faint unit circle — the radius we are cutting belongs to it
    ctx.save(); ctx.strokeStyle=RD; ctx.lineWidth=4; ctx.lineCap='butt'; ctx.beginPath(); ctx.moveTo(ox,oy); ctx.lineTo(ox,oy+R0); ctx.stroke();   // the radius: from O straight DOWN to the bottom tip — THE CUT
    ctx.lineWidth=2; for(let i=1;i<n;i++){ const y=oy+i*dx; ctx.beginPath(); ctx.moveTo(ox-5,y); ctx.lineTo(ox+5,y); ctx.stroke(); }   // cut into n steps
    ctx.beginPath(); ctx.moveTo(ox-6,oy); ctx.lineTo(ox+6,oy); ctx.moveTo(ox-6,oy+R0); ctx.lineTo(ox+6,oy+R0); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.strokeStyle='#ff8a6a'; ctx.lineWidth=6; ctx.lineCap='round'; ctx.shadowColor='rgba(255,138,106,.7)'; ctx.shadowBlur=6; ctx.beginPath(); ctx.moveTo(ox,oy+R0-dx); ctx.lineTo(ox,oy+R0); ctx.stroke(); ctx.restore();   // one step = dx, highlighted
    label(ox+20,oy+R0-dx/2,'dx','#ff8a6a',13,true);
    const xb=ox-22; ctx.save(); ctx.strokeStyle='rgba(244,200,48,.7)'; ctx.lineWidth=1.6; ctx.beginPath(); ctx.moveTo(ox-7,oy); ctx.lineTo(xb,oy); ctx.lineTo(xb,oy+R0); ctx.lineTo(ox-7,oy+R0); ctx.stroke(); ctx.restore();   // brace: the whole radius = 1
    label(xb-13,oy+R0/2,t({en:'radius 1',zh:'半径 1'}),GOLD,11,true);
    ctx.save(); ctx.fillStyle='#0a0a18'; ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(ox,oy,4.5,0,7); ctx.fill(); ctx.stroke(); ctx.restore(); label(ox-13,oy-3,'O','#cfe0ff',12,true); }
  function slider(){ const ctx=E.ctx; ctx.save();
    ctx.strokeStyle='rgba(200,210,235,.35)'; ctx.lineWidth=4; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(SLX0,SLY); ctx.lineTo(SLX1,SLY); ctx.stroke();
    const kx=knob.pos.x; ctx.strokeStyle=GOLD; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(SLX0,SLY); ctx.lineTo(kx,SLY); ctx.stroke();
    ctx.fillStyle=GOLD; ctx.shadowColor='rgba(244,200,48,.7)'; ctx.shadowBlur=8; ctx.beginPath(); ctx.arc(kx,SLY,11,0,7); ctx.fill(); ctx.restore();
    label(SLX0-4,SLY-20,t({en:'few',zh:'少'}),'#9fb0cc',11); label(SLX1+4,SLY-20,t({en:'many',zh:'多'}),'#9fb0cc',11); }
  function stat(){ E.status('<span style="color:#f4c830">'+t({en:'pieces: ',zh:'份数：'})+N+'</span>  <span style="color:#ff6a4d">'+t({en:'each step = dx',zh:'每步 = dx'})+'</span>'); }
  function drawCut(){ bg(); N=NfromX(knob.pos.x); pSad=Math.max(0,Math.min(1,(N-NMIN)/(GATE-NMIN))); radiusCut(N); slider(); stat(); }   // Pi frets (grin sags) the finer you cut
  const knob={ kind:'drag', home:{x:SLX0,y:SLY}, drag:{axis:'x',clamp:{x0:SLX0,x1:SLX1,y0:SLY,y1:SLY}},
    snap:[{x:SLX1,y:SLY,r:(SLX1-SLX0)+90,snap:false,ring:15}], bbox:a=>({x:a.pos.x-17,y:a.pos.y-17,w:34,h:34}), hiCol:'rgba(244,200,48,.9)' };   // target ring at the RIGHT ("many")
  E.tell(t({en:'<b>Cut the Radius.</b> Measure the area a <b>second</b> way (<b class="p">Pi</b>: <i>“crumbs!”</i>). The <b class="r">radius</b> from <b class="r">O</b> down to the rim is length <b class="r">1</b>. <b>Drag the slider</b> to cut it into equal steps. <b>N</b> = how many steps you make; <b class="r">dx</b> = the width of one step — one symbol, “delta-x” (Greek δ for a tiny change in x), <b>not</b> d times x. With just a few steps you can see <b>N</b> of them, each <b class="r">dx</b>, fill the whole radius.',
    zh:'<b>切开半径。</b>用<b>第二种</b>办法量面积（<b class="p">Pi</b>：<i>“碎屑！”</i>）。从 <b class="r">O</b> 到圆边的<b class="r">半径</b>是长度 <b class="r">1</b>。<b>拖动滑块</b>把它切成等步。<b>N</b> = 你切了几步；<b class="r">dx</b> = 一步的宽——一个整体符号，「delta-x」（希腊字母 δ，表示 x 的微小变化），<b>不是</b> d 乘 x。只用几步就能看出：<b>N</b> 步、每步 <b class="r">dx</b>，正好填满整条半径。'}));
  stat();
  E.busy=true; knob.pos={x:SLX0,y:SLY};   // OPENING: demonstrate the cutting — the slider auto-sweeps and the count grows from NMIN up to N
  E.anim(1500,p=>{ knob.pos.x=SLX0+(SLX1-SLX0)*p; N=NfromX(knob.pos.x); pSad=Math.max(0,Math.min(1,(N-NMIN)/(GATE-NMIN))); bg(); radiusCut(N); slider(); stat(); }, ()=>{ E.busy=false;
    E.scene({ actors:[knob], draw:drawCut, onDrop(a){ if(E.busy)return; N=NfromX(knob.pos.x);
      if(N>=GATE){ E.sfx('place'); ask(); }
      else { E.oops(); pmood='gloat'; E.status('<span style="color:#caa84a;font-style:italic">“'+t({en:'crumbs!',zh:'碎屑罢了！'})+'”</span> <span style="color:#ff6a4d">'+t({en:'cut the radius into finer steps.',zh:'把半径切成更细的步。'})+'</span>'); } } }); });
  function ask(){ E.sceneStop();
    pickPills(t({en:'You cut the <b class="r">radius</b> into <b>'+N+'</b> equal steps, each one <b class="r">dx</b>. End to end, the <b>N</b> steps fill the whole radius <b class="r">1</b>. Using multiplication, that says…',zh:'你把<b class="r">半径</b>切成 <b>'+N+'</b> 等步，每步一个 <b class="r">dx</b>。一段接一段，<b>N</b> 步正好填满整条半径 <b class="r">1</b>。用乘法来说，就是……'}),
      ()=>radiusCut(N), E.LH*0.9,
      [ {txt:{en:'N · dx = 1',zh:'N · dx = 1'}, ok:true},
        {txt:{en:'N · dx = N',zh:'N · dx = N'}, fb:{en:'N steps of dx add up to the whole radius — and the radius is 1. So N · dx = 1.',zh:'N 步 dx 合起来是整条半径——而半径是 1。所以 N · dx = 1。'}},
        {txt:{en:'N · dx = dx',zh:'N · dx = dx'}, fb:{en:'All N steps together make the radius 1, not one step. N · dx = 1.',zh:'N 步合起来是半径 1，不是一步。N · dx = 1。'}} ], win); }
  function win(){ bg(); radiusCut(N); E.setDots(1); E.tickQ(1); E.award(45); E.cheer(); E.sfx('win');
    E.status(keq(t({en:'N · dx = 1',zh:'N · dx = 1'})));
    E.tell(t({en:'So the radius <b class="r">1</b> is <b>N</b> tiny steps: <b class="r">N · dx = 1</b>. That little <b class="r">dx</b> — “delta-x”, one symbol — is the key tool of The Coil. Next: swing each step around <b class="r">O</b> to coil the disk into <b class="y">rings</b>.',
      zh:'于是半径 <b class="r">1</b> 就是 <b>N</b> 小步：<b class="r">N · dx = 1</b>。这个小小的 <b class="r">dx</b>——「delta-x」，一个整体符号——是「盘卷」的关键工具。接下来：把每一步绕 <b class="r">O</b> 旋一圈，把圆盘盘成一圈圈<b class="y">环</b>。'}));
    E.clearTray(); E.addBtn(t({en:'Coil into rings ▶',zh:'盘成环 ▶'}),'primary',E.advance); E.addBtn(t({en:'↺ Replay (no EXP)',zh:'↺ 重玩（无经验）'}),'ghost',E.replayStep); }
}

/* ===== Round 2 — Straighten the OUTER ring into a bar by pulling its two cut-ends to the two ends of the bar.
   Outer ring: rim = τ (circumference), thickness = dx. Cut at the bottom; unrolled (ccw) the bit just LEFT of the cut
   goes to the bar's RIGHT end, the bit just RIGHT of the cut goes to the bar's LEFT end. Then: base b = τ, height h = dx. */
function round2(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(1); E.sceneStop(); PIST='loom'; pmood='idle';
  E.setPlace(t({en:'Straighten a Ring',zh:'拉直圆环'}));
  const N=8, dxpx=()=>R()/N, w=()=>dxpx()*1.7, rr=()=>R();   // the OUTERMOST ring (radius 1, rim τ, thickness dx)
  const BL=()=>E.LW*0.19, BR=()=>E.LW*0.82, BY=()=>E.LH*0.86;
  let pL=0, pR=0;   // straighten progress of the left half / right half of the ring
  const ringPt=(u,off)=>{ const th=P/2-u*TAU, r=rr()+(off||0); return {x:CX()+r*Math.cos(th), y:CY()+r*Math.sin(th)}; };   // u: arc fraction from the cut (bottom), anticlockwise
  const barPt=(u,off)=>({x:BL()+u*(BR()-BL()), y:BY()+(off||0)});
  const morphPt=(u,off)=>{ const e=(u<0.5?pR:pL), a=ringPt(u,off), b=barPt(u,off); return {x:a.x+(b.x-a.x)*e, y:a.y+(b.y-a.y)*e}; };
  function band(){ const ctx=E.ctx, K2=88, out=[], inn=[]; for(let i=0;i<=K2;i++){ const u=i/K2; out.push(morphPt(u,w()/2)); inn.push(morphPt(u,-w()/2)); }
    ctx.save(); ctx.beginPath(); ctx.moveTo(out[0].x,out[0].y); for(let i=1;i<=K2;i++)ctx.lineTo(out[i].x,out[i].y); for(let i=K2;i>=0;i--)ctx.lineTo(inn[i].x,inn[i].y); ctx.closePath(); ctx.fillStyle='rgba(80,216,144,.3)'; ctx.fill();
    ctx.strokeStyle=GOLD; ctx.lineWidth=2.6; ctx.beginPath(); ctx.moveTo(out[0].x,out[0].y); for(let i=1;i<=K2;i++)ctx.lineTo(out[i].x,out[i].y); ctx.moveTo(inn[0].x,inn[0].y); for(let i=1;i<=K2;i++)ctx.lineTo(inn[i].x,inn[i].y); ctx.stroke();   // the rim (gold)
    ctx.strokeStyle=RD; ctx.lineWidth=2.6; ctx.beginPath(); ctx.moveTo(out[0].x,out[0].y); ctx.lineTo(inn[0].x,inn[0].y); ctx.moveTo(out[K2].x,out[K2].y); ctx.lineTo(inn[K2].x,inn[K2].y); ctx.stroke(); ctx.restore(); }   // the two cut ends = dx
  function innerRings(){ const ctx=E.ctx; for(let i=1;i<N;i++){ const ri=R()*i/N; ctx.save(); ctx.fillStyle=(i%2)?'rgba(80,216,144,.13)':'rgba(80,216,144,.06)'; ctx.beginPath(); ctx.arc(CX(),CY(),ri,0,7); ctx.fill(); ctx.strokeStyle='rgba(244,200,48,.16)'; ctx.lineWidth=1; ctx.stroke(); ctx.restore(); } }
  function drawAll(extra){ bg(); innerRings(); const ctx=E.ctx; ctx.save(); ctx.strokeStyle='rgba(255,106,77,.7)'; ctx.lineWidth=2; ctx.setLineDash([5,4]); ctx.beginPath(); ctx.moveTo(CX(),CY()); ctx.lineTo(CX(),CY()+R()); ctx.stroke(); ctx.restore(); odot(); band(); if(extra)extra(); }
  function ghost(x){ const ctx=E.ctx; ctx.save(); ctx.strokeStyle='rgba(80,216,144,.55)'; ctx.setLineDash([4,4]); ctx.lineWidth=1.6; ctx.strokeRect(x-7,BY()-w()/2-4,14,w()+8); ctx.restore(); }
  function handAt(p,col){ const ctx=E.ctx; ctx.save(); ctx.fillStyle=col; ctx.shadowColor=col; ctx.shadowBlur=9; ctx.beginPath(); ctx.arc(p.x,p.y,8,0,7); ctx.fill(); ctx.restore(); }
  E.tell(t({en:'<b>Straighten a Ring.</b> Take the <b>outer</b> <b class="y">ring</b> — its rim is the whole turn <b class="y">τ</b>, and it is <b class="r">dx</b> thick. It is cut at the bottom. <b>Drag the cut-end on the LEFT round to the bar\'s RIGHT end</b> — the ring straightens out.',
    zh:'<b>拉直圆环。</b>取<b>最外</b>那圈<b class="y">环</b>——它的圆边是整整一圈 <b class="y">τ</b>，厚 <b class="r">dx</b>。它在底部被切开。<b>把切口左边的一端，拖到长条的右端</b>——圆环就被拉直。'}));
  phaseA();
  function phaseA(){ const tgt=barPt(1);
    const h={ kind:'drag', home:ringPt(0.985), bbox:a=>({x:a.pos.x-16,y:a.pos.y-16,w:32,h:32}), hiCol:'rgba(80,216,144,.9)' };
    E.scene({ actors:[h], draw:()=>drawAll(()=>{ ghost(tgt.x); handAt(h.grab?h.pos:ringPt(0.985),RD); label(CX(),CY()-R()-13,t({en:'drag the LEFT cut-end → bar’s RIGHT end',zh:'把切口左端 → 长条右端'}),'#ffd9b0',11,true); }),
      onDrop(a,z,info){ if(E.busy)return; if(info && Math.hypot(info.x-tgt.x,info.y-tgt.y)<80){ E.busy=true; E.sceneStop(); E.sfx('place'); E.mood('happy'); pmood='hurt';
          E.anim(700,p=>{ pL=p<0.5?2*p*p:1-Math.pow(-2*p+2,2)/2; drawAll(); }, ()=>{ pL=1; E.busy=false; phaseB(); }); }
        else { E.oops(); E.status('<span style="color:#ff6a4d">'+t({en:'pull that end over to the bar’s RIGHT end.',zh:'把那一端拉到长条的右端。'})+'</span>'); } } });
  }
  function phaseB(){ const tgt=barPt(0);
    const h={ kind:'drag', home:ringPt(0.015), bbox:a=>({x:a.pos.x-16,y:a.pos.y-16,w:32,h:32}), hiCol:'rgba(80,216,144,.9)' };
    E.tell(t({en:'Now the other end. <b>Drag the cut-end on the RIGHT round to the bar\'s LEFT end</b> — and the ring is a straight bar.',zh:'再来另一端。<b>把切口右边的一端，拖到长条的左端</b>——圆环就成了一根直条。'}));
    E.scene({ actors:[h], draw:()=>drawAll(()=>{ ghost(tgt.x); handAt(h.grab?h.pos:ringPt(0.015),RD); label(CX(),CY()-R()-13,t({en:'drag the RIGHT cut-end → bar’s LEFT end',zh:'把切口右端 → 长条左端'}),'#ffd9b0',11,true); }),
      onDrop(a,z,info){ if(E.busy)return; if(info && Math.hypot(info.x-tgt.x,info.y-tgt.y)<80){ E.busy=true; E.sceneStop(); E.sfx('place'); E.mood('happy'); pmood='hurt';
          E.anim(700,p=>{ pR=p<0.5?2*p*p:1-Math.pow(-2*p+2,2)/2; drawAll(); }, ()=>{ pR=1; E.busy=false; decide(); }); }
        else { E.oops(); E.status('<span style="color:#ff6a4d">'+t({en:'pull that end over to the bar’s LEFT end.',zh:'把那一端拉到长条的左端。'})+'</span>'); } } });
  }
  function decide(){ pL=1; pR=1;
    function q1(){ pickPills(t({en:'The bar IS the outer <b class="y">ring</b> unrolled, so its <b>base</b> (long side) is the ring\'s whole rim. The outer ring\'s rim is <b class="y">τ</b>. So the base <b class="y">b</b> = ?',zh:'这根长条就是最外<b class="y">环</b>摊开后的样子，所以它的<b>底</b>（长边）就是这个环的整条圆边。最外环的圆边是 <b class="y">τ</b>。所以底 <b class="y">b</b> = ?'}),
        ()=>drawAll(()=>{ label((BL()+BR())/2,BY()-w()/2-12,'b',GOLD,15,true); }), E.LH*0.92,
        [ {txt:{en:'b = τ',zh:'b = τ'}, ok:true},
          {txt:{en:'b = dx',zh:'b = dx'}, fb:{en:'dx is the THICKNESS (the short side). The long base is the unrolled rim, τ.',zh:'dx 是厚度（短边）。长底是摊开的圆边，τ。'}},
          {txt:{en:'b = 1',zh:'b = 1'}, fb:{en:'1 is the radius. The rim of the outer ring is radius × τ = τ.',zh:'1 是半径。最外环的圆边 = 半径 × τ = τ。'}} ], q2); }
    function q2(){ pickPills(t({en:'And the bar\'s <b>height</b> is the ring\'s thickness — one tiny step. So <b class="r">h</b> = ?',zh:'而长条的<b>高</b>就是环的厚度——一小步。所以 <b class="r">h</b> = ?'}),
        ()=>drawAll(()=>{ label((BL()+BR())/2,BY()-w()/2-12,'b = τ',GOLD,14,true); label(BL()-13,BY(),'h',RD,14,true); }), E.LH*0.92,
        [ {txt:{en:'h = dx',zh:'h = dx'}, ok:true},
          {txt:{en:'h = τ',zh:'h = τ'}, fb:{en:'τ is the long base. The height is the thin thickness — dx.',zh:'τ 是长底。高是那薄薄的厚度——dx。'}},
          {txt:{en:'h = 1',zh:'h = 1'}, fb:{en:'1 is the radius. The ring is only one step thick: h = dx.',zh:'1 是半径。环只有一步厚：h = dx。'}} ], win); }
    q1();
  }
  function win(){ E.setDots(2); E.tickQ(2); E.award(45); pmood='hurt'; drawAll(()=>{ label((BL()+BR())/2,BY()-w()/2-12,'b = τ',GOLD,14,true); label(BL()-13,BY(),'h = dx',RD,12,true); });
    E.cheer(); E.sfx('win');
    E.status(keq(t({en:'outer ring → bar: base τ, height dx',zh:'最外环 → 长条：底 τ，高 dx'})));
    E.tell(t({en:'The <b>outer</b> <b class="y">ring</b> straightens into a bar: base <b class="y">b</b> = <b class="y">τ</b> (its rim), height <b class="r">h</b> = <b class="r">dx</b> (its thickness). Every inner ring will do the same — shorter, because its rim is smaller. Uncoil them all and see the shape.',
      zh:'<b>最外</b>那圈<b class="y">环</b>拉直成一根长条：底 <b class="y">b</b> = <b class="y">τ</b>（它的圆边），高 <b class="r">h</b> = <b class="r">dx</b>（它的厚度）。每个内环也一样——只是更短，因为圆边更小。把它们全摊开，看看拼出什么形状。'}));
    E.clearTray(); E.addBtn(t({en:'Uncoil the other rings ▶',zh:'摊开其余的环 ▶'}),'primary',E.advance); E.addBtn(t({en:'◀ Prev step',zh:'◀ 上一步'}),'ghost',E.prevStep); }
}

/* ===== Round 3 — Stack to a Triangle: strips inner→outer form a triangle (base 1, height τ); area = ½·1·τ = ½τ ===== */
function round3(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(2); E.sceneStop(); PIST='loom'; pmood='idle';
  E.setPlace(t({en:'Stack to a Triangle',zh:'摞成三角'}));
  const M=8;   // M strips of growing length stacked into a right triangle: vertical leg = radius 1, horizontal leg = τ
  const TX0=()=>E.LW*0.2, TXW=()=>E.LW*0.56, TYT=()=>E.LH*0.34, TYB=()=>E.LH*0.74;   // triangle box
  const rowY=j=>TYB()-(j+0.5)*(TYB()-TYT())/M, rowLen=j=>TXW()*(j+1)/M;   // row 0 = shortest (inner ring) at bottom; row M-1 = longest (τ) at top
  const filled=new Array(M).fill(false);
  const home={x:E.LW*0.84, y:E.LH*0.85};
  const strip={ kind:'drag', home:home, bbox:a=>({x:a.pos.x-22,y:a.pos.y-12,w:44,h:24}) };
  const rowOf=y=>{ let best=0,bd=1e9; for(let j=0;j<M;j++){ const d=Math.abs(y-rowY(j)); if(d<bd){bd=d;best=j;} } return best; };
  const rh=()=>(TYB()-TYT())/M*0.82;
  function drawRow(j,ghost,hot){ const ctx=E.ctx, y=rowY(j), len=rowLen(j), h=rh();
    ctx.save();
    if(ghost){ ctx.globalAlpha=hot?0.95:0.4; ctx.setLineDash([5,5]); ctx.strokeStyle=hot?'rgba(80,216,144,.95)':'rgba(170,190,225,.5)'; ctx.lineWidth=hot?2.4:1.3; if(hot){ctx.shadowColor='rgba(80,216,144,.6)';ctx.shadowBlur=8;} ctx.strokeRect(TX0(),y-h/2,len,h); }
    else { ctx.fillStyle='rgba(80,216,144,.24)'; ctx.fillRect(TX0(),y-h/2,len,h); ctx.strokeStyle=GOLD; ctx.lineWidth=1.8; ctx.beginPath(); ctx.moveTo(TX0(),y); ctx.lineTo(TX0()+len,y); ctx.stroke(); ctx.strokeStyle=RD; ctx.lineWidth=1.6; ctx.beginPath(); ctx.moveTo(TX0(),y-h/2); ctx.lineTo(TX0(),y+h/2); ctx.stroke(); }
    ctx.restore(); }
  function stripIcon(x,y,lab){ const ctx=E.ctx,w=40,h=14; ctx.save(); ctx.fillStyle='rgba(80,216,144,.26)'; ctx.fillRect(x-w/2,y-h/2,w,h); ctx.strokeStyle=GOLD; ctx.lineWidth=2; ctx.strokeRect(x-w/2,y-h/2,w,h); ctx.strokeStyle=RD; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x-w/2,y-h/2); ctx.lineTo(x-w/2,y+h/2); ctx.stroke(); ctx.restore(); if(lab) label(x,y+h+10,t({en:'drag a strip',zh:'拖一条带'}),'#bfe8cf',11,true); }
  function buildStat(){ const n=filled.filter(Boolean).length; E.status('<span style="color:#f4c830">'+t({en:'strips stacked: ',zh:'已摞带子：'})+n+' / '+M+'</span>'); }
  function drawBuild(){ bg(); const ctx=E.ctx;
    let hot=-1; if(strip.grab){ const p=strip.pos; if(p.x>TX0()-30&&p.x<TX0()+TXW()+30&&p.y>TYT()-20&&p.y<TYB()+20){ const j=rowOf(p.y); if(!filled[j]) hot=j; } }
    for(let j=0;j<M;j++){ if(filled[j]) drawRow(j,false); else drawRow(j,true,j===hot); }
    if(strip.grab) stripIcon(strip.pos.x,strip.pos.y,false); else stripIcon(home.x,home.y,true); }
  E.tell(t({en:'<b>Stack to a Triangle.</b> <b class="p">Pi</b> still sneers your strips prove nothing. Line them up by size — inner rings short, outer ones long — and <b class="y">Tau</b> stacks them. <b>Drag a strip into each row</b>, shortest at the bottom; fill all <b>'+M+'</b> and watch the shape they make.',
    zh:'<b>摞成三角。</b><b class="p">Pi</b> 还在冷笑说你的带子证明不了什么。把它们按长短排好——内环短、外环长——让 <b class="y">Tau</b> 摞起来。<b>把带子拖进每一行</b>，最短的放最下；填满全部 <b>'+M+'</b> 条，看它们拼出什么形状。'}));
  buildStat();
  E.scene({ actors:[strip], draw:drawBuild, onDrop(a,z,info){ if(E.busy)return;
    if(info&&!info.tapped){ const p=info; if(p.x>TX0()-30&&p.x<TX0()+TXW()+30&&p.y>TYT()-20&&p.y<TYB()+20){ const j=rowOf(p.y); if(!filled[j]){ filled[j]=true; E.sfx('place'); E.pop('▬'); E.mood('happy'); pmood='hurt'; } } }
    if(filled.every(Boolean)){ E.sceneStop(); decide(); } else buildStat(); } });
  function tri(extra){ bg(); for(let j=0;j<M;j++) drawRow(j,false); const ctx=E.ctx;
    ctx.save(); ctx.strokeStyle=RD; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(TX0(),TYT()); ctx.lineTo(TX0(),TYB()); ctx.stroke();   // vertical leg = radius 1
    ctx.strokeStyle=GOLD; ctx.lineWidth=2.8; ctx.beginPath(); ctx.moveTo(TX0(),TYT()); ctx.lineTo(TX0()+TXW(),TYT()); ctx.stroke(); ctx.restore();   // top = the outer rim τ
    label(TX0()-14,(TYT()+TYB())/2,'1',RD,14,true); label(TX0()+TXW()/2,TYT()-13,'τ',GOLD,18,true); if(extra)extra(); }
  function decide(){
    pickPills(t({en:'The strips stack into a <b class="g">triangle</b>: its upright side is the <b class="r">radius</b> 1, its top is the outer rim <b class="y">τ</b>. A triangle\'s area is ½ × base × height. So the disk\'s area is…',zh:'带子摞成一个<b class="g">三角</b>：竖边是<b class="r">半径</b> 1，顶边是最外圆边 <b class="y">τ</b>。三角形面积 = ½ × 底 × 高。所以圆盘面积是……'}),
      ()=>tri(), E.LH*0.92,
      [ {txt:{en:'τ ≈ 6.28',zh:'τ ≈ 6.28'}, fb:{en:'That would be base × height with no half. A triangle is HALF of that: ½·1·τ = ½τ.',zh:'那是底 × 高、没取一半。三角形是它的一半：½·1·τ = ½τ。'}},
        {txt:{en:'½τ ≈ 3.14',zh:'½τ ≈ 3.14'}, ok:true},
        {txt:{en:'1',zh:'1'}, fb:{en:'Use ½ × base × height = ½ × 1 × τ = ½τ ≈ 3.14.',zh:'用 ½ × 底 × 高 = ½ × 1 × τ = ½τ ≈ 3.14。'}} ], finish);
  }
  function finish(){ E.busy=true; E.sceneStop(); PIST='gone'; E.sfx('bracket'); E.speakAs('tau', t({en:'Same answer — twice!',zh:'同一个答案——两遍！'}));
    E.anim(900,p=>{ tri(()=>{ const ctx=E.ctx; ctx.save(); ctx.globalAlpha=0.18+0.22*p; ctx.fillStyle=GR; ctx.beginPath(); ctx.moveTo(TX0(),TYB()); ctx.lineTo(TX0(),TYT()); ctx.lineTo(TX0()+TXW(),TYT()); ctx.closePath(); ctx.fill(); ctx.restore(); label(TX0()+TXW()*0.34,(TYT()+TYB())*0.5,'½τ',GOLD,18+8*p,true); }); }, win); }
  function win(){ tri(()=>{ const ctx=E.ctx; ctx.save(); ctx.globalAlpha=0.4; ctx.fillStyle=GR; ctx.beginPath(); ctx.moveTo(TX0(),TYB()); ctx.lineTo(TX0(),TYT()); ctx.lineTo(TX0()+TXW(),TYT()); ctx.closePath(); ctx.fill(); ctx.restore(); label(TX0()+TXW()*0.34,(TYT()+TYB())*0.5-8,'½τ',GOLD,20,true); label(TX0()+TXW()*0.34,(TYT()+TYB())*0.5+15,'= π ≈ 3.14',VIO,12,true); });
    E.setDots(3); E.tickQ(3); E.award(70); E.cheer(); E.sfx('win');
    E.status(keq('½·1·τ = ½τ ≈ 3.14'));
    E.tell(t({en:'Stacked, the strips make a <b class="g">triangle</b>: base the <b class="r">radius</b> 1, height the rim <b class="y">τ</b>. Its area is ½ · 1 · <b class="y">τ</b> = <b class="y">½τ</b> ≈ <b>3.14</b> — the <b>same</b> as the pizza cut. Two roads, one answer: the disk\'s area is <b class="y">½τ</b> = <b class="p">π</b>. With <b class="p">π</b> caught twice, <b class="p">Pi the Halver</b> is driven from the Glade — and you keep the tool that did it: <b class="r">dx</b>, the tiny step. Soon it will measure the area under <b>any</b> curve.',
      zh:'摞起来，带子拼成一个<b class="g">三角</b>：底是<b class="r">半径</b> 1，高是圆边 <b class="y">τ</b>。它的面积 = ½ · 1 · <b class="y">τ</b> = <b class="y">½τ</b> ≈ <b>3.14</b>——和披萨切法<b>一模一样</b>。两条路，同一个答案：圆盘的面积是 <b class="y">½τ</b> = <b class="p">π</b>。<b class="p">π</b> 被抓住两回，<b class="p">半圆贩子</b>被赶出圆环林——而你留下了制胜的工具：<b class="r">dx</b>，那一小步。很快，它能量出<b>任何</b>曲线下的面积。'}));
    E.clearTray(); E.addBtn(t({en:'Claim the Codex page 📖',zh:'领取典籍书页 📖'}),'primary',()=>E.openBook(QUEST.book)); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
}

const QUEST = {
  id:'q07', page:11, region:'coil', bgm:'audio/bgm-cradle.mp3?v=20260606k2',
  kicker:{en:'The Coil',zh:'盘卷'},
  title:{en:'The Disk\'s Area — Donut Rings',zh:'圆盘的面积 · 甜甜圈法'},
  meta:{ title:{en:'Measure the area — a second way',zh:'再量一次面积'}, giver:{en:'Master Curvo · The Coil',zh:'曲师 Curvo · 盘卷'},
    flavor:{en:'"One proof, <b class="p">Pi</b> sneers, proves nothing — <i>“crumbs measure nothing!”</i> So <b>measure the disk\'s <b class="g">area</b> a SECOND way</b> and beat him twice, meeting the tool that powers everything still to come. Slice the <b class="r">radius</b> into thin <b class="y">rings</b>, each one tiny step <b class="r">dx</b> wide; your calf <b class="y">Tau</b> tugs a ring loose and unrolls it into a strip — <b class="r">dx</b> tall, its rim long — then stacks them all, short to tall, into a <b class="g">triangle</b> (base the <b class="r">radius</b>, height the rim <b class="y">τ</b>). Its area? <b class="y">½τ</b> — the very same as the pizza cut. Two roads, one truth: <b class="p">Pi</b> is driven off, and the little <b class="r">dx</b> is yours to keep."',
      zh:'"一种证法，<b class="p">Pi</b> 冷笑，算不得数——<i>“碎屑量得出什么！”</i>那就<b>用第二种办法再量一遍圆盘的<b class="g">面积</b></b>，把他驳倒两回，顺便认识那件驱动后续一切的工具。把<b class="r">半径</b>切成一圈圈细<b class="y">环</b>，每环宽一小步 <b class="r">dx</b>；你的小牛 <b class="y">Tau</b> 把一个环拽松、摊成一条带——高 <b class="r">dx</b>，长是它的圆边——再把它们从短到长摞成一个<b class="g">三角</b>（底是<b class="r">半径</b>，高是圆边 <b class="y">τ</b>）。面积呢？<b class="y">½τ</b>——和披萨切法分毫不差。两条路，同一个真相：<b class="p">Pi</b> 被赶跑，那小小的 <b class="r">dx</b> 就归你了。"'} },
  objs:[ {en:'Slice the Radius: n rings, each dx = 1/N wide',zh:'切开半径：n 个环，每环 dx = 1/N'},
         {en:'Unroll a Ring: a strip dx wide, r·τ long',zh:'摊开圆环：一条带，宽 dx，长 r·τ'},
         {en:'Stack to a Triangle: area = ½·1·τ = ½τ = π',zh:'摞成三角：面积 = ½·1·τ = ½τ = π'} ],
  rounds:[round1,round2,round3],
  book:{ page:7, kicker:{en:'The Coil',zh:'盘卷之'}, title:{en:'Area of the Unit Disk — Donut Rings',zh:'单位圆盘的面积 · 甜甜圈法'},
    blocks:[
      {top:true, fig:'drings', prose:{en:'A second road to the same area. Slice the <b class="r">radius</b> into thin <b class="y">rings</b>, like tree-rings — each one tiny step <b class="r">dx</b> wide. The finer you cut, the closer <b class="r">dx</b> creeps to nothing. This little <b class="r">dx</b> is the key tool of everything ahead.',
        zh:'通往同一面积的第二条路。把<b class="r">半径</b>切成一圈圈细<b class="y">环</b>，像年轮——每环宽一小步 <b class="r">dx</b>。切得越细，<b class="r">dx</b> 越贴近于零。这个小小的 <b class="r">dx</b> 是后面一切的关键工具。'}},
      {law:{en:'Unroll one ring into a strip',zh:'把一个环摊成一条带'}, fig:'dstrip', prose:{en:'A <b class="y">ring</b> is a loop of rim, so unrolled it is a thin <b class="g">strip</b>: <b class="r">dx</b> wide, and as long as its rim. From Q5 a rim is radius × τ, so a ring of radius <b>r</b> gives a strip <b class="y">r·τ</b> long. Inner rings are short; the outer one is <b class="y">τ</b>.',
        zh:'<b class="y">环</b>是一圈圆边，摊开就是一条细<b class="g">带</b>：宽 <b class="r">dx</b>，长就是它的圆边。由 Q5，圆边 = 半径 × τ，所以半径为 <b>r</b> 的环给出一条长 <b class="y">r·τ</b> 的带。内环短，最外环是 <b class="y">τ</b>。'}},
      {law:{en:'Stack them: a triangle',zh:'摞起来：一个三角'}, eq:'½ · <span class="r">1</span> · <span class="y">τ</span> = <span class="y">½τ</span> = <span class="p">π</span> ≈ 3.14', fig:'dtri', prose:{en:'Stack the strips short-to-tall and they lean into a <b class="g">triangle</b>: base the <b class="r">radius</b> <b class="r">1</b>, height the rim <b class="y">τ</b>. A triangle is ½ × base × height = <b class="y">½τ</b> ≈ <b>3.14</b> — the <b>same</b> as the pizza cut. Two roads, one answer: <b class="y">½τ</b> = <b class="p">π</b>.',
        zh:'把带子从短到长摞起来，它们斜成一个<b class="g">三角</b>：底是<b class="r">半径</b> <b class="r">1</b>，高是圆边 <b class="y">τ</b>。三角形 = ½ × 底 × 高 = <b class="y">½τ</b> ≈ <b>3.14</b>——和披萨切法<b>一样</b>。两条路，同一个答案：<b class="y">½τ</b> = <b class="p">π</b>。'}},
      {note:{en:'<b>Meet dx.</b> Cutting a shape into many tiny steps of width <b class="r">dx</b>, measuring each, and stacking them — that is the whole idea of an integral. You just did one. From here, <b class="r">dx</b> will measure the area under any curve.',
        zh:'<b>认识 dx。</b>把一个图形切成许多宽为 <b class="r">dx</b> 的小步，逐一量出，再摞起来——这就是「积分」的全部思想。你刚刚就做了一次。往后，<b class="r">dx</b> 能量出任何曲线下的面积。'}}
    ],
    read:{en:'Here is a second way to the disk area. Slice the radius into thin rings, each one step dx wide. Unroll a ring and it is a strip: dx wide, and r times tau long, its rim. Stack the strips short to tall and they make a triangle: base one radius, height the rim tau. A triangle is half base times height, half times 1 times tau, which is half tau, about 3.14. The same as the pizza cut. And cutting into tiny dx steps, then stacking, is exactly what an integral is.',
      zh:'这是求圆盘面积的第二种办法。把半径切成细环，每环宽一步 dx。把一个环摊开，是一条带：宽 dx，长 r 乘 tau，就是它的圆边。把带子从短到长摞起来，拼成一个三角：底是一条半径，高是圆边 tau。三角形是半底乘高，半乘 1 乘 tau，就是半个 tau，大约 3.14。和披萨切法一样。把图形切成微小的 dx 步、再摞起来，这正是积分。'} },
  intro:(E)=>{ bg(); const c=E.ctx; const n=6; for(let i=1;i<=n;i++){ const rr=R()*i/n; c.save(); c.strokeStyle=(i===n)?GOLD:'rgba(244,200,48,'+(0.3+0.4*i/n)+')'; c.lineWidth=(i===n)?3:1.6; c.beginPath(); c.arc(CX(),CY(),rr,0,7); c.stroke(); c.restore(); } odot(); }
};
window.QUEST_q07 = QUEST;
})();
