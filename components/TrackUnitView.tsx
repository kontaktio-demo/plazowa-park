"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

// Wysyła zdarzenie GA4 view_lokal przy wejściu na podstronę lokalu (komponent
// serwerowy nie może wywołać track bezpośrednio). Odpowiednik GA4 view_item.
export default function TrackUnitView({
  unit,
  price,
  status,
}: {
  unit: string;
  price: number;
  status: string;
}) {
  useEffect(() => {
    track("view_lokal", { unit, price, status });
  }, [unit, price, status]);
  return null;
}
