'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Board } from '@/types/common';
import { fetchWithTokenRefresh } from '@/utils/api';
import { useHydration } from '@/hooks/useHydration';
import Button from '@/components/Button';
import Title from '@/components/Title';

interface BoardDetailProps {
  boardId: string;
  apiBaseUrl: string | undefined;
  initialData?: Board | null;
}

export default function BoardDetail({ boardId, apiBaseUrl, initialData }: BoardDetailProps) {
  const router = useRouter();
  const hydrated = useHydration();

  // prop으로부터 상태 초기화
  const [board, setBoard] = useState<Board | null>(initialData || null);
  const [error, setError] = useState('');
  // 초기 데이터 유무에 따라 로딩 상태 설정
  const [isLoading, setIsLoading] = useState(!initialData);

  useEffect(() => {
    if (!hydrated) return;
    // 폴백: 서버에서 데이터 제공에 실패한 경우, 클라이언트에서 데이터를 조회합니다.
    if (!initialData && boardId) {
      const fetchBoard = async () => {
        setIsLoading(true);
        try {
          const res = await fetchWithTokenRefresh(`/api/boards/${boardId}`, {}, router);
          if (!res.ok) {
            throw new Error('게시글을 불러오는 데 실패했습니다.');
          }
          const data = await res.json();
          setBoard(data);
        } catch (err: unknown) {
          setError((err as Error).message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBoard();
    }
  }, [boardId, router, initialData, hydrated]);

  const handleDelete = async () => {
    if (!board) return;

    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const res = await fetchWithTokenRefresh(`/api/boards/${board.id}`, {
        method: 'DELETE',
      }, router);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '삭제에 실패했습니다.');
      }

      alert('게시글이 삭제되었습니다.');
      router.push('/boards');
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      alert(`오류: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <><Title>오류</Title><p className="text-red-600">{error}</p></>;
  }

  if (!board) {
    return <p>게시글을 찾을 수 없습니다.</p>;
  }

  const fullImageUrl = board.imageUrl ? `${apiBaseUrl}${board.imageUrl}` : null;

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500">카테고리: {board.boardCategory}</p>
          <Title>{board.title}</Title>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">작성일: {new Date(board.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <hr className="my-6 text-gray-300" />

      <div className="prose max-w-none text-gray-500 min-h-96">
        {fullImageUrl && (
          <img src={fullImageUrl} alt={`${board.id} img`} className="my-4 max-w-full h-auto" />
        )}
        <p style={{ whiteSpace: 'pre-wrap' }}>{board.content}</p>
      </div>

      <hr className="my-6 text-gray-300" />

      <div className="flex justify-end space-x-4">
        <Button onClick={() => router.push('/boards')} variant='secondary'>
          목록으로
        </Button>
        <Button onClick={() => router.push(`/boards/${board.id}/edit`)}>
          수정
        </Button>
        <Button
          onClick={handleDelete}
          variant='danger'
        >
          삭제
        </Button>
      </div>
    </>
  );
}