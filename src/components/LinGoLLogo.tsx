import React from 'react';

interface LinGoLLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const LinGoLLogo: React.FC<LinGoLLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', dot: 'w-1.5 h-1.5' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', dot: 'w-2 h-2' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', dot: 'w-2.5 h-2.5' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Matte Dark Logo Icon */}
      <div
        className={`${currentSize.icon} rounded-xl bg-gradient-to-br from-[#1c2333] via-[#121824] to-[#0a0e17] border border-slate-700/60 shadow-md shadow-black/40 flex items-center justify-center p-1.5 shrink-0 transition-transform group-hover:scale-105 relative overflow-hidden`}
      >
        {/* Subtle matte inner edge highlight */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-transparent to-white/[0.04] pointer-events-none" />

        {/* Vector representation of matte dark speech bubble with voice sound waves */}
        <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Speech bubble */}
          <path
            d="M10 12 C10 8.686 12.686 6 16 6 L32 6 C35.314 6 38 8.686 38 12 L38 28 C38 31.314 35.314 34 32 34 L22 34 L14 41 L15.5 34 L16 34 C12.686 34 10 31.314 10 28 Z"
            fill="#1e2738"
            stroke="#3b4866"
            strokeWidth="1.5"
          />
          {/* Speech waves in vibrant matte accents */}
          <rect x="17" y="18" width="2.8" height="6.5" rx="1.4" fill="#6366f1" />
          <rect x="22.5" y="14" width="2.8" height="14" rx="1.4" fill="#818cf8" />
          <rect x="28" y="16" width="2.8" height="10" rx="1.4" fill="#38bdf8" />
          <rect x="33.5" y="19" width="2.8" height="5" rx="1.4" fill="#94a3b8" />
          {/* AI Sparkle Dot */}
          <circle cx="38" cy="8" r="2.8" fill="#38bdf8" stroke="#0a0e17" strokeWidth="1" />
        </svg>
      </div>

      {showText && (
        <div className="flex items-baseline tracking-tighter font-black">
          <span className="text-slate-900 dark:text-white transition-colors">
            Lin<span className="text-indigo-500 dark:text-indigo-400">Go</span>L
          </span>
          <span className="ml-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            Learner
          </span>
        </div>
      )}
    </div>
  );
};
