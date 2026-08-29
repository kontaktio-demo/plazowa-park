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

## 2. Skala głębokości: zbudowana i usunięta

Pierwsza wersja zamieniała prawy rail w pionową skalę głębokości, w której podziałka
stała na realnych głębokościach sekcji, a linia wody szła za scrollem. **Została
usunięta na wyraźne polecenie** po pierwszym przeglądzie: w praktyce czytała się jako
techniczny HUD przy krawędzi ekranu, a nie jako element identyfikacji.

Wraz z nią wypadł licznik zegarowy `00:48:35` (to akurat było do usunięcia od początku)
i pasek marquee. Wskaźnikiem pozycji jest teraz wyłącznie cienki pasek postępu
pod headerem, widoczny na każdej szerokości.

Zostaje drugi nośnik motywu: maska fali na trzech przejściach między pasmami
(wejście w spacer 360, w okolicę i w kontakt). Jedna warstwa SVG, niska amplituda.

**Konsekwencja do świadomej decyzji:** strona nie ma dziś jednego elementu
sygnaturowego. Niesie ją typografia (Fraunces z prawdziwym italikiem), rytm
jasnych i ciemnych pasm oraz obracane osiedle. Jeśli sygnatura ma wrócić, powinna
być wpięta w treść, a nie doklejona przy krawędzi.

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

Pierwsze podejście zastępowało ją własnym schematem SVG rysowanym z planu dewelopera.
**Zostało odrzucone po przeglądzie i usunięte** - rysowany zalew czytał się jak kleks,
a nie jak mapa. Wniosek: skoro nie mam realnych konturów, nie ma sensu udawać
kartografii.

Obowiązuje wersja realistyczna: sekcja Okolica pokazuje **prawdziwe zdjęcie
satelitarne** (Esri World Imagery przez MapLibre) na pełną szerokość, wyśrodkowane
na inwestycji, z markerem osiedla w systemie marki. Widać faktyczny zalew, las
i położenie działki, bez ani jednej zmyślonej linii. Punkty w okolicy są wypisane
listą pod mapą, z dystansami po prawej. To samo zdjęcie zastąpiło rysowany plan
na `/lokalizacja`.

## 5. Wyniki liczbowe

| Metryka | Przed | Po | Cel |
|---|---|---|---|
| Transfer, pełny scroll desktop | 11,4 MB | **~1,0 MB** | ≤3,5 MB |
| `public/` w repo | 11,9 MB | **1,1 MB** | |
| Sekwencja obrotu | 120 klatek / ~10 MB | **usunięta w całości** | ≤24 / ≤1,1 MB |
| Wysokość strony, mobile 390 px | 25 775 px | **15 755 px** | ≤14 000 px |
| Wysokość strony, desktop | 17 644 px | **11 934 px** | |
| Lighthouse mobile: Performance | — | **85** | ≥85 |
| Lighthouse mobile: Accessibility | — | **100** | ≥95 |
| Lighthouse mobile: Best practices / SEO | — | **100 / 100** | |
| ESLint | 18 błędów, 2 ostrzeżenia | **10 błędów, 0 ostrzeżeń** | bez nowych |

### Czego nie udało się dowieźć

**Wysokość mobile: 15 755 px zamiast 14 000 px.** To jedyny twardy cel z briefu,
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

**Obrót osiedla: zbudowany, dopracowany i usunięty.** Sekcja 01 przez trzy rundy
pokazywała render osiedla obracany scrollem. Po kolejnych uwagach („słabe", „nie
płynne", „nie siedzi mi to 360") makieta wypadła w całości razem z 48 klatkami
sekwencji. Po drodze zdiagnozowane rzeczy, które warto pamiętać przy podobnych
sekwencjach: 24 klatki to 15 stopni na klatkę i widoczne skakanie; `mix-blend-multiply`
nie posadzi renderu z białym tłem na kolorowym paśmie, bo warstwa reveal zakłada
własny kontekst stackingu (trzeba wypalić przemnożenie w plikach); a katalog z
klatkami musi być wersjonowany, bo `/orbit/` ma `Cache-Control` na 30 dni i przy
powtarzalnych nazwach wracający użytkownik dostaje wymieszane klatki.

**W miejsce obrotu: elewacje sześciu budynków.** Sekcja 01 jest teraz wycentrowana
typograficznie, a pod nagłówkiem stoi rząd sześciu sylwetek. Liczba segmentów w
bryle to realna liczba lokali w budynku, więc od razu widać różnicę między
narożnym (cztery apartamenty) a środkowym (dwa większe). Pod każdą bryłą numer
budynku, liczba lokali i cena od, wszystko z `BUILDINGS`. Kliknięcie budynku
przewija do listy lokali i ustawia na niej filtr (zdarzenie `pp:select-building`),
więc element nie jest dekoracją tylko skrótem nawigacyjnym. Żółty prostokąt na
połaci to okno dachowe, oznaczające poddasze zawarte w cenie i nieliczone do
metrażu - jedyny naprawdę wyróżniający fakt handlowy tej inwestycji, wcześniej
schowany w FAQ.

Skutek uboczny: sekcja zajmuje jeden ekran zamiast 2,6 ekranu pinowania, a `public/`
spadło z 2,9 MB do 1,1 MB.

Reveal jednolity:Reveal jednolity: 24 px, 700 ms, `cubic-bezier(.16,1,.3,1)`, stagger 60 ms.

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

**Karty lokali w siatce.** Maksymalnie trzy kolumny (wcześniej cztery powyżej
1600 px, przez co karty były wąskie, tytuły łamały się na dwie linie i wiersze
w środku kart rozjeżdżały się między kolumnami). Status przeniesiony nad tytuł
na wszystkich szerokościach, więc każda karta ma identyczne wiersze i metryki,
ceny oraz przyciski stoją w jednej linii w całym rzędzie. Przy wyniku filtra
do dziewięciu kart lista pokazuje się w całości, bez chowania trzech sztuk
za przyciskiem.

**Usunięte komponenty:** `Preloader`, `SideRails` i `DepthRail` (skala głębokości),
`Marquee`, `AreaMap` (rysowany schemat okolicy), `EstateOrbit` (makieta 360, zastąpiona
przez `Osiedle`), `Lifestyle` (zastąpiony przez `Zycie`).

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

---

## 8. Audyt przed przepięciem domeny (2026-08-22)

Porównanie z żywą stroną dewelopera `plazowa-park.pl` i z jego konfiguratorem
(SenseVR / Qupto, API `backend.quptos.sensevr.pl/api/0/investment/214`).

### Dane lokali

Ceny, metraże, ogrody, liczby pokoi, rzuty i miniatury: **zgodne co do złotówki
i co do metra** z konfiguratorem. Rozjechał się jeden wymiar - statusy sprzedaży:
**5.2A i 5.2B są zarezerwowane**, a strona pokazywała wszystkie 20 lokali jako
dostępne. Licznik w headerze to teraz 18.

Powstał `scripts/sync-units.mjs`, który zaciąga API i przepisuje `lib/data/units.ts`
razem z agregatami (dostępność budynków, licznik inwestycji). Statusy zmieniają się
najczęściej ze wszystkich danych, więc to jedyne miejsce, w którym strona realnie
może się rozjechać z rzeczywistością. Uruchamiać przed każdą większą kampanią.

Skrypt sprawdza też, czy plik rzutu faktycznie istnieje na CDN dewelopera:
**dla 3.3A, 5.2A i 7.2A go nie ma** (API podaje adres, serwer zwraca 404). Bez tej
weryfikacji przycisk „Rzut PDF" prowadziłby w pustkę; teraz dla tych trzech lokali
po prostu się nie pokazuje. Do zgłoszenia deweloperowi.

### Spacer 360

Klient miał rację, że jest nowa wersja. Stan faktyczny na CDN:

| wersja | zawartość |
|---|---|
| v1 | pełny spacer, tej używaliśmy |
| v2, v3 | nie istnieją |
| v4 | pełny spacer, przerenderowane panoramy, inne kadry startowe i hotspoty |
| v5 | **pusty manifest** (`viewer-manifest.json` to dosłownie `{}`), brak kafli |

API konfiguratora wskazuje jako bieżący **v5**, czyli wersję bez zawartości. Oznacza
to, że spacer jest po stronie dewelopera w trakcie publikacji albo zepsuty.
Przepięliśmy się na **v4** - najnowszą, która faktycznie ma panoramy; wszystkie
14 scen i kafle zweryfikowane. Gdy v5 zostanie opublikowany, wystarczy podmienić
`base` w `lib/data/tour360.json`.

### Treści, których nie mieliśmy

Ze strony dewelopera doszły dwa realne fakty: **prywatne wejście do każdego
mieszkania** i **personalizacja wykończenia pod klucz** (u nas była tylko w opisie
lokalu, nie w standardzie). Siatka standardu ma teraz 10 kafli w dwóch rzędach po
pięć. Do punktów w okolicy doszły **wydmy śródlądowe**, które deweloper eksponuje
jako unikalne w skali kraju.

**Nie przenieśliśmy** promocji „10% rabatu na zakupy w CBG" z paska na ich stronie -
skrót CBG nie jest nigdzie rozwinięty i nie zgaduję, co znaczy. Do decyzji klienta.

### SEO i gotowość na domenę

Naprawione w tej rundzie:

- **OG image** był jeszcze ze starej identyfikacji (Inter, złoty akcent). Nowy jest
  renderowany realnymi krojami strony, więc zgadza się z nią co do piksela.
- **Manifest PWA** miał kolory starej palety (`#f4f4f2` / `#2b2e33`). Teraz `abyss`.
- **Favicon** też był w starej palecie (grafit i mosiądz) - teraz abyss i `lake-300`.
- **Sitemap** miała `lastModified` zamrożone na 2026-08-03; teraz data builda.
- **Dane strukturalne**: `FAQPage` i `ItemList` całej inwestycji leciały na *każdej*
  podstronie, także tam, gdzie tej treści nie ma. To naruszenie wytycznych Google dla
  danych strukturalnych. Graf jest rozdzielony: tożsamość firmy globalnie, FAQ,
  lista lokali i oferta zbiorcza wyłącznie na stronie głównej.

Zweryfikowane jako gotowe: canonical na `plazowa-park.pl`, OG i Twitter komplet,
sitemap 25 adresów, robots, manifest, favicon, 404 z `noindex`, wszystkie 35
wewnętrznych adresów zwracają 200, kafle Esri odpowiadają.

Host-allowlista w `proxy.ts` jest przygotowana pod przepięcie: `plazowa-park.pl`
i `www` będą indeksowalne, a każdy inny host (w tym `*.vercel.app`) dostaje
`X-Robots-Tag: noindex, nofollow` - zweryfikowane nagłówkami.

### Wydajność

Fraunces ładował się jako font zmienny z pełnym zakresem wag 100-900, choć używamy
wyłącznie 600. Po przypięciu wag payload fontów spadł do 252 KB, a **Lighthouse
mobile wzrósł z 85 na 90**.

| | wynik |
|---|---|
| Lighthouse mobile | **90 / 100 / 100 / 100** |
| Lighthouse desktop | **74 / 100 / 100 / 100** |

Desktop jest niżej niż mobile, bo Lighthouse ocenia tam LCP dużo ostrzej (próg
„dobry" to ok. 1,2 s zamiast 2,5 s). Elementem LCP jest kursywa w H1, która lokalnie
maluje się w 136 ms, a w symulacji czeka na plik fontu. To nieodłączna cena serifu
display w nagłówku; na CDN z HTTP/2 i cache fontów będzie wyraźnie lepiej.
Warto zweryfikować na produkcji po przepięciu.

### Poster spaceru

Podbity Higgsfieldem z 1376×768 do 2400×1344. Sekcja jest pełnoekranowa, więc
poprzedni plik był rozciągany. Porównanie wycinków przed i po: ta sama scena, te
same drzewa i ten sam szczyt budynku, doszła realna faktura cegły i kory - żaden
element nie został dorysowany.

---

## 9. Formularz: Web3Forms (2026-08-22)

Poprzednia wersja endpointu `/api/lead` wysyłała leada przez Resend, ale
`RESEND_API_KEY` nigdy nie był ustawiony, więc zgłoszenia lądowały wyłącznie
w `console.log` na Vercelu. Klient przekazał skonfigurowany formularz Web3Forms.

**Kluczowe ustalenie: Web3Forms na darmowym planie odrzuca wywołania serwerowe.**
Pierwsza implementacja przekazywała zgłoszenie z naszego endpointu i dostawała:

```
403  "This method is not allowed. Use our API in client side or
      contact support with server IP address (Pro plan is required)"
```

Czyli pośrednik po stronie serwera zwracałby błąd przy **każdym** leadzie.
Wysyłka idzie więc bezpośrednio z przeglądarki, zgodnie z tym, jak Web3Forms
jest zaprojektowany. Endpoint `/api/lead` został usunięty - nie mógł działać,
a utrzymywanie martwej trasy tylko myliłoby przy diagnostyce.

Zweryfikowane realnym zgłoszeniem, nie założeniem:

- wywołanie z nagłówkiem `Origin: https://plazowa-park.vercel.app` przechodzi
  (`success: true`), więc klucz **nie jest** zawężony wyłącznie do domeny
  docelowej i formularz działa już teraz, nie dopiero po przepięciu,
- pełny test w przeglądarce: walidacja blokuje puste pola komunikatami po polsku,
  komplet danych przechodzi i pokazuje ekran „Zgłoszenie przyjęte".

W panelu Web3Forms są **dwa zgłoszenia oznaczone „TEST TECHNICZNY"** z tej
weryfikacji - do skasowania.

Klucz dostępu siedzi w kodzie klienta, bo z założenia jest publiczny (Web3Forms
podaje go we własnych przykładach). Dzięki temu przepięcie domeny nie wymaga
żadnej zmiennej środowiskowej. Odbiorcę, ochronę antyspamową i autorespondera
ustawia się w panelu Web3Forms, nie w kodzie.

Co przy tym zniknęło i trzeba mieć świadomość: limit pięciu zgłoszeń na IP oraz
druga kopia leada w logach serwera działały tylko w endpoincie. Ochronę
antyspamową przejmuje teraz Web3Forms (honeypot `botcheck` jest wysyłany),
a rejestrem zgłoszeń jest panel Web3Forms.

---

## 10. Powrót do Inter Tight i pełna weryfikacja faktów (2026-08-23)

### Typografia

Na polecenie wróciliśmy do kroju z pierwszej wersji strony: **Inter Tight**
w nagłówkach i **Inter** w tekście. JetBrains Mono w warstwie danych zostaje.

Konsekwencja, o której trzeba wiedzieć: **Inter Tight nie ma prawdziwej kursywy**.
Akcenty w H1 hero i w nagłówku kontaktu były wcześniej złożone kursywą Fraunces;
teraz niosą je wyłącznie kolorem (`lake-300` na ciemnym, `lake-700` na jasnym).
Klasa `.accent-italic` została usunięta, żeby nikt jej przypadkiem nie użył
i nie wrócił do syntetycznej kursywy.

Metryki przestrojone pod nowy krój: Inter Tight ma większą wysokość x i jest
gęstszy, więc leading poszedł w górę (1,02 zamiast 0,95 w display-xl), a tracking
w dół (-0,035em). Rozmiary lekko zmniejszone, bo przy tej samej wartości Inter
Tight wygląda okazalej niż serif.

Koszt wydajnościowy: **Lighthouse mobile 90 → 88**. Inter to cięższa rodzina niż
statyczny Fraunces 600, fontów ładuje się 234 KB zamiast ~150 KB. Próg z briefu
(≥85) nadal z zapasem. Waga 600 Intera została wycięta, bo występowała w jednym
miejscu i dało się ją zastąpić 500; nagłówki i tak składa Inter Tight.

### Weryfikacja każdej informacji na stronie

Przegląd zrobiony pod kątem „klient nie może znaleźć ani jednej nieścisłości".

**Dane lokali - 20 lokali × 8 pól porównane z API konfiguratora:** cena, cena za
m², metraż, ogród, pokoje, kondygnacje, status, przypisanie do budynku. Zero
rozbieżności. Agregaty (liczba lokali, dostępność, liczba budynków, min/max ceny,
metraży i pokoi) przeliczone niezależnie z danych i zgodne. To samo dla sześciu
budynków: liczebność, dostępność, cena od, zakres metraży.

**Skąd „18":** w konfiguratorze dewelopera **5.2A i 5.2B mają status `reserved`**.
20 lokali, 18 wolnych. Licznik zmieniony na „18 z 20", bo samo „18" dawało się
odczytać jako liczbę apartamentów w inwestycji.

**Typologia:** twierdzenie „budynki narożne (1 i 2, 4 i 5, 6 i 7, 9 i 10) po cztery
apartamenty 82-94 m² na dwóch kondygnacjach, środkowe (3, 8) po dwa
pięciopokojowe do 133 m²" sprawdzone lokal po lokalu. Zgadza się: 16 lokali
w narożnych po 4 na budynek (82,05-94,42 m², 4 pokoje, 2 kondygnacje),
4 w środkowych po 2 na budynek (127,28-133,03 m², 5 pokoi).

**Dane rejestrowe dewelopera** sprawdzone w oficjalnych źródłach, nie przepisane:

| | nasza strona | KRS / Biała lista MF |
|---|---|---|
| nazwa | KS Prestige Development Sp. z o.o. | KS PRESTIGE DEVELOPMENT SPÓŁKA Z O.O. |
| KRS | 0001031916 | 0001031916 |
| NIP | 7331366052 | 7331366052 |
| REGON | 525091200 | 525091200 |
| adres | ul. Mikołaja Kopernika 30A, 95-015 Głowno | MIKOŁAJA KOPERNIKA 30A, 95-015 GŁOWNO |
| status VAT | Czynny | Czynny (stan na 2026-08-23) |

**Współrzędne** `51.9593, 19.7255` sprawdzone odwrotnym geokodowaniem: ul. Plażowa,
Głowno, 95-015, powiat zgierski, województwo łódzkie. Zgadza się z adresem
w danych, w schema.org i w metatagach geo.

**Twierdzenia jakościowe** (poddasze w cenie i poza metrażem, dwa miejsca
postojowe, cztery lokale z garażem, prywatne wejście, pompy ciepła, ogrzewanie
podłogowe, rekuperacja i fotowoltaika jako opcja, panoramiczne okna, elastyczna
cegła, blacha na rąbek, 30-hektarowy zbiornik, ponad 100-letni las, Central Wake
Park, wydmy śródlądowe) - każde odnalezione dosłownie na stronie dewelopera.

### Co było nieprawdą i zostało poprawione

Strona twierdziła: „do centrum Łodzi około **30 minut**", „do Warszawy około
**godzinę**", „koleją aglomeracyjną **ŁKA** ze stacji Głowno". Żadnego z tych
zdań nie ma na stronie dewelopera - powstały wcześniej bez źródła.

Sprawdzenie routingiem (OSRM, czas bez korków, czyli wariant optymistyczny):

| twierdzenie | stan faktyczny |
|---|---|
| ~30 minut do centrum Łodzi | **41 min, 32,4 km** |
| ~godzina do Warszawy | **79 min, 103,9 km** |
| węzeł A1 Stryków | 13 min, 11,3 km |

Czasy były zaniżone o jedną trzecią. Zastąpione **odległościami**, które nie
zależą od korków i dają się zweryfikować: około 32 km do centrum Łodzi, węzeł A1
Stryków 11 km, około 104 km do Warszawy.

Nazwa przewoźnika **ŁKA usunięta** - nie udało się jej potwierdzić u źródła.
Zostało zweryfikowane: stacja kolejowa Głowno istnieje (OpenStreetMap, operator
PKP PLK) i leży **3 km od osiedla**; jest też przystanek Głowno Północne.

Poprawki objęły `/lokalizacja` (meta description, kafle tematyczne, dwa akapity)
oraz generator opisów lokali `lib/unitCopy.ts`, czyli wszystkie 20 podstron.

## 11. Kategoria „mieszkania i domy" i poster spaceru (2026-08-27)

### Dlaczego zmiana nazewnictwa

Inwestycja będzie reklamowana jako **mieszkania i domy**, nie jako
„apartamenty". Copywriting zostaje bez zmian (nadal „apartament X" w nagłówkach
i opisach - to termin sprzedażowy), zmienia się natomiast wszystko, co widzi
robot i co trafia do reklam: tytuły stron, adresy, kotwice, etykiety linków,
manifest i dane strukturalne.

| co | przed | po |
|---|---|---|
| trasa podstron lokali | `/lokal/[slug]` | `/mieszkania-i-domy/[slug]` |
| kotwica sekcji | `#lokale` | `#mieszkania-i-domy` |
| link w menu | Apartamenty | Mieszkania i domy |
| `<title>` strony głównej | Apartamenty nad Zalewem... | Mieszkania i domy nad Zalewem... |
| `<title>` podstrony lokalu | Apartament 1.1A - 94,42 m² z ogrodem | Mieszkanie 1.1A - 94,42 m² z ogrodem i tarasem |
| `og:title` | ...apartamenty na sprzedaż... | ...mieszkania i domy na sprzedaż... |
| manifest `name` | ...apartamenty nad Zalewem... | ...mieszkania i domy nad Zalewem... |
| `ItemList`, `RealEstateListing`, `BreadcrumbList` | Apartamenty / Wybierz dom | Mieszkania i domy |

Słowa kluczowe przestawione: prowadzą teraz „mieszkania i domy Głowno",
„mieszkania na sprzedaż Głowno", „domy na sprzedaż Głowno".

`robots.txt` i `proxy.ts` bez zmian - reguła indeksowania jest oparta o host,
nie o ścieżki. Sitemapa generuje się z `UNITS`, więc dwadzieścia nowych adresów
weszło do niej automatycznie (zweryfikowane: 20 wpisów `/mieszkania-i-domy/`).

Stare adresy `/lokal/...` zwracają 404 i **nie potrzebują przekierowania**:
nigdy nie były publiczne. Domena wciąż serwuje starego WordPressa, a alias
`*.vercel.app` chodzi z `X-Robots-Tag: noindex`, więc Google ich nie zna.

Nagłówek przy 1280 px wychodził 6 px poza kontener po wydłużeniu etykiety menu.
Ściągnięte odstępy między pozycjami (`gap-x-5`, pełne `gap-x-7` dopiero od
`2xl`); odstęp telefon - żółty przycisk został zachowany (`xl:mr-5`).

### Poster sekcji „Spacer 360"

Wcześniej stał tam render wygenerowany przez nas - ładny, ale pokazujący
architekturę, której w Plażowej nie ma. Zastąpiony **prawdziwym renderem
dewelopera** z plazowa-park.pl (`/wp-content/uploads/2026/04/01b.webp`, materiał
inwestora - nie zdjęcie osoby trzeciej, więc bez podpisu autorskiego).

Wybór z sześciu kandydatów, oceniany już pod nakładką sekcji
(`bg-abyss/55` + gradient), bo jasny render dzienny robi się pod nią szary.
Wygrał kadr wieczorny z podświetlonymi oknami i sosnowym lasem w tle.

Proporcja **1:1 zamiast 16:9**. Sekcja ma `min-h: 78-88svh`, więc przy szerokim
posterze `object-cover` skalował go na telefonie ponad dwukrotnie w górę -
next/image dobierał wariant 480 px na kadr wymagający ~990 px. Kwadrat
ogranicza to przycięcie. Dodatkowo `sizes="(max-width: 767px) 200vw, 100vw"`,
bo przy `100vw` przeglądarka liczy zapotrzebowanie z szerokości viewportu i
ignoruje pionowe skalowanie `object-cover`. Efekt: wariant 1024 px zamiast
480 px, poster 217 KB (poprzednio 384 KB).

### Znaleziona przy okazji nieprawda

W `lib/unitCopy.ts` została jedna deklaracja czasu dojazdu, której nie złapała
weryfikacja z 2026-08-23: „dojazdu do Łodzi w około **pół godziny**". Poprzedni
przegląd szukał wzorca „30 min", a nie zapisu słownego. Zastąpione odległością
(„w granicach 32 km"), zgodnie z ustaleniem z sekcji 10.

### Pomiary

Lighthouse, ten sam build, przed i po zmianach:

| | perf | a11y | best practices | SEO | LCP |
|---|---|---|---|---|---|
| mobile przed | 86 | 100 | 100 | 100 | 4,1 s |
| mobile po | **87** | 100 | 100 | 100 | 4,1 s |
| desktop przed | 99 | 100 | 100 | 100 | 0,9 s |
| desktop po | **99** | 100 | 100 | 100 | 0,9 s |

Uwaga do sekcji 5: podane tam „mobile 90" pochodziło z wersji na Fraunces.
Po powrocie do Inter Tight punktem odniesienia jest 86.

`gitleaks` zgłasza jedno trafienie - publiczny klucz Web3Forms w
`components/Contact.tsx`. To fałszywy alarm: na darmowym planie klucz musi
siedzieć w kodzie klienta, a Web3Forms sam opisuje go jako publiczny.

## 12. Uwagi klienta: "za czarna, nie robi wow" (2026-08-29)

### Co powiedział klient

Mail, dosłownie: *na osiedlu dołożyłbym parę drzew; pierwsza strona za czarna
i nie żyje, np. na Camarze jest ten las żywy i budynki też; poprawiłbym grafikę;
spacer jest tylko po osiedlu, a co z wnętrzem, był a nie mam; dom bym obejrzał
dookoła; strona ma pobudzać, nie gasić; układ ok, lecz czegoś jej brakuje.*
Do tego: możliwość przybliżania i obracania widoków oraz brak opisów w zakładkach
Standard i Okolica. Referencje: Aleja Drzew, Camar, LW Deweloper, PB Deweloper.

### Czego nauczyły referencje

Cztery wskazane serwisy zostały zmierzone, nie obejrzane. Najważniejsze
ustalenie jest kontrintuicyjne: **te strony wcale nie są jasne w warstwie
fotografii**. Klatka lasu z hero domywakacjach.pl ma średnią luminancję 71/255,
zdjęcie koron drzew na camar.pl 109/255. Żyją przez **nasycenie zieleni**
(48-81% pikseli o dominancie zielonej), **źródło światła widoczne w kadrze**
i **ludzi w scenie**, a nie przez podniesioną jasność.

Jasna jest natomiast cała reszta strony. Średnia luminancja całego dokumentu:
camar.pl 196, Aleja Drzew 210, lawinowa18 233. Nasza strona miała **140**,
przy 41,6% wierszy poniżej L=90. U żadnej z czterech referencji nie występują
naprzemienne pasma jasne i ciemne w środku strony - ciemność jest wyłącznie
klamrą na krańcach.

Żadna z czterech referencji nie ma obrotu 360, dollhouse'u ani zoomu rzutów.
To jedyne miejsce, w którym możemy być bezdyskusyjnie lepsi od wzoru.

### Materiał, którego nie mieliśmy, a leżał u dewelopera

Konfigurator SenseVR wystawia `invest_dollhouse/v2`: **120 klatek pełnego obrotu
wokół osiedla, w czterech porach doby, do 2048 px, z obrysem SVG każdego budynku
i punktem etykiety osobno dla każdej klatki**. Sześć identyfikatorów obrysów
(529-534) pokrywa się jeden do jednego z `stageId` w `units.ts`.

Do tego siedem nieużywanych renderów zmierzchowych i dwa wnętrza na
plazowa-park.pl oraz izometryczna mapka okolicy 2400x1792.

Czego **nie ma**: spaceru 360 po wnętrzach. Wersja v4, której używamy, ma 14 scen
i wszystkie są zewnętrzne - sceny nazwane "Lokal 1A" to dojścia i ogrody przy
lokalach. Wersje v2 i v5 zwracają puste manifesty. Klient pamięta spacer po
wnętrzu, ale u dewelopera go nie ma.

### Co zrobione

**Obrót wokół osiedla** (`scripts/dollhouse.mjs`, `components/estate/EstateMap.tsx`).
Statyczna klatka zastąpiona 40 klatkami (krok 9 stopni) z przeciąganiem myszą
i palcem oraz przyciskami obrotu. Obrysy budynków klikalne na każdej klatce.
Ścieżki SVG po kilkaset punktów uproszczone Douglasem-Peuckerem do ~15 punktów
na budynek: 600 KB schodzi do 35 KB. Klatka źródłowa jest kwadratem, w którym
osiedle zajmuje pas 30-88% wysokości, więc kadrujemy do 3:2 i tym samym
przekształceniem przeliczamy obrysy. Klatki doczytują się dopiero, gdy plan
wjeżdża w ekran - 1,8 MB nie obciąża pierwszego wejścia.

**Sześć kadrów budynków** (`scripts/osiedle-kadry.mjs`). Rysowane sylwetki
elewacji w sekcji Osiedle - płaskie, cztery z sześciu identyczne, bez ani
jednego drzewa - zastąpione realnymi kadrami z dollhouse'u. Dla każdego budynku
skrypt wybiera klatkę, na której jego obrys ma największą powierzchnię, i kadruje
z obrysu. Zmierzone: luminancja 111-149, zieleń 22-36%, w kadrach drzewa,
żywopłoty, samochody, meble ogrodowe i sylwetki ludzi.

**Galeria** (`components/Galeria.tsx`). Siedem wizualizacji dewelopera, w tym
wnętrze salonu. Cztery rendery podbite z 1024 px do 4K, bo w oryginale nie dało
się ich przybliżać. Duży kafel dostał najjaśniejszy kadr (salon, L=148), nie
najciemniejszy (elewacja frontowa, L=60).

**Zoom i przesuwanie** (`components/Lightbox.tsx`, `ZoomShots.tsx`). Kółko myszy,
szczypanie dwoma palcami, przeciąganie, podwójne kliknięcie, klawiatura.
Podpięte pod galerię i pod rzuty lokali. Rzuty przegenerowane z oryginałów
2048 px z przycięciem tła: było 571 px i 22 KB, jest 1500 px i ~50 KB.

**Tonalność.** Pasmo ciemne przestało być rytmem strony i stało się klamrą.
Życie i Deweloper zeszły na pasma piaskowe, pasek nawigacji po przewinięciu jest
jasny (u wszystkich czterech referencji jest biały), kafle rzutów zeszły
z granatu na piasek. Hero: dwie pełnoekranowe nakładki dające w strefie H1
ok. 90% krycia zastąpione scrimem ograniczonym do kolumny tekstu, czytelność
przeniesiona na cień tekstu. To samo w sekcji spaceru. Render hero podbity
w nasyceniu (zieleń 14,6% -> 17,7%) i dostał 26-sekundowy najazd Ken Burns.
Zimna mięta w drugiej linii H1 ustąpiła ciepłemu `sun` - stała na renderze
o dominancie złotej.

Wynik pomiaru tą samą metodą co referencje:

| | średnia luminancja | wiersze L<90 |
|---|---|---|
| przed | 140 | 41,6% |
| **po** | **175** | **19,7%** |
| Camar | 196 | 6,0% |
| Aleja Drzew | 210 | ok. 5% |

**Paleta.** Trzy poziomy ciemności były nierozróżnialne (kontrast 1,15:1 między
`abyss` a `deep`) - rozsunięte do 1,50:1. Akcent na jasnych pasmach miał wobec
tekstu kontrast 2,23:1, czyli wyróżnienia w nagłówkach były niewidoczne - nowy
`--color-lake-600 #1d7180`. `--color-sun` i `--color-hold` były tym samym
hexem, więc żółty znaczył naraz "kliknij" i "zajęte" - status rezerwacji zszedł
na `#a86b12`. Status "dostępny" nie spełniał 3:1 na piasku - `#1f7a4d`.
Doszły trzy tokeny zieleni (`pine`, `moss`), bo osiedle w lesie nie miało
w palecie ani jednego zielonego piksela.

**Opisy.** Standard dostał trzy akapity o technologii i materiałach plus render
elewacji; parametrów liczbowych (COP, Uw, grubości izolacji) świadomie nie
wpisujemy - nie ma ich w żadnym zweryfikowanym źródle, więc odsyłamy do prospektu.
Okolica dostała dwa akapity, cztery zweryfikowane odległości (Łódź 32 km,
węzeł A1 Stryków 11 km, stacja Głowno 3 km, Warszawa 104 km) i izometryczną
mapkę okolicy od dewelopera. Z listy POI zniknął duplikat "Plaża i kąpielisko",
scalony z wpisem o zalewie, a opisy urosły z 4-7 słów do 25-40.

**Naprawione przy okazji.** Klik w budynek w sekcji Osiedle scrollował do
`#lokale`, elementu o takim id na stronie nie ma - nic się nie działo.
Kropka statusu przy etykiecie budynku na planie była zawsze zielona, niezależnie
od dostępności. Legenda planu pokazywała status "Sprzedany", którego w danych
nie ma ani razu. `FINANCE_STEPS` leżały w `site.ts` i nie były renderowane -
teraz zamykają sekcję o deweloperze.

### Czego nie da się zrobić bez dewelopera

- **Spaceru 360 po wnętrzu nie ma.** Trzeba go zamówić albo poprosić o wersję,
  którą klient pamięta. Do tego czasu wnętrze pokazuje jeden render salonu.
- **Terminu oddania inwestycji nie ma nigdzie** - ani na stronie dewelopera, ani
  w konfiguratorze. To pierwsze pytanie kupującego i jedyny brak, który realnie
  blokuje decyzję. Do uzupełnienia po potwierdzeniu z biurem sprzedaży.
- **Renderów dziennych elewacji nie ma** - wszystkie siedem jest o zmierzchu.
  Referencje grają dniem; warto poprosić o te same kadry w świetle dziennym.
- **Ludzi w kadrach zewnętrznych nie ma.** U Camara w każdej scenie jest rodzina,
  dziecko, para na huśtawce. Nasze rendery są puste; sylwetki są tylko w kadrach
  z dollhouse'u.

### Nazewnictwo: koniec z "apartamentem" (decyzja z 2026-08-29)

Biuro nieruchomości promuje inwestycję jako **mieszkania i domy** i tak zostaje.
Przy okazji sprawdziłem, jakim słowem posługuje się sam klient na plazowa-park.pl:
**"mieszkanie" 12 razy, "dom" 9 razy, "apartament" 2 razy**. Tytuł jego strony to
"Luksusowe osiedle domów", pozycja w menu "Wybierz Dom", nagłówek "Wybierz swój
dom", a opisy cech konsekwentnie mówią "każde mieszkanie ma prywatne wejście".
"Apartament" był więc naszym słowem, nie jego - i do tego rozjeżdżał się
z tytułami stron, które od poprzedniej rundy mówią "Mieszkanie 3.3A".

Przyjęty rejestr, zgodny z tym, co klient robi u siebie:

| gdzie | słowo |
|---|---|
| kategoria, menu, adresy, tytuły stron | mieszkania i domy |
| nagłówki emocjonalne i CTA | dom ("Domy nad Zalewem Mrożyczka", "Wybierz swój dom") |
| pojedynczy lokal na kartach i podstronach | mieszkanie ("Mieszkanie 3.3A") |
| opisy cech i technologii | mieszkanie |
| teksty prawne | lokal (bez zmian, termin ustawowy) |

Podmiana objęła 78 wystąpień w 18 plikach, jawnymi parami zamiast regexem -
polska odmiana wymaga zgody przymiotników ("ten apartament" to "to mieszkanie",
"Wybrany apartament" to "Wybrane mieszkanie", "jeden z największych apartamentów"
to "jedno z największych mieszkań"). Uwaga na przyszłość: `grep apartament` nie
znajduje formy "apartamencie" - rdzeń to `apartamen`.

Przy okazji naprawione dwie rzeczy, które wychodziły z tej samej niespójności:
FAQ odsyłało do "sekcji Apartamenty", której na stronie nie ma (teraz "Mieszkania
i domy"), a polityka prywatności i regulamin opisywały pole formularza pod starą
nazwą. Nagłówek sekcji lokali przestał reklamować ograniczenie ("Dwadzieścia
apartamentów, sześć rzutów") i mówi teraz "Dwadzieścia domów, każdy z ogrodem".

### Ogród dostał wreszcie zdjęcie

Prywatny ogród 31-143 m² to argument, który uzasadnia różnicę ceny wobec zwykłego
mieszkania, powtarza się w tekście kilkanaście razy i nie miał ani jednego
obrazu - sekcja "Życie" pokazywała kadr budynku z opisem alternatywnym mówiącym
o tarasie i ogrodzie, czyli o czymś, czego na zdjęciu nie było. Zastąpiony
renderem ogrodu od dewelopera (trawnik, żywopłot, strefa wypoczynku
z paleniskiem, las w tle), podbitym do 4K.

### Pomiar końcowy

| | przed | po |
|---|---|---|
| średnia luminancja strony | 140 | **176** |
| wiersze L<90 | 41,6% | **18,9%** |
| piksele zielone | 3,8% | 6,0% |
| Lighthouse mobile / dostępność / SEO | 86 / 100 / 100 | 85 / 100 / 100 |

## 13. Audyt faktograficzny przed wysyłką do klienta (2026-08-29)

Weryfikacja każdego twierdzenia na wyrenderowanej stronie wobec źródeł: API
konfiguratora dewelopera, strona plazowa-park.pl, KRS, Biała Lista MF, VIES,
OSRM, OpenStreetMap, Overpass, uodo.gov.pl i portale nieruchomości.
Sprawdzono 141 twierdzeń w siedmiu obszarach.

### Co się potwierdziło

**Wszystkie 20 lokali co do znaku.** Cena, powierzchnia, liczba pokoi,
kondygnacje, cena za m², status sprzedaży i przypisanie do budynku zgadzają się
z API dewelopera dla każdego z dwudziestu lokali. Agregaty też: 20 lokali,
18 wolnych, 6 budynków, ceny 633 000-926 000 zł, metraże 82,05-133,03 m².
Cena za m² zgadza się również rachunkowo (cost / area).

**Dane rejestrowe.** KRS 0001031916, NIP 7331366052, REGON 525091200, nazwa,
forma prawna, adres siedziby i status VAT "Czynny" - potwierdzone w odpisie KRS
i w Białej Liście MF. Że deweloperem tej konkretnej inwestycji jest KS Prestige
Development, potwierdzają niezależnie rynekpierwotny.pl, noweinwestycje.pl
i tabelaofert.pl.

**Odległości.** 32 km do centrum Łodzi (OSRM: 32,4 km), 11 km do Strykowa
(11,4 km), 104 km do Warszawy (103,9 km) - wszystkie w normie zaokrąglenia.

### Co było nieprawdą i zostało poprawione

**Metraż ogrodu przy każdym z 20 lokali.** Liczby brały się z pola API
`total_area`, które w słowniku konfiguratora dewelopera znaczy **"Powierzchnia
całkowita"**, a nie powierzchnia ogrodu. Pole opisujące działkę (`land_area`,
"Powierzchnia działki") jest **puste dla wszystkich 20 lokali**, a sam deweloper
ma `total_area` wyłączone w swoim konfiguratorze (`total_area: {enabled: false}`).
Rozstrzygające: lokale o **identycznej** powierzchni mają `total_area` od 31
do 145 m² - powierzchnia całkowita identycznego układu nie może się różnić
4,7 raza, więc pole opisuje coś działkowego, ale pod nazwą, która tego nie mówi.
Metraż zdjęty z kart, modala, podstron, opisów i danych strukturalnych; zostało
jakościowe "prywatny ogród i taras", czyli dokładnie to, co pisze deweloper.
Do przywrócenia po jednym zdaniu potwierdzenia z biura sprzedaży.

**Stacja kolejowa Głowno: 3 km.** OSRM: 4,1 km drogą. Wszystkie pozostałe
odległości na stronie są drogowe, więc ta też musi być. Poprawione na 4 km.

**"Ponad 30 hektarów" zalewu.** Deweloper pisze "30-hektarowy zbiornik", a OSM
mierzy dla samego akwenu 28,1 ha. Słowo "ponad" usunięte w trzech miejscach.

**"32 km autostradą A1".** Sam dystans jest dobry, ale trasa go nie potwierdza:
OSRM prowadzi 28 z 32 km drogą krajową 14, autostrady nie dotyka. Rozdzielone
na dwa fakty: 32 km drogą krajową 14 do Łodzi, 11 km do Strykowa z węzłem A1/A2.

**Adres UODO.** Strona podawała ul. Stawki 2 - urząd od dawna urzęduje przy
ul. Stanisława Moniuszki 1A. Poprawione w polityce prywatności.

**Wewnętrzna notatka na trzech stronach prawnych.** Na końcu polityki cookies,
polityki prywatności i regulaminu wisiał akapit "Dokument ma charakter
informacyjny. Przed wdrożeniem produkcyjnym...". Usunięty ze wszystkich trzech.

**Martwa kotwica w stopce.** Przycisk "Wybierz swój dom" miał `href="#mieszkania-i-domy"`,
a ten element istnieje tylko na stronie głównej - na 24 podstronach klik nie robił nic.

**Polityka cookies opisywała mechanizmy, których nie ma.** Serwis nie ustawia
ani jednego cookie (zero nagłówków `Set-Cookie`), zgodę trzyma w pamięci lokalnej,
a analityka nie jest skonfigurowana. Dokument obiecywał cookies funkcjonalne
"zapamiętujące wybory w interaktywnej mapie" (nie istnieją) i instruował, jak
cofnąć zgodę przez czyszczenie cookies (nie zadziała - to localStorage).
Przepisany na stan faktyczny.

**Polityka nie wymieniała realnego procesora.** Formularz wysyła dane wprost
z przeglądarki do Web3Forms, poza EOG, wraz z adresem IP na potrzeby ochrony
antyspamowej. Dopisane, razem z dostawcą kafli satelitarnych (Esri).

**Twierdzenia bez pokrycia w danych strukturalnych.** `petsAllowed: true`
(nigdzie nie ma informacji o zwierzętach) i `datePosted: "2026-01-01"`
(zahardkodowane, identyczne dla 20 lokali) - usunięte. `vatID: "PL7331366052"`
usunięte, bo VIES zwraca dla tego numeru `isValid: false` - spółka jest czynnym
podatnikiem VAT krajowo, ale nie jest zarejestrowana do VAT-UE.

**Nadinterpretacje w opisach.** Sekcja Standard twierdziła m.in., że
"powierzchnia użytkowa jest w praktyce większa niż liczba w cenniku" (deweloper
mówi tylko, że poddasze nie wlicza się do metrażu), "bez grzejników" zamiast
źródłowego "bez widocznych grzejników", "blacha na rąbek stojący" zamiast
"blacha na rąbek", oraz przypisywała blachę do dachu, czego źródło nie mówi.
Warunek personalizacji zgubił kluczowy człon: u dewelopera dotyczy osób, które
kupują na etapie budowy. Generator opisów lokali podawał rekuperację jako źródło
ogrzewania (to wentylacja) i twierdził, że budynek 8 ma "dwa najbardziej
przestronne lokale w osiedlu", choć budynek 3 ma dokładnie takie same metraże.
"Unikalny w skali kraju" zespół wydm to według glowno.pl "unikalny w województwie
łódzkim". Central Wake Park sam nie nazywa się "jednym z największych".

Dodane: kapitał zakładowy 10 000 zł w danych rejestrowych (art. 206 KSH),
własny Open Graph dla trzech stron prawnych, stała data `lastmod` dla dokumentów
prawnych w sitemapie.

### Do potwierdzenia przez klienta

1. **Co oznacza `total_area` w konfiguratorze.** Jeśli to powierzchnia ogrodu,
   wracają metraże przy 20 lokalach - zmiana na pięć minut.
2. **Kto prowadzi serwis i jest administratorem danych.** Dokumenty prawne
   klienta na plazowa-park.pl wskazują **KS PRESTIGE Sp. z o.o. (NIP 7331362953,
   KRS 0000817877)**, a nasze - KS Prestige Development (NIP 7331366052).
   Obie spółki istnieją, są czynne i mają ten sam adres. Deweloperem inwestycji
   jest potwierdzony Development; kto odpowiada za stronę - do rozstrzygnięcia.
3. **Termin oddania: 4 kw. 2026.** Podają go rynekpierwotny.pl i noweinwestycje.pl,
   ale nie ma go ani na stronie dewelopera, ani w konfiguratorze. Po potwierdzeniu
   wchodzi na stronę - to pierwsze pytanie kupującego.
4. **Rozbieżność cen na portalach.** rynekpierwotny.pl podaje "od 603 000 zł"
   i maksimum 896 000 zł, konfigurator dewelopera 633 000-926 000 zł.
   Bierzemy dane z konfiguratora; portal wygląda na nieaktualny.
5. **Powierzchnia lokalu 2.2A: 92,72 m²** przy 92,74 m² dla trzech bliźniaczych
   lokali. Odwzorowujemy API wiernie, ale ta asymetria wygląda na literówkę
   po stronie dewelopera.
6. **Zgoda RODO jest w formularzu obowiązkowa**, a polityka opisuje ją jako
   jedną z podstaw i podaje przykład kontaktu marketingowego. Do rozstrzygnięcia
   z prawnikiem klienta.
7. **Sąd rejestrowy** do bloku danych rejestrowych (art. 206 KSH) - nie ma go
   w odpisie z API, więc nie wpisujemy go zgadując.
