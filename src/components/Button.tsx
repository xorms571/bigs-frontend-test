
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'danger' | 'secondary';
}

export default function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
  const baseStyle = "px-4 py-2 cursor-pointer font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
    danger: "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    secondary: "text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-500",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
}
