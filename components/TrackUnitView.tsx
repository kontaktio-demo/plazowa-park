"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

// Fires a GA4 view_lokal event when a unit subpage mounts (server component
// can't call track directly). Analogous to GA4 view_item.
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
