import { LearningLanguage, InterfaceLanguage } from '../types';

export interface LanguageInfo {
  code: LearningLanguage;
  name: string;
  nativeName: string;
  flag: string;
  speechCode: string;
  sampleGreeting: string;
  popularTopics: string[];
}

export const SUPPORTED_LEARNING_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    speechCode: 'en-US',
    sampleGreeting: 'Hello, nice to meet you!',
    popularTopics: ['Casual Conversation', 'Work & Tech', 'Travel & Hotel', 'Job Interviews'],
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    speechCode: 'fr-FR',
    sampleGreeting: 'Bonjour, ravi de faire votre connaissance !',
    popularTopics: ['Café & Dining', 'Culture & Arts', 'Daily Routine', 'Polite Expressions'],
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    speechCode: 'es-ES',
    sampleGreeting: '¡Hola! ¿Cómo estás hoy?',
    popularTopics: ['Ordering Tapas', 'Travel in Spain & LatAm', 'Making Friends', 'Subjunctive Rules'],
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    speechCode: 'de-DE',
    sampleGreeting: 'Hallo! Wie geht es dir?',
    popularTopics: ['Train & Directions', 'Business Meetings', 'Daily Life', 'Grammar Cases'],
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    speechCode: 'it-IT',
    sampleGreeting: 'Ciao! Piacere di conoscerti!',
    popularTopics: ['Italian Cuisine', 'Art & History', 'Family & Friendship', 'Passato Prossimo'],
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    speechCode: 'pt-BR',
    sampleGreeting: 'Olá! Como você está?',
    popularTopics: ['Travel & Beach', 'Music & Festivities', 'Workplace', 'Pronunciation Drills'],
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    speechCode: 'ar-SA',
    sampleGreeting: 'مرحباً بك! يسعدني التحدث معك اليوم.',
    popularTopics: ['Hospitality & Greetings', 'Markets & Shopping', 'Business & Culture', 'Dialects & MSA'],
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文 (Mandarin)',
    flag: '🇨🇳',
    speechCode: 'zh-CN',
    sampleGreeting: '你好！很高兴认识你！',
    popularTopics: ['Pinyin & Tones', 'Restaurants & Ordering', 'Tech & Business', 'Everyday Phrases'],
  },
];

export const INTERFACE_LANGUAGES: { code: InterfaceLanguage; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

export function getLanguageInfo(code: LearningLanguage): LanguageInfo {
  return SUPPORTED_LEARNING_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LEARNING_LANGUAGES[0];
}
