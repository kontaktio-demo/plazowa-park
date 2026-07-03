"use client";

import { useState } from "react";
import { FAQ } from "@/lib/data/site";
import { Icon } from "./Icons";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-paper py-20 sm:py-28">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <header data-reveal="up" className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-pine">
              Najczęstsze <span className="italic text-brass-deep">pytania.</span>
            </h2>
            <p className="mt-5 max-w-sm text-pretty leading-relaxed text-muted">
              Nie znalazłeś odpowiedzi? Zadzwoń lub napisz — odpowiadamy zwykle w ciągu jednego dnia roboczego.
            </p>
          </header>

          <div className="divide-y divide-ink/10 border-y border-ink/10" data-reveal="up">
            {FAQ.map((f, i) => {
              const active = open === i;
              return (
                <div key={f.q}>
                  <button
                    onClick={() => setOpen(active ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                    aria-expanded={active}
                  >
                    <span className="font-display text-xl text-pine sm:text-2xl">{f.q}</span>
                    <span className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border border-ink/15 text-pine transition-transform duration-300 ${active ? "rotate-45 bg-pine text-paper" : ""}`}>
                      <Icon.plus width={18} height={18} />
                    </span>
                  </button>
                  <div className={`grid overflow-hidden transition-[grid-template-rows] duration-[400ms] ${active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="min-h-0">
                      <p className="max-w-2xl pb-6 text-pretty leading-relaxed text-muted">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
