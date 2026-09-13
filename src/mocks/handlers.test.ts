import { describe, expect, it } from "vitest"
import { API_PATHS } from "@/api/endpoints"
import { HTTP_STATUS } from "@/api/http"
import { STORAGE_KEY, createCandidateDb } from "@/mocks/db"
import { createHandlers } from "@/mocks/handlers"
import { createTestCandidate, persistCandidates } from "@/test/fixtures"
import { createMemoryStorage } from "@/test/memoryStorage"
import {
  createMswServer,
  DELAY_NONE,
  FAIL_RATE_ALWAYS,
  FAIL_RATE_NEVER,
} from "@/test/mswServer"
import { candidateDetailSchema, type Stage } from "@/types/candidate"

const CANDIDATE_A_ID = "candidate-a"
const CANDIDATE_B_ID = "candidate-b"
const CANDIDATE_A_STAGE = "document" satisfies Stage
const TARGET_STAGE = "interview" satisfies Stage
const SEEDED_CANDIDATE_COUNT = 2
const SUMMARY_KEYS = ["appliedAt", "id", "name", "position", "stage"]

const candidateA = createTestCandidate({
  id: CANDIDATE_A_ID,
  name: "지원자A",
  stage: CANDIDATE_A_STAGE,
  position: "frontend",
})
const candidateB = createTestCandidate({
  id: CANDIDATE_B_ID,
  name: "지원자B",
  stage: "interview",
  position: "backend",
})

const server = createMswServer()

function arrange(failRate = FAIL_RATE_NEVER) {
  const storage = createMemoryStorage()
  persistCandidates(storage, [candidateA, candidateB])
  const db = createCandidateDb(storage)
  server.use(...createHandlers({ db, failRate, delay: DELAY_NONE }))
  return { storage }
}

function assertSummaryOnly(value: unknown) {
  expect(value).toEqual({
    id: expect.any(String),
    name: expect.any(String),
    position: expect.any(String),
    appliedAt: expect.any(String),
    stage: expect.any(String),
  })
  expect(value).not.toHaveProperty("email")
  expect(value).not.toHaveProperty("phone")
  expect(value).not.toHaveProperty("experienceYears")
  expect(value).not.toHaveProperty("education")
  if (typeof value !== "object" || value === null) {
    throw new Error("expected summary object")
  }
  expect(Object.keys(value).sort()).toEqual(SUMMARY_KEYS)
}

function assertDetail(value: unknown) {
  expect(value).toEqual({
    id: expect.any(String),
    name: expect.any(String),
    position: expect.any(String),
    appliedAt: expect.any(String),
    stage: expect.any(String),
    email: expect.any(String),
    phone: expect.any(String),
    experienceYears: expect.any(Number),
    education: expect.any(String),
  })
}

function readStoredCandidates(storage: ReturnType<typeof createMemoryStorage>) {
  const raw = storage.getItem(STORAGE_KEY)
  if (raw === null) {
    throw new Error("expected stored candidates")
  }
  const parsed: unknown = JSON.parse(raw)
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !("candidates" in parsed) ||
    !Array.isArray(parsed.candidates)
  ) {
    throw new Error("expected stored candidate list")
  }
  return parsed.candidates.map((candidate) =>
    candidateDetailSchema.parse(candidate)
  )
}

describe("handlers", () => {
  it("M1. GET 목록: 각 원소는 id, name, position, appliedAt, stage만. email 등 상세 필드 없음", async () => {
    arrange()

    const response = await fetch(API_PATHS.candidates)
    const body: unknown = await response.json()

    expect(response.status).toBe(HTTP_STATUS.OK)
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(SEEDED_CANDIDATE_COUNT)
    if (!Array.isArray(body)) {
      throw new Error("expected candidate list")
    }
    for (const item of body) {
      assertSummaryOnly(item)
    }
  })

  it("M2. GET 상세: 요약 필드 + email, phone, experienceYears, education", async () => {
    arrange()

    const response = await fetch(API_PATHS.candidate(CANDIDATE_A_ID))
    const body: unknown = await response.json()

    expect(response.status).toBe(HTTP_STATUS.OK)
    assertDetail(body)
    expect(body).toEqual(
      expect.objectContaining({
        id: candidateA.id,
        name: candidateA.name,
        position: candidateA.position,
        appliedAt: candidateA.appliedAt,
        stage: candidateA.stage,
        email: candidateA.email,
        phone: candidateA.phone,
        experienceYears: candidateA.experienceYears,
        education: candidateA.education,
      })
    )
  })

  it("M3. PATCH 성공: 응답이 변경된 상세이고, 이후 GET 목록/상세/저장소 모두 새 단계", async () => {
    const { storage } = arrange()

    const patchResponse = await fetch(
      API_PATHS.candidateStage(CANDIDATE_A_ID),
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: TARGET_STAGE }),
      }
    )
    const patchBody: unknown = await patchResponse.json()
    const patched = candidateDetailSchema.parse(patchBody)

    expect(patchResponse.status).toBe(HTTP_STATUS.OK)
    assertDetail(patchBody)
    expect(patched).toEqual({ ...candidateA, stage: TARGET_STAGE })

    const listResponse = await fetch(API_PATHS.candidates)
    const listBody: unknown = await listResponse.json()
    expect(listResponse.status).toBe(HTTP_STATUS.OK)
    if (!Array.isArray(listBody)) {
      throw new Error("expected candidate list")
    }
    const listedA = listBody.find(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        item.id === CANDIDATE_A_ID
    )
    expect(listedA).toEqual(expect.objectContaining({ stage: TARGET_STAGE }))
    assertSummaryOnly(listedA)

    const detailResponse = await fetch(API_PATHS.candidate(CANDIDATE_A_ID))
    const detailBody: unknown = await detailResponse.json()
    expect(detailResponse.status).toBe(HTTP_STATUS.OK)
    expect(detailBody).toEqual(expect.objectContaining({ stage: TARGET_STAGE }))

    const storedA = readStoredCandidates(storage).find(
      (candidate) => candidate.id === CANDIDATE_A_ID
    )
    expect(storedA?.stage).toBe(TARGET_STAGE)
  })

  it("M4. failRate:1 → 500 + { message: string }, 저장소 불변", async () => {
    const { storage } = arrange(FAIL_RATE_ALWAYS)
    const snapshot = storage.getItem(STORAGE_KEY)

    const response = await fetch(API_PATHS.candidateStage(CANDIDATE_A_ID), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: TARGET_STAGE }),
    })
    const body: unknown = await response.json()

    expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    expect(body).toEqual({ message: expect.any(String) })
    if (typeof body !== "object" || body === null || !("message" in body)) {
      throw new Error("expected error body")
    }
    expect(typeof body.message).toBe("string")
    expect(storage.getItem(STORAGE_KEY)).toBe(snapshot)
    const storedA = readStoredCandidates(storage).find(
      (candidate) => candidate.id === CANDIDATE_A_ID
    )
    expect(storedA?.stage).toBe(CANDIDATE_A_STAGE)
  })
})
