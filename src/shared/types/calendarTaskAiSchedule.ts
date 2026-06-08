/** Modo de ejecución elegido al asignar una tarea con IA. */
export type TaskAssignmentExecutionMode = "instant" | "scheduled_range";

export type CalendarAiScheduleEventType = "task" | "research";

/** Borrador de investigación en calendario (antes de guardar en servidor). */
export interface CalendarResearchDraftSnapshot {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

/** Snapshot de tarea para seguimiento IA sin depender del estado del calendario. */
export interface CalendarTaskDraftSnapshot {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  researchName?: string | null;
  researchId?: string | number | null;
}

/** Trabajo de seguimiento IA activo durante el rango de fechas del evento. */
export interface CalendarTaskAiScheduleJob {
  id: string;
  calendarEventId: string;
  eventTitle: string;
  startDate: string;
  endDate: string;
  researchName: string | null;
  eventType: CalendarAiScheduleEventType;
  researchDraft?: CalendarResearchDraftSnapshot | null;
  taskDraft?: CalendarTaskDraftSnapshot | null;
  /** Último día (YYYY-MM-DD) en que se ejecutó el análisis programado. */
  lastRunDate: string | null;
  createdAt: string;
}
