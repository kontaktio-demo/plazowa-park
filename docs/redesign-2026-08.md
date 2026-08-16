# Redesign 2026-08 — kierunek „zalew"

Notatka z autonomicznego przeprojektowania landinga. Zapisuje decyzje, odstępstwa
od briefu i rzeczy zostawione do rozstrzygnięcia przez człowieka.

Zdanie, do którego sprowadzone są wszystkie decyzje: **to nie jest osiedle, przy
którym akurat jest woda, tylko osiedle nad wodą i w lesie**.

---

## 1. Kroje pisma

Wszystkie trzy kroje pierwszego wyboru przeszły, żaden fallback nie był potrzebny.

| Rola | Krój | Subsety | Uwagi |
|---|---|---|---|
| Display | Fraunces (variable) | latin, latin-ext | prawdziwy italic, normal + italic |
| Body / UI | Schibsted Grotesk (variable) | latin, latin-ext | |
| Utility / dane | JetBrains Mono 400/500 | latin, latin-ext | `preload: false` |

Polskie znaki zweryfikowane na zrzutach: „Zalew Mrożyczka", „Głowno", „ścieżki",
„sześć", „ŻYCIE" (mono, wersaliki) renderują się poprawnie w każdym z trzech krojów.

**Inter i Inter Tight nie występują w projekcie w żadnej roli.**

Dwie decyzje wydajnościowe wokół krojów:

- Fraunces ładowany **bez osi `SOFT`, `WONK`, `opsz`**. Nigdzie nie ustawiam
  `font-variation-settings`, więc osie były czystym balastem: 602 KB → 307 KB
  łącznego payloadu fontów.
- JetBrains Mono z `preload: false`. Obsługuje wyłącznie drobne etykiety, nie musi
  blokować pierwszego malowania.

### Kursywa

Prawdziwa kursywa Fraunces występuje **dokładnie w dwóch miejscach**:
`Zalewem Mrożyczka` w H1 hero i `osiedla` w H2 sekcji kontaktu. Nigdzie indziej.
Akcent w pozostałych nagłówkach jest robiony kolorem (`lake-300` na ciemnym,
`lake-700` na jasnym). Żaden nagłówek nie kończy się kropką.

---

## 2. Element sygnaturowy: skala głębokości

Prawy rail (wcześniej numer sekcji plus licznik zegarowy `00:48:35`) zastąpiony
pionową skalą głębokości. Licznik czasu usunięty w całości.

Kluczowa decyzja: **podziałka nie jest dekoracją**. Każdy znacznik stoi na realnej
głębokości swojej sekcji w dokumencie (`offsetTop / scrollHeight`), więc oś jest
wykresem faktycznej struktury strony. Linia powierzchni wody porusza się z pozycją
scrolla, część osi nad nią jest „zanurzona" gradientem. Przy `prefers-reduced-motion`
fala stoi.

Na ekranach poniżej 1280 px rail znika, zastępuje go pasek postępu 2 px z gradientem
`lake-500 → lake-300` pod headerem.

**Odstępstwo od briefu:** brief mówił o `mix-blend-mode` dopasowanym do tła sekcji.
Zamiast tego rail śledzi, nad którą sekcją stoi, i przełącza kolory jawnie.
`mix-blend-mode: difference` na tej palecie daje nieprzewidywalne, brudne barwy;
jawne przełączanie daje ten sam efekt i pełną kontrolę.

Drugi nośnik motywu: maska fali na trzech przejściach między pasmami (wejście
w spacer 360, w okolicę i w kontakt). Jedna warstwa SVG, niska amplituda.

---

## 3. Karty apartamentów: co zrobiono z sześcioma rzutami na dwadzieścia lokali

Najważniejsze odkrycie z danych: numer lokalu dewelopera koduje realną pozycję
w bryle. `4.1A` to dom 4, segment 1, strona A. Segment plus strona dają dokładnie
sześć powtarzalnych typów (1A, 1B, 2A, 2B, 3A, 3B) — tyle, ile jest rzutów, bez
jednego wyjątku na dwudziestu lokalach.

Zamiast udawać dwadzieścia różnych rzutów:

- pod każdą miniaturą jest podpis `RZUT POGLĄDOWY · TYP 2B`,
- każda karta dostaje **diagram pozycji w bryle** rysowany z prawdziwej numeracji:
  budynek dzieli się na domy, dom na strony A i B, podświetlony jest ten lokal,
- pod diagramem `DOM 7 · STRONA B`, obok metraż ogrodu, budynek i cena.

Dwie karty tego samego typu rzutu przestają być kopiami, bo różnią się pozycją,
ogrodem i ceną — i wszystko to są dane prawdziwe.

**Odstępstwo od briefu:** brief chciał skalowania miniatur proporcjonalnie do
metrażu (największy rzut wypełnia ~90% kadru, mniejsze proporcjonalnie mniej).
Sprawdziłem to na źródłach i **nie da się tego zrobić uczciwie**: rzuty nie są
renderowane we wspólnej skali. Największy lokal (133 m², typ 3A) ma po przycięciu
bounding box 337×640 px, a mniejszy 94 m² (typ 1A) 571×640 px — czyli mniejszy
lokal zajmuje więcej pikseli. Renderowano je kadrowane osobno, nie w jednej skali
metrycznej. Skalowanie ich „proporcjonalnie do metrażu" sugerowałoby wspólną
podziałkę, której nie ma, czyli wprowadzałoby klienta w błąd co do proporcji.

Zamiast tego: wszystkie rzuty są przycięte do własnego obrysu (`trim`) i sprowadzone
do wspólnej wysokości, więc tworzą spójny system. Realna różnica wielkości lokali
jest komunikowana danymi (metraż, ogród, cena) i diagramem pozycji. Przy okazji
proporcja przyciętego kadru niesie prawdziwą informację o kształcie lokalu:
lokale środkowe są wyraźnie wąskie i głębokie (0,53), narożne prawie kwadratowe (0,89).

Rzuty leżą na ciemnym panelu `lake-900` jako jasny „arkusz" — render przestał ginąć
na szarym, a ciemny panel jest zgodny z briefem.

Na telefonie karta jest **poziomym wierszem katalogu** (miniatura 38% szerokości,
dane obok). To skróciło samą listę lokali z 9 ekranów do niecałych 2.

Sortowanie: natywny `<select>` zastąpiony własnym comboboxem (wzorzec
`combobox` + `listbox`/`option`, `aria-activedescendant`, obsługa strzałek, Enter,
Escape, Tab, klik poza).

---

## 4. Zdjęcie rodziny i mapa okolicy

**Zdjęcie rodziny w lnie: usunięte z repo** (`public/lifestyle/rodzina.webp`).

Zastąpione kadrem wyciętym z istniejącego renderu hero: taras, przeszklenia od
podłogi do sufitu, prywatny trawnik, poranne światło, bez ludzi
(`public/renders/zycie.webp`, crop 1400×820 z oryginału 2400×1340). To realny
materiał inwestycji, a nie nowy stock. Sekcja 05 dostała układ 60/40 odwrócony,
z blokiem tekstowym nachodzącym na kadr o 64 px.

**Izometryczna mapa AI z czerwoną pinezką Google: usunięta z repo**
(`public/map/mapka-3D.webp`), razem z jej użyciem na `/lokalizacja`.

Zastąpiona własnym schematem SVG (`components/AreaMap.tsx`). Układ przeniesiony
z planu dewelopera z rzutu izometrycznego na widok z góry, z zachowaniem
wzajemnego położenia: zalew, przystań na zachodzie, plaża z molo na południowym
zachodzie, Central Wake Park i osiedle na wschodzie, park linowy i wydmy na
południu, Plac Wolności na północy. Woda w `lake-700` ze zmarszczkami w motywie
znaku marki, las jako pas kropek okalający wodę, drogi jako hairline, etykiety
w mono z odnośnikami do punktów, osiedle oznaczone pierścieniem `sun` zamiast
pinezki.

Mapa satelitarna Esri zostaje (jest funkcjonalna), w ramce systemu
i z `filter: saturate(0.85) contrast(1.05)`, żeby nie kłóciła się z paletą.

---

## 5. Wyniki liczbowe

| Metryka | Przed | Po | Cel |
|---|---|---|---|
| Transfer, pełny scroll desktop | 11,4 MB | **2,3 MB** | ≤3,5 MB |
| `public/` w repo | 11,9 MB | **2,2 MB** | |
| Sekwencja obrotu | 120 klatek / ~10 MB | **24 klatki / 891 KB** | ≤24 / ≤1,1 MB |
| Sekwencja obrotu, mobile | brak (statyczny kadr) | **6 klatek / 94 KB** | ≤300 KB |
| Wysokość strony, mobile 390 px | 25 775 px | **15 442 px** | ≤14 000 px |
| Wysokość strony, desktop | 17 644 px | **12 837 px** | |
| Lighthouse mobile: Performance | — | **85** | ≥85 |
| Lighthouse mobile: Accessibility | — | **100** | ≥95 |
| Lighthouse mobile: Best practices / SEO | — | **100 / 100** | |
| ESLint | 18 błędów, 2 ostrzeżenia | **11 błędów, 0 ostrzeżeń** | bez nowych |

### Czego nie udało się dowieźć

**Wysokość mobile: 15 442 px zamiast 14 000 px.** To jedyny twardy cel z briefu,
którego nie osiągnąłem. Zredukowałem stronę o 40%, wyczerpując wszystkie dźwignie
z briefu (siatki wielokolumnowe zamiast stosów, skrócenie sekcji standardu,
krótsze paddingi) i dokładając własne (pozioma karta lokalu na telefonie, podgląd
6 kart zamiast 20, mniejsze nagłówki na wąskich ekranach). Zejście do 14 000 px
wymagałoby już wycięcia treści: przy jedenastu sekcjach same nagłówki, lidy
i bloki merytoryczne dają ~13 300 px, zanim policzy się choć jedną kartę lokalu.
Uznałem, że architektura informacji i copy — wprost wyłączone z modyfikacji —
są ważniejsze niż domknięcie tej liczby. **Do decyzji człowieka:** jeśli 14 000 px
ma być twarde, najtańsze cięcie to złączenie sekcji 05 (Życie) z 04 (Standard)
albo rezygnacja z mapy satelitarnej na telefonie.

**LCP 4,3 s w symulacji Lighthouse.** Wynik ogólny 85 jest osiągnięty, ale samo
LCP jest wysokie. Pomiar jest z localhost przy symulowanym 4G; na Vercelu z CDN
i HTTP/2 będzie wyraźnie lepiej. Warto zweryfikować na produkcji.

**Baner cookie na telefonie.** Przy pierwszej wizycie zasłania etykiety drugiego
rzędu statystyk hero (`m² POWIERZCHNI`, `CENA`) — same wartości `82-133`
i `od 633 000` są widoczne. Na desktopie baner jest kompaktowym paskiem
w lewym dolnym rogu i nie dotyka statystyk. Domknięcie tego na telefonie
wymagałoby albo skrócenia lidu hero poniżej sensownego minimum, albo przesunięcia
banera, co kłóci się z zapisem briefu o pozycji dolnej na całą szerokość.

---

## 6. Pozostałe decyzje

**Numeracja sekcji.** Wcześniej `01, 02, 03, 04, 05, 07` z brakującym 06 i railem
pokazującym inne numery niż eyebrow. Teraz jedno źródło (`lib/sections.ts`) czytane
przez eyebrow, skalę głębokości i nawigację, więc rozjazd jest strukturalnie
niemożliwy. Numeracja 01–09 ciągła.

**Pasma sekcji jako zmienne CSS.** Każda sekcja deklaruje jedno pasmo
(`band-sand`, `band-sand-2`, `band-abyss`, `band-deep`, `band-lake`), a komponenty
czytają `--band-fg`, `--band-line`, `--band-surface`, `--band-accent`, `--band-focus`.
Dzięki temu karta, chip czy pole formularza same dopasowują się do jasnego albo
ciemnego tła i **w komponentach nie ma ani jednego hexa ad hoc**.

**Kontrast.** Sprawdzony liczbowo, nie na oko. Wnioski, które weszły do systemu:
`lake-500` ma na `abyss` kontrast 4,40:1, więc jako tekst nie przechodzi — na
ciemnym akcentem tekstowym jest `lake-300` (9,12:1), a `lake-500` służy tylko za
obwódki i wypełnienia. Na jasnym tekstowym akcentem jest `lake-700` (7,75:1),
nie `lake-500` (3,79:1). `sun` nigdy nie jest tekstem na jasnym (1,94:1), wyłącznie
wypełnieniem pod ciemnym tekstem (8,87:1). Etykiety statusów są w kolorze tekstu
pasma, a kolor niesie tylko kropka 8 px — inaczej zielony `ok` na piasku dawałby
2,87:1.

**Białe tło renderów.** Sekwencja obrotu i plan osiedla to rendery na białym tle,
które na piaskowym paśmie odcinały się jako biały prostokąt. Rozwiązane przez
`mix-blend-mode: multiply` zamiast przerabiania assetów.

**Ruch.** Jedna sekcja pinowana na całej stronie (obrót osiedla), skrócona z 3 do
1,5 ekranu scrolla, z trzema podmieniającymi się podpisami, żeby kolumna tekstu nie
stała martwa. Reveal jednolity: 24 px, 700 ms, `cubic-bezier(.16,1,.3,1)`,
stagger 60 ms.

Wejście H1 hero animuje **wyłącznie przesunięcie, bez zaniku**. To nie jest decyzja
estetyczna: element startujący z `opacity: 0` nie liczy się jako kandydat na LCP,
przez co pomiar przejmował tekst banera cookie montowanego po 800 ms. Po zmianie
LCP wyznacza H1, a Performance wzrósł z 80 na 85.

**Lenis i GSAP (~200 KB) ładowane dopiero w `requestIdleCallback`**, a sekwencja
obrotu startuje dopiero, gdy sekcja zbliża się do ekranu. Warstwa odsłaniania treści
została natomiast natychmiastowa — gdyby czekała na idle, treść byłaby przez moment
niewidoczna.

**Zgoda RODO trafia teraz do payloadu leada** (`app/api/lead/route.ts`). Wcześniej
checkbox był wymagany po stronie formularza, ale dowód zgody nie był nigdzie
zapisywany. Jedna linia, bez zmiany zachowania dla użytkownika.

**Nietknięte:** wszystkie dane faktograficzne (ceny, metraże, ogrody, numery lokali
i budynków, KRS 0001031916, NIP 7331366052, REGON 525091200, adres, telefon, mail),
teksty prawne wraz z disclaimerem art. 66 KC, klauzule RODO, tytuły i opisy meta,
Open Graph, JSON-LD, `lang="pl"`, hierarchia nagłówków, sitemap, robots,
`proxy.ts` z host-allowlistą noindex oraz analityka.

**Usunięte komponenty:** `Preloader` (usunięty wcześniej, na osobne polecenie),
`SideRails` (zastąpiony przez `DepthRail`), `Lifestyle` (zastąpiony przez `Zycie`).

**`scripts/assets.mjs`** to jednorazowy pipeline assetów (przerzedzenie sekwencji
obrotu, przycięcie i konwersja rzutów, kadr do sekcji Życie, placeholdery blur).
Wynik jest zacommitowany, build nie zależy od skryptu. Uruchamiać tylko przy
wymianie materiałów źródłowych — skrypt kasuje pliki wejściowe.

---

## 7. Do sprawdzenia przez człowieka

1. **Mapa okolicy** to schemat rysowany ręcznie z planu dewelopera, nie mapa
   geodezyjna. Proporcje i kształt zalewu są uproszczone. Jeśli ma być wierna,
   trzeba ją oprzeć na realnych konturach (OSM/geoportal).
2. **Wysokość strony na telefonie** — patrz wyżej, decyzja co dalej należy do Ciebie.
3. **Ceny, metraże i statusy** nadal wymagają potwierdzenia z biurem sprzedaży
   przed publikacją produkcyjną (to samo zastrzeżenie co w README).
4. **Spacer 360 i rzuty PDF** wiszą na serwerze dewelopera
   (`quptos-web-data.sensevr.pl`) bez żadnego fallbacku. Nie ruszałem tego w tym
   redesignie, ale to pojedynczy punkt awarii dla dwóch funkcji naraz.
5. **README** opisuje stan sprzed redesignu (wideo w hero, galeria z lightboxem,
   sekcja finansowania, `middleware.ts`). Nie aktualizowałem go, bo brief dotyczył
   warstwy wizualnej — do zrobienia przy okazji.
