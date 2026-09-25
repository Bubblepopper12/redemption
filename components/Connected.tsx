"use client";

import Link from "next/link";
import { BookOpen, Phone, Smartphone, Wifi } from "lucide-react";
import { resources } from "@/lib/resources";
import { CallButton, Card, Ext, L, PageTitle } from "./L";

export function Connected() {
  const libraries = resources.filter((r) => r.category === "library");
  return (
    <>
      <PageTitle
        en="Get connected: phone and internet"
        es="Conéctese: teléfono e internet"
        introEn="A phone and the internet make it easier to find work, housing, and your people. Here is how to get them free or cheap."
        introEs="Un teléfono e internet le ayudan a buscar trabajo, vivienda y a su gente. Así puede tenerlos gratis o baratos."
      />
      <div className="mx-auto grid max-w-4xl gap-6 px-4 pb-10">
        <Card>
          <H icon={<Smartphone className="h-8 w-8" aria-hidden="true" />} en="Lifeline: cheaper phone service" es="Lifeline: servicio de teléfono más barato" />
          <div className="mt-3 grid gap-3 text-lg leading-relaxed">
            <p>
              <L
                en="Lifeline is a federal program. It takes up to $9.25 off your phone or internet bill every month."
                es="Lifeline es un programa federal. Le descuenta hasta $9.25 cada mes de su cuenta de teléfono o internet."
              />
            </p>
            <p className="font-semibold">
              <L en="You can get it if you have one of these:" es="Puede recibirlo si tiene uno de estos:" />
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <L
                en={
                  <>
                    <li>SNAP (food stamps)</li>
                    <li>Medicaid</li>
                    <li>SSI</li>
                    <li>Federal Public Housing Assistance</li>
                    <li>Veterans Pension</li>
                    <li>Or a low income (at or below 135% of the federal poverty level)</li>
                  </>
                }
                es={
                  <>
                    <li>SNAP (estampillas de comida)</li>
                    <li>Medicaid</li>
                    <li>SSI</li>
                    <li>Ayuda Federal de Vivienda Pública</li>
                    <li>Pensión de Veteranos</li>
                    <li>O ingresos bajos (hasta 135% del nivel federal de pobreza)</li>
                  </>
                }
              />
            </ul>
            <p>
              <L
                en="Apply online at lifelinesupport.org, by mail, or through a phone company that offers Lifeline. Only one Lifeline benefit per household. It is free to apply. Never pay anyone to sign you up."
                es="Solicítelo en línea en lifelinesupport.org, por correo o con una compañía de teléfono que ofrezca Lifeline. Solo un beneficio por hogar. Solicitarlo es gratis. Nunca le pague a nadie por inscribirle."
              />
            </p>
            <div className="flex flex-wrap gap-3">
              <CallButton
                number="1-800-234-9473"
                label={
                  <>
                    <Phone className="h-5 w-5" aria-hidden="true" />
                    <L en="Lifeline help: 1-800-234-9473" es="Ayuda de Lifeline: 1-800-234-9473" />
                  </>
                }
              />
              <Ext href="https://www.lifelinesupport.org/how-to-qualify/">lifelinesupport.org</Ext>
              <Ext href="https://www.fcc.gov/lifeline-consumers">FCC: Lifeline</Ext>
            </div>
          </div>
        </Card>

        <Card>
          <H icon={<BookOpen className="h-8 w-8" aria-hidden="true" />} en="Get a free library card" es="Saque una tarjeta de biblioteca gratis" />
          <div className="mt-3 grid gap-3 text-lg leading-relaxed">
            <p>
              <L
                en="With an Austin Public Library card you can use computers, borrow books, and even borrow a 5G Wi-Fi hotspot for 3 weeks."
                es="Con una tarjeta de la Biblioteca Pública de Austin puede usar computadoras, sacar libros y hasta llevarse un hotspot Wi-Fi 5G por 3 semanas."
              />
            </p>
            <p className="font-semibold">
              <L en="Go to any library and bring:" es="Vaya a cualquier biblioteca y traiga:" />
            </p>
            <ol className="list-decimal space-y-1 pl-6">
              <L
                en={
                  <>
                    <li>A photo ID. It can be expired for up to 1 year.</li>
                    <li>
                      Proof of address. <strong>No home address?</strong> A signed letter on letterhead from a shelter, clinic, social service agency, or church in
                      Austin works. Mail with a postmark from the last 60 days also works.
                    </li>
                    <li>You. They take your photo there.</li>
                  </>
                }
                es={
                  <>
                    <li>Una identificación con foto. Puede estar vencida hasta 1 año.</li>
                    <li>
                      Comprobante de domicilio. <strong>¿No tiene casa?</strong> Sirve una carta firmada, en papel oficial, de un refugio, clínica, agencia de
                      servicios sociales o iglesia de Austin. También sirve correo con sello de los últimos 60 días.
                    </li>
                    <li>Usted. Le toman la foto allí.</li>
                  </>
                }
              />
            </ol>
            <p className="rounded-2xl bg-dawn-soft p-4">
              <L
                en={
                  <>
                    <strong>No card? No problem.</strong> Ask at the desk for a Guest Pass to use a computer today.
                  </>
                }
                es={
                  <>
                    <strong>¿No tiene tarjeta? No hay problema.</strong> Pida un Pase de Invitado en el mostrador para usar una computadora hoy.
                  </>
                }
              />
            </p>
            <p>
              <L
                en="The library also has a Community Navigation team to help people experiencing homelessness with health care, housing, and basic needs. Email:"
                es="La biblioteca también tiene un equipo de Navegación Comunitaria que ayuda a personas sin hogar con salud, vivienda y necesidades básicas. Correo:"
              />{" "}
              <a href="mailto:APL.CommunityNav@austintexas.gov" className="break-all font-semibold">
                APL.CommunityNav@austintexas.gov
              </a>
            </p>
            <div className="flex flex-wrap gap-4">
              <Ext href="https://library.austintexas.gov/mylibrarycard">
                <L en="Library card info" es="Información de la tarjeta" />
              </Ext>
              <Ext href="https://library.austintexas.gov/node/1734604">
                <L en="Accepted proof of address" es="Comprobantes de domicilio aceptados" />
              </Ext>
            </div>
          </div>
        </Card>

        <Card>
          <H icon={<Wifi className="h-8 w-8" aria-hidden="true" />} en="Free Wi-Fi and computers" es="Wi-Fi y computadoras gratis" />
          <p className="mt-3 text-lg leading-relaxed">
            <L
              en="Every Austin Public Library has free Wi-Fi and free computers. Trinity Center and Sunrise also have phones and computers you can use."
              es="Todas las bibliotecas públicas de Austin tienen Wi-Fi gratis y computadoras gratis. Trinity Center y Sunrise también tienen teléfonos y computadoras que puede usar."
            />
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {libraries.map((r) => (
              <li key={r.id} className="rounded-2xl bg-sky p-3 text-base">
                <strong className="block text-lg">{r.name}</strong>
                {r.address}
              </li>
            ))}
          </ul>
          <Link
            href="/map/#library"
            className="mt-4 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-primary px-5 text-lg font-bold text-white no-underline hover:bg-primary-dark"
          >
            <L en="See libraries on the map" es="Ver bibliotecas en el mapa" />
          </Link>
        </Card>
      </div>
    </>
  );
}

function H({ icon, en, es }: { icon: React.ReactNode; en: string; es: string }) {
  return (
    <h2 className="flex items-center gap-3 text-2xl font-bold text-ink md:text-3xl">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-dawn text-primary">{icon}</span>
      <L en={en} es={es} />
    </h2>
  );
}

export { H as SectionHeading };
