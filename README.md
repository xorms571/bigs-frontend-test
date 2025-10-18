# Bigs Frontend Test Project

이 프로젝트는 Next.js, TypeScript, Tailwind CSS를 사용하여 구축된 간단한 게시판 애플리케이션입니다. 사용자 인증 기능과 게시글 CRUD(생성, 읽기, 수정, 삭제) 기능을 포함하고 있습니다.

## ✨ 주요 기능

- **사용자 인증**:
  - 회원가입 및 로그인
  - JWT (Access/Refresh Token) 기반 인증
  - `HttpOnly` 쿠키를 사용한 안전한 토큰 관리
  - 토큰 만료 시 자동 갱신 처리
- **게시판**:
  - 게시글 목록 조회 (페이지네이션 포함)
  - 게시글 상세 조회
  - 게시글 작성 및 수정
- **기타**:
  - 홈페이지 접속 시 게시판 목록으로 자동 리디렉션

## 🛠️ 기술 스택

- **프레임워크**: [Next.js](https://nextjs.org/) (App Router)
- **언어**: [TypeScript](https://www.typescriptlang.org/)
- **상태 관리**: [Zustand](https://github.com/pmndrs/zustand)
- **스타일링**: [Tailwind CSS](https://tailwindcss.com/)
- **UI 컴포넌트**: 재사용 가능한 자체 컴포넌트 (`src/components`)

## 🚀 시작하기

### 1. 저장소 복제

```bash
git clone <repository-url>
cd bigs-frontend-test
```

### 2. 의존성 설치

프로젝트에 필요한 패키지를 설치합니다.

```bash
npm install
```

### 3. 개발 서버 실행

다음 명령어를 실행하여 개발 서버를 시작합니다.

```bash
npm run dev
```

서버가 시작되면 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속할 수 있습니다.

### 4. 기타 스크립트

- **프로덕션 빌드**:
  ```bash
  npm run build
  ```
- **프로덕션 서버 시작**:
  ```bash
  npm run start
  ```
- **Linter 실행**:
  ```bash
  npm run lint
  ```

## 📁 프로젝트 구조

```
C:/Users/UserK/Desktop/bigs frontend test/bigs-frontend-test/
├── public/              # 정적 에셋 (이미지, 폰트 등)
├── src/
│   ├── app/
│   │   ├── api/         # 백엔드 API 라우트 (BFF)
│   │   │   ├── auth/    # 인증 관련 API
│   │   │   └── boards/  # 게시판 관련 API
│   │   ├── boards/      # 게시판 페이지
│   │   ├── login/       # 로그인 페이지
│   │   ├── signup/      # 회원가입 페이지
│   │   ├── layout.tsx   # 전역 레이아웃
│   │   └── page.tsx     # 홈페이지 (게시판으로 리디렉션)
│   ├── components/      # 재사용 가능한 UI 컴포넌트
│   ├── hooks/           # 커스텀 훅
│   ├── store/           # Zustand를 사용한 전역 상태 관리
│   ├── types/           # 공용 타입 정의
│   └── utils/           # 유틸리티 함수 (API 호출 등)
├── next.config.ts       # Next.js 설정
├── package.json         # 프로젝트 의존성 및 스크립트
└── tailwind.config.js   # Tailwind CSS 설정
```

### API 라우트 (BFF)

이 프로젝트의 Next.js 서버는 외부 API 서버와 통신하는 BFF(Backend For Frontend) 역할을 합니다. 클라이언트는 Next.js 서버의 API 라우트와 통신하며, 서버는 외부 API(`https://front-mission.bigs.or.kr`)로 요청을 전달하고 응답을 처리합니다. 이 구조는 API 키나 민감한 정보를 클라이언트에 노출하지 않고 안전하게 처리하는 데 도움을 줍니다.