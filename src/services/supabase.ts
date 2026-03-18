import { createClient } from '@supabase/supabase-js'

// CONFIGURACIÓN DE SUPABASE
// Reemplaza estos valores con los de tu proyecto de Supabase
const supabaseUrl = 'https://dvckxzkgvriwvnglgwxm.supabase.co'
const supabaseKey = 'sb_publishable_DIiUHmBKnr2yHeDT44b_Qw_D9_vp6IS'

// Función para verificar si Supabase está configurado
const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://your-project-id.supabase.co' && 
         supabaseKey !== 'your-anon-key'
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types
export interface ResourceDB {
  id?: string
  name: string
  type: string
  description: string
  url?: string
  fileName?: string
  created_at?: string
  user_id?: string
}

// Services
export const resourceService = {
  // Guardar recurso en Supabase
  async saveResource(resource: Omit<ResourceDB, 'id' | 'created_at' | 'user_id'>) {
    try {
      // Verificar si Supabase está configurado
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
      }

      const { data, error } = await supabase
        .from('resources')
        .insert([resource])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error saving resource:', error);
      throw error
    }
  },

  // Obtener todos los recursos del usuario
  async getResources() {
    try {
      // Verificar si Supabase está configurado
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
      }

      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error
    }
  },

  // Eliminar recurso
  async deleteResource(id: string) {
    try {
      // Verificar si Supabase está configurado
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
      }

      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error
    }
  },

  // Actualizar recurso
  async updateResource(id: string, updates: Partial<ResourceDB>) {
    try {
      // Verificar si Supabase está configurado
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured');
      }

      const { data, error } = await supabase
        .from('resources')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error
    }
  }
}

// LocalStorage fallback
export const localStorageService = {
  // Guardar en localStorage
  saveResources(resources: any[]) {
    try {
      localStorage.setItem('notebook-resources', JSON.stringify(resources))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },

  // Cargar desde localStorage
  loadResources() {
    try {
      const stored = localStorage.getItem('notebook-resources')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return []
    }
  },

  // Limpiar localStorage
  clearResources() {
    try {
      localStorage.removeItem('notebook-resources')
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}

/*
INSTRUCCIONES PARA CONFIGURAR SUPABASE:

1. Ve a https://supabase.com/dashboard
2. Crea un nuevo proyecto o usa uno existente
3. Ve a Settings > API para obtener la URL y la API key
4. Reemplaza los valores de arriba:
   - supabaseUrl: 'https://your-project-id.supabase.co' → tu URL
   - supabaseKey: 'your-anon-key' → tu API key

5. Crea la tabla 'resources' con este SQL en el editor SQL de Supabase:

CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  url TEXT,
  file_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Politica para que los usuarios vean solo sus recursos
CREATE POLICY "Users can view own resources" ON resources
  FOR SELECT USING (auth.uid() = user_id);

-- Politica para que los usuarios inserten sus propios recursos
CREATE POLICY "Users can insert own resources" ON resources
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politica para que los usuarios actualicen sus propios recursos
CREATE POLICY "Users can update own resources" ON resources
  FOR UPDATE USING (auth.uid() = user_id);

-- Politica para que los usuarios eliminen sus propios recursos
CREATE POLICY "Users can delete own resources" ON resources
  FOR DELETE USING (auth.uid() = user_id);
*/
