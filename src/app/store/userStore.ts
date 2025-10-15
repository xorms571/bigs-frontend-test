import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  username: string;
  name: string;
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User, accessToken: string) => void;
  clearUser: () => void;
  refreshAccessToken: () => Promise<void>;
  startRefreshTokenTimer: () => void;
  stopRefreshTokenTimer: () => void;
}

let refreshTokenTimer: NodeJS.Timeout | null = null;

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      setUser: (user, accessToken) => {
        set({ user, accessToken });
        get().startRefreshTokenTimer();
      },
      clearUser: () => {
        set({ user: null, accessToken: null });
        get().stopRefreshTokenTimer();
      },
      refreshAccessToken: async () => {
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            // 쿠키를 통해 액세스 토큰이 성공적으로 갱신되었습니다.
          } else {
            // 갱신 실패 시, 사용자 데이터 지우기 (로그아웃)
            get().clearUser();
          }
        } catch (error) {
          console.error('액세스 토큰 갱신 중 오류 발생:', error);
          get().clearUser(); // 네트워크 오류 시에도 지우기
        }
      },
      startRefreshTokenTimer: () => {
        if (refreshTokenTimer) {
          clearInterval(refreshTokenTimer);
        }
        // 프로덕션 환경에서는 55분마다 토큰 갱신 (액세스 토큰 만료 1시간 전)
        refreshTokenTimer = setInterval(() => {
          get().refreshAccessToken();
        }, 55 * 60 * 1000); // 55분
      },
      stopRefreshTokenTimer: () => {
        if (refreshTokenTimer) {
          clearInterval(refreshTokenTimer);
          refreshTokenTimer = null;
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        // 스토어가 다시 로드될 때, 사용자가 존재하면 타이머를 다시 시작합니다.
        if (state?.accessToken) {
          state.startRefreshTokenTimer();
        }
      },
    }
  )
);
