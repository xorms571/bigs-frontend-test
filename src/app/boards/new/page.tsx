import { headers } from 'next/headers';
import { Category } from '@/types/common';
import { Suspense } from 'react';
import BoardForm from '@/app/boards/components/BoardForm';
import Container from '@/components/Container';
import Title from '@/components/Title';

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

export default async function NewBoardPage() {
  const initialCategories = await getCategories();

  return (
    <Suspense fallback={<div>페이지 로딩 중...</div>}>
      <Container>
        <Title className="mb-2">새 글 작성</Title>
        <BoardForm initialCategories={initialCategories} />
      </Container>
    </Suspense>
  );
}