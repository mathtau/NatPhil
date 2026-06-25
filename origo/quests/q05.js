/* ORIGO · Quest 5 = MathO p9 · "Circumference of the Unit Circle" — OPENS Act I: The Coil (Circle → Calculus).
   Build the unit circle (every point one rod from O), step around it with 6 unit radii → a hexagon whose chords are each 1,
   see every curved arc bulges a little PAST its chord, add the six → the circumference τ ≈ 6.28. τ replaces π (the First Law).
   Tau the Bull charges one full turn = one τ as the payoff. Colours follow the book: circle BLUE, the unit "1" RED, chords/arcs
   GREEN, τ GOLD. Every action is a right/wrong decision (hearts apply via the engine). Mentor: Master Curvo, the Cartwright.
   DRAFT — reachable at play.html?q=05; NOT yet linked from the world map / manifest (awaiting sign-off). */
(function(){
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=arr=>arr[rnd(0,arr.length-1)];
const t=s=>E.t(s);
const keq=(expr)=>'<span class="keq">'+expr+' <span class="tk">✓</span></span>';
const BL='#f4c830', RD='#ff6a4d', GR='#50d890', GOLD='#f4c830', P=Math.PI, TAU=2*P;   // BL = the circle/arc colour, now GOLD (the full circle is gold, brand-consistent); RD/GR exactly match the bubble .r/.g classes
const QUIP=[ {en:'Yes!',zh:'对了！'}, {en:'Good eye!',zh:'好眼力！'}, {en:'Round and true!',zh:'又圆又准！'} ];

function label(x,y,txt,col,sz,halo){ const c=E.ctx; c.save(); c.font=(sz||14)+'px "IBM Plex Mono",monospace'; c.textAlign='center'; c.textBaseline='middle';
  if(halo){ c.lineWidth=3; c.strokeStyle='rgba(12,16,24,.62)'; c.strokeText(txt,x,y); } c.fillStyle=col||'#caa84a'; c.fillText(txt,x,y); c.restore(); }
function star(ctx,cx,cy,r,col){ if(r<=0)return; ctx.save(); ctx.fillStyle=col; ctx.beginPath();
  for(let i=0;i<5;i++){ const a=-P/2+i*2*P/5; ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r); const a2=a+P/5; ctx.lineTo(cx+Math.cos(a2)*r*0.45,cy+Math.sin(a2)*r*0.45); } ctx.closePath(); ctx.fill(); ctx.restore(); }

const TAUIMG={};
function tauImg(mood){ if(TAUIMG[mood])return TAUIMG[mood]; const i=new Image(); i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(FIG.tauBull(mood)); TAUIMG[mood]=i; return i; }
try{ ['happy','open'].forEach(tauImg); }catch(_){}

/* ---- PI THE HALVER — the Coil's rival: a smug HALF-disc "prophet" who insists half a turn is enough and keeps the circle from closing.
   PIST: loom (present) | recoil (weakened) | gone (driven off). pmood: idle | gloat (after a WRONG answer) | hurt (after a RIGHT one). */
let PIST='loom', pmood='idle', pSad=0;   // pSad 0→1 = his grin gradually sags to a frown as you push him back
const PITAUNT=[ {en:'Half is enough — why go all the way round?',zh:'半圈就够啦——何必绕一整圈？'},
  {en:'Stop at the straight bits, little calf!',zh:'走到直边就停下吧，小牛！'},
  {en:'Six! Forget that pesky curve!',zh:'六就够了！别管那讨厌的弯儿！'} ];
function pi(cx,cy,s){ if(PIST==='gone'||PIST==='cover')return; const ctx=E.ctx, tt=performance.now()/1000, recoil=(PIST==='recoil');
  if(recoil)s*=0.7; else if(pmood==='gloat')s*=1.14; else if(pmood==='hurt')s*=0.84;
  const a=recoil?0.6:(pmood==='hurt'?0.7:1); cy+=Math.sin(tt*1.7)*s*0.06; ctx.save(); ctx.globalAlpha=a;
  const au=ctx.createRadialGradient(cx,cy,2,cx,cy,s*1.7); au.addColorStop(0,'rgba(152,92,228,'+(pmood==='gloat'?0.5:0.3)+')'); au.addColorStop(1,'rgba(152,92,228,0)'); ctx.fillStyle=au; ctx.beginPath(); ctx.arc(cx,cy,s*1.7,0,7); ctx.fill();
  const g=ctx.createLinearGradient(cx-s,cy-s,cx+s,cy); g.addColorStop(0,'#c4a6ee'); g.addColorStop(1,'#7a5ec8');   // VIOLET — the antagonist colour, distinct from the gold circle/τ
  ctx.fillStyle=g; ctx.strokeStyle='#4a3478'; ctx.lineWidth=Math.max(1.5,s*0.05);
  ctx.beginPath(); ctx.moveTo(cx-s,cy); ctx.arc(cx,cy,s,P,P*2); ctx.closePath(); ctx.fill(); ctx.stroke();   // the upper HALF-disc (dome up, flat diameter as the chin)
  const ey=cy-s*0.42, ex=s*0.32, er=s*0.12;
  [-1,1].forEach(d=>{ ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(cx+d*ex,ey,er,er*1.15,0,0,7); ctx.fill(); ctx.fillStyle='#3a2c0a'; ctx.beginPath(); ctx.arc(cx+d*ex+(pmood==='gloat'?er*0.3:0), ey+(pmood==='hurt'?-er*0.4:er*0.2), er*0.5,0,7); ctx.fill(); });
  const sad=Math.max(0,Math.min(1,pSad+(pmood==='gloat'?-0.3:pmood==='hurt'?0.3:0))), bd=sad>0.5?-1:1;   // grin (sad 0) → flat → frown (sad 1)
  ctx.strokeStyle='#3a2c0a'; ctx.lineWidth=s*0.05; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(cx-ex-er,ey-er*1.1*bd); ctx.lineTo(cx-ex+er*0.6,ey-er*0.2*bd); ctx.moveTo(cx+ex+er,ey-er*1.1*bd); ctx.lineTo(cx+ex-er*0.6,ey-er*0.2*bd); ctx.stroke();
  const my=cy-s*0.12, mw=s*0.28, bend=s*0.14*(1-2*sad); ctx.lineWidth=s*0.055; ctx.beginPath(); ctx.moveTo(cx-mw,my-bend*0.3); ctx.quadraticCurveTo(cx,my+bend,cx+mw,my-bend*0.3);
  ctx.stroke();
  ctx.fillStyle='#f0e8ff'; ctx.font='italic '+(s*0.5)+'px Georgia'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('π',cx,cy-s*0.72);   // he IS π — half a circle
  ctx.restore(); }
/* Pi as a big half-disc COVER over the circle's top half (R1) — dome up from the flat edge yb, with a smug face; lifts off (yb rises) as you ring around */
function piHalfCover(yb){ const ctx=E.ctx, cx=CX(), rr=R()*1.15, gl=(pmood==='gloat');
  ctx.save(); const g=ctx.createLinearGradient(cx-rr,yb-rr,cx+rr,yb); g.addColorStop(0,'#c4a6ee'); g.addColorStop(1,'#7a5ec8'); ctx.fillStyle=g; ctx.strokeStyle='#4a3478'; ctx.lineWidth=2.5;   // VIOLET cover — clearly Pi, not the gold circle
  ctx.beginPath(); ctx.moveTo(cx-rr,yb); ctx.arc(cx,yb,rr,P,P*2); ctx.closePath(); ctx.fill(); ctx.stroke();
  const ey=yb-rr*0.52, ex=rr*0.24, er=rr*0.085;
  [-1,1].forEach(d=>{ ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(cx+d*ex,ey,er,er*1.15,0,0,7); ctx.fill(); ctx.fillStyle='#3a2c0a'; ctx.beginPath(); ctx.arc(cx+d*ex+er*0.3,ey+er*0.12,er*0.55,0,7); ctx.fill(); });
  const sad=Math.max(0,Math.min(1,pSad+(gl?-0.3:pmood==='hurt'?0.3:0))), bd=sad>0.5?-1:1, bend=rr*0.16*(1-2*sad);   // grin → frown as you push him back
  ctx.strokeStyle='#3a2c0a'; ctx.lineWidth=rr*0.03; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(cx-ex-er,ey-er*1.1*bd); ctx.lineTo(cx-ex+er*0.6,ey-er*0.1*bd); ctx.moveTo(cx+ex+er,ey-er*1.1*bd); ctx.lineTo(cx+ex-er*0.6,ey-er*0.1*bd); ctx.stroke();
  const my=yb-rr*0.2, mw=rr*0.2; ctx.lineWidth=rr*0.035; ctx.beginPath(); ctx.moveTo(cx-mw,my-bend*0.3); ctx.quadraticCurveTo(cx,my+bend,cx+mw,my-bend*0.3); ctx.stroke();
  label(cx,yb-rr*0.82,'π','rgba(240,232,255,.85)',rr*0.32,true); ctx.restore();
  label(cx,yb-rr*0.05,t({en:'Pi the Halver',zh:'半圆贩子'}),'rgba(240,232,255,.92)',12,true); }

/* ---- the circle stage (center O, radius = one rod) ---- */
const CX=()=>E.LW*0.42, CY=()=>E.LH*0.48, R=()=>E.LH*0.33;
const ptAt=(ang,rr)=>({x:CX()+(rr==null?R():rr)*Math.cos(ang), y:CY()+(rr==null?R():rr)*Math.sin(ang)});
function bg(){ const ctx=E.ctx,LW=E.LW,LH=E.LH; E.clear(); FIG.fog(ctx,0,LW,0,LH*0.5,performance.now());
  ctx.save(); ctx.strokeStyle='rgba(120,160,255,.05)'; ctx.lineWidth=1; for(let r=34;r<LW*1.15;r+=44){ ctx.beginPath(); ctx.arc(CX(),CY(),r,0,7); ctx.stroke(); } ctx.restore();   // faint concentric rings — the Coil motif
  const v=ctx.createRadialGradient(CX(),CY(),LH*0.18,CX(),CY(),LH); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(8,10,24,.36)'); ctx.fillStyle=v; ctx.fillRect(0,0,LW,LH);
  FIG.bull(ctx,40,LH-30,42); pi(LW*0.85,LH*0.24,30); }   // Tau bottom-left, Pi the Halver looms upper-right
function odot(noLabel,noDot){ const ctx=E.ctx; if(!noDot){ ctx.save(); ctx.fillStyle='#0a0a18'; ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(CX(),CY(),4.5,0,7); ctx.fill(); ctx.stroke(); ctx.restore(); } if(!noLabel) label(CX()-14,CY()+14,'O','#cfe0ff',13,true); }
function ring(col,w){ const ctx=E.ctx; ctx.save(); ctx.strokeStyle=col||BL; ctx.lineWidth=w||3; ctx.beginPath(); ctx.arc(CX(),CY(),R(),0,7); ctx.stroke(); ctx.restore(); }
function rodRef(x,y){ const ctx=E.ctx; ctx.save(); ctx.strokeStyle=RD; ctx.lineWidth=4; ctx.lineCap='butt'; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+R()); ctx.stroke();
  ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x-6,y); ctx.lineTo(x+6,y); ctx.moveTo(x-6,y+R()); ctx.lineTo(x+6,y+R()); ctx.stroke(); ctx.restore();
  label(x,y-12,t({en:'rod = 1',zh:'量尺 = 1'}),'#ffc2b6',11,true); }

function piTaunt(fb){ return '<span style="color:#caa84a;font-style:italic">“'+t(pick(PITAUNT))+'”</span><br>'+fb; }   // Pi the Halver jeers on a wrong answer, above the real hint
function pickScene(prompt, redraw, items, onRight){ E.choose(prompt, redraw, items, onRight, {
  react:(ok)=>{ pmood=ok?'hurt':'gloat'; if(ok) E.speakAs('tau', t(pick(QUIP))); }, okPop:()=>t(pick(QUIP)), fbWrap:piTaunt }); }
function prr(c,x,y,w,h,r){ r=Math.min(r,w/2,h/2); c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
const PCOL={ 'c':GR, 'a':'#ffe9a0', '1':RD, 'τ':GOLD, '½τ':GOLD };   // colour each pill token to match the figure: chord c green, arc a gold, the unit 1 red, τ gold
function cpill(cx,cy,txt){ const c=E.ctx, b=E.pillBB(cx,cy,txt);   // a pill like E.pill, but its tokens are coloured (split on spaces, so "3.14" never colours its inner 1)
  c.save(); c.shadowColor='rgba(0,0,0,.4)'; c.shadowBlur=8; c.shadowOffsetY=3; prr(c,b.x,b.y,b.w,b.h,16); c.fillStyle='rgba(36,32,58,.92)'; c.fill();
  c.shadowColor='transparent'; c.lineWidth=1.6; c.strokeStyle='rgba(244,200,48,.8)'; prr(c,b.x,b.y,b.w,b.h,16); c.stroke(); c.restore();
  c.save(); c.textBaseline='middle'; c.textAlign='left';
  const fs=tk=>(tk==='τ'||tk==='π'||tk==='½τ')?20:14, F=tk=>{ c.font='600 '+fs(tk)+'px "IBM Plex Mono",monospace'; };   // render the τ / π symbols larger
  F(' '); const sp=c.measureText(' ').width; const toks=txt.split(' ');
  let tot=0; toks.forEach((tk,i)=>{ F(tk); tot+=c.measureText(tk).width+(i?sp:0); });
  let x=cx-tot/2; toks.forEach((tk,i)=>{ if(i)x+=sp; F(tk); c.fillStyle=PCOL[tk]||'#f6e6b0'; c.fillText(tk,x,cy); x+=c.measureText(tk).width; }); c.restore(); }
function pickPills(prompt, baseDraw, y, opts, onRight){ const n=opts.length, cx=E.LW*0.5, gap=E.LW*0.28;
  const xs = n>=3?[cx-gap,cx,cx+gap]:[cx-gap*0.55,cx+gap*0.55];
  const draw=()=>{ bg(); baseDraw(); opts.forEach((o,i)=>cpill(xs[i],y,t(o.txt))); };   // bg() each frame so the engine's hot-highlight ring can't accumulate around every pill
  const items=opts.map((o,i)=>({ bbox:()=>E.pillBB(xs[i],y,t(o.txt)), ok:o.ok, fb:o.fb, hiCol:'rgba(244,200,48,.95)', _o:o }));
  E.choose(prompt, draw, items, onRight, { react:(ok,it)=>{ pmood=ok?'hurt':'gloat'; if(it&&it._o&&it._o.react) it._o.react(ok); }, fbWrap:piTaunt }); }

/* ===== Round 1 — Circle Glade: tap the point exactly ONE rod from O; the unit circle sweeps in ===== */
function round1(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(0); E.sceneStop(); PIST='cover'; pmood='idle';
  E.setPlace(t({en:'Circle Glade',zh:'圆环林'}));
  const N=8, base=rnd(0,359)*P/180;                                              // 8 points spaced AROUND the ring (jittered) — collected going all the way round
  const nodes=[]; for(let i=0;i<N;i++) nodes.push(base + i*TAU/N + rnd(-13,13)*P/180);
  const decoys=[]; for(let i=0;i<2;i++) decoys.push({ a: base + (i+0.5)*P + rnd(-25,25)*P/180, f: pick([0.6,0.66,1.4,1.46]) });   // off-ring: too near / too far
  const got=new Array(N).fill(false);
  const nodeP=i=>ptAt(nodes[i], R()), decP=i=>ptAt(decoys[i].a, R()*decoys[i].f), RX=()=>E.LW*0.88, RY=()=>E.LH*0.42;   // rod reference lower-right, clear of Pi (who looms upper-right)
  function prog(){ const n=got.filter(Boolean).length; E.status('<span style="color:#f4c830">'+t({en:'on the ring: ',zh:'已圈出：'})+n+' / '+N+'</span>'); }
  function draw(){ bg(); odot(); rodRef(RX(),RY()); const ctx=E.ctx;
    const n=got.filter(Boolean).length, lift=n/N, yb=CY()-lift*1.42*R(); pSad=lift;   // Pi covers the TOP half; his flat edge yb rises (he lifts off) and his grin sags as you ring around
    if(lift<0.999) piHalfCover(yb);
    const under=p=> p.y < yb-2;                                                       // a point above his flat edge is in shadow (faint until he lifts past it)
    ctx.save(); ctx.strokeStyle=BL; ctx.lineWidth=3; ctx.shadowColor='rgba(58,131,224,.5)'; ctx.shadowBlur=6;   // the ring forms between adjacent collected points as you go around
    for(let i=0;i<N;i++){ const j=(i+1)%N; if(got[i]&&got[j]){ let a1=nodes[i],a2=nodes[j]; if(a2<=a1)a2+=TAU; ctx.beginPath(); ctx.arc(CX(),CY(),R(),a1,a2); ctx.stroke(); } } ctx.restore();
    for(let i=0;i<N;i++){ const p=nodeP(i); ctx.save(); if(under(p)&&!got[i]) ctx.globalAlpha=0.32;
      if(got[i]){ ctx.strokeStyle=RD; ctx.lineWidth=2; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(CX(),CY()); ctx.lineTo(p.x,p.y); ctx.stroke(); }   // collected → its radius, length 1, in RED
      else { ctx.strokeStyle='rgba(180,200,230,.42)'; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(CX(),CY()); ctx.lineTo(p.x,p.y); ctx.stroke(); }
      ctx.fillStyle=got[i]?BL:'#dce8ff'; ctx.shadowColor=got[i]?'rgba(58,131,224,.85)':'rgba(120,170,255,.6)'; ctx.shadowBlur=got[i]?11:7; ctx.beginPath(); ctx.arc(p.x,p.y,6,0,7); ctx.fill(); ctx.restore();
      if(got[i]){ const mx=(CX()+p.x)/2+Math.cos(nodes[i]-P/2)*9, my=(CY()+p.y)/2+Math.sin(nodes[i]-P/2)*9; label(mx,my,'1',RD,11,true); } }
    for(let i=0;i<decoys.length;i++){ const p=decP(i); ctx.save(); if(under(p)) ctx.globalAlpha=0.32; ctx.strokeStyle='rgba(180,200,230,.42)'; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(CX(),CY()); ctx.lineTo(p.x,p.y); ctx.stroke();
      ctx.fillStyle='#cfd8e6'; ctx.shadowColor='rgba(120,150,190,.5)'; ctx.shadowBlur=6; ctx.beginPath(); ctx.arc(p.x,p.y,6,0,7); ctx.fill(); ctx.restore(); } }
  E.tell(t({en:'<b>Circle Glade.</b> Your calf <b class="y">Tau</b> can only run a <b>whole</b> lap — but <b class="p">Pi the Halver</b> is squatting on the circle, <b>covering the top half</b> so the ring won\'t close. <b class="r">O</b> is the center, Curvo\'s rod marks <b class="r">1</b>. A circle is <b>every</b> point exactly <b class="r">one rod</b> from <b class="r">O</b> — tap them <b>all the way around</b>; each point you claim shoves <b class="p">Pi</b> off and frees Tau\'s track. (A couple sit too near or too far — leave those.)',
    zh:'<b>圆环林。</b>你的小牛 <b class="y">Tau</b> 只会跑<b>整整一圈</b>——可<b class="p">半圆贩子</b>赖在圆上，<b>盖住上半圈</b>，让这圈合不拢。<b class="r">O</b> 是圆心，Curvo 的量尺标出 <b class="r">1</b>。圆，就是<b>所有</b>到 <b class="r">O</b> 恰好<b class="r">一根尺</b>远的点——把它们<b>绕一整圈</b>逐个点出；每点出一个，就把 <b class="p">Pi</b> 顶开一分，给 Tau 让出跑道。（有一两个太近或太远，别点。）'}));
  prog();
  const actors = nodes.map((a,i)=>({ kind:'tap', ri:i, bbox:()=>{ const p=nodeP(i); return {x:p.x-15,y:p.y-15,w:30,h:30}; }, hiCol:'rgba(244,200,48,.95)' }))
    .concat(decoys.map((d,i)=>({ kind:'tap', dec:i, bbox:()=>{ const p=decP(i); return {x:p.x-15,y:p.y-15,w:30,h:30}; }, hiCol:'rgba(232,64,46,.55)' })));
  E.scene({ actors, draw, onPick(a){ if(E.busy) return;
    if(a.ri!=null){ if(got[a.ri]) return; got[a.ri]=true; E.sfx('place'); E.pop('✓'); E.mood('happy'); pmood='hurt'; if(got.every(Boolean)){ E.sceneStop(); reveal(); } else prog(); }
    else { E.oops(); E.sfx('fail'); E.pop('✗'); E.loseHeart(); const far=decoys[a.dec].f>1;
      E.status('<span style="color:#ff6a4d">'+t(far?{en:'too far — that point is more than one rod from O',zh:'太远——这点离 O 超过一根尺'}:{en:'too close — that point is less than one rod from O',zh:'太近——这点离 O 不到一根尺'})+'</span>'); } } });
  function reveal(){ E.busy=true;
    E.anim(900,p=>{ bg(); odot(); rodRef(RX(),RY()); const ctx=E.ctx; ctx.save(); ctx.strokeStyle=BL; ctx.lineWidth=3; ctx.shadowColor='rgba(58,131,224,.5)'; ctx.shadowBlur=8; ctx.beginPath(); ctx.arc(CX(),CY(),R(),0,-TAU*p,true); ctx.stroke(); ctx.restore();   // sweep from the +x point (right), ANTICLOCKWISE — like radians
      const q=ptAt(-TAU*p); star(ctx,q.x,q.y,5,'rgba(190,225,255,.95)'); }, ()=>{ E.busy=false; win(); }); }
  function win(){ bg(); odot(); ring(BL); E.setDots(1); E.tickQ(1); E.award(45); E.cheer(); E.sfx('win');
    E.status(keq(t({en:'All points at distance 1 from Origin (O) = the unit circle',zh:'所有到原点 O 距离为 1 的点 = 单位圆'})));
    E.tell(t({en:'You ringed it all the way round — that gold ring is the <b class="y">unit circle</b>: every point exactly <b class="r">1</b> from <b class="r">O</b>.',zh:'你绕着圈出了一整圈——那圈金环就是<b class="y">单位圆</b>：每个点到 <b class="r">O</b> 都正好是 <b class="r">1</b>。'}));
    E.clearTray(); E.addBtn(t({en:'Step around it ▶',zh:'绕它走一圈 ▶'}),'primary',E.advance); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
}

/* ===== Round 2 — The Six Steps: you can't measure a curve, so BUILD six straight triangles inside the circle (drag a triangle into each gap), then read chord a = 1 and arc a > 1 ===== */
function round2(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(1); E.sceneStop(); PIST='cover'; pmood='idle';
  E.setPlace(t({en:'The Six Steps',zh:'六步环'}));
  const base=0;                         // a vertex sits on the +x point, so two radii run along the horizontal (like radians start)
  const tip=k=>ptAt(base + k*P/3);
  const filled=new Array(6).fill(false);
  const home={x:E.LW*0.84, y:E.LH*0.78};
  const wedge={ kind:'drag', home:home, bbox:a=>({x:a.pos.x-26,y:a.pos.y-24,w:52,h:48}) };
  const slotOf=(x,y)=>{ let a=Math.atan2(y-CY(),x-CX()); let k=Math.round((a-base)/(P/3) - 0.5); return ((k%6)+6)%6; };   // which sector a drop falls in
  function triPath(ctx,k){ const a=tip(k),b=tip((k+1)%6); ctx.beginPath(); ctx.moveTo(CX(),CY()); ctx.lineTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.closePath(); }
  function drawTri(k){ const ctx=E.ctx,a=tip(k),b=tip((k+1)%6); ctx.save();
    ctx.fillStyle='rgba(47,170,78,.15)'; triPath(ctx,k); ctx.fill();
    ctx.strokeStyle=RD; ctx.lineWidth=2.4; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(CX(),CY()); ctx.lineTo(a.x,a.y); ctx.moveTo(CX(),CY()); ctx.lineTo(b.x,b.y); ctx.stroke();   // two unit rods (red)
    ctx.strokeStyle=GR; ctx.lineWidth=2.8; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();   // chord (green)
    ctx.fillStyle=RD; ctx.beginPath(); ctx.arc(a.x,a.y,3.4,0,7); ctx.fill(); ctx.beginPath(); ctx.arc(b.x,b.y,3.4,0,7); ctx.fill(); ctx.restore(); }
  function ghostTri(k,hot){ const ctx=E.ctx; ctx.save(); ctx.globalAlpha=hot?0.95:0.45; ctx.setLineDash([5,5]); ctx.strokeStyle=hot?'rgba(80,216,144,.95)':'rgba(170,190,225,.5)'; ctx.lineWidth=hot?2.6:1.5; if(hot){ctx.shadowColor='rgba(80,216,144,.6)';ctx.shadowBlur=10;} triPath(ctx,k); ctx.stroke(); ctx.restore(); }
  function wedgeIcon(x,y,lab){ const ctx=E.ctx,s=19; ctx.save(); ctx.translate(x,y);
    ctx.fillStyle='rgba(47,170,78,.2)'; ctx.beginPath(); ctx.moveTo(0,-s); ctx.lineTo(-s*0.92,s*0.66); ctx.lineTo(s*0.92,s*0.66); ctx.closePath(); ctx.fill();
    ctx.strokeStyle=RD; ctx.lineWidth=2.4; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(0,-s); ctx.lineTo(-s*0.92,s*0.66); ctx.moveTo(0,-s); ctx.lineTo(s*0.92,s*0.66); ctx.stroke();
    ctx.strokeStyle=GR; ctx.lineWidth=2.6; ctx.beginPath(); ctx.moveTo(-s*0.92,s*0.66); ctx.lineTo(s*0.92,s*0.66); ctx.stroke(); ctx.restore();
    if(lab) label(x,y+s+11,t({en:'drag a triangle',zh:'拖一块三角'}),'#bfe8cf',11,true); }
  function buildStat(){ const n=filled.filter(Boolean).length; E.status('<span style="color:#f4c830">'+t({en:'triangles built: ',zh:'已搭三角：'})+n+' / 6</span>'); }
  function drawBuild(){ bg(); odot(); ring(BL,2); const ctx=E.ctx;
    const fn=filled.filter(Boolean).length, yb=CY()-(fn/6)*1.42*R(); pSad=fn/6;   // Pi covers the TOP half (same big half-disc as R1); he lifts (and his grin sags) as you build all six
    if(fn<6) piHalfCover(yb);
    let hot=-1; if(wedge.grab){ const d=Math.hypot(wedge.pos.x-CX(),wedge.pos.y-CY()); if(d>0.25*R()&&d<1.7*R()){ const k=slotOf(wedge.pos.x,wedge.pos.y); if(!filled[k]) hot=k; } }
    for(let k=0;k<6;k++){ if(filled[k]){ drawTri(k); } else { const mid=ptAt(base+k*P/3+P/6,R()*0.62); ctx.save(); if(mid.y<yb-2 && k!==hot) ctx.globalAlpha=0.4; ghostTri(k,k===hot); ctx.restore(); } }   // a gap under Pi is faint until he lifts past it
    if(wedge.grab) wedgeIcon(wedge.pos.x,wedge.pos.y,false); else wedgeIcon(home.x,home.y,true); }
  E.tell(t({en:'<b>The Six Steps.</b> You cannot lay a ruler along a <b class="y">curve</b> — so bridge it with straight pieces you CAN measure. Build <b>six</b> straight <b class="g">triangles</b> inside the <b class="y">circle</b>, each two unit <b class="r">rods</b> and a <b class="g">chord</b>. <b class="p">Pi the Halver</b> sneers that three — half — is plenty and shadows that side; <b>drag a triangle into every gap</b>, all the way around, to push him back.',
    zh:'<b>六步环。</b>尺子没法贴着<b class="y">曲线</b>量——就用能量得出的直线段把它架起来。在<b class="y">圆</b>里搭<b>六</b>个直边<b class="g">三角</b>，每个由两条单位<b class="r">尺</b>和一条<b class="g">弦</b>组成。<b class="p">半圆贩子</b>冷笑说三个——一半——就够，还把那半边罩上阴影；<b>把三角形拖进每个缺口</b>、绕一整圈，把他逼退。'}));
  buildStat();
  E.scene({ actors:[wedge], draw:drawBuild, onDrop(a,z,info){ if(E.busy)return;
    if(info && !info.tapped){ const d=Math.hypot(info.x-CX(),info.y-CY()); if(d>0.25*R()&&d<1.75*R()){ const k=slotOf(info.x,info.y); if(!filled[k]){ filled[k]=true; E.sfx('place'); E.pop('▲'); E.mood('happy'); pmood='hurt'; } } }
    if(filled.every(Boolean)){ E.sceneStop(); decide(); } else buildStat(); } });
  // ---- read the shape you built ----
  function decide(){
    const kT=((Math.round((-2*P/3 - base)/(P/3))%6)+6)%6;   // sector nearest the TOP — demo the chord/arc there, in clear sky (never hidden behind the pills)
    const A=()=>tip(kT), B=()=>tip((kT+1)%6), CM=()=>{ const a=A(),b=B(); return {x:(a.x+b.x)/2,y:(a.y+b.y)/2}; };
    const inLbl=(p,txt,col,sz)=>label(p.x+(CX()-p.x)*0.17, p.y+(CY()-p.y)*0.17, txt, col, sz, true);   // label just INSIDE a chord, on the dark triangle (high contrast)
    function built(extra){ bg(); odot(); ring(BL,2); for(let k=0;k<6;k++) drawTri(k); const r0=A(), ra=base+kT*P/3, mx=(CX()+r0.x)/2+Math.cos(ra-P/2)*11, my=(CY()+r0.y)/2+Math.sin(ra-P/2)*11; label(mx,my,'1',RD,13,true); if(extra)extra(); }   // '1' offset to the SIDE of the radius, not on the line
    function q1(){ pickPills(t({en:'You bridged the <b class="y">circle</b> with six equal-sided <b class="g">triangles</b>. Name one straight <b class="g">chord</b> <b class="g">c</b> — so <b class="g">c</b> is…',zh:'你用六个等边<b class="g">三角</b>把<b class="y">圆</b>架了起来。把一条直<b class="g">弦</b>叫作 <b class="g">c</b>——那么 <b class="g">c</b>……'}),
        ()=>built(()=>inLbl(CM(),'c',GR,16)), E.LH*0.9,
        [ {txt:{en:'c < 1',zh:'c < 1'}, fb:{en:'All three sides are equal, and two are radii of 1, so c = 1.',zh:'三边都相等，其中两条是 1 的半径，所以 c = 1。'}},
          {txt:{en:'c = 1',zh:'c = 1'}, ok:true},
          {txt:{en:'c > 1',zh:'c > 1'}, fb:{en:'Straight across, the chord matches the radius: c = 1.',zh:'直直连过去，弦和半径一样：c = 1。'}} ], q2); }
    function q2(){ pickPills(t({en:'Now the curved <b class="y">arc</b> bulging past that <b class="g">chord</b> (<b class="g">c</b> = 1). Name the <b class="y">arc</b> <b class="y">a</b> — so <b class="y">a</b> is…',zh:'再看鼓出在那条<b class="g">弦</b>（<b class="g">c</b> = 1）外的弯<b class="y">弧</b>。把这段<b class="y">弧</b>叫作 <b class="y">a</b>——那么 <b class="y">a</b>……'}),
        ()=>built(()=>{ const ctx=E.ctx, a0=base+kT*P/3; ctx.save(); ctx.strokeStyle='#ffe9a0'; ctx.lineWidth=5; ctx.shadowColor='rgba(244,200,48,.7)'; ctx.shadowBlur=8; ctx.beginPath(); ctx.arc(CX(),CY(),R(),a0,a0+P/3); ctx.stroke(); ctx.restore(); const mid=ptAt(a0+P/6,R()+17); label(mid.x,mid.y,'a','#ffe9a0',16,true); inLbl(CM(),'c=1',GR,13); }), E.LH*0.9,
        [ {txt:{en:'a < 1',zh:'a < 1'}, fb:{en:'The straight chord is the shortest path between the tips; the curve is longer.',zh:'两端点之间直弦最短；弯弧更长。'}},
          {txt:{en:'a = 1',zh:'a = 1'}, fb:{en:'The arc bows outward past the straight chord, so it is a little MORE than 1.',zh:'弧向外鼓出，超过直弦，所以比 1 略多。'}},
          {txt:{en:'a > 1',zh:'a > 1'}, ok:true} ], win); }
    q1();
  }
  function win(){ E.setDots(2); E.tickQ(2); E.award(45); PIST='recoil'; pmood='hurt'; bg(); odot(); ring(BL,2); for(let k=0;k<6;k++) drawTri(k); E.cheer(); E.sfx('win');
    E.status(keq(t({en:'chord = 1, arc = 1+···',zh:'弦 = 1，弧 = 1+···'})));
    E.tell(t({en:'Six straight <b class="g">triangles</b> now bridge the <b class="y">circle</b>. Each <b class="g">chord</b> is <b>1</b>, and each <b class="y">arc</b> riding over it is <b>1+···</b>, a little more — so the curve is just a bit longer than the straight six. Add the arcs and we have the whole way around.',
      zh:'六个直边<b class="g">三角</b>把<b class="y">圆</b>架了起来。每条<b class="g">弦</b>是 <b>1</b>，跨在上面的每段<b class="y">弧</b>是 <b>1+···</b>，多一点点——所以曲线只比直直的六段长一点。把弧加起来，就是绕一整圈。'}));
    E.clearTray(); E.addBtn(t({en:'Add them up ▶',zh:'把它们加起来 ▶'}),'primary',E.advance); E.addBtn(t({en:'◀ Prev step',zh:'◀ 上一步'}),'ghost',E.prevStep); }
}

/* ===== Round 3 — The Whole Way Around: six arcs of 1+··· add to τ ≈ 6.28; Tau charges one full turn ===== */
function round3(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(2); E.sceneStop(); PIST='loom'; pmood='idle'; pSad=0;
  E.setPlace(t({en:'The Whole Turn',zh:'整整一圈'}));
  const tip=k=>ptAt(k*P/3);   // a vertex on the +x point (right); the six tips are the same 6 points either way
  let stolen=false;   // set true when the player picks the HALF (τ=3.14) — Pi grabs half the circle until you choose the full τ
  function drawHex(noO){ bg(); odot(noO,noO); const ctx=E.ctx;
    if(stolen){ const pd=Math.atan2(E.LH*0.24-CY(),E.LW*0.85-CX());   // Pi has snapped the circle to a glowing HALF on his side; the rest is dark
      ctx.save(); ctx.strokeStyle=GOLD; ctx.lineWidth=5; ctx.shadowColor='rgba(244,200,48,.6)'; ctx.shadowBlur=12; ctx.beginPath(); ctx.arc(CX(),CY(),R(),pd-P/2,pd+P/2); ctx.stroke();
      ctx.shadowBlur=0; ctx.strokeStyle='rgba(120,100,140,.35)'; ctx.setLineDash([5,7]); ctx.beginPath(); ctx.arc(CX(),CY(),R(),pd+P/2,pd+P*1.5); ctx.stroke(); ctx.restore();
      const hl=ptAt(pd,R()*0.5); label(hl.x,hl.y,'π',GOLD,32,true); label(hl.x,hl.y+22,'≈ 3.14',GOLD,13,true);   // Pi's stolen half IS π — only half a turn
      for(let k=0;k<6;k++){ const p=tip(k); ctx.save(); ctx.strokeStyle='rgba(255,106,77,.35)'; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(CX(),CY()); ctx.lineTo(p.x,p.y); ctx.stroke(); ctx.restore(); } return; }
    const ga=0.07; ctx.save(); ctx.strokeStyle=GOLD; ctx.lineWidth=4; ctx.lineCap='round';   // SIX DISTINCT arcs (small gaps at the tips) — so it reads as six arcs to add
    for(let k=0;k<6;k++){ const a0=k*P/3+ga, a1=(k+1)*P/3-ga; ctx.beginPath(); ctx.arc(CX(),CY(),R(),a0,a1); ctx.stroke(); } ctx.restore();
    for(let k=0;k<6;k++){ const p=tip(k); ctx.save(); ctx.strokeStyle='rgba(255,106,77,.8)'; ctx.lineWidth=1.8; ctx.beginPath(); ctx.moveTo(CX(),CY()); ctx.lineTo(p.x,p.y); ctx.stroke(); ctx.restore(); }
    for(let k=0;k<6;k++){ const m=ptAt(k*P/3+P/6, R()+17); label(m.x,m.y,'1+···',GOLD,14,true); } }
  E.tell(t({en:'<b>The Whole Turn.</b> To seal the <b class="p">Rift</b>, <b class="y">Tau</b> must charge one full turn — but how long IS a full turn? Six <b class="y">arcs</b>, each <b>1+···</b>. Add them for the distance <b>all the way around</b>.',zh:'<b>整整一圈。</b>要封住<b class="p">裂隙</b>，<b class="y">Tau</b> 必须冲满一整圈——可一整圈到底有多长？六段<b class="y">弧</b>，每段 <b>1+···</b>。把它们加起来，就是绕<b>一整圈</b>的长度。'}));
  pickPills(t({en:'<b>(1+···) × 6 = <b class="y">τ</b>.</b> So the whole way around, <b class="y">τ</b> = ?',zh:'<b>(1+···) × 6 = <b class="y">τ</b>。</b>那么绕一整圈，<b class="y">τ</b> = ?'}),
    drawHex, E.LH*0.9,
    [ {txt:{en:'τ = 6',zh:'τ = 6'}, fb:{en:'That is the straight six-sided path. Each arc bulges a bit past its chord, so τ is a bit MORE than 6.',zh:'那是六条直边的路。每段弧都比弦鼓出一点，所以 τ 比 6 多一点。'}},
      {txt:{en:'τ = 6.28…',zh:'τ = 6.28…'}, ok:true},
      {txt:{en:'τ = 3.14…',zh:'τ = 3.14…'}, react:()=>{ stolen=true; }, fb:{en:'<b class="p">Pi grabs half — and that half IS π ≈ 3.14!</b> A whole turn is TWO halves, so the real answer is τ = <b>2π</b> ≈ 6.28.',zh:'<b class="p">半圆贩子抢走一半——那一半正是 π ≈ 3.14！</b>一整圈是两个半圈，所以真正的答案是 τ = <b>2π</b> ≈ 6.28。'}} ],
    charge);
  function charge(){ E.busy=true; E.sceneStop(); stolen=false; PIST='gone'; E.sfx('bracket'); E.speakAs('tau', t({en:'All the way round!',zh:'绕满一整圈！'}));
    const img=tauImg('happy');
    E.anim(1800,p=>{ bg(); odot(true,true); const ctx=E.ctx;
      for(let k=0;k<6;k++){ const pp=tip(k); ctx.save(); ctx.strokeStyle='rgba(255,106,77,.5)'; ctx.lineWidth=1.6; ctx.beginPath(); ctx.moveTo(CX(),CY()); ctx.lineTo(pp.x,pp.y); ctx.stroke(); ctx.restore(); }
      const filled=p*6;   // the six arcs add on, one after another → τ
      ctx.save(); ctx.strokeStyle=GOLD; ctx.lineWidth=6; ctx.shadowColor='rgba(244,200,48,.6)'; ctx.shadowBlur=12; ctx.lineCap='round';
      for(let k=0;k<6;k++){ const f=Math.max(0,Math.min(1,filled-k)); if(f<=0)continue; const a0=-k*P/3, a1=a0-(P/3)*f; ctx.beginPath(); ctx.arc(CX(),CY(),R(),a0,a1,true); ctx.stroke(); } ctx.restore();   // Tau charges from the +x point, ANTICLOCKWISE
      const ai=-Math.min(filled,6)*P/3, q=ptAt(ai); if(img.complete&&img.naturalWidth){ const s=44; try{ ctx.drawImage(img,q.x-s/2,q.y-s/2,s,s); }catch(_){ } } else { star(ctx,q.x,q.y,7,GOLD); }
      label(CX(),CY()-9, Math.min(6,Math.floor(filled+1e-6))+' / 6 arcs', GOLD, 12, true); label(CX(),CY()+12,'τ',GOLD,26,true); }, ()=>{ E.busy=false; win(); }); }
  function win(){ bg(); odot(true,true); ring(GOLD,5);
    const ctx=E.ctx; ctx.save(); ctx.strokeStyle='rgba(255,233,160,.5)'; ctx.setLineDash([5,6]); ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(CX()-R(),CY()); ctx.lineTo(CX()+R(),CY()); ctx.stroke(); ctx.restore();   // split the full turn into its two halves
    label(CX(),CY()-R()*0.5,'π',GOLD,17,true); label(CX(),CY()+R()*0.5,'π',GOLD,17,true);   // each half is one π
    label(CX(),CY(),'τ = 2π',GOLD,23,true);
    E.setDots(3); E.tickQ(3); E.award(65); E.cheer(); E.sfx('win');
    E.status(keq('τ = 2π ≈ 6.28'));
    E.tell(t({en:'<b class="y">Tau</b> runs his <b>first full lap</b> — <b class="y">τ</b> ≈ <b>6.28</b> = <b>2π</b>, once around the unit circle. It takes <b>two</b> of <b class="p">Pi</b>\'s halves to close the turn, which is exactly why <b class="p">π</b> alone left the <b class="p">Rift</b> open. The <b class="y">Great Circle</b> closes, <b class="p">Pi the Halver</b> is driven off, the <b class="p">Fog</b> recoils, and your calf grows a little bolder. <b>First Law:</b> write <b class="y">τ</b> for a full turn, never π — π is only half.',
      zh:'<b class="y">Tau</b> 跑完了他的<b>第一整圈</b>——<b class="y">τ</b> ≈ <b>6.28</b> = <b>2π</b>，绕单位圆一整圈。要<b>两个</b> <b class="p">Pi</b> 的半圈才能合拢一整圈，这正是为什么单用 <b class="p">π</b> 会让<b class="p">裂隙</b>合不上。<b class="y">大圆</b>合拢，<b class="p">半圆贩子</b>被赶跑，<b class="p">迷雾</b>退去，你的小牛也壮了几分。<b>第一定律：</b>整圈写 <b class="y">τ</b>，绝不写 π——π 只是一半。'}));
    E.clearTray(); E.addBtn(t({en:'Claim the Codex page 📖',zh:'领取典籍书页 📖'}),'primary',()=>E.openBook(QUEST.book)); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
}

const QUEST = {
  id:'q05', page:9, region:'coil', bgm:'audio/bgm-cradle.mp3?v=20260606k2',
  kicker:{en:'The Coil',zh:'盘卷'},
  title:{en:'The Unit Circle & τ',zh:'单位圆与 τ'},
  meta:{ title:{en:'Measure the circle’s edge (once around)',zh:'量出圆的边（绕行一圈）'}, giver:{en:'Master Curvo · The Coil',zh:'曲师 Curvo · 盘卷'},
    flavor:{en:'"Welcome to <b>The Coil</b>, Pathfinder — where the straight world bends into curves. I am <b class="p">Curvo</b>, the Cartwright. At the world\'s heart the Unravelling has torn a <b class="p">Rift</b>, and only the <b class="y">Great Circle</b> — one perfect full turn — can seal it. But the <b class="p">Fog</b> scattered its measure, so <b class="y">Tau</b>\'s charge falls short of all the way round and the <b class="p">Rift</b> gapes. Help me rebuild the humblest circle of all — the <b class="y">unit circle</b>, every point one rod from <b class="r">O</b> — and recover the length of one whole turn: <b class="y">τ</b>. Beware <b class="p">Pi the Halver</b>, who swears half a turn is plenty and circles to keep it from closing. Find <b class="y">τ</b>, drive him off, and Tau can charge the full turn again. Step around it with me!"',
      zh:'"欢迎来到<b>盘卷</b>，开拓者——笔直的世界在这里弯成曲线。我是车师 <b class="p">Curvo</b>。在世界的心脏，「大解体」撕开了一道<b class="p">裂隙</b>，只有<b class="y">大圆</b>——完整的一整圈——才能把它封上。可<b class="p">迷雾</b>把它的尺度打散了，<b class="y">Tau</b> 的冲刺差一点绕不满整圈，<b class="p">裂隙</b>就一直裂着。帮我重建最朴素的一个圆——<b class="y">单位圆</b>，每个点都离 <b class="r">O</b> 一根尺——找回一整圈的长度：<b class="y">τ</b>。小心<b class="p">半圆贩子</b>，他咬定半圈就够，绕着圈不让它合拢。找回 <b class="y">τ</b>、把他赶走，<b class="y">Tau</b> 就能再次冲满整圈。和我一起绕它走一圈吧！"'} },
  objs:[ {en:'Circle Glade: every point one rod from O',zh:'圆环林：每点离 O 一根尺'},
         {en:'The Six Steps: six unit radii, chord 1, arc 1+···',zh:'六步环：六条单位半径，弦 1，弧 1+···'},
         {en:'The Whole Turn: (1+···)×6 = τ ≈ 6.28',zh:'整整一圈：(1+···)×6 = τ ≈ 6.28'} ],
  rounds:[round1,round2,round3],
  book:{ page:5, kicker:{en:'The Coil',zh:'盘卷之'}, title:{en:'Circumference of the Unit Circle',zh:'单位圆的周长'},
    blocks:[
      {top:true, fig:'ucirc', prose:{en:'The <b class="y">unit circle</b> is the most important shape in this book: every point exactly <b class="r">1</b> from the center <b class="r">O</b>. We study only radius <b class="r">1</b>, so a unit-circle "formula" does not carry straight over to circles of other sizes.',
        zh:'<b class="y">单位圆</b>是本书最重要的图形：所有到圆心 <b class="r">O</b> 恰好为 <b class="r">1</b> 的点。本书只讲半径 <b class="r">1</b>，所以单位圆的「公式」不能直接套用到别的大小的圆上。'}},
      {law:{en:'Step around with six unit radii',zh:'用六条单位半径绕一圈'}, fig:'uhex', prose:{en:'Plant <b class="r">6</b> equal <b class="r">radii</b> from <b class="r">O</b>, each <b class="r">1</b>, evenly spaced, and join neighbouring tips. Each straight green <b class="g">chord</b> is also <b class="r">1</b> (every wedge is an equal-sided triangle). And each curved <b class="y">arc</b> bows just past its chord, so it is <b>1+···</b>, a little more than 1.',
        zh:'从 <b class="r">O</b> 等距插下 <b class="r">6</b> 条相等的<b class="r">半径</b>，各 <b class="r">1</b>，再连相邻端点。每条直的绿<b class="g">弦</b>也是 <b class="r">1</b>（每块楔形都是等边三角形）。而跨在弦上的每段<b class="y">弧</b>向外鼓出一点，所以是 <b>1+···</b>，比 1 多一点点。'}},
      {law:{en:'The whole way around is τ',zh:'绕满一整圈就是 τ'}, eq:'(1+···) × <span class="r">6</span> = <span class="y">τ</span> ≈ 6.28', fig:'utau', prose:{en:'Add the six <b class="y">arcs</b>: a little more than 6, about <b>6.28</b>. This is <b class="y">τ</b>, the distance once around the unit circle, the most important constant in this book.',
        zh:'把六段<b class="y">弧</b>加起来：比 6 多一点，大约 <b>6.28</b>。这就是 <b class="y">τ</b>，绕单位圆一整圈的长度，本书最重要的常数。'}},
      {note:{en:'<b>First Law.</b> We write <b class="y">τ</b> for a whole turn and never π. A full turn (τ ≈ 6.28) is the natural unit; π ≈ 3.14 is only <b>half</b> a turn, and half-turns make most later formulas fight you. Whenever you see <b class="y">τ</b>, a circle is hidden nearby.',
        zh:'<b>第一定律。</b>整整一圈我们写 <b class="y">τ</b>，绝不写 π。一整圈（τ ≈ 6.28）才是自然的单位；π ≈ 3.14 只是<b>半圈</b>，而半圈会让后面大多数公式别扭。凡是见到 <b class="y">τ</b>，附近必藏着一个圆。'}}
    ],
    read:{en:'The unit circle is every point one rod from the center O. Step around it with six unit radii: each straight chord is 1, and each curved arc is a little more than 1. Add the six arcs and you get τ, about 6.28, the whole way around. We write τ for a full turn, never π, which is only half.',
      zh:'单位圆，就是所有离圆心 O 一根尺远的点。用六条单位半径绕它一圈：每条直弦是 1，每段弯弧比 1 多一点。把六段弧加起来，就得到 τ，大约 6.28，正好绕满一整圈。整圈我们写 τ，绝不写 π——π 只是半圈。'} },
  intro:(E)=>{ bg(); odot(); ring(BL,3); const c=E.ctx; c.save(); c.strokeStyle=RD; c.lineWidth=2.4; c.beginPath(); c.moveTo(CX(),CY()); const p=ptAt(-0.5); c.lineTo(p.x,p.y); c.stroke(); c.restore(); label((CX()+ptAt(-0.5).x)/2,(CY()+ptAt(-0.5).y)/2-9,'1',RD,12,true); }
};
window.QUEST_q05 = QUEST;
})();
