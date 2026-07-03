"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/data/site";
import { INVESTMENT } from "@/lib/data/units";
import { SELECT_UNIT_EVENT } from "@/lib/selectUnit";
import { Icon } from "./Icons";

type State = "idle" | "sending" | "ok" | "error";

export default function Contact() {
  const [unit, setUnit] = useState("");
  const [state, setState] = useState<State>("idle");
  const [err, setErr] = useState("");

  useEffect(() => {
    const onSelect = (e: Event) => setUnit((e as CustomEvent<string>).detail || "");
    window.addEventListener(SELECT_UNIT_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_UNIT_EVENT, onSelect);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("sending");
    setErr("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (data.company) return; // honeypot
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Błąd wysyłki");
      setState("ok");
      form.reset();
      setUnit("");
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Spróbuj ponownie");
      setState("error");
    }
  };

  return (
    <section id="kontakt" className="bg-paper-2 py-20 sm:py-28">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* info */}
          <div data-reveal="up">
            <p className="eyebrow">Kontakt</p>
            <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.4rem)] text-pine">
              Umów prezentację <span className="italic text-brass-deep">osiedla.</span>
            </h2>
            <p className="mt-5 max-w-md text-pretty leading-relaxed text-muted">
              Zostaw kontakt lub zadzwoń — pokażemy dostępne apartamenty, przekażemy cennik i harmonogram.
              Odpowiadamy zwykle w ciągu jednego dnia roboczego.
            </p>

            <div className="mt-9 space-y-3">
              <a href={`tel:${SITE.phone.tel}`} className="flex items-center gap-4 rounded-[14px] border border-ink/10 bg-paper p-4 transition-colors hover:border-pine/30">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pine/8 text-pine"><Icon.phone width={20} height={20} /></span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.12em] text-faint">Telefon</span>
                  <span className="font-display text-xl text-pine num">{SITE.phone.display}</span>
                </span>
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-4 rounded-[14px] border border-ink/10 bg-paper p-4 transition-colors hover:border-pine/30">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pine/8 text-pine"><Icon.mail width={20} height={20} /></span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.12em] text-faint">E-mail</span>
                  <span className="font-medium text-ink">{SITE.email}</span>
                </span>
              </a>
              <div className="flex items-center gap-4 rounded-[14px] border border-ink/10 bg-paper p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pine/8 text-pine"><Icon.pin width={20} height={20} /></span>
                <span>
                  <span className="block text-xs uppercase tracking-[0.12em] text-faint">Adres inwestycji</span>
                  <span className="font-medium text-ink">{SITE.address.street}, {SITE.address.postal} {SITE.address.city}</span>
                </span>
              </div>
            </div>
          </div>

          {/* form */}
          <div className="card grain relative overflow-hidden p-6 sm:p-8" data-reveal="up">
            {state === "ok" ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-available/15 text-available">
                  <Icon.check width={32} height={32} />
                </span>
                <h3 className="mt-5 font-display text-3xl text-pine">Dziękujemy!</h3>
                <p className="mt-2 max-w-sm text-muted">
                  Twoja wiadomość została wysłana. Skontaktujemy się z Tobą wkrótce, zwykle w ciągu jednego dnia roboczego.
                </p>
                <button onClick={() => setState("idle")} className="btn btn-ghost mt-6 !py-2.5 text-sm">
                  Wyślij kolejne zapytanie
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                <Field label="Imię i nazwisko" name="name" required placeholder="Jan Kowalski" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Telefon" name="phone" type="tel" required placeholder="600 000 000" />
                  <Field label="E-mail" name="email" type="email" required placeholder="jan@example.com" />
                </div>
                <Field label="Wybrany apartament (opcjonalnie)" name="unit" value={unit} onChange={setUnit} placeholder="np. Apartament 3.3A" />
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink-soft">Wiadomość (opcjonalnie)</span>
                  <textarea name="message" rows={3} placeholder="Interesuje mnie prezentacja i cennik…" className="w-full resize-none rounded-[12px] border border-ink/15 bg-paper px-4 py-3 text-ink placeholder:text-faint focus:border-pine focus:outline-none" />
                </label>
                <label className="flex items-start gap-3 text-sm text-muted">
                  <input type="checkbox" name="rodo" required className="mt-1 h-4 w-4 flex-none accent-[var(--color-pine)]" />
                  <span>
                    Wyrażam zgodę na przetwarzanie moich danych osobowych w celu kontaktu handlowego zgodnie z{" "}
                    <a href="/polityka-prywatnosci" className="link-underline text-ink-soft">Polityką prywatności</a>. *
                  </span>
                </label>

                {state === "error" && <p className="text-sm text-sold">{err || "Wystąpił błąd. Spróbuj ponownie."}</p>}

                <button type="submit" disabled={state === "sending"} className="btn btn-primary w-full disabled:opacity-60">
                  {state === "sending" ? "Wysyłanie…" : "Wyślij zapytanie"}
                  {state !== "sending" && <Icon.arrow width={18} height={18} />}
                </button>
                <p className="text-center text-xs text-faint">
                  Klikając „Wyślij”, akceptujesz{" "}
                  <a href="/regulamin" className="link-underline">Regulamin serwisu</a>. Pola oznaczone * są wymagane.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, name, type = "text", required, placeholder, value, onChange,
}: {
  label: string; name: string; type?: string; required?: boolean; placeholder?: string;
  value?: string; onChange?: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-soft">
        {label} {required && <span className="text-brass-deep">*</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        {...(onChange ? { value, onChange: (e) => onChange(e.target.value) } : {})}
        className="w-full rounded-[12px] border border-ink/15 bg-paper px-4 py-3 text-ink placeholder:text-faint focus:border-pine focus:outline-none"
      />
    </label>
  );
}
