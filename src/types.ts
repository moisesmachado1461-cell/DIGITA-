export type DifficultyLevel = 'iniciante' | 'intermediario' | 'avancado' | 'sem_acentos' | 'livre';

export type TimeLimitOption = 30 | 60 | 120 | 0; // 0 = sem limite

export interface TypingPhrase {
  id: string;
  text: string;
  difficulty: DifficultyLevel;
  category: string;
  author?: string;
}

export interface CharacterMistake {
  expected: string;
  typed: string;
  index: number;
}

export interface SessionResult {
  id: string;
  timestamp: number;
  dateFormatted: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  totalErrors: number;
  timeElapsed: number;
  timeLimit: TimeLimitOption;
  difficulty: DifficultyLevel;
  phrasePreview: string;
  totalCharacters: number;
  mostFrequentErrors: { char: string; count: number }[];
  isSimplifiedMode?: boolean;
}

export type PracticeStatus = 'idle' | 'typing' | 'finished' | 'paused';
