import { Lesson, CEFRLevel } from '../types';

export interface DetailedLesson extends Lesson {
  estimatedMinutes: number;
  vocabulary: { term: string; phonetic: string; meaning: string; example: string }[];
  dialogue: { speaker: string; text: string; translation: string }[];
}

export const LESSONS_DATABASE: DetailedLesson[] = [
  {
    id: 'lesson-vocab-1',
    title: 'Essential Travel & Airport Vocabulary',
    category: 'vocabulary',
    level: 'A2',
    durationMinutes: 8,
    estimatedMinutes: 8,
    xpReward: 40,
    description: 'Master key terms for boarding passes, gate changes, baggage claims, and customs.',
    vocabulary: [
      {
        term: 'Boarding pass',
        phonetic: '/ˈbɔː.dɪŋ ˌpɑːs/',
        meaning: 'A document provided by an airline allowing a passenger into the aircraft.',
        example: 'Please have your passport and boarding pass ready.',
      },
      {
        term: 'Baggage reclaim',
        phonetic: '/ˈbæɡ.ɪdʒ rɪˌkleɪm/',
        meaning: 'The carousel area where arriving passengers collect luggage.',
        example: 'Our flight luggage is at baggage reclaim belt 4.',
      },
      {
        term: 'Carry-on luggage',
        phonetic: '/ˈkær.i.ɒn ˈlʌɡ.ɪdʒ/',
        meaning: 'Bags that passengers are permitted to take into the cabin.',
        example: 'Ensure your carry-on luggage fits overhead.',
      },
      {
        term: 'Layover',
        phonetic: '/ˈleɪˌoʊ.vər/',
        meaning: 'A brief connection period before continuing a long flight.',
        example: 'We have a pleasant two-hour layover in Frankfurt.',
      },
    ],
    dialogue: [
      { speaker: 'Officer', text: 'Good morning. May I see your passport and boarding pass?', translation: 'Bonjour. Puis-je voir votre passeport et carte d’embarquement ?' },
      { speaker: 'You', text: 'Of course, here you go. Is the gate still B14?', translation: 'Bien sûr, les voici. La porte est-elle toujours B14 ?' },
      { speaker: 'Officer', text: 'Yes, boarding begins in twenty minutes. Have a great flight!', translation: 'Oui, l’embarquement commence dans vingt minutes. Bon vol !' },
    ],
  },
  {
    id: 'lesson-grammar-1',
    title: 'Past Tense Mastery in Conversation',
    category: 'grammar',
    level: 'B1',
    durationMinutes: 10,
    estimatedMinutes: 10,
    xpReward: 50,
    description: 'Share your weekend, personal anecdotes, and travels naturally without confusing past simple and present perfect.',
    vocabulary: [
      {
        term: 'Yesterday',
        phonetic: '/ˈjɛs.tər.deɪ/',
        meaning: 'The day before today (always requires Past Simple).',
        example: 'I arrived yesterday evening.',
      },
      {
        term: 'Have visited',
        phonetic: '/hæv ˈvɪz.ɪ.tɪd/',
        meaning: 'Present perfect indicating life experience with no fixed past time.',
        example: 'I have visited Japan three times.',
      },
      {
        term: 'Used to',
        phonetic: '/juːst tuː/',
        meaning: 'Habits or states in the past that are no longer true.',
        example: 'I used to live in Barcelona.',
      },
    ],
    dialogue: [
      { speaker: 'Partner', text: 'What did you do last weekend?', translation: 'Qu’as-tu fait le week-end dernier ?' },
      { speaker: 'You', text: 'I went hiking in the national park and visited an art gallery.', translation: 'Je suis allé faire de la randonnée et j’ai visité une galerie d’art.' },
      { speaker: 'Partner', text: 'That sounds delightful! Have you ever hiked there before?', translation: 'Ça a l’air superbe ! Y avais-tu déjà randonné ?' },
      { speaker: 'You', text: 'No, that was my first time.', translation: 'Non, c’était ma première fois.' },
    ],
  },
  {
    id: 'lesson-listening-1',
    title: 'Cafe Conversation & Rapid Speech',
    category: 'listening',
    level: 'A2',
    durationMinutes: 7,
    estimatedMinutes: 7,
    xpReward: 35,
    description: 'Listen to a natural dialogue between an artisan barista and a customer placing an order.',
    vocabulary: [
      {
        term: 'Flat white',
        phonetic: '/flæt waɪt/',
        meaning: 'An espresso-based coffee drink with steamed microfoam milk.',
        example: 'Can I get a double flat white with oat milk?',
      },
      {
        term: 'To go / Takeaway',
        phonetic: '/tə ɡoʊ/',
        meaning: 'Ordered to consume outside the cafe.',
        example: 'Is that for here or to go?',
      },
    ],
    dialogue: [
      { speaker: 'Barista', text: 'Welcome! What can I make for you today?', translation: 'Bienvenue ! Que puis-je vous servir aujourd’hui ?' },
      { speaker: 'You', text: 'Hi! Could I have an oat flat white and an almond croissant please?', translation: 'Bonjour ! Pourrais-je avoir un flat white à l’avoine et un croissant aux amandes ?' },
      { speaker: 'Barista', text: 'Sure thing, that comes to $6.50.', translation: 'Bien sûr, cela fera 6,50 $.' },
    ],
  },
  {
    id: 'lesson-speaking-1',
    title: 'Introducing Yourself with Natural Rhythm',
    category: 'speaking',
    level: 'A1',
    durationMinutes: 6,
    estimatedMinutes: 6,
    xpReward: 45,
    description: 'Practice greeting people, sharing where you are from, and talking about your passions using clear pronunciation.',
    vocabulary: [
      {
        term: 'Pleased to meet you',
        phonetic: '/pliːzd tuː miːt juː/',
        meaning: 'Polite greeting when meeting someone for the first time.',
        example: 'It is a pleasure to meet you in person.',
      },
      {
        term: 'Currently based in',
        phonetic: '/ˈkɜː.rənt.li beɪst ɪn/',
        meaning: 'Living or working in a specific city at present.',
        example: 'I am currently based in Paris.',
      },
    ],
    dialogue: [
      { speaker: 'Host', text: 'Hello! I am Emma. What is your name?', translation: 'Bonjour ! Je m’appelle Emma. Quel est votre nom ?' },
      { speaker: 'You', text: 'Hi Emma! My name is Alex, and I am learning English for my career.', translation: 'Bonjour Emma ! Je m’appelle Alex, et j’apprends l’anglais pour ma carrière.' },
      { speaker: 'Host', text: 'Wonderful to meet you Alex! Let us practice together.', translation: 'Ravi de vous rencontrer Alex ! Pratiquons ensemble.' },
    ],
  },
  {
    id: 'lesson-pronunciation-1',
    title: 'The Tricky "TH" & Vowel Lengths',
    category: 'pronunciation',
    level: 'B1',
    durationMinutes: 8,
    estimatedMinutes: 8,
    xpReward: 40,
    description: 'Differentiate voiced and voiceless dental fricatives ("think" vs. "this") and master minimal vowel pairs.',
    vocabulary: [
      {
        term: 'Thought /θɔːt/',
        phonetic: '/θɔːt/',
        meaning: 'Voiceless dental fricative with gentle air between front teeth.',
        example: 'I had a thoughtful discussion yesterday.',
      },
      {
        term: 'Though /ðoʊ/',
        phonetic: '/ðoʊ/',
        meaning: 'Voiced dental fricative with vibrating vocal cords.',
        example: 'Even though it was raining, we walked outside.',
      },
    ],
    dialogue: [
      { speaker: 'Coach', text: 'Try saying: "Thirty-three thousand feathers on the weather vane."', translation: 'Essayez de dire : "Trente-trois mille plumes sur la girouette."' },
      { speaker: 'You', text: 'Thirty-three thousand feathers on the weather vane.', translation: 'Trente-trois mille plumes sur la girouette.' },
      { speaker: 'Coach', text: 'Superb! Your dental fricative placement was spot on.', translation: 'Superbe ! Votre placement dental fricatif était parfait.' },
    ],
  },
];

export const SAMPLE_LESSONS: Lesson[] = LESSONS_DATABASE;

export interface CurriculumUnit {
  id: string;
  title: string;
  level: CEFRLevel;
  description: string;
  lessonIds: string[];
}

export const CURRICULUM_UNITS: CurriculumUnit[] = [
  {
    id: 'unit-1',
    title: 'Unit 1: First Interactions & Daily Essentials',
    level: 'A1',
    description: 'Establish foundational greetings, polite questions, and daily conversational patterns.',
    lessonIds: ['lesson-speaking-1', 'lesson-listening-1'],
  },
  {
    id: 'unit-2',
    title: 'Unit 2: Navigating the City & Travel Situations',
    level: 'A2',
    description: 'Order food, navigate transit hubs, and handle hotel reservations with confidence.',
    lessonIds: ['lesson-vocab-1', 'lesson-listening-1'],
  },
  {
    id: 'unit-3',
    title: 'Unit 3: Expressing Past Stories & Phonetic Nuance',
    level: 'B1',
    description: 'Fluidly talk about your background, career experiences, and refine your English accent.',
    lessonIds: ['lesson-grammar-1', 'lesson-pronunciation-1'],
  },
];
