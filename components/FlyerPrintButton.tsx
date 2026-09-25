"use client";

import { Printer } from "lucide-react";

export function FlyerPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-sun px-6 text-xl font-bold text-ink hover:bg-[#e79a24]"
    >
      <Printer className="h-6 w-6" aria-hidden="true" />
      Print flyer / Imprimir
    </button>
  );
}
