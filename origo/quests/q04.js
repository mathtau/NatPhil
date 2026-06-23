/* ORIGO · Quest 4 = MathO p8 · "Comparing Area and Length".
   WORLDLINE STORY: a FOGWRAITH (a lesser servant of the Unravelling/Chaos — "undefined corruption", see ORIGO.md) has unmade this
   land's measure. With no unit fixed, "which is bigger, the FIELD (an AREA) or the wraith's debt-ROPE (a LENGTH)?" has no answer, and
   the wraith FEEDS on that undefined muddle while the herd starves. Pin ONE measuring rod (define what "1" means) and the answer turns
   plain, the wraith starves, and the Fog behind it loses its grip. The wraith's last trick: SWAP the rod so the winner flips and the
   question feels undefined again; pin ONE rod firmly and it is driven off. (Chaos/the Fog is the FINAL boss — early quests fight its minions.)
   This very move (reading sides under a chosen rod, rolling a field of grass into one bar) is how we will later read the area under a curve.
   DESIGN: areas are read by their two SIDES in rods (no product, no "units²"); lengths are drawn VERTICAL (as they appear in calculus);
   every number is randomized fresh each play; answer buttons are tinted to the object they name (field=green, rope=blue, neutral=grey).
   DRAFT — reachable at play.html?q=04; not linked from the world. */
(function(){
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=arr=>arr[rnd(0,arr.length-1)];
let L1='', L2='', L3='';   // last draw per round, so a Replay never repeats the previous numbers (each play = a fresh exercise)
/* roll `gen()` until its signature `sig(v)` differs from `last`; returns the value and the caller stores the new signature. */
function reroll(gen, sig, last){ let v, s, i=0; do { v=gen(); s=sig(v); } while(s===last && ++i<40); return [v, s]; }
const t=s=>E.t(s);
const keq=(en,zh)=>'<span class="keq">'+en+' <span class="tk">✓</span></span>';   // status badge (caller passes per-lang)
const G='#2faa4e', L='#2f74d0', RD='#e8402e';   // field/area = green, rope/length = blue, rod/unit = red (matches the codex)

function label(x,y,txt,col,sz,halo){ const c=E.ctx; c.save(); c.font=(sz||17)+'px "IBM Plex Mono",monospace'; c.textAlign='center'; c.textBaseline='middle';
  if(halo){ c.lineWidth=3; c.strokeStyle='rgba(12,16,24,.55)'; c.strokeText(txt,x,y); } c.fillStyle=col||'#caa84a'; c.fillText(txt,x,y); c.restore(); }
function rrect(ctx,x,y,w,h,r){ r=Math.min(r,w/2,h/2); ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function star(ctx,cx,cy,r,col){ if(r<=0)return; ctx.save(); ctx.fillStyle=col; ctx.beginPath();
  for(let i=0;i<5;i++){ const a=-Math.PI/2+i*2*Math.PI/5; ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r); const a2=a+Math.PI/5; ctx.lineTo(cx+Math.cos(a2)*r*0.45,cy+Math.sin(a2)*r*0.45); }
  ctx.closePath(); ctx.fill(); ctx.restore(); }

/* the FOGWRAITH: a hovering hooded specter (violet aura, glowing cyan eyes, tattered smoke-hem). WST drives its menace:
   'loom' = present and feeding, 'recoil' = starved + shrunk (rod pinned), 'gone' = driven off (not drawn). */
let WST='loom', wmood='idle';   // WST: loom|recoil|gone ; wmood: idle | gloat (after a WRONG answer) | hurt (after a RIGHT answer)
function wraith(cx,cy,s){ if(WST==='gone')return; const ctx=E.ctx, tt=performance.now()/1000, recoil=(WST==='recoil');
  if(recoil)s*=0.72; else if(wmood==='gloat')s*=1.12; else if(wmood==='hurt')s*=0.85;
  const a=recoil?0.55:(wmood==='hurt'?0.72:1), auraA=recoil?0.16:(wmood==='gloat'?0.52:wmood==='hurt'?0.18:0.36);
  cy+=Math.sin(tt*1.6)*s*0.06; const sway=recoil?0:Math.sin(tt*0.9)*s*0.05;
  ctx.save(); ctx.translate(sway,0); ctx.globalAlpha=a;
  const aura=ctx.createRadialGradient(cx,cy,2,cx,cy,s*1.8); aura.addColorStop(0,'rgba(152,92,228,'+auraA+')'); aura.addColorStop(1,'rgba(152,92,228,0)');
  ctx.fillStyle=aura; ctx.beginPath(); ctx.arc(cx,cy,s*1.8,0,7); ctx.fill();
  const w=s*0.92, top=cy-s*0.95; ctx.beginPath(); ctx.moveTo(cx-w,cy);
  ctx.quadraticCurveTo(cx-w,top,cx,top); ctx.quadraticCurveTo(cx+w,top,cx+w,cy);
  for(let i=4;i>=-4;i--){ const x=cx+(i/4)*w, yy=cy+s*0.78+Math.sin(tt*3.2+i*0.9)*s*0.16+(Math.abs(i)%2?0:s*0.12); ctx.lineTo(x,yy); }
  ctx.closePath(); const cloak=ctx.createLinearGradient(0,top,0,cy+s); cloak.addColorStop(0,'rgba(44,32,78,.95)'); cloak.addColorStop(1,'rgba(16,12,38,.82)');
  ctx.fillStyle=cloak; ctx.fill(); ctx.strokeStyle='rgba(142,106,216,.55)'; ctx.lineWidth=1.4; ctx.stroke();
  const ey=top+s*0.55, ex=s*0.3, er=s*0.14*(wmood==='hurt'?0.7:wmood==='gloat'?1.15:1), pulse=0.78+0.22*Math.sin(tt*4);
  [-1,1].forEach(d=>{ const eg=ctx.createRadialGradient(cx+d*ex,ey,0,cx+d*ex,ey,er*1.7); eg.addColorStop(0,'#e8fdff'); eg.addColorStop(.45,'#79e6ff'); eg.addColorStop(1,'rgba(120,230,255,0)');
    ctx.globalAlpha=a*pulse; ctx.fillStyle=eg; ctx.beginPath(); ctx.arc(cx+d*ex,ey,er*1.7,0,7); ctx.fill();
    ctx.globalAlpha=a; ctx.fillStyle='#080a1c'; ctx.beginPath(); ctx.ellipse(cx+d*ex,ey,er*0.45,er*0.85,0,0,7); ctx.fill(); });
  ctx.globalAlpha=a; ctx.strokeStyle='rgba(8,8,26,.85)'; ctx.lineWidth=s*0.07; ctx.lineCap='round'; const bd=(wmood==='hurt')?-1:1;   // brows down=menace, up=hurt
  ctx.beginPath(); ctx.moveTo(cx-ex-er,ey-er*1.1*bd); ctx.lineTo(cx-ex+er*0.7,ey-er*0.1*bd); ctx.moveTo(cx+ex+er,ey-er*1.1*bd); ctx.lineTo(cx+ex-er*0.7,ey-er*0.1*bd); ctx.stroke();
  const my=top+s*0.94, mw=s*0.26; ctx.lineWidth=s*0.06; ctx.beginPath();          // mouth: grin (gloat) / frown (hurt) / flat (idle)
  if(wmood==='gloat'){ ctx.moveTo(cx-mw,my-s*0.04); ctx.quadraticCurveTo(cx,my+s*0.16,cx+mw,my-s*0.04); }
  else if(wmood==='hurt'){ ctx.moveTo(cx-mw,my+s*0.1); ctx.quadraticCurveTo(cx,my-s*0.07,cx+mw,my+s*0.1); }
  else { ctx.moveTo(cx-mw*0.7,my); ctx.lineTo(cx+mw*0.7,my); }
  ctx.stroke(); ctx.restore(); }

function bg(){ const ctx=E.ctx,LW=E.LW,LH=E.LH; E.clear(); FIG.fog(ctx,0,LW,0,LH*0.5,performance.now());
  const gh=54, gg=ctx.createLinearGradient(0,LH-gh,0,LH); gg.addColorStop(0,'#2f7a3f'); gg.addColorStop(1,'#163a21');
  ctx.fillStyle=gg; ctx.fillRect(0,LH-gh,LW,gh); ctx.fillStyle='rgba(160,235,180,.45)'; ctx.fillRect(0,LH-gh,LW,2);
  const v=ctx.createRadialGradient(LW/2,LH*0.46,LH*0.32,LW/2,LH*0.5,LH); v.addColorStop(0,'rgba(0,0,0,0)'); v.addColorStop(1,'rgba(8,10,20,.30)');
  ctx.fillStyle=v; ctx.fillRect(0,0,LW,LH);
  if(WST==='loom'){ const m=ctx.createLinearGradient(LW,0,LW*0.66,0); m.addColorStop(0,'rgba(72,36,112,.40)'); m.addColorStop(1,'rgba(72,36,112,0)'); ctx.fillStyle=m; ctx.fillRect(LW*0.66,0,LW*0.34,LH); }
  FIG.bull(ctx,40,LH-30,42); wraith(LW*0.85,LH*0.27,42); }   // Tau bottom-left, wraith looms upper-RIGHT (kept right to avoid clustering)

const TAUIMG={};
function tauImg(mood){ if(TAUIMG[mood])return TAUIMG[mood]; const i=new Image(); i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(FIG.tauBull(mood)); TAUIMG[mood]=i; return i; }
try{ ['happy','open'].forEach(tauImg); }catch(_){}
function calf(ctx,x,y,r){ const img=tauImg('happy'), s=r*3.2; if(img.complete&&img.naturalWidth){ try{ ctx.drawImage(img,x-s/2,y-s/2,s,s); }catch(_){ } } else { ctx.save(); ctx.fillStyle='#f4c830'; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); ctx.restore(); } }

const TAUNT=[ {en:'Hee hee — no answer, no answer!',zh:'嘿嘿，没答案，没答案！'}, {en:'Stay muddled, little calf!',zh:'继续糊涂吧，小牛！'}, {en:'Mmm, the muddle feeds me!',zh:'嗯，这团乱劲儿喂饱我！'} ];
const QUIP=[ {en:'Yes!',zh:'对了！'}, {en:'Good eye!',zh:'好眼力！'}, {en:'That\'s it!',zh:'就是它！'} ];   // Tau's cheer on a RIGHT answer (visible pop + spoken if narration is on)
const HG='rgba(80,216,144,.95)', HB='rgba(96,150,255,.95)', HU='rgba(244,200,48,.95)';   // highlight tints: field=green, rope=blue, token=gold
/* DIRECT-MANIPULATION choice via the shared E.choose; the figures REACT: right → Tau cheers + wraith hurt; wrong → wraith gloats + taunt (scene stays live to retry). */
function pickScene(prompt, redraw, items, onRight){ E.choose(prompt, redraw, items, onRight, {
  react:(ok)=>{ wmood = ok?'hurt':'gloat'; if(ok) E.speakAs('tau', t(pick(QUIP))); },
  okPop:()=>t(pick(QUIP)),
  fbWrap:(fb)=>'<span class="wsay">“'+t(pick(TAUNT))+'”</span><br>'+fb }); }
const pill=(cx,cy,txt)=>E.pill(cx,cy,txt), pillBB=(cx,cy,txt)=>E.pillBB(cx,cy,txt);   // now shared in the engine

/* a FIELD (area): a soft green patch read by its two SIDES in rods (red ticks + counts on the edges). No interior grid, no product. */
function field(x,y,w,h,unit,name){ const ctx=E.ctx; ctx.save();
  ctx.shadowColor='rgba(8,28,15,.35)'; ctx.shadowBlur=10; ctx.shadowOffsetY=4;
  const g=ctx.createLinearGradient(0,y,0,y+h); g.addColorStop(0,'rgba(92,205,124,.34)'); g.addColorStop(1,'rgba(42,150,74,.26)');
  ctx.fillStyle=g; rrect(ctx,x,y,w,h,8); ctx.fill(); ctx.restore();
  ctx.save(); ctx.strokeStyle=G; ctx.lineWidth=2.4; rrect(ctx,x,y,w,h,8); ctx.stroke();
  ctx.strokeStyle='rgba(205,255,222,.55)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x+9,y+1.6); ctx.lineTo(x+w-9,y+1.6); ctx.stroke(); ctx.restore();
  if(unit>0){ const wc=Math.round(w/unit), hc=Math.round(h/unit); ctx.save(); ctx.strokeStyle=RD; ctx.lineWidth=1.8; ctx.lineCap='round';
    for(let i=1;i<wc;i++){ ctx.beginPath(); ctx.moveTo(x+i*unit,y+h-5); ctx.lineTo(x+i*unit,y+h+5); ctx.stroke(); }
    for(let j=1;j<hc;j++){ ctx.beginPath(); ctx.moveTo(x-5,y+j*unit); ctx.lineTo(x+5,y+j*unit); ctx.stroke(); } ctx.restore();
    label(x+w/2,y+h+16,''+wc,RD,15,true); label(x-16,y+h/2,''+hc,RD,15,true); }
  if(name) label(x+w/2,y+h/2,name,'#e9fff0',15,true); }

/* a ROPE (length): a VERTICAL blue line (lengths appear vertical in calculus), with a little knot at the top, read by its rod-count. */
function rope(x,y,len,unit,name){ const ctx=E.ctx; ctx.save();
  ctx.shadowColor='rgba(8,18,40,.4)'; ctx.shadowBlur=8; ctx.shadowOffsetX=3;
  const g=ctx.createLinearGradient(x-3,0,x+3,0); g.addColorStop(0,'#3a83e0'); g.addColorStop(1,'#1f5ab0');
  ctx.strokeStyle=g; ctx.lineWidth=6; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(x,y+6); ctx.lineTo(x,y+len); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.strokeStyle=L; ctx.lineWidth=2.6; ctx.beginPath(); ctx.arc(x,y+4,4.5,0.6,Math.PI*2+0.4); ctx.stroke();   // knot loop (charm)
  ctx.fillStyle=L; ctx.beginPath(); ctx.arc(x,y+len,4,0,7); ctx.fill(); ctx.restore();
  if(unit>0){ ctx.save(); ctx.strokeStyle=RD; ctx.lineWidth=1.8; ctx.lineCap='round'; for(let my=y+unit; my<y+len-0.5; my+=unit){ ctx.beginPath(); ctx.moveTo(x-5,my); ctx.lineTo(x+5,my); ctx.stroke(); } ctx.restore(); label(x+17,y+len/2,''+Math.round(len/unit),RD,15,true); }
  if(name) label(x,y-14,name,'#bcd6ff',15,true); }

/* the measuring ROD (the unit "1"), vertical, red. BUTT caps + end serifs so its length is EXACTLY one tick-spacing
   on the shapes (round caps would add ~half the line-width at each end and make it overshoot the "1"). */
function rod(x,y,len){ const ctx=E.ctx; ctx.save();
  ctx.shadowColor='rgba(40,8,8,.32)'; ctx.shadowBlur=5; ctx.shadowOffsetX=2;
  const g=ctx.createLinearGradient(x-3,0,x+3,0); g.addColorStop(0,'#f2604c'); g.addColorStop(1,'#d6341e');
  ctx.strokeStyle=g; ctx.lineWidth=5; ctx.lineCap='butt'; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+len); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.strokeStyle=RD; ctx.lineWidth=2; ctx.lineCap='butt';   // end serifs mark the exact one-unit span
  ctx.beginPath(); ctx.moveTo(x-6,y); ctx.lineTo(x+6,y); ctx.moveTo(x-6,y+len); ctx.lineTo(x+6,y+len); ctx.stroke(); ctx.restore();
  label(x,y-13,t({en:'rod = 1',zh:'量尺 = 1'}),'#ffc2b6',12,true); }

/* the landing SOCKET: a faint dashed rod-shaped ghost showing WHERE to drop the rod. Brightens (hot=true) when the dragged rod is in range. */
function socket(x,y,len,hot){ const ctx=E.ctx; ctx.save(); ctx.globalAlpha=hot?0.95:0.5; ctx.setLineDash([4,5]);
  ctx.strokeStyle=hot?'rgba(80,216,144,.95)':'rgba(242,120,96,.7)'; ctx.lineWidth=hot?3:2; if(hot){ ctx.shadowColor='rgba(80,216,144,.6)'; ctx.shadowBlur=12; }
  ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y+len); ctx.stroke();
  ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(x-7,y); ctx.lineTo(x+7,y); ctx.moveTo(x-7,y+len); ctx.lineTo(x+7,y+len); ctx.stroke();
  ctx.restore(); label(x,y+len+13,t({en:hot?'release!':'drop here',zh:hot?'松手！':'放这里'}), hot?'#7fe0a0':'rgba(255,194,182,.8)',11,true); }

/* ===== Round 1 — The Quarrel: TAP the bigger object. field-vs-rope has no answer, so tap the "Can't tell" token ===== */
function round1(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(0); E.sceneStop();
  E.setPlace(t({en:'The Quarrel',zh:'争执之地'})); E.status(''); WST='loom'; wmood='idle';
  // fields are VERTICAL rectangles (foreshadow integration's tall strips); A clearly more grass than B; rope P clearly longer than Q. Re-roll so Replay never repeats the last draw.
  const [D,sig]=reroll(()=>({A:{w:rnd(74,88),h:rnd(120,150)}, B:{w:rnd(54,66),h:rnd(80,104)}, P:rnd(150,185), Q:rnd(82,112)}),
    v=>v.A.w+','+v.A.h+','+v.B.w+','+v.B.h+','+v.P+','+v.Q, L1); L1=sig;
  const A=D.A, B=D.B, P=D.P, Q=D.Q;
  function q1(){ wmood='idle'; const y=E.LH*0.22, ax=E.LW*0.16, bx=E.LW*0.56, by=y+8;
    const draw=()=>{ bg(); field(ax,y,A.w,A.h,0,'A'); field(bx,by,B.w,B.h,0,'B'); };
    pickScene(t({en:'Two <b style="color:#7fe0a0">fields</b>. Tap the one with more grass.',zh:'两块<b>草田</b>。点一下草更多的那块。'}), draw,
      [ {bbox:()=>({x:ax,y,w:A.w,h:A.h}), ok:true, hiCol:HG},
        {bbox:()=>({x:bx,y:by,w:B.w,h:B.h}), hiCol:HG, fb:{en:'A covers more ground.',zh:'A 占地更多。'}} ], q2); }
  function q2(){ wmood='idle'; const y=E.LH*0.09, px=E.LW*0.34, qx=E.LW*0.62;
    const draw=()=>{ bg(); rope(px,y,P,0,'P'); rope(qx,y,Q,0,'Q'); };
    pickScene(t({en:'Two <b style="color:#7fb6ff">ropes</b>. Tap the longer one.',zh:'两根<b>绳</b>。点一下更长的那根。'}), draw,
      [ {bbox:()=>({x:px-18,y,w:36,h:P}), ok:true, hiCol:HB},
        {bbox:()=>({x:qx-18,y,w:36,h:Q}), hiCol:HB, fb:{en:'P hangs further.',zh:'P 更长。'}} ], q3); }
  function q3(){ wmood='idle'; const fx=E.LW*0.16,fy=E.LH*0.22,rx=E.LW*0.62,ry=E.LH*0.09, tx=E.LW*0.5,ty=E.LH*0.86,
      tlab=t({en:"Can't tell yet",zh:'还说不准'});
    const draw=()=>{ bg(); field(fx,fy,72,128,0,'field'); rope(rx,ry,150,0,'rope'); pill(tx,ty,tlab); };
    const fog={en:'No answer — area and length are different kinds. The <b class="p">wraith</b> feeds on that.',zh:'没答案，面积和长度不同类，<b class="p">幽灵</b>正好吃这个。'};
    pickScene(t({en:'Now: <b style="color:#7fe0a0">field</b> or <b style="color:#7fb6ff">rope</b> — tap the bigger. (Or the token, if it\'s too soon to say.)',zh:'现在：<b>田</b>还是<b>绳</b>更大？点一下。（说不准，就点那个牌子。）'}), draw,
      [ {bbox:()=>({x:fx,y:fy,w:72,h:128}), hiCol:HG, fb:fog},
        {bbox:()=>({x:rx-18,y:ry,w:36,h:150}), hiCol:HB, fb:fog},
        {bbox:()=>pillBB(tx,ty,tlab), ok:true, hiCol:HU} ], win); }
  function win(){ E.sceneStop(); E.setDots(1); E.tickQ(1); E.award(45); E.status(t({en:keq('field  ?  rope'),zh:keq('田  ?  绳')}));
    E.tell(t({en:'Right — no answer yet, so the <b class="p">wraith</b> feeds. Pin one <b class="r">rod</b> to fix it.',zh:'对，眼下没答案，<b class="p">幽灵</b>有得吃。钉一把量尺来解决。'}));
    E.clearTray(); E.addBtn(t({en:'Pin the rod ▶',zh:'去钉量尺 ▶'}),'primary',E.advance); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
  q1();
}

/* ===== Round 2 — Pin the Rod: DRAG the rod onto the land to set the unit, then TAP the bigger shape ===== */
function round2(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(1); E.sceneStop();
  E.setPlace(t({en:'Pin the Rod',zh:'钉下量尺'})); E.status(''); WST='loom'; wmood='idle';
  // field is a VERTICAL rectangle (up>across); its grass still beats the debt-rope. Re-roll so Replay never repeats the last numbers.
  const [D2,sig2]=reroll(()=>{ const a=rnd(2,3), u=a+rnd(1,2); return {across:a, up:u, c:rnd(2,Math.min(5,a*u-1))}; },
    v=>v.across+'x'+v.up+','+v.c, L2); L2=sig2;
  const across=D2.across, up=D2.up, area=across*up; let c=D2.c;
  const u=36, FX=()=>E.LW*0.16, FY=()=>E.LH*0.13, RX=()=>E.LW*0.62, RY=()=>E.LH*0.08, PINX=()=>E.LW*0.44;
  let pinned=false;
  // generous DETECTION radius (r) so the drop is forgiving; the on-screen ring + socket sit tidily at the pin spot.
  const rodA={ kind:'drag', home:{x:E.LW*0.46, y:E.LH*0.60}, snap:[{x:PINX(), y:FY(), r:96, ring:26, ok:true}] };
  rodA.bbox=a=>({x:a.pos.x-30, y:a.pos.y-26, w:60, h:u+52});   // fat-thumb grab area
  function paint(){ bg(); field(FX(),FY(),across*u,up*u, pinned?u:0,'field'); rope(RX(),RY(),c*u, pinned?u:0,'rope');
    if(pinned){ rod(PINX(),FY(),u); return; }
    socket(PINX(),FY(),u, rodA.grab && !!rodA.near);           // show the destination; brighten when the rod is in range
    if(rodA.grab){ const ctx=E.ctx; ctx.save(); const g=ctx.createRadialGradient(rodA.pos.x,rodA.pos.y+u/2,2,rodA.pos.x,rodA.pos.y+u/2,30); g.addColorStop(0,'rgba(242,96,76,.34)'); g.addColorStop(1,'rgba(242,96,76,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(rodA.pos.x,rodA.pos.y+u/2,30,0,7); ctx.fill(); ctx.restore(); }
    rod(rodA.pos.x, rodA.pos.y, u); }
  E.tell(t({en:'<b>Pin the Rod.</b> Drag the red rod onto the land (or just tap it) to fix what “1” means, then read the <b style="color:#7fe0a0">field</b> by its sides and the <b style="color:#7fb6ff">rope</b> by the same rod.',
    zh:'<b>钉下量尺。</b>把红色量尺拖到地上（或直接点一下），定下「1」是多少，再按边读<b>田</b>、按尺读<b>绳</b>。'}));
  E.clearTray(); E.addBtn(t({en:'◀ Prev step',zh:'◀ 上一步'}),'ghost',E.prevStep);
  E.scene({ actors:[rodA], draw:paint, onDrop(a,z,info){ if(z||(info&&info.tapped)) cast(); } });   // drag onto the land OR tap the rod → pin (tap fallback for phones); dropped elsewhere → springs home
  function cast(){ pinned=true; E.sceneStop(); E.busy=true; E.sfx('bracket');
    E.anim(700,p=>{ paint(); for(let i=0;i<5;i++) star(E.ctx,FX()+rnd(4,across*u-4),FY()+rnd(4,up*u-4),5*(0.5+0.5*Math.sin(p*9+i)),'rgba(255,243,207,.85)'); }, ()=>{ E.busy=false; decide(); }); }
  function decide(){ wmood='idle';
    pickScene(t({en:'<b style="color:#7fe0a0">Field</b> '+across+'×'+up+', <b style="color:#7fb6ff">rope</b> '+c+'. Tap the bigger one.',zh:'<b>田</b> '+across+'×'+up+'，<b>绳</b> '+c+'。点一下更大的那个。'}), paint,
      [ {bbox:()=>({x:FX(),y:FY(),w:across*u,h:up*u}), ok:true, hiCol:HG},
        {bbox:()=>({x:RX()-18,y:RY(),w:36,h:c*u}), hiCol:HB, fb:{en:'A '+across+'×'+up+' field holds more than a rope '+c+'.',zh:'宽'+across+'高'+up+'的田，比长'+c+'的绳多。'}} ], win); }
  function win(){ E.sceneStop(); WST='recoil'; pinned=true; paint(); const ctx=E.ctx; for(let r=0;r<up;r++)for(let cc=0;cc<across;cc++) calf(ctx,FX()+cc*u+u/2,FY()+r*u+u/2,10);
    E.setDots(2); E.tickQ(2); E.award(50); E.cheer(); E.sfx('win'); E.status(t({en:keq('field  >  rope'),zh:keq('田  >  绳')}));
    E.tell(t({en:'<b class="g">Field</b> wins — the grass covers the debt, the <b class="p">wraith</b> starves and the <b class="y">herd</b> grazes.',zh:'<b class="g">田</b>更大，草抵了债，<b class="p">幽灵</b>饿瘪，<b class="y">牛群</b>吃上草了。'}));
    E.clearTray(); E.addBtn(t({en:"On to the Wraith's trick ▶",zh:'迎战幽灵的诡计 ▶'}),'primary',E.advance); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
}

/* ===== Round 3 — The Wraith's Trick: swap the rod and the winner flips; TAP the winner under each rod ===== */
function round3(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(2); E.sceneStop();
  E.setPlace(t({en:"The Wraith's Trick",zh:'幽灵的诡计'})); E.status(''); WST='loom';
  /* same LAND, two rods. field is a RECTANGLE (p across, q up). At the BIG rod the counts are (p,q,r) and the rope wins (r>p*q);
     at the SMALL rod (k× finer) every count scales by k, so the field's area overtakes (k*p*q>r). The flip is guaranteed by p*q < r < k*p*q. */
  let p,q,r,k,P,Q,R,u2,u1;
  for(let tries=0;;tries++){
    p=1; q=rnd(2,4); const a0=p*q; k=rnd(2,3);   // p=1 keeps the field a THIN VERTICAL strip (q up > p across) — a Riemann rectangle in miniature
    const lo=a0+1, hi=k*a0-1;
    if(hi>=lo){ r=rnd(lo,hi); P=p*k; Q=q*k; R=r*k; u2=Math.min(32,Math.floor(190/P),Math.floor(190/Q),Math.floor(196/R));
      const sig=p+'x'+q+','+r; if(u2>=18&&R<=10&&(sig!==L3||tries>40)){ L3=sig; u1=u2*k; break; } }   // re-roll so Replay never repeats the last visible numbers
    if(tries>60){ p=1; q=2; r=3; k=3; P=3; Q=6; R=9; u2=20; u1=60; L3='1x2,3'; break; }   // safe fallback (portrait, fits)
  }
  const FW=P*u2, FH=Q*u2, RL=R*u2;
  const FX=()=>E.LW*0.16, FY=()=>E.LH*0.13, RX=()=>E.LW*0.64, RY=()=>E.LH*0.07;
  const drawAt=u=>()=>{ bg(); field(FX(),FY(),FW,FH,u,'field'); rope(RX(),RY(),RL,u,'rope'); rod(E.LW*0.45,FY(),u); };
  const fieldBB=()=>({x:FX(),y:FY(),w:FW,h:FH}), ropeBB=()=>({x:RX()-18,y:RY(),w:36,h:RL});
  function q1(){ wmood='idle';
    pickScene(t({en:"<b>The Wraith's Trick — big rod.</b> <b style=\"color:#7fe0a0\">Field</b> "+p+"×"+q+", <b style=\"color:#7fb6ff\">rope</b> "+r+". Tap the winner.",zh:'<b>幽灵的诡计 — 大尺。</b><b>田</b> '+p+'×'+q+'，<b>绳</b> '+r+'。点一下谁赢。'}), drawAt(u1),
      [ {bbox:fieldBB, hiCol:HG, fb:{en:'Big rod: field is only '+p+'×'+q+', rope is '+r+'. Rope wins.',zh:'大尺下，田只有 '+p+'×'+q+'，绳是 '+r+'。绳赢。'}},
        {bbox:ropeBB, ok:true, hiCol:HB} ], q2); }
  function q2(){ wmood='idle';
    pickScene(t({en:'<b>Small rod — same land.</b> Now <b style="color:#7fe0a0">field</b> '+P+'×'+Q+', <b style="color:#7fb6ff">rope</b> '+R+'. Tap the winner.',zh:'<b>小尺 — 同一片地。</b>现在<b>田</b> '+P+'×'+Q+'，<b>绳</b> '+R+'。点一下谁赢。'}), drawAt(u2),
      [ {bbox:fieldBB, ok:true, hiCol:HG},
        {bbox:ropeBB, hiCol:HB, fb:{en:'Both sides grew: field is '+P+'×'+Q+', rope only '+R+'. Field wins.',zh:'两条边都变长：田 '+P+'×'+Q+'，绳只有 '+R+'。田赢。'}} ], win); }
  function win(){ E.sceneStop(); WST='gone'; drawAt(u2)(); E.setDots(3); E.tickQ(3); E.award(60); E.cheer(); E.sfx('win'); E.status(t({en:keq('change the rod → the winner flips'),zh:keq('换把尺 → 赢家就变了')}));
    E.tell(t({en:'Same land, opposite winner — only the <b class="r">rod</b> changed. The <b class="r">rod</b> you pick decides it, so pin ONE and the <b class="p">wraith</b> is driven off. (This is how we will later measure the area under a curve.)',zh:'同一片地，赢家却相反，只换了尺。你选哪把尺，哪把尺定答案，所以钉死一把，<b class="p">幽灵</b>就被赶走。（以后量曲线下的面积，就靠这一招。）'}));
    E.clearTray(); E.addBtn(t({en:'Claim the Codex page 📖',zh:'领取典籍书页 📖'}),'primary',()=>E.openBook(QUEST.book)); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
  q1();
}

const QUEST = {
  id:'q04', page:4, region:'cradle', bgm:'audio/bgm-cradle.mp3?v=20260606k2',
  kicker:{en:'The Cradle',zh:'摇篮'},
  title:{en:'Area vs Length',zh:'面积与长度'},
  meta:{ title:{en:'Win the Land Back',zh:'夺回土地'}, giver:{en:'Tau the Calf · The Cradle',zh:'小牛 Tau · 摇篮'},
    flavor:{en:'"A <b class="p">Fogwraith</b> has crept onto our land, friend, one of the Unravelling\'s little servants. It unmade our measure, so now no one can say which is bigger, my <b class="g">field</b> of grass (an AREA) or the <b class="p">wraith</b>\'s debt-<b class="b">rope</b> (a LENGTH), and a question with no answer is just what the <b class="p">wraith</b> feeds on while my <b class="y">herd</b> starves. <b class="y">Tau</b> says: pin down ONE measuring <b class="r">rod</b>, fix what \'1\' means, and the answer turns plain again, the <b class="p">wraith</b> goes hungry, and the Fog behind it loses its grip on this patch. Beware, it will swap the <b class="r">rod</b> to keep us guessing. Help me drive it off and win the <b class="y">herd</b>\'s land back!"',
      zh:'"有个<b class="p">迷雾幽灵</b>爬上了我们的地，朋友，是「大解体」的一个小喽啰。它把我们的尺度抹掉了，如今谁也说不清哪个更大，我那块<b class="g">草田</b>（一片面积），还是<b class="p">幽灵</b>的债绳（一条长度），而一个没有答案的问题，正好喂饱<b class="p">幽灵</b>，我的<b class="y">牛群</b>却在挨饿。<b class="y">Tau</b> 说：钉死一把量尺，定下「1」是多少，答案就又清楚了，<b class="p">幽灵</b>饿瘪，它背后的迷雾也就抓不住这片地了。当心，它会偷换量尺让我们一直猜。帮我把它赶走，夺回<b class="y">牛群</b>的土地！"'} },
  objs:[ {en:'The Quarrel: field vs rope has no answer',zh:'争执之地：田与绳分不出大小'},
         {en:'Pin the Rod: read each by its sides',zh:'钉下量尺：按边来量'},
         {en:"The Wraith's Trick: pin ONE rod, don't be fooled",zh:'幽灵的诡计：钉死一把尺，别被骗'} ],
  rounds:[round1,round2,round3],
  book:{ page:4, kicker:{en:'Introduction',zh:'入门之'}, title:{en:'Comparing Area and Length',zh:'面积和长度的比较'},
    blocks:[
      {top:true, fig:'acmp', prose:{en:'An area fills two directions; a length fills only one. They are different kinds, so asking which is bigger, the square <b class="gr">x</b> or the line <b class="b">y</b>, has no answer. (Two areas you can compare, two lengths you can compare, just not one against the other.)',
        zh:'面积铺满两个方向，长度只占一个方向。它们不是同一类，所以问正方形 <b class="gr">x</b> 和线段 <b class="b">y</b> 哪个更大，是没有答案的。（两块面积能比，两条长度能比，唯独一块面积对一条长度没法比。）'}},
      {law:{en:'Define 1 as a length',zh:'把 1 定成一段长度'}, eq:'<span class="gr">x</span> = <span class="r">1</span>×<span class="r">1</span> = <span class="b">y</span>', fig:'aunit', prose:{en:'...unless you first pick a unit. Choose one length and call it <b class="r">1</b>. Now each shape becomes a plain number: the line <b class="b">y</b> is <b class="r">1</b> stick, and the square <b class="gr">x</b> is <b class="r">1</b> stick by <b class="r">1</b> stick, so <b class="gr">x</b> = <b class="r">1</b>×<b class="r">1</b> = <b class="b">y</b>. With no <b class="r">1</b> fixed, there is nothing to compare.',
        zh:'……除非你先选一个单位。挑一段长度，把它叫作 <b class="r">1</b>。这样每个图形就都变成普通的数：线段 <b class="b">y</b> 是 <b class="r">1</b> 根棍，正方形 <b class="gr">x</b> 是 <b class="r">1</b> 根棍乘 <b class="r">1</b> 根棍，所以 <b class="gr">x</b> = <b class="r">1</b>×<b class="r">1</b> = <b class="b">y</b>。没定下 <b class="r">1</b>，就无从比起。'}},
      {law:{en:'Looks can deceive',zh:'眼见不一定为实'}, fig:'aflip', prose:{en:'Now the surprise. On the left the line <b class="b">y</b> looks small beside the square <b class="gr">x</b>; on the right it looks big. Yet in each panel the unit <b class="r">1</b> is chosen so that <b class="gr">x</b> = <b class="b">y</b>. How an area and a length look against each other tells you nothing, the unit alone decides.',
        zh:'现在是出人意料的地方。左边，线段 <b class="b">y</b> 挨着正方形 <b class="gr">x</b> 显得很小；右边却显得很大。可两幅图里，单位 <b class="r">1</b> 都是特意选的，使得 <b class="gr">x</b> = <b class="b">y</b>。面积和长度摆在一起谁大谁小，根本说明不了什么，定大小的只有那个单位。'}},
      {note:{en:'<b>On the path ahead</b> we compare areas with lengths again and again, all the way to the area under a curve. So get used to it now: two things can look completely different and still be the same, once the unit is set.',
        zh:'<b>往后的路上</b>，我们会一次又一次拿面积和长度作比较，一直比到曲线下的面积。所以现在就习惯起来：一旦定好了单位，两样东西看上去天差地别，却可能是相等的。'}}
    ],
    read:{en:'An area and a length are different kinds, so on their own neither is bigger. Fix a unit length, call it 1, and each becomes a plain number you can compare. Two shapes that look nothing alike can then come out equal, and change the unit and the answer changes. We compare areas and lengths often ahead, so get used to seeing things that look different yet are the same.',
      zh:'面积和长度不是同一类，单看谁也不比谁大。定下一段单位长度，叫它 1，两者就都变成可以比较的普通数。看上去毫不相像的两个图形，这时可能正好相等；而换一个单位，答案又会变。往后我们常常要拿面积和长度作比较，所以要习惯：看着不一样，其实是一样的。'} },
  intro:(E)=>{ bg(); const LW=E.LW; field(LW*0.16,E.LH*0.26,76,58,0,'field'); rope(LW*0.64,E.LH*0.16,120,0,'rope'); }
};
window.QUEST_q04 = QUEST;
})();
