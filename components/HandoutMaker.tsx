"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, FileText, Pencil, Printer } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { handoutSheet, handoutUi } from "@/lib/handout-strings";
import { DEVOTIONALS } from "@/lib/devotionals";
import { NEEDS, type NeedKey } from "@/lib/resources";
import type { Place } from "@/lib/geo";
import { buildSections, nearestCity, nearestOfCategory, type Hit } from "@/lib/search";
import { useSiteUrl } from "@/lib/site-url";
import { LocationPicker } from "./LocationPicker";
import { NeedIcon } from "./NeedIcon";
import { HandoutSheet, type HandoutData } from "./HandoutSheet";
import { PageTitle } from "./L";

type LangChoice = "en" | "es" | "both";
type Size = "full" | "half";
const MAX_NEEDS = 4;
/** The sheets are 7.6 inches wide (letter paper minus margins) = 730 CSS pixels. */
const SHEET_PX = 730;

/**
 * For volunteers: answer a few questions, then print flyers to hand out.
 * Nothing typed here is saved or sent anywhere.
 */
export function HandoutMaker() {
  const { lang, t } = useApp();
  const u = handoutUi[lang];
  const siteUrl = useSiteUrl();
  const [place, setPlace] = useState<Place | null>(null);
  const [spot, setSpot] = useState("");
  const [needs, setNeeds] = useState<NeedKey[]>(["food", "shelter", "showers"]);
  const [langChoice, setLangChoice] = useState<LangChoice>(lang);
  const [size, setSize] = useState<Size>("full");
  const [devotionId, setDevotionId] = useState<string>(DEVOTIONALS[0].id);
  const [view, setView] = useState<"ask" | "preview">("ask");
  const [nudge, setNudge] = useState(false);
  const spotId = useId();
  const devId = useId();
  const whereRef = useRef<HTMLElement>(null);
  const previewTop = useRef<HTMLHeadingElement>(null);

  useEffect(() => setLangChoice(lang), [lang]);
  useEffect(() => {
    if (view === "preview") {
      window.scrollTo({ top: 0 });
      previewTop.current?.focus();
    }
  }, [view]);

  const data: HandoutData | null = useMemo(() => {
    if (!place) return null;
    const library = nearestOfCategory("library", place);
    const limit = size === "half" ? 2 : 4;
    const picked: Hit[] = [];
    for (const section of buildSections(needs, place)) {
      const first = section.hits.find((h) => h.r.id !== library?.r.id && !picked.some((p) => p.r.id === h.r.id));
      if (first && picked.length < limit) picked.push(first);
    }
    return {
      from: place,
      spot,
      library,
      places: picked.map((h, i) => ({ ...h, num: i + 2 })),
      city: nearestCity(place),
      devotional: DEVOTIONALS.find((d) => d.id === devotionId) ?? null,
      siteUrl,
    };
  }, [place, spot, needs, size, devotionId, siteUrl]);

  // Which language goes on each printed page.
  const pages: ("en" | "es")[][] = useMemo(() => {
    const langs: ("en" | "es")[] = langChoice === "both" ? ["en", "es"] : [langChoice];
    if (size === "full") return langs.map((l) => [l]);
    return [langs.length === 2 ? langs : [langs[0], langs[0]]];
  }, [langChoice, size]);

  function toggleNeed(n: NeedKey) {
    setNeeds((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : cur.length >= MAX_NEEDS ? cur : [...cur, n]));
  }

  function make() {
    if (!place) {
      setNudge(true);
      whereRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setView("preview");
  }

  if (view === "preview" && data) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-16 pt-8 print:m-0 print:max-w-none print:p-0">
        <div className="print:hidden">
          <h1 ref={previewTop} tabIndex={-1} className="font-serif text-4xl font-bold text-ink outline-none">
            {u.previewTitle}
          </h1>
          <p className="mt-2 text-lg text-muted">
            {u.previewHint} {u.pages(pages.length)}
          </p>
          <div className="my-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex min-h-16 items-center gap-3 rounded-2xl bg-sun px-8 text-2xl font-extrabold text-ink shadow-md hover:bg-[#e79a24]"
            >
              <Printer className="h-7 w-7" aria-hidden="true" />
              {u.print}
            </button>
            <button
              type="button"
              onClick={() => setView("ask")}
              className="inline-flex min-h-16 items-center gap-2 rounded-2xl border-2 border-primary bg-paper px-6 text-xl font-bold text-primary hover:bg-primary-soft"
            >
              <Pencil className="h-6 w-6" aria-hidden="true" />
              {u.change}
            </button>
          </div>
        </div>

        <div className="grid gap-6 print:block">
          {pages.map((sheetLangs, i) => (
            <ScaledPage key={i} last={i === pages.length - 1}>
              {sheetLangs.map((l, j) => (
                <div key={j}>
                  {j > 0 && (
                    <div className="flex h-[0.2in] items-center gap-2 text-[7pt] text-[#555]" aria-hidden="true">
                      <span className="flex-1 border-t border-dashed border-[#777]" />✂ {handoutSheet[l].cut}
                      <span className="flex-1 border-t border-dashed border-[#777]" />
                    </div>
                  )}
                  <HandoutSheet data={data} lang={l} size={size} />
                </div>
              ))}
            </ScaledPage>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <PageTitle en={handoutUi.en.title} es={handoutUi.es.title} introEn={handoutUi.en.intro} introEs={handoutUi.es.intro} />
      <div className="mx-auto max-w-4xl px-4 pb-16 print:hidden">
        <Question n={1} title={u.qWhere} sectionRef={whereRef}>
          <LocationPicker
            place={place}
            onChange={(p) => {
              setNudge(false);
              setPlace(p);
            }}
          />
          <label htmlFor={spotId} className="mt-5 block text-lg font-semibold text-ink">
            {u.qSpot}
          </label>
          <p className="text-base text-muted">{u.qSpotHint}</p>
          <input
            id={spotId}
            value={spot}
            onChange={(e) => setSpot(e.target.value.slice(0, 60))}
            placeholder={u.qSpotPlaceholder}
            autoComplete="off"
            className="mt-2 min-h-14 w-full rounded-2xl border-2 border-line bg-paper px-4 text-xl focus:border-primary"
          />
          {nudge && (
            <p role="alert" className="mt-3 text-lg font-semibold text-alert">
              {u.needPlace}
            </p>
          )}
        </Question>

        <Question n={2} title={u.qNeeds} hint={u.qNeedsHint}>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,10.25rem),1fr))] gap-3">
            {NEEDS.map((n) => {
              const on = needs.includes(n);
              const full = !on && needs.length >= MAX_NEEDS;
              return (
                <li key={n}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleNeed(n)}
                    className={`relative flex min-h-14 w-full items-center gap-2 rounded-2xl border-2 px-2.5 text-left text-[0.9rem] leading-tight font-bold ${
                      on ? "border-primary bg-primary text-white" : full ? "border-line bg-paper text-muted" : "border-line bg-paper text-ink hover:border-primary"
                    }`}
                  >
                    {on && (
                      <Check
                        className="absolute -right-1.5 -top-1.5 h-5 w-5 rounded-full bg-white p-0.5 text-primary ring-2 ring-primary"
                        aria-hidden="true"
                      />
                    )}
                    <NeedIcon need={n} className="h-6 w-6 shrink-0" />
                    <span className="min-w-0">{t.needs[n]}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Question>

        <Question n={3} title={u.qLang}>
          <Choices
            name="handout-lang"
            labelledBy="hq-3"
            value={langChoice}
            onChange={(v) => setLangChoice(v as LangChoice)}
            options={[
              ["en", u.langEn],
              ["es", u.langEs],
              ["both", u.langBoth],
            ]}
          />
        </Question>

        <Question n={4} title={u.qSize}>
          <Choices
            name="handout-size"
            labelledBy="hq-4"
            value={size}
            onChange={(v) => setSize(v as Size)}
            options={[
              ["full", u.sizeFull],
              ["half", u.sizeHalf],
            ]}
          />
        </Question>

        <Question n={5} title={u.qDevotion}>
          <label htmlFor={devId} className="sr-only">
            {u.qDevotion}
          </label>
          <select
            id={devId}
            value={devotionId}
            onChange={(e) => setDevotionId(e.target.value)}
            className="min-h-14 w-full rounded-2xl border-2 border-primary bg-paper px-4 text-xl font-semibold"
          >
            {DEVOTIONALS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title[lang]} — {d.verse.ref[lang]}
              </option>
            ))}
            <option value="none">{u.noDevotion}</option>
          </select>
          {DEVOTIONALS.find((d) => d.id === devotionId) && (
            <blockquote className="mt-3 rounded-2xl bg-dawn-soft p-4 font-serif text-lg italic">
              “{DEVOTIONALS.find((d) => d.id === devotionId)!.verse[lang]}”
            </blockquote>
          )}
        </Question>

        <button
          type="button"
          onClick={make}
          className="mt-8 inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-primary px-8 text-2xl font-extrabold text-white hover:bg-primary-dark"
        >
          <FileText className="h-7 w-7" aria-hidden="true" />
          {u.make}
        </button>
      </div>
    </>
  );
}

/** Shows a letter-size page shrunk to fit the screen; prints at full size. */
function ScaledPage({ children, last }: { children: ReactNode; last: boolean }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const measure = () => {
      if (!outer.current || !inner.current) return;
      const s = Math.min(1, outer.current.clientWidth / SHEET_PX);
      setScale(s);
      setHeight(inner.current.offsetHeight * s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (outer.current) ro.observe(outer.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={outer}
      className={`w-full overflow-hidden rounded-2xl shadow-lg ring-1 ring-line print:overflow-visible print:rounded-none print:shadow-none print:ring-0 ${
        last ? "" : "print:break-after-page"
      }`}
      style={{ height }}
    >
      <div ref={inner} className="origin-top-left print:!transform-none" style={{ width: SHEET_PX, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

function Question({
  n,
  title,
  hint,
  children,
  sectionRef,
}: {
  n: number;
  title: string;
  hint?: string;
  children: ReactNode;
  sectionRef?: React.Ref<HTMLElement>;
}) {
  return (
    <section ref={sectionRef} aria-labelledby={`hq-${n}`} className="mt-8 scroll-mt-4 rounded-[2rem] border-2 border-line bg-paper p-5 shadow-sm md:p-8">
      <h2 id={`hq-${n}`} className="flex flex-wrap items-center gap-3 text-2xl font-bold text-ink md:text-3xl">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sun text-xl font-extrabold" aria-hidden="true">
          {n}
        </span>
        {title}
      </h2>
      {hint && <p className="mt-2 text-base text-muted">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Choices({
  name,
  labelledBy,
  value,
  onChange,
  options,
}: {
  name: string;
  labelledBy: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map(([v, label]) => {
        const on = value === v;
        return (
          <label
            key={v}
            className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-2 text-lg leading-snug font-bold [overflow-wrap:break-word] ${
              on ? "border-primary bg-primary text-white" : "border-line bg-paper text-ink hover:border-primary"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={v}
              checked={on}
              onChange={() => onChange(v)}
              className="h-6 w-6 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-muted bg-paper checked:border-white checked:bg-primary checked:shadow-[inset_0_0_0_4px_white]"
            />
            {label}
          </label>
        );
      })}
    </div>
  );
}
