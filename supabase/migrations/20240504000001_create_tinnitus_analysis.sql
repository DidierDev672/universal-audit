--
-- Esquema de base de datos para Análisis IA de Tinnitus
-- Tabla: tinnitus_analysis
--

-- Crear tabla de análisis IA para respuestas de tinnitus
CREATE TABLE IF NOT EXISTS tinnitus_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relaciones con otras entidades
  id_patient UUID NOT NULL,
  id_tinnitus_questionnaires UUID NOT NULL,
  id_tinnitus_response UUID NOT NULL,
  
  -- Datos del análisis
  analysis TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'gemini-3-flash-preview',
  
  -- Metadatos del análisis
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_tokens INTEGER,
  
  -- Información de la respuesta analizada (snapshot)
  questionnaire_title TEXT,
  total_score INTEGER,
  severity_level TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_patient FOREIGN KEY (id_patient) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT uq_tinnitus_response UNIQUE (id_tinnitus_response)
);

-- Crear índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_tinnitus_analysis_patient_id ON tinnitus_analysis(id_patient);
CREATE INDEX IF NOT EXISTS idx_tinnitus_analysis_questionnaire_id ON tinnitus_analysis(id_tinnitus_questionnaires);
CREATE INDEX IF NOT EXISTS idx_tinnitus_analysis_response_id ON tinnitus_analysis(id_tinnitus_response);
CREATE INDEX IF NOT EXISTS idx_tinnitus_analysis_created_at ON tinnitus_analysis(created_at DESC);

-- Índice para búsqueda de texto en el análisis
CREATE INDEX IF NOT EXISTS idx_tinnitus_analysis_search ON tinnitus_analysis USING gin(to_tsvector('spanish', analysis));

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_tinnitus_analysis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tinnitus_analysis_updated_at
  BEFORE UPDATE ON tinnitus_analysis
  FOR EACH ROW
  EXECUTE FUNCTION update_tinnitus_analysis_updated_at();

-- Políticas de Row Level Security (RLS) para Supabase
-- Habilitar RLS
ALTER TABLE tinnitus_analysis ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver análisis de sus pacientes asignados o propios
CREATE POLICY "Users can view tinnitus analysis"
  ON tinnitus_analysis FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.raw_user_meta_data->>'role' = 'admin' OR
        auth.users.raw_user_meta_data->>'role' = 'doctor' OR
        auth.users.raw_user_meta_data->>'role' = 'specialist'
      )
    )
  );

-- Política: Usuarios pueden crear análisis de tinnitus
CREATE POLICY "Users can create tinnitus analysis"
  ON tinnitus_analysis FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.raw_user_meta_data->>'role' = 'admin' OR
        auth.users.raw_user_meta_data->>'role' = 'doctor' OR
        auth.users.raw_user_meta_data->>'role' = 'specialist'
      )
    )
  );

-- Política: Usuarios pueden actualizar análisis existentes
CREATE POLICY "Users can update tinnitus analysis"
  ON tinnitus_analysis FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND (
        auth.users.raw_user_meta_data->>'role' = 'admin' OR
        auth.users.raw_user_meta_data->>'role' = 'doctor' OR
        auth.users.raw_user_meta_data->>'role' = 'specialist'
      )
    )
  );

-- Política: Solo admins pueden eliminar análisis
CREATE POLICY "Only admins can delete tinnitus analysis"
  ON tinnitus_analysis FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Función para obtener análisis por ID de respuesta
CREATE OR REPLACE FUNCTION get_tinnitus_analysis_by_response(response_id UUID)
RETURNS TABLE (
  id UUID,
  id_patient UUID,
  id_tinnitus_questionnaires UUID,
  id_tinnitus_response UUID,
  analysis TEXT,
  model TEXT,
  total_score INTEGER,
  severity_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ta.id,
    ta.id_patient,
    ta.id_tinnitus_questionnaires,
    ta.id_tinnitus_response,
    ta.analysis,
    ta.model,
    ta.total_score,
    ta.severity_level,
    ta.created_at
  FROM tinnitus_analysis ta
  WHERE ta.id_tinnitus_response = response_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios para documentación
COMMENT ON TABLE tinnitus_analysis IS 'Análisis generados por IA para respuestas de cuestionarios de tinnitus';
COMMENT ON COLUMN tinnitus_analysis.analysis IS 'Texto completo del análisis generado por la IA';
COMMENT ON COLUMN tinnitus_analysis.model IS 'Modelo de IA utilizado para generar el análisis';
COMMENT ON COLUMN tinnitus_analysis.total_score IS 'Puntuación total del cuestionario al momento del análisis';
COMMENT ON COLUMN tinnitus_analysis.severity_level IS 'Nivel de severidad calculado al momento del análisis';
