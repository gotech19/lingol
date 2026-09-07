import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations';
import { CURRICULUM_UNITS, LESSONS_DATABASE } from '../data/lessons';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Flame,
  Award,
} from 'lucide-react';

export const LearningPathView: React.FC = () => {
  const { user, setActiveLessonId, setActiveView } = useApp();
  const t = getTranslation(user.interfaceLanguage);

  const handleStartLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setActiveView('lesson');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-20">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span>CEFR Structured Roadmap</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
          Your Learning Path
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Structured step-by-step curriculum calibrated to your level {user.currentLevel}.
        </p>
      </div>

      {/* Curriculum Units */}
      <div className="space-y-6">
        {CURRICULUM_UNITS.map((unit) => (
          <div
            key={unit.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Level {unit.level}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {unit.title}
                </h3>
                <p className="text-xs text-slate-500">{unit.description}</p>
              </div>
            </div>

            {/* Lessons in this unit */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {unit.lessonIds.map((lessonId) => {
                const lesson = LESSONS_DATABASE.find((l) => l.id === lessonId);
                if (!lesson) return null;
                const isCompleted = user.completedLessons.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleStartLesson(lesson.id)}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/40 text-left transition-all hover:-translate-y-0.5 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          {lesson.category}
                        </span>
                        {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                        {lesson.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {lesson.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{lesson.estimatedMinutes} min</span>
                      <span className="font-bold text-indigo-600">+{lesson.xpReward} XP</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
