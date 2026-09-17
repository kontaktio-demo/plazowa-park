const POLA = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Wycisza stronę pod nakładką (okno lokalu, menu mobilne): czytnik ekranu nie czyta
 * tła, Tab krąży po `zostaw`, Escape zamyka, strona się nie przewija. Zwraca funkcję,
 * która wszystko przywraca.
 *
 * Bez atrybutu inert i bez showModal, choć oba robią to samo jednym ruchem: w Chrome
 * każde z nich przelicza style całej strony, co zmierzone na tej stronie trwało
 * medianę 126-134 ms, a w skrajnym przypadku kilka sekund. Tyle zacinało się otwarcie
 * i zamknięcie okna. aria-hidden i ta sama pułapka Taba kosztują poniżej 2 ms.
 */
export function wyciszTlo(zostaw: (Element | null)[], onEscape: () => void) {
  const tlo = Array.from(document.body.children).filter(
    (el) => !zostaw.includes(el) && el.tagName !== "SCRIPT" && !el.hasAttribute("aria-hidden")
  );
  tlo.forEach((el) => el.setAttribute("aria-hidden", "true"));

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") return onEscape();
    if (e.key !== "Tab") return;
    const pola = zostaw
      .flatMap((k) => (k ? Array.from(k.querySelectorAll<HTMLElement>(POLA)) : []))
      .filter((el) => el.getClientRects().length > 0);
    if (!pola.length) return;
    const i = pola.indexOf(document.activeElement as HTMLElement);
    const cel = e.shiftKey ? (i <= 0 ? pola.at(-1) : null) : i === -1 || i === pola.length - 1 ? pola[0] : null;
    if (!cel) return;
    e.preventDefault();
    cel.focus();
  };

  document.addEventListener("keydown", onKey);
  document.documentElement.style.overflow = "hidden";
  return () => {
    document.removeEventListener("keydown", onKey);
    document.documentElement.style.overflow = "";
    tlo.forEach((el) => el.removeAttribute("aria-hidden"));
  };
}
