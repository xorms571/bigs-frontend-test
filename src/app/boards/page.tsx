import { Suspense } from 'react';
import BoardsList from '@/app/boards/BoardsList';

export default function BoardsPage() {
  return (
    <Suspense fallback={<div>Loading boards...</div>}>
      <BoardsList />
    </Suspense>
  );
}