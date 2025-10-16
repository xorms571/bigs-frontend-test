'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { Page } from '@/types/common';
import { fetchWithTokenRefresh } from '@/utils/api';
import { useHydration } from '../hooks/useHydration';

function BoardsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useUserStore();
  const [boardsPage, setBoardsPage] = useState<Page | null>(null);
  const [error, setError] = useState('');
  const hydrated = useHydration();

  const page = searchParams.get('page') ?? '0';
  const size = searchParams.get('size') ?? '10';

  useEffect(() => {
    if (!hydrated) return;

    const fetchBoards = async () => {
      try {
        const res = await fetchWithTokenRefresh(`/api/boards?page=${page}&size=${size}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }, router);

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
  }, [page, size, accessToken, router, hydrated]);

  const handlePageChange = (newPage: number) => {
    router.push(`/boards?page=${newPage}&size=${size}`);
  };

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Link href="/boards/new" className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          글쓰기
        </Link>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {boardsPage?.content.map((board) => (
              <tr key={board.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{board.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{board.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link href={`/boards/${board.id}`} className="text-indigo-600 hover:text-indigo-900">
                    {board.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(board.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {boardsPage && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => handlePageChange(boardsPage.number - 1)}
            disabled={boardsPage.first}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>
          <span className="text-sm text-gray-700">
            Page {boardsPage.number + 1} of {boardsPage.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(boardsPage.number + 1)}
            disabled={boardsPage.last}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}

export default function BoardsPage() {
  return (
    <Suspense fallback={<div>Loading boards...</div>}>
      <BoardsContent />
    </Suspense>
  );
}