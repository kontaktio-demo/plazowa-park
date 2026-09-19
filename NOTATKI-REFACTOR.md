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

## Wykryte poza zakresem

- `components/Contact.tsx`: reguła `react-hooks/set-state-in-effect` zgłasza błąd przy odczycie
  `?lokal=` z adresu. Błąd jest starszy niż ten refactor, a naprawa wymaga zmiany sposobu
  prefillu (ryzyko rozjazdu hydracji), więc zostaje na osobne zadanie.
- JS: 88 KB z Marzipano ładowało się przy każdym wejściu na stronę, mimo że import był
  po kliknięciu. Przyczyną było trzymanie widoku spaceru w tym samym komponencie, co
  powłoka sekcji; rozdzielenie na `VirtualTour` + `TourStage` (next/dynamic) zdjęło to
  z pierwszego wejścia. Spacer po kliknięciu dociąga 196 KB.
- GSAP + ScrollTrigger (111 KB) obsługiwały jedną interpolację parallaxu w hero.
  Parallax liczy teraz jeden wiersz na zdarzeniu scrolla Lenis, a obie biblioteki
  wypadły z package.json. Efekt wizualnie ten sam (yPercent 8 na tym samym zakresie).
- "Zobacz też" sortuję po różnicy ceny (tak jak mówi główne zdanie polecenia), a zapowiedź
  nad listą brzmi "Zobacz dostępne w podobnej cenie", żeby nie obiecywać doboru po metrażu.
- `scripts/osiedle-kadry.mjs` generuje kadry budynków (`public/osiedle/b*.webp`), których po
  usunięciu sekcji Osiedle nikt nie renderuje. Pliki i skrypt zostają w repozytorium zgodnie
  z ustaleniem, że kasujemy render, nie assety.
