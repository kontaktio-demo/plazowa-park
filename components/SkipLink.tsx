"use client";

/**
 * Pierwszy przystanek klawiatury na każdej stronie. Bez niego trzeba przejść cały
 * nagłówek, zanim dojdzie się do treści, a na podstronach nagłówek jest inny niż
 * na stronie głównej, więc link siedzi w layoucie, nie w nawigacji.
 *
 * Poza focusem chowa się nad krawędzią ekranu, a nie klasą sr-only, bo musi być
 * widoczny w chwili, gdy go dotknie klawiatura.
 */
export default function SkipLink() {
  return (
    <button
      type="button"
      onClick={() => {
        const tresc = document.querySelector("main");
        if (!tresc) return;
        tresc.tabIndex = -1;
        tresc.focus();
      }}
      className="fixed left-4 top-0 z-70 -translate-y-32 rounded-(--radius-card) bg-sun px-4 py-2.5 text-sm font-medium text-ink transition-transform focus:translate-y-2"
    >
      Przejdź do treści
    </button>
  );
}
