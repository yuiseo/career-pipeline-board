import { z } from "zod"
import type { CandidateDb } from "./db"

export const DEFAULT_FAIL_RATE = 0.15
const ALWAYS_FAIL_RATE = 1
const NEVER_FAIL_RATE = 0
export const MIN_DELAY_MS = 200
export const MAX_DELAY_MS = 800
/** ?mockSeed=0 으로 저장하는 빈 데이터 건수 */
const EMPTY_SEED_COUNT = 0

/** 시연 제어용 URL 파라미터 이름 */
export const MOCK_QUERY_PARAM = {
  fail: "mockFail",
  seed: "mockSeed",
  reset: "mockReset",
} as const

/** 시연 제어 파라미터의 허용값. 그 외 값이나 파라미터가 없으면 무시한다. */
const mockFailSchema = z.enum(["1", "0"])
const mockSeedSchema = z.literal("0")
const mockResetSchema = z.literal("1")

const FAIL_RATE_BY_MOCK_FAIL: Record<z.infer<typeof mockFailSchema>, number> = {
  "1": ALWAYS_FAIL_RATE,
  "0": NEVER_FAIL_RATE,
}

export function randomDelayMs(): number {
  return MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)
}

/**
 * 시연 제어: ?mockFail=1 이면 항상 실패, ?mockFail=0 이면 실패 없음.
 * 요청마다 호출해 현재 URL 기준으로 판단하므로 새로고침 없이 주소만 바꿔도 반영된다.
 */
export function resolveFailRate(search: string): number {
  const mockFail = mockFailSchema.safeParse(
    new URLSearchParams(search).get(MOCK_QUERY_PARAM.fail)
  )
  return mockFail.success
    ? FAIL_RATE_BY_MOCK_FAIL[mockFail.data]
    : DEFAULT_FAIL_RATE
}

/**
 * 시연 제어: ?mockReset=1 은 시드 1,000건으로 초기화, ?mockSeed=0 은 빈 데이터를 저장한다.
 * 적용 후 URL에서 제거해, 새로고침할 때마다 데이터가 다시 초기화되지 않게 한다.
 */
export function applyDataCommands(db: CandidateDb, location: Location) {
  const url = new URL(location.href)
  const { searchParams } = url

  const mockReset = searchParams.get(MOCK_QUERY_PARAM.reset)
  const mockSeed = searchParams.get(MOCK_QUERY_PARAM.seed)

  if (mockResetSchema.safeParse(mockReset).success) {
    db.reset()
    searchParams.delete(MOCK_QUERY_PARAM.reset)
  }
  if (mockSeedSchema.safeParse(mockSeed).success) {
    db.reset(EMPTY_SEED_COUNT)
    searchParams.delete(MOCK_QUERY_PARAM.seed)
  }

  if (url.href !== location.href) {
    window.history.replaceState(window.history.state, "", url)
  }
}
