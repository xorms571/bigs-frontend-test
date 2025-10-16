'use client';

import { useUserStore } from '@/store/userStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from './Button';

export default function Header() {
  const router = useRouter();
  const { user, clearUser } = useUserStore();

  const handleLogout = async () => {
    clearUser();
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-10">
      <nav className="mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800 hover:text-gray-900">
          My Board
        </Link>
        {user ? (
          <div className='text-xs sm:text-base sm:gap-4 flex flex-col sm:flex-row items-end sm:items-center gap-2'>
            <span className="text-gray-700">{user.name} ({user.username})</span>
            <Button
              onClick={handleLogout}
              variant='danger'
              className='!py-1 sm:!py-2'
            >
              로그아웃
            </Button>
          </div>
        ) : (
          <div className='flex gap-4 items-center'>
            <Link href="/login" className="text-gray-800 hover:text-indigo-600">
              로그인
            </Link>
            <Link href="/signup" className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              회원가입
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
