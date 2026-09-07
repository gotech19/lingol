import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations';
import { Check, Crown, Sparkles, X, Shield, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

export const UpgradeModal: React.FC = () => {
  const { user, isUpgradeModalOpen, setIsUpgradeModalOpen, upgradeSubscription } = useApp();
  const t = getTranslation(user.interfaceLanguage);

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isUpgradeModalOpen) return null;

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      const success = await upgradeSubscription(billingCycle);
      if (success) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    { text: 'Unlimited daily AI voice conversations', highlight: true },
    { text: 'Access all 9 AI Avatars (Daniel, Sophia, Leo, Lina, etc.)', highlight: true },
    { text: 'All Real-Life Missions (Business Meeting, Job Interview)', highlight: true },
    { text: 'Acoustic Pronunciation & Syllable Stress Coach', highlight: false },
    { text: 'Personalized 3-Week CEFR Learning Roadmap', highlight: false },
    { text: 'Detailed Grammar & Syntax Explanations', highlight: false },
    { text: 'Priority Gemini Flash server processing', highlight: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsUpgradeModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with gradient badge */}
        <div className="pt-8 pb-6 px-6 sm:px-8 text-center bg-gradient-to-b from-indigo-50/70 via-indigo-50/20 to-transparent dark:from-indigo-950/40 dark:via-indigo-950/10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-extrabold tracking-wide uppercase shadow-md shadow-amber-500/30 mb-3">
            <Crown className="w-4 h-4" />
            <span>LinGoL Premium</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Speak Your Target Language Confidently
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {t.unlockUnlimited}
          </p>

          {/* Billing Switch */}
          <div className="mt-6 inline-flex p-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`py-1.5 px-4 rounded-full text-xs font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.monthlyBilling} (€9.99/mo)
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`relative py-1.5 px-4 rounded-full text-xs font-semibold transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>{t.yearlyBilling} (€79.99/yr)</span>
              <span className="ml-1 px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded text-[10px] font-bold">
                {t.savePercent}
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="px-6 sm:px-8 py-2 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">
              {billingCycle === 'yearly' ? '€6.66' : '€9.99'}
            </span>
            <span className="text-sm font-medium text-slate-500">/ month</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {billingCycle === 'yearly' ? 'Billed annually at €79.99/year. Cancel anytime.' : 'Billed monthly. Cancel anytime.'}
          </p>
        </div>

        {/* Feature List */}
        <div className="px-6 sm:px-8 py-4 space-y-2.5">
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  feat.highlight
                    ? 'bg-indigo-600 text-white'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
              </div>
              <span
                className={`${
                  feat.highlight
                    ? 'font-semibold text-slate-900 dark:text-slate-100'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {feat.text}
              </span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="p-6 sm:px-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
          <button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Start 7-Day Free Trial & Upgrade</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              Secure 256-bit encryption
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Instant activation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
