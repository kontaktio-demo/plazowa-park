/**
 *  Raport ruchu z GA4 - do czytania z linii polecen.
 *
 *  GA4 nie ma konektora, wiec danych nie da sie podejrzec inaczej niz przez
 *  Data API. Skrypt loguje sie kluczem konta uslugowego, odpytuje API i drukuje
 *  podsumowanie: skad przychodza ludzie, co ogladaja i ile z tego jest zapytan.
 *
 *  Konfiguracja (jednorazowa):
 *    1. Google Cloud Console -> wlacz "Google Analytics Data API"
 *    2. utworz konto uslugowe i pobierz klucz JSON
 *    3. w GA4: Administracja -> Zarzadzanie dostepem do uslugi -> dodaj adres
 *       konta uslugowego jako Czytelnik
 *    4. zapisz klucz jako .ga-key.json w katalogu projektu (jest w .gitignore)
 *    5. identyfikator uslugi: GA4 -> Administracja -> Szczegoly uslugi
 *
 *  Uruchamianie:
 *    node scripts/ruch.mjs                 # ostatnie 28 dni
 *    node scripts/ruch.mjs 7               # ostatnie 7 dni
 *    GA_PROPERTY_ID=123456789 node scripts/ruch.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { createSign } from "node:crypto";

const KLUCZ = ".ga-key.json";
const DNI = Number(process.argv[2]) || 28;
const PROPERTY = process.env.GA_PROPERTY_ID || "";

if (!existsSync(KLUCZ)) {
  console.error(`Brak pliku ${KLUCZ}. Instrukcja konfiguracji jest w naglowku tego skryptu.`);
  process.exit(1);
}
if (!PROPERTY) {
  console.error("Brak GA_PROPERTY_ID. Znajdziesz go w GA4: Administracja -> Szczegoly uslugi.");
  process.exit(1);
}

const konto = JSON.parse(readFileSync(KLUCZ, "utf8"));

/** Token OAuth z podpisanego JWT - bez zewnetrznych zaleznosci. */
async function token() {
  const teraz = Math.floor(Date.now() / 1000);
  const naglowek = { alg: "RS256", typ: "JWT" };
  const tresc = {
    iss: konto.client_email,
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: teraz + 3600,
    iat: teraz,
  };
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const podstawa = `${b64(naglowek)}.${b64(tresc)}`;
  const podpis = createSign("RSA-SHA256").update(podstawa).sign(konto.private_key, "base64url");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${podstawa}.${podpis}`,
    }),
  });
  const dane = await res.json();
  if (!dane.access_token) throw new Error("Logowanie nieudane: " + JSON.stringify(dane));
  return dane.access_token;
}

async function raport(tok, body) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY}:runReport`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
      body: JSON.stringify({ dateRanges: [{ startDate: `${DNI}daysAgo`, endDate: "today" }], ...body }),
    }
  );
  const dane = await res.json();
  if (dane.error) throw new Error(dane.error.message);
  return dane;
}

const wiersze = (d) =>
  (d.rows || []).map((r) => ({
    klucz: (r.dimensionValues || []).map((v) => v.value).join(" / "),
    wartosci: (r.metricValues || []).map((v) => Number(v.value)),
  }));

const tabela = (tytul, dane, naglowki) => {
  console.log(`\n${tytul}`);
  if (!dane.length) return console.log("  (brak danych)");
  const szer = Math.max(...dane.map((d) => d.klucz.length), 10);
  console.log("  " + "nazwa".padEnd(szer) + "  " + naglowki.join("  "));
  for (const d of dane) {
    console.log("  " + d.klucz.padEnd(szer) + "  " + d.wartosci.map((v) => String(v).padStart(6)).join("  "));
  }
};

const tok = await token();
console.log(`Ruch na plazowa-park.pl - ostatnie ${DNI} dni`);

const ogol = await raport(tok, {
  metrics: [
    { name: "activeUsers" },
    { name: "sessions" },
    { name: "screenPageViews" },
    { name: "averageSessionDuration" },
  ],
});
const o = wiersze(ogol)[0]?.wartosci || [0, 0, 0, 0];
console.log(`\nUzytkownicy: ${o[0]}   Sesje: ${o[1]}   Odslony: ${o[2]}   Sredni czas: ${Math.round(o[3])} s`);

tabela(
  "Skad przychodza",
  wiersze(await raport(tok, {
    dimensions: [{ name: "sessionSourceMedium" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 10,
  })),
  ["sesje"]
);

tabela(
  "Najczesciej ogladane strony",
  wiersze(await raport(tok, {
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 12,
  })),
  ["odslony"]
);

tabela(
  "Zdarzenia",
  wiersze(await raport(tok, {
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }],
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 20,
  })),
  ["ile"]
);

tabela(
  "Ogladane mieszkania",
  wiersze(await raport(tok, {
    dimensions: [{ name: "customEvent:unit" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { value: "view_lokal" } } },
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 20,
  })),
  ["wejscia"]
);

tabela(
  "Ktore CTA klikane",
  wiersze(await raport(tok, {
    dimensions: [{ name: "customEvent:sekcja" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { value: "book_viewing" } } },
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: 15,
  })),
  ["klikniec"]
);

tabela(
  "Spacer 360",
  wiersze(await raport(tok, {
    dimensions: [{ name: "customEvent:tryb" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: { filter: { fieldName: "eventName", stringFilter: { value: "view_360" } } },
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
  })),
  ["uruchomien"]
);

tabela(
  "Urzadzenia",
  wiersze(await raport(tok, {
    dimensions: [{ name: "deviceCategory" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  })),
  ["sesje"]
);
