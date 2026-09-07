import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations';
import {
  TrendingUp,
  Award,
  Flame,
  Zap,
  BookMarked,
  CheckCircle2,
  Calendar,
  Volume2,
} from 'lucide-react';
import { voiceService } from '../services/voiceService';

export const ProgressView: React.FC = () => {
  const { user } = useApp();
  const t = getTranslation(user.interfaceLanguage);

  const cefrStages = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const currentIdx = cefrStages.indexOf(user.currentLevel);

  // Vocabulary words learned bank - empty by default when blank
  const learnedWords: { word: string; translation: string; mastered: boolean }[] = [];

  const handlePronounce = (word: string) => {
    voiceService.speak(word, user.learningLanguage, 1.0, 0.9);
  };

  const totalSessions = user.completedLessons.length + user.completedMissions.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
          <span>CEFR Progress & Analytics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
          Your Progress & Fluency
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Detailed metrics tracked across speaking speed, phonetic clarity, vocabulary retention, and mission completion.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-400">Current Level</div>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {user.currentLevel}
          </div>
          <div className="text-[11px] text-slate-500">CEFR Standard</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-400">Active Streak</div>
          <div className="text-2xl font-extrabold text-amber-500 flex items-center gap-1">
            <span>{user.streak}</span>
            <span className="text-base font-normal text-slate-400">days</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {user.streak > 0 ? `Record: ${user.streak} days` : 'No streak yet'}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-400">Total Experience</div>
          <div className="text-2xl font-extrabold text-blue-600 flex items-center gap-1">
            <span>{user.xp}</span>
            <span className="text-base font-normal text-slate-400">XP</span>
          </div>
          <div className="text-[11px] text-slate-500">
            {user.xp >= 500 ? 'Scholar' : user.xp > 0 ? 'Learner' : 'Beginner'}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-400">Conversations</div>
          <div className="text-2xl font-extrabold text-emerald-600">{totalSessions}</div>
          <div className="text-[11px] text-slate-500">Total {user.dailyMinutesPracticed} minutes</div>
        </div>
      </div>

      {/* CEFR Level Progression Track */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            CEFR Fluency Roadmap
          </h3>
          <p className="text-xs text-slate-500">
            From Beginner (A1) to Mastery (C2). You are currently progressing through {user.currentLevel}.
          </p>
        </div>

        <div className="relative">
          {/* Track Bar */}
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full w-full absolute top-1/2 -translate-y-1/2 -z-0" />
          <div
            className="h-2 bg-indigo-600 rounded-full absolute top-1/2 -translate-y-1/2 -z-0 transition-all duration-500"
            style={{ width: `${((currentIdx + 0.5) / cefrStages.length) * 100}%` }}
          />

          <div className="flex justify-between relative z-10">
            {cefrStages.map((lvl, i) => {
              const isPassed = i < currentIdx;
              const isCurrent = i === currentIdx;
              return (
                <div key={lvl} className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 dark:ring-indigo-900/60 scale-110 shadow-lg'
                        : isPassed
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    {lvl}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 font-medium">
                    {isCurrent ? 'Current' : isPassed ? 'Mastered' : 'Locked'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Grid: Skill Radar & Vocabulary Notebook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Skill Scores breakdown */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Skill Breakdown
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Speaking Fluency</span>
                <span className="text-indigo-600 font-bold">{user.speakingScore}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${user.speakingScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Listening Comprehension</span>
                <span className="text-blue-600 font-bold">{user.listeningScore}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${user.listeningScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Grammar Accuracy</span>
                <span className="text-emerald-600 font-bold">{user.grammarScore}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${user.grammarScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Vocabulary Range</span>
                <span className="text-amber-600 font-bold">{user.vocabularyScore}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${user.vocabularyScore}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Pronunciation & Accent</span>
                <span className="text-rose-600 font-bold">{user.pronunciationScore}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: `${user.pronunciationScore}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Saved Vocabulary Notebook */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-indigo-500" />
              <span>Vocabulary Bank</span>
            </h3>
            <span className="text-xs text-slate-400">Words encountered in talks</span>
          </div>

          {learnedWords.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <BookMarked className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Carnet de vocabulaire vierge
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Les nouveaux mots et tournures révisés lors de vos conversations et missions apparaîtront ici.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {learnedWords.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {item.word}
                    </div>
                    <div className="text-[11px] text-slate-500">{item.translation}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePronounce(item.word)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Pronounce"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    {item.mastered ? (
                      <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        Mastered
                      </span>
                    ) : (
                      <span className="text-[10px] bg-amber-50 dark:bg-amber-950/60 text-amber-600 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full font-bold">
                        Learning
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
