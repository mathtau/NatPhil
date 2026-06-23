/* ORIGO · quests/manifest.js — the SINGLE SOURCE OF TRUTH for quest order, titles, act, and the unlock chain.
   Consumed by world.html / world_zh.html (the "Return to a quest" panel) and by the engine's Next-chapter button
   (which falls back to MANIFEST order when a quest has no explicit QUEST.next). Add a quest by adding one row here. */
(function(){
  window.MANIFEST = [
    { n:'01', act:'cradle', t:{ en:'Addition',           zh:'加法' } },
    { n:'02', act:'cradle', t:{ en:'Multiplication',     zh:'乘法' } },
    { n:'03', act:'cradle', t:{ en:'Give Numbers Names', zh:'给数起名字' } },
    { n:'04', act:'cradle', t:{ en:'Area vs Length',     zh:'面积与长度' } }
  ];
  // the quest after `id` in canonical order (null if it's the last) — order lives ONLY here
  window.QUEST_NEXT = function(id){ id=String(id).replace(/[^0-9]/g,''); var m=window.MANIFEST;
    for(var i=0;i<m.length;i++){ if(m[i].n===id) return (i<m.length-1)? m[i+1].n : null; } return null; };
})();
