export interface NoteColorTheme {
  id: string;
  name: string;
  background: string;
  contentText: string;
  createdText: string;
}

export const NOTE_COLOR_THEMES: NoteColorTheme[] = [
  {
    id: "peach",
    name: "Melocotón",
    background: "#FAD4C0",
    contentText: "#A0522D",
    createdText: "#7A3A20",
  },
  {
    id: "lavender",
    name: "Lavanda",
    background: "#C9B8F5",
    contentText: "#5C3DB5",
    createdText: "#3B1F8C",
  },
  {
    id: "sky",
    name: "Cielo",
    background: "#9DD9F3",
    contentText: "#1A6A8E",
    createdText: "#0A4D6E",
  },
  {
    id: "blush",
    name: "Rosa",
    background: "#F5BBBB",
    contentText: "#9B3333",
    createdText: "#7A1F1F",
  },
];

export function themeByBackground(hex: string): NoteColorTheme | undefined {
  const normalized = hex.trim().toUpperCase().replace(/^#/, "");
  return NOTE_COLOR_THEMES.find(
    (t) => t.background.replace("#", "").toUpperCase() === normalized,
  );
}

export function themeById(id: string): NoteColorTheme {
  return NOTE_COLOR_THEMES.find((t) => t.id === id) ?? NOTE_COLOR_THEMES[0]!;
}
