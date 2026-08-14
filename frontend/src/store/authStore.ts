import { create } from 'zustand';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: 'CUSTOMER' | 'KITCHEN_OWNER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const safeParseUser = (): User | null => {
  try {
    const item = localStorage.getItem('kitchora_user');
    if (!item || item === 'undefined') return null;
    return JSON.parse(item);
  } catch (e) {
    localStorage.removeItem('kitchora_user');
    return null;
  }
};

const safeGetToken = (): string | null => {
  try {
    const item = localStorage.getItem('kitchora_token');
    if (!item || item === 'undefined') return null;
    return item;
  } catch (e) {
    localStorage.removeItem('kitchora_token');
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: safeParseUser(),
  token: safeGetToken(),
  setAuth: (user, token) => {
    try {
      localStorage.setItem('kitchora_user', JSON.stringify(user));
      localStorage.setItem('kitchora_token', token);
    } catch (e) {}
    set({ user, token });
  },
  logout: () => {
    try {
      localStorage.removeItem('kitchora_user');
      localStorage.removeItem('kitchora_token');
    } catch (e) {}
    set({ user: null, token: null });
  },
}));
