import { delay, http, HttpResponse } from "msw"
import { API_ROUTE_PATTERNS, type CandidateRouteParams } from "@/api/endpoints"
import { HTTP_STATUS, type ApiErrorBody } from "@/api/http"
import {
  updateStageRequestSchema,
  type CandidateDetail,
  type CandidateSummary,
} from "@/types/candidate"
import type { CandidateDb } from "./db"

const ERROR_MESSAGE = {
  serverError: "일시적인 서버 오류가 발생했습니다.",
  notFound: "지원자를 찾을 수 없습니다.",
  invalidStage: "올바르지 않은 단계입니다.",
} as const

type Resolvable = number | (() => number)

export type HandlerOptions = {
  db: CandidateDb
  /** 0~1 사이 실패 확률 */
  failRate: Resolvable
  /** 응답 지연(ms) */
  delay: Resolvable
}

function resolve(value: Resolvable): number {
  return typeof value === "function" ? value() : value
}

function toSummary({
  id,
  name,
  position,
  appliedAt,
  stage,
}: CandidateDetail): CandidateSummary {
  return { id, name, position, appliedAt, stage }
}

function errorResponse(status: number, message: string) {
  const body: ApiErrorBody = { message }
  return HttpResponse.json(body, { status })
}

function notFoundResponse() {
  return errorResponse(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGE.notFound)
}

export function createHandlers({
  db,
  failRate,
  delay: delayMs,
}: HandlerOptions) {
  /** 지연 후 실패 여부를 판정한다. 실패면 500 응답을, 아니면 undefined를 반환한다. */
  async function simulateNetwork() {
    await delay(resolve(delayMs))
    if (Math.random() < resolve(failRate)) {
      return errorResponse(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ERROR_MESSAGE.serverError
      )
    }
  }

  return [
    http.get(API_ROUTE_PATTERNS.candidates, async () => {
      const failure = await simulateNetwork()
      if (failure) return failure

      const summaries: CandidateSummary[] = db.getAll().map(toSummary)
      return HttpResponse.json(summaries, { status: HTTP_STATUS.OK })
    }),

    http.get<CandidateRouteParams>(
      API_ROUTE_PATTERNS.candidate,
      async ({ params }) => {
        const failure = await simulateNetwork()
        if (failure) return failure

        const candidate = db.getById(params.id)
        if (!candidate) return notFoundResponse()

        return HttpResponse.json(candidate, { status: HTTP_STATUS.OK })
      }
    ),

    http.patch<CandidateRouteParams>(
      API_ROUTE_PATTERNS.candidateStage,
      async ({ params, request }) => {
        const failure = await simulateNetwork()
        if (failure) return failure

        if (!db.getById(params.id)) return notFoundResponse()

        // JSON 파싱 실패와 스키마 불일치 모두 잘못된 요청 본문(400)으로 처리한다.
        const body: unknown = await request.json().catch(() => undefined)
        const parsed = updateStageRequestSchema.safeParse(body)
        if (!parsed.success) {
          return errorResponse(
            HTTP_STATUS.BAD_REQUEST,
            ERROR_MESSAGE.invalidStage
          )
        }

        const updated = db.updateStage(params.id, parsed.data.stage)
        if (!updated) return notFoundResponse()

        return HttpResponse.json(updated, { status: HTTP_STATUS.OK })
      }
    ),
  ]
}
