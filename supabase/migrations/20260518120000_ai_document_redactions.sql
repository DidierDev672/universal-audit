-- Redacciones IA derivadas de un análisis y notas del usuario
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
