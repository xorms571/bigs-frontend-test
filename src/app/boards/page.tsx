'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Page } from '@/types/common';
import { fetchWithTokenRefresh } from '@/utils/api';
import { useHydration } from '@/hooks/useHydration';
import Container from '@/components/Container';
import Button from '@/components/Button';
import Title from '@/components/Title';

function BoardsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [boardsPage, setBoardsPage] = useState<Page | null>(null);
  const [error, setError] = useState('');
  const hydrated = useHydration();

  const page = searchParams.get('page') ?? '0';
  const size = searchParams.get('size') ?? '10';

  useEffect(() => {
    if (!hydrated) return;

    const fetchBoards = async () => {
      try {
        const res = await fetchWithTokenRefresh(`/api/boards?page=${page}&size=${size}`, {}, router);

        if (!res.ok) {
          throw new Error('게시글 목록을 불러오는 데 실패했습니다.');
        }

        const data = await res.json();
        setBoardsPage(data);
      } catch (err: unknown) {
        setError((err as Error).message);
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
      {error && <p className="text-red-600">{error}</p>}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 hidden md:table-header-group">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {boardsPage?.content.map((board) => (
                <tr key={board.id} className="block md:table-row p-4 md:p-0 hover:bg-gray-50">
                  <td className="flex items-center md:table-cell md:px-6 md:py-4 md:whitespace-nowrap text-sm">
                    <span className="font-bold text-gray-700 md:hidden mr-2">ID:</span>
                    <span className="font-medium text-gray-900">{board.id}</span>
                  </td>
                  <td className="flex items-center mt-2 md:table-cell md:px-6 md:py-4 md:whitespace-nowrap text-sm text-gray-500">
                    <span className="font-bold text-gray-700 md:hidden mr-2">카테고리:</span>
                    {board.category}
                  </td>
                  <td className="pt-2 md:mt-0 md:table-cell md:px-6 md:py-4 text-sm text-gray-500">
                    <span className="font-bold text-gray-700 md:hidden mr-2">제목:</span>
                    <Link href={`/boards/${board.id}`} className="text-indigo-600 hover:text-indigo-900">
                      {board.title}
                    </Link>
                  </td>
                  <td className="flex items-center mt-2 md:mt-0 md:table-cell md:px-6 md:py-4 md:whitespace-nowrap text-sm text-gray-500">
                    <span className="font-bold text-gray-700 md:hidden mr-2">작성일:</span>
                    {new Date(board.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {boardsPage && (
        <div className="flex items-center justify-between mt-6">
          <Button
            onClick={() => handlePageChange(boardsPage.number - 1)}
            disabled={boardsPage.first}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
            variant='secondary'
          >
            이전
          </Button>
          <span className="text-sm text-gray-700">
            Page {boardsPage.number + 1} of {boardsPage.totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(boardsPage.number + 1)}
            disabled={boardsPage.last}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
            variant='secondary'
          >
            다음
          </Button>
        </div>
      )}
    </Container>
  );
}

export default function BoardsPage() {
  return (
    <Suspense fallback={<div>Loading boards...</div>}>
      <BoardsContent />
    </Suspense>
  );
}