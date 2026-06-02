/** Tipo de análisis IA persistido en calendar-ai-analyses. */
export type CalendarAiAnalysisType = "event_review" | "task_assignment";

export type CalendarEventType = "task" | "research";

/** Propuesta estructurada devuelta por la IA al asignar una tarea. */
export interface TaskAssignmentProposal {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

/** POST /api/v1/calendar-ai-analyses */
export interface CreateCalendarAiAnalysisPayload {
  calendarEventId: string;
  researchId: string | number | null;
  eventTitle: string;
  eventType: CalendarEventType;
  /** Fecha de inicio del evento (YYYY-MM-DD). */
  eventDate: string;
  /** Fecha de fin del evento (YYYY-MM-DD). */
  eventEndDate: string;
  researchName: string | null;
  /** Markdown del informe o análisis mostrado al usuario. */
  content: string;
  /** ISO 8601 — momento de generación por el modelo. */
  generatedAt: string;
  analysisType: CalendarAiAnalysisType;
  /** Solo cuando analysisType === "task_assignment". */
  assignmentProposal?: TaskAssignmentProposal | null;
  /** Hallazgos detectados (opcional, sobre todo en asignación programada). */
  findings?: TaskAssignmentFinding[] | null;
}

/** Respuesta 201 del POST. */
export interface CalendarAiAnalysisRecord {
  id: string;
  calendarEventId: string;
  researchId: string | number | null;
  eventTitle: string;
  eventType: CalendarEventType;
  eventDate: string;
  eventEndDate: string | null;
  researchName: string | null;
  content: string;
  generatedAt: string;
  analysisType: CalendarAiAnalysisType;
  assignmentProposal: TaskAssignmentProposal | null;
  model?: string | null;
  createdAt: string;
}

/** PATCH /api/v1/calendar-ai-analyses/:id */
export interface UpdateCalendarAiAnalysisPayload {
  eventTitle?: string;
  researchName?: string | null;
  content?: string;
  eventDate?: string;
}

/** GET /api/v1/calendar-ai-analyses?… */
export interface ListCalendarAiAnalysesQuery {
  calendarEventId?: string;
  researchId?: string | number;
  analysisType?: CalendarAiAnalysisType;
  from?: string;
  to?: string;
}

/** Hallazgo detectado por la IA durante asignación o seguimiento programado. */
export interface TaskAssignmentFinding {
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
}

/** Envelope parseado de la respuesta del modelo al asignar tarea. */
export interface TaskAssignmentAIEnvelope {
  reportMarkdown: string;
  assignment: TaskAssignmentProposal;
  findings: TaskAssignmentFinding[];
}
