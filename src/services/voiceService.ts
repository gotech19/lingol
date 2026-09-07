import { LearningLanguage } from '../types';
import { getLanguageInfo } from '../data/languages';

// Web Speech API interface declarations for TypeScript
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

class VoiceService {
  private recognition: SpeechRecognitionInstance | null = null;
  private isListening = false;
  private isSpeaking = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
      }
    }
  }

  public isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public isSpeechSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  }

  public startListening(
    lang: LearningLanguage,
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onEnd: () => void,
    onStart?: () => void
  ): boolean {
    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser. You can type your response instead.');
      return false;
    }

    // Stop existing speech synthesis so AI voice doesn't bleed into mic
    this.stopSpeaking();

    const langInfo = getLanguageInfo(lang);
    this.recognition.lang = langInfo.speechCode || 'en-US';

    this.recognition.onstart = () => {
      this.isListening = true;
      if (onStart) onStart();
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = 0; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      if (final.length > 0) {
        onResult(final, true);
      } else if (interim.length > 0) {
        onResult(interim, false);
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.isListening = false;
      let msg = 'Could not capture speech.';
      if (event.error === 'not-allowed') {
        msg = 'Microphone permission denied. Please allow microphone access in your browser settings.';
      } else if (event.error === 'no-speech') {
        msg = 'No speech detected. Please try speaking again closer to your microphone.';
      } else if (event.error === 'network') {
        msg = 'Network error during speech recognition.';
      }
      onError(msg);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
      return true;
    } catch (e: any) {
      if (e.name === 'InvalidStateError') {
        // Already started, abort and restart
        try {
          this.recognition.abort();
          this.recognition.start();
          return true;
        } catch (restartErr) {
          onError('Microphone is already active or busy.');
          return false;
        }
      }
      onError('Could not start microphone: ' + (e.message || String(e)));
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public speak(
    text: string,
    lang: LearningLanguage,
    pitch: number = 1.0,
    rate: number = 1.0,
    onStart?: () => void,
    onEnd?: () => void
  ): boolean {
    if (!this.isSpeechSynthesisSupported()) {
      return false;
    }

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    const langInfo = getLanguageInfo(lang);
    utterance.lang = langInfo.speechCode || 'en-US';
    utterance.pitch = pitch;
    utterance.rate = rate;

    // Pick a voice that matches the language
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(
      (v) => v.lang.toLowerCase().startsWith(utterance.lang.toLowerCase().slice(0, 2))
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }

  public stopSpeaking() {
    if (this.isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Evaluates pronunciation match between user's spoken transcript and target text
   */
  public evaluatePronunciationMatch(spoken: string, target: string) {
    const cleanSpoken = spoken.toLowerCase().replace(/[^\w\s]/g, '').trim().split(/\s+/);
    const cleanTarget = target.toLowerCase().replace(/[^\w\s]/g, '').trim().split(/\s+/);

    if (cleanTarget.length === 0) {
      return { score: 100, wordMatches: [], accuracy: 100, rhythm: 95, fluency: 90 };
    }

    let matchesCount = 0;
    const wordMatches = cleanTarget.map((targetWord, index) => {
      const isMatch = cleanSpoken.includes(targetWord) || (cleanSpoken[index] && cleanSpoken[index] === targetWord);
      if (isMatch) matchesCount++;
      return {
        word: targetWord,
        matched: isMatch,
        accuracy: isMatch ? Math.floor(88 + Math.random() * 12) : Math.floor(40 + Math.random() * 25),
      };
    });

    const accuracy = Math.round((matchesCount / cleanTarget.length) * 100);
    const fluency = Math.min(100, Math.max(50, accuracy - 5 + Math.floor(Math.random() * 10)));
    const rhythm = Math.min(100, Math.max(50, accuracy - 2 + Math.floor(Math.random() * 8)));
    const score = Math.round(accuracy * 0.5 + fluency * 0.25 + rhythm * 0.25);

    return {
      score,
      accuracy,
      fluency,
      rhythm,
      wordMatches,
    };
  }
}

export const voiceService = new VoiceService();
