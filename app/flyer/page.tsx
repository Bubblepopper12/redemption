import type { Metadata } from "next";
import { LogoMark } from "@/components/Logo";
import { FlyerPrintButton } from "@/components/FlyerPrintButton";
import { FlyerQr } from "@/components/FlyerQr";

export const metadata: Metadata = { title: "Printable flyer" };

// The QR code is drawn in the browser from the site's real address. No outside service is used.
export default function FlyerPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 print:max-w-none print:p-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-lg text-muted">
          Print this and share it at shelters, churches, and libraries anywhere in Texas. / Imprima y comparta este volante.{" "}
          <a href="/handout/" className="font-bold">
            Want directions to the nearest library and a devotional? Make handouts →
          </a>
        </p>
        <FlyerPrintButton />
      </div>

      <article className="rounded-[2rem] border-4 border-ink bg-paper px-4 py-6 text-center sm:p-8 print:rounded-none print:border-0 print:p-0">
        <div className="flex flex-col items-center justify-center gap-2 min-[400px]:flex-row min-[400px]:gap-3">
          <LogoMark className="h-12 w-12 shrink-0 sm:h-16 sm:w-16" />
          <p className="font-serif text-4xl font-bold text-ink sm:text-5xl">Redemption</p>
        </div>
        <p className="mt-4 font-serif text-2xl font-bold leading-tight text-ink sm:text-3xl">Every person has worth. Every person can be redeemed.</p>
        <p className="mt-1 font-serif text-xl italic text-muted sm:text-2xl" lang="es">
          Cada persona tiene valor. Cada persona puede ser redimida.
        </p>

        <p className="mt-6 text-xl font-semibold text-ink sm:text-2xl">Free help in Texas · Ayuda gratis en Texas</p>
        <p className="mx-auto mt-2 max-w-xl text-xl text-ink">
          Food · Shelter · Showers · ID · Phone · Church · Medical · Jobs · Veterans · Legal
        </p>
        <p className="mx-auto max-w-xl text-lg text-muted" lang="es">
          Comida · Refugio · Duchas · Identificación · Teléfono · Iglesia · Salud · Trabajo · Veteranos · Legal
        </p>

        <FlyerQr />

        <div className="mx-auto mt-8 max-w-xl rounded-2xl border-4 border-ink p-4">
          <p className="whitespace-nowrap text-3xl font-extrabold text-ink sm:text-4xl">Call 2-1-1</p>
          <p className="text-xl text-ink">Free · 24 hours · Any language</p>
          <p className="text-lg text-muted" lang="es">
            Llame al 2-1-1 · Gratis · 24 horas · En cualquier idioma
          </p>
        </div>

        <p className="mx-auto mt-6 max-w-xl text-base text-muted">
          Private: no sign-up, no tracking. All help is free and open to everyone. / Privado: sin registro, sin rastreo. Toda la ayuda es gratis y para todos.
        </p>
        <p className="mx-auto mt-4 max-w-xl font-serif text-lg italic text-ink">
          “Come to me, all you who labor and are heavily burdened, and I will give you rest.” — Matthew 11:28
        </p>
      </article>
    </div>
  );
}
