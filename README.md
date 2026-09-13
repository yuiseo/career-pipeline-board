# 채용 파이프라인 보드

채용 담당자가 지원자를 단계별(서류검토 → 면접 → 처우협의 → 최종합격 / 불합격)로 관리하는 보드입니다.

## 설치 · 실행

```bash
pnpm install       # 의존성 설치
pnpm dev           # 개발 서버 실행
pnpm build         # 프로덕션 빌드 (타입 체크 포함)
pnpm test          # 테스트 실행 (Vitest)
pnpm lint          # 린트 검사 (ESLint)
```

## 기술 스택

- **Vite + React + TypeScript** (strict 모드)
- **ESLint** (flat config, typescript-eslint) **+ Prettier**
- **Vitest + React Testing Library** — 단위/컴포넌트 테스트
- **Tailwind CSS v4 + shadcn/ui** — 스타일링 및 UI 컴포넌트
- **TanStack Query** — 서버 상태 관리
- 패키지 매니저: **pnpm**

## mock API 방식

<!-- mock-api 구현 후 작성: 구현 방식, 네트워크 지연(200~800ms)·실패(약 15%) 시뮬레이션 방법, persist 방식 -->

## 배포 링크

<!-- (선택) 배포 후 작성 -->

## 문서

- [AGENTS.md](./AGENTS.md) — AI 에이전트 공통 작업 규칙
- [docs/FUNCTIONAL_SPEC.md](./docs/FUNCTIONAL_SPEC.md) — Must 우선 기능 명세와 인수 조건
- [docs/FUNCTIONAL_SPEC.md](./docs/FUNCTIONAL_SPEC.md) — 기능 명세 · 인수 조건
- [docs/PLAN.md](./docs/PLAN.md) — 구현 계획
- [PROMPTS.md](./PROMPTS.md) — 기능별 프롬프트 & 리뷰 로그
- [DECISIONS.md](./DECISIONS.md) — 설계 결정 기록
- [CONTRIBUTING.md](./CONTRIBUTING.md) — 커밋 메시지 규칙
