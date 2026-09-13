import { z } from "zod"

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

/** 실패 응답 본문 (4xx·5xx 공통) */
export const apiErrorSchema = z.object({
  message: z.string(),
})
export type ApiError = z.infer<typeof apiErrorSchema>
