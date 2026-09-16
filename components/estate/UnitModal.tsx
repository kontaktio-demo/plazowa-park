"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type { Unit } from "@/lib/data/units";
import { plnShort, area, rooms, STATUS_META } from "@/lib/format";
import { SITE } from "@/lib/data/site";
import { unitSlug } from "@/lib/slug";
import { selectUnit } from "@/lib/selectUnit";
import { planImage, unitPlace, unitKind, unitLabel, unitFloors, garageArea, ODMIANA } from "@/lib/unitType";
import { track } from "@/lib/track";
import UnitPosition from "./UnitPosition";
import { Icon } from "../Icons";

export default function UnitModal({ unit, onClose }: { unit: Unit | null; onClose: () => void }) {
  // Wybór kondygnacji trzymamy razem z lokalem, którego dotyczy. Zerowanie go
  // efektem przy zmianie lokalu wymuszałoby drugie renderowanie modala.
  const [wybor, setWybor] = useState({ id: "", i: 0 });
  const kondygnacja = wybor.id === unit?.id ? wybor.i : 0;
  const oknoRef = useRef<HTMLDivElement>(null);
  const zamknijRef = useRef<HTMLButtonElement>(null);

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
   * Modal deklarował aria-modal, ale focus zostawał na karcie pod nakładką: Tab
   * wędrował po tle, a po zamknięciu przepadał na body. Tło dostaje inert (modal
   * idzie przez portal do body, żeby nie wyłączyć samego siebie), Tab krąży
   * wewnątrz, a focus wraca na przycisk, który modal otworzył - chyba że w
   * międzyczasie sam poszedł dalej, na pole formularza kontaktowego.
   */
  useEffect(() => {
    if (!unit) return;
    const okno = oknoRef.current;
    const wrocDo = document.activeElement as HTMLElement | null;
    const tlo = Array.from(document.body.children).filter((el) => el !== okno && !el.hasAttribute("inert"));
    tlo.forEach((el) => el.setAttribute("inert", ""));
    zamknijRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab" || !okno) return;
      const f = okno.querySelectorAll<HTMLElement>('a[href], button:not([disabled]):not([tabindex="-1"])');
      if (!f.length) return;
      const brzeg = e.shiftKey ? f[0] : f[f.length - 1];
      if (document.activeElement !== brzeg) return;
      e.preventDefault();
      (e.shiftKey ? f[f.length - 1] : f[0]).focus();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      tlo.forEach((el) => el.removeAttribute("inert"));
      if (document.activeElement === document.body) wrocDo?.focus({ preventScroll: true });
    };
  }, [unit, onClose]);

  if (!unit) return null;
  const s = STATUS_META[unit.status];
  const place = unitPlace(unit);
  const kind = unitKind(unit);
  const odm = ODMIANA[kind];
  const label = unitLabel(unit);
  const garaz = garageArea(unit);

  const kondygnacje = unitFloors(unit);
  const aktywna = kondygnacje[kondygnacja] ?? kondygnacje[0];

  const specs = [
    { l: "Powierzchnia", v: garaz ? `${area(unit.area)} (w tym garaż ${area(garaz)})` : area(unit.area) },
    { l: "Ogród prywatny", v: area(unit.garden) },
    { l: "Liczba pokoi", v: rooms(unit.rooms) },
    { l: "Kondygnacje", v: String(unit.floors) },
    { l: "Budynek", v: unit.buildingLabel },
    { l: "Cena za m²", v: plnShort(unit.pricePerM) },
  ];

  return createPortal(
    <div
      ref={oknoRef}
      className="fixed inset-0 z-80 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      {/* nakładka zamyka modal myszą, ale nie jest przystankiem w kolejności Tab:
          jej obwódka focusu i tak leżałaby poza ekranem */}
      <button type="button" tabIndex={-1} aria-hidden onClick={onClose} className="absolute inset-0 bg-abyss/70 backdrop-blur-sm" />
      <div className="band band-sand relative z-10 max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-t-[12px] sm:rounded-[12px]">
        <div className="grid sm:grid-cols-2">
          <div className="relative aspect-4/3 bg-sand-50 sm:aspect-auto sm:min-h-[420px]">
            <Image
              src={aktywna?.render ?? planImage(unit)}
              alt={`${aktywna?.nazwa ?? "Parter"} - rzut ${odm.dopelniacz} ${unit.name}, typ ${place.type}`}
              fill
              sizes="(max-width: 640px) 100vw, 384px"
              className="object-contain p-6"
            />
            {kondygnacje.length > 1 && (
              <div className="absolute left-4 top-4 flex gap-2">
                {kondygnacje.map((k, i) => (
                  <button
                    key={k.nazwa}
                    type="button"
                    aria-pressed={i === kondygnacja}
                    onClick={() => setWybor({ id: unit.id, i })}
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
                ref={zamknijRef}
                onClick={onClose}
                aria-label="Zamknij"
                className="bd-strong flex h-11 w-11 flex-none items-center justify-center border"
              >
                <Icon.close width={18} height={18} />
              </button>
            </div>

            <p className="t-label fg-muted mt-5">Cena</p>
            <div className="t-display-m num mt-1">{plnShort(unit.price)}</div>

            <UnitPosition unit={unit} className="mt-6 max-w-[13rem]" />

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
                Zapytaj o {odm.wskazujacy} <Icon.arrow width={18} height={18} />
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
    </div>,
    document.body
  );
}
