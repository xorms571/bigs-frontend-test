import BoardForm from '@/app/boards/BoardForm';
import Container from '@/components/Container';
import Title from '@/components/Title';
import { Suspense } from 'react';

export default function EditBoardPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading Edit Board Page...</div>}>
      <Container>
        <Title className="mb-2">글 수정</Title>
        <BoardForm isEditMode boardId={params.id} />
      </Container>
    </Suspense>
  );
}