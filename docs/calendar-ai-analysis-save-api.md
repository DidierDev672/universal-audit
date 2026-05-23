# Guardar análisis IA del calendario — Guía API REST paso a paso

Este documento describe cómo implementar en el backend el almacenamiento del análisis generado por IA desde el panel **Analizar IA** del calendario (`CalendarAIResearchPanel.vue` + `CalendarPage.vue`).

---

## 1. Contexto en el frontend

### 1.1 Flujo actual

1. El usuario abre **Calendario** → tabla **Resumen del Mes**.
2. Pulsa **Analizar IA** en una fila → se genera markdown con Gemini (`useGetGenerativeModelGP`).
3. En el modal, pulsa **Guardar** → el cliente envía un `POST` al endpoint documentado abajo.

### 1.2 Constante y payload (Vue)

```typescript
const CALENDAR_AI_ANALYSES_API =
  "http://localhost:3000/api/v1/calendar-ai-analyses";

// POST body (revisión de evento — tabla «Analizar IA»)
{
  calendarEventId: string;
  researchId: string | number | null;
  eventTitle: string;
  eventType: "task" | "research";
  eventDate: string;            // YYYY-MM-DD inicio
  eventEndDate: string;         // YYYY-MM-DD fin
  researchName: string | null;
  content: string;              // markdown del análisis IA
  generatedAt: string;          // ISO 8601
  analysisType: "event_review";
  assignmentProposal: null;
}
```

**Asignación de tarea con IA** (`analysisType: "task_assignment"`, modal «Asignar con IA»): ver [calendar-task-ai-assignment-api.md](./calendar-task-ai-assignment-api.md).

Tipos y cliente HTTP: `src/shared/types/calendarAiAnalysis.ts`, `src/shared/api/calendarAiAnalysisApi.ts`.

### 1.3 Relación con otros recursos

| Recurso | Uso |
|---------|-----|
| `GET /api/v1/calendar-events` | Origen de las filas del resumen (id, título, fecha, investigación). |
| `GET /api/v1/research` | Catálogo de investigaciones (desplegable de tareas). |
| `POST /api/v1/investigaciones` | **Patrón existente** en `ModalIAResearch.vue` para guardar texto IA ligado a una investigación (`id_resource`, `content_resource`). El recurso nuevo de calendario es **independiente** pero puede reutilizar la misma tabla si lo deseas. |

---

## 2. Modelo de dominio sugerido

### 2.1 Entidad `calendar_ai_analysis`

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | UUID / string | PK |
| `calendar_event_id` | string | FK opcional a `calendar_event.id` |
| `research_id` | string \| null | FK opcional a `research.id` |
| `event_title` | string | Desnormalizado (histórico si cambia el evento) |
| `event_type` | enum `task`, `research` | |
| `event_date` | date | Inicio del rango del evento |
| `event_end_date` | date \| null | Fin del rango |
| `analysis_type` | enum | `event_review` \| `task_assignment` |
| `assignment_proposal` | jsonb \| null | Propuesta estructurada (solo task_assignment) |
| `research_name` | string \| null | Desnormalizado |
| `content` | text | Markdown completo del análisis |
| `model` | string \| null | Ej. `gemini-2.0-flash` (opcional, backend puede rellenarlo) |
| `generated_at` | timestamptz | Momento en que se generó el texto |
| `created_at` | timestamptz | Alta en BD |
| `user_id` / `tenant_id` | según auth | Multitenancy |

Índices recomendados: `(calendar_event_id)`, `(research_id)`, `(event_date)`, `(created_at DESC)`.

### 2.2 Ejemplo JSON persistido

```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "calendarEventId": "evt-42",
  "researchId": "550e8400-e29b-41d4-a716-446655440000",
  "eventTitle": "Revisar laboratorio",
  "eventType": "task",
  "eventDate": "2026-05-10",
  "researchName": "Estudio de audición infantil",
  "content": "## Resumen ejecutivo\n…",
  "model": "gemini-2.0-flash",
  "generatedAt": "2026-05-16T14:22:00.000Z",
  "createdAt": "2026-05-16T14:22:05.000Z"
}
```

---

## 3. Guía paso a paso — Implementación REST

### Paso 1 — Crear migración / tabla

1. Crear tabla `calendar_ai_analyses` con los campos de la sección 2.
2. FK `calendar_event_id` → `calendar_events(id)` con `ON DELETE SET NULL` (conservar historial aunque se borre el evento) o `CASCADE` si no necesitas historial.
3. FK `research_id` → `research(id)` nullable.

### Paso 2 — Definir DTO de entrada (POST)

Validaciones mínimas:

| Campo | Regla |
|-------|--------|
| `calendarEventId` | Requerido, string no vacío; debe existir en `calendar_events` (recomendado). |
| `content` | Requerido, longitud mínima 10, máximo según límite de BD (ej. 500 KB). |
| `eventTitle` | Requerido |
| `eventType` | `task` \| `research` |
| `eventDate` | Formato `YYYY-MM-DD` |
| `generatedAt` | ISO 8601 válido |
| `researchId` | Opcional; si viene, debe existir en `research` |

Respuestas de error sugeridas:

- `400` — validación fallida (detalle por campo).
- `404` — `calendarEventId` o `researchId` inexistente.
- `401` / `403` — sin autenticación o sin permiso sobre el evento.

### Paso 3 — Endpoint principal

```http
POST /api/v1/calendar-ai-analyses
Content-Type: application/json
Authorization: Bearer <token>
```

**Cuerpo** (igual al que envía el frontend):

```json
{
  "calendarEventId": "evt-42",
  "researchId": "550e8400-e29b-41d4-a716-446655440000",
  "eventTitle": "Revisar laboratorio",
  "eventType": "task",
  "eventDate": "2026-05-10",
  "researchName": "Estudio de audición infantil",
  "content": "## Resumen ejecutivo\n…",
  "generatedAt": "2026-05-16T14:22:00.000Z"
}
```

**Respuesta 201:**

```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "calendarEventId": "evt-42",
  "createdAt": "2026-05-16T14:22:05.000Z"
}
```

### Paso 4 — Endpoints de consulta (opcionales pero útiles)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/calendar-ai-analyses?calendarEventId=evt-42` | Listar análisis de un evento |
| `GET` | `/api/v1/calendar-ai-analyses/:id` | Detalle (contenido markdown) |
| `GET` | `/api/v1/calendar-ai-analyses?researchId=…&from=&to=` | Informes por investigación y rango |
| `DELETE` | `/api/v1/calendar-ai-analyses/:id` | Borrado lógico o físico |

### Paso 5 — Autenticación y autorización

1. Resolver usuario desde el token JWT / sesión.
2. Comprobar que el `calendar_event` pertenece al mismo `tenant_id` / `user_id`.
3. Rechazar `POST` si el evento no es visible para el usuario.

### Paso 6 — Pseudocódigo del controlador (Node/Express ejemplo)

```javascript
async function createCalendarAiAnalysis(req, res) {
  const {
    calendarEventId,
    researchId,
    eventTitle,
    eventType,
    eventDate,
    researchName,
    content,
    generatedAt,
  } = req.body;

  // 1. Validar DTO
  // 2. const event = await CalendarEvent.findById(calendarEventId, req.user);
  // 3. if (!event) return res.status(404).json({ message: 'Evento no encontrado' });
  // 4. if (researchId) await Research.assertExists(researchId, req.user);

  const row = await db.calendarAiAnalysis.create({
    calendar_event_id: calendarEventId,
    research_id: researchId ?? null,
    event_title: eventTitle,
    event_type: eventType,
    event_date: eventDate,
    research_name: researchName,
    content,
    generated_at: new Date(generatedAt),
    user_id: req.user.id,
  });

  return res.status(201).json({
    id: row.id,
    calendarEventId: row.calendar_event_id,
    createdAt: row.created_at,
  });
}
```

### Paso 7 — Enriquecer GET `/calendar-events` (recomendado)

Para mostrar en la tabla si un evento ya tiene análisis guardado, puedes añadir en la respuesta del evento:

```json
{
  "id": "evt-42",
  "title": "…",
  "hasAiAnalysis": true,
  "lastAiAnalysisAt": "2026-05-16T14:22:05.000Z"
}
```

El frontend podría mostrar un badge sin cambiar el flujo de guardado.

### Paso 8 — Alternativa: reutilizar `POST /investigaciones`

Si **no** quieres un recurso nuevo y el evento siempre tiene `researchId` numérico:

```http
POST /api/v1/investigaciones
```

```json
{
  "id_resource": 123,
  "content_resource": "<markdown del análisis>"
}
```

**Limitaciones:** no guarda `calendarEventId`, `eventDate` ni `eventType`. Solo recomendable como atajo temporal.

### Paso 9 — Pruebas manuales

1. Generar análisis IA en el calendario y pulsar **Guardar** → esperar `201`.
2. Repetir guardado sobre el mismo evento → decidir si permites varias versiones o upsert por `calendar_event_id`.
3. `POST` sin `content` → `400`.
4. `calendarEventId` inexistente → `404`.
5. Usuario sin permiso → `403`.

### Paso 10 — Verificación con curl

```bash
curl -X POST http://localhost:3000/api/v1/calendar-ai-analyses \
  -H "Content-Type: application/json" \
  -d '{
    "calendarEventId": "evt-42",
    "researchId": null,
    "eventTitle": "Revisar laboratorio",
    "eventType": "task",
    "eventDate": "2026-05-10",
    "researchName": null,
    "content": "## Resumen\nPrueba de guardado.",
    "generatedAt": "2026-05-16T14:22:00.000Z"
  }'
```

---

## 4. Integración frontend (ya implementada)

| Archivo | Responsabilidad |
|---------|-----------------|
| `src/components/calendar/CalendarAIResearchPanel.vue` | Botón **Guardar**, estados `saving` / `saveError` / `saveSuccess`, emit `save`. |
| `src/pages/Calendar/CalendarPage.vue` | `saveAIAnalysis()` → `POST` a `calendar-ai-analyses`. |

Tras desplegar el backend, el botón **Guardar** dejará de mostrar error de red y mostrará el mensaje de éxito en verde dentro del panel.

---

## 5. Resumen

- El frontend envía el markdown del análisis junto con metadatos del evento de calendario.
- El endpoint recomendado es **`POST /api/v1/calendar-ai-analyses`** con tabla dedicada.
- Opcionalmente enlaza con `research` y `calendar_events` mediante FKs.
- Para listados históricos por investigación, añade `GET` con filtros; para UX en calendario, expón `hasAiAnalysis` en `GET /calendar-events`.
