import { Suspense } from 'react';
import { headers } from 'next/headers';
import { Page } from '@/types/common';
import BoardsList from '@/app/boards/components/BoardsList';

async function getBoards(page: string, size: string): Promise<Page | null> {
  const headersData = await headers();

  if (!headersData.get('cookie')?.includes('accessToken')) {
    return null;
  }
  
  try {
    const headersList = new Headers(headersData);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/boards?page=${page}&size=${size}`, {
      headers: headersList,
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`SSR 게시글 조회 실패, 상태 코드: ${res.status}`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error('SSR 게시글 조회 중 오류 발생:', error);
    return null;
  }
}

export default async function BoardsPage({ searchParams }: { searchParams: Promise<{ page?: string; size?: string; }> }) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ?? '0';
  const size = resolvedSearchParams.size ?? '10';
  const initialBoardsPage = await getBoards(page, size);

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <BoardsList initialBoardsPage={initialBoardsPage} />
    </Suspense>
  );
}