import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations';
import { AVATARS_CATALOG } from '../data/avatars';
import { SUPPORTED_LEARNING_LANGUAGES } from '../data/languages';
import { authService } from '../services/firebaseConfig';
import { LearningLanguage } from '../types';
import {
  Sparkles,
  Mic,
  Volume2,
  Brain,
  Target,
  ArrowRight,
  CheckCircle,
  Play,
  Shield,
  Star,
  Flame,
  Award,
  Lock,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Zap,
  BookOpen,
  Headphones,
  CheckCircle2,
} from 'lucide-react';

export const LandingView: React.FC = () => {
  const { user, updateUser, setActiveView, setSelectedAvatar, setIsAuthModalOpen, showNotification } = useApp();
  const t = getTranslation(user.interfaceLanguage);

  const [selectedLang, setSelectedLang] = useState<LearningLanguage>(user.learningLanguage || 'en');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);
  const [copiedHostname, setCopiedHostname] = useState(false);
  const avatarCarouselRef = useRef<HTMLDivElement>(null);

  const scrollAvatars = (direction: 'left' | 'right') => {
    if (avatarCarouselRef.current) {
      const scrollAmount = 320;
      avatarCarouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleStartFreeTrialTest = () => {
    updateUser({ learningLanguage: selectedLang });
    setActiveView('onboarding');
  };

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  const handleCopyHostname = () => {
    if (typeof navigator !== 'undefined' && currentHostname) {
      navigator.clipboard.writeText(currentHostname);
      setCopiedHostname(true);
      setTimeout(() => setCopiedHostname(false), 3000);
    }
  };

  const handleGoogleQuickAuth = async () => {
    setIsGoogleLoading(true);
    setGoogleAuthError(null);
    try {
      const userProfile = await authService.loginWithGoogle(selectedLang);
      updateUser({ ...userProfile, learningLanguage: selectedLang });
      if (!userProfile.hasCompletedLevelTest) {
        showNotification(`Authentification Google réussie ! Démarrage du test de niveau obligatoire.`);
        setActiveView('onboarding');
      } else {
        showNotification(`Bienvenue ${userProfile.name} !`);
        setActiveView('dashboard');
      }
    } catch (err: any) {
      console.error('Google Auth error:', err);
      setGoogleAuthError(err.message || 'La connexion avec Google n’a pas pu aboutir.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/20 via-blue-500/20 to-cyan-400/20 blur-3xl -z-10 pointer-events-none rounded-full" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Bienvenue sur LinGoL Learner — Apprentissage Vocal Par l'IA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-[1.15]">
            Maîtrisez une langue en{' '}
            <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              échangeant avec votre tuteur IA
            </span>
            .
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
            Échangez avec des personnages intelligents, entraînez votre prononciation acoustique et évaluez votre niveau CECR dès le démarrage grâce au moteur IA Gemini.
          </p>

          {/* MANDATORY REGISTRATION & STARTUP LEVEL TEST CARD */}
          {!user.isAuthenticated ? (
            <div className="pt-2 max-w-xl mx-auto">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 dark:border-indigo-500/40 shadow-xl shadow-indigo-500/10 space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        Test de niveau au démarrage (Obligatoire)
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Évaluation CECR immédiate après inscription ou compte Google
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                    CECR A1–C2
                  </span>
                </div>

                {/* Step A: Pick language */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    1. Choisissez la langue que vous souhaitez apprendre :
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-1.5">
                    {SUPPORTED_LEARNING_LANGUAGES.slice(0, 4).map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setSelectedLang(lang.code)}
                        className={`py-2 px-2 rounded-xl text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                          selectedLang === lang.code
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-bold shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span className="truncate">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step B: 1-Click Google or Email Registration */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleGoogleQuickAuth}
                    disabled={isGoogleLoading}
                    className="w-full py-3.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
                  >
                    {isGoogleLoading ? (
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>Authentification Google & Démarrer le test</span>
                      </>
                    )}
                  </button>

                  {/* Google Auth error recovery banner */}
                  {googleAuthError && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-700 dark:text-rose-300 space-y-2 text-left">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                        <div className="leading-relaxed">{googleAuthError}</div>
                      </div>

                      {/* Domain authorization helper */}
                      {googleAuthError.includes('domaine') && currentHostname && (
                        <div className="pt-1 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleCopyHostname}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/60 hover:bg-rose-200 dark:hover:bg-rose-900 text-[11px] font-bold text-rose-800 dark:text-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            {copiedHostname ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Domaine copié !</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copier "{currentHostname}"</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Popup unblock helper */}
                      {googleAuthError.includes('popup') && (
                        <div className="pt-1">
                          <a
                            href={typeof window !== 'undefined' ? window.location.href : '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:underline text-[11px] font-bold"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Ouvrir dans un nouvel onglet</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <button
                      onClick={handleStartFreeTrialTest}
                      className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      title="Faites un test de niveau immédiat sans inscription"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Faire un essai gratuit (Test immédiat)</span>
                    </button>
                    <button
                      onClick={() => {
                        updateUser({ learningLanguage: selectedLang });
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Inscription & Test</span>
                    </button>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full sm:w-auto py-3 px-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
                    >
                      Se connecter
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 gap-2">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Évaluation Orale & Vocale CECR
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Essai visiteur libre sans CB
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Moteur IA Gemini intégré
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* If already authenticated */
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              {!user.hasCompletedLevelTest ? (
                <button
                  onClick={() => setActiveView('onboarding')}
                  className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-base shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Award className="w-5 h-5" />
                  <span>Passer le test de niveau obligatoire</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-base shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span>Accéder à mon tableau de bord</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveView('onboarding')}
                    className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Target className="w-4 h-4 text-indigo-500" />
                    <span>Refaire le test de niveau (Niveau actuel : {user.currentLevel})</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* HERO INTERACTIVE SHOWCASE PREVIEW */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl p-4 sm:p-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={AVATARS_CATALOG[0].avatarUrl}
                  alt="Emma"
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Emma</h4>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                  Friendly Conversation Companion • Speaking English
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center gap-1">
                <Mic className="w-3 h-3 animate-pulse" /> Live Voice Active
              </span>
            </div>
          </div>

          {/* Dialogue exchange snippet */}
          <div className="py-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                AI
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-3.5 rounded-2xl rounded-tl-none max-w-lg text-sm text-slate-800 dark:text-slate-200">
                <p>
                  "Good morning! What are you planning to do this weekend? Any exciting travels or relaxing at home?"
                </p>
                <div className="mt-2 text-[11px] text-slate-400 italic">
                  🇫🇷 "Bonjour ! Que prévoyez-vous ce week-end ?"
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 justify-end">
              <div className="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-none max-w-lg text-sm shadow-md shadow-indigo-600/20">
                <p>"I am going to visit a museum with my friend, and then we will have coffee."</p>
                <div className="mt-2 pt-2 border-t border-indigo-500/40 flex items-center justify-between text-[11px] text-indigo-100">
                  <span>Pronunciation: 92/100</span>
                  <span className="bg-indigo-700/60 px-2 py-0.5 rounded font-mono">Fluency: High</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                You
              </div>
            </div>

            {/* Smart Correction Callout */}
            <div className="mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Coach Tip:</span> Try saying{' '}
                <span className="underline font-semibold">"grab a coffee"</span> for a more natural, idiomatic touch!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BUT DE LA PLATEFORME, OUTILS & AVANTAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> But & Écosystème LinGoL
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Pourquoi LinGoL Learner transforme votre apprentissage
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Le but de cette plateforme est de briser le blocage de l'oral en offrant une immersion conversationnelle quotidienne avec des tuteurs d'IA intelligents, une correction phonétique en temps réel et un suivi rigoureux de votre niveau CECR.
          </p>
        </div>

        {/* 3 Colonnes : But, Outils, Avantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Le But */}
          <div className="p-7 rounded-3xl bg-white dark:bg-[#121827] border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Le But de la Plateforme</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              En finir avec les exercices de grammaire passifs. LinGoL Learner vous met immédiatement en situation d'échange réel pour développer des automatismes oraux, vaincre la peur de parler et atteindre une aisance naturelle.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Prise de parole sans jugement ni stress</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Progression continue du niveau A1 au C2</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Immersion quotidienne de 10 à 15 minutes</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Les Outils */}
          <div className="p-7 rounded-3xl bg-white dark:bg-[#121827] border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Les Outils Intégrés</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Une suite d'outils interactifs conçus pour chaque aspect de la maîtrise linguistique, alimentés par une IA de pointe et la reconnaissance vocale de haute précision.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                <span><strong>Coach de prononciation</strong> avec feedback acoustique</span>
              </li>
              <li className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                <span><strong>Dialogue vocal immersif</strong> avec des avatars spécialisés</span>
              </li>
              <li className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                <span><strong>Simulations de situations réelles</strong> (voyage, travail, café)</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Les Avantages & IA Gemini */}
          <div className="p-7 rounded-3xl bg-white dark:bg-[#121827] border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Les Avantages & Gemini</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Profitez de la puissance de l'API Gemini pour générer des conversations intelligentes et fluides sans frais avec la clé d'API gratuite de Google AI Studio.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Clé API Gemini gratuite</strong> : quota gratuit disponible sur Google AI Studio</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Disponible hors-ligne & PWA</strong> sur mobile et tablette</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Test immédiat</strong> sans obligation d'enregistrement préalable</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Methodology
          </h2>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            How LinGoL Gets You Fluent
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Designed to replace sterile flashcard repetition with genuine conversational confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Pick Target Language</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Choose from English, French, Spanish, German, Italian, Portuguese, Arabic, or Chinese with full native audio.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">CEFR Assessment</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Complete a quick 5-minute test covering vocabulary, grammar, listening comprehension, and spoken voice answers.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Choose Your AI Partner</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Match with an avatar: friendly Emma, executive coach Alex, strict teacher Daniel, or polyglot Lina.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Speak & Improve Daily</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Speak into your microphone, receive instant phonetic corrections, complete missions, and watch your level soar.
            </p>
          </div>
        </div>
      </section>

      {/* MEET YOUR AI PARTNERS CAROUSEL / DÉFILEMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Compagnons d'apprentissage
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              Faites défiler et choisissez votre tuteur IA
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Glissez ou cliquez sur les flèches pour faire défiler tous les avatars. Chaque personnage possède une voix unique, une personnalité et un accent ciblé.
            </p>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollAvatars('left')}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-sm cursor-pointer"
              aria-label="Faire défiler vers la gauche"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollAvatars('right')}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shadow-sm cursor-pointer"
              aria-label="Faire défiler vers la droite"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveView('my-character')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 ml-2"
            >
              <span>Tous les profils</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Horizontal scrollable carousel */}
        <div
          ref={avatarCarouselRef}
          className="flex gap-5 overflow-x-auto pb-6 pt-1 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent focus:outline-none"
          style={{ scrollbarWidth: 'thin' }}
        >
          {AVATARS_CATALOG.map((av) => (
            <div
              key={av.id}
              className="w-72 sm:w-80 shrink-0 snap-start group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-slate-800">
                <img
                  src={av.avatarUrl}
                  alt={av.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/70 text-white text-[11px] font-bold backdrop-blur-sm">
                  {av.difficultyLevel}+
                </div>
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 text-xs font-bold backdrop-blur-sm">
                  {av.personality}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{av.name}</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold">
                      {av.nativeLanguages?.map((l) => l.toUpperCase()).join(' · ') || 'MULTI'}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">{av.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">
                    {av.bio}
                  </p>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedAvatar(av.id);
                        showNotification(`Démarrage de la conversation avec ${av.name}...`);
                        setActiveView('conversation');
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Discuter</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAvatar(av.id);
                        showNotification(`Accès aux cours avec ${av.name}...`);
                        setActiveView('learning-path');
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      title="Démarrer les cours avec ce formateur"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Cours</span>
                    </button>
                  </div>
                  <button
                    onClick={handleStartFreeTrialTest}
                    className="w-full py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    title="Tester mon niveau avant de démarrer"
                  >
                    <Award className="w-3 h-3 text-amber-500" />
                    <span>Test préalable gratuit</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRONUNCIATION & VOICE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                <Brain className="w-3.5 h-3.5" /> AI Pronunciation Coach
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Master Difficult Sounds with Acoustic Precision
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                LinGoL listens to your voice, scores each syllable, detects subtle phoneme mispronunciations, and teaches you the exact tongue and mouth placement for effortless near-native pronunciation.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveView('pronunciation-coach')}
                  className="py-3 px-6 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-colors flex items-center gap-2"
                >
                  <Mic className="w-4 h-4 text-indigo-600" />
                  <span>Try Pronunciation Coach</span>
                </button>
              </div>
            </div>

            {/* Visual Acoustic Score mockup */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Target Phrase
                </span>
                <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  Score: 89%
                </span>
              </div>

              <div className="text-lg font-medium tracking-wide">
                "Could you please tell me where the nearest station is?"
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-slate-400">Accuracy</div>
                  <div className="text-base font-bold text-emerald-400">92%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-slate-400">Fluency</div>
                  <div className="text-base font-bold text-blue-400">86%</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-slate-400">Rhythm</div>
                  <div className="text-base font-bold text-indigo-400">89%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="text-center max-w-2xl mx-auto px-4 space-y-4">
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Ready to Start Speaking Today?
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Join thousands of learners speaking their target language with personalized AI companions.
        </p>
        <button
          onClick={() => setActiveView('onboarding')}
          className="py-4 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
        >
          Begin Your Journey
        </button>
      </section>
    </div>
  );
};
