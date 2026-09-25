// Texas cities the site covers, with the first steps that are different in each city.
// Every phone number here was checked against the organization's own website (see README).
// To add a city: add it here, then add its places to data/texas-resources.json.

export type CityId = "austin" | "houston" | "dallas" | "san-antonio" | "fort-worth" | "el-paso";

type Bi = { en: string; es: string };

export type City = {
  id: CityId;
  name: string;
  center: { lat: number; lng: number };
  /** How to ask for a shelter bed in this city. */
  shelter: Bi & { phone: string };
  /** 24/7 local mental health crisis line. */
  crisis: { name: string; phone: string };
  /** Help paying for a doctor or hospital. */
  health?: Bi & { phone: string };
  landmarks: { id: string; en: string; es: string; lat: number; lng: number }[];
};

export const CITIES: City[] = [
  {
    id: "austin",
    name: "Austin",
    center: { lat: 30.2672, lng: -97.7431 },
    shelter: {
      en: "Most Austin shelters need a referral. To ask for a bed, call or text Sunrise at 512-522-1097 (Mon–Fri 8 am–8 pm), or go to the Sunrise Hub at 4430 Menchaca Rd.",
      es: "La mayoría de los refugios de Austin necesitan referencia. Para pedir una cama, llame o mande texto a Sunrise al 512-522-1097 (Lun–Vie 8 am–8 pm), o vaya a Sunrise Hub en 4430 Menchaca Rd.",
      phone: "512-522-1097",
    },
    crisis: { name: "Integral Care", phone: "512-472-4357" },
    health: {
      en: "No insurance? Travis County's MAP program can help pay for care. Call 512-978-8130, option 1. You can use a shelter address or cross streets.",
      es: "¿No tiene seguro? El programa MAP del condado Travis ayuda a pagar la atención. Llame al 512-978-8130, opción 1. Puede usar la dirección de un refugio o las calles cercanas.",
      phone: "512-978-8130",
    },
    landmarks: [
      { id: "aus-downtown", en: "Downtown (Congress Ave & 6th St)", es: "Centro (Congress Ave y calle 6)", lat: 30.2682, lng: -97.7429 },
      { id: "aus-arch", en: "The ARCH / E 7th St", es: "The ARCH / calle 7 Este", lat: 30.2679, lng: -97.7376 },
      { id: "aus-central-library", en: "Central Library (Cesar Chavez St)", es: "Biblioteca Central (Cesar Chavez)", lat: 30.2658, lng: -97.7519 },
      { id: "aus-ut", en: "UT campus / The Drag", es: "Universidad UT / The Drag", lat: 30.2868, lng: -97.7418 },
      { id: "aus-east", en: "East Austin (E 7th & Chicon)", es: "Este de Austin (calle 7 y Chicon)", lat: 30.2627, lng: -97.7224 },
      { id: "aus-riverside", en: "Riverside Dr & Pleasant Valley", es: "Riverside Dr y Pleasant Valley", lat: 30.2355, lng: -97.7195 },
      { id: "aus-menchaca", en: "Menchaca Rd & Ben White (Sunrise)", es: "Menchaca Rd y Ben White (Sunrise)", lat: 30.2285, lng: -97.7865 },
      { id: "aus-south-first", en: "S 1st St & William Cannon", es: "S 1st St y William Cannon", lat: 30.1975, lng: -97.7835 },
      { id: "aus-st-johns", en: "St. Johns (I-35 & St. Johns Ave)", es: "St. Johns (I-35 y St. Johns Ave)", lat: 30.3334, lng: -97.6975 },
      { id: "aus-rundberg", en: "North Lamar & Rundberg", es: "North Lamar y Rundberg", lat: 30.3627, lng: -97.6975 },
      { id: "aus-braker", en: "Braker Ln & I-35", es: "Braker Ln y I-35", lat: 30.3835, lng: -97.6795 },
      { id: "aus-research", en: "Research Blvd & Anderson Mill", es: "Research Blvd y Anderson Mill", lat: 30.4415, lng: -97.7725 },
    ],
  },
  {
    id: "houston",
    name: "Houston",
    center: { lat: 29.7589, lng: -95.3677 },
    shelter: {
      en: "Men can go to Star of Hope, 1811 Ruiz St. (713-226-5414). Women and families can go in person to Star of Hope, 2575 Reed Rd., Mon–Fri 8 am–3:30 pm (713-222-2220). Day centers like SEARCH and The Beacon can help you start a housing assessment.",
      es: "Los hombres pueden ir a Star of Hope, 1811 Ruiz St. (713-226-5414). Mujeres y familias pueden ir en persona a Star of Hope, 2575 Reed Rd., Lun–Vie 8 am–3:30 pm (713-222-2220). Centros de día como SEARCH y The Beacon le ayudan a empezar una evaluación de vivienda.",
      phone: "713-226-5414",
    },
    crisis: { name: "The Harris Center", phone: "713-970-7000" },
    health: {
      en: "No insurance? Harris Health has a Financial Assistance Program. It is free to apply. Call Harris Health at 713-634-1000.",
      es: "¿No tiene seguro? Harris Health tiene un Programa de Asistencia Financiera. Solicitar es gratis. Llame a Harris Health al 713-634-1000.",
      phone: "713-634-1000",
    },
    landmarks: [
      { id: "hou-downtown", en: "Downtown Houston (Main St)", es: "Centro de Houston (Main St)", lat: 29.7589, lng: -95.3677 },
      { id: "hou-midtown", en: "Midtown (Fannin St & McGowen)", es: "Midtown (Fannin St y McGowen)", lat: 29.7445, lng: -95.3775 },
      { id: "hou-eado", en: "East Downtown (EaDo)", es: "Este del Centro (EaDo)", lat: 29.7505, lng: -95.3465 },
      { id: "hou-tmc", en: "Texas Medical Center", es: "Centro Médico de Texas", lat: 29.7075, lng: -95.4015 },
      { id: "hou-heights", en: "The Heights", es: "The Heights", lat: 29.798, lng: -95.3985 },
    ],
  },
  {
    id: "dallas",
    name: "Dallas",
    center: { lat: 32.7801, lng: -96.8 },
    shelter: {
      en: "The Bridge (1818 Corsicana St.) is open 24/7 for all adults: 214-670-1100. Austin Street Center (2929 Hickory St.) takes walk-ups Mon–Fri 1–4 pm by lottery: 214-428-4242. Union Gospel Mission intake is daily 3–5 pm at The Bridge.",
      es: "The Bridge (1818 Corsicana St.) está abierto 24/7 para todos los adultos: 214-670-1100. Austin Street Center (2929 Hickory St.) recibe personas Lun–Vie 1–4 pm por sorteo: 214-428-4242. Union Gospel Mission recibe cada día de 3 a 5 pm en The Bridge.",
      phone: "214-670-1100",
    },
    crisis: { name: "North Texas Behavioral Health Authority", phone: "866-260-8000" },
    health: {
      en: "No insurance? Parkland Financial Assistance helps Dallas County residents pay for care. Ask a financial counselor at Parkland: 214-590-8000.",
      es: "¿No tiene seguro? La Asistencia Financiera de Parkland ayuda a residentes del condado Dallas a pagar la atención. Pregunte a un consejero financiero en Parkland: 214-590-8000.",
      phone: "214-590-8000",
    },
    landmarks: [
      { id: "dal-downtown", en: "Downtown Dallas (Main St & Akard)", es: "Centro de Dallas (Main St y Akard)", lat: 32.7801, lng: -96.8 },
      { id: "dal-bridge", en: "The Bridge / Farmers Market area", es: "The Bridge / zona Farmers Market", lat: 32.7745, lng: -96.7885 },
      { id: "dal-deep-ellum", en: "Deep Ellum", es: "Deep Ellum", lat: 32.7843, lng: -96.7835 },
      { id: "dal-fair-park", en: "Fair Park", es: "Fair Park", lat: 32.7795, lng: -96.7595 },
      { id: "dal-oak-cliff", en: "Oak Cliff", es: "Oak Cliff", lat: 32.7465, lng: -96.8285 },
    ],
  },
  {
    id: "san-antonio",
    name: "San Antonio",
    center: { lat: 29.4241, lng: -98.4936 },
    shelter: {
      en: "Haven for Hope (1 Haven for Hope Way) is San Antonio's main shelter campus. Walk in. Intake is Mon–Fri 8 am–5 pm, and the Courtyard is a low-barrier shelter with meals and showers: 210-220-2100.",
      es: "Haven for Hope (1 Haven for Hope Way) es el campus principal de refugio en San Antonio. Llegue sin cita. La admisión es Lun–Vie 8 am–5 pm, y el Courtyard es un refugio de bajos requisitos con comidas y duchas: 210-220-2100.",
      phone: "210-220-2100",
    },
    crisis: { name: "The Center for Health Care Services", phone: "210-223-7233" },
    health: {
      en: "No insurance? University Health's CareLink helps Bexar County residents pay for care. Call 210-358-3350.",
      es: "¿No tiene seguro? CareLink de University Health ayuda a residentes del condado Bexar a pagar la atención. Llame al 210-358-3350.",
      phone: "210-358-3350",
    },
    landmarks: [
      { id: "sa-downtown", en: "Downtown / The Alamo", es: "Centro / El Álamo", lat: 29.4259, lng: -98.4861 },
      { id: "sa-haven", en: "Haven for Hope (near Frio St)", es: "Haven for Hope (cerca de Frio St)", lat: 29.4275, lng: -98.5045 },
      { id: "sa-westside", en: "West Side (Guadalupe St)", es: "Lado Oeste (Guadalupe St)", lat: 29.4195, lng: -98.5175 },
      { id: "sa-medical-center", en: "Medical Center", es: "Centro Médico", lat: 29.508, lng: -98.578 },
      { id: "sa-east", en: "East Side (Commerce St)", es: "Lado Este (Commerce St)", lat: 29.4215, lng: -98.4665 },
    ],
  },
  {
    id: "fort-worth",
    name: "Fort Worth",
    center: { lat: 32.7555, lng: -97.3308 },
    shelter: {
      en: "Presbyterian Night Shelter is low-barrier and open 24/7. Men check in at 2 pm at 2400 Cypress St. Women and children call 817-632-7429 first. Main line: 817-632-7400. The True Worth Place day shelter (1513 E. Presidio St.) is open daily 7 am–3 pm.",
      es: "Presbyterian Night Shelter es de bajos requisitos y abierto 24/7. Los hombres se registran a las 2 pm en 2400 Cypress St. Mujeres y niños llamen primero al 817-632-7429. Línea principal: 817-632-7400. El centro de día True Worth Place (1513 E. Presidio St.) abre todos los días de 7 am a 3 pm.",
      phone: "817-632-7400",
    },
    crisis: { name: "My Health My Resources (MHMR) of Tarrant County", phone: "817-335-3022" },
    health: {
      en: "No insurance? JPS Connection helps Tarrant County residents pay for care. Call 817-702-1001 (8 am–5 pm).",
      es: "¿No tiene seguro? JPS Connection ayuda a residentes del condado Tarrant a pagar la atención. Llame al 817-702-1001 (8 am–5 pm).",
      phone: "817-702-1001",
    },
    landmarks: [
      { id: "fw-downtown", en: "Downtown / Sundance Square", es: "Centro / Sundance Square", lat: 32.7549, lng: -97.331 },
      { id: "fw-lancaster", en: "East Lancaster Ave shelters", es: "Refugios de East Lancaster Ave", lat: 32.748, lng: -97.3175 },
      { id: "fw-near-southside", en: "Near Southside / JPS Hospital", es: "Near Southside / Hospital JPS", lat: 32.728, lng: -97.3265 },
      { id: "fw-stockyards", en: "Stockyards / North Side", es: "Stockyards / Lado Norte", lat: 32.7889, lng: -97.3485 },
    ],
  },
  {
    id: "el-paso",
    name: "El Paso",
    center: { lat: 31.7587, lng: -106.4869 },
    shelter: {
      en: "The Opportunity Center for the Homeless (1208 Myrtle Ave.) runs shelters for adults and for women: (915) 577-0069. The Rescue Mission of El Paso (221 N. Lee St.) also offers shelter and meals: (915) 532-2575.",
      es: "El Opportunity Center for the Homeless (1208 Myrtle Ave.) tiene refugios para adultos y para mujeres: (915) 577-0069. La Rescue Mission of El Paso (221 N. Lee St.) también ofrece refugio y comida: (915) 532-2575.",
      phone: "915-577-0069",
    },
    crisis: { name: "Emergence Health Network", phone: "915-779-1800" },
    health: {
      en: "No insurance? University Medical Center of El Paso has a charity care program. Call Patient Financial Services at (915) 521-7690.",
      es: "¿No tiene seguro? University Medical Center de El Paso tiene un programa de atención caritativa. Llame a Servicios Financieros al (915) 521-7690.",
      phone: "915-521-7690",
    },
    landmarks: [
      { id: "ep-downtown", en: "Downtown / San Jacinto Plaza", es: "Centro / Plaza San Jacinto", lat: 31.7587, lng: -106.4869 },
      { id: "ep-myrtle", en: "Myrtle Ave / Segundo Barrio", es: "Myrtle Ave / Segundo Barrio", lat: 31.7555, lng: -106.4805 },
      { id: "ep-utep", en: "UTEP", es: "UTEP", lat: 31.7705, lng: -106.5045 },
      { id: "ep-central", en: "Central El Paso (Alameda Ave)", es: "Centro de El Paso (Alameda Ave)", lat: 31.7725, lng: -106.4555 },
    ],
  },
];

export const CITY_BY_ID = Object.fromEntries(CITIES.map((c) => [c.id, c])) as Record<CityId, City>;

/** Places farther than this from the person are not shown in results. */
export const MAX_MILES = 50;
