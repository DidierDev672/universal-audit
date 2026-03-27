// Infrastructure - Patient Screening Assignment Repository Adapter
// Implements IPatientScreeningAssignmentRepository port
// SOLID: Dependency Inversion - depends on abstractions

import type { IPatientScreeningAssignmentRepository } from '../../core/patientScreening/interface/repositories';
import type {
  PatientScreeningAssignment,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
} from '../../core/patientScreening/entities/patientScreeningAssignment';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

/**
 * Repository implementation for patient-screening assignments
 * Following Single Responsibility Principle - handles assignment persistence only
 */
export class PatientScreeningAssignmentRepository implements IPatientScreeningAssignmentRepository {
  private readonly apiUrl = 'http://localhost:3000/api/v1/assignments';

  async create(data: CreateAssignmentRequest): Promise<PatientScreeningAssignment> {
    const assignment: PatientScreeningAssignment = {
      patientId: data.patientId, // Will be populated by backend
      screeningIds: data.screeningIds,
    };

    console.log({ assignment });
    const response = await axios.post(this.apiUrl, assignment);
    return response.data;
  }

  async getAll(): Promise<PatientScreeningAssignment[]> {
    const response = await axios.get(this.apiUrl);
    return response.data;
  }

  async getById(id: string): Promise<PatientScreeningAssignment | null> {
    const response = await axios.get(`${this.apiUrl}/${id}`);
    return response.data || null;
  }

  async getByPatientId(patientId: string): Promise<PatientScreeningAssignment[]> {
    const response = await axios.get(`${this.apiUrl}/patient/${patientId}`);
    return response.data;
  }

  async getByScreeningId(screeningId: string): Promise<PatientScreeningAssignment[]> {
    const response = await axios.get(`${this.apiUrl}/screening/${screeningId}`);
    return response.data;
  }

  async update(id: string, data: UpdateAssignmentRequest): Promise<PatientScreeningAssignment> {
    const response = await axios.put(`${this.apiUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.apiUrl}/${id}`);
  }
}
