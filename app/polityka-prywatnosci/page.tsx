import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";
import { DEVELOPER, SITE } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Zasady przetwarzania danych osobowych (RODO) użytkowników serwisu Plażowa Park.",
  alternates: { canonical: "/polityka-prywatnosci" },
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <LegalShell title="Polityka prywatności" updated="3 lipca 2026">
      <p>
        Niniejsza Polityka prywatności opisuje zasady przetwarzania danych osobowych osób korzystających z serwisu
        internetowego <strong>plazowa-park.pl</strong> ("Serwis") oraz kontaktujących się z nami w sprawie inwestycji
        Plażowa Park w Głownie. Dbamy o Twoją prywatność i przetwarzamy dane zgodnie z Rozporządzeniem (UE) 2016/679
        (RODO).
      </p>

      <h2>1. Administrator danych</h2>
      <p>
        Administratorem danych osobowych jest <strong>{DEVELOPER.name}</strong> z siedzibą w {DEVELOPER.city},
        {" "}{DEVELOPER.street}, {DEVELOPER.postal} {DEVELOPER.city}, wpisana do rejestru przedsiębiorców KRS pod
        numerem {DEVELOPER.krs}, NIP {DEVELOPER.nip} ("Administrator").
      </p>
      <p>
        W sprawach dotyczących danych osobowych możesz kontaktować się z nami: e-mail{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a>, telefon <span className="num">{SITE.phone.display}</span>.
      </p>

      <h2>2. Zakres i cele przetwarzania</h2>
      <p>Przetwarzamy dane, które podajesz dobrowolnie w formularzu kontaktowym lub podczas kontaktu telefonicznego:</p>
      <ul>
        <li><strong>Imię i nazwisko, telefon, adres e-mail</strong> - w celu obsługi zapytania, przedstawienia oferty i kontaktu handlowego.</li>
        <li><strong>Treść wiadomości oraz wybrany apartament</strong> - w celu przygotowania odpowiedzi dopasowanej do Twoich potrzeb.</li>
        <li><strong>Dane techniczne</strong> (adres IP, pliki cookie, dane analityczne) - w celu zapewnienia działania i bezpieczeństwa Serwisu oraz analizy ruchu.</li>
      </ul>

      <h2>3. Podstawy prawne</h2>
      <ul>
        <li>art. 6 ust. 1 lit. b RODO - podjęcie działań na Twoje żądanie przed zawarciem umowy;</li>
        <li>art. 6 ust. 1 lit. a RODO - zgoda (np. na kontakt marketingowy), którą możesz w każdej chwili wycofać;</li>
        <li>art. 6 ust. 1 lit. f RODO - prawnie uzasadniony interes Administratora (kontakt, obsługa zapytań, analityka, zapewnienie bezpieczeństwa).</li>
      </ul>

      <h2>4. Okres przechowywania</h2>
      <p>
        Dane przetwarzamy przez czas niezbędny do obsługi zapytania i prowadzenia rozmów handlowych, a następnie do
        czasu przedawnienia ewentualnych roszczeń lub wycofania zgody. Dane analityczne przechowujemy zgodnie z
        ustawieniami odpowiednich narzędzi.
      </p>

      <h2>5. Odbiorcy danych</h2>
      <p>
        Dane mogą być powierzane podmiotom wspierającym nas w działalności: dostawcom hostingu i infrastruktury,
        narzędzi analitycznych, obsługi poczty oraz doradcom. Podmioty te przetwarzają dane wyłącznie na podstawie
        umów powierzenia i w zakresie niezbędnym do realizacji usług.
      </p>

      <h2>6. Twoje prawa</h2>
      <p>Przysługuje Ci prawo do:</p>
      <ul>
        <li>dostępu do danych oraz otrzymania ich kopii,</li>
        <li>sprostowania (poprawiania) danych,</li>
        <li>usunięcia danych lub ograniczenia przetwarzania,</li>
        <li>przenoszenia danych,</li>
        <li>wniesienia sprzeciwu wobec przetwarzania,</li>
        <li>wycofania zgody w dowolnym momencie (bez wpływu na zgodność z prawem wcześniejszego przetwarzania),</li>
        <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).</li>
      </ul>

      <h2>7. Dobrowolność podania danych</h2>
      <p>
        Podanie danych jest dobrowolne, ale niezbędne do obsługi zapytania i kontaktu. Brak podania danych
        kontaktowych uniemożliwia udzielenie odpowiedzi.
      </p>

      <h2>8. Pliki cookie</h2>
      <p>
        Serwis korzysta z plików cookie. Szczegóły znajdziesz w <a href="/polityka-cookies">Polityce cookies</a>.
      </p>

      <h2>9. Zmiany Polityki</h2>
      <p>
        Możemy aktualizować niniejszą Politykę. Aktualna wersja jest zawsze dostępna w Serwisie wraz z datą ostatniej
        aktualizacji.
      </p>

      <p className="text-sm text-faint">
        Powyższy dokument ma charakter informacyjny. Ostateczna treść klauzul powinna zostać zweryfikowana przez
        Administratora i jego doradcę prawnego przed publikacją produkcyjną.
      </p>
    </LegalShell>
  );
}
