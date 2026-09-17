# Plażowa Park - landing page inwestycji

Awwwards-grade, konwersyjny one-page dla inwestycji deweloperskiej **Plażowa Park** w Głownie
(16 mieszkań i 4 domy w 10 budynkach, bezpośrednio przy Zalewie Mrożyczka). Celem strony jest maksymalizacja
konwersji (twarde CTA, lead capture, jawne ceny i statusy, klikalny plan osiedla) oraz dominacja
lokalnego SEO.

## Stack

- **Next.js 16 (App Router) + TypeScript**
- **Tailwind CSS v4** - design system (ciepła paleta: bursztyn, biel, beż; Space Grotesk + Inter)
- **GSAP + ScrollTrigger + Lenis** - scroll-driven storytelling, reveals (z pełnym `prefers-reduced-motion`)
- **Marzipano** - spacery 360 po osiedlu i po wnętrzach lokali (materiał dewelopera)
- **sharp** - potok obrazów: kadry osiedla, plan osiedla, placeholdery blur, obraz OG

## Sekcje

Hero · osiedle (kadry budynków) · eksplorator lokali (plan zagospodarowania z klikalnym każdym
mieszkaniem i domem, filtry mieszkania/domy, karty, modal z rzutem parteru i piętra) · **cennik wszystkich lokali** · **spacer 360 po wnętrzu
i po osiedlu** · standard i technologia · życie · okolica (plan 3D z punktami) · deweloper, proces
zakupu i partnerzy · FAQ · formularz kontaktowy · stopka.
Podstrony: lokalizacja, 20 stron lokali, polityka prywatności, polityka cookies, regulamin.
Baner cookie, JSON-LD, sitemap, robots.

## Dane

Dane lokali (metraż, cena, cena/m², liczba pokoi, status, rzuty) pochodzą z rzeczywistego konfiguratora
dewelopera (SenseVR / Qupto, investment 214) i są zapisane w [`lib/data/units.ts`](lib/data/units.ts).
Treści i fakty: [`lib/data/site.ts`](lib/data/site.ts).

Numerację budynków rozstrzyga plan zagospodarowania terenu od dewelopera (oryginał
w `.pzt-src/`): dziesięć budynków po dwa lokale, a numer lokalu `5.2A` to "lokal 2A" w budynku 5. Położenie każdego lokalu na planie i numer
jego ogródka są w [`lib/data/plan.ts`](lib/data/plan.ts); metraże ogródków z planu zgadzają się
z polem `garden` z konfiguratora. Konfigurator grupuje budynki w sześć etapów ("1 i 2", "3", ...),
dlatego filtr na stronie mówi "Budynki 1 i 2".

Plan na stronie (`public/osiedle/plan-osiedla.webp`) to ilustracja PZT wygenerowana w Higgsfield
(GPT Image 2.5) z zachowaną geometrią oryginału, sprawdzoną nałożeniem obrysów lokali. Podpisy
(budynki, lokale, ogródki z metrażami, śmietniki, wjazd) nie pochodzą z modelu, tylko z danych:
składa je [`scripts/plan-osiedla.py`](scripts/plan-osiedla.py).

Podział na 16 mieszkań i 4 domy wyprowadza `unitKind()` w [`lib/unitType.ts`](lib/unitType.ts):
domy to lokale z budynków środkowych (segment 3), czyli 3.3A, 3.3B, 8.3A i 8.3B. Konfigurator
dewelopera oznacza wszystkie dwadzieścia lokali jednakowo jako `flat`, więc rodzaju nie da się
z niego odczytać.

Od dewelopera pochodzą: plan zagospodarowania osiedla, kadry budynków
(`public/osiedle`), mapka okolicy (`public/map`) i spacer 360. Rzuty obu kondygnacji
(`public/rzuty`) oraz wykazy pomieszczeń z metrażami ([`lib/data/rzuty.ts`](lib/data/rzuty.ts))
buduje [`scripts/rzuty.py`](scripts/rzuty.py) z PDF-ów rzutów dewelopera: sześć typów rzutu
obsługuje wszystkie dwadzieścia lokali. Suma pomieszczeń każdego typu zgadza się co do setnej
z metrażem z `units.ts`. Logo osiedla w [`components/Logo.tsx`](components/Logo.tsx) to wektor
odtworzony z oryginału (`public/brand/logo-orig.png`), a grafikę Open Graph składa
[`scripts/og.py`](scripts/og.py).
Trzy kadry powstały z jego renderów użytych jako referencja obrazu, bo deweloper ma wyłącznie
zmierzchowe ujęcia bez zieleni i bez ludzi: `renders/hero.webp`, `renders/zycie.webp` oraz
`galeria/taras-ogrod.webp`. Mają charakter poglądowy, co mówi klauzula w stopce i regulamin.

## Uruchomienie

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

### Formularz leadów

Formularz wysyła zgłoszenie **prosto z przeglądarki** do **Web3Forms**, który przekazuje je
na skrzynkę biura sprzedaży. Nie ma własnego endpointu po stronie serwera - katalog `app/api`
nie istnieje. Klucz dostępu jest z założenia publiczny (Web3Forms podaje go we własnych
przykładach po stronie klienta), więc siedzi w kodzie i **przepięcie domeny nie wymaga żadnej
zmiennej środowiskowej**. Odbiorcę, ochronę antyspamową i autorespondera ustawia się w panelu
Web3Forms.

Po stronie strony zostaje honeypot, walidacja pól i wymagana zgoda RODO. Nie ma limitu zgłoszeń
na adres IP ani drugiej kopii leada w logach serwera - jedynym rejestrem jest panel Web3Forms.

Opcjonalne zmienne:

```
WEB3FORMS_KEY=...               # nadpisuje klucz w kodzie (rotacja)
NEXT_PUBLIC_GA_ID=G-XXXXXXX     # GA4 - bez tego analityka jest wyłączona
GOOGLE_SITE_VERIFICATION=...    # niepotrzebne: domena zweryfikowana rekordem TXT w DNS
```

**Uwaga:** klucz Web3Forms jest ograniczony do domeny docelowej, więc pełny test
formularza ma sens dopiero po przepięciu `plazowa-park.pl`.

### Analityka

W Vercelu na środowisku Production ustawione jest `NEXT_PUBLIC_GA_ID = G-B5EDBZ8H7S`.
To usługa GA4 Plażowa Park, strumień `plazowa`, identyfikator strumienia 15736305615.

Zmienna jest wkompilowywana przy budowaniu, więc **po każdej jej zmianie trzeba przebudować**
deploy. Samo zapisanie wartości w panelu nic nie daje.

#### Dwa narzędzia, dwie różne bramki

| narzędzie | kiedy działa | co daje |
| --- | --- | --- |
| Google Analytics 4 | dopiero po kliknięciu "Akceptuję" | pełne zachowanie: sekcje, filtry, lokale, leady |
| analityka Vercel | zawsze | ilu ludzi weszło, skąd i na jakie podstrony |

Podział wynika z prawa, nie z wygody. Zgody wymaga zapis lub odczyt na urządzeniu
użytkownika, a Google Analytics zapisuje pliki cookie. Analityka Vercel nie zapisuje
ani nie odczytuje niczego: ani cookie, ani pamięci lokalnej. Dlatego liczy cały ruch
i to ona podaje **mianownik**: bez niej niska liczba użytkowników w GA4 jest nie do
odróżnienia od małego ruchu. Iloraz obu liczb to odsetek zgód.

Obie polityki (cookies i prywatności) opisują ten podział wprost.

#### Kolejka zdarzeń

Skrypt Google ładuje się asynchronicznie i dopiero po zgodzie, więc zdarzenia z pierwszych
sekund wizyty trafiały wcześniej w niezdefiniowane `gtag` i ginęły - w tym `view_lokal`
przy wejściu wprost na stronę lokalu, czyli dokładnie ten ruch, który przychodzi z Google.
`lib/track.ts` trzyma je w kolejce (do 60 sztuk) i wysyła, gdy analityka wstanie.

Dotyczy to też decyzji o cookies: wszystko, co odwiedzający zrobił, zanim kliknął
"Akceptuję", zostaje wysłane po kliknięciu. Zweryfikowane w przeglądarce - przewinięcie
czterech sekcji przed zgodą dało po zgodzie cztery zdarzenia `sekcja_widoczna`.

#### Zdarzenia wysyłane do GA4

| zdarzenie | kiedy | parametry |
| --- | --- | --- |
| `sekcja_widoczna` | odwiedzający dotarł do sekcji (raz na wejście) | `sekcja` |
| `uzyj_filtra` | filtr, budynek lub sortowanie na liście lokali | `sekcja`, `etykieta` |
| `klik_plan` | kliknięcie mieszkania albo domu na planie osiedla (otwiera szczegóły) | `sekcja`, `etykieta`, `unit` |
| `pokaz_wszystkie` | rozwinięcie pełnej listy lokali | `sekcja`, `etykieta` |
| `view_lokal` | otwarcie lokalu | `unit`, `value`, `currency`, `status`, `zrodlo` (modal/strona) |
| `pobranie_rzutu` | pobranie rzutu PDF | `sekcja`, `etykieta`, `unit` |
| `book_viewing` | kliknięcie CTA prowadzącego do listy lokali albo do formularza | `sekcja`, `etykieta`, `unit` przy lokalu |
| `start_formularza` | pierwsze kliknięcie w pole formularza | brak |
| `blad_formularza` | walidacja zatrzymała wysyłkę | `etykieta` (lista pól) |
| `generate_lead` | wysłany formularz | `unit`; `value` i `currency` tylko przy wskazanym lokalu |
| `view_360` | start spaceru | `tryb` (wnetrze/osiedle), `typ` przy wnętrzu |
| `zmiana_ukladu` | przełączenie układu w spacerze | `typ` |
| `click_to_call` | kliknięcie w telefon | `phone` |
| `click_to_email` | kliknięcie w e-mail | `sekcja` |
| `klik_facebook` | kliknięcie w profil osiedla | `sekcja`, `etykieta` |
| `klik_partner` | kliknięcie w partnera (MWW, CBG) | `sekcja`, `etykieta` |

Wartości `sekcja` przy `book_viewing`: nawigacja, menu-mobilne, hero, karta-lokalu, modal-lokalu,
cennik, pasek-mobilny, deweloper, strona-lokalu, strona-lokalizacja.

Linku do WhatsAppa nie ma na stronie ani jednego, więc nie ma też czego szukać w GA4. Gdyby kiedyś
powstał, obsługę kliknięcia trzeba dodać od nowa.

Do tego GA4 sam liczy `page_view` (także przy przejściach bez przeładowania strony),
`scroll`, `click` na linkach wychodzących i `file_download`.

Parametry są dobrane pod cztery pytania sprzedażowe:

1. **Gdzie ludzie odpadają.** `sekcja_widoczna` daje lejek od hero do formularza:
   jedenaście sekcji (od 16 września 2026 doszedł cennik), każda raz na wejście. Wbudowany pomiar przewijania w GA4 zgłasza
   tylko próg 90%, co na tak długiej stronie nie mówi nic.
2. **Czego szukają.** `uzyj_filtra` pokazuje, czy klikają metraż, liczbę pokoi, czy od razu
   sortują po cenie rosnąco. To wprost mówi, co wyeksponować wyżej.
3. **Które lokale sprzedają.** `view_lokal` i `generate_lead` wysyłają **tę samą** nazwę
   lokalu, więc da się zestawić oglądalność z zapytaniami. Oba mają też `value` w złotych,
   więc GA4 sam policzy wartość obejrzanych i zapytanych mieszkań. Zgłoszenie bez wskazanego lokalu
   nie ma czego wycenić, więc idzie bez `value`.
4. **Czy formularz nie odstrasza.** `start_formularza` minus `generate_lead` to porzucenia,
   a `blad_formularza` mówi, na którym polu ludzie się zacinają.

`value` i `currency` to standardowe pola GA4, więc kwoty widać bez konfigurowania
własnych metryk. `anonymize_ip` zostało usunięte: w GA4 nie robi nic (adres IP jest
skracany zawsze), a doklejało się jako parametr do każdego zdarzenia.

#### Co trzeba ustawić w panelu GA4

Parametry własne nie pojawią się w raportach, dopóki nie zostaną zarejestrowane jako
wymiary niestandardowe (Administracja -> Definicje niestandardowe -> Wymiary
niestandardowe, zakres **Zdarzenie**). Wystarczy pięć, bo zdarzenia celowo używają
tych samych nazw parametrów:

| nazwa wymiaru | parametr |
| --- | --- |
| Sekcja | `sekcja` |
| Etykieta | `etykieta` |
| Lokal | `unit` |
| Zrodlo | `zrodlo` |
| Typ lokalu | `typ` |

Pozostałe do zrobienia raz, w panelu:

- **Kluczowe zdarzenia**: `generate_lead` i `click_to_call` - to one odpowiadają realnemu
  kontaktowi z biurem sprzedaży.
- **Przechowywanie danych**: Administracja -> Zbieranie i modyfikowanie danych ->
  Przechowywanie danych -> **14 miesięcy**. Domyślne 2 miesiące ucinają porównanie
  rok do roku. Wydłużenie działa wstecz.
- **Ruch wewnętrzny**: filtry danych w GA4 **nie działają wstecz**, więc własne wizyty
  policzą się jako ruch, dopóki filtr nie powstanie. Przy kilkudziesięciu wejściach
  miesięcznie to przekłamuje wszystko.

#### Odczyt statystyk z linii polecen

GA4 nie ma konektora, wiec `scripts/ruch.mjs` odpytuje Data API i drukuje podsumowanie:
zrodla ruchu, najczesciej ogladane strony, zdarzenia, ogladane mieszkania, ktore CTA klikane,
uruchomienia spaceru i urzadzenia.

Konfiguracja jednorazowa (opisana tez w naglowku skryptu):

1. Google Cloud Console - wlacz **Google Analytics Data API**
2. utworz konto uslugowe i pobierz klucz JSON
3. w GA4: Administracja -> Zarzadzanie dostepem do uslugi -> dodaj adres konta uslugowego
   jako **Czytelnik**
4. zapisz klucz jako `.ga-key.json` w katalogu projektu (jest w `.gitignore`)

```bash
GA_PROPERTY_ID=123456789 node scripts/ruch.mjs      # ostatnie 28 dni
GA_PROPERTY_ID=123456789 node scripts/ruch.mjs 7    # ostatnie 7 dni
```

Identyfikator uslugi (nie mylic z identyfikatorem pomiaru `G-...`) jest w GA4:
Administracja -> Szczegoly uslugi.

Weryfikacja w Search Console idzie przez rekord TXT w DNS domeny, a nie przez zmienną
środowiskową, dlatego `GOOGLE_SITE_VERIFICATION` nie jest potrzebne.


## Ceny dla dane.gov.pl

Deweloper ma obowiązek publikować ceny lokali na własnej stronie i raz na dobę przekazywać te same
dane ministrowi do spraw informatyzacji, który wystawia je na dane.gov.pl. Strona robi obie rzeczy sama.

| adres | co zwraca |
| --- | --- |
| `/ceny-ofertowe.csv` | dzisiejszy cennik, 58 kolumn wzorcowego pliku Ministerstwa Cyfryzacji |
| `/ceny-ofertowe/...-2026-09-16.csv` | ten sam cennik według stanu na wskazany dzień |
| `/dane-gov.xml` | manifest dla harvestera portalu: jeden zasób na każdą dobę |
| `/dane-gov.md5` | suma kontrolna manifestu, wymagana przy imporcie automatycznym |

Wszystkie cztery trasy odpowiadają z nagłówkiem `X-Robots-Tag: noindex` (reguła w `next.config.ts`).
Pliki zostają w pełni dostępne, bo noindex nie blokuje pobierania i harvester portalu bierze je dalej,
ale surowy CSV nie wchodzi do wyników wyszukiwania. Bez tego w indeksie narosłoby do tysiąca prawie
identycznych plików: trasa dzienna tworzy nowy adres każdej doby, a dane.gov.pl publicznie linkuje każdy z nich.

Wszystko liczy [`lib/cennik.ts`](lib/cennik.ts) z `lib/data/units.ts` i
[`lib/data/historia-cen.json`](lib/data/historia-cen.json). Trasy z cennikiem mają
`revalidate = 3600`, bo odpowiedź zależy od bieżącej daty i musi przeskoczyć na nowy dzień zaraz
po północy, a nie po dobie. Manifest i jego suma kontrolna są bez cache: hash musi opisywać
dokładnie te bajty, które portal właśnie pobrał, a przy osobnych oknach cache mogłyby pochodzić
z dwóch różnych dób i import by nie przeszedł.

Manifest wystawia jeden zasób na dobę, a nie jeden plik aktualizowany codziennie. Tak rekomenduje
Ministerstwo Cyfryzacji i tak wygląda jego wzorcowy XML. Zbiory deweloperów z jednym zasobem, które
sprawdziliśmy w portalu, to porzucone jednorazowe wrzutki; te działające codziennie mają po kilkaset
zasobów. Lista dni jest ograniczona do 1000 pozycji, bo tyle rekomenduje ministerstwo dla jednego
pliku. Zasoby, które wypadną z manifestu, portal **usuwa**, więc przed 12 czerwca 2029 trzeba
wystąpić o drugie źródło danych, inaczej najstarsze dni znikną z portalu.

### Skąd się bierze historia cen

Konfigurator dewelopera nie przechowuje historii (`price_history_count` = 0 dla każdego z dwudziestu
lokali), a przepis wymaga publikowania zmiany ceny z datą i bez kasowania wcześniejszych informacji.
Historię prowadzimy więc u siebie: plik startuje cenami z 16 września 2026, a `scripts/sync-units.mjs`
dopisuje każdą kolejną zmianę z datą dnia, w którym API dewelopera podało inną kwotę. Skrypt jest
idempotentny: dwa przebiegi tego samego dnia bez zmian w API nie ruszają pliku. Ceny sprzed
16 września 2026, o ile się zmieniały, może dostarczyć wyłącznie deweloper.

`.github/workflows/ceny.yml` uruchamia synchronizację codziennie o 04:30 UTC (05:30 czasu polskiego
zimą, 06:30 latem) oraz ręcznie. Jeśli cokolwiek się zmieniło, robot commituje `lib/data/units.ts`
i `lib/data/historia-cen.json` na `main`, a push wywołuje deploy na Vercelu. Cennik na stronie
i pliki dla portalu nadążają za panelem dewelopera bez ręcznej pracy.

### Co musi zrobić człowiek

Portal nie wykryje plików sam. Trzeba raz wysłać maila na **kontakt@dane.gov.pl** z konta, które jest
edytorem profilu dostawcy (KS Prestige Development, instytucja 4908 na dane.gov.pl), i podać:

- imię i nazwisko oraz służbowy adres e-mail osoby z uprawnieniami edytora
- adres pliku XML: `https://plazowa-park.pl/dane-gov.xml`
- adres pliku MD5: `https://plazowa-park.pl/dane-gov.md5`
- częstotliwość pobierania: **codziennie**

Innej drogi nie ma i to jest sprawdzone, nie założone. Publiczne API portalu
(`https://api.dane.gov.pl/spec`) ma wyłącznie metody GET, bez uwierzytelniania; `POST /1.4/datasets`
zwraca 405, a CKAN nie istnieje. Baza wiedzy ministerstwa odpowiada na to pytanie wprost: zasilanie
idzie przez panel administracyjny albo przez cykliczny import z zewnętrznego źródła, a samo źródło
tworzy wyłącznie administrator portalu po zgłoszeniu mailem. Ustawa też nie przewiduje odrębnego
kanału: art. 19b odsyła po prostu do portalu danych.

Profil istnieje od 1 października 2025 i ma dziś zero zbiorów danych oraz zero źródeł XML, czyli dane
nie płyną. Po uruchomieniu źródła portal codziennie sam pobiera manifest, sprawdza sumę kontrolną
i zakłada nowy zasób z cennikiem na dany dzień. Nikt się nie loguje i nikt niczego nie klika.

Człowiek będzie potrzebny jeszcze dwa razy, oba terminy odległe i przewidywalne: przed czerwcem 2029
wniosek o drugie źródło danych (limit 1000 zasobów) oraz po zakończeniu sprzedaży obowiązkowy mail
o dezaktywację źródła.

### Czego brakuje w danych

Kolumny, których deweloper nie podał, wychodzą w CSV jako znak umowny `X` - tak każe instrukcja
portalu, pustych komórek zostawiać nie wolno. Do uzupełnienia przez dewelopera:

- adres lokalu, w którym prowadzona jest sprzedaż, i dodatkowe lokalizacje sprzedaży
- rodzaj, oznaczenie i ceny części nieruchomości, na przykład miejsc postojowych
- pomieszczenia przynależne i ich ceny
- prawa niezbędne do korzystania z lokalu i ich wartość
- inne świadczenia pieniężne na rzecz dewelopera
- adres strony, pod którym dostępny jest prospekt informacyjny
- data rozpoczęcia sprzedaży, bo od niej zależy, od kiedy obowiązek biegnie

### Terminy

Od 11 listopada 2026 dane trzeba przekazywać w formie dokumentu elektronicznego zgodnego ze strukturą,
którą ma określić rozporządzenie ministra do spraw informatyzacji. Rozporządzenia ani wzorcowych
dokumentów elektronicznych jeszcze nie ma. Do tego czasu obowiązuje układ CSV i XML opisany wyżej,
a po ogłoszeniu struktury trzeba będzie przerobić `lib/cennik.ts`.

## SEO i wygaszanie

- **Domena docelowa**: `https://plazowa-park.pl` (stała w `lib/data/site.ts`). Indeksowanie jest
  na białej liście: `proxy.ts` przepuszcza wyłącznie `plazowa-park.pl` i `www`, a każdy inny host
  (alias produkcyjny `*.vercel.app`, deploye preview, gołe IP) dostaje `X-Robots-Tag: noindex, nofollow`.
  Canonical zawsze wskazuje domenę docelową.
- **Google Search Console**: domena jest zweryfikowana rekordem TXT w DNS, więc zmienna
  `GOOGLE_SITE_VERIFICATION` nie jest potrzebna. Po zmianach w strukturze warto zgłosić
  `https://plazowa-park.pl/sitemap.xml` ponownie.
- **Przekierowania po starej stronie**: `next.config.ts` przekierowuje adresy poprzedniego
  WordPressa (`/privacy-policy`, `/strona-glowna`, `/global-styles`, `/feed`, `/comments/feed`).
- **Strona lokalizacji**: `/lokalizacja` - dedykowany, indeksowalny URL pod long-tail (Zalew Mrożyczka,
  Central Wake Park, dojazd do Łodzi / ŁKA), linkowany z sekcji Okolica i z podstron lokali.
- **Status lokali**: zmiana pola `status` w `lib/data/units.ts` (`available` / `reserved` / `sold`)
  automatycznie aktualizuje UI oraz `availability` w schema.org (`InStock` / `PreOrder` / `SoldOut`).
  URL-e lokali zostają - nie usuwaj ich, aby nie tworzyć soft 404.
- **Wygaszanie po sprzedaży** (przygotować, nie aktywować): gdy wszystkie lokale są sprzedane, albo
  (a) zamień stronę główną na statyczną "Inwestycja sprzedana" z danymi dewelopera i CTA do przyszłych
  projektów, albo (b) dodaj w `proxy.ts` przekierowanie 301 na stronę dewelopera. Sitemap
  i canonical zostaw do czasu deindeksacji.

## Uwagi

Ceny, metraże i statusy dostępności należy potwierdzić z biurem sprzedaży KS Prestige Development przed
publikacją produkcyjną. Materiały wizualne mają charakter poglądowy i nie stanowią oferty w rozumieniu
art. 66 Kodeksu cywilnego.
