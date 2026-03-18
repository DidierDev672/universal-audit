// Domain Entity - Screening
// Vertical Slicing + SOLID Principles

export interface Screening {
  id: string;
  title: string;
  description: string;
  soundId: string;
  soundTitle: string;
  soundUrl: string;
  options: ScreeningOption[];
  createdAt: string;
  updatedAt: string;
}

export interface ScreeningOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Sound {
  id: string;
  title: string;
  description: string;
  sound: string;
  duration: string;
  plays: number;
  category: string;
}

export interface CreateScreeningRequest {
  title: string;
  description: string;
  soundId: string | string[];
  options?: Omit<ScreeningOption, 'id'>[];
}
