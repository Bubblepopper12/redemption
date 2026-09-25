import type { City } from "./cities";
import type { NeedKey } from "./resources";

export type Tip = { en: string; es: string; href?: string; linkEn?: string; linkEs?: string };

/** The one most useful next step for each need, based on the person's city. */
export function tipFor(need: NeedKey, city: City | null): Tip | null {
  switch (need) {
    case "shelter":
      return city
        ? { en: city.shelter.en, es: city.shelter.es }
        : { en: "Call 2-1-1 to find a shelter bed near you.", es: "Llame al 2-1-1 para encontrar una cama cerca de usted." };
    case "medical": {
      const crisisEn = city ? ` Mental health crisis? Call ${city.crisis.name} any time: ${city.crisis.phone}, or call or text 988.` : " Mental health crisis? Call or text 988 any time.";
      const crisisEs = city ? ` ¿Crisis de salud mental? Llame a ${city.crisis.name} a cualquier hora: ${city.crisis.phone}, o llame o mande texto al 988.` : " ¿Crisis de salud mental? Llame o mande texto al 988 a cualquier hora.";
      return {
        en: (city?.health?.en ?? "In an emergency, any hospital ER must check you, even with no money.") + crisisEn,
        es: (city?.health?.es ?? "En una emergencia, cualquier sala de emergencias debe revisarle, aunque no tenga dinero.") + crisisEs,
      };
    }
    case "id":
      return {
        en: "Getting an ID takes a few steps. Our guide shows them in order, with costs and free options.",
        es: "Sacar una identificación toma unos pasos. Nuestra guía los muestra en orden, con costos y opciones gratis.",
        href: "/id/",
        linkEn: "Open the Get Your ID guide",
        linkEs: "Abrir la guía para sacar su ID",
      };
    case "showers":
      return {
        en: "Showers are usually first come, first served, so go early. Bring clean clothes if you have them. Many day centers also give out hygiene items.",
        es: "Las duchas por lo general son por orden de llegada, así que vaya temprano. Traiga ropa limpia si tiene. Muchos centros de día también regalan artículos de higiene.",
      };
    case "internet":
      return {
        en: "Lifeline takes up to $9.25 off a phone bill each month. You may qualify if you get SNAP, Medicaid, or SSI.",
        es: "Lifeline descuenta hasta $9.25 cada mes de una cuenta de teléfono. Puede calificar si recibe SNAP, Medicaid o SSI.",
        href: "/connected/",
        linkEn: "How to get Lifeline",
        linkEs: "Cómo obtener Lifeline",
      };
    case "food":
      return {
        en: "SNAP puts money for groceries on a card. Apply at YourTexasBenefits.com, or call 2-1-1 and press 2.",
        es: "SNAP pone dinero para comida en una tarjeta. Solicite en YourTexasBenefits.com, o llame al 2-1-1 y marque 2.",
      };
    case "veterans":
      return {
        en: "Veterans without a home can call the VA any time, day or night: 877-424-3838. It is free and private.",
        es: "Los veteranos sin hogar pueden llamar al VA a cualquier hora: 877-424-3838. Es gratis y privado.",
      };
    case "legal": {
      if (city?.id === "houston")
        return { en: "Lone Star Legal Aid gives free legal help. Call 800-733-8394.", es: "Lone Star Legal Aid da ayuda legal gratis. Llame al 800-733-8394." };
      if (city?.id === "dallas" || city?.id === "fort-worth")
        return {
          en: "Legal Aid of NorthWest Texas gives free legal help. Apply online, or call your local office.",
          es: "Legal Aid of NorthWest Texas da ayuda legal gratis. Solicite en línea o llame a su oficina local.",
          href: "https://legalaidtx.org/get-help/how-to-apply/",
          linkEn: "Apply for legal aid",
          linkEs: "Solicitar ayuda legal",
        };
      return {
        en: "Texas RioGrande Legal Aid gives free legal help. Apply by phone, Mon–Fri 9 am–5 pm: (833) 329-8752.",
        es: "Texas RioGrande Legal Aid da ayuda legal gratis. Solicite por teléfono, Lun–Vie 9 am–5 pm: (833) 329-8752.",
      };
    }
    case "jobs": {
      const austin = city?.id === "austin";
      return {
        en:
          "See jobs that are hiring right now at WorkInTexas.com (free, from the state)." +
          (austin ? " In Austin, Workforce First pays people experiencing homelessness for day work, with a ride and lunch: 512-568-7557." : ""),
        es:
          "Vea trabajos que están contratando ahora en WorkInTexas.com (gratis, del estado)." +
          (austin ? " En Austin, Workforce First paga a personas sin hogar por trabajo del día, con transporte y almuerzo: 512-568-7557." : ""),
        href: "https://www.workintexas.com/",
        linkEn: "Open WorkInTexas.com",
        linkEs: "Abrir WorkInTexas.com",
      };
    }
    case "church":
      return {
        en: "All are welcome. Most churches will gladly give you a free Bible. Just ask.",
        es: "Todos son bienvenidos. La mayoría de las iglesias con gusto le regalan una Biblia. Solo pida.",
      };
    default:
      return null;
  }
}
