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
