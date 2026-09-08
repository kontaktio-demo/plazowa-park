import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";
import { SITE } from "@/lib/data/site";

const description =
  "Informacje o plikach cookie w serwisie Plażowa Park w Głownie: rodzaje cookies, cele oraz zarządzanie zgodą w przeglądarce.";

export const metadata: Metadata = {
  title: "Polityka cookies",
  description,
  alternates: { canonical: "/polityka-cookies" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: `${SITE.url}/polityka-cookies`,
    siteName: "Plażowa Park",
    title: "Polityka cookies - Plażowa Park",
    description,
  },
};

export default function Page() {
  return (
    <LegalShell title="Polityka cookies" updated="8 września 2026">
      <p>
        Serwis <strong>plazowa-park.pl</strong> korzysta z plików cookie i podobnych technologii, w tym z pamięci
        lokalnej przeglądarki. Sam Serwis nie zapisuje na Twoim urządzeniu plików cookie; w pamięci lokalnej
        przechowujemy wyłącznie Twoją decyzję dotyczącą zgody. Pliki cookie mogą natomiast zapisywać narzędzia
        analityczne, jeśli wyrazisz na nie zgodę.
      </p>

      <h2>1. Czym są pliki cookie</h2>
      <p>
        Cookie to niewielkie pliki tekstowe zapisywane na Twoim urządzeniu podczas przeglądania Serwisu. Umożliwiają
        m.in. zapamiętanie Twoich preferencji oraz zbieranie anonimowych statystyk.
      </p>

      <h2>2. Rodzaje wykorzystywanych plików cookie</h2>
      <ul>
        <li><strong>Niezbędne</strong> - zapamiętanie Twojej decyzji dotyczącej zgody. Przechowujemy ją w pamięci lokalnej przeglądarki, nie w pliku cookie. Nie wymaga zgody.</li>
        <li><strong>Analityczne / statystyczne</strong> - pomagają zrozumieć, jak użytkownicy korzystają z Serwisu. Google Analytics zapisuje pliki cookie i uruchamiamy go wyłącznie po wyrażeniu zgody. Bezcookiowa analityka Vercel nie zapisuje ani nie odczytuje niczego na Twoim urządzeniu, więc zlicza odwiedziny niezależnie od decyzji w banerze.</li>
      </ul>

      <h2>3. Zarządzanie zgodą i cookie</h2>
      <p>
        Przy pierwszej wizycie wyświetlamy baner umożliwiający akceptację wszystkich plików cookie lub wyłącznie
        niezbędnych. Decyzję zapisujemy w pamięci lokalnej przeglądarki, więc aby ją cofnąć, wyczyść dane witryny
        dla plazowa-park.pl w ustawieniach przeglądarki - baner pojawi się ponownie. Ustawienia samych plików
        cookie zmienisz w przeglądarce, w tym możesz je usunąć lub zablokować.
      </p>
      <p>Instrukcje zarządzania cookie w popularnych przeglądarkach dostępne są w ich dokumentacji (Chrome, Firefox, Safari, Edge).</p>

      <h2>4. Dane analityczne</h2>
      <p>
        Jeśli wyrazisz zgodę na statystyki, korzystamy z Google Analytics i przetwarzamy dane w sposób
        zanonimizowany, aby doskonalić Serwis. Niezależnie od zgody działa analityka Vercel, która zlicza
        odsłony i źródła wejść, ale nie zapisuje plików cookie ani niczego w pamięci Twojej przeglądarki
        i nie wymaga zgody, bo nie sięga do Twojego urządzenia. Dane te nie służą do identyfikacji
        konkretnej osoby.
        Mapa okolicy pobiera kafle satelitarne od zewnętrznego dostawcy (Esri ArcGIS Online), co wiąże się
        z przekazaniem mu adresu IP Twojego urządzenia.
      </p>

      <h2>5. Kontakt</h2>
      <p>
        W sprawach dotyczących plików cookie napisz do nas: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        Zasady przetwarzania danych osobowych opisuje <a href="/polityka-prywatnosci">Polityka prywatności</a>.
      </p>
    </LegalShell>
  );
}
