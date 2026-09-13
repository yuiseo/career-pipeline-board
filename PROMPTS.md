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

---

## [design] 기능 설계 (1차)

설계는 AI가 선택지와 추천안을 제시하고, 사용자가 판단해 지시하는 방식으로 진행했다. 각 설계 항목은 `AI 출력 요지 → 프롬프트(사용자 판단) → 리뷰 / 검증` 순서로 기록한다. 확정된 결정은 [DECISIONS.md](./DECISIONS.md)에 정리했다.

### 설계 1. 불합격 표현 방식

#### AI 출력 요지

- 가이드의 "최종합격 / 불합격" 표현이 단계 이동 방식과 직결된다고 보고 두 가지 선택지 제시
  - 전용 컬럼 하나 (추천): 어느 단계에서든 불합격 컬럼으로 이동, 이동 메커니즘이 다른 단계와 동일
  - 각 단계에 딸린 상태 플래그: 컬럼은 4개, 카드에 탈락 배지. 컬럼 이동과 별도의 불합격 액션이 필요

#### 프롬프트

```
불합격의 경우 서류검토, 면접, 처우협의 중 이동될 수 있는 상태이므로 전용 컬럼이 존재해야 한다고 생각.
```

#### 리뷰 / 검증

- **판단:** 불합격은 서류검토·면접·처우협의 중 어느 단계에서든 이동될 수 있는 상태이므로 전용 컬럼이 필요하다고 판단해 **전용 컬럼 채택**.

### 설계 2. 단계 이동 방식

#### AI 출력 요지

- 액션 버튼 / 드래그앤드롭 비교
  - 가이드상 드래그앤드롭을 택하면 키보드 대체 경로가 추가로 필요함
  - 드래그앤드롭은 가상 스크롤과 함께 쓸 때 드래그 중인 카드가 언마운트되는 문제가 있음
- 액션 버튼(메뉴) 방식 추천

#### 프롬프트

```
액션 버튼 방식으로 진행. 판단 근거는 일단 must 요건에 맞춰서 구현하는 것을 목표로 함.드래그앤 드롭이 사용자에게 편의성을 주지만 제한 시간 안에 과제를 구현해야 하기 때문에 추후 발전 가능한 요건으로 남겨두기로 결정.
```

#### 리뷰 / 검증

- **판단:** 우선 Must 요건에 맞춰 구현하는 것을 목표로 함. 드래그앤드롭이 사용자에게 편의성을 주지만 제한 시간 안에 과제를 구현해야 하므로 **액션 버튼 채택**.
- 드래그앤드롭은 기각이 아니라 추후 발전 가능한 요건으로 남김.

### 설계 3. 지원자 데이터 모델

#### AI 출력 요지

- `Stage` 5종과 `Applicant` 모델 제안
  - 카드 필드: 이름·직무·지원일·단계
  - 상세 필드: 이메일·연락처·경력 연차·메모
- 직무 목록은 5~6개 고정, 상세 보기는 읽기 전용
- 단계 이동 이력과 `version` 필드는 제외

#### 프롬프트

```
일단 필수적으로 지원자 카드에 보이는 것은 다음과 같음.
-  이름
-  직무
-  지원일
-  현재단계

---
필터링
- 직무
---
검색
- 이름
---

나머지 정보의 경우 임의로 구현 가능.
보통 채용 관련해서 보고싶은 사안은 다음과 같은 것으로 예상됨.
- 이메일
- 연락처
- 경력 연차
- 학력

---
일단상세보기의 추가적인  기본적적인 사항에 대해서는 이후 구현에서 추가하는 것으로 정함.
```

#### 리뷰 / 검증

- **판단:** 카드에 보이는 항목은 가이드가 명시한 이름·직무·지원일·현재 단계로 한정. 필터는 직무, 검색은 이름.
- **수정:** AI가 제안한 상세 필드에서 메모를 빼고, 채용 담당자가 보통 확인하려는 정보로 이메일·연락처·경력 연차·학력을 예상함.
- **범위 조정:** 상세 보기의 추가 필드는 이후 상세 보기 구현 단계에서 추가하기로 함.

### 설계 4. mock API 규약

#### AI 출력 요지

- `GET /api/applicants`(전체 필드 목록)와 `PATCH /api/applicants/:id` 제안. 검색·필터는 클라이언트에서 처리
- 모든 요청에 200~800ms 지연과 15% 실패 적용, localStorage 버전 키로 저장, 시드 1,000건
- URL 쿼리 기반 시연 제어(`mockFail`, `mockSeed`, `mockReset`), 테스트용 `createHandlers` 팩토리
- 상세 보기는 목록 캐시를 사용하므로 단건 조회(`GET /:id`)를 두지 않는 방식 제안

#### 프롬프트

```
목록에 전체 필드를 두지 않고 목록에는 id, stage, name, position, appliedAt 기본 정보만 두고 상세 보기용 조회의 경우 따로 생성을 하는게 맞다고 판단됨. 추후 상세에서 볼 필드가 추가된다고 할 때 한번에 더 많은 데이터를 불러와야 하는 문제가 발생. 단건 조회를 따로 두게되면 실패 범위도 격리된다고 판단됨. 또한 react-query를 사용 예정이라 데이터 캐시가 이 부분에서 이뤄지기 때문.

시연용 제어를 미리 만들어 두는 방법은 좋다고 생각.
기본 시드를 1000건으로 진행.
```

#### 리뷰 / 검증

- **문제:** AI 제안처럼 목록에 전체 필드를 담으면, 추후 상세 필드가 추가될 때 목록 조회 한 번에 더 많은 데이터를 불러와야 함.
- **판단:** 목록 응답은 `id`, `stage`, `name`, `position`, `appliedAt`만 담고 상세 조회를 따로 생성하도록 **수정**.
  - 단건 조회를 따로 두면 실패 범위가 격리됨
  - React Query를 사용하므로 상세 데이터 캐시가 쿼리 단위로 이뤄짐
- **채택:** 시연용 제어를 미리 만들어 두는 방식과 기본 시드 1,000건.

### 설계 5. 낙관적 업데이트 롤백 · 경쟁 상태

#### AI 출력 요지

- TanStack Query 문서 예제(요청 직전 스냅샷으로 롤백)는 연속 이동 시 오래된 스냅샷으로 되돌아가 서버와 어긋나는 문제 제시. 무작위 지연으로 서버 반영 순서가 뒤바뀌는 문제도 함께 제시
- 접근안 3가지 비교
  - A. 카드별 요청 직렬화 + 최신 의도만 전송 (직접 구현, 추천)
  - B. 서버 버전 검사
  - C. TanStack `scope` 옵션

#### 프롬프트 1

```
현재 핵심 로직은 다음처럼 생각된다.

1. 단일 요청 실패
서류 → 면접
API 실패
→ 서류 rollback

2. 연속 이동 성공
서류 → 면접 → 처우
req1 성공
req2 성공
→ 최종 처우

3. 연속 이동 중 첫 요청 실패
서류 → 면접 → 처우
req1 실패
→ 서류 rollback
→ req2 미전송

따라서 UI와 확인된 서버 상태를 분리하는게 깔끔해보임.
예를 들면 다음과 같은 데이터 모델로 반영하는 것이 좋아보인다.
type CandidateStageState = {
  confirmedStage: Stage
  optimisticStage: Stage
  pendingTarget?: Stage
  inFlight: boolean
}

따라서 A 방식으로 설계를 진행
```

#### AI 출력 요지

- 사용자 모델을 기준으로 추가 시나리오 4~8 검토
  - req1 성공 후 req2 실패 / 대기 중 연속 선택 / 진행 중 재선택 / 진행 중 목록 재조회 / 상세 캐시 stage
- 모델 보완안 2가지 제시
  - (a) 필드를 유지하고 불변식을 테스트로 고정
  - (b) `inFlight: boolean` 대신 `inFlightTarget`을 두고 `optimisticStage`를 계산값으로 파생 (추천)
- 서버 상태는 Query 캐시, 이동 중인 카드만 별도 스토어, 로직은 순수 reducer로 분리하는 구조 제안

#### 프롬프트 2

```
4~8 은 다음 세가지 판정 기준이 맞다면 맞다고 판별.
1. UI는 항상 가장 최근 사용자의 의도를 보여줌
2. 서버 요청은 지원자별로 동시에 하나만 실행.
3. 요청 실패시 해당 지원자는 마지막 confirm sate로 복구하고 pending intent를 버림

---
모델의 경우 너의 제안대로 저장하는 값에 대한 정합성을 유지 하기 어려운 optimisticStage는 계산 값으로 파생하고 inflightTarget을 Stage로 두는 것으로 함.

다시 정리하면 State 타입은 inflightTarget, pendingTarget으로 지원자별 상태를 저장.

화면에 표시할 때는 우선순위를 다음과 같이 계산
 pendingTarget(요청 처리중 추가로 선택된 가장 최근 상태) -> inflightTarget(현재 서버에 요청중인 상태)->지원자의 서버에서 마지막으로 확인된  상태
```

#### AI 출력 요지

- 시나리오 4~8을 3가지 판정 기준으로 하나씩 검증한 표 제시
  - 4~7은 기준 충족
  - 8(상세 캐시 stage)은 요청 진행 중 상세 캐시가 이전 값을 가지므로 보완이 필요하다고 지적
- 세부 규칙 2가지 제안 (아래 확인 대기 항목)

#### 프롬프트 3

```
8 상세 캐시의 경우 react-query를 활용하여 값을 변경.
```

#### 리뷰 / 검증

- **판단 기준 수립:** AI가 제시한 추가 시나리오를 개별로 판단하지 않고, 판정 기준 3가지를 세워 그 기준으로 맞고 틀림을 판별함.
  1. UI는 항상 가장 최근 사용자의 의도를 보여준다.
  2. 서버 요청은 지원자별로 동시에 하나만 실행한다.
  3. 요청이 실패하면 해당 지원자는 마지막으로 확인된 상태로 복구하고 pending intent를 버린다.
- **모델 수정:** 처음 제시한 모델의 `optimisticStage`는 저장 값의 정합성을 유지하기 어려움. AI 보완안 (b)를 채택해 계산 값으로 파생하고, `inFlight: boolean`을 `inFlightTarget: Stage`로 바꿈. 지원자별 저장 상태는 `inFlightTarget`, `pendingTarget` 두 가지.
- **화면 표시 우선순위:** `pendingTarget` → `inFlightTarget` → 서버에서 마지막으로 확인된 단계.
- **시나리오 8:** 상세 캐시의 stage는 TanStack Query를 활용해 값을 변경하기로 함.

### 확인 대기 (2차 설계에서 결정)

- 롤백 모델 세부 규칙 2가지 (AI 제안)
  - 진행 중 요청이 없고 현재 표시 단계와 같은 단계를 선택하면 무시
  - req1 성공 시 `pendingTarget`이 확인된 단계와 같으면 전송하지 않음
- 로딩·에러·빈 상태 설계와 조회 재시도 정책 (AI 추천: 조회 1회 재시도, 이동은 재시도 없음)
- 검색·필터, 상세 보기 형태, Undo, 가상 스크롤, 키보드 접근성, 폴더 구조, 추가 라이브러리 확정

---

## [design] 기능 설계 (2차)

### 설계 6. 롤백 모델 세부 규칙 · 로딩 · 에러 · 빈 상태

#### AI 출력 요지

- 롤백 모델 세부 규칙 2가지 제안
  - 진행 중 요청이 없고 현재 표시 단계와 같은 단계를 선택하면 무시
  - req1 성공 시 `pendingTarget`이 확인된 단계와 같으면 전송하지 않음
- 로딩: 컬럼 구조를 유지한 스켈레톤. 에러: 보드 영역 메시지 + 다시 시도, 상세 조회 실패는 상세 패널 안에서만 표시
- 빈 상태: 데이터 0건 / 검색·필터 결과 0건 구분, 빈 컬럼은 컬럼 안에 짧게 표시
- 재시도 정책 3가지 비교
  - (a) 조회 1회 재시도·이동은 재시도 없음 (추천)
  - (b) 재시도 없음
  - (c) 기본값 3회

#### 프롬프트

```
1번 규칙은 그대로 채택
2번 - 조회 1회 재시도, 이동 mutation은 재시도 없음. 이 경우는 사용자에게 명시적으로 알리고 다시 시도하라고 하는게 알맞다고 생각.
빈 상태의 경우 3개의 레벨로 구분.
전체 0건 - 등록된 지원자가 없음을 표시
필터/검색 0건 - 조건에 맞는 지원자가 없음 (필터 초기화 유도)
특정 컬럼 0건 - 이 단계의 지원자 없음
```

#### 리뷰 / 검증

- **롤백 세부 규칙:** AI 제안 2가지를 그대로 채택.
- **재시도 정책:** 조회는 1회 재시도, 이동 mutation은 재시도 없음으로 (a) 채택. 이동 실패는 자동 재시도로 처리하기보다 사용자에게 명시적으로 알리고 다시 시도하게 하는 것이 알맞다고 판단함.
- **빈 상태 수정:** AI는 데이터 0건 / 필터 결과 0건 두 가지로 구분하고 빈 컬럼을 부가 표시로 제안함. 이를 3개 레벨로 명확히 구분하도록 정리함.
  1. 전체 0건: 등록된 지원자가 없음
  2. 필터·검색 0건: 조건에 맞는 지원자가 없음 (필터 초기화 유도)
  3. 특정 컬럼 0건: 이 단계의 지원자 없음

### 설계 7. 검색 · 필터 · 상세 보기 형태

#### AI 출력 요지

- 클라이언트 필터링, 입력은 즉시 반영 + `useDeferredValue`(디바운스 없음), 이름 부분 일치, 직무 단일 선택, 이름 AND 직무
- URL 쿼리(`q`, `position`)를 `history.replaceState`로 동기화, 컬럼 헤더에 필터링된 인원수 표시
- 확인 질문: 디바운스 없이 가는지, 직무 단일/다중 선택, URL 동기화를 Must 범위에 넣을지

#### 프롬프트

```
그리고 검색, 필터에 대한것만 정하고 상세보기는 슬라이드 아웃으로 보여줄 것이며 구현 계획을 먼저 작성 후 이제 개발을 할거야.
```

#### AI 출력 요지

- AI 추천안(입력 즉시 반영 + `useDeferredValue`, 직무 단일 선택)을 기준으로 설계 문서에 기록하고 구현 계획 작성을 시작함

#### 프롬프트 2

```
나는 사용자가 입력한대로 바로 변경이 되는게 아닌 검색 버튼 또는 엔터시 검색되도록 유도.
직무 필터의 경우 여러개 선택 가능
url 동기화의 경우 처음부터 구현함.

위의 내용을 설계 문서에 다시 반영해줘.
```

#### 리뷰 / 검증

- **문제:** AI가 세부 선택지 3가지를 확인받지 않고 추천안 기준으로 설계 문서에 기록한 채 구현 계획 작성으로 넘어감. 사용자가 이를 중단시키고 설계를 수정함.
- **검색 수정:** 입력한 대로 바로 결과가 바뀌는 AI 추천안(`useDeferredValue`)을 기각. 검색 버튼 또는 Enter로 검색하도록 유도함.
- **직무 필터 수정:** 단일 선택 추천안을 기각하고 여러 직무를 선택할 수 있게 함.
- **URL 동기화:** 여유 시간 항목이 아니라 처음부터 구현하기로 함.
- **상세 보기:** 슬라이드 아웃 패널로 보여주기로 결정함.
- **진행 방식:** 구현 계획을 먼저 작성한 뒤 개발을 시작함.

#### AI 출력 요지

- 사과 후, 설계 문서 반영 과정에서 AI가 임의로 정한 3가지를 확정 전 재확인 요청
  - 직무 필터 적용 시점(체크 즉시 / 검색 버튼·Enter 시)
  - 직무 미선택 시 처리
  - 조건 조합(이름 AND 직무, 직무끼리 OR)

#### 프롬프트 3

```
1. 직무 필터의 경우 체크 즉시 적용.
2. 직무 하나도 선택하지 않은 경우 전체 직무로 확인.
3. 너의 제안대로 반영.

여기까지 후 커밋.
```

#### 리뷰 / 검증

- **직무 필터 적용 시점:** 이름 검색과 달리 체크하는 즉시 적용하기로 결정함.
- **직무 미선택:** 전체 직무로 보기로 확인함.
- **조건 조합:** AI 제안(이름 AND 직무, 선택한 직무끼리 OR)을 그대로 채택함.

## [plan] 구현 계획

### 프롬프트 1

```
1. Mock API 및 데이터 모델
   - 지원자 목록/상세 타입 정의
   - GET /candidates
   - GET /candidates/:id
   - PATCH /candidates/:id/stage
   - localStorage persistence
   - 200~800ms 지연 / 약 15% 실패
2. 기본 UI
   - 페이지 레이아웃
   - 보드/컬럼
   - 지원자 카드
   - 단계 이동 UI
   - 상세 slide-out
   - 검색창 / 직무 필터
   - toast
   - loading / error / empty 상태
3. 조회 및 필터링
   - TanStack Query 목록 조회
   - 상세 조회
   - 이름 검색
   - 직무 필터
   - stage별 컬럼 분류
4. 단계 변경
   - optimistic update
   - 목록/상세 캐시 동기화
   - 실패 시 rollback
   - 성공/실패 사용자 피드백
5. Must 테스트
   - 단계 변경 성공
   - 단계 변경 실패 및 rollback
   - 검색/필터
   - loading / error / empty 중 핵심 시나리오
그리고 Should는 별도 섹션으로:
- 경쟁 상태 처리
- 1,000건 가상 스크롤
- Undo
- 추가 테스트
- 키보드 접근성 강화

docs로 생성하거나 README.md에 반영할 것.
디자인의 경우 CLAUDE의 시안을 통해 만들 예정.
```

### AI 출력 요지

- 계획을 파일로 쓰기 전에 DECISIONS.md와의 차이 정리
  - 계획에서 빠진 확정 사항: 시드 1,000건·시연 제어·저장소 버전 키, URL 동기화, 조회 1회 재시도, Must에서는 `inFlightTarget`만 사용
- 확인 질문 4가지: API 경로 접두사, 단계와 커밋 대응, 테스트 작성 시점, 디자인 시안 반영 시점
- 계획 위치는 README를 짧게 유지하기 위해 `docs/PLAN.md` 제안

### 프롬프트 2 (확인 질문 응답)

```
테스트 작성 시점: 각 기능을 커밋하고 test 커밋은 따로 만드는게 좋을거 같음. 5단계에는 어떤 테스트가 있어야 하는지 체크리스트로 남기고  부족한 통합 시나리오도 마지막에 보강.
test 커밋 시점: Must 기능을 모두 만든 뒤 몰아서
API 경로: /api/candidates
커밋 단위: 단계 안에서 기능별로 쪼갬
디자인 시점: 2단계 UI 전에 시안 먼저
```

### AI 출력 요지

- `docs/PLAN.md` 작성: 단계별 커밋 목록·완료 조건, API 규약, 5단계 테스트 체크리스트, Should 섹션, 마무리 커밋
- DECISIONS.md 반영: API 경로 `/api/candidates` 및 명칭 변경, 상세 타입을 Mock API 단계에서 정의하도록 가정 수정, 2-7 커밋·테스트 진행 방식 추가
- README 문서 목록에 PLAN.md 링크 추가
- 계획에 새로 넣은 AI 제안 (확인 대기)
  - 폴더 구조
  - 1단계를 `feat(candidate-model)`과 `feat(mock-api)` 두 커밋으로 분리
  - 4단계를 `feat(stage-move)`(비낙관)와 `feat(optimistic-update)`로 분리
  - Must 단계에서 요청 중인 카드의 이동 메뉴를 비활성화해 지원자별 동시 요청 1개를 보장

### 리뷰 / 검증

- **테스트:** AI가 추천한 TDD(기능 커밋에 테스트 포함)를 기각. 기능 커밋과 test 커밋을 분리하고, Must 기능을 모두 만든 뒤 몰아서 작성함. 5단계에는 필요한 테스트를 체크리스트로 남기고 부족한 통합 시나리오를 마지막에 보강함.
- **API 경로:** `/api/candidates` 접두사 방식 채택.
- **커밋 단위:** 계획의 단계 안에서 기능별로 커밋을 나눔.
- **디자인:** 2단계 UI 구현 전에 Claude 시안을 먼저 만듦.
- **계획 문서 검토:** `docs/PLAN.md` 전체를 검토해 예외 사항이 없음을 확인함.
- **AI 추가 제안 4가지:** 폴더 구조, 1단계 커밋 분리(`candidate-model` / `mock-api`), 4단계 커밋 분리(`stage-move` / `optimistic-update`), Must 단계에서 요청 중인 카드의 이동 메뉴 비활성화를 모두 계획으로 확정함.

---

## [feature-spec] 기능 명세 문서화

### 프롬프트 1

```
당신은/Users/iseoyu/Desktop/career-pipeline-board/TEST_GUIDE.md 의 MUST 요구사항을 최우선으로 생각한다.
 /Users/iseoyu/Desktop/career-pipeline-board/PROMPTS.md /Users/iseoyu/Desktop/career-pipeline-board/CONTRIBUTING.md /Users/iseoyu/Desktop/career-pipeline-board/DECISIONS.md 를 참고하여 해당 프로젝트의 기능 명세를 문서로 작성한다.
```

### AI 출력 요지

- `docs/FUNCTIONAL_SPEC.md`에 제품 목적, 데이터 모델, Must 기능 6종, mock API 계약, 상태 전이, Should 확장 범위와 완료 체크리스트를 작성
- 각 Must 기능에 관찰 가능한 동작과 인수 조건을 함께 정의
- README 문서 목록에 기능 명세 링크 추가

### 리뷰 / 검증

- **우선순위 검증:** `TEST_GUIDE.md`의 Must 6개 항목과 기술 제약을 각각 FR-01~FR-06 및 mock API 명세에 대응시켜 누락 여부를 확인함.
- **문서 간 충돌 검증:** `DECISIONS.md`는 `pendingTarget` 기반 연속 이동을 설계했지만, `docs/PLAN.md`는 이를 Should로 분리함. 과제 원문의 우선순위를 따라 Must에서는 요청 중 이동 비활성화, Should에서는 최신 의도 직렬화로 구분함.
- **정합성 검증:** API 리소스명은 최신 결정과 계획에 맞춰 `applicants`가 아닌 `candidates`로 통일하고, 목록·상세·단계 변경 경로와 응답 책임을 분리함.
- **판단:** 기능 명세는 구현 방법만 나열하지 않고 기능별 인수 조건과 최종 Must 완료 체크리스트로 검증 가능하게 작성함. 사용자 최종 리뷰 전 상태임.
