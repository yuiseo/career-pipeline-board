import { z } from "zod"

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  /** fetch 자체 실패(네트워크 단절 등) — 응답이 없을 때 */
  NETWORK_ERROR: 0,
} as const

/** 실패 응답 본문 (4xx·5xx 공통) */
export const apiErrorSchema = z.object({
  message: z.string(),
})
export type ApiErrorBody = z.infer<typeof apiErrorSchema>

export const API_ERROR_MESSAGE = {
  network: "네트워크 오류가 발생했습니다.",
  parse: "응답을 처리할 수 없습니다.",
  unknown: "요청에 실패했습니다.",
} as const

/** 클라이언트에서 던지는 API 오류 (HTTP 상태 + 메시지) */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}
