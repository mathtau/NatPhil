/* ORIGO · Quest 6 = MathO p10 · "Area of the Unit Disk — the Pizza Cut" (Act I: The Coil).
   Q5 found the circle's EDGE: the rim is τ. Now we measure what's INSIDE — the disk's AREA — and it lands on
   ½τ = π ≈ 3.14. Cut the disk into ever-thinner wedges (drag a slice-slider); each thin wedge → a triangle; pack
   them alternating up/down into a bar whose HEIGHT = the radius 1 and whose LONG EDGE = half the rim, ½τ; so
   area = ½τ × 1 = ½τ ≈ 3.14. Pi the Halver claims the inside ("½τ — that's MY number, π!") and is named down by τ.
   Colours follow the Coil: rim/arc/τ GOLD, the unit radius "1" RED, the area GREEN, Pi VIOLET. Every action is a
   right/wrong decision (hearts apply). Mentor: Master Curvo, the Cartwright. */
(function(){
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=arr=>arr[rnd(0,arr.length-1)];
const t=s=>E.t(s);
const keq=(expr)=>'<span class="keq">'+expr+' <span class="tk">✓</span></span>';
const GOLD='#f4c830', RD='#ff6a4d', GR='#50d890', VIO='#c4a6ee', P=Math.PI, TAU=2*P;
const QUIP=[ {en:'Yes!',zh:'对了！'}, {en:'Clean cut!',zh:'切得漂亮！'}, {en:'That packs!',zh:'拼上了！'} ];

function label(x,y,txt,col,sz,halo){ const c=E.ctx; c.save(); c.font=(sz||14)+'px "IBM Plex Mono",monospace'; c.textAlign='center'; c.textBaseline='middle';
  if(halo){ c.lineWidth=3; c.strokeStyle='rgba(12,16,24,.62)'; c.strokeText(txt,x,y); } c.fillStyle=col||'#caa84a'; c.fillText(txt,x,y); c.restore(); }
function star(ctx,cx,cy,r,col){ if(r<=0)return; ctx.save(); ctx.fillStyle=col; ctx.beginPath();
  for(let i=0;i<5;i++){ const a=-P/2+i*2*P/5; ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r); const a2=a+P/5; ctx.lineTo(cx+Math.cos(a2)*r*0.45,cy+Math.sin(a2)*r*0.45); } ctx.closePath(); ctx.fill(); ctx.restore(); }

const TAUIMG={};
function tauImg(mood){ if(TAUIMG[mood])return TAUIMG[mood]; const i=new Image(); i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(FIG.tauBull(mood)); TAUIMG[mood]=i; return i; }
try{ ['happy','open'].forEach(tauImg); }catch(_){}

/* ---- PI THE HALVER (the Coil's rival) — here he claims the disk's INSIDE, because the area really is ½τ = π.
   PIST: loom | claim (grabbing the area) | recoil | gone. pmood: idle | gloat (wrong) | hurt (right). */
let PIST='loom', pmood='idle', pSad=0;   // pSad 0→1 = grin sags to a frown as you push him back
const PITAUNT=[ {en:'The rim was yours — the inside is mine!',zh:'圆边归你——里头归我！'},
  {en:'Why cut forever? A few chunks is plenty.',zh:'切个没完干嘛？几大块就够啦。'},
  {en:'Half of everything. That is my law.',zh:'万物皆取其半，这是我的律。'} ];
function pi(cx,cy,s){ if(PIST==='gone')return; const ctx=E.ctx, tt=performance.now()/1000, recoil=(PIST==='recoil');
  if(recoil)s*=0.7; else if(pmood==='gloat')s*=1.14; else if(pmood==='hurt')s*=0.84;
  const a=recoil?0.6:(pmood==='hurt'?0.7:1); cy+=Math.sin(tt*1.7)*s*0.06; ctx.save(); ctx.globalAlpha=a;
  const au=ctx.createRadialGradient(cx,cy,2,cx,cy,s*1.7); au.addColorStop(0,'rgba(152,92,228,'+(pmood==='gloat'?0.5:0.3)+')'); au.addColorStop(1,'rgba(152,92,228,0)'); ctx.fillStyle=au; ctx.beginPath(); ctx.arc(cx,cy,s*1.7,0,7); ctx.fill();
  const g=ctx.createLinearGradient(cx-s,cy-s,cx+s,cy); g.addColorStop(0,VIO); g.addColorStop(1,'#7a5ec8');
  ctx.fillStyle=g; ctx.strokeStyle='#4a3478'; ctx.lineWidth=Math.max(1.5,s*0.05);
  ctx.beginPath(); ctx.moveTo(cx-s,cy); ctx.arc(cx,cy,s,P,P*2); ctx.closePath(); ctx.fill(); ctx.stroke();   // upper HALF-disc, flat diameter = chin
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
let DBASE=0;   // wedge orientation, fresh each play
function bg(){ const ctx=E.ctx,LW=E.LW,LH=E.LH; E.clear(); FIG.fog(ctx,0,LW,0,LH*0.5,performance.now());
  ctx.save(); ctx.strokeStyle='rgba(120,160,255,.05)'; ctx.lineWidth=1; for(let r=34;r<LW*1.15;r+=44){ ctx.beginPath(); ctx.arc(CX(),CY(),r,0,7); ctx.stroke(); } ctx.restore();
  const v=ctx.createRadialGradient(CX(),CY(),LH*0.18,CX(),CY(),LH); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(8,10,24,.36)'); ctx.fillStyle=v; ctx.fillRect(0,0,LW,LH);
  FIG.bull(ctx,40,LH-30,42); pi(LW*0.86,LH*0.22,28); }
function odot(){ const ctx=E.ctx; ctx.save(); ctx.fillStyle='#0a0a18'; ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(CX(),CY(),4.5,0,7); ctx.fill(); ctx.stroke(); ctx.restore(); label(CX()-14,CY()+14,'O','#cfe0ff',13,true); }

function piTaunt(fb){ return '<span style="color:#caa84a;font-style:italic">“'+t(pick(PITAUNT))+'”</span><br>'+fb; }
function prr(c,x,y,w,h,r){ r=Math.min(r,w/2,h/2); c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
const PCOL={ '½τ':GOLD, 'τ':GOLD, '1':RD, 'π':VIO };   // colour pill tokens to match the figure
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

/* ===== Round 1 — Cut Finer: drag the slice-slider; the wedges thin to near-triangles ===== */
function round1(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(0); E.sceneStop(); PIST='loom'; pmood='idle'; pSad=0;
  E.setPlace(t({en:'The Pizza Cut',zh:'披萨切法'}));
  DBASE=rnd(0,359)*P/180;
  const SLX0=E.LW*0.17, SLX1=E.LW*0.7, SLY=E.LH*0.92, NMIN=4, NMAX=40, GATE=28;
  const NfromX=x=>Math.max(NMIN,Math.min(NMAX,Math.round(NMIN+(x-SLX0)/(SLX1-SLX0)*(NMAX-NMIN))));
  let N=NMIN, phase='cut';
  function disk(n){ const ctx=E.ctx;
    for(let i=0;i<n;i++){ const a0=DBASE+i*TAU/n, a1=a0+TAU/n;
      ctx.save(); ctx.beginPath(); ctx.moveTo(CX(),CY()); ctx.arc(CX(),CY(),R(),a0,a1); ctx.closePath();
      ctx.fillStyle=(i%2)?'rgba(80,216,144,.14)':'rgba(80,216,144,.22)'; ctx.fill();   // alternate shade → reads as separate wedges
      ctx.strokeStyle='rgba(255,106,77,.5)'; ctx.lineWidth=1.1; ctx.beginPath(); ctx.moveTo(CX(),CY()); ctx.lineTo(CX()+R()*Math.cos(a0),CY()+R()*Math.sin(a0)); ctx.stroke(); ctx.restore(); }   // red radius spokes
    ctx.save(); ctx.strokeStyle=GOLD; ctx.lineWidth=3.5; ctx.shadowColor='rgba(244,200,48,.4)'; ctx.shadowBlur=5; ctx.beginPath(); ctx.arc(CX(),CY(),R(),0,7); ctx.stroke(); ctx.restore();   // gold rim
    odot(); }
  function slider(){ const ctx=E.ctx; ctx.save();
    ctx.strokeStyle='rgba(200,210,235,.35)'; ctx.lineWidth=4; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(SLX0,SLY); ctx.lineTo(SLX1,SLY); ctx.stroke();
    const kx=knob.pos.x; ctx.strokeStyle=GOLD; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(SLX0,SLY); ctx.lineTo(kx,SLY); ctx.stroke();
    ctx.fillStyle=GOLD; ctx.shadowColor='rgba(244,200,48,.7)'; ctx.shadowBlur=8; ctx.beginPath(); ctx.arc(kx,SLY,11,0,7); ctx.fill(); ctx.restore();
    label(SLX0-4,SLY-20,t({en:'few',zh:'少'}),'#9fb0cc',11); label(SLX1+4,SLY-20,t({en:'many',zh:'多'}),'#9fb0cc',11); }
  function stat(){ E.status('<span style="color:#f4c830">'+t({en:'slices: ',zh:'切片：'})+N+'</span>'+(N>=GATE?'  <span style="color:#50d890">'+t({en:'→ almost triangles',zh:'→ 几乎成三角'})+'</span>':'')); }
  function drawCut(){ bg(); N=NfromX(knob.pos.x); disk(N); slider(); stat(); }
  const knob={ kind:'drag', home:{x:SLX0,y:SLY}, drag:{axis:'x',clamp:{x0:SLX0,x1:SLX1,y0:SLY,y1:SLY}},
    snap:[{x:(SLX0+SLX1)/2,y:SLY,r:(SLX1-SLX0)/2+80,snap:false}], bbox:a=>({x:a.pos.x-17,y:a.pos.y-17,w:34,h:34}), hiCol:'rgba(244,200,48,.9)' };
  E.tell(t({en:'<b>The Pizza Cut.</b> Q5 measured the <b class="y">rim</b> — now the <b>inside</b>. You cannot lay a ruler across a round patch, so <b>cut it into wedges</b>. <b>Drag the slider</b> to cut finer and finer; watch each wedge\'s curved edge flatten. <b class="p">Pi the Halver</b> sneers that the inside is his. Cut until the wedges are nearly straight, then release.',
    zh:'<b>披萨切法。</b>Q5 量了<b class="y">圆边</b>——现在量<b>里头</b>。圆乎乎的一片没法直接拿尺量，那就<b>切成楔形块</b>。<b>拖动滑块</b>越切越细，看每块的弯边渐渐变直。<b class="p">半圆贩子</b>冷笑说里头归他。切到楔块几乎笔直，再松手。'}));
  stat();
  E.scene({ actors:[knob], draw:drawCut, onDrop(a){ if(E.busy)return; N=NfromX(knob.pos.x);
    if(N>=GATE){ E.sfx('place'); ask(); }
    else { E.oops(); pmood='gloat'; E.status('<span style="color:#ff6a4d">'+t({en:'still chunky — Pi smirks. Cut finer.',zh:'还太厚——Pi 在偷笑。切细一点。'})+'</span>'); } } });
  function ask(){ E.sceneStop();
    pickPills(t({en:'You\'ve cut <b>'+N+'</b> thin wedges. As they get thinner, each <b class="g">wedge</b> looks almost like…',zh:'你切出了 <b>'+N+'</b> 个薄楔块。越切越薄，每个<b class="g">楔块</b>看起来几乎像……'}),
      ()=>disk(N), E.LH*0.9,
      [ {txt:{en:'a triangle',zh:'一个三角形'}, ok:true},
        {txt:{en:'a square',zh:'一个正方形'}, fb:{en:'A wedge has two straight radii and one tiny edge — three sides, a triangle.',zh:'楔块有两条直半径和一条小边——三条边，是三角形。'}},
        {txt:{en:'a circle',zh:'一个圆'}, fb:{en:'The thinner the slice, the straighter its arc — it becomes a thin triangle, not a circle.',zh:'切得越薄，弧越直——它变成细三角，而不是圆。'}} ], win); }
  function win(){ bg(); disk(N); E.setDots(1); E.tickQ(1); E.award(45); E.cheer(); E.sfx('win');
    E.status(keq(t({en:'thin wedge ≈ a triangle',zh:'薄楔块 ≈ 三角形'})));
    E.tell(t({en:'The finer you cut, the more each <b class="g">wedge</b> is just a thin <b class="g">triangle</b>: two unit <b class="r">radii</b> and a tiny straight edge along the <b class="y">rim</b>. Triangles we CAN measure. Next: pack them into a shape we know.',
      zh:'切得越细，每个<b class="g">楔块</b>就越像一个细<b class="g">三角形</b>：两条单位<b class="r">半径</b>，加上贴着<b class="y">圆边</b>的一条小直边。三角形我们会量。接下来：把它们拼成熟悉的形状。'}));
    E.clearTray(); E.addBtn(t({en:'Pack the wedges ▶',zh:'拼起楔块 ▶'}),'primary',E.advance); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
}

/* ===== Round 2 — Pack the Bar: wedges interlock into a bar; cut FINER (slider) so the slanted radius stands up and
   the bar's height rises to meet the radius. The height = radius equality is SHOWN converging, not asserted. =====
   Honest geometry: each wedge's slant side is the true radius (fixed length Rlen). With few fat wedges the bar's
   height = Rlen·cos(π/N) is visibly SHORTER than the radius; as N grows the slants stand vertical and height → radius. */
function round2(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(1); E.sceneStop(); PIST='loom'; pmood='idle';
  E.setPlace(t({en:'Pack the Bar',zh:'拼成长条'}));
  const Rlen=()=>E.LH*0.32, baseY=()=>E.LH*0.7;
  const SLX0=E.LW*0.17, SLX1=E.LW*0.7, SLY=E.LH*0.92, NMIN=4, NMAX=44, GATE=34;
  const NfromX=x=>Math.max(NMIN,Math.min(NMAX,Math.round(NMIN+(x-SLX0)/(SLX1-SLX0)*(NMAX-NMIN))));
  let N=NMIN;
  function geom(n){ const step=Rlen()*Math.sin(P/n), h=Rlen()*Math.cos(P/n), W=n*step, x0=(E.LW-W)/2; return {n,step,h,W,x0,yB:baseY(),yT:baseY()-h}; }
  const vX=(g,i)=>g.x0+i*g.step, vY=(g,i)=>(i%2===0)?g.yB:g.yT;
  function bar(g,extra){ const ctx=E.ctx;
    for(let i=0;i<g.n-1;i++){ ctx.save(); ctx.beginPath(); ctx.moveTo(vX(g,i),vY(g,i)); ctx.lineTo(vX(g,i+1),vY(g,i+1)); ctx.lineTo(vX(g,i+2),vY(g,i+2)); ctx.closePath();   // triangles tile the band
      ctx.fillStyle='rgba(80,216,144,.22)'; ctx.fill();
      ctx.strokeStyle=(i===0)?'#ff8a6a':RD; ctx.lineWidth=(i===0)?3:(g.n>18?1:1.8); ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(vX(g,i),vY(g,i)); ctx.lineTo(vX(g,i+1),vY(g,i+1)); ctx.stroke(); ctx.restore(); }   // first slant bright = "the radius"
    ctx.save(); ctx.strokeStyle=GOLD; ctx.lineWidth=2.6; ctx.beginPath(); ctx.moveTo(g.x0,g.yT); ctx.lineTo(g.x0+g.W,g.yT); ctx.moveTo(g.x0,g.yB); ctx.lineTo(g.x0+g.W,g.yB); ctx.stroke(); ctx.restore();   // gold long edges
    if(extra)extra(g); }
  function radRef(g){ const ctx=E.ctx, x=g.x0-20;   // a fixed red "radius = 1" yardstick beside the bar — the bar's height climbs to meet it
    ctx.save(); ctx.strokeStyle=RD; ctx.setLineDash([4,4]); ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x,g.yB); ctx.lineTo(x,g.yB-Rlen()); ctx.stroke();
    ctx.lineWidth=1.4; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(x-5,g.yB-Rlen()); ctx.lineTo(x+5,g.yB-Rlen()); ctx.moveTo(x-5,g.yB); ctx.lineTo(x+5,g.yB); ctx.stroke(); ctx.restore();
    label(x-13,g.yB-Rlen()/2,t({en:'1',zh:'1'}),RD,13,true);
    if(Rlen()-g.h>4){ ctx.save(); ctx.strokeStyle='rgba(255,106,77,.55)'; ctx.setLineDash([2,3]); ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(x,g.yT); ctx.lineTo(g.x0+g.W*0.5,g.yT); ctx.stroke(); ctx.restore(); } }   // dotted line marks how far the bar-top still falls short
  function slider(){ const ctx=E.ctx; ctx.save();
    ctx.strokeStyle='rgba(200,210,235,.35)'; ctx.lineWidth=4; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(SLX0,SLY); ctx.lineTo(SLX1,SLY); ctx.stroke();
    const kx=knob.pos.x; ctx.strokeStyle=GOLD; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(SLX0,SLY); ctx.lineTo(kx,SLY); ctx.stroke();
    ctx.fillStyle=GOLD; ctx.shadowColor='rgba(244,200,48,.7)'; ctx.shadowBlur=8; ctx.beginPath(); ctx.arc(kx,SLY,11,0,7); ctx.fill(); ctx.restore();
    label(SLX0-4,SLY-20,t({en:'few',zh:'少'}),'#9fb0cc',11); label(SLX1+4,SLY-20,t({en:'many',zh:'多'}),'#9fb0cc',11); }
  function stat(){ const g=geom(N), close=(Rlen()-g.h)<Rlen()*0.01;
    E.status('<span style="color:#f4c830">'+t({en:'wedges: ',zh:'楔块：'})+N+'</span>'+(close?'  <span style="color:#50d890">'+t({en:'→ height meets the radius',zh:'→ 高已追上半径'})+'</span>':'  <span style="color:#ff6a4d">'+t({en:'height still short of the radius',zh:'高还不到半径'})+'</span>')); }
  function drawRefine(){ bg(); N=NfromX(knob.pos.x); const g=geom(N); bar(g); radRef(g); slider(); stat(); }
  const knob={ kind:'drag', home:{x:SLX0,y:SLY}, drag:{axis:'x',clamp:{x0:SLX0,x1:SLX1,y0:SLY,y1:SLY}},
    snap:[{x:(SLX0+SLX1)/2,y:SLY,r:(SLX1-SLX0)/2+80,snap:false}], bbox:a=>({x:a.pos.x-17,y:a.pos.y-17,w:34,h:34}), hiCol:'rgba(244,200,48,.9)' };
  E.tell(t({en:'<b>Pack the Bar.</b> Your <b class="g">wedges</b> interlock point-up / point-down into a bar. Each wedge\'s slanted side is a <b class="r">radius</b> — but with only a few fat wedges the bar is lumpy and the leaning <b class="r">radius</b> is clearly longer than the bar\'s <b>height</b> (see the red <b class="r">1</b> yardstick). <b>Drag the slider to cut finer</b>: the slants stand up and the height climbs to meet the <b class="r">radius</b>.',
    zh:'<b>拼成长条。</b>你的<b class="g">楔块</b>一上一下互扣成一根条。每块楔形的斜边都是一条<b class="r">半径</b>——可只用几块大楔块时，条是凹凸的，那条斜<b class="r">半径</b>明显比条的<b>高</b>要长（看红色 <b class="r">1</b> 标尺）。<b>拖动滑块切得更细</b>：斜边立起来，高就一点点追上<b class="r">半径</b>。'}));
  stat();
  E.scene({ actors:[knob], draw:drawRefine, onDrop(a){ if(E.busy)return; N=NfromX(knob.pos.x);
    if(N>=GATE){ E.sfx('place'); ask(); }
    else { E.oops(); pmood='gloat'; E.status('<span style="color:#ff6a4d">'+t({en:'still lumpy — cut finer so the height reaches the radius.',zh:'还凹凸——切得更细，让高追上半径。'})+'</span>'); } } });
  function packed(extra){ bg(); const g=geom(N); bar(g,extra); radRef(g); }
  function ask(){ E.sceneStop();
    function q1(){ pickPills(t({en:'Now the wedges are thin, the bar is a clean rectangle and its <b>height</b> has risen to meet the red yardstick — a unit <b class="r">radius</b>. So the height is…',zh:'楔块变细后，长条成了规整的矩形，<b>高</b>也追上了那把红标尺——一条单位<b class="r">半径</b>。所以高是……'}),
        ()=>{ const g=geom(N); bg(); bar(g); radRef(g); }, E.LH*0.9,
        [ {txt:{en:'½',zh:'½'}, fb:{en:'The slant is a whole radius of the unit circle, and standing up it equals the height: 1.',zh:'斜边是单位圆的整条半径，立起来就等于高：1。'}},
          {txt:{en:'1',zh:'1'}, ok:true},
          {txt:{en:'τ',zh:'τ'}, fb:{en:'τ is the whole rim. The bar\'s height is just one radius: 1.',zh:'τ 是整条圆边。长条的高只是一条半径：1。'}} ], q2); }
    function q2(){ pickPills(t({en:'The bar\'s long <b class="y">top edge</b> is made of the wedges\' tiny rim-pieces — exactly <b>half</b> the whole <b class="y">rim</b> τ. So that edge is…',zh:'长条的长<b class="y">上边</b>由楔块那些贴边的小弧拼成——正好是整条<b class="y">圆边</b> τ 的<b>一半</b>。所以这条边是……'}),
        ()=>{ const g=geom(N); bg(); bar(g,(gg)=>label(gg.x0+gg.W/2,gg.yT-12,'?',GOLD,16,true)); }, E.LH*0.9,
        [ {txt:{en:'½τ',zh:'½τ'}, ok:true},
          {txt:{en:'τ',zh:'τ'}, fb:{en:'τ is the WHOLE rim. The top edge holds only half; the bottom edge holds the other half. So the edge is ½τ.',zh:'τ 是整条圆边。上边只占一半，下边占另一半。所以这条边是 ½τ。'}},
          {txt:{en:'1',zh:'1'}, fb:{en:'1 is the height. The long edge is half the rim, ½τ ≈ 3.14.',zh:'1 是高。长边是半条圆边，½τ ≈ 3.14。'}} ], win); }
    q1();
  }
  function win(){ E.setDots(2); E.tickQ(2); E.award(45); pmood='hurt'; const g=geom(N); bg(); bar(g,(gg)=>label(gg.x0+gg.W/2,gg.yT-12,'½τ',GOLD,15,true)); radRef(g);
    E.cheer(); E.sfx('win');
    E.status(keq(t({en:'a bar: height 1, length ½τ',zh:'一根长条：高 1，长 ½τ'})));
    E.tell(t({en:'Cut fine enough, the round patch is a clean <b class="g">bar</b>: its <b>height</b> is one standing <b class="r">radius</b>, <b class="r">1</b>; its <b>long edge</b> is half the <b class="y">rim</b>, <b class="y">½τ</b>. A bar\'s area is just length × height — easy. Read it off.',
      zh:'切得够细，圆乎乎的一片就成了规整的<b class="g">长条</b>：<b>高</b>是一条立起的<b class="r">半径</b>，<b class="r">1</b>；<b>长边</b>是半条<b class="y">圆边</b>，<b class="y">½τ</b>。长条的面积就是 长 × 高——很简单。读出来吧。'}));
    E.clearTray(); E.addBtn(t({en:'Read the area ▶',zh:'读出面积 ▶'}),'primary',E.advance); E.addBtn(t({en:'◀ Prev step',zh:'◀ 上一步'}),'ghost',E.prevStep); }
}

/* ===== Round 3 — Read the Area: ½τ × 1 = ½τ ≈ 3.14 = π; Pi claims it, then is named down by τ ===== */
function round3(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(2); E.sceneStop(); PIST='loom'; pmood='idle';
  E.setPlace(t({en:'The Inside',zh:'圆的里头'}));
  const BW=()=>E.LW*0.56, BH=()=>BW()/3.14, BX0=()=>(E.LW-BW())/2, BYT=()=>E.LH*0.4, BYB=()=>BYT()+BH();
  let claimed=false;
  function bar(extra){ const ctx=E.ctx; ctx.save();
    ctx.fillStyle=claimed?'rgba(152,92,228,.28)':'rgba(80,216,144,.26)'; ctx.fillRect(BX0(),BYT(),BW(),BH());
    ctx.strokeStyle=GOLD; ctx.lineWidth=3; ctx.shadowColor='rgba(244,200,48,.5)'; ctx.shadowBlur=6; ctx.beginPath(); ctx.moveTo(BX0(),BYT()); ctx.lineTo(BX0()+BW(),BYT()); ctx.moveTo(BX0(),BYB()); ctx.lineTo(BX0()+BW(),BYB()); ctx.stroke(); ctx.shadowBlur=0;
    ctx.strokeStyle=RD; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(BX0(),BYT()); ctx.lineTo(BX0(),BYB()); ctx.moveTo(BX0()+BW(),BYT()); ctx.lineTo(BX0()+BW(),BYB()); ctx.stroke(); ctx.restore();
    label(BX0()-24,(BYT()+BYB())/2,'1',RD,14,true); label(BX0()+BW()/2,BYT()-16,'½τ',GOLD,15,true); if(extra)extra(); }
  function base(){ bg(); bar(); }
  E.tell(t({en:'<b>The Inside.</b> A <b class="g">bar</b> with height <b class="r">1</b> and length <b class="y">½τ</b>. Its <b>area</b> is length × height. So the whole disk\'s area is…',
    zh:'<b>圆的里头。</b>一根<b class="g">长条</b>，高 <b class="r">1</b>，长 <b class="y">½τ</b>。它的<b>面积</b> = 长 × 高。那么整个圆盘的面积是……'}));
  pickPills(t({en:'<b>Area = <b class="y">½τ</b> × <b class="r">1</b> = ?</b>',zh:'<b>面积 = <b class="y">½τ</b> × <b class="r">1</b> = ?</b>'}),
    base, E.LH*0.9,
    [ {txt:{en:'τ ≈ 6.28',zh:'τ ≈ 6.28'}, fb:{en:'τ is the whole RIM, a length. The bar is only ½τ long and 1 tall, so its area is ½τ.',zh:'τ 是整条圆边，是长度。长条只有 ½τ 长、1 高，所以面积是 ½τ。'}},
      {txt:{en:'½τ ≈ 3.14',zh:'½τ ≈ 3.14'}, ok:true, react:()=>{ claimed=true; }},
      {txt:{en:'1',zh:'1'}, fb:{en:'1 is only the height. Multiply by the length ½τ: the area is ½τ.',zh:'1 只是高。再乘以长 ½τ：面积是 ½τ。'}} ],
    seal);
  function seal(){ E.busy=true; E.sceneStop();   // Pi snatches the green area (it really is π!) — a brief claim, then you name it ½τ and reclaim it
    PIST='claim'; pmood='gloat'; pSad=0;
    E.speakAs('tau', t({en:'That number… it\'s his!',zh:'那个数……是他的！'}));
    E.anim(900,p=>{ bg(); const ctx=E.ctx;
      ctx.save(); ctx.fillStyle='rgba(152,92,228,'+(0.2+0.25*p)+')'; ctx.fillRect(BX0(),BYT(),BW(),BH()); ctx.restore();
      bar(()=>label((BX0()+BW()/2),(BYT()+BYB())/2,'π?',VIO,20+10*p,true));
      const px=E.LW*0.86-(E.LW*0.86-(BX0()+BW()/2))*p, py=E.LH*0.22+((BYT()+BYB())/2-E.LH*0.22)*p; pi(px,py,28-8*p);
    }, win); }
  function win(){ claimed=false; PIST='recoil'; pmood='hurt'; pSad=1; bg();
    bar(()=>{ label(BX0()+BW()/2,(BYT()+BYB())/2-9,'½τ',GOLD,22,true); label(BX0()+BW()/2,(BYT()+BYB())/2+15,'= π ≈ 3.14',VIO,13,true); });
    E.setDots(3); E.tickQ(3); E.award(65); E.cheer(); E.sfx('win');
    E.status(keq('½τ ≈ 3.14 = π'));
    E.tell(t({en:'The disk\'s <b class="g">area</b> is <b class="y">½τ</b> ≈ <b>3.14</b> — and yes, that IS <b class="p">π</b>. So <b class="p">Pi the Halver</b> is right that the number is his — but only because the <b>area</b> is HALF the turn. The <b class="y">rim</b> is the whole turn <b class="y">τ</b>; the <b>inside</b> is half of it, <b class="y">½τ</b> = <b class="p">π</b>. Name it <b class="y">½τ</b> and the inside is sealed. He recoils — but vows the next slice is his too.',
      zh:'圆盘的<b class="g">面积</b>是 <b class="y">½τ</b> ≈ <b>3.14</b>——没错，那正是 <b class="p">π</b>。所以<b class="p">半圆贩子</b>说这个数归他，是对的——但只因为<b>面积</b>恰是整圈的<b>一半</b>。<b class="y">圆边</b>是整整一圈 <b class="y">τ</b>；<b>里头</b>是它的一半，<b class="y">½τ</b> = <b class="p">π</b>。把它写作 <b class="y">½τ</b>，里头就封住了。他退了一步——却扬言下一块也归他。'}));
    E.clearTray(); E.addBtn(t({en:'Claim the Codex page 📖',zh:'领取典籍书页 📖'}),'primary',()=>E.openBook(QUEST.book)); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
}

const QUEST = {
  id:'q06', page:10, region:'coil', bgm:'audio/bgm-cradle.mp3?v=20260606k2',
  kicker:{en:'The Coil',zh:'盘卷'},
  title:{en:'The Disk\'s Area — Pizza Cut',zh:'圆盘的面积 · 披萨切法'},
  meta:{ title:{en:'Area by the Pizza Cut',zh:'披萨切法求面积'}, giver:{en:'Master Curvo · The Coil',zh:'曲师 Curvo · 盘卷'},
    flavor:{en:'"You traced the rim, Pathfinder — the <b class="y">circle\'s edge</b> is <b class="y">τ</b>. But the <b class="p">Rift</b> now floods the disk\'s <b>inside</b>, and to seal it you must measure the whole <b class="g">area</b>. There is no ruler for a round patch — so we <b>cut</b>. Slice the disk into wedges, finer and finer, until each is a straight <b class="g">triangle</b>; pack them into a bar we can measure. <b class="p">Pi the Halver</b> laughs that the inside is his — and this time he is half-right, for the area is exactly HALF a turn. Cut, pack, and read it: <b class="y">½τ</b>. Then name it, and the inside is ours again."',
      zh:'"你描出了圆边，开拓者——<b class="y">圆的边</b>是 <b class="y">τ</b>。可<b class="p">裂隙</b>如今漫进了圆盘的<b>里头</b>，要封住它，你得量出整片<b class="g">面积</b>。圆乎乎的一片没有尺可量——那就<b>切</b>。把圆盘切成楔块，越切越细，直到每块都是直边<b class="g">三角</b>；再把它们拼成能量的长条。<b class="p">半圆贩子</b>大笑说里头归他——这回他对了一半，因为面积恰是整圈的一半。切开、拼好、读出来：<b class="y">½τ</b>。然后给它正名，里头就重归我们。"'} },
  objs:[ {en:'The Pizza Cut: slice the disk into thin triangles',zh:'披萨切法：把圆盘切成薄三角'},
         {en:'Pack the Bar: height 1, long edge ½τ',zh:'拼成长条：高 1，长边 ½τ'},
         {en:'The Inside: area = ½τ × 1 = ½τ = π ≈ 3.14',zh:'圆的里头：面积 = ½τ × 1 = ½τ = π ≈ 3.14'} ],
  rounds:[round1,round2,round3],
  book:{ page:6, kicker:{en:'The Coil',zh:'盘卷之'}, title:{en:'Area of the Unit Disk — Pizza',zh:'单位圆盘的面积 · 披萨法'},
    blocks:[
      {top:true, fig:'pwedge', prose:{en:'You cannot lay a ruler across a round patch. So <b>cut</b> the disk into wedges — and the <b>finer</b> you cut, the more each <b class="g">wedge</b> is just a thin <b class="g">triangle</b>: two unit <b class="r">radii</b> and a tiny straight edge along the <b class="y">rim</b>.',
        zh:'圆乎乎的一片没法直接拿尺量。那就把圆盘<b>切</b>成楔块——切得<b>越细</b>，每个<b class="g">楔块</b>就越像一个细<b class="g">三角形</b>：两条单位<b class="r">半径</b>，加一条贴着<b class="y">圆边</b>的小直边。'}},
      {law:{en:'Pack the wedges into a bar',zh:'把楔块拼成长条'}, fig:'prect', prose:{en:'Lay the <b class="g">wedges</b> in a row, every other one flipped point-up / point-down, and they interlock into a straight <b>bar</b>. Its <b>height</b> is one <b class="r">radius</b>, <b class="r">1</b>. Its long <b class="y">edge</b> is made of the rim-pieces — exactly <b>half</b> the whole rim, <b class="y">½τ</b>.',
        zh:'把<b class="g">楔块</b>排成一排，一个尖朝上、一个尖朝下交替互扣，就拼成一根直<b>长条</b>。它的<b>高</b>是一条<b class="r">半径</b>，<b class="r">1</b>。它的长<b class="y">边</b>由那些小弧拼成——正好是整条圆边的<b>一半</b>，<b class="y">½τ</b>。'}},
      {law:{en:'Area is length × height',zh:'面积 = 长 × 高'}, eq:'<span class="y">½τ</span> × <span class="r">1</span> = <span class="y">½τ</span> = <span class="p">π</span> ≈ 3.14', fig:'parea', prose:{en:'A bar\'s area is just length × height: <b class="y">½τ</b> × <b class="r">1</b> = <b class="y">½τ</b> ≈ <b>3.14</b>. The <b class="y">rim</b> is the whole turn <b class="y">τ</b>; the <b>inside</b> is half of it. And half a turn is exactly <b class="p">π</b> — that is why <b class="p">π</b> keeps appearing: it is the <b>area</b> number.',
        zh:'长条的面积就是 长 × 高：<b class="y">½τ</b> × <b class="r">1</b> = <b class="y">½τ</b> ≈ <b>3.14</b>。<b class="y">圆边</b>是整整一圈 <b class="y">τ</b>；<b>里头</b>是它的一半。而半圈正是 <b class="p">π</b>——这就是 <b class="p">π</b> 老是冒出来的原因：它是<b>面积</b>的数。'}},
      {note:{en:'<b>Turning area into length.</b> The whole trick was to cut a curved area into straight pieces and re-lay them as a length we can measure. Hold onto this move — it is the seed of everything ahead in The Coil.',
        zh:'<b>把面积化成长度。</b>整个窍门，就是把一片弯曲的面积切成直的小块，再重新摆成一段能量的长度。记住这一招——它是「盘卷」后面一切的种子。'}}
    ],
    read:{en:'You cannot measure a round patch directly, so cut the disk into wedges. The finer you cut, the more each wedge is a thin triangle. Pack them alternating up and down into a bar: its height is one radius, 1, and its long edge is half the rim, half tau. The area is length times height, half tau times 1, which is half tau, about 3.14. That is pi: the area is half the turn.',
      zh:'圆乎乎的一片没法直接量，那就把圆盘切成楔块。切得越细，每块越像细三角。把它们一上一下拼成长条：高是一条半径，1，长边是半条圆边，半个 tau。面积等于长乘高，半个 tau 乘 1，就是半个 tau，大约 3.14。那正是 pi：面积是整圈的一半。'} },
  intro:(E)=>{ bg(); const c=E.ctx; const n=8; for(let i=0;i<n;i++){ const a0=i*TAU/n,a1=a0+TAU/n; c.save(); c.beginPath(); c.moveTo(CX(),CY()); c.arc(CX(),CY(),R(),a0,a1); c.closePath(); c.fillStyle=(i%2)?'rgba(80,216,144,.14)':'rgba(80,216,144,.22)'; c.fill(); c.restore(); } c.save(); c.strokeStyle=GOLD; c.lineWidth=3; c.beginPath(); c.arc(CX(),CY(),R(),0,7); c.stroke(); c.restore(); odot(); }
};
window.QUEST_q06 = QUEST;
})();
