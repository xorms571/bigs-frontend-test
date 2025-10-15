'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../store/userStore';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const { user, clearUser } = useUserStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    clearUser();
    router.push('/login');
    router.refresh();
  };

  if (!isClient) {
    return (
        <header className="bg-white shadow-md">
         <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              Home
            </Link>
            <div className="flex items-center space-x-4"></div>
          </nav>
        </header>
    );
  }

  return (
    <header className="bg-white shadow-md">
      <nav className="mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Home
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700">안녕하세요, {user.name}님 ({user.username})</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-800 hover:text-indigo-600">
                로그인
              </Link>
              <Link href="/signup" className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                회원가입
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
