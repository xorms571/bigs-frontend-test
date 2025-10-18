import { useUserStore } from '@/store/userStore';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export async function fetchWithTokenRefresh(url: string, options: RequestInit = {}, router: AppRouterInstance): Promise<Response> {
  const { clearUser } = useUserStore.getState();

  let res = await fetch(url, {
    ...options,
  });

  if (res.status === 401) {
    console.log('토큰 만료, 갱신 시도 중...');
    const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });

    if (!refreshRes.ok) {
      console.log('토큰 갱신 실패, 사용자 정보 삭제 후 로그인 페이지로 이동.');
      clearUser();
      router.push('/login');
      throw new Error('토큰 갱신에 실패했습니다.');
    }

    console.log('토큰 갱신 성공.');
    res = await fetch(url, {
      ...options,
    });
  }

  return res;
}
