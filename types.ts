
export enum Role {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  image?: string; // Base64 string
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
  userId?: string; // Added for Firebase query
}

export type SubscriptionPlan = 'none' | 'free' | 'pro' | 'lifetime';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subscriptionPlan: SubscriptionPlan;
  isPro: boolean;
  tokens: number;
  isAdmin?: boolean; // New: Admin Flag
  isBanned?: boolean; // New: Ban Flag
  joinedAt?: number;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  globalAlert: string | null;
  allowImageGen: boolean;
  allowRegistration: boolean;
}

export interface SystemLog {
  id?: string;
  type: 'INFO' | 'ACTION' | 'AUTH' | 'ERROR';
  message: string;
  timestamp?: number;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  subscribe: (plan: SubscriptionPlan) => void;
  deductTokens: (amount: number) => boolean;
  loginAsDev: () => void; // New: Dev Mode Bypass
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}
