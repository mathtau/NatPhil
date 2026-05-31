"""Generate the OG social-card PNG: half-circle vs full-circle on the complex unit circle.

Left panel:  trajectory of e^(iθ) for θ ∈ [0, π]  — lands at (−1, 0). Tag: e^(iπ) = −1.
Right panel: trajectory of e^(iθ) for θ ∈ [0, τ]  — lands back at (1, 0). Tag: e^(iτ) = 1.

Output: og-card.png at 1200x630, suitable as the og:image for the article.
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
FIG_W, FIG_H = 12.0, 6.30  # inches → 1200 x 630 px at 100 dpi

fig = plt.figure(figsize=(FIG_W, FIG_H), dpi=DPI, facecolor=BG)

ax_left  = fig.add_axes([0.035, 0.06, 0.42, 0.88])
ax_right = fig.add_axes([0.535, 0.06, 0.42, 0.88])

R = 1.7  # axis half-range (gives a comfortable margin around the unit circle)


def style_axes(ax):
    ax.set_xlim(-R, R)
    ax.set_ylim(-R, R)
    ax.set_aspect("equal")
    ax.set_facecolor(SURFACE)
    for s in ax.spines.values():
        s.set_visible(False)
    # axes through origin (Re / Im)
    ax.axhline(0, color=AXIS, lw=1.0, zorder=1.5)
    ax.axvline(0, color=AXIS, lw=1.0, zorder=1.5)
    # tick labels at ±1
    for v in (-1, 1):
        ax.text(v, -0.10, f"{v}", color=TEXT, ha="center", va="top",
                fontsize=10, family="monospace", zorder=3)
        ax.text(-0.06, v, f"{v}i", color=TEXT, ha="right", va="center",
                fontsize=10, family="monospace", zorder=3)
    # axis labels
    ax.text(R - 0.05, -0.10, "Re", color=TEXT, ha="right", va="top",
            fontsize=12, style="italic", family="serif", zorder=3)
    ax.text(-0.06, R - 0.05, "Im", color=TEXT, ha="right", va="top",
            fontsize=12, style="italic", family="serif", zorder=3)
    ax.set_xticks([]); ax.set_yticks([])

    # full unit circle, faded (the "stage")
    full = Circle((0, 0), 1.0, facecolor="none", edgecolor=BORDER,
                  linewidth=1.0, linestyle="--", zorder=2)
    ax.add_patch(full)

    # rounded card border
    card = FancyBboxPatch(
        (-R + 0.04, -R + 0.04), 2 * R - 0.08, 2 * R - 0.08,
        boxstyle="round,pad=0,rounding_size=0.10",
        linewidth=1.2, edgecolor=BORDER, facecolor="none",
        zorder=4,
    )
    ax.add_patch(card)


def draw_traversal(ax, theta_end, traj_color, dot_color, label_text, label_color):
    """Draw the arc e^(iθ) for θ ∈ [0, theta_end], plus a dot at the endpoint,
    a position-vector arrow, and a corner equation label."""
    n = 240
    thetas = np.linspace(0, theta_end, n)
    xs = np.cos(thetas)
    ys = np.sin(thetas)
    ax.plot(xs, ys, color=traj_color, lw=2.5, zorder=5,
            solid_capstyle="round")

    # starting point (1, 0) — small muted dot
    ax.plot([1.0], [0.0], "o", color=MUTED, markersize=6, zorder=6)
    ax.text(1.02, 0.10, "θ=0", color=MUTED, fontsize=9, style="italic",
            family="serif", zorder=7)

    # endpoint dot
    ex, ey = np.cos(theta_end), np.sin(theta_end)
    ax.plot([ex], [ey], "o", color=dot_color, markersize=10, zorder=8,
            markeredgecolor=BG, markeredgewidth=1.5)

    # position vector from origin to endpoint
    arrow = FancyArrowPatch(
        (0, 0), (ex, ey),
        arrowstyle="-|>", mutation_scale=14, lw=1.5,
        color=dot_color, zorder=7, shrinkA=0, shrinkB=8,
    )
    ax.add_patch(arrow)

    # corner equation label
    ax.text(
        -R + 0.18, R - 0.22, label_text,
        color=label_color, fontsize=20, style="italic",
        family="serif", va="top", ha="left", zorder=9,
        weight="bold",
    )


# ── Left panel: half-trip ─────────────────────────────────────────
style_axes(ax_left)
draw_traversal(
    ax_left,
    theta_end=np.pi,
    traj_color=PINK,
    dot_color=PINK,
    label_text=r"$e^{i\pi} = -1$",
    label_color=PINK,
)
# small caption at bottom
ax_left.text(
    0, -R + 0.10, "half a turn",
    color=MUTED, fontsize=11, style="italic",
    family="serif", ha="center", va="bottom", zorder=9,
)

# ── Right panel: full-trip ────────────────────────────────────────
style_axes(ax_right)
draw_traversal(
    ax_right,
    theta_end=TAU - 1e-6,  # avoid landing exactly on the start dot
    traj_color=GOLD,
    dot_color=GOLD,
    label_text=r"$e^{i\tau} = 1$",
    label_color=GOLD,
)
ax_right.text(
    0, -R + 0.10, "the full circle",
    color=MUTED, fontsize=11, style="italic",
    family="serif", ha="center", va="bottom", zorder=9,
)

# ── Save ──────────────────────────────────────────────────────────
out = "og-card.png"
fig.savefig(out, dpi=DPI, facecolor=BG, edgecolor="none")
print(f"Wrote {out} at {int(FIG_W*DPI)}x{int(FIG_H*DPI)}")
