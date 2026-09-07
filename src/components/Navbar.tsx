import React, { useState } from 'react';
import { useApp, AppView } from '../context/AppContext';
import { getTranslation } from '../translations';
import { INTERFACE_LANGUAGES, SUPPORTED_LEARNING_LANGUAGES, getLanguageInfo } from '../data/languages';
import {
  Flame,
  Zap,
  Crown,
  Moon,
  Sun,
  Globe,
  MessageSquare,
  BookOpen,
  Target,
  User,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    avatar,
    activeView,
    setActiveView,
    isDarkMode,
    toggleDarkMode,
    setIsUpgradeModalOpen,
    setIsAuthModalOpen,
    setInterfaceLanguage,
    setLearningLanguage,
    logout,
  } = useApp();

  const t = getTranslation(user.interfaceLanguage);
  const currentLearningInfo = getLanguageInfo(user.learningLanguage);

  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems: { id: AppView; label: string; icon: any }[] = [
    { id: 'dashboard', label: t.home, icon: BookOpen },
    { id: 'learning-path', label: t.learn, icon: BookOpen },
    { id: 'conversation', label: t.practice, icon: MessageSquare },
    { id: 'my-character', label: t.aiCharacter, icon: Sparkles },
    { id: 'missions', label: t.missions, icon: Target },
    { id: 'progress', label: t.progress, icon: Zap },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-6">
        {/* Logo & Navigation links */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 text-left focus:outline-none group cursor-pointer"
          >
            <span className="text-2xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400">
              LinGoL
            </span>
          </button>

          {/* Desktop Navigation with Artistic Flair border-b indicator */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-500 dark:text-slate-400">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`transition-colors py-1 cursor-pointer ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 font-bold'
                      : 'hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Stats, Language & Controls */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Target language flag selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
              title="Change target language"
            >
              <span>{currentLearningInfo.flag}</span>
              <span className="font-bold text-[11px]">{currentLearningInfo.code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setIsLangMenuOpen(false)}
              >
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Target Language
                </div>
                <div className="grid grid-cols-2 gap-1 mb-2">
                  {SUPPORTED_LEARNING_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLearningLanguage(lang.code)}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-xs text-left ${
                        user.learningLanguage === lang.code
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span className="truncate">{lang.name}</span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-700 pt-2 px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Interface Language
                </div>
                <div className="flex gap-1">
                  {INTERFACE_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setInterfaceLanguage(lang.code)}
                      className={`flex-1 py-1 px-2 text-center rounded-lg text-xs ${
                        user.interfaceLanguage === lang.code
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* If NOT authenticated: show Login & Registration CTA */}
          {!user.isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                Connexion
              </button>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-full shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inscription & Test</span>
              </button>
            </div>
          ) : (
            <>
              {/* If authenticated but level test pending: Show mandatory test pill */}
              {!user.hasCompletedLevelTest ? (
                <button
                  onClick={() => setActiveView('onboarding')}
                  className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-700 dark:text-rose-300 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-800 text-xs font-bold animate-pulse cursor-pointer"
                  title="Test de niveau initial requis"
                >
                  <Target className="w-3.5 h-3.5 text-rose-600" />
                  <span>Test de niveau requis</span>
                </button>
              ) : (
                <>
                  {/* Streak pill from Artistic Flair design */}
                  <div
                    className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-800/80 cursor-pointer"
                    title={`${user.streak} day streak!`}
                  >
                    <span className="text-amber-600">🔥</span>
                    <span className="text-xs sm:text-sm font-bold text-amber-800 dark:text-amber-300">
                      {user.streak}
                    </span>
                  </div>

                  {/* Level pill */}
                  <div className="hidden sm:flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
                    <span className="text-indigo-600 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider text-[10px]">
                      CECR {user.currentLevel}
                    </span>
                  </div>
                </>
              )}

              {/* User profile avatar circle with Artistic Flair border */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-10 h-10 rounded-full bg-slate-200 border-2 border-indigo-100 dark:border-indigo-900 overflow-hidden cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all flex items-center justify-center"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </button>

                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 z-50 animate-in fade-in"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                        <span>Niveau actuel : {user.currentLevel}</span>
                        {user.hasCompletedLevelTest && <span>(Certifié CECR)</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveView('onboarding')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl text-left cursor-pointer"
                    >
                      <Target className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{user.hasCompletedLevelTest ? 'Refaire le test de niveau' : 'Passer le test de niveau'}</span>
                    </button>

                    <button
                      onClick={() => setActiveView('progress')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-left"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{t.profile} & Compétences</span>
                    </button>
                    <button
                      onClick={() => setActiveView('settings')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-left"
                    >
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t.settings}</span>
                    </button>
                    <button
                      onClick={() => setActiveView('admin')}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-xl text-left"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{t.adminDashboard}</span>
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
