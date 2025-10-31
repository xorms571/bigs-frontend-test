import { headers } from 'next/headers';
import { Board } from '@/types/common';
import { Suspense } from 'react';
import BoardDetail from '@/app/boards/components/BoardDetail';
import Container from '@/components/Container';

async function getBoardDetail(id: string): Promise<Board | null> {
  const headersData = await headers();
  try {
    const headersList = new Headers(headersData);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/boards/${id}`, {
      headers: headersList,
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error('게시글 상세 정보 조회 실패:', error);
    return null;
  }
}

export default async function BoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const initialData = await getBoardDetail(id);
  const apiBaseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL;

  return (
    <Suspense fallback={<div>페이지 로딩 중...</div>}>
      <Container className='min-h-96'>
        <BoardDetail boardId={id} apiBaseUrl={apiBaseUrl} initialData={initialData} />
      </Container>
    </Suspense>
  );
}