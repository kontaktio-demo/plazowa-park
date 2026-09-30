import type { Metadata } from "next";
import LegalShell from "@/components/LegalShell";
import { dataPl, LEGAL_UPDATED, RODO_ADMIN, SITE } from "@/lib/data/site";

/**
 * Klauzula informacyjna spod adresu drukowanego na karcie kontaktowej i zaszytego
 * w kodzie QR. Strona celowo stoi poza serwisem: nie ma jej w nawigacji, w stopce
 * ani w sitemapie, a wyszukiwarki dostają noindex zarówno w metadanych, jak i
 * w nagłówku X-Robots-Tag (next.config.ts). W robots.txt nie ma reguły na /rodo -
 * Disallow zablokowałby odczytanie noindex i adres mógłby zostać w wynikach.
 */
export const metadata: Metadata = {
  title: "Klauzula informacyjna RODO",
  description:
    "Klauzula informacyjna o przetwarzaniu danych osobowych przez KS Prestige Sp. z o.o. w związku z inwestycją Plażowa Park w Głownie.",
  // Pusta lista kasuje odziedziczone po layoucie <meta name="author">: autorem
  // w metadanych serwisu jest deweloper inwestycji, a ta strona mówi o innym
  // podmiocie jako administratorze danych.
  authors: [],
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noarchive: true },
  },
};

const ADRES = `${RODO_ADMIN.street}, ${RODO_ADMIN.postal} ${RODO_ADMIN.city}`;

export default function Page() {
  return (
    <LegalShell title="Klauzula informacyjna RODO" updated={dataPl(LEGAL_UPDATED.rodo)}>
      <p>
        Poniżej opisujemy, jak przetwarzamy dane osobowe osób kontaktujących się z nami w sprawie inwestycji{" "}
        <strong>Plażowa Park</strong>, {SITE.address.street}, {SITE.address.postal} {SITE.address.city}. Zasady wynikają
        z Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z 27 kwietnia 2016 r. (RODO).
      </p>
      <p>
        Klauzula dotyczy danych kontaktowych zostawionych w formularzu na stronie, w rozmowie z nami oraz na karcie
        kontaktowej. Przetwarzanie danych analitycznych i plików cookie opisują{" "}
        <a href="/polityka-prywatnosci">polityka prywatności</a> i <a href="/polityka-cookies">polityka cookies</a>.
      </p>

      <h2>1. Administrator danych osobowych</h2>
      <p>
        Administratorem Twoich danych osobowych jest <strong>{RODO_ADMIN.name}</strong> z siedzibą w Głownie,{" "}
        {ADRES}, wpisana do rejestru przedsiębiorców Krajowego Rejestru Sądowego pod numerem KRS{" "}
        <span className="num">{RODO_ADMIN.krs}</span>, NIP <span className="num">{RODO_ADMIN.nip}</span>.
      </p>
      <p>
        Kontakt: e-mail <a href={`mailto:${SITE.email}`}>{SITE.email}</a>, telefon{" "}
        <a href={`tel:${SITE.phone.tel}`} className="num">
          {SITE.phone.display}
        </a>
        .
      </p>
      <p>
        Administrator nie wyznaczył inspektora ochrony danych. We wszystkich sprawach dotyczących danych osobowych
        możesz kontaktować się pod adresem e-mail i numerem telefonu podanym wyżej.
      </p>

      <h2>2. Skąd mamy Twoje dane</h2>
      <p>Dane otrzymujemy bezpośrednio od Ciebie:</p>
      <ul>
        <li>z formularza kontaktowego na stronie internetowej,</li>
        <li>z karty kontaktowej wypełnionej w biurze sprzedaży lub na targach,</li>
        <li>z rozmowy telefonicznej,</li>
        <li>z wiadomości e-mail,</li>
        <li>z portali ogłoszeniowych, na których prezentowana jest oferta.</li>
      </ul>

      <h2>3. Jakie dane przetwarzamy</h2>
      <p>
        Imię i nazwisko, numer telefonu, adres e-mail, treść wiadomości oraz informację o interesującym Cię mieszkaniu
        lub domu.
      </p>
      <p>
        Podanie danych jest dobrowolne, ale bez numeru telefonu lub adresu e-mail nie jesteśmy w stanie odpowiedzieć na
        zapytanie.
      </p>

      <h2>4. Cele i podstawy prawne przetwarzania</h2>
      <ul>
        <li>
          Odpowiedź na zapytanie, przedstawienie oferty i podjęcie działań przed zawarciem umowy:{" "}
          <strong>art. 6 ust. 1 lit. b RODO</strong>.
        </li>
        <li>
          Kontakt telefoniczny i e-mailowy w celu przedstawienia oferty oraz informacji o inwestycji, na podstawie
          udzielonej zgody: <strong>art. 6 ust. 1 lit. a RODO</strong> w związku z przepisami o komunikacji
          elektronicznej.
        </li>
        <li>
          Ustalenie, dochodzenie i obrona roszczeń, jako prawnie uzasadniony interes administratora:{" "}
          <strong>art. 6 ust. 1 lit. f RODO</strong>.
        </li>
        <li>
          Wypełnienie obowiązków podatkowych i rachunkowych, jeżeli dojdzie do zawarcia umowy:{" "}
          <strong>art. 6 ust. 1 lit. c RODO</strong>.
        </li>
      </ul>

      <h2>5. Jak długo przechowujemy dane</h2>
      <p>
        Dane przetwarzamy przez czas niezbędny do obsługi zapytania i prowadzenia rozmów handlowych, a następnie do
        czasu przedawnienia ewentualnych roszczeń lub wycofania zgody.
      </p>
      <p>
        W razie zawarcia umowy dane przechowujemy przez czas jej trwania oraz przez okres przedawnienia roszczeń i okres
        wymagany przepisami podatkowymi.
      </p>

      <h2>6. Komu przekazujemy dane</h2>
      <p>Odbiorcami danych mogą być:</p>
      <ul>
        <li>biuro sprzedaży obsługujące inwestycję, MWW Mieszkanie,</li>
        <li>dostawcy usług IT, hostingu i poczty elektronicznej,</li>
        <li>
          Web3Forms, zewnętrzny operator formularza kontaktowego. Do jego systemu trafia komplet danych podanych
          w formularzu, a na potrzeby ochrony przed spamem także adres IP i adres e-mail osoby wysyłającej.
        </li>
      </ul>
      <p>
        Wszystkie te podmioty przetwarzają dane na podstawie umowy powierzenia i wyłącznie na polecenie administratora.
      </p>

      <h2>7. Przekazywanie danych poza Europejski Obszar Gospodarczy</h2>
      <p>
        Dane mogą być przekazywane dostawcom usług informatycznych mającym siedzibę poza Europejskim Obszarem
        Gospodarczym, wyłącznie w oparciu o decyzję Komisji Europejskiej stwierdzającą odpowiedni stopień ochrony albo
        o standardowe klauzule umowne.
      </p>

      <h2>8. Twoje prawa</h2>
      <p>Masz prawo do:</p>
      <ul>
        <li>dostępu do swoich danych i otrzymania ich kopii,</li>
        <li>sprostowania danych,</li>
        <li>usunięcia danych,</li>
        <li>ograniczenia przetwarzania,</li>
        <li>przenoszenia danych,</li>
        <li>wniesienia sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie,</li>
        <li>
          cofnięcia zgody w dowolnym momencie, bez wpływu na zgodność z prawem przetwarzania dokonanego przed jej
          cofnięciem.
        </li>
      </ul>
      <p>
        Wniosek wystarczy wysłać na adres e-mail administratora: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>

      <h2>9. Skarga do organu nadzorczego</h2>
      <p>
        Jeżeli uznasz, że przetwarzamy dane niezgodnie z prawem, możesz wnieść skargę do Prezesa Urzędu Ochrony Danych
        Osobowych, ul. Stawki 2, 00-193 Warszawa,{" "}
        <a href="https://uodo.gov.pl" rel="nofollow noopener" target="_blank">
          uodo.gov.pl
        </a>
        .
      </p>

      <h2>10. Zautomatyzowane podejmowanie decyzji</h2>
      <p>
        Dane nie są wykorzystywane do zautomatyzowanego podejmowania decyzji, w tym do profilowania.
      </p>

      <h2>11. Zmiany klauzuli</h2>
      <p>
        Klauzula może być aktualizowana. Data ostatniej aktualizacji jest podana na górze tej strony.
      </p>

      <p>
        Pełna treść zgody podpisywanej na karcie kontaktowej brzmi tak jak na papierowym formularzu, a jej cofnięcie
        następuje przez wiadomość na adres e-mail administratora.
      </p>
    </LegalShell>
  );
}
