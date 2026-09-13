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

---

## [spec] 기능 명세

### 프롬프트 1 (다른 에이전트)

- 사용자가 다른 에이전트에게 지시해 `docs/FUNCTIONAL_SPEC.md` 초안을 생성함. 해당 지시 원문은 이 세션 밖에서 주고받아 여기에 포함하지 않았다.

### AI 출력 요지 (다른 에이전트 초안)

- 문서 우선순위, 제품 개요와 범위, 데이터 명세(`CandidateSummary` / `CandidateDetail`)
- Must 기능 명세 FR-01~06(동작 + 인수 조건), Mock API 명세, Should 확장 명세 SR-01~05
- 상태 전이 기준표, Must 완료 판정 체크리스트

### 프롬프트 2 (메인 에이전트에게)

```
다른 Agents에게 지시해서 생성했는데 SoT를 위해서 너가 다시 한 번 전체를 읽고 어긋나는 것이 있다면 수정 후 별도의 커밋을 할 것.
```

### 메인 에이전트 검증

전체 318줄을 읽고 DECISIONS.md, docs/PLAN.md와 대조함. 일치하는 부분이 대부분이며(API 규약, 롤백 판정 기준, 검색·필터 규칙, 빈 상태 3레벨, 재시도 정책, 시연 제어), 어긋난 부분은 아래와 같이 수정함.

| 위치 | 문제 | 수정 |
|---|---|---|
| 1. 문서 우선순위 | 공개 저장소에 포함하지 않는 `TEST_GUIDE.md`를 최우선 근거로 참조 | "과제 가이드(원문은 저장소에 포함하지 않음)"로 변경. 이 문서는 새 결정을 만들지 않는다는 원칙과 **(확정 필요)** 표기 규칙 추가 |
| 2.3 범위 | 테스트를 전부 Should로 분류. PLAN은 Must 테스트를 5단계로 계획함 | Must 기능 테스트는 Must, 추가 테스트는 Should로 분리. 드래그앤드롭을 "추후 발전 요건"으로 표기 |
| FR-01 인수 조건 | "실제 렌더링된" 수 기준은 가상 스크롤 도입 시 DOM 수와 달라짐 | 필터 결과 수 기준으로 변경 |
| FR-02 | 성공 사용자 피드백 누락 (PLAN 4단계에는 성공 토스트 포함) | 성공 토스트 동작·인수 조건 추가 |
| FR-03 상태 정의 | `confirmedStage`가 저장 상태처럼 읽힘. DECISIONS 2-3은 `inFlightTarget`, `pendingTarget`만 저장 | 목록 캐시에서 읽는 값임을 명시. 상세 패널도 같은 표시 규칙을 쓴다는 동작 추가 |
| FR-05 | 패널 방향을 "오른쪽"으로 확정. DECISIONS 2-6에 방향 결정 없음 | 방향은 디자인 시안에서 정한다고 변경. 요청 중에도 카드·상세 단계 일치를 인수 조건에 추가 |
| 5.1 Mock API | "적절한 4xx 응답" — DECISIONS에 없는 새 결정이며 모호함 | **(확정 필요)**로 표시, `feat(mock-api)` 전에 확정 |
| 7.1 상태 전이 | 요청 성공 시 "저장소 확정"을 클라이언트 처리처럼 기술 | 캐시 갱신과 mock API의 저장소 변경을 구분 |
| SR-03 Undo | "가장 최근에 성공한 이동만 취소" 등 미확정 설계를 확정처럼 기술 | **(확정 필요)** 초안으로 표시 |
| SR-04 테스트 | 테스트 작성 시점이 DECISIONS 2-7과 연결되지 않음 | PLAN 5단계 체크리스트와 2-7(몰아서 작성)을 따르도록 명시 |

- 문서 연결: README 문서 목록과 PLAN.md 머리말에 FUNCTIONAL_SPEC.md 링크 추가

### 리뷰 / 검증

- **판단:** 다른 에이전트가 만든 명세는 SoT(단일 진실 원천) 확보를 위해 그대로 쓰지 않고, 메인 에이전트가 전체를 다시 읽어 기존 결정 문서와 어긋나는 부분을 수정한 뒤 별도 커밋하도록 지시함.

### 프롬프트 3

```
4xx는 404/400으로 구분하고 candidate-model 시작
```

### 리뷰 / 검증

- **4xx 응답:** 명세에서 확정 필요로 남긴 항목을 결정함. 존재하지 않는 지원자 ID는 `404`, 잘못된 요청 본문(허용되지 않은 `stage` 값 등)은 `400`으로 구분함. DECISIONS 2-2와 FUNCTIONAL_SPEC 5.1에 반영.

---

## [candidate-model] 지원자 타입 · 시드 · 저장소

### 프롬프트 1

```
4xx는 404/400으로 구분하고 candidate-model 시작
```

### AI 출력 요지

- 구현 전에 식별자와 시드 방식 확인 질문 4가지 제시

### 프롬프트 2 (확인 질문 응답)

```
Stage 식별자: 영문 식별자 (document | interview | offer | hired | rejected, 화면은 한글 라벨)
직무 목록: 6개 (frontend / backend / mobile / design / pm / data)
시드 방식: 직접 구현 생성기 (시드 기반 의사난수, 의존성 없음, 고정 기준일)
단계 분포: 실제 퍼널처럼 가중치 (서류검토 40 / 면접 25 / 처우협의 10 / 최종합격 5 / 불합격 20)
```

### AI 출력 요지

- `src/types/candidate.ts`: `STAGES`·`Stage`·`STAGE_LABEL`, `POSITIONS`·`Position`·`POSITION_LABEL`, `CandidateSummary`, `CandidateDetail`
- `src/mocks/seed.ts`: mulberry32 의사난수, 가중치 선택, `createSeedCandidates(count = 1000, seed)`. 지원일은 `Date.now()`가 아니라 고정 기준일(2026-09-01)에서 180일 이내
- `src/mocks/db.ts`: `createCandidateDb(storage)` — `getAll` / `getById` / `updateStage` / `reset(count)`. 버전 키(`STORAGE_VERSION = 1`)가 없거나 다르거나 JSON이 깨졌으면 시드 재생성. 저장소는 주입받아 테스트에서 메모리 저장소로 바꿀 수 있음

### 메인 에이전트 검증

- `pnpm build` / `lint` / `format:check` 통과. 아직 import하는 곳이 없어 동작은 커밋하지 않는 임시 스크립트로 확인하고 삭제함 (테스트 커밋은 DECISIONS 2-7에 따라 5단계에서 작성)

| 확인 항목 | 결과 |
|---|---|
| 건수 · id 중복 | 1,000건, id 1,000개 모두 고유 |
| 결정성 | 두 번 생성한 결과가 완전히 같음 |
| 단계 분포 | 서류검토 421 / 면접 237 / 처우협의 95 / 최종합격 51 / 불합격 196 (가중치 40/25/10/5/20과 근접) |
| 직무 분포 | 155~180건으로 고르게 분포 |
| 지원일 범위 | 2026-03-06 ~ 2026-09-01 |
| 저장 크기 | 약 19만 자 (localStorage 한도 약 500만 자 대비 여유) |
| 새로고침 후 유지 | 단계 변경 후 새 db 인스턴스로 읽어도 변경값 유지 |
| 없는 id 변경 | `undefined` 반환 (mock-api에서 404로 연결 예정) |
| 버전 불일치 · 깨진 JSON | 둘 다 시드 1,000건으로 재생성 |
| `reset(0)` | 빈 데이터가 저장되고 다시 읽어도 0건 유지 (`?mockSeed=0` 시연용) |

### 리뷰 / 검증

- **판단:** 구현 결과와 메인 에이전트 검증표를 확인하고 **수정 없이 그대로 채택**함.

---

## [design] 디자인 시스템 문서 (DESIGN.md)

### 프롬프트

```
이제 DESIGN.md를 정리하고 commit을 생성해줘. commit은 CONTRIBUTING.md을 참고하여 작성할 것.
PROMPTS.md에 어떤 파일을 참고하여 design.md를 생성했는지 간단히 남길 것.
```

(이 요청 전에 Claude Design 캔버스로 보드 시안을 먼저 그려 검토받았고, DECISIONS.md의 검색·필터·롤백 결정 반영 → Must/Should 범위 태깅까지 거친 뒤 문서화함)

### AI 출력 요지

- `TEST_GUIDE.md`(Must/Should 요구사항), `DECISIONS.md`(2-1~2-6 설계 결정), `package.json`(설치된 Tailwind·shadcn/ui·TanStack Query·Geist 폰트), `src/index.css`(기존 shadcn 뉴트럴 토큰), `src/components/ui/button.tsx`(버튼 variant·size 규칙)를 참고해 `DESIGN.md` 작성
- 캔버스 시안(보드·상세 패널·로딩·에러·빈 상태 3단계·토스트)의 색상 토큰·타이포·컴포넌트별 상태를 문서로 정리하고, 각 항목에 Must/Should 태그를 붙임

### 리뷰 / 검증

- 캔버스에서 실제 사용한 오클치 값과 `DECISIONS.md`의 결정 번호가 서로 어긋나지 않는지 항목별로 대조함
- 컬럼 `border-radius`를 시안에서 12px로 그렸는데 프로젝트 기존 `--radius`는 10px임을 발견 → 새 토큰으로 얼버무리지 않고 "구현 시 기존 값(10px)으로 통일" 메모를 `DESIGN.md` 7장에 남김

---

## [agents] AI 에이전트 공통 규칙

### 프롬프트 1

```
AGENTS.md를 만드려고 한다. 현재 handler.ts처럼 매직 넘버를 사용하거나 리소스의 경우 하드코딩 되는데 이런 것을 방지하고 싶다. 또한 다음과 같은 형식을 따른다.

AGENTS.md
Cursor / Claude Code / Codex 공통 규칙 원본. 도구별 설정 파일은 이 문서를 참조/임포트한다.
판단
근거 없으면 임의 구현 금지. docs/spec.md에 가정 또는 질문 기록 후 진행.
가정은 "기본값 처리 가능" / "방향 확인 필요"로 구분.
코드 스타일
폴더는 도메인 단위 (features/xxx/components, features/xxx/hooks)
컴포넌트 PascalCase, 그 외 kebab-case
타입
any 금지
API 응답: Zod 스키마 정의 → z.infer로 타입 추론
외부 입력은 스키마 검증 후 사용
작업 범위
사전 협의 없는 패키지 설치 금지
기존 구조/컨벤션 유지
테스트는 구현과 별도 커밋(test:)
커밋 전 확인 절차: CONTRIBUTING.md
```

### AI 출력 요지

- 규칙과 현재 코드·문서가 어긋나는 곳 정리: `docs/spec.md` 없음, `setupTests.ts`·shadcn `button.tsx` 파일명, zod 미설치와 `db.ts`의 검증 없는 형변환, `handlers.ts`의 HTTP 상태 코드·문구·API 경로·URL 파라미터 하드코딩
- 작업 순서 제안: `docs(agents)` 커밋 → 모델을 Zod로 `refactor` → 미커밋 mock-api를 규칙에 맞춰 수정 후 커밋
- 확인 질문 4가지: spec 경로, Zod 설치·적용 범위, 파일명 규칙 예외, 상수화 범위

### 프롬프트 2 (확인 질문 응답)

```
spec 경로: 가정 질문을 기록하는 파일은 이미 DECISIONS.md에서 기록하기로 결정되어 있음.
Zod: 승인, 외부 입력 전체
파일명 규칙: 그냥 해당 파일명 규칙은 사용하지 않음.
상수화 범위: 값·키는 상수, UI 문구는 컴포넌트에
```

### 프롬프트 3

```
또한 구현 단계가 완료되면 커밋 시 plan과 functional_spec 문서에 체크
```

### AI 출력 요지

- `AGENTS.md` 작성: 주어진 형식을 따르되 가정·질문 기록 위치를 `DECISIONS.md`로, 파일명 규칙 제외, 하드코딩 금지 범위(숫자·HTTP 상태·API 경로·쿼리 키·URL 파라미터·저장소 키는 상수, UI 문구는 컴포넌트)와 외부 입력 범위(API 응답·요청 본문·localStorage·URL 쿼리) 명시
- `CLAUDE.md`: `@AGENTS.md` 임포트만 둠 (Codex·Cursor는 루트 AGENTS.md를 직접 읽음)
- `CONTRIBUTING.md`에 "커밋 전 확인 절차" 6단계 추가 (검사 명령, AGENTS 규칙, 커밋 파일 확인, PROMPTS 리뷰, PLAN·FUNCTIONAL_SPEC 체크, DECISIONS 반영)
- `docs/PLAN.md` 커밋 표에 `완료` 체크 칸 추가, 커밋한 `feat(candidate-model)` 체크
- `DECISIONS.md` 1장에 가정 표시 규칙 `(기본값 처리 가능)` / `(방향 확인 필요)` 추가, README 문서 목록에 AGENTS.md 링크
- 진행 중이던 mock-api 변경은 섞이지 않도록 stash 후 작업

### 리뷰 / 검증

- **spec 경로 수정:** 가정·질문 기록은 이미 DECISIONS.md에서 하기로 결정되어 있으므로 `docs/spec.md`를 만들지 않음.
- **Zod:** 설치를 승인하고, 외부 입력 전체(API 응답, mock 요청 본문, localStorage, URL 쿼리)에 스키마 검증을 적용함.
- **파일명 규칙:** AI가 제시한 예외 처리 대신, 해당 파일명 규칙 자체를 사용하지 않기로 함.
- **상수화 범위:** 값·키는 상수로 정의하고 UI 문구는 컴포넌트에 둠.
- **체크 규칙 추가:** 구현 단계를 완료해 커밋할 때 PLAN과 FUNCTIONAL_SPEC 문서에 체크하도록 함.
- **폴더 규칙 충돌:** AI가 AGENTS.md의 도메인 단위 폴더 규칙과 PLAN·기존 코드의 공통 계층(`types/`, `mocks/`, `api/`)이 어긋남을 지적함. 공통 계층은 `src/` 바로 아래에 두는 예외(a안)를 AGENTS.md에 추가하기로 함.
- **초안 검토:** 위 예외를 추가한 뒤 AGENTS.md와 관련 문서 변경을 채택함.

---

## [candidate-model] AGENTS.md 규칙 적용 리팩터링

### 프롬프트

```
(a)로 추가하고 docs(agents) 커밋 진행
```

(docs(agents) 커밋 후 AI가 앞서 제안한 순서대로 이미 커밋한 모델 코드를 AGENTS.md 규칙에 맞춤)

### AI 출력 요지

- zod 4.6.4 설치 (사용자 승인 범위). 처음 제안한 별도 `chore(deps)` 커밋 대신, 쓰는 곳이 없는 의존성 커밋을 피하려고 첫 사용 커밋에 포함
- `src/types/candidate.ts`: `stageSchema`, `positionSchema`, `candidateSummarySchema`, `candidateDetailSchema`를 정의하고 모든 타입을 `z.infer`로 추론
- `src/mocks/db.ts`: localStorage 데이터를 `storedDataSchema`(버전 리터럴 + 상세 스키마 배열)로 검증. 형변환(`as StoredData`) 제거
- `src/mocks/seed.ts`: 매직 넘버를 상수로 이름 붙임 (`ID_DIGITS`, `MAX_EXPERIENCE_YEARS`, `PHONE_SEGMENT_MIN/MAX`). mulberry32 내부 숫자는 알고리즘 고정 상수라고 주석으로 명시

### 메인 에이전트 검증

- `pnpm build` / `lint` / `format:check` 통과. 임시 스크립트로 확인 후 삭제

| 확인 항목 | 결과 |
|---|---|
| 리팩터링 전후 시드 결과 | 첫 레코드(`c-0001 한수윤 010-9032-4574`)가 이전 검증과 동일 → 생성 결과 변화 없음 |
| 시드 1,000건 스키마 통과 | 통과 (`appliedAt` ISO 날짜, 이메일 형식 포함) |
| 새로고침 후 유지 | 변경한 단계 유지 |
| 레코드 하나의 stage가 잘못된 저장 데이터 | 스키마 검증 실패 → 시드 1,000건 재생성 |
| 버전 불일치 · 깨진 JSON · `reset(0)` | 재생성 / 재생성 / 0건 유지 |

### 리뷰 / 검증

- **문제:** 스키마를 통해 타입 추론을 쉽게 가져가는 아키텍처를 계획 시점에 누락함. 구현 시점에 AGENTS.md 규칙으로 정리하면서 반영함.
- **판단:** 타입을 Zod 스키마에서 추론하도록 바꾸고, 매직 넘버 등을 이름 있는 상수로 정의해 재사용할 수 있게 변경한 방향을 채택함.
- **확인:** 현재 구현 사항(스키마·저장 데이터 검증·상수화)과 메인 에이전트 검증표를 확인 완료함.

---

## [mock-api] MSW 핸들러 · 지연/실패 · 시연 제어

### 프롬프트 (확인 질문 응답)

```
배포 환경: MSW·시연 제어 모두 항상 켬
시연 제어: mockSeed=0은 저장, mockFail은 요청 시점 URL 기준
```

### AI 출력 요지

- `msw` 설치(배포에서도 쓰므로 dependencies), `public/mockServiceWorker.js` 생성
- `src/mocks/handlers.ts`: `createHandlers({ db, failRate, delay })` — 목록(요약 필드만) / 상세 / 단계 변경. 처리 순서는 지연 → 실패 판정(500) → 404 → 400 → 저장
- `src/mocks/config.ts`: 200~800ms 무작위 지연, `resolveFailRate`(요청마다 URL 판단), `applyDataCommands`(`mockReset`/`mockSeed` 적용 후 URL에서 제거)
- `src/mocks/browser.ts`: localStorage db + 워커 시작, `src/main.tsx`: 워커가 준비된 뒤 렌더링
- `src/types/candidate.ts`: `isStage` 타입 가드 추가

### 메인 에이전트 검증

**1차에서 발견해 수정한 문제**

| 문제 | 발견 경로 | 수정 |
|---|---|---|
| 번들 245KB → 670KB, 500KB 청크 경고 | `pnpm build` 출력 | `main.tsx`에서 mock 모듈을 동적 import해 별도 청크로 분리 (index 246KB + browser 425KB) |
| 생성 파일 `mockServiceWorker.js`에 ESLint 경고 | `pnpm lint` 출력 | ESLint `globalIgnores`와 `.prettierignore`에 추가 |
| `pnpm format`이 생성 워커 파일을 재포맷함 | 파일 비교 | msw 패키지 원본으로 되돌리고 `cmp`로 동일함을 확인 |
| `pnpm format`이 다른 세션이 커밋한 `DESIGN.md`의 표 정렬을 바꿈 | `git status`에 건드리지 않은 파일이 수정됨으로 표시 | 내용 변경 없음을 diff로 확인. `.prettierignore`를 파일명 나열에서 `*.md` 패턴으로 바꿔 별도 `chore(format)` 커밋 |
| `msw init`이 대화형 입력을 기다리며 멈춤 | 명령 시간 초과 | 작업 중단 후 패키지 원본 파일을 복사하는 방식으로 대체 |

**동작 검증** (커밋하지 않는 임시 스크립트, MSW Node 환경)

| 확인 항목 | 결과 |
|---|---|
| 목록 응답 | 1,000건, 필드 `id·name·position·appliedAt·stage`만 포함 |
| 상세 응답 | 상세 필드 4개 포함 |
| 없는 id 상세 / 단계 변경 | 404 / 404 |
| 잘못된 stage · JSON이 아닌 본문 | 400 / 400, `{ message }` |
| 단계 변경 성공 | 200, 응답과 저장소 모두 변경됨 |
| 실패 강제(`failRate: 1`) | 500 `{ message }`, 저장소 변경 없음 |
| 실패율 0.15로 2,000회 요청 | 실패 비율 14.55% |
| 지연 250ms 주입 | 실제 소요 253ms |
| `randomDelayMs` 10,000회 | 최소 200ms, 최대 800ms |
| `resolveFailRate` | 기본 0.15, `mockFail=1` → 1, `mockFail=0` → 0 |
| `?q=홍&mockFail=1&mockSeed=0` | 데이터 0건, URL에는 `q`·`mockFail`만 남음 |
| `?mockReset=1` | 데이터 1,000건 복구, URL에서 제거 |

- `pnpm build` / `lint` / `test` / `format:check` 통과
- 브라우저에서 서비스 워커가 실제로 요청을 가로채는지는 아직 화면에서 API를 호출하지 않아 확인하지 못함 → 사용자가 브라우저 콘솔로 확인 (아래 리뷰)
- 문서 반영: DECISIONS 2-2, FUNCTIONAL_SPEC 5.3(개발 환경 전용 → 모든 환경), PLAN(`createHandlers` 인자 이름, 시연 제어 환경)

### 프롬프트 2 (AGENTS.md 규칙 적용 요청)

```
서브에이전트에서 stash 한 것을 zod를 반영하여 refactoring한 후 완료되면 구현 사항을 요약해서 나에게 다시 알려줘.
```

### 프롬프트 3 (메인 에이전트 → 서브 에이전트 mock-api-refactor)

<details>
<summary>서브 에이전트 작업 지시 요약</summary>

- 커밋·패키지 설치·문서 수정 금지, AGENTS.md와 DECISIONS 2-2, 커밋된 `types/candidate.ts`·`db.ts` 패턴을 먼저 읽을 것
- 동작은 유지하고 다음을 리팩터링
  1. API 경로를 `src/api/` 공유 상수로 (클라이언트·mock 공용, MSW `:id` 패턴 포함)
  2. HTTP 상태 코드 200/400/404/500 상수화
  3. 에러 응답 `{ message }`·PATCH 본문 `{ stage }` Zod 스키마 + `z.infer`, 본문 검증을 `safeParse`로 교체하고 `isStage` 제거
  4. `mockFail`/`mockSeed`/`mockReset` 이름 상수화, 값은 Zod로 검증(허용값 외 무시)
  5. 강제 실패율·빈 시드 건수 등 매직 넘버와 에러 응답 메시지 상수화
- 검증: build/lint/test/format:check + MSW Node 임시 스크립트(목록·상세·404·400·500·실패율·지연·쿼리 제어) 실행 후 삭제
- 보고: 파일별 역할, 규칙별 변경과 판단 근거, 검증 결과표, 남은 결정 사항

</details>

### AI 출력 요지 (서브 에이전트 결과)

- 신규 `src/api/endpoints.ts`: `API_PATHS`(클라이언트용, id `encodeURIComponent`) / `API_ROUTE_PATTERNS`(MSW `:id` 패턴)를 같은 내부 빌더로 생성. 한 함수로 합치면 `:`가 `%3A`로 인코딩되어 패턴이 깨지기 때문
- 신규 `src/api/http.ts`: `HTTP_STATUS`, `apiErrorSchema`·`ApiError`
- `src/types/candidate.ts`: `updateStageRequestSchema`·`UpdateStageRequest` 추가
- `src/mocks/handlers.ts`: 공유 경로·상태 상수, `ERROR_MESSAGE` 상수, 본문 `safeParse`(JSON 파싱 실패도 400), `isStage`·형변환 제거. 목록 응답은 `toSummary` 유지(서버 내부 데이터라 외부 입력이 아니고, 1,000건 매 요청 parse 비용 회피, 반환 타입으로 필드 누락을 컴파일 시점에 잡음)
- `src/mocks/config.ts`: `MOCK_QUERY_PARAM` 이름 상수, `mockFailSchema`·`mockSeedSchema`·`mockResetSchema`로 값 검증, `ALWAYS_FAIL_RATE`·`NEVER_FAIL_RATE`·`EMPTY_SEED_COUNT` 상수
- 임시 검증 결과: 목록 1,000건·키 5개, 상세 키 9개, 404/400/500 응답과 저장 변경 없음, 실패율 0.148(2,000회), 지연 250 → 257ms, 쿼리 제어 동작 동일, `mockFail=abc`는 기본 0.15, 허용값 밖 `mockSeed=5`는 무시
- 남은 결정 사항 보고: JSON 파싱 실패 메시지를 따로 둘지, 검색·필터 URL 파라미터 이름 상수를 mock 상수와 한곳에 모을지, `EMPTY_SEED_COUNT` 위치

### 메인 에이전트 검증 (리팩터링 결과)

- `src/api/*`, `src/mocks/config.ts`, `src/mocks/handlers.ts`, `src/types/candidate.ts` diff를 정독. 남은 리터럴은 상수 정의부뿐이고 `any` 없음, `as`는 `as const`뿐임을 grep으로 확인
- build / lint / test / format:check 직접 재실행 → 통과
- 참고: zod가 mock 청크에 포함되어 `browser` 청크가 425KB → 510KB로 커지면서 500KB 경고가 다시 나타남 (빌드 실패는 아님, 이후 번들 분할 여부 결정 필요)
- `API_PATHS`, `apiErrorSchema`, `UpdateStageRequest`는 아직 사용처가 없고 3단계 `feat(api-client)`에서 사용할 예정

### 리뷰 / 검증

- **검증 방법:** 개발 서버를 띄우고 브라우저 콘솔에서 mock API를 호출해 JSON 응답을 불러오는 방식으로 직접 검증함.
- **판단:** 서브 에이전트가 AGENTS.md 규칙(Zod 스키마·상수화)을 반영해 리팩터링한 mock API 기능을 검증 완료하고, 커밋 규칙에 따라 커밋하도록 함.
