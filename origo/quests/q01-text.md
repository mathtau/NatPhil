# Quest 1 — full script (EN / 中文)

Edit any line below; I'll merge your changes back into `q01.js` / the shell.
Placeholders: `{G}` round‑1 target, `{a} {b} {c}` plank values, `{T}` total. Keep the `<b class="g/y/r">…</b>` colour tags if you want coloured words.

---

## A. Quest meta

**Header kicker**
- EN: The Cradle
- ZH: 摇篮

**Quest title (in‑game H1)**
- EN: Joining Steps
- ZH: 步步前行

**Quest scroll title**
- EN: Feed the Starving Calves
- ZH: 喂饱饥饿的小牛

**Quest giver (byline)**
- EN: Tau the Calf · The Cradle
- ZH: 小牛 Tau · 摇篮

**Flavor (Tau speaking, on the scroll)**
- EN: "Hi, **Pathfinder**! I'm **Tau**, your little ox, still just a **calf** with horns barely budding. The **Fog** has starved my whole herd, so we are too weak to carry you yet. Three broken crossings lie ahead, each with **grass** beyond. Bridge them so we can feed, and as we **grow** we will carry you onward. Let's go!"
- ZH: "**开拓者**，你好！我是 **Tau**，你的小牛犊，犄角才刚冒出来。**迷雾**让我们整群牛饿坏了，现在我们太虚弱，还载不动你。前方有三处断桥，桥对面都有 **青草**。把桥搭好，让我们吃饱，**长大**之后就能载你前行啦。出发吧！"

---

## B. Objectives (tracker)

**Objective 1**
- EN: The Cracked Causeway: bridge the gap
- ZH: 裂隙石道：搭桥

**Objective 2**
- EN: The Twin Spans: order is free
- ZH: 双生桥：顺序自由

**Objective 3**
- EN: The Pillar Pass: grouping is free
- ZH: 立柱关：组合自由

---

## C. Round 1 — The Cracked Causeway (addition)

**Place name**
- EN: The Cracked Causeway
- ZH: 裂隙石道

**Intro (Tau)**
- EN: **The Cracked Causeway.** any planks will work, as there is a post at every step. Bridge the gap to the **grass** at **{G}**: too short I fall, too long the grass gets buried!
- ZH: **裂隙石道。** 任何木板都可行，因为每一步都有立柱。搭到 **{G}** 处的 **青草**：如果太短我会掉下去，太长就会埋住青草！

**Status label**
- EN: bridge:
- ZH: 桥长：

**Send button**
- EN: Send me! ▶
- ZH: 出发！▶

**Fail — too short**
- EN: Too **short**, I run off into the Fog!
- ZH: 太**短**，我掉进迷雾了！

**Fail — too long**
- EN: Too **long**, the **grass gets buried**! Trim it.
- ZH: 太**长**，**青草被埋住了**！收短点。

**Win**
- EN: Yum, the little calf is fed!
- ZH: 好香，小牛犊吃饱饱！

**Next button**
- EN: On to the next crossing ▶
- ZH: 前往下一处 ▶

**Replay button (all rounds)**
- EN: ↻ Replay (no EXP)
- ZH: ↻ 重玩（无经验）

---

## D. Round 2 — The Twin Spans (commutativity)

**Place name**
- EN: The Twin Spans
- ZH: 双生桥

**Intro (Tau)**
- EN: **The Twin Spans.** Top holds **{a}**, bottom holds **{b}**. Add the missing plank so **both** reach **{T}**, and see **{a}+{b}** = **{b}+{a}**.
- ZH: **双生桥。** 上桥已有 **{a}**，下桥已有 **{b}**。补上缺的木板，让**两座桥**都到 **{T}**，可见 **{a}+{b}** = **{b}+{a}**。

**Status — choose span**
- EN: pick a span to fix, then choose its plank
- ZH: 先选一座桥，再选它的木板

**Status — choose plank**
- EN: Top/Bottom span ({preset} + ?): pick a plank to reach {T}
- ZH: 上桥/下桥（{preset} + ?）：选木板凑到 {T}

**Span buttons**
- EN: Top span: {a} + ?    /    Bottom span: {b} + ?
- ZH: 上桥：{a} + ?    /    下桥：{b} + ?

**Plank options**
- (just "+{a}" and "+{b}", and a back button:)
- EN back: ‹ back
- ZH back: ‹ 返回

**Send button**
- EN: Send both ▶
- ZH: 一起出发 ▶

**Fail**
- EN: Each span must reach **{T}**: top needs **{b}**, bottom needs **{a}**.
- ZH: 每座桥都要到 **{T}**：上桥差 **{b}**，下桥差 **{a}**。

**Win**
- EN: Top is **{a} + {b}**, bottom is **{b} + {a}**: same length! That's **commuting**.
- ZH: 上桥 **{a} + {b}**，下桥 **{b} + {a}**：长度相同！这就是**交换律**。

**Next button**
- EN: On to the Pillar Pass ▶
- ZH: 前往立柱关 ▶

---

## E. Round 3 — The Pillar Pass (associativity / support over a gap)

**Place name**
- EN: The Pillar Pass
- ZH: 立柱关

**Intro (Tau)**
- EN: **The Pillar Pass.** Each span has planks **{a} | {b} | {c}**, but one seam has a **missing post**. Add a **support** by grouping the pair over the gap, on each span: **{a}+({b}+{c})** = **({a}+{b})+{c}**.
- ZH: **立柱关。** 每座桥都有木板 **{a} | {b} | {c}**，但有处接缝**缺了立柱**。在每座桥上把缺口上的一对括起来补充**支撑**：**{a}+({b}+{c})** = **({a}+{b})+{c}**。

**Status — choose span**
- EN: a **gap** has no post: pick a span, then add a **support**
- ZH: 有处**缺口**没有立柱：先选一座桥，再加**支撑**

**Status — choose pair**
- EN: Top/Bottom span: which pair sits over the gap?
- ZH: 上桥/下桥：哪一对跨在缺口上？

**Span buttons (label when unset)**
- EN: Top span: support ?    /    Bottom span: support ?
- ZH: 上桥：支撑 ?    /    下桥：支撑 ?

**Pair options:** `( {a}+{b} )` and `( {b}+{c} )` ; back = ‹ back / ‹ 返回 ; Send = Send both ▶ / 两头一起出发 ▶

**Fail**
- EN: A seam with **no support** gives way! Group the pair sitting over the gap.
- ZH: **没支撑**的接缝塌了！把跨在缺口上的一对括起来。

**Win**
- EN: Top grouped **{a}+({b}+{c})**, bottom **({a}+{b})+{c}**: both reach **{T}**. That's **associating**.
- ZH: 上桥 **{a}+({b}+{c})**，下桥 **({a}+{b})+{c}**：都到 **{T}**。这就是**结合律**。

**Claim button**
- EN: Claim the Codex page 📖
- ZH: 领取典籍书页 📖

---

## F. Codex / book page 1 — "Addition"

**Kicker**
- EN: Introduction
- ZH: 入门之

**Title**
- EN: Addition
- ZH: 加法

**Para 1 (with dots figure)**
- EN: Addition simply means putting two or more **quantities** together.
- ZH: 加法的意义很简明：就是把两个或更多的**数量**加在一起。

**Para 2 (with bars figure)**
- EN: Throughout this book we use the **length** of a segment to stand for a **quantity**.
- ZH: 本书会经常用**线段的长度**来代表**数量**。

**Para 3 (with number‑line figure)**
- EN: Once you are used to it, just read the **length** and picture its meaning on the number line.
- ZH: 习惯之后，直接用**长度**，并想到它们在数线上的意义。

**Commutative — name / equation / prose**
- name EN: Commutative · ZH: 交换律
- eq: 1 + 2 = 2 + 1
- EN: Swap the order and the total length is unchanged. Obvious once you see it, though proving it with full rigour is not easy.
- ZH: 交换顺序，总长度不变。一眼就懂，但要严格证明其实并不简单。

**Associative — name / equation / prose**
- name EN: Associative · ZH: 组合律
- eq: (1 + 2) + 3 = 1 + (2 + 3)
- EN: However you group the steps, you arrive at the same place. Grouping is free.
- ZH: 无论怎样分组，最后都落在同一处。分组是自由的。

**Aside (bottom box)**
- EN: **Aside.** 1 + 1 = 2 looks obvious, but it is really a definition‑like choice: it matches nature, and it lets every later idea close into one complete, self‑consistent loop. 1 + 1 = 3 is not just unnatural, it could never close that loop.
- ZH: **进阶。** 1 + 1 = 2 看似简单，其实更像一个定义式的推论：一来符合自然，二来能让后面所有概念闭合成一个完整自洽的体系。1 + 1 = 3 不只是不自然，更是无法闭合成这个完整体系。

**Codex read‑aloud (narration only)**
- EN: Addition joins quantities. Order is free, and grouping is free.
- ZH: 加法把数量相加。顺序自由，分组也自由。

---

## G. Shared shell UI (used on every quest)

| Element | EN | 中文 |
|---|---|---|
| Accept button | Accept the Quest | 接受任务 |
| Read‑aloud button | 🔊 Hear Tau speak | 🔊 听 Tau 说 |
| Footer tagline | the MathO book, made playable | 可游玩的 MathO 之书 |
| Codex link | 📖 Codex | 📖 典籍 |
| Book: Close | ✕ Close | ✕ 关闭 |
| Book: Replay | ↺ Replay | ↺ 重玩 |
| Book: Map | ▣ Map | ▣ 地图 |
| Book: Next | More quests soon ▶ | 更多任务即将到来 ▶ |
| Settings | Music / Sound effects / Narration (voices) | （建议加中文：音乐 / 音效 / 旁白） |
