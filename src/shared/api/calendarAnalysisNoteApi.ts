import axios from "axios";
import type {
  CalendarAnalysisNoteAnalysisLogRecord,
  CalendarAnalysisNoteRecord,
  CreateCalendarAnalysisNoteAnalysisLogPayload,
  CreateCalendarAnalysisNotePayload,
} from "../types/calendarAnalysisNote";

const API_BASE = "http://localhost:3000/api/v1";
const NOTES_BASE = `${API_BASE}/calendar-ai-analysis-notes`;
const LOGS_BASE = `${API_BASE}/calendar-ai-analysis-note-analysis-logs`;

export async function getCalendarAnalysisNotesByAnalysisId(
  calendarAiAnalysisId: string,
): Promise<CalendarAnalysisNoteRecord[]> {
  const { data } = await axios.get<CalendarAnalysisNoteRecord[]>(
    `${NOTES_BASE}/analysis/${encodeURIComponent(calendarAiAnalysisId)}`,
  );
  return Array.isArray(data) ? data : [];
}

export async function getCalendarAnalysisNoteAnalysisLogs(
  calendarAiAnalysisId?: string,
): Promise<CalendarAnalysisNoteAnalysisLogRecord[]> {
  const { data } = await axios.get<CalendarAnalysisNoteAnalysisLogRecord[]>(
    LOGS_BASE,
    {
      params: calendarAiAnalysisId
        ? { calendar_ai_analysis_id: calendarAiAnalysisId }
        : undefined,
    },
  );
  return Array.isArray(data) ? data : [];
}

export async function createCalendarAnalysisNote(
  payload: CreateCalendarAnalysisNotePayload,
): Promise<CalendarAnalysisNoteRecord> {
  const { data } = await axios.post<CalendarAnalysisNoteRecord>(NOTES_BASE, payload);
  return data;
}

export async function createCalendarAnalysisNoteAnalysisLog(
  payload: CreateCalendarAnalysisNoteAnalysisLogPayload,
): Promise<CalendarAnalysisNoteAnalysisLogRecord> {
  const { data } = await axios.post<CalendarAnalysisNoteAnalysisLogRecord>(
    LOGS_BASE,
    payload,
  );
  return data;
}

export { NOTES_BASE, LOGS_BASE };
