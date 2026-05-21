# Guardar análisis IA de documentos — Guía paso a paso (Supabase + backend)

Guía para implementar el flujo del modal **«Análisis con IA»** en `AiDocumentList.vue`: generar texto con Gemini, revisarlo en el modal (markdown-it) y **persistirlo** con el botón **Guardar**.

---

## 1. Flujo en el frontend (ya implementado)

| Paso | Acción | Dónde |
|------|--------|--------|
| 1 | El usuario pulsa **Analizar por inteligencia artificial** en una fila | `AiDocumentList.vue` |
| 2 | Se descarga el PDF/Word desde Storage y se extrae texto | `downloadDocumentFile` + `contentExtractor` |
| 3 | Se envía el prompt a Gemini | `useGetGenerativeModelGP(prompt)` |
| 4 | Se abre el modal con el markdown renderizado | `markdown-it` + `v-html` |
| 5 | El usuario revisa y pulsa **Guardar** | `guardarAnalisisModal()` → `POST` axios a `/api/v1/ai-document-analyses` |
| 6 | El backend persiste en `ai_document_analysis` y marca el documento `analyzed` | API + Supabase (service role) |

**Importante:** el análisis **no** se guarda automáticamente al generarse; solo al pulsar **Guardar** (igual que el patrón del calendario).

### Payload lógico al guardar

```typescript
{
  document_upload_id: string;   // UUID de ai_document_uploads
  content: string;              // markdown del análisis (requerido por el API)
  model: string;                // ej. gemini-3-flash-preview
  analysis_id?: string;         // si re-guardas, UPDATE
}
```

### Llamada HTTP (implementada en `AiDocumentList.vue`)

```typescript
const AI_DOCUMENT_ANALYSES_API =
  "http://localhost:3000/api/v1/ai-document-analyses";

await axios.post(AI_DOCUMENT_ANALYSES_API, {
  document_upload_id: doc.id,
  content: texto,                    // markdown del análisis (campo requerido por el API)
  model: "gemini-3-flash-preview",
  analysis_id: analisisIdEnModal.value,  // omitir = INSERT, UUID = UPDATE
  original_filename: doc.original_filename,
});
```

Éxito → `alert("El análisis se guardó correctamente.")`  
Error → `alert("Error al guardar: …")`

Respaldo directo Supabase (opcional): `src/services/aiDocumentsService.ts` — `persistAiAnalysisFromModal`, `saveCompletedAiAnalysis`, `updateAiAnalysis`.

---

## 2. Esquema Supabase (PostgreSQL)

Migración del proyecto:

`supabase/migrations/20260218120000_ai_document_uploads_and_analysis.sql`

### 2.1 Tabla `ai_document_uploads` (documento subido)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID PK | Identificador del documento |
| `storage_bucket` | TEXT | Ej. `ai-documents` |
| `storage_object_path` | TEXT | Ruta en Storage |
| `original_filename` | TEXT | Nombre original |
| `mime_type` | TEXT | MIME del archivo |
| `file_size_bytes` | BIGINT | Tamaño |
| `file_type` | TEXT | `pdf` \| `word` |
| `user_id` | UUID NULL | Opcional (`auth.users`) |
| `client_user_id` | TEXT NULL | Usuario app (login propio) |
| `status` | TEXT | `uploaded` \| `processing` \| `analyzed` \| `error` |
| `created_at` / `updated_at` | TIMESTAMPTZ | Auditoría |

**Storage:** bucket `ai-documents` (PDF y Word, ~50 MB).

### 2.2 Tabla `ai_document_analysis` (respuesta IA)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID PK | Identificador del análisis |
| `document_upload_id` | UUID FK | → `ai_document_uploads(id)` ON DELETE CASCADE |
| `response_text` | TEXT | Markdown / texto del análisis (**lo que guarda el modal**) |
| `raw_response` | JSONB | Metadatos (`source`, `savedAt`, etc.) |
| `model_name` | TEXT | Ej. `gemini-3-flash-preview` |
| `status` | TEXT | `pending` \| `processing` \| `completed` \| `failed` |
| `error_message` | TEXT NULL | Si falló el job |
| `created_at` / `updated_at` | TIMESTAMPTZ | Auditoría |

### 2.3 Aplicar la migración

```bash
# Con Supabase CLI (desde la raíz del repo)
supabase db push

# O en el Dashboard: SQL Editor → pegar el contenido del .sql → Run
```

Comprueba en **Table Editor** que existan `ai_document_uploads` y `ai_document_analysis`, y en **Storage** el bucket `ai-documents`.

---

## 3. Paso a paso: guardar solo con Supabase (sin backend propio)

El frontend actual usa el cliente JS con la **anon key** y RLS permisivo (ver migración).

### Paso 1 — Variables de entorno

En `.env` del proyecto Vue:

```env
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=tu_anon_o_publishable_key
VITE_GOOGLE_AI_STUDIO_API_KEY=tu_key_gemini
```

### Paso 2 — Insertar análisis (equivalente al botón Guardar)

```sql
INSERT INTO ai_document_analysis (
  document_upload_id,
  response_text,
  raw_response,
  model_name,
  status
) VALUES (
  'UUID-DEL-DOCUMENTO',
  '## Resumen ejecutivo\n...',
  '{"source":"useGetGenerativeModelGP","savedAt":"2026-05-18T12:00:00.000Z"}'::jsonb,
  'gemini-3-flash-preview',
  'completed'
);

UPDATE ai_document_uploads
SET status = 'analyzed'
WHERE id = 'UUID-DEL-DOCUMENTO';
```

### Paso 3 — Consultar análisis de un documento

```sql
SELECT a.*
FROM ai_document_analysis a
WHERE a.document_upload_id = 'UUID-DEL-DOCUMENTO'
ORDER BY a.created_at DESC;
```

### Paso 4 — Listar documentos con análisis (como el listado Vue)

```sql
SELECT u.*,
       COALESCE(
         json_agg(a ORDER BY a.created_at DESC)
         FILTER (WHERE a.id IS NOT NULL),
         '[]'
       ) AS ai_document_analysis
FROM ai_document_uploads u
LEFT JOIN ai_document_analysis a ON a.document_upload_id = u.id
GROUP BY u.id
ORDER BY u.created_at DESC;
```

En el cliente (ya usado en `listAiDocuments`):

```typescript
supabase
  .from("ai_document_uploads")
  .select("*, ai_document_analysis(*)")
  .order("created_at", { ascending: false });
```

---

## 4. Paso a paso: backend REST opcional

Si más adelante quieres **no** llamar a Supabase desde el navegador (RLS estricta, lógica centralizada, colas de análisis), expón un API propio.

### Paso 1 — Crear endpoint

```
POST /api/v1/ai-document-analyses
```

**Body (JSON):**

```json
{
  "document_upload_id": "550e8400-e29b-41d4-a716-446655440000",
  "content": "## Resumen\n...",
  "model": "gemini-3-flash-preview",
  "original_filename": "informe.pdf"
}
```

El API persiste `content` en la columna `response_text` de `ai_document_analysis`.

- Sin `analysis_id` → **INSERT**
- Con `analysis_id` (UUID) → **UPDATE** de esa fila

**Respuesta 201:**

```json
{
  "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "document_upload_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "createdAt": "2026-05-18T12:00:05.000Z"
}
```

### Paso 2 — Handler (pseudocódigo Node/Express)

1. Validar JWT / sesión del usuario.
2. Comprobar que `document_upload_id` existe en `ai_document_uploads`.
3. (Opcional) Verificar que `client_user_id` o `user_id` coincide con el solicitante.
4. `INSERT` o `UPDATE` en `ai_document_analysis`.
5. `UPDATE ai_document_uploads SET status = 'analyzed'`.
6. Devolver el registro creado.

Usa la **service role key** de Supabase solo en el servidor, nunca en el frontend.

### Paso 3 — Cambiar el frontend

En `guardarAnalisisModal()` sustituir `persistAiAnalysisFromModal` por:

```typescript
await fetch("/api/v1/ai-document-analyses", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    document_upload_id: doc.id,
    content: texto,
    analysis_id: analisisIdEnModal.value,
    model: "gemini-3-flash-preview",
  }),
});
```

### Paso 4 — Endpoints adicionales recomendados

| Método | Ruta | Uso |
|--------|------|-----|
| `GET` | `/api/v1/ai-document-uploads` | Listado paginado |
| `GET` | `/api/v1/ai-document-analyses/` | Listado de todos los análisis (UI: `AiDocumentAnalysisList.vue`) |
| `GET` | `/api/v1/ai-document-uploads/:id/analyses` | Historial de análisis por documento |
| `POST` | `/api/v1/ai-document-uploads/:id/analyze` | Job async: extraer texto + Gemini + guardar |
| `DELETE` | `/api/v1/ai-document-analyses/:id` | Borrar un análisis |

---

## 5. Endurecer seguridad (producción)

La migración actual usa RLS **abierta** (`USING (true)`) para desarrollo con anon key y login propio.

**Recomendaciones:**

1. Sustituir políticas por `auth.uid()` o validación por `client_user_id`.
2. Mover la generación Gemini al **backend** (la API key no debe quedar en el cliente).
3. Usar **Edge Function** de Supabase para `POST analyze` + `POST save`.
4. Limitar tamaño de `response_text` y rate-limit por usuario.

Ejemplo de política más estricta (cuando uses Supabase Auth):

```sql
CREATE POLICY "analysis_insert_own"
  ON ai_document_analysis FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_document_uploads u
      WHERE u.id = document_upload_id
        AND u.user_id = auth.uid()
    )
  );
```

---

## 6. Checklist de verificación

- [ ] Migración SQL aplicada en el proyecto Supabase
- [ ] Bucket `ai-documents` creado y políticas Storage activas
- [ ] Subida de PDF/Word desde `AiDocumentUploader` funciona
- [ ] Listado en `/ai-documentos` muestra filas
- [ ] **Analizar por IA** abre el modal con markdown
- [ ] **Guardar** inserta fila en `ai_document_analysis` y `status = analyzed` en el documento
- [ ] Re-guardar actualiza la misma fila (`analysisId` en modal)
- [ ] (Opcional) Backend REST y RLS restrictiva en producción

---

## 7. Archivos relacionados en el repo

| Archivo | Rol |
|---------|-----|
| `src/components/AI/AiDocumentList.vue` | Modal, botón Guardar, markdown |
| `src/services/aiDocumentsService.ts` | Persistencia Supabase |
| `src/shared/service/useGetGenerativeModelGP.ts` | Llamada a Gemini |
| `src/services/contentExtractor.ts` | Extracción PDF/Word |
| `supabase/migrations/20260218120000_ai_document_uploads_and_analysis.sql` | Schema + RLS + bucket |
