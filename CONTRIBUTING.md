# Contributing — 커밋 규칙

## 원칙

- **기능 하나 = 커밋 하나 = PROMPTS.md 섹션 하나.** 여러 기능을 한 커밋에 섞지 않는다.
- **squash / force-push 금지.** 시행착오 커밋(고쳤다 되돌린 흔적)도 그대로 남긴다.
- 커밋 순서와 PROMPTS.md 섹션 순서를 1:1로 맞춘다.

## 메시지 형식

```
type(scope): 요약

- 무엇을 했는가
- 왜 그렇게 했는가
- AI 초안을 어떻게 손봤는가 (한 줄이라도)
```

### type

| type | 용도 |
|---|---|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 동작 변화 없는 구조 개선 |
| `test` | 테스트 추가·수정 |
| `docs` | 문서 (README, PROMPTS.md, DECISIONS.md 등) |
| `chore` | 빌드·환경설정·의존성 등 기능 외 작업 |

### scope

- 기능 단위 이름을 kebab-case로 쓴다. (예: `stage-move`, `optimistic-update`, `search-filter`)
- PROMPTS.md의 섹션 태그 `[scope]`와 같은 이름을 사용한다.

### 예시

```
feat(stage-move): 카드 단계 이동 + mock API 저장

- 드래그 대신 액션 버튼 방식 선택
- AI 초안은 로컬 상태만 갱신 → API persist 누락, 직접 보완
```
