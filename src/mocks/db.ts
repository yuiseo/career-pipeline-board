import { z } from "zod"
import {
  candidateDetailSchema,
  type CandidateDetail,
  type Stage,
} from "@/types/candidate"
import { DEFAULT_SEED_COUNT, createSeedCandidates } from "./seed"

export const STORAGE_KEY = "career-pipeline-board:candidates"
/** 저장 데이터 구조가 바뀌면 올린다. 저장된 버전과 다르면 시드를 다시 생성한다. */
export const STORAGE_VERSION = 1

const storedDataSchema = z.object({
  version: z.literal(STORAGE_VERSION),
  candidates: z.array(candidateDetailSchema),
})
type StoredData = z.infer<typeof storedDataSchema>

export type CandidateStorage = Pick<Storage, "getItem" | "setItem">

export type CandidateDb = {
  getAll(): CandidateDetail[]
  getById(id: string): CandidateDetail | undefined
  updateStage(id: string, stage: Stage): CandidateDetail | undefined
  /** 저장 데이터를 시드로 다시 만든다. count를 0으로 주면 빈 데이터가 된다. */
  reset(count?: number): void
}

function readStoredCandidates(
  storage: CandidateStorage
): CandidateDetail[] | undefined {
  const raw = storage.getItem(STORAGE_KEY)
  if (raw === null) return undefined

  let json: unknown
  try {
    json = JSON.parse(raw)
  } catch {
    return undefined
  }

  // 버전이 다르거나 구조가 스키마와 맞지 않으면 시드를 다시 만든다.
  const result = storedDataSchema.safeParse(json)
  return result.success ? result.data.candidates : undefined
}

export function createCandidateDb(storage: CandidateStorage): CandidateDb {
  let candidates: CandidateDetail[] | undefined

  function save(next: CandidateDetail[]) {
    candidates = next
    const data: StoredData = { version: STORAGE_VERSION, candidates: next }
    storage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function load(): CandidateDetail[] {
    if (candidates) return candidates

    const stored = readStoredCandidates(storage)
    if (stored) {
      candidates = stored
      return stored
    }

    const seeded = createSeedCandidates()
    save(seeded)
    return seeded
  }

  return {
    getAll() {
      return load()
    },

    getById(id) {
      return load().find((candidate) => candidate.id === id)
    },

    updateStage(id, stage) {
      const current = load()
      const target = current.find((candidate) => candidate.id === id)
      if (!target) return undefined

      const updated = { ...target, stage }
      save(
        current.map((candidate) => (candidate.id === id ? updated : candidate))
      )
      return updated
    },

    reset(count = DEFAULT_SEED_COUNT) {
      save(createSeedCandidates(count))
    },
  }
}
