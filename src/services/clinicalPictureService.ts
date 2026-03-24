/**
 * Servicio para gestionar Cuadros Clínicos en Supabase
 * Proporciona operaciones CRUD y métodos de consulta
 */

// @ts-ignore - Supabase JS module
import { supabaseClientVue } from '../supabase';
import type {
  ClinicalPicture,
  CreateClinicalPictureDTO,
  UpdateClinicalPictureDTO,
  ClinicalPictureFilters,
  ClinicalPictureListResponse,
  ClinicalPictureChat,
  ClinicalPictureNote,
  ClinicalPictureTranscription,
  ClinicalPictureResource,
  ClinicalPictureChatMessage
} from '../types/clinicalPicture';

const TABLE_NAME = 'clinical_pictures';

/**
 * Crear un nuevo cuadro clínico
 */
export const createClinicalPicture = async (
  dto: CreateClinicalPictureDTO,
  userId?: string
): Promise<ClinicalPicture> => {
  const now = new Date().toISOString();
  
  const newClinicalPicture = {
    title: dto.title,
    description: dto.description || null,
    patient_id: dto.patientId || null,
    patient_name: dto.patientName || null,
    created_by: userId || null,
    status: dto.status || 'draft',
    tags: dto.tags || [],
    chat: {
      id: crypto.randomUUID(),
      messages: [],
      createdAt: now,
      updatedAt: now
    },
    notes: [],
    transcriptions: [],
    resources: [],
    created_at: now,
    updated_at: now
  };

  const { data, error } = await supabaseClientVue
    .from(TABLE_NAME)
    .insert([newClinicalPicture])
    .select()
    .single();

  if (error) {
    console.error('Error creating clinical picture:', error);
    throw new Error(`Failed to create clinical picture: ${error.message}`);
  }

  return mapFromSupabase(data);
};

/**
 * Obtener un cuadro clínico por ID
 */
export const getClinicalPictureById = async (id: string): Promise<ClinicalPicture | null> => {
  const { data, error } = await supabaseClientVue
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    console.error('Error fetching clinical picture:', error);
    throw new Error(`Failed to fetch clinical picture: ${error.message}`);
  }

  return mapFromSupabase(data);
};

/**
 * Listar cuadros clínicos con filtros opcionales
 */
export const listClinicalPictures = async (
  filters?: ClinicalPictureFilters,
  page: number = 1,
  pageSize: number = 20
): Promise<ClinicalPictureListResponse> => {
  let query = supabaseClientVue
    .from(TABLE_NAME)
    .select('*', { count: 'exact' });

  // Aplicar filtros
  if (filters?.patientId) {
    query = query.eq('patient_id', filters.patientId);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.dateFrom) {
    query = query.gte('created_at', filters.dateFrom.toISOString());
  }
  if (filters?.dateTo) {
    query = query.lte('created_at', filters.dateTo.toISOString());
  }
  if (filters?.searchTerm) {
    query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
  }
  if (filters?.tags && filters.tags.length > 0) {
    query = query.contains('tags', filters.tags);
  }

  // Paginación
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error listing clinical pictures:', error);
    throw new Error(`Failed to list clinical pictures: ${error.message}`);
  }

  return {
    data: data.map(mapFromSupabase),
    total: count || 0,
    page,
    pageSize
  };
};

/**
 * Actualizar un cuadro clínico
 */
export const updateClinicalPicture = async (
  id: string,
  dto: UpdateClinicalPictureDTO
): Promise<ClinicalPicture> => {
  const updates: Record<string, any> = {
    updated_at: new Date().toISOString()
  };

  if (dto.title !== undefined) updates.title = dto.title;
  if (dto.description !== undefined) updates.description = dto.description;
  if (dto.status !== undefined) updates.status = dto.status;
  if (dto.tags !== undefined) updates.tags = dto.tags;
  if (dto.chat !== undefined) updates.chat = dto.chat;
  if (dto.notes !== undefined) updates.notes = dto.notes;
  if (dto.transcriptions !== undefined) updates.transcriptions = dto.transcriptions;
  if (dto.resources !== undefined) updates.resources = dto.resources;

  if (dto.status === 'completed') {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabaseClientVue
    .from(TABLE_NAME)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating clinical picture:', error);
    throw new Error(`Failed to update clinical picture: ${error.message}`);
  }

  return mapFromSupabase(data);
};

/**
 * Eliminar un cuadro clínico
 */
export const deleteClinicalPicture = async (id: string): Promise<void> => {
  const { error } = await supabaseClientVue
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting clinical picture:', error);
    throw new Error(`Failed to delete clinical picture: ${error.message}`);
  }
};

/**
 * Agregar mensaje al chat del cuadro clínico
 */
export const addChatMessage = async (
  clinicalPictureId: string,
  message: { role: 'user' | 'assistant' | 'system'; content: string; metadata?: Record<string, any> }
): Promise<ClinicalPicture> => {
  const clinicalPicture = await getClinicalPictureById(clinicalPictureId);
  if (!clinicalPicture) throw new Error('Clinical picture not found');

  const newMessage: ClinicalPictureChatMessage = {
    id: crypto.randomUUID(),
    role: message.role,
    content: message.content,
    timestamp: new Date(),
    metadata: message.metadata || {}
  };

  const updatedChat: ClinicalPictureChat = {
    ...clinicalPicture.chat,
    messages: [...clinicalPicture.chat.messages, newMessage],
    updatedAt: new Date()
  };

  return updateClinicalPicture(clinicalPictureId, { chat: updatedChat });
};

/**
 * Agregar nota clínica al cuadro
 */
export const addClinicalNote = async (
  clinicalPictureId: string,
  note: Omit<ClinicalPictureNote, 'id' | 'createdAt'>
): Promise<ClinicalPicture> => {
  const clinicalPicture = await getClinicalPictureById(clinicalPictureId);
  if (!clinicalPicture) throw new Error('Clinical picture not found');

  const newNote: ClinicalPictureNote = {
    id: crypto.randomUUID(),
    ...note,
    createdAt: new Date()
  };

  return updateClinicalPicture(clinicalPictureId, {
    notes: [...clinicalPicture.notes, newNote]
  });
};

/**
 * Agregar transcripción al cuadro
 */
export const addTranscription = async (
  clinicalPictureId: string,
  transcription: Omit<ClinicalPictureTranscription, 'id' | 'createdAt'>
): Promise<ClinicalPicture> => {
  const clinicalPicture = await getClinicalPictureById(clinicalPictureId);
  if (!clinicalPicture) throw new Error('Clinical picture not found');

  const newTranscription: ClinicalPictureTranscription = {
    id: crypto.randomUUID(),
    ...transcription,
    createdAt: new Date()
  };

  return updateClinicalPicture(clinicalPictureId, {
    transcriptions: [...clinicalPicture.transcriptions, newTranscription]
  });
};

/**
 * Agregar recurso al cuadro
 */
export const addResource = async (
  clinicalPictureId: string,
  resource: Omit<ClinicalPictureResource, 'id' | 'createdAt'>
): Promise<ClinicalPicture> => {
  const clinicalPicture = await getClinicalPictureById(clinicalPictureId);
  if (!clinicalPicture) throw new Error('Clinical picture not found');

  const newResource: ClinicalPictureResource = {
    id: Date.now(), // Using timestamp as ID for resources
    ...resource,
    createdAt: new Date()
  };

  return updateClinicalPicture(clinicalPictureId, {
    resources: [...clinicalPicture.resources, newResource]
  });
};

/**
 * Función auxiliar para mapear datos de Supabase al tipo ClinicalPicture
 */
const mapFromSupabase = (data: any): ClinicalPicture => ({
  id: data.id,
  title: data.title,
  description: data.description,
  patientId: data.patient_id,
  patientName: data.patient_name,
  createdBy: data.created_by,
  chat: data.chat || { id: crypto.randomUUID(), messages: [], createdAt: new Date() },
  notes: data.notes || [],
  transcriptions: data.transcriptions || [],
  resources: data.resources || [],
  status: data.status,
  tags: data.tags || [],
  createdAt: new Date(data.created_at),
  updatedAt: data.updated_at ? new Date(data.updated_at) : undefined,
  completedAt: data.completed_at ? new Date(data.completed_at) : undefined
});
