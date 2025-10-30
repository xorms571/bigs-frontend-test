'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchWithTokenRefresh } from '@/utils/api';
import { useHydration } from '@/hooks/useHydration';
import { Page } from '@/types/common';
import Container from '@/components/Container';
import Button from '@/components/Button';
import Title from '@/components/Title';
import BoardTable from '@/app/boards/BoardTable';
import Pagination from '@/app/boards/Pagination';

type Status = 'loading' | 'error' | 'success';

export default function BoardsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrated = useHydration();

  const [boardsPage, setBoardsPage] = useState<Page | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<Status>('loading');

  const page = searchParams.get('page') ?? '0';
  const size = searchParams.get('size') ?? '10';

  useEffect(() => {
    if (!hydrated) return;
    setStatus('loading');
    const fetchBoards = async () => {
      try {
        const res = await fetchWithTokenRefresh(`/api/boards?page=${page}&size=${size}`, {}, router);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || '게시글 목록을 불러오는 데 실패했습니다.');
        }
        const data = await res.json();
        setBoardsPage(data);
        setStatus('success');
      } catch (err: unknown) {
        setError((err as Error).message);
        setStatus('error');
      }
    };

    fetchBoards();
  }, [page, size, router, hydrated]);

  const handlePageChange = (newPage: number) => {
    router.push(`/boards?page=${newPage}&size=${size}`);
  };

  return (
    <Container>
      <div className='flex justify-between items-center mb-6'>
        <Title>게시판</Title>
        <Button onClick={() => router.push('/boards/new')}>
          글쓰기
        </Button>
      </div>

      {status === 'loading' && <div>Loading...</div>}
      {status === 'error' && <p className="text-red-600">{error}</p>}
      {status === 'success' && boardsPage && (
        <>
          <BoardTable boards={boardsPage.content} />
          {boardsPage.totalPages > 1 && (
            <Pagination
              currentPage={boardsPage.number}
              totalPages={boardsPage.totalPages}
              isFirst={boardsPage.first}
              isLast={boardsPage.last}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </Container>
  );
}
