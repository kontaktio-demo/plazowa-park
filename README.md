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

Skrypt GA ładuje się **wyłącznie po zgodzie na cookies** (`lib/consent.ts`). Kto wybierze
"Tylko niezbędne", nie zostanie policzony. Jest to zamierzone i wymagane przez politykę cookies
tej strony, więc liczby w GA będą niższe niż realny ruch.

Zweryfikowane na produkcji 8 września 2026:

| test | wynik |
| --- | --- |
| przed decyzją o cookies | zero zapytań do Google |
| po "Akceptuję" | ładuje się `gtag/js?id=G-B5EDBZ8H7S`, hit `page_view` przyjęty (204) |
| zdarzenia własne | `book_viewing` i `click_to_call` trafiają do dataLayer i na serwer |
| po "Tylko niezbędne" | brak skryptu, `gtag` niezdefiniowany, zero zapytań |

Weryfikacja w Search Console idzie przez rekord TXT w DNS domeny, a nie przez zmienną
środowiskową, dlatego `GOOGLE_SITE_VERIFICATION` nie jest potrzebne.

#### Analityka Vercel

Obok GA4 działa bezcookiowa analityka Vercela (`@vercel/analytics`), ładowana za tą samą
bramką zgody. Powód jest praktyczny: jej dane są dostępne przez API, więc statystyki ruchu
można odpytywać bez logowania się do panelu GA.

**Wymaga jednorazowego włączenia w panelu Vercela** (zakładka Analytics w projekcie). Do tego
czasu skrypt się ładuje, ale dane nie są zbierane.

Narzędzie jest ujawnione w polityce prywatności i w polityce cookies jako drugi podmiot
przetwarzający dane statystyczne.

Zdarzenia wysyłane do GA4 (wszystkie dopiero po zgodzie na statystyki):

| zdarzenie | kiedy | parametry |
| --- | --- | --- |
| `generate_lead` | wysłany formularz | `unit` |
| `book_viewing` | kliknięcie CTA (9 miejsc) | `sekcja`, `etykieta` |
| `view_lokal` | otwarcie lokalu | `unit`, `price`, `status`, `zrodlo` (modal/strona) |
| `view_360` | start spaceru | `tryb` (wnetrze/osiedle), `typ` |
| `zmiana_ukladu` | przełączenie układu w spacerze | `typ` |
| `click_to_call` | kliknięcie w telefon | `phone` |
| `click_to_email` | kliknięcie w e-mail | `href` |
| `click_whatsapp` | kliknięcie w WhatsApp | `href` |

IP jest anonimizowane. W GA4 warto oznaczyć `generate_lead` i `click_to_call` jako
kluczowe zdarzenia - to one odpowiadają realnemu kontaktowi z biurem sprzedaży.

Parametry są dobrane pod jedno pytanie: **gdzie tracimy ludzi**. `sekcja` mówi, które
z dziewięciu CTA realnie konwertuje, `zrodlo` rozdziela oglądanie lokalu w modalu od
wejścia na jego stronę (większość ruchu idzie przez modal), a `tryb` przy spacerze pokazuje,
czy ktokolwiek korzysta ze spaceru po wnętrzu, za który klient zapłacił osobno.

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
