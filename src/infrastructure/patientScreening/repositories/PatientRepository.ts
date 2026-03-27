// Infrastructure - Patient Repository Adapter
// Implements IPatientRepository port
// SOLID: Dependency Inversion - depends on abstractions

import type { IPatientRepository } from '../../core/patientScreening/interface/repositories';
import type { Patient } from '../../core/patientScreening/entities/patientScreeningAssignment';
import axios from 'axios';

/**
 * Repository implementation for patient data access
 * Following Single Responsibility Principle - handles patient data retrieval only
 */
export class PatientRepository implements IPatientRepository {
  private readonly apiUrl = 'http://localhost:3000/api/v1/patients';

  async getAll(): Promise<Patient[]> {
    const response = await axios.get(this.apiUrl);
    return response.data;
  }

  async getById(id: string): Promise<Patient | null> {
    const response = await axios.get(`${this.apiUrl}/${id}`);
    return response.data || null;
  }

  async searchByName(name: string): Promise<Patient[]> {
    const response = await axios.get(`${this.apiUrl}/search?name=${encodeURIComponent(name)}`);
    return response.data;
  }
}
