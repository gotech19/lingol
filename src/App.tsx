import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { UpgradeModal } from './components/UpgradeModal';
import { AuthModal } from './components/AuthModal';
import { MicPermissionModal } from './components/MicPermissionModal';

// Views
import { LandingView } from './views/LandingView';
import { OnboardingView } from './views/OnboardingView';
import { DashboardView } from './views/DashboardView';
import { ConversationView } from './views/ConversationView';
import { PronunciationCoachView } from './views/PronunciationCoachView';
import { LearningPathView } from './views/LearningPathView';
import { LessonView } from './views/LessonView';
import { MissionsView } from './views/MissionsView';
import { MyCharacterView } from './views/MyCharacterView';
import { ProgressView } from './views/ProgressView';
import { SubscriptionView } from './views/SubscriptionView';
import { SettingsView } from './views/SettingsView';
import { AdminView } from './views/AdminView';

const MainContent: React.FC = () => {
  const {
    activeView,
    notification,
    isUpgradeModalOpen,
    setIsUpgradeModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isMicModalOpen,
    setIsMicModalOpen,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === 'landing' && <LandingView />}
        {activeView === 'onboarding' && <OnboardingView />}
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'conversation' && <ConversationView />}
        {activeView === 'pronunciation-coach' && <PronunciationCoachView />}
        {activeView === 'learning-path' && <LearningPathView />}
        {activeView === 'lesson' && <LessonView />}
        {activeView === 'missions' && <MissionsView />}
        {activeView === 'my-character' && <MyCharacterView />}
        {activeView === 'progress' && <ProgressView />}
        {activeView === 'subscription' && <SubscriptionView />}
        {activeView === 'settings' && <SettingsView />}
        {activeView === 'admin' && <AdminView />}
      </main>

      {/* Bottom Mobile Navigation (on mobile screens only) */}
      <MobileNav />

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-5 duration-200 border border-slate-700 dark:border-slate-300 flex items-center gap-2">
          <span>✨</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Global Modals */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <MicPermissionModal
        isOpen={isMicModalOpen}
        onClose={() => setIsMicModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
