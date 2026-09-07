import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Users,
  Activity,
  Cpu,
  DollarSign,
  TrendingUp,
  Server,
  Zap,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { user } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span>System Administration & AI Analytics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor real-time AI conversation volume, CEFR learner distribution, token usage, and system health.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Total Learners</span>
            <Users className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">14,892</div>
          <div className="text-[11px] text-emerald-600 font-semibold">+18.4% this month</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Active Conversations</span>
            <Activity className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">1,248</div>
          <div className="text-[11px] text-slate-500">Live Voice Streams</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Gemini AI Latency</span>
            <Cpu className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">320ms</div>
          <div className="text-[11px] text-emerald-600 font-semibold">Healthy (p95)</div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-xs font-semibold text-slate-400 flex items-center justify-between">
            <span>Monthly Revenue</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">$48,240</div>
          <div className="text-[11px] text-emerald-600 font-semibold">+12% MRR</div>
        </div>
      </div>

      {/* CEFR Distribution & AI Model Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CEFR Level distribution */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Learner CEFR Distribution
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>A1 Beginner</span>
                <span>28% (4,170 users)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>A2 Elementary</span>
                <span>34% (5,063 users)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '34%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>B1 Intermediate</span>
                <span>22% (3,276 users)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '22%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>B2 Upper-Intermediate</span>
                <span>11% (1,638 users)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '11%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>C1 / C2 Advanced & Mastery</span>
                <span>5% (745 users)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '5%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Server & AI Endpoint Telemetry */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-500" />
            <span>AI Architecture & Model Pipelines</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  gemini-2.5-flash (Conversation Core)
                </div>
                <div className="text-[11px] text-slate-400">Low-latency streaming & memory recall</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold border border-emerald-200">
                Online
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  Phonetics Scorer & Formant Parser
                </div>
                <div className="text-[11px] text-slate-400">Acoustic syllable evaluation engine</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold border border-emerald-200">
                Online
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-100">
                  Express API Proxy Layer
                </div>
                <div className="text-[11px] text-slate-400">Server-side key shielding (/api/ai/*)</div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold border border-emerald-200">
                Secure
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
