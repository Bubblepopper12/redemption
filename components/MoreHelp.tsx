"use client";

import type { ReactNode } from "react";
import { BedDouble, Briefcase, HeartPulse, Medal, Phone, Scale, ShoppingBasket, Stethoscope, Truck } from "lucide-react";
import { useApp } from "@/lib/app-context";
import { CITIES } from "@/lib/cities";
import { CallButton, Card, Ext, L, PageTitle } from "./L";
import { SectionHeading as H } from "./Connected";

export function MoreHelp() {
  const { lang } = useApp();
  return (
    <>
      <PageTitle
        en="More help"
        es="Más ayuda"
        introEn="Phone numbers and programs anywhere in Texas: shelter, food, health care, jobs, veterans, and legal help."
        introEs="Teléfonos y programas en todo Texas: refugio, comida, salud, trabajo, veteranos y ayuda legal."
      />
      <div className="mx-auto grid max-w-4xl gap-6 px-4 pb-10">
        <Card className="border-primary bg-primary-soft">
          <H icon={<Phone className="h-8 w-8" aria-hidden="true" />} en="2-1-1 Texas: one number for help" es="2-1-1 Texas: un número para ayuda" />
          <Body>
            <L
              en="Anywhere in Texas, call 2-1-1 for food, housing, child care, crisis help, and more. It is free and works in over 150 languages. If 2-1-1 does not work on your phone, call 877-541-7905."
              es="En cualquier parte de Texas, llame al 2-1-1 para comida, vivienda, cuidado de niños, crisis y más. Es gratis y funciona en más de 150 idiomas. Si el 2-1-1 no funciona en su teléfono, llame al 877-541-7905."
            />
          </Body>
          <Buttons>
            <CallButton number="211" label={<L en="Call 2-1-1" es="Llamar al 2-1-1" />} />
            <CallButton number="877-541-7905" label="877-541-7905" />
            <Ext href="https://www.211texas.org/">211texas.org</Ext>
          </Buttons>
        </Card>

        <Card>
          <H icon={<BedDouble className="h-8 w-8" aria-hidden="true" />} en="How to ask for a shelter bed" es="Cómo pedir una cama en un refugio" />
          <p className="mt-3 text-lg">
            <L en="Every city does this a little differently. Find your city:" es="Cada ciudad lo hace un poco diferente. Busque su ciudad:" />
          </p>
          <CityList render={(c) => c.shelter[lang]} phone={(c) => c.shelter.phone} />
          <p className="mt-4 text-lg">
            <L
              en="In Austin, women and children can also call the Salvation Army at 512-933-0600, and young people ages 16–26 can walk in to LifeWorks, Mon–Thu 12–4 pm. Somewhere else in Texas? Call 2-1-1."
              es="En Austin, mujeres y niños también pueden llamar al Ejército de Salvación al 512-933-0600, y jóvenes de 16 a 26 años pueden ir a LifeWorks, Lun–Jue 12–4 pm. ¿En otra parte de Texas? Llame al 2-1-1."
            />
          </p>
        </Card>

        <Card>
          <H icon={<ShoppingBasket className="h-8 w-8" aria-hidden="true" />} en="SNAP (food money) and Medicaid" es="SNAP (dinero para comida) y Medicaid" />
          <Body>
            <L
              en="SNAP puts money for groceries on a Lone Star Card. Medicaid pays for health care. Apply for both at YourTexasBenefits.com. For help, call 2-1-1, pick your language, then press 2. Many day centers (like Sunrise in Austin) and the San Antonio Food Bank (210-431-8326) help people sign up for free."
              es="SNAP pone dinero para comida en una tarjeta Lone Star. Medicaid paga atención médica. Solicite los dos en YourTexasBenefits.com. Para ayuda, llame al 2-1-1, elija su idioma y marque 2. Muchos centros de día (como Sunrise en Austin) y el Banco de Comida de San Antonio (210-431-8326) ayudan gratis a inscribirse."
            />
          </Body>
          <Buttons>
            <Ext href="https://www.yourtexasbenefits.com/">YourTexasBenefits.com</Ext>
            <Ext href="https://www.hhs.texas.gov/services/food/snap-food-benefits">Texas HHS: SNAP</Ext>
          </Buttons>
        </Card>

        <Card>
          <H icon={<Stethoscope className="h-8 w-8" aria-hidden="true" />} en="Help paying for a doctor or hospital" es="Ayuda para pagar doctor u hospital" />
          <Body>
            <L
              en="In an emergency, go to any hospital emergency room. They must check you, even if you have no money. Each big county also has a program to help people with low income pay for care:"
              es="En una emergencia, vaya a cualquier sala de emergencias. Deben revisarle aunque no tenga dinero. Cada condado grande también tiene un programa que ayuda a pagar la atención a personas de bajos ingresos:"
            />
          </Body>
          <CityList render={(c) => c.health?.[lang] ?? ""} phone={(c) => c.health?.phone} />
        </Card>

        <Card>
          <H icon={<Truck className="h-8 w-8" aria-hidden="true" />} en="Meals from a truck (Austin)" es="Comida de un camión (Austin)" />
          <Body>
            <L
              en="Mobile Loaves & Fishes is a Christian ministry. Its trucks bring meals to stops around Austin. Stops are posted every day on their website. Call (512) 206-3141."
              es="Mobile Loaves & Fishes es un ministerio cristiano. Sus camiones llevan comida a paradas en Austin. Las paradas se publican cada día en su sitio web. Llame al (512) 206-3141."
            />
          </Body>
          <Buttons>
            <Ext href="https://mlf.org/truck-schedules/">
              <L en="Truck schedules" es="Horarios de los camiones" />
            </Ext>
          </Buttons>
        </Card>

        <Card>
          <H icon={<Briefcase className="h-8 w-8" aria-hidden="true" />} en="Find a job that is hiring now" es="Buscar un trabajo que esté contratando" />
          <Body>
            <L
              en="Jobs change every day, so the best list is the state's free job board, WorkInTexas.com. You can search jobs that are hiring right now, build a resume, and apply. For free help in person, go to a Workforce Solutions center (see the map), or a Goodwill job center. Goodwill helps people with past convictions or no stable housing."
              es="Los trabajos cambian cada día, así que la mejor lista es la bolsa de trabajo gratis del estado, WorkInTexas.com. Puede buscar trabajos que están contratando ahora, hacer su currículum y solicitar. Para ayuda gratis en persona, vaya a un centro de Workforce Solutions (vea el mapa) o a un centro de empleo de Goodwill. Goodwill ayuda a personas con antecedentes o sin vivienda estable."
            />
          </Body>
          <Body>
            <L
              en="In Austin, Workforce First (The Other Ones Foundation) pays people experiencing homelessness for day work, with a ride and lunch. You must be 18 or older. Call 512-568-7557."
              es="En Austin, Workforce First (The Other Ones Foundation) paga a personas sin hogar por trabajo del día, con transporte y almuerzo. Debe tener 18 años o más. Llame al 512-568-7557."
            />
          </Body>
          <Buttons>
            <Ext href="https://www.workintexas.com/">WorkInTexas.com</Ext>
            <CallButton number="512-568-7557" label="Workforce First: 512-568-7557" />
            <Ext href="https://toofound.org/workforce-first/">toofound.org</Ext>
          </Buttons>
        </Card>

        <Card>
          <H icon={<Medal className="h-8 w-8" aria-hidden="true" />} en="Veterans" es="Veteranos" />
          <Body>
            <L
              en="Veterans without a home can call the VA any time, day or night: 877-424-3838. It is free and private. In crisis? Call or text 988, then press 1. Texas Veterans Commission: 1-800-252-8387."
              es="Los veteranos sin hogar pueden llamar al VA a cualquier hora: 877-424-3838. Es gratis y privado. ¿En crisis? Llame o mande texto al 988 y marque 1. Comisión de Veteranos de Texas: 1-800-252-8387."
            />
          </Body>
          <Buttons>
            <CallButton number="877-424-3838" label={<L en="VA homeless line: 877-424-3838" es="Línea del VA: 877-424-3838" />} />
            <Ext href="https://www.va.gov/homeless/nationalcallcenter.asp">VA Homeless Programs</Ext>
            <Ext href="https://tvc.texas.gov/">Texas Veterans Commission</Ext>
          </Buttons>
        </Card>

        <Card>
          <H icon={<Scale className="h-8 w-8" aria-hidden="true" />} en="Free legal help" es="Ayuda legal gratis" />
          <ul className="mt-3 grid gap-3 text-lg">
            <li>
              <strong>Texas RioGrande Legal Aid</strong>{" "}
              <L
                en="(Austin, San Antonio, El Paso, and South and West Texas): apply by phone, Mon–Fri 9 am–5 pm, (833) 329-8752."
                es="(Austin, San Antonio, El Paso y el sur y oeste de Texas): solicite por teléfono, Lun–Vie 9 am–5 pm, (833) 329-8752."
              />
            </li>
            <li>
              <strong>Lone Star Legal Aid</strong>{" "}
              <L en="(Houston and East Texas): (800) 733-8394." es="(Houston y el este de Texas): (800) 733-8394." />
            </li>
            <li>
              <strong>Legal Aid of NorthWest Texas</strong>{" "}
              <L
                en="(Dallas, Fort Worth, and North and West Texas): apply online, or call (888) 529-5277 if you live outside Dallas and Tarrant counties."
                es="(Dallas, Fort Worth y el norte y oeste de Texas): solicite en línea, o llame al (888) 529-5277 si vive fuera de los condados Dallas y Tarrant."
              />
            </li>
            <li>
              <strong>Volunteer Legal Services of Central Texas</strong> <L en="(Austin): 512-476-5550." es="(Austin): 512-476-5550." />
            </li>
          </ul>
          <Buttons>
            <CallButton number="833-329-8752" label="TRLA: (833) 329-8752" />
            <CallButton number="800-733-8394" label="LSLA: (800) 733-8394" />
            <Ext href="https://legalaidtx.org/get-help/how-to-apply/">Legal Aid of NorthWest Texas</Ext>
            <Ext href="https://texaslawhelp.org/">TexasLawHelp.org</Ext>
          </Buttons>
        </Card>

        <Card className="border-alert">
          <H icon={<HeartPulse className="h-8 w-8" aria-hidden="true" />} en="In crisis? You matter." es="¿En crisis? Usted importa." />
          <Body>
            <L
              en="Call or text 988 any time, anywhere. Each city also has a 24-hour local mental health crisis line. In an emergency, call 9-1-1."
              es="Llame o mande texto al 988 a cualquier hora, en cualquier lugar. Cada ciudad también tiene una línea local de crisis de salud mental, 24 horas. En una emergencia, llame al 9-1-1."
            />
          </Body>
          <Buttons>
            <CallButton number="988" label={<L en="Call 988" es="Llamar al 988" />} />
          </Buttons>
          <CityList render={(c) => c.crisis.name} phone={(c) => c.crisis.phone} />
        </Card>
      </div>
    </>
  );
}

function CityList({ render, phone }: { render: (c: (typeof CITIES)[number]) => string; phone: (c: (typeof CITIES)[number]) => string | undefined }) {
  return (
    <dl className="mt-4 grid gap-3">
      {CITIES.map((c) => {
        const text = render(c);
        if (!text) return null;
        const p = phone(c);
        return (
          <div key={c.id} className="rounded-2xl bg-sky p-4">
            <dt className="text-xl font-bold">{c.name}</dt>
            <dd className="mt-1 text-lg">
              {text}
              {p && (
                <span className="mt-2 block">
                  <a href={`tel:+1${p.replace(/\D/g, "").slice(-10)}`} className="font-bold">
                    {p}
                  </a>
                </span>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function Body({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-lg leading-relaxed">{children}</p>;
}
function Buttons({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex flex-wrap items-center gap-3">{children}</div>;
}
