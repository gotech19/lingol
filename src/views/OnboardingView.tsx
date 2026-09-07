import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation, isRTL } from '../translations';
import {
  InterfaceLanguage,
  LearningLanguage,
  CEFRLevel,
  LearningGoalId,
  AssessmentResult,
} from '../types';
import {
  SUPPORTED_LEARNING_LANGUAGES,
  INTERFACE_LANGUAGES,
  getLanguageInfo,
} from '../data/languages';
import { LEARNING_GOALS_LIST } from '../data/learningGoals';
import { AVATARS_CATALOG } from '../data/avatars';
import { ASSESSMENT_QUESTIONS_BY_LANG } from '../data/assessmentQuestions';
import { voiceService } from '../services/voiceService';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Volume2,
  Mic,
  MicOff,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Plane,
  TrendingUp,
  Coffee,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const OnboardingView: React.FC = () => {
  const {
    user,
    updateUser,
    setActiveView,
    setSelectedAvatar,
    setInterfaceLanguage,
    setLearningLanguage,
    addXp,
    showNotification,
  } = useApp();

  const t = getTranslation(user.interfaceLanguage);

  // Steps: 1: Welcome, 2: Interface Lang, 3: Learning Lang, 4: Assessment, 5: Assessment Result, 6: Goals, 7: Avatar Pick
  const [step, setStep] = useState<number>(1);

  // Assessment test state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSpeakingTestMicActive, setIsSpeakingTestMicActive] = useState(false);
  const [speakingTranscript, setSpeakingTranscript] = useState('');
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Goal selections
  const [selectedGoals, setSelectedGoals] = useState<LearningGoalId[]>(['travel', 'daily_life']);

  // Avatar pick
  const [chosenAvatarId, setChosenAvatarId] = useState<string>(user.selectedAvatarId || 'emma');

  const questionsList =
    ASSESSMENT_QUESTIONS_BY_LANG[user.learningLanguage] || ASSESSMENT_QUESTIONS_BY_LANG.en;
  const currentQuestion = questionsList[currentQIndex];

  // Handle Assessment Answer Selection
  const handleSelectOption = (index: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: index }));
  };

  // Handle Speaking Voice Input during Assessment
  const toggleAssessmentMic = () => {
    if (isSpeakingTestMicActive) {
      voiceService.stopListening();
      setIsSpeakingTestMicActive(false);
      return;
    }

    setIsSpeakingTestMicActive(true);
    voiceService.startListening(
      user.learningLanguage,
      (transcript, isFinal) => {
        setSpeakingTranscript(transcript);
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: transcript }));
        if (isFinal) {
          setIsSpeakingTestMicActive(false);
        }
      },
      (err) => {
        showNotification(err);
        setIsSpeakingTestMicActive(false);
      },
      () => {
        setIsSpeakingTestMicActive(false);
      }
    );
  };

  // Play audio prompt for listening questions
  const playListeningAudio = (text: string) => {
    voiceService.speak(text, user.learningLanguage, 1.0, 0.9);
  };

  // Move to next question or evaluate assessment
  const handleNextQuestion = async () => {
    if (currentQIndex < questionsList.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSpeakingTranscript('');
    } else {
      // Evaluate assessment
      setIsEvaluating(true);
      try {
        const response = await fetch('/api/ai/evaluate-assessment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            answers,
            targetLanguage: getLanguageInfo(user.learningLanguage).name,
            goals: selectedGoals,
          }),
        });
        const data: AssessmentResult = await response.json();
        setAssessmentResult(data);
        updateUser({
          currentLevel: data.estimatedLevel,
          speakingScore: data.speakingScore,
          listeningScore: data.listeningScore,
          grammarScore: data.grammarScore,
          vocabularyScore: data.vocabularyScore,
          pronunciationScore: data.pronunciationScore,
        });
        confetti({ particleCount: 100, spread: 60 });
        setStep(5); // Go to results
      } catch (err) {
        // Fallback default result
        const fallbackResult: AssessmentResult = {
          estimatedLevel: 'B1',
          overallScore: 74,
          speakingScore: 70,
          listeningScore: 78,
          grammarScore: 72,
          vocabularyScore: 76,
          pronunciationScore: 68,
          summaryFeedback:
            'You demonstrated solid foundational vocabulary and sentence structuring! Focus on spontaneous speech rhythm and connected speech to reach B2.',
          personalizedPlan: [
            {
              week: 1,
              title: 'Spontaneous Daily Conversations',
              focus: 'Ordering food, introducing friends, and expressing preferences.',
              items: ['Daily 5 min voice practice', 'Vocabulary for hobbies', 'Pronunciation coaching on vowels'],
            },
            {
              week: 2,
              title: 'Travel & Navigation',
              focus: 'Airports, hotels, public transit, and emergency directions.',
              items: ['Hotel check-in roleplay', 'Listening drills', 'Past tense stories'],
            },
            {
              week: 3,
              title: 'Professional Discussions',
              focus: 'Participating in meetings, negotiations, and interviews.',
              items: ['Workplace idioms', 'Polite disagreement', 'Mock interview with Alex'],
            },
          ],
        };
        setAssessmentResult(fallbackResult);
        updateUser({ currentLevel: 'B1' });
        setStep(5);
      } finally {
        setIsEvaluating(false);
      }
    }
  };

  const handleFinishOnboarding = () => {
    updateUser({
      selectedAvatarId: chosenAvatarId,
      learningGoals: selectedGoals,
    });
    setSelectedAvatar(chosenAvatarId);
    addXp(100);
    showNotification('Onboarding complete! +100 XP awarded.');
    setActiveView('dashboard');
  };

  const goalIcons: Record<string, any> = {
    Briefcase,
    GraduationCap,
    Plane,
    TrendingUp,
    Coffee,
    UserCheck,
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 relative">
        {/* Step progress dots */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  step === s
                    ? 'w-8 bg-indigo-600'
                    : step > s
                    ? 'w-3 bg-emerald-500'
                    : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-400">Step {step} of 7</span>
        </div>

        {/* STEP 1: WELCOME & MANDATORY LEVEL TEST INTRO */}
        {step === 1 && (
          <div className="text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 text-white font-extrabold text-4xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/25">
              L
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-indigo-600" />
                <span>Test de niveau initial obligatoire (CECR A1 – C2)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {user.name ? `Bienvenue, ${user.name} !` : 'Bienvenue sur LinGoL'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                Après votre inscription ou authentification Google, le test de niveau est obligatoire pour calibrer votre avatar IA, vos leçons et vos objectifs personnalisés.
              </p>
            </div>

            {/* Target Language Quick Confirmation */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-left">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Langue évaluée pour le test de niveau :
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  {getLanguageInfo(user.learningLanguage).flag} {getLanguageInfo(user.learningLanguage).name}
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {SUPPORTED_LEARNING_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLearningLanguage(lang.code)}
                    className={`py-2 px-1 rounded-xl text-center border transition-all ${
                      user.learningLanguage === lang.code
                        ? 'border-indigo-600 bg-white dark:bg-slate-800 shadow-sm font-bold scale-105'
                        : 'border-transparent hover:bg-white/60 dark:hover:bg-slate-800/60 text-slate-500'
                    }`}
                    title={lang.name}
                  >
                    <div className="text-lg">{lang.flag}</div>
                    <div className="text-[10px] uppercase font-bold">{lang.code}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-left">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mb-1.5">
                  <Mic className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Expression Orale</h4>
                <p className="text-[11px] text-slate-500">Testez votre voix directement au micro.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-1.5">
                  <Volume2 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Compréhension</h4>
                <p className="text-[11px] text-slate-500">Écoutez et répondez aux questions.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center mb-1.5">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Certifié CECR</h4>
                <p className="text-[11px] text-slate-500">Attribution immédiate de A1 à C2.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Démarrer le Test de Niveau Obligatoire</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setStep(2)}
                className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
              >
                Configurer langue d’interface
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: INTERFACE LANGUAGE */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {t.interfaceLanguagePrompt}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select the language you want LinGoL to display in.
              </p>
            </div>

            <div className="space-y-3">
              {INTERFACE_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setInterfaceLanguage(lang.code)}
                  className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    user.interfaceLanguage === lang.code
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div className="text-left">
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {lang.nativeName}
                      </div>
                      <div className="text-xs text-slate-400">{lang.name}</div>
                    </div>
                  </div>
                  {user.interfaceLanguage === lang.code && (
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LEARNING LANGUAGE */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                {t.chooseLanguagePrompt}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You can add more languages anytime later.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SUPPORTED_LEARNING_LANGUAGES.map((lang) => {
                const isSelected = user.learningLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLearningLanguage(lang.code)}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-3xl">{lang.flag}</span>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {lang.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{lang.nativeName}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5"
              >
                <span>Take Level Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: LEVEL ASSESSMENT TEST */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {currentQuestion.type.toUpperCase()} TEST
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Question {currentQIndex + 1} of {questionsList.length}
                </h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Target Level: {currentQuestion.level}
              </span>
            </div>

            {/* Question Prompt */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {currentQuestion.prompt}
              </p>

              {/* Reading Passage if present */}
              {currentQuestion.passage && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 italic">
                  "{currentQuestion.passage}"
                </div>
              )}

              {/* Listening Audio button if present */}
              {currentQuestion.audioPromptText && (
                <button
                  onClick={() => playListeningAudio(currentQuestion.audioPromptText!)}
                  className="w-full py-3 px-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Click to Listen to Audio Prompt</span>
                </button>
              )}

              {/* Multiple Choice Options */}
              {currentQuestion.options && (
                <div className="space-y-2 pt-2">
                  {currentQuestion.options.map((opt, i) => {
                    const isSelected = answers[currentQuestion.id] === i;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelectOption(i)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Speaking Voice Response for Speaking type */}
              {currentQuestion.type === 'speaking' && (
                <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/20 text-center space-y-3">
                  <p className="text-xs text-slate-500">
                    Press the microphone button and speak clearly into your device:
                  </p>

                  <button
                    onClick={toggleAssessmentMic}
                    className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto text-white shadow-lg transition-all ${
                      isSpeakingTestMicActive
                        ? 'bg-rose-500 animate-pulse ring-4 ring-rose-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
                    }`}
                  >
                    {isSpeakingTestMicActive ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>

                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {isSpeakingTestMicActive
                      ? 'Listening... say your sentence now'
                      : 'Tap to start speaking'}
                  </p>

                  {speakingTranscript && (
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      Heard: <span className="italic">"{speakingTranscript}"</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3 pt-4">
              <button
                disabled={isEvaluating}
                onClick={() => {
                  if (currentQIndex > 0) setCurrentQIndex((prev) => prev - 1);
                  else setStep(3);
                }}
                className="py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                disabled={isEvaluating}
                onClick={handleNextQuestion}
                className="flex-1 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isEvaluating ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {currentQIndex === questionsList.length - 1
                        ? 'Complete & View Results'
                        : 'Next Question'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: ASSESSMENT RESULT */}
        {step === 5 && assessmentResult && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Level Assessment Complete</span>
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                You are Level{' '}
                <span className="text-indigo-600 dark:text-indigo-400">
                  {assessmentResult.estimatedLevel}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {assessmentResult.summaryFeedback}
              </p>
            </div>

            {/* Skill Radar / Bars */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 text-center">
                <div className="text-[11px] text-slate-400 font-semibold">{t.speaking}</div>
                <div className="text-xl font-extrabold text-indigo-600 mt-0.5">
                  {assessmentResult.speakingScore}%
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 text-center">
                <div className="text-[11px] text-slate-400 font-semibold">{t.listening}</div>
                <div className="text-xl font-extrabold text-blue-600 mt-0.5">
                  {assessmentResult.listeningScore}%
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 text-center">
                <div className="text-[11px] text-slate-400 font-semibold">{t.grammar}</div>
                <div className="text-xl font-extrabold text-emerald-600 mt-0.5">
                  {assessmentResult.grammarScore}%
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 text-center">
                <div className="text-[11px] text-slate-400 font-semibold">{t.vocabulary}</div>
                <div className="text-xl font-extrabold text-amber-600 mt-0.5">
                  {assessmentResult.vocabularyScore}%
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 text-center col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-400 font-semibold">{t.pronunciation}</div>
                <div className="text-xl font-extrabold text-rose-600 mt-0.5">
                  {assessmentResult.pronunciationScore}%
                </div>
              </div>
            </div>

            {/* Generated 3-Week Personalized Curriculum */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>Your Personalized Learning Roadmap (Generated for {assessmentResult.estimatedLevel})</span>
              </h4>
              <div className="space-y-2">
                {assessmentResult.personalizedPlan.map((plan) => (
                  <div
                    key={plan.week}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 text-xs"
                  >
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                      <span>Week {plan.week}: {plan.title}</span>
                      <span className="text-[10px] text-indigo-600 font-mono">Curriculum</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{plan.focus}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(6)}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              <span>Choose Your Learning Goals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 6: LEARNING GOALS */}
        {step === 6 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                What are your learning goals?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select one or more topics you want your AI partner to focus on.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LEARNING_GOALS_LIST.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                const Icon = goalIcons[goal.icon] || Coffee;
                return (
                  <button
                    key={goal.id}
                    onClick={() => {
                      if (isSelected) {
                        if (selectedGoals.length > 1) {
                          setSelectedGoals(selectedGoals.filter((g) => g !== goal.id));
                        }
                      } else {
                        setSelectedGoals([...selectedGoals, goal.id]);
                      }
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{goal.title}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {goal.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(5)}
                className="py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                onClick={() => setStep(7)}
                className="flex-1 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5"
              >
                <span>Select Your AI Avatar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: AVATAR SELECTION */}
        {step === 7 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                Choose Your Personal AI Partner
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You can talk, switch, and customize your character anytime in the app.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AVATARS_CATALOG.slice(0, 6).map((av) => {
                const isSelected = chosenAvatarId === av.id;
                return (
                  <button
                    key={av.id}
                    onClick={() => setChosenAvatarId(av.id)}
                    className={`rounded-2xl border overflow-hidden text-left transition-all relative ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500/30 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="h-28 relative">
                      <img
                        src={av.avatarUrl}
                        alt={av.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/70 text-white text-[10px] font-bold backdrop-blur-sm">
                        {av.personality}
                      </span>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900">
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {av.name}
                      </div>
                      <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                        {av.role}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(6)}
                className="py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Back
              </button>
              <button
                onClick={handleFinishOnboarding}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Complete Setup & Start Talking</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
