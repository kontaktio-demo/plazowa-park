"""
Buduje rzuty kondygnacji z PDF-ow dewelopera (SenseVR/Qupto, inwestycja 214).

    python scripts/rzuty.py

Kazdy PDF rzutu ma dwie strony: okladke marketingowa i strone z parterem i pietrem.
Na drugiej stronie leza cztery obrazy - izometryczny render i rysunek techniczny dla
kazdej kondygnacji - oraz wykaz pomieszczen z metrazami. Skrypt bierze je stamtad,
bo to jedyne zrodlo, w ktorym deweloper podaje rzut pietra; strona pokazywala do tej
pory wylacznie parter.

Dwadziescia lokali ma szesc typow rzutu (1A, 1B, 2A, 2B, 3A, 3B), wiec pobieramy po
jednym PDF na typ. Zrodlo wybrane tak, zeby wziac plik o najwyzszej rozdzielczosci:
6.1A ma render 1600 px zamiast 960 px, a 3.3A i 5.2A w ogole nie maja pliku na CDN.

Obrazy wycinamy przez renderowanie fragmentu strony, a nie przez wyjmowanie osadzonego
pliku: PDF przycina je sciezka, wiec sam osadzony obraz ma wokol tresci pusty margines.

Wymaga pymupdf (pip install pymupdf) i sharp z zaleznosci projektu (npx).
"""

import io
import json
import pathlib
import subprocess
import sys
import urllib.request

import pymupdf

CDN = "https://quptos-web-data.sensevr.pl/ver_2_3/C1/I214/units/units_unitplan/v1"
NAGLOWKI = {"User-Agent": "Mozilla/5.0", "Referer": "https://ksprestige-glowno-plazowa.sensevr.pl/"}

# typ rzutu -> lokal, z ktorego bierzemy plik
ZRODLA = {"1A": "6.1A", "1B": "1.1B", "2A": "10.2A", "2B": "5.2B", "3A": "8.3A", "3B": "3.3B"}

DPI = 350
SZEROKOSC = {"render": 1200, "techniczny": 1600}

KORZEN = pathlib.Path(__file__).resolve().parent.parent
WYJSCIE = KORZEN / "public" / "rzuty"
ROBOCZY = KORZEN / ".rzuty-src"


def pobierz(nazwa: str) -> pathlib.Path:
    ROBOCZY.mkdir(exist_ok=True)
    plik = ROBOCZY / f"{nazwa}.pdf"
    if not plik.exists():
        req = urllib.request.Request(f"{CDN}/{nazwa}.pdf", headers=NAGLOWKI)
        with urllib.request.urlopen(req) as odp:
            plik.write_bytes(odp.read())
    return plik


def kadry(strona):
    """Cztery obszary obrazow, rozpoznane po polozeniu: lewa kolumna to render,
    prawa rysunek techniczny, gora to parter, dol pietro. Logo jest male i odpada.

    Bierzemy bloki obrazow z warstwy tekstowej, bo tylko one podaja kadr widoczny.
    get_image_info() zwraca prostokat wstawienia, ktory wystaje poza strone: PDF
    przycina obrazy sciezka, a niektore rendery sa wstawione dwa razy wieksze."""
    srodek_y = strona.rect.height / 2
    out = {}
    for blok in strona.get_text("dict")["blocks"]:
        if blok["type"] != 1:
            continue
        x0, y0, x1, y1 = blok["bbox"]
        if x1 - x0 < 100:
            continue
        kondygnacja = "parter" if (y0 + y1) / 2 < srodek_y else "pietro"
        rodzaj = "render" if x0 < strona.rect.width * 0.4 else "techniczny"
        out[f"{kondygnacja}-{rodzaj}"] = pymupdf.Rect(x0, y0, x1, y1)
    return out


def webp(png: bytes, cel: pathlib.Path, szerokosc: int) -> None:
    cel.parent.mkdir(parents=True, exist_ok=True)
    tymczasowy = cel.with_suffix(".tmp.png")
    tymczasowy.write_bytes(png)
    skrypt = (
        "const sharp=require('sharp');"
        f"sharp({json.dumps(str(tymczasowy))})"
        f".resize({{width:{szerokosc},withoutEnlargement:true}})"
        f".webp({{quality:82}}).toFile({json.dumps(str(cel))})"
        ".then(i=>console.log(i.width+'x'+i.height));"
    )
    wynik = subprocess.run(["node", "-e", skrypt], cwd=KORZEN, capture_output=True, text=True)
    tymczasowy.unlink()
    if wynik.returncode:
        sys.exit(f"sharp: {wynik.stderr.strip()}")
    print(f"  {cel.relative_to(KORZEN)} {wynik.stdout.strip()}")


def main() -> None:
    for typ, lokal in ZRODLA.items():
        print(f"{typ} <- {lokal}.pdf")
        with pymupdf.open(pobierz(lokal)) as dok:
            strona = dok[1]
            for nazwa, obszar in sorted(kadry(strona).items()):
                rodzaj = nazwa.split("-")[1]
                png = strona.get_pixmap(clip=obszar, dpi=DPI, alpha=False).tobytes("png")
                webp(png, WYJSCIE / f"typ-{typ}-{nazwa}.webp", SZEROKOSC[rodzaj])


if __name__ == "__main__":
    main()
