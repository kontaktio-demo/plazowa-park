# Refactor: mniej strony, ta sama treść

Strona miała sześć reprezentacji tych samych dwudziestu lokali i cztery wejścia w ofertę.
Poniżej wszystko, co zniknęło z widoku, i miejsce, w którym ta sama informacja została.
Dane lokali (ceny, metraże, ogrody, statusy, liczba pokoi), dane rejestrowe, adresy i treści
prawne nie zmieniły się o znak.

## Co zniknęło i gdzie to jest

| usunięta informacja | gdzie ta sama informacja zostaje |
| --- | --- |
| pozycja menu "Osiedle" | sekcja Mieszkania i domy: plan osiedla z numerami budynków |
| pozycja menu "Cennik" | ta sama tabela, teraz w sekcji Mieszkania i domy |
| pozycja menu "Spacer 360" | sekcja spaceru zostaje na stronie, w kolejności pod ofertą |
| sekcja Osiedle: sześć kart grup budynków (kadr, liczba lokali, metraże, wolne, cena od) | plan osiedla w sekcji Mieszkania i domy (budynki, lokale, statusy) oraz kolumny Budynek, Powierzchnia, Cena i Status w zestawieniu |
| akapit "Osiedle to 16 mieszkań i 4 domy w 10 budynkach..." | lead sekcji Mieszkania i domy, skrócony do dwóch zdań |
| sekcja Cennik jako osobna sekcja | ta sama tabela, ten sam komplet 20 lokali, teraz w sekcji Mieszkania i domy |
| siatka kart lokali z rzutem parteru (6 + "Pokaż wszystkie") | wiersze zestawienia z tymi samymi danymi; rzut parteru i piętra na podstronie lokalu |
| okno lokalu (modal z rzutami i ceną) | podstrona lokalu: te same rzuty, cena, parametry, CTA |
| filtr budynków (7 chipów) | plan osiedla: klik w lokal prowadzi do jego wiersza w zestawieniu |
| sortowanie "Cena malejąco" i "Metraż od najmniejszego" | zostają "Cena rosnąco" i "Metraż malejąco"; kolumny w tabeli pokazują komplet danych |
| przycisk "Zapytaj" w każdym wierszu cennika i na kartach | CTA "Zapytaj o..." na podstronie lokalu, z prefillem formularza |
| liczniki "mieszkań dostępnych" i "domów dostępnych" osobno | pasek statystyk: dostępnych / wszystkich / cena od, plus kolumna Status przy każdym lokalu |
| sekcja Życie ("Nad wodą na co dzień") z trzema punktami | kameralność: lead sekcji Mieszkania i domy; las i woda: sekcja Okolica; ogród i taras: kafelek w sekcji Standard i kolumna Ogród w zestawieniu |
| Standard: dwa akapity o elewacji, prywatnym wejściu i wykończeniu | jeden akapit sekcji Standard (technologia, elewacja, wejście) |
| kafelki Rekuperacja, Fotowoltaika, Wykończenie pod klucz | linijka pod siatką: "Za dopłatą, na etapie budowy: rekuperacja, fotowoltaika, wykończenie pod klucz." |
| kafelki Materiały premium i Prywatne wejście | akapit sekcji Standard |
| Okolica: dwa akapity opisowe | lead sekcji Okolica (zalew, plaża, molo, kąpielisko, las, Central Wake Park, ścieżki) |
| Okolica: lista 6 atrakcji (POI) | ta sama lista na /lokalizacja |
| Okolica: mapa satelitarna z adresem i linkiem do Google Maps | mapa satelitarna na /lokalizacja; adres w stopce i na /lokalizacja |
| Deweloper: blok Dane rejestrowe (KRS, NIP, REGON, status VAT, kapitał) | stopka, sekcja z danymi rejestrowymi dewelopera i operatora |
| Deweloper: przyciski telefonu i "Umów spotkanie" | telefon w nagłówku, stopce i pasku mobilnym; formularz w sekcji Kontakt |
| proces zakupu w 5 krokach | trzy etapy z tymi samymi nazwami umów; pełny opis w FAQ "Jak wygląda proces zakupu?" |
| FAQ: ile mieszkań i domów liczy osiedle | lead sekcji Mieszkania i domy i pasek statystyk |
| FAQ: gdzie leży osiedle | sekcja Okolica, stopka (adres), podstrona /lokalizacja |
| FAQ: jak daleko do Łodzi, Strykowa i Warszawy | cztery dystanse w sekcji Okolica i na /lokalizacja |
| FAQ: co znajduje się w okolicy | lead sekcji Okolica, plan okolicy z punktami, /lokalizacja |
| FAQ: jaki jest standard i technologia | sekcja Standard: akapit, sześć kafelków i linijka o opcjach za dopłatą |
| podstrona lokalu: blok "O mieszkaniu/domu X" (5 akapitów z generatora) | tabela parametrów i blok "Co jeszcze warto wiedzieć" na tej samej podstronie; opis osiedla, standardu i okolicy na stronie głównej |
| podstrona lokalu: akapit podsumowujący pod parametrami | te same liczby w tabeli parametrów obok |
| podstrona lokalu: link "Lokalizacja osiedla i dojazd" w bloku opisowym | jedna linijka z adresem osiedla i linkiem na /lokalizacja |

## Runda 2: co zniknęło i gdzie to jest

| usunięta informacja | gdzie ta sama informacja zostaje |
| --- | --- |
| /lokalizacja: blok "Dlaczego warto zamieszkać nad Zalewem Mrożyczka" (3 akapity) | trzy bloki nad nim (Nad Zalewem Mrożyczka, Las i rekreacja, Dojazd do Łodzi i Warszawy) oraz lista "Co znajdziesz w okolicy" pod nim; Głowno i zaplecze także w bloku o dojeździe |

## Runda 2: decyzje warte zapamiętania

- Filtry i sortowanie siedzą w adresie (`?typ=`, `?dostepne=`, `?sort=`), czytane przez
  `useSyncExternalStore`, a nie efektem. Dzięki temu serwer renderuje widok domyślny
  (13 dostępnych, cena rosnąco) prosto w HTML, a link do widoku da się wysłać dalej.
- Domyślny filtr "tylko dostępne" chowa 7 lokali, więc w HTML strony głównej jest ich 13,
  a nie 20. Pełna dwudziestka zostaje w danych strukturalnych (ItemList) i w cenniku CSV.
- Sortowanie nagłówkiem kolumny daje też kombinacje spoza sześciu gotowych ustawień
  (np. ogród rosnąco). Menu pokazuje wtedy aktualny stan, a nie najbliższy preset.
- Nawigacja między lokalami chodzi po lokalach dostępnych; przy sprzedanym albo
  zarezerwowanym po pełnej dwudziestce, bo w krótszej liście taki lokal nie miałby miejsca.

## Znalezione i naprawione w QA

- Skok z nawigacji do sekcji zatrzymywał się 88 px za nisko: Lenis liczy pozycję elementu
  po swojemu i nie widzi `scroll-margin-top`. Skok liczy teraz tę samą wartość co CSS.
- Na podstronie sprzedanego lokalu komunikat składał się w "niedostępnye" (rodzaj gramatyczny
  doklejany po pełnym słowie).

## Runda 3 (domknięcie): co zamknięte, co zostaje

Zamknięte:

- Pełne SSR listy: w HTML strony głównej stoi dwadzieścia wierszy i dwadzieścia linków do podstron,
  filtr tylko je ukrywa (`display:none`, więc nie łapią tabulatora ani czytnika ekranu).
- `Contact.tsx` czyta `?lokal=` bez `setState` w efekcie; `npm run lint` jest czysty.
- Usunięte: `scripts/osiedle-kadry.mjs`, sześć kadrów `public/osiedle/b*.webp` (792 KB),
  nieużywany klucz `BLUR.zycie`, osiem niepotrzebnych `export` w `lib/` (knip).
- Dostępność: `nav` w nagłówku podstron dostał nazwę (`landmark-unique`), etykiety chipów i linków
  partnerów oraz Facebooka zgadzają się z widocznym tekstem (WCAG 2.5.3), pole zgody RODO ma
  `aria-required`. axe-core: 0 naruszeń na stronie głównej, podstronie lokalu i `/lokalizacja`.
- SEO: opisy meta lokali sprzedanych i zarezerwowanych nie obiecują już ceny ofertowej.

ZAMKNIĘTE DECYZJĄ WŁAŚCICIELA:

- **Kontrast tekstu pobocznego 4,32-4,38 zostaje bez zmian.** Dotyczyło `--color-ink-muted`
  (#746a5e na tle #efe9df) i `--color-clay-600` w 14 px; jedyna poprawka to przyciemnienie obu
  tokenów, czyli zmiana palety. Właściciel zdecydował, że paleta zostaje taka, jaka jest.
  Temat jest zamknięty i nie wracamy do niego. Skutek do wiadomości: Lighthouse na telefonie
  odejmuje za to kilka punktów w kategorii dostępności (97 zamiast 100), axe-core przechodzi
  bez naruszeń, reszta strony spełnia AA.

Zostaje otwarte (nic z tego nie blokuje wydania):

- `lib/data/units.ts` eksportuje `BUILDINGS`, `UnitStatus` i `Building`, których nikt nie importuje.
  Plik jest generowany przez `scripts/sync-units.mjs`, więc ręczne cięcie i tak wróciłoby nocą.
- Cztery skrypty w `scripts/` (`assets.mjs`, `hero-rodzina.mjs`, `ruch.mjs`, `tour-wnetrza.mjs`) nie są
  importowane przez aplikację: to narzędzia uruchamiane z ręki, które wytworzyły commitowane assety
  i raport ruchu z GA4. Zostają jako źródło tych plików.

Skreślone jako nieaktualne: notatka o tym, że Lighthouse łapie elementy w trakcie animacji wejścia
(artefakt pomiaru, nie stan strony) oraz o `docs/redesign-2026-08.md` (dziennik decyzji, nie
dokumentacja stanu). Żadne z dwóch nie wymaga pracy.

## Wykryte poza zakresem

- ZAMKNIĘTE: `components/Contact.tsx` czyta `?lokal=` przez `useSyncExternalStore`, a nie
  efektem. Reguła `react-hooks/set-state-in-effect` milczy, prefill działa jak wcześniej,
  a serwer nadal renderuje puste pole, więc hydracja się zgadza.
- JS: 88 KB z Marzipano ładowało się przy każdym wejściu na stronę, mimo że import był
  po kliknięciu. Przyczyną było trzymanie widoku spaceru w tym samym komponencie, co
  powłoka sekcji; rozdzielenie na `VirtualTour` + `TourStage` (next/dynamic) zdjęło to
  z pierwszego wejścia. Spacer po kliknięciu dociąga 196 KB.
- GSAP + ScrollTrigger (111 KB) obsługiwały jedną interpolację parallaxu w hero.
  Parallax liczy teraz jeden wiersz na zdarzeniu scrolla Lenis, a obie biblioteki
  wypadły z package.json. Efekt wizualnie ten sam (yPercent 8 na tym samym zakresie).
- "Zobacz też" sortuję po różnicy ceny (tak jak mówi główne zdanie polecenia), a zapowiedź
  nad listą brzmi "Zobacz dostępne w podobnej cenie", żeby nie obiecywać doboru po metrażu.
- ZAMKNIĘTE: `scripts/osiedle-kadry.mjs` i sześć kadrów `public/osiedle/b*.webp` (792 KB)
  usunięte. Nic ich nie wołało: ani kod, ani `package.json`, ani CI, ani dane strukturalne.
  Historyczny opis w `docs/redesign-2026-08.md` zostaje jako zapis tamtej decyzji.


## Wersja 2.1: układ sekcji oferty i ceny od per typ

Prawa kolumna przy planie osiedla miała przy 1440 px tylko trzy kafle i jedno zdanie, czyli
około 430 px treści na 773 px wysokości planu, a `justify-center` zbijało to w środek i zostawiała
dziurę u góry i u dołu. Teraz kolumna prowadzi przez sekcję od liczb, przez sposób czytania planu,
po sposób kontaktu:

- kafle 2x2 (dostępnych, wszystkich, mieszkania od, domy od) biorą od `lg` nadmiar wysokości
  na siebie (`grow`, `grid-rows-2`, sufit `max-h-96`), zamiast zostawiać go w odstępach,
- legenda statusów i "Powiększ plan" przeniesione spod planu do tej kolumny,
- na dole blok domykający: "Umów prezentację" na `#kontakt` i numer telefonu jako `tel:`,
  w stylach przycisków z hero (`btn-sun`, `btn-ghost`),
- wypełnienie kolumny przy 1440 px: 81% zamiast 56%, odstępy 73 px zamiast 171 px.

Proporcji gridu nie ruszam. Zmierzone przy 1440 i 1920 px: `55fr 45fr` daje odstępy 73 px
i wypełnienie 81%, `60fr 40fr` pogarsza to do 105 px i 75% (szerszy plan jest wyższy, więc
kolumna obok musi być wyższa), `50fr 50fr` poprawia do 54 px i 85%, ale kosztem mniejszego planu.
Plan zostaje w dotychczasowej wielkości.

Kafel "cena od" rozbity na "mieszkania od" i "domy od". Obie liczby liczone z lokali o statusie
W sprzedaży: mieszkania od 633 000 zł (Mieszkanie 2.2B, 9 wolnych), domy od 888 000 zł
(Dom 8.3B, 4 wolne). Gdy w grupie zabraknie wolnego lokalu, kafel pokazuje "Wszystkie sprzedane";
sprawdzone przy 360 px - tekst mieści się w kaflu, a oba kafle w rzędzie rosną razem (98 px),
więc układ się nie łamie. Kafel "od 633 000 zł" w hero zostaje: tam cena dotyczy całej inwestycji.

Poza prawą kolumną ruszona jedna rzecz: podpis pod planem pokazywał w stanie spoczynku to samo
zdanie co akapit instrukcji, który właśnie przeniósł się obok planu, więc oba były widoczne naraz.
Podpis jest teraz wyłącznie odczytem spod kursora i istnieje od `lg` w górę (na dotyku nie ma
najechania, a instrukcja stoi w kolumnie). Hotspoty, kliknięcia i sam plan bez zmian.
