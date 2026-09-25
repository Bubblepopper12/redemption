import type { Metadata } from "next";
import QRCode from "qrcode";
import { LogoMark } from "@/components/Logo";
import { FlyerPrintButton } from "@/components/FlyerPrintButton";

export const metadata: Metadata = { title: "Printable flyer" };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://redemption.com";
const SHORT = SITE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");

// The QR code is drawn once, when the site is built. No outside service is used.
export default async function FlyerPage() {
  const qr = await QRCode.toString(SITE_URL, { type: "svg", margin: 1, errorCorrectionLevel: "M" });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 print:max-w-none print:p-0">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-lg text-muted">Print this and share it at shelters, churches, and libraries. / Imprima y comparta este volante.</p>
        <FlyerPrintButton />
      </div>

      <article className="rounded-[2rem] border-4 border-ink bg-paper p-8 text-center print:rounded-none print:border-0 print:p-0">
        <div className="flex items-center justify-center gap-3">
          <LogoMark className="h-16 w-16" />
          <p className="font-serif text-5xl font-bold text-ink">Redemption</p>
        </div>
        <p className="mt-4 font-serif text-3xl font-bold leading-tight text-ink">Every person has worth. Every person can be redeemed.</p>
        <p className="mt-1 font-serif text-2xl italic text-muted" lang="es">
          Cada persona tiene valor. Cada persona puede ser redimida.
        </p>

        <p className="mt-6 text-2xl font-semibold text-ink">Free help in Austin · Ayuda gratis en Austin</p>
        <p className="mx-auto mt-2 max-w-xl text-xl text-ink">
          Food · Shelter · Showers · ID · Phone · Church · Medical · Jobs · Veterans · Legal
        </p>
        <p className="mx-auto max-w-xl text-lg text-muted" lang="es">
          Comida · Refugio · Duchas · Identificación · Teléfono · Iglesia · Salud · Trabajo · Veteranos · Legal
        </p>

        <div className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-6 sm:flex-row sm:justify-center print:flex-row">
          <div
            className="h-56 w-56 shrink-0 rounded-xl border-2 border-ink bg-white p-2 [&>svg]:h-full [&>svg]:w-full"
            role="img"
            aria-label={`QR code for ${SHORT}`}
            dangerouslySetInnerHTML={{ __html: qr }}
          />
          <div className="text-left">
            <p className="text-lg text-muted">Visit / Visite:</p>
            <p className="break-all font-mono text-4xl font-extrabold text-primary">{SHORT}</p>
            <p className="mt-3 text-lg text-ink">
              No phone? Use a free computer at any Austin Public Library.
              <br />
              <span lang="es" className="text-muted">
                ¿No tiene teléfono? Use una computadora gratis en cualquier biblioteca pública de Austin.
              </span>
            </p>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-xl rounded-2xl border-4 border-ink p-4">
          <p className="text-4xl font-extrabold text-ink">Call 2-1-1</p>
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
