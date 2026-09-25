"use client";

import { useApp } from "@/lib/app-context";
import { localized, phoneLabel } from "@/lib/resources";
import { formatWalk, type Place } from "@/lib/geo";
import type { Hit } from "@/lib/search";
import { verseOfTheDay } from "@/lib/verses";
import { LogoMark } from "./Logo";
import { PrintMap } from "./PrintMap";

export const SITE_URL_SHORT = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://redemption.com").replace(/^https?:\/\//, "").replace(/\/$/, "");

/**
 * The one-page paper a person can take with them. It is hidden on screen
 * and appears only when printing. Black and white friendly.
 */
export function HelpSheet({ hits, from, name }: { hits: Hit[]; from: Place | null; name: string }) {
  const { t, lang } = useApp();
  const verse = verseOfTheDay();
  const list = hits.slice(0, 8);
  const today = new Date().toLocaleDateString(lang === "es" ? "es-US" : "en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <section className="hidden text-black print:block" aria-hidden="true">
      <header className="flex items-center justify-between border-b-2 border-black pb-2">
        <div className="flex items-center gap-2">
          <LogoMark className="h-9 w-9" />
          <div>
            <p className="font-serif text-xl font-bold leading-none">{t.sheetTitle}</p>
            <p className="text-[9pt]">
              {t.siteName} · {SITE_URL_SHORT}
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
        <PrintMap hits={list} from={from} lang={lang} youLabel={t.mapYou} />
        <div className="flex flex-col gap-2 text-[9.5pt]">
          <div className="rounded border-2 border-black p-2">
            <p className="text-[13pt] font-extrabold leading-tight">2-1-1</p>
            <p>{t.sheet211}</p>
          </div>
          <div className="rounded border border-black p-2">
            <p>{t.sheetCrisis}</p>
            <p className="mt-1 font-bold">{t.footerEmergency}</p>
          </div>
          <blockquote className="mt-auto border-l-4 border-black pl-2 font-serif italic">
            “{verse[lang]}”<span className="not-italic"> — {verse.ref[lang]}</span>
          </blockquote>
        </div>
      </div>

      <ol className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[9pt] leading-snug">
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
            {localized(h.r, "bring", lang) && (
              <p>
                {t.bring}: {localized(h.r, "bring", lang)}
              </p>
            )}
          </li>
        ))}
      </ol>

      <p className="mt-2 border-t border-black pt-1 text-center text-[8.5pt]">
        {t.freeForAll} {t.sheetVisit} {SITE_URL_SHORT} · {t.walkNote}
      </p>
    </section>
  );
}
