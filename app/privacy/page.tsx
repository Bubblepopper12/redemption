"use client";

import { ShieldCheck } from "lucide-react";
import { Card, L, PageTitle } from "@/components/L";

const points: { en: string; es: string }[] = [
  { en: "No accounts. No login. No passwords.", es: "Sin cuentas. Sin inicio de sesión. Sin contraseñas." },
  {
    en: "Your first name is only used to say hello on your screen. It is never saved or sent anywhere.",
    es: "Su primer nombre solo se usa para saludarle en su pantalla. Nunca se guarda ni se envía.",
  },
  {
    en: "Your location is only used on your screen to find the closest help. It is never saved or sent to us.",
    es: "Su ubicación solo se usa en su pantalla para encontrar la ayuda más cercana. Nunca se guarda ni se nos envía.",
  },
  { en: "We never look up or search for anyone's name.", es: "Nunca buscamos el nombre de nadie." },
  { en: "No tracking, no ads, and no analytics that know who you are.", es: "Sin rastreo, sin anuncios y sin estadísticas que sepan quién es usted." },
  {
    en: "We only remember your language and Helper mode until you close the browser tab.",
    es: "Solo recordamos su idioma y el Modo ayudante hasta que cierre la pestaña del navegador.",
  },
  {
    en: "The map pictures come from OpenStreetMap. Your browser asks OpenStreetMap for map pieces, like any website with a map. We do not send them your name.",
    es: "Las imágenes del mapa vienen de OpenStreetMap. Su navegador le pide partes del mapa a OpenStreetMap, como cualquier sitio con mapa. No les enviamos su nombre.",
  },
  {
    en: "On a shared computer, press “Clear my info” when you are done, then close the browser.",
    es: "En una computadora compartida, toque “Borrar mis datos” cuando termine y cierre el navegador.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageTitle en="Your privacy" es="Su privacidad" introEn="You are safe here. This is what we do and do not do." introEs="Aquí está seguro. Esto es lo que hacemos y no hacemos." />
      <div className="mx-auto max-w-4xl px-4 pb-10">
        <Card>
          <ul className="grid gap-4 text-lg">
            {points.map((p) => (
              <li key={p.en} className="flex gap-3">
                <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-hope" aria-hidden="true" />
                <L en={p.en} es={p.es} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
