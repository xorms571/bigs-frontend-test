'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
}

interface Board {
  id: number;
  title: string;
  content: string;
  boardCategory: string;
}

export default function EditBoardPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [board, setBoard] = useState<Board | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBoardAndCategories = async () => {
      try {
        const catRes = await fetch('/api/boards/categories');
        if (!catRes.ok) {
          throw new Error('카테고리를 불러오는 데 실패했습니다.');
        }
        const catData = await catRes.json();
        const categoriesArray = Object.entries(catData).map(([id, name]) => ({
          id: id,
          name: name as string,
        }));
        setCategories(categoriesArray);

        const boardRes = await fetch(`/api/boards/${id}`);
        if (!boardRes.ok) {
          throw new Error('게시글 정보를 불러오는 데 실패했습니다.');
        }
        const boardData = await boardRes.json();
        setBoard(boardData);
        setTitle(boardData.title);
        setContent(boardData.content);

        const initialCategory = categoriesArray.find(
          (cat) => cat.name === boardData.boardCategory
        );
        if (initialCategory) {
          setCategory(initialCategory.id);
        } else {
          setError('게시글의 카테고리를 찾을 수 없습니다.');
          setCategory('');
        }

      } catch (err: any) {
        setError(err.message);
      }
    };

    if (id) {
      fetchBoardAndCategories();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !content || !category) {
      setError('제목, 내용, 카테고리를 모두 입력해주세요.');
      return;
    }

    try {
      const formData = new FormData();
      const request = {
        title,
        content,
        category,
      };
      formData.append('request', JSON.stringify(request));
      if (file) {
        formData.append('file', file);
      }

      const res = await fetch(`/api/boards/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '글 수정에 실패했습니다.');
      }

      router.push(`/boards/${id}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!board) {
    return <div className="container mx-auto px-4 py-8">로딩 중...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">글 수정</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
          />
        </div>
        <div className="mb-6">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">파일 첨부 (선택)</label>
          <input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push(`/boards/${id}`)}
            className="px-4 py-2 mr-2 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            수정
          </button>
        </div>
      </form>
    </div>
  );
}
