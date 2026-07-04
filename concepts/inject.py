import base64, io, os
from PIL import Image

BASE = r"C:\Users\mccaq\himmetallin-site"
PH = os.path.join(BASE, "concepts", "photos") if False else os.path.join(BASE, "assets", "photos")
TPL = os.path.join(BASE, "concepts", "concept-real.tpl.html")
OUT = os.path.join(BASE, "concepts", "concept-dark.html")

# token -> (source file, target width, quality)
M = {
    "__IMG_HERO__":   ("img_3031.JPG", 1200, 76),
    "__IMG_ABOUT__":  ("img_3022.JPG", 1150, 74),
    "__IMG_PUMP__":   ("img_3024.JPG", 820, 72),
    "__IMG_COOL__":   ("img_3038.JPG", 820, 72),
    "__IMG_HX__":     ("img_3039.JPG", 820, 72),
    "__IMG_VESSEL__": ("img_3034.JPG", 820, 72),
    "__IMG_BOILER__": ("img_3047.JPG", 820, 72),
    "__IMG_ACS__":    ("img_3022.JPG", 820, 72),
}

def datauri(fname, w, q):
    im = Image.open(os.path.join(PH, fname)).convert("RGB")
    if im.width > w:
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, format="WEBP", quality=q, method=6)
    b64 = base64.b64encode(buf.getvalue()).decode()
    return "data:image/webp;base64," + b64, len(buf.getvalue())

html = open(TPL, encoding="utf-8").read()
total = 0
for token, (fname, w, q) in M.items():
    uri, size = datauri(fname, w, q)
    html = html.replace(token, uri)
    total += size
    print(f"{token:16} {fname:14} {w}px -> {size//1024} KB")

with open(OUT, "w", encoding="utf-8") as f:
    f.write(html)
print(f"--- total embedded: {total//1024} KB; output: {OUT}; html {len(html)//1024} KB")
