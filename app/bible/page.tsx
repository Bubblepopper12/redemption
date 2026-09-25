"use client";

import Link from "next/link";
import { BookOpen, Church, Headphones, Smartphone } from "lucide-react";
import { Card, Ext, L, PageTitle } from "@/components/L";
import { SectionHeading as H } from "@/components/Connected";

export default function BiblePage() {
  return (
    <>
      <PageTitle
        en="A free Bible for you"
        es="Una Biblia gratis para usted"
        introEn="God's Word is a gift, and it is free. Read it, listen to it, or get your own copy."
        introEs="La Palabra de Dios es un regalo, y es gratis. Léala, escúchela o consiga su propia copia."
      />
      <div className="mx-auto grid max-w-4xl gap-6 px-4 pb-10">
        <Card>
          <H icon={<BookOpen className="h-8 w-8" aria-hidden="true" />} en="Read the Bible free online" es="Lea la Biblia gratis en línea" />
          <ul className="mt-4 grid gap-3 text-lg">
            <li>
              <Ext href="https://www.biblegateway.com/">BibleGateway.com</Ext>{" "}
              <L en="— many translations, in English and Spanish." es="— muchas traducciones, en inglés y español." />
            </li>
            <li>
              <Ext href="https://www.bible.com/">Bible.com (YouVersion)</Ext>{" "}
              <L en="— free on the web and as a free phone app." es="— gratis en la web y como aplicación gratis para el teléfono." />
            </li>
          </ul>
        </Card>

        <Card>
          <H icon={<Headphones className="h-8 w-8" aria-hidden="true" />} en="Listen to the Bible" es="Escuche la Biblia" />
          <p className="mt-3 text-lg">
            <Ext href="https://www.bible.is/">Bible.is</Ext>{" "}
            <L
              en="— free audio Bible in English, Spanish, and many other languages."
              es="— Biblia en audio gratis en español, inglés y muchos otros idiomas."
            />
          </p>
        </Card>

        <Card>
          <H icon={<Church className="h-8 w-8" aria-hidden="true" />} en="Get a paper Bible to keep" es="Consiga una Biblia de papel" />
          <p className="mt-3 text-lg leading-relaxed">
            <L
              en="Most churches are glad to give you a Bible for free. Just ask. You can find a church near you on our map."
              es="La mayoría de las iglesias con gusto le regalan una Biblia. Solo pida. Puede encontrar una iglesia cerca en nuestro mapa."
            />
          </p>
          <Link
            href="/map/#church"
            className="mt-4 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-primary px-5 text-lg font-bold text-white no-underline hover:bg-primary-dark"
          >
            <Church className="h-6 w-6" aria-hidden="true" />
            <L en="Find a church near me" es="Buscar una iglesia cerca" />
          </Link>
        </Card>

        <p className="flex items-center gap-2 text-base text-muted">
          <Smartphone className="h-5 w-5" aria-hidden="true" />
          <L
            en="Reading the Bible is never required to get help. All help on this site is for everyone."
            es="Nunca se requiere leer la Biblia para recibir ayuda. Toda la ayuda de este sitio es para todos."
          />
        </p>
      </div>
    </>
  );
}
