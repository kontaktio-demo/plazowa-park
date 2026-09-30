import JsonLd from "@/components/JsonLd";

/**
 * Warstwa serwisu: wszystko poza /rodo. Dane strukturalne o firmie siedzą tutaj,
 * a nie w layoucie głównym, bo klauzula RODO ma ich nie mieć - jest noindex, więc
 * nic by tam nie zrobiły, a wnosiłyby na stronę drugi KRS (dewelopera inwestycji)
 * obok KRS-u administratora danych, o którym ta strona mówi.
 *
 * Grupa nie zmienia adresów: /, /lokalizacja, /mieszkania-i-domy/... i dokumenty
 * prawne odpowiadają tak samo jak wcześniej.
 */
export default function SerwisLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <JsonLd />
      {children}
    </>
  );
}
