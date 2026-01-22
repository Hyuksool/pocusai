
export type Role = 'user' | 'model';
export type PocusMode = 'adult' | 'pediatric';
export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string; // Only for local mock auth
  status: UserStatus;
  isAdmin: boolean;
  createdAt: number;
  // Professional Metadata
  occupation?: string;
  introduction?: string;
  purpose?: string;
  referral?: string;
}

export type AuthView = 'login' | 'signup' | 'admin' | 'app';

export interface Message {
  id: string;
  role: Role;
  text: string;
  image?: string; // Base64 data URI string
  timestamp: number;
  isError?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
  mode: PocusMode;
}

export interface AnalyticsData {
  topicCounts: Record<string, number>;
  hourlyUsage: Record<number, number>; // 0-23
  totalMessages: number;
  lastActive: number;
}

export interface UiTranslation {
  welcome: string;
  commonTopics: string;
  placeholder: string;
  disclaimer: string;
  donate: string;
  history: string;
  newChat: string;
  noHistory: string;
  selectMode: string;
  adultLabel: string;
  pediatricLabel: string;
  quickActions: {
    adult: QuickAction[];
    pediatric: QuickAction[];
  };
}

export interface QuickAction {
  label: string;
  query: string;
}
