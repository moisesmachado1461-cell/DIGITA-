import React from 'react';
import { DifficultyLevel, TimeLimitOption } from '../types';
import { DIFFICULTY_LABELS, TIME_LIMITS } from '../data/phrases';
import { Timer, Zap, Sparkles, BookOpen, Sliders, Type, Check } from 'lucide-react';

interface ModeSelectorProps {
  difficulty: DifficultyLevel;
  setDifficulty: (level: DifficultyLevel) => void;
  timeLimit: TimeLimitOption;
  setTimeLimit: (time: TimeLimitOption) => void;
  isSimplified: boolean;
  onToggleSimplified: () => void;
  disabled: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  difficulty,
  setDifficulty,
  timeLimit,
  setTimeLimit,
  isSimplified,
  onToggleSimplified,
  disabled,
}) => {
  const getDifficultyIcon = (level: DifficultyLevel) => {
    switch (level) {
      case 'iniciante':
        return <Zap className="w-3.5 h-3.5 text-emerald-400" />;
      case 'sem_acentos':
        return <Type className="w-3.5 h-3.5 text-cyan-400" />;
      case 'intermediario':
        return <BookOpen className="w-3.5 h-3.5 text-sky-400" />;
      case 'avancado':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'livre':
        return <Sliders className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const isSimplifiedActive = isSimplified || difficulty === 'sem_acentos';

  return (
    <div className="w-full flex flex-col gap-4 p-4 sm:p-5 bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-2xl shadow-sm transition-all">
      {/* Primary Row: Difficulty and Timer Selectors */}
      <div className="w-full flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        {/* Difficulty Mode Segment */}
        <div className="w-full xl:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            Nível:
          </span>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 w-full sm:w-auto bg-slate-100/90 dark:bg-slate-900/90 p-1.5 rounded-xl border border-slate-200/70 dark:border-slate-800/80">
            {(['iniciante', 'sem_acentos', 'intermediario', 'avancado', 'livre'] as DifficultyLevel[]).map((level) => {
              const isSelected = difficulty === level;
              const meta = DIFFICULTY_LABELS[level];
              return (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  disabled={disabled}
                  title={meta.desc}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-300 shadow-md shadow-cyan-500/10 border border-cyan-300/80 dark:border-cyan-500/50 scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60'
                  } ${disabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}`}
                >
                  {getDifficultyIcon(level)}
                  <span>{meta.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Limit Segment */}
        <div className="w-full xl:w-auto flex items-center justify-between sm:justify-end gap-2.5">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <Timer className="w-3.5 h-3.5 text-cyan-500" />
            Tempo:
          </span>

          <div className="flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-900/90 p-1.5 rounded-xl border border-slate-200/70 dark:border-slate-800/80">
            {TIME_LIMITS.map((t) => {
              const isSelected = timeLimit === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setTimeLimit(t.value)}
                  disabled={disabled}
                  title={t.desc}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-300 shadow-sm border border-cyan-300/80 dark:border-cyan-500/50 scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60'
                  } ${disabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-95'}`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sub-bar: Simplified Mode quick toggle with modern pill switch */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-cyan-950/40 text-xs">
        <button
          onClick={onToggleSimplified}
          className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl font-medium transition-all duration-200 cursor-pointer border ${
            isSimplifiedActive
              ? 'bg-cyan-500/10 border-cyan-400/60 text-cyan-700 dark:text-cyan-300 shadow-xs'
              : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
              isSimplifiedActive
                ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-xs'
                : 'border-slate-400 bg-white dark:bg-slate-800 text-transparent'
            }`}
          >
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span className="font-semibold">Modo Sem Acentos, Pontuações e Maiúsculas</span>
          <span className="text-[10px] opacity-75 font-mono hidden sm:inline">(a-z e espaços apenas)</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <span>Use a barra de</span>
          <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md font-mono text-[10px] border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-2xs">
            Espaço
          </kbd>
          <span>para avançar palavras</span>
        </div>
      </div>
    </div>
  );
};
