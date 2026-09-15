"""
Buduje grafike Open Graph (public/og.jpg) z renderu hero i danych inwestycji.

    python scripts/og.py     # zapisuje public/og-tmp.png, potem konwersja sharpem

Poprzednia wersja miala wypalone "20 lokali w 6 budynkach", czyli liczbe sprzeczna
z nazewnictwem 16 mieszkan i 4 domy. Skladamy grafike w przegladarce, bo tylko tak
tekst wyglada dokladnie jak na stronie: te same kroje z Google Fonts (Space Grotesk
i Inter) i ten sam uklad co w hero.

Wymaga playwright dla Pythona (pip install playwright && playwright install chromium).
"""
import base64, pathlib
from playwright.sync_api import sync_playwright

REPO = pathlib.Path("C:/Users/barto/Desktop/GitHub-kontaktio/plazowa-park")
tlo = base64.b64encode((REPO / "public/renders/hero.webp").read_bytes()).decode()

HTML = """
<!doctype html><html lang="pl"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1200px; height:630px; overflow:hidden; font-family:Inter,sans-serif; }
  .karta { position:relative; width:1200px; height:630px; background:#1c1714; }
  .foto { position:absolute; inset:0; background:url(data:image/webp;base64,__TLO__) center/cover; }
  .skos { position:absolute; inset:0;
    background:linear-gradient(100deg,#1c1714 0%, rgba(28,23,20,.72) 38%, rgba(28,23,20,.10) 70%, transparent 100%); }
  .dol { position:absolute; inset:auto 0 0 0; height:44%;
    background:linear-gradient(to top, rgba(28,23,20,.94), transparent); }
  .tresc { position:absolute; inset:0; padding:52px 56px; display:flex; flex-direction:column; justify-content:space-between; color:#faf8f4; }
  .marka { display:flex; align-items:center; gap:14px; }
  .marka svg { color:#e9a43f; }
  .nazwa { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:27px; letter-spacing:-.02em; }
  .miejsce { font-size:16px; color:rgba(250,248,244,.72); margin-left:10px; }
  h1 { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:63px; line-height:1.04; letter-spacing:-.032em; max-width:720px; }
  h1 span { color:#e9a43f; display:block; }
  .stopka { display:flex; align-items:flex-end; justify-content:space-between; gap:32px; }
  .staty { display:flex; gap:44px; }
  .v { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:31px; line-height:1; white-space:nowrap; font-variant-numeric:tabular-nums; }
  .l { font-size:15px; font-weight:500; color:rgba(250,248,244,.74); margin-top:9px; }
  .adres { text-align:right; font-size:16px; line-height:1.55; color:rgba(250,248,244,.82); white-space:nowrap; }
</style></head><body>
<div class="karta">
  <div class="foto"></div><div class="skos"></div><div class="dol"></div>
  <div class="tresc">
    <div class="marka">
      <svg width="34" height="39" viewBox="0 0 179 204" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="butt"><path d="M54.5 46.0V195"/><path d="M72.5 25.0V195"/><path d="M89.5 5.0V195"/><path d="M106.5 25.0V195"/><path d="M124.0 46.0V195"/><path d="M54.5 68.5 72.5 106.5"/><path d="M124.5 68.5 106.5 106.5"/><path d="M39.0 84.0 54.5 115.0"/><path d="M140.0 84.0 124.5 115.0"/><path d="M54.5 102.0 72.5 138.0"/><path d="M124.5 102.0 106.5 138.0"/><path d="M45.0 123.0 54.5 142.0"/><path d="M134.0 123.0 124.5 142.0"/><path d="M54.5 133.0 72.5 169.0"/><path d="M124.5 133.0 106.5 169.0"/><path d="M0 201h179"/></svg>
      <span class="nazwa">Plazowa Park</span><span class="miejsce">Glowno &middot; Zalew Mrozyczka</span>
    </div>
    <h1>Mieszkania i domy<span>nad Zalewem Mrozyczka</span></h1>
    <div class="stopka">
      <div class="staty">
        <div><div class="v">16</div><div class="l">mieszkan</div></div>
        <div><div class="v">4</div><div class="l">domy</div></div>
        <div><div class="v">82-133 m&sup2;</div><div class="l">powierzchni</div></div>
        <div><div class="v">od 633 000 zl</div><div class="l">cena</div></div>
      </div>
      <div class="adres">ul. Plazowa 5 i 7, Glowno<br>plazowa-park.pl</div>
    </div>
  </div>
</div></body></html>
"""

# polskie znaki wstawiamy po zaladowaniu, zeby nie walczyc z kodowaniem w pliku zrodlowym
POPRAWKI = {
    "Plazowa Park": "Plażowa Park",
    "Glowno · Zalew Mrozyczka": "Głowno · Zalew Mrożyczka",
    "Mieszkania i domy": "Mieszkania i domy",
    "nad Zalewem Mrozyczka": "nad Zalewem Mrożyczka",
    "mieszkan": "mieszkań",
    "od 633 000 zl": "od 633 000 zł",
    "ul. Plazowa 5 i 7, Glowno": "ul. Plażowa 5 i 7, Głowno",
}

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 1200, "height": 630}, device_scale_factor=2)
    page.set_content(HTML.replace("__TLO__", tlo), wait_until="load")
    page.evaluate(
        """(mapa) => {
            const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            const nody = [];
            while (walk.nextNode()) nody.push(walk.currentNode);
            for (const n of nody) {
              const t = n.nodeValue.trim();
              if (mapa[t]) n.nodeValue = mapa[t];
            }
        }""",
        POPRAWKI,
    )
    page.wait_for_timeout(1200)
    page.screenshot(path=str(REPO / "public/og-tmp.png"))
    b.close()
print("ok")
