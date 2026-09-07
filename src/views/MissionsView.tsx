import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations';
import { REAL_LIFE_MISSIONS } from '../data/missions';
import {
  Compass,
  CheckCircle2,
  Lock,
  ArrowRight,
  Filter,
  Flame,
  Award,
  BookOpen,
} from 'lucide-react';

export const MissionsView: React.FC = () => {
  const { user, setActiveMissionId, setActiveConversationMode, setActiveView } = useApp();
  const t = getTranslation(user.interfaceLanguage);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = ['all', 'Travel', 'Daily Life', 'Career', 'Social', 'Emergency'];

  const filteredMissions =
    selectedCategory === 'all'
      ? REAL_LIFE_MISSIONS
      : REAL_LIFE_MISSIONS.filter((m) => m.category === selectedCategory);

  const handleStartMission = (missionId: string) => {
    setActiveMissionId(missionId);
    setActiveConversationMode('roleplay');
    setActiveView('conversation');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span>Interactive Roleplay Simulations</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            Real-Life Missions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Immerse yourself in authentic everyday scenarios with your AI character.
          </p>
        </div>

        {/* Completion count */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>
            {user.completedMissions.length} of {REAL_LIFE_MISSIONS.length} Completed
          </span>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`py-2 px-4 rounded-xl text-xs font-semibold transition-colors ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {cat === 'all' ? 'All Missions' : cat}
          </button>
        ))}
      </div>

      {/* Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMissions.map((m) => {
          const isCompleted = user.completedMissions.includes(m.id);
          return (
            <div
              key={m.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                    {m.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    Level {m.level}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                  {m.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {m.scenario}
                </p>

                {/* Target vocabulary pills */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-slate-400">Target Vocabulary:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.targetVocabulary.slice(0, 3).map((v, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {v.word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <Award className="w-4 h-4" />
                  <span>+{m.rewardXp} XP</span>
                </div>

                <button
                  onClick={() => handleStartMission(m.id)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20'
                  }`}
                >
                  <span>{isCompleted ? 'Replay Mission' : 'Start Mission'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
