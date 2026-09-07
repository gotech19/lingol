import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations';
import { AVATARS_CATALOG } from '../data/avatars';
import { voiceService } from '../services/voiceService';
import {
  Sparkles,
  Volume2,
  Sliders,
  Brain,
  History,
  Check,
  RefreshCw,
  Mic,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

export const MyCharacterView: React.FC = () => {
  const { user, avatar, setSelectedAvatar, updateUser, showNotification } = useApp();
  const t = getTranslation(user.interfaceLanguage);

  const [strictness, setStrictness] = useState<'gentle' | 'balanced' | 'strict'>('balanced');
  const [speechSpeed, setSpeechSpeed] = useState<number>(avatar.voiceRate);
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  const handleTestVoice = (text: string, pitch = avatar.voicePitch, rate = speechSpeed) => {
    setIsPlayingSample(true);
    voiceService.speak(
      text,
      user.learningLanguage,
      pitch,
      rate,
      () => setIsPlayingSample(true),
      () => setIsPlayingSample(false)
    );
  };

  const handleSavePreferences = () => {
    showNotification('AI Character preferences saved successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Personal AI Companion Hub</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
          My Character: {avatar.name}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your AI partner's personality, feedback strictness, and review shared conversation memories.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Character Profile & Voice */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm text-center space-y-4">
            <div className="relative mx-auto w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-100 dark:border-indigo-950 shadow-xl">
              <img
                src={avatar.avatarUrl}
                alt={avatar.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{avatar.name}</h2>
              <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                {avatar.role} • {avatar.personality}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {avatar.bio}
              </p>
            </div>

            {/* Test Voice Audio button */}
            <button
              onClick={() =>
                handleTestVoice(
                  `Hi! I'm ${avatar.name}. I'm delighted to help you speak with effortless confidence.`
                )
              }
              disabled={isPlayingSample}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingSample ? 'Playing Sample...' : 'Hear Voice Sample'}</span>
            </button>
          </div>

          {/* Personality & Teaching Tuning */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>Teaching Style Settings</span>
            </h3>

            {/* Correction Strictness */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Correction Frequency
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['gentle', 'balanced', 'strict'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setStrictness(mode)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold capitalize transition-colors ${
                      strictness === mode
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Speaking Rate */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Speaking Rate</span>
                <span className="font-mono text-indigo-600">{speechSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.2"
                step="0.05"
                value={speechSpeed}
                onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.7x (Slower)</span>
                <span>1.0x (Normal)</span>
                <span>1.2x (Native)</span>
              </div>
            </div>

            <button
              onClick={handleSavePreferences}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-colors mt-2"
            >
              Save Style Preferences
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Character Memories & Switch Avatar Catalog */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Memory & Context Log */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-500" />
                  <span>{avatar.name}'s Memories of You</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Information your companion remembers across conversation sessions to personalize replies.
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 font-bold">
                {user.memories.length} Memories
              </span>
            </div>

            {user.memories.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Brain className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Aucun souvenir pour le moment
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Votre compagnon mémorisera automatiquement vos centres d'intérêt, vos projets et vos préférences au fur et à mesure de vos conversations vocales.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {user.memories.map((mem, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                      <History className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {mem.detail}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Category: {mem.type.replace('_', ' ')} • Logged on{' '}
                        {new Date(mem.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Switch Active Character Catalog */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Switch AI Character
            </h3>
            <p className="text-xs text-slate-500">
              Each character brings a distinct perspective, specialty, and accent.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {AVATARS_CATALOG.map((av) => {
                const isSelected = avatar.id === av.id;
                return (
                  <div
                    key={av.id}
                    onClick={() => {
                      setSelectedAvatar(av.id);
                      showNotification(`Switched partner to ${av.name}!`);
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={av.avatarUrl}
                      alt={av.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span className="truncate">{av.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                      </div>
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate">
                        {av.role}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{av.personality}</div>
                    </div>
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
