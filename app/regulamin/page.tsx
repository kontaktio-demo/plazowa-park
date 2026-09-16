import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";
import { dataPl, LEGAL_UPDATED, OPERATOR, SITE } from "@/lib/data/site";

const description =
  "Regulamin korzystania z serwisu internetowego Plażowa Park - zasady świadczenia usług, prawa i obowiązki użytkownika oraz dane usługodawcy prowadzącego serwis.";

export const metadata: Metadata = {
  title: "Regulamin serwisu",
  description,
  alternates: { canonical: "/regulamin" },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: `${SITE.url}/regulamin`,
    siteName: "Plażowa Park",
    title: "Regulamin serwisu - Plażowa Park",
    description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Plażowa Park - osiedle nad Zalewem Mrożyczka w Głownie" }],
  },
  twitter: { card: "summary_large_image", title: "Regulamin serwisu - Plażowa Park", description, images: ["/og.jpg"] },
};

export default function Page() {
  return (
    <LegalShell title="Regulamin serwisu" updated={dataPl(LEGAL_UPDATED.regulamin)}>
      <h2>§1. Postanowienia ogólne</h2>
      <p>
        Niniejszy Regulamin określa zasady korzystania z serwisu internetowego dostępnego pod adresem
        {" "}<strong>plazowa-park.pl</strong> (&quot;Serwis&quot;), prowadzonego przez {OPERATOR.name} z siedzibą
        w Głownie, {OPERATOR.street}, {OPERATOR.postal} {OPERATOR.city} (KRS {OPERATOR.krs},
        NIP {OPERATOR.nip}) (&quot;Usługodawca&quot;).
      </p>

      <h2>§2. Zakres usług</h2>
      <ul>
        <li>Serwis ma charakter informacyjno-marketingowy i prezentuje inwestycję Plażowa Park w Głownie.</li>
        <li>Serwis umożliwia zapoznanie się z ofertą, przeglądanie dostępnych mieszkań i domów oraz kontakt z biurem sprzedaży za pośrednictwem formularza.</li>
        <li>Korzystanie z Serwisu jest nieodpłatne.</li>
      </ul>

      <h2>§3. Charakter prezentowanych informacji</h2>
      <p>
        Zawartość Serwisu ma charakter informacyjny i <strong>nie stanowi oferty</strong> w rozumieniu art. 66
        i nast. Kodeksu cywilnego. Wiążące warunki zakupu określa umowa zawierana w formie aktu notarialnego.
      </p>
      <p>
        Charakter <strong>poglądowy</strong> mają wizualizacje, animacje i plan osiedla: pokazują zamierzony
        efekt i mogą różnić się od stanu faktycznego. Wizualizacje architektury, rzuty mieszkań i domów oraz plan osiedla
        pochodzą od dewelopera inwestycji, a część wizualizacji pokazujących aranżację, zieleń i otoczenie
        przygotowaliśmy na ich podstawie.
      </p>
      <p>
        Ceny mieszkań i domów podane w Serwisie są <strong>aktualnymi cenami ofertowymi brutto</strong> i aktualizujemy
        je przy każdej zmianie. Metraże, liczba pokoi i statusy dostępności pochodzą z systemu sprzedaży
        dewelopera; dostępność przed podpisaniem umowy potwierdza biuro sprzedaży.
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
    </LegalShell>
  );
}
