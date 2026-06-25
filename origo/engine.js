/* ORIGO · engine.js — Layer 1. HUD/flow, save, i18n, audio, scene helpers, crossing outcome.
   A quest module calls E.boot(QUEST). Quests use E.* helpers + FIG.* figures. */
(function(){
const $=id=>document.getElementById(id);
const E = { busy:false, fed:false, MAXX:9, padL:30, padR:24 };
window.E = E;

/* ---------- save schema (single source) ---------- */
const DEF={ xp:0, level:1, need:100, act:'cradle', quests:{}, pages:[], audio:{music:true,sfx:true,narr:false,vSigma:'',vProduct:'',vTau:'',vver:4} };
function load(){ try{ return Object.assign({},DEF,JSON.parse(localStorage.getItem('origo')||'{}')); }catch(_){ return Object.assign({},DEF); } }
let S = load();
E.save = ()=>{ try{ localStorage.setItem('origo',JSON.stringify(S)); }catch(_){ } };
E.state = S;

/* ---------- i18n ---------- */
const params=new URLSearchParams(location.search);
E.lang = (params.get('lang')==='zh') ? 'zh' : 'en';
E.t = s => (s && typeof s==='object') ? (s[E.lang]||s.en||'') : (s||'');
document.documentElement.lang = E.lang==='zh'?'zh':'en';

/* ---------- audio: real CC0 SFX files (WebAudio buffers) + a looping music file; synth fallback ---------- */
const AUDIO_V='20260606k2';
const A = { ctx:null, master:null, bgmGain:null, bgmTimer:null, bgmStep:0, bgmOn:false, voices:[], sfxBuf:{}, sfxLoaded:false };
A.ensure=function(){ if(!this.ctx){ const AC=window.AudioContext||window.webkitAudioContext; if(!AC)return; this.ctx=new AC();
  this.master=this.ctx.createGain(); this.master.gain.value=.9; this.master.connect(this.ctx.destination); }
  if(this.ctx.state==='suspended') this.ctx.resume(); A.loadSfx(); };
A.loadSfx=function(){ if(A.sfxLoaded||!A.ctx) return; A.sfxLoaded=true;
  ['place','win','fail','level','bracket','tick'].forEach(n=>{ fetch('audio/sfx-'+n+'.mp3?v='+AUDIO_V)
    .then(r=>r.arrayBuffer()).then(b=>A.ctx.decodeAudioData(b)).then(buf=>{ A.sfxBuf[n]=buf; }).catch(()=>{}); }); };
A.tone=function(f,dur,type,vol,slideTo,dest){ if(!this.ctx)return; const t=this.ctx.currentTime, o=this.ctx.createOscillator(), g=this.ctx.createGain();
  o.type=type||'sine'; o.frequency.setValueAtTime(f,t); if(slideTo)o.frequency.exponentialRampToValueAtTime(slideTo,t+dur);
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol||.18,t+.012); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g); g.connect(dest||this.master); o.start(t); o.stop(t+dur+.03); };
A.synthSfx=function(name){
  if(name==='place'){ A.tone(300,.08,'triangle',.16,420); }
  else if(name==='win'){ A.tone(540,.12,'sine',.2,720); setTimeout(()=>A.tone(820,.2,'sine',.18),90); }
  else if(name==='fail'){ A.tone(220,.36,'sawtooth',.2,80); }
  else if(name==='level'){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>A.tone(f,.22,'triangle',.18),i*110)); }
  else if(name==='bracket'){ A.tone(180,.06,'square',.16,260); }
  else if(name==='tick'){ A.tone(660,.05,'sine',.1); } };
E.sfx=function(name){ if(!S.audio.sfx) return; A.ensure(); if(!A.ctx) return;
  const buf=A.sfxBuf[name];
  if(buf){ const s=A.ctx.createBufferSource(); s.buffer=buf; const g=A.ctx.createGain(); g.gain.value=.9; s.connect(g); g.connect(A.master); s.start(); }
  else A.synthSfx(name); };
/* BGM: a real looping audio file (generated CC0 ambient track), per region */
A.bgmEl=null; A.bgmFade=null; A.bgmPlays=0; const BGM_LOOPS=3;
E.bgmStart=function(){ if(!S.audio.music) return;
  if(!A.bgmEl){ A.bgmEl=new Audio((E.QUEST&&E.QUEST.bgm)||'audio/bgm-cradle.mp3?v='+AUDIO_V); A.bgmEl.loop=true; A.bgmEl.volume=0; A.bgmEl.preload='auto'; E._bgm=A.bgmEl; }   // loop forever (user: keep looping, no 3-round cap)
  A.bgmPlays=0;
  const tgt=.55; A.bgmEl.play().then(()=>{ if(A.bgmFade)clearInterval(A.bgmFade);
    A.bgmFade=setInterval(()=>{ A.bgmEl.volume=Math.min(tgt,A.bgmEl.volume+.04); if(A.bgmEl.volume>=tgt){ clearInterval(A.bgmFade); A.bgmFade=null; } },60);
  }).catch(()=>{}); };
E.bgmStop=function(){ if(!A.bgmEl) return; const el=A.bgmEl; if(A.bgmFade){ clearInterval(A.bgmFade); A.bgmFade=null; }
  // track the fade locally: iOS Safari silently ignores writes to el.volume, so gating pause() on reading el.volume back never fires → music never stops on phone.
  let v=el.volume>0?el.volume:0.55;
  A.bgmFade=setInterval(()=>{ v=Math.max(0,v-.08); try{ el.volume=v; }catch(_){ } if(v<=0){ el.pause(); clearInterval(A.bgmFade); A.bgmFade=null; } },50); };

/* ---------- narration (TTS) with per-role system voices ---------- */
const synth=window.speechSynthesis||null; let speaker='tau';
const reSig=/grandpa|grand|old|reed|rocko|ralph|arthur|daniel|fred|albert|aaron|david|mark|george|james|guy|male|kangkang|男/i;
const reTau=/grandma|samantha|karen|moira|tessa|junior|kathy|princess|zira|hazel|susan|eva|female|huihui|yaoyao|tingting|sinji|女/i;
function voicePool(){ const lang=E.lang==='zh'?'zh':'en'; const p=A.voices.filter(v=>(v.lang||'').toLowerCase().startsWith(lang)); return p.length?p:A.voices; }
const PREF_SIG=['mark','david','george','daniel','arthur','grandpa','kangkang'];   // preferred Sigma voices by name (PC: Mark first)
const PREF_PROD=['david','george','daniel','arthur','mark','guy','kangkang'];      // Product the wizard — a warm, wise male-ish voice
const PREF_TAU=['junior','princess','flo','zira','hazel','samantha','susan','karen','huihui','yaoyao'];   // Tau is a CALF — prefer child-like voices (macOS Junior/Princess); PC falls back to Zira, pitched up below
function pickVoice(role){ const list=voicePool(); if(!list.length) return '';
  const pref=role==='sigma'?PREF_SIG:role==='product'?PREF_PROD:PREF_TAU;
  for(const nm of pref){ const v=list.find(x=>x.name.toLowerCase().includes(nm)); if(v) return v.name; }
  if(role==='tau') return (list.find(v=>reTau.test(v.name)) || list.find(v=>!reSig.test(v.name)) || list[0]).name||'';   // female/young
  return (list.find(v=>reSig.test(v.name)) || list.find(v=>!reTau.test(v.name)) || list[0]).name||''; }   // sigma & product: male-ish, never a clearly-female voice
A.loadVoices=function(){ if(synth){ A.voices=synth.getVoices()||[]; } };
if(synth){ A.loadVoices(); synth.addEventListener('voiceschanged',()=>{ A.loadVoices(); if(!S.audio.vSigma)S.audio.vSigma=pickVoice('sigma'); if(!S.audio.vProduct)S.audio.vProduct=pickVoice('product'); if(!S.audio.vTau)S.audio.vTau=pickVoice('tau'); E.save(); E.fillVoicePickers&&E.fillVoicePickers(); }); }
E.say=function(t){ if(!synth||!S.audio.narr) return; synth.cancel(); const u=new SpeechSynthesisUtterance(t.replace(/<[^>]+>/g,''));
  const lang = E.lang==='zh'?'zh':'en'; const nm = speaker==='sigma'? S.audio.vSigma : speaker==='product'? S.audio.vProduct : S.audio.vTau;
  let v = A.voices.find(x=>x.name===nm);
  if(!v || !(v.lang||'').toLowerCase().startsWith(lang)) v = A.voices.find(x=>x.name===pickVoice(speaker));   // saved voice can't speak this language → pick one that can
  if(v){ u.voice=v; u.lang=v.lang; } else { u.lang = lang==='zh'?'zh-CN':'en-US'; }
  if(speaker==='sigma'){ u.pitch=.5; u.rate=.82; } else if(speaker==='product'){ u.pitch=.82; u.rate=.96; } else { u.pitch=1.5; u.rate=1.06; }   // Tau (calf) high; Product (wizard) warm/low
  A.speaking=true; u.onend=u.onerror=()=>{ A.speaking=false; const f=A._afterSpeech; A._afterSpeech=null; if(f)f(); }; synth.speak(u); };
/* run cb once narration finishes the current line, then a gap (voice on: end+1.3s; voice off: read-time ~1.9s) */
E.afterSpeech=function(cb){ let done=false; const go=g=>{ if(done)return; done=true; setTimeout(cb,g); };
  if(S.audio.narr && synth && (synth.speaking || A.speaking)){ A._afterSpeech=()=>go(1300); setTimeout(()=>go(1300),9000); }
  else go(1900); };
E.sayAs=function(who,text){ const prev=speaker; speaker=who; const wasOff=!S.audio.narr; S.audio.narr=true; const mc=$('mNarr'); if(mc)mc.checked=true; E.save(); A.ensure(); E.say(text); speaker=prev; };
E.speakAs=function(who,text){ if(!S.audio.narr) return; const prev=speaker; speaker=who; E.say(text); speaker=prev; };   // speak as `who` only if narration is already on (doesn't force it, doesn't change the bubble)
E.fillVoicePickers=function(){ const host=document.getElementById('voicePick'); if(!host) return;
  if(!A.voices.length){ host.innerHTML='<div class="vhint">voices loading… reopen this panel</div>'; return; }
  if(!S.audio.vProduct)S.audio.vProduct=pickVoice('product'); if(!S.audio.vTau)S.audio.vTau=pickVoice('tau'); E.save();
  const esc=s=>s.replace(/"/g,'&quot;');
  const opts=sel=>A.voices.map(v=>'<option value="'+esc(v.name)+'"'+(v.name===sel?' selected':'')+'>'+v.name+(v.lang?' · '+v.lang:'')+'</option>').join('');
  host.innerHTML='<div class="vrow"><span class="vico">'+MAGE_SVG+'</span>Product<select id="vPro">'+opts(S.audio.vProduct)+'</select></div>'
    +'<div class="vrow"><span class="vico">'+FIG.tauBull('happy')+'</span>Tau<select id="vTau">'+opts(S.audio.vTau)+'</select></div>'
    +'<button id="vTest" class="vtest">▶ test voices</button>';
  document.getElementById('vPro').onchange=e=>{ S.audio.vProduct=e.target.value; E.save(); };
  document.getElementById('vTau').onchange=e=>{ S.audio.vTau=e.target.value; E.save(); };
  document.getElementById('vTest').onclick=()=>{ const restore=S.audio.narr; S.audio.narr=true; const prev=speaker;
    speaker='product'; E.say(E.lang==='zh'?'我是魔法师“积”！':'I am Product, the multiplying magician!');
    setTimeout(()=>{ speaker='tau'; E.say(E.lang==='zh'?'我是小牛陶！':'And I am Tau the calf!'); speaker=prev; S.audio.narr=restore; },1900); }; };

/* ---------- companion ---------- */
const BULL_SVG='<svg viewBox="0 0 100 100">'
+'<g fill="#f4c830" stroke="#f4c830" stroke-linecap="round" stroke-linejoin="round">'
+'<path d="M37 35 C 29 25 18 21 12 23 C 19 27 26 33 30 43 Z"/><path d="M63 35 C 71 25 82 21 88 23 C 81 27 74 33 70 43 Z"/>'
+'<path d="M30 42 C 23 41 19 45 21 50 C 27 50 31 47 33 44 Z"/><path d="M70 42 C 77 41 81 45 79 50 C 73 50 69 47 67 44 Z"/>'
+'<path d="M50 27 l -4 9 l 4 -3 l 4 3 Z"/>'
+'<path d="M35 34 C 38 30 44 28 50 28 C 56 28 62 30 65 34 C 66 44 64 52 60 60 C 57 67 54 72 50 74 C 46 72 43 67 40 60 C 36 52 34 44 35 34 Z"/></g>'
+'<ellipse cx="30" cy="43" rx="2.6" ry="3.4" fill="#d9a51c"/><ellipse cx="70" cy="43" rx="2.6" ry="3.4" fill="#d9a51c"/>'
+'<ellipse cx="50" cy="60" rx="11" ry="8" fill="#ffe08a" stroke="#c89a1e" stroke-width="1.6"/>'
+'<g class="eyes-open">'
+'<path d="M39 42.5 Q43 40.5 47 42.5" fill="none" stroke="#b9912f" stroke-width="2" stroke-linecap="round"/>'
+'<path d="M53 42.5 Q57 40.5 61 42.5" fill="none" stroke="#b9912f" stroke-width="2" stroke-linecap="round"/>'
+'<ellipse cx="43" cy="47" rx="2.5" ry="3.2" fill="#0e0e26"/><ellipse cx="57" cy="47" rx="2.5" ry="3.2" fill="#0e0e26"/>'
+'<circle cx="44" cy="45.6" r="0.9" fill="#fff3cf"/><circle cx="58" cy="45.6" r="0.9" fill="#fff3cf"/></g>'
+'<g class="eyes-happy">'
+'<path d="M39 47 Q43 43 47 47" fill="none" stroke="#0e0e26" stroke-width="2.8" stroke-linecap="round"/>'
+'<path d="M53 47 Q57 43 61 47" fill="none" stroke="#0e0e26" stroke-width="2.8" stroke-linecap="round"/></g>'
+'<g class="eyes-sad">'
+'<path d="M39 48 Q43 52 47 48" fill="none" stroke="#0e0e26" stroke-width="2.8" stroke-linecap="round"/>'
+'<path d="M53 48 Q57 52 61 48" fill="none" stroke="#0e0e26" stroke-width="2.8" stroke-linecap="round"/></g>'
+'<ellipse cx="46.6" cy="60" rx="1.2" ry="2" fill="#5a3f08"/><ellipse cx="53.4" cy="60" rx="1.2" ry="2" fill="#5a3f08"/>'
+'<circle cx="50" cy="67" r="3" fill="none" stroke="#c89a1e" stroke-width="2"/></svg>';
const SIGMA_SVG='<svg viewBox="0 0 100 100"><g stroke="#f4c830" stroke-linecap="round" stroke-linejoin="round"><path d="M31 36 C 31 26 40 21 50 21 C 60 21 69 26 69 36 Z" fill="#f4c830"/><path d="M23 37 Q 50 31 77 37" fill="none" stroke-width="3"/><rect x="32" y="32" width="36" height="5.4" fill="#121230"/><polyline points="54,32.8 46,32.8 50,35 46,37.4 54,37.4" fill="none" stroke-width="1.4"/><path d="M37 43 L46 45 L45 47 L37 45 Z" fill="#f4c830"/><path d="M63 43 L54 45 L55 47 L63 45 Z" fill="#f4c830"/><path d="M40 49 q 2.5 1.6 5 0" fill="none" stroke-width="2.2"/><path d="M55 49 q 2.5 1.6 5 0" fill="none" stroke-width="2.2"/><path d="M50 49 L50 56 Q50 58.5 52.5 57.2" fill="none" stroke-width="2.2"/><path d="M38 54 C 34 60 35 70 40 77 L44 72 L48 79 L52 72 L56 79 L60 77 C 65 70 66 60 62 54 C 57 61 43 61 38 54 Z" fill="#f4c830"/></g></svg>';
const MAGE_SVG='<svg viewBox="0 0 100 100">'
+'<path d="M32 84 C32 62 50 58 50 58 C50 58 68 62 68 84 Z" fill="#34b06a" stroke="#0e5a34" stroke-width="1.6"/>'                                   // GREEN robe — Product = the multiplication colour (synced with the canvas wizard)
+'<text x="50" y="82" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffe9a0" text-anchor="middle">&#215;</text>'                 // his × monogram
+'<circle cx="50" cy="54" r="13" fill="#ffeec2" stroke="#c89a1e" stroke-width="1.6"/>'                                                             // face
+'<circle cx="45.5" cy="53" r="2.2" fill="#1a1726"/><circle cx="54.5" cy="53" r="2.2" fill="#1a1726"/>'                                            // eyes
+'<path d="M41 72 Q50 80 59 72 Q50 75 41 72 Z" fill="#fff7e6"/>'                                                                                   // beard
+'<path d="M29 42 Q50 39 71 42 Q60 18 65 9 Q47 26 29 42 Z" fill="#3a4f9e" stroke="#f4c830" stroke-width="2.2" stroke-linejoin="round"/>'           // hat
+'<rect x="27" y="38" width="46" height="6" rx="2" fill="#f4c830"/><circle cx="64" cy="11" r="3.2" fill="#fff7cf"/></svg>';                        // band + tip
let companion,bubble,botEl;
E.setSpeaker=w=>{ speaker=w; botEl.innerHTML = w==='sigma'?SIGMA_SVG : w==='product'?MAGE_SVG : FIG.tauBull(companion.dataset.mood||'open'); };
E.mood=m=>{ companion.dataset.mood=m; if(speaker==='tau') botEl.innerHTML=FIG.tauBull(m); };
E.cheer=()=>{ E.mood('happy'); companion.classList.add('cheer'); setTimeout(()=>companion.classList.remove('cheer'),320); };
E.oops=()=>{ E.mood('sad'); companion.classList.remove('oops'); void companion.offsetWidth; companion.classList.add('oops'); };   // fail = sad face + shake
E.sad=()=>{ E.mood('sad'); companion.classList.remove('oops'); void companion.offsetWidth; companion.classList.add('oops'); };
E.pop=t=>{ const e=document.createElement('div'); e.className='pop'; e.textContent=t; companion.appendChild(e); setTimeout(()=>e.remove(),1000); };
E.tell=html=>{ bubble.innerHTML='<span>'+html+'</span>'; E.say(bubble.textContent); };

/* ---------- canvas / scene ---------- */
let cv,ctx,LW,LH; let MOUNT='bull';
E.setRange=m=>{ E.MAXX=m; E.PX=v=>E.padL + v/m*(LW-E.padL-E.padR); };
E.GRASSOFF=0.5;
E.clear=()=>{ ctx.clearRect(0,0,LW,LH); ctx.fillStyle='#0a0a18'; ctx.fillRect(0,0,LW,LH); };
E.anim=(dur,onF,onD)=>{ const t0=performance.now(); (function f(now){ const p=Math.min(1,(now-t0)/dur); onF(p); if(p<1)requestAnimationFrame(f); else onD&&onD(); })(performance.now()); };
E.mountAt=(xv,by,dy,rot)=>{ const x=E.PX(xv); FIG.bull(ctx, x, by+(dy||0), 52, {mood:companion.dataset.mood}); if(false&&rot){} };

/* generic single-bridge crossing outcome (reused by many quests) */
E.runCross=function(o){ // {target, reach, draw(b), msgs:{short,long}, onWin, retry}
  E.busy=true; E.clearTray(); const reach=o.reach, target=o.target;
  const mode = reach<target-1e-9?'short':reach>target+1e-9?'long':'win';
  const stopAt = mode==='short'?reach:target;
  E.anim(Math.max(1000,stopAt*340), p=>o.draw({xv:stopAt*p,dy:-2}), ()=>{
    if(mode==='win'){ E.anim(560,p=>{ E.fed=(p>.6); o.draw({xv:target+E.GRASSOFF*p,dy:-2}); }, ()=>{ E.fed=true; o.draw({xv:target+E.GRASSOFF,dy:-2}); E.pop('nom!'); E.cheer(); E.sfx('win'); E.busy=false; o.onWin(); }); }
    else if(mode==='short'){ E.oops(); E.sfx('fail'); E.tell(E.t(o.msgs.short)); const alive=E.loseHeart();
      E.anim(820,p=>o.draw({xv:stopAt,dy:p*160,rot:p*4}), ()=>{ if(alive){ E.busy=false; E.afterSpeech(o.retry); } }); }   // falling costs a heart; on game over, gameOver() restarts the quest instead of retrying
    else { E.sad(); E.sfx('fail'); E.tell(E.t(o.msgs.long)); if(E.loseHeart()){ E.busy=false; E.afterSpeech(o.retry); } }
  });
};

/* ---------- Layer 2 · direct manipulation (tap-pick + drag-to-target) ----------
   ADDITIVE. A quest calls E.scene({actors, draw, onPick, onDrop}). The engine maps the
   pointer to logical coords (mouse + touch unified via Pointer Events), hit-tests actor
   bboxes, tracks drag position + snap zones, and runs a rAF loop that calls the quest's
   draw() each frame (the quest still paints all its own art). The engine adds the juice:
   a highlight ring on the hovered/pressed tap target, and a pulsing target ring on the
   nearest snap zone while dragging. Quests on the old button path are untouched.
     actor = { kind:'tap'|'drag', bbox(a)->{x,y,w,h},
               drag:{axis:'x'|'y', clamp:{x0,x1,y0,y1}}, home:{x,y}, snap:[{x,y,r,ok,id}], hiCol }
   E.scene callbacks: onPick(actor) when a tap resolves; onDrop(actor,zone|null) when a drag is released. */
let SC=null, RAF=0, DRAG=null, GX=0, GY=0, DMOVED=false;
function ptOf(ev){ const r=cv.getBoundingClientRect(); return { x:(ev.clientX-r.left)*LW/r.width, y:(ev.clientY-r.top)*LH/r.height }; }
function bbOf(a){ return a.bbox? a.bbox(a) : null; }
function inBB(b,x,y){ return !!b && x>=b.x && x<=b.x+b.w && y>=b.y && y<=b.y+b.h; }
function topAt(x,y){ if(!SC) return null; for(let i=SC.actors.length-1;i>=0;i--){ const a=SC.actors[i]; if(a.off) continue; if(inBB(bbOf(a),x,y)) return a; } return null; }
function zoneNear(a){ const zs=a.snap; if(!zs) return null; let best=null,bd=1e9; for(const z of zs){ const dx=a.pos.x-z.x, dy=a.pos.y-z.y, dd=dx*dx+dy*dy, R=(z.r||46); if(dd<=R*R&&dd<bd){ bd=dd; best=z; } } return best; }
function hiRing(b,col){ if(!b)return; const c=ctx,p=7,tt=performance.now()/1000,a=0.55+0.25*Math.sin(tt*4),r=11,x=b.x-p,y=b.y-p,w=b.w+2*p,h=b.h+2*p;
  c.save(); c.globalAlpha=a; c.strokeStyle=col||'rgba(244,200,48,.95)'; c.lineWidth=2.4; c.shadowColor=col||'rgba(244,200,48,.7)'; c.shadowBlur=12;
  c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); c.stroke(); c.restore(); }
function targetRing(z){ const c=ctx,tt=performance.now()/1000,r=(z.ring||30)*(0.9+0.09*Math.sin(tt*5));   // fixed VISUAL radius (z.r is the bigger, forgiving DETECTION radius)
  c.save(); c.globalAlpha=0.95; c.strokeStyle='rgba(80,216,144,.95)'; c.lineWidth=2.8; c.setLineDash([6,6]); c.shadowColor='rgba(80,216,144,.6)'; c.shadowBlur=15;
  c.beginPath(); c.arc(z.x,z.y,r,0,7); c.stroke(); c.restore(); }
function spin(){ if(!SC){ RAF=0; return; } try{ if(SC.draw) SC.draw();
  if(DRAG){ DRAG.near=zoneNear(DRAG)||null; if(DRAG.near) targetRing(DRAG.near); }   // quest paint can read actor.near to confirm the snap
  else if(SC.hot && SC.hot.kind!=='drag'){ const h=SC.hot; if(h.hi) h.hi(bbOf(h), h); else hiRing(bbOf(h), h.hiCol); }   // actor.hi() = custom highlight (e.g. a wide region); else the default ring
  }catch(e){}   // a transient draw error (e.g. an asset still loading on first paint) must NOT kill the loop and freeze the scene
  RAF=requestAnimationFrame(spin); }
E.sceneStop=function(){ if(RAF){ cancelAnimationFrame(RAF); RAF=0; } SC=null; DRAG=null;
  if(cv){ cv.onpointerdown=cv.onpointermove=cv.onpointerup=cv.onpointercancel=null; cv.style.touchAction=''; cv.style.cursor=''; } };
E.scene=function(o){ E.sceneStop(); SC=o; SC.actors=SC.actors||[]; SC.hot=null;
  SC.actors.forEach(a=>{ if(a.kind==='drag'&&!a.pos) a.pos={x:a.home.x,y:a.home.y}; });
  cv.style.touchAction='none';
  cv.onpointerdown=ev=>{ if(E.busy||!SC) return; const p=ptOf(ev), a=topAt(p.x,p.y); if(!a) return; ev.preventDefault();
    if(a.kind==='drag'){ DRAG=a; DMOVED=false; a.grab=true; GX=p.x-a.pos.x; GY=p.y-a.pos.y; cv.style.cursor='grabbing'; try{cv.setPointerCapture(ev.pointerId);}catch(_){ } }
    else { SC.tapStart=a; SC.hot=a; } };
  cv.onpointermove=ev=>{ if(!SC) return; const p=ptOf(ev);
    if(DRAG){ ev.preventDefault(); DMOVED=true; let nx=p.x-GX, ny=p.y-GY; const d=DRAG.drag||{};
      if(d.axis==='x') ny=DRAG.home.y; else if(d.axis==='y') nx=DRAG.home.x;
      if(d.clamp){ nx=Math.max(d.clamp.x0,Math.min(d.clamp.x1,nx)); ny=Math.max(d.clamp.y0,Math.min(d.clamp.y1,ny)); }
      DRAG.pos.x=nx; DRAG.pos.y=ny; }
    else { SC.hot=topAt(p.x,p.y); cv.style.cursor=SC.hot?(SC.hot.kind==='drag'?'grab':'pointer'):''; } };
  function up(ev){ if(!SC) return;
    if(DRAG){ const a=DRAG, tapped=!DMOVED, rx=a.pos.x, ry=a.pos.y; a.grab=false; DRAG=null; cv.style.cursor=''; try{cv.releasePointerCapture(ev.pointerId);}catch(_){ }
      const z=zoneNear(a); if(z){ if(z.snap!==false){ a.pos.x=z.x; a.pos.y=z.y; } SC.onDrop&&SC.onDrop(a,z,{tapped:false,x:rx,y:ry}); }
      else { a.pos.x=a.home.x; a.pos.y=a.home.y; SC.onDrop&&SC.onDrop(a,null,{tapped:tapped,x:rx,y:ry}); } }   // info.x/y = release position (before springing home); tapped = released without dragging
    else if(SC.tapStart){ const p=ptOf(ev), a=topAt(p.x,p.y), t0=SC.tapStart; SC.tapStart=null; SC.hot=null; if(a&&a===t0&&a.kind!=='drag') SC.onPick&&SC.onPick(a); } }
  cv.onpointerup=up; cv.onpointercancel=up;
  spin(); };

/* ---- shared decision helpers (used by every quest) ---- */
function rrPath(c,x,y,w,h,r){ r=Math.min(r,w/2,h/2); c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }
E.pillBB=function(cx,cy,txt){ const c=ctx; c.save(); c.font='600 14px "IBM Plex Mono",monospace'; const w=Math.max(104,c.measureText(txt).width+34); c.restore(); return {x:cx-w/2,y:cy-17,w:w,h:34}; };
/* an on-canvas tappable token — for an ABSTRACT answer with no object to point at (e.g. "Can't tell yet") */
E.pill=function(cx,cy,txt){ const c=ctx, b=E.pillBB(cx,cy,txt); c.save();
  c.shadowColor='rgba(0,0,0,.4)'; c.shadowBlur=8; c.shadowOffsetY=3; rrPath(c,b.x,b.y,b.w,b.h,16); c.fillStyle='rgba(36,32,58,.92)'; c.fill();
  c.shadowColor='transparent'; c.lineWidth=1.6; c.strokeStyle='rgba(244,200,48,.8)'; rrPath(c,b.x,b.y,b.w,b.h,16); c.stroke();
  c.font='600 14px "IBM Plex Mono",monospace'; c.fillStyle='#f6e6b0'; c.textAlign='center'; c.textBaseline='middle'; c.fillText(txt,cx,cy); c.restore(); };
/* DIRECT-MANIPULATION choice: the player TAPS the object/token itself (no answer buttons). items:[{bbox,ok,fb,hiCol}].
   right → mood happy + advance; wrong → oops + feedback, scene stays live to retry. opts.react(ok,item) for per-quest
   figure reactions (e.g. a villain's mood); opts.fbWrap(fb) to decorate the wrong-answer text; opts.prev=false hides ◀. */
E.choose=function(prompt, redraw, items, onRight, opts){ opts=opts||{}; E.tell(prompt); E.clearTray();
  if(opts.prev!==false && E.round>0) E.addBtn(E.t({en:'◀ Prev step',zh:'◀ 上一步'}),'ghost',E.prevStep);
  E.scene({ actors: items.map((it,i)=>({ id:i, kind:'tap', bbox:it.bbox, hiCol:it.hiCol })), draw:redraw,
    onPick:function(a){ if(E.busy) return; const it=items[a.id];
      if(opts.react) opts.react(!!it.ok, it);
      if(it.ok){ E.mood('happy'); E.sfx('place'); E.pop(opts.okPop?opts.okPop():'✓'); E.sceneStop(); redraw(); onRight(); }
      else { E.oops(); E.sfx('fail'); E.pop('✗'); const fb=E.t(it.fb); E.tell(opts.fbWrap?opts.fbWrap(fb):fb); E.loseHeart(); } } }); };   // a wrong tap costs a heart; the scene stays live to retry (loseHeart takes over on game over)

/* ---------- tray / status / dots / place ---------- */
let tray,statusEl,dotsEl,kicker,placebanner,heartsEl;
E.clearTray=()=>tray.innerHTML='';
E.addBtn=(label,cls,fn,dim)=>{ const b=document.createElement('button'); b.className='btn '+(cls||'')+(dim?' dim':''); b.innerHTML=label; b.onclick=fn; tray.appendChild(b); return b; };   // dim = locked/greyed (still clickable, fn can pop a hint)
E.trayEl=()=>tray;
E.status=html=>statusEl.innerHTML=html;
E.setDots=n=>[...dotsEl.children].forEach((d,i)=>d.classList.toggle('on',i<n));
E.setPlace=name=>{ kicker.textContent='Origo · '+name; placebanner.textContent='✦ '+name+' ✦'; placebanner.classList.remove('show'); void placebanner.offsetWidth; placebanner.classList.add('show'); };

/* ---------- hearts / lives — 3 per quest; a wrong decision costs one; at 0 the quest restarts from round 1 ---------- */
let lives=3;
function renderHearts(){ if(!heartsEl) return; heartsEl.innerHTML=''; for(let i=0;i<3;i++){ const b=document.createElement('b'); b.textContent='♥'; if(i>=lives) b.classList.add('off'); heartsEl.appendChild(b); } }
E.livesLeft=()=>lives;
// Deduct a heart for a mistake. Returns TRUE if still alive (the caller may let the player retry),
// FALSE on game over — the caller must NOT run its own retry; gameOver() takes over and restarts the quest.
E.loseHeart=function(){ if(lives<=0) return false; lives--; renderHearts();
  if(heartsEl && heartsEl.children[lives]) heartsEl.children[lives].classList.add('lose');
  if(lives<=0){ E.busy=true; if(E.sceneStop)E.sceneStop(); setTimeout(gameOver,900); return false; }
  return true; };
function gameOver(){ if(E.sceneStop)E.sceneStop(); E.busy=true; E.setSpeaker('tau'); E.mood('sad'); E.clearTray();
  E.tell(E.t({en:'💔 <b>Out of hearts.</b> Mistakes are how we learn — your EXP and pages are safe. Let\'s take this quest from the top.',zh:'💔 <b>三颗心都碎了。</b>犯错正是学习的方式——经验和书页都还在。我们从头再走一遍这一关。'}));
  E.status(E.t({en:'↻ restarting the quest…',zh:'↻ 正在重新开始本关…'}));
  setTimeout(()=>{ lives=3; renderHearts(); E.round=0; E.busy=false; E.next(); }, 1700); }   // refill + restart from round 1 (keeps E.done, so cleared steps award no second EXP)

/* ---------- XP / level ---------- */
function renderXP(){ $('lvlBadge').textContent='Lv.'+S.level; $('xpfillBar').style.width=Math.min(100,S.xp/S.need*100)+'%'; $('xptxt').textContent=S.xp+' / '+S.need; }
function ding(){ const f=$('lvlup'); f.querySelector('span').textContent='⚔ LEVEL UP! · Pathfinder Lv.'+S.level+' ⚔'; f.classList.remove('show'); void f.offsetWidth; f.classList.add('show'); E.pop('DING!'); E.sfx('level'); }
E.gainXP=n=>{ const e=document.createElement('div'); e.className='xpfloat'; e.textContent='+'+n+' EXP'; document.body.appendChild(e); setTimeout(()=>e.remove(),1300);
  S.xp+=n; if(S.xp>=S.need){ S.xp-=S.need; S.level++; S.need=Math.round(S.need*1.25); setTimeout(ding,300); } renderXP(); E.save(); };

/* ---------- quest tracker ---------- */
let qtrack;
E.tickQ=i=>{ const e=$('q'+i); if(e&&!e.classList.contains('done')){ e.classList.add('done'); e.textContent='☑'+e.textContent.slice(1); } };
function resetQ(n){ for(let i=1;i<=n;i++){ const e=$('q'+i); if(e){ e.classList.remove('done'); e.textContent='◻'+e.textContent.slice(1); } } }

/* ---------- book / codex (minimal v1; full book.js next slice) ---------- */
E.openBook=function(page){ const c=$('codex'); if(window.BOOK) BOOK.render($('bookpage'), page, E.lang);
  S.quests[E.QUEST.id]='done'; if(S.pages.indexOf(E.QUEST.page)<0)S.pages.push(E.QUEST.page); E.save();
  try{ localStorage.setItem('mtZone_origin1','done'); }catch(_){ }
  const cl=$('codexLink'); if(cl) cl.style.display='';   // reveal the persistent codex link
  const px=$('pxpR'); if(px)px.textContent='Pathfinder Lv.'+S.level; c.classList.add('show'); E.say(E.t(page.read||page.title)); };
E.closeBook=()=>$('codex').classList.remove('show');
/* print the codex as a page sized EXACTLY to the content (no A4 white margins; matches the on-screen card) */
E.printBook=function(){ const el=$('bookpage'); if(!el){ window.print(); return; }
  const mm=px=>px/96*25.4;   // +slack so content (== card) never spills a sliver onto a 2nd page
  let st=$('pgsize'); if(!st){ st=document.createElement('style'); st.id='pgsize'; document.head.appendChild(st); }
  st.textContent='@page{ size:'+(mm(el.offsetWidth)+1).toFixed(1)+'mm '+(mm(el.offsetHeight)+4).toFixed(1)+'mm; margin:0; }';
  window.print(); };

/* ---------- boot ---------- */
E.boot=function(QUEST){ E.QUEST=QUEST;
  cv=$('cv'); ctx=cv.getContext('2d'); ctx.setTransform(2,0,0,2,0,0); LW=cv.width/2; LH=cv.height/2; E.ctx=ctx; E.LW=LW; E.LH=LH; E.cv=cv;
  E.baseY=LH-78; E.botY=LH; E.setRange(9);
  companion=$('companion'); bubble=$('bubble'); botEl=companion.querySelector('.bot');
  tray=$('tray'); statusEl=$('status'); dotsEl=$('dots'); kicker=$('kicker'); placebanner=$('placebanner'); qtrack=$('qtrack'); heartsEl=$('hearts');
  document.body.dataset.region=QUEST.region||'cradle';
  $('h1').textContent=E.t(QUEST.title); kicker.textContent='Origo · '+E.t(QUEST.kicker);
  dotsEl.innerHTML=QUEST.rounds.map(()=>'<i></i>').join('');
  // scroll
  $('qtitleScroll').textContent='❗ '+E.t(QUEST.meta.title); $('giver').textContent=E.t(QUEST.meta.giver);
  $('flavor').innerHTML=E.t(QUEST.meta.flavor);
  const qs=$('qseal'); if(qs && window.FIG) qs.innerHTML=FIG.tauBull('happy');   // Tau is the quest giver (Sigma comes later)
  $('objs').innerHTML=QUEST.objs.map(o=>'<li>◻ '+E.t(o)+'</li>').join('');
  $('qtrackTitle').textContent='❗ '+E.t(QUEST.meta.title);
  $('qtrackList').innerHTML=QUEST.objs.map((o,i)=>'<div class="o" id="q'+(i+1)+'">◻ '+E.t(o)+'</div>').join('');
  // footer lang link
  const other=E.lang==='zh'?'en':'zh'; $('langLink').href='play.html?q='+QUEST.id.replace('q','')+'&lang='+other; $('langLink').textContent=E.lang==='zh'?'EN':'中文';
  // settings
  const set=$('settings'); $('gear').onclick=()=>set.classList.toggle('open');
  const wire=(id,key,on,off)=>{ const el=$(id); el.checked=S.audio[key]; el.onchange=()=>{ S.audio[key]=el.checked; E.save(); if(key==='music'){ el.checked?E.bgmStart():E.bgmStop(); } if(key==='narr'&&!el.checked&&synth)synth.cancel(); }; };
  wire('mMusic','music'); wire('mSfx','sfx'); wire('mNarr','narr');
  // voice pickers (per-role system voices)
  const panel=set.querySelector('.panel'); if(panel && !$('voicePick')){ const vp=document.createElement('div'); vp.id='voicePick'; vp.className='voicepick'; panel.appendChild(vp); }
  A.loadVoices();
  if(S.audio.vver!==4){ S.audio.vSigma=''; S.audio.vProduct=''; S.audio.vTau=''; S.audio.vver=4; }   // re-pick with current preferred-name defaults (Product / Zira on PC)
  if(!S.audio.vSigma)S.audio.vSigma=pickVoice('sigma'); if(!S.audio.vProduct)S.audio.vProduct=pickVoice('product'); if(!S.audio.vTau)S.audio.vTau=pickVoice('tau'); E.save(); E.fillVoicePickers();
  renderXP(); renderHearts();
  // quest scroll → start (Tau is the giver now; Sigma appears later)
  E.setSpeaker('tau');
  const rq=$('readQuest'); if(rq) rq.onclick=()=>{ E.sayAs('tau', E.t(QUEST.meta.flavor)); $('mNarr').checked=true; };
  const cl=$('codexLink'); if(cl){ cl.onclick=e=>{ e.preventDefault(); E.openBook(QUEST.book); }; if(S.quests[QUEST.id]==='done') cl.style.display=''; }   // codex reachable anytime once cleared
  // localise the shell UI (static buttons/labels)
  const L=(en,zh)=> E.lang==='zh'?zh:en, T2=(id,en,zh)=>{ const el=$(id); if(el) el.textContent=L(en,zh); };
  T2('acceptQ','Accept the Quest','接受任务'); if(rq) rq.textContent=L('🔊 Hear Tau speak','🔊 听 Tau 说');
  T2('bkClose','✕ Close','✕ 关闭'); T2('bkReplay','↺ Replay','↺ 重玩'); T2('bkMap','▣ Map','▣ 地图');
  T2('bkNext','More quests soon ▶','更多任务即将到来 ▶'); T2('footTag','the MathO book, made playable','可游玩的 MathO 之书');
  if(cl) cl.textContent='📖 '+L('Codex','典籍');
  const ml=$('mapLink'); if(ml){ ml.href=(E.lang==='zh'?'../world_zh.html':'../world.html');   // our own map icon (parchment + the golden thread from O), not the real-world map emoji
    ml.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4" width="17" height="16" rx="2.5" fill="rgba(244,200,48,.1)" stroke="#caa94e" stroke-width="1.4"/><path d="M7 17 C 10 12 9 11 13 11 C 16 11 15 7.5 18 7.5" fill="none" stroke="#f4c830" stroke-width="1.5" stroke-dasharray="0.5 2.5" stroke-linecap="round"/><circle cx="7" cy="17" r="1.8" fill="#f4c830"/></svg><span>'+L('Map','地图')+'</span>'; }   // map reachable at every step
  const NXT = (window.QUEST_NEXT && window.QUEST_NEXT(QUEST.id)) || QUEST.next;   // order comes from quests/manifest.js (single source); QUEST.next is a fallback
  if(NXT){ const bn=$('bkNext'); if(bn){ bn.textContent=L('Next chapter ▶','下一章 ▶'); bn.onclick=()=>{ if(window.ORIGO_loadQuest) window.ORIGO_loadQuest(NXT); else location.href='play.html?q='+NXT+'&lang='+E.lang; }; } }   // lead into the next quest WITHOUT a page reload, so BGM keeps playing
  $('acceptQ').onclick=()=>{ $('scrim').classList.add('hide'); qtrack.classList.add('show'); A.ensure(); if(S.audio.music)E.bgmStart(); E.setSpeaker('tau'); E.start(); };
  // intro background scene
  QUEST.intro && QUEST.intro(E);
};
E.start=()=>{ E.round=0; E.done={}; lives=3; renderHearts(); E.next(); };   // a fresh 3-heart run each quest
E.next=()=>{ const r=E.QUEST.rounds[E.round]; if(r){ E.currentRound=()=>{ E.busy=false; E.clearTray(); E.QUEST.rounds[E.round](E); }; E.currentRound(); } };   // every round entry/replay: clear stale busy (a leaked anim could leave the scene un-draggable until refresh) + clear the tray so a previous round's advance button can't linger
E.advance=()=>{ E.round++; E.next(); };
E.award=n=>{ if(E.done[E.round]) return; E.done[E.round]=true; E.gainXP(n); };   // XP only the first clear of a step
E.replayStep=()=>{ if(E.currentRound) E.currentRound(); };                       // re-run the SAME step (no XP second time)
E.prevStep=()=>{ if(E.round>0){ E.round--; E.next(); } };                         // step back to an earlier round to replay it (no XP — E.done already set)
E.replay=()=>{ E.closeBook(); resetQ(E.QUEST.rounds.length); E.start(); };
})();
