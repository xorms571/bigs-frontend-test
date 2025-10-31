import BoardForm from '@/app/boards/components/BoardForm';
import Container from '@/components/Container';
import Title from '@/components/Title';
import { Suspense } from 'react';

export default async function EditBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div>Loading New Board Page...</div>}>
      <Container>
        <Title className="mb-2">글 수정</Title>
        <BoardForm isEditMode boardId={id} />
      </Container>
    </Suspense>
  )
}