"""Render a 500x500 avatar PNG: gold τ on the NatPhil dark-blue background.

Matches the favicon glyph at higher resolution. Circular crop is on-message
(τ is the full-circle constant) so this is rendered as a full square that
GitHub / other platforms can crop into a circle.
"""
from __future__ import annotations

import io

import matplotlib.pyplot as plt
from PIL import Image, ImageFilter, ImageChops

BG   = "#0c0c1e"
GOLD = "#f0c040"

SIZE = 500
DPI  = 200
INCH = SIZE / DPI  # 2.5 → with dpi=200 yields 500 px

# ── Render the bare τ at high resolution ──────────────────────────
def render_tau(facecolor=BG) -> Image.Image:
    fig = plt.figure(figsize=(INCH, INCH), dpi=DPI, facecolor=facecolor)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_axis_off(); ax.set_xlim(0, 1); ax.set_ylim(0, 1)
    ax.set_facecolor(facecolor)
    ax.text(0.45, 0.46, r"$\tau$", color=GOLD,
            fontsize=220, family="serif", ha="center", va="center")
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=DPI, facecolor=facecolor)
    plt.close(fig)
    buf.seek(0)
    return Image.open(buf).convert("RGBA")


# Crisp τ (final layer)
crisp = render_tau(facecolor=BG)

# Glow source: same τ rendered on a TRANSPARENT canvas, then blurred.
# (Rendering on BG and blurring would smear the dark color outward; we want
# the gold to bleed out into the dark background instead.)
def render_tau_transparent() -> Image.Image:
    fig = plt.figure(figsize=(INCH, INCH), dpi=DPI)
    fig.patch.set_alpha(0)
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_axis_off(); ax.set_xlim(0, 1); ax.set_ylim(0, 1)
    ax.patch.set_alpha(0)
    ax.text(0.45, 0.46, r"$\tau$", color=GOLD,
            fontsize=220, family="serif", ha="center", va="center")
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=DPI, transparent=True)
    plt.close(fig)
    buf.seek(0)
    return Image.open(buf).convert("RGBA")


glow_src = render_tau_transparent()

# Build a soft halo: blur the transparent τ heavily and stack a couple of
# scales to get both a tight inner glow and a wide outer glow.
inner_glow = glow_src.filter(ImageFilter.GaussianBlur(radius=14))
outer_glow = glow_src.filter(ImageFilter.GaussianBlur(radius=42))

# Dim the glows so they read as luminance, not as the main shape.
def fade(img: Image.Image, factor: float) -> Image.Image:
    r, g, b, a = img.split()
    a = a.point(lambda v: int(v * factor))
    return Image.merge("RGBA", (r, g, b, a))


inner_glow = fade(inner_glow, 0.55)
outer_glow = fade(outer_glow, 0.30)

# Composite: BG → outer glow → inner glow → crisp τ
out = Image.new("RGBA", crisp.size, BG)
out.alpha_composite(outer_glow)
out.alpha_composite(inner_glow)
out.alpha_composite(crisp)

out = out.convert("RGB")
out.save("avatar.png", "PNG")
print(f"Wrote avatar.png at {out.size[0]}x{out.size[1]}")
