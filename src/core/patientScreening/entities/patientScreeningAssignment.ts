// Domain Entity - Patient Screening Assignment
// Vertical Slicing + SOLID Principles
// Represents the assignment of a screening to a patient

export interface PatientScreeningAssignment {
  id: string;
  patientId: string;
  patientName: string;
  screeningId: string;
  screeningTitle: string;
  assignedAt: string;
  status: AssignmentStatus;
  completedAt?: string;
  results?: ScreeningResult[];
  notes?: string;
  assignedBy: string;
}

export type AssignmentStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface ScreeningResult {
  questionId: string;
  questionText: string;
  selectedOptionId: string;
  selectedOptionText: string;
  isCorrect: boolean;
  responseTimeMs?: number;
}

export interface Patient {
  id: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  age: number;
}

export interface CreateAssignmentRequest {
  patientId: string;
  screeningIds: string[];
  notes?: string;
  assignedBy: string;
}

export interface UpdateAssignmentRequest {
  status?: AssignmentStatus;
  results?: ScreeningResult[];
  notes?: string;
  completedAt?: string;
}
