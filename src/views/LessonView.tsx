import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations';
import { LESSONS_DATABASE } from '../data/lessons';
import { voiceService } from '../services/voiceService';
import {
  ArrowLeft,
  Volume2,
  Check,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LessonView: React.FC = () => {
  const { user, activeLessonId, completeLesson, addXp, setActiveView } = useApp();
  const t = getTranslation(user.interfaceLanguage);

  const lesson = LESSONS_DATABASE.find((l) => l.id === activeLessonId) || LESSONS_DATABASE[0];

  const [step, setStep] = useState<'vocab' | 'dialogue' | 'quiz' | 'complete'>('vocab');
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);

  const activeWord = lesson.vocabulary[selectedWordIndex];

  const playAudio = (text: string) => {
    voiceService.speak(text, user.learningLanguage, 1.0, 0.9);
  };

  const handleFinishLesson = () => {
    completeLesson(lesson.id);
    addXp(lesson.xpReward);
    confetti({ particleCount: 90, spread: 60 });
    setStep('complete');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 pb-20">
      {/* Back button */}
      <button
        onClick={() => setActiveView('learning-path')}
        className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Curriculum</span>
      </button>

      {/* Lesson Header */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
            {lesson.category} • Level {lesson.level}
          </span>
          <span className="text-xs font-mono font-bold text-slate-400">
            +{lesson.xpReward} XP
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{lesson.title}</h1>
        <p className="text-xs text-slate-500">{lesson.description}</p>
      </div>

      {/* Step Navigation Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setStep('vocab')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors ${
            step === 'vocab'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          1. Vocabulary Focus
        </button>
        <button
          onClick={() => setStep('dialogue')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors ${
            step === 'dialogue'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          2. Dialogue Study
        </button>
        <button
          onClick={() => setStep('quiz')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-colors ${
            step === 'quiz'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          3. Quick Check
        </button>
      </div>

      {/* STEP 1: VOCABULARY DRILL */}
      {step === 'vocab' && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-4 py-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {activeWord.term}
              </h2>
              <p className="text-sm font-mono text-indigo-600 dark:text-indigo-400">
                {activeWord.phonetic}
              </p>
            </div>

            <div className="text-base text-slate-600 dark:text-slate-300">
              "{activeWord.meaning}"
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/70 text-xs text-slate-700 dark:text-slate-300 italic max-w-md mx-auto">
              Example: "{activeWord.example}"
            </div>

            <button
              onClick={() => playAudio(activeWord.term)}
              className="py-2.5 px-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors inline-flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>Hear Pronunciation</span>
            </button>
          </div>

          {/* Word Carousel Selectors */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              disabled={selectedWordIndex === 0}
              onClick={() => setSelectedWordIndex((prev) => prev - 1)}
              className="py-2 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold disabled:opacity-30"
            >
              Previous Word
            </button>
            <span className="text-xs text-slate-400">
              Word {selectedWordIndex + 1} of {lesson.vocabulary.length}
            </span>
            {selectedWordIndex < lesson.vocabulary.length - 1 ? (
              <button
                onClick={() => setSelectedWordIndex((prev) => prev + 1)}
                className="py-2 px-4 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Next Word
              </button>
            ) : (
              <button
                onClick={() => setStep('dialogue')}
                className="py-2 px-4 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1"
              >
                <span>To Dialogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: DIALOGUE STUDY */}
      {step === 'dialogue' && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Listen and Read Along
          </h3>
          <div className="space-y-3">
            {lesson.dialogue.map((line, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-xs flex items-start justify-between gap-3 ${
                  line.speaker === 'You'
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60 ml-4'
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/80 mr-4'
                }`}
              >
                <div className="space-y-1">
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">{line.speaker}</div>
                  <div className="text-slate-900 dark:text-slate-100 font-medium text-sm">
                    "{line.text}"
                  </div>
                  <div className="text-slate-400 italic text-[11px]">{line.translation}</div>
                </div>
                <button
                  onClick={() => playAudio(line.text)}
                  className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 shrink-0"
                  title="Play audio"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep('quiz')}
              className="py-2.5 px-6 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <span>Test Your Knowledge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: QUICK CHECK */}
      {step === 'quiz' && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              Comprehension Check
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Which phrase is the most natural way to express this request?
            </h3>
          </div>

          <div className="space-y-2">
            {[
              'Could you tell me how much this costs, please?',
              'Say me the price now.',
              'I want knowing how money this is.',
            ].map((opt, i) => (
              <button
                key={i}
                onClick={() => setQuizAnswer(i)}
                className={`w-full p-4 rounded-2xl border text-left text-xs font-medium transition-colors flex items-center justify-between ${
                  quizAnswer === i
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-800 dark:text-slate-200'
                }`}
              >
                <span>{opt}</span>
                {quizAnswer === i && <Check className="w-4 h-4 text-indigo-600" />}
              </button>
            ))}
          </div>

          <button
            onClick={handleFinishLesson}
            disabled={quizAnswer === null}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 disabled:opacity-40 transition-colors"
          >
            Submit & Claim +{lesson.xpReward} XP
          </button>
        </div>
      )}

      {/* LESSON COMPLETE CELEBRATION */}
      {step === 'complete' && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center space-y-6 animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
            🎉
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
              Lesson Complete!
            </h2>
            <p className="text-xs text-slate-500">
              You earned <span className="font-bold text-indigo-600">+{lesson.xpReward} XP</span> and mastered new everyday phrases.
            </p>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => setActiveView('learning-path')}
              className="py-3 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
            >
              Back to Roadmap
            </button>
            <button
              onClick={() => setActiveView('conversation')}
              className="py-3 px-6 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-500/20"
            >
              Practice in Voice Conversation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
