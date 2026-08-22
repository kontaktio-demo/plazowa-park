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
