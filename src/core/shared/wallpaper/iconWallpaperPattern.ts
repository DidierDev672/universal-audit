/** Fondo tipo WhatsApp: iconos clínicos, auditivos y musicales */

export const ICON_BG_COLORS = [
  "bg-blue-50",
  "bg-sky-50",
  "bg-violet-50",
  "bg-orange-50",
  "bg-green-50",
  "bg-cyan-50",
  "bg-fuchsia-50",
  "bg-rose-50",
  "bg-amber-50",
  "bg-purple-50",
  "bg-emerald-50",
  "bg-sky-50",
] as const;

export const ICON_TEXT_COLORS = [
  "text-blue-600",
  "text-sky-600",
  "text-violet-600",
  "text-orange-600",
  "text-green-600",
  "text-cyan-600",
  "text-fuchsia-600",
  "text-rose-600",
  "text-amber-600",
  "text-purple-600",
  "text-emerald-600",
  "text-sky-600",
] as const;

export type IconPatternItem = {
  id: string;
  label: string;
  path: string;
  paths?: string[];
  bg: (typeof ICON_BG_COLORS)[number];
  text: (typeof ICON_TEXT_COLORS)[number];
  rotate: number;
  left?: number;
  top?: number;
  opacity?: number;
};

function seededRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function shuffleWithSeed<T>(items: T[], rnd: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** 40 tipos de icono (salud + música) */
export const WALLPAPER_ICON_PATTERN: IconPatternItem[] = [
  {
    id: "book",
    label: "Libro",
    path: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    bg: ICON_BG_COLORS[0],
    text: ICON_TEXT_COLORS[0],
    rotate: 0,
  },
  {
    id: "oido",
    label: "Oído",
    path: "M15 11a3 3 0 11-6 0 3 3 0 016 0z M6 11c0-3.5 2.5-6 6-6s6 2.5 6 6c0 2-1 4-2 5l-1 2",
    bg: ICON_BG_COLORS[1],
    text: ICON_TEXT_COLORS[1],
    rotate: 12,
  },
  {
    id: "percepcion",
    label: "Percepción",
    path: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    bg: ICON_BG_COLORS[2],
    text: ICON_TEXT_COLORS[2],
    rotate: -15,
  },
  {
    id: "audicion-sana",
    label: "Audición sana",
    path: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    bg: ICON_BG_COLORS[3],
    text: ICON_TEXT_COLORS[3],
    rotate: 6,
  },
  {
    id: "proteccion",
    label: "Protección",
    path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    bg: ICON_BG_COLORS[4],
    text: ICON_TEXT_COLORS[4],
    rotate: -10,
  },
  {
    id: "audiograma",
    label: "Audiograma",
    path: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    bg: ICON_BG_COLORS[5],
    text: ICON_TEXT_COLORS[5],
    rotate: 14,
  },
  {
    id: "alerta",
    label: "Alerta auditiva",
    path: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    bg: ICON_BG_COLORS[6],
    text: ICON_TEXT_COLORS[6],
    rotate: -6,
  },
  {
    id: "audifono",
    label: "Audífono",
    path: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3",
    bg: ICON_BG_COLORS[7],
    text: ICON_TEXT_COLORS[7],
    rotate: 8,
  },
  {
    id: "volumen",
    label: "Volumen seguro",
    path: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z",
    bg: ICON_BG_COLORS[8],
    text: ICON_TEXT_COLORS[8],
    rotate: -12,
  },
  {
    id: "test",
    label: "Test auditivo",
    path: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    bg: ICON_BG_COLORS[9],
    text: ICON_TEXT_COLORS[9],
    rotate: 10,
  },
  {
    id: "sin-ruido",
    label: "Sin ruido",
    path: "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2",
    bg: ICON_BG_COLORS[10],
    text: ICON_TEXT_COLORS[10],
    rotate: -14,
  },
  {
    id: "bienestar",
    label: "Bienestar",
    path: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    bg: ICON_BG_COLORS[11],
    text: ICON_TEXT_COLORS[11],
    rotate: 5,
  },
  {
    id: "frecuencia",
    label: "Frecuencia",
    path: "",
    paths: ["M3 12h2l2-4 2 8 2-6 2 4h2"],
    bg: ICON_BG_COLORS[0],
    text: ICON_TEXT_COLORS[0],
    rotate: 16,
  },
  {
    id: "microscopio",
    label: "Microscopio",
    path: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7",
    bg: ICON_BG_COLORS[1],
    text: ICON_TEXT_COLORS[1],
    rotate: -7,
  },
  {
    id: "atomo",
    label: "Átomo",
    path: "",
    paths: [
      "M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83",
    ],
    bg: ICON_BG_COLORS[2],
    text: ICON_TEXT_COLORS[2],
    rotate: 11,
  },
  {
    id: "matraz",
    label: "Matraz",
    path: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    bg: ICON_BG_COLORS[3],
    text: ICON_TEXT_COLORS[3],
    rotate: -9,
  },
  {
    id: "adn",
    label: "ADN",
    path: "M12 3v18M8 7c-2 2-2 10 0 0M16 7c2 2 2 10 0 0M9 11h6",
    bg: ICON_BG_COLORS[4],
    text: ICON_TEXT_COLORS[4],
    rotate: 7,
  },
  {
    id: "tubo",
    label: "Tubo de ensayo",
    path: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z",
    bg: ICON_BG_COLORS[5],
    text: ICON_TEXT_COLORS[5],
    rotate: 13,
  },
  {
    id: "molecula",
    label: "Molécula",
    path: "",
    paths: [
      "M12 8a2 2 0 100-4 2 2 0 000 4zM8 16a2 2 0 100-4 2 2 0 000 4zM16 16a2 2 0 100-4 2 2 0 000 4zM9 9l3 3m0-6l3 3",
    ],
    bg: ICON_BG_COLORS[6],
    text: ICON_TEXT_COLORS[6],
    rotate: -11,
  },
  {
    id: "virus",
    label: "Virus",
    path: "M12 2a5 5 0 015 5v1a3 3 0 013 3 3 3 0 01-3 3v1a5 5 0 01-10 0v-1a3 3 0 01-3-3 3 3 0 013-3V7a5 5 0 015-5z",
    bg: ICON_BG_COLORS[7],
    text: ICON_TEXT_COLORS[7],
    rotate: 9,
  },
  {
    id: "celula",
    label: "Célula",
    path: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z M12 8v8m-4-4h8",
    bg: ICON_BG_COLORS[8],
    text: ICON_TEXT_COLORS[8],
    rotate: -5,
  },
  {
    id: "ocular",
    label: "Análisis ocular",
    path: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z",
    bg: ICON_BG_COLORS[9],
    text: ICON_TEXT_COLORS[9],
    rotate: 15,
  },
  {
    id: "estetoscopio",
    label: "Estetoscopio",
    path: "M6 8a4 4 0 014-4h2a2 2 0 012 2v2a4 4 0 004 4v1a3 3 0 003 3h2a3 3 0 003-3V8z",
    bg: ICON_BG_COLORS[10],
    text: ICON_TEXT_COLORS[10],
    rotate: -16,
  },
  {
    id: "vacuna",
    label: "Vacuna",
    path: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8v4H8V4z",
    bg: ICON_BG_COLORS[11],
    text: ICON_TEXT_COLORS[11],
    rotate: 4,
  },
  {
    id: "ritmo",
    label: "Ritmo cardíaco",
    path: "",
    paths: ["M3 12h2l1 3 2-6 2 4 3-5h2"],
    bg: ICON_BG_COLORS[0],
    text: ICON_TEXT_COLORS[0],
    rotate: 12,
  },
  {
    id: "cerebro",
    label: "Cerebro",
    path: "M9.663 17h4.673M12 3c-2 0-4 2-4 4.5 0 2 2 4 4.5 4 4.5 2 4 4.5 0 2.5-2 4.5-4.5 4-2 0-4-2-4.5-4.5 0-2.5 2-4.5 4.5-4 2z",
    bg: ICON_BG_COLORS[1],
    text: ICON_TEXT_COLORS[1],
    rotate: -8,
  },
  {
    id: "botiquin",
    label: "Botiquín",
    path: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    bg: ICON_BG_COLORS[2],
    text: ICON_TEXT_COLORS[2],
    rotate: 6,
  },
  {
    id: "monitor",
    label: "Monitor vital",
    path: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    bg: ICON_BG_COLORS[3],
    text: ICON_TEXT_COLORS[3],
    rotate: -13,
  },
  {
    id: "pulmones",
    label: "Pulmones",
    path: "",
    paths: [
      "M8 8c0-2 1.5-3 4-3s4 1 4 3v8c0 2-1.5 3-4 3s-4-1-4-3V8z",
      "M16 8c0-2 1.5-3 4-3s4 1 4 3v8c0 2-1.5 3-4 3s-4-1-4-3V8z",
    ],
    bg: ICON_BG_COLORS[4],
    text: ICON_TEXT_COLORS[4],
    rotate: 10,
  },
  {
    id: "medicamento",
    label: "Medicamento",
    path: "",
    paths: [
      "M8 10h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4a2 2 0 012-2z",
      "M12 8v8",
    ],
    bg: ICON_BG_COLORS[5],
    text: ICON_TEXT_COLORS[5],
    rotate: -4,
  },
  {
    id: "nota-musical",
    label: "Nota musical",
    path: "M9 18V5l12-2v13M9 18c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z",
    bg: ICON_BG_COLORS[6],
    text: ICON_TEXT_COLORS[6],
    rotate: -9,
  },
  {
    id: "corcheas",
    label: "Corcheas",
    path: "",
    paths: [
      "M9 18V6l4-1v12M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z",
      "M15 16V4l4-1v12M15 16c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z",
    ],
    bg: ICON_BG_COLORS[7],
    text: ICON_TEXT_COLORS[7],
    rotate: 14,
  },
  {
    id: "auriculares",
    label: "Auriculares",
    path: "M4 14h2v4a2 2 0 002 2h0a2 2 0 002-2v-3H4v-1zm16 0h-2v4a2 2 0 01-2 2h0a2 2 0 01-2-2v-3h6v-1zM12 6a6 6 0 016 6v2H6v-2a6 6 0 016-6z",
    bg: ICON_BG_COLORS[8],
    text: ICON_TEXT_COLORS[8],
    rotate: -11,
  },
  {
    id: "parlante",
    label: "Parlante",
    path: "M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14",
    bg: ICON_BG_COLORS[9],
    text: ICON_TEXT_COLORS[9],
    rotate: 7,
  },
  {
    id: "clave-sol",
    label: "Clave de sol",
    path: "M12 4c-2 0-3.5 1.5-3.5 3.5S10 11 12 11s3.5-1.5 3.5-3.5S14 4 12 4zm0 7v9m-2-2c0 1.1.9 2 2 2s2-.9 2-2",
    bg: ICON_BG_COLORS[10],
    text: ICON_TEXT_COLORS[10],
    rotate: -6,
  },
  {
    id: "ecualizador",
    label: "Ecualizador",
    path: "",
    paths: ["M7 4v16M12 8v12M17 6v14"],
    bg: ICON_BG_COLORS[11],
    text: ICON_TEXT_COLORS[11],
    rotate: 10,
  },
  {
    id: "vinilo",
    label: "Disco de vinilo",
    path: "M12 12m-8 0a8 8 0 1016 0 8 8 0 00-16 0z M12 12m-2 0a2 2 0 104 0 2 2 0 00-4 0z",
    bg: ICON_BG_COLORS[0],
    text: ICON_TEXT_COLORS[0],
    rotate: -13,
  },
  {
    id: "microfono",
    label: "Micrófono",
    path: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4 0h4m-4-8a3 3 0 116 0v6a3 3 0 01-6 0V5a3 3 0 016 0z",
    bg: ICON_BG_COLORS[1],
    text: ICON_TEXT_COLORS[1],
    rotate: 8,
  },
  {
    id: "pentagrama",
    label: "Pentagrama",
    path: "",
    paths: ["M4 8h16", "M4 11h16", "M4 14h16", "M4 17h16", "M4 20h16"],
    bg: ICON_BG_COLORS[2],
    text: ICON_TEXT_COLORS[2],
    rotate: -4,
  },
  {
    id: "pulso-musical",
    label: "Pulso musical",
    path: "",
    paths: ["M3 12h2l1-3 2 6 2-8 2 5 2-4h2"],
    bg: ICON_BG_COLORS[3],
    text: ICON_TEXT_COLORS[3],
    rotate: 15,
  },
];

/**
 * Repite cada icono ×repeat (40 tipos ×3 = 120 iconos).
 * Posiciones aleatorias sin distorsión (sin skew ni escala).
 * `layoutSeed`: nueva disposición al recargar o cambiar de ruta.
 */
export function buildIconWallpaper(
  repeat = 3,
  layoutSeed = Math.floor(Math.random() * 1_000_000_000),
): IconPatternItem[] {
  const rnd = seededRandom(layoutSeed);
  const base: IconPatternItem[] = [];

  for (let r = 0; r < repeat; r++) {
    WALLPAPER_ICON_PATTERN.forEach((icon, i) => {
      base.push({
        ...icon,
        id: `${icon.id}-${r}-${i}`,
      });
    });
  }

  const shuffled = shuffleWithSeed(base, rnd);
  const out: IconPatternItem[] = [];

  shuffled.forEach((icon, idx) => {
    const left = 3 + rnd() * 95;
    const top = 3 + rnd() * 95;
    const rotate = icon.rotate + Math.round((rnd() - 0.3) * 12);
    const opacity = 0.42 + rnd() * 0.38;

    out.push({
      ...icon,
      id: `${icon.id}-${idx}-${layoutSeed}`,
      left: Math.min(97, Math.max(3, left)),
      top: Math.min(97, Math.max(3, top)),
      rotate,
      opacity,
    });
  });

  return out;
}
