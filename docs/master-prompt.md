# MASTER PROMPT (materiał źródłowy) — Awwwards-grade landing page sprzedażowy dla inwestycji „Plażowa Park", Głowno

> Materiał gotowy do przekształcenia w JEDEN plik `.md` będący master promptem dla Claude Code + Higgsfield. Ton: techniczny, bezpośredni. Wszystkie fakty zweryfikowane; rozbieżności oznaczone explicite.

---

## TL;DR
- **Buduj na Next.js (App Router) + TypeScript + Tailwind + GSAP/Lenis + MapLibre GL z warstwami GUGiK/ortofoto, hosting Vercel.** Grafiki/animacje generuj w Higgsfield (Nano Banana Pro do statyki, Kling/Seedance do wideo) WYŁĄCZNIE na bazie realnych assetów z domeny `plazowa-park.pl` — to gotowa/budowana inwestycja, więc wizualizacje muszą odwzorowywać realny wygląd, nie fantazję.
- **Prawda o inwestycji:** osiedle „Plażowa Park", deweloper **KS Prestige Development Sp. z o.o.** (ul. Mikołaja Kopernika 30A, 95-015 Głowno, KRS 0001031916, NIP 7331366052, prezes Jakub Kwiatkowski), lokalizacja **ul. Plażowa 5 i 7, 95-015 Głowno**, powiat zgierski, woj. łódzkie, bezpośrednio przy **Zalewie Mrożyczka** (30+ ha) i Central Wake Park; **20 apartamentów w 6 budynkach, 82,05–133,03 m², ceny od 603 000 zł, oddanie 4 kw. 2026**. TERYT jednostki ewidencyjnej: **`102001_1`** (miasto Głowno).
- **Cel nadrzędny = wyprzedaż wszystkich lokali:** architektura strony ma maksymalizować konwersję (twarde CTA, lead capture, scarcity/licznik dostępności, ceny/finansowanie, interaktywna mapa osiedla z klikalnymi domami i statusami) oraz zdominować lokalne SEO na frazy typu „domy/mieszkania na sprzedaż Głowno", „nowe mieszkania nad Zalewem Mrożyczka".

---

## Key Findings (najważniejsze ustalenia)

1. **Obecna strona `plazowa-park.pl` to słaby one-pager na WordPress/Elementor 4.1.4**, który oddaje sprzedaż do zewnętrznego konfiguratora SenseVR (`ksprestige-glowno-plazowa.sensevr.pl/investment/214`). Brak podstron per dom, brak SEO, brak danych strukturalnych, brak realnej mapy — cała siła sprzedażowa i SEO wycieka poza domenę.
2. **Rozbieżność liczby jednostek (do ujednolicenia przed publikacją):** deweloper (plazowa-park.pl) i investmap.pl podają **20 mieszkań**; rynekpierwotny.pl i gethome.pl podają **18 lokali** („W inwestycji Plażowa Park Głowno przewidziane jest 18 lokali mieszkalnych, usytuowanych w 6 budynkach" — gethome.pl). Matematyka układu z opisu dewelopera (narożne budynki po 4 mieszkania, środkowe po 2) daje 20. **Rekomendacja: przyjmij 20 jako liczbę wg dewelopera, ale potwierdź u KS Prestige przed launchem.**
3. **Lokalizacja to główny atut sprzedażowy i SEO.** Zalew Mrożyczka (piasek ze śródlądowych wydm, strzeżone kąpielisko, molo, park linowy, wodny plac zabaw, Central Wake Park — „najważniejsze miejsce na wakeboardowej mapie Polski"), 100-letni las, ~17 km / ~30 km od Łodzi (dojazd A2/DK14), 13 placówek edukacyjnych i przychodnia w promieniu 200 m, przystanek Sosnowa/Kopernika ~100 m.
4. **Referencja jakości `osiedlejordanow.pl` była niedostępna dla fetchera**, ale wzorzec konkurencyjny to `osiedleborowikowe.pl` (deweloper Vento Capital): karty domów z numerem, powierzchnią domu i ogrodu, ceną brutto, ceną za m² i **statusem Dostępne / Rezerwacja / Sprzedane** — to dokładnie ten poziom prezentacji domów, który trzeba pobić.
5. **Dane geoprzestrzenne z GUGiK są darmowe i publiczne:** ortofotomapa WMTS/WMS, granice działek przez ULDK API (WKT/WKB, nie GeoJSON natywnie — konwersja po stronie klienta). Współrzędne: Zalew Mrożyczka ≈ **51.9614 N, 19.7197 E**; ul. Plażowa 5–7 ≈ **51.960 N, 19.718 E** (do potwierdzenia kliknięciem na geoportalu).
6. **Higgsfield Nano Banana Pro obsługuje reference images + import przez URL i redukuje halucynacje**, więc można karmić go realnymi renderami/zdjęciami z domeny i egzekwować wierność bryły/wnętrz/otoczenia.

---

## Details

### 1. Pełna inwentaryzacja obecnej strony `plazowa-park.pl`

**Co JEST (do przeniesienia jako źródło prawdy):**
- **Title:** „Plażowa Park – Luksusowe osiedle domów blisko natury". Meta generator: Elementor 4.1.4; brak własnego opisu meta description zoptymalizowanego pod sprzedaż.
- **Nawigacja (4 pozycje):** Wybierz Dom (→ zewnętrzny SenseVR), Kontakt (`#kontakt`), Lokalizacja (`#lokalizacja`), Polityka Prywatności (`/privacy-policy/`).
- **Oferta wg dewelopera (cytat):** „Dwadzieścia luksusowych apartamentów w 6 budynkach... Narożne budynki składają się z czterech mieszkań, środkowe z dwóch. Mieszkania od 82m² do 133m² posiadają parter i piętro oraz poddasze, które możesz zaadaptować. Poddasze jest zawarte w cenie nieruchomości i nie jest wliczone w metraż." Metraże precyzyjne: **82,05–133,03 m², do 5 pokoi** (noweinwestycje.pl).
- **Udogodnienia:** prywatny ogródek + taras z panoramicznymi oknami, **2 miejsca parkingowe / lokal (4 lokale z własnym garażem)**, prywatne wejście, możliwość personalizacji „pod klucz" na etapie budowy.
- **Technologia/standard:** pompy ciepła, ogrzewanie podłogowe, rekuperacja i fotowoltaika (opcja), panoramiczne okna od podłogi do sufitu, elastyczna cegła, elewacja tynk premium, blacha na rąbek.
- **Lokalizacja (cytat):** „w Głownie, w zaciszu malowniczego ponad 100-letniego lasu sąsiadującego z Zalewem Mrożyczka... Central Wake Park... plaża, kąpielisko oraz ścieżki rowerowe". Adres: „95-015 Głowno, Plażowa 5 i 7".
- **Galeria:** ~16 obrazów (patrz lista URL w sekcji Higgsfield), mapka 3D osiedla (`mapka-3D.webp`), zdjęcia okolicy (autor Piotr Lewandowski, Urząd Miejski w Głowie).
- **Kontakt:** tel. **515 488 951**, e-mail **biuro@plazowa-park.pl**, logo MWW (agencja/marketing), promocja „10% rabatu na zakupy w CBG przy zakupie mieszkania".

**Czego BRAKUJE / co zrobione źle (z perspektywy sprzedaży i SEO):**
- Brak podstron per dom/typ (cała oferta wypchnięta do SenseVR — zerowy content SEO na domenie).
- Brak danych strukturalnych schema.org, brak Open Graph zoptymalizowanego, brak sitemap/robots pod inwestycję.
- Brak **jawnych cen i statusów dostępności** na stronie (klient musi klikać do zewnętrznego narzędzia).
- Brak sekcji „Okolica" z realną mapą, brak sekcji finansowania/kredytu, brak FAQ, brak trust signals (deweloper, dziennik budowy, gwarancje).
- Brak scarcity („zostały 3 domy"), brak wyraźnego lead-capture z niskim tarciem.
- One-pager kotwicowy — słaba architektura informacji i indeksacja; treść marketingowa lania wody zamiast konkretów (metraże, rzuty, ceny).

**Rozbieżności do rozstrzygnięcia przed launchem:**
| Parametr | plazowa-park.pl / investmap | rynekpierwotny / gethome | Rekomendacja |
|---|---|---|---|
| Liczba jednostek | 20 apartamentów | 18 lokali/domów | Przyjmij 20 (wg dewelopera), potwierdź u KS Prestige |
| Nazewnictwo | „apartamenty/mieszkania" | „domy" | Ujednolić: to segmenty/apartamenty w zabudowie 6 budynków |
| Dostępność | — | rynekpierwotny: „nie ma w sprzedaży"; gethome: „dostępnych 20" | Zweryfikować u dewelopera — dane portali sprzeczne |
| Ceny | od 603 000 zł | otodom: 764 000 zł za 94 m² | „od 603 000 zł" jako cena wywoławcza |

### 2. Weryfikacja lokalizacji + POI (do sekcji „Okolica" i SEO lokalnego)

- **Adres:** ul. Plażowa 5 i 7, 95-015 Głowno, gmina miejska Głowno, powiat zgierski, województwo łódzkie.
- **TERYT jednostki ewidencyjnej Głowno-miasto: `102001_1`** (10 = łódzkie, 20 = zgierski, 01 = Głowno, 1 = gmina miejska). Obręb ul. Plażowej najprawdopodobniej **GŁOWNO 5 = `102001_1.0005`** — WYMAGA potwierdzenia kliknięciem działki na geoportal.gov.pl. (Uwaga: powiat zgierski = 20, nie 05.)
- **Współrzędne (WGS84):** Zalew Mrożyczka ≈ 51.9614, 19.7197; inwestycja ≈ 51.960, 19.718 (potwierdź na geoportalu).
- **Odległości:** ~17 km / ~30 km do Łodzi (16,9 km wg rynekpierwotny), dojazd autostradą A2 + DK14; przystanek Sosnowa/Kopernika ~100 m; Publiczne Katolickie LO ~200 m; przychodnia Remedium ~200 m; sklepy (Lipińscy, Ewa Gwóźdź) ~200 m; boisko/kort ~300 m; Central Wake Park ~300 m; **13 placówek edukacyjnych** w okolicy.
- **Atrakcje Zalewu Mrożyczka (POI premium do treści):** 30+ ha zbiornik na rzece Mrodze, piaszczysta plaża (piasek ze śródlądowych wydm), strzeżone kąpielisko (sezon, 11–19), molo/pomost widokowy, altana koncertowa, wodny plac zabaw z dmuchańcami, statek-plac zabaw, boiska do siatkówki plażowej i beach soccera, park linowy (2 trasy, wejście od ul. Plażowej), wypożyczalnia kajaków i rowerów wodnych, promenada pieszo-rowerowa, Central Wake Park (wakeboard).

### 3. Strategia SEO lokalnego (gotowe elementy do wdrożenia)

**A. Keyword research (4 grupy + intencja):**

- **Transakcyjne (wysoka intencja):** „domy na sprzedaż Głowno", „nowe mieszkania Głowno", „mieszkania od dewelopera Głowno", „apartamenty na sprzedaż Głowno", „osiedle Plażowa Park", „nowa inwestycja Głowno". Intencja: gotów do kontaktu/zakupu → strony ofert i CTA.
- **Lokalne (miejscowość/region + typ):** „mieszkania Głowno powiat zgierski", „nieruchomości nad Zalewem Mrożyczka", „mieszkania blisko Łodzi nad jeziorem", „domy Głowno łódzkie", „inwestycja Głowno las". Intencja: lokalizacja jest kryterium → strona „Lokalizacja/Okolica".
- **Long-tail (parametry):** „mieszkanie 82 m² z ogrodem Głowno", „apartament 133 m² blisko plaży", „mieszkanie z tarasem i garażem Głowno", „mieszkanie z ogródkiem nad jeziorem łódzkie", „nowe mieszkanie stan deweloperski Głowno pompa ciepła". Intencja: sprecyzowany wybór → karty konkretnych lokali.
- **Brandowe:** „Plażowa Park", „Plażowa Park Głowno", „KS Prestige Development", „Plażowa Park opinie". Intencja: nawigacyjna → strona główna + o deweloperze.
- **Informacyjne (top-funnel → transakcja, na blog):** „czy warto kupić mieszkanie w Głownie", „życie nad Zalewem Mrożyczka", „dojazd z Głowna do Łodzi", „koszty utrzymania domu z pompą ciepła".

**B. Struktura URL (podstrony per typ/dom — kluczowe dla SEO deweloperskiego):**
```
/                                     → strona główna inwestycji (H1 brandowo-lokalny)
/domy/                                → lista lokali z filtrami i statusem
/domy/[nr-lokalu]/                    → karta lokalu (metraż, rzut, cena, status, CTA)
/lokalizacja/                         → mapa MapLibre + POI + Zalew Mrożyczka
/galeria/                             → wizualizacje/zdjęcia (Higgsfield + realne)
/standard-i-technologia/              → pompy ciepła, fotowoltaika, materiały
/postep-budowy/                       → dziennik budowy (świeżość treści)
/finansowanie/                        → kredyt, doradca, harmonogram wpłat
/o-deweloperze/                       → KS Prestige, KRS, trust signals
/kontakt/                             → formularz + NAP + mapa
/faq/                                 → pytania (FAQPage schema)
/blog/[slug]/                         → treści informacyjne pod frazy
```
Zasady: małe litery, myślniki, bez polskich znaków, spójny trailing slash, `rel=canonical`, każda podstrona max 3 kliknięcia od strony głównej.

**C. Przykładowe title tags i meta descriptions (gotowe):**
- Home — Title: `Plażowa Park Głowno – nowe apartamenty nad Zalewem Mrożyczka` | Meta: `20 apartamentów 82–133 m² w 100-letnim lesie przy Zalewie Mrożyczka w Głownie. Ogród, taras, 2 miejsca parkingowe. Ceny od 603 000 zł. Sprawdź dostępność.`
- Lista domów — Title: `Domy i apartamenty na sprzedaż – Plażowa Park Głowno` | Meta: `Zobacz dostępne lokale 82–133 m² w osiedlu Plażowa Park w Głownie. Rzuty, ceny, status dostępności online. Umów prezentację.`
- Karta lokalu — Title: `Apartament {nr} – {metraż} m² z ogrodem | Plażowa Park` | Meta: `{metraż} m², {liczba} pokoi, prywatny ogród i taras, {status}. Cena {cena} zł. Osiedle Plażowa Park, Głowno – nad Zalewem Mrożyczka.`
- Lokalizacja — Title: `Lokalizacja – Plażowa Park, Zalew Mrożyczka Głowno` | Meta: `100-letni las, plaża i kąpielisko Mrożyczka, Central Wake Park, 30 min od Łodzi. Szkoły i sklepy w zasięgu spaceru.`

**D. Struktura nagłówków (Home):** H1 `Plażowa Park – apartamenty nad Zalewem Mrożyczka w Głownie`; H2: `Osiedle w 100-letnim lesie`, `Wybierz swój dom`, `Standard i technologia`, `Okolica i Zalew Mrożyczka`, `Deweloper KS Prestige`, `Kontakt`; H3 pod cechy (pompy ciepła, ogrzewanie podłogowe, panoramiczne okna, materiały premium).

**E. JSON-LD schema.org (gotowy szkielet — wstaw do `<head>`):**
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://plazowa-park.pl/#developer",
      "name": "KS Prestige Development Sp. z o.o.",
      "url": "https://plazowa-park.pl",
      "telephone": "+48515488951",
      "email": "biuro@plazowa-park.pl",
      "address": {"@type":"PostalAddress","streetAddress":"Mikołaja Kopernika 30A","addressLocality":"Głowno","postalCode":"95-015","addressCountry":"PL"}
    },
    {
      "@type": "RealEstateListing",
      "name": "Plażowa Park – apartamenty nad Zalewem Mrożyczka",
      "url": "https://plazowa-park.pl/",
      "datePosted": "2026-01-01",
      "about": {
        "@type": "Residence",
        "address": {"@type":"PostalAddress","streetAddress":"Plażowa 5-7","addressLocality":"Głowno","postalCode":"95-015","addressRegion":"łódzkie","addressCountry":"PL"},
        "geo": {"@type":"GeoCoordinates","latitude":51.960,"longitude":19.718}
      },
      "offers": {
        "@type":"Offer","priceCurrency":"PLN","price":603000,
        "availability":"https://schema.org/InStock","seller":{"@id":"https://plazowa-park.pl/#developer"}
      }
    },
    {"@type":"BreadcrumbList","itemListElement":[/* Home > Domy > Lokal */]},
    {"@type":"FAQPage","mainEntity":[/* pytania z /faq/ */]}
  ]
}
```
Per karta lokalu: osobny `SingleFamilyResidence`/`Apartment` z `floorSize` (QuantitativeValue, MTK), `numberOfRooms`, `Offer.price` i `availability` — **cena i metraż w schema MUSZĄ być identyczne z widocznymi na stronie** (spójność = warunek rich results). Dodaj `LocalBusiness` dla biura sprzedaży (NAP) + Open Graph (`og:title`, `og:image` z hero, `og:type=website`).

**F. Konkurencja i luki:** lokalny rynek pierwotny w Głownie jest płytki — dominują portale agregujące (otodom, rynekpierwotny, tabelaofert, domiporta, gethome) i oferty wtórne. Brak silnej dedykowanej strony deweloperskiej rankującej na frazy „nad Zalewem Mrożyczka" — to główna luka do zajęcia. Wzorzec do pobicia: `osiedleborowikowe.pl` (karty domów ze statusem Dostępne/Rezerwacja/Sprzedane). Portale mają autorytet — nie zastąpisz ich, ale przechwycisz klienta bliżej decyzji (wyższa konwersja, niższy koszt leada). Dodatkowo: załóż Google Business Profile z NAP zgodnym ze schema, zdobądź linki z lokalnych mediów (tulodz.pl, glowno.pl) i portali branżowych.

**G. Techniczne SEO:** Core Web Vitals (Next.js SSR/ISR + `next/image` WebP/AVIF, Lenis nie może psuć INP — respektuj `prefers-reduced-motion`), sitemap.xml automatyczny, robots.txt, alt-texty opisowe dla każdej wizualizacji (np. „Apartament narożny 133 m² z tarasem, osiedle Plażowa Park Głowno"), lazy-loading galerii, linkowanie wewnętrzne lista→karta→lokalizacja→kontakt.

### 4. Brief + gotowe prompty pod Higgsfield (na realnych assetach)

**Zasada nadrzędna:** to gotowa/budowana inwestycja → model MA odwzorować realny wygląd, NIE zmyślać bryły. Karm go realnymi referencjami.

**Assety źródłowe do importu (URL z domeny, przez `media_import_url` → `media_id`, potem jako reference/element):**
- Mapka 3D osiedla: `https://plazowa-park.pl/wp-content/uploads/2025/12/mapka-3D.webp`
- Rendery/galeria: `.../2025/12/8.webp`, `.../2025/12/7-scaled.webp`, `.../2026/04/01b.webp`, `.../2026/04/03b.webp`, `.../2026/04/024.webp`, `.../2026/04/1024x1024.webp` oraz warianty `1024x1024-1..7`.
- Zdjęcia okolicy (Zalew/wydmy/wakepark): pliki `29192`, `241135649...`, `35329084...`, `29925`, `437146520...` z `/2024/05/`.

**Framework promptowania (SLCT + Nano Banana Pro 6-cz.):** Subject → Location/Setting → Composition (kadr/kąt) → Time/light → Style (fotorealizm, obiektyw) + editing instruction. Antyhalucynacja: zawsze „based on the provided reference image, keep the exact building massing, roofline, facade materials and window layout identical; do not invent new architecture". Spójność: używaj tego samego reference set + stały opis materiałów (elastyczna cegła, tynk premium, blacha na rąbek, panoramiczne okna).

**Gotowe prompty:**
1. **Hero (aerial, dzień):** „Photorealistic aerial drone shot of a 6-building modern residential estate in a 100-year-old pine forest beside a 30-hectare lake (Zalew Mrożyczka), Głowno Poland. Based on the provided reference render — keep the exact building massing, gable rooflines, seam metal roofs, premium plaster facades and floor-to-ceiling windows identical. Golden hour, warm side light, long soft shadows, 24mm wide lens, high dynamic range, 4K. Do not invent new buildings."
2. **Dom pojedynczy (eye-level):** „Ground-level 3/4 exterior of a corner unit, private garden and terrace with panoramic windows, two parking spaces. Match the reference facade materials and proportions exactly. Overcast-to-sunny natural light, 35mm, f/4, realistic contact shadows, photoreal, 4K."
3. **Wnętrze (salon):** „Interior of an open-plan living room with kitchenette, floor-to-ceiling windows overlooking pine forest, underfloor heating (no visible radiators), Scandinavian-warm styling. Based on reference interior — keep window layout and room proportions. Soft daylight, 24mm, natural skin-of-materials texture, photoreal."
4. **Okolica/plaża:** „Cinematic view of a sandy inland-dune beach and wooden pier at Zalew Mrożyczka in summer, families relaxing, forest backdrop. Based on provided location photos — keep the real pier and beach character. Warm afternoon light, 35mm, photoreal, 4K."
5. **Dzień→noc (elewacja):** para promptów z identycznym reference, zmienna: „daytime, neutral light" vs „blue hour, warm interior glow through panoramic windows, exterior path lighting".
6. **Detal:** „Close-up of seam metal roof edge meeting premium plaster facade and large window frame, realistic material texture, 85mm, shallow depth of field, photoreal."

**Wideo (Higgsfield):** hero animacja lotu drona nad osiedlem (Kling 3.0 turbo z start_image z prompta 1, camera: slow orbit + push-in), oraz płynny przelot dzień→noc. Zasada: `generate_video` ze start_image = wcześniej zaakceptowany render, wolny ruch kamery (nie szarpany), 5–10 s pętle pod hero.

### 5. Stack, architektura i integracja danych geoprzestrzennych

**Rekomendowany stack (uzasadnienie):**
- **Next.js 15/16 App Router + TypeScript** — SSR/ISR pod SEO i Core Web Vitals, podstrony per lokal, sitemap automatyczny.
- **Tailwind CSS** — szybki, spójny design system Awwwards-grade.
- **GSAP + ScrollTrigger + Lenis** (`npm i gsap lenis @gsap/react`; import `lenis/react`, `useGSAP`) — scroll-driven storytelling, parallax, pinned sections, split-text hero; `gsap.ticker.add(t=>lenis.raf(t*1000))`, `lagSmoothing(0)`, respektuj `prefers-reduced-motion` (INP/Core Web Vitals).
- **MapLibre GL JS** — interaktywna mapa osiedla + „Okolica" z warstwami GUGiK (open-source, WebGL, bez opłat licencyjnych Mapbox).
- **Three.js/React Three Fiber** — opcjonalnie 3D hero (icosahedron/teren) lub interaktywny model osiedla; użyj tylko jeśli podnosi konwersję, z fallbackiem wydajnościowym.
- **Vercel** — hosting, preview deployments, edge.

**Sekcje landing page (kolejność):** Hero (wideo/aerial + H1 + CTA „Sprawdź dostępność") → Pasek zaufania/scarcity („20 apartamentów, zostało X") → Osiedle w liczbach → **Interaktywna mapa osiedla (klikalne domy + status Dostępny/Rezerwacja/Sprzedany)** → Wybierz dom (grid kart → karty per lokal z rzutem, metrażem, ceną, statusem, CTA) → Standard/technologia → Galeria → **Okolica (mapa MapLibre + POI + Zalew Mrożyczka)** → Finansowanie/harmonogram → O deweloperze (KS Prestige, KRS, trust) → FAQ → **Formularz lead capture** (niskie tarcie: imię, telefon/e-mail, wybrany lokal, RODO) + szybki kontakt (tel. 515 488 951, click-to-call, WhatsApp).

**Elementy konwersji:** sticky CTA + numer telefonu, scarcity licznik na mapie i kartach, ceny jawne + „od 603 000 zł", kalkulator/harmonogram wpłat, trust signals (KRS, dziennik budowy, gwarancja), formularz per lokal („Zapytaj o ten dom"), exit-intent lead magnet (PDF karta lokalu / cennik).

**Interaktywna mapa osiedla (klikalne domy):** SVG/canvas overlay na renderze aerial „z lotu ptaka" (z Higgsfield) LUB warstwa GeoJSON w MapLibre; każdy budynek = feature z `status`, kolor pineski/obrysu wg statusu; klik → popup/karta lokalu. Wzorzec funkcjonalny jak `osiedleborowikowe.pl`.

**Integracja GUGiK/Geoportal + MapLibre:**

*Ortofotomapa (warstwa raster w mapie „Okolica"):*
```js
map.addSource('gugik-orto', {
  type: 'raster',
  tiles: ['https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMS/StandardResolution?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=Raster&FORMAT=image/png&TRANSPARENT=true&CRS=EPSG:3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}'],
  tileSize: 256
});
map.addLayer({ id:'orto', type:'raster', source:'gugik-orto' });
```
Wysoka rozdzielczość: podmień na `.../ORTO/WMS/HighResolution`. WMTS: `.../ORTO/WMTS/StandardResolution` (obsługuje też WGS84). Usługa GUGiK jest bezpłatna (zakaz masowego harvestingu).

*Granice/numery działek (WMS KIEG):*
```
https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaEwidencjiGruntow?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=dzialki,numery_dzialek,budynki&FORMAT=image/png&TRANSPARENT=TRUE&CRS=EPSG:2180&...
```

*Geometria konkretnej działki inwestycji (ULDK API — do narysowania obrysu działki na mapie):*
```
# a) po współrzędnych (WGS84 → wynik w PUWG 1992):
https://uldk.gugik.gov.pl/?request=GetParcelByXY&xy=19.7185,51.9605,4326&result=id,geom_wkt&srid=2180
# a') po współrzędnych w układzie 2180 (najniezawodniejsze):
https://uldk.gugik.gov.pl/?request=GetParcelByXY&xy=460166.4,313380.5&result=id,geom_wkt
# b) po identyfikatorze działki (zastąp .NR realnym numerem z geoportalu):
https://uldk.gugik.gov.pl/?request=GetParcelById&id=102001_1.0005.NR&result=id,teryt,parcel,geom_wkt&srid=4326
# c) po nazwie obrębu + nr (gdy nie znasz pełnego id):
https://uldk.gugik.gov.pl/?request=GetParcelByIdOrNr&id=Głowno NR&result=id,parcel,county,geom_wkt
```
ULDK zwraca **WKT lub WKB, NIE GeoJSON** — konwertuj WKT→GeoJSON po stronie klienta (np. `wellknown`/`terraformer`) i dodaj jako `type:'geojson'` source z obrysem działki (fill + line) pod pineski budynków. Dokładność granic online 0,5–2 m (poglądowa, bez mocy prawnej — zaznacz w stopce).

**Workflow buildu (dla Claude Code):** (1) `create-next-app` z TS+Tailwind+App Router; (2) skonfiguruj Lenis+GSAP provider; (3) zbuduj sekcje + routing per lokal z danymi w JSON/CMS; (4) MapLibre z warstwą GUGiK + GeoJSON działki/budynków; (5) formularze + tracking konwersji (GA4/Search Console); (6) schema.org per typ strony; (7) sitemap/robots; (8) import assetów Higgsfield → galeria/hero; (9) audyt Core Web Vitals; (10) deploy Vercel (preview → production).

---

## Recommendations (staged, z progami decyzyjnymi)

**Etap 0 – Weryfikacja danych (przed pisaniem promptu, 1–2 dni):** Potwierdź u KS Prestige: (a) 18 czy **20** lokali, (b) aktualne ceny i **statusy dostępności per lokal**, (c) dokładny nr działki ewidencyjnej (kliknięcie na geoportal.gov.pl → potwierdź obręb `102001_1.0005`). *Próg:* nie publikuj cen/statusów, dopóki nie są potwierdzone — rozbieżność 18/20 i sprzeczne dane o dostępności to ryzyko prawne i wizerunkowe.

**Etap 1 – MVP konwersyjny (tydzień 1–2):** Next.js + strona główna + lista/karty lokali ze statusem + formularz + schema + GBP + podstawowe SEO. *Próg sukcesu:* strona indeksowana, formularz + click-to-call działają, Core Web Vitals „good".

**Etap 2 – Wizualizacje + mapy (tydzień 2–3):** import realnych assetów → Higgsfield (hero aerial, karty domów, wnętrza, okolica, wideo), interaktywna mapa osiedla z klikalnymi domami, MapLibre „Okolica" z ortofoto GUGiK + obrysem działki ULDK. *Próg:* wizualizacje przechodzą test wierności (bryła zgodna z referencją) — jeśli model halucynuje architekturę, wróć do reference-locking w promptcie.

**Etap 3 – SEO scale + content (tydzień 3–8):** blog (frazy informacyjne), dziennik budowy, linkbuilding lokalny (tulodz.pl, glowno.pl), FAQPage, monitoring pozycji na frazy transakcyjne + brandowe. *Próg:* frazy „domy/mieszkania na sprzedaż Głowno" i brandowe w TOP3 w 3–6 mies.; jeśli nie — wzmocnij content lokalny i profil linków.

**Etap 4 – Optymalizacja konwersji (ciągła):** A/B CTA, scarcity, exit-intent; mierz leady (formularze + telefony z Google), nie tylko pozycje. *Próg:* jeśli ruch rośnie a leady nie — popraw lead-capture i jawność cen.

**Co zmienia rekomendacje:** wyprzedaż >70% lokali → przełącz komunikację ze scarcity na „ostatnie X"; brak potwierdzenia cen → tryb „zapytaj o cenę"; słaby INP przez animacje → ogranicz GSAP/Three.js i priorytetyzuj CWV.

---

## Caveats
- **Liczba lokali (18 vs 20) i dostępność są sprzeczne między źródłami** (deweloper vs portale agregujące, których dane bywają automatyczne i nieaktualne) — obowiązkowa weryfikacja u dewelopera przed publikacją jakichkolwiek liczb/statusów.
- **`osiedlejordanow.pl` nie była dostępna dla fetchera** — opis oparto na wytycznych z briefu (Next.js/MapLibre/GSAP/GUGiK) i na jawnie dostępnym wzorcu konkurencyjnym `osiedleborowikowe.pl`; zweryfikuj referencję ręcznie.
- **Współrzędne i obręb ewidencyjny są przybliżone** (Nominatim był zablokowany dla fetchera) — potwierdź dokładny punkt i nr działki klikając na geoportal.gov.pl; TERYT jednostki `102001_1` potwierdzony, obręb `0005` do potwierdzenia.
- **Granice działek z ULDK/EGiB mają charakter poglądowy** (dokładność 0,5–2 m, bez mocy prawnej) — do prezentacji marketingowej OK, do celów prawnych potrzebny geodeta; zaznacz to w stopce mapy.
- **Ceny:** „od 603 000 zł" (noweinwestycje.pl) jako wywoławcza vs 764 000 zł za 94 m² w pojedynczym ogłoszeniu otodom — użyj aktualnego cennika dewelopera.
- **Usługi GUGiK są bezpłatne, ale zabraniają masowego harvestingu** i mogą zmieniać adresy endpointów (poprzednie adresy WMS/WMTS ortofoto wyłączono w 2021) — cache'uj rozsądnie i monitoruj dostępność usług.
- **Higgsfield/Nano Banana Pro:** mimo reference images model może subtelnie zmieniać detale — każdą wizualizację przejrzyj pod kątem wierności bryły przed publikacją; nie prezentuj wygenerowanych wnętrz jako „zdjęć z realizacji", jeśli to rendery (ryzyko wprowadzenia w błąd konsumenta).