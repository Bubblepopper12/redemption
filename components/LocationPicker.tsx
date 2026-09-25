"use client";

import { useId, useState } from "react";
import { LocateFixed, MapPin, X } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { LANDMARKS, ZIPS, type Place } from "@/lib/geo";

/**
 * Three ways to say where you are. Nothing leaves this computer:
 * the ZIP and landmark lists are built into the page, and the browser's
 * location is only used right here to measure distance. Nothing is saved.
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
        onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: t.myLocation, approximate: false });
      },
      () => {
        setLocating(false);
        setMessage(t.locationDenied);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 0 },
    );
  }

  function submitZip(e: React.FormEvent) {
    e.preventDefault();
    const clean = zip.trim().slice(0, 5);
    const hit = ZIPS[clean];
    if (!hit) {
      setMessage(t.zipUnknown);
      return;
    }
    setMessage(null);
    onChange({ lat: hit[0], lng: hit[1], label: `ZIP ${clean}`, approximate: true });
  }

  function pickLandmark(id: string) {
    const lm = LANDMARKS.find((l) => l.id === id);
    if (!lm) return;
    setMessage(null);
    onChange({ lat: lm.lat, lng: lm.lng, label: lang === "es" ? lm.es : lm.en, approximate: true });
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

  return (
    <div className={compact ? "grid gap-3 md:grid-cols-3" : "grid gap-4"}>
      <button
        type="button"
        onClick={useMyLocation}
        disabled={locating}
        className={`inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 font-bold text-white hover:bg-primary-dark disabled:opacity-70 ${big}`}
      >
        <LocateFixed className="h-6 w-6" aria-hidden="true" />
        {locating ? t.finding : t.useLocation}
      </button>

      <form onSubmit={submitZip} className="flex gap-2">
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
          placeholder={compact ? t.zipPlaceholder : `${t.zipLabel} · ${t.zipPlaceholder}`}
          aria-describedby={message ? msgId : undefined}
          className={`w-full min-w-0 rounded-2xl border-2 border-line bg-paper px-4 text-ink placeholder:text-muted focus:border-primary ${big}`}
        />
        <button
          type="submit"
          className={`rounded-2xl border-2 border-primary bg-paper px-5 font-bold text-primary hover:bg-primary-soft ${big}`}
        >
          {t.zipGo}
        </button>
      </form>

      <div>
        <label htmlFor={pickId} className={compact ? "sr-only" : "mb-1 block text-lg font-semibold text-ink"}>
          {t.orPick}
        </label>
        <select
          id={pickId}
          value=""
          onChange={(e) => pickLandmark(e.target.value)}
          className={`w-full rounded-2xl border-2 border-line bg-paper px-4 text-ink focus:border-primary ${big}`}
        >
          <option value="">{t.pickPlace}</option>
          {LANDMARKS.map((l) => (
            <option key={l.id} value={l.id}>
              {lang === "es" ? l.es : l.en}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <p id={msgId} role="alert" className="text-lg font-semibold text-alert md:col-span-3">
          {message}
        </p>
      )}
    </div>
  );
}
