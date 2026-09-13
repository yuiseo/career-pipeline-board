# 구현 계획

설계 근거는 [DECISIONS.md](../DECISIONS.md), 기능·인수 조건은 [FUNCTIONAL_SPEC.md](./FUNCTIONAL_SPEC.md), 커밋 규칙은 [CONTRIBUTING.md](../CONTRIBUTING.md)를 따른다.

## 진행 원칙

- **단계는 작업 순서, 커밋은 기능 단위다.** 단계 안에서 기능별로 커밋을 나누고, 커밋마다 PROMPTS.md 섹션을 하나씩 둔다.
- **테스트는 Must 기능을 모두 만든 뒤 5단계에서 몰아서 작성한다.** 5단계는 체크리스트를 기준으로 `test(...)` 커밋을 만들고, 부족한 통합 시나리오를 마지막에 보강한다.
- **디자인은 Claude 시안을 먼저 만든 뒤 2단계 UI를 구현한다.** 1단계(mock API)는 시안과 무관하므로 시안 작업과 병행한다.
- 커밋마다 `pnpm build`, `pnpm lint`, `pnpm format:check`를 통과시킨다. 5단계부터는 `pnpm test`도 통과시킨다.
- 커밋이 끝나면 아래 표의 `완료` 칸과 FUNCTIONAL_SPEC.md에서 충족한 인수 조건을 체크한다.
- 작업 규칙은 [AGENTS.md](../AGENTS.md)를 따른다.

## 폴더 구조

```
src/
  types/candidate.ts          # Stage, CandidateSummary, CandidateDetail, 직무 목록
  mocks/                      # MSW (백엔드 역할)
    config.ts                 # 지연·실패율, URL 쿼리 시연 제어
    db.ts                     # localStorage 저장소 (버전 키)
    seed.ts                   # 시드 생성기 (고정 결과)
    handlers.ts               # createHandlers({ db, failRate, delay })
    browser.ts                # 브라우저 워커 시작
  api/
    client.ts                 # fetch 래퍼, ApiError
    candidates.ts             # 조회·단계 변경 API 함수
    queryClient.ts            # 재시도 정책 (조회 1회, mutation 0회)
  features/
    board/                    # 보드, 컬럼, 카드, 상태 화면(loading/error/empty)
    filters/                  # 검색창, 직무 필터, URL 동기화, 필터 순수 함수
    candidate-detail/         # 슬라이드 아웃 패널, 상세 조회
    stage-move/               # 단계 이동 메뉴, 이동 상태 저장소, 표시 단계 파생
  components/ui/              # shadcn 컴포넌트
```

---

## 0. 디자인 시안 (1단계와 병행)

- [ ] Claude 디자인으로 보드 화면 시안 제작: 페이지 레이아웃, 컬럼, 카드, 단계 이동 메뉴, 상세 슬라이드 아웃, 검색·필터, 토스트, loading/error/empty 상태
- [ ] 시안에서 사용할 shadcn 컴포넌트 확정 (후보: `sheet`, `dropdown-menu`, `input`, `checkbox`, `popover`, `badge`, `skeleton`, `sonner`)

## 1. Mock API 및 데이터 모델

| 완료 | 커밋 | 내용 | 완료 조건 |
|---|---|---|---|
| [x] | `feat(candidate-model)` | 타입 정의(`Stage` 5종, `CandidateSummary`, `CandidateDetail`, 직무 목록), 시드 생성기(기본 1,000건, 같은 입력이면 같은 결과), localStorage 저장소(버전 키가 없거나 다르면 시드 재생성) | 새로고침해도 같은 데이터가 유지됨 |
| [x] | `feat(mock-api)` | MSW 설치·워커 설정, 핸들러 3종, 모든 요청에 200~800ms 지연 + 15% 실패(500 + `{ message }`), 시연 제어(`?mockFail=1/0`, `?mockSeed=0`, `?mockReset=1`, 개발·배포 환경 모두) | 개발자도구 Network에서 지연·실패가 보이고, PATCH 결과가 새로고침 후에도 유지됨 |

**API 규약**

| 메서드 · 경로 | 응답 |
|---|---|
| `GET /api/candidates` | `CandidateSummary[]` (`id`, `stage`, `name`, `position`, `appliedAt`) |
| `GET /api/candidates/:id` | `CandidateDetail` (요약 필드 + 이메일, 연락처, 경력 연차, 학력) |
| `PATCH /api/candidates/:id/stage` | 요청 `{ stage }` → 변경된 `CandidateDetail` |

## 2. 기본 UI (시안 기준, props로 데이터를 받는 화면 컴포넌트)

| 완료 | 커밋 | 내용 |
|---|---|---|
| [x] | `feat(page-layout)` | 헤더, 검색·필터 영역, 보드 영역 배치 |
| [x] | `feat(board-column)` | 5개 컬럼(서류검토·면접·처우협의·최종합격 + 불합격 전용), 컬럼 헤더 인원수, 컬럼 0건 표시("이 단계의 지원자 없음") |
| [x] | `feat(candidate-card)` | 카드(이름·직무·지원일·현재 단계), 카드 클릭 시 상세 열기 콜백 |
| [x] | `feat(stage-move-ui)` | 카드의 단계 이동 액션 메뉴(현재 단계 제외 목록), 선택 콜백 |
| [x] | `feat(detail-panel-ui)` | 슬라이드 아웃 패널, 상세 필드 표시, 패널 내부 로딩·에러 영역 |
| [x] | `feat(search-filter-ui)` | 검색 입력 + 검색 버튼(Enter로도 적용), 직무 다중 선택 체크 UI, 필터 초기화 |
| [x] | `feat(toast)` | 토스트 컨테이너, 성공/실패(다시 시도 액션 포함) 알림 형식 |
| [x] | `feat(status-views)` | 로딩 스켈레톤(컬럼 구조 유지), 에러 + 다시 시도, 빈 상태(전체 0건 / 필터·검색 0건 + 필터 초기화) |

## 3. 조회 및 필터링

| 완료 | 커밋 | 내용 | 완료 조건 |
|---|---|---|---|
| [x] | `feat(api-client)` | fetch 래퍼와 `ApiError`, candidates API 함수 3종, QueryClient 재시도 정책(조회 1회, mutation 0회) | 실패 응답이 `ApiError`로 전달됨 |
| [x] | `feat(candidate-list-query)` | 목록 조회, stage별 컬럼 분류, 보드에 연결, loading/error/empty(전체 0건) 연결 | `?mockFail=1`에서 에러 + 다시 시도, `?mockSeed=0`에서 전체 0건 표시 |
| [x] | `feat(candidate-detail-query)` | 상세 조회, 패널에 연결, 패널 내부 로딩·에러 | 상세 조회가 실패해도 보드는 그대로 유지됨 |
| [x] | `feat(search-filter)` | 필터 순수 함수(이름 공백 제거 후 부분 일치, 직무 OR, 이름 AND 직무, 직무 미선택 = 전체), 검색은 버튼·Enter 시 적용, 직무는 체크 즉시 적용, URL 동기화(`?q=&position=&position=`, `replaceState`), 필터·검색 0건 표시 | 새로고침·링크 공유 시 조건 복원 |

## 4. 단계 변경

| 완료 | 커밋 | 내용 | 완료 조건 |
|---|---|---|---|
| [ ] | `feat(stage-move)` | PATCH 요청, 성공 시 목록·상세 캐시를 서버 응답으로 갱신(TanStack Query), 성공 토스트 | 이동 결과가 새로고침 후에도 유지됨 |
| [ ] | `feat(optimistic-update)` | 지원자별 이동 상태 저장소(`inFlightTarget`), 표시 단계 파생(`inFlightTarget` → 확인된 단계), 클릭 즉시 반영, 실패 시 확인된 단계로 rollback + 실패 토스트(다시 시도), 같은 단계 선택 무시, 상세 패널도 같은 표시 규칙 사용 | `?mockFail=1`에서 카드가 이동했다가 원래 컬럼으로 돌아오고 토스트가 뜸 |

> `pendingTarget` 직렬화(연속 이동)는 Should의 경쟁 상태 처리에서 추가한다. Must 단계에서는 요청이 진행 중인 카드의 이동 메뉴를 비활성화해 지원자별 동시 요청 1개를 보장한다.

## 5. Must 테스트

MSW Node 환경(`setupServer`)에서 `createHandlers({ db, failRate: 0, delay: 0 })`를 기본으로 쓰고(db는 메모리 저장소 주입), 실패 테스트만 `failRate: 1`을 주입한다.

| 완료 | 커밋 | 체크리스트 |
|---|---|---|
| [ ] | `test(mock-api)` | [ ] 목록 응답에 요약 필드만 있음 [ ] 상세 응답에 상세 필드 포함 [ ] PATCH 결과가 저장소에 반영됨 [ ] `failRate: 1`이면 500 [ ] 저장소 버전이 다르면 시드 재생성 |
| [ ] | `test(stage-move)` | [ ] 단계 변경 성공 → 목록·상세 캐시 갱신 + 성공 토스트 [ ] 단계 변경 실패 → 확인된 단계로 rollback + 실패 토스트 [ ] 실패 토스트의 다시 시도 동작 [ ] 같은 단계 선택 시 요청 없음 [ ] 요청 중 이동 메뉴 비활성화 |
| [ ] | `test(search-filter)` | [ ] 이름 부분 일치·공백 제거 [ ] 직무 다중 선택 OR [ ] 이름 AND 직무 [ ] 직무 미선택 = 전체 [ ] 검색은 버튼·Enter 시에만 적용 [ ] 직무는 체크 즉시 적용 [ ] URL 쿼리 복원 |
| [ ] | `test(status-views)` | [ ] 조회 중 스켈레톤 [ ] 조회 실패 → 에러 + 다시 시도 후 성공 [ ] 전체 0건 [ ] 필터·검색 0건 + 필터 초기화 [ ] 컬럼 0건 |
| [ ] | `test(integration)` | [ ] 앱 로드 → 카드 이동 실패 → rollback + 토스트 → 다시 시도 성공 [ ] 검색·필터로 0건 → 필터 초기화 → 보드 복원 |

---

## Should (Must 완료 후)

| 완료 | 커밋 | 내용 |
|---|---|---|
| [ ] | `feat(race-condition)` | `pendingTarget` 추가, 지원자별 요청 직렬화, 요청 중 이동 메뉴 활성화, DECISIONS 2-3 시나리오 2~7과 세부 규칙 적용 |
| [ ] | `feat(virtualization)` | 1,000건 기준 컬럼별 가상 스크롤 (라이브러리는 이 단계에서 확정) |
| [ ] | `feat(undo)` | 방금 한 이동 취소. 되돌리기도 같은 이동 흐름(새 이동 의도)으로 처리 |
| [ ] | `test(...)` | 경쟁 상태 시나리오 2~7, 가상 스크롤 렌더링, Undo 추가 테스트 |
| [ ] | `feat(a11y-keyboard)` | 키보드만으로 단계 이동·상세 열람, 패널 닫힘 시 카드로 포커스 복귀, 이동 결과 스크린리더 알림 |

드래그앤드롭은 추후 발전 요건으로 남긴다 (DECISIONS 2-1).

## 마무리

| 완료 | 커밋 | 내용 |
|---|---|---|
| [ ] | `docs(readme)` | mock API 방식, 시연 링크(`?mockFail=1` 등), 배포 링크(선택) |
