import { DAILY_VERSES, FEATURED_VERSE, type Verse } from "./verses";

// Short devotionals for the printed handouts. Keep them brief, warm, and simple.
export type Devotional = {
  id: string;
  title: { en: string; es: string };
  verse: Verse;
  reflection: { en: string; es: string };
  prayer: { en: string; es: string };
};

const byRef = (ref: string) => DAILY_VERSES.find((v) => v.ref.en === ref)!;

export const DEVOTIONALS: Devotional[] = [
  {
    id: "rest",
    title: { en: "Rest for the tired", es: "Descanso para el cansado" },
    verse: FEATURED_VERSE,
    reflection: {
      en: "Jesus did not wait for people to have it all together before He invited them close. He simply said, “Come.” If you are tired today, you are exactly who He was talking to.",
      es: "Jesús no esperó a que la gente tuviera todo en orden para invitarla a acercarse. Solo dijo: «Venid». Si hoy está cansado, usted es exactamente a quien Él le hablaba.",
    },
    prayer: {
      en: "Lord, I am tired. Please give me rest, and help me take the next step. Amen.",
      es: "Señor, estoy cansado. Dame descanso y ayúdame a dar el siguiente paso. Amén.",
    },
  },
  {
    id: "new-mercies",
    title: { en: "New every morning", es: "Nuevas cada mañana" },
    verse: byRef("Lamentations 3:22–23"),
    reflection: {
      en: "Yesterday does not get the last word. God's mercy is new today, and so is your chance to begin again. No mistake is too big for His love.",
      es: "El ayer no tiene la última palabra. La misericordia de Dios es nueva hoy, y también su oportunidad de empezar de nuevo. Ningún error es demasiado grande para su amor.",
    },
    prayer: {
      en: "God, thank You for this new day. Show me Your mercy and lead me to the help I need. Amen.",
      es: "Dios, gracias por este nuevo día. Muéstrame tu misericordia y guíame a la ayuda que necesito. Amén.",
    },
  },
  {
    id: "not-alone",
    title: { en: "You are not alone", es: "No está solo" },
    verse: byRef("Isaiah 41:10"),
    reflection: {
      en: "When life is hard, it is easy to feel forgotten. But God says, “I am with you.” He sees you, He knows your name, and He will help you.",
      es: "Cuando la vida es difícil, es fácil sentirse olvidado. Pero Dios dice: «Yo estoy contigo». Él le ve, conoce su nombre y le ayudará.",
    },
    prayer: {
      en: "Father, when I feel alone, remind me that You are here. Give me strength for today. Amen.",
      es: "Padre, cuando me sienta solo, recuérdame que estás aquí. Dame fuerzas para hoy. Amén.",
    },
  },
  {
    id: "he-cares",
    title: { en: "He cares for you", es: "Él cuida de usted" },
    verse: byRef("1 Peter 5:7"),
    reflection: {
      en: "You can hand your worries to God, all of them. He never gets tired of hearing from you. You matter to Him, today and every day.",
      es: "Puede entregarle a Dios sus preocupaciones, todas. Él nunca se cansa de escucharle. Usted le importa, hoy y todos los días.",
    },
    prayer: {
      en: "Lord, here are my worries. I give them to You. Help me trust that You care for me. Amen.",
      es: "Señor, aquí están mis preocupaciones. Te las entrego. Ayúdame a confiar en que cuidas de mí. Amén.",
    },
  },
];
