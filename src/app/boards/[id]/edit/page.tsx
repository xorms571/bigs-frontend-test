import { headers } from 'next/headers';
import { Board, Category } from '@/types/common';
import { Suspense } from 'react';
import BoardForm from '@/app/boards/components/BoardForm';
import Container from '@/components/Container';
import Title from '@/components/Title';

async function getBoardDetail(id: string): Promise<Board | null> {
  const headersData = await headers();
  try {
    const headersList = new Headers(headersData);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/boards/${id}`, {
      headers: headersList,
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('게시글 상세 정보 조회 실패:', error);
    return null;
  }
}

async function getCategories(): Promise<Category[] | null> {
  const headersData = await headers();
  try {
    const headersList = new Headers(headersData);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/boards/categories`, {
      headers: headersList,
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const catData = await res.json();
    return Object.entries(catData).map(([id, name]) => ({ id: id, name: name as string }));
  } catch (error) {
    console.error('카테고리 목록 조회 실패:', error);
    return null;
  }
}

export default async function EditBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [initialData, initialCategories] = await Promise.all([
    getBoardDetail(id),
    getCategories(),
  ]);

  if (!initialData || !initialCategories) {
    return (
      <Container>
        <Title>오류</Title>
        <p>게시글 또는 카테고리 정보를 불러오는 데 실패했습니다.</p>
      </Container>
    );
  }

  return (
    <Suspense fallback={<div>페이지 로딩 중...</div>}>
      <Container>
        <Title className="mb-2">글 수정</Title>
        <BoardForm
          isEditMode
          boardId={id}
          initialData={initialData}
          initialCategories={initialCategories}
        />
      </Container>
    </Suspense>
  );
}