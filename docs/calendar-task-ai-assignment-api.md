# Asignación de tarea con IA — Esquema API y payloads

Complementa [calendar-ai-analysis-save-api.md](./calendar-ai-analysis-save-api.md). El frontend usa el **mismo recurso** `calendar-ai-analyses` con `analysisType: "task_assignment"`.

---

## 1. Flujo en el frontend

1. Usuario abre el detalle de una **tarea** en el calendario.
2. Pulsa **Asignar con IA** → `TaskAssignModeDialog` pregunta el modo:
   - **Instantánea** → `CalendarTaskAssignmentAIPanel` con análisis inmediato.
   - **Programada en rango** → seguimiento diario entre `startDate` y `endDate`; hallazgos en campana de notificaciones (`useNotificationsStore` + Notivue).
3. Gemini devuelve JSON con `reportMarkdown` + `assignment` + `findings[]`.
4. El usuario puede (modo instantáneo):
   - **Guardar** → `POST /api/v1/calendar-ai-analyses`
   - **Aplicar propuesta** → actualiza la tarea en memoria (calendario)
   - **Regenerar** / **Expandir** / **Cerrar**

Cliente HTTP: `src/shared/api/calendarAiAnalysisApi.ts`  
Tipos: `src/shared/types/calendarAiAnalysis.ts`

---

## 2. Respuesta esperada del modelo (antes del POST)

```json
{
  "reportMarkdown": "## Resumen\n…\n## Propuesta de fechas y horario\n…",
  "assignment": {
    "title": "Revisar protocolo de higiene auditiva",
    "description": "Coordinar revisión con el equipo de investigación.",
    "startDate": "2026-05-16",
    "endDate": "2026-06-30",
    "startTime": "09:00",
    "endTime": "17:00"
  },
  "findings": []
}
```

| Campo | Tipo | Reglas |
|-------|------|--------|
| `reportMarkdown` | string | Markdown en español, mín. 50 caracteres |
| `findings` | array | Ver tabla de severidad más abajo; `[]` si no hay alertas |
| `assignment.title` | string | Obligatorio |
| `assignment.startDate` | string | `YYYY-MM-DD` |
| `assignment.endDate` | string | `YYYY-MM-DD`, ≥ startDate |
| `assignment.startTime` | string | `HH:mm` |
| `assignment.endTime` | string | `HH:mm` |
| `assignment.description` | string | Opcional |

---

## 3. POST — Guardar análisis de asignación

```http
POST /api/v1/calendar-ai-analyses
Content-Type: application/json
```

### Payload (`CreateCalendarAiAnalysisPayload`)

```json
{
  "calendarEventId": "evt-42",
  "researchId": "550e8400-e29b-41d4-a716-446655440000",
  "eventTitle": "Implementación de tecnologías…",
  "eventType": "task",
  "eventDate": "2026-05-16",
  "eventEndDate": "2026-06-30",
  "researchName": "Estudio de audición infantil",
  "content": "## Resumen\n…",
  "generatedAt": "2026-05-16T19:01:00.000Z",
  "analysisType": "task_assignment",
  "assignmentProposal": {
    "title": "…",
    "description": "…",
    "startDate": "2026-05-16",
    "endDate": "2026-06-30",
    "startTime": "09:00",
    "endTime": "17:00"
  }
}
```

| Campo | Requerido | Notas |
|-------|-----------|--------|
| `analysisType` | Sí | `"task_assignment"` \| `"event_review"` |
| `assignmentProposal` | Sí si `task_assignment` | Objeto assignment; `null` si `event_review` |
| `eventEndDate` | Recomendado | Fin del rango del evento |
| Resto | Igual que revisión de evento | Ver doc principal |

### Respuesta 201 (`CalendarAiAnalysisRecord`)

```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "calendarEventId": "evt-42",
  "researchId": "550e8400-e29b-41d4-a716-446655440000",
  "eventTitle": "Implementación de tecnologías…",
  "eventType": "task",
  "eventDate": "2026-05-16",
  "eventEndDate": "2026-06-30",
  "researchName": "Estudio de audición infantil",
  "content": "## Resumen\n…",
  "generatedAt": "2026-05-16T19:01:00.000Z",
  "analysisType": "task_assignment",
  "assignmentProposal": { "title": "…", "startDate": "…", "endDate": "…", "startTime": "…", "endTime": "…", "description": "…" },
  "findings": [{ "severity": "warning", "title": "…", "description": "…" }],
  "model": "gemini-2.0-flash",
  "createdAt": "2026-05-16T19:01:05.000Z"
}
```

---

## 4. GET — Consultar análisis guardados

```http
GET /api/v1/calendar-ai-analyses?calendarEventId=evt-42&analysisType=task_assignment
GET /api/v1/calendar-ai-analyses/:id
DELETE /api/v1/calendar-ai-analyses/:id
```

Query opcionales: `researchId`, `from`, `to`, `analysisType`.

---

## 5. Tabla sugerida (campos adicionales)

Además de los campos de `calendar_ai_analyses` existentes:

| Columna | Tipo |
|---------|------|
| `analysis_type` | enum `event_review`, `task_assignment` |
| `event_end_date` | date nullable |
| `assignment_proposal` | jsonb nullable |
| `findings` | jsonb nullable |

Índice: `(calendar_event_id, analysis_type, created_at DESC)`.

---

## 5.1 Seguimiento programado (frontend)

Store Pinia: `calendarTaskAiSchedule` (`src/stores/calendarTaskAiSchedule.ts`).

| Campo job | Descripción |
|-----------|-------------|
| `calendarEventId` | Tarea a vigilar |
| `startDate` / `endDate` | Rango de ejecución |
| `lastRunDate` | Último día analizado (`YYYY-MM-DD`) |

Cada minuto (en `CalendarPage`) se ejecuta un análisis si `hoy` está en el rango y aún no corrió hoy. Los `findings` se publican en `useNotificationsStore` + toast Notivue.

---

## 6. Comparación de tipos de análisis

| | `event_review` | `task_assignment` |
|--|----------------|-------------------|
| Origen UI | Tabla resumen → Analizar IA | Detalle tarea → Asignar con IA |
| `content` | Informe del evento | Informe de la propuesta |
| `assignmentProposal` | `null` | Objeto con fechas/horas/título |
| Aplicar en UI | No | Botón «Aplicar propuesta» |
| Modo programado | No | Seguimiento diario + notificaciones |
| `findings` | Opcional | En notificaciones si hay hallazgos |
