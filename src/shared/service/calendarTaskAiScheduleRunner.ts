import { push } from "notivue";
import { useCalendarTaskAiScheduleStore } from "../../stores/calendarTaskAiSchedule";
import { useNotificationsStore } from "../../stores/notifications";
import type { TaskAssignmentFinding } from "../types/calendarAiAnalysis";
import type {
  CalendarTaskAiScheduleJob,
  CalendarResearchDraftSnapshot,
  CalendarTaskDraftSnapshot,
} from "../types/calendarTaskAiSchedule";
import { formatDateKey } from "../utils/dateKeys";
import {
  deliverAiFindingToInbox,
  deliverAiReportToInbox,
} from "./calendarAiInboxDelivery";
import { useGetGenerativeModelGP } from "./useGetGenerativeModelGP";
import { postCalendarAiAnalysis } from "../api/calendarAiAnalysisApi";
import type { CreateCalendarAiAnalysisPayload } from "../types/calendarAiAnalysis";

function normalizeFindings(raw: unknown): TaskAssignmentFinding[] {
  if (!Array.isArray(raw)) return [];
  const out: TaskAssignmentFinding[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const f = item as Record<string, unknown>;
    const title = typeof f.title === "string" ? f.title.trim() : "";
    const description =
      typeof f.description === "string" ? f.description.trim() : "";
    if (!title) continue;
    const sev = f.severity;
    const severity =
      sev === "critical" || sev === "warning" || sev === "info"
        ? sev
        : "warning";
    out.push({ severity, title, description: description || title });
  }
  return out;
}

function mapFindingToNotificationType(
  severity: TaskAssignmentFinding["severity"],
): "info" | "warning" | "error" {
  if (severity === "critical") return "error";
  if (severity === "warning") return "warning";
  return "info";
}

function publishFindings(
  findings: TaskAssignmentFinding[],
  eventTitle: string,
  eventType: CalendarTaskAiScheduleJob["eventType"],
  calendarEventId: string,
  jobId: string,
) {
  if (!findings.length) return;
  const notificationsStore = useNotificationsStore();

  for (const finding of findings) {
    const type = mapFindingToNotificationType(finding.severity);
    const label = eventType === "research" ? "Investigación" : "Tarea";
    const title = `Hallazgo IA — ${label}: ${eventTitle}`;
    const message = `${finding.title}${finding.description ? `: ${finding.description}` : ""}`;

    notificationsStore.add({
      title,
      message,
      type,
      scheduledFor: new Date().toISOString(),
    });
    push[type]({ title, message });

    deliverAiFindingToInbox({
      eventTitle,
      eventType,
      calendarEventId,
      jobId,
      finding,
    });
  }
}

function buildTaskPrompt(draft: CalendarTaskDraftSnapshot): string {
  const today = formatDateKey(new Date());
  const inv = draft.researchName
    ? `Investigación asociada: «${draft.researchName}».`
    : "Sin investigación asociada (mantén coherencia con salud auditiva).";

  return `Eres un asistente experto en salud auditiva e investigación clínica.

Analiza y refina esta tarea del calendario de investigaciones.
${inv}
Fecha de referencia (hoy): ${today}.

Tarea:
- Título: ${draft.title}
- Descripción: ${draft.description || "(sin descripción)"}
- Rango: ${draft.startDate} – ${draft.endDate}

Responde SOLO con JSON válido:
{
  "reportMarkdown": "informe en markdown",
  "findings": [{ "severity": "info|warning|critical", "title": "...", "description": "..." }]
}`;
}

function buildResearchPrompt(draft: CalendarResearchDraftSnapshot): string {
  const schedule =
    draft.startTime && draft.endTime
      ? `${draft.startTime} – ${draft.endTime}`
      : "—";

  return `Eres un asistente experto en salud y educación e investigación clínica.

Analiza este bloque de investigación en el calendario.

Datos:
- Título: ${draft.title}
- Descripción: ${draft.description || "(sin descripción)"}
- Horario: ${schedule}
- Rango: ${draft.startDate} – ${draft.endDate}

Responde SOLO con JSON válido:
{
  "reportMarkdown": "informe en markdown",
  "findings": [{ "severity": "info|warning|critical", "title": "...", "description": "..." }]
}`;
}

function parseAiEnvelope(raw: string): {
  reportMarkdown: string;
  findings: TaskAssignmentFinding[];
} | null {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    if (trimmed.length < 40) return null;
    return { reportMarkdown: trimmed, findings: [] };
  }
  try {
    const parsed = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
    const reportMarkdown =
      typeof parsed.reportMarkdown === "string"
        ? parsed.reportMarkdown.trim()
        : trimmed;
    if (!reportMarkdown) return null;
    return {
      reportMarkdown,
      findings: normalizeFindings(parsed.findings),
    };
  } catch {
    if (trimmed.length < 40) return null;
    return { reportMarkdown: trimmed, findings: [] };
  }
}

function readAxiosErrorMessage(err: unknown): string | null {
  if (!err || typeof err !== "object") return null;
  const e = err as { response?: { data?: { message?: string } }; message?: string };
  return e.response?.data?.message ?? e.message ?? null;
}

export async function runScheduledCalendarAiJob(
  job: CalendarTaskAiScheduleJob,
): Promise<void> {
  const today = formatDateKey(new Date());
  if (today < job.startDate || today > job.endDate) return;
  if (job.lastRunDate === today) return;

  const scheduleStore = useCalendarTaskAiScheduleStore();
  const notificationsStore = useNotificationsStore();
  const eventType = job.eventType ?? "task";

  try {
    let prompt: string | null = null;
    let startDate = job.startDate;
    let endDate = job.endDate;

    if (eventType === "research" && job.researchDraft) {
      prompt = buildResearchPrompt(job.researchDraft);
      startDate = job.researchDraft.startDate;
      endDate = job.researchDraft.endDate;
    } else if (eventType === "task" && job.taskDraft) {
      prompt = buildTaskPrompt(job.taskDraft);
      startDate = job.taskDraft.startDate;
      endDate = job.taskDraft.endDate;
    }

    if (!prompt) return;

    const raw = await useGetGenerativeModelGP(prompt);
    const envelope = parseAiEnvelope(raw ?? "");
    if (!envelope) {
      throw new Error("No se pudo interpretar la respuesta de la IA.");
    }

    scheduleStore.markRunToday(job.id, today);
    publishFindings(
      envelope.findings,
      job.eventTitle,
      eventType,
      job.calendarEventId,
      job.id,
    );

    deliverAiReportToInbox({
      eventTitle: job.eventTitle,
      eventType,
      calendarEventId: job.calendarEventId,
      jobId: job.id,
      reportMarkdown: envelope.reportMarkdown,
      findingsCount: envelope.findings.length,
    });

    if (envelope.findings.length > 0) {
      const payload: CreateCalendarAiAnalysisPayload = {
        calendarEventId: job.calendarEventId,
        researchId:
          eventType === "task"
            ? (job.taskDraft?.researchId ?? null)
            : null,
        eventTitle: job.eventTitle,
        eventType,
        eventDate: startDate,
        eventEndDate: endDate,
        researchName: job.researchName,
        content: envelope.reportMarkdown,
        generatedAt: new Date().toISOString(),
        analysisType: "task_assignment",
        assignmentProposal: null,
        findings: envelope.findings,
      };
      await postCalendarAiAnalysis(payload).catch((err) =>
        console.warn("[scheduledAi save]", err),
      );
    }
  } catch (err) {
    console.error("[runScheduledCalendarAiJob]", err);
    const errTitle =
      eventType === "research"
        ? "Error en seguimiento IA de investigación"
        : "Error en seguimiento IA programado";
    const errMsg =
      readAxiosErrorMessage(err) ||
      `No se pudo analizar «${job.eventTitle}» hoy.`;
    notificationsStore.add({
      title: errTitle,
      message: errMsg,
      type: "error",
      scheduledFor: new Date().toISOString(),
    });
    push.error({ title: errTitle, message: errMsg });
  }
}

export async function processScheduledCalendarAiJobs(): Promise<void> {
  const today = formatDateKey(new Date());
  const scheduleStore = useCalendarTaskAiScheduleStore();
  scheduleStore.pruneExpired(today);

  for (const job of [...scheduleStore.jobs]) {
    if (today < job.startDate || today > job.endDate) continue;
    if (job.lastRunDate === today) continue;
    await runScheduledCalendarAiJob(job);
  }
}
