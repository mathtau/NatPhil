"""Generate the OG social-card PNG for "One Full Turn".

A single unit circle is the stage. A gold arrow e^(iθ) is mid-sweep; faded sample
dots trail behind it around the circle; a pink dot sits at the center marking the
running average (which collapses to zero over a full turn). Three corner labels —
Taylor, Cauchy, Fourier — point at the one circle, with the thesis underneath.

Output: og-card.png at 1200x630, suitable as the og:image for the article.
Mirrors euler/og_card.py in palette and structure.
"""
from __future__ import annotations

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyArrowPatch, FancyBboxPatch

# ── Palette (matches site CSS) ────────────────────────────────────
BG       = "#0c0c1e"
SURFACE  = "#111128"
BORDER   = "#22224a"
TEXT     = "#c4c4dc"
MUTED    = "#60607a"
GOLD     = "#f4c830"
CYAN     = "#40c8f0"
GREEN    = "#50d890"
PINK     = "#d040a0"
AXIS     = "#38385a"

TAU = 2 * np.pi

# ── Figure: 1200 x 630 ────────────────────────────────────────────
DPI = 100
FIG_W, FIG_H = 12.0, 6.30

fig = plt.figure(figsize=(FIG_W, FIG_H), dpi=DPI, facecolor=BG)

# left: the circle stage; right: the title + thesis text
ax   = fig.add_axes([0.04, 0.06, 0.42, 0.88])
axT  = fig.add_axes([0.50, 0.06, 0.46, 0.88])
axT.axis("off")

R = 1.7  # axis half-range


def style_axes(ax):
    ax.set_xlim(-R, R)
    ax.set_ylim(-R, R)
    ax.set_aspect("equal")
    ax.set_facecolor(SURFACE)
    for s in ax.spines.values():
        s.set_visible(False)
    ax.axhline(0, color=AXIS, lw=1.0, zorder=1.5)
    ax.axvline(0, color=AXIS, lw=1.0, zorder=1.5)
    ax.set_xticks([]); ax.set_yticks([])

    full = Circle((0, 0), 1.0, facecolor="none", edgecolor=BORDER,
                  linewidth=1.0, linestyle="--", zorder=2)
    ax.add_patch(full)

    card = FancyBboxPatch(
        (-R + 0.04, -R + 0.04), 2 * R - 0.08, 2 * R - 0.08,
        boxstyle="round,pad=0,rounding_size=0.10",
        linewidth=1.2, edgecolor=BORDER, facecolor="none", zorder=4,
    )
    ax.add_patch(card)


style_axes(ax)

# ── swept sample dots (hue by progress), arrow mid-sweep ──────────
theta_now = TAU * 0.62
thetas = np.linspace(0, theta_now, 90)
cmap = plt.cm.plasma
for k, th in enumerate(thetas):
    ax.plot(np.cos(th), np.sin(th), "o",
            color=cmap(k / len(thetas)), markersize=4.5, alpha=0.65, zorder=5)

# gold position arrow
ex, ey = np.cos(theta_now), np.sin(theta_now)
ax.add_patch(FancyArrowPatch(
    (0, 0), (ex, ey), arrowstyle="-|>", mutation_scale=16, lw=2.0,
    color=GOLD, zorder=7, shrinkA=0, shrinkB=6))
ax.plot([ex], [ey], "o", color=GOLD, markersize=10, zorder=8,
        markeredgecolor=BG, markeredgewidth=1.5)

# pink running-average dot at the center (collapses to 0 over a full turn)
ax.plot([0], [0], "o", color=PINK, markersize=12, zorder=9,
        markeredgecolor=BG, markeredgewidth=1.5)
ax.text(0.12, -0.22, "average → 0", color=PINK, fontsize=10, style="italic",
        family="serif", zorder=9)

ax.text(0, -R + 0.10, "average over one full turn", color=MUTED, fontsize=11,
        style="italic", family="serif", ha="center", va="bottom", zorder=9)

# ── right panel: title + the three names + thesis ─────────────────
axT.text(0.0, 0.92, "One Full Turn", color=GOLD, fontsize=34, family="serif",
         weight="bold", va="top", ha="left")
axT.text(0.0, 0.74, r"$e^{i\tau}$ : once around the circle", color=CYAN,
         fontsize=15, style="italic", family="serif", va="top", ha="left")

names = [("Taylor",  GREEN), ("Cauchy", GOLD), ("Fourier", CYAN)]
for i, (nm, col) in enumerate(names):
    axT.text(0.0, 0.50 - i * 0.13, f"·  {nm}", color=col, fontsize=20,
             family="serif", va="top", ha="left")

axT.text(0.0, 0.06, "three exquisite equations, one move",
         color=TEXT, fontsize=14, style="italic", family="serif",
         va="bottom", ha="left")

# ── Save ──────────────────────────────────────────────────────────
out = "og-card.png"
fig.savefig(out, dpi=DPI, facecolor=BG, edgecolor="none")
print(f"Wrote {out} at {int(FIG_W*DPI)}x{int(FIG_H*DPI)}")
