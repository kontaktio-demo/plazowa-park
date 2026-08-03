import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Keep every *.vercel.app copy (production alias + preview deploys) out of the
// search index. The canonical domain is plazowa-park.pl; canonical tags already
// point there, and this adds a hard X-Robots-Tag directive as defense-in-depth
// so Google never indexes a duplicate host.
export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const host = req.headers.get("host") || "";
  if (host.endsWith(".vercel.app")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  // Run on document routes only; skip Next internals and static assets.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:webp|jpg|jpeg|png|svg|ico|pdf|xml|txt|webmanifest)).*)",
  ],
};
