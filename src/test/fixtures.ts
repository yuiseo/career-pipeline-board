import { STORAGE_KEY, STORAGE_VERSION, type CandidateStorage } from "@/mocks/db"
import { candidateDetailSchema, type CandidateDetail } from "@/types/candidate"

const DEFAULT_TEST_CANDIDATE = {
  id: "candidate-test",
  name: "테스트지원자",
  position: "frontend",
  appliedAt: "2026-03-15",
  stage: "document",
  email: "test@example.com",
  phone: "010-1234-5678",
  experienceYears: 3,
  education: "학사",
} as const satisfies CandidateDetail

export function createTestCandidate(
  overrides: Partial<CandidateDetail> = {}
): CandidateDetail {
  return candidateDetailSchema.parse({
    ...DEFAULT_TEST_CANDIDATE,
    ...overrides,
  })
}

export function persistCandidates(
  storage: CandidateStorage,
  candidates: CandidateDetail[]
): void {
  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({ version: STORAGE_VERSION, candidates })
  )
}
