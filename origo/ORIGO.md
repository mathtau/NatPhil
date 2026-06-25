# ORIGO — game design & world bible

> Single source of truth for the ORIGO learning game. The game is a **page‑by‑page
> playable adaptation of the MathO book**. Read this before building any quest.

## 0. The source book (ESSENTIAL — do not rebuild context each time)

- **Canonical:** `../../MathO/MathO.pdf` — Chinese, **177 pages, hand‑drawn original.
  Page numbers in this doc and all quest names refer to THIS file.**
- **English content:** `../../MathO/English Version/Math Starting from O.pdf` (169 pages,
  **offset — do NOT use for page numbers**, only for EN wording).
- **Also:** `MathO.pptx` / `Math Starting from O.pptx` (same content, editable).
- **Extracted text** (for grep, no re-reading the PDF): `../../MathO/MathO-CN-text.md`,
  `../../MathO/MathO-EN-text.md` (per‑page, `===== pN =====` markers).
- **To SEE a page + its hand‑drawn charts** (charts are critical): the PDF text loses the
  graphs, and poppler isn't installed, so use **PyMuPDF**:
  `python c:/tmp/origo_book/render.py cn 7 8 9` → PNGs at `c:/tmp/origo_book/cn_pN.png`,
  then open with the image reader. (`pip install pymupdf` if missing.)
- More source books will be ingested over time; this whole project is built on them.

## 1. Quest model

- **One quest ≈ one book page.** The book is 177p, so expect **~100+ quests** over time.
- Each quest is a level: `origo/NN-slug.html` + `NN-slug_zh.html` (EN + ZH), same engine/feel.
- **Core rule:** every action is a **decision the player can get right or wrong, with
  feedback** — no passive "press to advance." (See auto-memory `feedback_game_decisions`.)
- Symbol/role colours follow the house theme (gold τ, etc.).

## 2. Story / world

ORIGO is a world that unfolded from a single point, **O**. The **Unravelling** — a Fog we
name **Chaos** — devours everything no longer understood; forgotten lands dissolve. You are
a **Pathfinder**, rebuilding ORIGO truth by truth, page by page, until you can redraw the
**Great Circle (τ)** and seal **the Rift** at the world's heart.

## 3. Structure — the chain of **C**s

The math spine deliberately steps **C → C**: **C**ircle → **C**alculus → **C**osine →
**C**omplex, beginning at the **C**radle and ending at the Great **C**ircle (τ), all menaced
by **C**haos. Each act starts and ends on a C‑word, chaining into the next.

| # | Region (map) | Arc | Book pages | Status |
|---|---|---|---|---|
| Prologue | **The Cradle** | first marks at O — count · add · multiply | **p6–8** | Q1 built |
| Act I | **The Coil** | **Circle → Calculus** | **p9–35** | locked |
| Act II | **The Cascade** | **Calculus → Cosine** | **p36–77** | locked |
| Act III | **The Cipher** | **Cosine → Complex** numbers | **p78–142** | locked |
| Side | **The Catacombs** | optional trials / lost lore (off the main chain) | **p143–177** | locked |
| Finale | **The Great Circle (τ)** | redraw it, seal the Rift | — | locked |

(Names chosen for the C‑theme + the existing ORIGO fantasy tone. The `world.html` map still
shows an older 4‑act layout — **rebuild it to match this table**.)

### Locations (per region)
- **Cradle:** O — the First Point; Tally Meadow; the Grouping Groves.
- **Coil:** Circle Glade · **the Round Kitchen** (Curvo's bakery) · the Coil · Slope Steps · Calculus Cliffs.
- **Cascade:** Cascade Falls · Limit Ledge · the Turning Tide · Cosine Cove.
- **Cipher:** Cosine Coast · the Cipher Depths · the Imaginary Shore · Complex Isle.
- **Catacombs:** the Vault of Lost Pages.

## 4. NPCs

**Companions / friends**
- **Tau the Bull (τ)** — your mount & companion; charges a full turn to redraw circles; carries you between regions.
- **Sigma (Σ), the Tallykeeper** — hub sage & quest‑giver; sums your progress, keeps the Codex (the book), hands out the next quest.
- **O, the First Point** — silent oracle at the Cradle's heart; speaks in single truths.

**Quest‑givers / mentors** (one per region, C‑named)
- **Countess Cara** — Cradle; first‑teacher of marks (count/add/multiply).
- **Master Curvo, the Baker** — Coil; runs **the Round Kitchen**, where everything worth making is round. Teaches you to **measure round things by baking them**: the crust all the way round (circumference **τ**), how much dough fills a pizza or a donut (area), and later how much filling sits under a curved crust (calculus). Catchphrase: *"measure it all the way round."* (Re-skinned 2026-06-25 from "the Cartwright" — the food theme makes Q6 pizza / Q7 donut cohere and carries into calculus. The calf **Tau** stays as companion.)
- **Cascadia, the River‑Sage** — Cascade; flow, limits, the turning tide (calculus→cos).
- **The Ciphress** — Cipher; keeper of hidden/imaginary numbers; guards the Complex plane.

**Foes / monsters** (Chaos's brood — each a misconception or void)
- **Chaos** — the Unravelling itself; the Fog that uncreates understanding; sealed only by the Great Circle.
- **Pi the Halver (π)** — recurring comic rival; a smug half‑circle "prophet" who insists half is enough and keeps stealing τ's other half. On‑brand; may turn ally late. **In the Coil he runs the rival half‑pizza stall next door**, preaching that half a turn (π) is plenty — the foil to Curvo's "measure it all the way round."
- **The Discontinui** — chasm‑beasts that rip the continuity path (gaps/jumps).
- **Null & the Void** — twin wraiths of 0 and the undefined (divide‑by‑zero traps).
- **Infinitum (∞)** — endless serpent; Cascade boss (limits / divergence).
- **The Imaginary** — Act III lieutenant; turns the real into the imaginary, opens the Rift.
- **Fogwraiths / NaN‑things** — common Chaos minions (undefined corruption).

## 5. Current state

- **Quest 1 — p6 · Addition** (入门之加法): joining groups, number line, commutativity,
  associativity. **Built** (`01-addition.html` + `_zh`); map node live.
- **NEXT → Quest 2 — p7 · Multiplication** (入门之乘法): repeated equal groups, the **area
  model** (2×3=6), commutativity, associativity, distributivity (2×1 + 2×3 = 2×(1+3)).
- After: p8 (third Cradle topic), then Act I opens at p9.

## 6. Open decisions (resume here)

Paused 2026-06-04 — return to these:
1. **Fix the "1 + 1 = 3 — a riddle for a land far ahead" line** in `01-addition.html` (EN+ZH): it promises a payoff this curriculum never gives. → replace with a real forward‑tease (e.g. toward the circle/τ) or cut.
2. **Build Quest 2 = p7 · Multiplication** (repeated groups → area model; commutative/associative/distributive) on the Q1 template.
3. **Richer Codex:** each Codex entry = the actual book page (graphs) + downloadable **PDF + image**; reassemble the full book by end‑game. Prototype on Q1 first. (Language‑matched page; render via the book helper.)
4. (older) Rebuild `world.html` map to the C‑structure above.
