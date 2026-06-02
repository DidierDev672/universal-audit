import axios from "axios";
import type {
  CalendarAiAnalysisRecord,
  CreateCalendarAiAnalysisPayload,
  ListCalendarAiAnalysesQuery,
  UpdateCalendarAiAnalysisPayload,
} from "../types/calendarAiAnalysis";

const CALENDAR_AI_ANALYSES_BASE =
  "http://localhost:3000/api/v1/calendar-ai-analyses";

/**
 * Crea un análisis IA de calendario (revisión de evento o asignación de tarea).
 */
export async function postCalendarAiAnalysis(
  payload: CreateCalendarAiAnalysisPayload,
): Promise<CalendarAiAnalysisRecord> {
  const { data } = await axios.post<CalendarAiAnalysisRecord>(
    CALENDAR_AI_ANALYSES_BASE,
    payload,
  );
  return data;
}

/**
 * Lista análisis guardados (filtros opcionales por evento, investigación, tipo, rango).
 */
export async function getCalendarAiAnalyses(
  query: ListCalendarAiAnalysesQuery = {},
): Promise<CalendarAiAnalysisRecord[]> {
  const { data } = await axios.get<CalendarAiAnalysisRecord[]>(
    CALENDAR_AI_ANALYSES_BASE,
    { params: query },
  );
  return Array.isArray(data) ? data : [];
}

/**
 * Obtiene un análisis por id.
 */
export async function getCalendarAiAnalysisById(
  id: string,
): Promise<CalendarAiAnalysisRecord> {
  const { data } = await axios.get<CalendarAiAnalysisRecord>(
    `${CALENDAR_AI_ANALYSES_BASE}/${encodeURIComponent(id)}`,
  );
  return data;
}

/**
 * Actualiza metadatos o contenido de un análisis guardado.
 */
export async function updateCalendarAiAnalysis(
  id: string,
  payload: UpdateCalendarAiAnalysisPayload,
): Promise<CalendarAiAnalysisRecord> {
  const { data } = await axios.patch<CalendarAiAnalysisRecord>(
    `${CALENDAR_AI_ANALYSES_BASE}/${encodeURIComponent(id)}`,
    payload,
  );
  return data;
}

/**
 * Elimina un análisis guardado.
 */
export async function deleteCalendarAiAnalysis(id: string): Promise<void> {
  await axios.delete(
    `${CALENDAR_AI_ANALYSES_BASE}/${encodeURIComponent(id)}`,
  );
}

export { CALENDAR_AI_ANALYSES_BASE };
