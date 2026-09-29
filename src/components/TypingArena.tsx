import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TypingPhrase, TimeLimitOption, DifficultyLevel, SessionResult, CharacterMistake } from '../types';
import { soundManager } from '../utils/sound';
import { calculateWpm, calculateCpm, calculateAccuracy, saveSessionResult } from '../utils/metrics';
import { simplifyText, normalizeTypedInput } from '../utils/textUtils';
import { RotateCcw, ArrowRight, Play, Pause, Clock, Type, Zap, Target, AlertTriangle } from 'lucide-react';

interface TypingArenaProps {
  phrase: TypingPhrase;
  timeLimit: TimeLimitOption;
  difficulty: DifficultyLevel;
  isSimplified: boolean;
  onNextPhrase: () => void;
  onSessionFinish: (result: SessionResult) => void;
}

export const TypingArena: React.FC<TypingArenaProps> = ({
  phrase,
  timeLimit,
  difficulty,
  isSimplified,
  onNextPhrase,
  onSessionFinish,
}) => {
  const [userInput, setUserInput] = useState<string>('');
  const [isTypingStarted, setIsTypingStarted] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0); // in seconds
  const [totalKeypresses, setTotalKeypresses] = useState<number>(0);
  const [mistakes, setMistakes] = useState<CharacterMistake[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Active target text (simplified or standard)
  const isSimplifiedActive = isSimplified || difficulty === 'sem_acentos';
  const targetText = isSimplifiedActive ? simplifyText(phrase.text) : phrase.text;

  // Reset arena state when phrase, difficulty, or simplified mode changes
  const resetArena = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setUserInput('');
    setIsTypingStarted(false);
    setIsPaused(false);
    setTimeElapsed(0);
    setTotalKeypresses(0);
    setMistakes([]);
    setSessionCompleted(false);

    // Auto-focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, []);

  useEffect(() => {
    resetArena();
  }, [phrase, isSimplifiedActive, resetArena]);

  // Finish session helper
  const finalizeSession = useCallback(
    (reason: 'finished' | 'time_up') => {
      if (sessionCompleted) return;
      setSessionCompleted(true);

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      const elapsed = Math.max(1, timeElapsed);
      let correctChars = 0;
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === targetText[i]) {
          correctChars++;
        }
      }

      const finalWpm = calculateWpm(correctChars, elapsed);
      const finalCpm = calculateCpm(correctChars, elapsed);
      const finalAccuracy = calculateAccuracy(correctChars, Math.max(totalKeypresses, userInput.length));

      // Group mistakes by character
      const errorCounts: Record<string, number> = {};
      mistakes.forEach((m) => {
        const key = m.expected === ' ' ? '[espaço]' : m.expected;
        errorCounts[key] = (errorCounts[key] || 0) + 1;
      });

      const mostFrequentErrors = Object.entries(errorCounts)
        .map(([char, count]) => ({ char, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const result: SessionResult = {
        id: `sess-${Date.now()}`,
        timestamp: Date.now(),
        dateFormatted: new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(new Date()),
        wpm: finalWpm,
        cpm: finalCpm,
        accuracy: finalAccuracy,
        totalErrors: mistakes.length,
        timeElapsed: elapsed,
        timeLimit,
        difficulty,
        phrasePreview: targetText.length > 50 ? targetText.slice(0, 50) + '...' : targetText,
        totalCharacters: targetText.length,
        mostFrequentErrors,
        isSimplifiedMode: isSimplifiedActive,
      };

      saveSessionResult(result);

      if (reason === 'finished') {
        soundManager.playSessionComplete();
      } else {
        soundManager.playTimeUp();
      }

      onSessionFinish(result);
    },
    [sessionCompleted, timeElapsed, userInput, targetText, totalKeypresses, mistakes, timeLimit, difficulty, isSimplifiedActive, onSessionFinish]
  );

  // Timer interval handling
  useEffect(() => {
    if (isTypingStarted && !isPaused && !sessionCompleted) {
      timerIntervalRef.current = setInterval(() => {
        setTimeElapsed((prev) => {
          const next = prev + 1;
          if (timeLimit > 0 && next >= timeLimit) {
            finalizeSession('time_up');
            return timeLimit;
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTypingStarted, isPaused, sessionCompleted, timeLimit, finalizeSession]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (sessionCompleted || isPaused) return;

    let value = e.target.value;

    // In simplified mode, normalize input so user is not penalized for capitals or accents
    if (isSimplifiedActive) {
      value = normalizeTypedInput(value);
    }

    // Start timer on first keystroke
    if (!isTypingStarted && value.length > 0) {
      setIsTypingStarted(true);
    }

    // Keystroke sound & error detection
    if (value.length > userInput.length) {
      setTotalKeypresses((prev) => prev + (value.length - userInput.length));
      const newlyAddedCharIndex = value.length - 1;
      const typedChar = value[newlyAddedCharIndex];
      const expectedChar = targetText[newlyAddedCharIndex];

      if (typedChar === expectedChar) {
        soundManager.playKeyClick();
      } else {
        soundManager.playKeyError();
        setMistakes((prev) => [
          ...prev,
          {
            expected: expectedChar || '',
            typed: typedChar,
            index: newlyAddedCharIndex,
          },
        ]);
      }
    } else {
      // Backspace
      soundManager.playKeyClick();
    }

    setUserInput(value);

    // Check if fully typed
    if (value.length >= targetText.length) {
      if (value === targetText) {
        finalizeSession('finished');
      }
    }
  };

  // Keyboard shortcuts (Esc to pause)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isTypingStarted && !sessionCompleted) {
      e.preventDefault();
      setIsPaused((prev) => !prev);
    }
  };

  // Calculate live statistics
  const currentElapsed = Math.max(1, timeElapsed);
  let currentCorrect = 0;
  let currentErrors = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === targetText[i]) {
      currentCorrect++;
    } else {
      currentErrors++;
    }
  }

  const liveWpm = isTypingStarted ? calculateWpm(currentCorrect, currentElapsed) : 0;
  const liveAccuracy = isTypingStarted
    ? calculateAccuracy(currentCorrect, Math.max(totalKeypresses, userInput.length))
    : 100;

  // Remaining time calculation
  const remainingTime = timeLimit > 0 ? Math.max(0, timeLimit - timeElapsed) : timeElapsed;
  const timeProgressPercent = timeLimit > 0 ? Math.min(100, (timeElapsed / timeLimit) * 100) : 0;
  const textProgressPercent = Math.min(100, Math.round((userInput.length / targetText.length) * 100));

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6" onKeyDown={handleKeyDown}>
      {/* Top HUD: Real-time Stats with Neon Aesthetics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Timer Card with Glowing Arc */}
        <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-2xl p-4 flex items-center justify-between shadow-xs transition-all hover:border-cyan-500/40">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-500" />
              {timeLimit > 0 ? 'Tempo Restante' : 'Tempo Decorrido'}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-white mt-1">
              {timeLimit > 0 ? `${remainingTime}s` : `${timeElapsed}s`}
            </div>
            {timeLimit > 0 && (
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Limite: {timeLimit}s
              </span>
            )}
          </div>
          {timeLimit > 0 && (
            <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
              <svg className="w-11 h-11 -rotate-90">
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="3.5"
                  fill="transparent"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  className={`transition-all duration-300 ${
                    remainingTime <= 10
                      ? 'stroke-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]'
                      : 'stroke-cyan-500 dark:stroke-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                  }`}
                  strokeWidth="3.5"
                  strokeDasharray={113}
                  strokeDashoffset={113 - (timeProgressPercent / 100) * 113}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
            </div>
          )}
        </div>

        {/* WPM Card */}
        <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-2xl p-4 flex flex-col justify-between shadow-xs transition-all hover:border-cyan-500/40">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-500" />
            Velocidade
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-cyan-600 dark:text-cyan-400 mt-1">
            {liveWpm} <span className="text-xs font-semibold text-slate-500">PPM</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Palavras por minuto
          </span>
        </div>

        {/* Accuracy Card */}
        <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-2xl p-4 flex flex-col justify-between shadow-xs transition-all hover:border-cyan-500/40">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-emerald-500" />
            Precisão
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
            {liveAccuracy}%
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            {currentCorrect} caracteres certos
          </span>
        </div>

        {/* Errors Card */}
        <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-2xl p-4 flex flex-col justify-between shadow-xs transition-all hover:border-cyan-500/40">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className={`w-3.5 h-3.5 ${mistakes.length > 0 ? 'text-red-500' : 'text-slate-400'}`} />
            Erros
          </span>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono tabular-nums mt-1 ${mistakes.length > 0 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
            {mistakes.length}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            {currentErrors} pendentes de correção
          </span>
        </div>
      </div>

      {/* Main Practice Container with High-End Cyber Slate Aesthetics */}
      <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/70 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 relative overflow-hidden transition-all">
        {/* Subtle accent light line at top of container */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        {/* Unboxed Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">{phrase.category}</span>
            {phrase.author && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="italic text-slate-600 dark:text-slate-300">{phrase.author}</span>
              </>
            )}
            {isSimplifiedActive && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
                  <Type className="w-3.5 h-3.5" /> Sem acentos & pontuação
                </span>
              </>
            )}
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span>{targetText.length} caracteres</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span>{targetText.split(/\s+/).length} palavras</span>
          </div>

          <div className="flex items-center gap-2 font-mono tabular-nums text-xs font-semibold text-cyan-600 dark:text-cyan-400">
            <span>Progresso: {textProgressPercent}%</span>
          </div>
        </div>

        {/* Paused Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-[#070b14]/75 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-30 text-white gap-3 p-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
              <Pause className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold">Sessão Pausada</h3>
            <p className="text-xs text-slate-300">Pressione Esc ou clique no botão abaixo para retomar</p>
            <button
              onClick={() => {
                setIsPaused(false);
                inputRef.current?.focus();
              }}
              className="mt-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              Retomar Prática
            </button>
          </div>
        )}

        {/* Target Phrase Display with Crystal-Clear Space and Character Highlighting */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="font-mono-typing text-xl sm:text-2xl leading-loose tracking-normal select-none min-h-[140px] p-6 sm:p-7 bg-slate-50/80 dark:bg-[#070b14]/70 rounded-2xl border border-slate-200/80 dark:border-cyan-950/70 cursor-text transition-colors whitespace-pre-wrap break-words"
        >
          {targetText.split('').map((char, index) => {
            const isTyped = index < userInput.length;
            const isCurrent = index === userInput.length;
            const isSpace = char === ' ';
            const userChar = isTyped ? userInput[index] : null;
            const isCorrect = isTyped && userChar === char;
            const isError = isTyped && userChar !== char;

            let charClass = 'text-slate-400 dark:text-slate-500'; // pending

            if (isCorrect) {
              charClass = 'text-emerald-600 dark:text-emerald-400 font-semibold';
            } else if (isError) {
              charClass = 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/70 underline decoration-red-500 decoration-2 rounded-xs font-semibold';
            }

            // Dedicated clear space rendering with guaranteed visual width and active guide
            if (isSpace) {
              return (
                <span
                  key={index}
                  className={`relative inline-block w-[0.65em] text-center select-none transition-colors ${
                    isCurrent
                      ? 'border-b-2 border-cyan-500 bg-cyan-500/15 rounded-xs'
                      : isError
                      ? 'bg-red-100 dark:bg-red-950/70 border-b-2 border-red-500 text-red-500 text-xs font-bold'
                      : ''
                  }`}
                  title={isCurrent ? 'Pressione Espaço' : undefined}
                >
                  {isCurrent && (
                    <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-500 dark:bg-cyan-400 cursor-blink -translate-x-0.5" />
                  )}
                  {isError ? '␣' : '\u00A0'}
                </span>
              );
            }

            return (
              <span key={index} className="relative inline-block">
                {isCurrent && (
                  <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-500 dark:bg-cyan-400 cursor-blink -translate-x-0.5" />
                )}
                <span className={charClass}>
                  {char}
                </span>
              </span>
            );
          })}
          {userInput.length === targetText.length && (
            <span className="inline-block w-0.5 h-6 bg-cyan-500 dark:bg-cyan-400 cursor-blink ml-1 align-middle" />
          )}
        </div>

        {/* User Input Area */}
        <div className="flex flex-col gap-2">
          <label htmlFor="typing-input" className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span>Digite o texto acima exatamente como aparece:</span>
              {isSimplifiedActive && (
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                  (sem acento, pontuação ou maiúscula)
                </span>
              )}
            </span>
            {!isTypingStarted && (
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                Digite para iniciar
              </span>
            )}
          </label>
          <div className="relative">
            <textarea
              id="typing-input"
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              disabled={sessionCompleted || isPaused}
              rows={2}
              placeholder={
                isSimplifiedActive
                  ? "Digite em minúsculas e use a barra de espaço entre as palavras..."
                  : "Clique aqui e comece a digitar a frase apresentada..."
              }
              autoFocus
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              className="w-full px-4 py-3.5 bg-white dark:bg-[#070b14] text-slate-900 dark:text-white border-2 border-slate-200 dark:border-cyan-950/80 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 rounded-2xl font-mono-typing text-base sm:text-lg focus:outline-none transition-all resize-none shadow-sm whitespace-pre-wrap"
            />
          </div>
        </div>

        {/* Action Controls & Keyboard Hints */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Reiniciar Button */}
            <button
              onClick={resetArena}
              title="Reiniciar esta frase"
              className="px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-cyan-800/60 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer active:scale-95 shadow-xs"
            >
              <RotateCcw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Reiniciar</span>
            </button>

            {/* Próxima Frase Button */}
            <button
              onClick={onNextPhrase}
              title="Ir para a próxima frase"
              className="px-5 py-2.5 text-xs sm:text-sm font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md shadow-cyan-500/25 active:scale-95"
            >
              <span>Próxima Frase</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Pause / Resume Button */}
            {isTypingStarted && !sessionCompleted && (
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className="px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
              >
                {isPaused ? <Play className="w-4 h-4 text-cyan-400" /> : <Pause className="w-4 h-4" />}
                <span>{isPaused ? 'Continuar' : 'Pausar'}</span>
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
            <span className="hidden sm:inline">Pressione <kbd className="px-1.5 py-0.5 text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-mono text-slate-700 dark:text-slate-300">Esc</kbd> para pausar</span>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span>Espaços são destacados com precisão</span>
          </div>
        </div>
      </div>
    </div>
  );
};
