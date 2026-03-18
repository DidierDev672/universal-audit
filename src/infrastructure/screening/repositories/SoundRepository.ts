// Infrastructure - Sound Repository Adapter
// Implements ISoundRepository port

import type { ISoundRepository } from '../../core/screening/interface/repositories';
import type { Sound } from '../../core/screening/entities/screening';
import axios from 'axios';
import { supabaseClientVue } from '../../../supabase';

export class SoundRepository implements ISoundRepository {
  private readonly apiUrl = 'http://localhost:3000/api/v1/screenings';

  private async getPublicUrl(path: string): Promise<string> {
    // If already a full URL, return as is
    if (path.startsWith('http')) {
      return path;
    }
    
    try {
      // URL-encode the path to handle special characters like commas
      const encodedPath = encodeURIComponent(path);
      const { data, error } = supabaseClientVue.storage
        .from('audio-tamizaje')
        .getPublicUrl(encodedPath);
      
      if (error) throw error;
      return data.publicUrl;
    } catch (e) {
      console.error('Error getting public URL for path:', path, e);
      return path;
    }
  }

  async getAll(): Promise<Sound[]> {
    const response = await axios.get(this.apiUrl);
    const sounds: Sound[] = response.data;
    
    console.log('Raw sounds from API:', sounds);
    
    // Get public URLs for each sound
    for (const sound of sounds) {
      if (sound.sound) {
        sound.sound = await this.getPublicUrl(sound.sound);
        console.log('Sound', sound.id, 'URL:', sound.sound);
      }
    }
    
    return sounds;
  }

  async getById(id: string): Promise<Sound | null> {
    const response = await axios.get(`${this.apiUrl}/${id}`);
    const sound = response.data;
    if (sound?.sound) {
      sound.sound = await this.getPublicUrl(sound.sound);
    }
    return sound || null;
  }

  async getByCategory(category: string): Promise<Sound[]> {
    const sounds = await this.getAll();
    return sounds.filter(sound => sound.category === category);
  }
}
