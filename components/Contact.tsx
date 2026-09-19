"use client";

import { useEffect, useRef, useState } from "react";
import { SITE } from "@/lib/data/site";
import { track } from "@/lib/track";
import { UNITS } from "@/lib/data/units";
import SectionHeader from "./SectionHeader";
import WaveEdge from "./WaveEdge";
import { Icon } from "./Icons";

type State = "idle" | "sending" | "ok" | "error";
type Errors = Partial<Record<"name" | "phone" | "email" | "rodo", string>>;

const RE_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Pole "Wybrany lokal" jest tekstowe i domyślnie zawiera "Mieszkanie 2.2B" albo
 * "Dom 3.3A", podczas gdy zdarzenie view_lokal wysyła samą nazwę "2.2B". Bez
 * sprowadzenia do jednej postaci ten sam lokal rozpadłby się w raporcie na dwie
 * wartości i nie dało się zestawić oglądalności z zapytaniami - a to jest jedyne
 * zestawienie, które odpowiada na pytanie, które lokale realnie sprzedają.
 *
 * Wpisy spoza listy lądują jako "inne", pusty wpis jako "nie wskazano" - dokładnie
 * ta sama wartość, która idzie w mailu do biura, żeby wymiar nie zbierał pustek
 * ani losowego tekstu.
 */
function nazwaLokalu(wpis: string): string {
  const czysty = wpis.replace(/^\s*(mieszkanie|dom)\s+/i, "").trim();
  if (!czysty) return "nie wskazano";
  return UNITS.some((u) => u.name === czysty) ? czysty : "inne";
}

/**
 * Web3Forms odbiera zgłoszenie i przekazuje je na skrzynkę biura sprzedaży.
 * Wysyłka musi iść z przeglądarki: na darmowym planie usługa odrzuca wywołania
 * serwerowe ("Use our API in client side"), więc pośrednik po naszej stronie
 * zwracałby 403 przy każdym leadzie. Klucz jest z założenia publiczny -
 * Web3Forms podaje go we własnych przykładach w kodzie klienta.
 */
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY = "8b25ae77-e757-42ae-9666-cb2f6d7ce657";

/**
 * Kolejność pól na ekranie plus nazwy widoczne w interfejsie. Jedno i drugie ma
 * znaczenie: focus po nieudanej walidacji ma iść na pierwsze błędne pole od góry,
 * a w raporcie GA4 ma stać nazwa, którą klientka zrozumie, a nie klucz z kodu.
 */
const POLA = [
  ["name", "Imię i nazwisko"],
  ["phone", "Telefon"],
  ["email", "E-mail"],
  ["rodo", "Zgoda RODO"],
] as const;

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
  const zaczete = useRef(false);
  const potwierdzenie = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state === "ok") potwierdzenie.current?.focus();
  }, [state]);

  // Lokal wskazuje adres, z którym przychodzi się ze strony lokalu: /?lokal=...#kontakt
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search).get("lokal");
      if (q) setUnit(q);
    } catch {
      /* ignore */
    }
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    // Honeypot: bot dostaje ten sam ekran co przy sukcesie, ale nic nie wychodzi.
    // Ciche przerwanie zostawiało człowieka, któremu pole wypełniła wtyczka, przy
    // przycisku, który pozornie nie reaguje.
    if (data.company) {
      setState("ok");
      form.reset();
      setUnit("");
      return;
    }

    const found = validate(data);
    setErrors(found);
    const bledne = POLA.filter(([klucz]) => found[klucz]);
    if (bledne.length) {
      // Same pola, na których ludzie się zacinają - to one decydują, czy formularz skrócić.
      track("blad_formularza", { etykieta: bledne.map(([, nazwa]) => nazwa).join(", ") });
      // Pole bierzemy z obiektu błędów, a nie z aria-invalid w DOM: React nie zdążył
      // jeszcze przemalować atrybutów, więc selektor trafiałby na błąd z poprzedniej
      // próby, a przy pierwszej - nigdzie.
      form.querySelector<HTMLElement>(`[name="${bledne[0][0]}"]`)?.focus();
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
          "Mieszkanie lub dom": data.unit || "nie wskazano",
          Wiadomość: data.message || "brak",
          "Zgoda RODO": data.rodo ? "tak" : "nie",
        }),
      });
      const out = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (!res.ok || !out.success) throw new Error("provider");
      const nazwa = nazwaLokalu(String(data.unit || ""));
      const cena = UNITS.find((u) => u.name === nazwa)?.price;
      track("generate_lead", { unit: nazwa, ...(cena ? { value: cena, currency: "PLN" } : {}) });
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
      <WaveEdge from="var(--color-sand-50)" />

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
            <a href={`tel:${SITE.phone.tel}`} className="bd flex items-center gap-5 border-t py-5 transition-colors hover:text-clay-300">
              <span className="glyph-box">
                <Icon.phone width={20} height={20} />
              </span>
              <span>
                <span className="t-label fg-muted block">Telefon</span>
                <span className="num font-display mt-1 block text-xl font-semibold">{SITE.phone.display}</span>
              </span>
            </a>
            <a href={`mailto:${SITE.email}`} className="bd flex items-center gap-5 border-t py-5 transition-colors hover:text-clay-300">
              <span className="glyph-box">
                <Icon.mail width={20} height={20} />
              </span>
              <span className="min-w-0">
                <span className="t-label fg-muted block">E-mail</span>
                <span className="mt-1 block font-medium wrap-break-word">{SITE.email}</span>
              </span>
            </a>
            <div className="bd flex items-center gap-5 border-t py-5">
              <span className="glyph-box">
                <Icon.pin width={20} height={20} />
              </span>
              <span>
                <span className="t-label fg-muted block">Adres inwestycji</span>
                <span className="mt-1 block font-medium">
                  {SITE.address.street}, {SITE.address.postal} {SITE.address.city}
                </span>
              </span>
            </div>
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noopener noreferrer"
              data-track="klik_facebook"
              data-miejsce="kontakt"
              aria-label="Facebook - fanpage osiedla"
              className="bd flex items-center gap-5 border-y py-5 transition-colors hover:text-clay-300"
            >
              <span className="glyph-box">
                <Icon.facebook width={20} height={20} />
              </span>
              <span>
                <span className="t-label fg-muted block">Facebook</span>
                <span className="mt-1 block font-medium">Fanpage osiedla</span>
              </span>
            </a>
          </div>
        </div>

        {/* formularz - najjaśniejszy punkt najciemniejszej sekcji */}
        <div
          className="bd-strong rounded-(--radius-card) border bg-clay-900 p-6 shadow-[0_30px_70px_-40px_rgba(0,0,0,.85)] sm:p-9"
          data-reveal
        >
          {state === "ok" ? (
            <div role="status" className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <span className="glyph-box border-ok text-ok">
                <Icon.check width={22} height={22} />
              </span>
              {/* focus przenosimy tutaj, bo przycisk wysyłki znika razem z formularzem
                  i użytkownik klawiatury lądowałby na początku dokumentu */}
              <h3 ref={potwierdzenie} tabIndex={-1} className="t-display-m mt-6">
                Zgłoszenie przyjęte
              </h3>
              <p className="t-body fg-muted mt-3 max-w-sm text-pretty">
                Odezwiemy się w ciągu jednego dnia roboczego, na podany numer telefonu.
              </p>
              <button onClick={() => setState("idle")} className="btn btn-ghost btn-sm mt-7">
                Wyślij kolejne zapytanie
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              noValidate
              // Różnica między start_formularza a generate_lead to odsetek porzuceń -
              // bez niej nie wiadomo, czy formularz nie dowozi, czy nikt go nie otwiera.
              onFocusCapture={() => {
                if (zaczete.current) return;
                zaczete.current = true;
                track("start_formularza");
              }}
              className="flex flex-col gap-4 sm:gap-5"
            >
              <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

              <Field label="Imię i nazwisko" name="name" placeholder="Jan Kowalski" error={errors.name} autoComplete="name" />
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                <Field label="Telefon" name="phone" type="tel" placeholder="600 000 000" error={errors.phone} autoComplete="tel" />
                <Field label="E-mail" name="email" type="email" placeholder="jan@example.com" error={errors.email} autoComplete="email" />
              </div>
              <Field
                label="Wybrane mieszkanie lub dom"
                name="unit"
                placeholder="np. Mieszkanie 2.2B albo Dom 3.3A"
                optional
                value={unit}
                onChange={setUnit}
              />

              <label className="block">
                <span className="t-label fg-muted mb-2 block">
                  Wiadomość <span className="opacity-80">opcjonalnie</span>
                </span>
                <textarea name="message" rows={3} placeholder="Interesuje mnie prezentacja i cennik" className="field resize-none" />
              </label>

              <div>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="rodo"
                    aria-invalid={Boolean(errors.rodo)}
                    aria-describedby={errors.rodo ? "rodo-err" : undefined}
                    className="checkbox mt-0.5"
                  />
                  <span className="t-body fg-muted">
                    Wyrażam zgodę na przetwarzanie moich danych osobowych w celu kontaktu handlowego zgodnie z{" "}
                    <a href="/polityka-prywatnosci" className="link-underline fg-accent">
                      Polityką prywatności
                    </a>
                    .
                  </span>
                </label>
                {errors.rodo && (
                  <p id="rodo-err" role="alert" className="field-error mt-2">
                    {errors.rodo}
                  </p>
                )}
              </div>

              {state === "error" && (
                <p role="alert" className="field-error">
                  {failed}
                </p>
              )}

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
      <span className="t-label fg-muted mb-2 block">
        {label} {optional && <span className="opacity-80">opcjonalnie</span>}
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
        <span id={`${name}-err`} role="alert" className="field-error mt-2">
          {error}
        </span>
      )}
    </label>
  );
}
