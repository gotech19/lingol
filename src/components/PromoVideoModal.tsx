import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Mic,
  Brain,
  Award,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Zap,
  Bot,
  Flame,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { AVATARS_CATALOG } from '../data/avatars';

interface PromoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTest: () => void;
  onStartTrial: () => void;
}

interface Scene {
  id: number;
  title: string;
  badge: string;
  durationSec: number;
  speechText: string;
  subtitle: string;
  bgGradient: string;
  icon: any;
  renderVisual: (active: boolean, progress: number) => React.ReactNode;
}

export const PromoVideoModal: React.FC<PromoVideoModalProps> = ({
  isOpen,
  onClose,
  onStartTest,
  onStartTrial,
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100 per scene

  const currentSpeechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const scenes: Scene[] = [
    {
      id: 1,
      title: 'LinGoL Learner — L’IA Vocale Gemini pour parler avec assurance',
      badge: 'Bande-Annonce Officielle',
      durationSec: 8,
      speechText: 'Bienvenue sur LinGoL Learner. Découvrez la première plateforme d’apprentissage linguistique propulsée par le moteur IA Gemini !',
      subtitle: '⚡️ Échangez à l’oral en temps réel avec des tuteurs IA intelligents et ultra-réalistes.',
      bgGradient: 'from-indigo-950 via-slate-900 to-blue-950',
      icon: Sparkles,
      renderVisual: (active, p) => (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          {/* Animated glow */}
          <div className="absolute w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />

          <div className="relative z-10 space-y-4 max-w-lg">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold animate-bounce">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Nouveau : Moteur IA Gemini Pro & Web Speech</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Ne révisez plus en silence.{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                Parlez enfin avec aisance !
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Une immersion quotidienne personnalisée sans stress, disponible 24/7 sur web, mobile et tablette.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-lg bg-white/10 text-xs text-indigo-200 border border-white/10 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Sans Carte Bleue
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 text-xs text-indigo-200 border border-white/10 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Test CECR Immédiat
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Avatars & Tuteurs IA Personnalisés',
      badge: 'Spécificité 1 : Avatars Réalistes',
      durationSec: 9,
      speechText: 'Rencontrez vos tuteurs IA. Emma la bienveillante, Alex le coach business, ou Daniel le professeur rigoureux.',
      subtitle: '🗣️ Avatars interactifs avec expressions, voix uniques et corrections bienveillantes.',
      bgGradient: 'from-slate-950 via-indigo-950 to-slate-900',
      icon: Bot,
      renderVisual: (active, p) => (
        <div className="w-full h-full p-6 flex flex-col justify-center items-center">
          <p className="text-xs uppercase tracking-widest text-indigo-300 font-bold mb-4">
            Choisissez votre compagnon d'entraînement
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
            {AVATARS_CATALOG.slice(0, 4).map((av, idx) => (
              <div
                key={av.id}
                className={`p-3 rounded-2xl border transition-all duration-500 bg-slate-900/80 ${
                  idx === Math.floor((p / 100) * 4) % 4
                    ? 'border-indigo-400 shadow-lg shadow-indigo-500/30 scale-105'
                    : 'border-slate-800 opacity-70'
                }`}
              >
                <div className="relative h-28 rounded-xl overflow-hidden mb-2">
                  <img src={av.avatarUrl} alt={av.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] text-white font-bold">
                    {av.personality}
                  </div>
                </div>
                <div className="font-bold text-xs text-white truncate">{av.name}</div>
                <div className="text-[10px] text-indigo-300 truncate">{av.title}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Coach de Prononciation Acoustique & Phonétique',
      badge: 'Spécificité 2 : Analyse Vocale Instantanée',
      durationSec: 9,
      speechText: 'Entraînez votre voix avec précision. Le coach phonétique analyse votre accent, vos phonèmes et votre intonation en direct.',
      subtitle: '🎯 Feedback visuel sur chaque syllabe, score de précision et enregistrement comparatif.',
      bgGradient: 'from-blue-950 via-indigo-950 to-slate-950',
      icon: Mic,
      renderVisual: (active, p) => (
        <div className="w-full h-full p-6 flex flex-col items-center justify-center space-y-4">
          <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 max-w-lg w-full space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
              <span className="flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-emerald-400 animate-pulse" /> Écoute vocale active...
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Score: {Math.min(96, Math.floor(70 + (p / 100) * 26))}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 text-white font-medium text-sm border border-slate-700">
              "Could you please tell me where the station is?"
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-emerald-950/50 border border-emerald-500/30">
                <div className="text-[10px] text-slate-400">Précision</div>
                <div className="font-bold text-emerald-400 text-sm">95%</div>
              </div>
              <div className="p-2 rounded-lg bg-blue-950/50 border border-blue-500/30">
                <div className="text-[10px] text-slate-400">Fluidité</div>
                <div className="font-bold text-blue-400 text-sm">92%</div>
              </div>
              <div className="p-2 rounded-lg bg-indigo-950/50 border border-indigo-500/30">
                <div className="text-[10px] text-slate-400">Intonation</div>
                <div className="font-bold text-indigo-400 text-sm">90%</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Évaluation & Test de Niveau CECR (A1 à C2)',
      badge: 'Spécificité 3 : Diagnostic Complet',
      durationSec: 8,
      speechText: 'Calibrez exactement votre niveau CECR grâce à notre test interactif complet en grammaire, vocabulaire et expression orale.',
      subtitle: '📊 Test de positionnement initial obligatoire pour une progression parfaitement sur mesure.',
      bgGradient: 'from-purple-950 via-slate-950 to-indigo-950',
      icon: Award,
      renderVisual: (active, p) => (
        <div className="w-full h-full p-6 flex flex-col items-center justify-center space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/30 max-w-md w-full text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 mx-auto flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-white">Niveau CECR Détecté : B2</h3>
            <p className="text-xs text-slate-300">
              « Capable de communiquer avec un degré de spontanéité et d'aisance avec un locuteur natif. »
            </p>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
                style={{ width: `${Math.min(100, p * 1.2)}%` }}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Missions, Gamification & Mode PWA',
      badge: 'Spécificité 4 : Motivation Quotidienne',
      durationSec: 8,
      speechText: 'Restez motivé jour après jour avec les séries de jours, les badges de compétences et l’application PWA installable sur vos appareils.',
      subtitle: '📱 Installez LinGoL comme une application native et pratiquez où que vous soyez.',
      bgGradient: 'from-emerald-950 via-slate-950 to-indigo-950',
      icon: Smartphone,
      renderVisual: (active, p) => (
        <div className="w-full h-full p-6 flex items-center justify-center gap-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/30 text-white space-y-3 max-w-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-lg">
                🔥 7 Jours
              </div>
              <div>
                <div className="font-bold text-sm">Série en cours</div>
                <div className="text-xs text-slate-400">+150 XP aujourd'hui</div>
              </div>
            </div>
            <div className="text-xs text-slate-300 border-t border-slate-800 pt-2 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>PWA Installable — Accès rapide 1-Click</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentScene = scenes[currentSceneIndex];

  // Speech synthesis narrator
  const speakCurrentScene = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || isMuted) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    currentSpeechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Timer loop for scene video playback
  useEffect(() => {
    if (!isOpen) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (!isPlaying) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      return;
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }

    speakCurrentScene(currentScene.speechText);

    const intervalTimeMs = 50;
    const totalSteps = (currentScene.durationSec * 1000) / intervalTimeMs;
    const stepIncrement = 100 / totalSteps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next scene
          if (currentSceneIndex < scenes.length - 1) {
            setCurrentSceneIndex((i) => i + 1);
            return 0;
          } else {
            // Loop back to beginning
            setCurrentSceneIndex(0);
            return 0;
          }
        }
        return prev + stepIncrement;
      });
    }, intervalTimeMs);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, currentSceneIndex, isMuted]);

  useEffect(() => {
    setProgress(0);
  }, [currentSceneIndex]);

  if (!isOpen) return null;

  const handlePrev = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setCurrentSceneIndex((prev) => (prev > 0 ? prev - 1 : scenes.length - 1));
  };

  const handleNext = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setCurrentSceneIndex((prev) => (prev < scenes.length - 1 ? prev + 1 : 0));
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-950 rounded-3xl border border-indigo-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Video Player Bar */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm">{currentScene.title}</div>
              <div className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                {currentScene.badge} • Scène {currentSceneIndex + 1}/{scenes.length}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Fermer la vidéo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scene progress bars top indicator */}
        <div className="grid grid-cols-5 gap-1 bg-slate-900 px-4 py-1.5 border-b border-slate-800">
          {scenes.map((sc, idx) => {
            let fillWidth = '0%';
            if (idx < currentSceneIndex) fillWidth = '100%';
            else if (idx === currentSceneIndex) fillWidth = `${progress}%`;

            return (
              <button
                key={sc.id}
                onClick={() => {
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                  setCurrentSceneIndex(idx);
                }}
                className="h-1.5 rounded-full bg-slate-800 overflow-hidden cursor-pointer"
                title={`Aller à la scène ${idx + 1}: ${sc.title}`}
              >
                <div
                  className="h-full bg-indigo-500 transition-all duration-75"
                  style={{ width: fillWidth }}
                />
              </button>
            );
          })}
        </div>

        {/* Main Animated Video Canvas Screen */}
        <div className={`relative flex-1 min-h-[300px] sm:min-h-[380px] bg-gradient-to-br ${currentScene.bgGradient} overflow-hidden`}>
          {currentScene.renderVisual(isPlaying, progress)}

          {/* Subtitles Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className="p-3 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-700/80 text-center max-w-2xl mx-auto shadow-lg">
              <p className="text-xs sm:text-sm font-semibold text-white">
                {currentScene.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Video Player Controls & Call-to-action bottom panel */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              title="Scène précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all cursor-pointer flex items-center justify-center"
              title={isPlaying ? 'Pause' : 'Lecture'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
              title="Scène suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={toggleMute}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer ml-1"
              title={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          {/* Direct CTA Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
            <button
              onClick={() => {
                onClose();
                onStartTrial();
              }}
              className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Essai Gratuit Immédiat</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onStartTest();
              }}
              className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Passer le Test CECR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
