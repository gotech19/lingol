import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, Check, X, Volume2, Shield } from 'lucide-react';
import { voiceService } from '../services/voiceService';

export const MicPermissionModal: React.FC = () => {
  const { user, isMicModalOpen, setIsMicModalOpen, showNotification } = useApp();
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testHeardText, setTestHeardText] = useState('');

  if (!isMicModalOpen) return null;

  const handleTestMicrophone = () => {
    setTestStatus('testing');
    setTestHeardText('');

    const started = voiceService.startListening(
      user.learningLanguage,
      (transcript, isFinal) => {
        setTestHeardText(transcript);
        if (isFinal || transcript.length > 2) {
          setTestStatus('success');
          voiceService.stopListening();
        }
      },
      (err) => {
        setTestStatus('failed');
        showNotification(err);
      },
      () => {
        if (testStatus === 'testing' && !testHeardText) {
          setTestStatus('idle');
        }
      }
    );

    if (!started) {
      setTestStatus('failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
        <button
          onClick={() => {
            voiceService.stopListening();
            setIsMicModalOpen(false);
          }}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 mb-4">
            <Mic className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Microphone Access for Spoken Practice
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            LinGoL uses your microphone to transcribe your speech, coach your pronunciation, and hold natural back-and-forth conversations with your AI character.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="mt-5 space-y-2.5 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Real-time voice-to-text with auto accent detection</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Phoneme & syllable stress analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>Your audio is processed strictly for language coaching</span>
          </div>
        </div>

        {/* Test Section */}
        <div className="mt-5 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-4 text-center">
          {testStatus === 'idle' && (
            <p className="text-xs text-slate-500">
              Click below and say: <span className="font-semibold text-indigo-600 dark:text-indigo-400">"Hello LinGoL"</span>
            </p>
          )}

          {testStatus === 'testing' && (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center animate-pulse">
                <Volume2 className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-rose-500 animate-pulse">Listening... Speak now</p>
            </div>
          )}

          {testStatus === 'success' && (
            <div className="flex flex-col items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold">Microphone working perfectly!</p>
              {testHeardText && (
                <p className="text-xs italic text-slate-600 dark:text-slate-300">"{testHeardText}"</p>
              )}
            </div>
          )}

          {testStatus === 'failed' && (
            <div className="flex flex-col items-center gap-1 text-rose-500">
              <MicOff className="w-6 h-6" />
              <p className="text-xs font-semibold">Microphone unavailable</p>
              <p className="text-[11px] text-slate-500">
                You can still practice anytime by typing in the chat!
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          {testStatus !== 'testing' ? (
            <button
              onClick={handleTestMicrophone}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Test Microphone
            </button>
          ) : (
            <button
              onClick={() => voiceService.stopListening()}
              className="flex-1 py-2.5 px-4 rounded-xl bg-rose-100 text-rose-700 font-semibold text-xs"
            >
              Stop Test
            </button>
          )}

          <button
            onClick={() => {
              voiceService.stopListening();
              setIsMicModalOpen(false);
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors"
          >
            Ready to Practice
          </button>
        </div>
      </div>
    </div>
  );
};
