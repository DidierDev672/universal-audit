// Application Use Cases - Patient Screening Assignment
// SOLID: Single Responsibility, Dependency Inversion
// Each use case has a single responsibility and depends on repository abstractions

import type {
  IPatientScreeningAssignmentRepository,
  IPatientRepository,
} from '../../core/patientScreening/interface/repositories';
import type {
  PatientScreeningAssignment,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
  Patient,
} from '../../core/patientScreening/entities/patientScreeningAssignment';
import type { IScreeningRepository } from '../../core/screening/interface/repositories';

/**
 * Use case for assigning a screening to a patient
 * Following Single Responsibility Principle
 */
export class AssignScreeningToPatientUseCase {
  constructor(
    private readonly assignmentRepository: IPatientScreeningAssignmentRepository,
    private readonly patientRepository: IPatientRepository,
    private readonly screeningRepository: IScreeningRepository,
  ) {}

  async execute(data: CreateAssignmentRequest): Promise<PatientScreeningAssignment> {
    // Validate patient exists
    const patient = await this.patientRepository.getById(data.patientId);
    if (!patient) {
      throw new Error('El paciente no existe');
    }

    console.log({ data });

    // Validate screening exists
    if (!data.screeningIds || data.screeningIds.length === 0) {
      throw new Error('El ID del tamizaje es requerido');
    }
    const screening = await this.screeningRepository.getById(data.screeningIds[0]);
    if (!screening) { 
      throw new Error('El tamizaje no existe');
    }

    // Check if assignment already exists
    const existingAssignments = await this.assignmentRepository.getByPatientId(data.patientId);
    const duplicate = existingAssignments.find(
      (a: PatientScreeningAssignment) => a.screeningId === data.screeningIds[0] && a.status === 'pending',
    );

    if (duplicate) {
      throw new Error('Este tamizaje ya está asignado al paciente');
    }

    return this.assignmentRepository.create(data);
  }
}

/**
 * Use case for retrieving all assignments
 */
export class GetAllAssignmentsUseCase {
  constructor(private readonly assignmentRepository: IPatientScreeningAssignmentRepository) {}

  async execute(): Promise<PatientScreeningAssignment[]> {
    return this.assignmentRepository.getAll();
  }
}

/**
 * Use case for retrieving assignments by patient
 */
export class GetAssignmentsByPatientUseCase {
  constructor(private readonly assignmentRepository: IPatientScreeningAssignmentRepository) {}

  async execute(patientId: string): Promise<PatientScreeningAssignment[]> {
    if (!patientId) {
      throw new Error('El ID del paciente es requerido');
    }
    return this.assignmentRepository.getByPatientId(patientId);
  }
}

/**
 * Use case for updating an assignment
 */
export class UpdateAssignmentUseCase {
  constructor(private readonly assignmentRepository: IPatientScreeningAssignmentRepository) {}

  async execute(
    id: string,
    data: UpdateAssignmentRequest,
  ): Promise<PatientScreeningAssignment> {
    if (!id) {
      throw new Error('El ID de la asignación es requerido');
    }

    const existing = await this.assignmentRepository.getById(id);
    if (!existing) {
      throw new Error('La asignación no existe');
    }

    // If marking as completed, set completedAt
    if (data.status === 'completed' && !data.completedAt) {
      data.completedAt = new Date().toISOString();
    }

    return this.assignmentRepository.update(id, data);
  }
}

/**
 * Use case for deleting an assignment
 */
export class DeleteAssignmentUseCase {
  constructor(private readonly assignmentRepository: IPatientScreeningAssignmentRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('El ID de la asignación es requerido');
    }

    const existing = await this.assignmentRepository.getById(id);
    if (!existing) {
      throw new Error('La asignación no existe');
    }

    return this.assignmentRepository.delete(id);
  }
}

/**
 * Use case for searching patients by name
 */
export class SearchPatientsUseCase {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(name: string): Promise<Patient[]> {
    if (!name || name.trim().length < 2) {
      throw new Error('Ingrese al menos 2 caracteres para buscar');
    }
    return this.patientRepository.searchByName(name);
  }
}

/**
 * Use case for getting all patients
 */
export class GetAllPatientsUseCase {
  constructor(private readonly patientRepository: IPatientRepository) {}

  async execute(): Promise<Patient[]> {
    return this.patientRepository.getAll();
  }
}
