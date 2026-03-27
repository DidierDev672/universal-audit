// Repository Interfaces - Ports
// SOLID: Interface Segregation, Dependency Inversion
// Defines contracts for data access without implementation details

import type {
  PatientScreeningAssignment,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
  Patient,
} from '../entities/patientScreeningAssignment';

/**
 * Repository interface for managing patient-screening assignments
 * Following Interface Segregation Principle - focused on assignment operations
 */
export interface IPatientScreeningAssignmentRepository {
  create(data: CreateAssignmentRequest): Promise<PatientScreeningAssignment>;
  getAll(): Promise<PatientScreeningAssignment[]>;
  getById(id: string): Promise<PatientScreeningAssignment | null>;
  getByPatientId(patientId: string): Promise<PatientScreeningAssignment[]>;
  getByScreeningId(screeningId: string): Promise<PatientScreeningAssignment[]>;
  update(id: string, data: UpdateAssignmentRequest): Promise<PatientScreeningAssignment>;
  delete(id: string): Promise<void>;
}

/**
 * Repository interface for accessing patient data
 * Following Interface Segregation Principle - separate from assignment operations
 */
export interface IPatientRepository {
  getAll(): Promise<Patient[]>;
  getById(id: string): Promise<Patient | null>;
  searchByName(name: string): Promise<Patient[]>;
}
