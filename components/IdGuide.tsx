"use client";

import { useState, type ReactNode } from "react";
import { BadgeDollarSign, CheckCircle2, Circle, FileText, HandHelping, MapPin, Printer } from "lucide-react";
import { resources } from "@/lib/resources";
import { Card, Ext, L, PageTitle } from "./L";
import { ResourceCard } from "./ResourceCard";

const byId = (id: string) => resources.find((r) => r.id === id)!;

/**
 * Step-by-step ID checklist. The check boxes only live on this screen,
 * so the person can print the page with their progress marked.
 */
export function IdGuide() {
  const [done, setDone] = useState<Record<number, boolean>>({});

  return (
    <>
      <PageTitle
        en="Get your ID, one step at a time"
        es="Saque su identificación, paso a paso"
        introEn="Do these steps in order. Each step helps you get the next one. You do not have to do this alone."
        introEs="Haga estos pasos en orden. Cada paso le ayuda a conseguir el siguiente. No tiene que hacerlo solo."
      />

      <div className="mx-auto grid max-w-4xl gap-6 px-4 pb-10">
        <Card className="border-hope bg-hope-soft">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-ink">
            <HandHelping className="h-7 w-7 text-hope" aria-hidden="true" />
            <L en="Free help with IDs" es="Ayuda gratis con identificaciones" />
          </h2>
          <p className="mt-2 text-lg">
            <L
              en="Trinity Center (304 E. 7th St., 512-610-3500) and Sunrise (4430 Menchaca Rd., 512-368-2685) help people get IDs, and both can receive mail for you. Your new Texas ID card is mailed to you, so you will need a mailing address."
              es="Trinity Center (304 E. 7th St., 512-610-3500) y Sunrise (4430 Menchaca Rd., 512-368-2685) ayudan a sacar identificaciones, y los dos pueden recibir correo por usted. Su nueva tarjeta de Texas llega por correo, así que necesitará una dirección para recibir correo."
            />
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="mt-4 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-sun px-5 text-lg font-bold text-ink print:hidden"
          >
            <Printer className="h-6 w-6" aria-hidden="true" />
            <L en="Print this checklist" es="Imprimir esta lista" />
          </button>
        </Card>

        <Step
          n={1}
          done={!!done[1]}
          onToggle={() => setDone((d) => ({ ...d, 1: !d[1] }))}
          titleEn="Birth certificate"
          titleEs="Acta de nacimiento"
          need={
            <L
              en={
                <ul className="list-disc space-y-1 pl-6">
                  <li>A photo ID if you have one. If you do not, ask the office which other papers they accept.</li>
                  <li>Your full name at birth, date of birth, city or county of birth, and your parents' names.</li>
                  <li>Born in another state? You must order it from that state. A helper can do this online with you.</li>
                </ul>
              }
              es={
                <ul className="list-disc space-y-1 pl-6">
                  <li>Una identificación con foto si tiene. Si no tiene, pregunte qué otros papeles aceptan.</li>
                  <li>Su nombre completo al nacer, fecha de nacimiento, ciudad o condado donde nació y los nombres de sus padres.</li>
                  <li>¿Nació en otro estado? Debe pedirla a ese estado. Un ayudante puede hacerlo en línea con usted.</li>
                </ul>
              }
            />
          }
          cost={
            <L
              en="$23 per copy at the Austin Office of Vital Records (for people born in Austin). Call Texas Vital Statistics to confirm the state fee. Paying by card in person at the state office adds $2.25."
              es="$23 por copia en la Oficina de Registros Vitales de Austin (para personas nacidas en Austin). Llame a Estadísticas Vitales de Texas para confirmar el costo estatal. Pagar con tarjeta en persona en la oficina estatal cuesta $2.25 más."
            />
          }
          free={
            <L
              en={
                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    <strong>Free for homeless youth</strong> (as defined in federal law, 42 U.S.C. §11434a) and for youth in foster care. Bring a signed
                    “Certification of Homeless Status” form from a school counselor or a youth shelter or program. (Texas Health &amp; Safety Code §191.0049)
                  </li>
                  <li>
                    <strong>Free “election ID” copy:</strong> Vital Statistics gives one free birth certificate in your lifetime if it is only used to get a
                    free Election Identification Certificate (a voting ID) from DPS. It cannot be used for a regular Texas ID card. You must apply in person.
                  </li>
                  <li>
                    <strong>Adults:</strong> as of September 2026, Texas does not have a general fee waiver for adults experiencing homelessness. A 2025 bill
                    (HB 505) would have added one, but it did not pass. Ask Trinity Center or Sunrise if they can help pay.
                  </li>
                </ul>
              }
              es={
                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    <strong>Gratis para jóvenes sin hogar</strong> (según la ley federal, 42 U.S.C. §11434a) y para jóvenes en cuidado de crianza. Traiga el
                    formulario firmado “Certification of Homeless Status” de un consejero escolar o de un refugio o programa para jóvenes. (Código de Salud y
                    Seguridad de Texas §191.0049)
                  </li>
                  <li>
                    <strong>Copia gratis “para identificación electoral”:</strong> Estadísticas Vitales da una copia gratis en su vida si solo la usa para
                    sacar el Certificado de Identificación Electoral (una ID para votar) de DPS. No sirve para una tarjeta de identificación normal. Debe ir en
                    persona.
                  </li>
                  <li>
                    <strong>Adultos:</strong> hasta septiembre de 2026, Texas no tiene una exención general para adultos sin hogar. Un proyecto de ley de 2025
                    (HB 505) la habría creado, pero no fue aprobado. Pregunte en Trinity Center o Sunrise si pueden ayudar a pagar.
                  </li>
                </ul>
              }
            />
          }
          offices={["vital-stats-state", "austin-vital-records"]}
          sources={[
            ["https://www.dshs.texas.gov/vital-statistics/birth-records", "Texas DSHS: Birth Records"],
            ["https://www.dshs.texas.gov/sites/default/files/vs/doc/Certification-of-Homeless-Status-for-Texas-Birth-Certificate.pdf", "DSHS: Certification of Homeless Status form"],
            ["https://statutes.capitol.texas.gov/docs/hs/htm/hs.191.htm", "Texas Health & Safety Code ch. 191"],
            ["https://www.dshs.texas.gov/vital-statistics/birth-records/birth-certificate-election-identification", "DSHS: Birth Certificate for Election Identification"],
            ["https://www.austintexas.gov/health/programs/office-vital-records", "Austin Office of Vital Records"],
            ["https://capitol.texas.gov/BillLookup/History.aspx?LegSess=89R&Bill=HB505", "Texas Legislature: HB 505 (2025) history"],
          ]}
        />

        <Step
          n={2}
          done={!!done[2]}
          onToggle={() => setDone((d) => ({ ...d, 2: !d[2] }))}
          titleEn="Social Security card"
          titleEs="Tarjeta de Seguro Social"
          need={
            <L
              en="Proof of who you are. Call Social Security first and ask which papers you need for your situation: 1-800-772-1213 (Mon–Fri 8 am–7 pm)."
              es="Prueba de quién es. Llame primero al Seguro Social y pregunte qué papeles necesita en su caso: 1-800-772-1213 (Lun–Vie 8 am–7 pm)."
            />
          }
          cost={<L en="Always FREE. Never pay anyone for a Social Security card." es="Siempre GRATIS. Nunca le pague a nadie por una tarjeta de Seguro Social." />}
          free={
            <L
              en="If you are 18 or older, a U.S. citizen, and already have a state ID, you may be able to order a replacement card online at ssa.gov."
              es="Si tiene 18 años o más, es ciudadano de EE. UU. y ya tiene una identificación estatal, tal vez pueda pedir la tarjeta en línea en ssa.gov."
            />
          }
          offices={["ssa-austin"]}
          sources={[
            ["https://www.ssa.gov/number-card/replace-card", "SSA: Replace your Social Security card"],
            ["https://oig.ssa.gov/scam-alerts/2026-03-10-ssa-provides-new-and-replacement-social-security-cards-for-free/", "SSA Inspector General: cards are free"],
          ]}
        />

        <Step
          n={3}
          done={!!done[3]}
          onToggle={() => setDone((d) => ({ ...d, 3: !d[3] }))}
          titleEn="Texas ID card"
          titleEs="Tarjeta de identificación de Texas"
          need={
            <L
              en={
                <ul className="list-disc space-y-1 pl-6">
                  <li>An appointment. Make one at dps.texas.gov or call 512-424-2600 (Spanish: 512-424-7181).</li>
                  <li>Proof of identity (for example, your birth certificate plus other papers — DPS has a list).</li>
                  <li>Proof of U.S. citizenship or lawful presence (a U.S. birth certificate works for most people born in the U.S.).</li>
                  <li>Your Social Security number.</li>
                  <li>
                    Two papers that show your name and a Texas address. <strong>No address?</strong> A homeless shelter or nonprofit can help you fill out a{" "}
                    <strong>Texas Residency Affidavit (form DL-5)</strong> instead.
                  </li>
                  <li>You will give your thumbprints, sign, and have your photo taken. The card comes in the mail in about 2–3 weeks.</li>
                </ul>
              }
              es={
                <ul className="list-disc space-y-1 pl-6">
                  <li>Una cita. Hágala en dps.texas.gov o llame al 512-424-2600 (español: 512-424-7181).</li>
                  <li>Prueba de identidad (por ejemplo, su acta de nacimiento y otros papeles; DPS tiene una lista).</li>
                  <li>Prueba de ciudadanía o presencia legal (un acta de nacimiento de EE. UU. sirve para la mayoría de personas nacidas en EE. UU.).</li>
                  <li>Su número de Seguro Social.</li>
                  <li>
                    Dos papeles con su nombre y una dirección en Texas. <strong>¿No tiene dirección?</strong> Un refugio o una organización sin fines de lucro
                    puede ayudarle a llenar una <strong>Declaración Jurada de Residencia en Texas (formulario DL-5)</strong>.
                  </li>
                  <li>Le tomarán las huellas, firmará y le tomarán una foto. La tarjeta llega por correo en unas 2 a 3 semanas.</li>
                </ul>
              }
            />
          }
          cost={
            <L
              en="About $16. (DPS lists $16 to renew an ID card.) Call DPS to confirm your fee."
              es="Unos $16. (DPS indica $16 para renovar una tarjeta de identificación.) Llame a DPS para confirmar su costo."
            />
          }
          free={
            <L
              en={
                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    <strong>Free for homeless youth and foster youth</strong> through the DPS Identification Fee Exemption program, with eligibility papers
                    (Texas Transportation Code §521.1811).
                  </li>
                  <li>
                    <strong>Free for victims of family violence or dating violence</strong> and their children (added by SB 2054 and SB 798).
                  </li>
                  <li>
                    <strong>Adults:</strong> there is no general fee waiver for adults experiencing homelessness right now. Ask Trinity Center or Sunrise about help
                    paying.
                  </li>
                </ul>
              }
              es={
                <ul className="list-disc space-y-1 pl-6">
                  <li>
                    <strong>Gratis para jóvenes sin hogar y jóvenes en cuidado de crianza</strong> por el programa de Exención de Pago de Identificación de DPS,
                    con papeles que lo comprueben (Código de Transporte de Texas §521.1811).
                  </li>
                  <li>
                    <strong>Gratis para víctimas de violencia familiar o en el noviazgo</strong> y sus hijos (por las leyes SB 2054 y SB 798).
                  </li>
                  <li>
                    <strong>Adultos:</strong> ahora no hay una exención general para adultos sin hogar. Pregunte en Trinity Center o Sunrise si pueden ayudar a
                    pagar.
                  </li>
                </ul>
              }
            />
          }
          offices={["dps-north-lamar", "dps-austin-south"]}
          sources={[
            ["https://www.dps.texas.gov/section/driver-license/how-apply-texas-identification-card", "DPS: How to apply for a Texas ID card"],
            ["https://www.dps.texas.gov/section/driver-license/identification-requirements", "DPS: Identification requirements"],
            ["https://www.dps.texas.gov/section/driver-license/texas-residency-requirement-driver-licenses-and-id-cards", "DPS: Texas residency requirement"],
            ["https://www.dps.texas.gov/internetforms/forms/dl-5.pdf", "DPS: Texas Residency Affidavit (DL-5)"],
            ["https://www.dps.texas.gov/section/driver-license/driver-license-and-identification-card-services-and-waivers", "DPS: Services and waivers"],
            ["https://texas.public.law/statutes/tex._transp._code_section_521.1811", "Texas Transportation Code §521.1811"],
          ]}
        />

        <Step
          n={4}
          done={!!done[4]}
          onToggle={() => setDone((d) => ({ ...d, 4: !d[4] }))}
          titleEn="U.S. passport (optional)"
          titleEs="Pasaporte de EE. UU. (opcional)"
          need={
            <L
              en="Most people do not need a passport. It is the strongest ID, but it costs the most. You need your birth certificate, your ID, a photo, and form DS-11. The Austin Public Library accepts passport applications by appointment only. Appointments open 3 days ahead. No walk-ins, and you cannot book by phone."
              es="La mayoría no necesita pasaporte. Es la identificación más fuerte, pero cuesta más. Necesita su acta de nacimiento, su identificación, una foto y el formulario DS-11. La Biblioteca Pública de Austin recibe solicitudes solo con cita. Las citas se abren 3 días antes. No se aceptan visitas sin cita y no se puede hacer cita por teléfono."
            />
          }
          cost={
            <L
              en="The U.S. government passport fee (see travel.state.gov), plus a $35 acceptance fee and an $18 photo fee at the library. The library takes card, check, or money order. No cash."
              es="El pago del gobierno de EE. UU. por el pasaporte (vea travel.state.gov), más $35 de aceptación y $18 por la foto en la biblioteca. La biblioteca acepta tarjeta, cheque o giro postal. No efectivo."
            />
          }
          free={<L en="There is no general fee waiver for passports." es="No hay exención general de pago para pasaportes." />}
          offices={["apl-central", "apl-ruiz"]}
          sources={[
            ["https://library.austintexas.gov/passports", "Austin Public Library: Passport services"],
            ["https://travel.state.gov/content/travel/en/passports.html", "U.S. State Department: Passports"],
          ]}
        />

        <p className="text-base text-muted">
          <L
            en="Rules and fees can change. We checked these official sources on September 25, 2026. Always call to confirm before you go."
            es="Las reglas y los costos pueden cambiar. Revisamos estas fuentes oficiales el 25 de septiembre de 2026. Siempre llame para confirmar antes de ir."
          />
        </p>
      </div>
    </>
  );
}

function Step({
  n,
  done,
  onToggle,
  titleEn,
  titleEs,
  need,
  cost,
  free,
  offices,
  sources,
}: {
  n: number;
  done: boolean;
  onToggle: () => void;
  titleEn: string;
  titleEs: string;
  need: ReactNode;
  cost: ReactNode;
  free: ReactNode;
  offices: string[];
  sources: [string, string][];
}) {
  return (
    <Card className="print-avoid-break">
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sun text-2xl font-extrabold text-ink" aria-hidden="true">
          {n}
        </span>
        <h2 className="flex-1 text-2xl font-bold text-ink md:text-3xl">
          <L en={`Step ${n}: ${titleEn}`} es={`Paso ${n}: ${titleEs}`} />
        </h2>
        <button
          type="button"
          role="checkbox"
          aria-checked={done}
          onClick={onToggle}
          className={`inline-flex min-h-12 items-center gap-2 rounded-full border-2 px-4 text-base font-semibold ${
            done ? "border-hope bg-hope text-white" : "border-line bg-paper text-ink hover:border-hope"
          }`}
        >
          {done ? <CheckCircle2 className="h-6 w-6" aria-hidden="true" /> : <Circle className="h-6 w-6" aria-hidden="true" />}
          <L en={done ? "Done" : "Mark done"} es={done ? "Listo" : "Marcar listo"} />
        </button>
      </div>

      <div className="mt-6 grid gap-5 text-lg">
        <Part icon={<FileText className="h-6 w-6" aria-hidden="true" />} en="What you need" es="Qué necesita">
          {need}
        </Part>
        <Part icon={<BadgeDollarSign className="h-6 w-6" aria-hidden="true" />} en="Cost" es="Costo">
          {cost}
        </Part>
        <Part icon={<HandHelping className="h-6 w-6" aria-hidden="true" />} en="Free or lower cost" es="Gratis o más barato">
          {free}
        </Part>
        <Part icon={<MapPin className="h-6 w-6" aria-hidden="true" />} en="Where to go" es="Adónde ir">
          <ul className="mt-2 grid gap-3">
            {offices.map((id) => (
              <li key={id}>
                <ResourceCard r={byId(id)} compact />
              </li>
            ))}
          </ul>
        </Part>
      </div>

      <details className="mt-5 text-base print:hidden">
        <summary className="cursor-pointer font-semibold text-primary">
          <L en="Official sources" es="Fuentes oficiales" />
        </summary>
        <ul className="mt-2 grid gap-1 pl-2">
          {sources.map(([href, label]) => (
            <li key={href}>
              <Ext href={href}>{label}</Ext>
            </li>
          ))}
        </ul>
      </details>
    </Card>
  );
}

function Part({ icon, en, es, children }: { icon: ReactNode; en: string; es: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-1 flex items-center gap-2 text-lg font-bold uppercase tracking-wide text-primary">
        {icon}
        <L en={en} es={es} />
      </h3>
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
