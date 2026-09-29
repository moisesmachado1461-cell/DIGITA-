import React from 'react';
import { Sparkles, Trophy, Zap, Compass } from 'lucide-react';
import { DifficultyLevel } from '../types';
import { DIFFICULTY_LABELS } from '../data/phrases';

interface HeroBannerProps {
  difficulty: DifficultyLevel;
  bestWpm: number;
  totalSessions: number;
  onExploreTips: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  difficulty,
  bestWpm,
  totalSessions,
  onExploreTips,
}) => {
  const currentDiffMeta = DIFFICULTY_LABELS[difficulty];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 text-white p-6 sm:p-8 border border-cyan-500/20 shadow-xl shadow-cyan-950/20">
      {/* Background ambient glow effect */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-16 w-80 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plataforma de Alta Performance de Digitação</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Domine o teclado com fluência, ritmo e confiança.
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
            Meça sua velocidade real (PPM), elimine erros frequentes e alcance precisão máxima no modo normal ou simplificado.
          </p>
        </div>

        {/* Quick telemetry badges */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          <div className="flex-1 sm:flex-none flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-sm p-3 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Recorde</span>
              <span className="text-base font-bold font-mono text-cyan-300 tabular-nums">
                {bestWpm > 0 ? `${bestWpm} PPM` : '—'}
              </span>
            </div>
          </div>

          <div className="flex-1 sm:flex-none flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-sm p-3 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Nível Atual</span>
              <span className="text-xs font-bold text-white capitalize">
                {currentDiffMeta.title}
              </span>
            </div>
          </div>

          <button
            onClick={onExploreTips}
            className="w-full sm:w-auto px-4 py-3 bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer whitespace-nowrap"
          >
            <Compass className="w-4 h-4" />
            <span>Guia Rápido</span>
          </button>
        </div>
      </div>
    </div>
  );
};
