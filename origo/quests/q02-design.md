# Quest 2 design — "The Sown Field" (book p7 · Multiplication)

Source: MathO p7 「入门之 乘法」. Big idea: **a product is an AREA** (`a×b` = area of an a×b rectangle). p6 = length; p7 = area. This is the hinge for Act I (Circle→Calculus: disk area).

## Story (the Cradle, continues Q1)
Q1: bridge gaps so the starving calves feed. Q2: the herd is growing — now grow a **pasture**. Grass amount = **area = rows × columns**. Tau (the calf) is the giver again; Sigma still later.

## Rounds (each a right/wrong decision; reuse engine + a new area-grid mechanic)
1. **Area = rows × cols** — *N* calves, 1 tile each. Plant a field of exactly *N* tiles by choosing **rows × cols** (set with +/−). Field fills with unit grass tiles; label "a rows of b = a×b". Wrong product → calves unfed / waste (fail). (multiplication = repeated addition = area)
2. **Commutative (rotate)** — a plot is wider-than-tall; rotate your `a×b` field to `b×a` to fit it. Same tiles → `a×b = b×a`.
3. **Distributive (combine patches)** — one long field = two patches sharing a height: `a×(b+c)` = `a×b + a×c`. Merge/split patches over a gap to feed two pens; factor out the shared side. (echoes Q1 grouping)

(Associative `a×b×c` — book p7 has NO diagram; mention in codex prose only, no round.)

## Figures (hand-drawn, book.js): area-grid
- `arr` : array of unit dot-squares (a rows × b), like p7 diagram 1.
- `rect`: filled a×b grid rectangle with side labels a (red, vertical) & b (blue, horizontal) → area.
- `rotate`: a×b rect and its b×a rotation, equal area.
- `distribute`: rect a×b + rect a×c = rect a×(b+c) sharing the red side.
Colors per book: side lengths red(vertical)/blue(horizontal); product/area green.

## Codex page 2 — "Multiplication / 乘法" (improve prose, don't copy)
- Para: Multiplication is adding several **equal** quantities; we read a product as the **area** of a rectangle.  a×b.
- Commutative: turn the rectangle — same area.  a×b = b×a.
- Distributive: glue rectangles that share a side — pull the shared side out.  a×(b+c) = a×b + a×c.
- (aside: associative a×(b×c)=(a×b)×c, order of grouping is free.)

## Build notes
- Single-page app: `play.html?q=02`; content module `quests/q02.js` (window.QUEST_q02), book spec `book:{page:2,...}`.
- Reuse `drawLanes`? No — needs a grid scene. Add `FIG.areaGrid`/field drawing (gold/green tiles on the navy field) + the existing terrain/grass/bull for framing.
- Sets up p8 (Q3): x·y rectangle for general lengths, unit square, reciprocals.
