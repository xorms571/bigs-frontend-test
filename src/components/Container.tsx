
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={`w-full sm:max-w-3xl mx-auto ${className || ''}`}>
      {children}
    </div>
  );
}
