import { getAiDocumentAnalysisNotes } from "../api/aiDocumentAnalysisNoteApi";
import { useGetGenerativeModelGP } from "./useGetGenerativeModelGP";

export interface RunAiDocumentNoteAnalysisParams {
  aiDocumentAnalysisId: string;
  documentTitle: string;
  documentAnalysisExcerpt?: string;
}

export interface RunAiDocumentNoteAnalysisResult {
  analysisMarkdown: string;
  noteCount: number;
}

export async function runAiDocumentNoteAnalysis(
  params: RunAiDocumentNoteAnalysisParams,
): Promise<RunAiDocumentNoteAnalysisResult> {
  const notes = await getAiDocumentAnalysisNotes(params.aiDocumentAnalysisId);

  if (notes.length === 0) {
    throw new Error(
      "Este documento no tiene notas. Crea al menos una nota antes de analizar.",
    );
  }

  const sorted = [...notes].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
  );

  const notesContent = sorted
    .map(
      (note, index) =>
        `${note.color_name || `Nota ${index + 1}`} (${new Date(note.created_at).toLocaleDateString("es-ES")}): ${note.content}`,
    )
    .join("\n\n");

  const excerpt = params.documentAnalysisExcerpt?.trim();
  const contextBlock = excerpt
    ? `\n\nContexto del análisis del documento «${params.documentTitle}»:\n${excerpt.length > 4000 ? `${excerpt.slice(0, 4000)}\n[… truncado …]` : excerpt}`
    : "";

  const prompt = `Analiza las siguientes notas vinculadas al documento clínico «${params.documentTitle}».
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
Recomendaciones accionables para el equipo clínico.

Notas del documento:
${notesContent}${contextBlock}`;

  const analysisMarkdown = String(await useGetGenerativeModelGP(prompt)).trim();

  if (!analysisMarkdown) {
    throw new Error("La IA no devolvió contenido para el análisis.");
  }

  return { analysisMarkdown, noteCount: sorted.length };
}
