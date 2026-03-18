// Repository Interfaces - Ports
// SOLID: Interface Segregation, Dependency Inversion

import type { Screening, CreateScreeningRequest, Sound } from '../entities/screening';

export interface IScreeningRepository {
  create(data: CreateScreeningRequest): Promise<Screening>;
  getAll(): Promise<Screening[]>;
  getById(id: string): Promise<Screening | null>;
  update(id: string, data: Partial<CreateScreeningRequest>): Promise<Screening>;
  delete(id: string): Promise<void>;
}

export interface ISoundRepository {
  getAll(): Promise<Sound[]>;
  getById(id: string): Promise<Sound | null>;
  getByCategory(category: string): Promise<Sound[]>;
}
