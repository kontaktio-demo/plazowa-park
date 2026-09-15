import { manifestXml } from "@/lib/cennik";

// Manifest dostaje co dobę nowy zasób, więc nie może zastygnąć na deployu.
export const revalidate = 3600;

export function GET() {
  return new Response(manifestXml(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
