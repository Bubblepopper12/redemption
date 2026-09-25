"use client";

import type { ReactNode } from "react";
import { BedDouble, Briefcase, HeartPulse, Medal, Phone, Scale, ShoppingBasket, Truck } from "lucide-react";
import { CallButton, Card, Ext, L, PageTitle } from "./L";
import { SectionHeading as H } from "./Connected";

export function MoreHelp() {
  return (
    <>
      <PageTitle
        en="More help"
        es="Más ayuda"
        introEn="Phone numbers and programs that can help with food, health care, jobs, and more."
        introEs="Teléfonos y programas que ayudan con comida, salud, trabajo y más."
      />
      <div className="mx-auto grid max-w-4xl gap-6 px-4 pb-10">
        <Card className="border-primary bg-primary-soft">
          <H icon={<Phone className="h-8 w-8" aria-hidden="true" />} en="2-1-1 Texas: one number for help" es="2-1-1 Texas: un número para ayuda" />
          <Body>
            <L
              en="Call 2-1-1 for food, housing, child care, crisis help, and more. It is free and works in over 150 languages. If 2-1-1 does not work on your phone, call 877-541-7905."
              es="Llame al 2-1-1 para comida, vivienda, cuidado de niños, crisis y más. Es gratis y funciona en más de 150 idiomas. Si el 2-1-1 no funciona en su teléfono, llame al 877-541-7905."
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
          <Body>
            <L
              en="Most city shelters in Austin do not take walk-ups. To ask for a bed, call or text the Sunrise hotline at 512-522-1097 (Mon–Fri 8 am–8 pm), or visit the Sunrise Hub at 4430 Menchaca Rd. Women and women with children can call the Salvation Army at 512-933-0600. Young people ages 16–26 can walk in to LifeWorks, Mon–Thu 12–4 pm."
              es="La mayoría de los refugios de la ciudad no aceptan personas sin referencia. Para pedir una cama, llame o mande texto a la línea de Sunrise al 512-522-1097 (Lun–Vie 8 am–8 pm), o visite Sunrise Hub en 4430 Menchaca Rd. Mujeres y mujeres con hijos pueden llamar al Ejército de Salvación al 512-933-0600. Jóvenes de 16 a 26 años pueden ir a LifeWorks, Lun–Jue 12–4 pm."
            />
          </Body>
          <Buttons>
            <CallButton number="512-522-1097" label={<L en="Sunrise: 512-522-1097" es="Sunrise: 512-522-1097" />} />
            <Ext href="https://www.austintexas.gov/homeless-strategies/shelters">City of Austin: Shelters</Ext>
          </Buttons>
        </Card>

        <Card>
          <H icon={<ShoppingBasket className="h-8 w-8" aria-hidden="true" />} en="SNAP (food money) and Medicaid" es="SNAP (dinero para comida) y Medicaid" />
          <Body>
            <L
              en="SNAP puts money for groceries on a Lone Star Card. Medicaid pays for health care. Apply for both at YourTexasBenefits.com. For help, call 2-1-1, pick your language, then press 2. Sunrise can also help you sign up."
              es="SNAP pone dinero para comida en una tarjeta Lone Star. Medicaid paga atención médica. Solicite los dos en YourTexasBenefits.com. Para ayuda, llame al 2-1-1, elija su idioma y marque 2. Sunrise también puede ayudarle a inscribirse."
            />
          </Body>
          <Buttons>
            <Ext href="https://www.yourtexasbenefits.com/">YourTexasBenefits.com</Ext>
            <Ext href="https://www.hhs.texas.gov/services/food/snap-food-benefits">Texas HHS: SNAP</Ext>
          </Buttons>
        </Card>

        <Card>
          <H icon={<Truck className="h-8 w-8" aria-hidden="true" />} en="Meals from a truck" es="Comida de un camión" />
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
          <H icon={<Briefcase className="h-8 w-8" aria-hidden="true" />} en="Find a job" es="Buscar trabajo" />
          <Body>
            <L
              en="Workforce Solutions Capital Area is part of the Texas Workforce Commission. They help for free with job listings, resumes, computers, and training. North Center: 9001 N. IH-35, Suite 100. Mon–Fri 8 am–5 pm."
              es="Workforce Solutions Capital Area es parte de la Comisión de la Fuerza Laboral de Texas. Ayudan gratis con ofertas de trabajo, currículum, computadoras y capacitación. Centro Norte: 9001 N. IH-35, Suite 100. Lun–Vie 8 am–5 pm."
            />
          </Body>
          <Buttons>
            <CallButton number="512-454-9675" label="512-454-9675" />
            <Ext href="https://wfscapitalarea.com/contact/">wfscapitalarea.com</Ext>
            <Ext href="https://www.twc.texas.gov/">Texas Workforce Commission</Ext>
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
          <Body>
            <L
              en="Texas RioGrande Legal Aid gives free legal help. Apply by phone, Mon–Fri 9 am–5 pm: (833) 329-8752. Their Austin office does not take walk-ins. Volunteer Legal Services of Central Texas: 512-476-5550. Trouble with a landlord? Austin Tenants Council: 512-474-1961."
              es="Texas RioGrande Legal Aid da ayuda legal gratis. Solicite por teléfono, Lun–Vie 9 am–5 pm: (833) 329-8752. Su oficina de Austin no atiende sin cita. Volunteer Legal Services of Central Texas: 512-476-5550. ¿Problemas con el arrendador? Austin Tenants Council: 512-474-1961."
            />
          </Body>
          <Buttons>
            <CallButton number="833-329-8752" label="TRLA: (833) 329-8752" />
            <CallButton number="512-476-5550" label="VLS: 512-476-5550" />
            <Ext href="https://www.trla.org/get-help-austin">trla.org</Ext>
          </Buttons>
        </Card>

        <Card className="border-alert">
          <H icon={<HeartPulse className="h-8 w-8" aria-hidden="true" />} en="In crisis? You matter." es="¿En crisis? Usted importa." />
          <Body>
            <L
              en="Call or text 988 any time. In Austin, Integral Care's helpline is open 24/7: 512-472-4357. In an emergency, call 9-1-1."
              es="Llame o mande texto al 988 a cualquier hora. En Austin, la línea de Integral Care está abierta 24/7: 512-472-4357. En una emergencia, llame al 9-1-1."
            />
          </Body>
          <Buttons>
            <CallButton number="988" label={<L en="Call 988" es="Llamar al 988" />} />
            <CallButton number="512-472-4357" label="512-472-4357" />
          </Buttons>
        </Card>
      </div>
    </>
  );
}

function Body({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-lg leading-relaxed">{children}</p>;
}
function Buttons({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex flex-wrap items-center gap-3">{children}</div>;
}
