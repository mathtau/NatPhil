/* ORIGO · Quest 3 = the page the book skipped · "Give Numbers Names" · letters as names + the 5x shorthand. Layer 3 content.
   A Fogwraith (a servant of the Unravelling) tangled the sack-labels, so Tau cannot count what is inside. You NAME the unknown (x), tell Product (积) to COPY it (5x),
   then UNTIE the sacks (x = 4) and read the number back (5x = 20) to feed the herd. Every step is a right/wrong decision with a real consequence. */
(function(){
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const t=s=>E.t(s);
const keq=(expr)=>'<span class="keq">'+expr+' <span class="tk">✓</span></span>';
const GRASS='#2f7a3f', WHEAT='#cf9a2a';
let LX=0, LN='', LR='';   // last draw per round, so Replay never repeats the previous numbers
function backStep(){ if(E.round>0) E.addBtn(t({en:'◀ Prev step',zh:'◀ 上一步'}),'ghost',E.prevStep); }

/* ---------- shared drawing (Tau idiom, reused from the pasture) ---------- */
function label(x,y,txt,col,sz){ const ctx=E.ctx; ctx.fillStyle=col||'#caa84a'; ctx.font=(sz||17)+'px "IBM Plex Mono",monospace'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(txt,x,y); }
function star(ctx,cx,cy,r,col){ if(r<=0)return; ctx.save(); ctx.fillStyle=col; ctx.beginPath();
  for(let i=0;i<5;i++){ const a=-Math.PI/2+i*2*Math.PI/5; ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r); const a2=a+Math.PI/5; ctx.lineTo(cx+Math.cos(a2)*r*0.45,cy+Math.sin(a2)*r*0.45); }
  ctx.closePath(); ctx.fill(); ctx.restore(); }
function bg(){ const ctx=E.ctx,LW=E.LW,LH=E.LH; E.clear(); FIG.fog(ctx,0,LW,0,LH*0.5,performance.now());
  ctx.fillStyle='#15301f'; ctx.fillRect(0,LH-50,LW,50); ctx.fillStyle='#2f7a3f'; ctx.fillRect(0,LH-54,LW,5); FIG.bull(ctx,40,LH-30,42); }
const TAUIMG={};
function tauImg(mood){ if(TAUIMG[mood])return TAUIMG[mood]; const i=new Image(); i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(FIG.tauBull(mood)); TAUIMG[mood]=i; return i; }
try{ ['happy','sad','open'].forEach(tauImg); }catch(_){}
function calf(ctx,x,y,r,fed){ const mood=fed===true?'happy':fed===false?'sad':fed, img=tauImg(mood), s=r*3.2;
  if(img.complete && img.naturalWidth){ ctx.save(); if(mood==='sad')ctx.globalAlpha=.5; try{ ctx.drawImage(img,x-s/2,y-s/2,s,s); }catch(_){ } ctx.restore(); }
  else { ctx.save(); ctx.fillStyle=mood==='sad'?'rgba(126,122,104,.6)':'#f4c830'; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); ctx.restore(); } }
// "Product" the magician — copy of the pasture wizard (积), so the two quests share one face
function magician(ctx,x,y,s,tt){ tt=tt==null?1:tt; const U=s/100, P=Math.PI; ctx.save(); ctx.lineJoin='round'; ctx.lineCap='round';
  ctx.fillStyle='rgba(0,0,0,.16)'; ctx.beginPath(); ctx.ellipse(x,y+63*U,27*U,6*U,0,0,7); ctx.fill();
  const robePath=()=>{ ctx.beginPath(); ctx.moveTo(x-10*U,y+4*U); ctx.quadraticCurveTo(x-30*U,y+24*U,x-36*U,y+56*U);
    ctx.quadraticCurveTo(x-22*U,y+66*U,x-12*U,y+59*U); ctx.quadraticCurveTo(x,y+68*U,x+12*U,y+59*U);
    ctx.quadraticCurveTo(x+22*U,y+66*U,x+36*U,y+56*U); ctx.quadraticCurveTo(x+30*U,y+24*U,x+10*U,y+4*U); ctx.closePath(); };
  const robe=ctx.createLinearGradient(x-34*U,0,x+34*U,0); robe.addColorStop(0,'#9bf0c8'); robe.addColorStop(.5,'#34b06a'); robe.addColorStop(1,'#136b42');   // GREEN robe (matches Q2's Product — the multiplication colour)
  ctx.fillStyle=robe; ctx.strokeStyle='#0e5a34'; ctx.lineWidth=2*U; robePath(); ctx.fill(); ctx.stroke();
  ctx.save(); robePath(); ctx.clip(); ctx.strokeStyle='rgba(16,70,40,.28)'; ctx.lineWidth=1.4*U; ctx.beginPath(); ctx.moveTo(x,y+8*U); ctx.lineTo(x,y+58*U); ctx.stroke();
  star(ctx,x-14*U,y+34*U,3*U,'rgba(255,247,207,.9)'); star(ctx,x+13*U,y+44*U,2.4*U,'rgba(255,247,207,.75)'); ctx.restore();
  ctx.fillStyle='#2f9a58'; ctx.strokeStyle='#0e5a34'; ctx.lineWidth=1.4*U; ctx.beginPath(); ctx.ellipse(x,y+5*U,11*U,3.6*U,0,0,7); ctx.fill(); ctx.stroke();   // collar
  const sym=(E.lang==='zh')?'积':'×'; ctx.save(); ctx.fillStyle='#ffe9a0'; ctx.strokeStyle='rgba(40,22,74,.75)'; ctx.lineWidth=3*U; ctx.font='bold '+(22*U)+'px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.strokeText(sym,x,y+28*U); ctx.fillText(sym,x,y+28*U); ctx.restore();   // his monogram (× EN / 积 ZH)
  ctx.fillStyle='#eccb8e'; ctx.beginPath(); ctx.arc(x-25*U,y+40*U,5.5*U,0,7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(x+24*U,y+30*U,5.5*U,0,7); ctx.fill(); ctx.stroke();   // hands (skin)
  const cy=y-18*U, hr=17*U;
  const skin=ctx.createRadialGradient(x-5*U,cy-6*U,2*U,x,cy,hr*1.15); skin.addColorStop(0,'#fff3d6'); skin.addColorStop(1,'#eccb8e');
  ctx.fillStyle=skin; ctx.strokeStyle='#b98c2a'; ctx.lineWidth=1.6*U; ctx.beginPath(); ctx.arc(x,cy,hr,0,7); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#eccb8e'; ctx.beginPath(); ctx.arc(x-hr,cy+2*U,3*U,0,7); ctx.arc(x+hr,cy+2*U,3*U,0,7); ctx.fill();
  ctx.fillStyle='rgba(255,150,120,.5)'; ctx.beginPath(); ctx.ellipse(x-8.5*U,cy+5*U,4.2*U,2.8*U,0,0,7); ctx.ellipse(x+8.5*U,cy+5*U,4.2*U,2.8*U,0,0,7); ctx.fill();
  [-6,6].forEach(dx=>{ const ex=x+dx*U, ey=cy-1*U; ctx.fillStyle='#241a05'; ctx.beginPath(); ctx.ellipse(ex,ey,2.6*U,3.3*U,0,0,7); ctx.fill(); ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ex+0.9*U,ey-1.3*U,0.9*U,0,7); ctx.fill(); });
  ctx.strokeStyle='#9a5a2a'; ctx.lineWidth=1.3*U; ctx.beginPath(); ctx.arc(x,cy+5*U,3.2*U,0.15*P,0.85*P); ctx.stroke();
  const bd=ctx.createLinearGradient(0,cy+4*U,0,cy+30*U); bd.addColorStop(0,'#fffdf6'); bd.addColorStop(1,'#dad0bc');
  ctx.fillStyle=bd; ctx.strokeStyle='rgba(150,130,95,.5)'; ctx.lineWidth=1*U; ctx.beginPath(); ctx.moveTo(x-11*U,cy+7*U); ctx.quadraticCurveTo(x-12*U,cy+26*U,x-3*U,cy+30*U); ctx.quadraticCurveTo(x,cy+33*U,x+3*U,cy+30*U); ctx.quadraticCurveTo(x+12*U,cy+26*U,x+11*U,cy+7*U); ctx.quadraticCurveTo(x,cy+16*U,x-11*U,cy+7*U); ctx.closePath(); ctx.fill(); ctx.stroke();
  const hb=cy-hr+4*U;
  ctx.fillStyle='#e3ad28'; ctx.strokeStyle='#8a6410'; ctx.lineWidth=1.5*U; ctx.beginPath(); ctx.ellipse(x,hb,20*U,5*U,0,0,7); ctx.fill(); ctx.stroke();
  const hat=ctx.createLinearGradient(x-18*U,0,x+18*U,0); hat.addColorStop(0,'#3f53a6'); hat.addColorStop(.5,'#5066c0'); hat.addColorStop(1,'#2a3470');
  ctx.fillStyle=hat; ctx.strokeStyle='#1e2452'; ctx.lineWidth=1.6*U; ctx.beginPath(); ctx.moveTo(x-16*U,hb); ctx.quadraticCurveTo(x-8*U,hb-28*U,x-1*U,hb-40*U); ctx.quadraticCurveTo(x+13*U,hb-46*U,x+12*U,hb-32*U); ctx.quadraticCurveTo(x+9*U,hb-20*U,x+16*U,hb); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#f4c830'; ctx.strokeStyle='#8a6410'; ctx.lineWidth=1*U; ctx.beginPath(); ctx.ellipse(x,hb-2*U,16*U,4*U,0,0,7); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#ff6a4d'; ctx.beginPath(); ctx.arc(x,hb-2*U,2*U,0,7); ctx.fill();
  star(ctx,x+12*U,hb-32*U,3*U*(0.8+0.3*Math.sin(tt*6.283)),'#fff7cf');
  const wand=ctx.createLinearGradient(x+22*U,y+30*U,x+54*U,y-30*U); wand.addColorStop(0,'#7a4f22'); wand.addColorStop(1,'#caa84a');
  ctx.strokeStyle=wand; ctx.lineWidth=3*U; ctx.beginPath(); ctx.moveTo(x+24*U,y+30*U); ctx.lineTo(x+52*U,y-26*U); ctx.stroke();
  const tx=x+54*U, ty=y-30*U, gl=ctx.createRadialGradient(tx,ty,0,tx,ty,13*U); gl.addColorStop(0,'rgba(255,243,180,.7)'); gl.addColorStop(1,'rgba(255,243,180,0)'); ctx.fillStyle=gl; ctx.beginPath(); ctx.arc(tx,ty,13*U,0,7); ctx.fill();
  star(ctx,tx,ty,7*U*(0.85+0.25*Math.sin(tt*6.283)),'#fff7d8'); ctx.restore(); }

/* ---------- the SACK: tied (Fog hides the count, shows a name) or opened (shows its bundles) ---------- */
function bundle(ctx,x,y,r,col){ ctx.save(); ctx.strokeStyle=col||'#1c5a2a'; ctx.lineWidth=Math.max(1.4,r*0.22); ctx.lineCap='round';
  [-0.5,0,0.5].forEach(d=>{ ctx.beginPath(); ctx.moveTo(x+d*r*0.5,y+r*0.6); ctx.quadraticCurveTo(x+d*r,y-r*0.2,x+d*r*1.5,y-r); ctx.stroke(); });
  ctx.strokeStyle='#b88a3a'; ctx.lineWidth=Math.max(1.4,r*0.24); ctx.beginPath(); ctx.moveTo(x-r*0.55,y+r*0.45); ctx.lineTo(x+r*0.55,y+r*0.45); ctx.stroke(); ctx.restore(); }
function sack(cx,cy,s,kind,opened,count,tag,tagcol,inLabel,openMouth){ const ctx=E.ctx; ctx.save(); ctx.lineJoin='round';
  const w=s, h=s*1.18;
  ctx.fillStyle='rgba(0,0,0,.16)'; ctx.beginPath(); ctx.ellipse(cx,cy+h*0.5,w*0.40,h*0.07,0,0,7); ctx.fill();
  const g=ctx.createLinearGradient(cx-w/2,0,cx+w/2,0);
  if(kind==='wheat'){ g.addColorStop(0,'#f0cf78'); g.addColorStop(1,'#cf9a2a'); } else { g.addColorStop(0,'#6fc97e'); g.addColorStop(1,'#2f7a3f'); }
  ctx.fillStyle=g; ctx.strokeStyle='#5a4a2a'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(cx-w*0.30,cy-h*0.30); ctx.quadraticCurveTo(cx-w*0.52,cy,cx-w*0.34,cy+h*0.40);
  ctx.quadraticCurveTo(cx,cy+h*0.54,cx+w*0.34,cy+h*0.40); ctx.quadraticCurveTo(cx+w*0.52,cy,cx+w*0.30,cy-h*0.30); ctx.closePath(); ctx.fill(); ctx.stroke();
  if(opened && inLabel==null){ const inside=kind==='wheat'?'#7a5a18':'#1c5a2a'; const cols=Math.min(count,2)||1, br=w*0.17;
    for(let i=0;i<count;i++){ const r=Math.floor(i/cols), c=i%cols, n=Math.min(count-r*cols,cols), bx=cx+(c-(n-1)/2)*w*0.30, by=cy+h*0.02+r*w*0.26 - (Math.ceil(count/cols)-1)*w*0.10; bundle(ctx,bx,by,br,inside); } }
  else { if(!opened && !openMouth){ ctx.save(); ctx.beginPath(); ctx.moveTo(cx-w*0.30,cy-h*0.30); ctx.quadraticCurveTo(cx-w*0.52,cy,cx-w*0.34,cy+h*0.40); ctx.quadraticCurveTo(cx,cy+h*0.54,cx+w*0.34,cy+h*0.40); ctx.quadraticCurveTo(cx+w*0.52,cy,cx+w*0.30,cy-h*0.30); ctx.closePath(); ctx.clip();
      ctx.fillStyle='rgba(20,18,40,.22)'; ctx.fillRect(cx-w,cy-h,2*w,2*h); ctx.restore(); }   // tied = foggy tint; opened sack stays bright
    const txt=inLabel==null?'?':inLabel; ctx.fillStyle=opened?'#fff0b0':'#cfe6ff';            // revealed VALUE (bright gold) vs the NAME (light blue)
    ctx.font='bold '+(s*0.5)+'px "IBM Plex Mono",monospace'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(txt,cx,cy+h*0.05); }
  if(openMouth){   // OPEN mouth (untied) — you can see in; the loose drawstrings flop out
    ctx.fillStyle='rgba(18,12,6,.5)'; ctx.beginPath(); ctx.ellipse(cx,cy-h*0.30,w*0.32,h*0.085,0,0,7); ctx.fill();
    ctx.strokeStyle='#6a5530'; ctx.lineWidth=2.4; ctx.stroke();
    ctx.lineWidth=2; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(cx-w*0.24,cy-h*0.31); ctx.quadraticCurveTo(cx-w*0.42,cy-h*0.44,cx-w*0.32,cy-h*0.56); ctx.moveTo(cx+w*0.24,cy-h*0.31); ctx.quadraticCurveTo(cx+w*0.42,cy-h*0.44,cx+w*0.32,cy-h*0.56); ctx.stroke();
  } else {   // cinched, tied neck
    const neck=kind==='wheat'?'#e0b65a':'#3f9a52'; ctx.fillStyle=neck; ctx.beginPath(); ctx.moveTo(cx-w*0.30,cy-h*0.30); ctx.quadraticCurveTo(cx,cy-h*0.46,cx+w*0.30,cy-h*0.30); ctx.quadraticCurveTo(cx,cy-h*0.18,cx-w*0.30,cy-h*0.30); ctx.fill();
    ctx.strokeStyle='#6a5530'; ctx.lineWidth=2.4; ctx.beginPath(); ctx.ellipse(cx,cy-h*0.30,w*0.30,h*0.05,0,0,7); ctx.stroke();
  }
  if(tag!=null) label(cx,cy+h*0.5+Math.max(16,s*0.30),tag,tagcol||'#caa84a',Math.round(Math.max(20,s*0.5)));   // tag scales with the sack
  ctx.restore(); }

const HU='rgba(244,200,48,.95)';   // gold highlight for tappable answer tokens
/* DIRECT-MANIPULATION decision: answers are on-canvas TOKENS the player taps (no answer buttons), drawn in natural order (no shuffle).
   opts:[{txt,ok,fb}] laid out in a row at height `y` over the scene `baseDraw`. Right → ✓ + advance; wrong → Tau oops + feedback. */
function pickPills(prompt, baseDraw, y, opts, onRight){ const n=opts.length, cx=E.LW*0.5, gap=E.LW*0.27;
  const xs = n>=3?[cx-gap,cx,cx+gap]:[cx-gap*0.55,cx+gap*0.55];
  const draw=()=>{ bg(); baseDraw(); opts.forEach((o,i)=>E.pill(xs[i],y,t(o.txt))); };   // bg() each frame so the engine's hot-highlight ring can't accumulate around every pill
  const items=opts.map((o,i)=>({ bbox:()=>E.pillBB(xs[i],y,t(o.txt)), ok:o.ok, fb:o.fb, hiCol:HU }));
  E.choose(prompt, draw, items, onRight); }

/* ===== Round 1 — The Tied Sacks: ONE sack arrives tied (unknown). Tap Product → he stamps an identical OPEN copy that reads X and feeds X calves; identical, so x = X. ===== */
function round1(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(0); E.sceneStop();
  E.setPlace(t({en:'The Tied Sacks',zh:'扎口的袋子'}));
  let X; do{ X=rnd(2,4); }while(X===LX); LX=X;   // fresh each play; never repeat the last
  const S=80;
  const PX=()=>E.LW*0.13, Y=()=>E.LH*0.30, OX=()=>E.LW*0.42, CX=()=>E.LW*0.72, CY=()=>Y()+S*1.0;
  let copyMade=false, origOpen=false; const cst={fed:0}, ost={fed:0};
  const pos=(cx,i)=>cx+(i-(X-1)/2)*30;
  function scene(){ bg(); magician(E.ctx,PX(),Y(),50,0);
    if(origOpen){ label(OX(),Y()-S*0.74,t({en:'the sealed sack',zh:'原来封着的袋'}),'#8fd8a8',13);
      sack(OX(),Y(),S,'grass',true,0,null,null,String(X),true);                              // the original, untied at the win — also holds X
      for(let i=0;i<X;i++) calf(E.ctx,pos(OX(),i),CY(),12, i<ost.fed?true:'open'); }
    else sack(OX(),Y(),S,'grass',false,0,null,null,'x');                                     // the original, tied — its count is hidden
    if(copyMade){ label(CX(),Y()-S*0.74,t({en:'Product\'s copy',zh:'积的复制袋'}),'#9be0b8',13);
      sack(CX(),Y(),S,'grass',true,0,null,null,String(X),true);                             // the open copy reveals X
      for(let i=0;i<X;i++) calf(E.ctx,pos(CX(),i),CY(),12, i<cst.fed?true:'open'); } }
  // open a sack at cx: it reads X and its X grasses arc down to feed X calves; `st` tracks how many are fed so far
  function openFeed(cx,st,done){ E.busy=true; E.sceneStop(); E.sfx('place');
    const GAP=230, FLY=440, total=(X-1)*GAP+FLY+260, sy=Y()+S*0.18;
    E.anim(total,p=>{ const tnow=p*total; let fed=0; for(let i=0;i<X;i++) if(tnow>=i*GAP+FLY) fed++; st.fed=fed; scene();
      for(let i=0;i<X;i++){ const tp=(tnow-i*GAP)/FLY; if(tp<=0||tp>=1) continue; const tx=pos(cx,i),ty=CY();
        const gx=cx+(tx-cx)*tp, gy=sy+(ty-sy)*tp-Math.sin(tp*Math.PI)*26; bundle(E.ctx,gx,gy,12,'#1c5a2a');
        star(E.ctx,gx,gy-15,4*(0.6+0.4*Math.sin(tnow*0.02+i)),'rgba(255,243,207,.85)'); } },
     ()=>{ st.fed=X; scene(); E.cheer(); E.pop('nom!'); E.busy=false; done(); }); }
  // Product stamps an OPEN copy of the sealed sack; opening it reads X and feeds X calves
  function makeCopy(done){ copyMade=true; openFeed(CX(),cst,done); }
  // the correct answer UNTIES the original — it opens to the same X and feeds its own X calves (the payoff that proves x = X)
  function feedOriginal(done){ origOpen=true; openFeed(OX(),ost,done); }
  scene();
  E.tell(t({en:'<b>The Tied Sacks.</b> A sack of <b class="g">grass</b> arrived tied shut — we can\'t peek in to count the <b class="g">bundles</b>, and the <b class="y">calves</b> are hungry. That\'s alright: we can still <b>name</b> the hidden amount. Call it <b class="b">x</b>. <b class="g">Product</b> the magician can stamp out an <b>identical copy</b> and leave it open — and whatever the copy holds, the sealed sack holds too.',zh:'<b>扎口的袋子。</b>一袋<b class="g">青草</b>运到了，扎着口，没法打开数里面有多少<b class="g">捆</b>，<b class="y">小牛</b>们又饿了。没关系：我们可以先给这个看不见的量起个<b>名字</b>，就叫它 <b class="b">x</b>。魔法师<b class="g">"积"</b>能印出一个<b>一模一样的复制袋</b>、敞着口放着——复制袋里有多少，封着的原袋就有多少。'}));
  // q1: TAP Product — he copies the sealed sack into an open twin you CAN read
  function q1(){ E.status(t({en:'tap Product to copy the sack and open it ▶',zh:'点"积"复制这袋并打开 ▶'}));
    E.clearTray(); backStep();
    E.scene({ actors:[{kind:'tap', id:'mage', hiCol:'rgba(52,176,106,.45)', bbox:()=>({x:PX()-42,y:Y()-50,w:84,h:120})}], draw:scene,
      onPick(){ if(E.busy) return; E.sceneStop(); makeCopy(q2); } }); }
  function q2(){ const wrong2=2*X; E.status(t({en:'the copy reads '+X+' — so what is x?',zh:'复制袋读出 '+X+'——那 x 是多少？'}));
    pickPills(t({en:'<b class="g">Product</b>\'s copy opened to <b class="b">'+X+'</b> <b class="g">bundles</b>, feeding <b class="y">'+X+' calves</b>. The copy is <b>identical</b> to the sealed sack, so <b class="b">x</b> = ? <i>(tap a token)</i>',zh:'<b class="g">"积"</b>的复制袋打开是 <b class="b">'+X+'</b> <b class="g">捆草</b>，喂饱了 <b class="y">'+X+' 头小牛</b>。复制袋和封着的原袋<b>一模一样</b>，所以 <b class="b">x</b> = ？<i>（点一个牌子）</i>'}),
      scene, E.LH*0.82,
      [ {txt:{en:'x = '+wrong2,zh:'x = '+wrong2}, fb:{en:'That is two sacks together. x is one sack: '+X+' bundles.',zh:'那是两袋合起来。x 是一袋：'+X+' 捆。'}},
        {txt:{en:'x = '+X,zh:'x = '+X}, ok:true},
        {txt:{en:'cannot tell',zh:'说不准'}, fb:{en:'The copy is identical, so x holds exactly what the copy held.',zh:'复制袋一模一样，x 装的正是复制袋那么多。'}} ],
      ()=>{ E.status(t({en:'right — now untie the sealed sack ▶',zh:'答对了——现在解开封着的原袋 ▶'})); feedOriginal(win); }); }
  function win(){ E.sceneStop(); E.setDots(1); E.tickQ(1); E.award(45); E.status(keq('x = '+X));
    E.tell(t({en:'We knew it before untying it — <b class="g">Product</b>\'s copy was <b>identical</b>, so <b class="b">x</b> = '+X+'. Now opened, the sealed sack pours out the same <b class="b">'+X+'</b> <b class="g">bundles</b> and feeds its own <b class="y">'+X+' calves</b>. One name, one amount.',zh:'我们没解开就已经知道了——<b class="g">"积"</b>的复制袋<b>一模一样</b>，所以 <b class="b">x</b> = '+X+'。如今打开，封着的原袋倒出同样的 <b class="b">'+X+'</b> <b class="g">捆草</b>，喂饱它自己的 <b class="y">'+X+' 头小牛</b>。一个名字，一个量。'}));
    E.clearTray(); E.addBtn(t({en:'On to the Copy Yard ▶',zh:'前往复制场 ▶'}),'primary',E.advance); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
  q1();
}

/* ===== Round 2 — The Copy Yard: 5 sacks ALREADY feed the herd (15) on screen; name that picture 5×x → 5x; then recover x ===== */
function round2(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(1); E.sceneStop();
  E.setPlace(t({en:'The Copy Yard',zh:'复制场'}));
  let N,X; do{ N=rnd(4,6); X=rnd(2,3); }while(N+'x'+X===LN); LN=N+'x'+X; const TOTAL=N*X;   // fresh each play, never repeat the last
  let copied=false;   // the N sacks start EMPTY; Product (the wizard) copies the standard x into them on tap — that's what gives the tap a real purpose
  function stat(s){ E.status('<span style="font-family:\'IBM Plex Mono\',monospace;font-size:1.45rem;color:#f4c830;font-weight:600">'+s+'</span>'); }
  // the herd waits in N LOOSE groups of X (Q2-style: a row with a gap after each group) — they only snap into neat columns under the sacks once the barrels open (recover)
  function herdGeo(){ const LW=E.LW, y=E.LH*0.60, per=X, gaps=N-1;
    const sp=Math.min(26,(LW-150)/Math.max(TOTAL-1+gaps*0.8,1)), span=(TOTAL-1)*sp+gaps*sp*0.8, x0=(LW-span)/2+8;
    const c=[]; let x=x0; for(let i=0;i<TOTAL;i++){ c.push({x:x,y:y}); x+=sp + (((i+1)%per===0 && i<TOTAL-1)? sp*0.8 : 0); } return {cell:sp, centers:c}; }
  const sp=()=>Math.min(50,(E.LW*0.6)/N), SY=()=>E.LH*0.30, X0=()=>E.LW*0.34;
  function yard(){ bg(); const LW=E.LW,y=SY(); magician(E.ctx,LW*0.14,y,50,0);   // the wizard's robe monogram (×/积) identifies him
    const cnt=copied?N:1;                                                          // start with ONE sack; after Product's copy there are N
    for(let i=0;i<cnt;i++) sack(X0()+i*sp(),y,46,'grass',false,0,null,null,'x');
    if(!copied) label(X0(),y+44,t({en:'count unknown',zh:'数目未知'}),'#cfe6ff',12);   // short, sits under the sack (the wizard's "tap" hint is a line lower, so they never collide)
    return y; }
  function drawHerd(){ yard(); if(!copied) return; const g=herdGeo(), r=Math.max(8,Math.min(13,g.cell*0.42)); for(let i=0;i<g.centers.length;i++)calf(E.ctx,g.centers[i].x,g.centers[i].y,r,'open'); }   // the herd appears only AFTER Product makes the N copies
  // WIN payoff: the 15 calves reform into 5 groups of 3, and each sack rains its 3 bundles down to feed its own group (x = 3 each)
  const GY0=()=>SY()+E.LH*0.18, GYS=()=>E.LH*0.115, CX=g=>E.LW*0.34+g*sp();
  function groups(fed){ yard(); for(let g=0;g<N;g++) for(let j=0;j<X;j++) calf(E.ctx,CX(g),GY0()+j*GYS(),10, (g*X+j)<fed?true:'open'); }
  function recover(){ E.busy=true; E.clearTray(); E.sfx('place'); const grid=herdGeo().centers;
    const col=[]; for(let g=0;g<N;g++) for(let j=0;j<X;j++) col.push({x:CX(g),y:GY0()+j*GYS(),g});
    const MOVE=560, sy=SY()+46*0.2, STAG=52, FLY=400, total=MOVE+col.length*STAG+FLY+220;
    E.anim(total,p=>{ const tnow=p*total; yard();
      if(tnow<MOVE){ const q=tnow/MOVE, e=q*q*(3-2*q); for(let i=0;i<col.length;i++) calf(E.ctx,grid[i].x+(col[i].x-grid[i].x)*e,grid[i].y+(col[i].y-grid[i].y)*e,10,'open'); }   // reform grid → 5 columns of 3
      else { const ft=tnow-MOVE; for(let k=0;k<col.length;k++){ if(ft>=k*STAG+FLY) calf(E.ctx,col[k].x,col[k].y,10,true);
        else { calf(E.ctx,col[k].x,col[k].y,10,'open'); const tp=(ft-k*STAG)/FLY; if(tp>0){ const bx=CX(col[k].g), by=sy+(col[k].y-sy)*tp-Math.sin(tp*Math.PI)*14;
          bundle(E.ctx,bx,by,10,'#1c5a2a'); star(E.ctx,bx,by-12,3.2*(0.6+0.4*Math.sin(ft*0.02+k)),'rgba(255,243,207,.85)'); } } } }
      stat('5x = 15'); },
     ()=>{ E.busy=false; groups(N*X); E.cheer(); E.pop('nom!'); win(); }); }
  // PARITY with Q2: don't auto-copy — you CALL Product (tap the wizard) and HE copies the standard x into all N sacks.
  function callScene(){ drawHerd(); stat(N+' × x = ?');
    E.tell(t({en:'<b>The Copy Yard.</b> Here is just <b>one</b> sack, holding the standard <b class="b">x</b> — count unknown — and not a <b class="y">calf</b> in sight yet. <b class="g">Tap Product</b> the magician and he stamps out <b>'+N+'</b> copies at once; then we will see the whole <b class="y">herd</b> those <b>'+N+'</b> sacks feed.',zh:'<b>复制场。</b>这里只有 <b>一个</b>袋子，装着标准的 <b class="b">x</b>——数目未知——眼下连一头<b class="y">小牛</b>都还没出现。<b class="g">点一下魔法师"积"</b>，他一次印出 <b>'+N+'</b> 个复制袋；那时就能看见这 <b>'+N+'</b> 个袋子要喂的整群<b class="y">牛</b>。'}));
    E.clearTray(); backStep();
    const draw=()=>{ drawHerd(); const tt=performance.now()/600, p=(0.6+0.4*Math.abs(Math.sin(tt*2))).toFixed(2); label(E.LW*0.14, SY()+66, t({en:'✦ tap to copy',zh:'✦ 点我复制'}), 'rgba(203,176,255,'+p+')', 12); };   // one line below the sack label so the two never overlap
    E.scene({ actors:[{kind:'tap', id:'mage', hiCol:'rgba(52,176,106,.45)', bbox:()=>({x:E.LW*0.14-42,y:SY()-50,w:84,h:120})}], draw:draw, onPick:()=>{ if(E.busy)return; E.sceneStop(); doCast(); } }); }
  function doCast(){ E.busy=true; E.sfx('bracket'); E.speakAs('product',t({en:'Multiply!',zh:'乘！'}));
    const y=SY(), x0=X0(), COPY=720, HERD=900, total=COPY+HERD+200, g=herdGeo(), r=Math.max(8,Math.min(13,g.cell*0.42));
    E.anim(total,p=>{ const tn=p*total; bg(); magician(E.ctx,E.LW*0.14,y,50,0);
      const cph=Math.min(1,tn/COPY), e=cph*cph*(3-2*cph);
      for(let i=0;i<N;i++){ const tx=x0+i*sp(); sack(x0+(tx-x0)*e,y,46,'grass',false,0,null,null,'x'); }    // ONE sack fans out into N identical copies
      if(tn>COPY){ const shown=Math.floor(Math.min(1,(tn-COPY)/HERD)*g.centers.length); for(let k=0;k<shown;k++) calf(E.ctx,g.centers[k].x,g.centers[k].y,r,'open'); }   // then the herd those sacks feed streams in — now countable
      for(let i=0;i<N;i++) star(E.ctx,x0+i*sp(),y-30,7*(0.5+0.5*Math.sin(p*9+i)),'rgba(255,243,207,.8)');
      stat(tn<COPY?(N+' × x = ?'):(N+'x = ?')); },
     ()=>{ copied=true; E.busy=false; drawHerd(); stat(N+'x = '+TOTAL); askX(); }); }   // every sack now holds x → Nx, and the herd is revealed
  function askX(){ const wsub=TOTAL-N, wmul=TOTAL*N;
    pickPills(t({en:'<b class="g">Product</b> copied the standard <b class="b">x</b> '+N+' times: <b>'+N+' × x</b>, written simply as <b class="b">'+N+'x</b>. The <b class="y">herd</b> shows <b class="b">'+N+'x = '+TOTAL+'</b>. Share it fairly among the <b>'+N+'</b> equal sacks: <b class="b">x</b> = ? <i>(tap a token)</i>',zh:'<b class="g">"积"</b>把标准的 <b class="b">x</b> 复制了 '+N+' 次：<b>'+N+' × x</b>，简写作 <b class="b">'+N+'x</b>。<b class="y">牛群</b>显示 <b class="b">'+N+'x = '+TOTAL+'</b>。平分给 <b>'+N+'</b> 个一样的袋子：<b class="b">x</b> = ？<i>（点一个牌子）</i>'}),
       drawHerd, E.LH*0.86,
       [ {txt:{en:'x = '+wsub,zh:'x = '+wsub}, fb:{en:'That is '+TOTAL+' − '+N+'. Share the '+TOTAL+' fairly among the '+N+' sacks instead.',zh:'那是 '+TOTAL+' − '+N+'。把 '+TOTAL+' 头平分给 '+N+' 个袋子才对。'}},
         {txt:{en:'x = '+X,zh:'x = '+X}, ok:true},
         {txt:{en:'x = '+wmul,zh:'x = '+wmul}, fb:{en:'That is '+TOTAL+' × '+N+'. We are sharing '+TOTAL+', not multiplying again.',zh:'那是 '+TOTAL+' × '+N+'。我们在平分 '+TOTAL+'，不是再乘。'}} ],
       ()=>recover()); }
  callScene();
  function win(){ E.sceneStop(); E.setDots(2); E.tickQ(2); E.award(50); E.status(keq(N+'x = '+TOTAL+' , x = '+X));
    E.tell(t({en:'<b class="b">'+N+'x = '+TOTAL+'</b>, so sharing back into '+N+' sacks gives <b class="b">x = '+X+'</b>, the same answer the twin gave. And see why we write <b class="b">'+N+'x</b>, not <b>'+N+' × x</b>: the <b>×</b> looks just like the name <b class="b">x</b>, so we drop it.',zh:'<b class="b">'+N+'x = '+TOTAL+'</b>，平分回 '+N+' 个袋子就得 <b class="b">x = '+X+'</b>，和双胞胎给的答案一样。看为什么写 <b class="b">'+N+'x</b> 而不写 <b>'+N+' × x</b>：那个 <b>×</b> 长得太像名字 <b class="b">x</b>，所以省掉它。'}));
    E.clearTray(); E.addBtn(t({en:'On to the Field ▶',zh:'前往田地 ▶'}),'primary',E.advance); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
}

/* ===== Round 3 — The Measured Field: multiply two NAMED lengths to get an AREA, written short (3 × x = 3x, then a × b = ab). Figure colors: BLUE=height/rows, RED=width, GREEN=area. ===== */
function round3(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(2); E.sceneStop();
  E.setPlace(t({en:'The Measured Field',zh:'丈量的田'}));
  const BL='#5b9bff', RD='#ff7a55', GR='#46c46e';
  let rr; do{ rr=rnd(2,4); }while(rr===LR); LR=rr;   // rows count, fresh each play
  function sst(s){ E.status('<span style="font-family:\'IBM Plex Mono\',monospace;font-size:1.4rem;color:#f4c830;font-weight:600">'+s+'</span>'); }
  function bracket(x1,y1,x2,y2,col){ const ctx=E.ctx; ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=2.6; ctx.lineCap='round';
    const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy)||1, nx=-dy/L, ny=dx/L, c=8;
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
    ctx.moveTo(x1-nx*c,y1-ny*c); ctx.lineTo(x1+nx*c,y1+ny*c); ctx.moveTo(x2-nx*c,y2-ny*c); ctx.lineTo(x2+nx*c,y2+ny*c); ctx.stroke(); ctx.restore(); }
  function field(rowsLabel,colsLabel,rowsN,area){ bg(); const ctx=E.ctx;
    const cx=E.LW*0.54, RW=E.LW*0.30, RH=E.LH*0.38, gt=E.LH-54, y1=gt-80, y0=y1-RH, x0=cx-RW/2, x1=cx+RW/2;   // bottom sits clear ABOVE the green ground
    ctx.save(); ctx.fillStyle='rgba(70,196,110,.14)'; ctx.strokeStyle='#3f9a52'; ctx.lineWidth=2.6; ctx.fillRect(x0,y0,RW,RH); ctx.strokeRect(x0,y0,RW,RH); ctx.restore();
    if(rowsN){ ctx.save(); ctx.strokeStyle='rgba(91,155,255,.55)'; ctx.lineWidth=1.5; ctx.setLineDash([6,5]); for(let i=1;i<rowsN;i++){ const yy=y0+RH*i/rowsN; ctx.beginPath(); ctx.moveTo(x0,yy); ctx.lineTo(x1,yy); ctx.stroke(); } ctx.restore(); }
    bracket(x0-16,y0,x0-16,y1,BL); label(x0-42,(y0+y1)/2,rowsLabel,BL,32);                 // height = rows (blue, vertical)
    bracket(x0,y1+16,x1,y1+16,RD); label((x0+x1)/2,y1+42,colsLabel,RD,30);                  // width (red, horizontal), clear of the grass
    label(cx,(y0+y1)/2, area==='?'?t({en:'Area = ?',zh:'面积 = ?'}):area, GR, area==='?'?24:42); }   // area (green); unknown shows "Area = ?" so the ? is clearly the area
  // Step A: rr rows (a number) × x wide (a NAME) → area rr·x. Tap the answer token.
  const drawA=()=>field(String(rr),'x',rr,'?'); drawA(); sst(rr+' × x = ?');
  pickPills(t({en:'<b>The Measured Field.</b> This field is <b class="b">'+rr+'</b> rows tall and <b class="r">x</b> wide; rows times width is the <b class="g">area</b>. So the <b class="g">area</b> = ? <i>(tap a token)</i>',zh:'<b>丈量的田。</b>这片田高 <b class="b">'+rr+'</b> 行，宽 <b class="r">x</b>；行数乘宽度就是<b class="g">面积</b>。那么<b class="g">面积</b> = ？<i>（点一个牌子）</i>'}),
    drawA, E.LH*0.86,
    [ {txt:{en:'area = '+rr,zh:'面积 = '+rr}, fb:{en:'That is only the height ('+rr+' rows). Area needs the width x as well.',zh:'那只是高（'+rr+' 行）。面积还要乘上宽度 x。'}},
      {txt:{en:'area = x',zh:'面积 = x'}, fb:{en:'That is only the width. Area needs the '+rr+' rows as well.',zh:'那只是宽。面积还要乘上 '+rr+' 行。'}},
      {txt:{en:'area = '+rr+'x',zh:'面积 = '+rr+'x'}, ok:true} ],
    ()=>{ field(String(rr),'x',rr,rr+'x'); E.status(keq(rr+' × x = '+rr+'x'));
      E.tell(t({en:rr+' rows of <b class="r">x</b> make <b class="g">'+rr+'x</b> <b class="g">grass</b>, just like the sacks made Nx. A number times a name, written short.',zh:rr+' 行 <b class="r">x</b> 就是 <b class="g">'+rr+'x</b> <b class="g">草</b>，正像那些袋子是 Nx。数字乘名字，简写在一起。'}));
      E.clearTray(); E.addBtn(t({en:'Both sides a name ▶',zh:'两边都起名 ▶'}),'primary',q2); E.addBtn(t({en:'◀ Prev step',zh:'◀ 上一步'}),'ghost',E.prevStep); });
  // Step B: a rows × b wide → area ab (both NAMES now)
  function q2(){ E.sceneStop(); const drawB=()=>field('a','b',null,'?'); drawB(); sst('a × b = ?');
    pickPills(t({en:'A new field: <b class="b">a</b> rows tall, <b class="r">b</b> wide, both just <b>names</b>. The <b class="g">area</b> = ? <i>(tap a token)</i>',zh:'新的一片：高 <b class="b">a</b> 行，宽 <b class="r">b</b>，两个都只是<b>名字</b>。<b class="g">面积</b> = ？<i>（点一个牌子）</i>'}),
      drawB, E.LH*0.86,
      [ {txt:{en:'area = a',zh:'面积 = a'}, fb:{en:'That is only the height. Area is height times width.',zh:'那只是高。面积是高乘宽。'}},
        {txt:{en:'area = b',zh:'面积 = b'}, fb:{en:'That is only the width. Area is height times width.',zh:'那只是宽。面积是高乘宽。'}},
        {txt:{en:'area = ab',zh:'面积 = ab'}, ok:true} ],
      ()=>{ field('a','b',null,'ab'); win(); }); }
  function win(){ E.sceneStop(); E.setDots(3); E.tickQ(3); E.award(60); E.cheer(); E.sfx('win'); E.status(keq('a × b = ab'));
    E.tell(t({en:'<b>Two names, one area.</b> A field <b class="b">a</b> tall and <b class="r">b</b> wide grows <b class="g">ab</b> <b class="g">grass</b>. Multiplying named lengths makes an area, and we write it short: 3x, ab. You have earned the page!',zh:'<b>两个名字，一块面积。</b>高 <b class="b">a</b>、宽 <b class="r">b</b> 的田长出 <b class="g">ab</b> <b class="g">草</b>。把起了名的长度相乘就得到面积，简写在一起：3x、ab。书页到手！'}));
    E.clearTray(); E.addBtn(t({en:'Claim the Codex page 📖',zh:'领取典籍书页 📖'}),'primary',()=>E.openBook(QUEST.book)); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
}

const QUEST = {
  id:'q03', page:8, region:'cradle', bgm:'audio/bgm-cradle.mp3?v=20260606k2', next:'04',
  kicker:{en:'The Cradle',zh:'摇篮'},
  title:{en:'Naming Steps',zh:'步步起名'},
  meta:{ title:{en:'Name the Harvest',zh:'给粮食起名'}, giver:{en:'Tau the Calf · The Cradle',zh:'小牛 Tau · 摇篮'},
    flavor:{en:'"The <b class="g">grass</b> came in tied sacks, and a <b>Fogwraith</b> (one of the Unravelling\'s little servants) tangled every label, so I cannot tell how many <b class="g">bundles</b> are inside! But <b class="g">Product</b> the magician says we do not need to know yet. Give the unknown a <b>name</b>, copy it, and open the sacks when we are ready. Help me name the harvest and feed the <b class="y">herd</b>!"',
      zh:'"<b class="g">青草</b>装在扎口的袋子里运来了，可一个<b>迷雾幽灵</b>（「大解体」的一个小喽啰）把标签都缠乱了，我数不出每袋里有多少<b class="g">捆</b>！不过魔法师<b class="g">"积"</b>说，现在还不用知道。先给这个未知的数起个<b>名字</b>，复制它，等准备好了再打开袋子。帮我给这批粮食起名、喂饱<b class="y">牛群</b>吧！"'} },
  objs:[ {en:'The Tied Sacks: name what you cannot count',zh:'扎口的袋子：给数不出的起名'},
         {en:'The Copy Yard: write 5x, not 5 × x',zh:'复制场：写 5x，别写 5 × x'},
         {en:'The Measured Field: lengths make an area (3x, ab)',zh:'丈量的田：长度相乘得面积（3x、ab）'} ],
  rounds:[round1,round2,round3],
  book:{ page:3, kicker:{en:'Introduction',zh:'入门之'}, title:{en:'Give Numbers Names',zh:'给数起名字'},
    blocks:[
      {top:true, fig:'gnname', prose:{en:'A number is easy once you can count it. But an amount you cannot count yet? Give it a <b>name</b>, a letter such as <b>x</b>. Now you can reason with it before you know its size, and fill the value in later. The same name means the same amount; a different amount gets a different letter (a, b, c).',zh:'数一旦数得出来就好办。可还数不出来的量呢？给它起个<b>名字</b>，比如字母 <b>x</b>。这样在知道它有多大之前，就能先拿它来推理，回头再把数值填进去。同一个名字代表同一个量；不同的量就用不同的字母（a、b、c）。'}},
      {law:{en:'Write it short',zh:'写得简短'}, eq:'5 × <span class="b">x</span> = 5<span class="b">x</span>', fig:'gjux', prose:{en:'Now write with the name. Five of them is <b>5x</b>: number in front, and drop the times-sign because <b>×</b> is the twin of the letter <b>x</b>. Two names, <b>a × b</b>, become <b>ab</b>; and <b>x</b> alone means <b>1x</b>.',zh:'现在就用名字来写。五个就是 <b>5x</b>：数字写在前面，并把乘号去掉，因为 <b>×</b> 和字母 <b>x</b> 是一对双胞胎。两个名字 <b>a × b</b> 写成 <b>ab</b>；单独一个 <b>x</b> 就是 <b>1x</b>。'}},
      {law:{en:'Name an amount that is not a whole number',zh:'给不是整数的量起名'}, eq:'<span class="b">3</span> × <span class="r">x</span> = <span class="gr">3x</span>', fig:'garea', prose:{en:'A field <b class="b">3</b> tall and <b class="r">x</b> wide grows <b class="gr">3x</b> <b class="g">grass</b>, and <b class="r">x</b> need not be a whole number: it can be 2.5, or a third, or any length at all. The name carries the amount whatever it turns out to be.',zh:'一片高 <b class="b">3</b>、宽 <b class="r">x</b> 的田长出 <b class="gr">3x</b> 的<b class="g">草</b>，而 <b class="r">x</b> 不必是整数：它可以是 2.5，可以是三分之一，可以是任意长度。不管它最后是多少，这个名字都替它装着。'}},
      {law:{en:'Summarize a pattern with ease',zh:'轻松概括规律'}, eq:'<span class="gr">ab</span> = <span class="gr">ba</span>', fig:'glaw', prose:{en:'Name <b>both</b> sides: a field <b class="b">a</b> tall and <b class="r">b</b> wide has area <b class="gr">ab</b>. Put <b>any</b> amount in for <b class="b">a</b> and any for <b class="r">b</b>, and <b class="gr">ab = ba</b> still holds. So instead of writing 1×2 = 2×1, 1×3 = 3×1, 2×3 = 3×2, … on forever, we write it once, for every number at once.',zh:'两边都起名：高 <b class="b">a</b>、宽 <b class="r">b</b> 的田，面积是 <b class="gr">ab</b>。给 <b class="b">a</b> 填任意一个量，给 <b class="r">b</b> 填任意一个量，<b class="gr">ab = ba</b> 都成立。于是不必把 1×2 = 2×1、1×3 = 3×1、2×3 = 3×2，…… 一直写下去，我们只写一次，就把每个数都说清了。'}}
    ],
    read:{en:'A letter names an amount before you fill in its value. Five of them is 5x. The amount need not be a whole number. And one line in letters, like ab = ba, says in a single stroke what would take forever to write out number by number.',zh:'字母在你填入数值之前，先替一个量起好名字。五个就是 5x。这个量不必是整数。而一行字母，比如 ab = ba，一笔就说清了那些一个数一个数写下去永远写不完的事。'} },
  intro:(E)=>{ bg(); const LW=E.LW,y=E.LH*0.42; magician(E.ctx,LW*0.30,y-E.LH*0.04,56,0); sack(LW*0.64,y,82,'grass',false,0,'x','#7fb6ff'); }
};
window.QUEST_q03 = QUEST;
})();
