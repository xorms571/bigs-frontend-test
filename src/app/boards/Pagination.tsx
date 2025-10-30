'use client';

import Button from '@/components/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  onPageChange: (newPage: number) => void;
}

export default function Pagination({ currentPage, totalPages, isFirst, isLast, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between mt-6">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
        variant='secondary'
      >
        이전
      </Button>
      <span className="text-sm text-gray-700">
        Page {currentPage + 1} of {totalPages}
      </span>
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
        variant='secondary'
      >
        다음
      </Button>
    </div>
  );
}