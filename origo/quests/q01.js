/* ORIGO · Quest 1 = MathO book p6 (THE book, made playable) · Joining Steps · Addition. Layer 3 content. */
(function(){
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const keq=(expr)=>'<span class="keq">'+expr+' <span class="tk">✓</span></span>';   // the page's key equation, shown big

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
      ctx.strokeStyle=FIG.C.post; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(mx,L.y+5); ctx.lineTo(mx,L.bot); ctx.stroke();   // support strut
      ctx.strokeStyle=FIG.C.gold; ctx.lineWidth=3; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(PX(k.a)+3,y-7); ctx.lineTo(PX(k.a)+3,y); ctx.lineTo(PX(k.c)-3,y); ctx.lineTo(PX(k.c)-3,y-7); ctx.stroke();
      ctx.fillStyle=FIG.C.gold; ctx.font='italic 12px Georgia'; ctx.textAlign='center'; ctx.fillText(k.label,mx,y+14); }
    if(L.label){ ctx.fillStyle=FIG.C.text; ctx.font='13px "IBM Plex Mono",monospace'; ctx.textAlign='left'; ctx.textBaseline='alphabetic'; ctx.fillText(L.label,8,L.y-22); }
    const bb=L.bull||{xv:0,dy:-2};
    FIG.bull(ctx,PX(bb.xv),L.y-15+(bb.dy||0),40,{mood:document.getElementById('companion').dataset.mood});
  });
}

/* ===== Round 1 — The Cracked Causeway (addition) ===== */
function round1(E){ E.setSpeaker('tau'); E.mood('idle'); E.fed=false; E.setDots(0); E.cv.onclick=null;
  const G=rnd(4,7); let planks=[]; const sum=()=>planks.reduce((a,b)=>a+b,0); const maxx=G+1;
  const draw=b=>bridge(G,maxx,0,planks,b);
  E.setPlace(E.t({en:'The Cracked Causeway',zh:'裂隙石道'})); draw(null);
  E.tell(E.t({en:'<b>The Cracked Causeway.</b> Any planks will work, since there is a post at every step. Bridge the gap to the <b class="g">grass</b> at <b class="g">'+G+'</b>: too short I fall, too long the grass gets buried!',
    zh:'<b>裂隙石道。</b>任何木板都可行，因为每一步都有立柱。搭到 <b class="g">'+G+'</b> 处的 <b class="g">青草</b>：太短我会掉下去，太长就会埋住青草！'}));
  function refresh(){ E.status(E.t({en:'bridge: ',zh:'桥长：'})+'<b>'+sum()+'</b> / '+G); E.clearTray();
    [1,2,3].forEach(v=>E.addBtn('+'+v,'plank p'+v,()=>{ if(E.busy||sum()+v>maxx)return; planks.push(v); E.sfx('place'); E.pop('+'+v); draw(null); refresh(); }));
    const u=E.addBtn('↺','',()=>{ if(!planks.length)return; planks.pop(); draw(null); refresh(); }); u.disabled=!planks.length;
    E.addBtn(E.t({en:'Send me! ▶',zh:'出发！▶'}),'primary',()=>{ if(E.busy)return;
      E.runCross({ target:G, reach:sum(), draw, retry:round1.bind(null,E),
        msgs:{ short:{en:'Too <b class="r">short</b>, I run off into the Fog!',zh:'太<b class="r">短</b>，我掉进迷雾了！'},
               long:{en:'Too <b class="r">long</b>, the <b>grass gets buried</b>! Trim it.',zh:'太<b class="r">长</b>，<b>青草被埋住了</b>！收短点。'} },
        onWin:()=>{ E.setDots(1); E.tickQ(1); E.award(40);
          E.status(keq(planks.join(' + ')+' = '+G)); E.tell(E.t({en:'Yum, the little calf is fed!',zh:'好香，小牛犊吃饱饱！'}));
          E.clearTray(); E.addBtn(E.t({en:'On to the next crossing ▶',zh:'前往下一处 ▶'}),'primary',E.advance);
          E.addBtn(E.t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'',E.replayStep); } }); }); }
  refresh();
}

/* both bulls cross at the SAME fixed speed; each falls (or not) when IT reaches its own stop */
function crossTwo(T, top, bot, tStop, tOK, bStop, bOK, show, onWin, onFail){
  E.busy=true; E.clearTray();
  const per=340, fallDur=640, tHit=tStop*per, bHit=bStop*per, both=tOK&&bOK;
  const endT=Math.max(tHit,bHit)+(both?0:fallDur);
  const lane=(stop,ok,hit,now)=> now<hit ? {xv:now/per,dy:-2} : (ok?{xv:stop,dy:-2}:{xv:stop,dy:Math.min(1,(now-hit)/fallDur)*150});
  E.anim(Math.max(1,endT), p=>{ const now=p*endT; show(lane(tStop,tOK,tHit,now), lane(bStop,bOK,bHit,now)); }, ()=>{
    if(both){ E.anim(560,p=>{ top.fed=bot.fed=p>.6; show({xv:T+0.5*p,dy:-2},{xv:T+0.5*p,dy:-2}); },
        ()=>{ top.fed=bot.fed=true; show({xv:T+0.5,dy:-2},{xv:T+0.5,dy:-2}); E.cheer(); E.pop('nom!'); E.sfx('win'); E.busy=false; onWin(); }); }
    else { E.oops(); E.sfx('fail'); E.busy=false; onFail(); }
  });
}

/* ===== Round 2 — The Twin Spans (commutativity, both orders side by side) ===== */
function round2(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(1); E.cv.onclick=null;
  let a,b; do{ a=rnd(2,4); b=rnd(2,4); }while(a===b); const T=a+b, maxx=T+1;
  const posts=[]; for(let i=1;i<T;i++) posts.push(i);
  const top={fill:null,fed:false}, bot={fill:null,fed:false}; let pick=null;
  const sumT=()=>a+(top.fill||0), sumB=()=>b+(bot.fill||0);
  const pT=()=>top.fill!=null?[a,top.fill]:[a], pB=()=>bot.fill!=null?[b,bot.fill]:[b];
  E.setPlace(E.t({en:'The Twin Spans',zh:'双生桥'}));
  function show(bt,bb){ drawLanes(T,maxx,[
    {y:94,bot:150, planks:pT(), posts, fed:top.fed, bull:bt, label:(top.fill!=null? a+' + '+top.fill+' = '+sumT() : a+' + ?')},
    {y:208,bot:262, planks:pB(), posts, fed:bot.fed, bull:bb, label:(bot.fill!=null? b+' + '+bot.fill+' = '+sumB() : b+' + ?')} ]); }
  function refresh(){ show(null,null); E.clearTray();
    if(pick===null){
      E.status(E.t({en:'pick a span to fix, then choose its plank',zh:'先选一座桥，再选它的木板'}));
      E.addBtn(E.t({en:'Top span:&nbsp;'+a+' + ',zh:'上桥：'+a+' + '})+(top.fill==null?'?':top.fill), top.fill!=null?'on':'', ()=>{ pick='top'; refresh(); });
      E.addBtn(E.t({en:'Bottom span:&nbsp;'+b+' + ',zh:'下桥：'+b+' + '})+(bot.fill==null?'?':bot.fill), bot.fill!=null?'on':'', ()=>{ pick='bot'; refresh(); });
      if(top.fill!=null && bot.fill!=null) E.addBtn(E.t({en:'Send both ▶',zh:'一起出发 ▶'}),'primary',sendBoth);
    } else {
      const L=pick==='top'?top:bot, preset=pick==='top'?a:b;
      E.status(E.t({en:(pick==='top'?'Top':'Bottom')+' span ('+preset+' + ?): pick a plank to reach '+T,zh:(pick==='top'?'上桥':'下桥')+'（'+preset+' + ?）：选木板凑到 '+T}));
      E.addBtn('+'+a,'plank p'+a,()=>{ L.fill=a; pick=null; E.sfx('place'); refresh(); });
      E.addBtn('+'+b,'plank p'+b,()=>{ L.fill=b; pick=null; E.sfx('place'); refresh(); });
      E.addBtn(E.t({en:'‹ back',zh:'‹ 返回'}),'',()=>{ pick=null; refresh(); });
    }
  }
  function sendBoth(){ if(E.busy)return; const ts=sumT(), bs=sumB(), tOK=ts===T, bOK=bs===T;
    crossTwo(T, top, bot, tOK?T:ts, tOK, bOK?T:bs, bOK, show, win, ()=>{
      E.tell(E.t({en:'Each span must reach <b>'+T+'</b>: top needs <b>'+b+'</b>, bottom needs <b>'+a+'</b>.',zh:'每座桥都要到 <b>'+T+'</b>：上桥差 <b>'+b+'</b>，下桥差 <b>'+a+'</b>。'}));
      E.afterSpeech(()=>{ top.fill=null; bot.fill=null; refresh(); }); });
  }
  function win(){ E.setDots(2); E.tickQ(2); E.award(40);
    E.status(keq(a+' + '+b+' = '+b+' + '+a+' = '+T));
    E.tell(E.t({en:'Top is <b class="g">'+a+' + '+b+'</b>, bottom is <b class="y">'+b+' + '+a+'</b>: same length! That\'s <b>commuting</b>.',
      zh:'上桥 <b class="g">'+a+' + '+b+'</b>，下桥 <b class="y">'+b+' + '+a+'</b>：长度相同！这就是<b>交换律</b>。'}));
    E.clearTray(); E.addBtn(E.t({en:'On to the Pillar Pass ▶',zh:'前往立柱关 ▶'}),'primary',E.advance);
    E.addBtn(E.t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'',E.replayStep);
  }
  E.tell(E.t({en:'<b>The Twin Spans.</b> Top holds <b class="g">'+a+'</b>, bottom holds <b class="y">'+b+'</b>. Add the missing plank so <b>both</b> reach <b>'+T+'</b>, and see <b class="g">'+a+'+'+b+'</b> = <b class="y">'+b+'+'+a+'</b>.',
    zh:'<b>双生桥。</b>上桥已有 <b class="g">'+a+'</b>，下桥已有 <b class="y">'+b+'</b>。补上缺的木板，让<b>两座桥</b>都到 <b>'+T+'</b>，可见 <b class="g">'+a+'+'+b+'</b> = <b class="y">'+b+'+'+a+'</b>。'}));
  refresh();
}

/* ===== Round 3 — The Pillar Pass (associativity via a SUPPORT over a missing post, side by side) ===== */
function round3(E){ E.setSpeaker('tau'); E.mood('idle'); E.fed=false; E.setDots(2); E.cv.onclick=null;
  let a,b,c; do{ a=rnd(1,3); b=rnd(1,3); c=rnd(1,3); }while(a+b+c<5||a+b+c>8||a===c); const T=a+b+c, maxx=T+1;
  const s1=a, s2=a+b;   // the two seams: between a|b, and b|c
  const top={post:s1, miss:s2, need:'right', grp:null, fed:false};   // post under s1; gap at s2 → support (b+c)
  const bot={post:s2, miss:s1, need:'left',  grp:null, fed:false};   // post under s2; gap at s1 → support (a+b)
  const brk=L=> L.grp==='left'?{a:0,c:a+b,label:'('+a+'+'+b+')'} : L.grp==='right'?{a:a,c:T,label:'('+b+'+'+c+')'} : null;
  const grpEq=L=> L.grp==='left'?'('+a+'+'+b+')+'+c : a+'+('+b+'+'+c+')';
  const covered=L=> L.grp===L.need; let pick=null;
  E.setPlace(E.t({en:'The Pillar Pass',zh:'立柱关'}));
  function show(bt,bb){ drawLanes(T,maxx,[
    {y:94,bot:150, planks:[a,b,c], posts:[top.post], gap:covered(top)?null:top.miss, bracket:brk(top), fed:top.fed, bull:bt, label:top.grp?grpEq(top):''},
    {y:208,bot:262, planks:[a,b,c], posts:[bot.post], gap:covered(bot)?null:bot.miss, bracket:brk(bot), fed:bot.fed, bull:bb, label:bot.grp?grpEq(bot):''} ]); }
  function refresh(){ show(null,null); E.clearTray();
    if(pick===null){
      E.status(E.t({en:'a <b>gap</b> has no post: pick a span, then add a <b>support</b>',zh:'有处<b>缺口</b>没有立柱：先选一座桥，再加<b>支撑</b>'}));
      E.addBtn(E.t({en:'Top span:&nbsp;',zh:'上桥：'})+(top.grp?brk(top).label:E.t({en:'support ?',zh:'支撑 ?'})), top.grp?'on':'', ()=>{ pick='top'; refresh(); });
      E.addBtn(E.t({en:'Bottom span:&nbsp;',zh:'下桥：'})+(bot.grp?brk(bot).label:E.t({en:'support ?',zh:'支撑 ?'})), bot.grp?'on':'', ()=>{ pick='bot'; refresh(); });
      if(top.grp&&bot.grp) E.addBtn(E.t({en:'Send both ▶',zh:'两头一起出发 ▶'}),'primary',sendBoth);
    } else {
      const L=pick==='top'?top:bot;
      E.status(E.t({en:(pick==='top'?'Top':'Bottom')+' span: which pair sits over the gap?',zh:(pick==='top'?'上桥':'下桥')+'：哪一对跨在缺口上？'}));
      E.addBtn('( '+a+'+'+b+' )', L.grp==='left'?'on':'', ()=>{ L.grp='left'; pick=null; E.sfx('bracket'); refresh(); });
      E.addBtn('( '+b+'+'+c+' )', L.grp==='right'?'on':'', ()=>{ L.grp='right'; pick=null; E.sfx('bracket'); refresh(); });
      E.addBtn(E.t({en:'‹ back',zh:'‹ 返回'}),'',()=>{ pick=null; refresh(); });
    }
  }
  function sendBoth(){ if(E.busy)return; const tOK=covered(top), bOK=covered(bot);
    crossTwo(T, top, bot, tOK?T:top.miss, tOK, bOK?T:bot.miss, bOK, show, win, ()=>{
      E.tell(E.t({en:'A seam with <b class="r">no support</b> gives way! Group the pair sitting over the gap.',zh:'<b class="r">没支撑</b>的接缝塌了！把跨在缺口上的一对括起来。'}));
      E.afterSpeech(()=>{ top.grp=null; bot.grp=null; refresh(); }); });
  }
  function win(){ E.setDots(3); E.tickQ(3); E.award(55); top.fed=bot.fed=true;
    E.status(keq(a+'+('+b+'+'+c+') = ('+a+'+'+b+')+'+c+' = '+T));
    E.tell(E.t({en:'Top grouped <b class="g">'+a+'+('+b+'+'+c+')</b>, bottom <b class="y">('+a+'+'+b+')+'+c+'</b>: both reach <b>'+T+'</b>. That\'s <b>associating</b>.',
      zh:'上桥 <b class="g">'+a+'+('+b+'+'+c+')</b>，下桥 <b class="y">('+a+'+'+b+')+'+c+'</b>：都到 <b>'+T+'</b>。这就是<b>结合律</b>。'}));
    E.clearTray(); E.addBtn(E.t({en:'Claim the Codex page 📖',zh:'领取典籍书页 📖'}),'primary',()=>E.openBook(QUEST.book));
    E.addBtn(E.t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'',E.replayStep);
  }
  E.tell(E.t({en:'<b>The Pillar Pass.</b> Each span has planks <b>'+a+' | '+b+' | '+c+'</b>, but one seam has a <b class="r">missing post</b>. Add a <b>support</b> by grouping the pair over the gap, on each span: <b class="g">'+a+'+('+b+'+'+c+')</b> = <b class="y">('+a+'+'+b+')+'+c+'</b>.',
    zh:'<b>立柱关。</b>每座桥都有木板 <b>'+a+' | '+b+' | '+c+'</b>，但有处接缝<b class="r">缺了立柱</b>。在每座桥上把缺口上的一对括起来补充<b>支撑</b>：<b class="g">'+a+'+('+b+'+'+c+')</b> = <b class="y">('+a+'+'+b+')+'+c+'</b>。'}));
  refresh();
}

const QUEST = {
  id:'q01', page:6, region:'cradle', next:'02',
  kicker:{en:'The Cradle',zh:'摇篮'},
  title:{en:'Joining Steps',zh:'步步前行'},
  meta:{ title:{en:'Feed the Starving Calves',zh:'喂饱饥饿的小牛'}, giver:{en:'Tau the Calf · The Cradle',zh:'小牛 Tau · 摇篮'},
    flavor:{en:'"Hi, <b>Pathfinder</b>! I\'m <b>Tau</b>, your little ox, still just a <b>calf</b> with horns barely budding. The <b>Fog</b> has starved my whole herd, so we are too weak to carry you yet. Three broken crossings lie ahead, each with <b>grass</b> beyond. Bridge them so we can feed, and as we <b>grow</b> we will carry you onward. Let\'s go!"',
      zh:'"<b>开拓者</b>，你好！我是 <b>Tau</b>，你的小牛犊，犄角才刚冒出来。<b>迷雾</b>让我们整群牛饿坏了，现在我们太虚弱，还载不动你。前方有三处断桥，桥对面都有 <b>青草</b>。把桥搭好，让我们吃饱，<b>长大</b>之后就能载你前行啦。出发吧！"'} },
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
      {law:{en:'Associative',zh:'组合律'}, eq:'(1 + 2) + 3 = 1 + (2 + 3)', fig:'assoc', prose:{en:'However you group the steps, you arrive at the same place. Grouping is free.',zh:'无论怎样分组，最后都落在同一处。分组是自由的。'}},
      {note:{en:'<b>Aside.</b> 1 + 1 = 2 looks obvious, but it is really a definition-like choice: it matches nature, and it lets every later idea close into one complete, self-consistent loop. 1 + 1 = 3 is not just unnatural, it could never close that loop.',zh:'<b>进阶。</b> 1 + 1 = 2 看似简单，其实更像一个定义式的推论：一来符合自然，二来能让后面所有概念闭合成一个完整自洽的体系。1 + 1 = 3 不只是不自然，更是无法闭合成这个完整体系。'}}
    ],
    read:{en:'Addition joins quantities. Order is free, and grouping is free.',zh:'加法把数量相加。顺序自由，分组也自由。'} },
  intro:(E)=>{ bridge(5,6,0,[],null); }
};
window.QUEST_q01 = QUEST;
})();
