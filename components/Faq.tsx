"use client";

import { useState } from "react";
import { FAQ } from "@/lib/data/site";
import SectionHeader from "./SectionHeader";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="band band-sand-2 sec">
      <div className="wrap grid gap-10 lg:grid-cols-[35fr_65fr] lg:gap-16">
        <SectionHeader
          id="faq"
          title={
            <>
              Zanim <span className="fg-accent">zapytasz</span>
            </>
          }
          lead="Nie znalazłeś odpowiedzi? Zadzwoń lub napisz, odpowiadamy zwykle w ciągu jednego dnia roboczego."
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <div className="bd border-t" data-reveal>
          {FAQ.map((f, i) => {
            const active = open === i;
            return (
              <div key={f.q} className="bd border-b">
                <button
                  onClick={() => setOpen(active ? null : i)}
                  className="flex w-full items-start justify-between gap-6 py-4 text-left sm:py-5"
                  aria-expanded={active}
                >
                  <span className="t-title">{f.q}</span>
                  <span className="relative mt-1.5 h-4 w-4 flex-none" aria-hidden>
                    <span className="fg-accent absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                    <span
                      className={`fg-accent absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-300 ${
                        active ? "scale-y-0" : "scale-y-100"
                      }`}
                    />
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out-expo)] ${
                    active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="t-body fg-muted max-w-2xl pb-6 text-pretty">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
