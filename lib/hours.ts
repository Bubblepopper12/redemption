// "Open now" status, always in Texas time (Central), whatever the computer's clock zone is.
// El Paso is on Mountain time, so its places are checked in Mountain time.

export type OpenSpan = { days: number[]; from: string; to: string };

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

function localNow(now: Date, timeZone: string): { day: number; mins: number } {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const mins = (Number(get("hour")) % 24) * 60 + Number(get("minute"));
  return { day, mins };
}

export type OpenStatus =
  | { open: true; always: boolean; until?: string }
  | { open: false; nextDay?: number; nextFrom?: string; today?: boolean };

export function openStatus(spans: OpenSpan[] | undefined, now: Date, timeZone = "America/Chicago"): OpenStatus | null {
  if (!spans || spans.length === 0) return null;
  const always = spans.some((s) => s.days.length === 7 && s.from === "00:00" && s.to === "24:00");
  if (always) return { open: true, always: true };
  const { day, mins } = localNow(now, timeZone);
  const current = spans.find((s) => s.days.includes(day) && toMin(s.from) <= mins && mins < toMin(s.to));
  if (current) return { open: true, always: false, until: current.to };
  for (let offset = 0; offset < 8; offset++) {
    const d = (day + offset) % 7;
    const starts = spans
      .filter((s) => s.days.includes(d) && (offset > 0 || toMin(s.from) > mins))
      .map((s) => s.from)
      .sort();
    if (starts.length) return { open: false, nextDay: d, nextFrom: starts[0], today: offset === 0 };
  }
  return { open: false };
}

const DAYS = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  es: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
};

export function formatTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const hh = h % 12 === 0 ? 12 : h % 12;
  const ap = h < 12 || h === 24 ? "am" : "pm";
  return m ? `${hh}:${String(m).padStart(2, "0")} ${ap}` : `${hh} ${ap}`;
}

export function describeStatus(s: OpenStatus, lang: "en" | "es"): string {
  if (s.open) {
    if (s.always) return lang === "es" ? "Abierto 24 horas" : "Open 24 hours";
    return lang === "es" ? `Abierto ahora · hasta ${formatTime(s.until!)}` : `Open now · until ${formatTime(s.until!)}`;
  }
  if (s.nextDay === undefined || !s.nextFrom) return lang === "es" ? "Cerrado ahora" : "Closed now";
  const when = s.today ? (lang === "es" ? "hoy" : "today") : DAYS[lang][s.nextDay];
  return lang === "es" ? `Cerrado ahora · abre ${when} a las ${formatTime(s.nextFrom)}` : `Closed now · opens ${when} at ${formatTime(s.nextFrom)}`;
}
