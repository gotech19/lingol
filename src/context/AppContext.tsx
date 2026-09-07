import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  AIAvatar,
  InterfaceLanguage,
  LearningLanguage,
  ConversationMode,
  UserMemoryItem,
} from '../types';
import { AVATARS_CATALOG, getAvatarById } from '../data/avatars';
import { authService, initialDefaultProfile } from '../services/firebaseConfig';
import { isRTL } from '../translations';

export type AppView =
  | 'landing'
  | 'onboarding'
  | 'dashboard'
  | 'conversation'
  | 'pronunciation-coach'
  | 'learning-path'
  | 'lesson'
  | 'missions'
  | 'mission-detail'
  | 'my-character'
  | 'progress'
  | 'subscription'
  | 'admin'
  | 'settings'
  | 'privacy'
  | 'terms'
  | 'help';

interface AppContextType {
  user: UserProfile;
  avatar: AIAvatar;
  customAvatars: AIAvatar[];
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  activeMissionId: string | null;
  setActiveMissionId: (id: string | null) => void;
  activeLessonId: string | null;
  setActiveLessonId: (id: string | null) => void;
  activeConversationMode: ConversationMode;
  setActiveConversationMode: (mode: ConversationMode) => void;
  activeScenario: string;
  setActiveScenario: (scenario: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isMicModalOpen: boolean;
  setIsMicModalOpen: (open: boolean) => void;
  notificationMessage: string | null;
  notification?: string | null;
  showNotification: (msg: string) => void;
  updateUser: (partial: Partial<UserProfile>) => void;
  startLevelTest: (targetLang?: LearningLanguage) => void;
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string, xpReward: number) => void;
  completeMission: (missionId: string, xpReward: number) => void;
  addMemory: (memory: UserMemoryItem) => void;
  setInterfaceLanguage: (lang: InterfaceLanguage) => void;
  setLearningLanguage: (lang: LearningLanguage) => void;
  setSelectedAvatar: (avatarId: string) => void;
  updateAvatarCustomization: (avatar: AIAvatar) => void;
  upgradeSubscription: (plan: 'monthly' | 'yearly') => Promise<boolean>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => authService.getCurrentUserProfile());
  const [customAvatars, setCustomAvatars] = useState<AIAvatar[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lingol_custom_avatars');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return AVATARS_CATALOG;
  });

  const [activeViewState, setActiveViewState] = useState<AppView>(() => {
    const current = authService.getCurrentUserProfile();
    if (!current.isAuthenticated) {
      return 'landing';
    }
    if (!current.hasCompletedLevelTest) {
      return 'onboarding';
    }
    return 'dashboard';
  });

  const setActiveView = (view: AppView) => {
    // If user is not authenticated:
    if (!user.isAuthenticated && view !== 'landing') {
      setIsAuthModalOpen(true);
      showNotification('Inscription obligatoire ou authentification par Google requise.');
      setActiveViewState('landing');
      return;
    }

    // If user is authenticated, but hasn't completed the mandatory level assessment:
    if (user.isAuthenticated && !user.hasCompletedLevelTest && view !== 'onboarding' && view !== 'landing') {
      showNotification('Test de niveau obligatoire au démarrage : veuillez calibrer votre niveau CECR.');
      setActiveViewState('onboarding');
      return;
    }

    setActiveViewState(view);
  };

  const startLevelTest = (targetLang?: LearningLanguage) => {
    if (targetLang) {
      updateUser({ learningLanguage: targetLang });
    }
    setActiveViewState('onboarding');
  };

  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeConversationMode, setActiveConversationMode] = useState<ConversationMode>('free');
  const [activeScenario, setActiveScenario] = useState<string>('Casual conversation in a cafe');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('lingol_theme') === 'dark';
    }
    return false;
  });

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMicModalOpen, setIsMicModalOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Apply dark mode class and RTL direction
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (isDarkMode) {
        root.classList.add('dark');
        localStorage.setItem('lingol_theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('lingol_theme', 'light');
      }
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = isRTL(user.interfaceLanguage) ? 'rtl' : 'ltr';
      document.documentElement.lang = user.interfaceLanguage;
    }
  }, [user.interfaceLanguage]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const showNotification = (msg: string) => {
    setNotificationMessage(msg);
    setTimeout(() => {
      setNotificationMessage(null);
    }, 4000);
  };

  const updateUser = (partial: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...partial };
      authService.saveUserProfile(updated);
      return updated;
    });
  };

  const addXp = (amount: number) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      const updated = { ...prev, xp: newXp };
      authService.saveUserProfile(updated);
      showNotification(`+${amount} XP earned! Total: ${newXp} XP`);
      return updated;
    });
  };

  const completeLesson = (lessonId: string, xpReward: number) => {
    setUser((prev) => {
      const completed = prev.completedLessons.includes(lessonId)
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId];
      const newXp = prev.xp + xpReward;
      const updated = {
        ...prev,
        completedLessons: completed,
        xp: newXp,
        dailyMinutesPracticed: prev.dailyMinutesPracticed + 5,
      };
      authService.saveUserProfile(updated);
      showNotification(`Lesson completed! +${xpReward} XP`);
      return updated;
    });
  };

  const completeMission = (missionId: string, xpReward: number) => {
    setUser((prev) => {
      const completed = prev.completedMissions.includes(missionId)
        ? prev.completedMissions
        : [...prev.completedMissions, missionId];
      const newXp = prev.xp + xpReward;
      const updated = {
        ...prev,
        completedMissions: completed,
        xp: newXp,
        dailyMinutesPracticed: prev.dailyMinutesPracticed + 10,
      };
      authService.saveUserProfile(updated);
      showNotification(`Mission Accomplished! +${xpReward} XP`);
      return updated;
    });
  };

  const addMemory = (memory: UserMemoryItem) => {
    setUser((prev) => {
      const existing = prev.memories.find((m) => m.detail.toLowerCase() === memory.detail.toLowerCase());
      let updatedMemories: UserMemoryItem[];
      if (existing) {
        updatedMemories = prev.memories.map((m) =>
          m.detail.toLowerCase() === memory.detail.toLowerCase() ? { ...m, count: m.count + 1 } : m
        );
      } else {
        updatedMemories = [memory, ...prev.memories].slice(0, 20);
      }
      const updated = { ...prev, memories: updatedMemories };
      authService.saveUserProfile(updated);
      return updated;
    });
  };

  const setInterfaceLanguage = (lang: InterfaceLanguage) => {
    updateUser({ interfaceLanguage: lang });
  };

  const setLearningLanguage = (lang: LearningLanguage) => {
    updateUser({ learningLanguage: lang });
    showNotification(`Learning language switched to ${lang.toUpperCase()}`);
  };

  const setSelectedAvatar = (avatarId: string) => {
    updateUser({ selectedAvatarId: avatarId });
    const av = customAvatars.find((a) => a.id === avatarId) || getAvatarById(avatarId);
    showNotification(`Your active AI partner is now ${av.name}`);
  };

  const updateAvatarCustomization = (updatedAvatar: AIAvatar) => {
    setCustomAvatars((prev) => {
      const index = prev.findIndex((a) => a.id === updatedAvatar.id);
      let nextList = [...prev];
      if (index >= 0) {
        nextList[index] = updatedAvatar;
      } else {
        nextList.push(updatedAvatar);
      }
      localStorage.setItem('lingol_custom_avatars', JSON.stringify(nextList));
      return nextList;
    });
    showNotification(`${updatedAvatar.name}'s personality and voice settings updated!`);
  };

  const upgradeSubscription = async (plan: 'monthly' | 'yearly'): Promise<boolean> => {
    try {
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, plan }),
      });
      const data = await response.json();
      if (data.success) {
        updateUser({
          subscriptionStatus: 'premium',
          subscriptionPlan: plan,
        });
        showNotification(`Welcome to LinGoL Premium (${plan})! Unlimited AI talking unlocked.`);
        setIsUpgradeModalOpen(false);
        return true;
      }
    } catch (e) {
      console.warn('Backend upgrade failed, falling back to local grant:', e);
      updateUser({
        subscriptionStatus: 'premium',
        subscriptionPlan: plan,
      });
      showNotification(`LinGoL Premium unlocked!`);
      setIsUpgradeModalOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    authService.logout();
    setUser(initialDefaultProfile);
    setActiveViewState('landing');
    showNotification('Déconnexion réussie.');
  };

  const activeAvatar = customAvatars.find((a) => a.id === user.selectedAvatarId) || getAvatarById(user.selectedAvatarId);

  return (
    <AppContext.Provider
      value={{
        user,
        avatar: activeAvatar,
        customAvatars,
        activeView: activeViewState,
        setActiveView,
        startLevelTest,
        activeMissionId,
        setActiveMissionId,
        activeLessonId,
        setActiveLessonId,
        activeConversationMode,
        setActiveConversationMode,
        activeScenario,
        setActiveScenario,
        isDarkMode,
        toggleDarkMode,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isMicModalOpen,
        setIsMicModalOpen,
        notificationMessage,
        notification: notificationMessage,
        showNotification,
        updateUser,
        addXp,
        completeLesson,
        completeMission,
        addMemory,
        setInterfaceLanguage,
        setLearningLanguage,
        setSelectedAvatar,
        updateAvatarCustomization,
        upgradeSubscription,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
