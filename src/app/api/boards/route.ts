import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ?? '0';
    const size = searchParams.get('size') ?? '10';

    const apiResponse = await fetch(`https://front-mission.bigs.or.kr/boards?page=${page}&size=${size}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      return NextResponse.json({ message: errorData.message || '글 목록 조회에 실패했습니다.' }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    return NextResponse.json(data, { status: apiResponse.status });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '예상치 못한 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const formData = await request.formData();
    const requestJson = formData.get('request') as string;
    const file = formData.get('file') as File | null;

    if (!requestJson) {
        return NextResponse.json({ message: '요청 데이터가 없습니다.' }, { status: 400 });
    }

    const newFormData = new FormData();
    
    const requestBlob = new Blob([requestJson], { type: 'application/json' });
    newFormData.append('request', requestBlob);

    if (file) {
      newFormData.append('file', file);
    }

    const apiResponse = await fetch('https://front-mission.bigs.or.kr/boards', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: newFormData,
    });

    console.log('External API POST /boards raw response status:', apiResponse.status);
    const responseText = await apiResponse.text();
    console.log('External API POST /boards raw response text:', responseText);

    if (!apiResponse.ok) {
      let errorData = { message: '글 작성에 실패했습니다.' };
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse error response as JSON:', e);
        errorData.message = responseText || '글 작성에 실패했습니다.';
      }
      return NextResponse.json({ message: errorData.message }, { status: apiResponse.status });
    }

    if (!responseText) {
        return new NextResponse(null, { status: apiResponse.status });
    }

    try {
        const data = JSON.parse(responseText);
        return NextResponse.json(data, { status: apiResponse.status });
    } catch (e) {
        console.error('Failed to parse successful response as JSON:', e);
        return new NextResponse(responseText, { status: apiResponse.status });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '예상치 못한 오류가 발생했습니다.' }, { status: 500 });
  }
}
