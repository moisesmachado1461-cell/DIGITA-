import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Keyboard, BarChart3, HelpCircle, FileText } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  activeTab: 'practice' | 'history' | 'tips' | 'custom';
  setActiveTab: (tab: 'practice' | 'history' | 'tips' | 'custom') => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isSoundEnabled,
  onToggleSound,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const navItems = [
    { id: 'practice', label: 'Praticar', icon: Keyboard },
    { id: 'history', label: 'Histórico', icon: BarChart3 },
    { id: 'tips', label: 'Dicas & Postura', icon: HelpCircle },
    { id: 'custom', label: 'Meus Textos', icon: FileText },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-cyan-950/40 bg-white/90 dark:bg-[#070b14]/90 backdrop-blur-md transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: DIGITA+ Brand Logo & Slogan */}
        <Logo
          size="md"
          showTagline={true}
          onClick={() => setActiveTab('practice')}
        />

        {/* Zone 2: Navigation Links with Clear Visual States */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 shadow-xs border border-cyan-200/60 dark:border-cyan-800/50'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Interactive controls with distinct hover and active states */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={isSoundEnabled ? 'Silenciar som mecânico' : 'Ativar som de teclado mecânico'}
            className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
              isSoundEnabled
                ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-800/70 text-cyan-600 dark:text-cyan-400 hover:scale-105 active:scale-95 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            aria-label="Controle de Som"
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-300 dark:hover:border-cyan-800/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-xs"
            aria-label="Alternar Tema"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>
      </div>
    </header>
  );
};
