# Guardar redacción con IA — Guía paso a paso (backend)

Guía para implementar la persistencia del modal **«Redacción con IA»** en `AiDocumentAnalysisList.vue`: el usuario genera texto a partir del análisis guardado y sus notas, lo revisa en el modal y lo persiste con **Guardar redacción**.

---

## 1. Flujo en el frontend (implementado)

| Paso | Acción | Dónde |
|------|--------|--------|
| 1 | Abrir un análisis desde la lista de tarjetas | `AiDocumentAnalysisList.vue` |
| 2 | Ir a **Ver notas**, crear notas en el canvas (localStorage) | Vista `notas` |
| 3 | Pulsar **Redactar por inteligencia artificial** | `redactarNotasConIA()` → Gemini |
| 4 | Se abre la vista **Redacción con IA** (análisis + texto redactado en markdown) | `vistaModal === 'redaccion-ia'` |
| 5 | El usuario pulsa **Guardar redacción** | `guardarRedaccionModal()` → `POST` axios |
| 6 | El backend persiste en `ai_document_redactions` | API + Supabase (service role) |

**Importante:** la redacción **no** se guarda al generarla; solo al pulsar **Guardar redacción** (mismo patrón que el análisis en `AiDocumentList.vue`).

### Payload al guardar (snake_case)

```json
{
  "document_upload_id": "uuid-del-documento",
  "analysis_id": "uuid-del-analisis-padre",
  "content": "markdown de la redacción",
  "model": "gemini-3-flash-preview",
  "notes_count": 3,
  "original_filename": "informe.pdf",
  "redaction_id": "uuid-opcional-para-update"
}
```

| Campo | Requerido | Descripción |
|-------|-----------|-------------|
| `document_upload_id` | Sí | FK a `ai_document_uploads` |
| `analysis_id` | Sí | FK a `ai_document_analysis` (análisis del que parten las notas) |
| `content` | Sí | Texto markdown generado por IA |
| `model` | Sí | Modelo usado (ej. `gemini-3-flash-preview`) |
| `notes_count` | Sí | Cantidad de notas usadas en el prompt |
| `original_filename` | No | Nombre del archivo para listados |
| `redaction_id` | No | Si viene, hacer **UPDATE**; si no, **INSERT** |

### Llamada HTTP (frontend)

Servicio: `src/services/aiDocumentAnalysesApi.ts` → `saveAiDocumentRedaction()`

```typescript
const AI_DOCUMENT_REDACTIONS_API =
  "http://localhost:3000/api/v1/ai-document-redactions/";

await axios.post(AI_DOCUMENT_REDACTIONS_API, payload, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
```

Componente: `guardarRedaccionModal()` en `AiDocumentAnalysisList.vue`.

Éxito → alert + mensaje verde en el modal.  
Error → `readAiAnalysesApiError()` (401, validación, etc.).

---

## 2. Esquema Supabase (PostgreSQL)

Crea una migración nueva, por ejemplo:

`supabase/migrations/20260518120000_ai_document_redactions.sql`

### 2.1 Tabla `ai_document_redactions`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID PK | `gen_random_uuid()` |
| `document_upload_id` | UUID FK NOT NULL | → `ai_document_uploads(id)` ON DELETE CASCADE |
| `analysis_id` | UUID FK NOT NULL | → `ai_document_analysis(id)` ON DELETE CASCADE |
| `content` | TEXT NOT NULL | Markdown de la redacción |
| `model_name` | TEXT | Modelo IA |
| `notes_count` | INTEGER DEFAULT 0 | Notas usadas en el prompt |
| `status` | TEXT | `completed` \| `failed` (opcional) |
| `raw_response` | JSONB | Metadatos (`savedAt`, `source`, etc.) |
| `created_at` / `updated_at` | TIMESTAMPTZ | Auditoría |

### 2.2 SQL de referencia

```sql
CREATE TABLE IF NOT EXISTS public.ai_document_redactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_upload_id UUID NOT NULL
    REFERENCES public.ai_document_uploads(id) ON DELETE CASCADE,
  analysis_id UUID NOT NULL
    REFERENCES public.ai_document_analysis(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  model_name TEXT,
  notes_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'completed',
  raw_response JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_document_redactions_analysis
  ON public.ai_document_redactions(analysis_id);

CREATE INDEX IF NOT EXISTS idx_ai_document_redactions_document
  ON public.ai_document_redactions(document_upload_id);

-- Trigger updated_at (reutiliza función si ya existe en el proyecto)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_ai_document_redactions_updated_at
  ON public.ai_document_redactions;
CREATE TRIGGER tr_ai_document_redactions_updated_at
  BEFORE UPDATE ON public.ai_document_redactions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
```

### 2.3 Aplicar migración

```bash
supabase db push
```

O en **Dashboard → SQL Editor** pegar el script y ejecutar.

---

## 3. API REST (Node / Express u otro en `:3000`)

### 3.1 Ruta

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/ai-document-redactions/` | Crear o actualizar redacción |
| `GET` | `/api/v1/ai-document-redactions/` | Listar (opcional, fase 2) |
| `GET` | `/api/v1/ai-document-redactions/:id` | Detalle (opcional) |

Mantén el mismo prefijo y middleware de auth que `ai-document-analyses`.

### 3.2 Middleware

1. `Authorization: Bearer <jwt>` — igual que análisis.
2. Si falta token → `401` con `{ "code": "UNAUTHORIZED", "message": "..." }`.
3. Validar body con Zod/Joi o manual.

### 3.3 Validación del body (POST)

```typescript
// Ejemplo con Zod
const schema = z.object({
  document_upload_id: z.string().uuid(),
  analysis_id: z.string().uuid(),
  content: z.string().min(1),
  model: z.string().min(1),
  notes_count: z.number().int().min(0),
  original_filename: z.string().optional(),
  redaction_id: z.string().uuid().optional(),
});
```

Errores → `400` con `{ "code": "VALIDATION_ERROR", "message": "...", "details": { "field": "content" } }`.

### 3.4 Lógica del handler (INSERT / UPDATE)

```typescript
// Pseudocódigo
async function postRedaction(req, res) {
  const userId = req.user.id; // según tu auth
  const {
    document_upload_id,
    analysis_id,
    content,
    model,
    notes_count,
    redaction_id,
    original_filename,
  } = req.body;

  // 1. Comprobar que el análisis existe y pertenece al documento
  const { data: analysis, error } = await supabaseAdmin
    .from("ai_document_analysis")
    .select("id, document_upload_id")
    .eq("id", analysis_id)
    .eq("document_upload_id", document_upload_id)
    .single();

  if (error || !analysis) {
    return res.status(404).json({
      code: "NOT_FOUND",
      message: "Análisis no encontrado para este documento.",
    });
  }

  const row = {
    document_upload_id,
    analysis_id,
    content,
    model_name: model,
    notes_count,
    status: "completed",
    raw_response: {
      source: "AiDocumentAnalysisList",
      original_filename: original_filename ?? null,
      savedAt: new Date().toISOString(),
    },
  };

  if (redaction_id) {
    const { data, error: upErr } = await supabaseAdmin
      .from("ai_document_redactions")
      .update(row)
      .eq("id", redaction_id)
      .select("id, document_upload_id, analysis_id, status")
      .single();
    if (upErr) return res.status(500).json({ message: upErr.message });
    return res.status(200).json(data);
  }

  const { data, error: insErr } = await supabaseAdmin
    .from("ai_document_redactions")
    .insert(row)
    .select("id, document_upload_id, analysis_id, status")
    .single();
  if (insErr) return res.status(500).json({ message: insErr.message });
  return res.status(201).json(data);
}
```

Usa **service role** de Supabase en el backend (no expongas la key en el frontend).

### 3.5 Respuesta exitosa

```json
{
  "id": "uuid-redaccion",
  "document_upload_id": "uuid-doc",
  "analysis_id": "uuid-analisis",
  "status": "completed"
}
```

El frontend guarda `id` en `redaccionIdGuardado` para re-guardar (UPDATE).

---

## 4. Checklist de implementación backend

- [ ] Migración `ai_document_redactions` aplicada en Supabase.
- [ ] Ruta `POST /api/v1/ai-document-redactions/` registrada en el servidor `:3000`.
- [ ] Mismo middleware JWT que `ai-document-analyses`.
- [ ] Validación de campos requeridos (`content`, `analysis_id`, `document_upload_id`).
- [ ] Verificar que `analysis_id` corresponde a `document_upload_id`.
- [ ] INSERT sin `redaction_id`; UPDATE con `redaction_id`.
- [ ] Respuesta JSON con `id` para el frontend.
- [ ] Probar con el botón **Guardar redacción** en `/ai-analisis`.

---

## 5. Prueba manual

1. Inicia sesión en la app (token en `localStorage.auth_token`).
2. Ve a **AI — Ver análisis** (`/ai-analisis`).
3. Abre un análisis → **Ver notas** → crea al menos una nota.
4. **Redactar por inteligencia artificial** → espera el texto.
5. **Guardar redacción**.
6. En Supabase **Table Editor** → `ai_document_redactions` debe aparecer la fila.

### Errores frecuentes

| Síntoma | Causa probable |
|---------|----------------|
| `Network Error` / CORS | Backend no corre en `localhost:3000` o falta proxy |
| `401 UNAUTHORIZED` | Token ausente o expirado |
| `404` en POST | Ruta no registrada en el API |
| `VALIDATION_ERROR` | Campo en camelCase; el API espera **snake_case** |
| `500` FK violation | `analysis_id` o `document_upload_id` no existen en BD |

---

## 6. Archivos del proyecto relacionados

| Archivo | Rol |
|---------|-----|
| `src/components/AI/AiDocumentAnalysisList.vue` | Modal, redacción IA, botón guardar |
| `src/services/aiDocumentAnalysesApi.ts` | `saveAiDocumentRedaction()`, constantes API |
| `docs/ai-document-analysis-save-guide.md` | Guía del análisis (patrón similar) |
| `supabase/migrations/20260218120000_ai_document_uploads_and_analysis.sql` | Tablas base documento + análisis |

---

## 7. Fase 2 (opcional)

- **GET** listado de redacciones por `analysis_id` para mostrar historial en el modal.
- Persistir **notas** en backend (hoy están en `localStorage` con clave `ai-analysis-notes-{analysisId}`).
- RLS por `user_id` / `client_user_id` cuando dejes el entorno de desarrollo.
