import { NAV, SITE, DEVELOPER } from "@/lib/data/site";
import { Icon } from "./Icons";

const legal = [
  { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
  { label: "Polityka cookies", href: "/polityka-cookies" },
  { label: "Regulamin serwisu", href: "/regulamin" },
];

export default function Footer() {
  const year = 2026;
  return (
    <footer className="bg-pine-deep text-paper">
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <p className="font-display text-3xl text-paper">Plażowa Park</p>
            <p className="mt-1 text-sm uppercase tracking-[0.2em] text-brass-light">Głowno · Zalew Mrożyczka</p>
            <p className="mt-5 max-w-xs text-pretty text-sm leading-relaxed text-paper/65">
              Kameralne osiedle 20 apartamentów w 100-letnim lesie, bezpośrednio przy Zalewie Mrożyczka. Oddanie {SITE.handoverDate}.
            </p>
            <a href="#lokale" className="btn btn-brass mt-6 !py-2.5 text-sm">
              Sprawdź dostępność <Icon.arrow width={16} height={16} />
            </a>
          </div>

          <nav>
            <p className="text-xs uppercase tracking-[0.16em] text-paper/45">Nawigacja</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a href={`/${n.href}`} className="link-underline text-paper/80 hover:text-paper">{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-paper/45">Kontakt</p>
            <ul className="mt-4 space-y-2.5 text-sm text-paper/80">
              <li><a href={`tel:${SITE.phone.tel}`} className="link-underline num">{SITE.phone.display}</a></li>
              <li><a href={`mailto:${SITE.email}`} className="link-underline">{SITE.email}</a></li>
              <li className="text-paper/65">{SITE.address.street}<br />{SITE.address.postal} {SITE.address.city}</li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-paper/45">Deweloper</p>
            <ul className="mt-4 space-y-1.5 text-sm text-paper/65">
              <li className="text-paper/85">{DEVELOPER.name}</li>
              <li>{DEVELOPER.street}</li>
              <li>{DEVELOPER.postal} {DEVELOPER.city}</li>
              <li className="num">KRS {DEVELOPER.krs}</li>
              <li className="num">NIP {DEVELOPER.nip}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-paper/12 pt-6 text-sm text-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {DEVELOPER.name}. Wszelkie prawa zastrzeżone.</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legal.map((l) => (
              <li key={l.href}><a href={l.href} className="link-underline hover:text-paper">{l.label}</a></li>
            ))}
          </ul>
        </div>

        <p className="mt-6 max-w-4xl text-xs leading-relaxed text-paper/40">
          Materiały zamieszczone na stronie (wizualizacje, animacje, plany i ceny) mają charakter poglądowy i
          informacyjny, nie stanowią oferty w rozumieniu art. 66 Kodeksu cywilnego. Część wizualizacji wnętrz i
          otoczenia została przygotowana z użyciem narzędzi generatywnych na podstawie rzeczywistych materiałów
          inwestycji i może różnić się od stanu faktycznego. Wiążące dane, ceny i dostępność potwierdza biuro sprzedaży.
        </p>
      </div>
    </footer>
  );
}
