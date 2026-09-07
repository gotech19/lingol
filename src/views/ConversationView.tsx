import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations';
import { ChatMessage, ConversationMode, CorrectionItem, VocabSuggestion } from '../types';
import { voiceService } from '../services/voiceService';
import { getLanguageInfo } from '../data/languages';
import { REAL_LIFE_MISSIONS } from '../data/missions';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Keyboard,
  Send,
  Sparkles,
  BookOpen,
  Settings,
  X,
  Flame,
  Award,
  ChevronRight,
  RefreshCw,
  HelpCircle,
  Play,
  RotateCcw,
} from 'lucide-react';

export const ConversationView: React.FC = () => {
  const {
    user,
    avatar,
    activeConversationMode,
    setActiveConversationMode,
    activeScenario,
    setActiveScenario,
    setActiveView,
    addXp,
    addMemory,
    completeMission,
    activeMissionId,
    setIsUpgradeModalOpen,
    showNotification,
  } = useApp();

  const t = getTranslation(user.interfaceLanguage);
  const targetLangInfo = getLanguageInfo(user.learningLanguage);

  // Active mission if launched from missions
  const currentMission = REAL_LIFE_MISSIONS.find((m) => m.id === activeMissionId) || REAL_LIFE_MISSIONS[0];

  // Conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');

  // Latest feedback & suggestions from AI - empty initial state
  const [latestCorrection, setLatestCorrection] = useState<CorrectionItem | null>(null);
  const [latestPronunciationScore, setLatestPronunciationScore] = useState<number | null>(null);
  const [latestGrammarTip, setLatestGrammarTip] = useState<string | null>(null);
  const [vocabSuggestions, setVocabSuggestions] = useState<VocabSuggestion[]>([]);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const [comprehensionCheck, setComprehensionCheck] = useState<{ question: string; expectedAnswer: string } | null>(null);
  const [showVocabDrawer, setShowVocabDrawer] = useState(false);
  const [sessionMinutes, setSessionMinutes] = useState(0);

  // Timer tracking for session duration
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionMinutes((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Initial Avatar Greeting when component mounts
  useEffect(() => {
    const initialText =
      activeConversationMode === 'roleplay' && activeMissionId
        ? currentMission.initialAIMessage
        : `Bonjour ! Comment s'est passée votre journée ? De quoi aimeriez-vous discuter aujourd'hui ?`;

    const initialMsg: ChatMessage = {
      id: 'init-msg',
      sender: 'ai',
      text:
        user.learningLanguage === 'en'
          ? `Hello there! I'm ${avatar.name}. It's wonderful to practice with you today. What would you like to talk about?`
          : user.learningLanguage === 'fr'
          ? `Bonjour ! Je suis ${avatar.name}. Je suis ravi de pratiquer avec vous aujourd'hui. De quoi souhaitez-vous discuter ?`
          : user.learningLanguage === 'es'
          ? `¡Hola! Soy ${avatar.name}. Qué alegría practicar contigo hoy. ¿De qué te gustaría hablar?`
          : user.learningLanguage === 'ar'
          ? `مرحباً بك! أنا ${avatar.name}. يسعدني التحدث معك والتدرّب اليوم. عن ماذا تحب أن نتحدث؟`
          : `Hello! I'm ${avatar.name}. What would you like to talk about today?`,
      translatedText: "Hello! What would you like to talk about today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([initialMsg]);

    // Speak initial message if audio is not muted
    if (!isAudioMuted) {
      voiceService.speak(
        initialMsg.text,
        user.learningLanguage,
        avatar.voicePitch,
        avatar.voiceRate,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }

    return () => {
      voiceService.stopListening();
      voiceService.stopSpeaking();
    };
  }, [avatar.id, activeMissionId, activeConversationMode, user.learningLanguage]);

  // Handle user speech-to-text trigger
  const handleToggleVoice = () => {
    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      if (liveTranscript.trim()) {
        submitUserMessage(liveTranscript.trim());
        setLiveTranscript('');
      }
      return;
    }

    // Stop speaking if AI is talking
    voiceService.stopSpeaking();
    setIsSpeaking(false);

    setLiveTranscript('');
    setIsListening(true);

    const started = voiceService.startListening(
      user.learningLanguage,
      (transcript, isFinal) => {
        setLiveTranscript(transcript);
        if (isFinal) {
          setIsListening(false);
          submitUserMessage(transcript);
          setLiveTranscript('');
        }
      },
      (err) => {
        setIsListening(false);
        showNotification(err);
      },
      () => {
        setIsListening(false);
      }
    );

    if (!started) {
      setIsListening(false);
    }
  };

  // Submit User Message to server AI
  const submitUserMessage = async (text: string) => {
    if (!text.trim() || isLoadingAI) return;

    // Check free limit
    if (user.subscriptionStatus === 'free' && sessionMinutes >= 10) {
      setIsUpgradeModalOpen(true);
      showNotification(t.freeConversationsLeft);
      return;
    }

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoadingAI(true);

    // Call server AI endpoint
    try {
      const response = await fetch('/api/ai/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          avatar,
          userLevel: user.currentLevel,
          scenario: activeScenario || currentMission.scenario,
          mode: activeConversationMode,
          learningLanguage: targetLangInfo.name,
          userGoals: user.learningGoals,
          memories: user.memories,
        }),
      });

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: 'ai-msg-' + Date.now(),
        sender: 'ai',
        text: data.reply || "That's very interesting! Tell me more.",
        translatedText: data.translatedReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pronunciationScore: data.speakingScore || 85,
        corrections: data.grammarIssues || [],
        vocabSuggestions: data.vocabularySuggestions || [],
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Update feedback sidebar state
      if (data.grammarIssues && data.grammarIssues.length > 0) {
        setLatestCorrection(data.grammarIssues[0]);
        setLatestGrammarTip(data.grammarIssues[0].explanation);
        addMemory({
          type: 'grammar_mistake',
          detail: `${data.grammarIssues[0].original} -> ${data.grammarIssues[0].better}`,
          timestamp: new Date().toISOString(),
          count: 1,
        });
      }

      if (data.speakingScore) {
        setLatestPronunciationScore(data.speakingScore);
      }

      if (data.vocabularySuggestions) {
        setVocabSuggestions(data.vocabularySuggestions);
      }

      if (data.suggestedQuickReplies) {
        setSuggestedReplies(data.suggestedQuickReplies);
      }

      if (data.comprehensionQuestion) {
        setComprehensionCheck(data.comprehensionQuestion);
      }

      // Award XP for spoken interaction
      addXp(15);

      // Play audio response through speech synthesis
      if (!isAudioMuted) {
        voiceService.speak(
          data.reply,
          user.learningLanguage,
          avatar.voicePitch,
          avatar.voiceRate,
          () => setIsSpeaking(true),
          () => setIsSpeaking(false)
        );
      }
    } catch (e) {
      console.warn('AI conversation failed, fallback simulated:', e);
      const fallbackMsg: ChatMessage = {
        id: 'ai-fallback-' + Date.now(),
        sender: 'ai',
        text: "I completely understand what you mean. Could you explain what you'd like to do next?",
        translatedText: "Je comprends tout à fait. Que souhaitez-vous faire ensuite ?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      addXp(10);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleKeyboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    submitUserMessage(inputText);
    setInputText('');
  };

  // Replay AI audio
  const handleReplayLatest = () => {
    const lastAIMsg = [...messages].reverse().find((m) => m.sender === 'ai');
    if (lastAIMsg) {
      voiceService.speak(
        lastAIMsg.text,
        user.learningLanguage,
        avatar.voicePitch,
        avatar.voiceRate,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  const lastAIMessage = [...messages].reverse().find((m) => m.sender === 'ai') || messages[0];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
      {/* Sub-Header bar with Streak, Level, and Mode */}
      <div className="flex items-center justify-between px-6 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
              Level {user.currentLevel}
            </span>
          </div>

          {/* Mode Selector */}
          <div className="hidden sm:flex items-center gap-1 text-slate-500">
            {(['free', 'guided', 'roleplay', 'interview', 'debate', 'story'] as ConversationMode[]).map(
              (m) => (
                <button
                  key={m}
                  onClick={() => setActiveConversationMode(m)}
                  className={`px-2.5 py-0.5 rounded-full capitalize font-medium transition-colors ${
                    activeConversationMode === m
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                      : 'hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {m}
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isAudioMuted ? 'Unmute AI voice' : 'Mute AI voice'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
          </button>

          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-800/60">
            <span className="text-amber-600">🔥</span>
            <span className="font-bold text-amber-800 dark:text-amber-400">{user.streak} Day Streak</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Artistic Flair Workspace */}
      <main className="flex flex-1 overflow-hidden">
        {/* LEFT ASIDE: LIVE FEEDBACK & MISSION OBJECTIVE */}
        <aside className="hidden lg:flex w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex-col gap-6 overflow-y-auto">
          {/* Section: Live Feedback */}
          <section>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
              Live Feedback
            </h3>
            <div className="space-y-4">
              {/* Pronunciation Card */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    Pronunciation
                  </span>
                  {latestPronunciationScore !== null && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 underline">
                      {latestPronunciationScore}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed italic">
                  {latestPronunciationScore !== null
                    ? 'Clear rhythm and tempo. Analyzed in real time.'
                    : 'Parlez au micro pour analyser votre prononciation et votre accent en direct.'}
                </p>
                <button
                  onClick={() => setActiveView('pronunciation-coach')}
                  className="mt-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Phonetics Coach</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Grammar Tip Card */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-800/50">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                    Grammar Tip
                  </span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                  {latestCorrection ? (
                    <>
                      Instead of <span className="line-through text-rose-500">"{latestCorrection.original}"</span>, try saying{' '}
                      <span className="font-bold underline">"{latestCorrection.better}"</span>. {latestCorrection.explanation}
                    </>
                  ) : latestGrammarTip ? (
                    latestGrammarTip
                  ) : (
                    "Exprimez-vous librement. Vos conseils de grammaire et reformulations s'afficheront ici."
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Section: Current Mission */}
          <section className="mt-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
              Current Mission
            </h3>
            <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                {currentMission.title}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mb-3">
                Objective: {currentMission.objective}
              </p>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, messages.length * 20)}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-slate-400">
                <span>Progress</span>
                <span>{Math.min(100, messages.length * 20)}%</span>
              </div>
            </div>
          </section>

          {/* Vocabulary Suggestions */}
          {vocabSuggestions.length > 0 && (
            <section>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
                Upgraded Words
              </h3>
              <div className="space-y-2">
                {vocabSuggestions.slice(0, 2).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700"
                  >
                    <div className="font-bold text-slate-800 dark:text-slate-200">{item.word}</div>
                    <div className="text-[11px] text-slate-500">{item.translation}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bottom Upgrade CTA */}
          <div className="mt-auto pt-4">
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="w-full py-3.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-bold text-xs shadow-xl hover:bg-black dark:hover:bg-white transition-all"
            >
              Upgrade to Premium
            </button>
          </div>
        </aside>

        {/* CENTER SECTION: ARTISTIC FLAIR STAGE */}
        <section className="flex-1 flex flex-col relative bg-slate-50 dark:bg-slate-950 overflow-y-auto">
          {/* Main Stage: Avatar + Dialogue */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center space-y-8 max-w-3xl mx-auto w-full">
            {/* Circular Artistic Avatar */}
            <div
              className="relative group cursor-pointer"
              onClick={handleReplayLatest}
              title="Click to replay audio"
            >
              {/* Indigo Glow Blur Backdrop */}
              <div
                className={`absolute inset-0 bg-indigo-500 rounded-full blur-3xl transition-opacity duration-500 ${
                  isSpeaking ? 'opacity-30 scale-110 animate-pulse' : 'opacity-10 group-hover:opacity-20'
                }`}
              />

              {/* 12px White Border Frame */}
              <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-white dark:bg-slate-800 border-[12px] border-white dark:border-slate-800 shadow-2xl relative z-10 overflow-hidden flex items-center justify-center">
                <img
                  src={avatar.avatarUrl}
                  alt={avatar.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ${
                    isSpeaking ? 'scale-105' : 'group-hover:scale-102'
                  }`}
                />
                {/* Visual Speaking Pulse Ring */}
                {isSpeaking && (
                  <div className="absolute inset-0 border-4 border-indigo-400/60 rounded-full animate-ping pointer-events-none" />
                )}
              </div>

              {/* Name pill centered at bottom */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 px-6 py-2 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 z-20 flex items-center whitespace-nowrap">
                <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {avatar.name.toUpperCase()}
                </span>
                <span className="text-[10px] ml-2 text-indigo-500 font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isSpeaking ? 'Speaking' : 'Active'}
                </span>
              </div>
            </div>

            {/* Spoken Dialogue Text in Artistic Serif Italic */}
            <div className="w-full max-w-xl text-center space-y-4 pt-4">
              <div className="space-y-2">
                <p className="text-slate-400 text-xs font-mono tracking-widest uppercase">
                  {isLoadingAI
                    ? `${avatar.name} is thinking...`
                    : isSpeaking
                    ? `${avatar.name} is speaking...`
                    : `${avatar.name}'s response`}
                </p>

                {/* Main Quote in Newsreader Serif Italic */}
                <h2 className="text-xl sm:text-2xl font-medium text-slate-800 dark:text-slate-100 leading-snug font-serif italic">
                  "{lastAIMessage?.text || 'Hello! Ready to speak?'}"
                </h2>

                {/* Subtitle Translation */}
                {lastAIMessage?.translatedText && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 italic max-w-md mx-auto">
                    {lastAIMessage.translatedText}
                  </p>
                )}
              </div>

              {/* Audio Wave Bars */}
              <div className="flex items-center justify-center gap-1.5 h-8">
                <div
                  className={`w-1 rounded-full transition-all ${
                    isSpeaking ? 'h-4 bg-indigo-300 dark:bg-indigo-400 animate-pulse' : 'h-1.5 bg-slate-200 dark:bg-slate-700'
                  }`}
                />
                <div
                  className={`w-1 rounded-full transition-all ${
                    isSpeaking ? 'h-8 bg-indigo-400 dark:bg-indigo-500 animate-pulse' : 'h-2 bg-slate-200 dark:bg-slate-700'
                  }`}
                />
                <div
                  className={`w-1 rounded-full transition-all ${
                    isSpeaking ? 'h-6 bg-indigo-500 dark:bg-indigo-400 animate-pulse' : 'h-1.5 bg-slate-200 dark:bg-slate-700'
                  }`}
                />
                <div
                  className={`w-1 rounded-full transition-all ${
                    isSpeaking ? 'h-10 bg-indigo-600 dark:bg-indigo-300 animate-pulse' : 'h-3 bg-slate-200 dark:bg-slate-700'
                  }`}
                />
                <div
                  className={`w-1 rounded-full transition-all ${
                    isSpeaking ? 'h-4 bg-indigo-400 dark:bg-indigo-500 animate-pulse' : 'h-1.5 bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              </div>

              {/* Live transcript while listening */}
              {isListening && (
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 animate-in fade-in">
                  <span className="font-bold">Listening: </span>
                  <span className="italic">{liveTranscript || 'Speak your sentence now...'}</span>
                </div>
              )}

              {/* Quick Starter Replies */}
              {!isListening && suggestedReplies.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  {suggestedReplies.map((reply, i) => (
                    <button
                      key={i}
                      onClick={() => submitUserMessage(reply)}
                      className="text-xs py-1.5 px-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:text-indigo-600 transition-colors shadow-sm"
                    >
                      💡 {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ARTISTIC BOTTOM INPUT PILL */}
          <div className="p-6 sm:p-8 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent">
            {isKeyboardMode ? (
              /* Text Input Form */
              <form
                onSubmit={handleKeyboardSubmit}
                className="max-w-2xl mx-auto flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800"
              >
                <button
                  type="button"
                  onClick={() => setIsKeyboardMode(false)}
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
                  title="Switch to voice mode"
                >
                  <Mic className="w-5 h-5 text-indigo-600" />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Type your reply in ${targetLangInfo.name}...`}
                  className="flex-1 px-4 py-2 bg-transparent text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            ) : (
              /* Voice Input Pill */
              <div className="max-w-2xl mx-auto flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setIsKeyboardMode(true)}
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
                  title="Switch to keyboard typing"
                >
                  <Keyboard className="w-5 h-5" />
                </button>

                <div className="flex-1 px-4 text-slate-400 italic text-sm select-none">
                  {isListening ? (
                    <span className="text-rose-500 font-semibold animate-pulse">
                      Listening to your voice in {targetLangInfo.name}...
                    </span>
                  ) : (
                    `Tap microphone to speak in ${targetLangInfo.name}...`
                  )}
                </div>

                <button
                  onClick={handleToggleVoice}
                  className={`w-14 h-14 flex items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0 ${
                    isListening
                      ? 'bg-rose-500 shadow-rose-300 ring-4 ring-rose-300 animate-pulse'
                      : 'bg-indigo-600 shadow-indigo-200'
                  }`}
                  aria-label={isListening ? 'Stop Speaking' : 'Start Speaking'}
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
              </div>
            )}

            <p className="text-center mt-4 text-[10px] text-slate-400 uppercase tracking-widest">
              Tap mic to speak • Practice spontaneous fluency
            </p>
          </div>
        </section>

        {/* RIGHT ASIDE: QUICK TOOL RAIL */}
        <aside className="w-16 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col items-center py-8 gap-8 shrink-0">
          {/* Switch Character */}
          <button
            onClick={() => setActiveView('my-character')}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="My AI Character"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[9px] text-slate-400 group-hover:text-indigo-600">Avatar</span>
          </button>

          {/* Missions */}
          <button
            onClick={() => setActiveView('missions')}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="Roleplay Missions"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[9px] text-slate-400 group-hover:text-indigo-600">Missions</span>
          </button>

          {/* Pronunciation Tool */}
          <button
            onClick={() => setActiveView('pronunciation-coach')}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="Phonetics Coach"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Mic className="w-4 h-4" />
            </div>
            <span className="text-[9px] text-slate-400 group-hover:text-indigo-600">Coach</span>
          </button>

          {/* Exit / Return to Dashboard */}
          <button
            onClick={() => setActiveView('dashboard')}
            className="mt-auto mb-2 flex flex-col items-center gap-1 group cursor-pointer"
            title="Exit Session"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </div>
            <span className="text-[9px] text-slate-400 group-hover:text-rose-600">Exit</span>
          </button>
        </aside>
      </main>
    </div>
  );
};
