import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Hand, Sparkles, Monitor, ShieldCheck, Zap } from 'lucide-react';

interface TipsModalProps {
  onBackToPractice: () => void;
}

export const TipsModal: React.FC<TipsModalProps> = ({ onBackToPractice }) => {
  const [activeFinger, setActiveFinger] = useState<string | null>(null);

  // Keyboard layout visual data for ABNT2 / Portuguese reference
  const homeRowKeys = [
    { key: 'A', finger: 'Mínimo Esquerdo', hand: 'left', desc: 'Controla: Q, A, Z e Shift esquerdo' },
    { key: 'S', finger: 'Anelar Esquerdo', hand: 'left', desc: 'Controla: W, S, X' },
    { key: 'D', finger: 'Médio Esquerdo', hand: 'left', desc: 'Controla: E, D, C' },
    { key: 'F', finger: 'Indicador Esquerdo', hand: 'left', desc: 'Ranhura tátil guia! Controla: R, T, F, G, V, B' },
    { key: 'G', finger: 'Indicador Esquerdo', hand: 'left', desc: 'Alcançado com o indicador esquerdo' },
    { key: 'H', finger: 'Indicador Direito', hand: 'right', desc: 'Alcançado com o indicador direito' },
    { key: 'J', finger: 'Indicador Direito', hand: 'right', desc: 'Ranhura tátil guia! Controla: Y, U, H, J, N, M' },
    { key: 'K', finger: 'Médio Direito', hand: 'right', desc: 'Controla: I, K, vírgula (,)' },
    { key: 'L', finger: 'Anelar Direito', hand: 'right', desc: 'Controla: O, L, ponto (.)' },
    { key: 'Ç', finger: 'Mínimo Direito', hand: 'right', desc: 'Controla: P, Ç, acentos e ponto e vírgula (;)' },
  ];

  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in duration-200">
      {/* Header */}
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
            Guia de Digitação e Ergonomia DIGITA+
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Aprenda a técnica correta para digitar com rapidez sem olhar para as teclas e sem fadiga muscular
          </p>
        </div>
      </div>

      {/* Interactive Home Row (Linha Guia) Keyboard Visual */}
      <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Hand className="w-5 h-5 text-cyan-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              A Linha Guia (Home Row)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Seus 8 dedos devem repousar suavemente sobre as teclas de referência quando em espera.
            Use as marcas táteis em relevo nas teclas <strong className="text-cyan-500">F</strong> e <strong className="text-cyan-500">J</strong> para alinhar as mãos às cegas.
          </p>
        </div>

        {/* Visual Key row */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-6 bg-slate-50/80 dark:bg-[#070b14]/80 p-5 rounded-2xl border border-slate-200/80 dark:border-cyan-950/60">
          {homeRowKeys.map((item) => {
            const isHovered = activeFinger === item.key;
            const isGuide = item.key === 'F' || item.key === 'J';
            return (
              <div
                key={item.key}
                onMouseEnter={() => setActiveFinger(item.key)}
                onMouseLeave={() => setActiveFinger(null)}
                className={`relative flex flex-col items-center justify-center w-12 sm:w-14 h-14 sm:h-16 rounded-xl border-2 font-mono font-bold text-base sm:text-lg transition-all duration-150 cursor-pointer shadow-xs ${
                  isGuide
                    ? 'border-cyan-500/80 bg-cyan-50/80 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-300 ring-2 ring-cyan-500/30'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:border-cyan-400'
                } ${isHovered ? 'scale-110 -translate-y-1.5 z-10 shadow-lg ring-2 ring-cyan-400' : ''}`}
              >
                <span>{item.key}</span>
                {isGuide && (
                  <span className="w-3.5 h-1 bg-cyan-500 rounded-full mt-0.5 shadow-sm shadow-cyan-500" />
                )}
                <span className="text-[9px] font-sans font-semibold text-slate-400 uppercase mt-0.5">
                  {item.hand === 'left' ? 'Esq' : 'Dir'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Finger Explanation Box */}
        <div className="bg-cyan-500/10 border border-cyan-400/30 p-4 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-200 min-h-[50px] flex items-center">
          {activeFinger ? (
            <div>
              <span className="font-bold text-cyan-600 dark:text-cyan-400">
                Tecla {activeFinger}:{' '}
              </span>
              <span className="font-semibold">{homeRowKeys.find((k) => k.key === activeFinger)?.finger}</span> —{' '}
              <span className="text-slate-600 dark:text-slate-300">
                {homeRowKeys.find((k) => k.key === activeFinger)?.desc}
              </span>
            </div>
          ) : (
            <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-500" />
              <span>Passe o mouse (ou toque) em qualquer tecla da Linha Guia para inspecionar qual dedo aciona a coluna correspondente.</span>
            </div>
          )}
        </div>
      </div>

      {/* 4 Pillars of Typing Mastery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pillar 1 */}
        <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-2xl p-6 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <h3>1. Precisão antes da Velocidade</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Nunca force a digitação rápida sacrificando a correção. Cada erro força você a parar, pensar e usar o Backspace, reduzindo sua velocidade líquida pela metade. Mantenha 95%+ de precisão e a velocidade surgirá como consequência.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-2xl p-6 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <h3>2. Confie na Memória Muscular</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Resista ao impulso de olhar para o teclado. Mantenha os olhos fixos na frase no monitor. Se errar uma tecla, não procure com os olhos: sinta a distância a partir das teclas guia (F e J) e repita a palavra.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-2xl p-6 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
            <Monitor className="w-4 h-4" />
            <h3>3. Postura e Ergonomia</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Mantenha os cotovelos em ângulo de 90 graus, pulsos retos sem dobrar para cima e pés apoiados no solo. A tela deve estar na altura dos olhos para evitar tensão no trapézio, pescoço e fadiga visual.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="bg-white dark:bg-[#0c1322] border border-slate-200/90 dark:border-cyan-950/60 rounded-2xl p-6 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <h3>4. Ritmo Cadenciado e Espaço</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Digite em cadência suave e constante, como quem toca piano. Use sempre o polegar correspondente à mão que não acabou de digitar a última letra para acionar a barra de espaço com precisão.
          </p>
        </div>
      </div>
    </div>
  );
};
