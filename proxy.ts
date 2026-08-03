import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Only the canonical production domain may be indexed. Every other host that
// serves this deployment - the production alias plazowa-park.vercel.app (which
// runs with VERCEL_ENV=production, so an env check alone would miss it), preview
// / branch deploys, raw *.vercel.app URLs, bare IPs, any future alias - gets a
// hard X-Robots-Tag: noindex. Canonical tags already point at plazowa-park.pl;
// this guarantees Google never indexes a duplicate host. localhost is left
// untouched for local testing.
const INDEXABLE_HOSTS = new Set([
  "plazowa-park.pl",
  "www.plazowa-park.pl",
  "localhost",
  "127.0.0.1",
]);

export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];
  if (!INDEXABLE_HOSTS.has(host)) {
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
