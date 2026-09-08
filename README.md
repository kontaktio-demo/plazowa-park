# Plażowa Park - landing page inwestycji

Awwwards-grade, konwersyjny one-page dla inwestycji deweloperskiej **Plażowa Park** w Głownie
(20 mieszkań i domów w 6 budynkach, bezpośrednio przy Zalewie Mrożyczka). Celem strony jest maksymalizacja
konwersji (twarde CTA, lead capture, jawne ceny i statusy, interaktywna mapa osiedla) oraz dominacja
lokalnego SEO.

## Stack

- **Next.js 16 (App Router) + TypeScript**
- **Tailwind CSS v4** - design system (ciepła paleta: bursztyn, biel, beż; Space Grotesk + Inter)
- **GSAP + ScrollTrigger + Lenis** - scroll-driven storytelling, scrubowany obrót osiedla, reveals (z pełnym `prefers-reduced-motion`)
- **Marzipano** - spacery 360 po osiedlu i po wnętrzach lokali (materiał dewelopera)
- **sharp** - potok obrazów: kadry osiedla, plan obrotowy, placeholdery blur, obraz OG

## Sekcje

Hero · osiedle (obrotowy plan z klikalnymi budynkami) · eksplorator lokali (filtry, karty, modal
z rzutem) · **spacer 360 po wnętrzu i po osiedlu** · standard i technologia · życie · okolica
(plan 3D z punktami) · deweloper i finansowanie · FAQ · formularz kontaktowy · stopka.
Podstrony: lokalizacja, 20 stron lokali, polityka prywatności, polityka cookies, regulamin.
Baner cookie, JSON-LD, sitemap, robots.

## Dane

Dane lokali (metraż, cena, cena/m², liczba pokoi, status, rzuty) pochodzą z rzeczywistego konfiguratora
dewelopera (SenseVR / Qupto, investment 214) i są zapisane w [`lib/data/units.ts`](lib/data/units.ts).
Geometria interaktywnej mapy osiedla (obrysy i pozycje budynków) pochodzi z tego samego źródła
([`lib/data/estate-orbit.json`](lib/data/estate-orbit.json)). Treści i fakty: [`lib/data/site.ts`](lib/data/site.ts).

Od dewelopera pochodzą: obrotowy plan osiedla (`public/dollhouse`), kadry budynków
(`public/osiedle`), rzuty lokali (`public/unit-views`), mapka okolicy (`public/map`) i spacer 360.
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
| `pokaz_wszystkie` | rozwinięcie pełnej listy lokali | `sekcja`, `etykieta` |
| `view_lokal` | otwarcie lokalu | `unit`, `value`, `currency`, `status`, `zrodlo` (modal/strona) |
| `pobranie_rzutu` | pobranie rzutu PDF | `sekcja`, `etykieta`, `unit` |
| `book_viewing` | kliknięcie CTA (9 miejsc) | `sekcja`, `etykieta`, `unit` przy lokalu |
| `start_formularza` | pierwsze kliknięcie w pole formularza | brak |
| `blad_formularza` | walidacja zatrzymała wysyłkę | `etykieta` (lista pól) |
| `generate_lead` | wysłany formularz | `unit`, `value`, `currency` |
| `view_360` | start spaceru | `tryb` (wnetrze/osiedle), `typ` przy wnętrzu |
| `zmiana_ukladu` | przełączenie układu w spacerze | `typ` |
| `click_to_call` | kliknięcie w telefon | `phone` |
| `click_to_email` | kliknięcie w e-mail | `href` |
| `click_whatsapp` | kliknięcie w WhatsApp | `href` |

Do tego GA4 sam liczy `page_view` (także przy przejściach bez przeładowania strony),
`scroll`, `click` na linkach wychodzących i `file_download`.

Parametry są dobrane pod cztery pytania sprzedażowe:

1. **Gdzie ludzie odpadają.** `sekcja_widoczna` daje lejek od hero do formularza:
   dziesięć sekcji, każda raz na wejście. Wbudowany pomiar przewijania w GA4 zgłasza
   tylko próg 90%, co na tak długiej stronie nie mówi nic.
2. **Czego szukają.** `uzyj_filtra` pokazuje, czy klikają metraż, liczbę pokoi, czy od razu
   sortują po cenie rosnąco. To wprost mówi, co wyeksponować wyżej.
3. **Które lokale sprzedają.** `view_lokal` i `generate_lead` wysyłają **tę samą** nazwę
   lokalu, więc da się zestawić oglądalność z zapytaniami. Oba mają też `value` w złotych,
   więc GA4 sam policzy wartość obejrzanych i zapytanych mieszkań.
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
  (a) zamień stronę główną na statyczną „Inwestycja sprzedana" z danymi dewelopera i CTA do przyszłych
  projektów, albo (b) dodaj w `proxy.ts` przekierowanie 301 na stronę dewelopera. Sitemap
  i canonical zostaw do czasu deindeksacji.

## Uwagi

Ceny, metraże i statusy dostępności należy potwierdzić z biurem sprzedaży KS Prestige Development przed
publikacją produkcyjną. Materiały wizualne mają charakter poglądowy i nie stanowią oferty w rozumieniu
art. 66 Kodeksu cywilnego.
