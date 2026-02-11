
export enum UserType {
  INDIVIDUAL = 'INDIVIDUAL',
  ORGANIZATION = 'ORGANIZATION'
}

export enum AppLanguage {
  ENGLISH = 'EN',
  KISWAHILI = 'SW',
  RUNYANKORE = 'NY',
  CHIGA = 'CH',
  LUGANDA = 'LG'
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  district: string;
  points: number;
  avatar?: string;
  location?: string;
  age?: number;
  occupation?: string;
  phoneNumber?: string;
  contactPerson?: string;
  joinedDate?: string;
  totalFootprintReduction?: number;
  language?: AppLanguage;
  isPremium?: boolean;
  
  // Organization-specific fields
  organizationName?: string;
  website?: string;
  organizationSize?: string;
}

export interface Activity {
  id: string;
  category: 'Transport' | 'Energy' | 'Food' | 'Shopping';
  subcategory: string;
  description: string;
  value: number;
  unit: string;
  co2e: number;
  timestamp: string;
  details?: Record<string, any>;
  isSynced?: boolean; // New field for offline tracking
}

export interface DailyFootprint {
  date: string;
  transport: number;
  energy: number;
  food: number;
  shopping: number;
  total: number;
}

export interface Recommendation {
  id?: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  potentialSaving: number;
  icon?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  userProgress: number;
  target: number;
  daysRemaining: number;
  category: string;
  points: number;
  image: string;
  isJoined?: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  views: number;
  likes: number;
  duration: string;
  author: string;
  isLiked?: boolean;
}

export interface GroundedResult {
  title: string;
  uri: string;
  snippet?: string;
}
