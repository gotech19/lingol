import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations';
import { BookOpen, Compass, MessageSquare, Target, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { user, activeView, setActiveView } = useApp();
  const t = getTranslation(user.interfaceLanguage);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2">
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* Home */}
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeView === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>{t.home}</span>
        </button>

        {/* Learn */}
        <button
          onClick={() => setActiveView('learning-path')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeView === 'learning-path' || activeView === 'lesson'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>{t.learn}</span>
        </button>

        {/* Center Primary Action: Voice Conversation FAB */}
        <div className="relative -top-5">
          <button
            onClick={() => setActiveView('conversation')}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
              activeView === 'conversation'
                ? 'bg-gradient-to-tr from-indigo-600 to-cyan-500 ring-4 ring-indigo-500/30'
                : 'bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 shadow-indigo-500/40 hover:scale-105'
            }`}
            aria-label="Start AI Voice Conversation"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-[9px] font-bold tracking-tight">TALK</span>
          </button>
        </div>

        {/* Missions */}
        <button
          onClick={() => setActiveView('missions')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeView === 'missions' || activeView === 'mission-detail'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Target className="w-5 h-5" />
          <span>{t.missions}</span>
        </button>

        {/* Profile / Character */}
        <button
          onClick={() => setActiveView('my-character')}
          className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            activeView === 'my-character' || activeView === 'progress'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span>{t.aiCharacter}</span>
        </button>
      </div>
    </nav>
  );
};
