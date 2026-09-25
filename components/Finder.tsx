"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Printer, RotateCcw, Search, Trash2 } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { NEEDS, type NeedKey } from "@/lib/resources";
import type { Place } from "@/lib/geo";
import { buildSections, uniqueHits, type Filters } from "@/lib/search";
import { LocationPicker } from "./LocationPicker";
import { NeedIcon } from "./NeedIcon";
import { ResourceCard } from "./ResourceCard";
import { ResultsMap } from "./ResultsMap";
import { HelpSheet } from "./HelpSheet";
import { Hero } from "./Hero";

/**
 * The main "find help" tool.
 * Everything here lives only in this page's memory. The name, the place and
 * the choices disappear when the tab is closed or "Clear my info" is pressed.
 */
export function Finder() {
  const { t, helper } = useApp();
  const [name, setName] = useState("");
  const [place, setPlace] = useState<Place | null>(null);
  const [needs, setNeeds] = useState<NeedKey[]>([]);
  const [view, setView] = useState<"ask" | "results">("ask");
  const [expanded, setExpanded] = useState<Set<NeedKey>>(new Set());
  const [filters, setFilters] = useState<Filters>({});
  const [nudge, setNudge] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const nameId = useId();

  const sections = useMemo(
    () => buildSections(needs, place, { expanded, filters: helper ? filters : undefined }),
    [needs, place, expanded, filters, helper],
  );
  const hits = useMemo(() => uniqueHits(sections), [sections]);
  const showResults = helper ? needs.length > 0 : view === "results";

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

  function toggleNeed(n: NeedKey) {
    setNudge(false);
    setNeeds((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));
  }

  function showHelp() {
    if (needs.length === 0) {
      setNudge(true);
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

  function clearAll() {
    setName("");
    setPlace(null);
    setNeeds([]);
    setExpanded(new Set());
    setFilters({});
    setView("ask");
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname);
    setNotice(t.cleared);
    window.setTimeout(() => setNotice(null), 4000);
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
    <ul className={`grid gap-3 ${compact ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"}`}>
      {NEEDS.map((n) => {
        const on = needs.includes(n);
        return (
          <li key={n}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => toggleNeed(n)}
              className={`relative flex w-full items-center gap-3 rounded-2xl border-2 text-left font-bold transition-colors ${
                compact ? "min-h-14 px-3 text-base" : "min-h-28 flex-col justify-center px-3 py-4 text-center text-xl"
              } ${on ? "border-primary bg-primary text-white" : "border-line bg-paper text-ink hover:border-primary hover:bg-primary-soft"}`}
            >
              {on && (
                <Check
                  className={`absolute right-2 top-2 rounded-full bg-white p-0.5 text-primary ${compact ? "h-4 w-4" : "h-6 w-6"}`}
                  aria-hidden="true"
                />
              )}
              <NeedIcon need={n} className={compact ? "h-6 w-6 shrink-0" : "h-10 w-10"} strokeWidth={2} />
              <span>{t.needs[n]}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  const results = (
    <div className="grid gap-8">
      <ResultsMap
        pins={hits.map((h) => ({ num: h.num, lat: h.r.lat, lng: h.r.lng, name: h.r.name, address: h.r.address }))}
        from={place}
        className={helper ? "h-64 md:h-80" : "h-80 md:h-[26rem]"}
        label={t.resultsTitle}
      />
      <p className="-mt-5 text-base text-muted">
        {t.approxMap} {t.walkNote}
      </p>
      {sections.map((s) => (
        <section key={s.need} aria-labelledby={`sec-${s.need}`}>
          <h3 id={`sec-${s.need}`} className="mb-4 flex items-center gap-3 text-2xl font-bold text-ink md:text-3xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dawn">
              <NeedIcon need={s.need} className="h-7 w-7 text-primary" />
            </span>
            {t.needs[s.need]}
          </h3>
          {s.hits.length === 0 ? (
            <p className="rounded-2xl bg-dawn-soft p-5 text-lg">{t.noResults}</p>
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
      ))}
    </div>
  );

  // ---------- Helper (volunteer / outreach) mode: everything on one fast screen ----------
  if (helper) {
    return (
      <>
        <div className="mx-auto max-w-6xl px-4 pb-32 pt-6 print:hidden">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-ink md:text-3xl">{t.helperOn}</h1>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-line px-4 text-base font-semibold text-muted hover:border-alert hover:text-alert"
            >
              <Trash2 className="h-5 w-5" aria-hidden="true" />
              {t.clearInfo}
            </button>
          </div>
          {notice && <p role="status" className="mb-4 rounded-xl bg-hope-soft p-3 font-semibold text-hope">{notice}</p>}

          <div className="grid gap-4 rounded-3xl border-2 border-line bg-paper p-4">
            <div className="grid gap-3 md:grid-cols-[1fr_2fr] md:items-center">
              <label htmlFor={nameId} className="text-base font-semibold">
                {t.stepName} <span className="font-normal text-muted">{t.optional}</span>
              </label>
              <input
                id={nameId}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                placeholder={t.namePlaceholder}
                className="min-h-12 rounded-2xl border-2 border-line px-4 text-base focus:border-primary"
              />
            </div>
            <LocationPicker place={place} onChange={setPlace} compact />
            {needGrid(true)}
            <div className="flex flex-wrap items-center gap-3 border-t border-line pt-3 text-base">
              <span className="font-bold">{t.filters}:</span>
              <label className="inline-flex items-center gap-2">
                {t.within}
                <select
                  value={filters.maxMiles ?? ""}
                  onChange={(e) => setFilters((f) => ({ ...f, maxMiles: e.target.value ? Number(e.target.value) : undefined }))}
                  className="min-h-11 rounded-xl border-2 border-line bg-paper px-2"
                >
                  <option value="">{t.any}</option>
                  <option value="1">1 mi</option>
                  <option value="3">3 mi</option>
                  <option value="5">5 mi</option>
                  <option value="10">10 mi</option>
                </select>
              </label>
              <label className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-line px-3">
                <input
                  type="checkbox"
                  checked={!!filters.mealsOnly}
                  onChange={(e) => setFilters((f) => ({ ...f, mealsOnly: e.target.checked }))}
                  className="h-5 w-5 accent-[var(--color-primary)]"
                />
                {t.mealsOnly}
              </label>
            </div>
          </div>

          <div className="mt-6">
            {needs.length === 0 ? <p className="text-lg text-muted">{t.pickOne}</p> : results}
          </div>
        </div>

        {needs.length > 0 && (
          <div className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-line bg-paper/95 p-3 print:hidden">
            <div className="mx-auto flex max-w-6xl justify-end">{printButton("small")}</div>
          </div>
        )}
        {needs.length > 0 && <HelpSheet hits={hits} from={place} name={firstName} />}
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
            {place ? `${t.youAreNear}: ${place.label}. ` : `${t.noPlace} `}
            {t.closestFirst}
          </p>

          <div className="my-6 flex flex-col gap-2 rounded-3xl bg-dawn p-5 md:flex-row md:items-center md:justify-between">
            <p className="text-lg font-semibold text-ink">{t.printHint}</p>
            {printButton("big")}
          </div>

          {results}

          <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl bg-dawn p-5">
            <p className="text-lg font-semibold">{t.printHint}</p>
            {printButton("big")}
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
                onClick={clearAll}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-line bg-paper px-5 text-lg font-semibold text-muted hover:border-alert hover:text-alert"
              >
                <Trash2 className="h-5 w-5" aria-hidden="true" />
                {t.clearInfo}
              </button>
            </div>
          </div>
        </div>
        <HelpSheet hits={hits} from={place} name={firstName} />
      </>
    );
  }

  // ---------- Questions (the simple 3-step start) ----------
  const showButton = (
    <div className="flex flex-col items-stretch gap-2">
      {nudge && (
        <p role="alert" className="text-center text-lg font-semibold text-alert">
          {t.pickOne}
        </p>
      )}
      <button
        type="button"
        onClick={showHelp}
        aria-disabled={needs.length === 0}
        className={`inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl px-8 text-2xl font-extrabold ${
          needs.length ? "bg-primary text-white hover:bg-primary-dark" : "bg-line text-muted"
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
      {notice && <p role="status" className="mb-4 rounded-xl bg-hope-soft p-3 text-lg font-semibold text-hope">{notice}</p>}

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

      <Step n={2} title={t.stepWhere} extra={t.optional}>
        <p className="mb-4 text-base text-muted">{t.whereHelp}</p>
        <LocationPicker place={place} onChange={setPlace} />
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

function Step({ n, title, extra, children }: { n: number; title: string; extra?: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 rounded-[2rem] border-2 border-line bg-paper p-5 shadow-sm md:p-8" aria-labelledby={`step-${n}`}>
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
