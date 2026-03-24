--
-- Esquema de base de datos para Cuadros Clínicos en Supabase
-- Tabla: clinical_pictures
--

-- Crear tabla de cuadros clínicos
CREATE TABLE IF NOT EXISTS clinical_pictures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Información básica
  title TEXT NOT NULL,
  description TEXT,
  
  -- Relación con paciente y creador
  patient_id UUID,
  patient_name TEXT,
  created_by UUID,
  
  -- Datos consolidados (almacenados como JSONB)
  chat JSONB DEFAULT '{
    "id": null,
    "messages": [],
    "createdAt": null,
    "updatedAt": null
  }'::jsonb,
  notes JSONB DEFAULT '[]'::jsonb,
  transcriptions JSONB DEFAULT '[]'::jsonb,
  resources JSONB DEFAULT '[]'::jsonb,
  
  -- Metadatos
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived', 'completed')),
  tags JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Relaciones externas (opcional)
  CONSTRAINT fk_patient FOREIGN KEY (patient_id) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Crear índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_clinical_pictures_patient_id ON clinical_pictures(patient_id);
CREATE INDEX IF NOT EXISTS idx_clinical_pictures_status ON clinical_pictures(status);
CREATE INDEX IF NOT EXISTS idx_clinical_pictures_created_at ON clinical_pictures(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clinical_pictures_created_by ON clinical_pictures(created_by);

-- Índice para búsqueda de texto
CREATE INDEX IF NOT EXISTS idx_clinical_pictures_title ON clinical_pictures USING gin(to_tsvector('spanish', title));
CREATE INDEX IF NOT EXISTS idx_clinical_pictures_description ON clinical_pictures USING gin(to_tsvector('spanish', COALESCE(description, '')));

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clinical_pictures_updated_at
  BEFORE UPDATE ON clinical_pictures
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Políticas de Row Level Security (RLS) para Supabase
-- Habilitar RLS
ALTER TABLE clinical_pictures ENABLE ROW LEVEL SECURITY;

-- Política: Usuarios pueden ver sus propios cuadros clínicos o los de sus pacientes
CREATE POLICY "Users can view their own clinical pictures"
  ON clinical_pictures FOR SELECT
  USING (
    created_by = auth.uid() OR 
    patient_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Política: Usuarios pueden crear cuadros clínicos
CREATE POLICY "Users can create clinical pictures"
  ON clinical_pictures FOR INSERT
  WITH CHECK (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Política: Usuarios pueden actualizar sus propios cuadros clínicos
CREATE POLICY "Users can update their own clinical pictures"
  ON clinical_pictures FOR UPDATE
  USING (
    created_by = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Política: Usuarios pueden eliminar sus propios cuadros clínicos
CREATE POLICY "Users can delete their own clinical pictures"
  ON clinical_pictures FOR DELETE
  USING (
    created_by = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Comentarios para documentación
COMMENT ON TABLE clinical_pictures IS 'Cuadros clínicos que consolidan toda la información del paciente';
COMMENT ON COLUMN clinical_pictures.chat IS 'Chat con mensajes del asistente y usuario';
COMMENT ON COLUMN clinical_pictures.notes IS 'Notas clínicas creadas desde highlights';
COMMENT ON COLUMN clinical_pictures.transcriptions IS 'Transcripciones de recursos de audio/video';
COMMENT ON COLUMN clinical_pictures.resources IS 'Recursos asociados (PDFs, URLs, etc.)';
