"""
Asset pipeline (one-off) for the web demo:
- Remove backgrounds from character illustrations into transparent PNGs
- Generate Japanese-fresh (日系清新) background PNGs for story scenes

Run:
  web/.venv_assets/bin/python web/tools/asset_pipeline.py
"""

from __future__ import annotations

import os
import random
import shutil
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter
from rembg import remove


ROOT = Path(__file__).resolve().parents[1]
CHAR_DIR = ROOT / "static" / "images" / "characters"
BG_DIR = ROOT / "static" / "images" / "backgrounds"


@dataclass(frozen=True)
class BgSpec:
    name: str
    size: tuple[int, int] = (1920, 1080)


def _atomic_write(path: Path, data: bytes) -> None:
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_bytes(data)
    os.replace(tmp, path)


def _backup_once(src: Path) -> Path:
    backup = src.with_name(src.stem + "_before_cutout" + src.suffix)
    if not backup.exists():
        shutil.copy2(src, backup)
    return backup


def cutout_character_png(src: Path) -> None:
    if not src.exists():
        raise FileNotFoundError(str(src))
    if src.suffix.lower() != ".png":
        raise ValueError(f"Only .png supported: {src.name}")

    _backup_once(src)
    out = remove(src.read_bytes())  # PNG bytes with alpha
    _atomic_write(src, out)


def _lerp(a: int, b: int, t: float) -> int:
    return int(a + (b - a) * t)


def _vertical_gradient(size: tuple[int, int], top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    w, h = size
    img = Image.new("RGB", (w, h), top)
    px = img.load()
    for y in range(h):
        t = y / max(1, h - 1)
        c = (_lerp(top[0], bottom[0], t), _lerp(top[1], bottom[1], t), _lerp(top[2], bottom[2], t))
        for x in range(w):
            px[x, y] = c
    return img


def _add_watercolor_noise(base: Image.Image, strength: float = 0.10, blur: int = 24) -> Image.Image:
    w, h = base.size
    noise = Image.new("L", (w, h), 0)
    npx = noise.load()
    # blocky noise then blur -> watercolor texture
    block = 12
    for y in range(0, h, block):
        for x in range(0, w, block):
            v = random.randint(0, 255)
            for yy in range(y, min(h, y + block)):
                for xx in range(x, min(w, x + block)):
                    npx[xx, yy] = v
    noise = noise.filter(ImageFilter.GaussianBlur(blur))
    tint = Image.new("RGB", (w, h), (255, 255, 255))
    mixed = Image.blend(base, tint, 0.02)
    # apply noise as subtle overlay
    noise_rgb = Image.merge("RGB", (noise, noise, noise))
    return Image.blend(mixed, noise_rgb, strength)


def _add_bokeh(img: Image.Image, count: int = 35, color: tuple[int, int, int] = (255, 210, 220)) -> None:
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for _ in range(count):
        r = random.randint(18, 90)
        x = random.randint(-r, w + r)
        y = random.randint(0, int(h * 0.75))
        a = random.randint(18, 48)
        c = (*color, a)
        d.ellipse((x - r, y - r, x + r, y + r), fill=c)
    overlay = overlay.filter(ImageFilter.GaussianBlur(8))
    img.paste(overlay, (0, 0), overlay)


def _add_sakura_petals(img: Image.Image, count: int = 24) -> None:
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for _ in range(count):
        pw = random.randint(24, 70)
        ph = int(pw * random.uniform(0.65, 0.95))
        x = random.randint(-pw, w + pw)
        y = random.randint(int(h * 0.05), int(h * 0.95))
        base = Image.new("RGBA", (pw * 2, ph * 2), (0, 0, 0, 0))
        bd = ImageDraw.Draw(base)
        petal = (255, random.randint(175, 205), random.randint(195, 220), random.randint(55, 90))
        bd.ellipse((pw // 2, ph // 2, pw // 2 + pw, ph // 2 + ph), fill=petal)
        angle = random.uniform(-40, 40)
        base = base.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
        overlay.alpha_composite(base, (x, y))
    overlay = overlay.filter(ImageFilter.GaussianBlur(1.2))
    img.paste(overlay, (0, 0), overlay)


def _add_soft_clouds(img: Image.Image, count: int = 10) -> None:
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for _ in range(count):
        cx = random.randint(0, w)
        cy = random.randint(0, int(h * 0.55))
        rw = random.randint(220, 540)
        rh = random.randint(80, 220)
        a = random.randint(14, 28)
        d.ellipse((cx - rw, cy - rh, cx + rw, cy + rh), fill=(255, 255, 255, a))
    overlay = overlay.filter(ImageFilter.GaussianBlur(30))
    img.paste(overlay, (0, 0), overlay)


def generate_bg_rehearsal_hall(spec: BgSpec) -> Image.Image:
    w, h = spec.size
    base = _vertical_gradient((w, h), (234, 249, 255), (254, 246, 232))
    base = _add_watercolor_noise(base, strength=0.10, blur=26)
    _add_soft_clouds(base, count=12)
    _add_bokeh(base, count=30, color=(205, 235, 220))
    _add_sakura_petals(base, count=18)
    # subtle floor band (tatami-ish)
    floor = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    fd = ImageDraw.Draw(floor)
    band_top = int(h * 0.72)
    fd.rectangle((0, band_top, w, h), fill=(226, 214, 190, 70))
    for x in range(0, w, 120):
        fd.line((x, band_top, x + 80, h), fill=(210, 195, 165, 26), width=6)
    floor = floor.filter(ImageFilter.GaussianBlur(3))
    base.paste(floor, (0, 0), floor)
    return base


def generate_bg_stage(spec: BgSpec) -> Image.Image:
    w, h = spec.size
    base = _vertical_gradient((w, h), (250, 245, 240), (224, 232, 246))
    base = _add_watercolor_noise(base, strength=0.11, blur=22)
    # curtains hint
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    curtain = (255, 182, 193, 38)
    d.rectangle((0, 0, int(w * 0.16), h), fill=curtain)
    d.rectangle((int(w * 0.84), 0, w, h), fill=curtain)
    d.rectangle((0, 0, w, int(h * 0.12)), fill=(255, 210, 220, 32))
    overlay = overlay.filter(ImageFilter.GaussianBlur(10))
    base.paste(overlay, (0, 0), overlay)
    _add_bokeh(base, count=38, color=(255, 210, 220))
    _add_sakura_petals(base, count=14)
    return base


def generate_backgrounds() -> None:
    BG_DIR.mkdir(parents=True, exist_ok=True)
    specs = [
        BgSpec("rehearsal_hall"),
        BgSpec("stage"),
    ]
    for spec in specs:
        if spec.name == "rehearsal_hall":
            img = generate_bg_rehearsal_hall(spec)
        elif spec.name == "stage":
            img = generate_bg_stage(spec)
        else:
            continue
        out_path = BG_DIR / f"{spec.name}.png"
        img.save(out_path, format="PNG", optimize=True)


def main() -> None:
    random.seed(20260312)

    # 1) Cutout characters (overwrite originals, keep backups)
    for name in ("master_li.png", "jin_liqing.png"):
        cutout_character_png(CHAR_DIR / name)

    # 2) Generate backgrounds
    generate_backgrounds()

    print("Done.")
    print(f"- Characters: {CHAR_DIR}")
    print(f"- Backgrounds: {BG_DIR}")


if __name__ == "__main__":
    main()
