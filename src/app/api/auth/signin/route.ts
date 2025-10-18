import { NextResponse } from 'next/server';

// 서버 측에서 JWT를 해석하는 헬퍼 함수
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding JWT in API route", e);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: '이메일과 비밀번호를 모두 입력해주세요.' }, { status: 400 });
    }

    const apiResponse = await fetch('https://front-mission.bigs.or.kr/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
      return NextResponse.json({ message: data.message || '로그인에 실패했습니다.' }, { status: apiResponse.status });
    }

    const { accessToken, refreshToken } = data;

    let user = {};
    // 토큰을 해석하여 사용자 정보 추출
    if (accessToken) {
      const tokenPayload = parseJwt(accessToken);
      if (tokenPayload) {
        user = {
          username: tokenPayload.username,
          name: tokenPayload.name,
        };
      }
    }

    // 사용자 정보 객체를 본문에 담아 응답 생성
    const response = NextResponse.json(user, { status: apiResponse.status });

    // 토큰은 HttpOnly 쿠키에 설정
    if (accessToken && refreshToken) {
      response.cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
        maxAge: 10, // 토큰 갱신 테스트 10초
      });
      response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json({ message: '예상치 못한 오류가 발생했습니다.' }, { status: 500 });
  }
}