import BoardForm from '@/app/boards/BoardForm';
import Container from '@/components/Container';
import Title from '@/components/Title';
import { Suspense } from 'react';

export default function NewBoardPage() {
  return (
    <Suspense fallback={<div>Loading New Board Page...</div>}>
      <Container>
        <Title className="mb-2">새 글 작성</Title>
        <BoardForm />
      </Container >
    </Suspense>
  )
}