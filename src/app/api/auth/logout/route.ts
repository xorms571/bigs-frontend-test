import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ message: '로그아웃 되었습니다.' }, { status: 200 });

    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: -1, // Expire the cookie immediately
    });

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: -1, // Expire the cookie immediately
    });

    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '예상치 못한 오류가 발생했습니다.' }, { status: 500 });
  }
}
