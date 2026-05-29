import { getNotePackageById } from "../api/notePackageApi";
import type { NotePackageItemRecord } from "../types/notePackage";
import { useGetGenerativeModelGP } from "./useGetGenerativeModelGP";

export interface RunNotePackageAnalysisParams {
  notePackageId: string;
  packageTitle: string;
}

export interface RunNotePackageAnalysisResult {
  analysisMarkdown: string;
  noteCount: number;
}

function formatNotesForPrompt(notes: NotePackageItemRecord[]): string {
  const sorted = [...notes].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return sorted
    .map(
      (note, index) =>
        `${note.colorName || `Nota ${index + 1}`} — ${note.subject} (${new Date(note.createdAt).toLocaleDateString("es-ES")}): ${note.content}`,
    )
    .join("\n\n");
}

export async function runNotePackageAnalysis(
  params: RunNotePackageAnalysisParams,
): Promise<RunNotePackageAnalysisResult> {
  const detail = await getNotePackageById(params.notePackageId);
  const notes = detail.notes ?? [];

  if (notes.length === 0) {
    throw new Error(
      "Este paquete no tiene notas. Agrega al menos una nota antes de analizar.",
    );
  }

  const notesContent = formatNotesForPrompt(notes);

  const prompt = `Analiza las siguientes notas clínicas/investigativas del paquete «${params.packageTitle}».
Responde en markdown con estas secciones (usa ### para cada título):

### RESUMEN
Resumen conciso (máximo 4 oraciones).

### ANÁLISIS
Análisis de contenido y matices (máximo 6 oraciones).

### TEMAS CLAVE
Lista de 3 a 5 temas clave.

### CONEXIONES
Patrones o relaciones entre las notas.

### RECOMENDACIONES
Recomendaciones accionables para el equipo clínico/investigador.

Notas del paquete:
${notesContent}`;

  const analysisMarkdown = (await useGetGenerativeModelGP(prompt)) as string;

  return { analysisMarkdown, noteCount: notes.length };
}
