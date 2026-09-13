/** 클라이언트 API 코드와 mock 핸들러가 함께 쓰는 API 경로 */

const CANDIDATES_PATH = "/api/candidates"
const STAGE_SEGMENT = "stage"

export const CANDIDATE_ID_PARAM = "id"
export type CandidateRouteParams = { [CANDIDATE_ID_PARAM]: string }

function candidatePath(idSegment: string) {
  return `${CANDIDATES_PATH}/${idSegment}`
}

function candidateStagePath(idSegment: string) {
  return `${candidatePath(idSegment)}/${STAGE_SEGMENT}`
}

/** 클라이언트 요청용 경로. id는 URL 인코딩한다. */
export const API_PATHS = {
  candidates: CANDIDATES_PATH,
  candidate: (id: string) => candidatePath(encodeURIComponent(id)),
  candidateStage: (id: string) => candidateStagePath(encodeURIComponent(id)),
}

/** MSW 핸들러용 경로 패턴 (`:id` 파라미터) */
export const API_ROUTE_PATTERNS = {
  candidates: CANDIDATES_PATH,
  candidate: candidatePath(`:${CANDIDATE_ID_PARAM}`),
  candidateStage: candidateStagePath(`:${CANDIDATE_ID_PARAM}`),
}
