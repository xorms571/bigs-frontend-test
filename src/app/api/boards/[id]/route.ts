import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: '게시글 ID가 필요합니다.' }, { status: 400 });
    }

    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const formData = await request.formData();
    const requestJson = formData.get('request') as string;
    const file = formData.get('file') as File | null;

    if (!requestJson) {
        return NextResponse.json({ message: '수정할 내용이 없습니다.' }, { status: 400 });
    }

    const newFormData = new FormData();
    const requestBlob = new Blob([requestJson], { type: 'application/json' });
    newFormData.append('request', requestBlob);

    if (file) {
      newFormData.append('file', file);
    }

    const apiResponse = await fetch(`https://front-mission.bigs.or.kr/boards/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: newFormData,
    });

    if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        return NextResponse.json({ message: errorData.message || '글 수정에 실패했습니다.' }, { status: apiResponse.status });
    }

    const text = await apiResponse.text();
    if (!text) {
        return new NextResponse(null, { status: apiResponse.status });
    }

    try {
        const data = JSON.parse(text);
        return NextResponse.json(data, { status: apiResponse.status });
    } catch (e) {
        return new NextResponse(text, { status: apiResponse.status });
    }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '예상치 못한 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: '게시글 ID가 필요합니다.' }, { status: 400 });
    }

    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ message: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const apiResponse = await fetch(`https://front-mission.bigs.or.kr/boards/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      return NextResponse.json({ message: errorData.message || '글 삭제에 실패했습니다.' }, { status: apiResponse.status });
    }

    return new NextResponse(null, { status: apiResponse.status });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: '예상치 못한 오류가 발생했습니다.' }, { status: 500 });
  }
}
