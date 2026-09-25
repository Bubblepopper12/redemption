"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/lib/app-context";
import { resources, type Category } from "@/lib/resources";
import { walking, type Place } from "@/lib/geo";
import { CITIES, MAX_MILES, type CityId } from "@/lib/cities";
import { nearestCity } from "@/lib/search";
import { CategoryIcon } from "./NeedIcon";
import { LocationPicker } from "./LocationPicker";
import { ResourceCard } from "./ResourceCard";
import { ResultsMap } from "./ResultsMap";

const CATS: Category[] = ["shelter", "day-center", "food", "church", "library", "clinic", "hospital", "id-office", "jobs", "veterans", "legal"];

/** Map of every place on the site, with simple city and type filters. */
export function MapExplorer() {
  const { t } = useApp();
  const [cat, setCat] = useState<Category | "all">("all");
  const [cityId, setCityId] = useState<CityId | "all">("all");
  const [place, setPlace] = useState<Place | null>(null);

  // Links like /map/#church open with that type already picked.
  useEffect(() => {
    const h = window.location.hash.replace("#", "") as Category;
    if (CATS.includes(h)) setCat(h);
  }, []);

  const list = useMemo(() => {
    const cityOrder = CITIES.map((c) => c.id);
    return resources
      .filter((r) => cat === "all" || r.category === cat)
      .filter((r) => cityId === "all" || r.city === cityId)
      .map((r) => ({ r, ...(place ? walking(place, r) : { miles: 0, minutes: 0 }) }))
      .filter((h) => !place || h.miles / 1.25 <= MAX_MILES)
      .filter((h) => !place || !nearestCity(place) || h.r.city === nearestCity(place)!.id || h.miles / 1.25 <= 15)
      .sort((a, b) =>
        place ? a.miles - b.miles : cityOrder.indexOf(a.r.city) - cityOrder.indexOf(b.r.city) || a.r.name.localeCompare(b.r.name),
      )
      .map((h, i) => ({ ...h, num: i + 1 }));
  }, [cat, cityId, place]);

  const chip = (active: boolean) =>
    `inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-4 text-base font-semibold ${
      active ? "border-primary bg-primary text-white" : "border-line bg-paper text-ink hover:border-primary"
    }`;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <div className="rounded-[2rem] border-2 border-line bg-paper p-4 md:p-6">
        <LocationPicker place={place} onChange={setPlace} compact />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <label htmlFor="city-filter" className="font-bold">
            {t.cityLabel}:
          </label>
          <select
            id="city-filter"
            value={cityId}
            onChange={(e) => setCityId(e.target.value as CityId | "all")}
            className="min-h-12 rounded-full border-2 border-line bg-paper px-4 text-base font-semibold"
          >
            <option value="all">{t.allCities}</option>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={t.filters}>
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
        {list.length > 0 ? (
          <ResultsMap
            pins={list.map((h) => ({ id: h.r.id, num: h.num, lat: h.r.lat, lng: h.r.lng, name: h.r.name, address: h.r.address }))}
            from={place}
            className="h-96 md:h-[30rem]"
            label={t.mapTitle}
            fitAll
          />
        ) : (
          <p className="rounded-3xl border-2 border-sun bg-dawn p-6 text-xl font-semibold">
            {t.farAway}{" "}
            <a href="tel:211" className="font-extrabold">
              2-1-1
            </a>
          </p>
        )}
        <p className="mt-2 text-base text-muted">
          {t.approxMap} {t.hoursNote}
        </p>
      </div>

      <h2 className="mb-4 mt-10 text-3xl font-bold text-ink">
        {t.directoryTitle} ({list.length})
      </h2>
      <ul className="grid gap-4 lg:grid-cols-2">
        {list.map((h) => (
          <li key={h.r.id}>
            <ResourceCard r={h.r} num={h.num} miles={place ? h.miles : undefined} minutes={place ? h.minutes : undefined} showCity={!place && cityId === "all"} />
          </li>
        ))}
      </ul>
    </div>
  );
}
