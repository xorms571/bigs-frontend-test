import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  name: string;
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User, accessToken: string) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user, accessToken) => set({ user, accessToken }),
      clearUser: () => set({ user: null, accessToken: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
