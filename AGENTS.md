# AGENTS.md

Cursor / Claude Code / Codex 공통 규칙 원본. 도구별 설정 파일은 이 문서를 참조/임포트한다.

## 판단

- 근거 없으면 임의 구현 금지. `DECISIONS.md`에 가정 또는 질문 기록 후 진행.
- 가정은 "기본값 처리 가능" / "방향 확인 필요"로 구분.

## 코드 스타일

- 폴더는 도메인 단위 (`features/xxx/components`, `features/xxx/hooks`)
  - 여러 도메인이 공유하는 `types/`·`mocks/`·`api/`는 `src/` 바로 아래에 둔다.
- 타입 선언 방식은 프론트엔드와 백엔드를 구분한다.
  - 컴포넌트 props는 `interface`로 선언한다.
  - mock API·데이터 계층(`types/`, `mocks/`, `api/`)은 기존대로 `type` 또는 Zod `z.infer`를 사용한다.
- 매직 넘버·하드코딩 금지
  - 의미 있는 숫자(지연 시간, 확률, 건수 등)와 HTTP 상태 코드는 이름 있는 상수로 정의한다.
  - API 경로, 쿼리 키, URL 파라미터 이름, 저장소 키는 한 곳에 상수로 정의하고 클라이언트·mock이 같은 상수를 사용한다.
  - 화면 문구(UI 텍스트)는 컴포넌트에 직접 작성한다.

## 타입

- `any` 금지
- API 응답: Zod 스키마 정의 → `z.infer`로 타입 추론
- 외부 입력은 스키마 검증 후 사용 (API 응답, mock 요청 본문, localStorage 데이터, URL 쿼리)

## 작업 범위

- 사전 협의 없는 패키지 설치 금지
- 기존 구조/컨벤션 유지
- 테스트는 구현과 별도 커밋(`test:`)
- 커밋 전 확인 절차: [CONTRIBUTING.md](./CONTRIBUTING.md)
