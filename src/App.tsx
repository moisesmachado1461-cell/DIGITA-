/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { DifficultyLevel, TimeLimitOption, TypingPhrase, SessionResult } from './types';
import { getRandomPhrase } from './data/phrases';
import { loadSessionHistory, loadCustomPhrases } from './utils/metrics';
import { soundManager } from './utils/sound';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ModeSelector } from './components/ModeSelector';
import { TypingArena } from './components/TypingArena';
import { ResultsModal } from './components/ResultsModal';
import { HistoryView } from './components/HistoryView';
import { TipsModal } from './components/TipsModal';
import { CustomPhraseModal } from './components/CustomPhraseModal';
import { Logo } from './components/Logo';
import { Keyboard, BookOpen, BarChart3, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'practice' | 'history' | 'tips' | 'custom'>('practice');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediario');
  const [timeLimit, setTimeLimit] = useState<TimeLimitOption>(60); // 60s default as suggested
  const [isSimplified, setIsSimplified] = useState<boolean>(false);
  const [currentPhrase, setCurrentPhrase] = useState<TypingPhrase>(() =>
    getRandomPhrase('intermediario')
  );
  const [history, setHistory] = useState<SessionResult[]>(() => loadSessionHistory());
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);

  // Sound and Dark mode states
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('digita_dark_mode');
      if (saved !== null) return saved === 'true';
      return true; // Default to dark mode for optimal cyber aesthetics
    }
    return true;
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('digita_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  // Init sound
  useEffect(() => {
    soundManager.init();
    setIsSoundEnabled(soundManager.isEnabled);
  }, []);

  const handleToggleSound = () => {
    const nextState = soundManager.toggle();
    setIsSoundEnabled(nextState);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Change difficulty
  const handleChangeDifficulty = (newDiff: DifficultyLevel) => {
    setDifficulty(newDiff);
    const customList = newDiff === 'livre' ? loadCustomPhrases() : [];
    const forceSimp = newDiff === 'sem_acentos' || isSimplified;
    if (newDiff === 'sem_acentos') {
      setIsSimplified(true);
    }
    const newPhrase = getRandomPhrase(newDiff, customList, undefined, forceSimp);
    setCurrentPhrase(newPhrase);
  };

  // Toggle simplified mode (no accents, no capitals, no punctuation)
  const handleToggleSimplified = () => {
    setIsSimplified((prev) => !prev);
  };

  // Next phrase handler
  const handleNextPhrase = useCallback(() => {
    const customList = difficulty === 'livre' ? loadCustomPhrases() : [];
    const forceSimp = difficulty === 'sem_acentos' || isSimplified;
    const next = getRandomPhrase(difficulty, customList, currentPhrase.id, forceSimp);
    setCurrentPhrase(next);
  }, [difficulty, currentPhrase.id, isSimplified]);

  // Session completion handler
  const handleSessionFinish = (result: SessionResult) => {
    setLastResult(result);
    setHistory((prev) => [result, ...prev]);
  };

  const handleRetrySamePhrase = () => {
    setLastResult(null);
  };

  const handleNextFromResults = () => {
    setLastResult(null);
    handleNextPhrase();
  };

  // Aggregate stats
  const bestWpm = history.reduce((max, s) => Math.max(max, s.wpm), 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070b14] text-slate-800 dark:text-slate-100 transition-colors">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
        {activeTab === 'practice' && (
          <div className="flex flex-col gap-6">
            {/* Hero / Welcome Banner */}
            <HeroBanner
              difficulty={difficulty}
              bestWpm={bestWpm}
              totalSessions={history.length}
              onExploreTips={() => setActiveTab('tips')}
            />

            {/* Mode & Time Segmented Selectors with Quick Simplified Mode Toggle */}
            <ModeSelector
              difficulty={difficulty}
              setDifficulty={handleChangeDifficulty}
              timeLimit={timeLimit}
              setTimeLimit={setTimeLimit}
              isSimplified={isSimplified}
              onToggleSimplified={handleToggleSimplified}
              disabled={false}
            />

            {/* Interactive Typing Arena with Space Highlighting */}
            <TypingArena
              key={`${currentPhrase.id}-${timeLimit}-${isSimplified}-${difficulty}`}
              phrase={currentPhrase}
              timeLimit={timeLimit}
              difficulty={difficulty}
              isSimplified={isSimplified}
              onNextPhrase={handleNextPhrase}
              onSessionFinish={handleSessionFinish}
            />

            {/* Educational Info Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
              <div
                onClick={() => setActiveTab('tips')}
                className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-xs hover:border-cyan-400/50 hover:shadow-md hover:shadow-cyan-500/5 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Postura & Linha Guia
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Posição correta dos dedos na linha A-S-D-F / J-K-L-Ç
                  </p>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('history')}
                className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-xs hover:border-cyan-400/50 hover:shadow-md hover:shadow-cyan-500/5 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Histórico & Recordes
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {history.length > 0
                      ? `${history.length} sessões · Média de ${Math.round(history.reduce((a, b) => a + b.wpm, 0) / history.length)} PPM`
                      : 'Acompanhe sua evolução sessão a sessão'}
                  </p>
                </div>
              </div>

              <div
                onClick={() => setActiveTab('custom')}
                className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-xs hover:border-cyan-400/50 hover:shadow-md hover:shadow-cyan-500/5 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    Modo Livre & Textos Próprios
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Insira redações ou artigos acadêmicos para treinar
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onRefreshHistory={() => setHistory(loadSessionHistory())}
            onBackToPractice={() => setActiveTab('practice')}
          />
        )}

        {activeTab === 'tips' && (
          <TipsModal onBackToPractice={() => setActiveTab('practice')} />
        )}

        {activeTab === 'custom' && (
          <CustomPhraseModal
            onSelectPhrase={(phrase) => {
              setDifficulty('livre');
              setCurrentPhrase(phrase);
            }}
            onBackToPractice={() => setActiveTab('practice')}
          />
        )}
      </main>

      {/* Results Diagnostic Modal */}
      {lastResult && (
        <ResultsModal
          result={lastResult}
          onRetry={handleRetrySamePhrase}
          onNext={handleNextFromResults}
          onViewHistory={() => {
            setLastResult(null);
            setActiveTab('history');
          }}
          onClose={() => setLastResult(null)}
        />
      )}

      {/* Redesigned Footer */}
      <footer className="border-t border-slate-200/80 dark:border-cyan-950/50 py-8 text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-[#070b14]/50 backdrop-blur-sm mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" showTagline={true} />

          <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Privacidade total: dados no seu navegador</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span>Atalho: <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px] border border-slate-300 dark:border-slate-700">Esc</kbd> para pausar</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
