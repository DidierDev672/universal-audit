# Calendario de investigaciones y tareas — Análisis del frontend y guía API REST

Este documento se basa en `src/pages/Calendar/CalendarPage.vue` (versión analizada).

---

## 1. Qué contiene el componente

### 1.1 Vista principal

| Bloque | Función |
|--------|---------|
| **Cabecera** | Título “Calendario de Investigaciones”, botones **Nueva Tarea** y **Nueva Investigación**. |
| **Alerta** | Si falla la carga de investigaciones (`researchError`). |
| **Navegación de mes** | Mes/año, anterior/siguiente, **Hoy**. |
| **Cuadrícula 7×6** | Días del mes + días “relleno” del mes anterior/siguiente. Cada celda muestra hasta 3 eventos con badge por tipo (tarea = morado, investigación = azul). |
| **Tabla resumen** | Listado del mes actual: día/fecha, tipo, título, investigación asociada (solo tareas o “—”). |
| **Modal tarea** | Crear/editar: título, descripción, fechas inicio/fin, horas inicio/fin, investigación opcional, validación fechas, duración estimada en días. |
| **Modal investigación (calendario)** | Crear/editar periodo en calendario: título, descripción, fechas y horas (no confundir con el recurso CRUD de “research” del backend usado en el listado). |
| **Modal detalle** | Ver evento, editar o eliminar. |

### 1.2 Estado y tipos TypeScript (frontend)

```typescript
// Research (listado para el <select> de tareas) — coincide con GET /api/v1/research
interface Research {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Evento unificado para calendario + tabla + modales
interface CalendarEvent {
  id: string;
  type: 'task' | 'research';
  title: string;
  description: string;
  date: string;           // YYYY-MM-DD — en el código actual se usa = startDate (día “principal” en grilla)
  startDate: string;      // YYYY-MM-DD
  endDate: string;        // YYYY-MM-DD
  startTime: string;      // HH:mm (input time)
  endTime: string;        // HH:mm
  researchId?: number;    // solo tareas; opcional
  researchName?: string;  // desnormalizado en cliente
}
```

### 1.3 Comportamiento de datos importante

- **`fetchResearch()`**: `GET http://localhost:3000/api/v1/research` → rellena `researchList`.
- **Eventos (`events`)**: hoy **solo viven en memoria** en el componente; no hay `POST`/`PUT`/`DELETE` a la API en el código actual.
- **Filtrado en el calendario**: `getEventsForDate` compara `event.date === dateKey` con la fecha como `YYYY-MM-DD`. Al guardar, `date` se iguala a `startDate`, por tanto **un evento aparece en un único día** (inicio), aunque el intervalo pueda ser multi-día en `startDate`/`endDate`.
- **Creación “Nueva Investigación” desde el calendario** genera un `CalendarEvent` de tipo `research`, **no** necesariamente un registro en la tabla de investigaciones del resto de la app; el diseño de API debe aclarar si esto enlaza con `Research` o es solo un “bloque de agenda”.

---

## 2. Estructura JSON de datos (orientada a API)

### 2.1 Research (recurso de investigación — listado existente)

Ejemplo alineado con lo que consume el calendario para el desplegable:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Estudio de audición infantil",
  "description": "Descripción breve o extendida",
  "createdAt": "2026-01-15T10:00:00.000Z",
  "updatedAt": "2026-02-01T14:30:00.000Z"
}
```

Listado:

```json
[
  { "id": "…", "name": "…", "description": "…", "createdAt": "…", "updatedAt": "…" }
]
```

### 2.2 Calendar event (evento de agenda — modelo sugerido para persistir)

Un único recurso unificado con `type` evita duplicar endpoints en frontend:

```json
{
  "id": "019abc12-…-uuid",
  "type": "task",
  "title": "Revisar resultados de laboratorio",
  "description": "Opcional",
  "startDate": "2026-05-10",
  "endDate": "2026-05-12",
  "startTime": "09:00",
  "endTime": "11:30",
  "researchId": "550e8400-e29b-41d4-a716-446655440000",
  "researchName": "Estudio de audición infantil"
}
```

Evento tipo investigación en calendario (sin `researchId` explícito en UI actual):

```json
{
  "id": "019abc13-…-uuid",
  "type": "research",
  "title": "Ventana de trabajo — Fase 1",
  "description": "Bloque agendado en calendario",
  "startDate": "2026-05-15",
  "endDate": "2026-05-20",
  "startTime": "08:00",
  "endTime": "18:00",
  "researchId": null,
  "researchName": null
}
```

**Alternativa de diseño:** relacionar el evento `type: "research"` con el `Research` real mediante `researchId` en backend (el frontend actual no lo pide, pero facilita informes).

### 2.3 Respuesta agregada para el calendario (un solo payload)

Útil para una sola carga al abrir la página:

```json
{
  "researchList": [
    {
      "id": "…",
      "name": "…",
      "description": "…",
      "createdAt": "…",
      "updatedAt": "…"
    }
  ],
  "events": [
    {
      "id": "…",
      "type": "task",
      "title": "…",
      "description": "",
      "date": "2026-05-10",
      "startDate": "2026-05-10",
      "endDate": "2026-05-12",
      "startTime": "09:00",
      "endTime": "11:30",
      "researchId": 123,
      "researchName": "Nombre investigación"
    }
  ],
  "meta": {
    "from": "2026-05-01",
    "to": "2026-05-31"
  }
}
```

> Nota: mantener `date` igual a `startDate` si se quiere compatibilidad con la lógica actual del grid.

### 2.4 Filtros por rango (query sugerida)

```http
GET /api/v1/calendar-events?from=2026-05-01&to=2026-05-31
```

---

## 3. Guía paso a paso — API REST para almacenar y gestionar investigaciones y tareas

Supone prefijo estándar del proyecto: `/api/v1`.

### Paso 1 — Alinear el modelo de dominio

1. Confirmar si **“investigación” del calendario** = fila en tabla `research` o **evento de agenda independiente**.
2. Para **tareas**, decidir si son siempre `CalendarEvent` con `type: task` y `researchId` opcional (FK a `research`).
3. Definir **IDs**: `string` (UUID) como en el listado actual de research, o numéricos; el frontend usa `research.id` como string y en tareas a veces parsea con `parseInt` — conviene **un solo tipo** (recomendado: UUID string en toda la API).

### Paso 2 — Tablas / entidades sugeridas

| Entidad | Rol |
|---------|-----|
| `research` | Ya existente; usada en `GET /research` y asociación opcional de tareas. |
| `calendar_event` (o `scheduled_items`) | `id`, `type` (`task`|`research_calendar`), `title`, `description`, `start_date`, `end_date`, `start_time`, `end_time`, `research_id` (nullable FK), `user_id` o `tenant_id`, `created_at`, `updated_at`. |

Índices: `(start_date, end_date)`, `research_id`, `type`.

### Paso 3 — Endpoints REST mínimos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/v1/research` | Ya usado; listado para el `<select>`. |
| `GET` | `/api/v1/calendar-events` | Lista eventos; query `from`, `to` obligatorias o con default mes actual. |
| `GET` | `/api/v1/calendar-events/:id` | Detalle (modal). |
| `POST` | `/api/v1/calendar-events` | Crear tarea o bloque investigación en calendario. |
| `PATCH` | `/api/v1/calendar-events/:id` | Actualizar (editar desde modal). |
| `DELETE` | `/api/v1/calendar-events/:id` | Eliminar evento. |

**Cuerpo POST/PATCH (ejemplo tarea):**

```json
{
  "type": "task",
  "title": "Revisar laboratorio",
  "description": "",
  "startDate": "2026-05-10",
  "endDate": "2026-05-10",
  "startTime": "09:00",
  "endTime": "17:00",
  "researchId": "550e8400-e29b-41d4-a716-446655440000"
}
```

Validaciones recomendadas en servidor: `endDate >= startDate`, horas coherentes si mismo día, título requerido, `researchId` debe existir si viene informado.

### Paso 4 — Opcional: vista combinada

- `GET /api/v1/calendar/bootstrap?month=2026-05` → devuelve `{ researchList, events }` para una sola petición al montar `CalendarPage`.

### Paso 5 — Autenticación y multitenancy

1. Asociar cada evento a `user_id` o `organization_id`.  
2. Filtrar siempre por contexto del usuario en `GET`/`PATCH`/`DELETE`.  
3. Respuestas `401`/`403` según corresponda.

### Paso 6 — Integración con el código Vue

1. Sustituir el array local `events` por datos de `GET calendar-events` tras `fetchResearch` (o usar bootstrap).
2. En `saveTask` / `saveResearch`, llamar `POST` o `PATCH` y actualizar estado con la respuesta (id real del servidor).
3. En `deleteEvent`, llamar `DELETE /calendar-events/:id`.
4. Unificar tipo de `researchId` (string vs number) para evitar `parseInt` inconsistente.

### Paso 7 — Pruebas

1. Crear tarea con y sin `researchId`.  
2. Crear evento tipo investigación en calendario.  
3. Listar rango que solape varios meses.  
4. Editar y borrar; comprobar `404` si el id no existe.  
5. Validar reglas de fechas en servidor (igual que `dateError` / `researchDateError` en cliente).

---

## 4. Resumen

- El componente **mezcla** dos conceptos: **research** como catálogo (API existente) y **eventos de calendario** (tareas + bloques “investigación”) que **hoy no persisten**.
- Para una API REST coherente, conviene un recurso **`calendar-events`** (o nombre similar) con el JSON unificado de la sección 2, más **`GET /research`** para el desplegable.
- La guía paso a paso anterior cubre modelo, endpoints, validaciones e integración frontend sin obligar a cambiar el UX actual del calendario.
