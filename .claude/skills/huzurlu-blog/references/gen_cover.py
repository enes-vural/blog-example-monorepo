#!/usr/bin/env python3
# Huzurlu Yaşam branded blog cover generator (PIL).
# Run with: /opt/homebrew/bin/python3 gen_cover.py
# Edit EYEBROW / HEADLINE_LINES / SUBLINE / SLUG per post.
from PIL import Image, ImageDraw, ImageFont
import random

SLUG = "ORNEK-SLUG"                       # -> public/blog/<SLUG>.jpg
EYEBROW = "YÖNETİM · 634 KMK · 2026"       # eyebrow pill text (uppercase)
HEADLINE_LINES = ["Başlık Satır 1", "Başlık Satır 2", "Başlık Satır 3"]
SUBLINE = "Kısa alt açıklama · anahtar fayda"
OUTDIR = "/Users/sakastudio/development/projects/sinan/hedefim/hazalkenthuzurluyasam/web/public/blog"

W, H = 1200, 675
BG = (38, 33, 30)          # #26211e
ORANGE = (253, 136, 48)    # #fd8830
INK = (245, 240, 235)
MUTED = (170, 160, 150)
FB = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FR = "/System/Library/Fonts/Supplemental/Arial.ttf"

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# apartment skyline motif (bottom-right). Change seed for variety per post.
random.seed(11)
by = H
for i in range(7):
    bw = random.randint(55, 95); bh = random.randint(140, 340)
    x0 = 720 + i * 70
    col = (52, 46, 42) if i % 2 == 0 else (46, 40, 36)
    d.rectangle([x0, by - bh, x0 + bw, by], fill=col)
    for wy in range(by - bh + 20, by - 20, 34):
        for wx in range(x0 + 12, x0 + bw - 12, 26):
            lit = random.random() < 0.33
            d.rectangle([wx, wy, wx + 12, wy + 16], fill=ORANGE if lit else (60, 54, 50))

# eyebrow pill
fe = ImageFont.truetype(FB, 26)
tb = d.textbbox((0, 0), EYEBROW, font=fe)
pw, ph = tb[2] - tb[0], tb[3] - tb[1]
px, py = 70, 90
d.rounded_rectangle([px, py, px + pw + 44, py + ph + 28], radius=26, fill=ORANGE)
d.text((px + 22, py + 12), EYEBROW, font=fe, fill=BG)

# headline (up to 3 lines)
fh = ImageFont.truetype(FB, 74)
for i, ln in enumerate(HEADLINE_LINES):
    d.text((70, 200 + i * 86), ln, font=fh, fill=INK)

# subline
fs = ImageFont.truetype(FR, 30)
d.text((72, 200 + len(HEADLINE_LINES) * 86 + 10), SUBLINE, font=fs, fill=MUTED)

# wordmark bottom-left
fw = ImageFont.truetype(FB, 34)
d.ellipse([70, H - 78, 106, H - 42], fill=ORANGE)
d.text((118, H - 76), "Huzurlu Yaşam", font=fw, fill=INK)
fd = ImageFont.truetype(FR, 24)
d.text((120, H - 40), "huzurluyasam.net", font=fd, fill=MUTED)

out = f"{OUTDIR}/{SLUG}.jpg"
img.save(out, "JPEG", quality=86, optimize=True)
print("saved", out)
