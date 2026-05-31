"""Generate the OG social-card PNG: square-tile vs donut-tile views of exp(-r^2/2).

Output: og-card.png at 1200x630, suitable as the og:image for the site.
"""
from __future__ import annotations

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Circle, FancyBboxPatch
from matplotlib.colors import LinearSegmentedColormap

# ── Palette (matches index.html CSS) ──────────────────────────────
BG       = "#0c0c1e"
SURFACE  = "#111128"
BORDER   = "#22224a"
TEXT     = "#c4c4dc"
MUTED    = "#60607a"
GOLD     = "#f4c830"
CYAN     = "#40c8f0"
ORANGE   = "#f08840"
PINK     = "#d040a0"
AXIS     = "#38385a"

# Gold-on-dark colormap that matches the on-page heatmap
gold_cmap = LinearSegmentedColormap.from_list(
    "gold_dark",
    [(0.00, BG), (0.05, "#1a1730"), (0.30, "#604a20"), (0.60, "#b88830"),
     (1.00, GOLD)],
)

# ── Figure: 1200 x 630 ────────────────────────────────────────────
DPI = 100
FIG_W, FIG_H = 12.0, 6.30  # inches  → 1200 x 630 px at 100 dpi

fig = plt.figure(figsize=(FIG_W, FIG_H), dpi=DPI, facecolor=BG)

# Two square axes side by side
ax_left  = fig.add_axes([0.035, 0.06, 0.42, 0.88])
ax_right = fig.add_axes([0.535, 0.06, 0.42, 0.88])

R = 3.5  # axis half-range


def style_axes(ax):
    ax.set_xlim(-R, R)
    ax.set_ylim(-R, R)
    ax.set_aspect("equal")
    ax.set_facecolor(SURFACE)
    for s in ax.spines.values():
        s.set_visible(False)
    # axes through origin
    ax.axhline(0, color=AXIS, lw=1.0, zorder=1.5)
    ax.axvline(0, color=AXIS, lw=1.0, zorder=1.5)
    # tick marks: -3,-2,-1,1,2,3 along each axis
    for v in (-3, -2, -1, 1, 2, 3):
        ax.text(v, -0.18, f"{v}", color=TEXT, ha="center", va="top",
                fontsize=10, family="monospace", zorder=3)
        ax.text(-0.12, v, f"{v}", color=TEXT, ha="right", va="center",
                fontsize=10, family="monospace", zorder=3)
    # axis labels
    ax.text(R - 0.05, -0.18, "x", color=TEXT, ha="right", va="top",
            fontsize=13, style="italic", family="serif", zorder=3)
    ax.text(-0.12, R - 0.05, "y", color=TEXT, ha="right", va="top",
            fontsize=13, style="italic", family="serif", zorder=3)
    ax.set_xticks([]); ax.set_yticks([])

    # rounded card border (drawn just inside axes)
    card = FancyBboxPatch(
        (-R + 0.06, -R + 0.06), 2 * R - 0.12, 2 * R - 0.12,
        boxstyle="round,pad=0,rounding_size=0.18",
        linewidth=1.2, edgecolor=BORDER, facecolor="none",
        zorder=4,
    )
    ax.add_patch(card)


# ── Left panel: square tiling ─────────────────────────────────────
style_axes(ax_left)

N = 28  # number of tiles per side
edges = np.linspace(-R, R, N + 1)
centers = 0.5 * (edges[:-1] + edges[1:])
X, Y = np.meshgrid(centers, centers)
Z = np.exp(-(X**2 + Y**2) / 2.0)

ax_left.pcolormesh(
    edges, edges, Z,
    cmap=gold_cmap, vmin=0.0, vmax=1.0,
    shading="flat", zorder=2,
    edgecolors=BG, linewidth=0.4,
)

# Highlight one tile (pink) around x=1.4, y=0, plus leader line and label
tile_w = (2 * R) / N
tx, ty = 1.30, -0.13
hi_tile = Rectangle(
    (tx, ty), tile_w, tile_w,
    linewidth=1.6, edgecolor=PINK, facecolor="none", zorder=5,
)
ax_left.add_patch(hi_tile)

# Leader line out to label
lx0 = tx + tile_w
ly0 = ty + tile_w / 2
lx1, ly1 = 2.05, ly0
ax_left.plot([lx0, lx1], [ly0, ly1], color=PINK, lw=1.0, zorder=5)
ax_left.text(
    lx1 + 0.06, ly1, r"$dx \cdot dy$", color=PINK, fontsize=14,
    style="italic", va="center", ha="left", zorder=6,
)

# ── Right panel: donut tiling ─────────────────────────────────────
style_axes(ax_right)

# Filled annuli from outer to inner so the central disk overlays smaller rings.
N_RINGS = 11
ring_radii = np.linspace(0.0, R - 0.4, N_RINGS + 1)
# Render outer→inner so later (smaller) rings paint on top
for k in range(N_RINGS, 0, -1):
    r_outer = ring_radii[k]
    r_inner = ring_radii[k - 1]
    r_mid = 0.5 * (r_outer + r_inner)
    val = float(np.exp(-r_mid**2 / 2.0))
    color = gold_cmap(val)
    circ = Circle(
        (0, 0), r_outer, facecolor=color, edgecolor=BG,
        linewidth=0.8, zorder=2,
    )
    ax_right.add_patch(circ)

# Highlight one donut (cyan) at radius ~1.5 with thickness dr
r_hi_mid = 1.5
dr = 0.32
r_in = r_hi_mid - dr / 2
r_out = r_hi_mid + dr / 2
ax_right.add_patch(Circle((0, 0), r_in,  facecolor="none",
                          edgecolor=CYAN, linewidth=1.6, zorder=6))
ax_right.add_patch(Circle((0, 0), r_out, facecolor="none",
                          edgecolor=CYAN, linewidth=1.6, zorder=6))

# Leader line to outer edge at angle and label
angle = -0.20 * np.pi  # up and to the right
lx0 = r_out * np.cos(angle)
ly0 = r_out * np.sin(angle) * -1  # flip y because matplotlib y goes up
# We'll use plain (cos, sin) — matplotlib y axis is up, our angle is in standard math:
lx0 = r_out * np.cos(angle)
ly0 = r_out * np.sin(angle)
# but we want the label up-and-right, so use a positive angle instead
angle = 0.32 * np.pi
lx0 = r_out * np.cos(angle)
ly0 = r_out * np.sin(angle)
lx1 = (r_out + 0.9) * np.cos(angle)
ly1 = (r_out + 0.9) * np.sin(angle)
ax_right.plot([lx0, lx1], [ly0, ly1], color=CYAN, lw=1.0, zorder=7)
ax_right.text(
    lx1 + 0.06, ly1, r"$\tau \cdot r \cdot dr$", color=ORANGE, fontsize=14,
    style="italic", va="center", ha="left", zorder=8,
)

# ── Save ──────────────────────────────────────────────────────────
out = "og-card.png"
fig.savefig(out, dpi=DPI, facecolor=BG, edgecolor="none")
print(f"Wrote {out} at {int(FIG_W*DPI)}x{int(FIG_H*DPI)}")
