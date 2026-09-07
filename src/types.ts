export type InterfaceLanguage = 'en' | 'fr' | 'ar';

export type LearningLanguage = 'en' | 'fr' | 'es' | 'de' | 'it' | 'pt' | 'ar' | 'zh';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type PersonalityType =
  | 'Friendly'
  | 'Professional'
  | 'Funny'
  | 'Motivating'
  | 'Patient'
  | 'Strict Teacher'
  | 'Casual Friend';

export type ConversationMode =
  | 'free'
  | 'guided'
  | 'roleplay'
  | 'interview'
  | 'debate'
  | 'story';

export type LearningGoalId =
  | 'work'
  | 'education'
  | 'travel'
  | 'business'
  | 'daily_life'
  | 'interview';

export interface LearningGoal {
  id: LearningGoalId;
  title: string;
  description: string;
  icon: string;
  topics: string[];
}

export interface AIAvatar {
  id: string;
  name: string;
  title: string;
  role: string;
  avatarUrl: string;
  bannerColor: string;
  personality: PersonalityType;
  voiceName: string;
  voicePitch: number; // 0.5 to 1.5
  voiceRate: number; // 0.7 to 1.3
  speakingStyle: string;
  difficultyLevel: CEFRLevel;
  bio: string;
  specialty?: string;
  nativeLanguages: string[];
  isPremium?: boolean;
}

export interface UserMemoryItem {
  type: 'grammar_mistake' | 'vocab_difficulty' | 'pronunciation_issue' | 'topic_interest';
  detail: string;
  timestamp: string;
  count: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  isAuthenticated: boolean;
  hasCompletedLevelTest: boolean;
  levelTestScore?: number;
  levelTestDate?: string;
  interfaceLanguage: InterfaceLanguage;
  learningLanguage: LearningLanguage;
  currentLevel: CEFRLevel;
  targetLevel: CEFRLevel;
  selectedAvatarId: string;
  learningGoals: LearningGoalId[];
  xp: number;
  streak: number;
  completedLessons: string[];
  completedMissions: string[];
  pronunciationScore: number;
  listeningScore: number;
  speakingScore: number;
  grammarScore: number;
  vocabularyScore: number;
  subscriptionStatus: 'free' | 'premium';
  subscriptionPlan?: 'monthly' | 'yearly';
  dailyMinutesPracticed: number;
  dailyMinutesGoal: number;
  memories: UserMemoryItem[];
  role?: 'user' | 'moderator' | 'admin';
  createdAt: string;
  lastLoginAt: string;
}

export interface CorrectionItem {
  original: string;
  better: string;
  explanation: string;
}

export interface VocabSuggestion {
  word: string;
  translation: string;
  example: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  translatedText?: string;
  audioUrl?: string;
  timestamp: string;
  pronunciationScore?: number;
  corrections?: CorrectionItem[];
  vocabSuggestions?: VocabSuggestion[];
  pronunciationTips?: string[];
}

export interface AssessmentQuestion {
  id: string;
  type: 'vocabulary' | 'grammar' | 'reading' | 'listening' | 'speaking';
  level: CEFRLevel;
  prompt: string;
  audioPromptText?: string;
  passage?: string;
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  expectedSpokenKeywords?: string[];
}

export interface AssessmentResult {
  estimatedLevel: CEFRLevel;
  overallScore: number;
  speakingScore: number;
  listeningScore: number;
  grammarScore: number;
  vocabularyScore: number;
  pronunciationScore: number;
  summaryFeedback: string;
  personalizedPlan: {
    week: number;
    title: string;
    focus: string;
    items: string[];
  }[];
}

export interface Mission {
  id: string;
  title: string;
  category: 'Travel' | 'Daily' | 'Business' | 'Social' | 'Career';
  scenario: string;
  objective: string;
  targetVocabulary: { word: string; translation: string }[];
  initialAIMessage: string;
  level: CEFRLevel;
  rewardXp: number;
  isPremium?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  category: 'vocabulary' | 'grammar' | 'listening' | 'speaking' | 'review' | 'pronunciation';
  level: CEFRLevel;
  durationMinutes: number;
  xpReward: number;
  description: string;
  flashcards?: { word: string; phonetic: string; translation: string; sentence: string }[];
  vocabulary?: { term: string; phonetic: string; meaning: string; example: string }[];
  dialogue?: { speaker: string; text: string; translation: string }[];
  grammarNotes?: { rule: string; explanation: string; examples: string[] };
  audioScript?: string;
  questions?: { question: string; options: string[]; answer: number }[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}
