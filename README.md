# 채용 파이프라인 보드

채용 담당자가 지원자를 단계별(서류검토 → 면접 → 처우협의 → 최종합격 / 불합격)로 관리하는 SPA입니다. 실제 백엔드 없이 MSW mock API로 동작하며, 개발·배포 환경 모두에서 동일하게 시연할 수 있습니다.

## 설치 · 실행

```bash
pnpm install       # 의존성 설치
pnpm dev           # 개발 서버 실행
pnpm build         # 프로덕션 빌드 (타입 체크 포함)
pnpm preview       # 빌드 결과 미리보기
pnpm test          # 테스트 실행 (Vitest)
pnpm lint          # 린트 검사 (ESLint)
pnpm format:check  # 포맷 검사 (Prettier)
```

## Must

- [x] 보드·컬럼·카드
- [x] 단계 이동과 영속 저장
- [x] 낙관적 업데이트와 실패 롤백
- [x] 이름 검색과 직무 필터
- [x] 지원자 상세 보기
- [x] 로딩·에러·빈 상태
- [x] mock API 지연·실패·시연 제어
- [ ] Must 기능 테스트

### 보드·컬럼·카드

앱 진입 시 목록을 조회해 5개 컬럼(서류검토 → 면접 → 처우협의 → 최종합격 → 불합격)에 나눕니다. 카드는 이름·직무·지원일·현재 단계를 보여 주고, 컬럼 헤더는 검색·필터를 통과한 인원수입니다. 빈 컬럼은 "이 단계의 지원자가 없습니다". 단계 이동은 카드 메뉴로만 하며 드래그앤드롭은 없습니다.

### 단계 이동과 영속 저장

메뉴에서 현재 단계를 제외한 단계로 보냅니다. 성공하면 목록·상세 캐시의 `stage`를 서버 응답으로 바꾸고 성공 토스트를 띄웁니다. 같은 단계 선택은 요청하지 않습니다. mock API가 localStorage에 저장하므로 새로고침 후에도 유지됩니다.

### 낙관적 업데이트와 실패 롤백

선택 즉시 카드를 목적 컬럼으로 옮깁니다. 화면 단계는 `inFlightTarget`(진행 중 목표) → 서버가 확인한 단계 순입니다. 실패하면 확인된 단계로 되돌리고, 토스트에서 다시 시도할 수 있습니다. 단계 변경은 자동 재시도하지 않습니다. 열린 상세의 단계도 카드와 같은 규칙입니다.

Must 초안은 요청 중 메뉴를 막아 동시 요청을 막았고, 지금은 Should 연속 이동 직렬화로 같은 지원자 요청 1개를 보장합니다.

### 이름 검색과 직무 필터

이름은 입력과 적용 검색어를 나눕니다. 검색 버튼 또는 Enter일 때만 앞뒤 공백을 떼고 부분 일치합니다. 직무는 여러 개 체크 즉시 적용(OR), 미선택이면 전체, 이름과는 AND입니다. 적용 조건은 `?q=`·반복 `?position=`에 담고 `replaceState`로 갱신해 새로고침·공유 시 복원됩니다. 목록은 한 번만 조회하고 필터는 클라이언트에서 합니다.

### 지원자 상세 보기

카드 클릭 시 오른쪽 슬라이드 아웃으로 단건 조회합니다. 요약(이름·직무·지원일·단계)은 목록 캐시, 이메일·연락처·경력 연차·학력은 상세 API입니다. 패널 로딩·에러는 보드를 바꾸지 않습니다. 같은 지원자를 다시 열면 쿼리 캐시를 씁니다.

### 로딩·에러·빈 상태

목록 조회 중에는 5열 스켈레톤입니다. 최종 실패 시 보드에 에러와 다시 시도가 나오고, 조회는 1회 자동 재시도합니다. 빈 상태는 세 가지입니다. 원본 0건은 "등록된 지원자가 없습니다", 조건 0건은 "조건에 맞는 지원자가 없습니다"와 필터 초기화, 특정 컬럼 0건은 컬럼 안 문구입니다.

### mock API 지연·실패·시연 제어

MSW가 `/api/candidates`를 가로챕니다. 모든 요청에 200~800ms 지연과 약 15% 실패(500 + `{ message }`)가 있습니다. 시드 1,000건은 localStorage에 버전과 함께 저장됩니다. `?mockFail=1/0`, `?mockSeed=0`, `?mockReset=1`로 시연합니다. 자세한 규약과 링크는 아래 mock API 절을 봅니다.

### Must 기능 테스트

시나리오는 `docs/test-scenarios/`에 있습니다. Vitest로 mock API·단계 이동·검색 필터·상태 화면·통합을 돌리는 작업은 아직입니다.

## Should

- [x] 빠른 연속 이동 경쟁 상태 처리
- [ ] 1,000건 가상 스크롤
- [x] Undo
- [ ] Should 추가 테스트
- [ ] 키보드 접근성

### 빠른 연속 이동 경쟁 상태 처리

요청 중에도 이동 메뉴는 켜 둡니다. 진행 중 추가 선택은 `pendingTarget`에 가장 최근 의도만 남기고, 같은 지원자 요청은 하나씩 보냅니다. 화면 단계는 `pendingTarget` → `inFlightTarget` → 확인된 단계입니다. 실패하면 확인된 단계로 되돌리고 대기 의도는 버립니다. 다른 지원자 요청은 서로 막지 않습니다.

### 1,000건 가상 스크롤

미구현입니다. 컬럼 안 세로 스크롤만 있고, 카드는 필터 결과를 모두 그립니다.

### Undo

성공 토스트의 "실행 취소"로 직전 성공 이동을 되돌립니다. 별도 강제 쓰기 없이 같은 단계 이동 흐름입니다. 성공 시 "이동을 취소했습니다", 실패 시 확인된 단계를 유지하고 다시 시도 토스트를 띄웁니다.

### Should 추가 테스트

미구현입니다. 연속 이동 성공·첫 요청 실패·후속 실패·중간 의도 덮어쓰기, 가상 스크롤, Undo를 검증하는 테스트를 아직 넣지 않았습니다.

### 키보드 접근성

일부만 있습니다. 카드는 Tab·Enter·Space로 상세를 열고, 단계 메뉴와 토스트(`role="alert"` / `aria-live`)는 동작합니다. 패널을 닫을 때 연 카드로 포커스를 되돌리는 처리는 없습니다.

## 기술 스택

- **Vite + React + TypeScript** (strict 모드)
- **MSW** — 브라우저 mock API (개발·배포 모두)
- **Zod** — API 응답·요청 본문·localStorage·URL 쿼리 검증
- **TanStack Query** — 서버 상태. 조회 재시도 1회, mutation 재시도 없음
- **Tailwind CSS v4 + shadcn/ui** — 스타일링 및 UI 컴포넌트
- **ESLint** (flat config, typescript-eslint) **+ Prettier**
- **Vitest + React Testing Library** — 단위/컴포넌트 테스트
- 패키지 매니저: **pnpm**

## mock API

MSW가 `/api/candidates` 요청을 가로챕니다. 워커가 뜬 뒤에 앱을 렌더링합니다.

**지연·실패:** 모든 요청에 200~800ms 무작위 지연과 약 15% 실패(HTTP 500 + `{ message }`)를 넣습니다. PATCH는 성공이 확정된 뒤에만 저장소를 바꿉니다.

**저장:** 기본 시드 1,000건(같은 입력이면 같은 결과). `localStorage` 키 `career-pipeline-board:candidates`에 버전과 함께 저장하고, 버전이 없거나 다르면 시드를 다시 만듭니다. 새로고침해도 단계 변경이 유지됩니다.

**에러 구분:** 없는 지원자 ID는 `404`, 허용되지 않은 `stage` 등 잘못된 본문은 `400`. 형식은 모두 `{ message }`.

### 엔드포인트

| 메서드 · 경로 | 요청 | 성공 응답 |
|---|---|---|
| `GET /api/candidates` | 없음 | `CandidateSummary[]` (`id`, `stage`, `name`, `position`, `appliedAt`) |
| `GET /api/candidates/:id` | 경로 ID | `CandidateDetail` (요약 + 이메일, 연락처, 경력 연차, 학력) |
| `PATCH /api/candidates/:id/stage` | `{ stage }` | 변경된 `CandidateDetail` |

### 시연 제어

배포·로컬 모두 URL 쿼리로 제어합니다. 검색·필터 쿼리(`q`, `position`)와 함께 쓸 수 있습니다.

| 쿼리 | 효과 |
|---|---|
| `mockFail=1` | API 실패 강제. 요청마다 현재 URL을 읽으므로 새로고침 없이 반영 |
| `mockFail=0` | 실패 없음 |
| `mockSeed=0` | 저장 데이터를 0건으로 바꿈. 적용 후 URL에서 제거 |
| `mockReset=1` | 시드 1,000건으로 복구. 적용 후 URL에서 제거 |

빈 데이터는 `mockReset=1`로 되돌립니다.

**배포 시연**

- [기본](https://career-pipeline-board.vercel.app/)
- [실패 강제](https://career-pipeline-board.vercel.app/?mockFail=1) — 목록 에러 또는 단계 이동 rollback
- [실패 없음](https://career-pipeline-board.vercel.app/?mockFail=0)
- [전체 0건](https://career-pipeline-board.vercel.app/?mockSeed=0)
- [시드 복구](https://career-pipeline-board.vercel.app/?mockReset=1)
- [검색·필터 예](https://career-pipeline-board.vercel.app/?q=홍&position=frontend)

로컬은 같은 쿼리를 `http://localhost:5173/`에 붙이면 됩니다.

## 배포

https://career-pipeline-board.vercel.app/

## 문서

- [AGENTS.md](./AGENTS.md) — AI 에이전트 공통 작업 규칙
- [docs/FUNCTIONAL_SPEC.md](./docs/FUNCTIONAL_SPEC.md) — 기능 명세 · 인수 조건
- [docs/PLAN.md](./docs/PLAN.md) — 구현 계획
- [docs/test-scenarios/](./docs/test-scenarios/) — Must 테스트 시나리오
- [PROMPTS.md](./PROMPTS.md) — 기능별 프롬프트 & 리뷰 로그
- [DECISIONS.md](./DECISIONS.md) — 설계 결정 기록
- [CONTRIBUTING.md](./CONTRIBUTING.md) — 커밋 메시지 규칙
