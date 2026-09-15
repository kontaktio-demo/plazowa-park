import { cennikCsv, dzisiaj, nazwaPliku } from "@/lib/cennik";

// Odpowiedź zależy od bieżącej daty, więc godzina cache wystarczy, żeby plik
// przeskoczył na nowy dzień zaraz po północy i żeby nie liczyć go przy każdym wejściu.
export const revalidate = 3600;

export function GET() {
  const dzien = dzisiaj();
  return new Response(cennikCsv(dzien), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `inline; filename="${nazwaPliku(dzien)}"`,
    },
  });
}
