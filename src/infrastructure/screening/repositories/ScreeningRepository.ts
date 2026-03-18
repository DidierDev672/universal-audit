// Infrastructure - Screening Repository Adapter
// Implements IScreeningRepository port

import type { IScreeningRepository } from '../../core/screening/interface/repositories';
import type { Screening, CreateScreeningRequest } from '../../core/screening/entities/screening';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export class ScreeningRepository implements IScreeningRepository {
  private readonly apiUrl = 'http://localhost:3000/api/v1/screenings';

  async create(data: CreateScreeningRequest): Promise<Screening> {
    const soundIds = Array.isArray(data.soundId) ? data.soundId : [data.soundId];
    const response = await axios.post(this.apiUrl, {
      title: data.title,
      description: data.description,
      soundId: soundIds[0], // Send the first (correct) sound id
      options: data.options.map((opt: any) => ({
        id: uuidv4(),
        text: opt.text,
        isCorrect: opt.isCorrect,
      })),
    });

    return response.data;
  }

  async getAll(): Promise<Screening[]> {
    const response = await axios.get(this.apiUrl);
    return response.data;
  }

  async getById(id: string): Promise<Screening | null> {
    const response = await axios.get(`${this.apiUrl}/${id}`);
    return response.data || null;
  }

  async update(id: string, data: Partial<CreateScreeningRequest>): Promise<Screening> {
    const response = await axios.put(`${this.apiUrl}/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.apiUrl}/${id}`);
  }
}
