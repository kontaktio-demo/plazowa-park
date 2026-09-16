import { createHash } from "node:crypto";
import { manifestXml } from "@/lib/cennik";

/**
 * Suma kontrolna manifestu. Portal dane.gov.pl pobiera ją spod tego samego adresu
 * co plik XML, tylko z rozszerzeniem .md5, i bez niej nie uruchomi automatycznego
 * importu. Litery muszą być małe - portal porównuje hash znak po znaku.
 */
export const dynamic = "force-dynamic";

export function GET() {
  const hash = createHash("md5").update(manifestXml(), "utf8").digest("hex");
  return new Response(hash, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
