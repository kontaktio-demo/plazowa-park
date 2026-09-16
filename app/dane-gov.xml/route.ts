import { manifestXml } from "@/lib/cennik";

// Bez cache, bo suma kontrolna w /dane-gov.md5 musi opisywać dokładnie te bajty,
// które portal właśnie pobrał. Przy osobnych oknach cache manifest i hash mogłyby
// pochodzić z dwóch różnych dób i import by nie przeszedł. Złożenie pliku to czysta
// funkcja z danych w buildzie, a portal pyta raz na dobę.
export const dynamic = "force-dynamic";

export function GET() {
  return new Response(manifestXml(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
