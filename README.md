# K-MOM

D-2 비자 유학생 ↔ 아르바이트 업주 ↔ 대학교 국제처를 연결하는 신뢰 기반 합법 알바 매칭 플랫폼.

- **학생**: 무료 — 프로필·이력·평가가 곧 경력 자산
- **업주**: 구독 — 검증된 학생 검색 + 서류 자동화
- **학교**: 구독 — 교외 근무 실시간 모니터링

## 기술 스택
- Next.js 16 (App Router · Turbopack) + TypeScript
- Tailwind CSS v4
- Supabase (DB · Auth · Storage)
- 배포: Vercel (예정)

## Phase 1 MVP 구현 현황
- ✅ 랜딩 페이지 · 회원가입(역할 선택) · 로그인 · 로그아웃
- ✅ 학생 프로필 등록/편집 + D-2 합법 근무시간 자동 계산
- ✅ 업주 학생 검색 + 상세 페이지 + 이메일 직접 연락
- ✅ 학교 국제처 대시보드 (MOU 상태 표시 stub)
- ✅ 운영자 대시보드 (학생·업주·평가 카운트)
- ✅ Supabase 스키마 SQL + RLS 정책 + 쌍방평가 동시공개 트리거
- ✅ Proxy (구 middleware)로 인증 가드

## 다음에 할 일 (Phase 1 마무리)
- [ ] 알바 이력(work_histories) 등록·종료 UI
- [ ] 쌍방 평가 입력·열람 UI
- [ ] 업주 프로필 등록 UI (employers 테이블)
- [ ] 사진 업로드 (Supabase Storage)
- [ ] Supabase 프로젝트 생성 후 실제 연동

---

## 처음 시작하기

### 1. Supabase 프로젝트 생성
1. https://supabase.com 가입 → 새 프로젝트 만들기
2. SQL Editor 열고 `supabase/schema.sql` 전체를 붙여넣고 실행
3. Project Settings → API 에서 `URL`과 `anon public` 키 복사

### 2. 환경 변수
프로젝트 루트에 `.env.local` 만들기 (이미 placeholder가 있다면 덮어쓰기):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 3. 개발 서버
```bash
npm install
npm run dev
```
→ http://localhost:3000

### 4. 빌드 확인
```bash
npm run build
```

---

## 폴더 구조
```
k-mom/
├── supabase/
│   └── schema.sql              # 7개 테이블 + RLS + 트리거
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── actions/
│   │   │   └── auth.ts         # signup/login/logout Server Actions
│   │   ├── admin/dashboard/
│   │   ├── employer/
│   │   │   ├── search/
│   │   │   └── students/[id]/
│   │   ├── school/dashboard/
│   │   ├── student/profile/
│   │   ├── layout.tsx
│   │   └── page.tsx            # 랜딩
│   ├── components/
│   │   └── Nav.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # 브라우저 클라이언트
│   │   │   ├── server.ts       # 서버 클라이언트 (Next.js 16 async cookies)
│   │   │   └── types.ts        # DB 타입 (수동 — 추후 자동 생성으로 교체 가능)
│   │   └── visa-rules.ts       # D-2 합법 근무시간 계산
│   └── proxy.ts                # Next.js 16 Proxy (구 middleware)
└── .env.local                  # ← Supabase 키 (git 제외)
```

## DB 스키마 요약
- `users` — role + 기본 정보 (auth.users 트리거로 자동 생성)
- `student_profiles` — TOPIK·소개·기술·인증
- `employers` — 업체 정보 + certification_level
- `work_histories` — 알바 이력
- `reviews` — 쌍방 평가 (양쪽 제출 시 `revealed_at` 자동 set)
- `schools` / `school_students` — 학교 모니터링

## Next.js 16 주의사항
- `cookies()` 가 async — 항상 `await cookies()`
- 구 `middleware.ts` → `proxy.ts` 로 변경됨
- `searchParams` / `params` 가 Promise — `await` 필수
- Server Actions + React 19 `useActionState` 사용
