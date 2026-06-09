"""Generate the OG social-card PNG for "One Full Turn".

The thesis as a picture: many spinning arrows on one circle, one of them FROZEN
(gold). The spinning rest average away to nothing, so the running average (pink)
lands exactly on the frozen arrow's tip, that block's strength a_k. That single
"freeze one, average the rest" move is what Taylor, Fourier, and Cauchy each read.

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

# left: the complete circle; right: the title + equations
ax   = fig.add_axes([0.015, 0.05, 0.45, 0.90])
axT  = fig.add_axes([0.475, 0.07, 0.51, 0.86])
axT.axis("off")

R = 1.24  # axis half-range; the unit circle nearly fills the panel

ax.set_xlim(-R, R)
ax.set_ylim(-R, R)
ax.set_aspect("equal")
ax.set_facecolor(SURFACE)
for s in ax.spines.values():
    s.set_visible(False)
ax.set_xticks([]); ax.set_yticks([])
ax.axhline(0, color=AXIS, lw=0.8, zorder=1.2)
ax.axvline(0, color=AXIS, lw=0.8, zorder=1.2)

card = FancyBboxPatch(
    (-R + 0.035, -R + 0.035), 2 * R - 0.07, 2 * R - 0.07,
    boxstyle="round,pad=0,rounding_size=0.06",
    linewidth=1.2, edgecolor=BORDER, facecolor="none", zorder=4)
ax.add_patch(card)

# THE COMPLETE CIRCLE: a faint disk + a bold solid cyan rim
ax.add_patch(Circle((0, 0), 1.0, facecolor=CYAN, edgecolor="none",
                    alpha=0.07, zorder=1.4))
ax.add_patch(Circle((0, 0), 1.0, facecolor="none", edgecolor=CYAN,
                    linewidth=3.0, alpha=0.95, zorder=2))

# drawn the way the §1 figure shows the move: a spinning arrow exp(ikθ) sweeps
# one whole turn, leaving a coloured trail of every position it visits; the running
# average of those positions spirals from the rim down to nothing.
KSPIN, M = 3, 160
hsv = plt.cm.hsv
for j in range(M + 1):
    th = TAU * j / M
    ax.plot([np.cos(KSPIN * th)], [np.sin(KSPIN * th)], "o",
            color=hsv(0.82 * j / M), markersize=3.3, alpha=0.85, zorder=3)

# running average (1/s)∫₀ˢ e^{ikθ}dθ = (e^{iks}-1)/(iks): a dashed inward spiral
ss = np.linspace(0.04, TAU, 420)
av = (np.exp(1j * KSPIN * ss) - 1) / (1j * KSPIN * ss)
ax.plot(av.real, av.imag, color=PINK, lw=1.8, alpha=0.6,
        linestyle=(0, (5, 3)), zorder=5)

# the gold arrow exp(ikθ) at the end of the turn: theta = tau, back where it began
gx, gy = np.cos(KSPIN * TAU), np.sin(KSPIN * TAU)
ax.add_patch(FancyArrowPatch((0, 0), (gx, gy), arrowstyle="-|>", mutation_scale=16,
             lw=2.8, color=GOLD, zorder=7, shrinkA=0, shrinkB=6))
ax.plot([gx], [gy], "o", color=GOLD, markersize=6, zorder=8,
        markeredgecolor=BG, markeredgewidth=1.2)
ax.text(gx + 0.04, gy + 0.17, r"$\theta = \tau$", color=GOLD, fontsize=13,
        style="italic", family="serif", zorder=9, ha="left", va="center")

# the average has landed at the centre: nothing
ax.plot([0], [0], "o", color=PINK, markersize=10, zorder=9,
        markeredgecolor=BG, markeredgewidth=1.5)
ax.text(0.13, -0.05, "average", color=PINK, fontsize=11, style="italic",
        family="serif", zorder=9, ha="left", va="center")

ax.text(0, -R + 0.07, "spin once around the circle; the average spirals in to nothing",
        color=MUTED, fontsize=9, style="italic", family="serif",
        ha="center", va="bottom", zorder=9)

# ── right panel: title + the three equations + thesis ────────────
axT.text(0.5, 0.965, "One Complete Circle", color=GOLD, fontsize=30, family="serif",
         weight="bold", va="top", ha="center")
axT.text(0.5, 0.805, "Three Exquisite Equations", color=TEXT, fontsize=18.5,
         family="serif", va="top", ha="center")

rows = [
    (GREEN, r"$\mathbf{Taylor}\quad f = \sum_k a_k\,(z-P)^k$"),
    (CYAN,  r"$\mathbf{Fourier}\quad c_k = \frac{1}{\tau}\int_0^{\tau} f\,e^{-ik\theta}\,d\theta$"),
    (GOLD,  r"$\mathbf{Cauchy}\quad f(P) = \frac{1}{\tau i}\oint \frac{f}{z-P}\,dz$"),
]
y0 = 0.595
for i, (col, eq) in enumerate(rows):
    axT.text(0.5, y0 - i * 0.175, eq, color=col, fontsize=18.5, family="serif",
             va="center", ha="center")

axT.text(0.5, 0.05, "only the part that never spins survives",
         color=TEXT, fontsize=14, style="italic", family="serif",
         va="bottom", ha="center")

# ── Save ──────────────────────────────────────────────────────────
out = "og-card.png"
fig.savefig(out, dpi=DPI, facecolor=BG, edgecolor="none")
print(f"Wrote {out} at {int(FIG_W*DPI)}x{int(FIG_H*DPI)}")
