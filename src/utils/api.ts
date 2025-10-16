import { useUserStore } from '../store/userStore';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export async function fetchWithTokenRefresh(url: string, options: RequestInit = {}, router: AppRouterInstance): Promise<Response> {
  const { accessToken, clearUser, setUser, user } = useUserStore.getState();

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status === 401) {
    console.log('토큰 만료, 갱신 시도 중...');
    const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
    const refreshData = await refreshRes.json();

    if (!refreshRes.ok) {
      console.log('토큰 갱신 실패, 사용자 정보 삭제 후 로그인 페이지로 이동.');
      clearUser();
      router.push('/login');
      throw new Error('토큰 갱신에 실패했습니다.');
    }

    if (refreshData.accessToken) {
      console.log('토큰 갱신 성공.');
      if (user) {
        setUser(user, refreshData.accessToken);
      }
      // 새 토큰으로 원본 요청 재시도
      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${refreshData.accessToken}`,
        },
      });
    } else {
      console.log('갱신 응답에 새 토큰 없음, 사용자 정보 삭제 후 로그인 페이지로 이동.');
      clearUser();
      router.push('/login');
      throw new Error('갱신 후 새 액세스 토큰이 없습니다.');
    }
  }

  return res;
}
