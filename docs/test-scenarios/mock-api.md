# test(mock-api) 시나리오

**근거:** FUNCTIONAL_SPEC 3장·5장, PLAN 5단계 `test(mock-api)`
**검증 층:** HTTP 계약 / 저장소
**픽스처:** 지원자 2명(A·B). 서로 다른 단계, 각각 알려진 `id`. 직무는 필드 존재 확인용이며 특정 직무 조합은 필요 없다. M5만 시드와 구분되는 이전 저장 1건 + 소수 시드를 쓴다(1,000건 시드 사용 안 함).

## 범위

- `GET /api/candidates` 목록 원소가 요약 필드만 가진다
- `GET /api/candidates/:id` 상세에 상세 필드가 포함된다
- `PATCH /api/candidates/:id/stage` 성공 시 응답·이후 GET·저장소가 새 단계다
- `failRate: 1`이면 500과 `{ message: string }`이고 저장소는 그대로다
- 저장 버전 키가 없거나 현재 버전과 다르면 시드를 다시 만들고 이전 저장 내용은 쓰지 않는다

## 범위 밖

- 존재하지 않는 ID의 404, 허용되지 않은 `stage` 등 잘못된 본문의 400
- 기본 약 15% 실패, 200~800ms 지연
- 시연 쿼리(`mockFail`, `mockSeed`, `mockReset`)
- Should 범위(경쟁 상태, 가상 스크롤, Undo, 접근성)
- UI, 토스트, 쿼리 캐시
- 지원자 생성·삭제·정보 수정

## 공통 전제

- MSW Node `setupServer`로 핸들러를 붙인다
- 기본은 `createHandlers({ db, failRate: 0, delay: 0 })`이다
- 실패 시나리오만 `failRate: 1`을 넣는다
- `db`는 테스트 프로세스의 메모리 저장소 주입이다. 실제 `localStorage`를 쓰지 않는다
- 1,000건 시드 대신 소수 픽스처를 쓴다. M5만 시드 재생성 의미를 검증한다
- Then은 HTTP 메서드·경로·상태·본문 형태와 저장소 값만 본다

## 시나리오

### M1. GET 목록: 각 원소는 id, name, position, appliedAt, stage만. email 등 상세 필드 없음

- **PLAN 체크:** 목록 응답에 요약 필드만 있음
- **명세:** 3.1 · 5.1 — `GET /api/candidates`는 `CandidateSummary[]`이고, 요약은 `id`, `name`, `position`, `appliedAt`, `stage`만 포함한다
- **Given**
  - 메모리 저장소에 지원자 A·B가 들어 있다
  - `createHandlers({ db, failRate: 0, delay: 0 })`
- **When**
  - `GET /api/candidates`
- **Then** (관찰 가능한 응답/저장소만)
  - 상태 200
  - 본문은 배열이고 길이는 2다
  - 각 원소에 `id`(string), `name`(string), `position`(string), `appliedAt`(ISO 날짜 문자열), `stage`만 있다
  - 각 원소에 `email`, `phone`, `experienceYears`, `education`이 없다
- **단언하지 않음**
  - 상세 필드의 값, UI 렌더링, 1,000건, 지연

### M2. GET 상세: 요약 필드 + email, phone, experienceYears, education

- **PLAN 체크:** 상세 응답에 상세 필드 포함
- **명세:** 3.2 · 5.1 — `GET /api/candidates/:id`는 `CandidateDetail`이고, 목록 필드에 `email`, `phone`, `experienceYears`, `education`을 더한다
- **Given**
  - 메모리 저장소에 지원자 A가 있다(알려진 `id`)
  - `createHandlers({ db, failRate: 0, delay: 0 })`
- **When**
  - `GET /api/candidates/:id` (A의 `id`)
- **Then** (관찰 가능한 응답/저장소만)
  - 상태 200
  - 본문에 요약 필드 `id`, `name`, `position`, `appliedAt`, `stage`가 있다
  - 본문에 `email`(string), `phone`(string), `experienceYears`(number), `education`(string)이 있다
- **단언하지 않음**
  - 없는 ID의 404, UI 패널, 상세 정보의 쓰기

### M3. PATCH 성공: 응답이 변경된 상세이고, 이후 GET 목록/상세/저장소 모두 새 단계

- **PLAN 체크:** PATCH 결과가 저장소에 반영됨
- **명세:** 5.1 · 5.2 — `PATCH /api/candidates/:id/stage` 요청은 `{ "stage": Stage }`이고 성공 본문은 변경된 `CandidateDetail`이다. 성공이 확정된 경우에만 저장소를 바꾼다
- **Given**
  - 메모리 저장소에 지원자 A가 있다(알려진 `id`, 현재 `stage`)
  - 목적 단계는 허용된 5개 단계 중 현재와 다른 값이다
  - `createHandlers({ db, failRate: 0, delay: 0 })`
- **When**
  - `PATCH /api/candidates/:id/stage` (A의 `id`)
  - 본문 `{ "stage": <허용된 5개 단계 중 현재와 다른 값> }`
- **Then** (관찰 가능한 응답/저장소만)
  - PATCH 상태 200
  - PATCH 본문은 `CandidateDetail`이다(요약 필드 + `email`, `phone`, `experienceYears`, `education`)
  - PATCH 본문의 `stage`는 요청한 값이다. 나머지 필드는 요청 전과 같다
  - 이어서 `GET /api/candidates` → 200, A의 `stage`가 요청한 값이다. A 원소에는 요약 필드만 있다
  - 이어서 `GET /api/candidates/:id` → 200, 본문의 `stage`가 요청한 값이다
  - 주입한 메모리 저장소에서 A의 `stage`가 요청한 값이다
- **단언하지 않음**
  - 400·404, 토스트, 쿼리 캐시, 보드 컬럼 UI

### M4. failRate:1 → 500 + { message: string }, 저장소 불변

- **PLAN 체크:** `failRate: 1`이면 500
- **명세:** 5.1 · 5.2 — 실패 응답은 HTTP 500과 `{ "message": string }`이다. PATCH는 성공이 확정된 경우에만 저장소를 바꾼다
- **Given**
  - 메모리 저장소에 지원자 A가 있다(알려진 `id`, 현재 `stage`)
  - 요청 전 저장소 스냅샷을 둔다
  - `createHandlers({ db, failRate: 1, delay: 0 })`
- **When**
  - `PATCH /api/candidates/:id/stage` (A의 `id`)
  - 본문 `{ "stage": <허용된 5개 단계 중 현재와 다른 값> }`
- **Then** (관찰 가능한 응답/저장소만)
  - 상태 500
  - 본문은 `{ "message": string }`이다(`message`가 string이다)
  - 주입한 메모리 저장소는 요청 전 스냅샷과 같다. A의 `stage`는 그대로다
- **단언하지 않음**
  - 기본 약 15% 실패, 지연, 404·400, UI 롤백

### M5. 저장 버전 키 없음 또는 현재 버전과 다름 → 시드 재생성, 이전 저장 내용 미사용

- **PLAN 체크:** 저장소 버전이 다르면 시드 재생성
- **명세:** 5.2 — 데이터는 버전 키가 있는 저장소에 둔다. 저장 버전이 없거나 현재 버전과 다르면 시드를 다시 생성한다
- **Given**
  - 메모리 저장소에 시드와 구분되는 이전 지원자 데이터(알려진 `id`)가 있다
  - 그리고 다음 중 하나다
    - 저장 버전 키가 없다
    - 저장 버전 키가 현재 버전과 다르다
  - 시드는 소수 픽스처다(1,000건이 아니다)
  - `createHandlers({ db, failRate: 0, delay: 0 })`
- **When**
  - 해당 저장소를 주입한 핸들러로 `GET /api/candidates`
- **Then** (관찰 가능한 응답/저장소만)
  - 상태 200
  - 본문은 현재 버전 기준으로 다시 만든 시드다
  - 이전 저장에만 있던 지원자 `id`는 본문과 저장소에 없다
- **단언하지 않음**
  - 실제 브라우저 `localStorage` 키 이름, 1,000건 시드 개수, 시연 쿼리에 의한 재설정
