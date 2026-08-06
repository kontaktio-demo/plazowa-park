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
([`public/estate-map.json`](public/estate-map.json)). Treści i fakty: [`lib/data/site.ts`](lib/data/site.ts).

Wizualizacje wnętrz i część ujęć zewnętrznych wygenerowano narzędziami Higgsfield **na podstawie realnych
renderów inwestycji** - mają charakter poglądowy (oznaczone w stopce i galerii).

## Uruchomienie

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
```

### Formularz leadów

`POST /api/lead` waliduje i loguje zgłoszenia. Aby włączyć wysyłkę e-mail, ustaw zmienne środowiskowe:

```
RESEND_API_KEY=...              # klucz Resend (wysyłka e-mail leada)
LEAD_TO=biuro@plazowa-park.pl   # adres odbiorcy leadów
NEXT_PUBLIC_GA_ID=G-XXXXXXX     # (opcjonalnie) GA4 - bez tego analityka jest wyłączona
GOOGLE_SITE_VERIFICATION=...    # (opcjonalnie) token weryfikacji Google Search Console
```

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
