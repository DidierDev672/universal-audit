import { useInboxStore } from "../../stores/inbox";
import type { TaskAssignmentFinding } from "../types/calendarAiAnalysis";
import type { CalendarAiScheduleEventType } from "../types/calendarTaskAiSchedule";

function mapSeverityToCategory(
  severity: TaskAssignmentFinding["severity"],
): "urgent" | "other" {
  return severity === "critical" || severity === "warning" ? "urgent" : "other";
}

function mapSeverityToColor(severity: TaskAssignmentFinding["severity"]): string {
  if (severity === "critical") return "red";
  if (severity === "warning") return "amber";
  return "blue";
}

export interface DeliverAiFindingPayload {
  eventTitle: string;
  eventType: CalendarAiScheduleEventType;
  calendarEventId: string;
  jobId?: string;
  finding: TaskAssignmentFinding;
}

export interface DeliverAiReportPayload {
  eventTitle: string;
  eventType: CalendarAiScheduleEventType;
  calendarEventId: string;
  jobId?: string;
  reportMarkdown: string;
  findingsCount: number;
}

export function deliverAiFindingToInbox(payload: DeliverAiFindingPayload) {
  const inbox = useInboxStore();
  const prefix =
    payload.eventType === "research" ? "Investigación IA" : "Tarea IA";
  const subject = `${prefix}: ${payload.finding.title}`;
  const preview = `${payload.eventTitle} — ${payload.finding.description || payload.finding.title}`;

  inbox.addAiResultMessage({
    from: "Asistente IA · Calendario",
    subject,
    preview,
    body: `${preview}\n\nEvento: ${payload.eventTitle}\nTipo: ${payload.eventType === "research" ? "Investigación" : "Tarea"}`,
    category: mapSeverityToCategory(payload.finding.severity),
    avatar: "IA",
    color: mapSeverityToColor(payload.finding.severity),
    calendarEventId: payload.calendarEventId,
    jobId: payload.jobId,
    eventType: payload.eventType,
  });
}

export function deliverAiReportToInbox(payload: DeliverAiReportPayload) {
  const inbox = useInboxStore();
  const prefix =
    payload.eventType === "research"
      ? "Informe de investigación IA"
      : "Informe de tarea IA";
  const subject = `${prefix}: ${payload.eventTitle}`;
  const preview =
    payload.findingsCount > 0
      ? `${payload.findingsCount} hallazgo(s) detectado(s) en el seguimiento programado.`
      : "Seguimiento programado completado sin hallazgos críticos.";

  inbox.addAiResultMessage({
    from: "Asistente IA · Calendario",
    subject,
    preview,
    body: payload.reportMarkdown,
    category: payload.findingsCount > 0 ? "urgent" : "other",
    avatar: "IA",
    color: payload.findingsCount > 0 ? "amber" : "blue",
    calendarEventId: payload.calendarEventId,
    jobId: payload.jobId,
    eventType: payload.eventType,
  });
}
