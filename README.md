<p align="center">
  <img src="logo.svg" alt="MathTau — τ" width="180">
</p>

<h1 align="center">MathTau</h1>

<p align="center">
  <em>Mathematical explainers, derived from first principles.</em>
</p>

<p align="center">
  <a href="https://mathtau.com/">mathtau.com</a>
  &nbsp;·&nbsp;
  <a href="https://mathtau.com/index_zh.html">中文</a>
</p>

---

## What this is

MathTau publishes visual derivations of mathematical objects from first principles — not as definitions to memorize, but as inevitable consequences of simpler underlying structures. Every article is a single static HTML page with embedded interactive figures: drag a slider, hit ▶ play, watch the geometry build from zero.

This repo hosts both the site (`mathtau.com`) and all its articles, each as a subdirectory.

## Articles

| # | Article | Path | Status |
|---|---------|------|--------|
| 01 | [Natural Derivation of the Gaussian Integral](https://mathtau.com/gaussian/) | [`gaussian/`](gaussian/) | published |
| 02 | _Why e<sup>iπ</sup> + 1 = 0?_ | — | planned |
| 03 | _Why is curl curl what it is?_ | — | planned |

## Repository structure

```
.
├── index.html              ← landing page (mathtau.com/)
├── index_zh.html           ← landing page in Chinese
├── og-card.png             ← site-wide OG image (gold τ + MathTau wordmark)
├── site_og_card.py         ← script that regenerates the site OG card
├── logo.svg                ← brand mark (used in headers)
├── logo-minimal.svg        ← favicon / Apple touch icon
├── logo.png / logo-minimal.png  ← raster fallbacks
├── logo_png.py             ← script that regenerates the PNG logos
├── avatar.png              ← profile-picture format of the brand mark (500×500)
├── avatar.py               ← script that regenerates the avatar
├── CNAME                   ← custom-domain binding (mathtau.com)
├── LICENSE                 ← CC BY 4.0 legal text
└── gaussian/               ← Article §01
    ├── index.html          ← article (English, single-file, self-contained)
    ├── index_zh.html       ← article (Chinese)
    ├── og-card.png         ← article-specific OG image
    └── og_card.py          ← script that regenerates this article's OG card
```

Each article subdirectory is self-contained: open `gaussian/index.html` in a browser and the article renders without any build step. Shared assets (logo, favicon) are referenced from the repo root via absolute paths (`/logo.svg`, `/logo-minimal.svg`) so they resolve when served via GitHub Pages or a local HTTP server rooted at the repo.

## Run locally

No build step. Serve the repo root:

```sh
python -m http.server 8000
# then visit http://localhost:8000/                 → landing
#            http://localhost:8000/gaussian/        → Gaussian article
#            http://localhost:8000/gaussian/index_zh.html  → Chinese version
```

Opening individual `index.html` files directly via `file://` also works, except the `/logo.svg` absolute paths only resolve when served via HTTP. So always use the server for full fidelity.

## Contact

Typos, questions, collaboration: [tau@mathtau.com](mailto:tau@mathtau.com) or open a [GitHub issue](https://github.com/mathtau/NatPhil/issues).

## License

Article text, figures, and source code: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — see [`LICENSE`](LICENSE). Attribution to **MathTau** appreciated. Mirrors and translations welcome — please preserve attribution and link back to the canonical URL.
