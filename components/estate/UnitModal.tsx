"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type { Unit } from "@/lib/data/units";
import { plnShort, area, rooms, STATUS_META } from "@/lib/format";
import { SITE } from "@/lib/data/site";
import { unitSlug } from "@/lib/slug";
import { selectUnit } from "@/lib/selectUnit";
import { planImage, unitPlace, unitKind, unitLabel, unitFloors, garageArea, ODMIANA } from "@/lib/unitType";
import { ctaPytanie } from "@/lib/unitCopy";
import { track } from "@/lib/track";
import { SIZES_RZUTU } from "@/lib/wczytaj";
import { wyciszTlo } from "@/lib/wycisz";
import PlanLokalu from "./PlanLokalu";
import { Icon } from "../Icons";

export default function UnitModal({ unit, onClose }: { unit: Unit | null; onClose: () => void }) {
  // Wybór kondygnacji trzymamy razem z lokalem, którego dotyczy. Zerowanie go
  // efektem przy zmianie lokalu wymuszałoby drugie renderowanie modala.
  const [wybor, setWybor] = useState({ id: "", i: 0 });
  const kondygnacja = wybor.id === unit?.id ? wybor.i : 0;
  const oknoRef = useRef<HTMLDivElement>(null);

  // Większość oglądania lokali idzie przez modal, a nie przez ich strony - bez tego
  // statystyka popularności mieszkań pokazywałaby ułamek rzeczywistego zainteresowania.
  useEffect(() => {
    if (!unit) return;
    track("view_lokal", {
      unit: unit.name,
      value: unit.price,
      currency: "PLN",
      status: unit.status,
      zrodlo: "modal",
    });
  }, [unit]);

  /**
   * Focus idzie na przycisk zamknięcia, tło milknie dla czytnika i klawiatury, a po
   * zamknięciu focus wraca na lokal, z którego okno otwarto - chyba że w międzyczasie
   * sam poszedł dalej, na pole formularza kontaktowego. Okno idzie przez portal do body,
   * żeby wyciszenie tła nie objęło samego okna. Dlaczego nie <dialog> ze showModal:
   * lib/wycisz.ts.
   */
  const zamknij = useEffectEvent(onClose);
  const otwarte = unit !== null;
  useEffect(() => {
    const okno = oknoRef.current;
    if (!okno || !otwarte) return;
    const wrocDo = document.activeElement as HTMLElement | null;
    okno.querySelector<HTMLElement>("[data-zamknij]")?.focus();
    const przywroc = wyciszTlo([okno], () => zamknij());
    return () => {
      przywroc();
      if (document.activeElement === document.body || okno.contains(document.activeElement)) {
        wrocDo?.focus({ preventScroll: true });
      }
    };
  }, [otwarte]);

  if (!unit) return null;

  return createPortal(
    <div
      ref={oknoRef}
      role="dialog"
      aria-modal="true"
      aria-label={unitLabel(unit)}
      className="fixed inset-0 z-80 flex items-end justify-center sm:items-center"
    >
      {/* nakładka zamyka okno myszą, ale nie jest przystankiem w kolejności Tab */}
      <button type="button" tabIndex={-1} aria-hidden onClick={onClose} className="okno-lokalu-tlo absolute inset-0 bg-abyss/70" />
      <Tresc unit={unit} kondygnacja={kondygnacja} onKondygnacja={(i) => setWybor({ id: unit.id, i })} onClose={onClose} />
    </div>,
    document.body
  );
}

function Tresc({
  unit,
  kondygnacja,
  onKondygnacja,
  onClose,
}: {
  unit: Unit;
  kondygnacja: number;
  onKondygnacja: (i: number) => void;
  onClose: () => void;
}) {
  const s = STATUS_META[unit.status];
  const place = unitPlace(unit);
  const kind = unitKind(unit);
  const odm = ODMIANA[kind];
  const label = unitLabel(unit);
  const garaz = garageArea(unit);

  const kondygnacje = unitFloors(unit);

  const specs = [
    { l: "Powierzchnia", v: garaz ? `${area(unit.area)} (w tym garaż ${area(garaz)})` : area(unit.area) },
    { l: "Ogród prywatny", v: area(unit.garden) },
    { l: "Liczba pokoi", v: rooms(unit.rooms) },
    { l: "Kondygnacje", v: String(unit.floors) },
    { l: "Budynek", v: place.house },
    { l: "Cena za m²", v: plnShort(unit.pricePerM) },
  ];

  return (
      <div className="okno-lokalu-panel band band-sand relative z-10 max-h-[92svh] w-full max-w-3xl overflow-y-auto overscroll-contain rounded-t-[12px] sm:rounded-[12px]" data-lenis-prevent>
        <div className="grid sm:grid-cols-2">
          <div className="relative aspect-4/3 bg-sand-50 sm:aspect-auto sm:min-h-[420px]">
            {/* Obie kondygnacje leżą jedna na drugiej i przełącznik zmienia tylko
                widoczność. Podmiana src ściągała piętro dopiero po kliknięciu, więc
                przez pół sekundy okno pokazywało pustkę. */}
            {kondygnacje.length ? (
              kondygnacje.map((k, i) => (
                <Image
                  key={k.render}
                  src={k.render}
                  alt={i === kondygnacja ? `${k.nazwa} - rzut ${odm.dopelniacz} ${unit.name}, typ ${place.type}` : ""}
                  fill
                  sizes={SIZES_RZUTU}
                  className={`object-contain p-6 transition-opacity duration-200 ${i === kondygnacja ? "" : "opacity-0"}`}
                />
              ))
            ) : (
              <Image src={planImage(unit)} alt={`Rzut ${odm.dopelniacz} ${unit.name}`} fill sizes={SIZES_RZUTU} className="object-contain p-6" />
            )}
            {kondygnacje.length > 1 && (
              <div className="absolute left-4 top-4 flex gap-2">
                {kondygnacje.map((k, i) => (
                  <button
                    key={k.nazwa}
                    type="button"
                    aria-pressed={i === kondygnacja}
                    onClick={() => onKondygnacja(i)}
                    className="chip bg-surface"
                  >
                    {k.nazwa}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="t-meta-sm fg-muted flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="flex items-center gap-1.5">
                    <span className="status-dot" style={{ background: s.color }} />
                    {s.label}
                  </span>
                  <span className="fg font-medium">{kind === "dom" ? "Dom" : "Mieszkanie"}</span>
                </p>
                <h3 className="t-display-m mt-3">{label}</h3>
              </div>
              <button
                data-zamknij
                onClick={onClose}
                aria-label="Zamknij"
                className="bd-strong flex h-11 w-11 flex-none items-center justify-center border"
              >
                <Icon.close width={18} height={18} />
              </button>
            </div>

            <p className="t-label fg-muted mt-5">Cena</p>
            <div className="t-display-m num mt-1">{plnShort(unit.price)}</div>

            <PlanLokalu unit={unit} className="mt-6" />

            <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4">
              {specs.map((sp) => (
                <div key={sp.l} className="bd min-w-0 border-t pt-3">
                  <dt className="t-label fg-muted">{sp.l}</dt>
                  <dd className="mt-1 font-medium">{sp.v}</dd>
                </div>
              ))}
            </dl>

            <p className="t-body fg-muted mt-6 text-pretty">
              {kind === "dom"
                ? `Dom z garażem w bryle (${area(garaz)} wliczone w metraż), prywatnym ogrodem i tarasem, panoramicznymi oknami i adaptowalnym poddaszem w cenie.`
                : "Mieszkanie z prywatnym ogrodem i tarasem, panoramicznymi oknami i adaptowalnym poddaszem w cenie."}{" "}
              Standard: pompa ciepła, ogrzewanie podłogowe, dwa miejsca postojowe.
            </p>

            <div className="mt-7 flex flex-col gap-2.5">
              <button
                data-track="book_viewing"
                data-miejsce="modal-lokalu"
                data-lokal={unit.name}
                onClick={() => {
                  selectUnit(label);
                  onClose();
                }}
                className="btn btn-sun"
              >
                {ctaPytanie(unit)} <Icon.arrow width={18} height={18} />
              </button>
              <div className="flex gap-2.5">
                <a href={`tel:${SITE.phone.tel}`} className="btn btn-ghost btn-sm flex-1">
                  <Icon.phone width={16} height={16} /> Zadzwoń
                </a>
                {unit.planUrl && (
                  <a
                    href={unit.planUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track="pobranie_rzutu"
                    data-miejsce="modal-lokalu"
                    data-lokal={unit.name}
                    className="btn btn-ghost btn-sm flex-1"
                  >
                    Rzut PDF
                  </a>
                )}
              </div>
            </div>

            <Link href={`/mieszkania-i-domy/${unitSlug(unit.name)}`} className="link-underline t-meta fg-accent mt-5 inline-flex items-center gap-2">
              Pełna strona {ODMIANA[kind].dopelniacz} <Icon.arrow width={15} height={15} />
            </Link>
          </div>
        </div>
      </div>
  );
}
