'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchWithTokenRefresh } from '@/utils/api';
import { Page } from '@/types/common';
import Container from '@/components/Container';
import Button from '@/components/Button';
import Title from '@/components/Title';
import BoardTable from '@/app/boards/components/BoardTable';
import Pagination from '@/app/boards/components/Pagination';
import { useHydration } from '@/hooks/useHydration';

type Status = 'loading' | 'error' | 'success';

interface BoardsListProps {
  initialBoardsPage: Page | null;
}

export default function BoardsList({ initialBoardsPage }: BoardsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrated = useHydration();

  const [boardsPage, setBoardsPage] = useState<Page | null>(initialBoardsPage);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<Status>(initialBoardsPage ? 'success' : 'loading');

  const page = searchParams.get('page') ?? '0';
  const size = searchParams.get('size') ?? '10';

  useEffect(() => {
    if (!hydrated) return;
    const serverPage = initialBoardsPage?.number.toString();

    // 현재 URL의 페이지가 서버에서 최초로 렌더링된 페이지와 다를 경우, 새로운 데이터를 조회합니다.
    if (page !== serverPage) {
      const fetchBoards = async () => {
        setStatus('loading');
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
    } else {
      // 그렇지 않다면(URL 페이지와 서버 렌더링 페이지가 같다면), 상태를 서버에서 제공한 원본 데이터로 유지합니다.
      setBoardsPage(initialBoardsPage);
      setStatus(initialBoardsPage ? 'success' : 'loading');
    }
  }, [page, size, router, initialBoardsPage, hydrated]);

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

      {status === 'loading' && <div>로딩 중...</div>}
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
