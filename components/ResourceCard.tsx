"use client";

import { Backpack, Church, Clock, ExternalLink, Footprints, Navigation, Phone, Utensils } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { localized, phoneLabel, telHref, type Resource } from "@/lib/resources";
import { formatWalk } from "@/lib/geo";
import { CategoryIcon } from "./NeedIcon";

export function directionsUrl(r: Resource) {
  // Only the place's address is sent, never the visitor's location.
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(r.address)}&travelmode=walking`;
}

export function ResourceCard({
  r,
  num,
  miles,
  minutes,
  compact = false,
}: {
  r: Resource;
  num?: number;
  miles?: number;
  minutes?: number;
  compact?: boolean;
}) {
  const { t, lang } = useApp();
  const tel = telHref(r.phone);
  const hours = localized(r, "hours", lang);
  const services = localized(r, "serviceTimes", lang);
  const notes = localized(r, "notes", lang);
  const bring = localized(r, "bring", lang);

  return (
    <article className={`rounded-3xl border-2 border-line bg-paper ${compact ? "p-4" : "p-5 md:p-6"}`}>
      <div className="flex items-start gap-3">
        {num !== undefined && (
          <span
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-white"
            aria-label={`${num}`}
          >
            {num}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className={`font-bold leading-snug text-ink ${compact ? "text-lg" : "text-xl md:text-2xl"}`}>{r.name}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-muted">
            <span className="inline-flex items-center gap-1">
              <CategoryIcon category={r.category} className="h-4 w-4" />
              {t.categories[r.category]}
            </span>
            {r.servesMeals && (
              <span className="inline-flex items-center gap-1 rounded-full bg-hope-soft px-2 font-semibold text-hope">
                <Utensils className="h-4 w-4" aria-hidden="true" />
                {t.servesMeals}
              </span>
            )}
            {miles !== undefined && minutes !== undefined && (
              <span className="inline-flex items-center gap-1 font-semibold text-ink">
                <Footprints className="h-4 w-4" aria-hidden="true" />
                {formatWalk(miles, minutes, lang)}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className={`mt-4 grid gap-3 ${compact ? "text-base" : "text-lg"}`}>
        <p className="font-semibold">
          <span className="sr-only">{lang === "es" ? "Dirección: " : "Address: "}</span>
          {r.address}
        </p>
        {services && (
          <Row icon={<Church className="h-5 w-5" aria-hidden="true" />} label={t.services}>
            {services}
          </Row>
        )}
        <Row icon={<Clock className="h-5 w-5" aria-hidden="true" />} label={t.hours}>
          {hours}
        </Row>
        {!compact && bring && (
          <Row icon={<Backpack className="h-5 w-5" aria-hidden="true" />} label={t.bring}>
            {bring}
          </Row>
        )}
      </div>
      {!compact && notes && <p className="mt-3 text-base leading-relaxed text-muted">{notes}</p>}

      <div className="mt-4 flex flex-wrap gap-2">
        {tel ? (
          <a
            href={tel}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 text-lg font-bold text-white no-underline hover:bg-primary-dark"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            <span>
              <span className="sr-only">{t.call} </span>
              {phoneLabel(r.phone, lang)}
            </span>
          </a>
        ) : (
          <span className="inline-flex min-h-12 items-center gap-2 rounded-full bg-dawn-soft px-5 text-lg font-semibold text-ink">
            <Phone className="h-5 w-5" aria-hidden="true" />
            {phoneLabel(r.phone, lang)}
          </span>
        )}
        <a
          href={directionsUrl(r)}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-primary px-5 text-lg font-semibold text-primary no-underline hover:bg-primary-soft"
        >
          <Navigation className="h-5 w-5" aria-hidden="true" />
          {t.directions}
        </a>
        {r.website && !compact && (
          <a
            href={r.website}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-12 items-center gap-2 rounded-full px-3 text-base font-semibold"
          >
            {t.website}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
      </div>

      <p className="mt-3 text-sm text-muted">
        {t.lastChecked}: {formatDate(r.lastVerified, lang)}
      </p>
    </article>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="mt-1 text-primary">{icon}</span>
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-muted">{label}</p>
        <p>{children}</p>
      </div>
    </div>
  );
}

export function formatDate(iso: string, lang: "en" | "es") {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(lang === "es" ? "es-US" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
