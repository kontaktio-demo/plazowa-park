"""
Buduje plan osiedla na stronę (public/osiedle/plan-osiedla.webp).

    python scripts/plan-osiedla.py

Tło to ilustracja wygenerowana w Higgsfield (GPT Image 2.5) z planu zagospodarowania
dewelopera, zapisana w .pzt-src/hf/v2.png. Model dostał PZT dosunięty do kwadratu
białymi marginesami po 35 px z boku i miał zachować geometrię co do piksela, co
sprawdzono nałożeniem obrysów lokali z lib/data/plan.ts.

Podpisów nie generuje model, bo przekręca liczby. Numery budynków i lokali, ogródki
z metrażami, śmietniki i wjazd składamy tutaj z danych: obrysy i numery ogródków
z lib/data/plan.ts, metraże z lib/data/units.ts. Tekst składa przeglądarka, tymi
samymi krojami co strona.

Wymaga playwright dla Pythona (pip install playwright && playwright install chromium)
oraz sharp z node_modules.
"""
import base64, io, json, pathlib, re, subprocess
from PIL import Image
from playwright.sync_api import sync_playwright

REPO = pathlib.Path(__file__).resolve().parent.parent
ZRODLO = REPO / ".pzt-src/hf/v2.png"
WYJSCIE = REPO / "public/osiedle/plan-osiedla.webp"

# układ współrzędnych planu z lib/data/plan.ts
PW, PH = 1307, 1377
MARGINES = 35

tlo = Image.open(ZRODLO).convert("RGB")
skala = tlo.height / PH
lewo = round(MARGINES * skala)
tlo = tlo.crop((lewo, 0, lewo + round(PW * skala), tlo.height))
W, H = tlo.size
bufor = io.BytesIO()
tlo.save(bufor, "PNG")
tlo64 = base64.b64encode(bufor.getvalue()).decode()

plan = (REPO / "lib/data/plan.ts").read_text(encoding="utf-8")
lokale = {
    n: ([int(v) for v in r.split(",")], int(o))
    for n, r, o in re.findall(r'"([\d.AB]+)": \{ r: \[([\d, ]+)\], ogrodek: (\d+) \}', plan)
}
assert len(lokale) == 20, len(lokale)

units = (REPO / "lib/data/units.ts").read_text(encoding="utf-8")
lista = json.loads(re.search(r"export const UNITS: Unit\[\] = (\[[\s\S]*?\n\]);", units).group(1))
ogrod = {u["name"]: u["garden"] for u in lista}

# Środki podpisów ogródków odczytane z PZT. Przy domach 3 i 8 przesunięte od ściany,
# bo szerszy podpis wchodziłby na budynek.
OGRODKI = {
    1: (258, 1240), 2: (446, 1240), 3: (298, 884), 4: (452, 906), 5: (248, 712), 6: (248, 650),
    7: (298, 486), 8: (452, 466), 9: (286, 144), 10: (452, 170), 11: (872, 144), 12: (1052, 144),
    13: (872, 466), 14: (1030, 486), 15: (1066, 650), 16: (1066, 712), 17: (872, 906),
    18: (1030, 884), 19: (872, 1240), 20: (1010, 1240),
}
SMIETNIKI = [(575, 246), (745, 246), (580, 372), (745, 372), (580, 1109), (745, 1109)]
WJAZD = (660, 1286)

# metraże jak na PZT: zawsze dwa miejsca po przecinku
pole = lambda v: f"{v:.2f}".replace(".", ",")
px = lambda x, y: f"left:{x * skala:.1f}px;top:{y * skala:.1f}px"

elementy = []
budynki = {}
for nazwa, ((x, y, w, h), nr) in lokale.items():
    bud, kod = nazwa.split(".")
    budynki.setdefault(bud, []).append((x, y, w, h, kod))
    elementy.append(f'<div class="lokal" style="{px(x + w / 2, y + h * 0.62)}"><span>lokal</span> {kod}</div>')
    area = ogrod[nazwa]
    gx, gy = OGRODKI[nr]
    elementy.append(f'<div class="ogrodek" style="{px(gx, gy)}"><b>Ogródek {nr}</b>{pole(area)} m²</div>')

for bud, czesci in budynki.items():
    x0 = min(c[0] for c in czesci)
    x1 = max(c[0] + c[2] for c in czesci)
    y0 = min(c[1] for c in czesci)
    y1 = max(c[1] + c[3] for c in czesci)
    # Budynek z mieszkaniami: podpis u góry, jak na PZT. Przy domach PZT stawia go na
    # styku dwóch domów, ale tam przecinało go wyróżnienie wybranego domu, więc idzie
    # nad bryłę, na trawnik.
    y = y0 - 24 if czesci[0][4].startswith("3") else y0 + 24
    elementy.append(f'<div class="budynek" style="{px((x0 + x1) / 2, y)}">Budynek {bud}</div>')

elementy += [f'<div class="smietnik" style="{px(x, y)}">Ś</div>' for x, y in SMIETNIKI]
elementy.append(
    f'<div class="wjazd" style="{px(*WJAZD)}"><svg width="22" height="18" viewBox="0 0 22 18"><path d="M11 0 22 18H0z"/></svg>Wjazd</div>'
)

HTML = f"""<!doctype html><html lang="pl"><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@500;600&display=swap" rel="stylesheet">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{ width:{W}px; height:{H}px; position:relative; overflow:hidden;
    background:url(data:image/png;base64,{tlo64}) 0 0/100% 100%; }}
  body > div {{ position:absolute; transform:translate(-50%,-50%); white-space:nowrap; }}
  .budynek {{ font:700 40px/1 'Space Grotesk'; letter-spacing:.05em; text-transform:uppercase;
    color:#faf8f4; background:rgba(28,23,20,.9); padding:11px 18px 10px; border-radius:6px; }}
  .lokal {{ font:600 38px/1 'Space Grotesk'; color:#1c1714; background:#fff; padding:9px 16px;
    border-radius:999px; border:3px solid #e9a43f; box-shadow:0 2px 6px rgba(28,23,20,.18); }}
  .lokal span {{ font:500 26px/1 Inter; color:#6f6558; }}
  .ogrodek {{ font:500 25px/1.15 Inter; color:#3a322c; text-align:center; background:rgba(250,248,244,.9);
    padding:7px 12px 8px; border-radius:6px; }}
  .ogrodek b {{ display:block; font:600 28px/1.1 'Space Grotesk'; color:#1c1714; }}
  .smietnik {{ font:700 24px/1 'Space Grotesk'; color:#faf8f4; background:rgba(28,23,20,.82);
    width:36px; height:36px; display:grid; place-items:center; border-radius:5px; }}
  .wjazd {{ font:700 30px/1 'Space Grotesk'; letter-spacing:.06em; text-transform:uppercase; color:#1c1714;
    background:#faf8f4; padding:9px 16px; border-radius:6px;
    display:flex; align-items:center; gap:10px; }}
</style></head><body>{''.join(elementy)}</body></html>"""

tmp = REPO / ".pzt-src/hf/plan-z-podpisami.png"
with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": W, "height": H})
    page.set_content(HTML, wait_until="networkidle")
    page.evaluate("document.fonts.ready")
    page.screenshot(path=str(tmp))
    b.close()

subprocess.run(
    ["node", "-e", f"require('sharp')({json.dumps(str(tmp))}).webp({{quality:84}}).toFile({json.dumps(str(WYJSCIE))}).then(i=>console.log(i.width,i.height,i.size))"],
    cwd=REPO, check=True,
)
