<p align="center">
  <img src="logo.svg" alt="NatPhil — τ" width="180">
</p>

<h1 align="center">Natural Derivation of the Gaussian Integral</h1>

<p align="center">
  A visual journey from linear change to the hidden circle —<br>
  how <em>τ</em> emerges naturally when you integrate the Gaussian.
</p>

<p align="center">
  <a href="https://intmathchannel.github.io/NatPhil/">Read in English</a>
  &nbsp;·&nbsp;
  <a href="https://intmathchannel.github.io/NatPhil/index_zh.html">阅读中文版</a>
</p>

---

## What's inside

Four sections, each building from the most ordinary observation to the surprising consequence:

1. **§1 — Why x²/2 is the natural distance** &nbsp; *(constant acceleration, the triangle under v = t)*
2. **§2 — How 1/x, log, and exp arise from relative change** &nbsp; *(scale invariance, the product rule)*
3. **§3 — Why exp(−x²/2) is the unique shape** &nbsp; *(quadratic energy + independence + the multiplicative product rule)*
4. **§4 — The hidden circle** &nbsp; *(why ∫ exp(−x²/2) dx = √τ — and where the τ comes from)*

Every section ships with interactive HTML5 canvas visualizations. Drag sliders, hit **▶ play**, watch the geometry build from zero.

## Run locally

It's a single static page — no build step. Open `index.html` in any modern browser, or serve the folder:

```sh
python -m http.server 8000
# then visit http://localhost:8000/
```

## Files

| File | Purpose |
|------|---------|
| `index.html` | English article (single-file, self-contained) |
| `index_zh.html` | Chinese article (中文) |
| `logo.svg` | Repo / article hero logo (rich; ≥ 64 px) |
| `logo-minimal.svg` | Favicon, mobile / inline icon (≥ 16 px) |
| `og-card.png` | Open-Graph social-share image |
| `og_card.py` | Script that regenerates `og-card.png` |

## License

Article text and figures: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — see [`LICENSE`](LICENSE). Attribution to **Int Math Channel** appreciated.
