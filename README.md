# Plażowa Park - landing page inwestycji

Awwwards-grade, konwersyjny one-page dla inwestycji deweloperskiej **Plażowa Park** w Głownie
(20 apartamentów w 6 budynkach, bezpośrednio przy Zalewie Mrożyczka). Celem strony jest maksymalizacja
konwersji (twarde CTA, lead capture, jawne ceny i statusy, interaktywna mapa osiedla) oraz dominacja
lokalnego SEO.

## Stack

- **Next.js 16 (App Router) + TypeScript**
- **Tailwind CSS v4** - design system (pine / limestone / brass, Inter Tight + Inter)
- **GSAP + ScrollTrigger + Lenis** - scroll-driven storytelling, scrubowany obrót osiedla, reveals (z pełnym `prefers-reduced-motion`)
- **MapLibre GL** - interaktywna mapa okolicy (zdjęcia satelitarne + POI)
- **Higgsfield** (Veo 3.1 / Kling 3.0 / Nano Banana Pro) - filmowe wideo i wizualizacje wnętrz na bazie realnych renderów inwestycji

## Sekcje

Hero (wideo) · pasek zaufania · **obracane 360° osiedle** (scroll) · lifestyle · **interaktywna mapa osiedla
z klikalnymi budynkami** + eksplorator lokali (filtry, karty, modal z rzutem) · **wirtualny spacer po wnętrzach**
(wideo + przełączanie pomieszczeń) · standard i technologia · galeria (lightbox) · **okolica** (mapa satelitarna
+ POI + wideo Central Wake Park) · finansowanie · deweloper · FAQ · formularz kontaktowy · stopka.
Podstrony: polityka prywatności, polityka cookies, regulamin. Baner cookie, JSON-LD, sitemap, robots.

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
GOOGLE_SITE_VERIFICATION=...    # token weryfikacji Google Search Console
```

**Uwaga:** klucz Web3Forms jest ograniczony do domeny docelowej, więc pełny test
formularza ma sens dopiero po przepięciu `plazowa-park.pl`.

Analityka (jeśli `NEXT_PUBLIC_GA_ID` ustawione) śledzi konwersje: `generate_lead` (wysłany formularz),
`click_to_call` (telefon), `click_to_email` (e-mail), `click_whatsapp`, `book_viewing` (Umów prezentację /
Sprawdź dostępność / Zapytaj o apartament), `view_360` (start spaceru) oraz `view_lokal` (wejście na
podstronę lokalu). IP anonimizowane. W GA4 oznacz `generate_lead` i `book_viewing` jako key events.

## SEO i wygaszanie

- **Domena docelowa**: `https://plazowa-park.pl` (stała w `lib/data/site.ts`). Kopie `*.vercel.app`
  (alias produkcyjny i deploye preview) są trzymane poza indeksem: `middleware.ts` dodaje nagłówek
  `X-Robots-Tag: noindex, nofollow` dla hostów `*.vercel.app`, a deploye preview (`VERCEL_ENV=preview`)
  dostają dodatkowo `robots: noindex` z `app/layout.tsx`. Canonical zawsze wskazuje domenę docelową.
- **Google Search Console**: ustaw `GOOGLE_SITE_VERIFICATION` (token z GSC) w env - wstrzyknie
  `<meta name="google-site-verification">`. Po wdrożeniu zgłoś własność domeny w GSC i wyślij
  `https://plazowa-park.pl/sitemap.xml`.
- **Strona lokalizacji**: `/lokalizacja` - dedykowany, indeksowalny URL pod long-tail (Zalew Mrożyczka,
  Central Wake Park, dojazd do Łodzi / ŁKA), linkowany z sekcji Okolica i z podstron lokali.
- **Status lokali**: zmiana pola `status` w `lib/data/units.ts` (`available` / `reserved` / `sold`)
  automatycznie aktualizuje UI oraz `availability` w schema.org (`InStock` / `PreOrder` / `SoldOut`).
  URL-e lokali zostają - nie usuwaj ich, aby nie tworzyć soft 404.
- **Wygaszanie po sprzedaży** (przygotować, nie aktywować): gdy wszystkie lokale są sprzedane, albo
  (a) zamień stronę główną na statyczną „Inwestycja sprzedana" z danymi dewelopera i CTA do przyszłych
  projektów, albo (b) dodaj w `middleware.ts` przekierowanie 301 na stronę dewelopera. Sitemap i canonical
  zostaw do czasu deindeksacji.

## Uwagi

Ceny, metraże i statusy dostępności należy potwierdzić z biurem sprzedaży KS Prestige Development przed
publikacją produkcyjną. Materiały wizualne mają charakter poglądowy i nie stanowią oferty w rozumieniu
art. 66 Kodeksu cywilnego.
