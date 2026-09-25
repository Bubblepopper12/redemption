"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/lib/app-context";
import { resources, type Category } from "@/lib/resources";
import { AUSTIN_CENTER, walking, type Place } from "@/lib/geo";
import { CategoryIcon } from "./NeedIcon";
import { LocationPicker } from "./LocationPicker";
import { ResourceCard } from "./ResourceCard";
import { ResultsMap } from "./ResultsMap";

const CATS: Category[] = ["shelter", "day-center", "food", "church", "library", "clinic", "id-office", "jobs", "veterans", "legal"];

/** "Near Me" map of every place on the site, with simple type filters. */
export function MapExplorer() {
  const { t } = useApp();
  const [cat, setCat] = useState<Category | "all">("all");
  const [place, setPlace] = useState<Place | null>(null);

  // Links like /map/#church open with that type already picked.
  useEffect(() => {
    const h = window.location.hash.replace("#", "") as Category;
    if (CATS.includes(h)) setCat(h);
  }, []);

  const list = useMemo(() => {
    const origin = place ?? AUSTIN_CENTER;
    return resources
      .filter((r) => cat === "all" || r.category === cat)
      .map((r) => ({ r, ...walking(origin, r) }))
      .sort((a, b) => (place ? a.miles - b.miles : a.r.name.localeCompare(b.r.name)))
      .map((h, i) => ({ ...h, num: i + 1 }));
  }, [cat, place]);

  const chip = (active: boolean) =>
    `inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-4 text-base font-semibold ${
      active ? "border-primary bg-primary text-white" : "border-line bg-paper text-ink hover:border-primary"
    }`;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <div className="rounded-[2rem] border-2 border-line bg-paper p-4 md:p-6">
        <LocationPicker place={place} onChange={setPlace} compact />
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={t.filters}>
          <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")} className={chip(cat === "all")}>
            {t.allCategories}
          </button>
          {CATS.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={chip(cat === c)}>
              <CategoryIcon category={c} className="h-5 w-5" />
              {t.categories[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <ResultsMap
          pins={list.map((h) => ({ num: h.num, lat: h.r.lat, lng: h.r.lng, name: h.r.name, address: h.r.address }))}
          from={place}
          className="h-96 md:h-[30rem]"
          label={t.mapTitle}
        />
        <p className="mt-2 text-base text-muted">{t.approxMap}</p>
      </div>

      <h2 className="mb-4 mt-10 text-3xl font-bold text-ink">
        {t.directoryTitle} ({list.length})
      </h2>
      <ul className="grid gap-4 lg:grid-cols-2">
        {list.map((h) => (
          <li key={h.r.id}>
            <ResourceCard r={h.r} num={h.num} miles={place ? h.miles : undefined} minutes={place ? h.minutes : undefined} />
          </li>
        ))}
      </ul>
    </div>
  );
}
