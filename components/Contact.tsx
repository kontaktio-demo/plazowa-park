"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/data/site";
import { SELECT_UNIT_EVENT } from "@/lib/selectUnit";
import { track } from "@/lib/track";
import SectionHeader from "./SectionHeader";
import WaveEdge from "./WaveEdge";
import { Icon } from "./Icons";

type State = "idle" | "sending" | "ok" | "error";
type Errors = Partial<Record<"name" | "phone" | "email" | "rodo", string>>;

const RE_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Web3Forms odbiera zgłoszenie i przekazuje je na skrzynkę biura sprzedaży.
 * Wysyłka musi iść z przeglądarki: na darmowym planie usługa odrzuca wywołania
 * serwerowe ("Use our API in client side"), więc pośrednik po naszej stronie
 * zwracałby 403 przy każdym leadzie. Klucz jest z założenia publiczny -
 * Web3Forms podaje go we własnych przykładach w kodzie klienta.
 */
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY = "8b25ae77-e757-42ae-9666-cb2f6d7ce657";

function validate(d: Record<string, string>): Errors {
  const e: Errors = {};
  if (!d.name || d.name.trim().length < 2) e.name = "Podaj imię i nazwisko, żebyśmy wiedzieli, z kim rozmawiamy";
  if (!d.phone || d.phone.replace(/\D/g, "").length < 9) e.phone = "Podaj numer telefonu, żebyśmy mogli oddzwonić";
  if (!d.email || !RE_MAIL.test(d.email)) e.email = "Podaj adres e-mail w formacie jan@example.com";
  if (!d.rodo) e.rodo = "Zaznacz zgodę, bez niej nie możemy się odezwać";
  return e;
}

export default function Contact() {
  const [unit, setUnit] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [failed, setFailed] = useState("");

  useEffect(() => {
    const onSelect = (e: Event) => setUnit((e as CustomEvent<string>).detail || "");
    window.addEventListener(SELECT_UNIT_EVENT, onSelect);
    try {
      const q = new URLSearchParams(window.location.search).get("lokal");
      if (q) setUnit(q);
    } catch {
      /* ignore */
    }
    return () => window.removeEventListener(SELECT_UNIT_EVENT, onSelect);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (data.company) return; // honeypot

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    setState("sending");
    setFailed("");
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: data.unit
            ? `Zapytanie o ${data.unit} - ${data.name}`
            : `Zapytanie ze strony Plażowa Park - ${data.name}`,
          from_name: "Plażowa Park",
          replyto: data.email,
          botcheck: "",
          "Imię i nazwisko": data.name,
          Telefon: data.phone,
          "E-mail": data.email,
          Mieszkanie: data.unit || "nie wskazano",
          Wiadomość: data.message || "brak",
          "Zgoda RODO": data.rodo ? "tak" : "nie",
        }),
      });
      const out = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (!res.ok || !out.success) throw new Error("provider");
      track("generate_lead", { unit: String(data.unit || "") });
      setState("ok");
      form.reset();
      setUnit("");
    } catch {
      setFailed("Nie udało się wysłać zgłoszenia. Zadzwoń do nas albo spróbuj ponownie za chwilę.");
      setState("error");
    }
  };

  return (
    <section id="kontakt" className="band band-abyss sec relative">
      <WaveEdge from="var(--color-sand-200)" />

      <div className="wrap grid gap-12 lg:grid-cols-[45fr_55fr] lg:gap-16">
        <div>
          <SectionHeader
            id="kontakt"
            title={
              <>
                Umów prezentację <span className="fg-accent">osiedla</span>
              </>
            }
            lead="Zostaw kontakt albo zadzwoń. Pokażemy dostępne mieszkania i domy, przekażemy cennik i harmonogram."
          />

          <div className="mt-8 flex flex-col sm:mt-10">
            <a href={`tel:${SITE.phone.tel}`} className="bd flex items-center gap-5 border-t py-5 transition-colors hover:text-lake-300">
              <span className="glyph-box">
                <Icon.phone width={20} height={20} />
              </span>
              <span>
                <span className="t-meta-sm fg-muted block">Telefon</span>
                <span className="num font-display mt-1 block text-xl font-semibold">{SITE.phone.display}</span>
              </span>
            </a>
            <a href={`mailto:${SITE.email}`} className="bd flex items-center gap-5 border-t py-5 transition-colors hover:text-lake-300">
              <span className="glyph-box">
                <Icon.mail width={20} height={20} />
              </span>
              <span className="min-w-0">
                <span className="t-meta-sm fg-muted block">E-mail</span>
                <span className="mt-1 block font-medium wrap-break-word">{SITE.email}</span>
              </span>
            </a>
            <div className="bd flex items-center gap-5 border-y py-5">
              <span className="glyph-box">
                <Icon.pin width={20} height={20} />
              </span>
              <span>
                <span className="t-meta-sm fg-muted block">Adres inwestycji</span>
                <span className="mt-1 block font-medium">
                  {SITE.address.street}, {SITE.address.postal} {SITE.address.city}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* formularz - najjaśniejszy punkt najciemniejszej sekcji */}
        <div
          className="border border-lake-700 bg-lake-900 p-6 shadow-[0_0_80px_-20px_var(--color-lake-500)] sm:p-9"
          data-reveal
        >
          {state === "ok" ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <span className="glyph-box border-ok text-ok">
                <Icon.check width={22} height={22} />
              </span>
              <h3 className="t-display-m mt-6">Zgłoszenie przyjęte</h3>
              <p className="t-body fg-muted mt-3 max-w-sm text-pretty">
                Odezwiemy się w ciągu jednego dnia roboczego, na podany numer telefonu.
              </p>
              <button onClick={() => setState("idle")} className="btn btn-ghost btn-sm mt-7">
                Wyślij kolejne zapytanie
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 sm:gap-5">
              <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

              <Field label="Imię i nazwisko" name="name" placeholder="Jan Kowalski" error={errors.name} autoComplete="name" />
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                <Field label="Telefon" name="phone" type="tel" placeholder="600 000 000" error={errors.phone} autoComplete="tel" />
                <Field label="E-mail" name="email" type="email" placeholder="jan@example.com" error={errors.email} autoComplete="email" />
              </div>
              <Field
                label="Wybrane mieszkanie"
                name="unit"
                placeholder="np. Mieszkanie 3.3A"
                optional
                value={unit}
                onChange={setUnit}
              />

              <label className="block">
                <span className="t-meta-sm fg-muted mb-2 block">
                  Wiadomość <span className="opacity-60">opcjonalnie</span>
                </span>
                <textarea name="message" rows={3} placeholder="Interesuje mnie prezentacja i cennik" className="field resize-none" />
              </label>

              <div>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="rodo"
                    aria-invalid={Boolean(errors.rodo)}
                    className="mt-1 h-5 w-5 flex-none accent-[var(--color-sun)]"
                  />
                  <span className="t-body fg-muted">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych w celu kontaktu handlowego zgodnie z{" "}
                    <a href="/polityka-prywatnosci" className="link-underline fg-accent">
                      Polityką prywatności
                    </a>
                    .
                  </span>
                </label>
                {errors.rodo && <p className="t-meta-sm mt-2 text-gone">{errors.rodo}</p>}
              </div>

              {state === "error" && <p className="t-meta-sm text-gone">{failed}</p>}

              <button type="submit" disabled={state === "sending"} className="btn btn-sun w-full disabled:opacity-60">
                {state === "sending" ? "Wysyłanie" : "Wyślij zapytanie"}
                {state !== "sending" && <Icon.arrow width={18} height={18} />}
              </button>
              <p className="t-meta-sm fg-muted text-center">
                Wysyłając, akceptujesz{" "}
                <a href="/regulamin" className="link-underline">
                  Regulamin serwisu
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  error,
  optional,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  optional?: boolean;
  value?: string;
  onChange?: (v: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="t-meta-sm fg-muted mb-2 block">
        {label} {optional && <span className="opacity-60">opcjonalnie</span>}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-err` : undefined}
        {...(onChange ? { value, onChange: (e) => onChange(e.target.value) } : {})}
        className="field"
      />
      {error && (
        <span id={`${name}-err`} className="t-meta-sm mt-2 block text-gone">
          {error}
        </span>
      )}
    </label>
  );
}
