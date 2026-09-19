"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { DOMYSLNY_SORT, sortDoUrl, sortZUrl, type Rodzaj, type Sort } from "./sortowanie";

export type StanListy = { rodzaj: Rodzaj; tylkoDostepne: boolean; sort: Sort };

const DOMYSLNY_STAN: StanListy = { rodzaj: "wszystkie", tylkoDostepne: true, sort: DOMYSLNY_SORT };

const ZDARZENIE = "pp:adres";

function zParams(p: URLSearchParams): StanListy {
  const typ = p.get("typ");
  return {
    rodzaj: typ === "mieszkania" || typ === "domy" ? typ : "wszystkie",
    tylkoDostepne: p.get("dostepne") !== "0",
    sort: p.has("sort") ? sortZUrl(p.get("sort")) : DOMYSLNY_SORT,
  };
}

function doParams(s: StanListy): string {
  const p = new URLSearchParams();
  // domyślnego widoku nie wypisujemy, żeby adres strony głównej został czysty
  if (s.rodzaj !== DOMYSLNY_STAN.rodzaj) p.set("typ", s.rodzaj);
  if (s.tylkoDostepne !== DOMYSLNY_STAN.tylkoDostepne) p.set("dostepne", s.tylkoDostepne ? "1" : "0");
  if (sortDoUrl(s.sort) !== sortDoUrl(DOMYSLNY_STAN.sort)) p.set("sort", sortDoUrl(s.sort));
  const q = p.toString();
  return q ? `?${q}` : window.location.pathname;
}

function subskrybuj(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener(ZDARZENIE, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(ZDARZENIE, cb);
  };
}

/**
 * Filtry i sortowanie listy mieszkają w adresie, a nie w stanie komponentu: link
 * do widoku ("same domy, posortowane po metrażu") da się wysłać dalej, a przycisk
 * wstecz wraca do poprzedniego widoku.
 *
 * Adres czytamy przez useSyncExternalStore, nie efektem: na serwerze zwraca pusty
 * ciąg, czyli widok domyślny, więc pełna lista jest w HTML jeszcze przed JS.
 */
export function useStanListy(): [StanListy, (zmiana: Partial<StanListy>) => void] {
  const search = useSyncExternalStore(
    subskrybuj,
    () => window.location.search,
    () => ""
  );
  const stan = useMemo(() => zParams(new URLSearchParams(search)), [search]);

  const ustaw = useCallback(
    (zmiana: Partial<StanListy>) => {
      const nowy = { ...zParams(new URLSearchParams(window.location.search)), ...zmiana };
      // replaceState, nie push: zmiana filtra nie jest osobnym krokiem historii,
      // a strona nie może skoczyć na górę
      window.history.replaceState(window.history.state, "", doParams(nowy) + window.location.hash);
      window.dispatchEvent(new Event(ZDARZENIE));
    },
    []
  );

  return [stan, ustaw];
}
