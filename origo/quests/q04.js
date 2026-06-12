/* ORIGO · Quest 4 = MathO p8 · "Comparing Area and Length" · DRAFT (codex page only; game not built yet).
   Reachable at play.html?q=04 for review. Theme: an area and a length cannot be compared until you pick a unit "1";
   change the unit and the verdict flips. Seeds integration (area under a curve = tiling with unit lengths). */
(function(){
const t=s=>E.t(s);

function round1(E){ E.setSpeaker('tau'); E.mood('idle'); E.setDots(0); E.cv.onclick=null;
  E.setPlace(t({en:'Area vs Length',zh:'面积与长度'}));
  try{ E.clear(); }catch(e){}
  E.tell(t({en:'<b>Draft preview.</b> The game for this page is not built yet. Tap below to read the codex page we are designing.',zh:'<b>草稿预览。</b>这一页的游戏还没做。点下面读我们正在设计的典籍书页。'}));
  E.clearTray();
  E.addBtn(t({en:'Open the Codex page 📖',zh:'打开典籍书页 📖'}),'primary',()=>{ E.setDots(1); E.tickQ(1); E.openBook(QUEST.book); });
}

const QUEST = {
  id:'q04', page:4, region:'cradle', bgm:'audio/bgm-cradle.mp3?v=20260606k2',
  kicker:{en:'The Cradle',zh:'摇篮'},
  title:{en:'Area vs Length',zh:'面积与长度'},
  meta:{ title:{en:'Comparing Area and Length',zh:'面积和长度的比较'}, giver:{en:'Tau the Calf · The Cradle',zh:'小牛 Tau · 摇篮'},
    flavor:{en:'"How do you say whether a field beats a fence? You cannot, until you pick a measuring stick. (Game coming soon, a draft codex page is inside.)"',
      zh:'"怎么说一块田比一道篱笆大？除非先选一把尺子，否则说不准。（游戏即将到来，里面是一页草稿书页。）"'} },
  objs:[ {en:'Read the codex page',zh:'读典籍书页'} ],
  rounds:[round1],
  book:{ page:4, kicker:{en:'Introduction',zh:'入门之'}, title:{en:'Comparing Area and Length',zh:'面积和长度的比较'},
    blocks:[
      {top:true, fig:'acmp', prose:{en:'An area is an amount. A length is an amount too. Two areas are easy to compare, and two lengths are easy. But an area against a length, the square <b class="gr">x</b> against the line <b class="b">y</b>: which is bigger? There is no answer yet.'}},
      {law:{en:'Pick a unit'}, eq:'<span class="gr">x</span> = <span class="r">1</span>×<span class="r">1</span> = <span class="b">y</span>', fig:'aunit', prose:{en:'To compare them, first pick a measuring stick and call it <b class="r">1</b>. Lay it down. The line <b class="b">y</b> is one stick long, so it is <b class="r">1</b>. The square <b class="gr">x</b> is one stick by one stick, so it is <b class="r">1</b>×<b class="r">1</b> = <b class="r">1</b>. Measured this way, <b class="gr">x</b> = <b class="b">y</b>.'}},
      {law:{en:'The unit, not the shapes'}, prose:{en:'But look at what we leaned on: the stick. The answer came from the <b class="r">unit</b>, not the shapes. Keep the same square and the same line, change only the stick, and the comparison can change.'}},
      {law:{en:'Change the unit, flip the verdict'}, eq:'<span class="gr">x</span> &gt; <span class="b">y</span> &nbsp;&nbsp;or&nbsp;&nbsp; <span class="gr">x</span> &lt; <span class="b">y</span>', fig:'aflip', prose:{en:'Change the stick and the verdict flips: with one stick <b class="gr">x</b> &gt; <b class="b">y</b>, with another <b class="gr">x</b> &lt; <b class="b">y</b>. An area is two lengths multiplied, so it answers to the unit twice over, while a length answers once. So to weigh an area against a length you lay a unit length across it, the move that later measures the area under a curve.'}}
    ],
    read:{en:'An area and a length are both amounts, but you cannot say which is bigger until you choose a unit. Lay the unit down and measure. Change the unit and the verdict can flip, because an area answers to the unit twice and a length once. To weigh an area against a length, tile it with lengths, the very move that later measures the area under a curve.'} },
  intro:(E)=>{ try{ E.clear(); }catch(e){} }
};
window.QUEST_q04 = QUEST;
})();
