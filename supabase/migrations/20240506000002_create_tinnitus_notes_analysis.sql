--
-- Esquema de base de datos para Análisis de Notas de Tinnitus
-- Tabla: tinnitus_notes_analysis
-- ============================================

-- Tabla para almacenar análisis de notas generados por IA
CREATE TABLE IF NOT EXISTS tinnitus_notes_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones con otras entidades
  id_patient UUID NOT NULL,
  id_tinnitus_questionnaires UUID,
  id_tinnitus_response UUID,

  -- Datos del análisis
  analysis TEXT NOT NULL,              -- Contenido del análisis generado por IA
  note_count INTEGER DEFAULT 0,         -- Número de notas analizadas
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Metadatos
  created_by UUID,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT fk_analysis_patient FOREIGN KEY (id_patient) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_analysis_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ============================================
-- ÍNDICES para búsquedas eficientes
-- ============================================

-- Índices para tinnitus_notes_analysis
CREATE INDEX IF NOT EXISTS idx_tinnitus_notes_analysis_patient_id ON tinnitus_notes_analysis(id_patient);
CREATE INDEX IF NOT EXISTS idx_tinnitus_notes_analysis_questionnaire_id ON tinnitus_notes_analysis(id_tinnitus_questionnaires);
CREATE INDEX IF NOT EXISTS idx_tinnitus_notes_analysis_response_id ON tinnitus_notes_analysis(id_tinnitus_response);
CREATE INDEX IF NOT EXISTS idx_tinnitus_notes_analysis_created_at ON tinnitus_notes_analysis(created_at DESC);

-- Índice para búsqueda de texto en el análisis
CREATE INDEX IF NOT EXISTS idx_tinnitus_notes_analysis_search ON tinnitus_notes_analysis USING gin(to_tsvector('spanish', analysis));

-- ============================================
-- TRIGGERS para actualizar updated_at automáticamente
-- ============================================

CREATE OR REPLACE FUNCTION update_tinnitus_notes_analysis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tinnitus_notes_analysis_updated_at
  BEFORE UPDATE ON tinnitus_notes_analysis
  FOR EACH ROW
  EXECUTE FUNCTION update_tinnitus_notes_analysis_updated_at();

-- ============================================
-- POLÍTICAS de Row Level Security (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE tinnitus_notes_analysis ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver análisis
CREATE POLICY "Users can view notes analysis"
  ON tinnitus_notes_analysis FOR SELECT
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

-- Política: Usuarios pueden crear análisis
CREATE POLICY "Users can create notes analysis"
  ON tinnitus_notes_analysis FOR INSERT
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

-- Política: Usuarios pueden actualizar análisis
CREATE POLICY "Users can update notes analysis"
  ON tinnitus_notes_analysis FOR UPDATE
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

-- Política: Usuarios pueden eliminar análisis
CREATE POLICY "Users can delete notes analysis"
  ON tinnitus_notes_analysis FOR DELETE
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

-- ============================================
-- FUNCIONES ÚTILES
-- ============================================

-- Función para obtener análisis por ID de respuesta
CREATE OR REPLACE FUNCTION get_tinnitus_notes_analysis_by_response(response_id UUID)
RETURNS TABLE (
  id UUID,
  id_patient UUID,
  id_tinnitus_questionnaires UUID,
  id_tinnitus_response UUID,
  analysis TEXT,
  note_count INTEGER,
  analyzed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    tna.id,
    tna.id_patient,
    tna.id_tinnitus_questionnaires,
    tna.id_tinnitus_response,
    tna.analysis,
    tna.note_count,
    tna.analyzed_at,
    tna.created_by,
    tna.created_at
  FROM tinnitus_notes_analysis tna
  WHERE tna.id_tinnitus_response = response_id
  ORDER BY tna.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMENTARIOS para documentación
-- ============================================
COMMENT ON TABLE tinnitus_notes_analysis IS 'Análisis generados por IA de las notas de tinnitus';
COMMENT ON COLUMN tinnitus_notes_analysis.analysis IS 'Contenido del análisis generado por IA';
COMMENT ON COLUMN tinnitus_notes_analysis.note_count IS 'Número de notas que fueron analizadas';
COMMENT ON COLUMN tinnitus_notes_analysis.analyzed_at IS 'Timestamp de cuando se realizó el análisis';
