// English: World English Bible (WEB, public domain) and King James Version (KJV, public domain in the U.S.).
// Spanish: Reina-Valera 1960. Short quotations are allowed with the notice shown in the footer.
export type Verse = { ref: { en: string; es: string }; en: string; es: string; version: string };

export const FEATURED_VERSE: Verse = {
  ref: { en: "Matthew 11:28", es: "Mateo 11:28" },
  en: "Come to me, all you who labor and are heavily burdened, and I will give you rest.",
  es: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.",
  version: "WEB",
};

export const DAILY_VERSES: Verse[] = [
  {
    ref: { en: "Isaiah 41:10", es: "Isaías 41:10" },
    en: "Don't you be afraid, for I am with you. Don't be dismayed, for I am your God. I will strengthen you. Yes, I will help you…",
    es: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré…",
    version: "WEB",
  },
  {
    ref: { en: "2 Corinthians 5:17", es: "2 Corintios 5:17" },
    en: "Therefore if anyone is in Christ, he is a new creation. The old things have passed away. Behold, all things have become new.",
    es: "De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.",
    version: "WEB",
  },
  {
    ref: { en: "Psalm 46:1", es: "Salmo 46:1" },
    en: "God is our refuge and strength, a very present help in trouble.",
    es: "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.",
    version: "WEB",
  },
  {
    ref: { en: "1 Peter 5:7", es: "1 Pedro 5:7" },
    en: "Casting all your worries on him, because he cares for you.",
    es: "Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.",
    version: "WEB",
  },
  {
    ref: { en: "Psalm 23:1", es: "Salmo 23:1" },
    en: "The LORD is my shepherd; I shall not want.",
    es: "Jehová es mi pastor; nada me faltará.",
    version: "KJV",
  },
  {
    ref: { en: "Lamentations 3:22–23", es: "Lamentaciones 3:22–23" },
    en: "It is of the LORD's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",
    es: "Por la misericordia de Jehová no hemos sido consumidos, porque nunca decayeron sus misericordias. Nuevas son cada mañana; grande es tu fidelidad.",
    version: "KJV",
  },
  {
    ref: { en: "Philippians 4:13", es: "Filipenses 4:13" },
    en: "I can do all things through Christ, who strengthens me.",
    es: "Todo lo puedo en Cristo que me fortalece.",
    version: "WEB",
  },
  {
    ref: { en: "Psalm 147:3", es: "Salmo 147:3" },
    en: "He heals the broken in heart, and binds up their wounds.",
    es: "Él sana a los quebrantados de corazón, y venda sus heridas.",
    version: "WEB",
  },
  {
    ref: { en: "John 14:27", es: "Juan 14:27" },
    en: "Peace I leave with you. My peace I give to you… Don't let your heart be troubled, neither let it be fearful.",
    es: "La paz os dejo, mi paz os doy… No se turbe vuestro corazón, ni tenga miedo.",
    version: "WEB",
  },
  {
    ref: { en: "Romans 15:13", es: "Romanos 15:13" },
    en: "Now may the God of hope fill you with all joy and peace in believing, that you may abound in hope…",
    es: "Y el Dios de esperanza os llene de todo gozo y paz en el creer, para que abundéis en esperanza…",
    version: "WEB",
  },
  {
    ref: { en: "Luke 19:10", es: "Lucas 19:10" },
    en: "For the Son of Man came to seek and to save that which was lost.",
    es: "Porque el Hijo del Hombre vino a buscar y a salvar lo que se había perdido.",
    version: "WEB",
  },
  {
    ref: { en: "John 3:16", es: "Juan 3:16" },
    en: "For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.",
    es: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.",
    version: "WEB",
  },
  {
    ref: { en: "Romans 8:28", es: "Romanos 8:28" },
    en: "We know that all things work together for good for those who love God…",
    es: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien…",
    version: "WEB",
  },
  {
    ref: { en: "Ephesians 2:10", es: "Efesios 2:10" },
    en: "For we are his workmanship, created in Christ Jesus for good works…",
    es: "Porque somos hechura suya, creados en Cristo Jesús para buenas obras…",
    version: "WEB",
  },
];

/** Same verse for everyone on the same day. Changes at midnight. */
export function verseOfTheDay(date = new Date()): Verse {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return DAILY_VERSES[day % DAILY_VERSES.length];
}
