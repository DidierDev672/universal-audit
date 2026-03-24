/**
 * Tipo de dato para el Cuadro Clínico
 * Representa una estructura completa que consolida toda la información del paciente
 */

// Tipos de datos relacionados
export interface ClinicalPicturePatient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  medicalHistory?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ClinicalPictureChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ClinicalPictureChat {
  id: string;
  title?: string;
  messages: ClinicalPictureChatMessage[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface ClinicalPictureNote {
  id: string;
  title: string;
  description: string;
  highlightText?: string;
  resourceId?: number;
  resourceName?: string;
  highlightId?: number;
  aiAnalysis?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ClinicalPictureTranscription {
  id: string;
  text: string;
  resourceId: number;
  resourceName: string;
  duration?: number;
  createdAt: Date;
}

export interface ClinicalPictureResource {
  id: number;
  name: string;
  type: 'pdf' | 'audio' | 'video' | 'url' | 'youtube';
  description?: string;
  url?: string;
  transcription?: string;
  fileSize?: number;
  createdAt: Date;
}

/**
 * Cuadro Clínico Principal
 * Consolida toda la información del paciente en una sola estructura
 */
export interface ClinicalPicture {
  id: string;
  // Información básica
  title: string;
  description?: string;
  
  // Relación con paciente/usuario
  patientId?: string;
  patientName?: string;
  createdBy?: string;
  
  // Datos consolidados
  chat: ClinicalPictureChat;
  notes: ClinicalPictureNote[];
  transcriptions: ClinicalPictureTranscription[];
  resources: ClinicalPictureResource[];
  
  // Metadatos
  status: 'draft' | 'active' | 'archived' | 'completed';
  tags?: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: Date;
}

/**
 * DTO para crear un nuevo cuadro clínico con todos los datos relacionados
 */
export interface CreateClinicalPictureDTO {
  title: string;
  description?: string;
  patientId?: string;
  patientName?: string;
  status?: 'draft' | 'active' | 'archived' | 'completed';
  tags?: string[];
  // Datos relacionados opcionales para creación integral
  chat?: ClinicalPictureChat;
  notes?: ClinicalPictureNote[];
  transcriptions?: ClinicalPictureTranscription[];
  resources?: ClinicalPictureResource[];
}

/**
 * DTO para actualizar un cuadro clínico
 */
export interface UpdateClinicalPictureDTO {
  title?: string;
  description?: string;
  status?: 'draft' | 'active' | 'archived' | 'completed';
  tags?: string[];
  chat?: ClinicalPictureChat;
  notes?: ClinicalPictureNote[];
  transcriptions?: ClinicalPictureTranscription[];
  resources?: ClinicalPictureResource[];
}

/**
 * Respuesta paginada de cuadros clínicos
 */
export interface ClinicalPictureListResponse {
  data: ClinicalPicture[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Filtros para búsqueda de cuadros clínicos
 */
export interface ClinicalPictureFilters {
  patientId?: string;
  status?: 'draft' | 'active' | 'archived' | 'completed';
  searchTerm?: string;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
}
