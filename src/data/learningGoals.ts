import { LearningGoal } from '../types';

export const LEARNING_GOALS_LIST: LearningGoal[] = [
  {
    id: 'work',
    title: 'Work & Professional',
    description: 'Lead standups, participate in team syncs, write emails, and present ideas clearly.',
    icon: 'Briefcase',
    topics: ['Meetings', 'Presentations', 'Emails', 'Phone calls', 'Professional conversations'],
  },
  {
    id: 'education',
    title: 'Education & Study Abroad',
    description: 'Prepare for university lectures, seminars, academic papers, and exams (IELTS/TOEFL/DELF).',
    icon: 'GraduationCap',
    topics: ['University', 'Classes', 'Exams', 'Academic vocabulary', 'Presentations'],
  },
  {
    id: 'travel',
    title: 'Travel & Exploration',
    description: 'Navigate airports, order delicious food, book boutique hotels, and connect with locals.',
    icon: 'Plane',
    topics: ['Airport', 'Hotel', 'Restaurant', 'Taxi', 'Shopping', 'Directions'],
  },
  {
    id: 'business',
    title: 'Business & Negotiation',
    description: 'Negotiate deals, close contracts, handle difficult clients, and attend international expos.',
    icon: 'TrendingUp',
    topics: ['Negotiation', 'Sales', 'Customers', 'Management', 'Networking'],
  },
  {
    id: 'daily_life',
    title: 'Daily Life & Social',
    description: 'Chat effortlessly with neighbors, make close friends, discuss movies, and enjoy casual talk.',
    icon: 'Coffee',
    topics: ['Family', 'Friends', 'Shopping', 'Social conversations', 'Hobbies & Culture'],
  },
  {
    id: 'interview',
    title: 'Job Interview Mastery',
    description: 'Ace behavioral questions, showcase achievements, and speak with executive confidence.',
    icon: 'UserCheck',
    topics: ['Introduction', 'Behavioral questions', 'Professional vocabulary', 'Salary negotiation', 'Mock simulation'],
  },
];
