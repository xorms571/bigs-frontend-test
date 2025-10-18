import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, name, password, confirmPassword } = await request.json();

    const apiResponse = await fetch('https://front-mission.bigs.or.kr/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, name, confirmPassword }),
    });

    const responseData = await apiResponse.text();
    const status = apiResponse.status;

    if (!apiResponse.ok) {
      let errorMessage = '회원가입 처리 중 오류가 발생했습니다.';
      if (responseData) {
        try {
          const errorJson = JSON.parse(responseData);
          errorMessage = errorJson.message || JSON.stringify(errorJson);
        } catch (e) {
          errorMessage = responseData;
        }
      }
      return NextResponse.json({ message: errorMessage }, { status });
    }

    try {
      const data = responseData ? JSON.parse(responseData) : { message: '회원가입 성공' };
      return NextResponse.json(data, { status });
    } catch (e) {
      return NextResponse.json({ message: '회원가입에 성공했지만 응답을 처리할 수 없습니다.' }, { status });
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
