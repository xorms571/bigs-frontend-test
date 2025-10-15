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
        console.log('setUser 호출됨, 리프레시 타이머 시작 시도.');
        get().startRefreshTokenTimer();
      },
      clearUser: () => {
        set({ user: null, accessToken: null });
        console.log('clearUser 호출됨, 리프레시 타이머 중지 시도.');
        get().stopRefreshTokenTimer();
      },
      refreshAccessToken: async () => {
        console.log('refreshAccessToken 호출됨.');
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('쿠키를 통해 액세스 토큰이 성공적으로 갱신되었습니다.');
          } else {
            // 갱신 실패 시, 사용자 데이터 지우기 (로그아웃)
            console.error('액세스 토큰 갱신에 실패했습니다. 로그아웃합니다. 상태 코드:', response.status);
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
          console.log('기존 리프레시 타이머 중지됨.');
        }
        // 테스트를 위해 50초마다 토큰 갱신
        refreshTokenTimer = setInterval(() => {
          console.log('리프레시 타이머 틱: refreshAccessToken 호출.');
          get().refreshAccessToken();
        }, 50 * 1000); // 50초
        console.log('리프레시 토큰 타이머가 시작되었습니다.');
      },
      stopRefreshTokenTimer: () => {
        if (refreshTokenTimer) {
          clearInterval(refreshTokenTimer);
          refreshTokenTimer = null;
          console.log('리프레시 타이머 중지됨.');
        }
        console.log('리프레시 토큰 타이머가 중지되었습니다.');
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        // 스토어가 다시 로드될 때, 사용자가 존재하면 타이머를 다시 시작합니다.
        console.log('onRehydrateStorage 호출됨.');
        if (state?.accessToken) {
          console.log('accessToken 존재, 리프레시 타이머 재시작 시도.');
          state.startRefreshTokenTimer();
        }
      },
    }
  )
);
