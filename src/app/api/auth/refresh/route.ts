import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: '리프레시 토큰이 없습니다.' }, { status: 401 });
    }

    const apiResponse = await fetch('https://front-mission.bigs.or.kr/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json({ message: data.message || '토큰 갱신에 실패했습니다.' }, { status: apiResponse.status });
    }

    const { accessToken, refreshToken: newRefreshToken } = data;

    if (accessToken && newRefreshToken) {
      const response = NextResponse.json({
        message: '토큰이 성공적으로 갱신되었습니다.',
        accessToken: accessToken, // 토큰 교체
      }, { status: 200 });

      response.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
        maxAge: 10, // 토큰 갱신 테스트 10초
      });

      response.cookies.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json({ message: '새로운 토큰 정보가 없습니다.' }, { status: 400 });

  } catch (error) {
    console.error('리프레시 API 예상치 못한 오류 발생:', error);
    return NextResponse.json({ message: '예상치 못한 오류가 발생했습니다.' }, { status: 500 });
  }
}
