/* ORIGO · Quest 3 = the page the book skipped · "Give Numbers Names" · letters as names + the 5x shorthand. Layer 3 content.
   The Fog tangled the sack-labels, so Tau cannot count what is inside. You NAME the unknown (x), tell Product (积) to COPY it (5x),
   then UNTIE the sacks (x = 4) and read the number back (5x = 20) to feed the herd. Every step is a right/wrong decision with a real consequence. */
(function(){
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const t=s=>E.t(s);
const keq=(expr)=>'<span class="keq">'+expr+' <span class="tk">✓</span></span>';
const GRASS='#2f7a3f', WHEAT='#cf9a2a';
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
function drawHungry(n){ if(n<=0)return; const ctx=E.ctx,LW=E.LW,LH=E.LH; const sp=Math.min(26,(LW-150)/Math.max(n,1)); for(let i=0;i<n;i++) calf(ctx,112+i*sp,LH-24,11,false); }
function waitingHerd(n){ if(n<=0)return; const ctx=E.ctx,LW=E.LW,LH=E.LH; const x0=78, sp=Math.min(24,(LW-90-x0)/Math.max(n-1,1)), r=Math.min(10,sp*0.42);
  for(let i=0;i<n;i++) calf(ctx,x0+i*sp,LH-26,r,'open'); }
// "Product" the magician — copy of the pasture wizard (积), so the two quests share one face
function magician(ctx,x,y,s,tt){ tt=tt==null?1:tt; const U=s/100, P=Math.PI; ctx.save(); ctx.lineJoin='round'; ctx.lineCap='round';
  ctx.fillStyle='rgba(0,0,0,.16)'; ctx.beginPath(); ctx.ellipse(x,y+63*U,27*U,6*U,0,0,7); ctx.fill();
  const robePath=()=>{ ctx.beginPath(); ctx.moveTo(x-10*U,y+4*U); ctx.quadraticCurveTo(x-30*U,y+24*U,x-36*U,y+56*U);
    ctx.quadraticCurveTo(x-22*U,y+66*U,x-12*U,y+59*U); ctx.quadraticCurveTo(x,y+68*U,x+12*U,y+59*U);
    ctx.quadraticCurveTo(x+22*U,y+66*U,x+36*U,y+56*U); ctx.quadraticCurveTo(x+30*U,y+24*U,x+10*U,y+4*U); ctx.closePath(); };
  const robe=ctx.createLinearGradient(x-34*U,0,x+34*U,0); robe.addColorStop(0,'#ffe9a0'); robe.addColorStop(.5,'#f4c830'); robe.addColorStop(1,'#bd8c12');
  ctx.fillStyle=robe; ctx.strokeStyle='#8a6410'; ctx.lineWidth=2*U; robePath(); ctx.fill(); ctx.stroke();
  ctx.save(); robePath(); ctx.clip(); ctx.strokeStyle='rgba(110,74,10,.25)'; ctx.lineWidth=1.4*U; ctx.beginPath(); ctx.moveTo(x,y+8*U); ctx.lineTo(x,y+58*U); ctx.stroke();
  star(ctx,x-14*U,y+34*U,3*U,'rgba(255,247,207,.85)'); star(ctx,x+13*U,y+44*U,2.4*U,'rgba(255,247,207,.7)'); ctx.restore();
  ctx.fillStyle='#e3ad28'; ctx.strokeStyle='#8a6410'; ctx.lineWidth=1.4*U; ctx.beginPath(); ctx.ellipse(x,y+5*U,11*U,3.6*U,0,0,7); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#f4c830'; ctx.beginPath(); ctx.arc(x-25*U,y+40*U,5.5*U,0,7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(x+24*U,y+30*U,5.5*U,0,7); ctx.fill(); ctx.stroke();
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
function sack(cx,cy,s,kind,opened,count,tag,tagcol,inLabel){ const ctx=E.ctx; ctx.save(); ctx.lineJoin='round';
  const w=s, h=s*1.18;
  ctx.fillStyle='rgba(0,0,0,.16)'; ctx.beginPath(); ctx.ellipse(cx,cy+h*0.5,w*0.40,h*0.07,0,0,7); ctx.fill();
  const g=ctx.createLinearGradient(cx-w/2,0,cx+w/2,0);
  if(kind==='wheat'){ g.addColorStop(0,'#f0cf78'); g.addColorStop(1,'#cf9a2a'); } else { g.addColorStop(0,'#6fc97e'); g.addColorStop(1,'#2f7a3f'); }
  ctx.fillStyle=g; ctx.strokeStyle='#5a4a2a'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(cx-w*0.30,cy-h*0.30); ctx.quadraticCurveTo(cx-w*0.52,cy,cx-w*0.34,cy+h*0.40);
  ctx.quadraticCurveTo(cx,cy+h*0.54,cx+w*0.34,cy+h*0.40); ctx.quadraticCurveTo(cx+w*0.52,cy,cx+w*0.30,cy-h*0.30); ctx.closePath(); ctx.fill(); ctx.stroke();
  if(opened && inLabel==null){ const inside=kind==='wheat'?'#7a5a18':'#1c5a2a'; const cols=Math.min(count,2)||1, br=w*0.17;
    for(let i=0;i<count;i++){ const r=Math.floor(i/cols), c=i%cols, n=Math.min(count-r*cols,cols), bx=cx+(c-(n-1)/2)*w*0.30, by=cy+h*0.02+r*w*0.26 - (Math.ceil(count/cols)-1)*w*0.10; bundle(ctx,bx,by,br,inside); } }
  else { if(!opened){ ctx.save(); ctx.beginPath(); ctx.moveTo(cx-w*0.30,cy-h*0.30); ctx.quadraticCurveTo(cx-w*0.52,cy,cx-w*0.34,cy+h*0.40); ctx.quadraticCurveTo(cx,cy+h*0.54,cx+w*0.34,cy+h*0.40); ctx.quadraticCurveTo(cx+w*0.52,cy,cx+w*0.30,cy-h*0.30); ctx.closePath(); ctx.clip();
      ctx.fillStyle='rgba(20,18,40,.22)'; ctx.fillRect(cx-w,cy-h,2*w,2*h); ctx.restore(); }   // tied = foggy tint; opened sack stays bright
    const txt=inLabel==null?'?':inLabel; ctx.fillStyle=opened?'#fff0b0':'#cfe6ff';            // revealed VALUE (bright gold) vs the NAME (light blue)
    ctx.font='bold '+(s*0.5)+'px "IBM Plex Mono",monospace'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(txt,cx,cy+h*0.05); }
  // cinched, tied neck
  const neck=kind==='wheat'?'#e0b65a':'#3f9a52'; ctx.fillStyle=neck; ctx.beginPath(); ctx.moveTo(cx-w*0.30,cy-h*0.30); ctx.quadraticCurveTo(cx,cy-h*0.46,cx+w*0.30,cy-h*0.30); ctx.quadraticCurveTo(cx,cy-h*0.18,cx-w*0.30,cy-h*0.30); ctx.fill();
  ctx.strokeStyle='#6a5530'; ctx.lineWidth=2.4; ctx.beginPath(); ctx.ellipse(cx,cy-h*0.30,w*0.30,h*0.05,0,0,7); ctx.stroke();
  if(tag!=null) label(cx,cy+h*0.5+Math.max(16,s*0.30),tag,tagcol||'#caa84a',Math.round(Math.max(20,s*0.5)));   // tag scales with the sack
  ctx.restore(); }

/* ---------- a multiple-choice decision: choices look identical (the right one is never highlighted) ---------- */
function ask(prompt, choices, onRight){
  E.tell(prompt); E.clearTray(); backStep();
  const order=choices.map((c,i)=>i); for(let i=order.length-1;i>0;i--){ const j=rnd(0,i); const tmp=order[i]; order[i]=order[j]; order[j]=tmp; }
  order.forEach(i=>{ const c=choices[i]; E.addBtn(c.t,'choice',()=>{ if(E.busy)return;
    if(c.ok){ E.sfx('place'); E.pop('✓'); onRight(); }
    else { E.oops(); E.sfx('fail'); E.pop('✗'); E.tell(c.fb); } }); }); }

/* ===== Round 1 — The Tied Sacks: both sacks hold x; open the identical twin → it reads 3 and 3 grasses fly out to feed 3 calves, so x = 3. ===== */
function round1(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(0); E.cv.onclick=null;
  E.setPlace(t({en:'The Tied Sacks',zh:'扎口的袋子'}));
  const X=3, S=80;
  const Y=()=>E.LH*0.34, C1=()=>E.LW*0.32, C2=()=>E.LW*0.68, CY=()=>Y()+S*1.02;
  const st1={open:false,show:false,fed:0}, st2={open:false,show:false,fed:0};
  const pos=(cx,i)=>cx+(i-(X-1)/2)*30;
  function drawSack(cx,st){ sack(cx,Y(),S,'grass',st.open,0,null,null,st.open?String(X):'x');
    if(st.show) for(let i=0;i<X;i++) calf(E.ctx,pos(cx,i),CY(),12, i<st.fed?true:'open'); }
  function scene(){ bg(); label(C2(),Y()-S*0.72,t({en:'identical',zh:'一模一样'}),'#8a8a70',13); drawSack(C1(),st1); drawSack(C2(),st2); }
  // open a sack: it reads 3, and its 3 grasses arc down to meet 3 waiting calves; each calf turns happy as its grass lands
  function feed(cx,st,done){ E.busy=true; E.sfx('place'); st.open=true; st.show=true;
    const GAP=230, FLY=440, total=(X-1)*GAP+FLY+220, sx=cx, sy=Y()+S*0.18;
    E.anim(total,p=>{ const tnow=p*total; let fed=0; for(let i=0;i<X;i++) if(tnow>=i*GAP+FLY) fed++; st.fed=fed; scene();
      for(let i=0;i<X;i++){ const tp=(tnow-i*GAP)/FLY; if(tp<=0||tp>=1) continue; const tx=pos(cx,i),ty=CY();
        const gx=sx+(tx-sx)*tp, gy=sy+(ty-sy)*tp-Math.sin(tp*Math.PI)*26; bundle(E.ctx,gx,gy,12,'#1c5a2a');
        star(E.ctx,gx,gy-15,4*(0.6+0.4*Math.sin(tnow*0.02+i)),'rgba(255,243,207,.85)'); } },
     ()=>{ st.fed=X; scene(); E.cheer(); E.pop('nom!'); E.busy=false; done(); }); }
  scene();
  E.tell(t({en:'<b>The Tied Sacks.</b> Both sacks hold the <b>same</b> standard amount of grass, so we give that amount a <b>name</b>: <b class="b">x</b>. We cannot open the first, but its <b>identical</b> twin we can.',zh:'<b>扎口的袋子。</b>两只袋子装着<b>同样</b>多的标准青草，我们就给这个量起个<b>名字</b>：<b class="b">x</b>。第一袋打不开，但它<b>一模一样</b>的双胞胎能打开。'}));
  function q1(){ scene(); E.clearTray();
    E.addBtn(t({en:'Open the identical sack',zh:'打开一样的那袋'}),'primary',()=>feed(C2(),st2,q2)); }
  function q2(){ scene();
    ask(t({en:'The twin reads <b class="b">3</b>, and its three grasses fed <b class="g">3 calves</b>. The sacks are <b>identical</b>, so <b class="b">x</b> feeds…?',zh:'双胞胎打开是 <b class="b">3</b>，三捆草喂饱了 <b class="g">3 头小牛</b>。两袋<b>一模一样</b>，所以 <b class="b">x</b> 够几头吃？'}),
      [ {t:t({en:'x = 6 calves',zh:'x = 6 头'}), fb:t({en:'That is both sacks together. x is one standard sack, and it feeds 3.',zh:'那是两袋合起来。x 是一袋标准袋，够 3 头。'})},
        {t:t({en:'cannot tell',zh:'说不准'}), fb:t({en:'They are identical, so x feeds exactly what the twin fed.',zh:'它们一模一样，x 够吃的正是双胞胎那么多。'})},
        {t:t({en:'x = 3 calves',zh:'x = 3 头'}), ok:true} ],
      ()=>feed(C1(),st1,win)); }
  function win(){ E.setDots(1); E.tickQ(1); E.award(45); E.status(keq('x = 3'));
    E.tell(t({en:'We never opened the first sack, yet we know it: identical to the twin, so <b class="b">x = 3</b>. Its three grasses feed the same <b class="g">3 calves</b>. One name, one amount.',zh:'我们没打开第一袋，却知道了它：和双胞胎一样，所以 <b class="b">x = 3</b>。它的三捆草喂饱同样的 <b class="g">3 头小牛</b>。一个名字，一个量。'}));
    E.clearTray(); E.addBtn(t({en:'On to the Copy Yard ▶',zh:'前往复制场 ▶'}),'primary',E.advance); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
  q1();
}

/* ===== Round 2 — The Copy Yard: 5 sacks ALREADY feed the herd (15) on screen; name that picture 5×x → 5x; then recover x ===== */
function round2(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(1); E.cv.onclick=null;
  E.setPlace(t({en:'The Copy Yard',zh:'复制场'}));
  const N=5, X=3, TOTAL=N*X;
  function stat(s){ E.status('<span style="font-family:\'IBM Plex Mono\',monospace;font-size:1.45rem;color:#f4c830;font-weight:600">'+s+'</span>'); }
  function herdGeo(){ const LW=E.LW, cols=Math.min(TOTAL,10), rows=Math.ceil(TOTAL/cols), cell=Math.min(36,(LW-110)/cols,100/rows), gw=cols*cell, ox=(LW-gw)/2+8, oy=E.LH*0.56;
    const c=[]; for(let i=0;i<TOTAL;i++){ const r=Math.floor(i/cols), k=i%cols; c.push({x:ox+k*cell+cell/2,y:oy+r*cell+cell/2}); } return {cell,centers:c}; }
  const sp=()=>Math.min(50,(E.LW*0.6)/N), SY=()=>E.LH*0.30;
  function yard(){ bg(); const LW=E.LW,y=SY(); magician(E.ctx,LW*0.14,y,50,0); label(LW*0.14,y+52,'积','#caa84a',13);
    for(let i=0;i<N;i++) sack(LW*0.34+i*sp(),y,46,'grass',false,0,null,null,'x'); return y; }   // x inside each sack (was a ? mark)
  function drawFed(){ yard(); const g=herdGeo(), r=Math.max(8,Math.min(13,g.cell*0.42)); for(let i=0;i<g.centers.length;i++)calf(E.ctx,g.centers[i].x,g.centers[i].y,r,true); }   // 5 x-sacks + the 15 calves they feed
  // INSTRUCTION (shown, not a choice): 积 copies x five times; 5 × x is written 5x. Then the only graded step is finding x.
  drawFed(); stat('5 × x = 5x');
  E.busy=true; E.sfx('bracket'); E.speakAs('product',t({en:'Multiply!',zh:'乘！'}));
  E.anim(820,p=>{ drawFed(); for(let i=0;i<N;i++) star(E.ctx,E.LW*0.34+i*sp(),SY()-30,8*(0.5+0.5*Math.sin(p*9+i)),'rgba(255,243,207,.8)'); },
   ()=>{ E.busy=false; drawFed(); stat('5x = 15');
     ask(t({en:'<b class="b">积</b> copied the standard <b class="b">x</b> five times: <b>5 × x</b>, written simply as <b class="b">5x</b>. The herd shows <b class="b">5x = 15</b>. Share it fairly among the <b>5</b> equal sacks: <b class="b">x</b> = ?',zh:'<b class="b">“积”</b>把标准的 <b class="b">x</b> 复制了五次：<b>5 × x</b>，简写作 <b class="b">5x</b>。牛群显示 <b class="b">5x = 15</b>。平分给 <b>5</b> 个一样的袋子：<b class="b">x</b> = ?'}),
       [ {t:t({en:'x = 10',zh:'x = 10'}), fb:t({en:'That is 15 − 5. Share the 15 fairly among the 5 sacks instead.',zh:'那是 15 − 5。把 15 头平分给 5 个袋子才对。'})},
         {t:t({en:'x = 75',zh:'x = 75'}), fb:t({en:'That is 15 × 5. We are sharing 15, not multiplying again.',zh:'那是 15 × 5。我们在平分 15，不是再乘。'})},
         {t:t({en:'x = 3',zh:'x = 3'}), ok:true} ],
       ()=>{ drawFed(); win(); }); });
  function win(){ E.setDots(2); E.tickQ(2); E.award(50); E.status(keq('5x = 15 , x = 3'));
    E.tell(t({en:'<b class="b">5x = 15</b>, so sharing back into 5 sacks gives <b class="b">x = 3</b>, the same answer the twin gave. And see why we write <b class="b">5x</b>, not <b>5 × x</b>: the <b>×</b> looks just like the name <b class="b">x</b>, so we drop it. Five of them is simply <b class="b">5x</b>.',zh:'<b class="b">5x = 15</b>，平分回 5 个袋子就得 <b class="b">x = 3</b>，和双胞胎给的答案一样。看为什么写 <b class="b">5x</b> 而不写 <b>5 × x</b>：那个 <b>×</b> 长得太像名字 <b class="b">x</b> 了，所以省掉它。五份就简写成 <b class="b">5x</b>。'}));
    E.clearTray(); E.addBtn(t({en:'On to the Field ▶',zh:'前往田地 ▶'}),'primary',E.advance); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
}

/* ===== Round 3 — The Measured Field: multiply two NAMED lengths to get an AREA, written short (3 × x = 3x, then a × b = ab). Figure colors: BLUE=height/rows, RED=width, GREEN=area. ===== */
function round3(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(2); E.cv.onclick=null;
  E.setPlace(t({en:'The Measured Field',zh:'丈量的田'}));
  const BL='#5b9bff', RD='#ff7a55', GR='#46c46e';
  function bracket(x1,y1,x2,y2,col){ const ctx=E.ctx; ctx.save(); ctx.strokeStyle=col; ctx.lineWidth=2.6; ctx.lineCap='round';
    const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy)||1, nx=-dy/L, ny=dx/L, c=8;
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
    ctx.moveTo(x1-nx*c,y1-ny*c); ctx.lineTo(x1+nx*c,y1+ny*c); ctx.moveTo(x2-nx*c,y2-ny*c); ctx.lineTo(x2+nx*c,y2+ny*c); ctx.stroke(); ctx.restore(); }
  function field(rowsLabel,colsLabel,rowsN,area){ bg(); const ctx=E.ctx;
    const cx=E.LW*0.54, RW=E.LW*0.30, RH=E.LH*0.46, x0=cx-RW/2, y0=E.LH*0.16, x1=cx+RW/2, y1=y0+RH;
    ctx.save(); ctx.fillStyle='rgba(70,196,110,.14)'; ctx.strokeStyle='#3f9a52'; ctx.lineWidth=2.6; ctx.fillRect(x0,y0,RW,RH); ctx.strokeRect(x0,y0,RW,RH); ctx.restore();
    if(rowsN){ ctx.save(); ctx.strokeStyle='rgba(91,155,255,.55)'; ctx.lineWidth=1.5; ctx.setLineDash([6,5]); for(let i=1;i<rowsN;i++){ const yy=y0+RH*i/rowsN; ctx.beginPath(); ctx.moveTo(x0,yy); ctx.lineTo(x1,yy); ctx.stroke(); } ctx.restore(); }
    bracket(x0-16,y0,x0-16,y1,BL); label(x0-42,(y0+y1)/2,rowsLabel,BL,32);                 // height = rows (blue, vertical)
    bracket(x0,y1+18,x1,y1+18,RD); label((x0+x1)/2,y1+50,colsLabel,RD,32);                  // width (red, horizontal)
    label(cx,(y0+y1)/2,area,GR,area==='?'?54:42); }                                         // area (green)
  // Step A: 3 rows (a number) × x wide (a NAME) → area 3x
  field('3','x',3,'?');
  E.tell(t({en:'<b>The Measured Field.</b> This grass field is <b class="b">3</b> rows tall and <b class="r">x</b> wide. Rows times width is the <b class="g">area</b>, the grass it grows. So the area is…?',zh:'<b>丈量的田。</b>这片草田高 <b class="b">3</b> 行，宽 <b class="r">x</b>。行数乘宽度就是<b class="g">面积</b>，也就是它长出的草。那么面积是……？'}));
  ask(t({en:'<b class="b">3</b> rows, each <b class="r">x</b> wide. The <b class="g">area</b> = ?',zh:'<b class="b">3</b> 行，每行宽 <b class="r">x</b>。<b class="g">面积</b> = ?'}),
    [ {t:t({en:'area = 3',zh:'面积 = 3'}), fb:t({en:'That is only the height (3 rows). Area needs the width x as well.',zh:'那只是高（3 行）。面积还要乘上宽度 x。'})},
      {t:t({en:'area = x',zh:'面积 = x'}), fb:t({en:'That is only the width. Area needs the 3 rows as well.',zh:'那只是宽。面积还要乘上 3 行。'})},
      {t:t({en:'area = 3x',zh:'面积 = 3x'}), ok:true} ],
    ()=>{ field('3','x',3,'3x'); E.cheer(); E.sfx('place'); E.status(keq('3 × x = 3x'));
      E.tell(t({en:'Three rows of <b class="r">x</b> make <b class="g">3x</b> grass, just like 5 sacks made 5x. A number times a name, written short.',zh:'三行 <b class="r">x</b> 就是 <b class="g">3x</b> 草，正像 5 袋是 5x。数字乘名字，简写在一起。'}));
      E.clearTray(); E.addBtn(t({en:'Both sides a name ▶',zh:'两边都起名 ▶'}),'primary',q2); E.addBtn(t({en:'◀ Prev step',zh:'◀ 上一步'}),'ghost',E.prevStep); });
  // Step B: a rows × b wide → area ab (both NAMES now)
  function q2(){ field('a','b',null,'?');
    ask(t({en:'A new field: <b class="b">a</b> rows tall, <b class="r">b</b> wide, both just <b>names</b>. The <b class="g">area</b> = ?',zh:'新的一片：高 <b class="b">a</b> 行，宽 <b class="r">b</b>，两个都只是<b>名字</b>。<b class="g">面积</b> = ?'}),
      [ {t:t({en:'area = a',zh:'面积 = a'}), fb:t({en:'That is only the height. Area is height times width.',zh:'那只是高。面积是高乘宽。'})},
        {t:t({en:'area = b',zh:'面积 = b'}), fb:t({en:'That is only the width. Area is height times width.',zh:'那只是宽。面积是高乘宽。'})},
        {t:t({en:'area = ab',zh:'面积 = ab'}), ok:true} ],
      ()=>{ field('a','b',null,'ab'); win(); }); }
  function win(){ E.setDots(3); E.tickQ(3); E.award(60); E.cheer(); E.sfx('win'); E.status(keq('a × b = ab'));
    E.tell(t({en:'<b>Two names, one area.</b> A field <b class="b">a</b> tall and <b class="r">b</b> wide grows <b class="g">ab</b> grass. Multiplying named lengths makes an area, and we write it short: 3x, ab. You have earned the page!',zh:'<b>两个名字，一块面积。</b>高 <b class="b">a</b>、宽 <b class="r">b</b> 的田长出 <b class="g">ab</b> 草。把起了名的长度相乘就得到面积，简写在一起：3x、ab。书页到手！'}));
    E.clearTray(); E.addBtn(t({en:'Claim the Codex page 📖',zh:'领取典籍书页 📖'}),'primary',()=>E.openBook(QUEST.book)); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
}
function grazeWin(drawGeo,done){ E.busy=true; E.clearTray(); const total=drawGeo(1).centers.length, geo0=drawGeo(1), r=Math.max(9,Math.min(14,geo0.cell*0.42));
  E.anim(1200,p=>{ const g=drawGeo(1); const k=Math.floor(p*total); for(let i=0;i<k;i++)calf(E.ctx,g.centers[i].x,g.centers[i].y,r,true); },
   ()=>{ const g=drawGeo(1); for(let i=0;i<total;i++)calf(E.ctx,g.centers[i].x,g.centers[i].y,r,true); E.cheer(); E.pop('nom!'); E.sfx('win'); E.busy=false; done(); }); }

const QUEST = {
  id:'q03', page:8, region:'cradle', bgm:'audio/bgm-cradle.mp3?v=20260606k2',
  kicker:{en:'The Cradle',zh:'摇篮'},
  title:{en:'Naming Steps',zh:'步步起名'},
  meta:{ title:{en:'Name the Harvest',zh:'给粮食起名'}, giver:{en:'Tau the Calf · The Cradle',zh:'小牛 Tau · 摇篮'},
    flavor:{en:'"The grass came in tied sacks, and the <b>Fog</b> tangled every label, so I cannot tell how many bundles are inside! But <b>Product</b> the magician says we do not need to know yet. Give the unknown a <b>name</b>, copy it, and open the sacks when we are ready. Help me name the harvest and feed the herd!"',
      zh:'"青草装在扎口的袋子里运来了，可<b>迷雾</b>把标签都缠乱了，我数不出每袋里有多少捆！不过魔法师<b>“积”</b>说，现在还不用知道。先给这个未知的数起个<b>名字</b>，复制它，等准备好了再打开袋子。帮我给这批粮食起名、喂饱牛群吧！"'} },
  objs:[ {en:'The Tied Sacks: name what you cannot count',zh:'扎口的袋子：给数不出的起名'},
         {en:'The Copy Yard: write 5x, not 5 × x',zh:'复制场：写 5x，别写 5 × x'},
         {en:'The Measured Field: lengths make an area (3x, ab)',zh:'丈量的田：长度相乘得面积（3x、ab）'} ],
  rounds:[round1,round2,round3],
  book:{ page:3, kicker:{en:'Introduction',zh:'入门之'}, title:{en:'Give Numbers Names',zh:'给数起名字'},
    blocks:[
      {top:true, fig:'gnname', prose:{en:'A number is easy to work with once you can count it. But what about an amount you cannot count yet? Give it a <b>name</b>: a letter such as <b>x</b>. Now you can reason about it before you know its size, and fill the value in later. The same name always means the same number; a different amount gets a different letter (a, b, c).'}},
      {law:{en:'Write it short: 5x'}, eq:'5 × <span class="b">x</span> = 5<span class="b">x</span>', fig:'gjux', prose:{en:'Now write with the name. Five of them, x + x + x + x + x, is <b>5x</b>: the number goes in front, and we drop the times-sign because <b>×</b> is the twin of the letter <b>x</b>. Two names together, <b>a × b</b>, become <b>ab</b>, and <b>x</b> on its own means <b>1x</b>.'}},
      {law:{en:'Fill it in'}, eq:'<span class="b">x</span> = 4,&nbsp; 5<span class="b">x</span> = <span class="gr">20</span>', fig:'gfill', prose:{en:'A name is a slot you fill. Put a value in and read the number back: if <b>x = 4</b>, then <b>5x = 5 × 4 = 20</b>. One line of working now serves every value you choose.'}},
      {law:{en:'One line for every number'}, eq:'<span class="b">ab</span> = <span class="b">ba</span>', fig:'glaw', prose:{en:'And the prize: a name can speak for <b>every</b> number at once. The laws you proved by counting hold whatever the numbers are: <b>ab = ba</b>, and <b>a(b+c) = ab + ac</b>.'}},
      {note:{en:'<b>Next.</b> Give two sides the names <b>a</b> and <b>b</b>, and a whole field becomes one rule: its area is <b>ab</b>.'}}
    ],
    read:{en:'A letter is a name for a number you haven’t filled in. Write 5x for five of them; fill in a value to read the answer; and one line of letters can speak for every number.'} },
  intro:(E)=>{ bg(); const LW=E.LW,y=E.LH*0.42; sack(LW*0.37,y,82,'grass',false,0,'x','#7fb6ff'); sack(LW*0.63,y,82,'grass',false,0,'x','#7fb6ff'); }
};
window.QUEST_q03 = QUEST;
})();
