import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";
import { DEVELOPER, SITE } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Regulamin serwisu",
  description: "Regulamin korzystania z serwisu internetowego Plażowa Park.",
  alternates: { canonical: "/regulamin" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <LegalShell title="Regulamin serwisu" updated="3 lipca 2026">
      <h2>§1. Postanowienia ogólne</h2>
      <p>
        Niniejszy Regulamin określa zasady korzystania z serwisu internetowego dostępnego pod adresem
        {" "}<strong>plazowa-park.pl</strong> ("Serwis"), prowadzonego przez {DEVELOPER.name} z siedzibą w
        {" "}{DEVELOPER.city}, {DEVELOPER.street}, {DEVELOPER.postal} {DEVELOPER.city} (KRS {DEVELOPER.krs},
        NIP {DEVELOPER.nip}) ("Usługodawca").
      </p>

      <h2>§2. Zakres usług</h2>
      <ul>
        <li>Serwis ma charakter informacyjno-marketingowy i prezentuje inwestycję Plażowa Park w Głownie.</li>
        <li>Serwis umożliwia zapoznanie się z ofertą, przeglądanie dostępnych apartamentów oraz kontakt z biurem sprzedaży za pośrednictwem formularza.</li>
        <li>Korzystanie z Serwisu jest nieodpłatne.</li>
      </ul>

      <h2>§3. Charakter prezentowanych informacji</h2>
      <p>
        Informacje zawarte w Serwisie - w tym wizualizacje, animacje, plany, metraże, ceny i statusy dostępności -
        mają charakter <strong>poglądowy i informacyjny i nie stanowią oferty</strong> w rozumieniu art. 66 i nast.
        Kodeksu cywilnego. Część wizualizacji wnętrz i otoczenia została przygotowana z użyciem narzędzi generatywnych
        na podstawie rzeczywistych materiałów inwestycji i może różnić się od stanu faktycznego. Wiążące warunki
        zakupu określa umowa zawierana w formie aktu notarialnego, a aktualne ceny i dostępność potwierdza biuro
        sprzedaży.
      </p>

      <h2>§4. Warunki techniczne</h2>
      <p>
        Do korzystania z Serwisu niezbędne jest urządzenie z dostępem do Internetu oraz aktualna przeglądarka
        internetowa z obsługą JavaScript. Niektóre funkcje (interaktywna mapa, animacje) mogą wymagać nowszej wersji
        przeglądarki.
      </p>

      <h2>§5. Formularz kontaktowy</h2>
      <ul>
        <li>Wysłanie formularza wymaga podania danych kontaktowych oraz akceptacji zgody na przetwarzanie danych osobowych.</li>
        <li>Zasady przetwarzania danych określa <a href="/polityka-prywatnosci">Polityka prywatności</a>.</li>
        <li>Zakazane jest dostarczanie treści o charakterze bezprawnym.</li>
      </ul>

      <h2>§6. Prawa autorskie</h2>
      <p>
        Wszelkie materiały udostępnione w Serwisie (teksty, grafiki, wizualizacje, logotypy) są chronione prawem
        autorskim i stanowią własność Usługodawcy lub podmiotów trzecich. Ich wykorzystanie bez zgody jest zabronione.
      </p>

      <h2>§7. Reklamacje</h2>
      <p>
        Uwagi dotyczące działania Serwisu można zgłaszać na adres <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        Odpowiadamy w rozsądnym terminie, zwykle w ciągu jednego dnia roboczego.
      </p>

      <h2>§8. Postanowienia końcowe</h2>
      <p>
        Usługodawca zastrzega prawo do zmiany Regulaminu. W sprawach nieuregulowanych zastosowanie mają przepisy
        prawa polskiego, w szczególności Kodeksu cywilnego.
      </p>

      <p className="text-sm text-faint">
        Dokument ma charakter informacyjny i przed wdrożeniem produkcyjnym powinien zostać zweryfikowany przez doradcę
        prawnego Usługodawcy.
      </p>
    </LegalShell>
  );
}
