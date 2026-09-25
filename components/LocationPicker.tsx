"use client";

import { useId, useState } from "react";
import { LocateFixed, MapPin, X } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { inTexas, lookupZip, type Place } from "@/lib/geo";
import { CITIES } from "@/lib/cities";

/**
 * Three ways to say where you are. Nothing about the person leaves this computer:
 * the place list is built into the page, the ZIP list is a plain file from this
 * site, and the browser's location is only used right here to measure distance.
 * Nothing is saved.
 */
export function LocationPicker({
  place,
  onChange,
  compact = false,
}: {
  place: Place | null;
  onChange: (p: Place | null) => void;
  compact?: boolean;
}) {
  const { t, lang } = useApp();
  const [zip, setZip] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [zipBusy, setZipBusy] = useState(false);
  const zipId = useId();
  const pickId = useId();
  const msgId = useId();

  function useMyLocation() {
    setMessage(null);
    if (!("geolocation" in navigator)) {
      setMessage(t.locationDenied);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude, longitude } = pos.coords;
        if (!inTexas(latitude, longitude)) {
          setMessage(t.outsideTexas);
          return;
        }
        onChange({ lat: latitude, lng: longitude, label: t.myLocation, approximate: false });
      },
      () => {
        setLocating(false);
        setMessage(t.locationDenied);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 0 },
    );
  }

  async function submitZip(e: React.FormEvent) {
    e.preventDefault();
    const clean = zip.trim().slice(0, 5);
    if (clean.length !== 5) {
      setMessage(t.zipUnknown);
      return;
    }
    setZipBusy(true);
    try {
      const hit = await lookupZip(clean);
      if (!hit) {
        setMessage(t.zipUnknown);
        return;
      }
      setMessage(null);
      onChange({ lat: hit.lat, lng: hit.lng, label: `ZIP ${clean} (${hit.city})`, approximate: true });
    } catch {
      setMessage(t.zipError);
    } finally {
      setZipBusy(false);
    }
  }

  function pickLandmark(id: string) {
    for (const c of CITIES) {
      const lm = c.landmarks.find((l) => l.id === id);
      if (lm) {
        setMessage(null);
        onChange({ lat: lm.lat, lng: lm.lng, label: `${lang === "es" ? lm.es : lm.en}, ${c.name}`, approximate: true });
        return;
      }
    }
  }

  if (place) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-hope bg-hope-soft px-4 py-3" role="status">
        <MapPin className="h-6 w-6 shrink-0 text-hope" aria-hidden="true" />
        <p className="text-lg font-semibold text-ink">
          {t.youAreNear}: {place.label}
        </p>
        <button
          type="button"
          onClick={() => onChange(null)}
          className="ml-auto inline-flex min-h-11 items-center gap-1 rounded-full border-2 border-hope bg-paper px-4 py-1 text-base font-semibold text-hope hover:bg-hope hover:text-white"
        >
          <X className="h-4 w-4" aria-hidden="true" />
          {t.changePlace}
        </button>
      </div>
    );
  }

  const big = compact ? "min-h-12 text-base" : "min-h-16 text-xl";
  // Compact (helper mode): one row on wide screens; on medium screens the list
  // sits on top with ZIP and "Use my location" side by side under it.
  const or = (extra = "") =>
    compact && (
      <span className={`self-center text-center text-sm font-semibold uppercase tracking-wide text-muted ${extra}`} aria-hidden="true">
        {t.or}
      </span>
    );

  return (
    <div
      className={
        compact
          ? "grid items-center gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-3 xl:grid-cols-[minmax(0,1.3fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]"
          : "grid gap-4"
      }
    >
      <div className={compact ? "sm:col-span-3 xl:col-span-1" : ""}>
        <label htmlFor={pickId} className={compact ? "sr-only" : "mb-1 block text-lg font-semibold text-ink"}>
          {t.orPick}
        </label>
        <select
          id={pickId}
          value=""
          onChange={(e) => pickLandmark(e.target.value)}
          className={`w-full rounded-2xl border-2 border-primary bg-paper px-4 font-semibold text-ink focus:border-primary ${big}`}
        >
          <option value="">{t.pickPlace}</option>
          {CITIES.map((c) => (
            <optgroup key={c.id} label={c.name}>
              {c.landmarks.map((l) => (
                <option key={l.id} value={l.id}>
                  {c.name} — {lang === "es" ? l.es : l.en}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {or("sm:col-span-3 xl:col-span-1")}

      <form onSubmit={submitZip} className="flex min-w-0 gap-2">
        <label htmlFor={zipId} className="sr-only">
          {t.zipLabel}
        </label>
        <input
          id={zipId}
          inputMode="numeric"
          autoComplete="off"
          pattern="[0-9]*"
          maxLength={5}
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
          placeholder={compact ? t.zipShort : `${t.zipLabel} · ${t.zipPlaceholder}`}
          aria-describedby={message ? msgId : undefined}
          className={`w-full min-w-0 rounded-2xl border-2 border-line bg-paper px-4 text-ink placeholder:text-muted focus:border-primary ${big}`}
        />
        <button
          type="submit"
          disabled={zipBusy}
          className={`shrink-0 whitespace-nowrap rounded-2xl border-2 border-primary bg-paper px-5 font-bold text-primary hover:bg-primary-soft disabled:opacity-70 ${big}`}
        >
          {zipBusy ? t.zipLooking : t.zipGo}
        </button>
      </form>

      {or()}

      <div>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 font-bold text-white hover:bg-primary-dark disabled:opacity-70 ${compact ? "xl:whitespace-nowrap" : ""} ${big}`}
        >
          <LocateFixed className="h-5 w-5 shrink-0" aria-hidden="true" />
          {locating ? t.finding : t.useLocation}
        </button>
        {!compact && <p className="mt-2 text-base text-muted">{t.locationTip}</p>}
      </div>

      {message && (
        <p id={msgId} role="alert" className={`text-lg font-semibold text-alert ${compact ? "sm:col-span-3 xl:col-span-5" : ""}`}>
          {message}
        </p>
      )}
    </div>
  );
}
