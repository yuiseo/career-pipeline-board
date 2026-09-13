# PROMPTS — 프롬프트 & 리뷰 로그

기능 단위 커밋 순서와 1:1로 대응하도록 정리합니다. (커밋 규칙: [CONTRIBUTING.md](./CONTRIBUTING.md))

- 사용 AI 도구: Claude Code (Claude Opus 5)

---

## [scaffold] 제출용 문서 골격

### 프롬프트 1

```
너는 시니어 개발자로 프론트엔드 구현과 mockAPI 백엔드를 구현하는 과제를 나와 함께 진행한다.
먼저 TEST_GUIDE.md를 확인하여 환경 설정을 할 것이며, 서브 에이전트를 활용하여 기술 스택 환경설정을 할것이다.
먼저 TEST_GUIDE.md를 확인하여 계획을 세울 것이며 모든 것은 나의 확인이 필요하다.
```

### AI 출력 요지

- 과제 가이드를 Must / Should / mock API 제약 / 제출물로 요약
- 계획상 유의점 3가지 제시: 이 대화 자체가 PROMPTS.md 기록 대상, 첫 커밋은 환경설정, 롤백·경쟁 상태 로직은 직접 구현이 유리
- 첫 질문으로 프레임워크 선택지(Vite + React + TS 권장 / Next.js / 기타) 제시

### 프롬프트 2

```
일단 도구 설정 전에 이 가이드에서 필수적으로 요구하는 scaffold를 설정할 것이다.
```

### AI 출력 요지

- 필수 산출물 3종(README.md / PROMPTS.md / DECISIONS.md)의 골격 구성안 제시
- 기능 단위 분해 초안(scaffold → setup → mock-api → … → a11y-keyboard) 제시
- 과제 원문 TEST_GUIDE.md를 공개 repo에 올릴지 확인 요청 (gitignore 권장)

### 프롬프트 3

```
좋아, TEST_GUIDE.md는 gitignore 하고 골격 만들어줘. 그리고 commit 메시지 규칙(type)을 CONTRIBUTING.md로 설정해둘 것.
리뷰 검증칸은 초안을 보고 내가 판단한 뒤에 내가 판단한 근거들을 글로 옮겨줄 것.
기능 분해는 구현 계획세우고 나서 자세히 적을 것.
```

### AI 출력 요지

- `.gitignore`(TEST_GUIDE.md 제외), `README.md`, `PROMPTS.md`, `DECISIONS.md`, `CONTRIBUTING.md` 골격 생성
- 기능 분해 상세는 구현 계획 확정 후로 미룸

### 리뷰 / 검증

- **문제였던 점:** AI의 첫 계획은 프레임워크(Vite / Next.js 등) 선택부터 제안함. 과제가 필수로 요구하는 제출물 골격보다 도구 세팅이 먼저 오는 순서였음.
- **어떻게 알아챘나:** 가이드의 제출물·커밋 규칙(5장, 6장, 7장)을 기준으로 AI 계획의 순서를 직접 검토함.
- **판단:** 순서를 **수정**함. Next.js 같은 기술 스택 세팅보다 스캐폴드(제출 문서 골격)를 먼저 완성하도록 지시함. 이후 생성된 골격 파일은 **변경 없이 채택**함.
- **확인한 내용:** 생성된 `.gitignore`, `README.md`, `PROMPTS.md`, `DECISIONS.md`, `CONTRIBUTING.md`를 직접 확인했고, 의도한 구성대로 생성됨을 확인함.

---

## [setup] 기술 스택 환경설정

### 프롬프트 1

```
먼저 우리가 구현해야 하는 것을 살펴보자. 필수 요건을 중심으로 하며 다음 제약사항을 구현할 수 있는 환경을 채택해야 함.
 **네트워크 지연(200~800ms)과 실패(약 15%)**를 시뮬레이션할 것.
그리고 도전 요건까지 반영할 수 있는 환경이 무엇인지 판별해볼 것임.
```

### AI 출력 요지

- 요구사항별로 환경이 갖춰야 할 조건을 도출
  - C1 모든 요청(GET 포함)에 지연·실패 주입 / C2 지연·실패율 제어 가능(테스트·시연 재현) / C3 새로고침 후 유지되는 저장소 / C4 mock API를 테스트에서 재사용
  - 검색·필터를 API로 보내면 키 입력마다 200~800ms 지연 → 목록 1회 조회 후 클라이언트 필터링 필요
  - 무작위 지연으로 응답 순서가 뒤바뀌므로 경쟁 상태가 자연 재현됨
- 화면 요구사항은 Vite·Next.js 모두 가능 → 차이는 mock API 층이라고 보고 4가지 방식 비교
  - A. 앱 내부 가짜 API 모듈 / B. MSW / C. 로컬 Node 서버 / D. Next.js Route Handler
- 결론(안): B(MSW) + Vite + React + TS 권장. 근거는 배포 시 persist 유지, 테스트에서 핸들러 재사용, 실제 HTTP 경로

### 리뷰 / 검증

- **판단 기준:** AI는 배포 시 persist·테스트 재사용을 근거로 들었으나, 배포를 가정하지 않더라도 이 과제의 평가 대상이 무엇인지를 기준으로 판단함.
- **판단:** 이 과제는 Next.js의 강점인 SSR, Server Component를 평가하는 것이 아니라 **클라이언트단의 상호작용과 비동기 상태관리**가 주요 평가 요소로 보임. 따라서 Next.js 없이 **SPA로 충분히 구현 가능**하다고 판단함.
- **Next.js 없이 생길 수 있는 공백 검토:** 상태 공유가 필요하더라도 필터·검색 상태를 URL에 담으면 공유 가능하므로 SPA의 한계가 되지 않음.
- **결정:** mock API 방식은 **B(MSW) 채택**, 프레임워크는 SPA(Vite + React + TS).

### 프롬프트 2

```
서브 에이전트를 통해 환경을 구성할 것.
메인 에이전트인 너는 나와 환경 세팅 이후의 기능 요건에 대한 설계를 함께 할 것.

1. 기존에 설치된 pnpm을 사용. 린트포맷, 테스트 러너, 빌드, 패키지 매니저는 너의 제안에 따라 기본 세팅을 설정함.
2. 스타일링의 경우 tailwindCSS를 사용하며 shadcnUI를 통해 별도의 디자인 시스템 큰 구현 없이 빠르게 스타일링을 진행.
3. 서버 상태 관리는 tanstack query를 통해 선언형으로 서버 상태를 관리할 수 있도록 함.
4. msw는 백엔드 세팅 단계에서 세팅할 것.
5. 기타 라이브러리는 설계 이후 확정.
```

### AI 출력 요지

- 메인 에이전트가 위 결정을 서브 에이전트(env-setup) 작업 지시로 변환해 전달 (아래 프롬프트 3)

### 프롬프트 3 (메인 에이전트 → 서브 에이전트)

<details>
<summary>서브 에이전트 작업 지시 원문</summary>

```
작업 디렉토리: /Users/iseoyu/Desktop/career-pipeline-board (git 저장소, main 브랜치)

이미 존재하는 파일 (절대 덮어쓰지 말 것): README.md, PROMPTS.md, DECISIONS.md, CONTRIBUTING.md, .gitignore, TEST_GUIDE.md(gitignore됨, 건드리지 말 것)

## 목표
아래 스택으로 "채용 파이프라인 보드" SPA 프로젝트의 기술적 기반(scaffold)만 구성한다. 화면 기능(보드, 카드, mock API 등)은 이후 별도 커밋에서 구현하므로 지금은 만들지 않는다. 커밋은 하지 말 것 — 메인 세션이 검토 후 커밋한다.

## 스택 (사용자 확정)
1. Vite + React + TypeScript (strict 모드), pnpm 사용 (이미 설치됨: pnpm 10.15.0, node v24.20.0)
2. ESLint + Prettier — Vite 템플릿 기본 ESLint(flat config, typescript-eslint) 유지 + eslint-config-prettier로 포맷 규칙 충돌 제거 + Prettier 기본 설정
3. Vitest + React Testing Library + @testing-library/user-event + @testing-library/jest-dom + jsdom
4. Tailwind CSS (최신 안정 버전, Vite 플러그인 방식 권장) + shadcn/ui (CLI init, 컴포넌트는 아직 추가하지 않아도 됨 — init만으로 충분. `@/*` path alias 필요하므로 tsconfig.json과 vite.config.ts에 alias 설정 포함)
5. TanStack Query (`@tanstack/react-query`) — 설치하고 `QueryClientProvider`로 앱을 감싸는 골격만 구성 (실제 쿼리는 아직 없음)
6. MSW는 설치하지 말 것 — 이후 별도 mock-api 기능 커밋에서 세팅함

## 디렉토리 충돌 처리
저장소 루트에 이미 문서 파일이 있어 `pnpm create vite . --template react-ts`가 non-empty 디렉토리 오류를 낼 수 있다. 다음 순서로 진행:
1. 임시 디렉토리(예: 스크래치패드 또는 /tmp 하위)에 `pnpm create vite@latest <temp> --template react-ts`로 스캐폴드 생성
2. 생성된 파일/폴더(src/, public/, index.html, tsconfig*.json, vite.config.ts, eslint.config.js, package.json 등)를 저장소 루트로 복사
3. 기존 README.md/PROMPTS.md/DECISIONS.md/CONTRIBUTING.md는 그대로 유지 (Vite 템플릿의 README는 버림)
4. .gitignore는 병합한다 — 기존 내용(TEST_GUIDE.md 등)을 유지한 채 Vite/Node 표준 무시 항목(node_modules, dist, .env 등)을 추가
5. 임시 디렉토리는 정리(삭제)

## 세부 작업
- tsconfig.json: strict: true 확인, `@/*` → `src/*` path alias 추가 (baseUrl + paths), vite.config.ts에도 동일 alias를 resolve.alias로 추가 (shadcn 요구사항)
- ESLint: 기존 flat config 유지하되 eslint-config-prettier 추가해서 충돌 규칙 끔. package.json에 `lint` 스크립트 확인
- Prettier: 루트에 `.prettierrc` (또는 동등 설정) 작성, 간단한 기본값(semi, singleQuote 등은 팀 관례보다 Prettier 기본값 그대로 두고 과도한 커스터마이징 하지 말 것)
- Vitest: `vite.config.ts`에 test 블록 추가 또는 별도 `vitest.config.ts`, environment: 'jsdom', setupFiles로 jest-dom matcher 등록, package.json에 `test` 스크립트 추가. 테스트 파일이 아직 하나도 없으니 `pnpm test`가 "no test files" 에러로 실패하지 않도록 vitest 설정에 `passWithNoTests: true` 추가 — 단, 이후 실제 테스트를 짤 것이므로 App 컴포넌트가 정상 렌더링되는지 확인하는 스모크 테스트 1개(`src/App.test.tsx` 등)를 만들어 RTL 배선이 실제로 동작하는지 검증할 것
- Tailwind: 최신 안정 버전 설치, `@tailwindcss/vite` 플러그인 방식(v4) 또는 PostCSS 방식(v3) 중 shadcn/ui 최신 CLI와 호환되는 쪽 선택. index.css에 tailwind 지시어/임포트 반영
- shadcn/ui: `pnpm dlx shadcn@latest init`을 비대화형으로 실행 (필요한 플래그 사용, 예: `-d`/`--defaults` 또는 `-y`). 대화형 프롬프트가 막히면 `components.json`을 직접 작성해도 됨 (baseColor는 zinc 또는 neutral 등 기본값, cssVariables: true). 컴포넌트 추가(`shadcn add button` 등)는 하지 말 것 — init까지만
- TanStack Query: `@tanstack/react-query` 설치, `src/main.tsx`에서 `QueryClient` 생성 후 `QueryClientProvider`로 `<App />` 감싸기. Devtools는 설치하지 않아도 됨 (필요하면 devDependency로만 추가하고 이유를 보고에 남길 것)
- README.md의 "설치 · 실행"과 "기술 스택" 섹션만 채워 넣기 (다른 섹션은 건드리지 말 것): 설치(`pnpm install`), 실행(`pnpm dev`), 빌드(`pnpm build`), 테스트(`pnpm test`), 린트(`pnpm lint`) 명령과 확정된 스택 목록

## 검증 (반드시 실행하고 결과를 보고할 것)
- `pnpm install`
- `pnpm build` (타입 에러 없이 성공해야 함)
- `pnpm lint` (에러 없어야 함, warning은 있어도 보고)
- `pnpm test` (스모크 테스트 통과)

## 최종 보고에 반드시 포함할 것
1. 각 라이브러리의 실제 설치된 버전 (package.json dependencies/devDependencies 전체)
2. Tailwind/shadcn 설정에서 내린 판단이나 기본값에서 벗어난 부분과 이유
3. 위 4가지 검증 명령의 실제 출력(성공/실패, 실패 시 전체 에러)
4. 새로 생성/수정된 파일 목록 (git status 결과)
5. 다음 단계(기능 구현)를 위해 알아둬야 할 특이사항이 있다면 명시

커밋은 하지 말고, 모든 변경사항을 working tree에 남겨둔 채 보고를 종료할 것.
```

</details>

### AI 출력 요지 (서브 에이전트 1차 결과)

- Vite 8 + React 19 + TS 6(strict), ESLint(flat) + Prettier, Vitest 5 + RTL, Tailwind v4 + shadcn/ui(radix), TanStack Query v5 구성. build/lint/test 통과 보고
- 지시와 달라진 부분 보고
  - 최신 create-vite가 기본 린터를 oxlint로 바꿔서 `--eslint` 플래그로 ESLint 강제
  - TS 6에서 `baseUrl`이 deprecated(TS5101) → `paths`만 사용
  - shadcn CLI의 대화형 선택을 `-b radix -p nova`로 우회
  - shadcn CLI가 루트 `tsconfig.json`의 paths만 읽어서, 루트에 alias가 없으면 `./@/` 리터럴 폴더를 생성하는 문제 발견·수정
  - shadcn `button.tsx`가 `react-refresh/only-export-components`에 걸려 `src/components/ui/**`에서만 규칙 off

### 메인 에이전트 검증 (1차 결과)

- build/lint/test 직접 재실행 → 통과 확인
- 의심 항목 확인: `cn` 패키지는 shadcn-ui 공식 저장소 패키지(clsx + tailwind-merge 대체)임을 `node_modules/cn/package.json`으로 확인. `shadcn`이 dependencies에 있는 것은 `index.css`가 `shadcn/tailwind.css`를 import하기 때문임을 확인
- 문제 발견
  - `prettier --check` 결과 10개 파일 스타일 불일치 (Vite 템플릿은 작은따옴표, shadcn은 큰따옴표). 원인은 메인 에이전트 지시에 포맷 적용 단계와 `format` 스크립트가 빠졌기 때문
  - Vite 데모 코드(카운터, 로고, `App.css`, assets) 방치 → 가이드의 "미사용 코드 방치" 감점 신호
  - `index.css`에서 데모 변수 `--border`, `--accent`가 shadcn 토큰과 이름이 겹침
- 참고 사항(보류): TanStack Query 기본 `retry: 3` 때문에 15% 실패가 에러 상태로 잘 드러나지 않음 → mock-api / loading-error-empty 설계에서 결정

### 프롬프트 4

```
서브 에이전트에게 데모 코드를 지워.
shadcn 코드와 동일하게 사용해 규칙을 만들 것.
```

### AI 출력 요지

- 메인 에이전트가 shadcn 생성 코드(`button.tsx`)의 스타일을 분석함: 큰따옴표, 세미콜론 없음, 함수 인자 끝 쉼표 없음. Prettier 3 기본값(`trailingComma: "all"`)으로는 diff가 생기므로 `{ "semi": false, "trailingComma": "es5" }`로 규칙을 정해 서브 에이전트에 전달
- 규칙이 맞는지 판별하는 기준으로 "포맷 적용 후 `button.tsx`에 diff 없음"을 지정
- 서브 에이전트 결과
  - `.prettierrc`, `.prettierignore`(dist, lock 파일, 기록용 md 문서) 추가, `format` / `format:check` 스크립트 추가
  - 포맷 적용 후 `button.tsx` 변경 0바이트
  - Vite 데모 코드 삭제, `App`은 `<h1>`만 남김, `index.css`는 shadcn 토큰만 남김, `index.html`은 `lang="ko"`와 제목 수정
  - `--border`, `--accent`는 shadcn init이 이미 자기 값으로 치환한 상태였고, 남은 값이 neutral 기본 토큰임을 확인

### 메인 에이전트 검증 (2차 결과)

- build / lint / test / format:check 직접 재실행 → 모두 통과
- `button.tsx`에서 함수 인자 끝 쉼표 없음(`  }` 다음 `)`)이 유지되어 es5 규칙이 shadcn 스타일과 일치함을 확인
- 삭제한 파일(App.css, assets, svg)을 참조하는 코드가 `src`와 `index.html`에 없음을 grep으로 확인
- `index.css` 전체를 읽어 데모 변수가 남지 않았음을 확인

### 리뷰 / 검증

- **1차 결과 판단:** 데모 코드는 서브 에이전트에게 삭제시킴. 코드 스타일 규칙은 shadcn 코드와 동일하게 만들도록 지시함.
- **최종 결과 판단:** 서브 에이전트가 지시와 다르게 처리한 부분(`--eslint` 플래그 강제, `baseUrl` 제거 후 `paths`만 사용, shadcn `radix` + `nova` 프리셋, `ui/` 폴더 `react-refresh` 규칙 off)을 포함해 환경설정 결과를 **모두 수용**함.
- **`ui/` 폴더 규칙 off 판단 근거:** `src/components/ui/`는 shadcn 라이브러리 컴포넌트를 받아 두는 저장소이므로, 해당 폴더에 한해 `react-refresh/only-export-components` 규칙을 꺼서 shadcn 생성 코드와 린트 규칙의 충돌을 없앰.
