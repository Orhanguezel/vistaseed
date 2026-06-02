#!/usr/bin/env python3
"""
Generate VistaSeeds X profile banner.

Requirements:
  python3 -m pip install Pillow

Output:
  backend/uploads/media/logo/x-banner-1500x500.png
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, PngImagePlugin


WIDTH = 1500
HEIGHT = 500
SCALE = 2
W = WIDTH * SCALE
H = HEIGHT * SCALE

ROOT = Path(__file__).resolve().parents[2]
LOGO_DIR = ROOT / "backend" / "uploads" / "media" / "logo"
APP_ICON = LOGO_DIR / "appletouch.png"
GREEN_LOGO = LOGO_DIR / "vistaseed_logo_green.png"
OUTPUT = LOGO_DIR / "x-banner-1500x500.png"

DEEP = (11, 63, 34)
BASE = (20, 83, 45)
MID = (27, 122, 52)
LIGHT = (47, 168, 79)


def sample_brand_green(path: Path) -> tuple[int, int, int]:
    image = Image.open(path).convert("RGBA")
    pixel_data = image.get_flattened_data() if hasattr(image, "get_flattened_data") else image.getdata()
    pixels: list[tuple[int, int, int]] = []

    for r, g, b, a in pixel_data:
        if a > 80 and g > r + 18 and g > b + 18 and 45 < g < 220:
            pixels.append((r, g, b))

    if not pixels:
        return MID

    pixels.sort(key=lambda p: p[1] - (p[0] + p[2]) / 2, reverse=True)
    top = pixels[: min(8000, len(pixels))]
    return tuple(sum(p[i] for p in top) // len(top) for i in range(3))


def mix(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def make_background(brand: tuple[int, int, int]) -> Image.Image:
    image = Image.new("RGBA", (W, H))
    px = image.load()

    for y in range(H):
        vertical = y / (H - 1)
        for x in range(W):
            horizontal = x / (W - 1)
            color = mix(DEEP, BASE, horizontal * 0.56)
            color = mix(color, mix(MID, brand, 0.34), max(0.0, horizontal - 0.33) * 0.65)
            color = mix(color, LIGHT, max(0.0, 1.0 - abs(horizontal - 0.68) * 2.2) * 0.16)

            vignette = 1.0 - 0.22 * math.hypot(horizontal - 0.55, vertical - 0.50)
            color = tuple(max(0, min(255, round(c * vignette))) for c in color)
            px[x, y] = (*color, 255)

    return image


def add_field_language(image: Image.Image) -> None:
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # The lower-left avatar area stays quiet; rows start visually after it.
    for i in range(20):
        base_y = (318 + i * 13) * SCALE
        points = []
        for x in range(-80 * SCALE, W + 120 * SCALE, 12 * SCALE):
            normalized = x / SCALE
            y = base_y + math.sin((normalized + i * 31) / 85) * (4 + i * 0.42) * SCALE
            y += ((normalized - 750) ** 2) * 0.000035 * SCALE
            points.append((x, y))
        alpha = max(7, 30 - i)
        draw.line(points, fill=(242, 255, 230, alpha), width=max(1, SCALE))

    # A calm horizon band adds depth without becoming a literal photo.
    draw.rectangle((0, 265 * SCALE, W, 268 * SCALE), fill=(255, 255, 255, 15))
    draw.rectangle((0, 269 * SCALE, W, 270 * SCALE), fill=(0, 0, 0, 18))

    for i, (x, y, s) in enumerate([(410, 130, 0.55), (535, 102, 0.42), (1230, 326, 0.50)]):
        x *= SCALE
        y *= SCALE
        s *= SCALE
        stem = [(x, y + 34 * s), (x + 3 * s, y + 13 * s), (x + 1 * s, y)]
        draw.line(stem, fill=(255, 255, 255, 20), width=max(1, round(1.7 * s)))
        draw.polygon(
            [(x + 2 * s, y + 13 * s), (x - 28 * s, y + 2 * s), (x - 8 * s, y - 8 * s)],
            fill=(255, 255, 255, 17 - i * 2),
        )
        draw.polygon(
            [(x + 4 * s, y + 12 * s), (x + 30 * s, y - 1 * s), (x + 9 * s, y - 7 * s)],
            fill=(255, 255, 255, 16 - i * 2),
        )

    image.alpha_composite(overlay.filter(ImageFilter.GaussianBlur(0.45 * SCALE)))


def keep_largest_component(mask: Image.Image) -> Image.Image:
    width, height = mask.size
    src = mask.load()
    visited: set[tuple[int, int]] = set()
    best: list[tuple[int, int]] = []

    for y in range(height):
        for x in range(width):
            if src[x, y] == 0 or (x, y) in visited:
                continue

            stack = [(x, y)]
            visited.add((x, y))
            component: list[tuple[int, int]] = []

            while stack:
                cx, cy = stack.pop()
                component.append((cx, cy))
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    if src[nx, ny] == 0 or (nx, ny) in visited:
                        continue
                    visited.add((nx, ny))
                    stack.append((nx, ny))

            if len(component) > len(best):
                best = component

    out = Image.new("L", mask.size, 0)
    dst = out.load()
    for x, y in best:
        dst[x, y] = src[x, y]
    return out


def extract_monogram() -> Image.Image:
    source = Image.open(APP_ICON).convert("RGBA")
    pixels = source.load()
    mask = Image.new("L", source.size, 0)
    mask_px = mask.load()

    for y in range(source.height):
        for x in range(source.width):
            r, g, b, _ = pixels[x, y]
            luminance = r * 0.299 + g * 0.587 + b * 0.114
            chroma = max(r, g, b) - min(r, g, b)
            mask_px[x, y] = max(0, min(255, round((96 - luminance) * 3.2))) if luminance < 96 and chroma < 38 else 0

    mask = keep_largest_component(mask)
    bbox = mask.getbbox()
    if bbox is None:
        raise RuntimeError(f"Could not extract monogram from {APP_ICON}")

    mask = mask.crop(bbox)
    mark = Image.new("RGBA", mask.size, (255, 255, 255, 0))
    mark.putalpha(mask)
    return mark


def add_monogram_watermark(image: Image.Image) -> None:
    mark = extract_monogram()
    target = 370 * SCALE
    scale = target / max(mark.size)
    mark = mark.resize((round(mark.width * scale), round(mark.height * scale)), Image.Resampling.LANCZOS)
    alpha = mark.getchannel("A").point(lambda p: round(p * 0.12))
    mark.putalpha(alpha)

    image.alpha_composite(mark, (1045 * SCALE, 118 * SCALE))


def find_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def add_wordmark(image: Image.Image) -> None:
    draw = ImageDraw.Draw(image)
    title_font = find_font(78 * SCALE, bold=True)
    sub_font = find_font(26 * SCALE)
    title = "VistaSeeds"
    subtitle = "Premium Hybrid Seeds"

    x = 755 * SCALE
    y = 164 * SCALE
    draw.text((x + 3 * SCALE, y + 4 * SCALE), title, font=title_font, fill=(0, 0, 0, 62))
    draw.text((x, y), title, font=title_font, fill=(255, 255, 246, 244))

    sub_y = y + 88 * SCALE
    draw.text((x + 2 * SCALE, sub_y + 3 * SCALE), subtitle, font=sub_font, fill=(0, 0, 0, 50))
    draw.text((x, sub_y), subtitle, font=sub_font, fill=(219, 255, 211, 226))

    draw.rounded_rectangle(
        (x, sub_y + 48 * SCALE, x + 210 * SCALE, sub_y + 52 * SCALE),
        radius=2 * SCALE,
        fill=(202, 246, 166, 160),
    )


def add_safe_depth(image: Image.Image) -> None:
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.ellipse((560 * SCALE, -170 * SCALE, 1360 * SCALE, 590 * SCALE), fill=(255, 255, 255, 18))
    draw.ellipse((-120 * SCALE, 120 * SCALE, 410 * SCALE, 570 * SCALE), fill=(0, 0, 0, 20))
    image.alpha_composite(overlay.filter(ImageFilter.GaussianBlur(75 * SCALE)))


def save_srgb_png(image: Image.Image) -> None:
    pnginfo = PngImagePlugin.PngInfo()
    pnginfo.add(b"sRGB", b"\x00")
    image.save(OUTPUT, "PNG", optimize=True, compress_level=9, pnginfo=pnginfo)


def main() -> None:
    brand = sample_brand_green(GREEN_LOGO)
    image = make_background(brand)
    add_safe_depth(image)
    add_field_language(image)
    add_monogram_watermark(image)
    add_wordmark(image)

    image = image.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS).convert("RGB")
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    save_srgb_png(image)

    size = OUTPUT.stat().st_size
    print(f"Generated: {OUTPUT}")
    print(f"Dimensions: {image.width}x{image.height}")
    print(f"Size: {size} bytes ({size / 1024 / 1024:.2f} MB)")


if __name__ == "__main__":
    main()
