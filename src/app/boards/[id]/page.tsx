'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/store/userStore';
import { Board } from '@/types/common';
import { fetchWithTokenRefresh } from '@/utils/api';

const EXTERNAL_API_BASE_URL = process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL;

export default function BoardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { accessToken } = useUserStore();

  const [board, setBoard] = useState<Board | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchBoard = async () => {
        try {
          const res = await fetchWithTokenRefresh(`/api/boards/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }, router);
          if (!res.ok) {
            throw new Error('게시글을 불러오는 데 실패했습니다.');
          }
          const data = await res.json();
          setBoard(data);
        } catch (err: unknown) {
          setError((err as Error).message);
        }
      };
      fetchBoard();
    }
  }, [id, accessToken, router]);

  const handleDelete = async () => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const res = await fetchWithTokenRefresh(`/api/boards/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }, router);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || '삭제에 실패했습니다.');
      }

      alert('게시글이 삭제되었습니다.');
      router.push('/boards');
    } catch (err: unknown) {
      setError((err as Error).message);
      alert(`오류: ${(err as Error).message}`);
    }
  };

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-600">{error}</div>;
  }

  if (!board) {
    return <div className="container mx-auto px-4 py-8">로딩 중...</div>;
  }

  const fullImageUrl = board.imageUrl ? `${EXTERNAL_API_BASE_URL}${board.imageUrl}` : null;

  return (
    <div className="w-full">
      <div className="bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500">{board.category}</p>
            <h1 className="text-3xl font-bold text-gray-500">{board.title}</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">작성일: {new Date(board.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <hr className="my-6" />

        {fullImageUrl && (
          <img src={fullImageUrl} alt={`${board.id} img`} className="my-4 max-w-full h-auto" />
        )}

        <div className="prose max-w-none text-gray-500">
          <p style={{ whiteSpace: 'pre-wrap' }}>{board.content}</p>
        </div>

        <hr className="my-6" />

        <div className="flex justify-end space-x-4">
          <Link href="/boards" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            목록으로
          </Link>
          <Link href={`/boards/${id}/edit`} className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600">
            수정
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
