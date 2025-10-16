import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, name, password, confirmPassword } = await request.json();

    const response = await fetch('https://front-mission.bigs.or.kr/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, name, confirmPassword }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        const errorMessage = errorData.message || `외부 API 오류: ${JSON.stringify(errorData)}`;
        return NextResponse.json({ message: errorMessage }, { status: response.status });
      } catch (e) {
        return NextResponse.json({ message: `외부 API 에러: ${errorText}` }, { status: response.status });
      }
    }

    try {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (jsonParseError: unknown) {
      const errorMessage = jsonParseError instanceof Error ? jsonParseError.message : '알 수 없는 오류';
      return NextResponse.json(
        { message: errorMessage },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
