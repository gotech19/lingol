import React from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations';
import { getLanguageInfo } from '../data/languages';
import { REAL_LIFE_MISSIONS } from '../data/missions';
import {
  Mic,
  Flame,
  Zap,
  Target,
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
  Clock,
  Compass,
  CheckCircle2,
  ChevronRight,
  Crown,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    user,
    avatar,
    setActiveView,
    setActiveMissionId,
    setActiveConversationMode,
    setActiveScenario,
    setIsUpgradeModalOpen,
    addXp,
    showNotification,
  } = useApp();

  const t = getTranslation(user.interfaceLanguage);
  const langInfo = getLanguageInfo(user.learningLanguage);

  const goalProgress = Math.min(100, Math.round((user.dailyMinutesPracticed / user.dailyMinutesGoal) * 100));

  const handleClaimDailyChallenge = () => {
    addXp(50);
    showNotification('Daily Challenge completed! +50 XP added.');
  };

  const handleStartMission = (missionId: string) => {
    setActiveMissionId(missionId);
    setActiveConversationMode('roleplay');
    setActiveView('conversation');
  };

  const handleQuickChat = (scenario: string, mode: any = 'free') => {
    setActiveScenario(scenario);
    setActiveConversationMode(mode);
    setActiveView('conversation');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* WELCOME BANNER & ACTIVE PARTNER HERO */}
      <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-cyan-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/80 dark:border-indigo-800">
              <span>{langInfo.flag}</span>
              <span>Learning {langInfo.name}</span>
              <span className="font-mono text-[10px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded">
                Level {user.currentLevel}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {t.welcomeBack}, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              {t.continueLearning} <span className="font-bold text-slate-800 dark:text-slate-200">{avatar.name}</span>, your personal {avatar.role.toLowerCase()}.
            </p>
          </div>

          {/* Partner & Primary Voice CTA */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Active Character Circular Portrait */}
            <div
              onClick={() => setActiveView('my-character')}
              className="relative cursor-pointer group shrink-0"
              title="Click to view character memories & voice"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src={avatar.avatarUrl}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center text-white text-[9px]">
                ✓
              </div>
            </div>

            {/* Talk with AI Primary CTA button */}
            <button
              onClick={() => setActiveView('conversation')}
              className="flex-1 md:flex-none py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <span>{t.talkWithAI}</span>
            </button>
          </div>
        </div>

        {/* Today's Goal Progress bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="sm:col-span-2 space-y-2">
            <div className="flex justify-between font-medium">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                {t.todaysGoal}: {user.dailyMinutesPracticed} of {user.dailyMinutesGoal} {t.minutes}
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{goalProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${goalProgress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 text-slate-500">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">{user.streak} days</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-blue-500 fill-blue-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200">{user.xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK CONVERSATION TOPICS / SCENARIOS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Pratique Vocale
            </h2>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Modes d'Entraînement
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleQuickChat('Discussion libre et spontanée', 'free')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm text-left transition-all hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">
              Conversation Libre
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Échangez naturellement avec {avatar.name} sans contrainte ni scénario imposé.
            </p>
          </button>

          <button
            onClick={() => {
              const topic = prompt('Entrez votre sujet de conversation :');
              if (topic && topic.trim()) {
                handleQuickChat(topic.trim(), 'free');
              }
            }}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm text-left transition-all hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">
              Sujet Personnalisé
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Définissez vous-même le thème ou la situation que vous souhaitez travailler.
            </p>
          </button>

          <button
            onClick={() => setActiveView('missions')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm text-left transition-all hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">
              Missions Réelles
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Mises en situation pratiques avec objectifs évalués en temps réel.
            </p>
          </button>

          <button
            onClick={() => setActiveView('pronunciation-coach')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm text-left transition-all hover:-translate-y-0.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">
              Coach Phonétique
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Entraînez votre accent et perfectionnez le placement de votre voix.
            </p>
          </button>
        </div>
      </section>

      {/* TWO COLUMNS: SKILLS OVERVIEW & MISSIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Language Skills Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {t.skillsOverview}
                </h3>
                <p className="text-xs text-slate-500">Based on your conversations and assessments</p>
              </div>
              <button
                onClick={() => setActiveView('progress')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Detailed Analytics
              </button>
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">{t.speaking}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{user.speakingScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${user.speakingScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">{t.listening}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">{user.listeningScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${user.listeningScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">{t.grammar}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{user.grammarScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${user.grammarScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700 dark:text-slate-300">{t.pronunciation}</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">{user.pronunciationScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${user.pronunciationScore}%` }} />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveView('pronunciation-coach')}
                className="py-2 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Practice Pronunciation</span>
              </button>
            </div>
          </div>

          {/* Dynamic Learning Roadmap Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-slate-900 text-white shadow-sm space-y-2 relative overflow-hidden">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                <span>Niveau Calibré</span>
              </span>
              <div className="text-xl font-bold">Palier {user.currentLevel}</div>
              <p className="text-xs text-slate-300">
                Objectif cible fixé à <span className="text-white font-bold">{user.targetLevel}</span>. Votre avatar adapte son vocabulaire et sa syntaxe à votre profil.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-indigo-950 text-white shadow-sm space-y-2 relative overflow-hidden">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Progression Vocale</span>
              </span>
              <div className="text-xl font-bold">
                {user.dailyMinutesPracticed > 0
                  ? `${user.dailyMinutesPracticed} min pratiquées`
                  : 'Prêt à démarrer'}
              </div>
              <p className="text-xs text-indigo-200">
                {user.dailyMinutesPracticed > 0
                  ? `Objectif quotidien : ${user.dailyMinutesGoal} min`
                  : "Lancez votre premier échange vocal pour débloquer l'analyse en direct."}
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Daily Challenge & Recommended Missions */}
        <div className="space-y-6">
          {/* Daily Challenge Card */}
          <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200 dark:border-amber-800/60 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>{t.dailyChallenge}</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">+50 XP</span>
            </div>

            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {t.dailyChallengeDesc}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete your daily conversation with {avatar.name} to extend your streak.
            </p>

            <button
              onClick={handleClaimDailyChallenge}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>{t.claimXp}</span>
            </button>
          </div>

          {/* Active Missions Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Real-Life Missions
              </h3>
              <button
                onClick={() => setActiveView('missions')}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-3">
              {REAL_LIFE_MISSIONS.slice(0, 3).map((mission) => {
                const isCompleted = user.completedMissions.includes(mission.id);
                return (
                  <div
                    key={mission.id}
                    onClick={() => handleStartMission(mission.id)}
                    className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">
                          {mission.title.split('—')[1] || mission.title}
                        </span>
                        {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                      </div>
                      <div className="text-[11px] text-slate-400">{mission.category} • Level {mission.level}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      +{mission.rewardXp} XP
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
