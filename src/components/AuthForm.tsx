'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export default function AuthForm({ type }: { type: 'login' | 'signup' }) {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (type === 'login') {
      if (!username || !password) {
        setError('이메일과 비밀번호를 모두 입력해주세요.');
        return;
      }
    } else { // signup
      if (!username || !name || !password || !confirmPassword) {
        setError('모든 필드를 입력해주세요.');
        return;
      }
      if (password !== confirmPassword) {
        setError('비밀번호가 일치하지 않습니다.');
        return;
      }
    }

    try {
      const endpoint = type === 'login' ? '/api/auth/signin' : '/api/auth/signup';
      const body = type === 'login'
        ? JSON.stringify({ username, password })
        : JSON.stringify({ username, name, password, confirmPassword });

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || (type === 'login' ? '로그인에 실패했습니다.' : '회원가입에 실패했습니다.'));
        return;
      }

      if (type === 'signup') {
        setSuccess('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setSuccess('로그인에 성공했습니다! 게시판 페이지로 이동합니다.');
        setUser(data);
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }

    } catch (err) {
      setError('예상치 못한 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      {/* Username */}
      <div>
        <label htmlFor="username" className="text-sm font-medium text-gray-700">이메일</label>
        <input
          id="username"
          name="username"
          type="email"
          autoComplete="email"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Name (Signup only) */}
      {type === 'signup' && (
        <div>
          <label htmlFor="name" className="text-sm font-medium text-gray-700">이름</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      )}

      {/* Password */}
      <div>
        <label htmlFor="password" className="text-sm font-medium text-gray-700">비밀번호</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={type === 'login' ? 'current-password' : 'new-password'}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        {type === 'signup' && <p className="mt-2 text-xs text-gray-500">8자 이상, 영문자, 숫자, 특수문자(!%*#?&) 포함</p>}
      </div>

      {/* Confirm Password (Signup only) */}
      {type === 'signup' && (
        <div>
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">비밀번호 확인</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
      <div className="text-end">
        <button
          type="submit"
          className="px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {type === 'login' ? '로그인' : '회원가입'}
        </button>
      </div>
    </form>
  );
}