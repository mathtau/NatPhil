/* ORIGO · Quest 1 = MathO book p6 (THE book, made playable) · Joining Steps · Addition. Layer 3 content. */
(function(){
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const keq=(expr)=>'<span class="keq">'+expr+' <span class="tk">✓</span></span>';   // the page's key equation, shown big
const t=s=>E.t(s);
const HU='rgba(244,200,48,.95)';   // gold highlight for tappable tokens
const SPANH=18;
let LR2='', LR3='';   // last draw for rounds 2 & 3, so Replay never repeats the previous numbers
/* a draggable plank-SPAN of value v, drawn v units long AND in the SAME per-value colour as a placed plank
   (FIG.C.plank: 1=blue, 2=green, 3=gold…) so it looks identical before and after it lands. Shared by every round. */
function drawSpan(v, x, y, w, grab){ const ctx=E.ctx; ctx.save();
  if(grab){ ctx.shadowColor='rgba(0,0,0,.5)'; ctx.shadowBlur=11; ctx.shadowOffsetY=4; }
  ctx.fillStyle=(FIG.C&&FIG.C.plank&&FIG.C.plank[v])||'#f4c830'; ctx.beginPath();
  if(ctx.roundRect) ctx.roundRect(x,y-SPANH/2,w,SPANH,5); else ctx.rect(x,y-SPANH/2,w,SPANH);
  ctx.fill(); ctx.shadowColor='transparent'; ctx.lineWidth=2; ctx.strokeStyle='rgba(0,0,0,.32)'; ctx.stroke();
  ctx.fillStyle='rgba(0,0,0,.62)'; ctx.font='bold 13px "IBM Plex Mono",monospace'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(''+v, x+w/2, y); ctx.restore(); }
/* a draggable SUPPORT brace, drawn as the SAME gold bracket+label that appears once it lands on a bridge
   (a faint backing makes the line-bracket easy to grab). For round 3's associativity. */
function drawBrace(label, x, y, w, grab){ const ctx=E.ctx; ctx.save();
  ctx.fillStyle=grab?'rgba(176,112,240,.22)':'rgba(176,112,240,.13)'; ctx.beginPath();
  if(ctx.roundRect) ctx.roundRect(x,y-10,w,28,5); else ctx.rect(x,y-10,w,28); ctx.fill();
  ctx.strokeStyle=FIG.C.purple; ctx.lineWidth=3; ctx.lineCap='round';   // PURPLE support, distinct from the gold/green/blue number-planks; identical to the placed one
  ctx.beginPath(); ctx.moveTo(x+3,y-7); ctx.lineTo(x+3,y); ctx.lineTo(x+w-3,y); ctx.lineTo(x+w-3,y-7); ctx.stroke();
  ctx.fillStyle=FIG.C.purple; ctx.font='italic 12px Georgia'; ctx.textAlign='center'; ctx.textBaseline='alphabetic'; ctx.fillText(label, x+w/2, y+14); ctx.restore(); }
/* soft highlight for a WIDE region (a lane band): a gentle pulsing fill + a bright left accent — not edge-lines. rgb = "r,g,b". */
function laneHi(bb, rgb){ const ctx=E.ctx, tt=performance.now()/1000, al=(0.15+0.07*Math.sin(tt*4)).toFixed(3); ctx.save();
  ctx.fillStyle='rgba('+rgb+','+al+')'; ctx.fillRect(bb.x,bb.y,bb.w,bb.h);
  ctx.fillStyle='rgba('+rgb+',0.92)'; ctx.fillRect(bb.x,bb.y,5,bb.h); ctx.restore(); }

/* ---- single-lane bridge scene (round 1), composed from FIG ---- */
function bridge(gapEnd, maxx, fromV, planks, bull){
  E.setRange(maxx); const ctx=E.ctx, PX=E.PX, baseY=E.baseY, botY=E.botY;
  E.clear();
  FIG.terrain(ctx, 0, PX(0), PX(gapEnd), E.LW, baseY, botY);
  FIG.fog(ctx, PX(0), PX(gapEnd), baseY+6, botY, performance.now());
  for(let i=1;i<gapEnd;i++) FIG.post(ctx, PX(i), baseY, botY);
  FIG.flag(ctx, PX(gapEnd), baseY, 78);
  if(!E.fed) FIG.grass(ctx, PX(gapEnd+E.GRASSOFF), baseY-2, 22);
  FIG.plankRow(ctx, PX, fromV, planks, baseY);
  FIG.numberLine(ctx, PX, maxx, baseY);
  const b = bull || {xv:0,dy:-2};
  FIG.bull(ctx, PX(b.xv), baseY-18+(b.dy||0), 52, {mood:document.getElementById('companion').dataset.mood});
}

/* ---- shared TWO-LANE scene (rounds 2 & 3): both orders side by side ---- */
function drawLanes(T, maxx, lanes){ E.setRange(maxx); const ctx=E.ctx, PX=E.PX, LW=E.LW; E.clear();
  lanes.forEach((L,idx)=>{
    FIG.terrain(ctx,0,PX(0),PX(T),LW,L.y,L.bot);
    FIG.fog(ctx,PX(0),PX(T),L.y+6,L.bot,performance.now()+idx*600);
    (L.posts||[]).forEach(px=>FIG.post(ctx,PX(px),L.y,L.bot));
    if(L.gap!=null){ ctx.save(); ctx.setLineDash([4,4]); ctx.strokeStyle='rgba(255,106,77,.85)'; ctx.lineWidth=2;   // missing-post gap cue
      ctx.beginPath(); ctx.moveTo(PX(L.gap),L.y+5); ctx.lineTo(PX(L.gap),L.bot); ctx.stroke(); ctx.restore(); }
    FIG.flag(ctx,PX(T),L.y,46);
    if(!L.fed) FIG.grass(ctx,PX(T+0.5),L.y-2,17);
    FIG.plankRow(ctx,PX,0,L.planks,L.y);
    if(L.bracket){ const k=L.bracket, y=L.y+16, mx=(PX(k.a)+PX(k.c))/2;
      ctx.strokeStyle=FIG.C.purple; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(mx,L.y+5); ctx.lineTo(mx,L.bot); ctx.stroke();   // support strut (purple, distinct from the number-planks)
      ctx.strokeStyle=FIG.C.purple; ctx.lineWidth=3; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(PX(k.a)+3,y-7); ctx.lineTo(PX(k.a)+3,y); ctx.lineTo(PX(k.c)-3,y); ctx.lineTo(PX(k.c)-3,y-7); ctx.stroke();
      ctx.fillStyle=FIG.C.purple; ctx.font='italic 12px Georgia'; ctx.textAlign='center'; ctx.fillText(k.label,mx,y+14); }
    if(L.label){ ctx.fillStyle=FIG.C.text; ctx.font='13px "IBM Plex Mono",monospace'; ctx.textAlign='center'; ctx.textBaseline='alphabetic'; ctx.fillText(L.label,LW*0.55,L.y-22); }   // centered over the lane, clear of the calf (left) and flag (right)
    const bb=L.bull||{xv:0,dy:-2};
    FIG.bull(ctx,PX(bb.xv),L.y-15+(bb.dy||0),40,{mood:(bb.dy>20)?'sad':(L.fed?'happy':'open')});   // waiting=open/alert, fed=happy, falling=sad — its OWN eyes, not the avatar's
  });
}

/* ===== Round 1 — The Cracked Causeway (addition) — DRAG spans 1/2/3 onto the bridge; drag a placed plank OFF to remove it ===== */
function round1(E){ E.setSpeaker('tau'); E.mood('idle'); E.fed=false; E.setDots(0); E.sceneStop();
  const G=rnd(4,7); let planks=[]; const sum=()=>planks.reduce((a,b)=>a+b,0); const maxx=G+1;
  E.setRange(maxx);
  const draw=b=>bridge(G,maxx,0,planks,b);                 // crossing animation (planks via FIG.plankRow)
  const u=()=>E.PX(1)-E.PX(0), VALS=[1,2,3];               // a span of value v is v units long, so it LOOKS like length v
  const trayX=()=>E.PX(0)+4, trayY=v=>46+(v-1)*30;         // three source spans stacked top-left, proportional in length
  const spans=VALS.map(v=>({ id:'t'+v, kind:'drag', tray:true, v:v, home:{x:trayX(), y:trayY(v)},
    bbox:a=>({x:a.pos.x-4, y:a.pos.y-SPANH/2-4, w:a.v*u()+8, h:SPANH+8}) }));
  let pacts=[];                                            // draggable actors for the PLACED planks (rebuilt on every change)
  function buildPlaced(){ let acc=0; pacts=planks.map((v,i)=>{ const sx=E.PX(acc); acc+=v;
    return { id:'p'+i, kind:'drag', idx:i, v:v, home:{x:sx, y:E.baseY-4}, bbox:a=>({x:a.pos.x, y:a.pos.y-SPANH/2-5, w:v*u(), h:SPANH+10}) }; }); return pacts; }
  function sceneDraw(){ bridge(G,maxx,0,[],null);          // bridge WITHOUT planks (the placed planks are drawn as draggable actors below)
    const drg=spans.find(s=>s.grab);                       // adding: show the landing slot (green=fits, red=too long, but you can still drop it)
    if(drg){ const c=E.ctx, x0=E.PX(sum()), x1=E.PX(Math.min(sum()+drg.v,G)), fits=sum()+drg.v<=G;
      c.save(); c.globalAlpha=.7; c.setLineDash([5,5]); c.lineWidth=2.6; c.strokeStyle=fits?'rgba(80,216,144,.95)':'rgba(232,64,46,.95)';
      c.strokeRect(x0, E.baseY-13, Math.max(x1-x0,6), 18); c.restore(); }
    pacts.forEach(p=> drawSpan(p.v, p.pos.x, p.pos.y, p.v*u(), !!p.grab));
    const rem=pacts.find(p=>p.grab && p.pos.y<E.baseY-40); // a placed plank lifted off → it'll be removed on release
    if(rem){ const c=E.ctx; c.save(); c.fillStyle='rgba(232,64,46,.95)'; c.font='bold 12px "IBM Plex Mono",monospace'; c.textAlign='center'; c.fillText(t({en:'release to remove',zh:'松手移除'}), rem.pos.x+rem.v*u()/2, rem.pos.y-15); c.restore(); }
    spans.forEach(s=> drawSpan(s.v, s.pos.x, s.pos.y, s.v*u(), !!s.grab)); }
  E.setPlace(t({en:'The Cracked Causeway',zh:'裂隙石道'}));
  function refreshTray(){ E.status(t({en:'bridge: ',zh:'桥长：'})+'<b>'+sum()+'</b> / '+G); E.clearTray();
    const ub=E.addBtn('↺','ghost',()=>{ if(!planks.length||E.busy)return; planks.pop(); E.sfx('place'); rescene(); }); ub.disabled=!planks.length;
    E.addBtn(t({en:'Send me! ▶',zh:'出发！▶'}),'primary',send); }
  function onDrop(a,z,info){ if(E.busy)return;
    if(a.tray){ if(info && info.y > E.baseY-70){ planks.push(a.v); E.sfx('place'); E.pop('+'+a.v); rescene(); } }   // add (overshoot allowed)
    else { if(info && !info.tapped && info.y < E.baseY-40){ planks.splice(a.idx,1); E.sfx('fail'); E.pop('−'+a.v); }  // lifted off the bridge → remove it
      rescene(); } }
  function rescene(){ buildPlaced(); E.scene({ actors:spans.concat(pacts), draw:sceneDraw, onDrop:onDrop }); refreshTray(); }
  function send(){ if(E.busy)return; E.sceneStop();
    E.runCross({ target:G, reach:sum(), draw, retry:round1.bind(null,E),
      msgs:{ short:{en:'Too <b class="r">short</b>, I run off into the Fog!',zh:'太<b class="r">短</b>，我掉进迷雾了！'},
             long:{en:'Too <b class="r">long</b>, the <b class="g">grass gets buried</b>! Trim it.',zh:'太<b class="r">长</b>，<b class="g">青草被埋住了</b>！收短点。'} },
      onWin:()=>{ E.setDots(1); E.tickQ(1); E.award(40);
        E.status(keq(planks.join(' + ')+' = '+G)); E.tell(t({en:'Yum, the little <b class="y">calf</b> is fed!',zh:'好香，小<b class="y">牛犊</b>吃饱饱！'}));
        E.clearTray(); E.addBtn(t({en:'On to the next crossing ▶',zh:'前往下一处 ▶'}),'primary',E.advance);
        E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); } }); }
  E.tell(t({en:'<b>The Cracked Causeway.</b> A Fogwraith minion cracked the stones. <b>Drag a span</b> (1, 2 or 3) onto the bridge to add it, or <b>drag a placed plank off</b> the bridge to remove it. Reach the <b class="g">grass</b> at <b class="g">'+G+'</b>: too short I fall, too long the grass gets buried!',
    zh:'<b>裂隙石道。</b>一个迷雾幽灵的喽啰把石板砸碎了。<b>把跨度</b>（1、2 或 3）拖到桥上接长，或<b>把已放的木板拖离</b>桥面来移除。搭到 <b class="g">'+G+'</b> 处的<b class="g">青草</b>：太短我会掉下去，太长就会埋住青草！'}));
  rescene();
}

/* both bulls cross at one fixed speed. Per lane mode: 'exact' = cross & feed, 'short' = run to reach then FALL,
   'long' = run to the flag and stop (grass buried, but NO fall). Only too-SHORT falls. Win iff both 'exact'. */
function crossTwo(T, top, bot, tReach, tMode, bReach, bMode, show, onWin, onFail){
  E.busy=true; E.clearTray();
  const per=340, fallDur=640;
  const tStop=tMode==='short'?tReach:T, bStop=bMode==='short'?bReach:T, tFall=tMode==='short', bFall=bMode==='short';
  const tHit=tStop*per, bHit=bStop*per, both=tMode==='exact'&&bMode==='exact';
  const endT=Math.max(tHit,bHit)+((tFall||bFall)?fallDur:0);
  const lane=(stop,fall,hit,now)=> now<hit ? {xv:now/per,dy:-2} : (fall?{xv:stop,dy:Math.min(1,(now-hit)/fallDur)*150}:{xv:stop,dy:-2});
  E.anim(Math.max(1,endT), p=>{ const now=p*endT; show(lane(tStop,tFall,tHit,now), lane(bStop,bFall,bHit,now)); }, ()=>{
    if(both){ E.anim(560,p=>{ top.fed=bot.fed=p>.6; show({xv:T+0.5*p,dy:-2},{xv:T+0.5*p,dy:-2}); },
        ()=>{ top.fed=bot.fed=true; show({xv:T+0.5,dy:-2},{xv:T+0.5,dy:-2}); E.cheer(); E.pop('nom!'); E.sfx('win'); E.busy=false; onWin(); }); }
    else { E.oops(); E.sfx('fail'); if(E.loseHeart()){ E.busy=false; onFail(); } }   // a missed crossing costs a heart; on game over the engine restarts the quest
  });
}

/* ===== Round 2 — The Twin Spans (commutativity, both orders side by side) ===== */
function round2(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(1); E.sceneStop();
  let a,b; do{ a=rnd(2,5); b=rnd(2,5); }while(a===b || a+'_'+b===LR2); LR2=a+'_'+b; const T=a+b, maxx=T+1;   // fresh each play (totals 5–9), never repeat the last
  const posts=[]; for(let i=1;i<T;i++) posts.push(i);
  const top={fill:null,fed:false}, bot={fill:null,fed:false}; let pick=null;
  const sumT=()=>a+(top.fill||0), sumB=()=>b+(bot.fill||0);
  const pT=()=>top.fill!=null?[a,top.fill]:[a], pB=()=>bot.fill!=null?[b,bot.fill]:[b];
  E.setPlace(t({en:'The Twin Spans',zh:'双生桥'}));

  const u=()=>E.PX(1)-E.PX(0);
  const TOPBAND=[82,162], BOTBAND=[196,E.LH];   // y-bands: which lane a span was dropped on
  function show(bt,bb){ drawLanes(T,maxx,[
    {y:94,bot:150, planks:pT(), posts, fed:top.fed, bull:bt, label:(top.fill!=null? a+' + '+top.fill+' = '+sumT() : a+' + ?')},
    {y:208,bot:262, planks:pB(), posts, fed:bot.fed, bull:bb, label:(bot.fill!=null? b+' + '+bot.fill+' = '+sumB() : b+' + ?')} ]);
  }
  const laneOf=y=> (y>=TOPBAND[0]&&y<=TOPBAND[1])?'top' : (y>=BOTBAND[0]&&y<=BOTBAND[1])?'bot' : null;

  // two draggable addend SPANS (lengths a and b), parked top-right of the lane's calf so they don't overlap it; drag the one that completes each bridge to T
  const spans=[ {v:a}, {v:b} ].map((s,i)=>({ id:i, v:s.v, kind:'drag', home:{x:E.PX(0)+62, y:22+i*34},
    bbox:o=>({x:o.pos.x-4, y:o.pos.y-SPANH/2-4, w:o.v*u()+8, h:SPANH+8}) }));

  function sceneDraw(){ show(null,null);
    const drg=spans.find(s=>s.grab);
    if(drg){ const ln=laneOf(drg.pos.y);
      if(ln){ const preset=ln==='top'?a:b, ly=ln==='top'?90:204, fits=(preset+drg.v===T);
        laneHi(ln==='top'?{x:0,y:94,w:E.LW,h:56}:{x:0,y:208,w:E.LW,h:54}, ln==='top'?'80,216,144':'96,150,255');
        const ctx=E.ctx, x0=E.PX(preset), x1=E.PX(preset+drg.v);
        ctx.save(); ctx.globalAlpha=.7; ctx.setLineDash([5,5]); ctx.lineWidth=2.4; ctx.strokeStyle=fits?'rgba(80,216,144,.95)':'rgba(232,64,46,.95)'; ctx.strokeRect(x0,ly-9,Math.max(x1-x0,6),18); ctx.restore(); } }
    spans.forEach(s=> drawSpan(s.v, s.pos.x, s.pos.y, s.v*u(), !!s.grab)); }

  function refreshTray(){ E.status(t({en:'drag each span onto a bridge to reach ',zh:'把每段拖到桥上，凑到 '})+'<b>'+T+'</b>'); E.clearTray();
    const ub=E.addBtn('↺','ghost',()=>{ if(E.busy)return; top.fill=null; bot.fill=null; E.sfx('place'); refreshTray(); }); ub.disabled=(top.fill==null&&bot.fill==null);
    if(top.fill!=null && bot.fill!=null) E.addBtn(t({en:'Send both ▶',zh:'一起出发 ▶'}),'primary',sendBoth); }

  function sendBoth(){ if(E.busy)return; E.sceneStop(); const ts=sumT(), bs=sumB();
    const tM=ts===T?'exact':ts<T?'short':'long', bM=bs===T?'exact':bs<T?'short':'long';
    crossTwo(T, top, bot, ts, tM, bs, bM, show, win, ()=>{
      E.tell(t({en:'Each bridge must reach exactly <b>'+T+'</b>: top needs <b>'+b+'</b>, bottom needs <b>'+a+'</b>.',zh:'每座桥都要正好到 <b>'+T+'</b>：上桥需要 <b>'+b+'</b>，下桥需要 <b>'+a+'</b>。'}));
      E.afterSpeech(()=>{ top.fill=null; bot.fill=null; startScene(); }); });
  }
  function win(){ E.setDots(2); E.tickQ(2); E.award(40);
    E.status(keq(a+' + '+b+' = '+b+' + '+a+' = '+T));
    E.tell(t({en:'Top is <b class="g">'+a+' + '+b+'</b>, bottom is <b class="y">'+b+' + '+a+'</b>: same length! That\'s <b>commuting</b>.',
      zh:'上桥 <b class="g">'+a+' + '+b+'</b>，下桥 <b class="y">'+b+' + '+a+'</b>：长度相同！这就是<b>交换律</b>。'}));
    E.clearTray(); E.addBtn(t({en:'On to the Pillar Pass ▶',zh:'前往立柱关 ▶'}),'primary',E.advance);
    E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep);
  }
  function startScene(){ E.scene({ actors:spans, draw:sceneDraw, onDrop:(ac,z,info)=>{ if(E.busy)return; const ln=info?laneOf(info.y):null; if(!ln) return;
      const L=ln==='top'?top:bot; L.fill=ac.v; E.sfx('place'); E.pop('+'+ac.v); refreshTray(); } });   // drop ANY span on either bridge (you can pick wrong); Send both judges → a bridge that misses T falls into the Fog
    refreshTray(); }
  E.tell(t({en:'<b>The Twin Spans.</b> Top already holds <b class="g">'+a+'</b>, bottom holds <b class="y">'+b+'</b>. <b>Drag</b> the right span onto each bridge so <b>both</b> reach <b>'+T+'</b> — you\'ll see <b class="g">'+a+'+'+b+'</b> = <b class="y">'+b+'+'+a+'</b>.',
    zh:'<b>双生桥。</b>上桥已有 <b class="g">'+a+'</b>，下桥已有 <b class="y">'+b+'</b>。把对的那段<b>拖</b>到每座桥上，让<b>两座桥</b>都到 <b>'+T+'</b>，可见 <b class="g">'+a+'+'+b+'</b> = <b class="y">'+b+'+'+a+'</b>。'}));
  startScene();
}

/* ===== Round 3 — The Pillar Pass (associativity via a SUPPORT over a missing post, side by side) ===== */
function round3(E){ E.setSpeaker('tau'); E.mood('idle'); E.fed=false; E.setDots(2); E.sceneStop();
  let a,b,c; do{ a=rnd(1,3); b=rnd(1,3); c=rnd(1,3); }while(a+b+c<5||a+b+c>8||a===c||a+'_'+b+'_'+c===LR3); LR3=a+'_'+b+'_'+c; const T=a+b+c, maxx=T+1;   // fresh each play, never repeat the last
  const s1=a, s2=a+b;   // the two seams: between a|b, and b|c
  const top={post:s1, miss:s2, need:'right', grp:null, fed:false};   // post under s1; gap at s2 → support (b+c)
  const bot={post:s2, miss:s1, need:'left',  grp:null, fed:false};   // post under s2; gap at s1 → support (a+b)
  const brk=L=> L.grp==='left'?{a:0,c:a+b,label:'('+a+'+'+b+')'} : L.grp==='right'?{a:a,c:T,label:'('+b+'+'+c+')'} : null;
  const grpEq=L=> L.grp==='left'?'('+a+'+'+b+')+'+c : a+'+('+b+'+'+c+')';
  const covered=L=> L.grp===L.need;
  E.setPlace(t({en:'The Pillar Pass',zh:'立柱关'})); E.setRange(maxx);
  const u=()=>E.PX(1)-E.PX(0), TOPBAND=[82,162], BOTBAND=[196,E.LH];
  const laneOf=y=> (y>=TOPBAND[0]&&y<=TOPBAND[1])?'top' : (y>=BOTBAND[0]&&y<=BOTBAND[1])?'bot' : null;
  // two draggable SUPPORTS: the (a+b) clamp and the (b+c) clamp; drag the one that braces each bridge's gap
  const braces=[ {grp:'left', label:'('+a+'+'+b+')', w:(a+b)*u()}, {grp:'right', label:'('+b+'+'+c+')', w:(b+c)*u()} ]
    .map((s,i)=>Object.assign({}, s, { id:i, kind:'drag', home:{x:E.PX(0)+62, y:22+i*34}, bbox:o=>({x:o.pos.x-4, y:o.pos.y-12, w:s.w+8, h:28}) }));

  function show(bt,bb){ drawLanes(T,maxx,[
    {y:94,bot:150, planks:[a,b,c], posts:[top.post], gap:covered(top)?null:top.miss, bracket:brk(top), fed:top.fed, bull:bt, label:top.grp?grpEq(top):''},
    {y:208,bot:262, planks:[a,b,c], posts:[bot.post], gap:covered(bot)?null:bot.miss, bracket:brk(bot), fed:bot.fed, bull:bb, label:bot.grp?grpEq(bot):''} ]);
  }

  function sceneDraw(){ show(null,null);
    const drg=braces.find(s=>s.grab);
    if(drg){ const ln=laneOf(drg.pos.y);
      if(ln){ const L=ln==='top'?top:bot, ly=ln==='top'?90:204, ok=(drg.grp===L.need);
        laneHi(ln==='top'?{x:0,y:94,w:E.LW,h:56}:{x:0,y:208,w:E.LW,h:54}, ln==='top'?'80,216,144':'96,150,255');
        const x0=drg.grp==='left'?E.PX(0):E.PX(a), x1=drg.grp==='left'?E.PX(a+b):E.PX(T);
        const ctx=E.ctx; ctx.save(); ctx.globalAlpha=.7; ctx.setLineDash([5,5]); ctx.lineWidth=2.4; ctx.strokeStyle=ok?'rgba(80,216,144,.95)':'rgba(232,64,46,.95)'; ctx.strokeRect(x0+2,ly-10,(x1-x0)-4,20); ctx.restore(); } }
    braces.forEach(s=> drawBrace(s.label, s.pos.x, s.pos.y, s.w, !!s.grab)); }
  function refreshTray(){ E.status(t({en:'drag a support onto each bridge’s gap',zh:'把支撑拖到每座桥的缺口上'})); E.clearTray();
    const ub=E.addBtn('↺','ghost',()=>{ if(E.busy)return; top.grp=null; bot.grp=null; E.sfx('place'); refreshTray(); }); ub.disabled=(!top.grp&&!bot.grp);
    if(top.grp&&bot.grp) E.addBtn(t({en:'Send both ▶',zh:'一起出发 ▶'}),'primary',sendBoth); }
  function startScene(){ E.scene({ actors:braces, draw:sceneDraw, onDrop:(ac,z,info)=>{ if(E.busy)return; const ln=info?laneOf(info.y):null; if(!ln) return;
      const L=ln==='top'?top:bot; L.grp=ac.grp; E.sfx('bracket'); refreshTray(); } });   // drop EITHER support on EITHER bridge (you can be wrong); Send judges → an unsupported seam gives way
    refreshTray(); }

  function sendBoth(){ if(E.busy)return; E.sceneStop();
    crossTwo(T, top, bot, top.miss, covered(top)?'exact':'short', bot.miss, covered(bot)?'exact':'short', show, win, ()=>{
      E.tell(t({en:'A seam with <b class="r">no support</b> gives way! Brace the pair sitting over the gap.',zh:'<b class="r">没支撑</b>的接缝塌了！把跨在缺口上的一对撑住。'}));
      E.afterSpeech(()=>{ top.grp=null; bot.grp=null; startScene(); }); });
  }
  function win(){ E.setDots(3); E.tickQ(3); E.award(55); top.fed=bot.fed=true;
    E.status(keq(a+'+('+b+'+'+c+') = ('+a+'+'+b+')+'+c+' = '+T));
    E.tell(t({en:'Top grouped <b class="g">'+a+'+('+b+'+'+c+')</b>, bottom <b class="y">('+a+'+'+b+')+'+c+'</b>: both reach <b>'+T+'</b>. That\'s <b>associating</b>.',
      zh:'上桥 <b class="g">'+a+'+('+b+'+'+c+')</b>，下桥 <b class="y">('+a+'+'+b+')+'+c+'</b>：都到 <b>'+T+'</b>。这就是<b>结合律</b>。'}));
    E.clearTray(); E.addBtn(t({en:'Claim the Codex page',zh:'领取典籍书页'}),'primary',()=>E.openBook(QUEST.book));
    E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep);
  }
  E.tell(t({en:'<b>The Pillar Pass.</b> Each bridge has planks <b>'+a+' | '+b+' | '+c+'</b>, but one seam has a <b class="r">missing post</b>. <b>Drag the support</b> that braces the gap onto each bridge: <b class="g">'+a+'+('+b+'+'+c+')</b> = <b class="y">('+a+'+'+b+')+'+c+'</b>.',
    zh:'<b>立柱关。</b>每座桥都有木板 <b>'+a+' | '+b+' | '+c+'</b>，但有处接缝<b class="r">缺了立柱</b>。把跨过缺口的那个<b>支撑拖</b>到每座桥上：<b class="g">'+a+'+('+b+'+'+c+')</b> = <b class="y">('+a+'+'+b+')+'+c+'</b>。'}));
  startScene();
}

const QUEST = {
  id:'q01', page:6, region:'cradle', next:'02',
  kicker:{en:'The Cradle',zh:'摇篮'},
  title:{en:'Joining Steps',zh:'步步前行'},
  meta:{ title:{en:'Feed the Starving Calves',zh:'喂饱饥饿的小牛'}, giver:{en:'Tau the Calf · The Cradle',zh:'小牛 Tau · 摇篮'},
    flavor:{en:'"Hi, <b>Pathfinder</b>! I\'m <b class="y">Tau</b>, your little <b class="y">ox</b>, still just a <b class="y">calf</b> with horns barely budding. The Unravelling\'s Fog has starved my whole <b class="y">herd</b>, and its wraiths cracked the bridge stones, so we are too weak to carry you yet. Three broken crossings lie ahead, each with <b class="g">grass</b> beyond. Bridge them so we can feed, and as we <b>grow</b> we will carry you onward. Let\'s go!"',
      zh:'"<b>开拓者</b>，你好！我是 <b class="y">Tau</b>，你的小<b class="y">牛犊</b>，犄角才刚冒出来。「大解体」的迷雾让我们整<b class="y">牛群</b>饿坏了，它的幽灵把桥石砸碎了，现在我们太虚弱，还载不动你。前方有三处断桥，桥对面都有 <b class="g">青草</b>。把桥搭好，让我们吃饱，<b>长大</b>之后就能载你前行啦。出发吧！"'} },
  objs:[ {en:'The Cracked Causeway: bridge the gap',zh:'裂隙石道：搭桥'},
         {en:'The Twin Spans: order is free',zh:'双生桥：顺序自由'},
         {en:'The Pillar Pass: grouping is free',zh:'立柱关：组合自由'} ],
  rounds:[round1,round2,round3],
  book:{ page:1, kicker:{en:'Introduction',zh:'入门之'}, title:{en:'Addition',zh:'加法'},
    blocks:[
      {top:true, fig:'dots',    prose:{en:'Addition simply means putting two or more <b class="q">quantities</b> together.',zh:'加法的意义很简明：就是把两个或更多的<b class="q">数量</b>加在一起。'}},
      {top:true, fig:'bars',    prose:{en:'Throughout this book we use the <b class="len">length</b> of a segment to stand for a <b class="q">quantity</b>.',zh:'本书会经常用<b class="len">线段的长度</b>来代表<b class="q">数量</b>。'}},
      {top:true, fig:'numline', prose:{en:'Once you are used to it, just read the <b class="len">length</b> and picture its meaning on the number line.',zh:'习惯之后，直接用<b class="len">长度</b>，并想到它们在数线上的意义。'}},
      {law:{en:'Commutative',zh:'交换律'}, eq:'1 + 2 = 2 + 1', fig:'commute', prose:{en:'Swap the order and the total length is unchanged. Obvious once you see it, though proving it with full rigour is not easy.',zh:'交换顺序，总长度不变。一眼就懂，但要严格证明其实并不简单。'}},
      {law:{en:'Associative',zh:'结合律'}, eq:'(1 + 2) + 3 = 1 + (2 + 3)', fig:'assoc', prose:{en:'However you group the steps, you arrive at the same place. Grouping is free.',zh:'无论怎样分组，最后都落在同一处。分组是自由的。'}},
      {note:{en:'<b>Aside.</b> 1 + 1 = 2 looks obvious, but it is really a definition-like choice: it matches nature, and it lets every later idea close into one complete, self-consistent loop. 1 + 1 = 3 is not just unnatural, it could never close that loop.',zh:'<b>进阶。</b> 1 + 1 = 2 看似简单，其实更像一个定义式的推论：一来符合自然，二来能让后面所有概念闭合成一个完整自洽的体系。1 + 1 = 3 不只是不自然，更是无法闭合成这个完整体系。'}}
    ],
    read:{en:'Addition joins quantities. Order is free, and grouping is free.',zh:'加法把数量相加。顺序自由，分组也自由。'} },
  intro:(E)=>{ const G=rnd(3,6); bridge(G,G+1,0,[],null); }
};
window.QUEST_q01 = QUEST;
})();
