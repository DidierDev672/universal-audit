export interface CalendarAnalysisNoteRecord {
  id: string;
  calendarAiAnalysisId: string;
  content: string;
  color: string;
  colorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCalendarAnalysisNotePayload {
  calendar_ai_analysis_id: string;
  content: string;
  color: string;
  color_name: string;
  created_at?: string;
}

export interface UpdateCalendarAnalysisNotePayload {
  content: string;
  color: string;
  color_name: string;
  created_at?: string;
}

export interface CreateCalendarAnalysisNoteAnalysisLogPayload {
  calendar_ai_analysis_id: string;
  analysis: string;
  note_count: number;
  model?: string | null;
  analyzed_at?: string;
}

export interface CalendarAnalysisNoteAnalysisLogRecord {
  id: string;
  calendarAiAnalysisId: string;
  analysis: string;
  noteCount: number;
  model: string | null;
  analyzedAt: string;
  createdAt: string;
  updatedAt: string;
}
