import { cennikCsv, czyZnanyDzien, nazwaPliku } from "@/lib/cennik";

export const revalidate = 3600;

/**
 * Cennik według stanu na wskazany dzień. Nazwa pliku w manifeście XML niesie
 * dewelopera i inwestycję, ale liczy się w niej tylko data na końcu, więc
 * `2026-09-16.csv` działa tak samo jak pełna nazwa.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ plik: string }> }) {
  const { plik } = await params;
  const dzien = /(\d{4}-\d{2}-\d{2})\.csv$/.exec(plik)?.[1];
  if (!dzien || !czyZnanyDzien(dzien)) {
    return new Response("Nie ma cennika na ten dzien.\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(cennikCsv(dzien), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `inline; filename="${nazwaPliku(dzien)}"`,
    },
  });
}
