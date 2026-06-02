#!/usr/bin/env python3
"""
Generate VistaSeeds X profile image.

Requirements:
  python3 -m pip install Pillow

Output:
  backend/uploads/media/logo/x-profile-400x400.png
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, PngImagePlugin


SIZE = 400
SCALE = 3
CANVAS = SIZE * SCALE
ROOT = Path(__file__).resolve().parents[2]
LOGO_DIR = ROOT / "backend" / "uploads" / "media" / "logo"
APP_ICON = LOGO_DIR / "appletouch.png"
GREEN_LOGO = LOGO_DIR / "vistaseed_logo_green.png"
OUTPUT = LOGO_DIR / "x-profile-400x400.png"

BASE_GREEN = (18, 83, 45)
MID_GREEN = (27, 122, 52)
LIGHT_GREEN = (47, 168, 79)


def sample_brand_green(path: Path) -> tuple[int, int, int]:
    image = Image.open(path).convert("RGBA")
    pixel_data = image.get_flattened_data() if hasattr(image, "get_flattened_data") else image.getdata()
    pixels = []
    for r, g, b, a in pixel_data:
        if a > 80 and g > r + 18 and g > b + 18 and 45 < g < 220:
            pixels.append((r, g, b))
    if not pixels:
        return MID_GREEN
    pixels.sort(key=lambda p: p[1] - (p[0] + p[2]) / 2, reverse=True)
    top = pixels[: min(8000, len(pixels))]
    return tuple(sum(p[i] for p in top) // len(top) for i in range(3))


def mix(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def make_background(brand: tuple[int, int, int]) -> Image.Image:
    image = Image.new("RGBA", (CANVAS, CANVAS))
    px = image.load()
    center = CANVAS / 2
    max_dist = math.hypot(center, center)
    glow = mix(LIGHT_GREEN, brand, 0.35)

    for y in range(CANVAS):
        for x in range(CANVAS):
            dx = x - center
            dy = y - center
            dist = math.hypot(dx, dy) / max_dist
            radial = max(0.0, 1.0 - dist * 1.35)
            vertical = y / (CANVAS - 1)
            color = mix(BASE_GREEN, MID_GREEN, 0.38 + vertical * 0.12)
            color = mix(color, glow, radial * 0.72)
            px[x, y] = (*color, 255)

    return image


def add_texture(image: Image.Image) -> None:
    overlay = Image.new("RGBA", image.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Circular crop guide: details stay inside the X avatar circle.
    inset = 26 * SCALE
    draw.ellipse(
        (inset, inset, CANVAS - inset, CANVAS - inset),
        outline=(255, 255, 255, 22),
        width=2 * SCALE,
    )

    # Quiet field contours. They should read as seed/field texture, not decoration.
    for i in range(13):
        y0 = (260 + i * 18) * SCALE
        points = []
        for x in range(-80 * SCALE, CANVAS + 80 * SCALE, 10 * SCALE):
            y = y0 + math.sin((x / SCALE + i * 27) / 44) * (5 + i * 0.45) * SCALE
            points.append((x, y))
        draw.line(points, fill=(255, 255, 255, 18), width=max(1, SCALE))

    # Soft diagonal grain gives the flat green a premium enamel feel.
    for i in range(-24, 32):
        x0 = i * 28 * SCALE
        draw.line(
            [(x0, CANVAS), (x0 + CANVAS, 0)],
            fill=(255, 255, 255, 8),
            width=max(1, SCALE // 2),
        )

    image.alpha_composite(overlay.filter(ImageFilter.GaussianBlur(0.55 * SCALE)))


def extract_monogram() -> Image.Image:
    source = Image.open(APP_ICON).convert("RGBA")
    pixels = source.load()
    mask = Image.new("L", source.size, 0)
    mask_px = mask.load()

    for y in range(source.height):
        for x in range(source.width):
            r, g, b, _ = pixels[x, y]
            luminance = (r * 0.299) + (g * 0.587) + (b * 0.114)
            chroma = max(r, g, b) - min(r, g, b)
            if luminance < 96 and chroma < 38:
                alpha = max(0, min(255, round((96 - luminance) * 3.2)))
            else:
                alpha = 0
            mask_px[x, y] = alpha

    bbox = mask.getbbox()
    if bbox is None:
        raise RuntimeError(f"Could not extract monogram from {APP_ICON}")

    mask = keep_largest_component(mask)
    bbox = mask.getbbox()
    if bbox is None:
        raise RuntimeError(f"Could not isolate monogram from {APP_ICON}")

    mask = mask.crop(bbox)
    mark = Image.new("RGBA", mask.size, (255, 255, 255, 0))
    mark.putalpha(mask)
    return mark


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


def add_monogram(image: Image.Image) -> None:
    mark = extract_monogram()
    target = int(CANVAS * 0.64)
    scale = target / max(mark.size)
    mark = mark.resize((round(mark.width * scale), round(mark.height * scale)), Image.Resampling.LANCZOS)

    x = (CANVAS - mark.width) // 2
    y = (CANVAS - mark.height) // 2 - 4 * SCALE

    soft_shadow = Image.new("RGBA", image.size, (0, 0, 0, 0))
    shadow_alpha = mark.getchannel("A").filter(ImageFilter.GaussianBlur(7 * SCALE))
    shadow_layer = Image.new("RGBA", mark.size, (0, 0, 0, 80))
    shadow_layer.putalpha(shadow_alpha)
    soft_shadow.alpha_composite(shadow_layer, (x, y + 8 * SCALE))
    image.alpha_composite(soft_shadow)

    highlight = Image.new("RGBA", mark.size, (255, 255, 255, 248))
    highlight.putalpha(mark.getchannel("A"))
    image.alpha_composite(highlight, (x, y))


def save_srgb_png(image: Image.Image) -> None:
    pnginfo = PngImagePlugin.PngInfo()
    pnginfo.add(b"sRGB", b"\x00")
    image.save(OUTPUT, "PNG", optimize=True, compress_level=9, pnginfo=pnginfo)


def main() -> None:
    brand = sample_brand_green(GREEN_LOGO)
    image = make_background(brand)
    add_texture(image)
    add_monogram(image)
    image = image.resize((SIZE, SIZE), Image.Resampling.LANCZOS).convert("RGB")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    save_srgb_png(image)

    size = OUTPUT.stat().st_size
    print(f"Generated: {OUTPUT}")
    print(f"Dimensions: {image.width}x{image.height}")
    print(f"Size: {size} bytes ({size / 1024 / 1024:.2f} MB)")


if __name__ == "__main__":
    main()
