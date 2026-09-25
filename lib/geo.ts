export type Place = { lat: number; lng: number; label: string; approximate: boolean };

/** Straight-line distance in miles. */
export function milesBetween(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 3958.8;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Walking estimate. Streets are not straight lines, so we add 25% to the
 * straight-line distance and assume a relaxed pace of 3 miles per hour.
 */
export function walking(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const miles = milesBetween(a, b) * 1.25;
  const minutes = Math.max(1, Math.round((miles / 3) * 60));
  return { miles, minutes };
}

export function formatWalk(miles: number, minutes: number, lang: "en" | "es"): string {
  const m = miles < 0.1 ? "0.1" : miles.toFixed(1);
  const time =
    minutes >= 90
      ? lang === "es"
        ? `${(minutes / 60).toFixed(1)} horas`
        : `${(minutes / 60).toFixed(1)} hours`
      : `${minutes} min`;
  return lang === "es" ? `${m} millas · ${time} a pie` : `${m} miles · ${time} walk`;
}

/** Landmarks and neighborhoods. Points are the center of the area (approximate). */
export const LANDMARKS: { id: string; en: string; es: string; lat: number; lng: number }[] = [
  { id: "downtown", en: "Downtown (Congress Ave & 6th St)", es: "Centro (Congress Ave y calle 6)", lat: 30.2682, lng: -97.7429 },
  { id: "capitol", en: "Texas State Capitol", es: "Capitolio de Texas", lat: 30.2747, lng: -97.7404 },
  { id: "arch", en: "The ARCH / E 7th St shelters", es: "The ARCH / refugios de la calle 7 Este", lat: 30.2679, lng: -97.7376 },
  { id: "central-library", en: "Central Library (Cesar Chavez St)", es: "Biblioteca Central (calle Cesar Chavez)", lat: 30.2658, lng: -97.7519 },
  { id: "ut", en: "UT campus / The Drag (Guadalupe St)", es: "Universidad UT / The Drag (calle Guadalupe)", lat: 30.2868, lng: -97.7418 },
  { id: "east", en: "East Austin (E 7th St & Chicon St)", es: "Este de Austin (calle 7 Este y Chicon)", lat: 30.2627, lng: -97.7224 },
  { id: "riverside", en: "Riverside Dr & Pleasant Valley Rd", es: "Riverside Dr y Pleasant Valley Rd", lat: 30.2355, lng: -97.7195 },
  { id: "south-congress", en: "South Congress (S Congress & Oltorf)", es: "South Congress (S Congress y Oltorf)", lat: 30.2385, lng: -97.7515 },
  { id: "menchaca", en: "Menchaca Rd & Ben White Blvd (Sunrise)", es: "Menchaca Rd y Ben White Blvd (Sunrise)", lat: 30.2285, lng: -97.7865 },
  { id: "south-first", en: "S 1st St & William Cannon Dr", es: "S 1st St y William Cannon Dr", lat: 30.1975, lng: -97.7835 },
  { id: "montopolis", en: "Montopolis", es: "Montopolis", lat: 30.2297, lng: -97.6958 },
  { id: "mueller", en: "Mueller / Airport Blvd", es: "Mueller / Airport Blvd", lat: 30.2985, lng: -97.7056 },
  { id: "hyde-park", en: "Hyde Park / North Loop", es: "Hyde Park / North Loop", lat: 30.3085, lng: -97.7275 },
  { id: "st-johns", en: "St. Johns (I-35 & St. Johns Ave)", es: "St. Johns (I-35 y St. Johns Ave)", lat: 30.3334, lng: -97.6975 },
  { id: "rundberg", en: "North Lamar & Rundberg Ln", es: "North Lamar y Rundberg Ln", lat: 30.3627, lng: -97.6975 },
  { id: "braker", en: "Braker Ln & I-35", es: "Braker Ln y I-35", lat: 30.3835, lng: -97.6795 },
  { id: "domain", en: "The Domain", es: "The Domain", lat: 30.4019, lng: -97.725 },
  { id: "research", en: "Research Blvd & Anderson Mill (Northwest)", es: "Research Blvd y Anderson Mill (Noroeste)", lat: 30.4415, lng: -97.7725 },
];

/** Approximate center point of Austin-area ZIP codes. */
export const ZIPS: Record<string, [number, number]> = {
  "78613": [30.5052, -97.8203], "78617": [30.1745, -97.6134], "78653": [30.3388, -97.5323],
  "78660": [30.4421, -97.6299], "78664": [30.5145, -97.668], "78681": [30.5083, -97.6789],
  "78701": [30.2713, -97.7426], "78702": [30.2638, -97.7166], "78703": [30.2907, -97.7648],
  "78704": [30.2428, -97.7658], "78705": [30.2896, -97.7396], "78712": [30.2852, -97.7354],
  "78717": [30.506, -97.7472], "78719": [30.1802, -97.6667], "78721": [30.2721, -97.6868],
  "78722": [30.2893, -97.715], "78723": [30.3085, -97.6849], "78724": [30.296, -97.6396],
  "78725": [30.2562, -97.6243], "78726": [30.43, -97.8326], "78727": [30.4254, -97.7195],
  "78728": [30.4417, -97.6811], "78729": [30.4521, -97.7688], "78730": [30.3607, -97.8241],
  "78731": [30.3471, -97.7609], "78732": [30.3752, -97.9007], "78733": [30.3314, -97.8666],
  "78734": [30.3705, -97.9427], "78735": [30.249, -97.8414], "78736": [30.2444, -97.916],
  "78737": [30.2107, -97.9427], "78738": [30.3337, -97.9824], "78739": [30.172, -97.8784],
  "78741": [30.2315, -97.7223], "78742": [30.2313, -97.6703], "78744": [30.1876, -97.7472],
  "78745": [30.2063, -97.7956], "78746": [30.2971, -97.8181], "78747": [30.1204, -97.7433],
  "78748": [30.1743, -97.8225], "78749": [30.2166, -97.8508], "78750": [30.4224, -97.7967],
  "78751": [30.3093, -97.7242], "78752": [30.3316, -97.7004], "78753": [30.3649, -97.6827],
  "78754": [30.3423, -97.6673], "78756": [30.3223, -97.739], "78757": [30.3437, -97.7316],
  "78758": [30.3764, -97.7078], "78759": [30.4036, -97.7526],
};

export const AUSTIN_CENTER = { lat: 30.2672, lng: -97.7431 };
