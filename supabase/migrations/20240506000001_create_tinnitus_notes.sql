--
-- Esquema de base de datos para Notas de Tinnitus
-- Tablas: tinnitus_notes, note_contexts
--

-- ============================================
-- TABLA: tinnitus_notes
-- Almacena las notas clínicas y de selección de texto
-- ============================================
CREATE TABLE IF NOT EXISTS tinnitus_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones con otras entidades
  id_patient UUID NOT NULL,
  id_tinnitus_questionnaires UUID,
  id_tinnitus_response UUID,

  -- Datos de la nota
  description TEXT NOT NULL,
  color TEXT DEFAULT 'bg-yellow-100 border-yellow-300 text-yellow-800',
  source TEXT DEFAULT 'manual', -- 'manual', 'analysis-selection', 'clinical-note'

  -- Metadatos
  created_by UUID,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT fk_patient FOREIGN KEY (id_patient) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ============================================
-- TABLA: note_contexts
-- Almacena los contextos adicionales (anidados) de cada nota
-- ============================================
CREATE TABLE IF NOT EXISTS note_contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relación con la nota padre
  id_note UUID NOT NULL,

  -- Datos del contexto
  description TEXT NOT NULL,

  -- Metadatos
  created_by UUID,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT fk_note FOREIGN KEY (id_note) REFERENCES tinnitus_notes(id) ON DELETE CASCADE,
  CONSTRAINT fk_context_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ============================================
-- ÍNDICES para búsquedas eficientes
-- ============================================

-- Índices para tinnitus_notes
CREATE INDEX IF NOT EXISTS idx_tinnitus_notes_patient_id ON tinnitus_notes(id_patient);
CREATE INDEX IF NOT EXISTS idx_tinnitus_notes_questionnaire_id ON tinnitus_notes(id_tinnitus_questionnaires);
CREATE INDEX IF NOT EXISTS idx_tinnitus_notes_response_id ON tinnitus_notes(id_tinnitus_response);
CREATE INDEX IF NOT EXISTS idx_tinnitus_notes_created_at ON tinnitus_notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tinnitus_notes_source ON tinnitus_notes(source);

-- Índice para búsqueda de texto en la descripción de la nota
CREATE INDEX IF NOT EXISTS idx_tinnitus_notes_search ON tinnitus_notes USING gin(to_tsvector('spanish', description));

-- Índices para note_contexts
CREATE INDEX IF NOT EXISTS idx_note_contexts_note_id ON note_contexts(id_note);
CREATE INDEX IF NOT EXISTS idx_note_contexts_created_at ON note_contexts(created_at DESC);

-- ============================================
-- TRIGGERS para actualizar updated_at automáticamente
-- ============================================

-- Trigger para tinnitus_notes
CREATE OR REPLACE FUNCTION update_tinnitus_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tinnitus_notes_updated_at
  BEFORE UPDATE ON tinnitus_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_tinnitus_notes_updated_at();

-- Trigger para note_contexts
CREATE OR REPLACE FUNCTION update_note_contexts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_note_contexts_updated_at
  BEFORE UPDATE ON note_contexts
  FOR EACH ROW
  EXECUTE FUNCTION update_note_contexts_updated_at();

-- ============================================
-- POLÍTICAS de Row Level Security (RLS) para tinnitus_notes
-- ============================================

-- Habilitar RLS
ALTER TABLE tinnitus_notes ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver notas de sus pacientes
CREATE POLICY "Users can view tinnitus notes"
  ON tinnitus_notes FOR SELECT
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

-- Política: Usuarios pueden crear notas
CREATE POLICY "Users can create tinnitus notes"
  ON tinnitus_notes FOR INSERT
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

-- Política: Usuarios pueden actualizar notas
CREATE POLICY "Users can update tinnitus notes"
  ON tinnitus_notes FOR UPDATE
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

-- Política: Usuarios pueden eliminar notas
CREATE POLICY "Users can delete tinnitus notes"
  ON tinnitus_notes FOR DELETE
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
-- POLÍTICAS de Row Level Security (RLS) para note_contexts
-- ============================================

-- Habilitar RLS
ALTER TABLE note_contexts ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver contextos
CREATE POLICY "Users can view note contexts"
  ON note_contexts FOR SELECT
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

-- Política: Usuarios pueden crear contextos
CREATE POLICY "Users can create note contexts"
  ON note_contexts FOR INSERT
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

-- Política: Usuarios pueden actualizar contextos
CREATE POLICY "Users can update note contexts"
  ON note_contexts FOR UPDATE
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

-- Política: Usuarios pueden eliminar contextos
CREATE POLICY "Users can delete note contexts"
  ON note_contexts FOR DELETE
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

-- Función para obtener notas por ID de respuesta (con contextos)
CREATE OR REPLACE FUNCTION get_tinnitus_notes_by_response(response_id UUID)
RETURNS TABLE (
  id UUID,
  id_patient UUID,
  id_tinnitus_questionnaires UUID,
  id_tinnitus_response UUID,
  description TEXT,
  color TEXT,
  source TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  context_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    tn.id,
    tn.id_patient,
    tn.id_tinnitus_questionnaires,
    tn.id_tinnitus_response,
    tn.description,
    tn.color,
    tn.source,
    tn.created_by,
    tn.created_at,
    (SELECT COUNT(*) FROM note_contexts nc WHERE nc.id_note = tn.id) as context_count
  FROM tinnitus_notes tn
  WHERE tn.id_tinnitus_response = response_id
  ORDER BY tn.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener contextos de una nota
CREATE OR REPLACE FUNCTION get_note_contexts(note_id UUID)
RETURNS TABLE (
  id UUID,
  id_note UUID,
  description TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    nc.id,
    nc.id_note,
    nc.description,
    nc.created_by,
    nc.created_at
  FROM note_contexts nc
  WHERE nc.id_note = note_id
  ORDER BY nc.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- COMENTARIOS para documentación
-- ============================================
COMMENT ON TABLE tinnitus_notes IS 'Notas clínicas y de selección de texto asociadas a respuestas de tinnitus';
COMMENT ON COLUMN tinnitus_notes.description IS 'Contenido textual de la nota';
COMMENT ON COLUMN tinnitus_notes.color IS 'Clase CSS de color para la visualización de la nota';
COMMENT ON COLUMN tinnitus_notes.source IS 'Origen de la nota: manual, analysis-selection, clinical-note';

COMMENT ON TABLE note_contexts IS 'Contextos adicionales anidados a las notas de tinnitus';
COMMENT ON COLUMN note_contexts.description IS 'Contenido textual del contexto adicional';
