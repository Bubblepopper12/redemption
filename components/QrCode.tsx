"use client";

import { useEffect, useState } from "react";

/** A QR code drawn in the browser (the qrcode library loads only when needed). */
export function QrCode({ url, className = "", label }: { url: string; className?: string; label: string }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    if (!url) return;
    let alive = true;
    import("qrcode")
      .then((QR) => QR.toString(url, { type: "svg", margin: 1, errorCorrectionLevel: "M" }))
      .then((s) => alive && setSvg(s));
    return () => {
      alive = false;
    };
  }, [url]);
  return (
    <div
      className={`bg-white [&>svg]:h-full [&>svg]:w-full ${className}`}
      role="img"
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
