"use client";

import Link from "next/link";
import { Home, Phone } from "lucide-react";
import { L } from "@/components/L";

export default function NotFound() {
  return (
    <div className="dawn-glow">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-serif text-4xl font-bold text-ink md:text-5xl">
          <L en="We could not find that page." es="No encontramos esa página." />
        </h1>
        <p className="mt-4 text-xl">
          <L en="That is okay. Let's get you to help." es="Está bien. Vamos a buscarle ayuda." />
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex min-h-14 items-center gap-2 rounded-2xl bg-primary px-6 text-xl font-bold text-white no-underline hover:bg-primary-dark"
          >
            <Home className="h-6 w-6" aria-hidden="true" />
            <L en="Find help" es="Buscar ayuda" />
          </Link>
          <a
            href="tel:211"
            className="inline-flex min-h-14 items-center gap-2 rounded-2xl border-2 border-primary bg-paper px-6 text-xl font-bold text-primary no-underline"
          >
            <Phone className="h-6 w-6" aria-hidden="true" />
            <L en="Call 2-1-1" es="Llamar al 2-1-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
