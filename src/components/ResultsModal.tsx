import React, { useState } from 'react';
import { SessionResult } from '../types';
import { getSpeedCategory } from '../utils/metrics';
import { RotateCcw, ArrowRight, Copy, Check, BarChart2, AlertTriangle, Clock, Zap, Target } from 'lucide-react';
import { Logo } from './Logo';

interface ResultsModalProps {
  result: SessionResult;
  onRetry: () => void;
  onNext: () => void;
  onViewHistory: () => void;
  onClose: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  result,
  onRetry,
  onNext,
  onViewHistory,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const speedCat = getSpeedCategory(result.wpm);

  const handleCopy = () => {
    const textToCopy = `⌨️ Meu resultado no DIGITA+:
🚀 Velocidade: ${result.wpm} PPM (${result.cpm} CPM)
🎯 Precisão: ${result.accuracy}%
⏱️ Tempo: ${result.timeElapsed}s | Erros: ${result.totalErrors}
📚 Nível: ${result.difficulty.toUpperCase()}${result.isSimplifiedMode ? ' (SEM ACENTOS)' : ''}
Venha treinar no DIGITA+ · Digite ▸ Evolua ▸ Vá mais longe!`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-cyan-900/60 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
        {/* Glow ambient highlight */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header with DIGITA+ Logo & Speed Tier */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex flex-col gap-2">
            <Logo size="sm" showTagline={false} />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                Sessão Concluída!
              </h2>
              <p className={`text-xs sm:text-sm font-bold ${speedCat.color} mt-0.5`}>
                Desempenho: {speedCat.label} — {speedCat.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* PPM */}
          <div className="bg-slate-50 dark:bg-[#070b14]/70 p-3.5 rounded-2xl border border-slate-200/80 dark:border-cyan-950/60 flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyan-500" /> PPM (WPM)
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-cyan-600 dark:text-cyan-400 mt-1">
              {result.wpm}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5">Palavras/min</span>
          </div>

          {/* Precisão */}
          <div className="bg-slate-50 dark:bg-[#070b14]/70 p-3.5 rounded-2xl border border-slate-200/80 dark:border-cyan-950/60 flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-500" /> Precisão
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
              {result.accuracy}%
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5">Taxa de acertos</span>
          </div>

          {/* Tempo Total */}
          <div className="bg-slate-50 dark:bg-[#070b14]/70 p-3.5 rounded-2xl border border-slate-200/80 dark:border-cyan-950/60 flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Tempo
            </span>
            <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-slate-900 dark:text-white mt-1">
              {result.timeElapsed}s
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {result.timeLimit > 0 ? `Limite: ${result.timeLimit}s` : 'Sem limite'}
            </span>
          </div>

          {/* Erros */}
          <div className="bg-slate-50 dark:bg-[#070b14]/70 p-3.5 rounded-2xl border border-slate-200/80 dark:border-cyan-950/60 flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Erros
            </span>
            <div className={`text-2xl sm:text-3xl font-black font-mono tabular-nums mt-1 ${result.totalErrors > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
              {result.totalErrors}
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {result.totalErrors === 0 ? 'Impecável!' : 'Corrigidos'}
            </span>
          </div>
        </div>

        {/* Secondary Details & Character Mistakes Breakdown */}
        <div className="bg-slate-50 dark:bg-[#070b14]/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col gap-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Caracteres por minuto (CPM):</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {result.cpm} CPM
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Total de caracteres digitados:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {result.totalCharacters}
            </span>
          </div>

          {result.mostFrequentErrors.length > 0 ? (
            <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Teclas mais erradas nesta tentativa:
              </span>
              <div className="flex flex-wrap gap-2">
                {result.mostFrequentErrors.map((err, idx) => (
                  <span
                    key={idx}
                    className="font-mono px-2.5 py-1 bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60 rounded-lg text-xs"
                  >
                    &ldquo;{err.char}&rdquo;: {err.count}x
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Excelente! Nenhuma tecla incorreta foi registrada.</span>
            </div>
          )}
        </div>

        {/* Action Buttons with High-Contrast Styling */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onRetry}
              className="flex-1 sm:flex-none px-4 py-3 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-cyan-800 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Repetir Frase</span>
            </button>
            <button
              onClick={onNext}
              className="flex-1 sm:flex-none px-5 py-3 text-xs sm:text-sm font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/25 active:scale-95"
            >
              <span>Próxima Frase</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none px-4 py-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-xs"
              title="Copiar resultado formatado"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copiar</span>
                </>
              )}
            </button>
            <button
              onClick={onViewHistory}
              className="flex-1 sm:flex-none px-4 py-3 text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 rounded-xl border border-cyan-200/50 dark:border-cyan-900/50 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <BarChart2 className="w-4 h-4" />
              <span>Ver Histórico</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
