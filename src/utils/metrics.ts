import { SessionResult } from '../types';

const STORAGE_KEY = 'datilogia_history_v1';
const CUSTOM_PHRASES_KEY = 'datilogia_custom_phrases_v1';

export function calculateWpm(correctChars: number, timeSeconds: number): number {
  if (timeSeconds <= 0 || correctChars <= 0) return 0;
  const minutes = timeSeconds / 60;
  // Standard 5 chars = 1 word
  const words = correctChars / 5;
  return Math.round(words / minutes);
}

export function calculateCpm(correctChars: number, timeSeconds: number): number {
  if (timeSeconds <= 0 || correctChars <= 0) return 0;
  const minutes = timeSeconds / 60;
  return Math.round(correctChars / minutes);
}

export function calculateAccuracy(correctChars: number, totalAttempted: number): number {
  if (totalAttempted <= 0) return 100;
  const acc = (correctChars / totalAttempted) * 100;
  return Math.max(0, Math.min(100, Math.round(acc * 10) / 10));
}

export function getSpeedCategory(wpm: number): { label: string; description: string; color: string } {
  if (wpm < 25) {
    return { label: 'Iniciante', description: 'Bom começo! Mantenha a prática constante.', color: 'text-amber-500' };
  } else if (wpm < 45) {
    return { label: 'Intermediário', description: 'Ótimo ritmo! Você já digita com fluidez.', color: 'text-sky-500' };
  } else if (wpm < 70) {
    return { label: 'Avançado', description: 'Excelente velocidade! Acima da média geral.', color: 'text-emerald-500' };
  } else {
    return { label: 'Mestre da Escrita', description: 'Velocidade e destreza impressionantes!', color: 'text-violet-500' };
  }
}

export function loadSessionHistory(): SessionResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSessionResult(result: SessionResult): SessionResult[] {
  try {
    const history = loadSessionHistory();
    const updated = [result, ...history].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearSessionHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore error
  }
}

export function loadCustomPhrases(): Array<{ id: string; text: string; difficulty: 'livre'; category: string }> {
  try {
    const raw = localStorage.getItem(CUSTOM_PHRASES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomPhrase(text: string, category: string = 'Personalizado'): Array<{ id: string; text: string; difficulty: 'livre'; category: string }> {
  try {
    const existing = loadCustomPhrases();
    const newPhrase = {
      id: `custom-${Date.now()}`,
      text: text.trim(),
      difficulty: 'livre' as const,
      category,
    };
    const updated = [newPhrase, ...existing];
    localStorage.setItem(CUSTOM_PHRASES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function deleteCustomPhrase(id: string): Array<{ id: string; text: string; difficulty: 'livre'; category: string }> {
  try {
    const existing = loadCustomPhrases();
    const updated = existing.filter((p) => p.id !== id);
    localStorage.setItem(CUSTOM_PHRASES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
