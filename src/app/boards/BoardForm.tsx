'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Board } from '@/types/common';
import { fetchWithTokenRefresh } from '@/utils/api';
import Button from '@/components/Button';
import { useHydration } from '@/hooks/useHydration';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

type FormStatus = 'idle' | 'submitting';

interface BoardFormProps {
  isEditMode?: boolean;
  boardId?: string;
}

export default function BoardForm({ isEditMode = false, boardId }: BoardFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [error, setError] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [isLoading, setIsLoading] = useState(true);
  const hydrated = useHydration();

  useEffect(() => {
    if (!hydrated) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const catRes = await fetchWithTokenRefresh('/api/boards/categories', {}, router);
        if (!catRes.ok) throw new Error('카테고리를 불러오는 데 실패했습니다.');
        const catData = await catRes.json();
        const categoriesArray = Object.entries(catData).map(([id, name]) => ({
          id: id,
          name: name as string,
        }));
        setCategories(categoriesArray);

        if (isEditMode && boardId) {
          const boardRes = await fetchWithTokenRefresh(`/api/boards/${boardId}`, {}, router);
          if (!boardRes.ok) throw new Error('게시글 정보를 불러오는 데 실패했습니다.');
          const boardData: Board = await boardRes.json();

          setTitle(boardData.title);
          setContent(boardData.content);
          setCategory(boardData.boardCategory);
        } else if (categoriesArray.length > 0) {
          setCategory(categoriesArray[0].id);
        }
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isEditMode, boardId, router, hydrated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !content || !category) {
      setError('제목, 내용, 카테고리를 모두 입력해주세요.');
      return;
    }

    if (file && file.size > MAX_FILE_SIZE) {
      setError(`파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / (1024 * 1024)}MB까지 업로드 가능합니다.`);
      return;
    }

    setStatus('submitting');

    try {
      const formData = new FormData();
      formData.append('request', JSON.stringify({ title, content, category }));
      if (file) {
        formData.append('file', file);
      }

      const url = isEditMode ? `/api/boards/${boardId}` : '/api/boards';
      const method = isEditMode ? 'PATCH' : 'POST';

      const res = await fetchWithTokenRefresh(url, {
        method: method,
        body: formData,
      }, router);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || (isEditMode ? '글 수정에 실패했습니다.' : '글 작성에 실패했습니다.'));
      }

      const responseText = await res.text();
      let resultId;

      if (responseText) {
        const result = JSON.parse(responseText);
        resultId = result.id;
      } else {
        resultId = isEditMode ? boardId : null;
      }

      if (resultId) {
        router.push(`/boards/${resultId}`);
      } else {
        router.push('/boards');
      }
      router.refresh();
    } catch (err: unknown) {
      setError((err as Error).message);
      setStatus('idle');
    }
  };

  if (isLoading) {
    return (
      <p>데이터를 불러오는 중...</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={categories.length === 0 || status === 'submitting'}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={status === 'submitting'}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">내용</label>
        <textarea
          id="content"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          disabled={status === 'submitting'}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">파일 첨부</label>
        <input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
          disabled={status === 'submitting'}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          onClick={() => router.back()}
          variant='secondary'
          disabled={status === 'submitting'}
        >
          취소
        </Button>
        <Button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? (isEditMode ? '수정 중...' : '작성 중...') : (isEditMode ? '수정' : '작성')}
        </Button>
      </div>
    </form>
  );
}