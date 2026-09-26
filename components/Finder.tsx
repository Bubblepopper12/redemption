"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileText, HandHeart, Lightbulb, Printer, RotateCcw, Search, Trash2 } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { NEEDS, type NeedKey } from "@/lib/resources";
import type { Place } from "@/lib/geo";
import { buildSections, nearestCity, uniqueHits, type Filters } from "@/lib/search";
import { tipFor } from "@/lib/tips";
import { useNow } from "@/lib/use-now";
import { LocationPicker } from "./LocationPicker";
import { NeedIcon } from "./NeedIcon";
import { ResourceCard } from "./ResourceCard";
import { ResultsMap } from "./ResultsMap";
import { HelpSheet } from "./HelpSheet";
import { Hero } from "./Hero";

/** On a shared computer, clear everything after this long with no taps or typing. */
const IDLE_MS = 15 * 60 * 1000;

/**
 * The main "find help" tool.
 * Everything here lives only in this page's memory. The name, the place and
 * the choices disappear when the tab is closed or "Clear my info" is pressed.
 */
export function Finder() {
  const { t, lang, helper } = useApp();
  const now = useNow();
  const [name, setName] = useState("");
  const [place, setPlace] = useState<Place | null>(null);
  const [needs, setNeeds] = useState<NeedKey[]>([]);
  const [view, setView] = useState<"ask" | "results">("ask");
  const [expanded, setExpanded] = useState<Set<NeedKey>>(new Set());
  const [filters, setFilters] = useState<Filters>({});
  const [nudge, setNudge] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const placeStep = useRef<HTMLElement>(null);
  const nameId = useId();

  const city = useMemo(() => nearestCity(place), [place]);
  const sections = useMemo(
    () => buildSections(needs, place, { expanded, filters: helper ? filters : undefined, now: now ?? undefined }),
    [needs, place, expanded, filters, helper, now],
  );
  const hits = useMemo(() => uniqueHits(sections), [sections]);
  const showResults = helper ? needs.length > 0 && !!place : view === "results";
  const hasAnything = !!place || needs.length > 0 || name.length > 0;

  // A leftover "#results" in the address (after a reload) would confuse the Back button.
  useEffect(() => {
    if (window.location.hash === "#results") window.history.replaceState(null, "", window.location.pathname);
  }, []);

  // The browser Back button returns from results to the questions.
  useEffect(() => {
    const onPop = () => {
      if (window.location.hash !== "#results") setView("ask");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (view === "results" && !helper) {
      window.scrollTo({ top: 0 });
      resultsHeading.current?.focus();
    }
  }, [view, helper]);

  // Privacy on shared computers: wipe the name and choices after 15 quiet minutes.
  // Helper mode is skipped, because a volunteer may be talking with someone.
  useEffect(() => {
    if (helper || !hasAnything) return;
    let timer = window.setTimeout(expire, IDLE_MS);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(expire, IDLE_MS);
    };
    function expire() {
      clearAll(t.idleCleared);
    }
    const events = ["pointerdown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [helper, hasAnything, t]);

  function toggleNeed(n: NeedKey) {
    setNudge(null);
    setNeeds((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));
  }

  function changePlace(p: Place | null) {
    setNudge(null);
    setPlace(p);
  }

  function showHelp() {
    if (!place) {
      setNudge(t.needPlace);
      placeStep.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      placeStep.current?.querySelector<HTMLElement>("select, input, button")?.focus({ preventScroll: true });
      return;
    }
    if (needs.length === 0) {
      setNudge(t.pickOne);
      return;
    }
    setExpanded(new Set());
    setView("results");
    if (window.location.hash !== "#results") window.history.pushState(null, "", "#results");
  }

  function goBack() {
    if (window.location.hash === "#results") window.history.back();
    else setView("ask");
  }

  function clearAll(message: string = t.cleared) {
    setName("");
    setPlace(null);
    setNeeds([]);
    setExpanded(new Set());
    setFilters({});
    setNudge(null);
    setView("ask");
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname);
    setNotice(message);
    window.setTimeout(() => setNotice(null), 8000);
    window.scrollTo({ top: 0 });
  }

  const firstName = name.trim().split(/\s+/)[0]?.slice(0, 30) ?? "";

  const printButton = (size: "big" | "small") => (
    <button
      type="button"
      onClick={() => window.print()}
      className={`inline-flex items-center justify-center gap-3 rounded-2xl bg-sun font-extrabold text-ink shadow-md hover:bg-[#e79a24] ${
        size === "big" ? "min-h-20 w-full px-6 text-xl md:w-auto md:px-8 md:text-2xl" : "min-h-14 px-6 text-lg md:text-xl"
      }`}
    >
      <Printer className={size === "big" ? "h-8 w-8" : "h-6 w-6"} aria-hidden="true" />
      {t.printSheet}
    </button>
  );

  const needGrid = (compact: boolean) => (
    <ul className={`grid gap-3 ${compact ? "grid-cols-[repeat(auto-fill,minmax(min(100%,10.25rem),1fr))]" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"}`}>
      {NEEDS.map((n) => {
        const on = needs.includes(n);
        return (
          <li key={n}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => toggleNeed(n)}
              className={`relative flex w-full items-center rounded-2xl border-2 text-left font-bold transition-colors ${
                compact
                  ? "min-h-14 gap-2 px-2.5 text-[0.9rem] leading-tight"
                  : "min-h-28 flex-col justify-center gap-3 px-3 py-4 text-center text-xl"
              } ${on ? "border-primary bg-primary text-white" : "border-line bg-paper text-ink hover:border-primary hover:bg-primary-soft"}`}
            >
              {on && (
                <Check
                  className={`absolute rounded-full bg-white p-0.5 text-primary ${
                    compact ? "-right-1.5 -top-1.5 h-5 w-5 ring-2 ring-primary" : "right-2 top-2 h-6 w-6"
                  }`}
                  aria-hidden="true"
                />
              )}
              <NeedIcon need={n} className={compact ? "h-6 w-6 shrink-0" : "h-10 w-10"} strokeWidth={2} />
              <span className={compact ? "min-w-0" : ""}>{t.needs[n]}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  const nothingNear = !!place && hits.length === 0;

  const results = (
    <div className="grid gap-8">
      {nothingNear ? (
        <p className="rounded-3xl border-2 border-sun bg-dawn p-6 text-xl font-semibold" role="status">
          {t.farAway}{" "}
          <a href="tel:211" className="font-extrabold">
            2-1-1
          </a>
        </p>
      ) : (
        <>
          <ResultsMap
            pins={hits.map((h) => ({ id: h.r.id, num: h.num, lat: h.r.lat, lng: h.r.lng, name: h.r.name, address: h.r.address }))}
            from={place}
            className={helper ? "h-64 md:h-80" : "h-64 md:h-[26rem]"}
            label={t.resultsTitle}
          />
          <p className="-mt-5 text-base text-muted">
            {t.approxMap} {t.walkNote} {t.hoursNote}
          </p>
        </>
      )}
      {sections.map((s) => {
        const tip = tipFor(s.need, city);
        return (
          <section key={s.need} aria-labelledby={`sec-${s.need}`}>
            <h2 id={`sec-${s.need}`} className="mb-4 flex items-center gap-3 text-2xl font-bold text-ink md:text-3xl">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dawn">
                <NeedIcon need={s.need} className="h-7 w-7 text-primary" />
              </span>
              {t.needs[s.need]}
            </h2>
            {tip && (
              <div className="mb-4 flex gap-3 rounded-2xl border-2 border-primary-soft bg-sky p-4 text-lg">
                <Lightbulb className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p>{tip[lang]}</p>
                  {tip.href && (
                    <Link href={tip.href} className="mt-2 inline-flex items-center gap-1 font-bold">
                      {lang === "es" ? tip.linkEs : tip.linkEn}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </div>
            )}
            {s.hits.length === 0 ? (
              !nothingNear && <p className="rounded-2xl bg-dawn-soft p-5 text-lg">{t.noResults}</p>
            ) : (
              <ul className={`grid gap-4 ${helper ? "md:grid-cols-2" : "lg:grid-cols-2"}`}>
                {s.hits.map((h) => (
                  <li key={h.r.id}>
                    <ResourceCard r={h.r} num={h.num} miles={h.miles} minutes={h.minutes} compact={helper} />
                  </li>
                ))}
              </ul>
            )}
            {s.total > s.hits.length && (
              <button
                type="button"
                onClick={() => setExpanded((cur) => new Set(cur).add(s.need))}
                className="mt-4 inline-flex min-h-12 items-center rounded-full border-2 border-primary px-5 text-lg font-semibold text-primary hover:bg-primary-soft"
              >
                {t.showMore} ({s.total - s.hits.length})
              </button>
            )}
          </section>
        );
      })}
    </div>
  );

  const noticeBox = notice && (
    <p role="status" className="mb-4 rounded-xl bg-hope-soft p-3 text-lg font-semibold text-hope">
      {notice}
    </p>
  );

  // ---------- Helper (volunteer / outreach) mode: everything on one fast screen ----------
  if (helper) {
    return (
      <>
        <div className="mx-auto max-w-6xl px-4 pb-32 pt-6 print:hidden">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <h1 className="flex items-center gap-2 text-2xl font-bold text-ink md:text-3xl">
              <HandHeart className="h-8 w-8 text-hope" aria-hidden="true" />
              {t.helperOn}
            </h1>
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap">
              <Link
                href="/handout/"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-paper px-3 py-1.5 text-center text-base leading-tight font-semibold text-primary no-underline hover:bg-primary-soft sm:rounded-full sm:px-4"
              >
                <FileText className="h-5 w-5" aria-hidden="true" />
                {t.helperHandouts}
              </Link>
              <button
                type="button"
                onClick={() => clearAll()}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border-2 border-line bg-paper px-3 py-1.5 text-center text-base leading-tight font-semibold text-muted hover:border-alert hover:text-alert sm:rounded-full sm:px-4"
              >
                <Trash2 className="h-5 w-5" aria-hidden="true" />
                {t.clearInfo}
              </button>
            </div>
          </div>
          <p className="mb-4 max-w-3xl text-base text-muted">{t.helperIntro}</p>
          {noticeBox}

          <div className="divide-y-2 divide-line rounded-3xl border-2 border-line bg-paper">
            <HelperRow n={1} label={t.helperWhere}>
              <LocationPicker place={place} onChange={changePlace} compact />
            </HelperRow>
            <HelperRow n={2} label={t.helperNeeds}>
              {needGrid(true)}
            </HelperRow>
            <HelperRow n={3} label={t.helperName} hint={t.helperNameHint} labelFor={nameId}>
              <input
                id={nameId}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                placeholder={t.namePlaceholder}
                className="min-h-12 w-full rounded-2xl border-2 border-line px-4 text-base focus:border-primary md:max-w-sm"
              />
            </HelperRow>
            <HelperRow label={t.filters}>
              <div className="flex flex-wrap items-center gap-3 text-base">
                <label className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-line px-3">
                  {t.within}
                  <select
                    value={filters.maxMiles ?? ""}
                    onChange={(e) => setFilters((f) => ({ ...f, maxMiles: e.target.value ? Number(e.target.value) : undefined }))}
                    className="min-h-9 rounded-lg bg-paper px-1 font-semibold"
                  >
                    <option value="">{t.any}</option>
                    <option value="1">1 mi</option>
                    <option value="3">3 mi</option>
                    <option value="5">5 mi</option>
                    <option value="10">10 mi</option>
                  </select>
                </label>
                <Toggle checked={!!filters.openNow} onChange={(v) => setFilters((f) => ({ ...f, openNow: v }))} label={t.openOnly} />
                <Toggle checked={!!filters.mealsOnly} onChange={(v) => setFilters((f) => ({ ...f, mealsOnly: v }))} label={t.mealsOnly} />
              </div>
            </HelperRow>
          </div>

          <div className="mt-6">
            {!place ? (
              <p className="rounded-2xl bg-dawn-soft p-4 text-lg">{t.helperNeedPlace}</p>
            ) : needs.length === 0 ? (
              <p className="rounded-2xl bg-dawn-soft p-4 text-lg">{t.helperPickOne}</p>
            ) : (
              results
            )}
          </div>
        </div>

        {showResults && (
          <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-line bg-paper/95 p-3 print:hidden">
            <div className="mx-auto flex max-w-6xl justify-end">{printButton("small")}</div>
          </div>
        )}
        {showResults && <HelpSheet hits={hits} from={place} name={firstName} city={city} needs={needs} />}
      </>
    );
  }

  // ---------- Results ----------
  if (showResults) {
    return (
      <>
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 print:hidden">
          <button
            type="button"
            onClick={goBack}
            className="mb-4 inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-line bg-paper px-5 text-lg font-semibold hover:border-primary"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            {t.back}
          </button>

          {firstName && (
            <p className="text-xl text-muted">
              {t.hello}, <span className="font-bold text-ink">{firstName}</span>. {t.helloWelcome}
            </p>
          )}
          <h1 ref={resultsHeading} tabIndex={-1} className="mt-1 font-serif text-4xl font-bold text-ink outline-none md:text-5xl">
            {t.resultsTitle}
          </h1>
          <p className="mt-2 text-lg text-muted">
            {place ? `${t.youAreNear}: ${place.label}. ` : ""}
            {t.closestFirst}
          </p>

          {!nothingNear && (
            <div className="my-6 flex flex-col gap-2 rounded-3xl bg-dawn p-5 md:flex-row md:items-center md:justify-between">
              <p className="text-lg font-semibold text-ink">{t.printHint}</p>
              {printButton("big")}
            </div>
          )}

          <div className={nothingNear ? "mt-6" : ""}>{results}</div>

          <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl bg-dawn p-5">
            {!nothingNear && (
              <>
                <p className="text-lg font-semibold">{t.printHint}</p>
                {printButton("big")}
              </>
            )}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-primary bg-paper px-5 text-lg font-semibold text-primary"
              >
                <RotateCcw className="h-5 w-5" aria-hidden="true" />
                {t.back}
              </button>
              <button
                type="button"
                onClick={() => clearAll()}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-line bg-paper px-5 text-lg font-semibold text-muted hover:border-alert hover:text-alert"
              >
                <Trash2 className="h-5 w-5" aria-hidden="true" />
                {t.clearInfo}
              </button>
            </div>
          </div>
        </div>
        <HelpSheet hits={hits} from={place} name={firstName} city={city} needs={needs} />
      </>
    );
  }

  // ---------- Questions (the simple 3-step start) ----------
  const showButton = (
    <div className="flex flex-col items-stretch gap-2">
      {nudge && nudge !== t.needPlace && (
        <p role="alert" className="text-center text-lg font-semibold text-alert">
          {nudge}
        </p>
      )}
      <button
        type="button"
        onClick={showHelp}
        className={`inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl px-8 text-2xl font-extrabold ${
          needs.length && place ? "bg-primary text-white hover:bg-primary-dark" : "bg-line text-muted"
        }`}
      >
        <Search className="h-7 w-7" aria-hidden="true" />
        {t.showHelp}
        {needs.length > 0 && <span className="rounded-full bg-white/20 px-3 py-0.5 text-lg">{needs.length}</span>}
      </button>
    </div>
  );

  return (
    <>
      <Hero />
      <div className="mx-auto max-w-4xl px-4 pb-28 print:hidden">
        {noticeBox}

        <Step n={1} title={t.stepName} extra={t.optional}>
          <label htmlFor={nameId} className="sr-only">
            {t.stepName}
          </label>
          <input
            id={nameId}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
            autoCapitalize="words"
            spellCheck={false}
            placeholder={t.namePlaceholder}
            aria-describedby={`${nameId}-help`}
            className="min-h-16 w-full rounded-2xl border-2 border-line bg-paper px-5 text-2xl text-ink placeholder:text-muted focus:border-primary"
          />
          <p id={`${nameId}-help`} className="mt-2 text-base text-muted">
            {t.nameHelp}
          </p>
          {firstName && (
            <p className="mt-3 font-serif text-2xl text-ink" aria-live="polite">
              {t.hello}, <strong>{firstName}</strong>! {t.helloWelcome}
            </p>
          )}
        </Step>

        <Step n={2} title={t.stepWhere} sectionRef={placeStep}>
          <p className="mb-4 text-base text-muted">{t.whereHelp}</p>
          <LocationPicker place={place} onChange={changePlace} />
          {nudge === t.needPlace && (
            <p role="alert" className="mt-3 text-lg font-semibold text-alert">
              {t.needPlace}
            </p>
          )}
        </Step>

        <Step n={3} title={t.stepNeed} extra={t.needHelp}>
          {needGrid(false)}
        </Step>

        <div className="mt-6">{showButton}</div>
        {needs.length > 0 && (
          <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-line bg-paper/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
            <div className="mx-auto flex max-w-4xl flex-col items-stretch">{showButton}</div>
          </div>
        )}
      </div>
    </>
  );
}

function HelperRow({
  n,
  label,
  hint,
  labelFor,
  children,
}: {
  n?: number;
  label: string;
  hint?: string;
  labelFor?: string;
  children: React.ReactNode;
}) {
  const Tag = labelFor ? "label" : "p";
  return (
    <div className="grid gap-3 p-4 md:p-5 lg:grid-cols-[11rem_minmax(0,1fr)] lg:items-start lg:gap-5">
      <div className="lg:pt-2">
        <Tag {...(labelFor ? { htmlFor: labelFor } : {})} className="flex items-center gap-2 text-lg font-bold text-ink">
          {n !== undefined && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sun text-base font-extrabold" aria-hidden="true">
              {n}
            </span>
          )}
          {label}
        </Tag>
        {hint && <p className="mt-1 pl-10 text-sm text-muted">{hint}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border-2 border-line px-3">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-[var(--color-primary)]" />
      {label}
    </label>
  );
}

function Step({
  n,
  title,
  extra,
  children,
  sectionRef,
}: {
  n: number;
  title: string;
  extra?: string;
  children: React.ReactNode;
  sectionRef?: React.Ref<HTMLElement>;
}) {
  return (
    <section
      ref={sectionRef}
      className="mt-8 scroll-mt-4 rounded-[2rem] border-2 border-line bg-paper p-5 shadow-sm md:p-8"
      aria-labelledby={`step-${n}`}
    >
      <h2 id={`step-${n}`} className="mb-4 flex flex-wrap items-center gap-3 text-2xl font-bold text-ink md:text-3xl">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sun text-xl font-extrabold text-ink" aria-hidden="true">
          {n}
        </span>
        {title}
        {extra && <span className="text-lg font-normal text-muted">{extra}</span>}
      </h2>
      {children}
    </section>
  );
}
