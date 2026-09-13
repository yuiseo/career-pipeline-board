import { describe, expect, it } from "vitest"
import { API_PATHS } from "@/api/endpoints"
import { HTTP_STATUS } from "@/api/http"
import { STORAGE_KEY, STORAGE_VERSION, createCandidateDb } from "@/mocks/db"
import { createHandlers } from "@/mocks/handlers"
import { createTestCandidate } from "@/test/fixtures"
import { createMemoryStorage } from "@/test/memoryStorage"
import { createMswServer, DELAY_NONE, FAIL_RATE_NEVER } from "@/test/mswServer"

const OLD_CANDIDATE_ID = "legacy-stale-id"
const STALE_STORAGE_VERSION = STORAGE_VERSION + 1

const server = createMswServer()
const oldCandidate = createTestCandidate({
  id: OLD_CANDIDATE_ID,
  name: "이전저장지원자",
})

function arrangeWithStoredPayload(payload: unknown) {
  const storage = createMemoryStorage()
  storage.setItem(STORAGE_KEY, JSON.stringify(payload))
  const db = createCandidateDb(storage)
  server.use(
    ...createHandlers({ db, failRate: FAIL_RATE_NEVER, delay: DELAY_NONE })
  )
  return { storage, db }
}

function idsFromList(body: unknown): string[] {
  if (!Array.isArray(body)) {
    throw new Error("expected candidate list")
  }
  return body.map((item) => {
    if (typeof item !== "object" || item === null || !("id" in item)) {
      throw new Error("expected candidate id")
    }
    expect(typeof item.id).toBe("string")
    return String(item.id)
  })
}

async function getListAfterLoad(payload: unknown) {
  const { storage, db } = arrangeWithStoredPayload(payload)
  const response = await fetch(API_PATHS.candidates)
  const body: unknown = await response.json()
  return { response, body, db, storage }
}

describe("db", () => {
  it("M5. 저장 버전 키가 없으면 시드를 다시 만들고 이전 id를 쓰지 않는다", async () => {
    const { response, body, db } = await getListAfterLoad({
      candidates: [oldCandidate],
    })

    expect(response.status).toBe(HTTP_STATUS.OK)
    expect(idsFromList(body)).not.toContain(OLD_CANDIDATE_ID)
    expect(
      db.getAll().some((candidate) => candidate.id === OLD_CANDIDATE_ID)
    ).toBe(false)
  })

  it("M5. 저장 버전이 현재와 다르면 시드를 다시 만들고 이전 id를 쓰지 않는다", async () => {
    const { response, body, db } = await getListAfterLoad({
      version: STALE_STORAGE_VERSION,
      candidates: [oldCandidate],
    })

    expect(response.status).toBe(HTTP_STATUS.OK)
    expect(idsFromList(body)).not.toContain(OLD_CANDIDATE_ID)
    expect(
      db.getAll().some((candidate) => candidate.id === OLD_CANDIDATE_ID)
    ).toBe(false)
  })
})
