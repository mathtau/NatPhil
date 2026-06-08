# ORIGO — foundation architecture (recyclable for ~100+ quests × 2 langs + a rebuilt book)

> Goal: build the engine ONCE so each new quest is mostly *content*, and the MathO book is
> *rewritten one polished page per quest*. Draft for sign-off (see "Open decisions").

## The 3‑layer model (the whole point)

```
LAYER 1 · ENGINE      (write once, never per-quest)
  game.js   — shell/HUD: quest scroll, quest tracker, XP/level/level-up, companion+bubble+moods,
              audio toggles, place banners, generic scene runner + animation + outcome (cross/feed/fall)
  book.js   — renders a real BOOK PAGE from structured content; exports PNG + PDF; reassembles full book
  audio.js  — bgm + sfx manager (preload, volume, mute, autoplay-safe), settings: music/sfx/narration
  save.js    — single save schema (below)
  i18n.js    — string lookup + runtime lang switch (NO twin files)
  ui.css / book.css — all shared styling

LAYER 2 · FIGURES     (figures.js — the KEYSTONE of recyclability)
  One library of math diagram components used by BOTH the interactive game scene AND the book page:
  numberLine, areaGrid, circleSpokes, ringSlice, bellCurve, rectangle, tray-of-planks, … each takes
  a spec + a target (live canvas OR static book figure). Build a figure once → reuse across quests
  and across game/book. This is what stops the "redraw everything every page" pain.

LAYER 3 · CONTENT     (per quest — this is all that grows)
  quests/qNN/quest.js : config + interaction (which figures, which rounds, win/lose, strings keys)
  quests/qNN/page.js  : the BOOK page content (title, prose, figure specs, examples, laws) — EN+ZH
```

## Delivery shape
**Single‑page app:** `origo/play.html?q=07&lang=zh` — one shell loads the quest's content module.
Kills the EN/ZH twin‑file problem and the per‑quest‑file explosion (1 app, content as data).
(Old `01-addition.html` becomes a thin redirect to `play.html?q=01`.)

## The two engines
- **Game engine** runs a quest = a list of *rounds*; each round = `{place, narration, figure+interaction, check→ right/wrong feedback}`. Reuses figures + outcome animations.
- **Book engine** turns `page.js` into a typeset, illustrated page (not a notes summary): prose + the SAME figures rendered statically, page number, brand frame. Buttons: **⤓ PNG · ⤓ PDF**. End‑game: **assemble all reclaimed pages → one PDF** (the rebuilt MathO book). We re‑author the book one good page per quest.

## Art upgrade (kill the "cheap" look)
- **One art direction**, brand-consistent: *gold‑ink line‑art on deep navy, hand‑drawn feel* (matches the book + medallion). **Drop ALL emoji** (mount, grass, fog, 💥) → custom SVG sprites.
- **Asset kit** `assets/art/`: animated gold **bull mount**, grass, drifting **fog**, NPC portraits (Sigma, Cara…), monsters (Pi‑the‑Halver, Fogwraiths), tiles (ledge/post/plank). SVG `<symbol>` sprite system; **per‑region palettes** (Cradle green → Coil → Cascade → Cipher).
- Open decision: **pure SVG kit (I author)** vs **AI‑generated raster backgrounds + SVG sprites**. Recommend SVG‑first (crisp, tiny, themeable, on‑brand); raster only for lush backdrops if wanted.

## Buttons & tray (UI convention — applies to every quest)
**Fixed positions, never reflow.** A round renders the SAME set of buttons in the SAME order on every `refresh()`. A button not usable in the current state is **locked** (greyed via the `dim` flag), NOT removed or swapped — so nothing jumps around. Locked buttons stay clickable and pop a one‑line hint saying why (e.g. "↺ reshape first", "copy the row first"). Also keep each button's **label a fixed width**: don't change its text between states or the row re‑wraps and shifts — e.g. the copy button is always `✦ Product: copy ✦`, never `copy the row` → `copy again`.

**Button types (same job → same look, across all quests).** Signature: `E.addBtn(label, type, fn, dim)` (`dim=true` greys it but keeps the click for the hint). Types live in `engine.css`:
- `primary` — the forward/commit action: **Send the herd ▶**, **On to … ▶** (advance), **Claim the Codex 📖**. Gold fill.
- `magic` — the magic action (**✦ Product: copy ✦**). Violet fill (matches the wizard).
- `grass` / `wheat` — crop steppers (`+`/`−`); green / amber tint (a crop's `+` and `−` share its colour).
- `p1`–`p4` — q01 plank steppers, coloured by value (blue / green / gold / orange).
- `ghost` — secondary & navigation: **◀ Prev step**, **↻ Replay**, **‹ back**, **− a copy**, **↺ reshape the row**. Muted, no fill.
- `on` — a selected/toggled choice (highlighted); `dim` — locked/greyed.

## Audio (free / CC0)
- **SFX:** Kenney.nl (CC0, no attribution) — place‑plank click, success chime/“nom”, fail thud/fall, level‑up fanfare, bracket snap, UI tick.
- **BGM:** CC0/CC‑BY ambient loops (Kenney music packs / Pixabay / Incompetech CC‑BY w/ credit); a calm per‑region loop.
- `audio.js` preloads, starts on first tap (autoplay policy), volume + per‑channel mute; the current 🔇 becomes a small **settings** popover: Music / SFX / Narration.

## Save schema (define once)
`localStorage["origo"] = { xp, level, need, act, quests:{ "q01":"done", … }, pages:[6,…] }` — map + codex + book all read this.

## Pedagogy fixes (applied when Q1 is refactored onto the engine)
- Commutativity = a real **swap** action (2+3 → 3+2, same bridge), not "fill two lanes."
- Associativity = choose a **grouping**, see the **total unchanged** — not the invented seam/post puzzle.
- Cut/replace the "1 + 1 = 3 … riddle" line (no payoff) → a real τ forward‑tease.

## Build order
1. Engine skeleton (game.js + ui.css + save.js + i18n.js) + figures.js with the Cradle figures (numberLine, planks, areaGrid).
2. book.js + first real book page (p6) with PNG/PDF export.
3. audio.js + sourced CC0 sfx/bgm; settings popover.
4. SVG art kit v1 (mount, grass, fog, Sigma/Cara, tiles).
5. **Refactor Quest 1 onto the engine** (proof) + apply pedagogy fixes.
6. Quest 2 (p7 multiplication) = mostly content + the area‑grid figure.

## Open decisions to confirm
A. Single‑page app (`play.html?q=&lang=`) vs per‑quest files. (Rec: single‑page app.)
B. Art: pure SVG kit vs AI‑raster backgrounds. (Rec: SVG‑first.)
C. Book export: client‑side PDF (jsPDF/print) vs server/py. (Rec: client print‑to‑PDF + PNG via canvas.)
D. Scope/order: build the whole engine first, or grow it while redoing Q1? (Rec: minimal engine → Q1 → harden.)
