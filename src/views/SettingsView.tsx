import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations';
import {
  SUPPORTED_LEARNING_LANGUAGES,
  INTERFACE_LANGUAGES,
} from '../data/languages';
import {
  Settings,
  Globe,
  Mic,
  Moon,
  Sun,
  Shield,
  RotateCcw,
  Save,
  Check,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    user,
    updateUser,
    setInterfaceLanguage,
    setLearningLanguage,
    isDarkMode,
    toggleDarkMode,
    showNotification,
  } = useApp();

  const t = getTranslation(user.interfaceLanguage);

  const [dailyGoal, setDailyGoal] = useState(user.dailyMinutesGoal);
  const [micGain, setMicGain] = useState(80);

  const handleSave = () => {
    updateUser({ dailyMinutesGoal: dailyGoal });
    showNotification('Settings updated successfully!');
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset your conversation history and level test?')) {
      updateUser({
        currentLevel: 'A1',
        streak: 1,
        xp: 0,
        speakingScore: 60,
        listeningScore: 65,
        grammarScore: 60,
        vocabularyScore: 65,
        pronunciationScore: 60,
        completedMissions: [],
        completedLessons: [],
        memories: [],
      });
      showNotification('Progress reset to initial A1 state.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-20">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
          <Settings className="w-3.5 h-3.5 text-indigo-500" />
          <span>Preferences & Configuration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
          Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your interface language, audio microphone settings, study goals, and account security.
        </p>
      </div>

      <div className="space-y-6">
        {/* Interface & Target Language */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <span>Languages</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Interface Language
              </label>
              <div className="grid grid-cols-3 gap-2">
                {INTERFACE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setInterfaceLanguage(lang.code)}
                    className={`p-3 rounded-2xl border text-center text-xs font-semibold transition-all ${
                      user.interfaceLanguage === lang.code
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-lg">{lang.flag}</div>
                    <div className="text-[11px] mt-1">{lang.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Learning Language
              </label>
              <select
                value={user.learningLanguage}
                onChange={(e) => setLearningLanguage(e.target.value as any)}
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {SUPPORTED_LEARNING_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Study Goal & Theme */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Mic className="w-4 h-4 text-indigo-500" />
            <span>Voice & Practice Habit</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Daily Practice Goal</span>
                <span className="font-mono text-indigo-600">{dailyGoal} minutes / day</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>5m</span>
                <span>15m</span>
                <span>30m</span>
                <span>60m</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Mode d'affichage (Blanc ou Nuit)
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (isDarkMode) toggleDarkMode();
                  }}
                  className={`flex-1 py-3 px-4 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    !isDarkMode
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-sm font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Mode Blanc</span>
                </button>
                <button
                  onClick={() => {
                    if (!isDarkMode) toggleDarkMode();
                  }}
                  className={`flex-1 py-3 px-4 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isDarkMode
                      ? 'border-indigo-500 bg-indigo-950/60 text-indigo-300 shadow-sm font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Moon className="w-4 h-4 text-indigo-400" />
                  <span>Mode Nuit (Mat)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSave}
              className="py-2.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-6 space-y-3">
          <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            <span>Reset Learning Progress</span>
          </h3>
          <p className="text-xs text-rose-600/80 dark:text-rose-400/80">
            Resets your level assessment, character memories, completed missions, and streaks. This cannot be undone.
          </p>
          <button
            onClick={handleResetProgress}
            className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
          >
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
};
