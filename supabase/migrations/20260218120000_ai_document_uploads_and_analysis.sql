--
-- Documentos PDF/Word para análisis con IA + respuestas generadas
-- Requiere extensión pgcrypto (gen_random_uuid) — ya disponible en Supabase por defecto
--

-- ---------------------------------------------------------------------------
-- Tabla: metadatos de archivos subidos (binario en Storage)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_document_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  storage_bucket TEXT NOT NULL DEFAULT 'ai-documents',
  storage_object_path TEXT NOT NULL,

  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size_bytes BIGINT,
  file_type TEXT NOT NULL CHECK (file_type IN ('pdf', 'word')),

  -- Vinculación opcional: Supabase Auth
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Vinculación opcional: usuario de la app (auth propia)
  client_user_id TEXT,

  status TEXT NOT NULL DEFAULT 'uploaded'
    CHECK (status IN ('uploaded', 'processing', 'analyzed', 'error')),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_ai_document_uploads_bucket_path UNIQUE (storage_bucket, storage_object_path)
);

CREATE INDEX IF NOT EXISTS idx_ai_document_uploads_user_id
  ON ai_document_uploads(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_document_uploads_client_user_id
  ON ai_document_uploads(client_user_id) WHERE client_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ai_document_uploads_created_at
  ON ai_document_uploads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_document_uploads_status
  ON ai_document_uploads(status);


-- ---------------------------------------------------------------------------
-- Tabla: respuestas / jobs de análisis generados por IA
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_document_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  document_upload_id UUID NOT NULL
    REFERENCES ai_document_uploads(id) ON DELETE CASCADE,

  response_text TEXT,
  raw_response JSONB NOT NULL DEFAULT '{}'::jsonb,
  model_name TEXT,

  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_document_analysis_document_id
  ON ai_document_analysis(document_upload_id);
CREATE INDEX IF NOT EXISTS idx_ai_document_analysis_status
  ON ai_document_analysis(status);
CREATE INDEX IF NOT EXISTS idx_ai_document_analysis_created_at
  ON ai_document_analysis(created_at DESC);


-- ---------------------------------------------------------------------------
-- Triggers updated_at
-- ---------------------------------------------------------------------------
CREATE TRIGGER update_ai_document_uploads_updated_at
  BEFORE UPDATE ON ai_document_uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_document_analysis_updated_at
  BEFORE UPDATE ON ai_document_analysis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ---------------------------------------------------------------------------
-- RLS
-- NOTA: Políticas abiertas para que el cliente con anon key funcione sin Supabase Auth
-- (este proyecto usa login propio). En producción endurecer (auth.uid(), Edge Functions, etc.)
-- ---------------------------------------------------------------------------
ALTER TABLE ai_document_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_document_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_document_uploads_select"
  ON ai_document_uploads FOR SELECT
  USING (true);

CREATE POLICY "ai_document_uploads_insert"
  ON ai_document_uploads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "ai_document_uploads_update"
  ON ai_document_uploads FOR UPDATE
  USING (true) WITH CHECK (true);

CREATE POLICY "ai_document_uploads_delete"
  ON ai_document_uploads FOR DELETE
  USING (true);


CREATE POLICY "ai_document_analysis_select"
  ON ai_document_analysis FOR SELECT
  USING (true);

CREATE POLICY "ai_document_analysis_insert"
  ON ai_document_analysis FOR INSERT
  WITH CHECK (true);

CREATE POLICY "ai_document_analysis_update"
  ON ai_document_analysis FOR UPDATE
  USING (true) WITH CHECK (true);

CREATE POLICY "ai_document_analysis_delete"
  ON ai_document_analysis FOR DELETE
  USING (true);


COMMENT ON TABLE ai_document_uploads IS 'Metadatos de PDF/Word; archivo en Storage (bucket ai-documents)';
COMMENT ON TABLE ai_document_analysis IS 'Respuestas de IA u otras salidas asociadas a un documento subido';


-- ---------------------------------------------------------------------------
-- Bucket de Storage (PDF y Word)
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ai-documents',
  'ai-documents',
  false,
  52428800,
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types,
  public = EXCLUDED.public;


-- Políticas Storage: mismo alcance que RLS de tablas (ajustar en producción)
CREATE POLICY "ai_documents_storage_select"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'ai-documents');

CREATE POLICY "ai_documents_storage_insert"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'ai-documents');

CREATE POLICY "ai_documents_storage_update"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'ai-documents');

CREATE POLICY "ai_documents_storage_delete"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'ai-documents');
