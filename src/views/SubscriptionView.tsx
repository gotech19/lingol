import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTranslation } from '../translations';
import { Check, Sparkles, Crown, Zap, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SubscriptionView: React.FC = () => {
  const { user, updateUser, showNotification } = useApp();
  const t = getTranslation(user.interfaceLanguage);

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const handleSelectPlan = async (plan: 'pro' | 'unlimited') => {
    try {
      const res = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          billingCycle,
          userId: user.id,
        }),
      });
      const data = await res.json();
      updateUser({ subscriptionStatus: plan });
      confetti({ particleCount: 100, spread: 70 });
      showNotification(`Upgraded to ${plan.toUpperCase()} plan successfully!`);
    } catch (e) {
      updateUser({ subscriptionStatus: plan });
      confetti({ particleCount: 100, spread: 70 });
      showNotification(`Upgraded to ${plan.toUpperCase()}!`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
          <Crown className="w-3.5 h-3.5 text-amber-500" />
          <span>LinGoL Premium Membership</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
          Accelerate Your Fluency with Premium
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Unlock unlimited speaking time with your AI companions, advanced phonetics coaching, and all real-life simulation missions.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 mt-4">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow'
                : 'text-slate-500'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow'
                : 'text-slate-500'
            }`}
          >
            <span>Yearly</span>
            <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-extrabold">
              Save 40%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Free Plan */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Starter Free</h3>
              <p className="text-xs text-slate-500 mt-1">Foundational daily practice</p>
            </div>

            <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">$0</div>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>10 minutes AI speaking per day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>1 AI Character (Emma)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Basic grammar corrections</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <span className="w-4 h-4 text-center">✕</span>
                <span>Advanced Phonetics Coach</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              disabled={user.subscriptionStatus === 'free'}
              className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-50"
            >
              {user.subscriptionStatus === 'free' ? 'Current Plan' : 'Downgrade'}
            </button>
          </div>
        </div>

        {/* Pro Plan (Highlighted) */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-600 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Most Popular
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">LinGoL Pro</h3>
              <p className="text-xs text-slate-500 mt-1">For dedicated language learners</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                {billingCycle === 'yearly' ? '$9.99' : '$14.99'}
              </span>
              <span className="text-xs text-slate-500">/ month</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2">
              <li className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100">
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Unlimited daily speaking practice</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>All 6 AI Characters unlocked</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Full Acoustic Phonetics Analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>All Real-Life Missions & Scenarios</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Persistent Long-term Memory</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => handleSelectPlan('pro')}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all"
            >
              {user.subscriptionStatus === 'pro' ? 'Active Plan' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>

        {/* Unlimited / Lifetime */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Polyglot Master</h3>
              <p className="text-xs text-slate-500 mt-1">Multi-language complete mastery</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">
                {billingCycle === 'yearly' ? '$18.99' : '$24.99'}
              </span>
              <span className="text-xs text-slate-500">/ month</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Unlimited Languages simultaneously</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Custom Persona & Voice Cloning</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0" />
                <span>CEFR Official Assessment Certificate</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={() => handleSelectPlan('unlimited')}
              className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-all"
            >
              {user.subscriptionStatus === 'unlimited' ? 'Active Plan' : 'Choose Polyglot'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
