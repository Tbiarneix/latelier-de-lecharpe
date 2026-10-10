"use client";

import React, { useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enGB, es, fr, it } from "date-fns/locale";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { submitReservation, type ReservationPayload } from "@/app/(site)/reservation/actions";
import {
  fromIsoDate,
  getAvailableTimes,
  isDayClosed,
  parisNow,
  toIsoDate,
  type Availability,
} from "@/lib/reservations/availability";
import { LOCALES, type Locale } from "@/lib/reservations/locales";
import type { Formule } from "@/lib/data";
import { LANGUAGE_NAMES, translations } from "./translations";

registerLocale("fr", fr);
registerLocale("en", enGB);
registerLocale("es", es);
registerLocale("it", it);

const field =
  "mt-1 block w-full min-h-11 px-4 py-2 border border-[#597ba8] rounded-md bg-white text-blueDark focus:outline-none focus-visible:ring-2 focus-visible:ring-blueLight focus-visible:ring-offset-2 aria-[invalid=true]:border-redWine aria-[invalid=true]:border-2";
const label = "block text-blueDark font-specialElite text-xl tracking-wide";

type Props = { formules: Formule[]; availability: Availability };

export default function ReservationForm({ formules, availability }: Props) {
  const ids = {
    name: useId(), email: useId(), phone: useId(), covers: useId(), guests: useId(),
    date: useId(), time: useId(), notes: useId(), language: useId(), dateHelp: useId(),
  };
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  const [locale, setLocale] = useState<Locale>("fr");
  const t = translations[locale];

  const [type, setType] = useState<"table" | "group">("table");
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState("");
  const [formulaId, setFormulaId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const today = useMemo(() => fromIsoDate(parisNow().date), []);
  const times = useMemo(() => (date ? getAvailableTimes(date, availability.hours) : []), [date, availability.hours]);

  // Après une erreur, le focus va au premier champ à corriger.
  useEffect(() => {
    if (Object.keys(errors).length) formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
  }, [errors]);

  const err = (name: string) => (errors[name] ? t.errors[errors[name]] ?? t.errors.invalid : undefined);
  const aria = (name: string, extra?: string) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": [errors[name] ? `${name}-error` : null, extra].filter(Boolean).join(" ") || undefined,
  });
  const errorText = (name: string) =>
    err(name) ? (
      <p id={`${name}-error`} className="mt-1 font-semibold text-redWine">
        {err(name)}
      </p>
    ) : null;

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (k: string) => String(data.get(k) ?? "");
    const num = (k: string) => (text(k).trim() === "" ? null : Number(text(k)));

    const payload: ReservationPayload = {
      locale,
      name: text("name"),
      email: text("email"),
      phone: text("phone"),
      type,
      covers: type === "table" ? num("covers") : null,
      formulaId: type === "group" ? formulaId : null,
      guests: type === "group" ? num("guests") : null,
      date: date ?? "",
      time,
      notes: text("notes"),
      website: text("website"),
    };

    setFormError(null);
    startTransition(async () => {
      const result = await submitReservation(payload);
      if (result.ok) {
        setErrors({});
        setSent(true);
        return;
      }
      // Le serveur nomme parfois un champ interne différent de celui du formulaire.
      const named: Record<string, string> = {};
      for (const [k, v] of Object.entries(result.errors)) {
        named[k === "formulaId" ? "formula" : k === "guests" ? "guests" : k] = v;
      }
      setErrors(named);
      if (result.form) setFormError(t.errors[result.form]);
      else if (Object.keys(named).length === 0) setFormError(t.errors.server);
    });
  }

  if (sent) {
    return (
      <div lang={locale} className="flex flex-col lg:flex-row w-full min-h-96 justify-center px-4 items-center lg:space-x-3 text-[#002E6D]">
        <BadgeCheck aria-hidden="true" />
        <p role="status" className="text-xl italic text-center">
          {t.afterSentMessage}
        </p>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0 || formError;

  return (
    <>
      <style jsx global>{`
        .date-past { background-color: #f3f4f6 !important; color: #6b7280 !important; cursor: not-allowed !important; }
        .date-closed { background-color: #fee2e2 !important; color: #991b1b !important; position: relative; }
        .date-closed::after { content: ''; position: absolute; left: 50%; top: 50%; width: 80%; height: 2px; background-color: #991b1b; transform: translate(-50%, -50%) rotate(-45deg); }
        .date-full { background-color: #fca5a5 !important; color: #7f1d1d !important; font-weight: bold !important; }
        .react-datepicker__day--disabled { cursor: not-allowed !important; }
      `}</style>

      <div className="relative flex flex-col lg:flex-row justify-center items-center lg:space-x-20 space-y-8 py-16 bg-cream">
        <form
          ref={formRef}
          onSubmit={onSubmit}
          noValidate
          lang={locale}
          className="space-y-8 lg:w-1/3 w-5/6 z-20"
        >
          <div className="flex items-center justify-between flex-row gap-4 pb-4">
            <h2 className="text-blueDark text-xl sm:text-3xl md:text-4xl lg:text-2xl font-medium font-specialElite leading-none">
              {t.title}
            </h2>
            <div>
              <label htmlFor={ids.language} className="sr-only">
                {t.language}
              </label>
              <select
                id={ids.language}
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
                className="rounded-md border border-blueDark bg-white text-lg px-2 py-1 min-h-11 text-blueDark focus:outline-none focus-visible:ring-2 focus-visible:ring-blueLight focus-visible:ring-offset-2"
              >
                {LOCALES.map((l) => (
                  <option key={l} value={l} lang={l}>
                    {LANGUAGE_NAMES[l]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Piège à robots : invisible et hors parcours clavier. */}
          <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div role="alert" className={hasErrors ? "rounded-md bg-white p-3 font-semibold text-redWine" : "sr-only"}>
            {hasErrors ? formError ?? t.errorSummary : ""}
          </div>

          <div>
            <label htmlFor={ids.name} className={label}>{t.fullNameLabel}</label>
            <input id={ids.name} name="name" type="text" autoComplete="name" required maxLength={100} className={field} {...aria("name")} />
            {errorText("name")}
          </div>

          <div>
            <label htmlFor={ids.email} className={label}>{t.emailLabel}</label>
            <input id={ids.email} name="email" type="email" autoComplete="email" required maxLength={200} className={field} {...aria("email")} />
            {errorText("email")}
          </div>

          <div>
            <label htmlFor={ids.phone} className={label}>{t.phoneLabel}</label>
            <input id={ids.phone} name="phone" type="tel" autoComplete="tel" required className={field} {...aria("phone")} />
            {errorText("phone")}
          </div>

          <fieldset className="space-y-2">
            <legend className="font-specialElite text-blueDark text-xl tracking-wide mb-2">{t.typeLegend}</legend>
            {(["table", "group"] as const).map((v) => (
              <label key={v} className="flex min-h-11 items-center gap-3 font-specialElite text-blueDark text-lg">
                <input
                  type="radio"
                  name="type"
                  value={v}
                  checked={type === v}
                  onChange={() => setType(v)}
                  className="h-6 w-6 shrink-0 accent-blueDark focus-visible:ring-2 focus-visible:ring-blueLight focus-visible:ring-offset-2"
                />
                {v === "table" ? t.clasicTableReservation : t.groupFormulaReservation}
              </label>
            ))}
          </fieldset>

          {type === "table" ? (
            <div>
              <label htmlFor={ids.covers} className={label}>{t.numberOfGuestsLabel}</label>
              <input id={ids.covers} name="covers" type="number" inputMode="numeric" min={1} max={200} required className={field} {...aria("covers")} />
              {errorText("covers")}
            </div>
          ) : (
            <fieldset className="space-y-3">
              <legend className="font-specialElite text-blueDark text-lg pb-2">
                <span className="text-xl tracking-wide">{t.formulaLegend}</span>
                <span className="mt-1 block">{t.formulaSelectorLabel}</span>
              </legend>
              {formules.map((f, i) => (
                <label key={f.id} className="flex min-h-11 items-center gap-3 font-specialElite text-blueDark text-lg">
                  <input
                    type="radio"
                    name="formula"
                    value={f.id}
                    checked={formulaId === f.id}
                    onChange={() => setFormulaId(f.id)}
                    className="h-6 w-6 shrink-0 accent-blueDark"
                    {...(i === 0 ? aria("formula") : {})}
                  />
                  {f.nom} — {f.prix} €
                </label>
              ))}
              {errorText("formula")}
              <div>
                <label htmlFor={ids.guests} className={label}>{t.groupGuestsLabel}</label>
                <input id={ids.guests} name="guests" type="number" inputMode="numeric" min={1} required className={field} {...aria("covers")} />
                {errorText("covers")}
              </div>
            </fieldset>
          )}

          <div>
            <label htmlFor={ids.date} className={label}>{t.eventDateLabel}</label>
            <DatePicker
              id={ids.date}
              name="date"
              selected={date ? fromIsoDate(date) : null}
              onChange={(d: Date | null) => {
                setDate(d ? toIsoDate(d) : null);
                setTime("");
              }}
              filterDate={(d) => {
                const iso = toIsoDate(d);
                return !availability.closedDays.includes(iso) && !isDayClosed(iso, availability);
              }}
              dayClassName={(d) => {
                const iso = toIsoDate(d);
                if (d < today) return "date-past";
                if (availability.closedDays.includes(iso)) return "date-full";
                if (isDayClosed(iso, availability)) return "date-closed";
                return "";
              }}
              dateFormat="dd/MM/yyyy"
              locale={locale}
              minDate={today}
              placeholderText={t.datePlaceholder}
              autoComplete="off"
              wrapperClassName="w-full"
              required
              ariaInvalid={errors.date ? "true" : undefined}
              ariaDescribedBy={[errors.date ? "date-error" : null, ids.dateHelp].filter(Boolean).join(" ")}
              className={field}
            />
            {errorText("date")}

            <ul id={ids.dateHelp} className="mt-3 flex flex-wrap gap-4 text-sm text-blueDark">
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="relative h-4 w-4 rounded border border-red-300 bg-red-100">
                  <span className="absolute left-1/2 top-1/2 h-0.5 w-3/4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-red-900" />
                </span>
                {t.legendClosedDay}
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="h-4 w-4 rounded border border-red-500 bg-red-300" />
                {t.legendFullDay}
              </li>
            </ul>
          </div>

          <div>
            <label htmlFor={ids.time} className={label}>{t.eventTimeLabel}</label>
            <select
              id={ids.time}
              name="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={!date || times.length === 0}
              required
              className={field}
              {...aria("time")}
            >
              <option value="">{!date ? t.selectDateFirst : times.length === 0 ? t.noTimes : t.selectTime}</option>
              {times.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            {errorText("time")}
          </div>

          <div>
            <label htmlFor={ids.notes} className={label}>{t.specialRequestsLabel}</label>
            <textarea id={ids.notes} name="notes" rows={4} maxLength={1000} className={field} {...aria("notes")} />
            {errorText("notes")}
          </div>

          <button
            type="submit"
            disabled={pending}
            aria-disabled={pending}
            className="w-full min-h-11 bg-blueDark rounded-sm py-3 text-lg font-semibold text-mustard hover:bg-mustard hover:text-blueDark duration-300 cursor-pointer font-specialElite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueLight focus-visible:ring-offset-2 disabled:opacity-70"
          >
            {pending ? t.sending : t.submitButton}
          </button>

          <p className="text-sm text-blueDark">
            {t.privacy}{" "}
            <Link href="/confidentialite" className="underline">
              {t.privacyLink}
            </Link>
          </p>
        </form>

        <div className="lg:w-1/3 w-5/6 z-30">
          <img src="/img/info/resume-page-cream.jpg" alt="" className="z-30" />
          <div>
            <img src="/img/deco/12.png" alt="" className="z-30" />
          </div>
        </div>
      </div>
    </>
  );
}
