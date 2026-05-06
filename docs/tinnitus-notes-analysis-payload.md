# Estructura de Payload - Análisis de Notas por IA

## Endpoint: POST /api/v1/tinnitus-notes-analysis

### Request Body

```json
{
  "id_patient": "uuid",
  "id_tinnitus_questionnaires": "uuid",
  "id_tinnitus_response": "uuid",
  "analysis": "string (markdown/text)",
  "note_count": 5,
  "analyzed_at": "2024-05-06T14:30:00.000Z"
}
```

### Campos

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id_patient` | UUID | Sí | ID del paciente |
| `id_tinnitus_questionnaires` | UUID | No | ID del cuestionario de tinnitus |
| `id_tinnitus_response` | UUID | No | ID de la respuesta del cuestionario |
| `analysis` | string | Sí | Contenido del análisis generado por IA (formato markdown) |
| `note_count` | integer | No | Cantidad de notas analizadas |
| `analyzed_at` | ISO 8601 | No | Timestamp del análisis |

### Response Success (201)

```json
{
  "id": "uuid",
  "id_patient": "uuid",
  "id_tinnitus_questionnaires": "uuid",
  "id_tinnitus_response": "uuid",
  "analysis": "string",
  "note_count": 5,
  "analyzed_at": "2024-05-06T14:30:00.000Z",
  "created_by": "uuid",
  "created_at": "2024-05-06T14:30:00.000Z",
  "updated_at": "2024-05-06T14:30:00.000Z"
}
```

### Response Error (400/500)

```json
{
  "error": "Error al guardar el análisis",
  "message": "Descripción del error"
}
```

---

## Endpoint: GET /api/v1/tinnitus-notes-analysis/response/:responseId

### Response Success (200)

```json
[
  {
    "id": "uuid",
    "id_patient": "uuid",
    "id_tinnitus_questionnaires": "uuid",
    "id_tinnitus_response": "uuid",
    "analysis": "string",
    "note_count": 5,
    "analyzed_at": "2024-05-06T14:30:00.000Z",
    "created_by": "uuid",
    "created_at": "2024-05-06T14:30:00.000Z"
  }
]
```

---

## Ejemplo de Prompt para IA

```typescript
const prompt = `Eres un especialista médico en tinnitus. Analiza las siguientes notas clínicas y proporciona un resumen profesional, identificando patrones, observaciones importantes y recomendaciones para el tratamiento. Responde en español.

NOTAS DEL PACIENTE:

Nota 1: Título de la nota
Contenido: Contenido de la nota
Contextos:
  - Contexto 1: Descripción del contexto
  - Contexto 2: Descripción del contexto

---

Nota 2: Otro título
Contenido: Otro contenido

Por favor, proporciona:
1. Resumen ejecutivo de las notas
2. Patrones identificados
3. Observaciones críticas
4. Recomendaciones basadas en las notas
5. Preguntas de seguimiento sugeridas`;
```

## Tablas de Supabase

### tinnitus_notes_analysis

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID (PK) | Identificador único |
| id_patient | UUID (FK) | Relación con paciente |
| id_tinnitus_questionnaires | UUID (FK) | Relación con cuestionario |
| id_tinnitus_response | UUID (FK) | Relación con respuesta |
| analysis | TEXT | Análisis generado por IA |
| note_count | INTEGER | Número de notas analizadas |
| analyzed_at | TIMESTAMP | Fecha del análisis |
| created_by | UUID (FK) | Usuario que creó el análisis |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de actualización |
