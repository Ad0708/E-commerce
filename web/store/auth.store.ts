// stores/authStore.ts
import { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      clearAuth: () => set({ user: null }),
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ user: state.user }), // Only persist user
    }
  )
);