// Declaración de tipos para el módulo supabase.js

declare module '../supabase' {
  import { SupabaseClient } from '@supabase/supabase-js';
  export const supabaseClientVue: SupabaseClient;
}
