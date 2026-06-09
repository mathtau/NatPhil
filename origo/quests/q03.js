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
function sack(cx,cy,s,kind,opened,count,tag,tagcol){ const ctx=E.ctx; ctx.save(); ctx.lineJoin='round';
  const w=s, h=s*1.18;
  ctx.fillStyle='rgba(0,0,0,.16)'; ctx.beginPath(); ctx.ellipse(cx,cy+h*0.5,w*0.40,h*0.07,0,0,7); ctx.fill();
  const g=ctx.createLinearGradient(cx-w/2,0,cx+w/2,0);
  if(kind==='wheat'){ g.addColorStop(0,'#f0cf78'); g.addColorStop(1,'#cf9a2a'); } else { g.addColorStop(0,'#6fc97e'); g.addColorStop(1,'#2f7a3f'); }
  ctx.fillStyle=g; ctx.strokeStyle='#5a4a2a'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.moveTo(cx-w*0.30,cy-h*0.30); ctx.quadraticCurveTo(cx-w*0.52,cy,cx-w*0.34,cy+h*0.40);
  ctx.quadraticCurveTo(cx,cy+h*0.54,cx+w*0.34,cy+h*0.40); ctx.quadraticCurveTo(cx+w*0.52,cy,cx+w*0.30,cy-h*0.30); ctx.closePath(); ctx.fill(); ctx.stroke();
  if(opened){ const inside=kind==='wheat'?'#7a5a18':'#1c5a2a'; const cols=Math.min(count,2)||1, br=w*0.17;
    for(let i=0;i<count;i++){ const r=Math.floor(i/cols), c=i%cols, n=Math.min(count-r*cols,cols), bx=cx+(c-(n-1)/2)*w*0.30, by=cy+h*0.02+r*w*0.26 - (Math.ceil(count/cols)-1)*w*0.10; bundle(ctx,bx,by,br,inside); } }
  else { ctx.save(); ctx.beginPath(); ctx.moveTo(cx-w*0.30,cy-h*0.30); ctx.quadraticCurveTo(cx-w*0.52,cy,cx-w*0.34,cy+h*0.40); ctx.quadraticCurveTo(cx,cy+h*0.54,cx+w*0.34,cy+h*0.40); ctx.quadraticCurveTo(cx+w*0.52,cy,cx+w*0.30,cy-h*0.30); ctx.closePath(); ctx.clip();
    ctx.fillStyle='rgba(20,18,40,.22)'; ctx.fillRect(cx-w,cy-h,2*w,2*h); ctx.restore();
    ctx.fillStyle='rgba(255,255,255,.9)'; ctx.font='bold '+(s*0.46)+'px "IBM Plex Mono",monospace'; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('?',cx,cy+h*0.05); }
  // cinched, tied neck
  const neck=kind==='wheat'?'#e0b65a':'#3f9a52'; ctx.fillStyle=neck; ctx.beginPath(); ctx.moveTo(cx-w*0.30,cy-h*0.30); ctx.quadraticCurveTo(cx,cy-h*0.46,cx+w*0.30,cy-h*0.30); ctx.quadraticCurveTo(cx,cy-h*0.18,cx-w*0.30,cy-h*0.30); ctx.fill();
  ctx.strokeStyle='#6a5530'; ctx.lineWidth=2.4; ctx.beginPath(); ctx.ellipse(cx,cy-h*0.30,w*0.30,h*0.05,0,0,7); ctx.stroke();
  if(tag!=null) label(cx,cy+h*0.5+16,tag,tagcol||'#caa84a',19);
  ctx.restore(); }

/* ---------- a multiple-choice decision: choices look identical (the right one is never highlighted) ---------- */
function ask(prompt, choices, onRight){
  E.tell(prompt); E.clearTray(); backStep();
  const order=choices.map((c,i)=>i); for(let i=order.length-1;i>0;i--){ const j=rnd(0,i); const tmp=order[i]; order[i]=order[j]; order[j]=tmp; }
  order.forEach(i=>{ const c=choices[i]; E.addBtn(c.t,'choice',()=>{ if(E.busy)return;
    if(c.ok){ E.sfx('place'); E.pop('✓'); onRight(); }
    else { E.oops(); E.sfx('fail'); E.pop('✗'); E.tell(c.fb); } }); }); }

/* ===== Round 1 — The Tied Sacks: x is GIVEN (the standard sack). REUSE it for the same sack (→2x), then OPEN one to find x = 4, so 2x = 8. Nothing is a free choice. ===== */
function round1(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(0); E.cv.onclick=null;
  E.setPlace(t({en:'The Tied Sacks',zh:'扎口的袋子'}));
  const X=4;
  function tot(s){ E.status(s?'<span style="font-family:\'IBM Plex Mono\',monospace;font-size:1.5rem;color:#f4c830;font-weight:600">'+s+'</span>':''); }
  function scene(g2,opened){ bg(); const LW=E.LW, y=E.LH*0.40, s=56;
    sack(LW*0.40,y,s,'grass',!!opened,X,'x','#7fb6ff');          // the STANDARD sack — already named x (given)
    sack(LW*0.58,y,s,'grass',!!opened,X, g2 ,'#7fb6ff'); }       // a second standard sack (same → also x)
  scene(null,false); tot('x');
  E.tell(t({en:'<b>The Tied Sacks.</b> We cannot open them yet, but the quartermaster already calls one <b>standard</b> grass sack <b class="b">x</b>: we do not know the count, yet every standard sack holds the <b>same</b> x.',zh:'<b>扎口的袋子。</b>现在还打不开，但管粮的早把一袋<b>标准</b>青草叫作 <b class="b">x</b>：具体多少不知道，可每一袋标准袋装的都是<b>同样</b>的 x。'}));
  function q1(){ scene(null,false); tot('x');
    ask(t({en:'Tau sets down a <b>second standard</b> grass sack, the same as the first. How many bundles does it hold?',zh:'陶又放下<b>第二袋标准</b>青草，和第一袋一样。它装着多少捆？'}),
      [ {t:t({en:'Guess a number',zh:'猜一个数'}), fb:t({en:'A standard sack cannot be counted yet. But we already know what it equals.',zh:'标准袋现在数不出。但我们已经知道它等于什么了。'})},
        {t:t({en:'A new name',zh:'起个新名字'}), fb:t({en:'It is the same standard sack, so a new name would pretend it differs. Reuse x.',zh:'它是同样的标准袋，起新名字就等于说它不一样。还是用 x。'})},
        {t:t({en:'It is x',zh:'就是 x'}), ok:true} ],
      ()=>{ scene('x',false); tot('x , x'); q2(); }); }
  function q2(){ scene('x',false); tot('x , x');
    ask(t({en:'Both sacks are <b class="b">x</b>. So the two standard sacks <b>together</b> hold…?',zh:'两袋都是 <b class="b">x</b>。那两袋标准袋<b>合起来</b>是多少？'}),
      [ {t:'x + 2', fb:t({en:'That is x and 2 more bundles, not two whole sacks.',zh:'那是 x 再加 2 捆，不是两整袋。'})},
        {t:t({en:'a number',zh:'一个具体数'}), fb:t({en:'We still do not know x, only that there are two of them.',zh:'我们还不知道 x，只知道有两袋。'})},
        {t:'2x', ok:true} ],
      ()=>{ scene('x',false); tot('2x'); q3(); }); }
  function q3(){ scene('x',false); tot('2x');
    ask(t({en:'Now <b>open</b> a standard sack: it holds <b>4</b> bundles, so <b class="b">x = 4</b>. Then the two sacks, <b class="b">2x</b>, hold…?',zh:'现在<b>打开</b>一袋标准袋：里面是 <b>4</b> 捆，所以 <b class="b">x = 4</b>。那两袋（<b class="b">2x</b>）一共是多少？'}),
      [ {t:'6', fb:t({en:'That is 4 + 2. 2x means two whole x’s, so 2 × 4.',zh:'那是 4 + 2。2x 是两整个 x，也就是 2 × 4。'})},
        {t:'42', fb:t({en:'Those are just the digits stuck together. Work out 2 × 4.',zh:'那只是把数字拼在一起。算一算 2 × 4。'})},
        {t:'8', ok:true} ],
      ()=>{ scene('x',true); tot('x = 4 → 2x = 8'); win(); }); }
  function win(){ E.setDots(1); E.tickQ(1); E.award(45); E.status(keq('x = 4 → 2x = 8'));
    E.tell(t({en:'See what the name did. We wrote <b class="b">2x</b> for the two sacks <b>before</b> we knew the count, then opened one to find <b class="b">x = 4</b>, so <b class="b">2x = 8</b>. A name holds a number until you are ready to fill it in.',zh:'看看名字的妙处。在还不知道数目时，我们就把两袋写成了 <b class="b">2x</b>；打开一看 <b class="b">x = 4</b>，于是 <b class="b">2x = 8</b>。名字替你把这个数先存着，等你准备好再填进去。'}));
    E.clearTray(); E.addBtn(t({en:'On to the Copy Yard ▶',zh:'前往复制场 ▶'}),'primary',E.advance); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
  q1();
}

/* ===== Round 2 — The Copy Yard: WRITE 5x (drop the × so 积 reads it right) ===== */
function round2(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(1); E.cv.onclick=null;
  E.setPlace(t({en:'The Copy Yard',zh:'复制场'}));
  const N=5;
  function scene(copies){ bg(); const LW=E.LW, y=E.LH*0.42; magician(E.ctx,LW*0.16,y,46,0); label(LW*0.16,y+50,'积','#caa84a',13);
    const k=copies||1; for(let i=0;i<k;i++){ const x=LW*0.40+i*Math.min(46,(LW*0.55)/Math.max(k,1)); sack(x,y,44,'grass',false,0,'x','#7fb6ff'); }
    waitingHerd(N); }
  scene(1);
  E.tell(t({en:'<b>The Copy Yard.</b> The herd is <b>'+N+'</b> calves, each needs one grass sack. <b>Product (积)</b> will <b>copy</b> the <b class="b">x</b>-sack. Tell 积: copy it <b>'+N+'</b> times. Write it.',zh:'<b>复制场。</b>牛群有 <b>'+N+'</b> 头小牛，每头要一袋青草。魔法师<b>“积”</b>会<b>复制</b>这袋 <b class="b">x</b>。告诉“积”：复制 <b>'+N+'</b> 次。把它写出来。'}));
  ask(t({en:'Write “'+N+' copies of x”:',zh:'写出“'+N+' 份 x”：'}),
    [ {t:'5 × x', fb:t({en:'积 reads the × as the sack-name x and grabs the wrong sack! When a letter is there, drop the ×.',zh:'“积”把 × 当成了袋名 x，抓错袋子！有字母时就把 × 去掉。'})},
      {t:'x5', fb:t({en:'The number goes in front: 5x, not x5.',zh:'数字写在前面：5x，不是 x5。'})},
      {t:'5 + x', fb:t({en:'That adds 5, it does not make 5 copies.',zh:'那是加 5，不是复制 5 份。'})},
      {t:'5x', ok:true} ],
    ()=>cast());
  function cast(){ E.busy=true; E.sfx('bracket'); E.speakAs('product',t({en:'Multiply!',zh:'乘！'}));
    E.anim(700,p=>{ const LW=E.LW,y=E.LH*0.42; const k=1+Math.floor(p*(N-1)); scene(k); magician(E.ctx,LW*0.16,y,48,p);
      const sp=Math.min(46,(LW*0.55)/N); for(let i=0;i<k;i++){ const sx=LW*0.40+i*sp; star(E.ctx,sx,y-30,7*(0.5+0.5*Math.sin(p*9+i)),'rgba(255,243,207,.8)'); } },
     ()=>{ scene(N); E.busy=false; win(); }); }
  function win(){ E.setDots(2); E.tickQ(2); E.award(50); E.status(keq('5x = x+x+x+x+x'));
    E.tell(t({en:'积 copies: <b class="b">5x</b> sacks, that is x + x + x + x + x. <b>Five lots of x</b>, with the number in front and no cross.',zh:'“积”复制出：<b class="b">5x</b> 袋，也就是 x + x + x + x + x。<b>五份 x</b>，数字在前，不写叉号。'}));
    E.clearTray(); E.addBtn(t({en:'On to Untie the Sacks ▶',zh:'前往解开袋子 ▶'}),'primary',E.advance); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
}

/* ===== Round 3 — Untie the Sacks: FILL IN the value, read the number back, feed the herd ===== */
function round3(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(2); E.cv.onclick=null;
  E.setPlace(t({en:'Untie the Sacks',zh:'解开袋子'}));
  const X=4, N=5, TOTAL=N*X;
  // the herd to feed = TOTAL calves; grazeWin-style geometry
  function herdGeo(){ const LW=E.LW, cols=Math.min(TOTAL,10), rows=Math.ceil(TOTAL/cols), cell=Math.min(40,(LW-110)/cols,118/rows), gw=cols*cell, ox=(LW-gw)/2+8, oy=E.LH*0.50;
    const centers=[]; for(let i=0;i<TOTAL;i++){ const r=Math.floor(i/cols), c=i%cols; centers.push({x:ox+c*cell+cell/2,y:oy+r*cell+cell/2}); } return {cell,centers}; }
  function sacksRow(){ bg(); const LW=E.LW, y=E.LH*0.26, sp=Math.min(56,(LW-80)/N); for(let i=0;i<N;i++) sack(LW/2+(i-(N-1)/2)*sp,y,42,'grass',true,X,X,'#7fb6ff'); }
  function openRow(){ bg(); const LW=E.LW, y=E.LH*0.26, sp=Math.min(56,(LW-80)/N); for(let i=0;i<N;i++) sack(LW/2+(i-(N-1)/2)*sp,y,42,'grass',true,X,'x','#7fb6ff'); }
  function feedScene(p){ const LW=E.LW, y=E.LH*0.22, sp=Math.min(50,(LW-80)/N); bg(); for(let i=0;i<N;i++) sack(LW/2+(i-(N-1)/2)*sp,y,38,'grass',true,X,X,'#9fe0a8'); return herdGeo(); }
  openRow();
  E.tell(t({en:'<b>Untie the Sacks.</b> We opened one at the start, so we know <b class="b">x = 4</b>. Now untie all <b>5</b> for the herd, <b>5x</b> bundles in all.',zh:'<b>解开袋子。</b>开头我们打开过一袋，已经知道 <b class="b">x = 4</b>。现在把全部 <b>5</b> 袋都解开喂牛群，一共 <b>5x</b> 捆。'}));
  function q1(){ openRow();
    ask(t({en:'Each sack holds 4, so <b class="b">x = 4</b>. Then <b class="b">5x</b> bundles is…?',zh:'每袋装 4，所以 <b class="b">x = 4</b>。那么 <b class="b">5x</b> 捆是多少？'}),
      [ {t:'54', fb:t({en:'That just sticks the digits together. 5x means 5 × x.',zh:'那只是把数字拼在一起。5x 是 5 × x。'})},
        {t:'9', fb:t({en:'That is 5 + 4. We need five lots of 4.',zh:'那是 5 + 4。我们要的是五份 4。'})},
        {t:'20', ok:true},
        {t:'24', fb:t({en:'Close. Count again: 5 × 4.',zh:'差一点，再算：5 × 4。'})} ],
      ()=>{ E.status(keq('5x = 5 × 4 = 20')); grazeWin(feedScene, q2); }); }
  function q2(){ const LW=E.LW; const draw=()=>{ feedScene(1); const g=herdGeo(); const r=Math.max(9,Math.min(14,g.cell*0.42)); for(let i=0;i<g.centers.length;i++)calf(E.ctx,g.centers[i].x,g.centers[i].y,r,true); };
    draw();
    ask(t({en:'Fed! Now a <b>new</b> cart: each sack holds only <b>2</b>, so <b class="b">x = 2</b>. The same rule, <b class="b">5x</b>, gives…?',zh:'喂饱啦！又来一车<b>新的</b>：每袋只有 <b>2</b>，所以 <b class="b">x = 2</b>。同样的 <b class="b">5x</b>，这次是多少？'}),
      [ {t:'7', fb:t({en:'That is 5 + 2. 5x means 5 × x.',zh:'那是 5 + 2。5x 是 5 × x。'})},
        {t:'52', fb:t({en:'Digits stuck together again. Try 5 × 2.',zh:'又把数字拼起来了。试试 5 × 2。'})},
        {t:'10', ok:true} ],
      ()=>{ draw(); win(); }); }
  function win(){ E.setDots(3); E.tickQ(3); E.award(60); E.status(keq('x = 4 → 5x = 20 ;  x = 2 → 5x = 10'));
    E.cheer(); E.sfx('win');
    E.tell(t({en:'<b>Same name, any value.</b> Fill in <b class="b">x = 4</b> and 5x is 20; fill in <b class="b">x = 2</b> and 5x is 10. One name did the work of every number. You have earned the page!',zh:'<b>同一个名字，任意取值。</b>填 <b class="b">x = 4</b>，5x 就是 20；填 <b class="b">x = 2</b>，5x 就是 10。一个名字顶得上所有的数。书页到手！'}));
    E.clearTray(); E.addBtn(t({en:'Claim the Codex page 📖',zh:'领取典籍书页 📖'}),'primary',()=>E.openBook(QUEST.book)); E.addBtn(t({en:'↻ Replay (no EXP)',zh:'↻ 重玩（无经验）'}),'ghost',E.replayStep); }
  q1();
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
         {en:'Untie the Sacks: fill in the value',zh:'解开袋子：代入取值'} ],
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
  intro:(E)=>{ bg(); const LW=E.LW,y=E.LH*0.4; sack(LW*0.42,y,58,'grass',false,0,'x','#7fb6ff'); sack(LW*0.58,y,58,'grass',false,0,'x','#7fb6ff'); }
};
window.QUEST_q03 = QUEST;
})();
