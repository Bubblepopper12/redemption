import raw from "@/data/austin-resources.json";

export type NeedKey =
  | "food"
  | "shelter"
  | "showers"
  | "id"
  | "internet"
  | "church"
  | "medical"
  | "jobs"
  | "veterans"
  | "legal";

export type Category =
  | "library"
  | "shelter"
  | "day-center"
  | "food"
  | "church"
  | "clinic"
  | "id-office"
  | "jobs"
  | "veterans"
  | "legal";

type Localized = { hours?: string; notes?: string; bring?: string; serviceTimes?: string };

export type Resource = {
  id: string;
  name: string;
  category: Category;
  helpsWith: NeedKey[];
  address: string;
  lat: number;
  lng: number;
  coordsApproximate?: boolean;
  hours: string;
  serviceTimes?: string;
  servesMeals?: boolean;
  phone: string;
  website?: string;
  notes?: string;
  bring?: string;
  es?: Localized;
  lastVerified: string;
  source?: string;
};

export const resources = raw.resources as Resource[];
export const dataLastReviewed = raw.lastReviewed;

export const NEEDS: NeedKey[] = [
  "food",
  "shelter",
  "showers",
  "id",
  "internet",
  "church",
  "medical",
  "jobs",
  "veterans",
  "legal",
];

/** Pick the Spanish text when it exists, otherwise English. */
export function localized(r: Resource, field: keyof Localized, lang: "en" | "es"): string | undefined {
  if (lang === "es" && r.es?.[field]) return r.es[field];
  return r[field];
}

/** Phone text for display, translating the "call to confirm" style notes. */
export function phoneLabel(phone: string, lang: "en" | "es"): string {
  if (lang !== "es") return phone;
  if (/^call to confirm$/i.test(phone)) return "Llame para confirmar";
  if (/^call 3-1-1$/i.test(phone)) return "Llame al 3-1-1";
  return phone;
}

/** Turns "512-974-7400" into a tel: link, or null for "Call to confirm". */
export function telHref(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `tel:+${digits}`;
  if (/3-1-1/.test(phone)) return "tel:311";
  return null;
}
