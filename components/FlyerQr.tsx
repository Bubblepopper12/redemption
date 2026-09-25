"use client";

import { shortUrl, useSiteUrl } from "@/lib/site-url";
import { QrCode } from "./QrCode";

/** The QR code and short address, made in the browser from the site's real address. */
export function FlyerQr() {
  const url = useSiteUrl();

  return (
    <div className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-6 sm:flex-row sm:justify-center print:flex-row">
      <QrCode url={url} label={`QR code for ${shortUrl(url)}`} className="h-56 w-56 shrink-0 rounded-xl border-2 border-ink p-2" />
      <div className="text-left">
        <p className="text-lg text-muted">Visit / Visite:</p>
        <p className="font-mono text-2xl font-extrabold text-primary sm:text-3xl">
          {/* If the address must wrap, wrap it after a dot, never in the middle of a word. */}
          {shortUrl(url)
            .split(/(?<=\.)/)
            .map((part, i) => (
              <span key={i} className="whitespace-nowrap">
                {part}
                <wbr />
              </span>
            ))}
        </p>
        <p className="mt-3 text-lg text-ink">
          No phone? Use a free computer at any public library.
          <br />
          <span lang="es" className="text-muted">
            ¿No tiene teléfono? Use una computadora gratis en cualquier biblioteca pública.
          </span>
        </p>
      </div>
    </div>
  );
}
