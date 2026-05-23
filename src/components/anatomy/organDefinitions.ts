export type Vector3Tuple = [number, number, number];

export interface OrganDefinition {
  id: string;
  name: string;
  color: number;
  emissive: number;
  description: string;
}

/** Metadatos de órganos (geometría en humanAnatomyBuilders.ts) */
export const ORGAN_DEFINITIONS: OrganDefinition[] = [
  {
    id: "cerebro",
    name: "Cerebro",
    color: 0xf4a6a6,
    emissive: 0x5c2020,
    description: "Centro de control del sistema nervioso.",
  },
  {
    id: "nasofaringe",
    name: "Nasofaringe",
    color: 0xd4b5ff,
    emissive: 0x3d2a5c,
    description: "Conducto entre cavidad nasal y faringe.",
  },
  {
    id: "tiroides",
    name: "Tiroides",
    color: 0xc77dff,
    emissive: 0x4a1f6e,
    description: "Regula metabolismo y hormonas.",
  },
  {
    id: "timo",
    name: "Glándula timo",
    color: 0x9ae6b4,
    emissive: 0x1f4d32,
    description: "Desarrollo del sistema inmunitario.",
  },
  {
    id: "pulmones",
    name: "Pulmones",
    color: 0xff9eb5,
    emissive: 0x5c1f30,
    description: "Intercambio de oxígeno y dióxido de carbono.",
  },
  {
    id: "corazon",
    name: "Corazón",
    color: 0xe63946,
    emissive: 0x6b1018,
    description: "Bombea sangre por el organismo.",
  },
  {
    id: "higado",
    name: "Hígado",
    color: 0x8b4513,
    emissive: 0x3d1f0a,
    description: "Metabolismo, detoxificación y bilis.",
  },
  {
    id: "estomago",
    name: "Estómago",
    color: 0xf4a261,
    emissive: 0x5c3a12,
    description: "Digestión mecánica y química de alimentos.",
  },
  {
    id: "pancreas",
    name: "Páncreas",
    color: 0xffd166,
    emissive: 0x5c4a12,
    description: "Enzimas digestivas e insulina.",
  },
  {
    id: "rinones",
    name: "Riñones",
    color: 0x6b4226,
    emissive: 0x2a1508,
    description: "Filtración y equilibrio de fluidos.",
  },
  {
    id: "intestino",
    name: "Intestino",
    color: 0xe9c46a,
    emissive: 0x4a3a10,
    description: "Absorción de nutrientes y agua.",
  },
  {
    id: "vejiga",
    name: "Vejiga",
    color: 0xf9c74f,
    emissive: 0x4a3d08,
    description: "Almacenamiento de orina.",
  },
  {
    id: "reproductor",
    name: "Aparato reproductor",
    color: 0xf72585,
    emissive: 0x5c0a30,
    description: "Sistema reproductivo humano.",
  },
];
