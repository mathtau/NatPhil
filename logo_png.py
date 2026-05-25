"""Generate logo.png (512x512) and logo-minimal.png (512x512), matching the
visual design of logo.svg / logo-minimal.svg.

Uses Pillow with 4× supersampling + LANCZOS downscale for clean antialiased
ring strokes. Rendered text uses Georgia Italic to match the SVG.
"""
from __future__ import annotations

import os
from PIL import Image, ImageDraw, ImageFont

# ── Palette (matches index.html CSS) ──────────────────────────────────
BG_HEX   = "#0c0c1e"
GOLD_HEX = "#f0c040"

# ── Output config ─────────────────────────────────────────────────────
OUT_SIZE   = 512                       # final PNG side, px
SVG_UNIT   = 200                       # logo SVG viewBox extent
SUPER      = 4                         # supersampling factor
WORK_SIZE  = OUT_SIZE * SUPER
WORK_SCALE = WORK_SIZE / SVG_UNIT      # px per SVG unit at work resolution

GEORGIA_ITALIC_PATHS = [
    r"C:\Windows\Fonts\georgiai.ttf",
    "/Library/Fonts/Georgia Italic.ttf",
    "/usr/share/fonts/truetype/msttcorefonts/Georgia_Italic.ttf",
]


def _hex(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


BG   = _hex(BG_HEX)
GOLD = _hex(GOLD_HEX)


def _font(size_px: int) -> ImageFont.FreeTypeFont:
    for p in GEORGIA_ITALIC_PATHS:
        if os.path.exists(p):
            return ImageFont.truetype(p, size_px)
    return ImageFont.load_default()


def _make_canvas() -> Image.Image:
    img = Image.new("RGBA", (WORK_SIZE, WORK_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    rx = int(28 * WORK_SCALE)
    d.rounded_rectangle(
        (0, 0, WORK_SIZE - 1, WORK_SIZE - 1),
        radius=rx,
        fill=BG + (255,),
    )
    return img


def _add_ring(img: Image.Image, cx: float, cy: float, r: float,
              color_rgb: tuple[int, int, int], alpha: float,
              stroke: float) -> None:
    """Draw a ring at SVG-coord centre (cx, cy) with radius r and stroke width
    in SVG units, optionally at fractional opacity (alpha)."""
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    cx_p = cx * WORK_SCALE
    cy_p = cy * WORK_SCALE
    r_p  = r  * WORK_SCALE
    w_p  = max(1, int(round(stroke * WORK_SCALE)))
    bbox = (cx_p - r_p, cy_p - r_p, cx_p + r_p, cy_p + r_p)
    d.ellipse(bbox, outline=color_rgb + (255,), width=w_p)
    if alpha < 1.0:
        a = layer.split()[3].point(lambda v: int(v * alpha))
        layer.putalpha(a)
    img.alpha_composite(layer)


def _add_tau(img: Image.Image, x: float, y: float, font_size_svg: float,
             color_rgb: tuple[int, int, int]) -> None:
    """Place 'τ' so that its horizontal middle is at x and alphabetic baseline
    at y, in SVG units. Matches text-anchor='middle' + default baseline."""
    px = int(round(font_size_svg * WORK_SCALE))
    f = _font(px)
    d = ImageDraw.Draw(img)
    d.text(
        (x * WORK_SCALE, y * WORK_SCALE),
        "τ", font=f, fill=color_rgb + (255,),
        anchor="ms",
    )


def _save(img: Image.Image, path: str) -> None:
    out = img.resize((OUT_SIZE, OUT_SIZE), Image.LANCZOS)
    out.save(path, optimize=True)
    print(f"wrote {path}  ({OUT_SIZE}x{OUT_SIZE})")


def build_rich() -> Image.Image:
    img = _make_canvas()
    # (radius, stroke, opacity) — matches logo.svg
    rings = [
        (86, 1.6, 0.18),
        (72, 1.7, 0.36),
        (58, 1.8, 0.58),
        (44, 2.0, 0.85),
        (30, 2.8, 1.00),
    ]
    for r, sw, alpha in rings:
        _add_ring(img, 100, 100, r, GOLD, alpha, sw)
    _add_tau(img, 99, 111, 42, GOLD)
    return img


def build_minimal() -> Image.Image:
    img = _make_canvas()
    _add_ring(img, 100, 100, 68, GOLD, 1.0, 3)
    _add_tau(img, 97, 119, 78, GOLD)
    return img


if __name__ == "__main__":
    _save(build_rich(),    "logo.png")
    _save(build_minimal(), "logo-minimal.png")
