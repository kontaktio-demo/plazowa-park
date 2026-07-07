"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/track";
import { Icon } from "./Icons";

const KEY = "pp-exit-shown-v1";

export default function ExitIntent() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "ok">("idle");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch {
      /* ignore */
    }
    let armed = true;
    const trigger = () => {
      if (!armed) return;
      armed = false;
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
      setOpen(true);
      track("exit_intent_shown");
      cleanup();
    };
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };
    // desktop: leaving toward the top; mobile/others: gentle fallback timer
    document.addEventListener("mouseout", onMouseOut);
    const timer = window.setTimeout(trigger, 75000);
    function cleanup() {
      document.removeEventListener("mouseout", onMouseOut);
      window.clearTimeout(timer);
    }
    return cleanup;
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("sending");
    const fd = new FormData(e.currentTarget);
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Prośba o cennik",
          email: String(fd.get("email") || ""),
          message: "Zapytanie o cennik i kartę osiedla (exit-intent).",
        }),
      });
    } catch {
      /* still acknowledge */
    }
    track("generate_lead", { source: "exit_intent" });
    setState("ok");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-pine-deep/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="grain relative z-10 w-full max-w-lg overflow-hidden rounded-[18px] bg-paper shadow-[var(--shadow-lift)]">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/renders/render-01b.webp" alt="Apartament Plażowa Park" className="h-40 w-full object-cover object-[center_60%]" />
          <button onClick={() => setOpen(false)} aria-label="Zamknij" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink hover:bg-paper">
            <Icon.close width={18} height={18} />
          </button>
        </div>
        <div className="p-6 sm:p-8">
          {state === "ok" ? (
            <div className="py-4 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-available/15 text-available">
                <Icon.check width={28} height={28} />
              </span>
              <h3 className="mt-4 font-display text-2xl text-pine">Dziękujemy!</h3>
              <p className="mt-2 text-muted">Skontaktujemy się z Tobą i prześlemy aktualny cennik oraz kartę osiedla.</p>
              <button onClick={() => setOpen(false)} className="btn btn-ghost mt-5 !py-2.5 text-sm">Zamknij</button>
            </div>
          ) : (
            <>
              <p className="eyebrow">Zanim wyjdziesz</p>
              <h3 className="mt-3 font-display text-[1.9rem] leading-tight text-pine">
                Odbierz cennik <span className="italic text-brass-deep">i kartę osiedla.</span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Zostaw e-mail - prześlemy aktualne ceny 20 apartamentów, metraże i plan osiedla Plażowa Park.
              </p>
              <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Twój e-mail"
                  className="flex-1 rounded-[12px] border border-ink/15 bg-paper px-4 py-3 text-ink placeholder:text-faint focus:border-pine focus:outline-none"
                />
                <button type="submit" disabled={state === "sending"} className="btn btn-primary disabled:opacity-60">
                  {state === "sending" ? "Wysyłanie..." : "Wyślij cennik"}
                </button>
              </form>
              <p className="mt-3 text-xs text-faint">
                Zapisując się, akceptujesz{" "}
                <Link href="/polityka-prywatnosci" className="link-underline">Politykę prywatności</Link>.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
