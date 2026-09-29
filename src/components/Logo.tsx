import React, { useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);
  const logoSrc = '/src/assets/images/digita_plus_logo_1790723285908.jpg';

  // Sizing mappings
  const imageSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''} ${className}`}
    >
      {/* Logo Graphic container with neon glow */}
      <div className="relative group shrink-0">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur-xs opacity-60 group-hover:opacity-100 transition duration-300" />
        <div className={`relative ${imageSizes[size]} overflow-hidden border border-cyan-400/40 bg-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/20`}>
          {!imageError ? (
            <img
              src={logoSrc}
              alt="Logo DIGITA+"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            // High fidelity SVG fallback matching the aerodynamic D with glowing keys
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full p-1"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="cyberD" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00E5FF" />
                  <stop offset="0.5" stopColor="#0077FE" />
                  <stop offset="1" stopColor="#003B94" />
                </linearGradient>
              </defs>
              <path
                d="M20 22C20 18.6863 22.6863 16 26 16H60C74.3594 16 86 27.6406 86 42C86 56.3594 74.3594 68 60 68H38L20 84V22Z"
                fill="url(#cyberD)"
              />
              {/* Keyboard keys */}
              <rect x="42" y="30" width="8" height="6" rx="2" fill="#E0F7FF" />
              <rect x="54" y="30" width="8" height="6" rx="2" fill="#E0F7FF" />
              <rect x="66" y="30" width="8" height="6" rx="2" fill="#E0F7FF" />
              <rect x="38" y="40" width="10" height="6" rx="2" fill="#E0F7FF" />
              <rect x="52" y="40" width="14" height="6" rx="2" fill="#E0F7FF" />
            </svg>
          )}
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center tracking-tight leading-none font-extrabold">
          <span
            className={`${textSizes[size]} font-black tracking-wider uppercase text-slate-900 dark:text-white transition-colors`}
            style={{ fontFamily: "'Rajdhani', 'Plus Jakarta Sans', sans-serif" }}
          >
            DIGITA
          </span>
          <span
            className={`${textSizes[size]} font-black text-cyan-500 dark:text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.6)] ml-0.5`}
            style={{ fontFamily: "'Rajdhani', 'Plus Jakarta Sans', sans-serif" }}
          >
            +
          </span>
        </div>

        {showTagline && (
          <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold tracking-[0.22em] text-cyan-600 dark:text-cyan-400/90 uppercase mt-0.5 whitespace-nowrap">
            <span>DIGITE</span>
            <span className="text-[8px] text-cyan-500">▸</span>
            <span>EVOLUA</span>
            <span className="text-[8px] text-cyan-500">▸</span>
            <span>VÁ MAIS LONGE</span>
          </div>
        )}
      </div>
    </div>
  );
};
