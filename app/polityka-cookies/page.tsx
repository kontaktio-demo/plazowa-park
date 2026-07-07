import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";
import { SITE } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Polityka cookies",
  description: "Informacje o plikach cookie wykorzystywanych w serwisie Plażowa Park oraz zarządzaniu zgodą.",
  alternates: { canonical: "/polityka-cookies" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <LegalShell title="Polityka cookies" updated="3 lipca 2026">
      <p>
        Serwis <strong>plazowa-park.pl</strong> wykorzystuje pliki cookie oraz podobne technologie w celu zapewnienia
        prawidłowego działania strony, poprawy komfortu korzystania oraz analizy ruchu.
      </p>

      <h2>1. Czym są pliki cookie</h2>
      <p>
        Cookie to niewielkie pliki tekstowe zapisywane na Twoim urządzeniu podczas przeglądania Serwisu. Umożliwiają
        m.in. zapamiętanie Twoich preferencji oraz zbieranie anonimowych statystyk.
      </p>

      <h2>2. Rodzaje wykorzystywanych plików cookie</h2>
      <ul>
        <li><strong>Niezbędne</strong> - konieczne do działania Serwisu, m.in. zapamiętanie decyzji dotyczącej zgody na cookie. Nie wymagają zgody.</li>
        <li><strong>Analityczne / statystyczne</strong> - pomagają zrozumieć, jak użytkownicy korzystają z Serwisu (np. Google Analytics). Uruchamiane po wyrażeniu zgody.</li>
        <li><strong>Funkcjonalne</strong> - zapamiętują wybory użytkownika, np. w interaktywnej mapie osiedla.</li>
      </ul>

      <h2>3. Zarządzanie zgodą i cookie</h2>
      <p>
        Przy pierwszej wizycie wyświetlamy baner umożliwiający akceptację wszystkich plików cookie lub wyłącznie
        niezbędnych. Możesz w każdej chwili zmienić ustawienia dotyczące cookie w swojej przeglądarce, w tym je
        usunąć lub zablokować. Ograniczenie plików cookie może wpłynąć na niektóre funkcje Serwisu.
      </p>
      <p>Instrukcje zarządzania cookie w popularnych przeglądarkach dostępne są w ich dokumentacji (Chrome, Firefox, Safari, Edge).</p>

      <h2>4. Dane analityczne</h2>
      <p>
        Korzystając z narzędzi analitycznych, przetwarzamy dane w sposób zanonimizowany, aby doskonalić Serwis. Dane
        te nie służą do identyfikacji konkretnej osoby.
      </p>

      <h2>5. Kontakt</h2>
      <p>
        W sprawach dotyczących plików cookie napisz do nas: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        Zasady przetwarzania danych osobowych opisuje <a href="/polityka-prywatnosci">Polityka prywatności</a>.
      </p>

      <p className="text-sm text-faint">
        Dokument ma charakter informacyjny. Przed wdrożeniem produkcyjnym zalecana jest konfiguracja rzeczywistych
        narzędzi analitycznych oraz weryfikacja zgodności z aktualnymi wymogami prawnymi.
      </p>
    </LegalShell>
  );
}
