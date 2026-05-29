import {
  createCalendarAnalysisNoteAnalysisLog,
  getCalendarAnalysisNotesByAnalysisId,
} from "../api/calendarAnalysisNoteApi";
import type { CalendarEventType } from "../types/calendarAiAnalysis";
import { useGetGenerativeModelGP } from "./useGetGenerativeModelGP";

export interface RunNoteAnalysisParams {
  calendarAiAnalysisId: string;
  eventTitle: string;
  eventType: CalendarEventType;
}

export interface RunNoteAnalysisResult {
  analysisMarkdown: string;
  noteCount: number;
}

export async function runCalendarNoteAnalysis(
  params: RunNoteAnalysisParams,
): Promise<RunNoteAnalysisResult> {
  const notes = await getCalendarAnalysisNotesByAnalysisId(
    params.calendarAiAnalysisId,
  );

  if (notes.length === 0) {
    throw new Error(
      "Este documento no tiene notas. Crea al menos una nota antes de generar el análisis.",
    );
  }

  const sorted = [...notes].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const notesContent = sorted
    .map(
      (note, index) =>
        `${note.colorName || `Nota ${index + 1}`} (${new Date(note.createdAt).toLocaleDateString("es-ES")}): ${note.content}`,
    )
    .join("\n\n");

  const docLabel =
    params.eventType === "task" ? "tarea de calendario" : "investigación de calendario";

  const prompt = `Analiza las siguientes notas vinculadas a una ${docLabel} titulada «${params.eventTitle}».
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

Notas:
${notesContent}`;

  const analysisMarkdown = (await useGetGenerativeModelGP(prompt)) as string;

  await createCalendarAnalysisNoteAnalysisLog({
    calendar_ai_analysis_id: params.calendarAiAnalysisId,
    analysis: analysisMarkdown,
    note_count: sorted.length,
    model: "gemini-3-flash-preview",
    analyzed_at: new Date().toISOString(),
  });

  return { analysisMarkdown, noteCount: sorted.length };
}
