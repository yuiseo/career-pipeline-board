import { z } from "zod"
import {
  API_ERROR_MESSAGE,
  ApiError,
  apiErrorSchema,
  HTTP_STATUS,
} from "@/api/http"

const JSON_CONTENT_TYPE = "application/json"

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json()
    const parsed = apiErrorSchema.safeParse(body)
    if (parsed.success) return parsed.data.message
  } catch {
    // 본문 파싱 실패 시 기본 메시지 사용
  }
  return API_ERROR_MESSAGE.unknown
}

/**
 * fetch 래퍼. 실패 시 ApiError를 던지고, 성공 시 schema로 검증한 값을 반환한다.
 */
export async function request<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit
): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, init)
  } catch {
    throw new ApiError(HTTP_STATUS.NETWORK_ERROR, API_ERROR_MESSAGE.network)
  }

  if (!response.ok) {
    const message = await parseErrorMessage(response)
    throw new ApiError(response.status, message)
  }

  let json: unknown
  try {
    json = await response.json()
  } catch {
    throw new ApiError(response.status, API_ERROR_MESSAGE.parse)
  }

  const parsed = schema.safeParse(json)
  if (!parsed.success) {
    throw new ApiError(response.status, API_ERROR_MESSAGE.parse)
  }

  return parsed.data
}

export function get<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  return request(path, schema, { method: "GET" })
}

export function patch<T>(
  path: string,
  schema: z.ZodType<T>,
  body: unknown
): Promise<T> {
  return request(path, schema, {
    method: "PATCH",
    headers: { "Content-Type": JSON_CONTENT_TYPE },
    body: JSON.stringify(body),
  })
}
