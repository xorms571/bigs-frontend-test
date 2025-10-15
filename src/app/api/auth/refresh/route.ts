import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('리프레시 토큰 API 호출됨.');
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (!refreshToken) {
      console.log('리프레시 토큰이 없습니다. 401 응답.');
      return NextResponse.json({ message: '리프레시 토큰이 없습니다.' }, { status: 401 });
    }
    console.log('리프레시 토큰 존재. 외부 API 호출 시도.');

    const apiResponse = await fetch('https://front-mission.bigs.or.kr/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await apiResponse.json();
    console.log('외부 리프레시 API 응답 데이터:', data);

    if (!apiResponse.ok) {
      console.log('외부 리프레시 API 응답 실패. 상태 코드:', apiResponse.status);
      return NextResponse.json({ message: data.message || '토큰 갱신에 실패했습니다.' }, { status: apiResponse.status });
    }

    const { accessToken, refreshToken: newRefreshToken } = data;

    if (accessToken && newRefreshToken) {
      console.log('새 액세스 토큰 및 리프레시 토큰 수신. 쿠키 설정 시도.');
      const response = NextResponse.json({ message: '토큰이 성공적으로 갱신되었습니다.' }, { status: 200 });

      response.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
        maxAge: 60, // 1분
      });
      console.log('새 accessToken 쿠키 설정됨.');

      response.cookies.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7일
      });
      console.log('새 refreshToken 쿠키 설정됨.');

      return response;
    }

    console.log('새로운 토큰 정보가 없습니다. 400 응답.');
    return NextResponse.json({ message: '새로운 토큰 정보가 없습니다.' }, { status: 400 });

  } catch (error) {
    console.error('리프레시 API 예상치 못한 오류 발생:', error);
    return NextResponse.json({ message: '예상치 못한 오류가 발생했습니다.' }, { status: 500 });
  }
}
