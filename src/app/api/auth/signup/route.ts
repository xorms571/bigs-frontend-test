import { NextResponse } from 'next/server';

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!%*#?&])[A-Za-z\d!%*#?&]{8,}$/;

export async function POST(request: Request) {
  try {
    const { username, name, password, confirmPassword } = await request.json();

    if (!username || !name || !password || !confirmPassword) {
      return NextResponse.json({ message: '모든 필드를 입력해주세요.' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(username)) {
      return NextResponse.json({ message: '이메일 형식이 올바르지 않습니다.' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: '비밀번호가 일치하지 않습니다.' }, { status: 400 });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return NextResponse.json({ message: '비밀번호는 8자 이상이어야 하며, 영문자, 숫자, 특수문자(!%*#?&)를 각각 하나 이상 포함해야 합니다.' }, { status: 400 });
    }

    const response = await fetch('https://front-mission.bigs.or.kr/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, name }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        return NextResponse.json({ message: `외부 API 에러: ${errorText}` }, { status: response.status });
      }
      return NextResponse.json({ message: errorData.message || '문제가 발생했습니다.' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: '예상치 못한 오류가 발생했습니다.' }, { status: 500 });
  }
}
