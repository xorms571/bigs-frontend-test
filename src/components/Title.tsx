
import React from 'react';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

export default function Title({ children, className }: TitleProps) {
  return (
    <h2 className={`text-lg sm:text-2xl font-bold text-gray-900 ${className || ''}`}>
      {children}
    </h2>
  );
}
