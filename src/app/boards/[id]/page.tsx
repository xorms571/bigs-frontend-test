import BoardDetail from '@/app/boards/components/BoardDetail';
import Container from '@/components/Container';
import { Suspense } from 'react';

export default async function BoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL;
  const { id } = await params;
  return (
    <Suspense fallback={<div>Loading Detail Board Page...</div>}>
      <Container className='min-h-96'>
        <BoardDetail boardId={id} apiBaseUrl={apiBaseUrl} />
      </Container>
    </Suspense>
  )
}