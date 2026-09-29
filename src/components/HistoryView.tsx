import React, { useState } from 'react';
import { SessionResult } from '../types';
import { clearSessionHistory } from '../utils/metrics';
import { Trophy, TrendingUp, Target, Clock, Trash2, ArrowLeft, Play, Award, Zap } from 'lucide-react';

interface HistoryViewProps {
  history: SessionResult[];
  onRefreshHistory: () => void;
  onBackToPractice: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onRefreshHistory,
  onBackToPractice,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Compute aggregate statistics
  const totalSessions = history.length;
  const bestWpm = history.reduce((max, s) => Math.max(max, s.wpm), 0);
  const avgWpm = totalSessions > 0 ? Math.round(history.reduce((acc, s) => acc + s.wpm, 0) / totalSessions) : 0;
  const avgAccuracy =
    totalSessions > 0
      ? Math.round((history.reduce((acc, s) => acc + s.accuracy, 0) / totalSessions) * 10) / 10
      : 0;

  const handleClear = () => {
    clearSessionHistory();
    onRefreshHistory();
    setShowClearConfirm(false);
  };

  // Prepare points for mini SVG progression chart (up to last 15 sessions in chronological order)
  const chartSessions = [...history].slice(0, 15).reverse();
  const maxChartWpm = Math.max(60, ...chartSessions.map((s) => s.wpm));

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPractice}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] text-slate-700 dark:text-slate-200 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-300 dark:hover:border-cyan-800 transition-all duration-200 cursor-pointer active:scale-95 shadow-xs"
            title="Voltar para a prática"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Histórico de Desempenho
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Acompanhe sua curva de evolução em velocidade (PPM), precisão e consistência
            </p>
          </div>
        </div>

        {totalSessions > 0 && (
          <div className="flex items-center gap-2">
            {showClearConfirm ? (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/40 p-2 rounded-xl border border-red-200 dark:border-red-900/60 shadow-xs">
                <span className="text-xs text-red-600 dark:text-red-400 font-bold px-1">Limpar tudo?</span>
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer active:scale-95"
                >
                  Sim, apagar
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-900/50 transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                <span>Limpar Histórico</span>
              </button>
            )}
          </div>
        )}
      </div>

      {totalSessions === 0 ? (
        <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-3xl p-12 text-center flex flex-col items-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-500 dark:text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Nenhum treino salvo ainda</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
              Complete seu primeiro exercício de digitação no DIGITA+ para visualizar estatísticas de velocidade, precisão e gráficos de evolução.
            </p>
          </div>
          <button
            onClick={onBackToPractice}
            className="mt-2 px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 rounded-xl text-sm font-extrabold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/25 active:scale-95"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Iniciar Primeiro Treino</span>
          </button>
        </div>
      ) : (
        <>
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> Melhor WPM
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                {bestWpm} <span className="text-xs font-normal text-slate-500">PPM</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">Recorde pessoal</span>
            </div>

            <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-500" /> Média WPM
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-cyan-600 dark:text-cyan-400 mt-1">
                {avgWpm} <span className="text-xs font-normal text-slate-500">PPM</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">Ritmo constante</span>
            </div>

            <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-500" /> Precisão Média
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                {avgAccuracy}%
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">Taxa de acertos</span>
            </div>

            <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" /> Total Sessões
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-slate-900 dark:text-white mt-1">
                {totalSessions}
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">Treinos salvos</span>
            </div>
          </div>

          {/* Evolution Chart (SVG) */}
          {chartSessions.length > 1 && (
            <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-500" />
                  Evolução Recente de Velocidade (PPM)
                </h3>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400">
                  Últimas {chartSessions.length} sessões
                </span>
              </div>

              <div className="h-44 w-full pt-4 pb-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="cyberWpmGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="currentColor" className="text-slate-100 dark:text-slate-800/80" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="500" y2="60" stroke="currentColor" className="text-slate-100 dark:text-slate-800/80" strokeDasharray="3 3" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" className="text-slate-100 dark:text-slate-800/80" strokeDasharray="3 3" />

                  {/* Area fill */}
                  {(() => {
                    const step = 500 / Math.max(1, chartSessions.length - 1);
                    const points = chartSessions.map((s, idx) => {
                      const x = idx * step;
                      const y = 110 - (s.wpm / maxChartWpm) * 95;
                      return `${x},${y}`;
                    });
                    const areaPath = `M 0,115 L ${points.join(' L ')} L 500,115 Z`;
                    const linePath = `M ${points.join(' L ')}`;

                    return (
                      <>
                        <path d={areaPath} fill="url(#cyberWpmGradient)" />
                        <path d={linePath} fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        {chartSessions.map((s, idx) => {
                          const cx = idx * step;
                          const cy = 110 - (s.wpm / maxChartWpm) * 95;
                          return (
                            <g key={s.id}>
                              <circle cx={cx} cy={cy} r="4.5" className="fill-slate-950 stroke-cyan-400 stroke-2 shadow-md" />
                            </g>
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>
          )}

          {/* History Data Table */}
          <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-4 sm:px-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Registro de Sessões
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Data</th>
                    <th className="py-3 px-4">Nível</th>
                    <th className="py-3 px-4">Velocidade</th>
                    <th className="py-3 px-4">Precisão</th>
                    <th className="py-3 px-4">Erros</th>
                    <th className="py-3 px-4">Tempo</th>
                    <th className="py-3 px-4 sm:px-6">Trecho da Frase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-cyan-950/20 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap tabular-nums">
                        {item.dateFormatted}
                      </td>
                      <td className="py-3.5 px-4 capitalize font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {item.difficulty.replace('_', ' ')}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400 whitespace-nowrap tabular-nums">
                        {item.wpm} <span className="text-[10px] font-normal text-slate-400">PPM</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap tabular-nums">
                        {item.accuracy}%
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600 dark:text-slate-300">
                        {item.totalErrors}
                      </td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {item.timeElapsed}s
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                        {item.phrasePreview}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
