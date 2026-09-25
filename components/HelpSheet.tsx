"use client";

import { useApp } from "@/lib/app-context";
import { localized, phoneLabel } from "@/lib/resources";
import { formatWalk, type Place } from "@/lib/geo";
import type { Hit } from "@/lib/search";
import type { City } from "@/lib/cities";
import type { NeedKey } from "@/lib/resources";
import { shortUrl, useSiteUrl } from "@/lib/site-url";
import { verseOfTheDay } from "@/lib/verses";
import { LogoMark } from "./Logo";
import { DrawnMap } from "./DrawnMap";

/**
 * The one-page paper a person can take with them. It is hidden on screen
 * and appears only when printing. Black and white friendly.
 */
export function HelpSheet({
  hits,
  from,
  name,
  city,
  needs,
}: {
  hits: Hit[];
  from: Place | null;
  name: string;
  city: City | null;
  needs: NeedKey[];
}) {
  const { t, lang } = useApp();
  const site = shortUrl(useSiteUrl());
  const verse = verseOfTheDay();
  const list = hits.slice(0, 8);
  // With many places, leave out the "what to bring" lines so it still fits on one page.
  const compact = list.length > 6 || needs.length > 3;
  const today = new Date().toLocaleDateString(lang === "es" ? "es-US" : "en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <section className="hidden text-black print:block" aria-hidden="true">
      <header className="flex items-center justify-between border-b-2 border-black pb-2">
        <div className="flex items-center gap-2">
          <LogoMark className="h-9 w-9" />
          <div>
            <p className="font-serif text-xl font-bold leading-none">{t.sheetTitle}</p>
            <p className="text-[9pt]">
              {t.siteName}{site ? ` · ${site}` : ""}
            </p>
          </div>
        </div>
        <div className="text-right text-[9.5pt]">
          {name && (
            <p className="font-bold">
              {t.sheetFor}: {name}
            </p>
          )}
          <p>
            {t.sheetMade} {today}
          </p>
          {from && (
            <p>
              {t.sheetStart}: {from.label}
            </p>
          )}
        </div>
      </header>

      <div className="mt-2 grid grid-cols-[55%_1fr] gap-3">
        <DrawnMap pins={list.map((h) => ({ id: h.r.id, num: h.num, lat: h.r.lat, lng: h.r.lng }))} from={from} lang={lang} youLabel={t.mapYou} />
        <div className="flex flex-col gap-2 text-[9.5pt]">
          <div className="rounded border-2 border-black p-2">
            <p className="text-[13pt] font-extrabold leading-tight">2-1-1</p>
            <p>{t.sheet211}</p>
          </div>
          {needs.includes("shelter") && city && (
            <div className="rounded border border-black p-2 text-[8.5pt] leading-snug">
              <p className="font-bold">{t.needs.shelter}</p>
              <p>{city.shelter[lang]}</p>
            </div>
          )}
          <div className="rounded border border-black p-2">
            <p>
              {t.sheetCrisis}
              {city ? ` ${city.crisis.name}: ${city.crisis.phone}.` : ""}
            </p>
            <p className="mt-1 font-bold">{t.footerEmergency}</p>
          </div>
          <blockquote className="mt-auto border-l-4 border-black pl-2 font-serif italic">
            “{verse[lang]}”<span className="not-italic"> — {verse.ref[lang]}</span>
          </blockquote>
        </div>
      </div>

      <ol className={`mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 leading-snug ${compact ? "text-[8pt]" : "text-[9pt]"}`}>
        {list.map((h) => (
          <li key={h.r.id} className="print-avoid-break border-t border-black pt-1">
            <p className="text-[10pt] font-bold">
              {h.num}. {h.r.name}
            </p>
            <p className="font-semibold">{h.r.address}</p>
            <p>
              {t.phone}: {phoneLabel(h.r.phone, lang)}
              {from ? ` · ${formatWalk(h.miles, h.minutes, lang)}` : ""}
            </p>
            {h.r.serviceTimes && (
              <p>
                {t.services}: {localized(h.r, "serviceTimes", lang)}
              </p>
            )}
            <p>
              {t.hours}: {localized(h.r, "hours", lang)}
            </p>
            {!compact && localized(h.r, "bring", lang) && (
              <p>
                {t.bring}: {localized(h.r, "bring", lang)}
              </p>
            )}
          </li>
        ))}
      </ol>

      <p className="mt-2 border-t border-black pt-1 text-center text-[8.5pt]">
        {t.freeForAll} {site ? `${t.sheetVisit} ${site} · ` : ""}{t.walkNote} {t.hoursNote}
      </p>
    </section>
  );
}
