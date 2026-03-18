// Application Use Cases - Screening
// SOLID: Single Responsibility, Dependency Inversion

import type { IScreeningRepository, ISoundRepository } from '../../core/screening/interface/repositories';
import type { Screening, Sound, CreateScreeningRequest } from '../../core/screening/entities/screening';

export class CreateScreeningUseCase {
  constructor(private readonly screeningRepository: IScreeningRepository) {}

  async execute(data: CreateScreeningRequest): Promise<Screening> {
    if (!data.title || data.title.trim().length < 3) {
      throw new Error('El nombre del tamizaje debe tener al menos 3 caracteres');
    }

    if (!data.description || data.description.trim().length === 0) {
      throw new Error('La descripción es requerida');
    }

    const soundIds = Array.isArray(data.soundId) ? data.soundId : [data.soundId];
    
    if (soundIds.length < 2) {
      throw new Error('Debe seleccionar al menos 2 sonidos');
    }

    return this.screeningRepository.create(data);
  }
}

export class GetSoundsUseCase {
  constructor(private readonly soundRepository: ISoundRepository) {}

  async execute(): Promise<Sound[]> {
    return this.soundRepository.getAll();
  }
}

export class GetScreeningByIdUseCase {
  constructor(private readonly screeningRepository: IScreeningRepository) {}

  async execute(id: string): Promise<Screening | null> {
    if (!id) {
      throw new Error('El ID del tamizaje es requerido');
    }
    return this.screeningRepository.getById(id);
  }
}

export class GetAllScreeningsUseCase {
  constructor(private readonly screeningRepository: IScreeningRepository) {}

  async execute(): Promise<Screening[]> {
    return this.screeningRepository.getAll();
  }
}

export class DeleteScreeningUseCase {
  constructor(private readonly screeningRepository: IScreeningRepository) {}

  async execute(id: string): Promise<void> {
    if (!id) {
      throw new Error('El ID del tamizaje es requerido');
    }
    return this.screeningRepository.delete(id);
  }
}
